import * as G from './engine.mjs';
import * as V from './form-views.mjs';
import * as B from './board-view.mjs';
import * as H from './guest-views.mjs';
import { icon, dieFace, traitArt } from './art.mjs';
const app = document.querySelector('#app'), dialog = document.querySelector('#dialog');
const esc = value => String(value).replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'})[char]);
let state, sound = false, busy = false, storageAvailable = true, recoveryNotice = false;
try { const saved = localStorage.getItem(G.SAVE_KEY); state = G.restore(saved); recoveryNotice = !!saved && !state; } catch { storageAvailable = false; }
state ||= G.createGame(new URL(location.href).searchParams.get('seed') || undefined);
let inspected = null, audio, boardMode = 'ink';
try { if(localStorage.getItem('hex-and-honey.board-view')==='house') boardMode='house'; } catch {}

function save() { try { localStorage.setItem(G.SAVE_KEY, JSON.stringify(state)); storageAvailable = true; } catch { storageAvailable = false; } }
function tone(notes = [330,440,660]) {
  if (!sound) return;
  try {
    audio ||= new (window.AudioContext || window.webkitAudioContext)(); audio.resume();
    notes.forEach((freq, i) => { const oscillator = audio.createOscillator(), gain = audio.createGain(), start = audio.currentTime + i * .09;
      oscillator.type = 'sine'; oscillator.frequency.value = freq; gain.gain.setValueAtTime(0, start); gain.gain.linearRampToValueAtTime(.04, start + .01); gain.gain.exponentialRampToValueAtTime(.001, start + .24);
      oscillator.connect(gain); gain.connect(audio.destination); oscillator.start(start); oscillator.stop(start + .25); });
  } catch { sound = false; }
}
const spaces = n => `${n} ${n === 1 ? 'space' : 'spaces'}`;
const paragraph = text => text.split('\n\n').map(p => `<p>${esc(p)}</p>`).join('');
function button(action, text, cls = '', disabled = false) { return `<button type="button" data-action="${action}" class="${cls}" ${disabled ? 'disabled' : ''}>${text}</button>`; }
function announce(text) { document.querySelector('#announcer').textContent = G.numbersReadable(state)?text:text.replace(/\d+/g,'unreadable'); }
const tileHelp = {
  door: 'Pass this square with all three seals to win. Every earlier lap pays 3 gold.',
  change: 'Choose an offered change for free, or keep your shape and gain 1 luck. Mental effects may restrict the choice.',
  trial: 'Challenge any unclaimed seal. Roll a fresh die + power + the matching stat to meet the target.',
  fortune: 'Take 2 gold, or test Charm for 6 gold. A failed gamble gives 1 luck.',
  market: 'Changes normally cost 3 gold; combinations can lower the price. Two gold buys two luck.',
  chaos: 'Choose a change and gain 2 gold, or take two changes and 1 luck. The second change is a surprise.',
  rest: 'Take 2 luck, or earn 3 gold. No catch this time.',
  mirror: 'Choose a free change, deepen all your growing traits for 2 luck, or remove your newest trait and gain 2 luck.',
};
const descriptions = {
  change: 'You find bottles beneath a reading lamp. The labels describe what each will change. You turn them over, checking the small print before you reach for a cork.',
  chaos: 'The lid of the box is already loose. You hold it down with one hand and lift a corner to look inside. Two spells press against the gap.',
  trial: 'A crown turns on the table. Three doors stand behind it. Each seal asks for a different part of you; every victory makes the next trial harder.',
  market: 'The vendor unfolds a case on the table. Bottles sit in fitted compartments, with prices written on the cloth beneath them. You count the coins you have left.',
  fortune: 'Two coins lie beside a closed velvet bag. You can take what is on the table, or reach into the bag and feel for the larger purse.',
  rest: 'Behind the curtain, the music softens. A chair waits by the fountain. The bartender could also use a hand with the tips.',
  mirror: 'Your reflection arrives half a second late, carrying other shapes. It points to your newest change, then draws a line through it. When you lean closer, every change you already carry begins to answer. You can let them go further.',
  door: 'You fit your seals against the lock. The handle stays firm beneath your hand. There are still empty places to fill.',
};
function traitOption(id, market = false) {
  return V.traitOption(state,id,market);
}
function choices() {
  const type = state.pending.type;
  let html = '';
  if (['change', 'chaos', 'mirror', 'market'].includes(type)) html += state.pending.offers.map(id => traitOption(id, type === 'market')).join('');
  if (type === 'change') html += button('choose:decline', 'Leave the bottles <small>+1 luck</small>', 'quiet-choice');
  if (type === 'chaos') html += button('choose:wild', `${icon('bolt')} Open the box fully <small>First offer + a surprise · +1 luck</small>`, 'wild-choice');
  if (type === 'mirror' && state.forms.some(f=>f.level<G.MAX_STAGE)) html += button('choose:deepen', 'Let the reflection go further <small>Every growing trait advances one stage · '+(G.deepenCost(state)?G.deepenCost(state)+' luck':'Free · Walking conservatory')+'</small>', 'choice text-choice',state.luck<G.deepenCost(state));
  if (type === 'mirror') html += button('choose:restore', 'Return your newest trait <small>Remove it · +2 luck</small>', 'quiet-choice');
  if (type === 'market') html += button('choose:luck', 'Buy two tokens <small>−2 gold · +2 luck</small>', 'quiet-choice', state.gold < 2 || state.luck >= 9) + button('choose:leave', 'Keep your gold', 'quiet-choice');
  if (type === 'rest') { const both=G.restBoth(state); html += button('choose:rest', `Sit by the fountain <small>${both?'+2 luck and +3 gold':'+2 luck'}</small>`, 'choice text-choice') + button('choose:gold', `Help count the tips <small>${both?'+2 luck and +3 gold':'+3 gold'}</small>`, 'choice text-choice'); }
  if (type === 'fortune') html += button('choose:safe', 'Take the two coins <small>+2 gold</small>', 'choice text-choice') + button('choose:gamble', `Reach into the bag <small>Charm check · ${G.checkChance(state,'charm',false)}% chance · +6 gold</small>${G.hasCombo(state,'night_speech')?'<small>A word ahead: +2 gold even on a miss.</small>':''}`, 'choice text-choice');
  if (type === 'trial') {
    for (const t of G.TRIALS.filter(t => !state.seals.includes(t.id))) {
      const {bonus,target,count,onesHigh}=G.checkDetails(state,t.stat);
      html += button('choose:' + t.id, `<span class="choice-icon">${icon(t.icon)}</span><span><strong>${t.name}</strong><small>${G.STATS[t.stat]} · ${count>1?'best of '+count+'D6':'D6'} + ${bonus} ≥ ${target}</small>${onesHigh?'<small>A rolled 1 counts as 6.</small>':''}</span><span class="odds">${G.checkChance(state,t.stat)}%</span>`, 'choice trial-choice');
    }
    html += button('choose:leave', 'Watch this round <small>+1 gold</small>', 'quiet-choice');
  }
  if (type === 'door') html += button('choose:leave', 'Keep going <small>+1 luck</small>', 'choice text-choice');
  return html;
}
function guests() { showDialog('House guests',G.GUESTS.map(g=>H.guestRecord(state,g)).join('')); }
function encounter() {
  if (state.phase === 'ended') return `<div class="event-art finale">${icon(state.won ? 'crown' : 'moon')}</div><span class="eyebrow">${state.won ? 'THE HOUSE CONCEDES' : 'THE CLOCK STRIKES TWELVE'}</span><h2>${state.won ? 'You open the door.' : 'Midnight catches up.'}</h2><div class="event-prose">${paragraph(state.won ? 'You press all three seals into the lock and turn the handle. On the other side, the café looks as you left it. You stand in the doorway for a moment, checking what follows you through.' : 'The last bell rings before you reach the Door. The board folds itself shut. You are back beside the café counter, but the shape caught in the dark window is still yours. You turn toward it slowly.')}</div>${V.formReport(state)}${H.ending(state)}<div class="final-score"><strong>${G.score(state)}</strong><span>FINAL SCORE<br>${state.seals.length}/3 seals · ${state.totalChanges} changes</span></div>${button('new', 'Another strange evening ' + icon('arrow'), 'primary')}<p class="small muted">Keep the seed to try this board again.</p>`;
  if (state.phase === 'result') {
    const r = state.result, trait = G.TRAITS.find(t => t.id === r.trait), check = r.check;
    return `<div class="event-art result-art">${icon(trait?.icon || (check?.success ? 'crown' : 'stars'))}<span class="orbit orbit-one"></span><span class="orbit orbit-two"></span></div><span class="eyebrow">${trait ? 'SOMETHING HAS CHANGED' : check ? (check.success ? 'SUCCESSFUL CHECK' : 'CHECK RESULT') : 'YOUR EVENING CONTINUES'}</span><h2>${esc(r.title)}</h2>${check ? `<div class="check-result ${check.success ? 'success' : ''}"><div class="check-dice">${(check.rolls || [check.rolled]).map(d=>dieFace(d)).join("")}</div><span>${check.count>1?"Keep ":check.onesHigh && check.rolls?.includes(1)?"1 becomes ":""}${check.rolled} + ${check.bonus} = <b>${check.rolled + check.bonus}</b><small>Target ${check.target} · ${check.success ? 'Success' : 'Miss'}</small></span></div>` : ''}<div class="event-prose result-prose">${paragraph(r.text)}</div>${trait?V.illustration(trait.id):""}${(r.combos||[]).map(id=>{const c=G.COMBINATIONS.find(c=>c.id===id);return `<div class="unlocked-combo"><small>COMBINATION FORMED</small><strong>${c.name}</strong><p>${V.activeRule(state,c)}</p></div>`;}).join("")}${button('next', (state.turn === G.MAX_TURNS ? 'Hear the final bell' : 'Back to the board') + icon('arrow'), 'primary')}`;
  }
  if (state.phase === 'encounter') {
    const t = state.pending.type;
    return `<div class="event-art type-${t}">${icon(G.TILE_ICONS[t])}<span class="orbit orbit-one"></span><span class="orbit orbit-two"></span></div><div class="event-kicker"><span class="eyebrow">SPACE ${String(state.position + 1).padStart(2,'0')}</span><span class="power-chip">${icon('bolt')} ${state.power} power</span></div><h2>${G.TILES[state.position].name}</h2>${H.featured(state)?'':`<div class="event-prose"><p>${descriptions[t]}</p></div>`}${H.encounterGuests(state)}${H.featured(state)?`<details class="usual-actions" ${G.commandedAction(state)?'open':''}><summary>${({market:'Browse the stall instead',rest:'Sit down or help with the tips',fortune:'Take the coins or try the bag',mirror:'Look at the other changes',trial:'Challenge a seal instead',chaos:'Open the wild box instead'})[t]}</summary><div class="choices">${choices()}</div></details>`:`<div class="choices">${choices()}</div>`}`;
  }
  if (state.phase === 'rolled') {
    const target=G.TILES[G.destination(state)];
    return '<span class="eyebrow">ASSIGN YOUR DICE</span><h2>Two dice.<br>Your call.</h2><div class="event-prose"><p>Take the long way with a weaker check, or save the higher die for what waits at the end.</p></div><div class="route-options" role="group" aria-label="Choose your movement die">'+[0,1].map(index=>{
      const current=index===state.moveIndex, candidate=current?state:{...state,moveIndex:index,adjustment:0,gliding:false};
      const tile=G.TILES[G.destination(candidate)], move=G.movement(candidate), power=G.power(candidate);
      const wins=state.seals.length===3 && state.position+move>=24;
      const info=tile.type==='trial'?(state.seals.length===3?'You have every seal. Keep going toward the Door.':G.TRIALS.filter(t=>!state.seals.includes(t.id)).map(t=>G.STATS[t.stat]+' '+G.checkChance({...candidate,power},t.stat)+'%').join(' · ')):tile.type==='fortune'?'Charm gamble · '+G.checkChance({...candidate,power},'charm',false)+'%':tileHelp[tile.type];
      return '<button type="button" class="route-option '+(current?'selected':'')+'" data-action="route:'+index+'" aria-pressed="'+current+'"><span class="route-letter">'+(index===0?'A':'B')+'</span><span><small>'+(current?'SELECTED ROUTE':'ALTERNATE ROUTE')+'</small><strong>'+(wins?'The way out':tile.name)+'</strong><span>'+spaces(move)+' / '+power+' power</span><small class="route-rule">'+(wins?'Cross the Door with all three seals to win.':info)+'</small></span><span class="route-check">'+(current?'●':'○')+'</span></button>';
    }).join('')+'</div>'+H.routeNote(state,target.type)+'<p class="route-footnote">Switching routes clears movement adjustments. Use the dice controls when you’re ready to move.</p>';
  }
  if (state.turn > 0) {
    const remaining=G.TRIALS.filter(t=>!state.seals.includes(t.id));
    return `<div class="event-art">${icon(state.seals.length===3?'door':'moon')}<span class="orbit orbit-one"></span><span class="orbit orbit-two"></span></div><span class="eyebrow">${G.MAX_TURNS-state.turn} TURNS UNTIL MIDNIGHT</span><h2>${state.seals.length===3?'Find the Door.':'Before the next roll'}</h2><div class="event-prose"><p>${state.seals.length===3?`You have every seal. The Door is ${24-state.position} spaces ahead; land on it or cross it to claim your prize.`:'You put the dice down beside your notes. There are still gaps on the page, and a few changes you have yet to understand.'}</p></div><div class="remaining-trials">${remaining.map(t=>`<div>${icon(t.icon)}<span><strong>${t.name}</strong><small>${G.STATS[t.stat]}: ${G.stats(state)[t.stat]} · target ${G.trialTarget(state)}</small></span></div>`).join('')}</div><div class="tip">${icon('stars')}<p>${state.seals.length===3?'Choose a larger movement die to reach the exit sooner.':state.forms.length<3?'Free changes wait on moth, mirror, and wild squares. Build a few useful traits before chasing every seal.':'Layering costs 2 luck and deepens the traits already there. Mirrors can push your whole form further.'}</p></div>`;
  }
  return `<div class="event-art invitation">${icon('moth')}<span class="orbit orbit-one"></span><span class="orbit orbit-two"></span><span class="tiny-star">✦</span></div><span class="eyebrow">READ BEFORE PLAY</span><h2>The box under<br>the counter</h2><div class="event-prose"><p>You find the game while reaching for a clean cloth. Inside the worn box, a brass moth sits between two dice. There is a folded note beneath it.</p><p class="quote">“Collect the three seals.<br>Return to the Door before the eighteenth turn ends.”</p><p>You set the moth on the first square. It walks to the edge and waits for your hand to move. Three names are pencilled on the lid: Edda, Ivo, Mr. Rook. Beside them, in smaller writing: “Get a receipt.”</p></div><div class="objective"><span>${icon('crown')}</span><p><strong>Collect 3 different seals.</strong><br>Then pass the Door before turn 18 ends.</p></div><div class="tip">${icon('stars')} <p>${state.phase === 'rolled' ? 'One die moves you. The other adds power to trial and fortune checks. Swap them to change your destination.' : state.seals.length === 3 ? 'All three seals are yours. Choose big movement rolls and cross the Door to win.' : 'Changes build your stats. Crown spaces let you challenge any seal you still need.'}</p></div>`;
}
function render() {
  const rolled=state.phase==='rolled', canRoll=state.phase==='ready';
  const nextTile=rolled?G.TILES[G.destination(state)]:null;
  const focusAction=document.activeElement?.dataset?.action;
  app.innerHTML = '<header class="topbar"><a class="brand" href="./" aria-label="Hex and Honey"><h1>Hex <i>&</i> Honey<span class="brand-dot">.</span></h1><small>A SECOND NATURE GAME</small></a><nav aria-label="Game tools">'+button('collection',icon('book')+'<span>Form book</span>','nav-button')+button('journal',icon('journal')+'<span>Journal</span>','nav-button journal-nav')+button('rules','<span class="help-mark">?</span><span>Rules</span>','nav-button')+button('sound',icon(sound?'volume':'mute'),'icon-button sound-button')+button('new','New game','outline-button')+'</nav></header>'+
  '<main><div class="run-strip"><div class="turn-counter"><span>TURN</span><strong>'+String(Math.min(state.turn+(canRoll||rolled?1:0),G.MAX_TURNS)).padStart(2,'0')+'</strong><span>/ '+G.MAX_TURNS+'</span></div>'+B.seals(state)+'<div class="resources"><span title="Gold buys changes and luck">'+icon('coin')+'<b>'+state.gold+'</b> gold</span><span title="Spend luck on rerolls and layers">'+icon('stars')+'<b>'+state.luck+'</b> luck</span></div></div>'+
  '<nav class="table-jumps" aria-label="Table sections"><a href="#board">01 Board</a><a href="#encounter">02 Decision</a><a href="#form">03 Your form</a></nav>'+
  '<div class="game-layout phase-'+state.phase+'"><section id="board" class="table-section" aria-label="Game board"><div class="table-heading"><span><b>01</b> THE HOUSE</span>'+button('board-view',boardMode==='ink'?'View illustration ↗':'View graphic board ↗','view-switch')+'</div>'+B.board(state,boardMode)+
  '<div class="play-controls"><div class="dice-tray '+(busy?'rolling':'')+'"><div class="dice-pair"><div>'+dieFace(state.dice[state.moveIndex],'move-die')+'<span>Movement</span></div>'+button('swap',icon('swap'),'swap-button',!rolled||busy)+'<div>'+dieFace(state.dice[1-state.moveIndex],'power-die')+'<span>Power</span></div></div><div class="roll-controls">'+(canRoll?button('roll','Roll the dice '+icon('arrow'),'primary roll-button',busy):rolled?button('move','Move '+spaces(G.movement(state))+' '+icon('arrow'),'primary roll-button',busy):'<span class="awaiting-choice">'+(state.phase==='ended'?'The evening is over.':'Your move is made.<br>Choose what happens next.')+'</span>')+(rolled?button('reroll','Reroll both <span>'+ (G.rerollCost(state)?'1 luck':'Free this turn')+'</span>','reroll-button',state.luck<G.rerollCost(state)||busy):'<p class="dice-hint">One die moves you. One powers your checks.</p>')+'</div></div>'+V.abilities(state)+'<div class="destination-line">'+(rolled?'<span>'+icon(G.TILE_ICONS[nextTile.type])+' '+nextTile.name+' · space '+(nextTile.id+1)+'</span><strong>'+G.power(state)+' power</strong>':'<span>Three seals. Back to the Door. Eighteen turns.</span>')+'</div></div>'+V.turnTrack(state)+
  '</section><aside id="encounter" class="encounter-panel" aria-label="Current encounter"><div class="panel-label"><span><b>02</b> '+(state.phase==='result'?'THE AFTERMATH':state.phase==='ended'?'THE END':state.phase==='encounter'?'YOUR ENCOUNTER':'YOUR DECISION')+'</span><span class="phase-dot"></span></div><div class="event-content">'+V.mindPanel(state)+encounter()+'</div></aside></div>'+
  V.playerSheet(state)+'<div class="under-table">'+H.guestStrip(state)+'<details class="board-key"><summary>Read the board</summary><div class="board-legend">'+['change','trial','fortune','chaos','market','rest','mirror'].map(t=>'<span>'+icon(G.TILE_ICONS[t])+({change:'Change',trial:'Trial',fortune:'Fortune',chaos:'Wild',market:'Market',rest:'Rest',mirror:'Mirror'})[t]+'</span>').join('')+'</div><p>Follow the numbered line. The red piece is you; the outlined piece is your selected destination. Letters mark guests with something to return.</p></details></div>'+
  '<footer><span>'+(storageAvailable?'Saved as you play':'Autosave unavailable · keep this tab open')+'</span><a href="../">Second Nature '+icon('arrow')+'</a></footer></main>';
  document.querySelector('.sound-button').setAttribute('aria-label',sound?'Mute game sounds':'Enable game sounds');
  document.querySelector('.sound-button').setAttribute('aria-pressed',String(sound));
  document.querySelector('.swap-button').setAttribute('aria-label','Swap movement and power dice');
  for(const [action,label] of [['collection','Form book'],['journal','Journal'],['rules','How to play']])app.querySelector('[data-action="'+action+'"]').setAttribute('aria-label',label);
  for(const el of app.querySelectorAll('[data-action^="choose:"]')) { const reason=G.choicePressure(state,el.dataset.action.slice(7)); if(reason) {el.disabled=true;el.insertAdjacentHTML('beforeend','<small class="pressure-reason">'+reason+'</small>');} }
  if(rolled) { app.querySelector('.swap-button').disabled=busy||!G.routeAllowed(state,1-state.moveIndex); for(const el of app.querySelectorAll('[data-action^="route:"]')) { const allowed=G.routeAllowed(state,Number(el.dataset.action.slice(6))); el.disabled=!allowed; if(!allowed)el.insertAdjacentHTML('beforeend','<small class="pressure-reason">'+(state.command?.kind==='route'?'The command forces the shorter route.':'Dream logic holds you to the longer route.')+'</small>'); } }
  maskNumbers(app);
  if(focusAction)[...app.querySelectorAll('[data-action]')].find(el=>el.dataset.action===focusAction&&!el.disabled)?.focus({preventScroll:true});
}
function showDialog(title, body, cls = '') {
  dialog.className = cls;
  dialog.innerHTML = `<div class="dialog-heading"><h2 id="dialog-title">${title}</h2>${button('close','×','close-button')}</div>${body}`;
  dialog.querySelector('.close-button').setAttribute('aria-label','Close dialog');
  maskNumbers(dialog);
  if (!dialog.open) dialog.showModal();
  dialog.scrollTop=0;
}
function maskNumbers(root) {
  if(G.numbersReadable(state)) return;
  const walker=document.createTreeWalker(root,NodeFilter.SHOW_TEXT);
  let node; while(node=walker.nextNode()) if(!['SCRIPT','STYLE','INPUT','TEXTAREA'].includes(node.parentElement?.tagName)) node.textContent=node.textContent.replace(/\d+/g,'?');
  for(const el of root.querySelectorAll('[aria-label],[title]')) {
    for(const attr of ['aria-label','title']) if(el.hasAttribute(attr)) {
      let text=el.getAttribute(attr);
      if(el.classList.contains('die')) text=text.replace(/\d/g,n=>['zero','one','two','three','four','five','six'][n]);
      el.setAttribute(attr,text.replace(/\d+/g,'?'));
    }
  }
}
function rules() { showDialog('How to play', `<p class="dialog-intro">You play Mara, 26, inside an impossible game found beneath the café counter. This standalone evening has its own save.</p><ol class="rules-list"><li><strong>Roll two dice.</strong> Use one to follow the numbered route and the other as power. Swap them before moving, or spend 1 luck to reroll both.</li><li><strong>Build a stranger body.</strong> Changes add Nerve, Charm, or Wonder. You have six slots, including your mind. A new trait normally replaces everything in its slot; repeating a trait advances it up to stage 4. Spend 2 luck to add a layer and deepen the traits already in that slot. Hold up to three traits per slot and ten overall. Mirrors can deepen your whole form for 2 luck.</li><li><strong>Combine your traits.</strong> The form book lists ${G.COMBINATIONS.length} combinations. Their abilities work while you hold every required trait. Replacements show the abilities you lose. Movement controls appear below the dice; swapping or rerolling clears movement adjustments. Turning a die and taking a free reroll each have a separate once-per-turn limit.</li><li><strong>Notice what your mind wants.</strong> Collector’s hunger adds an offer but favors unfamiliar changes; Dream logic gives a free reroll but demands the larger movement die; Chorus mind gives two trial dice but favors your strongest remaining trial. Clear your head to choose freely for the rest of the turn. This costs 1 luck, or 2 with a stage 3–4 mental trait. Some physical combinations make it free. Benefits remain active. Planted commands override those urges and cannot be cleared: they force a later route, bottle, or trial. Soft focus hides printed numbers while granting luck; Cold calculus restores reading and improves every check.</li><li><strong>Decide who can borrow a change.</strong> Edda waits at markets, Ivo at rest spaces, and Mr. Rook at fortune spaces. A loan removes its trait and pays 2 gold. Meet the guest again at the location on the ticket for a stronger trait and a compatible change. Each step uses that encounter; all favors are optional. Tickets below the board show where to collect.</li><li><strong>Win three different seals.</strong> On any crown square, choose a trial. A fresh D6 + your power + the matching stat must reach the target. The odds include your active combination effects.</li><li><strong>Get out before midnight.</strong> With all three seals, land on or pass the Door to win. You have 18 turns. Earlier laps pay 3 gold.</li></ol><div class="rules-grid"><p>${icon('coin')}<strong>Gold</strong> Changes cost 3 at the market, 2 with Long reach, or 1 with Open-handed. Two gold buys two luck.</p><p>${icon('stars')}<strong>Luck</strong> Spend it on rerolls and layers. You can hold up to 9.</p></div><p class="small muted">Score: 100 per seal + 15 per change + 3 per gold + 40 per completed favor. Escaping adds 150 + 10 per unused turn. Press Space to roll. Sound starts muted. Your game saves after every decision.</p>${button('close','I’m in '+icon('arrow'),'primary')}`); }
function newGameDialog() { showDialog('Another strange evening', `<p class="dialog-intro">Choose what you bring to the table. Starting a new evening replaces this board’s autosave.</p><form id="new-game-form"><fieldset><legend>Your opening advantage</legend>${Object.entries(G.BOONS).map(([id,b])=>`<label class="boon-choice"><input type="radio" name="boon" value="${id}" ${id===state.boon?'checked':''}><span><strong>${b.name}</strong><small>${b.text}</small></span></label>`).join('')}</fieldset><label class="seed-label" for="seed">A name for your luck <span>optional seed</span></label><input id="seed" name="seed" maxlength="40" placeholder="Leave empty for a fresh shuffle" autocomplete="off"><p class="small muted">Current seed: <code>${esc(state.seed)}</code>. The same seed, advantage, and decisions reproduce a game under the current rules.</p><button class="primary" type="submit">Open the box ${icon('arrow')}</button></form>`); }
function collection() { showDialog('Form book', `${button('combinations','See the combination recipes '+icon('arrow'),'paper-button book-recipes-link')}<p class="dialog-intro">${state.seen.length} of ${G.TRAITS.length} changes discovered this evening. You can hold ten traits, with at most three in each slot and four stages per trait. The illustrations show where changes can lead; open a trait to read each stage.</p><div class="collection-grid">${G.TRAITS.map(t=>`<button type="button" data-action="trait:${t.id}" class="collection-item ${state.seen.includes(t.id)?'discovered':''}">${traitArt(t.id)}<strong>${t.name}</strong><small>${t.slot} · +1 ${G.STATS[t.stat]}</small><p>${state.seen.includes(t.id)?t.detail:'Still waiting somewhere on the board.'}</p>${G.MIND_RULES[t.id]?'<p class="mind-warning">'+G.MIND_RULES[t.id]+'</p>':''}</button>`).join('')}</div>`, 'wide-dialog'); }
async function act(action) {
  if (busy) return;
  if (action==='close') { dialog.close(); return; }
  if (action==='rules') return rules();
  if (action==='new') return newGameDialog();
  if (action==='collection') return collection();
  if (action==='form-report') return showDialog('Your reflection',V.formReport(state),'wide-dialog');
  if (action==='combinations') return showDialog('Form book — combinations',button('collection','Back to illustrated traits','paper-button book-recipes-link')+V.formBook(state),'wide-dialog');
  if (action.startsWith('combo:')) { const c=G.COMBINATIONS.find(c=>c.id===action.slice(6)); return showDialog(c.name,`<span class="eyebrow">${c.timing}</span><div class="combo-plates">${c.needs.map(id=>button('trait:'+id,traitArt(id)+'<span>'+G.TRAITS.find(t=>t.id===id).name+'</span>','combo-plate')).join('')}</div><p class="combo-requirements">${c.needs.map(id=>G.TRAITS.find(t=>t.id===id).name).join(' + ')}</p><div class="unlocked-combo"><p>${V.activeRule(state,c)}</p></div><div class="event-prose">${paragraph(c.text)}</div>${button('combinations','Back to combinations','paper-button')}`); }
  if (action==='guests') return guests();
  if (action.startsWith('guest:')) { const g=G.GUESTS.find(g=>g.id===action.slice(6)); return showDialog(g.name,H.guestRecord(state,g)); }
  if (action==='journal') return showDialog('Your journal',state.log.length ? `${button('guests','House guests & claim tickets','paper-button')}<div class="journal">${state.log.map(l=>`<article><span class="eyebrow">TURN ${l.turn}</span><h3>${esc(l.title)}</h3>${paragraph(l.text)}</article>`).join('')}</div>` : '<p class="dialog-intro">You open the notebook to a clean page.</p>'+button('guests','Meet the House guests','paper-button'));
  if (action==='board-view') { boardMode=boardMode==='ink'?'house':'ink'; try {localStorage.setItem('hex-and-honey.board-view',boardMode);} catch {} render(); return; }
  if (action==='sound') { sound=!sound; tone(); render(); return; }
  if (action.startsWith('tile:')) {
    inspected = G.TILES[Number(action.split(':')[1])];
    return showDialog(inspected.name,`<div class="tile-inspection">${icon(G.TILE_ICONS[inspected.type])}<span class="eyebrow">SPACE ${inspected.id+1} · FOLLOW THE NUMBERS</span><p>${tileHelp[inspected.type]}</p></div>${H.routeNote(state,inspected.type)}${G.guestsAt(state,inspected.type).map(g=>button('guest:'+g.id,g.name+' · '+g.title,'paper-button')).join('')}`);
  }
  if (action.startsWith('trait:')) { const id=action.slice(6), trait=G.TRAITS.find(t=>t.id===id); if(trait) return showDialog(trait.name,V.traitDetail(state,id)+button('collection','Back to the form book','paper-button'),'wide-dialog'); }
  let changed=false;
  if ((action==='roll' && state.phase==='ready') || (action==='reroll' && state.phase==='rolled' && state.luck>=G.rerollCost(state))) {
    busy=true; render(); tone([220,293,349,440]);
    await new Promise(r=>setTimeout(r,window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 0 : 360));
    changed=action==='roll'?G.roll(state):G.reroll(state); busy=false;
    if (changed) announce(`You roll ${state.dice.join(' and ')}. Choose your movement die.`);
  } else if (action.startsWith('route:') && state.phase==='rolled') { const index=Number(action.slice(6)); if([0,1].includes(index) && index!==state.moveIndex) changed=G.swap(state); }
  else if (action==='steady') changed=G.steady(state);
  else if (action==='swap') changed=G.swap(state);
  else if (action==='glide') changed=G.glide(state);
  else if (action==='flip') changed=G.flip(state);
  else if (action.startsWith('adjust:')) changed=G.adjust(state,Number(action.slice(7)));
  else if (action==='move') { changed=G.move(state); if(changed) { tone([293,392]); announce(`Space ${state.position+1}: ${G.TILES[state.position].name}. ${state.power} power.`); } }
  else if (action==='next') changed=G.next(state);
  else if (action.startsWith('choose:')) { changed=G.resolve(state,action.slice(7)); if(changed) { tone(state.result.check?.success===false?[293,220]:[392,493,587]); announce(state.result.title); } }
  if (changed) { save(); render();
    if(action==='move'||action.startsWith('choose:')) { const el=app.querySelector('.mind-pressure') || app.querySelector('.event-content h2'); el.tabIndex=-1; el.focus({preventScroll:true}); if(window.innerWidth<1000) el.scrollIntoView({behavior:'smooth',block:'start'}); }
    if(action==='next') { const rollButton=app.querySelector('[data-action="roll"]'); rollButton?.focus({preventScroll:true}); if(window.innerWidth<1050) app.querySelector('.dice-tray').scrollIntoView({behavior:'smooth',block:'center'}); }
    if(action==='roll'||action==='reroll') app.querySelector('[data-action="move"]')?.focus({preventScroll:true});
  }
}
app.addEventListener('click',e=>{const target=e.target.closest('[data-action]');if(target)act(target.dataset.action);});
dialog.addEventListener('click',e=>{const target=e.target.closest('[data-action]');if(target)act(target.dataset.action);});
dialog.addEventListener('submit',e=>{if(e.target.id!=='new-game-form')return;e.preventDefault();const data=new FormData(e.target);state=G.createGame(String(data.get('seed')).trim()||undefined,String(data.get('boon')));dialog.close();save();render();announce('A new evening begins.');});
document.addEventListener('keydown',e=>{if(e.code==='Space' && !dialog.open && !['BUTTON','INPUT','SELECT','TEXTAREA','A'].includes(document.activeElement.tagName) && state.phase==='ready') {e.preventDefault();act('roll');}});
render();
if(recoveryNotice) showDialog('A fresh page', '<p class="dialog-intro">The previous board save could not be read. You begin a fresh evening. Your Second Nature story saves are separate.</p>'+button('close','Open the box','primary'));
