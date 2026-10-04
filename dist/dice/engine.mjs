import { COMBINATIONS, GROWTH } from './combinations.mjs';
import { GUESTS, LOAN_TEXT, RETURN_TEXT } from './guests.mjs';
import { EXTRA_TRAITS, FORM_DETAILS, COMPOSITE_DETAILS, STAGE_THREE_DETAILS } from './deep-forms.mjs';
export { COMBINATIONS, GUESTS, GROWTH };
export const VERSION = 4;
export const MAX_STAGE = 4, MAX_FORMS = 10, MAX_LAYERS = 3;
export const MAX_TURNS = 18;
export const SAVE_KEY = 'hex-and-honey.v1';
export const STATS = { nerve: 'Nerve', charm: 'Charm', weird: 'Wonder' };
export const MIND_RULES = {
  appetite:'You see one extra transformation offer. When you can afford a new trait, the hunger blocks familiar offers and quiet alternatives until you clear your head.',
  reverie:'Your first reroll each turn is free. The higher die must move you until you clear your head; equal dice leave both routes open.',
  chorus:'Roll two dice for trials and keep the higher. The chorus only lets you attempt your strongest remaining trial until you clear your head. Ties leave a choice.',
  hypnosis:'Taking or deepening this trait plants a later command. You must obey when it triggers; clearing your head cannot cancel it. At deep stages it asks twice. A new command replaces the previous one.',
  dim:'Printed numbers become unreadable. Dice pips still make sense. Gain 1 luck when this deepens and at the start of each turn. Clearing your head does not restore reading.',
  calculus:'Gain +1 on every check, or +2 at stage 3–4. Printed numbers become readable even with Soft focus. Other pressures still apply.',
};
export const TRAITS = [
  { id: 'antlers', name: 'Moonlit antlers', slot: 'crown', stat: 'nerve', icon: 'antlers', text: 'Two points press against your scalp. You raise a hand and find smooth branches, cool as a windowsill at night. They keep growing after you take your hand away. You hold still until the pressure eases, then turn your head. One tip catches the lampshade. You duck, careful of the other.', detail: 'Pale branches catch the light above your brass hair clip.' },
  { id: 'fox', name: 'Fox ears', slot: 'crown', stat: 'charm', icon: 'fox', text: 'Your ears climb through your hair and turn toward a coin dropping three tables away. You try to keep them still. One flicks toward a compliment anyway. That is going to make bluffing difficult.', detail: 'Copper ears give away far more than your face does.' },
  { id: 'halo', name: 'Brass halo', slot: 'crown', stat: 'weird', icon: 'sun', text: 'A thin brass ring lifts from the table and hangs above your head. You move sideways; it follows without tilting. When you reach up, your fingers pass through a patch of warmth. The ring hums behind your teeth. You close your mouth, but that does nothing to quiet it.', detail: 'A narrow brass ring hangs just above your hair.' },
  { id: 'honey', name: 'Living honey', slot: 'skin', stat: 'charm', icon: 'drop', text: 'Amber spreads across your knuckles. You press one finger into the other hand; the dent slowly closes behind it. Your sleeve still sits where a sleeve should. You check underneath anyway. Light passes straight through your wrist, and your next breath catches.', detail: 'Your amber hands hold their shape, most of the time.' },
  { id: 'porcelain', name: 'Porcelain glaze', slot: 'skin', stat: 'nerve', icon: 'diamond', text: 'The backs of your hands turn white. Blue leaves open beneath the glaze, one fine line at a time. You tap a knuckle against your glass and hear two clear notes. You put the glass down very carefully.', detail: 'Blue flowers travel under white porcelain as you move.' },
  { id: 'stars', name: 'Starfield skin', slot: 'skin', stat: 'weird', icon: 'stars', text: 'You mistake the first light beneath your skin for a reflection. Then it drifts past your wrist. You cover it with your other hand and the light shines through both. A tiny constellation gathers around an old freckle. You still know which freckle.', detail: 'Little constellations rearrange themselves around your freckles.' },
  { id: 'velvet', name: 'Velvet voice', slot: 'voice', stat: 'charm', icon: 'music', text: '“Absolutely not,” you say. The words come out lower than you expect, with a resonance you feel against your collar. You clear your throat and try your name. It sounds good. That makes it harder to ask for your old voice back, though you keep a hand pressed to your throat.', detail: 'Your voice carries across a crowded room without rising.' },
  { id: 'bells', name: 'Bell chorus', slot: 'voice', stat: 'nerve', icon: 'bell', text: 'A bright chord escapes when you laugh. You close your mouth. The last note hangs there anyway. You test a whispered word against your palm and feel it ring through your fingers. Quiet may take practice.', detail: 'A small chorus of bells backs up every word you say.' },
  { id: 'echo', name: 'Tomorrow’s echo', slot: 'voice', stat: 'weird', icon: 'moon', text: 'You hear yourself say “Oh, come on” a moment before you say it. You hold your breath. The next word reaches you anyway, faint but unmistakably yours. You keep your mouth shut until it passes, then let out the air slowly. This time the sound arrives when you make it.', detail: 'You hear the beginning of a sentence before you speak.' },
  { id: 'moth', name: 'Moth wings', slot: 'limbs', stat: 'weird', icon: 'moth', text: 'Something unfolds between your shoulder blades. You reach back and brush a broad wing, dry and light as folded paper. Its twin opens against your sleeve. The overhead bulb suddenly seems much too interesting. You turn your chair away from it.', detail: 'Ink-dark wings open into wide, gold-speckled fans.' },
  { id: 'clockwork', name: 'Clockwork hands', slot: 'limbs', stat: 'nerve', icon: 'gear', text: 'Your smallest finger clicks. Then the next. Brass joints fit themselves under your skin until every bend ends with a tiny, exact stop. You pick up a die without looking. You could get used to the precision. You wish that thought had waited.', detail: 'Brass fingers never tremble when you place a wager.' },
  { id: 'ribbons', name: 'Ribbon arms', slot: 'limbs', stat: 'charm', icon: 'ribbon', text: 'Your fingers flatten into long green ribbons. You pull them apart, alarmed, and they braid themselves back into a hand. The next attempt holds. You reach across the whole table for your drink, then stare at the distance you just covered.', detail: 'Green ribbons braid into hands when you need them.' },
  { id: 'tail', name: 'Fox tail', slot: 'shadow', stat: 'charm', icon: 'tail', text: 'A copper tail slips out behind your chair and winds around a leg. You stand; the chair comes with you. You sit again, face hot, and concentrate on uncurling it. You can feel the varnish through the fur. The tip keeps tapping against the floor even after you get it free.', detail: 'A copper tail curls around your chair when you sit.' },
  { id: 'shadow', name: 'Independent shadow', slot: 'shadow', stat: 'weird', icon: 'moon', text: 'Your shadow stands while you remain seated. You put a hand flat on the table and watch its hand stay at its side. Then it reaches toward the dice. You feel a faint pull in your own wrist, as if someone is guiding it from across the room. You draw your hand back and the shadow stops.', detail: 'Your shadow moves ahead of you, still connected at your feet.' },
  { id: 'roots', name: 'Walking roots', slot: 'shadow', stat: 'nerve', icon: 'leaf', text: 'Fine roots thread out below your shoes. You lift one foot and watch them curl back before they catch the carpet. The floor feels suddenly legible: a loose board, a dropped coin, someone tapping a heel. You keep your feet tucked close while you sort it out.', detail: 'Fine roots feel the room shift before your eyes catch up.' },
];
TRAITS.push(...EXTRA_TRAITS);
export const TRIALS = [
  { id: 'brass', name: 'The Brass Beast', stat: 'nerve', icon: 'antlers', text: 'A brass beast lowers its antlers across the path. You could duck. Its grin suggests it knows that. You square your shoulders instead.' },
  { id: 'velvet', name: 'The Velvet Court', stat: 'charm', icon: 'crown', text: 'Every mask in the little court turns toward you. A vacant throne scrapes forward. You have one entrance to convince them it belongs to you.' },
  { id: 'moon', name: 'The Impossible Moon', stat: 'weird', icon: 'moon', text: 'The moon sits in a teacup. Its reflection hangs overhead. You reach toward the cup and feel the light above you shift. You have to lift one without disturbing the other.' },
];
const pattern = ['door', 'change', 'fortune', 'trial', 'market', 'change', 'chaos', 'trial', 'rest', 'change', 'fortune', 'trial', 'mirror', 'change', 'market', 'trial', 'chaos', 'change', 'rest', 'trial', 'fortune', 'mirror', 'change', 'trial'];
export const TILES = pattern.map((type, id) => ({ id, type, name: ({ door: 'The Door', change: 'Metamorphosis', fortune: 'Fortune', trial: 'House trial', market: 'Night market', chaos: 'Wild magic', rest: 'Breathing room', mirror: 'Looking glass' })[type] }));
export const TILE_ICONS = { door: 'door', change: 'moth', fortune: 'stars', trial: 'crown', market: 'bag', chaos: 'bolt', rest: 'moon', mirror: 'diamond' };
export const BOONS = { curious: { name: 'Pocket tokens', text: 'Begin with 2 extra luck for rerolls or layering.' }, daring: { name: 'Steady hands', text: 'Begin with 1 extra Nerve for trials.' }, gilded: { name: 'Tip money', text: 'Begin with 5 extra gold for the market.' } };
export function seedNumber(seed) {
  let h = 2166136261;
  for (const char of String(seed)) h = Math.imul(h ^ char.charCodeAt(0), 16777619);
  return h >>> 0 || 1;
}
function random(s) { s.rng ^= s.rng << 13; s.rng ^= s.rng >>> 17; s.rng ^= s.rng << 5; s.rng >>>= 0; return s.rng / 4294967296; }
function die(s) { return Math.floor(random(s) * 6) + 1; }
function sample(s, array) { return array[Math.floor(random(s) * array.length)]; }
export function createGame(seed = Date.now().toString(36), boon = 'curious') {
  if (!BOONS[boon]) boon = 'curious';
  seed = String(seed).slice(0, 40);
  return { version: VERSION, seed, rng: seedNumber(seed), boon, phase: 'ready', turn: 0, position: 0,
    gold: boon === 'gilded' ? 11 : 6, luck: boon === 'curious' ? 4 : 2, dice: [1, 1], moveIndex: 0, power: 0,
    forms: [], seals: [], seen: [], pending: null, result: null, log: [], totalChanges: 0, won: false,
    adjustment: 0, gliding: false, flipped: false, freeRerollUsed: false, knownCombos: [], favors: [], grounded: false, command: null };
}
export function favor(s, id) { return s.favors.find(f => f.id === id); }
export function guestsAt(s, type) {
  return GUESTS.filter(g => favor(s,g.id)?.status === 'lent' ? g.to === type : g.from === type);
}
export function waitingGuests(s, type) { return GUESTS.filter(g => g.to === type && favor(s,g.id)?.status === 'lent'); }
export function loanPreview(s, id) {
  const forms=s.forms.filter(f=>f.id!==id), after={...s,forms};
  return { forms, lost:combinations(s).filter(c=>!hasCombo(after,c.id)) };
}
// Compute the entire fitting before changing state. A full fitting follows the
// usual slot replacement rule; a layered fitting preserves every current trait.
export function fitting(s, guestId, mode='full') {
  const g=GUESTS.find(g=>g.id===guestId), ticket=favor(s,guestId);
  if(!g || ticket?.status!=='lent' || !['full','layer','plain'].includes(mode)) return null;
  let forms=s.forms.map(f=>({...f})), cost=0;
  const additions=[{id:ticket.trait,level:Math.min(MAX_STAGE,ticket.level+1)}];
  if(mode!=='plain') additions.push({id:g.partners[ticket.trait],level:1});
  const slots=new Set(additions.map(f=>TRAITS.find(t=>t.id===f.id).slot));
  for(const slot of slots) {
    const requested=additions.filter(f=>TRAITS.find(t=>t.id===f.id).slot===slot);
    const existing=forms.filter(f=>TRAITS.find(t=>t.id===f.id).slot===slot);
    const newTrait=requested.some(f=>!existing.some(n=>n.id===f.id));
    if(newTrait) {
      const displaced=existing.filter(f=>!requested.some(n=>n.id===f.id));
      if(mode==='layer') { if(displaced.length) cost+=2; }
      else forms=forms.filter(f=>!displaced.includes(f));
    }
    if(mode==='layer' && newTrait) for(const form of existing.filter(f=>!requested.some(n=>n.id===f.id))) form.level=Math.min(MAX_STAGE,form.level+1);
    for(const addition of requested) {
      const same=forms.find(f=>f.id===addition.id);
      if(same) same.level=Math.max(same.level,addition.level);
      else forms.push({...addition});
    }
  }
  const after={...s,forms}, before=combinations(s), combos=combinations(after);
  const fits=forms.length<=MAX_FORMS && forms.every(f=>slotForms(after,f.id).length<=MAX_LAYERS);
  return { forms, additions, cost, fits, allowed:fits&&s.luck>=cost,
    deepened:forms.filter(f=>s.forms.some(old=>old.id===f.id && old.level<f.level) && !additions.some(a=>a.id===f.id)),
    removed:s.forms.filter(f=>!forms.some(n=>n.id===f.id)),
    gained:combos.filter(c=>!before.includes(c)), lost:before.filter(c=>!combos.includes(c)) };
}
export function combinations(s) { return COMBINATIONS.filter(c => c.needs.every(id => s.forms.some(f => f.id === id))); }
export function hasCombo(s, id) { return combinations(s).some(c => c.id === id); }
export function level(s,id) { return s.forms.find(f=>f.id===id)?.level || 0; }
export function canAdjust(s) { return hasCombo(s,'counterbalance') || hasCombo(s,'loose_outline') || hasCombo(s,'folded_map'); }
export function canGlide(s) { return hasCombo(s,'amber_wings') || hasCombo(s,'lantern_wings') || hasCombo(s,'sugar_lift'); }
export function canFlip(s) { return hasCombo(s,'second_hand') || hasCombo(s,'music_box') || hasCombo(s,'assembly'); }
export function freeGlide(s) { return hasCombo(s,'amber_kite') || hasCombo(s,'sugar_lift'); }
export function restBoth(s) { return hasCombo(s,'groundwire') || hasCombo(s,'tether'); }
export function glideDistance(s) { return hasCombo(s,'lantern_wings') ? 3 : 2; }
export function mindTraits(s) { return s.forms.filter(f=>TRAITS.find(t=>t.id===f.id).slot==='mind'); }
export function focusCost(s) {
  if(hasCombo(s,'grounded_dreams') || hasCombo(s,'private_room') || hasCombo(s,'clear_intervals')) return 0;
  return mindTraits(s).some(f=>f.level>=3) ? 2 : 1;
}
export function steady(s) {
  if(!['rolled','encounter'].includes(s.phase) || s.grounded || !mindTraits(s).length || s.luck<focusCost(s)) return false;
  s.luck-=focusCost(s); s.grounded=true; return true;
}
export function routeAllowed(s,index) {
  if(s.command?.kind==='route') return s.dice[index]<=s.dice[1-index];
  return s.grounded || !level(s,'reverie') || s.dice[index]>=s.dice[1-index];
}
export function numbersReadable(s) { return !level(s,'dim') || !!level(s,'calculus'); }
export function commandText(s) {
  if(!s.command) return '';
  return ({route:'At your next roll, use the smaller die for movement.',bottle:'At your next free change space, take the first offered trait. You may layer it.',trial:'At your next trial space, attempt your weakest remaining trial. If none remain, take the parting coin.'})[s.command.kind]+(s.command.remaining>1?' Obey twice.':' Obey once.');
}
export function commandedAction(s) {
  if(!s.command || s.phase!=='encounter' || s.turn<=s.command.issuedTurn) return null;
  if(s.command.kind==='bottle' && s.pending.type==='change') return s.pending.offers.find(id=>canTake(s,id)) || null;
  if(s.command.kind==='trial' && s.pending.type==='trial') return TRIALS.filter(t=>!s.seals.includes(t.id)).sort((a,b)=>stats(s)[a.stat]-stats(s)[b.stat])[0]?.id || 'leave';
  return null;
}
function fulfillCommand(s, rewarded=hasCombo(s,'clockwork_obedience'), gilded=hasCombo(s,'obedient_hands')) {
  if(!s.command) return;
  if(rewarded) s.luck=Math.min(9,s.luck+2);
  if(gilded) s.gold+=3;
  if(--s.command.remaining===0) s.command=null;
}
function alignDice(s) {
  if(!routeAllowed(s,s.moveIndex)) { s.moveIndex=1-s.moveIndex; s.adjustment=0; s.gliding=false; }
}
// Pressure only affects the stated decisions. Guest claims remain available.
export function choicePressure(s,action) {
  if(s.phase!=='encounter') return '';
  const forced=commandedAction(s);
  if(forced) return action===forced || action==='layer:'+forced ? '' : 'The implanted command leaves this choice out. Clearing your head cannot undo it.';
  if(s.grounded) return '';
  if(level(s,'appetite') && ['change','mirror','chaos','market'].includes(s.pending.type)) {
    const fresh=s.pending.offers.filter(id=>!level(s,id) && canTake(s,id));
    const affordable=s.pending.type!=='market' || s.gold>=marketPrice(s);
    const id=action.startsWith('layer:')?action.slice(6):action;
    if(fresh.length && affordable && (s.pending.offers.includes(id) && !fresh.includes(id) || ['decline','restore','deepen','luck','leave'].includes(action))) return 'The hunger insists on an unfamiliar change. Clear your head to choose this.';
  }
  if(level(s,'chorus') && s.pending.type==='trial') {
    const trials=TRIALS.filter(t=>!s.seals.includes(t.id)), values=stats(s);
    const best=Math.max(...trials.map(t=>values[t.stat]));
    if(trials.length && (action==='leave' || trials.some(t=>t.id===action && values[t.stat]<best))) return 'The chorus insists on your strongest remaining trial. Clear your head to choose this.';
  }
  return '';
}
export function deepenCost(s) { return hasCombo(s,'conservatory') ? 0 : 2; }
export function describeForm(s) {
  const body=[], mind=[];
  for(const slot of ['crown','skin','voice','limbs','shadow','mind']) {
    const forms=s.forms.filter(f=>TRAITS.find(t=>t.id===f.id).slot===slot);
    if(forms.length) (slot==='mind'?mind:body).push(forms.map(f=>f.level===3 && STAGE_THREE_DETAILS[f.id] || FORM_DETAILS[f.id][f.level>=3?1:0]).join(' '));
  }
  const interactions=COMPOSITE_DETAILS.filter(c=>c.needs.every(id=>level(s,id))).sort((a,b)=>b.needs.length-a.needs.length).slice(0,3).map(c=>c.text);
  if(level(s,'dim') && level(s,'calculus')) mind.push('The calculation gives meaning back to the written figures. You can feel the fog around it, but the numbers hold still while you read.');
  if(s.command) mind.push('One instruction remains unfinished: “'+commandText(s)+'” You remember its exact words even now.');
  return {body:body.length?body:['Your body still has its familiar weight and outline. You turn your hands over and find the same fingers, the same old marks.'],mind,interactions,
    summary:s.forms.length?`${s.forms.length} traits · ${s.forms.filter(f=>f.level>=3).length} at deep stages · ${combinations(s).length} combinations`:'Your familiar shape'};
}
export function slotForms(s, id) { return s.forms.filter(f => TRAITS.find(t => t.id === f.id).slot === TRAITS.find(t => t.id === id).slot); }
export function canLayer(s, id) { return slotForms(s,id).length > 0 && slotForms(s,id).length < MAX_LAYERS && !s.forms.some(f => f.id === id) && s.forms.length < MAX_FORMS && s.luck >= 2; }
export function canTake(s, id) { return !s.forms.some(f=>f.id===id && f.level>=MAX_STAGE) && (s.forms.length < MAX_FORMS || slotForms(s,id).length > 0); }
export function marketPrice(s) { return hasCombo(s,'open_handed') ? 1 : hasCombo(s,'long_reach') ? 2 : 3; }
export function rerollCost(s) { return (hasCombo(s,'glazed_honey') || hasCombo(s,'assembly') || level(s,'reverie')) && !s.freeRerollUsed ? 0 : 1; }
export function previewChange(s, id, layer = false) {
  const before = combinations(s);
  const forms = s.forms.some(f => f.id === id) ? s.forms.map(f=>({...f,level:f.id===id?Math.min(MAX_STAGE,f.level+1):f.level})) : [...(layer ? s.forms.map(f=>({...f,level:slotForms(s,id).includes(f)?Math.min(MAX_STAGE,f.level+1):f.level})) : s.forms.filter(f => !slotForms(s,id).includes(f)).map(f=>({...f}))), {id,level:1}];
  const after = combinations({...s,forms});
  return {forms, gained: after.filter(c=>!before.includes(c)), lost: before.filter(c=>!after.includes(c)), deepened:layer?slotForms(s,id).filter(f=>f.level<MAX_STAGE):[] };
}
export function movement(s) { return Math.max(1,s.dice[s.moveIndex] + (s.adjustment || 0) + (s.gliding ? glideDistance(s) : 0)); }
export function adjust(s, value) {
  if (s.phase !== 'rolled' || !canAdjust(s) || ![-1,0,1].includes(value) || s.dice[s.moveIndex] + value < 1) return false;
  s.adjustment=value; return true;
}
export function glide(s) {
  if(s.phase !== 'rolled' || !canGlide(s)) return false;
  if(!s.gliding && !freeGlide(s) && s.dice[1-s.moveIndex] < 2) return false;
  s.gliding=!s.gliding; return true;
}
export function flip(s) {
  if(s.phase !== 'rolled' || s.flipped || !canFlip(s)) return false;
  s.dice[1-s.moveIndex]=7-s.dice[1-s.moveIndex]; s.flipped=true; alignDice(s);
  if(s.gliding && !freeGlide(s) && s.dice[1-s.moveIndex]<2) s.gliding=false;
  return true;
}
export function stats(s) {
  const values = { nerve: s.boon === 'daring' ? 2 : 1, charm: 1, weird: 1 };
  for (const form of s.forms) values[TRAITS.find(t => t.id === form.id).stat] += form.level;
  return values;
}
export function score(s) { return s.seals.length * 100 + s.totalChanges * 15 + s.gold * 3 + s.favors.filter(f=>f.status!=='lent').length*40 + (s.won ? (MAX_TURNS - s.turn) * 10 + 150 : 0); }
export function chances(bonus, target) { return Math.round(Math.max(0, Math.min(6, 7 + bonus - target)) / 6 * 100); }
export function trialTarget(s) { return 9 + s.seals.length; }
export function roll(s) {
  if (s.phase !== 'ready' || s.turn >= MAX_TURNS) return false;
  s.dice = [die(s), die(s)]; s.moveIndex = 0; s.phase = 'rolled'; s.result = null;
  s.adjustment=0; s.gliding=false; s.flipped=false; s.freeRerollUsed=false; s.grounded=false; if(level(s,'dim'))s.luck=Math.min(9,s.luck+1); alignDice(s); return true;
}
export function swap(s) { if (s.phase !== 'rolled' || !routeAllowed(s,1-s.moveIndex)) return false; s.moveIndex = 1 - s.moveIndex; s.adjustment=0; s.gliding=false; return true; }
export function reroll(s) {
  if (s.phase !== 'rolled' || s.luck < rerollCost(s)) return false;
  const cost=rerollCost(s); s.luck-=cost; if(cost===0) s.freeRerollUsed=true;
  s.dice = [die(s), die(s)]; s.adjustment=0; s.gliding=false; alignDice(s); return true;
}
export function destination(s) { return (s.position + movement(s)) % TILES.length; }
export function power(s) { return s.dice[1 - s.moveIndex] - (s.gliding && !freeGlide(s) ? 1 : 0); }
function drawTraits(s, count=2) {
  const available = TRAITS.filter(t => canTake(s,t.id) && !s.forms.some(f => f.id === t.id && f.level === MAX_STAGE));
  const partners=available.filter(t => !s.forms.some(f=>f.id===t.id) && COMBINATIONS.some(c=>c.needs.includes(t.id) && c.needs.filter(id=>id!==t.id).every(id=>s.forms.some(f=>f.id===id))));
  const first=sample(s, partners.length && random(s)<.65 ? partners : available), offers=[first.id];
  while(offers.length<count) offers.push(sample(s,available.filter(t=>!offers.includes(t.id))).id);
  return offers;
}
export function checkDetails(s, stat, trial = true) {
  return { bonus: s.power + stats(s)[stat] + (level(s,'calculus')>=3?2:level(s,'calculus')?1:0) + (trial && hasCombo(s,'dress_rehearsal') && s.power>=1 && s.power<=2?2:0), target: trial ? trialTarget(s) : 10,
    count: trial ? (hasCombo(s,'many_voiced') || hasCombo(s,'quorum') || level(s,'chorus') && hasCombo(s,'resonance') ? 3 : hasCombo(s,'resonance') || level(s,'chorus') ? 2 : 1) : 1, onesHigh: hasCombo(s,'hive_lantern') || hasCombo(s,'prism') || hasCombo(s,'uncounted_sky') || trial && hasCombo(s,'afterimage') };
}
export function checkChance(s, stat, trial=true) {
  const {bonus,target,count,onesHigh}=checkDetails(s,stat,trial);
  const misses=[1,2,3,4,5,6].filter(d=>(onesHigh && d===1 ? 6 : d)+bonus<target).length;
  return Math.round((1-(misses/6)**count)*100);
}
function runCheck(s, stat, trial=true) {
  const info=checkDetails(s,stat,trial), rolls=Array.from({length:info.count},()=>die(s));
  const rolled=Math.max(...rolls.map(d=>info.onesHigh && d===1 ? 6 : d));
  return {...info,rolls,rolled,success:rolled+info.bonus>=info.target};
}
function addLog(s, title, text) { s.log.unshift({ turn: s.turn, title, text }); s.log = s.log.slice(0, 50); }
function result(s, title, text, extra = {}) {
  s.result = { title, text, ...extra }; s.phase = 'result'; addLog(s, title, text);
}
export function move(s) {
  if (s.phase !== 'rolled' || !routeAllowed(s,s.moveIndex)) return false;
  const crosses = s.position + movement(s) >= TILES.length;
  if(hasCombo(s,'grafted_crown') && Array.from({length:movement(s)-1},(_,i)=>TILES[(s.position+i+1)%24]).some(t=>t.type==='change')) {
    s.gold++; addLog(s,'New growth','Your roots find a dropped coin as you pass the changing draughts. +1 gold.');
  }
  if(hasCombo(s,'amber_weather') && Array.from({length:movement(s)-1},(_,i)=>TILES[(s.position+i+1)%24]).some(t=>t.type==='rest')) {
    s.luck=Math.min(9,s.luck+1); addLog(s,'Amber weather','Your scattered honey gathers a little moisture as you pass the fountain. +1 luck.');
  }
  s.position = destination(s); s.power = power(s); s.turn++;
  if(s.command?.kind==='route') {const gilded=hasCombo(s,'obedient_hands'); fulfillCommand(s); addLog(s,'The shorter way','Your hand follows the smaller die before you can take the longer route. One part of the instruction falls quiet.'+(gilded?' Three gold coins slide down your strings. +3 gold.':''));}
  if (crosses && s.seals.length === 3) { s.won = true; s.phase = 'ended'; addLog(s, 'The House opens the door', 'You step over the threshold with three seals and a body the rulebook has no room for.'); return true; }
  if (crosses) { s.gold += 3; addLog(s, 'Another lap', 'You pass the Door and collect 3 gold. The lock still needs all three seals.'); }
  s.pending = { type: TILES[s.position].type, offers: drawTraits(s, Math.min(4,2+(TILES[s.position].type==='market' && hasCombo(s,'star_silk')?1:0)+(level(s,'appetite')?1:0)+(hasCombo(s,'crease_memory')?1:0))) };
  s.phase = 'encounter'; return true;
}
function transform(s, id, layer=false) {
  const trait = TRAITS.find(t => t.id === id);
  const old = s.forms.find(f => f.id === id);
  if (old?.id === id) {
    old.level = Math.min(MAX_STAGE, old.level + 1); s.totalChanges++;
    return { title: `${trait.name} · stage ${old.level}`, text: GROWTH[id][old.level-2], trait: id };
  }
  const replaced=slotForms(s,id);
  const deepened=layer?replaced.filter(f=>f.level<MAX_STAGE):[];
  for(const form of deepened) { form.level++; s.totalChanges++; }
  if (!layer) s.forms = s.forms.filter(f => !replaced.includes(f));
  s.forms.push({ id, level: 1 }); s.totalChanges++;
  if (!s.seen.includes(id)) s.seen.push(id);
  return { title: trait.name, text: trait.text + (layer ? ` Your earlier layers stay${deepened.length?' and deepen around the new change':''}. −2 luck.` : replaced.length ? ` Your ${replaced.map(f=>TRAITS.find(t=>t.id===f.id).name.toLowerCase()).join(' and ')} fades as the new change settles.` : '')+deepened.map(f=>'\n\n'+GROWTH[f.id][f.level-2]).join(''), trait: id };
}
export function resolve(s, action) {
  if (s.phase !== 'encounter' || choicePressure(s,action)) return false;
  const before=combinations(s).map(c=>c.id);
  const obeyed=commandedAction(s), oldHypnosis=level(s,'hypnosis'), oldDim=level(s,'dim');
  const type = s.pending.type, offered = s.pending.offers.includes(action);
  if(action==='deepen') {
    const growing=s.forms.filter(f=>f.level<MAX_STAGE);
    if(type!=='mirror' || !growing.length || s.luck<deepenCost(s)) return false;
    const cost=deepenCost(s); s.luck-=cost;
    const text=growing.map(f=>{f.level++;s.totalChanges++;return GROWTH[f.id][f.level-2];}).join('\n\n');
    result(s,'The reflection keeps going','Your reflection moves closer without taking a step. Every change you carry answers it at once. You hold the edge of the mirror until the shape in the glass and the shape you feel agree.\n\n'+text+`\n\nEvery growing trait advances one stage.${cost?' −'+cost+' luck.':' Walking conservatory pays the cost.'}`);
  } else if(action.startsWith('lend:')) {
    const [,guestId,id,...extra]=action.split(':'), g=GUESTS.find(g=>g.id===guestId), form=s.forms.find(f=>f.id===id);
    if(extra.length || !g || g.from!==type || favor(s,guestId) || !g.wants.includes(id) || !form) return false;
    s.favors.push({id:guestId,trait:id,level:form.level,status:'lent'});
    s.forms=s.forms.filter(f=>f!==form); s.gold+=2;
    const trait=TRAITS.find(t=>t.id===id);
    result(s,`${g.name} borrows your ${trait.name.toLowerCase()}`,LOAN_TEXT[id]+`\n\n${g.name} gives you 2 gold and a claim ticket. Collect your change on any ${TILES.find(t=>t.type===g.to).name.toLowerCase()} space. It returns one stage stronger, up to stage ${MAX_STAGE}; the ticket also promises ${TRAITS.find(t=>t.id===g.partners[id]).name.toLowerCase()}. Until then, the borrowed trait supplies no stats or abilities.`,{guest:guestId});
  } else if(action.startsWith('collect:')) {
    const [,guestId,mode,...extra]=action.split(':'), g=GUESTS.find(g=>g.id===guestId), ticket=favor(s,guestId);
    if(extra.length || !g || ticket?.status!=='lent' || g.to!==type || !['full','layer','plain','cash'].includes(mode)) return false;
    if(mode==='cash') {
      ticket.status='sold'; s.gold+=6; s.luck=Math.min(9,s.luck+2);
      result(s,'A change of ownership',g.cash+'\n\nYou leave the borrowed trait with its new owner. +6 gold; +2 luck; +40 score.',{guest:guestId});
    } else {
      const plan=fitting(s,guestId,mode);
      if(!plan?.allowed) return false;
      const oldForms=s.forms;
      s.forms=plan.forms; s.luck-=plan.cost;
      for(const form of s.forms) {
        if(!oldForms.some(f=>f.id===form.id && f.level>=form.level)) s.totalChanges++;
        if(!s.seen.includes(form.id)) s.seen.push(form.id);
      }
      ticket.status='returned'; ticket.mode=mode;
      if(mode==='plain') s.luck=Math.min(9,s.luck+3);
      const gift=TRAITS.find(t=>t.id===g.partners[ticket.trait]);
      const giftText=mode==='plain'?'You leave the extra parcel closed. The claim ticket becomes three lucky tokens in your hand. +3 luck.':oldForms.some(f=>f.id===gift.id)?`You already have ${gift.name.toLowerCase()}. ${g.name} checks the fit and leaves that change as it is.`:gift.text;
      const replacements=plan.removed.length?` Your ${plan.removed.map(f=>TRAITS.find(t=>t.id===f.id).name.toLowerCase()).join(' and ')} fades to make room.`:'';
      result(s,mode==='plain'?'Your own shape, altered':`${g.name}’s finishing touch`,RETURN_TEXT[ticket.trait]+'\n\n'+giftText+replacements+(plan.cost?` −${plan.cost} luck; your existing layers stay.`:'')+plan.deepened.map(f=>'\n\n'+GROWTH[f.id][f.level-2]).join('')+'\n\n'+g.thanks+' +40 score.',{guest:guestId,trait:ticket.trait});
    }
  } else if(action.startsWith('layer:')) {
    const id=action.slice(6),price=type==='market'?marketPrice(s):0;
    if(!['change','mirror','chaos','market'].includes(type)||!s.pending.offers.includes(id)||!canLayer(s,id)||s.gold<price) return false;
    s.luck-=2; s.gold-=price; const changed=transform(s,id,true);
    if(type==='chaos') {s.gold+=2;changed.text+=' You collect 2 gold from the open box.';}
    result(s,changed.title,changed.text,{trait:id});
  } else if (['change', 'mirror', 'chaos'].includes(type) && offered && canTake(s,action)) {
    const changed = transform(s, action);
    if (type === 'chaos') { s.gold += 2; changed.text += ' Two gold coins fall from the box. You pick them up once your hands are steady. +2 gold.'; }
    result(s, changed.title, changed.text, { trait: changed.trait });
  } else if (type === 'change' && action === 'decline') {
    s.luck = Math.min(9, s.luck + 1); result(s, 'You keep your shape', 'You slide the little glass back across the table. The House lets you keep a lucky token. +1 luck.');
  } else if (type === 'chaos' && action === 'wild') {
    const one = transform(s, s.pending.offers[0]);
    const two = transform(s, sample(s, TRAITS.filter(t => canTake(s,t.id) && t.slot !== TRAITS.find(t => t.id === s.pending.offers[0]).slot && !s.forms.some(f => f.id === t.id && f.level === MAX_STAGE))).id);
    s.luck = Math.min(9, s.luck + 1);
    result(s, 'Double trouble', one.text + '\n\n' + two.text + '\n\nYou catch a lucky token between your new fingers. +1 luck.', { trait: two.trait });
  } else if (type === 'mirror' && action === 'restore') {
    const form = s.forms.pop(); s.luck = Math.min(9, s.luck + 2);
    result(s, 'A familiar reflection', form ? `Your ${TRAITS.find(t => t.id === form.id).name.toLowerCase()} fades. You spend a moment checking the familiar shape underneath. The mirror leaves two lucky tokens on its ledge. +2 luck.` : 'Your reflection winks, but at least it stays your reflection. You take two lucky tokens from the ledge. +2 luck.');
  } else if (type === 'market' && offered && canTake(s,action) && s.gold >= marketPrice(s)) {
    s.gold -= marketPrice(s); const changed = transform(s, action); result(s, changed.title, changed.text, { trait: changed.trait });
  } else if (type === 'market' && action === 'luck' && s.gold >= 2 && s.luck < 9) {
    s.gold -= 2; s.luck = Math.min(9, s.luck + 2); result(s, 'Two wooden tokens', 'The vendor lays two worn tokens on the cloth. You exchange a coin for each and put them in your pocket. −2 gold; +2 luck.');
  } else if (type === 'market' && action === 'leave') {
    result(s, 'You leave the stall', 'You put the bottle back on its shelf and check how much time remains.');
  } else if (type === 'rest' && action === 'rest') {
    s.luck = Math.min(9, s.luck + 2); result(s, 'A minute to yourself', 'You sit on the edge of a fountain and put both hands in your lap. Whatever they look like, they still do that when you ask. You count two slow breaths. +2 luck.');
  } else if (type === 'rest' && action === 'gold') {
    s.gold += 3; result(s, 'Someone has to count the tips', 'You help a many-armed bartender sort a heap of coins. At least you know how this part works. +3 gold.');
  } else if (type === 'fortune' && action === 'safe') {
    s.gold += 2; result(s, 'Two gold', 'You take the coins from the near side of the table and leave the bag closed. +2 gold.');
  } else if (type === 'fortune' && action === 'gamble') {
    const check=runCheck(s,'charm',false), {success}=check;
    s.gold += success ? 6 : hasCombo(s,'night_speech') ? 2 : 0;
    if (!success) s.luck = Math.min(9, s.luck + 1);
    result(s, success ? 'Six gold' : 'The bag is empty', success ? 'You draw out six coins and count them into your palm. +6 gold.' : 'Your fingers close around a wooden token at the bottom of the bag. +1 luck.'+(hasCombo(s,'night_speech')?' You hear the answer a moment early and ask for the smaller purse before it disappears. +2 gold.':''), { check });
  } else if (type === 'trial' && TRIALS.some(t => t.id === action) && !s.seals.includes(action)) {
    const trial = TRIALS.find(t => t.id === action), check=runCheck(s,trial.stat), {success}=check;
    if (success) { s.seals.push(action); s.gold += 2; } else { s.luck = Math.min(9, s.luck + 1); }
    if(!success && hasCombo(s,'busker')) s.gold+=2;
    result(s, success ? `${trial.name}: yours` : 'The trial holds', trial.text+'\n\n'+(success ? 'You reach the other side and take the seal from its hook. It sits warm against your palm. +1 seal; +2 gold.' : 'The path closes before you can finish. You step back and pick up the lucky token left on the threshold. You can try again at another crown square. +1 luck.'+(hasCombo(s,'busker')?' Your tail keeps time as you sing the last line. Someone leaves 2 gold beside your feet.':'')), { check });
  } else if (type === 'trial' && action === 'leave') {
    s.gold++; result(s, s.seals.length === 3 ? 'Back toward the door' : 'You watch a trial', s.seals.length === 3 ? 'You have every seal. You collect a parting coin and look for the Door. +1 gold.' : 'You stay at the threshold and watch the brass figure complete the course. There is a coin on the rail beside you. You take it before moving on. +1 gold.');
  } else if (type === 'door' && action === 'leave') {
    s.luck = Math.min(9, s.luck + 1); result(s, 'The door stays closed', 'You fit the seals you have into the lock. The empty spaces are still dark. You take the token hanging beside the handle and return to the board. +1 luck.');
  } else return false;
  if(type==='rest' && ['rest','gold'].includes(action) && restBoth(s)) {
    if(action==='rest') s.gold+=3; else s.luck=Math.min(9,s.luck+2);
    s.result.text+=hasCombo(s,'groundwire')?' Light settles through your roots while you help at the fountain. Grounded light gives you both rewards: 2 luck and 3 gold in total.':'Your roots hold you beside the fountain while the balloons tug at your shoulders. You can help with the tips without leaving your rest. +2 luck and +3 gold in total.';
  }
  const gained=combinations(s).filter(c=>!before.includes(c.id));
  if(obeyed) { const rewarded=before.includes('clockwork_obedience'), gilded=before.includes('obedient_hands'); fulfillCommand(s,rewarded,gilded); s.result.text+='\n\nYou carry out the planted instruction. The words loosen their hold'+(s.command?', though one repetition remains.':'.')+(rewarded?' Two lucky tokens drop into your palm as the commanded movement finishes. +2 luck.':'')+(gilded?' Three gold coins slide down your strings when you finish obeying. +3 gold.':''); }
  if(level(s,'hypnosis')>oldHypnosis) { s.command={kind:sample(s,['route','bottle','trial']),remaining:level(s,'hypnosis')>=3?2:1,issuedTurn:s.turn}; s.result.text+='\n\nThe command settles: “'+commandText(s)+'” It waits for a later decision. Clearing your head cannot remove it.'; }
  if(level(s,'dim')>oldDim) { s.luck=Math.min(9,s.luck+1); s.result.text+=' A lucky token settles in your palm. +1 luck.'; }
  s.knownCombos ||= [];
  for(const combo of gained) {
    if(!s.knownCombos.includes(combo.id)) s.knownCombos.push(combo.id);
    s.result.text+='\n\n'+combo.text;
  }
  s.result.combos=gained.map(c=>c.id);
  s.log[0].text=s.result.text;
  s.pending = null; return true;
}
export function next(s) {
  if (s.phase !== 'result') return false;
  if (s.turn >= MAX_TURNS) { s.phase = 'ended'; s.won = false; }
  else { s.phase = 'ready'; s.result = null; }
  return true;
}
export function restore(raw) {
  try {
    const s = JSON.parse(raw), int = (n, min, max) => Number.isInteger(n) && n >= min && n <= max;
    if (!s || ![1,2,3,VERSION].includes(s.version) || !BOONS[s.boon] || typeof s.seed !== 'string' || s.seed.length > 40 || !int(s.rng, 1, 4294967295) || !['ready', 'rolled', 'encounter', 'result', 'ended'].includes(s.phase)) return null;
    if (!int(s.turn, 0, MAX_TURNS) || !int(s.position, 0, 23) || !int(s.gold, 0, 1000) || !int(s.luck, 0, 9) || !int(s.moveIndex, 0, 1) || !int(s.power, 0, 6) || !int(s.totalChanges, 0, 300)) return null;
    if (!Array.isArray(s.dice) || s.dice.length !== 2 || !s.dice.every(d => int(d, 1, 6))) return null;
    if (!Array.isArray(s.forms) || s.forms.length > (s.version===1?5:s.version<4?7:MAX_FORMS) || !s.forms.every(f => f && TRAITS.some(t => t.id === f.id) && int(f.level, 1, s.version<4?3:MAX_STAGE))) return null;
    if (new Set(s.forms.map(f=>f.id)).size!==s.forms.length || s.forms.some(f=>slotForms(s,f.id).length>(s.version===1?1:s.version<4?2:MAX_LAYERS))) return null;
    if (!Array.isArray(s.seals) || s.seals.length > 3 || new Set(s.seals).size !== s.seals.length || !s.seals.every(id => TRIALS.some(t => t.id === id))) return null;
    if (!Array.isArray(s.seen) || !s.seen.every(id => TRAITS.some(t => t.id === id)) || !Array.isArray(s.log) || s.log.length > 50 || !s.log.every(l => l && int(l.turn, 0, MAX_TURNS) && typeof l.title === 'string' && typeof l.text === 'string') || typeof s.won !== 'boolean') return null;
    if (s.phase === 'encounter' && (!s.pending || s.pending.type !== TILES[s.position].type || !Array.isArray(s.pending.offers) || ![2,3,4].includes(s.pending.offers.length) || !s.pending.offers.every(id => TRAITS.some(t => t.id === id)))) return null;
    if (s.phase === 'result' && (!s.result || typeof s.result.title !== 'string' || typeof s.result.text !== 'string' || (s.result.trait && !TRAITS.some(t => t.id === s.result.trait)))) return null;
    if (s.phase === 'result' && s.result.check && (!int(s.result.check.rolled, 1, 6) || !int(s.result.check.bonus, 0, 60) || !int(s.result.check.target, 1, 30) || typeof s.result.check.success !== 'boolean')) return null;
    if(s.result?.check?.rolls && (!Array.isArray(s.result.check.rolls) || ![1,2,3].includes(s.result.check.rolls.length) || !s.result.check.rolls.every(d=>int(d,1,6)))) return null;
    if(s.result?.combos && (!Array.isArray(s.result.combos) || !s.result.combos.every(id=>COMBINATIONS.some(c=>c.id===id)))) return null;
    if(s.version===1) Object.assign(s,{adjustment:0,gliding:false,flipped:false,freeRerollUsed:false,knownCombos:combinations(s).map(c=>c.id)});
    if(s.version<3) s.favors=[];
    if(s.version<4) { s.grounded=false; s.command=null; s.version=VERSION; }
    if(s.command!==null && (!s.command || !['route','bottle','trial'].includes(s.command.kind) || !int(s.command.remaining,1,2) || !int(s.command.issuedTurn,0,s.turn))) return null;
    if(!Array.isArray(s.favors) || s.favors.length>GUESTS.length || new Set(s.favors.map(f=>f?.id)).size!==s.favors.length || !s.favors.every(f=>f && GUESTS.some(g=>g.id===f.id && g.wants.includes(f.trait)) && int(f.level,1,MAX_STAGE) && ['lent','returned','sold'].includes(f.status) && (f.status!=='returned' || ['full','layer','plain'].includes(f.mode)))) return null;
    if(![-1,0,1].includes(s.adjustment) || !['gliding','flipped','freeRerollUsed','grounded'].every(k=>typeof s[k]==='boolean') || !Array.isArray(s.knownCombos) || !s.knownCombos.every(id=>COMBINATIONS.some(c=>c.id===id))) return null;
    if(s.phase==='rolled' && (s.adjustment!==0 && !canAdjust(s) || s.gliding && (!canGlide(s) || power(s)<1))) return null;
    return s;
  } catch { return null; }
}
