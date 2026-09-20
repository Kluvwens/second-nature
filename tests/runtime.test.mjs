import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { JSDOM, VirtualConsole } from 'jsdom';

const html = readFileSync(new URL('../dist/index.html', import.meta.url), 'utf8');
async function until(check) {
  for (let i = 0; i < 150; i++) {
    if (check()) return;
    await new Promise(resolve => setTimeout(resolve, 20));
  }
  throw new Error('Runtime did not reach the expected state');
}
async function launch() {
  const errors = [];
  const console = new VirtualConsole();
  console.on('jsdomError', error => errors.push(error.message));
  const dom = new JSDOM(html, {
    url: 'http://127.0.0.1:4173/', runScripts: 'dangerously', pretendToBeVisual: true, virtualConsole: console,
    beforeParse(window) {
      window.scrollTo = () => {};
      window.scroll = () => {};
      window.matchMedia = () => ({ matches: false, addListener() {}, removeListener() {} });
      window.alert = message => errors.push('Alert: ' + message);
    }
  });
  Object.defineProperty(dom.window.document.documentElement, 'clientWidth', { value: 1280, configurable: true });
  Object.defineProperty(dom.window.document.documentElement, 'clientHeight', { value: 900, configurable: true });
  try {
    await until(() => dom.window.SugarCube?.State?.passage === 'Start');
  } catch (error) {
    const detail = JSON.stringify({ errors, story: dom.window.document.querySelector('#story')?.textContent.slice(0, 2000) });
    dom.window.close();
    throw new Error(error.message + '\n' + detail);
  }
  return { dom, errors };
}
function checkRuntime(dom, errors) {
  assert.deepEqual(errors, []);
  assert.equal(dom.window.document.querySelectorAll('.error').length, 0,
    dom.window.document.querySelector('.error')?.textContent);
}
async function click(dom, text, destination) {
  const anchor = [...dom.window.document.querySelectorAll('a, button')].find(a => a.textContent.trim() === text);
  assert.ok(anchor, 'Link not rendered: ' + text);
  anchor.click();
  await until(() => dom.window.SugarCube.State.passage === destination && dom.window.document.querySelector('#passages .passage')?.dataset.passage === destination);
}

async function resumeMorning(dom, honey = true, encounter = null) {
  const sc = dom.window.SugarCube;
  const state = sc.setup.game.initialState();
  // A serialized 0.4 save at MorningRules has no arc object.
  const events = honey ? ['taste','spreadHoney','becomeHoney','curious','tellNadia','clockOut','wakeMorning','learnSpecials'] : ['decline','clockOut','wakeMorning','learnSpecials'];
  events.forEach(event => sc.setup.game.choose(state, event));
  sc.State.variables.run = dom.window.JSON.parse(JSON.stringify(state));
  sc.Engine.play('MorningRules');
  await until(() => sc.State.passage === 'MorningRules');
  await click(dom, 'Begin the next shift', 'OtherShift');
  // An isolated fixture for each saved encounter; the full campaign below uses the authored progression.
  if (encounter) sc.State.variables.run.arc.visit.encounter = encounter;
}

const otherRoutes = [
  {form:'robot', prefix:'Robot', pick:'Try the drink Theo brought over', settle:'Try speaking in your new voice', approach:['Explore the precision on your own terms','Keep your own words and rhythm'], work:['Take twelve orders, with a break','Keep it to four orders'], end:'Set down the last towel'},
  {form:'cup', prefix:'Cup', pick:'Taste what Len sent over', settle:'Call to Theo from the towel', approach:['Let Theo handle the first session','Meet a few regulars who know the menu'], work:['Continue through twelve tea servings','Finish after four tea servings'], end:'Ask for a quiet place on the table'},
  {form:'espresso', prefix:'Espresso', pick:"Try Inez's old house recipe", settle:'Tell them you can still hear everything', approach:['Control the pressure and timing yourself','Ask Theo to talk through each cycle'], work:['Work the twelve-order rush, with a pause','Stop the session after four orders'], end:'Close the valves and end the session'},
  {form:'moth', prefix:'Moth', pick:'Take a sip beside the little paper moth', settle:'Unfold your wings one crease at a time', approach:['Try carrying notes across the room','Stay at the desk and make your own marks'], work:['Complete twelve small tasks, with a rest','Finish four tasks and fold your wings'], end:'Rest on the open notebook'},
  {form:'shadow', prefix:'Shadow', pick:'Lift the dark cup into the lamplight', settle:'Speak through the brick beneath you', approach:['Try a shadow display beside the menu','Help from the quiet side of the counter'], work:['Try twelve tasks, with the lamp kept steady','Finish four tasks and return to the wall'], end:'Return to the quiet patch beside the till'}
];

test('Every body experiment renders both answers, survives reload and returns to the work choices', async () => {
  const { dom, errors } = await launch();
  try {
    const sc = dom.window.SugarCube;
    const backLabels = ['Decide how to use these hands', 'Talk through the first session', 'Talk through the first shot', 'Decide what to try at the desk', 'Find your place beside the counter'];
    const details = { robot: ['No pulse.', 'Being inefficient.'], cup: ['Too fast.', 'Empty first.'],
      espresso: ['Front only.', 'One last drop'], moth: ['Better?', 'a fraction'], shadow: ['Do you want it closer?', 'mortar line'] };
    for (const [i, route] of otherRoutes.entries()) {
      for (const [answer, label] of ['Try something your old body knew', 'Pay attention to what you can feel now'].entries()) {
        await resumeMorning(dom, true, route.form);
        for (const [text, passage] of [['Go help Theo at the counter', 'OtherMenu'], [route.pick, route.prefix + 'Change'],
          [route.settle, route.prefix + 'Body'], ['Take a minute before working', 'BodyCheck']]) await click(dom, text, passage);
        const art = ['robot', 'moth', 'shadow'].includes(route.form) ? route.form + '-study.png' : route.form + '-sequence.png';
        assert.equal(dom.window.document.querySelector('.scene-art img').getAttribute('src'), 'assets/' + art);
        sc.Save.browser.slot.save(2, 'Before body experiment');
        await sc.Save.browser.slot.load(2); sc.Engine.show();
        assert.equal(sc.State.passage, 'BodyCheck');
        const count = sc.State.variables.run.journal.length;
        await click(dom, label, 'BodyCheckResult');
        assert.ok(dom.window.document.querySelector('#passages').textContent.includes(details[route.form][answer]));
        sc.Save.browser.slot.save(2, 'After body experiment');
        await sc.Save.browser.slot.load(2); sc.Engine.show();
        assert.equal(sc.State.variables.run.journal.length, count + 1);
        assert.equal(sc.State.variables.run.arc.visit.reflection, answer === 0 ? 'habit' : 'sense');
        await click(dom, 'View illustration', 'BodyCheckResult');
        assert.ok(dom.window.document.querySelector('.art-original').href.endsWith(art));
        sc.Dialog.close();
        await click(dom, backLabels[i], route.prefix + 'Body');
        assert.equal(dom.window.document.querySelectorAll('#passages .choices .choice').length, 2);
        await click(dom, route.approach[answer], route.prefix + 'Work');
        if (route.form === 'shadow' || (route.form === 'moth' && answer === 1)) {
          assert.ok(dom.window.document.querySelector('.scene-art img').src.endsWith(route.form + '-study.png'));
        }
        checkRuntime(dom, errors);
      }
    }
  } finally { dom.window.close(); }
});

test('Scene illustrations respect visits, recovery and older saved discoveries without writing state', async () => {
  const { dom, errors } = await launch();
  try {
    const sc = dom.window.SugarCube;
    for (const form of ['cup', 'shadow']) {
      for (const friend of ['privateNotes', 'inviteNadia']) {
        const s = sc.setup.game.initialState();
        ['startOtherMenu', 'choose' + form[0].toUpperCase() + form.slice(1), 'settleSpecial', 'serviceShort', friend].forEach(e => sc.setup.game.choose(s, e));
        sc.State.variables.run = s; sc.Engine.play('OtherFriend');
        await until(() => dom.window.document.querySelector('#passages').textContent.includes(friend === 'inviteNadia' ? 'Did you want this?' : 'Three headings:'));
        const before = JSON.stringify(sc.State.variables.run);
        await until(() => dom.window.document.querySelectorAll('#passages .passage').length === 1);
        const path = dom.window.document.querySelector('.scene-art img').getAttribute('src');
        assert.equal(path.endsWith(form + '-nadia.png'), friend === 'inviteNadia', form + '/' + friend + ': ' + path);
        const retained = sc.setup.extraFormArt(sc.State.variables.run, form);
        assert.equal(retained.some(a => a[0] === form + '-nadia.png'), friend === 'inviteNadia');
        assert.equal(JSON.stringify(sc.State.variables.run), before);
        checkRuntime(dom, errors);
      }
    }
    const s = sc.setup.game.initialState();
    ['startOtherMenu', 'chooseEspresso', 'settleSpecial', 'serviceShort'].forEach(e => sc.setup.game.choose(s, e));
    assert.equal(sc.setup.extraFormArt(s, 'espresso').length, 0);
    sc.setup.game.choose(s, 'payOtherShift');
    delete s.arc.restArt; // v0.8 save at the same passage
    sc.State.variables.run = s; sc.Engine.play('OtherEvening');
    await until(() => dom.window.document.querySelector('.scene-art img')?.src.endsWith('espresso-night.png'));
    const before = JSON.stringify(sc.State.variables.run);
    assert.ok(sc.setup.extraFormArt(sc.State.variables.run, 'espresso')[0][0] === 'espresso-night.png');
    assert.equal(JSON.stringify(sc.State.variables.run), before);
    assert.ok(dom.window.document.querySelector('.scene-art img').src.endsWith('espresso-night.png'));
    sc.setup.game.choose(sc.State.variables.run, 'wakeOtherMorning'); sc.Engine.play('OtherMorning');
    await until(() => dom.window.document.querySelector('#passages .passage')?.dataset.passage === 'OtherMorning');
    assert.ok(dom.window.document.querySelector('.scene-art img').src.endsWith('morning-human.png'), 'First-dose recovery shows human art');
    sc.setup.game.choose(sc.State.variables.run, 'observeRecovery');
    sc.setup.game.choose(sc.State.variables.run, 'nextOtherShift');
    assert.ok(sc.setup.extraFormArt(sc.State.variables.run, 'espresso')[0][0] === 'espresso-night.png', 'Legacy recovered history retains the night illustration');
    checkRuntime(dom, errors);
  } finally { dom.window.close(); }
});

test('Compiled chapter plays all five new forms, preserves discovered art and finishes both endings', async () => {
  const {dom, errors} = await launch();
  try {
    await resumeMorning(dom);
    const sc = dom.window.SugarCube;
    for (const [index, route] of otherRoutes.entries()) {
      const steps = [
        ['Go help Theo at the counter','OtherMenu'], [route.pick,route.prefix+'Change'],
        [route.settle,route.prefix+'Body'], [route.approach[index % 2],route.prefix+'Work'],
        [route.work[0],route.prefix+'Result'], [route.end,'OtherAfterWork'],
        ['Ask Nadia to come and see you','OtherFriend'], ['Finish the shift and collect your pay','OtherEvening'],
        ['Rest until morning','OtherMorning']
      ];
      for (const [label,destination] of steps) {
        await click(dom,label,destination); checkRuntime(dom,errors);
        if (destination === 'OtherMenu') {
          assert.equal(dom.window.document.querySelectorAll('#passages .choices .choice').length, 2);
          assert.equal(sc.setup.game.encounter(sc.State.variables.run), route.form);
          const labels = [...dom.window.document.querySelectorAll('#passages .choices a')].map(a => a.textContent).join(' ');
          assert.doesNotMatch(labels, /robot|espresso machine|living shadow|paper moth.*·/i);
        }
        if (destination === 'OtherFriend') {
          assert.match(dom.window.document.querySelector('#passages').textContent, /question|hands|voice|shaken|frightened/);
          assert.equal(sc.State.variables.run.arc.visit.nadiaRepeat, false);
          assert.equal(sc.State.variables.run.arc.nadiaSeen[route.form], true);
        }
        if (destination.endsWith('Change')) {
          assert.equal(sc.State.variables.run.form,route.form+'-changing');
          assert.ok(dom.window.document.querySelector(`.scene-art img[src="assets/${route.form}-sequence.png"]`));
          await click(dom, 'View illustration', destination);
          assert.ok(dom.window.document.querySelector('#ui-dialog-body img.expanded-art'));
          assert.ok(dom.window.document.querySelector('#ui-dialog-body a.art-original').href.endsWith(route.form+'-sequence.png'));
          sc.Dialog.close();
        }
        if (destination.endsWith('Work') && ['robot','cup','espresso'].includes(route.form)) {
          assert.ok(dom.window.document.querySelector(`.scene-art img[src="assets/${route.form}-service.png"]`));
        }
      }
      assert.equal(sc.State.variables.run.form,route.form);
      assert.equal(sc.State.variables.run.arc.visit.lingering,true);
      await click(dom,'Mara','OtherMorning');
      assert.match(dom.window.document.querySelector('.appearance-note').textContent, new RegExp(sc.setup.game.forms[route.form].drink.toUpperCase()));
      await click(dom,'Other-menu illustrations','OtherMorning');
      checkRuntime(dom,errors);
      assert.equal(dom.window.document.querySelectorAll('#ui-dialog-body .story-illustration').length,[3, 6, 9, 11, 14][index]);
      sc.Dialog.close();
      sc.Save.browser.slot.save(3,'New form: '+route.form);
      sc.State.variables.run.form = 'human';
      await sc.Save.browser.slot.load(3); sc.Engine.show();
      assert.equal(sc.State.variables.run.form, route.form);
      await click(dom,'Record what happens as it wears off','OtherRecovery');
      checkRuntime(dom, errors);
      assert.equal(sc.State.variables.run.form,'human');
      if (index < 4) await click(dom,'Return for the next scheduled shift','OtherShift');
    }
    assert.equal(sc.State.variables.run.arc.completed,5);
    assert.equal(sc.State.variables.run.cash,600);
    await click(dom,'Talk about what happens next','OtherDecision');
    sc.Save.browser.slot.save(4,'Ending fork');
    await click(dom,'Stay, with the written terms','OtherEnding');
    assert.match(dom.window.document.querySelector('#passages').textContent,/Your name on the rota/);
    checkRuntime(dom,errors);
    await sc.Save.browser.slot.load(4); sc.Engine.show();
    await click(dom,"Take Nadia's spare room and leave",'OtherEnding');
    assert.match(dom.window.document.querySelector('#passages').textContent,/A different door/);
    await click(dom,'Review discovered forms','OtherEnding');
    assert.equal(dom.window.document.querySelectorAll('#ui-dialog-body .story-illustration').length,14);
    checkRuntime(dom,errors);
    for (let i = 0; i < 14; i++) {
      const figure = dom.window.document.querySelectorAll('#ui-dialog-body .story-illustration')[i];
      const expected = figure.querySelector('img').getAttribute('src');
      figure.querySelector('a').click();
      assert.equal(dom.window.document.querySelector('#ui-dialog-body img.expanded-art').getAttribute('src'), expected, 'Gallery links must retain each loop item, not the final form');
      assert.ok(dom.window.document.querySelector('#ui-dialog-body a.art-original').href.endsWith(expected));
      sc.Dialog.close();
      await click(dom,'Review discovered forms','OtherEnding');
    }
  } finally { dom.window.close(); }
});

test('Compiled new routes support short sessions, both approach branches, privacy and first-dose recovery', async () => {
  const {dom, errors} = await launch();
  try {
    const sc = dom.window.SugarCube;
    for (const [index, route] of otherRoutes.entries()) {
      await resumeMorning(dom, false, route.form);
      for (const [label,destination] of [
        ['Stay with Inez and the morning book','OtherMenu'], [route.pick,route.prefix+'Change'],
        [route.settle,route.prefix+'Body'], [route.approach[1 - index % 2],route.prefix+'Work'],
        [route.work[1],route.prefix+'Result'], [route.end,'OtherAfterWork'],
        ['Keep this afternoon for your own notes','OtherFriend'], ['Finish the shift and collect your pay','OtherEvening'],
        ['Rest until morning','OtherMorning'], ['Record what happens as it wears off','OtherRecovery']
      ]) { await click(dom,label,destination); checkRuntime(dom,errors); }
      assert.equal(sc.State.variables.run.arc.visit.durationHours,18);
      assert.equal(sc.State.variables.run.arc.visit.lingering,false);
      assert.equal(sc.State.variables.run.toldNadia,false);
      assert.equal(sc.State.variables.run.arc.visit.jobs,4);
    }
    for (const choice of ['Help Theo prepare the recovery corner','Ask Inez to explain the old ledger']) {
      await resumeMorning(dom,false);
      for (const [label,destination] of [
        ['Go help Theo at the counter','OtherMenu'], ['Stay with your ordinary coffee','OrdinaryOther'],
        [choice,'OrdinaryDebrief'], ['Spend a little time alone','OtherFriend'],
        ['Finish the shift and collect your pay','OtherEvening'], ['Rest until morning','OtherMorning'],
        ['Record what happens as it wears off','OtherRecovery']
      ]) { await click(dom,label,destination); checkRuntime(dom,errors); }
      assert.equal(sc.State.variables.run.arc.exposures,0);
      assert.equal(sc.State.variables.run.arc.history.length,0);
    }
  } finally { dom.window.close(); }
});

test('Old menu saves become one contextual encounter; Nadia repeat and ordinary visits have distinct reactions', async () => {
  const {dom, errors} = await launch();
  try {
    await resumeMorning(dom, false);
    const sc = dom.window.SugarCube;
    const v = sc.State.variables.run.arc.visit;
    delete v.encounter; // Legacy 0.5 menu save.
    v.number = 2;
    sc.State.variables.run.arc.discoveries.espresso = true;
    sc.Engine.play('OtherMenu');
    await until(() => dom.window.document.querySelectorAll('#passages .passage').length === 1 && dom.window.document.querySelector('#passages .passage')?.dataset.passage === 'OtherMenu');
    checkRuntime(dom, errors);
    assert.match(dom.window.document.querySelector('#passages').textContent, /Len's quiet corner/);
    assert.equal(dom.window.document.querySelectorAll('#passages .choices .choice').length, 2);
    assert.equal(sc.State.variables.run.arc.visit.encounter, undefined, 'Rendering an old save must not mutate it');
    await click(dom, 'Taste what Len sent over', 'CupChange');
    sc.setup.game.choose(sc.State.variables.run, 'settleSpecial');
    sc.setup.game.choose(sc.State.variables.run, 'inviteNadia');
    sc.Engine.play('OtherFriend');
    await until(() => dom.window.document.querySelectorAll('#passages .passage').length === 1 && dom.window.document.querySelector('#passages .passage')?.dataset.passage === 'OtherFriend');
    checkRuntime(dom, errors);
    assert.match(dom.window.document.querySelector('#passages').textContent, /Where's the rest of you/);
    sc.State.variables.run.arc.visit.nadiaRepeat = true;
    sc.Engine.show();
    await until(() => dom.window.document.querySelectorAll('#passages .passage').length === 1);
    checkRuntime(dom, errors);
    assert.match(dom.window.document.querySelector('#passages').textContent, /Seeing it twice doesn't make it ordinary/);
    assert.doesNotMatch(dom.window.document.querySelector('#passages').textContent, /Where's the rest of you/);
    sc.State.variables.run.arc.visit.form = 'human'; sc.State.variables.run.form = 'human'; sc.State.variables.run.changed = false;
    sc.Engine.show();
    await until(() => dom.window.document.querySelectorAll('#passages .passage').length === 1);
    checkRuntime(dom, errors);
    assert.match(dom.window.document.querySelector('#passages').textContent, /conversation begin with lunch/);
    assert.doesNotMatch(dom.window.document.querySelector('#passages').textContent, /Seeing it twice|Did you want this/);
  } finally { dom.window.close(); }
});

test('All six evening stories support both answers, saved progress, art, and next-shift callbacks', async () => {
  const { dom, errors } = await launch();
  try {
    const sc = dom.window.SugarCube;
    const routes = [
      { person:'nadia', invite:'Meet Nadia outside the cinema', event:'eveningNadia', passage:'NadiaEvening', art:'nadia-walk.png', choices:[['Tell her what\'s been on your mind','Ask for an evening without cafe talk'],['Stay and listen to her','Take her inside for the terrible film']], answers:[['nadiaHonest','nadiaOrdinary'],['nadiaListen','nadiaFilm']], callbacks:[[/Call me even if you don't know where to start/,/Still six legs/],[/organized about it/,/seven legs/]] },
      { person:'theo', invite:'Keep Theo company after closing', event:'eveningTheo', passage:'TheoEvening', art:'theo-radio.png', choices:[['Ask what he liked about it','Ask why he came back the next day'],['Encourage him to ask Inez directly','Offer to check the figures with him']], answers:[['theoRadio','theoReturn'],['theoAsk','theoNumbers']], callbacks:[[/I charge now/,/Sleep all right/],[/An hour/,/corrected copy/]] },
      { person:'inez', invite:'Knock on Inez\'s office door', event:'eveningInez', passage:'InezEvening', art:'inez-bea.png', choices:[['Ask Bea what it feels like','Ask Inez where the recipes came from'],['Ask about her first change','Ask her to show you the ordinary accounts']], answers:[['beaFeeling','inezRecipes'],['inezPast','inezAccounts']], callbacks:[[/umbrella pot/,/measurements disagree/],[/before breakfast/,/supplier fee/]] }
    ];
    const finishDay = () => ['ordinaryShift','ordinaryCare','privateNotes','payOtherShift','wakeOtherMorning','observeRecovery'].forEach(e => sc.setup.game.choose(sc.State.variables.run,e));
    for (const route of routes) for (let chapter = 0; chapter < 2; chapter++) for (let branch = 0; branch < 2; branch++) {
      await resumeMorning(dom, branch === 0);
      if (chapter) {
        finishDay();
        sc.setup.game.choose(sc.State.variables.run, route.event);
        sc.setup.game.choose(sc.State.variables.run, route.answers[0][branch]);
        sc.setup.game.choose(sc.State.variables.run, 'nextOtherShift');
      }
      finishDay();
      sc.Engine.play('OtherRecovery');
      await until(() => dom.window.document.querySelector('#passages .passage')?.dataset.passage === 'OtherRecovery');
      const cash = sc.State.variables.run.cash;
      await click(dom, 'Make plans for the evening', 'AfterHours');
      await click(dom, route.invite, route.passage); checkRuntime(dom, errors);
      assert.equal(sc.State.variables.run.arc.visit.outing.chapter, chapter + 1);
      assert.ok(dom.window.document.querySelector('.scene-art img').src.endsWith(route.art));
      await click(dom, route.choices[chapter][branch], 'EveningReply'); checkRuntime(dom, errors);
      assert.equal(sc.State.variables.run.arc.visit.outing.answer, route.answers[chapter][branch]);
      assert.equal(sc.State.variables.run.cash, cash);
      const noteCount = sc.State.variables.run.journal.length;
      sc.Save.browser.slot.save(4, 'Evening');
      await sc.Save.browser.slot.load(4); sc.Engine.show();
      assert.equal(sc.State.variables.run.journal.length, noteCount);
      assert.equal(sc.State.variables.run.arc.visit.outing.answer, route.answers[chapter][branch]);
      await click(dom, 'People', 'EveningReply'); checkRuntime(dom, errors);
      assert.ok(dom.window.document.querySelector('.evening-memories').textContent.includes(sc.setup.game.eveningAnswers[route.answers[chapter][branch]].memory));
      sc.Dialog.close();
      await click(dom, 'Notebook', 'EveningReply');
      await click(dom, 'After-hours illustrations', 'EveningReply'); checkRuntime(dom, errors);
      assert.equal(dom.window.document.querySelectorAll('#ui-dialog-body .story-illustration').length, 1, 'Only the discovered companion image is unlocked');
      await click(dom, 'View illustration', 'EveningReply');
      assert.ok(dom.window.document.querySelector('.art-original').href.endsWith(route.art));
      sc.Dialog.close();
      await click(dom, 'Return for the next scheduled shift', 'OtherShift'); checkRuntime(dom, errors);
      assert.match(dom.window.document.querySelector('#passages').textContent, route.callbacks[chapter][branch]);
      assert.equal(sc.State.variables.run.arc.visit.outing, undefined, 'A new visit starts without an outing');
    }
  } finally { dom.window.close(); }
});

test('Ordinary recovery saves can open evenings without invented transformation memories or render-time mutations', async () => {
  const { dom, errors } = await launch();
  try {
    await resumeMorning(dom, false);
    const sc = dom.window.SugarCube;
    for (const e of ['ordinaryShift','ordinaryCare','privateNotes','payOtherShift','wakeOtherMorning','observeRecovery']) sc.setup.game.choose(sc.State.variables.run,e);
    const before = JSON.stringify(sc.State.variables.run);
    sc.Engine.play('OtherRecovery');
    await until(() => dom.window.document.querySelector('#passages .passage')?.dataset.passage === 'OtherRecovery');
    await click(dom,'Make plans for the evening','AfterHours'); checkRuntime(dom,errors);
    assert.equal(JSON.stringify(sc.State.variables.run),before);
    await click(dom,'Meet Nadia outside the cinema','NadiaEvening');
    assert.doesNotMatch(dom.window.document.querySelector('#passages').textContent,/Are they all right/);
    await click(dom,"Tell her what's been on your mind",'EveningReply');
    assert.match(dom.window.document.querySelector('#passages').textContent,/cups you keep turning down/);
    assert.equal(sc.State.variables.run.arc.nadiaSeen,undefined);
    assert.equal(sc.State.variables.run.arc.exposures,0);
    assert.equal(sc.State.variables.run.form,'human'); checkRuntime(dom,errors);
  } finally { dom.window.close(); }
});

test('Compiled SugarCube runs Golden Hour, comparison, notebook, save/load and closing', async () => {
  const { dom, errors } = await launch();
  try {
    const path = [
      ['Step inside with your bags','Arrival'], ['Carry your bags upstairs','Apartment'],
      ['Leave your blue mug on the desk','OrderOne'],
      ['Pull a double shot, then add hot water','AfterOne'],
      ['Ask him to walk you through it','OrderTwo'],
      ['Use the decaf hopper and oat milk','Break'],
      ['Try a cup of Golden Hour','FirstChange'],
      ['Follow the warmth toward the mirror','HoneyFace'],
      ['Hold the counter as the change finishes','HoneyBody'],
      ['Admit that liking it frightens you','HoldShape'],
      ['Experiment with your new flexibility','Theo'],
      ['Tell him what you are actually thinking','OrderThree'],
      ['Serve the honey in a little pot','AfterThree'],
      ['Wave her over','Nadia'], ['Tell her about the special','NadiaReply'],
      ['Clock out and head upstairs','Closing']
    ];
    for (const [label, destination] of path) {
      await click(dom, label, destination); checkRuntime(dom, errors);
      if (destination === 'Apartment') assert.ok(dom.window.document.querySelector('#passages img[src="assets/apartment-arrival.png"]'));
      if (destination === 'FirstChange') {
        assert.equal(dom.window.SugarCube.State.variables.run.form, 'softening');
        assert.equal(dom.window.SugarCube.State.variables.run.changed, false);
        await click(dom, 'Mara', 'FirstChange');
        await click(dom, 'Transformation images', 'FirstChange');
        assert.equal(dom.window.document.querySelectorAll('#ui-dialog-body .story-illustration').length, 1);
        dom.window.SugarCube.Dialog.close();
        await click(dom, 'View illustration', 'FirstChange');
        assert.ok(dom.window.document.querySelector('#ui-dialog-body img.expanded-art[src="assets/honey-onset.png"]'));
        assert.ok(dom.window.document.querySelector('#ui-dialog-body a.art-original[target="_blank"]'));
        dom.window.SugarCube.Dialog.close();
      }
      if (destination === 'HoneyFace') assert.ok(dom.window.document.querySelector('#passages img[src="assets/honey-spreading.png"]'));
      if (destination === 'HoneyBody') assert.ok(dom.window.document.querySelector('#passages img[src="assets/honey-settled.png"]'));
      if (destination === 'Nadia') assert.ok(dom.window.document.querySelector('#passages img[src="assets/nadia-honey.png"]'));
    }
    const sc = dom.window.SugarCube;
    assert.equal(sc.State.variables.run.cash, 137);
    assert.equal(sc.State.variables.run.form, 'honey');
    assert.equal(sc.State.variables.run.formControl, 'fluid');
    assert.match(dom.window.document.querySelector('#passages').textContent, /chipped blue mug waits/);
    assert.ok(dom.window.document.querySelector('.scene-art img[src="assets/apartment-honey-evening.png"]'));
    await click(dom, 'Mara', 'Closing');
    assert.ok(dom.window.document.querySelector('.character-panel .changed'));
    await click(dom, 'Compare with this morning', 'Closing');
    assert.equal(dom.window.document.querySelectorAll('#ui-dialog-body .mara-portrait').length, 2);
    sc.Dialog.close();
    await click(dom, 'Mara', 'Closing');
    await click(dom, 'Transformation images', 'Closing');
    assert.equal(dom.window.document.querySelectorAll('#ui-dialog-body .story-illustration').length, 3);
    sc.Dialog.close();
    await click(dom, 'Notebook', 'Closing');
    assert.match(dom.window.document.querySelector('#ui-dialog-body').textContent, /First shift, paid/);
    sc.Dialog.close();
    await click(dom, 'People', 'Closing');
    assert.match(dom.window.document.querySelector('#ui-dialog-body').textContent, /Trusted with the strange part/);
    sc.Dialog.close();
    await click(dom, 'Save / Load', 'Closing');
    assert.ok(sc.Dialog.isOpen());
    checkRuntime(dom, errors);
    sc.Dialog.close();
    sc.Save.browser.slot.save(0, 'Runtime test');
    sc.State.variables.run.cash = 999;
    await sc.Save.browser.slot.load(0);
    sc.Engine.show();
    assert.equal(sc.State.variables.run.cash, 137);
    assert.equal(sc.State.variables.run.changed, true);
    assert.equal(sc.State.variables.run.toldNadia, true);
    assert.ok(sc.Save.browser.auto.size > 0);
    checkRuntime(dom, errors);
    await click(dom, 'Try to sleep', 'Morning');
    assert.equal(sc.State.variables.run.day, 2);
    assert.equal(sc.State.variables.run.changed, false);
    assert.equal(sc.State.variables.run.form, 'human');
    assert.equal(sc.State.variables.run.cash, 137);
    assert.ok(dom.window.document.querySelector('.scene-art img[src="assets/morning-human.png"]'));
    assert.match(dom.window.document.querySelector('#passages').textContent, /First cup wore off overnight/);
    await click(dom, 'Mara', 'Morning');
    assert.ok(dom.window.document.querySelector('.character-panel .baseline'));
    await click(dom, 'Transformation images', 'Morning');
    assert.equal(dom.window.document.querySelectorAll('#ui-dialog-body .story-illustration').length, 4);
    sc.Dialog.close();
    await click(dom, 'Mara', 'Morning');
    await click(dom, 'Compare your two forms', 'Morning');
    assert.match(dom.window.document.querySelector('#ui-dialog-body').textContent, /You are human again/);
    sc.Dialog.close();
    await click(dom, 'Go downstairs with your questions', 'MorningRules');
    assert.match(dom.window.document.querySelector('#passages').textContent, /change starts lasting longer/);
    sc.Save.browser.slot.save(1, 'Morning test');
    sc.State.variables.run.form = 'honey'; sc.State.variables.run.day = 99;
    await sc.Save.browser.slot.load(1); sc.Engine.show();
    assert.equal(sc.State.variables.run.day, 2);
    assert.equal(sc.State.variables.run.form, 'human');
    assert.equal(sc.State.variables.run.flags.transformed, 'becomeHoney');
    assert.match(dom.window.document.querySelector('.statusbar').textContent, /DAY 02/);
    checkRuntime(dom, errors);
  } finally { dom.window.close(); }
});

test('Compiled SugarCube completes the ordinary-coffee path with mistakes and privacy', async () => {
  const { dom, errors } = await launch();
  try {
    for (const [label, destination] of [
      ['Step inside with your bags','Arrival'], ['Carry your bags upstairs','Apartment'],
      ['Put the mug away and leave both bags packed','OrderOne'],
      ['Add steamed milk to soften the espresso','AfterOne'],
      ['Try the next ticket on your own','OrderTwo'],
      ['Use the house espresso and oat milk','Break'],
      ['Take the ordinary coffee','Ordinary'],
      ['Ask Theo about the specials','Theo'],
      ['Keep it practical: you need to finish your shift','OrderThree'],
      ['Stir the honey into the tea','AfterThree'], ['Wave her over','Nadia'],
      ['Ask to talk about the apartment first','NadiaReply'],
      ['Clock out and head upstairs','Closing']
    ]) {
      await click(dom, label, destination); checkRuntime(dom, errors);
      if (destination === 'Nadia') assert.ok(dom.window.document.querySelector('#passages img[src="assets/nadia-human.png"]'));
    }
    const state = dom.window.SugarCube.State.variables.run;
    assert.equal(state.cash, 130);
    assert.equal(state.changed, false);
    assert.equal(state.form, 'human');
    assert.equal(state.roomChoice, 'packed');
    assert.equal(state.orders, 3);
    assert.ok(dom.window.document.querySelector('.scene-art img[src="assets/apartment-arrival.png"]'));
    await click(dom, 'Mara', 'Closing');
    assert.ok(dom.window.document.querySelector('.character-panel .baseline'));
    assert.equal(dom.window.document.querySelector('.portrait-tools'), null);
    dom.window.SugarCube.Dialog.close();
    assert.match(dom.window.document.querySelector('#passages').textContent, /still a question/);
    await click(dom, 'Try to sleep', 'Morning');
    assert.equal(dom.window.SugarCube.State.variables.run.day, 2);
    assert.match(dom.window.document.querySelector('#passages').textContent, /There was nothing to wear off/);
    await click(dom, 'Mara', 'Morning');
    assert.equal(dom.window.document.querySelector('.portrait-tools'), null);
    dom.window.SugarCube.Dialog.close();
    await click(dom, 'Go downstairs with your questions', 'MorningRules');
    assert.doesNotMatch(dom.window.document.querySelector('#passages').textContent, /customer who asked/);
    checkRuntime(dom, errors);
  } finally { dom.window.close(); }
});
