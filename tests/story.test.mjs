import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { readFileSync, readdirSync } from 'node:fs';

const context = vm.createContext({ setup: {} });
vm.runInContext(readFileSync(new URL('../src/systems.js', import.meta.url), 'utf8'), context);
const game = context.setup.game;
const play = (events) => {
  const state = game.initialState();
  events.forEach(event => game.choose(state, event));
  return state;
};

test('Body experiments are optional, guarded and saved once without changing work or recovery', () => {
  for (const id of ['Robot', 'Cup', 'Espresso', 'Moth', 'Shadow']) {
    for (const event of ['reflectHabit', 'reflectSense']) {
      const s = play(['startOtherMenu', 'choose' + id]);
      assert.equal(game.choose(s, event), false, 'Cannot experiment before settling');
      game.choose(s, 'settleSpecial');
      const before = JSON.stringify(s);
      assert.equal(game.canReflect(s), true);
      assert.equal(JSON.stringify(s), before, 'Rendering availability is read-only');
      const journalLength = s.journal.length;
      const mechanics = state => JSON.stringify([state.cash, state.theo, state.inez, state.nadia, state.stress,
        state.arc.exposures, state.arc.visit.durationHours, state.arc.visit.recoveryAt, state.arc.visit.jobs]);
      const originalMechanics = mechanics(s);
      assert.equal(game.choose(s, event), true);
      assert.equal(s.arc.visit.reflection, event === 'reflectHabit' ? 'habit' : 'sense');
      const restored = JSON.parse(JSON.stringify(s));
      assert.equal(game.choose(restored, event), false);
      assert.equal(game.choose(restored, event === 'reflectHabit' ? 'reflectSense' : 'reflectHabit'), false);
      assert.equal(restored.journal.length, journalLength + 1);
      assert.equal(mechanics(restored), originalMechanics);
      assert.equal(game.canReflect(restored), false);
      game.choose(restored, 'serviceShort');
      game.choose(restored, 'payOtherShift');
      game.choose(restored, 'wakeOtherMorning');
      game.choose(restored, 'observeRecovery');
      game.choose(restored, 'nextOtherShift');
      game.choose(restored, 'choose' + id);
      game.choose(restored, 'settleSpecial');
      assert.equal(game.canReflect(restored), true, 'A later dose offers a fresh experiment');
    }
  }
  for (const events of [[], ['startOtherMenu'], ['startOtherMenu', 'ordinaryShift'],
    ['startOtherMenu', 'chooseRobot', 'settleSpecial', 'acceptPrecision'],
    ['startOtherMenu', 'chooseCup', 'settleSpecial', 'serviceShort']]) {
    const s = play(events), before = JSON.stringify(s);
    assert.equal(game.canReflect(s), false);
    assert.equal(game.choose(s, 'reflectHabit'), false);
    assert.equal(JSON.stringify(s), before);
  }
});

test('Golden Hour path pays correct wages, records change, and preserves disclosures', () => {
  const s = play(['welcome','unpackMug','firstCorrect','askTheo','secondCorrect','taste','spreadHoney','becomeHoney','curious','exploreForm','tellTheo','thirdCorrect','tellNadia','clockOut']);
  assert.equal(s.cash, 137);
  assert.equal(s.orders, 3);
  assert.equal(s.correct, 3);
  assert.equal(s.changed, true);
  assert.equal(s.form, 'honey');
  assert.equal(s.formControl, 'fluid');
  assert.equal(s.roomChoice, 'mug');
  assert.equal(s.reaction, 'curious');
  assert.equal(s.theo, 3);
  assert.equal(s.toldNadia, true);
  assert.ok(s.journal.some(e => e.title === 'Golden Hour — honey slime'));
});

test('Declining the special supports a complete shift with the same earnings', () => {
  const s = play(['welcome','keepPacked','firstCorrect','solo','secondCorrect','decline','deflectTheo','thirdCorrect','hideNadia','clockOut']);
  assert.equal(s.cash, 137);
  assert.equal(s.drink, 'ordinary');
  assert.equal(s.changed, false);
  assert.equal(s.form, 'human');
  assert.equal(s.roomChoice, 'packed');
  assert.equal(s.reaction, null);
  assert.equal(s.toldTheo, false);
  assert.ok(!s.journal.some(e => e.title === 'Golden Hour — honey slime'));
});

test('Mistakes affect tips and stress but do not block completing the shift', () => {
  const s = play(['firstWrong','solo','secondWrong','decline','thirdWrong','clockOut']);
  assert.equal(s.cash, 130);
  assert.equal(s.tips, 0);
  assert.equal(s.orders, 3);
  assert.equal(s.correct, 0);
  assert.equal(s.stress, 5);
});

test('Revisiting choices and deserializing a save cannot double-pay or apply both drink branches', () => {
  const s = play(['firstCorrect','firstWrong','taste','decline','clockOut']);
  assert.equal(s.orders, 1);
  assert.equal(s.tips, 2);
  assert.equal(s.drink, 'golden');
  const loaded = JSON.parse(JSON.stringify(s));
  assert.equal(game.choose(loaded, 'clockOut'), false);
  assert.equal(loaded.cash, 132);
  assert.equal(loaded.journal.filter(e => e.title === 'First shift, paid').length, 1);
});

test('Every authored choice points to a real passage and valid consequence', () => {
  const directory = new URL('../src/story/', import.meta.url);
  const source = readdirSync(directory).filter(n => n.endsWith('.twee')).map(n => readFileSync(new URL(n, directory), 'utf8')).join('\n');
  const names = [...source.matchAll(/^:: ([^\n\[]+)/gm)].map(m => m[1].trim());
  assert.equal(new Set(names).size, names.length, 'Duplicate passages');
  const choices = [...source.matchAll(/<<snChoice "[^"]+" "([^"]+)" "([^"]*)"/g)];
  assert.ok(choices.length >= 20);
  for (const [, target, event] of choices) {
    assert.ok(names.includes(target), `Missing passage: ${target}`);
    if (event) assert.doesNotThrow(() => game.choose(game.initialState(), event), event);
  }
});

test('Transformation stages unlock in order, with stable save data between stages', () => {
  const s = play(['taste']);
  assert.equal(s.form, 'softening');
  assert.equal(s.changed, false);
  game.choose(s, 'spreadHoney');
  const loaded = JSON.parse(JSON.stringify(s));
  assert.equal(loaded.form, 'spreading');
  assert.equal(loaded.changed, false);
  game.choose(loaded, 'becomeHoney');
  game.choose(loaded, 'steadyForm');
  game.choose(loaded, 'exploreForm');
  assert.equal(loaded.form, 'honey');
  assert.equal(loaded.formControl, 'steady');
  assert.equal(loaded.journal.filter(e => e.title === 'Golden Hour — honey slime').length, 1);
});

test('The first special wears off overnight without erasing history or repeating earnings', () => {
  const s = play(['welcome','firstCorrect','secondCorrect','taste','spreadHoney','becomeHoney','curious','steadyForm','tellTheo','thirdCorrect','tellNadia','clockOut']);
  const before = {cash:s.cash, theo:s.theo, nadia:s.nadia, orders:s.orders};
  delete s.day; // A save from 0.2/0.3 has no day field.
  const loaded = JSON.parse(JSON.stringify(s));
  game.choose(loaded, 'wakeMorning');
  assert.equal(loaded.day, 2);
  assert.equal(loaded.form, 'human');
  assert.equal(loaded.changed, false);
  assert.equal(loaded.formControl, null);
  assert.equal(loaded.flags.transformed, 'becomeHoney');
  assert.equal(loaded.reaction, 'curious');
  assert.deepEqual({cash:loaded.cash,theo:loaded.theo,nadia:loaded.nadia,orders:loaded.orders}, before);
  assert.equal(game.choose(loaded, 'wakeMorning'), false);
  assert.equal(game.choose(loaded, 'clockOut'), false);
  assert.equal(loaded.journal.filter(e => e.title === 'Human again — 06:50').length, 1);
  assert.ok(loaded.journal.some(e => e.title === 'Golden Hour — honey slime'));
});

test('An ordinary morning does not invent a transformation or recovery', () => {
  const s = play(['decline','clockOut','wakeMorning','learnSpecials']);
  assert.equal(s.day, 2);
  assert.equal(s.form, 'human');
  assert.equal(s.flags.transformed, undefined);
  assert.ok(s.journal.some(e => e.title === 'An ordinary morning'));
  assert.ok(!s.journal.some(e => e.title === 'Human again — 06:50'));
  assert.equal(game.choose(s, 'learnSpecials'), false);
});

test('Five different specials remain playable in one campaign; repeated actions cannot duplicate pay or recovery', () => {
  let s = play(['taste', 'spreadHoney', 'becomeHoney', 'clockOut', 'wakeMorning', 'learnSpecials', 'startOtherMenu']);
  const baselineCash = s.cash;
  const selections = ['chooseRobot', 'chooseCup', 'chooseEspresso', 'chooseMoth', 'chooseShadow'];
  for (let i = 0; i < selections.length; i++) {
    game.choose(s, 'partnerTheo');
    game.choose(s, selections[i]);
    const exposure = s.arc.exposures;
    assert.equal(game.choose(s, 'ordinaryShift'), false);
    assert.equal(s.arc.exposures, exposure);
    game.choose(s, 'settleSpecial');
    assert.equal(s.changed, true);
    game.choose(s, 'serviceLong');
    assert.equal(game.choose(s, 'serviceShort'), false);
    game.choose(s, 'inviteNadia');
    game.choose(s, 'payOtherShift');
    assert.equal(game.choose(s, 'payOtherShift'), false);
    assert.equal(s.cash, baselineCash + (i + 1) * 94);
    game.choose(s, 'wakeOtherMorning');
    assert.equal(s.arc.visit.lingering, true);
    assert.equal(s.changed, true, 'Rest must not instantly cure a later special');
    assert.ok(s.arc.visit.recoveryAt > s.arc.visit.observedAt);
    s = JSON.parse(JSON.stringify(s));
    game.choose(s, 'observeRecovery');
    assert.equal(game.choose(s, 'observeRecovery'), false);
    assert.equal(s.changed, false);
    assert.equal(s.form, 'human');
    assert.equal(s.arc.history.length, i + 1);
    assert.equal(s.arc.completed, i + 1);
    if (i < 4) {
      assert.equal(game.choose(s, 'nextOtherShift'), true);
      assert.equal(game.choose(s, 'nextOtherShift'), false, 'Cannot skip a new shift');
    }
  }
  assert.deepEqual(Object.keys(s.arc.discoveries).sort(), ['cup','espresso','moth','robot','shadow']);
  assert.deepEqual(s.arc.history.map(v => v.hours), [26,27,28,29,30]);
  assert.equal(game.choose(s, 'nextOtherShift'), false, 'Trial period ends after five shifts');
  game.choose(s, 'leaveCafe');
  assert.equal(game.choose(s, 'stayCafe'), false);
  assert.equal(s.flags.arcEnding, 'leaveCafe');
  assert.equal(s.nadia, 7);
});

test('First new special after ordinary coffee fades before dawn; work preference does not control duration', () => {
  const make = mode => {
    const s = play(['decline','clockOut','wakeMorning','learnSpecials','startOtherMenu','chooseEspresso','settleSpecial',mode,'privateNotes','payOtherShift','wakeOtherMorning']);
    return s;
  };
  const long = make('serviceLong'), short = make('serviceShort');
  assert.equal(long.arc.visit.durationHours, 18);
  assert.equal(short.arc.visit.recoveryAt, long.arc.visit.recoveryAt);
  assert.equal(long.arc.visit.lingering, false);
  assert.equal(long.form, 'human');
  assert.equal(long.arc.visit.jobs, 12);
  assert.equal(short.arc.visit.jobs, 4);
  assert.equal(long.cash - short.cash, 2, 'Only shared tips differ');
  game.choose(long, 'observeRecovery');
  assert.equal(long.arc.history.length, 1);
});

test('Ordinary shifts do not add exposures or discoveries, including on a legacy save', () => {
  const s = play(['clockOut','wakeMorning','learnSpecials']);
  assert.equal(s.arc, undefined);
  game.choose(s, 'startOtherMenu');
  for (let i = 0; i < 5; i++) {
    for (const event of ['ordinaryShift','ordinaryCare','privateNotes','payOtherShift','wakeOtherMorning','observeRecovery']) game.choose(s, event);
    if (i < 4) game.choose(s, 'nextOtherShift');
  }
  assert.equal(s.cash, 600);
  assert.equal(s.arc.completed, 5);
  assert.equal(s.arc.exposures, 0);
  assert.equal(s.arc.history.length, 0);
  assert.equal(Object.keys(s.arc.discoveries).length, 0);
  assert.equal(s.form, 'human');
});

test('Encounter introductions unfold across shifts and survive reloads without a form menu', () => {
  const s = play(['startOtherMenu']);
  const expected = ['robot','cup','espresso','moth','shadow'];
  const choices = ['chooseRobot','chooseCup','chooseEspresso','chooseMoth','chooseShadow'];
  for (let i = 0; i < expected.length; i++) {
    assert.equal(game.encounter(s), expected[i]);
    assert.equal(game.encounter(JSON.parse(JSON.stringify(s))), expected[i]);
    game.choose(s, choices[i]); game.choose(s, 'settleSpecial');
    assert.equal(game.encounter(s), expected[i], 'An unlocked form must not change this visit\'s encounter');
    for (const event of ['serviceShort','privateNotes','payOtherShift','wakeOtherMorning','observeRecovery']) game.choose(s,event);
    if (i < 4) game.choose(s,'nextOtherShift');
  }
  assert.equal(s.journal.filter(e => e.title === 'The work around the counter').length, 5);
  assert.ok(s.journal.some(e => e.text.includes('supplier call')));
});

test('Legacy visits derive one unseen encounter without mutating saved state', () => {
  const s = play(['startOtherMenu']);
  delete s.arc.visit.encounter;
  s.arc.visit.number = 2;
  s.arc.discoveries.espresso = true;
  const before = JSON.stringify(s);
  assert.equal(game.encounter(s), 'cup');
  assert.equal(game.encounter(s), 'cup');
  assert.equal(JSON.stringify(s), before);
  s.arc.visit.number = 3;
  assert.equal(game.encounter(s), 'moth', 'Already discovered forms need not repeat before unseen ones');
});

test('Nadia remembers witnessed forms, with privacy and repeat visits preserved through saves', () => {
  const s = play(['startOtherMenu','chooseCup','settleSpecial','inviteNadia']);
  assert.equal(s.arc.visit.nadiaRepeat, false);
  assert.equal(s.arc.nadiaSeen.cup, true);
  const relationship = s.nadia;
  assert.equal(game.choose(s,'inviteNadia'), false);
  assert.equal(s.nadia, relationship);
  for (const e of ['serviceShort','payOtherShift','wakeOtherMorning','observeRecovery','nextOtherShift','chooseCup','settleSpecial']) game.choose(s,e);
  const loaded = JSON.parse(JSON.stringify(s));
  game.choose(loaded,'inviteNadia');
  assert.equal(loaded.arc.visit.nadiaRepeat, true);
  const privateRun = play(['startOtherMenu','chooseRobot','settleSpecial','privateNotes']);
  assert.equal(privateRun.arc.nadiaSeen, undefined);
});

const finishOrdinaryDay = s => {
  for (const event of ['ordinaryShift','ordinaryCare','privateNotes','payOtherShift','wakeOtherMorning','observeRecovery']) game.choose(s, event);
};

test('Recovery evenings are optional, read-only to inspect, and cannot be started during a transformation', () => {
  const s = play(['startOtherMenu','chooseCup','settleSpecial']);
  const before = JSON.stringify(s);
  assert.equal(game.eveningAvailable(s, 'nadia'), false);
  assert.equal(game.eveningCount(s, 'nadia'), 0);
  assert.equal(game.eveningHistory(s).length, 0);
  assert.equal(game.choose(s, 'eveningNadia'), false);
  assert.equal(game.choose(s, 'nadiaHonest'), false);
  assert.equal(JSON.stringify(s), before);
  for (const event of ['serviceShort','privateNotes','payOtherShift','wakeOtherMorning','observeRecovery']) game.choose(s, event);
  const recovered = JSON.stringify(s);
  assert.equal(game.eveningAvailable(s, 'nadia'), true);
  assert.equal(game.eveningAvailable(s, 'unknown'), false);
  assert.equal(JSON.stringify(s), recovered, 'Looking at an old recovery save must not migrate it');
});

test('An evening reserves one person, rejects unrelated answers and survives a save without duplicate consequences', () => {
  const s = play(['startOtherMenu']); finishOrdinaryDay(s);
  const cash = s.cash, exposure = s.arc.exposures, nadia = s.nadia;
  assert.equal(game.choose(s, 'eveningNadia'), true);
  assert.equal(game.choose(s, 'eveningTheo'), false);
  assert.equal(game.choose(s, 'nextOtherShift'), false, 'Finish the conversation before advancing');
  assert.equal(game.choose(s, 'stayCafe'), false);
  assert.equal(game.choose(s, 'theoRadio'), false);
  assert.equal(game.choose(s, 'nadiaListen'), false, 'The second conversation is not the first');
  const loaded = JSON.parse(JSON.stringify(s));
  assert.equal(game.choose(loaded, 'nadiaHonest'), true);
  assert.equal(game.choose(loaded, 'nadiaOrdinary'), false);
  assert.equal(game.choose(loaded, 'nadiaHonest'), false);
  assert.equal(loaded.nadia, nadia + 1);
  assert.equal(loaded.cash, cash);
  assert.equal(loaded.arc.exposures, exposure);
  assert.equal(loaded.arc.evenings.length, 1);
  assert.equal(loaded.arc.nadiaSeen, undefined, 'Hearing an account is not witnessing a form');
  assert.equal(loaded.journal.filter(e => e.title === 'Outside the cafe').length, 1);
  assert.equal(game.choose(loaded, 'nextOtherShift'), true);
});

test('Each companion has two distinct evenings, including ordinary-only campaigns and the final recovery day', () => {
  for (const [person, invitation, answers] of [
    ['nadia','eveningNadia',['nadiaOrdinary','nadiaFilm']],
    ['theo','eveningTheo',['theoRadio','theoNumbers']],
    ['inez','eveningInez',['beaFeeling','inezPast']]
  ]) {
    const s = play(['startOtherMenu']);
    for (let shift = 1; shift <= 5; shift++) {
      finishOrdinaryDay(s);
      if (shift === 1 || shift === 5) {
        assert.equal(game.choose(s, invitation), true);
        assert.equal(s.arc.visit.outing.chapter, shift === 1 ? 1 : 2);
        game.choose(s, answers[shift === 1 ? 0 : 1]);
      }
      if (shift < 5) game.choose(s, 'nextOtherShift');
    }
    assert.equal(game.eveningCount(s, person), 2);
    assert.equal(game.eveningAvailable(s, person), false);
    assert.equal(game.choose(s, invitation), false);
    assert.equal(s.arc.exposures, 0);
    assert.equal(s.arc.history.length, 0);
    assert.equal(s.arc.completed, 5);
    assert.equal(game.choose(s, 'leaveCafe'), true);
    assert.equal(game.eveningAvailable(s, 'nadia'), false);
  }
});
