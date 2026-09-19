/* Plain, serializable state; all consequences occur on choices, never while rendering. */
setup.game = (() => {
  const initialState = () => ({
    schema: 2, day: 1, cash: 42, tips: 0, orders: 0, correct: 0, stress: 2,
    theo: 0, inez: 0, nadia: 2, drink: null, changed: false,
    form: 'human', formControl: null, roomChoice: null,
    reaction: null, toldTheo: false, toldNadia: false,
    flags: {}, journal: [{ title: 'A room of your own', text: 'The cafe pays $88 a shift. The studio upstairs is included for now. Your next goal: $900 for a deposit elsewhere.' }]
  });
  const note = (s, title, text) => s.journal.push({ title, text });
  const order = (s, good, tip) => {
    s.orders++; s.correct += Number(good); s.tips += good ? tip : 0;
    s.stress = Math.max(0, Math.min(5, s.stress + (good ? -1 : 1)));
  };
  const events = {
    welcome: ['welcome', s => { s.inez++; }],
    unpackMug: ['movedIn', s => { s.roomChoice = 'mug'; note(s, 'The room before the shift', 'You dropped your bags beside the bed and put your chipped blue mug on the desk.'); }],
    keepPacked: ['movedIn', s => { s.roomChoice = 'packed'; note(s, 'The room before the shift', 'You dropped both bags beside the bed, still zipped. You checked the lock and the sticking window. Settling in can wait until after work.'); }],
    firstCorrect: ['order1', s => order(s, true, 2)],
    firstWrong: ['order1', s => order(s, false, 2)],
    askTheo: ['training', s => { s.theo++; s.stress = Math.max(0, s.stress - 1); }],
    solo: ['training', () => {}],
    secondCorrect: ['order2', s => order(s, true, 3)],
    secondWrong: ['order2', s => order(s, false, 3)],
    taste: ['drink', s => {
      s.drink = 'golden'; s.form = 'softening'; s.stress = Math.max(4, s.stress);
      note(s, 'Golden Hour — onset', 'Your palms became translucent amber. Fingertips softened against the table and stretched into honey threads. You can still feel every part of them.');
    }],
    spreadHoney: ['spread', s => { s.form = 'spreading'; note(s, 'The face in the mirror', 'The change spread through your arms, face and hair. Your freckles remained as dark specks in amber. Your hair gathered into thick honey ribbons.'); }],
    becomeHoney: ['transformed', s => {
      s.form = 'honey'; s.changed = true;
      note(s, 'Golden Hour — honey slime', 'Your whole body became living honey. Translucent amber skin, fluid limbs, honey hair, and a shape you could consciously hold. Clothes and brass clip stayed unchanged. Inez expects it to wear off overnight; there is no immediate reversal.');
    }],
    decline: ['drink', s => {
      s.drink = 'ordinary';
      note(s, 'The special you left alone', 'You chose an ordinary coffee. No changes noticed. Theo moved the special aside without comment.');
    }],
    curious: ['reaction', s => { s.reaction = 'curious'; note(s, 'An uncomfortable admission', 'You are frightened and asked how to change back. Some of the softness still feels good, which frightens you in a different way. You still want your hands back.'); }],
    uneasy: ['reaction', s => { s.reaction = 'uneasy'; note(s, 'A line to keep', 'You photographed your new body and asked for time. You want answers about holding shape and changing back before another cup.'); }],
    steadyForm: ['practice', s => { s.formControl = 'steady'; s.stress = Math.max(0, s.stress - 1); note(s, 'Holding a familiar shape', 'With a slow breath and attention, you can firm your outline and separate your fingers. You chose to practice keeping a steady form.'); }],
    exploreForm: ['practice', s => { s.formControl = 'fluid'; s.stress = Math.max(0, s.stress - 1); note(s, 'Trying the new rules', 'You stretched your fingers around a cup handle and drew them back into shape. Movement follows attention; you chose to explore that flexibility.'); }],
    tellTheo: ['disclosureTheo', s => { s.theo += 2; s.toldTheo = true; }],
    deflectTheo: ['disclosureTheo', () => {}],
    thirdCorrect: ['order3', s => order(s, true, 2)],
    thirdWrong: ['order3', s => order(s, false, 2)],
    tellNadia: ['disclosureNadia', s => {
      s.nadia++; s.toldNadia = true;
      note(s, 'Someone outside these walls', s.changed ? 'Nadia saw your honey body. You told her about Golden Hour and how you feel. She asked what you want to do next.' : 'You told Nadia about the special and your decision to leave it alone. She offered to check in after your next shift.');
    }],
    hideNadia: ['disclosureNadia', s => note(s, 'Not tonight', s.changed ? 'Nadia can see your transformation. You asked to postpone the explanation; she agreed to stay while you talked about the apartment.' : 'You kept the strange part of the shift to yourself. Nadia knows you are settling in, but not the whole story.')],
    clockOut: ['paid', s => { s.cash += 88 + s.tips; note(s, 'First shift, paid', '$88 in wages and $' + s.tips + ' in tips. The deposit fund is now $' + s.cash + ' of $900.'); }],
    wakeMorning: ['morning', s => {
      s.day = 2; s.changed = false; s.form = 'human'; s.formControl = null;
      s.stress = Math.max(1, s.stress - 1);
      note(s, s.flags.transformed ? 'Human again — 06:50' : 'An ordinary morning', s.flags.transformed
        ? 'Your first Golden Hour wore off overnight. You woke human at 06:50, with ordinary hands and chestnut hair. You still have the photographs. You remember how the change felt.'
        : 'You woke unchanged after choosing ordinary coffee. There was no transformation to recover from. You still have questions about the other menu.');
    }],
    learnSpecials: ['specialsExplained', s => note(s, 'The cafe\'s other menu', 'The off-menu specials temporarily change the drinker. Regulars share the secret by word of mouth. A first cup usually fades overnight. Inez says changes can last longer after repeated visits; your own first experience is only one observation.')]
  };
  const forms = {
    robot: { name: 'Porcelain automaton', drink: 'Clockwork Cream', passage: 'RobotChange', art: 'robot-sequence.png', notice: 'Porcelain plates. Brass joints. Every movement arrives with a prediction.' },
    cup: { name: 'Porcelain cup', drink: 'Small Hours', passage: 'CupChange', art: 'cup-sequence.png', notice: 'A hollow ceramic body. A handle, a rim, and a voice that rings through porcelain.' },
    espresso: { name: 'Espresso machine', drink: 'House Pressure', passage: 'EspressoChange', art: 'espresso-sequence.png', notice: 'Copper boiler. Enamel casing. You can feel the pressure behind every shot.' },
    moth: { name: 'Paper moth', drink: 'Margin Tea', passage: 'MothChange', art: 'moth-sequence.png', notice: 'Folded paper wings. Ink freckles. Your whole body weighs less than the key upstairs.' },
    shadow: { name: 'Living shadow', drink: 'Afterimage', passage: 'ShadowChange', art: 'shadow-sequence.png', notice: 'An outline on the wall. No weight. Light changes where you can reach.' }
  };
  const arc = s => s.arc || (s.arc = { completed: 0, exposures: s.flags.transformed ? 1 : 0, discoveries: {}, history: [], visit: null });
  const encounterOrder = ['robot', 'cup', 'espresso', 'moth', 'shadow'];
  // A stored encounter survives saves/reloads. Older saves derive one without a render-time mutation.
  const encounter = s => {
    const a = s.arc, v = a?.visit;
    if (forms[v?.encounter]) return v.encounter;
    const start = Math.max(0, ((v?.number || (a?.completed || 0) + 1) - 1)) % encounterOrder.length;
    const order = encounterOrder.slice(start).concat(encounterOrder.slice(0, start));
    return order.find(id => !a?.discoveries?.[id]) || order[0];
  };
  const begin = s => {
    const a = arc(s);
    a.visit = { number: a.completed + 1, day: s.day, flags: {}, form: null, approach: null, service: null, friend: null, tips: 0, jobs: 0, stage: 'briefing' };
    a.visit.encounter = encounter(s);
  };
  const visit = s => { const a = arc(s); if (!a.visit) begin(s); return a.visit; };
  const chooseForm = (s, id) => {
    const a = arc(s), v = visit(s), f = forms[id];
    a.exposures++;
    v.form = id; v.stage = 'changing'; v.startedAt = (s.day - 1) * 1440 + 630;
    // Observed duration belongs to this dose. Rest and attitude do not alter it.
    v.durationHours = Math.min(30, a.exposures === 1 ? 18 : 24 + a.exposures);
    v.recoveryAt = v.startedAt + v.durationHours * 60;
    s.form = id + '-changing'; s.changed = false; s.stress = 4;
    note(s, f.drink + ' — shift ' + v.number, 'Day ' + s.day + ', 10:30. A cup offered during the shift began changing you into ' + f.name.toLowerCase() + '. This is special number ' + a.exposures + '. You do not yet know when it will wear off.');
  };
  const service = (s, mode) => {
    const v = visit(s); v.service = mode; v.stage = 'afterwork';
    const a = arc(s); if (!a.serviceArt) a.serviceArt = {}; a.serviceArt[v.form] = true;
    if (v.form === 'cup') { if (!a.cupService) a.cupService = {}; a.cupService[v.approach === 'familiar' ? 'familiar' : 'regulars'] = true; }
    v.jobs = mode === 'try' ? 12 : 4; v.tips = mode === 'try' ? 6 : 4;
    s.stress = Math.max(1, s.stress - 1);
    note(s, 'Work, in another shape', mode === 'try'
      ? 'You chose the longer session. Twelve tasks, a scheduled pause, and $6 in shared tips. You chose to continue after the break.'
      : 'You chose a four-task trial and stopped there. Theo took over the remaining rush. You received $4 in shared tips; your wages are unchanged.');
  };
  const nextEvents = {
    partnerTheo: ['partner', s => { visit(s).partner = 'theo'; s.theo++; }],
    partnerInez: ['partner', s => { visit(s).partner = 'inez'; s.inez++; }],
    chooseRobot: ['special', s => chooseForm(s, 'robot')],
    chooseCup: ['special', s => chooseForm(s, 'cup')],
    chooseEspresso: ['special', s => chooseForm(s, 'espresso')],
    chooseMoth: ['special', s => chooseForm(s, 'moth')],
    chooseShadow: ['special', s => chooseForm(s, 'shadow')],
    ordinaryShift: ['special', s => { const v = visit(s); v.form = 'human'; v.stage = 'working'; s.form = 'human'; s.changed = false; }],
    settleSpecial: ['settled', s => {
      const v = visit(s); if (!forms[v.form]) return;
      s.form = v.form; s.changed = true; v.stage = 'working';
      arc(s).discoveries[v.form] = true;
      note(s, forms[v.form].name + ' — complete', forms[v.form].notice + ' You still remember who you are and can speak for yourself.');
    }],
    acceptPrecision: ['approach', s => { visit(s).approach = 'precision'; }],
    keepOwnVoice: ['approach', s => { visit(s).approach = 'voice'; s.theo++; }],
    familiarHands: ['approach', s => { visit(s).approach = 'familiar'; s.theo++; }],
    meetRegulars: ['approach', s => { visit(s).approach = 'regulars'; }],
    ownPressure: ['approach', s => { visit(s).approach = 'self'; }],
    sharePressure: ['approach', s => { visit(s).approach = 'shared'; s.theo++; }],
    mothFly: ['approach', s => { visit(s).approach = 'fly'; }],
    mothWrite: ['approach', s => { visit(s).approach = 'write'; }],
    shadowStage: ['approach', s => { visit(s).approach = 'stage'; }],
    shadowQuiet: ['approach', s => { visit(s).approach = 'quiet'; }],
    serviceLong: ['service', s => service(s, 'try')],
    serviceShort: ['service', s => service(s, 'stop')],
    ordinaryCare: ['service', s => { const v = visit(s); v.service = 'care'; v.jobs = 12; v.tips = 6; s.theo++; }],
    ordinaryQuestion: ['service', s => { const v = visit(s); v.service = 'question'; v.jobs = 12; v.tips = 6; s.inez++; }],
    inviteNadia: ['friend', s => {
      const a = arc(s), v = visit(s);
      if (!a.nadiaSeen) a.nadiaSeen = {};
      v.nadiaRepeat = !!a.nadiaSeen[v.form];
      if (forms[v.form]) a.nadiaSeen[v.form] = true;
      v.friend = 'visit'; s.nadia++; s.toldNadia = true;
    }],
    privateNotes: ['friend', s => { visit(s).friend = 'private'; }],
    payOtherShift: ['paid', s => {
      const a = arc(s), v = visit(s); s.cash += 88 + v.tips; a.completed++;
      v.stage = 'evening';
      if (v.form === 'espresso') { if (!a.restArt) a.restArt = {}; a.restArt.espresso = true; }
      note(s, 'Other-menu shift ' + v.number + ', paid', '$88 wages and $' + v.tips + ' tips. Deposit fund: $' + s.cash + ' of $900.');
      const lessons = [
        'Inez asked you to check a delivery against the invoice before she gave her answer.',
        'Inez asked you to notice what a regular needed before looking at what they ordered.',
        'Inez had you listen to the supplier call and asked what you would do about the late delivery.',
        'You made a stock estimate. Inez put your figure in the book and left it there.',
        'Inez let you decide the morning setup while she watched from the doorway. She has not explained why she is teaching you these parts of the job.'
      ];
      note(s, 'The work around the counter', lessons[v.number - 1] || lessons[4]);
    }],
    wakeOtherMorning: ['woke', s => {
      const v = visit(s); s.day = v.day + 1; v.stage = 'morning';
      v.observedAt = (s.day - 1) * 1440 + 410;
      v.lingering = !!forms[v.form] && v.observedAt < v.recoveryAt;
      if (!v.lingering) { s.form = 'human'; s.changed = false; }
      else { s.form = v.form; s.changed = true; s.stress = Math.max(3, s.stress); }
    }],
    observeRecovery: ['recovered', s => {
      const a = arc(s), v = visit(s); s.form = 'human'; s.changed = false; s.stress = 2; v.stage = 'recovered';
      if (forms[v.form]) {
        v.observedAt = v.recoveryAt;
        a.history.push({ form: v.form, startedAt: v.startedAt, recoveryAt: v.recoveryAt, hours: v.durationHours });
        note(s, forms[v.form].drink + ' — recovery', 'Human again after ' + v.durationHours + ' hours. ' + (v.lingering ? 'The change was still present at 06:50. You waited for it to wear off, with Inez nearby.' : 'The special faded before breakfast.') + ' You recorded the recovery time alongside the drink.');
      } else note(s, 'A morning without a special', 'No special yesterday, so no recovery time to record. You earned the usual wages and shared tips.');
    }]
  };
  const eveningPeople = ['nadia', 'theo', 'inez'];
  const canReflect = s => {
    const v = s.arc?.visit;
    return !!v && !!forms[v.form] && s.changed && s.form === v.form
      && v.stage === 'working' && !v.flags.approach && !v.reflection;
  };
  const reflectionNotes = {
    robot: { habit: 'You looked for your pulse. You could feel your fingers pressing, but nothing beat beneath them. You asked Theo to sit with you.', sense: 'You pressed one porcelain fingertip into your palm. Contact had a precise outline. You practiced moving without taking the suggested shortcut.' },
    cup: { habit: 'You tried to look over your shoulder. The whole cup had to turn. Theo helped you choose a view of the door.', sense: 'You listened to a note ring through your empty bowl, then felt a little water change its pitch. You asked to be emptied when you were ready.' },
    espresso: { habit: 'You tried to reach for a towel and moved the steam wand instead. You asked Theo to dry the casing and leave the towel where you could see it.', sense: 'With a bowl beneath the group head, you practiced one small release of water. You could feel the closed valve afterward without wanting another cycle.' },
    moth: { habit: 'You tried to straighten your brass clip. Its weight tipped your whole paper body. Theo offered a pencil to brace against.', sense: 'You felt the air move from one wing fold to the next. A tiny adjustment kept you balanced on the notebook.' },
    shadow: { habit: 'You tried to reach across open air toward a chair. Your hand stayed against the wall. You found a route down the brick and across the floor.', sense: 'You traced a mortar line from inside your own palm. Spreading wider made each small hollow easier to feel.' }
  };
  const eveningHistory = s => s.arc?.evenings || [];
  const eveningCount = (s, person) => eveningHistory(s).filter(e => e.person === person).length;
  const eveningAvailable = (s, person) => !!s.arc?.visit && s.arc.visit.stage === 'recovered'
    && !s.flags.arcEnding && !s.arc.visit.flags.evening
    && eveningPeople.includes(person) && eveningCount(s, person) < 2;
  const eveningAnswers = {
    nadiaHonest: { person: 'nadia', chapter: 1, title: 'Outside the cafe', text: 'You told Nadia what has been keeping you at Second Nature. She asked you to call her before trying to explain everything in one message.', memory: 'You can call her with the unfinished version.' },
    nadiaOrdinary: { person: 'nadia', chapter: 1, title: 'A terrible film', text: 'You and Nadia chose a film for its dreadful poster. You asked for one evening without talking about the cafe.', memory: 'There is a terrible film you still need to see.' },
    nadiaListen: { person: 'nadia', chapter: 2, title: 'Her turn', text: 'You stayed with Nadia outside the cinema and listened to her talk about work. She does not always need a plan either.', memory: 'She told you about a difficult day at the hospital.' },
    nadiaFilm: { person: 'nadia', chapter: 2, title: 'Ninety minutes elsewhere', text: 'You went to the film together. The monster was terrible. Nadia laughed hard enough to miss its best line.', memory: 'The two of you now have a favorite terrible monster.' },
    theoRadio: { person: 'theo', chapter: 1, title: 'Theo, on the air', text: 'Theo showed you a photograph of his first change: a tabletop radio. He liked being heard, once he learned to speak over the music.', memory: 'You know what the radio photograph means to him.' },
    theoReturn: { person: 'theo', chapter: 1, title: 'Why he came back', text: 'Theo came back after his first change because Inez had kept his place on the rota. He kept the radio photograph too.', memory: 'He admitted how frightened he was on his first day.' },
    theoAsk: { person: 'theo', chapter: 2, title: 'A meeting of his own', text: 'Theo wants a share in the business. You encouraged him to ask Inez for a proper meeting about it.', memory: 'He is preparing to ask Inez about his future here.' },
    theoNumbers: { person: 'theo', chapter: 2, title: 'The back of an envelope', text: 'You checked Theo\'s figures with him. He wants a share in the business, and has been saving toward it.', memory: 'You have seen the figures behind his plans.' },
    beaFeeling: { person: 'inez', chapter: 1, title: 'The coat stand is called Bea', text: 'Bea described feeling the weight of coats along her wooden hooks. She comes for the quiet and has strong opinions about wet umbrellas.', memory: 'Bea expects you to remember the umbrella rule.' },
    inezRecipes: { person: 'inez', chapter: 1, title: 'Ada\'s handwriting', text: 'Inez learned the recipes from Ada, the previous owner. Some of the old instructions still need correcting.', memory: 'You know the name of the woman who taught Inez.' },
    inezPast: { person: 'inez', chapter: 2, title: 'I. Vale', text: 'You found Inez\'s name in the recovery book. She said she spent her first morning under a table, but would not say in what shape.', memory: 'Her name is in the recovery book too.' },
    inezAccounts: { person: 'inez', chapter: 2, title: 'The ordinary accounts', text: 'Inez showed you the rent and supplier bills. She left a pencil beside your chair for the next time.', memory: 'There is a pencil waiting for you beside the accounts.' }
  };
  function choose(s, event) {
    if (event === 'reflectHabit' || event === 'reflectSense') {
      if (!canReflect(s)) return false;
      const v = s.arc.visit;
      v.reflection = event === 'reflectHabit' ? 'habit' : 'sense';
      note(s, forms[v.form].drink + ' — a moment to yourself', reflectionNotes[v.form][v.reflection]);
      return true;
    }
    const invitations = { eveningNadia: 'nadia', eveningTheo: 'theo', eveningInez: 'inez' };
    if (invitations[event]) {
      const person = invitations[event];
      if (!eveningAvailable(s, person)) return false;
      const v = s.arc.visit;
      v.outing = { person, chapter: eveningCount(s, person) + 1, answer: null };
      v.flags.evening = event;
      return true;
    }
    if (eveningAnswers[event]) {
      const answer = eveningAnswers[event], v = s.arc?.visit, outing = v?.outing;
      if (v?.stage !== 'recovered' || !outing || outing.answer || s.flags.arcEnding
        || outing.person !== answer.person || outing.chapter !== answer.chapter) return false;
      outing.answer = event;
      if (!s.arc.evenings) s.arc.evenings = [];
      s.arc.evenings.push({ person: outing.person, chapter: outing.chapter, answer: event, shift: v.number });
      s[outing.person]++;
      if (event === 'nadiaHonest') s.toldNadia = true;
      note(s, answer.title, answer.text);
      return true;
    }
    if (event === 'startOtherMenu') {
      if (s.flags.otherMenu) return false;
      s.flags.otherMenu = event; s.day = 2; begin(s); return true;
    }
    if (event === 'nextOtherShift') {
      const v = visit(s);
      if (v.stage !== 'recovered' || arc(s).completed >= 5 || (v.outing && !v.outing.answer)) return false;
      s.day = v.day + 2; begin(s); return true;
    }
    if (event === 'stayCafe' || event === 'leaveCafe') {
      if (s.flags.arcEnding || (s.arc?.visit?.outing && !s.arc.visit.outing.answer)) return false;
      s.flags.arcEnding = event;
      note(s, 'Your next arrangement', event === 'stayCafe' ? 'You chose to stay with written terms, a separate housing notice period, and ordinary shifts whenever you want them.' : 'You chose Nadia\'s spare room for a week, with your earnings intact. You returned the cafe key.');
      return true;
    }
    if (nextEvents[event]) {
      const v = visit(s), [group, change] = nextEvents[event];
      if (v.flags[group]) return false;
      change(s); v.flags[group] = event; return true;
    }
    const definition = events[event];
    if (!definition) throw new Error('Unknown story consequence: ' + event);
    const [group, change] = definition;
    if (s.flags[group]) return false;
    change(s); s.flags[group] = event;
    return true;
  }
  return { initialState, choose, forms, encounter, canReflect, eveningCount, eveningHistory, eveningAvailable, eveningAnswers };
})();
