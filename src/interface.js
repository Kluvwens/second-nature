Config.history.maxStates = 50;
Config.passages.nobr = true;
Config.passages.transitionOut = 0;
Config.saves.id = 'second-nature-first-shift-v2';
Config.saves.version = 2;
Config.saves.maxAutoSaves = 2;
Config.saves.maxSlotSaves = 6;
Config.saves.isAllowed = type => type !== Save.Type.Auto || State.passage !== 'Start';
Config.saves.descriptions = () => 'Day ' + (State.variables.run.day || 1) + ' · ' + State.passage;

setup.dialog = name => { Dialog.create(name === 'Notebook' ? 'Your notebook' : 'People in your orbit'); Dialog.wikiPassage(name); Dialog.open(); };
setup.showArt = (src, alt, title) => {
  const image = document.createElement('img');
  image.src = src; image.alt = alt; image.className = 'expanded-art';
  const original = document.createElement('a');
  original.href = src; original.target = '_blank'; original.rel = 'noopener';
  original.className = 'art-original'; original.textContent = 'Open full-resolution image';
  Dialog.create(title); Dialog.append(image); Dialog.append(original); Dialog.open();
};
setup.scenes = {
  Start: ['BEFORE OPENING', 'A room upstairs', '06:30', 0],
  Arrival: ['BEFORE OPENING', 'The key', '06:35', 0],
  Apartment: ['YOUR APARTMENT', 'Setting down your bags', '06:40', 0],
  OrderOne: ['AT THE COUNTER', 'The first order', '07:15', 1],
  AfterOne: ['AT THE COUNTER', 'Finding a rhythm', '07:20', 1],
  OrderTwo: ['AT THE COUNTER', 'Small instructions', '09:10', 2],
  Break: ['STAFF BREAK', 'Something off-menu', '10:30', 2],
  FirstChange: ['STAFF BREAK', 'Golden Hour', '10:42', 2],
  HoneyFace: ['STAFF BREAK', 'The change spreads', '10:44', 2],
  HoneyBody: ['STAFF BREAK', 'A body made of honey', '10:47', 2],
  HoldShape: ['BACK ROOM', 'Learning your edges', '11:00', 2],
  Ordinary: ['STAFF BREAK', 'A familiar taste', '10:42', 2],
  Theo: ['BACK ROOM', 'What you choose to say', '11:15', 2],
  OrderThree: ['AT THE COUNTER', 'The last rush', '12:15', 3],
  AfterThree: ['WINDING DOWN', 'The shape of a shift', '13:30', 3],
  Nadia: ['AFTER THE RUSH', 'A familiar face', '14:00', 3],
  NadiaReply: ['AFTER THE RUSH', 'Room for an answer', '14:10', 3],
  Closing: ['UPSTAIRS', 'What stays with you', '15:00', 3],
  Morning: ['YOUR APARTMENT', 'Human in the morning', '06:50', 3],
  MorningRules: ['BEFORE OPENING', 'The other menu', '07:10', 3]
};
setup.scene = () => setup.scenes[State.passage] || setup.scenes.Start;
setup.currentForm = () => setup.game.forms[(State.variables.run.form || '').replace(/-changing$/, '')];
setup.recoveryClock = v => {
  const minutes = v.recoveryAt % 1440;
  return String(Math.floor(minutes / 60)).padStart(2, '0') + ':' + String(minutes % 60).padStart(2, '0');
};
const otherScenes = {
  OtherShift: ['BEFORE OPENING', 'Another shift', '07:10', 0],
  OtherMenu: ['BETWEEN ORDERS', 'Something in the day', '10:30', 0],
  BodyCheck: ['BEFORE WORK', 'A minute to yourself', '10:45', 0],
  BodyCheckResult: ['BEFORE WORK', 'A small experiment', '10:45', 0],
  OtherAfterWork: ['AFTER THE SESSION', 'After the last order', '13:40', 0],
  OrdinaryOther: ['AT THE COUNTER', 'Ordinary coffee', '11:00', 0],
  OrdinaryDebrief: ['AFTER THE RUSH', 'The same wage', '13:40', 0],
  OtherFriend: ['AFTER WORK', 'Still a conversation', '14:10', 0],
  OtherEvening: ['OFF THE CLOCK', 'No more orders', '18:30', 0],
  OtherMorning: ['RECOVERY DAY', 'The next morning', '06:50', 0],
  OtherRecovery: ['RECOVERY DAY', 'Your own account', 'LATER', 0],
  OtherDecision: ['BACK ROOM', 'Your own terms', 'EVENING', 0],
  OtherEnding: ['CHAPTER COMPLETE', 'What comes next', 'EVENING', 0]
};
Object.assign(otherScenes, {
  AfterHours: ['OFF DUTY', 'The evening is yours', '18:10', 0],
  NadiaEvening: ['BY THE CINEMA', 'Beyond the cafe', '18:30', 0],
  TheoEvening: ['AFTER CLOSING', 'Tea with Theo', '18:30', 0],
  InezEvening: ['THE QUIET SHOP', 'An old book', '18:30', 0],
  EveningReply: ['OFF DUTY', 'Before heading home', 'LATER', 0]
});
setup.eveningArt = {
  nadia: ['nadia-walk.png', 'Human Mara and Nadia talk outside a cinema after the rain', 'Nadia · beyond the warm windows'],
  theo: ['theo-radio.png', 'Theo shows Mara a photograph of the radio he once became', 'Theo · a face for radio'],
  inez: ['inez-bea.png', 'Mara meets Bea, a talking wooden coat stand, while Inez watches', 'Inez and Bea · the quiet shop']
};
setup.detailArt = {
  robot: ['robot-study.png', 'Mara presses a porcelain fingertip into her other palm, studying the brass joints', 'Clockwork Cream · learning these hands'],
  moth: ['moth-study.png', 'Mara unfolds her paper wings on a notebook beside a pencil', 'Margin Tea · at the scale of a pencil'],
  shadow: ['shadow-study.png', 'Mara spreads one flat shadow hand against the brick beside an empty chair', 'Afterimage · the texture of the wall'],
  cupNadia: ['cup-nadia.png', 'Nadia covers her mouth in shock as Mara speaks from a porcelain cup', 'Small Hours · Nadia finds you'],
  shadowNadia: ['shadow-nadia.png', 'Nadia hesitates with her hand near Mara’s shadow on the wall', 'Afterimage · a hand you cannot hold'],
  espressoNight: ['espresso-night.png', 'Mara rests as an idle espresso machine beside a lamp and an open phone call', 'House Pressure · after closing']
};
// Read-only unlocks also understand earlier saves without the new optional fields.
setup.extraFormArt = (run, id) => {
  const a = run.arc, v = a?.visit, images = [];
  if (!a?.discoveries?.[id]) return images;
  if (setup.detailArt[id]) images.push(setup.detailArt[id]);
  if (['cup', 'shadow'].includes(id) && a.nadiaSeen?.[id]) images.push(setup.detailArt[id + 'Nadia']);
  if (id === 'espresso' && (a.restArt?.espresso || a.history?.some(entry => entry.form === 'espresso')
    || (v?.form === 'espresso' && v.flags.paid))) images.push(setup.detailArt.espressoNight);
  return images;
};
for (const prefix of ['Robot', 'Cup', 'Espresso', 'Moth', 'Shadow']) {
  for (const [suffix, clock] of [['Change', '10:30'], ['Body', '10:45'], ['Work', '11:15'], ['Result', '13:10']]) {
    otherScenes[prefix + suffix] = ['THE OTHER MENU', prefix, clock, 0];
  }
}
Object.assign(setup.scenes, otherScenes);
setup.sceneArt = () => {
  const run = State.variables.run, v = run.arc?.visit;
  if (['NadiaEvening','TheoEvening','InezEvening','EveningReply'].includes(State.passage) && setup.eveningArt[v?.outing?.person]) return setup.eveningArt[v.outing.person];
  if (State.passage === 'AfterHours') return ['apartment-arrival.png', 'Mara in the room above the cafe, off duty', 'A free evening'];
  if (v && otherScenes[State.passage]) {
    const f = setup.game.forms[v.form];
    const changedScene = !['OtherShift', 'OtherMenu', 'OtherRecovery', 'OtherDecision', 'OtherEnding'].includes(State.passage);
    if (f && changedScene && (State.passage !== 'OtherMorning' || v.lingering)) {
      if (State.passage === 'OtherFriend' && v.friend === 'visit' && ['cup', 'shadow'].includes(v.form)) return setup.detailArt[v.form + 'Nadia'];
      if (v.form === 'espresso' && ['OtherEvening', 'OtherMorning'].includes(State.passage)) return setup.detailArt.espressoNight;
      if (setup.detailArt[v.form] && (/Body$/.test(State.passage) || ['BodyCheck', 'BodyCheckResult'].includes(State.passage))) return setup.detailArt[v.form];
      if (State.passage === 'MothWork' && v.approach === 'write') return setup.detailArt.moth;
      if (State.passage === 'ShadowWork') return setup.detailArt.shadow;
      if (['moth', 'shadow'].includes(v.form) && /(?:Result|AfterWork|Friend)$/.test(State.passage)) return setup.detailArt[v.form];
      const serviceArt = ['robot', 'cup', 'espresso'].includes(v.form) && /(?:Work|Result|AfterWork|Friend)$/.test(State.passage) && State.passage !== 'BodyCheckResult';
      const serviceFile = v.form === 'cup' && v.approach === 'familiar' ? 'cup-service-theo.png' : v.form + '-service.png';
      return [serviceArt ? serviceFile : f.art,
        serviceArt ? 'Mara experiences a cafe work session as ' + f.name.toLowerCase() : 'Mara changes from human through an intermediate stage into ' + f.name.toLowerCase(),
        serviceArt ? f.drink + ' · during service' : f.drink + ' · onset / change / complete form'];
    }
    if (['OtherRecovery', 'OtherMorning', 'OtherEvening'].includes(State.passage)) return ['morning-human.png', 'Human Mara checks her familiar hands in the apartment', 'Human again · your own account'];
    if (State.passage === 'OtherMenu') {
      const id = setup.game.encounter(run);
      return [id === 'espresso' || id === 'robot' ? 'counter-training.png' : 'golden-hour-cup.png', 'An ordinary cafe morning with an unfamiliar house recipe', 'An interruption in the morning'];
    }
    return ['counter-training.png', 'The warm cafe counter and its ordinary routines', 'Second Nature · the other menu'];
  }
  const honey = State.variables.run.changed;
  const art = {
    welcome: ['cafe-welcome.png', 'Inez offers Mara the key to her new apartment across the cafe counter', 'A key, a room, a first morning'],
    counter: ['counter-training.png', 'Theo teaches human Mara at the copper espresso machine', 'Learning the counter'],
    coffee: ['golden-hour-cup.png', 'Golden Hour and an ordinary coffee wait on the back-room table', 'Golden Hour and ordinary coffee'],
    friend: [honey ? 'nadia-honey.png' : 'nadia-human.png', honey ? 'Nadia listens as a frightened honey-bodied Mara tries to explain her day' : 'Nadia and human Mara talk over coffee after the shift', 'Someone who knows you'],
    home: [honey ? 'apartment-honey-evening.png' : 'apartment-arrival.png', honey ? 'Mara sits in her apartment, shaken, studying her unfamiliar honey hand' : 'Mara sets down her bags in the studio above the cafe', 'The room upstairs'],
    honey: ['honey-settled.png', 'Mara learns to hold her complete honey body together', 'Finding your edges'],
    morning: ['morning-human.png', 'Human Mara sits on the edge of her bed in green sleepwear, studying her ordinary hands in the morning light', 'The next morning · human']
  };
  const keys = { Start: 'welcome', Arrival: 'welcome', Apartment: 'home', OrderOne: 'counter', AfterOne: 'counter', OrderTwo: 'counter', Break: 'coffee', Ordinary: 'coffee', Theo: honey ? 'honey' : 'counter', HoldShape: 'honey', OrderThree: honey ? 'honey' : 'counter', AfterThree: honey ? 'friend' : 'counter', Nadia: 'friend', NadiaReply: 'friend', Closing: 'home', Morning: 'morning', MorningRules: 'coffee' };
  return art[keys[State.passage] || 'welcome'];
};

/* Reading pages only rearrange rendered prose. They never replay story choices. */
setup.mountReader = () => {
  if (setup.readerCleanup) setup.readerCleanup();
  const passage = document.querySelector('#passages .passage:last-child');
  if (!passage || passage.querySelector('.scene-shell')) return;
  const transformation = ['FirstChange', 'HoneyFace', 'HoneyBody', 'RobotChange', 'CupChange', 'EspressoChange', 'MothChange', 'ShadowChange'].includes(State.passage);
  const make = (tag, className) => { const node = document.createElement(tag); node.className = className; return node; };
  const shell = make('article', 'scene-shell' + (transformation ? ' transformation-scene' : ''));
  const reader = make('div', 'scene-reader');
  const heading = make('header', 'scene-heading');
  const body = make('div', 'reading-body');
  body.id = 'reading-body';
  const choices = passage.querySelector('.choices') || make('div', 'choices');
  let figure = passage.querySelector('.story-illustration');
  if (!figure) {
    const [filename, alt, caption] = setup.sceneArt();
    figure = make('figure', 'story-illustration');
    const img = document.createElement('img'); img.src = 'assets/' + filename; img.alt = alt;
    const figcaption = document.createElement('figcaption');
    const label = document.createElement('span'); label.textContent = caption;
    const enlarge = document.createElement('button'); enlarge.type = 'button'; enlarge.textContent = 'View illustration';
    enlarge.addEventListener('click', () => setup.showArt(img.src, alt, caption));
    figcaption.append(label, enlarge); figure.append(img, figcaption);
  }
  figure.classList.add('scene-art');
  for (const node of [...passage.children]) {
    if (node === figure || node === choices) continue;
    if (node.matches('.eyebrow, h1')) heading.append(node);
    else body.append(node);
  }
  // Compact the title without altering the authored prose.
  heading.querySelectorAll('br').forEach(br => br.replaceWith(' '));
  const title = heading.querySelector('h1');
  if (title) title.tabIndex = -1;
  reader.append(heading, body);
  shell.append(figure, reader);
  passage.replaceChildren(shell);
  document.body.classList.toggle('reading-transformation', transformation);
  if (transformation) {
    reader.append(choices);
    title?.focus({preventScroll:true});
    setup.readerCleanup = null;
    return;
  }

  const blocks = [...body.children];
  const controls = make('div', 'reader-controls');
  const navigation = make('nav', 'page-navigation'); navigation.setAttribute('aria-label', 'Reading pages');
  const back = make('button', 'page-back'); back.type = 'button'; back.textContent = '← Back';
  const count = make('span', 'page-count'); count.setAttribute('aria-live', 'polite');
  const next = make('button', 'page-next'); next.type = 'button'; next.textContent = 'Continue →';
  back.setAttribute('aria-controls', body.id); next.setAttribute('aria-controls', body.id);
  navigation.append(back, count, next);
  controls.append(navigation, choices); reader.append(controls);
  let pages = [], current = 0, frame = 0;
  const show = (index, focus = false) => {
    current = Math.max(0, Math.min(index, pages.length - 1));
    pages.forEach((page, i) => { page.hidden = i !== current; });
    const last = current === pages.length - 1;
    choices.hidden = !last;
    next.hidden = last;
    back.disabled = current === 0;
    navigation.hidden = pages.length < 2;
    count.textContent = `${current + 1} / ${pages.length}`;
    body.scrollTop = 0;
    if (focus) { pages[current].tabIndex = -1; pages[current].focus({preventScroll:true}); }
  };
  const paginate = () => {
    if (!passage.isConnected) return;
    const anchor = pages[current]?.firstElementChild;
    choices.hidden = false; navigation.hidden = false; next.hidden = false;
    controls.style.minHeight = '';
    controls.style.minHeight = controls.offsetHeight + 'px';
    body.replaceChildren(); pages = [];
    let page = make('section', 'reader-page'); body.append(page); pages.push(page);
    // jsdom has no layout; the accessible fallback keeps all content together.
    const available = Math.max(0, body.clientHeight - 2);
    for (const block of blocks) {
      page.append(block);
      if (available > 0 && page.scrollHeight > available + 1 && page.children.length > 1) {
        block.remove();
        page.hidden = true;
        page = make('section', 'reader-page'); body.append(page); pages.push(page); page.append(block);
      }
    }
    const restored = anchor ? pages.findIndex(page => page.contains(anchor)) : 0;
    show(Math.max(0, restored));
  };
  back.addEventListener('click', () => show(current - 1, true));
  next.addEventListener('click', () => show(current + 1, true));
  const resize = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(paginate); };
  window.addEventListener('resize', resize);
  const observer = typeof ResizeObserver === 'function' ? new ResizeObserver(resize) : null;
  observer?.observe(reader);
  setup.readerCleanup = () => { cancelAnimationFrame(frame); window.removeEventListener('resize', resize); observer?.disconnect(); };
  paginate();
  // SugarCube finishes revealing the passage after :passagedisplay returns.
  resize();
  title?.focus({preventScroll:true});
};
$(document).on(':passagedisplay', setup.mountReader);
$(document).one(':storyready', () => { document.title = 'Second Nature — The Other Menu'; });
