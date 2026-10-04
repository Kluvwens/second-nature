import * as G from './engine.mjs';
import { icon } from './art.mjs';

// The positions follow the rooms in the illustration. Space IDs and rules are unchanged.
export const POINTS = [[20,82],[28,71],[24,60],[17,49],[21,35],[31,28],[42,22],[54,18],[67,22],[74,31],[75,41],[84,48],[89,56],[82,65],[74,71],[85,81],[73,89],[60,84],[51,73],[61,64],[67,53],[60,42],[46,35],[36,44]];
export const INK_POINTS = [[12,88],[12,72],[24,72],[24,60],[12,60],[12,44],[12,28],[24,28],[24,12],[40,12],[56,12],[72,12],[88,12],[88,28],[76,28],[76,44],[88,44],[88,60],[76,60],[76,76],[88,76],[88,88],[60,88],[44,88]];

function path(points, close=false) {
  const sequence=close?[...points,points[0]]:points;
  return sequence.map(([x,y],i)=>`${i?'L':'M'}${x} ${y}`).join(' ');
}
export function board(state, mode='ink') {
  const rolled=state.phase==='rolled', destination=rolled?G.destination(state):null;
  const points=mode==='house'?POINTS:INK_POINTS;
  const travel=rolled?Array.from({length:G.movement(state)+1},(_,i)=>points[(state.position+i)%24]):[];
  const shown=G.TILES[destination??state.position];
  return `<div class="board board-${mode}" aria-label="A route through the House">
    ${mode==='house'?'<img class="house-map" src="./house-map-v3.png" alt="An impossible café: bottles beneath an awning, a brass-antler arch, a moon fountain, a looking glass, and a curtained salon." draggable="false">':`<svg class="board-grid" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path d="M0 12H100M12 0V100M24 0V34H0M40 0V19M56 0V20M72 0V20M88 0V100M100 28H76M100 44H76M100 60H76M100 76H76V100M0 88H100M44 80V100M60 80V100M0 44H18M0 60H30V72H0M0 97H22M97 0V19M2 2H8V8M92 92H98V98"/></svg><div class="board-center"><span>${rolled?'NEXT STOP':state.phase==='ended'?'EVENING COMPLETE':'YOU ARE HERE'}</span><strong>${String(shown.id+1).padStart(2,'0')}</strong><b>${shown.name}</b><small>${rolled?`${G.movement(state)} spaces · ${G.power(state)} power`:`${G.MAX_TURNS-state.turn} turns left`}</small></div><span class="board-imprint">H&H / FOLLOW THE NUMBERS</span>`}
    <svg class="board-route" viewBox="0 0 100 100" preserveAspectRatio="none" aria-hidden="true"><path class="route-underlay" d="${path(points,true)}"/><path class="route-line" d="${path(points,true)}"/>${rolled?`<path class="route-selected" d="${path(travel)}"/>`:''}</svg>
    ${G.TILES.map((tile,i)=>{
      const current=i===state.position, target=i===destination, [x,y]=points[i], guests=G.waitingGuests(state,tile.type);
      return `<button type="button" class="tile tile-${tile.type} ${current?'occupied':''} ${target?'destination':''} ${guests.length?'has-collection':''}" style="--x:${x}%;--y:${y}%" data-action="tile:${i}" aria-label="Space ${i+1}, ${tile.name}${current?', your position':''}${target?', selected destination':''}${guests.length?', collect from '+guests.map(g=>g.name).join(', '):''}" title="${i+1}. ${tile.name}"><span class="tile-number">${i+1}</span>${icon(G.TILE_ICONS[tile.type])}${guests.map(g=>`<span class="guest-marker" aria-hidden="true">${g.initial}</span>`).join('')}${current?'<span class="pawn" aria-hidden="true">●</span>':''}${target?'<span class="target-dot" aria-hidden="true"></span>':''}</button>`;
    }).join('')}
    ${mode==='house'?'<span class="map-label label-market">Night market</span><span class="map-label label-door">The Door</span><span class="map-label label-fountain">Moon fountain</span>':''}
  </div>`;
}

export function seals(state) {
  return `<div class="seal-strip" aria-label="${state.seals.length} of 3 seals collected"><span class="seal-instruction">${state.seals.length===3?'Return to the Door':'Collect all three seals'}</span>${G.TRIALS.map(t=>`<span class="seal ${state.seals.includes(t.id)?'claimed':''}" title="${t.name}${state.seals.includes(t.id)?': claimed':': unclaimed'}">${icon(t.icon)}<span>${({brass:'Brass',velvet:'Velvet',moon:'Moon'})[t.id]}</span>${state.seals.includes(t.id)?'<b>✓</b>':''}</span>`).join('')}</div>`;
}
