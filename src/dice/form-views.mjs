import * as G from './engine.mjs';
import { icon, portrait, traitArt } from './art.mjs';

export const slots = { crown: 'Head', skin: 'Skin', voice: 'Voice', limbs: 'Hands & wings', shadow: 'Tail, roots & shadow', mind: 'Mind' };
const button = (action, text, cls = '', disabled = false) => `<button type="button" data-action="${action}" class="${cls}" ${disabled ? 'disabled' : ''}>${text}</button>`;
export const activeRule = (state, combo) => ['amber_wings','lantern_wings','sugar_lift'].includes(combo.id) ? 'Glide '+G.glideDistance(state)+' extra spaces '+(G.freeGlide(state)?'at no power cost.':'for 1 power.') : combo.id==='long_reach' && G.hasCombo(state,'open_handed') ? 'Transformations cost 1 gold. Improved by Open-handed.' : combo.id==='resonance' && G.level(state,'chorus') ? 'Roll three trial dice and keep the highest. Improved by Chorus mind.' : combo.rule;
function preview(state, id, layer) {
  const changes = G.previewChange(state, id, layer);
  return changes.gained.map(c => `<span class="gain-note">Makes ${c.name}: ${activeRule({...state,forms:changes.forms},c)}</span>`).join('') + changes.lost.map(c => `<span class="loss-note">Ends ${c.name}.</span>`).join('') + changes.deepened.map(f=>`<span class="gain-note">Deepens ${G.TRAITS.find(t=>t.id===f.id).name} to stage ${f.level+1}.</span>`).join('');
}
export function traitOption(state, id, market = false) {
  const trait = G.TRAITS.find(t => t.id === id), old = G.slotForms(state, id), same = old.find(f => f.id === id);
  const price = market ? G.marketPrice(state) : 0;
  const note = same ? `Stage ${same.level + 1} · +1 ${G.STATS[trait.stat]}` : `+1 ${G.STATS[trait.stat]}${old.length ? ' · replaces ' + old.map(f => G.TRAITS.find(t => t.id === f.id).name).join(' + ') : ''}`;
  const canOfferLayer = old.length > 0 && old.length < G.MAX_LAYERS && !same && state.forms.length < G.MAX_FORMS;
  return `<div class="offer-card">
    ${button('choose:' + id, `${traitArt(id,'offer-illustration')}<span class="offer-text"><small class="card-category">${slots[trait.slot]}</small><strong>${trait.name}</strong><small>${note}</small>${preview(state, id, false)}${G.MIND_RULES[id]?`<small class="mind-warning">${G.MIND_RULES[id]}</small>`:""}</span><span class="price">${price ? price + ' ◈' : icon('arrow')}</span>`, 'choice', state.gold < price || !G.canTake(state,id))}
    ${canOfferLayer ? button('choose:layer:' + id, `<span><b>Keep and deepen your ${old.length===1?"layer":"layers"}</b><small>Add a layer · 2 luck${price ? ' + ' + price + ' gold' : ''}</small>${preview(state, id, true)}</span>${icon('ribbon')}`, 'layer-choice', !G.canLayer(state, id) || state.gold < price) : ''}
  </div>`;
}
export function playerSheet(state) {
  const stats = G.stats(state), active = G.combinations(state);
  return `<aside id="form" class="character-panel" aria-label="Player sheet">
    <div class="panel-label"><span><b>03</b> YOUR FORM</span><span>${state.forms.length}/${G.MAX_FORMS} traits · ${button('form-report','Read your form ↗','book-link')}</span></div>
    <div class="form-bench"><div class="identity"><div class="character-top"><div class="portrait-frame">${portrait(state.forms)}</div><div class="character-name"><h2>Mara Ellis</h2><p>26 · ${state.forms.length ? 'Changed' : 'Human'}</p><small>${G.BOONS[state.boon].name}</small></div></div>
    <div class="stats">${Object.entries(stats).map(([id, value]) => `<div><span>${G.STATS[id]}</span><b>${value}</b></div>`).join('')}</div></div>
    <div class="form-section">
    ${state.forms.length ? '' : `<p class="empty-form">${state.favors.some(f=>f.status==='lent')?'Your changed traits are on loan. The claim tickets below the board show where to collect them.':state.totalChanges?'Your familiar shape returns. Earlier discoveries remain in the form book.':'No changes yet. Choose a bottle on a change space to begin.'}</p>`}
    ${Object.entries(slots).filter(([slot])=>state.forms.some(f=>G.TRAITS.find(t=>t.id===f.id).slot===slot)).map(([slot, label]) => {
      const forms = state.forms.filter(f => G.TRAITS.find(t => t.id === f.id).slot === slot);
      return `<div class="body-slot ${forms.length >= 2 ? 'layered' : ''}"><div class="slot-heading"><span>${label}</span><small>${forms.length >= 2 ? 'LAYERED' : ''}</small></div>${forms.length ? forms.map(f => {
        const trait = G.TRAITS.find(t => t.id === f.id);
        return button('trait:' + f.id, `${traitArt(f.id,'held-illustration')}<span><strong>${trait.name}</strong><small>+${f.level} ${G.STATS[trait.stat]}</small></span><span class="stage-marks" aria-label="stage ${f.level}">${'●'.repeat(f.level)}${'○'.repeat(G.MAX_STAGE - f.level)}</span>`, 'form-trait');
      }).join('') : '<span class="empty-slot">Unchanged</span>'}</div>`;
    }).join('')}</div></div>
    <div class="combination-section"><div class="panel-label"><span>COMBINATIONS</span><span>${active.length} active</span></div>
    ${active.length ? active.map(c => button('combo:' + c.id, `<strong>${c.name}</strong><small>${activeRule(state,c)}</small>`, 'active-combo')).join('') : '<p class="empty-combos">Traits can change each other. The form book shows which ones to try together.</p>'}
    </div>
  </aside>`;
}
export function abilities(state) {
  if (state.phase !== 'rolled') return '';
  const controls = [];
  if (G.canAdjust(state)) controls.push(`<div><span>${G.hasCombo(state,"counterbalance")?"Counterbalance":G.hasCombo(state,"folded_map")?"Folded map":"Loose outline"}</span><div class="segmented">${[-1, 0, 1].map(n => button('adjust:' + n, n === 0 ? 'As rolled' : n > 0 ? '+1 space' : '−1 space', state.adjustment === n ? 'selected' : '', n + state.dice[state.moveIndex] < 1)).join('')}</div></div>`);
  if (G.canGlide(state)) controls.push(button('glide', `${icon('moth')} ${state.gliding ? 'Cancel glide' : 'Glide +'+G.glideDistance(state)+' spaces'}<small>${G.freeGlide(state) ? 'No power cost' : 'Costs 1 power'}</small>`, 'ability-button ' + (state.gliding ? 'selected' : ''), !state.gliding && !G.freeGlide(state) && state.dice[1 - state.moveIndex] < 2));
  if (G.canFlip(state)) controls.push(button('flip', `${icon('gear')} Turn power die over<small>${state.flipped ? 'Used this turn' : state.dice[1 - state.moveIndex] + ' → ' + (7 - state.dice[1 - state.moveIndex]) + ' · once per turn'}</small>`, 'ability-button', state.flipped));
  return controls.length ? `<div class="ability-controls">${controls.join('')}</div>` : '';
}
export function formBook(state) {
  const active = G.combinations(state);
  return `<p class="dialog-intro">${active.length} combinations active. Keep every required trait in your current form to use its rule. Adding a layer costs 2 luck and deepens the traits already in that slot. Carry up to ten traits, three per slot. Each can reach stage 4; mirrors can deepen your whole form. Mental changes add benefits and pressures; clearing your head suppresses the pressure for this turn.</p>
  <div class="recipe-grid">${G.COMBINATIONS.map(c => button('combo:' + c.id, `<span class="recipe-status">${active.includes(c) ? 'ACTIVE' : c.timing.toUpperCase()}</span><strong>${c.name}</strong><span class="recipe-plates" aria-hidden="true">${c.needs.map(id=>traitArt(id)).join('')}</span><span class="recipe-parts">${c.needs.map(id => `<span class="${state.forms.some(f => f.id === id) ? 'have' : ''}">${state.forms.some(f => f.id === id) ? '✓ ' : ''}${G.TRAITS.find(t => t.id === id).name}</span>`).join('<i>+</i>')}</span><p>${active.includes(c) ? activeRule(state,c) : c.rule}</p>`, 'recipe-card ' + (active.includes(c) ? 'formed' : ''))).join('')}</div>`;
}
export function turnTrack(state) {
  return `<div class="turn-track" aria-label="${G.MAX_TURNS - state.turn} turns left"><span>TURNS</span>${Array.from({ length: 18 }, (_, i) => `<i class="${i < state.turn ? 'used' : ''} ${i === state.turn && state.phase !== 'ended' ? 'current' : ''}">${i + 1}</i>`).join('')}<span>${icon('moon')}</span></div>`;
}

export function mindPanel(state) {
  const mental=G.mindTraits(state);
  if((!mental.length && !state.command) || state.phase==='ended') return '';
  const cost=G.focusCost(state), canAct=['rolled','encounter'].includes(state.phase);
  const urges=mental.some(f=>['appetite','reverie','chorus'].includes(f.id));
  return `<section class="mind-pressure" aria-label="Mental changes"><strong>${state.grounded?'You hold your attention steady.':'Inside your head'}</strong>${state.command?'<div class="planted-command"><b>THE INSTRUCTION</b><p>“'+G.commandText(state)+'”</p><small>This command overrides other urges. It survives clearing your head and removing the trait.</small></div>':''}${mental.map(f=>`<details><summary>${G.TRAITS.find(t=>t.id===f.id).name}</summary><p>${G.MIND_RULES[f.id]}</p></details>`).join('')}${!G.numbersReadable(state)?'<p class="reading-effect">The printed numbers will not settle. You can still count the dice pips.</p>':''}${state.grounded?'<p>Ordinary urges are quiet until your next roll. Commands and number reading follow their own rules.</p>':urges&&canAct?button('steady',`Clear your head <small>${cost?cost+' luck':'Free · grounded by your form'} · lasts this turn</small>`,'paper-button',state.luck<cost):urges?'<p>After rolling, spend luck to quiet these urges for a turn. Some physical combinations make this free.</p>':''}</section>`;
}

export function formReport(state) {
  const report=G.describeForm(state);
  return `<section class="form-report" aria-label="Your whole form"><span class="eyebrow">${report.summary}</span><h3>The shape you have made</h3>${state.forms.length?`<div class="form-gallery" aria-label="Illustrated traits in your form">${state.forms.map(f=>button('trait:'+f.id,traitArt(f.id)+`<strong>${G.TRAITS.find(t=>t.id===f.id).name}</strong><small>Stage ${f.level}</small>`,'form-gallery-card')).join('')}</div>`:''}<div class="event-prose">${report.body.map(p=>'<p>'+p+'</p>').join('')}${report.interactions.map(p=>'<p>'+p+'</p>').join('')}${report.mind.length?'<h4>Inside your head</h4>'+report.mind.map(p=>'<p>'+p+'</p>').join(''):''}<p>${state.forms.length?'You try your name. However it sounds now, you know who is answering. You are less certain how you will get through the café door.':'You check the brass clip in your hair. It is still where you left it.'}</p></div><details><summary>Every layer and stage</summary><ul>${state.forms.map(f=>'<li>'+G.TRAITS.find(t=>t.id===f.id).name+' · stage '+f.level+'</li>').join('') || '<li>No active transformations</li>'}</ul></details></section>`;
}

export function illustration(id) {
  const trait=G.TRAITS.find(t=>t.id===id);
  return trait?`<figure class="form-plate">${traitArt(id,'',trait.name+' — a form-book illustration of its deep stages')}<figcaption>From the form book · a glimpse of the deep stages</figcaption></figure>`:'';
}

export function traitDetail(state,id) {
  const trait=G.TRAITS.find(t=>t.id===id), form=state.forms.find(f=>f.id===id);
  return `<div class="trait-entry">${illustration(id)}<div class="trait-entry-copy"><p class="eyebrow">${slots[trait.slot]} · ${form?'Your stage '+form.level:'Not in your current form'}</p><p>${trait.detail}</p>${G.MIND_RULES[id]?'<p class="mind-warning">'+G.MIND_RULES[id]+'</p>':''}<div class="growth-pages">${[trait.text,...G.GROWTH[id]].map((text,i)=>`<details ${form?.level===i+1?'open':''}><summary>Stage ${i+1}${form?.level===i+1?' · you are here':''}</summary><p>${text}</p></details>`).join('')}</div></div></div>`;
}
