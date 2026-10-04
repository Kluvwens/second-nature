import * as G from './engine.mjs';
import { activeRule } from './form-views.mjs';

const trait = id => G.TRAITS.find(t=>t.id===id);
const place = type => G.TILES.find(t=>t.type===type).name;
const button = (action, text, cls='', disabled=false) => `<button type="button" data-action="${action}" class="${cls}" ${disabled?'disabled':''}>${text}</button>`;
const spaces = type => G.TILES.filter(t=>t.type===type).map(t=>t.id+1).join(', ');
const nearest = (s,type) => Math.min(...G.TILES.filter(t=>t.type===type).map(t=>(t.id-s.position+24)%24||24));
const effects = (s,plan) => plan.gained.map(c=>`<span class="gain-note">Makes ${c.name}: ${activeRule({...s,forms:plan.forms},c)}</span>`).join('')+plan.lost.map(c=>`<span class="loss-note">Ends ${c.name}.</span>`).join('');

export function featured(s) {
  return G.guestsAt(s,s.pending.type).some(g=>G.favor(s,g.id)?.status==='lent' || !G.favor(s,g.id) && s.forms.some(f=>g.wants.includes(f.id)));
}

export function routeNote(s,type) {
  return G.waitingGuests(s,type).map(g=>`<div class="guest-route-note"><b>${g.name} has your ${trait(G.favor(s,g.id).trait).name.toLowerCase()}.</b> Collect it here instead of the usual action.</div>`).join('');
}

function returnChoice(s,g,mode,label) {
  const plan=G.fitting(s,g.id,mode);
  const contents=plan.additions.map(f=>`${trait(f.id).name} · stage ${plan.forms.find(n=>n.id===f.id).level}`).join(' + ');
  const replaces=plan.removed.length?`Replaces ${plan.removed.map(f=>trait(f.id).name.toLowerCase()).join(' + ')}.`:'';
  const note=mode==='plain'?'+3 luck · no extra trait':mode==='layer'?`${plan.cost} luck · keep every current trait`:'Free · usual slot replacement';
  return button(`choose:collect:${g.id}:${mode}`,`<strong>${label}</strong><small>${contents}</small><small>${note}</small>${replaces?`<span class="loss-note">${replaces}</span>`:''}${effects(s,plan)}${plan.deepened.map(f=>`<span class="gain-note">Deepens ${trait(f.id).name} to stage ${f.level}.</span>`).join("")}${!plan.fits?'<small>Not enough room: ten traits, three per slot.</small>':plan.cost>s.luck?'<small>You need more luck for this fitting.</small>':''}`,'guest-choice',!plan.allowed);
}

export function encounterGuests(s) {
  return G.guestsAt(s,s.pending.type).map(g=>{
    const ticket=G.favor(s,g.id);
    if(ticket && ticket.status!=='lent') return `<details class="guest-cameo"><summary>${g.name} is here</summary><p>${g.thanks}</p></details>`;
    const holding=ticket?.status==='lent', available=s.forms.filter(f=>g.wants.includes(f.id));
    let choices='';
    if(holding) {
      choices=returnChoice(s,g,'full','Try the finished alteration');
      const layered=G.fitting(s,g.id,'layer'), full=G.fitting(s,g.id,'full');
      if(layered.cost && full.removed.length) choices+=returnChoice(s,g,'layer','Keep my layers as well');
      choices+=returnChoice(s,g,'plain','Just my own change, please');
      choices+=button(`choose:collect:${g.id}:cash`,'Let them keep the borrowed trait<small>Do not get it back · +6 gold · +2 luck</small>','guest-choice cash-choice');
    } else choices=available.map(f=>{
      const loan=G.loanPreview(s,f.id), partner=g.partners[f.id], future={...s,forms:[{id:f.id,level:1},{id:partner,level:1}]};
      const combo=G.combinations(future)[0];
      return button(`choose:lend:${g.id}:${f.id}`,`<strong>Lend your ${trait(f.id).name.toLowerCase()}</strong><small>Lose its +${f.level} ${G.STATS[trait(f.id).stat]} until collection · +2 gold now</small>${loan.lost.map(c=>`<span class="loss-note">Pauses ${c.name}.</span>`).join('')}<small>Collect at ${place(g.to).toLowerCase()}: stage ${Math.min(G.MAX_STAGE,f.level+1)} ${trait(f.id).name.toLowerCase()} + ${trait(partner).name.toLowerCase()}.</small>${combo?`<span class="gain-note">Together: ${combo.name}. ${combo.rule}</span>`:''}`,'guest-choice');
    }).join('');
    return `<section class="guest-encounter" aria-label="${g.name}'s ${holding?'fitting':'request'}"><div class="guest-byline"><span class="guest-monogram">${g.initial}</span><span><strong>${g.name}</strong><small>${g.title}${holding?' · collection':''}</small></span></div><div class="event-prose"><p>${holding?g.pickup:available.length?g.request:g.waiting}</p></div>${choices?`<p class="guest-terms">One of these choices uses this encounter.${holding?' Completed favors add 40 to your score.':' The loan lasts until you collect it; a guest only borrows once.'}</p><div class="guest-choices">${choices}</div>`:''}</section>`;
  }).join('');
}

export function guestStrip(s) {
  return `<section class="guest-strip" aria-label="House guests and borrowed forms"><div class="guest-strip-heading">HOUSE GUESTS <span>Optional favors</span></div>${G.GUESTS.map(g=>{
    const ticket=G.favor(s,g.id), holding=ticket?.status==='lent';
    const here=s.phase==='encounter' && s.pending.type===g.to;
    return button('guest:'+g.id,`<span class="guest-monogram">${ticket&&!holding?'✓':g.initial}</span><span><strong>${g.name}</strong><small>${holding?`${trait(ticket.trait).name} on loan`:ticket?'Favor settled':place(g.from)}</small>${holding?`<small class="pickup-line">${here?'Collect here':`${place(g.to)} · ${nearest(s,g.to)} spaces ahead`}</small>`:''}</span>`,'guest-ticket '+(holding?'on-loan':''));
  }).join('')}</section>`;
}

export function guestRecord(s,g) {
  const ticket=G.favor(s,g.id);
  const heading=ticket?.status==='lent'?`On loan: ${trait(ticket.trait).name}, stage ${ticket.level}`:ticket?'Favor settled':'A favor, if you have time';
  return `<div class="guest-record"><div class="guest-byline"><span class="guest-monogram">${g.initial}</span><span><strong>${g.name}</strong><small>${g.title}</small></span></div><h3>${heading}</h3><div class="event-prose"><p>${ticket && ticket.status!=='lent'?g.thanks:g.request}</p></div><div class="guest-itinerary"><span>MEET</span><b>${place(g.from)}</b><small>Spaces ${spaces(g.from)}</small><span>COLLECT</span><b>${place(g.to)}</b><small>Spaces ${spaces(g.to)}</small></div><p class="dialog-intro">Lending removes that trait and pays 2 gold. Collect it one stage stronger (up to stage 4), with the extra change below. Each step uses an encounter. You can also choose the usual action for the space, unless a planted command decides for you.</p><div class="guest-promises">${g.wants.map(id=>`<p>${trait(id).name}<span>comes back with ${trait(g.partners[id]).name.toLowerCase()}</span></p>`).join('')}</div><p class="small muted">At collection: accept the fitting, layer for 2 luck per occupied slot if there is room, take only your own trait and 3 luck, or sell the loan for 6 gold and 2 luck. Completing any option adds 40 score. Loans left unfinished at midnight give no completion points.</p></div>`;
}

export function ending(s) {
  if(!s.favors.length) return '';
  const done=s.favors.filter(f=>f.status!=='lent'), outstanding=s.favors.filter(f=>f.status==='lent');
  return `<div class="guest-ending"><h3>What comes home with you</h3><div class="event-prose">${done.map(f=>`<p>${G.GUESTS.find(g=>g.id===f.id).ending}</p>`).join('')}${outstanding.length?`<p>You find ${outstanding.length===1?'an uncollected claim ticket':'uncollected claim tickets'} in your pocket: ${outstanding.map(f=>`${G.GUESTS.find(g=>g.id===f.id).name} still has your ${trait(f.trait).name.toLowerCase()}`).join('; ')}. The ink fades as the box closes. You leave the paper in the lid.</p>`:''}</div><p class="small">${done.length} favors settled · ${done.length*40} score</p></div>`;
}
