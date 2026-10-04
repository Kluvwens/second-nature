import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { JSDOM, VirtualConsole } from 'jsdom';
import * as G from '../src/dice/engine.mjs';
import * as art from '../src/dice/art.mjs';
import * as views from '../src/dice/form-views.mjs';
import * as boardView from '../src/dice/board-view.mjs';
import * as guestViews from '../src/dice/guest-views.mjs';

function encounter(type, offers = ['honey','moth']) {
  const s = G.createGame('fixture');
  s.phase = 'encounter'; s.position = G.TILES.find(t => t.type === type).id;
  s.pending = { type, offers }; s.power = 5; s.turn = 1;
  return s;
}
function offered(s, type, offers = ['honey','moth']) { s.phase='encounter'; s.position=G.TILES.find(t=>t.type===type).id; s.pending={type,offers}; }

test('Seeded rolls, saved RNG, swaps and reroll costs remain consistent', () => {
  const a=G.createGame('same-night'),b=G.createGame('same-night');
  assert.equal(G.move(a),false); assert.equal(G.resolve(a,'honey'),false);
  G.roll(a); G.roll(b); assert.deepEqual(a,b);
  const original=[...a.dice], rng=a.rng;
  G.swap(a); assert.equal(G.destination(a),original[1]); assert.equal(G.power(a),original[0]);
  assert.equal(a.rng,rng); G.swap(a); assert.deepEqual(a,b);
  const restored=G.restore(JSON.stringify(a)); G.reroll(a); G.reroll(restored); assert.deepEqual(a,restored);
  assert.equal(a.luck,3); a.luck=0; const before=JSON.stringify(a); assert.equal(G.reroll(a),false); assert.equal(JSON.stringify(a),before);
  const longSeed=G.createGame('x'.repeat(60)); assert.deepEqual(longSeed,G.createGame(longSeed.seed));
});
test('All 28 changes grant their own stat, advance, replace only their slot, and can be restored', () => {
  for(const t of G.TRAITS) {
    const s=encounter('change',[t.id,'honey']); assert.equal(G.resolve(s,t.id),true);
    assert.equal(G.stats(s)[t.stat],2); assert.ok(s.seen.includes(t.id));
    const after=JSON.stringify(s); assert.equal(G.resolve(s,t.id),false); assert.equal(JSON.stringify(s),after);
    offered(s,'change',[t.id,'honey']); s.grounded=true; G.resolve(s,t.id); assert.equal(s.forms[0].level,2);
    offered(s,'change',[t.id,'honey']); G.resolve(s,t.id); assert.equal(s.forms[0].level,3);
    const alternative=G.TRAITS.find(x=>x.slot===t.slot && x.id!==t.id);
    offered(s,'change',[alternative.id,t.id]); s.grounded=true; G.resolve(s,alternative.id);
    assert.equal(s.forms.length,1); assert.equal(s.forms[0].id,alternative.id); assert.equal(s.forms[0].level,1);
    assert.equal(G.stats(s)[t.stat],alternative.stat===t.stat?2:1); assert.equal(G.stats(s)[alternative.stat],2);
    offered(s,'mirror',['honey','moth']); s.grounded=true; G.resolve(s,'restore'); assert.equal(s.forms.length,0); assert.equal(s.seen.length,2);
  }
});
test('Wild magic adds two distinct slots, markets check affordability, and pass options always work', () => {
  const wild=encounter('chaos'); assert.ok(G.resolve(wild,'wild')); assert.equal(wild.forms.length,2); assert.equal(wild.totalChanges,2);
  const market=encounter('market'); market.gold=2; const before=JSON.stringify(market);
  assert.equal(G.resolve(market,'honey'),false); assert.equal(JSON.stringify(market),before);
  assert.ok(G.resolve(market,'luck')); assert.equal(market.gold,0); assert.equal(market.luck,6);
  for(const [type,action] of [['change','decline'],['trial','leave'],['market','leave'],['door','leave'],['rest','rest'],['rest','gold'],['fortune','safe'],['fortune','gamble'],['mirror','restore']]) {
    const s=encounter(type); s.gold=0; s.luck=9; assert.equal(G.resolve(s,action),true,`${type}/${action}`); assert.ok(s.luck<=9); assert.ok(G.restore(JSON.stringify(s)));
  }
});
test('Trial probabilities match every possible D6 outcome and seals cannot be farmed twice', () => {
  for(let bonus=1;bonus<20;bonus++) for(let target=9;target<=11;target++) {
    const wins=[1,2,3,4,5,6].filter(d=>d+bonus>=target).length;
    assert.equal(G.chances(bonus,target),Math.round(wins/6*100));
  }
  const s=encounter('trial'); s.forms=[{id:'porcelain',level:3},{id:'velvet',level:3},{id:'moth',level:3}]; s.power=6;
  for(const trial of G.TRIALS) { offered(s,'trial',['honey','moth']); assert.ok(G.resolve(s,trial.id)); assert.equal(s.result.check.success,true); }
  assert.equal(s.seals.length,3); assert.equal(s.gold,12);
  offered(s,'trial',['honey','moth']); const before=JSON.stringify(s);
  assert.equal(G.resolve(s,'brass'),false); assert.equal(JSON.stringify(s),before); assert.equal(G.resolve(s,'leave'),true);
});
test('A lap pays once, three seals open the exit, and the final turn still resolves before midnight', () => {
  const s=G.createGame('exit'); s.phase='rolled'; s.position=23; s.dice=[2,5];
  assert.ok(G.move(s)); assert.equal(s.position,1); assert.equal(s.gold,9); assert.equal(s.power,5); assert.equal(G.move(s),false);
  const win=G.createGame('exit'); win.phase='rolled'; win.position=21; win.dice=[3,5]; win.seals=['brass','velvet','moon']; win.turn=17;
  G.move(win); assert.equal(win.phase,'ended'); assert.equal(win.won,true); assert.equal(win.turn,18); assert.equal(win.position,0);
  assert.equal(G.roll(win),false); assert.equal(G.next(win),false);
  const loss=G.createGame('end'); loss.phase='rolled'; loss.dice=[1,6]; loss.turn=17;
  G.move(loss); assert.equal(loss.phase,'encounter'); G.resolve(loss,loss.pending.offers[0]); assert.equal(loss.phase,'result'); assert.equal(loss.totalChanges,1);
  G.next(loss); assert.equal(loss.phase,'ended'); assert.equal(loss.won,false);
});
test('Save reader rejects broken versions, duplicate slots, unknown traits and malformed encounters', () => {
  assert.equal(G.restore('not json'),null); assert.equal(G.restore('null'),null); assert.equal(G.restore('{}'),null);
  const cases=[{version:5},{dice:[9,1]},{gold:-1},{forms:[{id:'not-a-trait',level:1}]},{forms:[{id:'honey',level:1},{id:'porcelain',level:1},{id:'stars',level:1},{id:'glass',level:1}]},{seals:['brass','brass']},{phase:'encounter',pending:null},{phase:'result',result:{title:2,text:'bad'}},{log:[null]}];
  for(const patch of cases) assert.equal(G.restore(JSON.stringify({...G.createGame('bad'),...patch})),null);
});

// An intentionally modest strategy: prioritize approachable trials, then free changes.
function pickMove(s) {
  const evaluate=idx=>{
    const move=s.dice[idx],power=s.dice[1-idx],tile=G.TILES[(s.position+move)%24];
    if(s.seals.length===3)return move*10;
    if(tile.type==='trial') return 3 + Math.max(...G.TRIALS.filter(t=>!s.seals.includes(t.id)).map(t=>G.chances(power+G.stats(s)[t.stat],G.trialTarget(s))))/12;
    return ({change:6,chaos:7,mirror:5,market:s.gold>=3?4:0,rest:1,fortune:2,door:0})[tile.type];
  };
  if(evaluate(1)>evaluate(0))G.swap(s);
}
function pickEncounter(s) {
  const forced=G.commandedAction(s); if(forced)return forced;
  const type=s.pending.type;
  if(type==='trial')return [...G.TRIALS].filter(t=>!s.seals.includes(t.id)).sort((a,b)=>G.stats(s)[b.stat]-G.stats(s)[a.stat])[0]?.id||'leave';
  if(type==='market' && s.gold<G.marketPrice(s))return 'leave';
  if(type==='chaos')return 'wild';
  if(['change','mirror','market'].includes(type)) {
    const need=G.TRIALS.filter(t=>!s.seals.includes(t.id)).map(t=>t.stat);
    return [...s.pending.offers].filter(id=>G.canTake(s,id)&&!G.choicePressure(s,id)).sort((a,b)=>{
      const value=id=>{const trait=G.TRAITS.find(t=>t.id===id);return (need.includes(trait.stat)?3:0)+(s.forms.some(f=>G.TRAITS.find(t=>t.id===f.id).slot===trait.slot)?0:2);};
      return value(b)-value(a);
    })[0];
  }
  return ({door:'leave',fortune:'safe',rest:'gold'})[type];
}
test('500 complete seeded games terminate, survive every save boundary, and include wins and losses', () => {
  let wins=0;
  for(let n=0;n<500;n++) {
    let s=G.createGame('simulation-'+n,['curious','daring','gilded'][n%3]); let steps=0;
    while(s.phase!=='ended') {
      assert.ok(++steps<100);
      if(s.phase==='ready')G.roll(s);
      else if(s.phase==='rolled'){pickMove(s);G.move(s);}
      else if(s.phase==='encounter')assert.ok(G.resolve(s,pickEncounter(s)));
      else G.next(s);
      const loaded=G.restore(JSON.stringify(s)); assert.ok(loaded,`Save failed at ${s.phase}`); s=loaded;
      assert.ok(Object.values(G.stats(s)).every(v=>Number.isFinite(v)&&v>=1)); assert.ok(s.forms.length<=6);
    }
    if(s.won)wins++;
  }
  assert.ok(wins>75,`Too few winnable games: ${wins}/500`); assert.ok(wins<480,'Some runs should demand better decisions');
});

function launch(saved=null, blockedStorage=false, boardPreference=null) {
  const errors=[], console=new VirtualConsole(); console.on('jsdomError',error=>errors.push(error.message));
  const dom=new JSDOM(readFileSync(new URL('../src/dice/index.html',import.meta.url),'utf8'),{url:'http://127.0.0.1:4173/dice/?seed=ui-test',runScripts:'outside-only',pretendToBeVisual:true,virtualConsole:console});
  const w=dom.window; w.G=G; w.V=views; w.B=boardView; w.H=guestViews; Object.assign(w,art);
  w.matchMedia=()=>({matches:true}); w.HTMLElement.prototype.scrollIntoView=()=>{};
  w.HTMLDialogElement.prototype.showModal=function(){this.open=true;}; w.HTMLDialogElement.prototype.close=function(){this.open=false;};
  if(saved)w.localStorage.setItem(G.SAVE_KEY,saved);
  if(boardPreference)w.localStorage.setItem('hex-and-honey.board-view',boardPreference);
  if(blockedStorage)Object.defineProperty(w,'localStorage',{get(){throw new Error('Storage disabled');}});
  const script=readFileSync(new URL('../src/dice/app.mjs',import.meta.url),'utf8').replace(/^import .*;\r?\n/gm,'');
  w.eval(script); return {dom,w,errors,click:action=>w.document.querySelector(`[data-action="${action}"]`).click()};
}
test('UI rolls, swaps, moves, resolves, saves, restores and opens help without runtime errors', async () => {
  const {dom,w,errors,click}=launch();
  try {
    assert.equal(w.document.querySelectorAll('.tile').length,24); click('roll');
    await new Promise(r=>setTimeout(r,10));
    assert.ok(w.document.querySelector('[data-action="move"]')); const first=w.document.querySelector('.destination').getAttribute('aria-label');
    click('swap'); click('swap'); assert.equal(w.document.querySelector('.destination').getAttribute('aria-label'),first);
    click('move'); assert.equal(w.document.querySelectorAll('.choices button').length>0,true);
    w.document.querySelector('.choices button:not(:disabled)').click();
    assert.ok(w.document.querySelector('[data-action="next"]'));
    const saved=w.localStorage.getItem(G.SAVE_KEY), reloaded=launch(saved);
    assert.equal(reloaded.w.document.querySelector('.event-content h2').textContent,w.document.querySelector('.event-content h2').textContent);
    reloaded.dom.window.close(); click('next'); click('rules'); assert.equal(w.document.querySelector('dialog').open,true);
    click('close'); click('journal'); assert.ok(w.document.querySelector('.journal article'));
    click('close'); click('collection'); assert.equal(w.document.querySelectorAll('.collection-item').length,28);
    assert.deepEqual(errors,[]);
  } finally {dom.window.close();}
});
test('Every event and transformed portrait renders, and a malicious seed stays plain text', () => {
  for(const type of Object.keys(G.TILE_ICONS)) {
    const s=encounter(type); s.forms=G.TRAITS.filter((_,i)=>i%3===0).map(t=>({id:t.id,level:1}));
    const {dom,errors}=launch(JSON.stringify(s));
    assert.ok(dom.window.document.querySelector('.choices button')); assert.deepEqual(errors,[]); dom.window.close();
  }
  const s=G.createGame('<img src=x onerror=alert(1)>');const {dom,w,click}=launch(JSON.stringify(s));
  click('new'); assert.equal(w.document.querySelectorAll('dialog img').length,0); assert.ok(w.document.querySelector('code').textContent.includes('<img'));
  dom.window.close();
  const blocked=launch(null,true); assert.ok(blocked.w.document.body.textContent.includes('Autosave unavailable')); blocked.dom.window.close();
  const broken=launch('{broken'); assert.equal(broken.w.document.querySelector('dialog').open,true); broken.dom.window.close();
});

function withForms(s, ids) {
  s.forms=ids.map(id=>({id,level:1})); s.seen=[...ids]; return s;
}
function rolledWith(ids, dice=[3,4]) {
  const s=withForms(G.createGame('abilities'),ids); G.roll(s); s.dice=dice; return s;
}

test('Route choices preserve the selected adjustments and clear them only when changing dice', () => {
  const s=rolledWith(['fox','tail','honey','moth'],[3,4]);
  assert.ok(G.adjust(s,-1)); assert.ok(G.glide(s));
  const saved=JSON.stringify(s), {dom,w,errors,click}=launch(saved);
  try {
    click('route:0'); assert.equal(w.localStorage.getItem(G.SAVE_KEY),saved);
    click('route:1');
    const switched=G.restore(w.localStorage.getItem(G.SAVE_KEY));
    assert.equal(switched.moveIndex,1); assert.equal(switched.adjustment,0); assert.equal(switched.gliding,false);
    assert.equal(switched.rng,s.rng); assert.equal(switched.turn,s.turn); assert.equal(switched.luck,s.luck);
    assert.equal(w.document.querySelector('[data-action="route:1"]').getAttribute('aria-pressed'),'true');
    assert.equal(w.document.querySelector('.destination').dataset.action,'tile:'+G.destination(switched));
    click('route:0');
    const returned=G.restore(w.localStorage.getItem(G.SAVE_KEY));
    assert.equal(returned.moveIndex,0); assert.equal(returned.adjustment,0); assert.equal(returned.gliding,false);
    assert.equal(w.document.querySelector('.destination').dataset.action,'tile:3');
    const trialRoute=w.document.querySelector('[data-action="route:0"]').textContent;
    for(const trial of G.TRIALS) assert.ok(trialRoute.includes(G.STATS[trial.stat]+' '+G.checkChance({...returned,power:G.power(returned)},trial.stat)+'%'));
    click('move');
    for(const trial of G.TRIALS) assert.ok(w.document.querySelector('[data-action="choose:'+trial.id+'"]').textContent.includes(G.checkChance({...returned,power:G.power(returned)},trial.stat)+'%'));
    assert.deepEqual(errors,[]);
  } finally {dom.window.close();}
});

test('Board view persists independently without altering the game or its playable spaces', () => {
  const s=rolledWith(['honey','moth'],[3,5]); G.glide(s);
  const saved=JSON.stringify(s), {dom,w,errors,click}=launch(saved);
  try {
    const labels=()=>[...w.document.querySelectorAll('.tile')].map(t=>t.getAttribute('aria-label'));
    const original=labels(); assert.ok(w.document.querySelector('.board-ink'));
    click('board-view'); assert.ok(w.document.querySelector('.board-house')); assert.deepEqual(labels(),original);
    assert.equal(w.localStorage.getItem(G.SAVE_KEY),saved);
    assert.equal(w.localStorage.getItem('hex-and-honey.board-view'),'house');
    const reloaded=launch(saved,false,w.localStorage.getItem('hex-and-honey.board-view'));
    try {assert.ok(reloaded.w.document.querySelector('.board-house')); assert.deepEqual(reloaded.errors,[]);} finally {reloaded.dom.window.close();}
    click('board-view'); assert.ok(w.document.querySelector('.board-ink')); assert.deepEqual(labels(),original);
    assert.equal(w.localStorage.getItem(G.SAVE_KEY),saved); assert.deepEqual(errors,[]);
  } finally {dom.window.close();}
  const blocked=launch(null,true);
  try {blocked.click('board-view'); assert.ok(blocked.w.document.querySelector('.board-house')); assert.deepEqual(blocked.errors,[]);} finally {blocked.dom.window.close();}
});
test('Layering deepens existing traits, supports a third layer, and enforces both limits', () => {
  const s=withForms(encounter('change',['porcelain','stars']),['honey','moth']);
  const before=JSON.stringify(s), preview=G.previewChange(s,'porcelain',true);
  assert.equal(JSON.stringify(s),before); assert.deepEqual(preview.gained.map(c=>c.id),['glazed_honey']);
  assert.deepEqual(preview.deepened.map(f=>f.id),['honey']);
  assert.ok(G.resolve(s,'layer:porcelain')); assert.equal(s.luck,2); assert.equal(G.level(s,'honey'),2);
  assert.ok(s.result.text.includes('glaze forms over the honey')); assert.ok(G.restore(JSON.stringify(s)));
  offered(s,'change',['honey','stars']); assert.ok(G.resolve(s,'honey')); assert.equal(G.level(s,'honey'),3);
  offered(s,'change',['stars','fox']); assert.ok(G.resolve(s,'layer:stars')); assert.equal(s.luck,0);
  assert.equal(G.level(s,'honey'),4); assert.equal(G.level(s,'porcelain'),2); assert.equal(G.level(s,'stars'),1);
  offered(s,'change',['glass','fox']); s.luck=9; const unchanged=JSON.stringify(s);
  assert.equal(G.resolve(s,'layer:glass'),false); assert.equal(JSON.stringify(s),unchanged);
  assert.ok(G.resolve(s,'glass')); assert.deepEqual(s.forms.map(f=>f.id),['moth','glass']); assert.equal(G.hasCombo(s,'glazed_honey'),false);
  const full=withForms(encounter('change',['tail','halo']),['honey','porcelain','stars','velvet','echo','bells','moth','ribbons','clockwork','fox']);
  assert.equal(G.canLayer(full,'halo'),false); assert.equal(G.canTake(full,'tail'),false);
  const fullBefore=JSON.stringify(full); assert.equal(G.resolve(full,'tail'),false); assert.equal(JSON.stringify(full),fullBefore);
  assert.ok(G.resolve(full,'halo')); assert.equal(full.forms.length,10);
  const poor=withForms(encounter('change',['porcelain','stars']),['honey']); poor.luck=1;
  assert.equal(G.resolve(poor,'layer:porcelain'),false); assert.equal(poor.forms.length,1); assert.equal(poor.luck,1);
});

test('All 35 recipes activate only with their ingredients, and removing a layer ends its abilities', () => {
  assert.equal(G.COMBINATIONS.length,35);
  for(const combo of G.COMBINATIONS) {
    const s=withForms(encounter('mirror'),combo.needs);
    assert.ok(G.hasCombo(s,combo.id),combo.id); assert.ok(G.restore(JSON.stringify(s)),combo.id);
    s.grounded=true; assert.ok(G.resolve(s,'restore')); assert.equal(G.hasCombo(s,combo.id),false,combo.id);
  }
});
test('Counterbalance and gliding alter the destination and power, with resets and a three-trait upgrade', () => {
  const s=rolledWith(['fox','tail','honey','moth'],[3,4]);
  assert.ok(G.adjust(s,-1)); assert.ok(G.glide(s)); assert.equal(G.movement(s),4); assert.equal(G.power(s),3);
  assert.equal(G.destination(s),4); assert.deepEqual(G.restore(JSON.stringify(s)),s);
  G.swap(s); assert.equal(s.adjustment,0); assert.equal(s.gliding,false); assert.equal(G.movement(s),4);
  s.dice=[1,1]; s.moveIndex=0; assert.equal(G.adjust(s,-1),false); assert.equal(G.glide(s),false);
  s.forms.push({id:'ribbons',level:1}); assert.ok(G.glide(s)); assert.equal(G.power(s),1); assert.equal(G.movement(s),3);
  s.position=22; s.seals=['brass','velvet','moon']; assert.ok(G.move(s)); assert.equal(s.won,true); assert.equal(s.turn,1);
  assert.equal(G.glide(s),false); assert.equal(G.adjust(s,1),false);
});
test('Free rerolls and die flips remain once per turn across swaps, rerolls and saved games', () => {
  let s=rolledWith(['honey','porcelain','clockwork','echo','bells'],[4,2]); s.luck=0;
  assert.ok(G.hasCombo(s,'music_box')); assert.ok(G.hasCombo(s,'second_hand'));
  assert.ok(G.flip(s)); assert.equal(G.power(s),5); assert.equal(G.flip(s),false);
  assert.equal(G.rerollCost(s),0); assert.ok(G.reroll(s)); assert.equal(s.luck,0); assert.equal(s.freeRerollUsed,true);
  s=G.restore(JSON.stringify(s)); G.swap(s); assert.equal(G.flip(s),false); assert.equal(G.rerollCost(s),1); assert.equal(G.reroll(s),false);
  s.phase='ready'; assert.ok(G.roll(s)); assert.equal(G.rerollCost(s),0); assert.equal(s.flipped,false); assert.ok(G.flip(s));
  const glide=rolledWith(['honey','moth','clockwork','echo'],[2,6]); assert.ok(G.glide(glide)); assert.ok(G.flip(glide));
  assert.equal(glide.gliding,false); assert.equal(G.power(glide),1);
});
test('Combined check odds exactly enumerate Resonance and Afterimage without affecting fortune dice', () => {
  for(const ids of [[],['porcelain','bells'],['stars','shadow'],['porcelain','stars','bells','shadow']]) {
    for(let power=1;power<=6;power++) for(let seals=0;seals<=2;seals++) {
      const s=withForms(encounter('trial'),ids); s.power=power; s.seals=G.TRIALS.slice(0,seals).map(t=>t.id);
      for(const stat of Object.keys(G.STATS)) {
        const d=G.checkDetails(s,stat), values=[1,2,3,4,5,6].map(v=>d.onesHigh&&v===1?6:v);
        const results=d.count===2?values.flatMap(a=>values.map(b=>Math.max(a,b))):values;
        const wins=results.filter(v=>v+d.bonus>=d.target).length;
        assert.equal(G.checkChance(s,stat),Math.round(wins/results.length*100));
      }
      const fortune=G.checkDetails(s,'charm',false); assert.equal(fortune.count,1); assert.equal(fortune.onesHigh,false);
    }
  }
  let sawOne=false;
  for(let seed=1;seed<80;seed++) {
    const s=withForms(encounter('trial'),['porcelain','stars','bells','shadow']); s.rng=G.seedNumber('check-'+seed); s.power=1;
    assert.ok(G.resolve(s,'moon')); const c=s.result.check;
    assert.equal(c.rolls.length,2); assert.equal(c.rolled,Math.max(...c.rolls.map(d=>d===1?6:d)));
    assert.equal(c.success,c.rolled+c.bonus>=c.target); assert.deepEqual(G.restore(JSON.stringify(s)),s);
    if(c.rolls.includes(1))sawOne=true;
  }
  assert.ok(sawOne);
});
test('Market combinations charge the current price, charge layering separately, and reveal a third offer', () => {
  const s=withForms(encounter('market',['porcelain','stars']),['honey','ribbons']); s.gold=2;
  assert.ok(G.resolve(s,'porcelain')); assert.equal(s.gold,0); assert.equal(G.hasCombo(s,'long_reach'),false);
  const layer=withForms(encounter('market',['porcelain','stars']),['honey','ribbons']); layer.gold=2;
  assert.ok(G.resolve(layer,'layer:porcelain')); assert.equal(layer.gold,0); assert.equal(layer.luck,2); assert.ok(G.hasCombo(layer,'long_reach'));
  const first=withForms(encounter('market',['ribbons','moth']),['honey']); first.gold=2;
  assert.equal(G.resolve(first,'ribbons'),false); assert.equal(first.gold,2);
  const arrival=rolledWith(['stars','ribbons'],[4,2]); G.move(arrival);
  assert.equal(arrival.pending.type,'market'); assert.equal(arrival.pending.offers.length,3); assert.equal(new Set(arrival.pending.offers).size,3);
  assert.ok(G.restore(JSON.stringify(arrival)));
});
test('Rest and missed checks pay combination rewards once; New growth pays for passing, not landing', () => {
  for(const action of ['rest','gold']) {
    const s=withForms(encounter('rest'),['halo','roots']); s.luck=1; s.gold=0;
    assert.ok(G.resolve(s,action)); assert.equal(s.gold,3); assert.equal(s.luck,3);
    assert.equal(G.resolve(s,action),false); assert.equal(s.gold,3);
  }
  for(const [type,ids,action] of [['trial',['velvet','tail'],'moon'],['fortune',['velvet','echo'],'gamble']]) {
    const s=withForms(encounter(type),ids); s.power=0; s.gold=0; s.luck=0;
    assert.ok(G.resolve(s,action)); assert.equal(s.result.check.success,false); assert.equal(s.gold,2); assert.equal(s.luck,1);
  }
  const pass=rolledWith(['antlers','roots'],[6,4]); pass.gold=0; G.move(pass); assert.equal(pass.gold,1);
  const land=rolledWith(['antlers','roots'],[1,4]); land.gold=0; G.move(land); assert.equal(land.gold,0);
  assert.equal(G.move(pass),false); assert.equal(pass.gold,1);
});
test('Version 1 saves migrate every phase without changing resources, RNG, records or progression', () => {
  for(const phase of ['ready','rolled','encounter','result','ended']) {
    const legacy=withForms(encounter('change'),['honey','moth']);
    legacy.phase=phase; legacy.version=1; legacy.result={title:'Saved scene',text:'The original words stay here.'};
    legacy.log=[{turn:1,title:'Earlier scene',text:'Preserved.'}];
    if(phase==='ended'){legacy.won=true;legacy.seals=['brass','velvet','moon'];}
    for(const key of ['adjustment','gliding','flipped','freeRerollUsed','knownCombos'])delete legacy[key];
    const loaded=G.restore(JSON.stringify(legacy)); assert.ok(loaded,phase); assert.equal(loaded.version,G.VERSION);
    for(const [key,value] of Object.entries(legacy)) if(key!=='version')assert.deepEqual(loaded[key],value,`${phase}/${key}`);
    assert.deepEqual(loaded.knownCombos,['amber_wings']); assert.equal(loaded.flipped,false);
    assert.deepEqual(G.restore(JSON.stringify(loaded)),loaded);
  }
});
test('UI presents layered alternatives, combined odds and ability states that survive reload', async () => {
  const s=withForms(encounter('change',['porcelain','stars']),['honey','moth']);
  const ui=launch(JSON.stringify(s));
  try {
    const layer=ui.w.document.querySelector('[data-action="choose:layer:porcelain"]');
    assert.ok(layer.textContent.includes('Makes Glazed honey')); assert.ok(ui.w.document.querySelector('[data-action="choose:porcelain"]').textContent.includes('Ends Amber wings'));
    ui.click('choose:layer:porcelain'); assert.equal(ui.w.document.querySelectorAll('.body-slot.layered').length,1);
    assert.ok(ui.w.document.querySelector('.unlocked-combo').textContent.includes('Glazed honey'));
    assert.ok(G.restore(ui.w.localStorage.getItem(G.SAVE_KEY)).forms.some(f=>f.id==='honey'));
    assert.deepEqual(ui.errors,[]);
  } finally {ui.dom.window.close();}
  const ability=rolledWith(['honey','porcelain','clockwork','echo'],[4,1]); ability.luck=0;
  const controls=launch(JSON.stringify(ability));
  try {
    controls.click('flip'); assert.equal(controls.w.document.querySelector('[data-action="flip"]').disabled,true);
    controls.click('reroll'); await new Promise(r=>setTimeout(r,10));
    assert.equal(controls.w.document.querySelector('[data-action="reroll"]').disabled,true);
    const saved=controls.w.localStorage.getItem(G.SAVE_KEY), reload=launch(saved);
    assert.equal(reload.w.document.querySelector('[data-action="flip"]').disabled,true); reload.dom.window.close();
    assert.deepEqual(controls.errors,[]);
  } finally {controls.dom.window.close();}
  const trial=withForms(encounter('trial'),['porcelain','stars','bells','shadow']); trial.power=1;
  const odds=launch(JSON.stringify(trial));
  try {
    const text=odds.w.document.querySelector('[data-action="choose:moon"]').textContent;
    assert.ok(text.includes('best of 2D6')); assert.ok(text.includes('A rolled 1 counts as 6')); assert.ok(text.includes(G.checkChance(trial,'weird')+'%'));
    assert.deepEqual(odds.errors,[]);
  } finally {odds.dom.window.close();}
});
test('300 games using layers and abilities stay legal through every save boundary', () => {
  const discovered=new Set(); let layered=0;
  for(let n=0;n<300;n++) {
    let s=G.createGame('stacked-'+n),steps=0;
    while(s.phase!=='ended') {
      assert.ok(++steps<100);
      if(s.phase==='ready') G.roll(s);
      else if(s.phase==='rolled') {
        pickMove(s);
        if(G.hasCombo(s,'second_hand')||G.hasCombo(s,'music_box'))G.flip(s);
        if(G.hasCombo(s,'glazed_honey'))G.reroll(s);
        if(G.hasCombo(s,'counterbalance'))G.adjust(s,1);
        if(G.hasCombo(s,'amber_wings'))G.glide(s);
        assert.ok(G.move(s));
      } else if(s.phase==='encounter') {
        let action=pickEncounter(s);
        if(['change','mirror','market','chaos'].includes(s.pending.type) && (s.pending.type!=='market'||s.gold>=G.marketPrice(s))) {
          const candidate=s.pending.offers.find(id=>G.canLayer(s,id));
          if(candidate){action='layer:'+candidate;layered++;}
          else {
            const partner=s.pending.offers.find(id=>G.previewChange(s,id).gained.length>0);
            if(partner)action=partner;
          }
        }
        if(G.choicePressure(s,action))action=pickEncounter(s);
        assert.ok(G.resolve(s,action),`${n}/${action}`);
      } else assert.ok(G.next(s));
      G.combinations(s).forEach(c=>discovered.add(c.id));
      assert.ok(s.forms.length<=G.MAX_FORMS); assert.ok(s.forms.every(f=>G.slotForms(s,f.id).length<=G.MAX_LAYERS));
      const loaded=G.restore(JSON.stringify(s)); assert.ok(loaded,`${n}/${s.phase}`); s=loaded;
    }
  }
  assert.ok(layered>150); assert.ok(discovered.size>=24,`Only ${discovered.size} combinations seen`);
});

test('All nine guest loans remove exactly one trait, survive saves, and return stronger compatible forms', () => {
  for(const guest of G.GUESTS) for(const id of guest.wants) for(const level of [1,2,3,4]) {
    let s=withForms(encounter(guest.from),[id,guest.partners[id]]);
    s.forms[0].level=level;
    const initialCombos=G.combinations(s), rng=s.rng, total=s.totalChanges;
    assert.ok(initialCombos.length,`${id} has a compatible gift`);
    assert.ok(G.resolve(s,`lend:${guest.id}:${id}`));
    assert.equal(s.gold,8); assert.equal(s.rng,rng); assert.equal(s.totalChanges,total);
    assert.equal(s.forms.some(f=>f.id===id),false);
    assert.ok(initialCombos.every(c=>!G.hasCombo(s,c.id)));
    assert.equal(G.favor(s,guest.id).level,level);
    s=G.restore(JSON.stringify(s)); assert.ok(s);
    offered(s,guest.to,['honey','moth']);
    const preview=G.fitting(s,guest.id,'full'), before=JSON.stringify(s);
    assert.equal(JSON.stringify(s),before,'preview is pure');
    assert.ok(preview.allowed); assert.ok(G.resolve(s,`collect:${guest.id}:full`));
    assert.deepEqual(s.forms,preview.forms); assert.equal(s.forms.find(f=>f.id===id).level,Math.min(G.MAX_STAGE,level+1));
    assert.ok(initialCombos.every(c=>G.hasCombo(s,c.id)),`${id} fitting preserves both ingredients`);
    assert.ok(s.result.text.includes(guest.thanks)); assert.ok(s.result.combos.length);
    const after=JSON.stringify(s); assert.equal(G.resolve(s,`collect:${guest.id}:full`),false); assert.equal(JSON.stringify(s),after);
    offered(s,guest.from,['honey','moth']); const completed=JSON.stringify(s);
    assert.equal(G.resolve(s,`lend:${guest.id}:${id}`),false); assert.equal(JSON.stringify(s),completed);
    assert.ok(G.restore(JSON.stringify(s)));
  }
});

test('Fittings preview replacement losses, price preserved layers, and reject full slots without partial writes', () => {
  const s=withForms(encounter('market'),['moth','ribbons','porcelain','bells']);
  s.luck=9; assert.ok(G.resolve(s,'lend:edda:moth')); offered(s,'mirror');
  const full=G.fitting(s,'edda','full'), layered=G.fitting(s,'edda','layer');
  assert.deepEqual(full.removed.map(f=>f.id).sort(),['porcelain','ribbons']);
  assert.ok(full.lost.some(c=>c.id==='resonance'));
  assert.equal(layered.cost,4); assert.equal(layered.removed.length,0); assert.ok(layered.fits);
  assert.ok(layered.gained.some(c=>c.id==='amber_kite'));
  s.luck=3; const poor=JSON.stringify(s); assert.equal(G.resolve(s,'collect:edda:layer'),false); assert.equal(JSON.stringify(s),poor);
  s.luck=4; assert.ok(G.resolve(s,'collect:edda:layer')); assert.equal(s.luck,0);
  assert.ok(['amber_wings','amber_kite','resonance','glazed_honey'].every(id=>G.hasCombo(s,id)));
  assert.equal(s.forms.length,5); assert.ok(G.restore(JSON.stringify(s)));
  // A third voice now fits and deepens the voice already present.
  const ivo=withForms(encounter('rest'),['velvet']); G.resolve(ivo,'lend:ivo:velvet');
  ivo.forms=[{id:'bells',level:2}]; offered(ivo,'trial');
  assert.equal(G.fitting(ivo,'ivo','layer').fits,true);
  assert.ok(G.resolve(ivo,'collect:ivo:layer')); assert.ok(G.hasCombo(ivo,'night_speech'));
  assert.equal(G.level(ivo,'bells'),3); assert.equal(ivo.forms.length,3);
  const edda=withForms(encounter('market'),['moth']); G.resolve(edda,'lend:edda:moth');
  edda.forms=['ribbons','clockwork','manyhands'].map(id=>({id,level:1})); offered(edda,'mirror');
  const before=JSON.stringify(edda); assert.equal(G.fitting(edda,'edda','layer').fits,false);
  assert.equal(G.resolve(edda,'collect:edda:layer'),false); assert.equal(JSON.stringify(edda),before);
  assert.ok(G.resolve(edda,'collect:edda:full'));
});

test('Plain returns and sales remain usable, pay once, respect caps, and do not trigger unrelated rest rewards', () => {
  for(const mode of ['plain','cash']) {
    const s=withForms(encounter('rest'),['bells','halo','roots']); s.luck=8;
    G.resolve(s,'lend:ivo:bells'); assert.equal(s.gold,8); assert.equal(s.luck,8,'lending is not resting');
    offered(s,'trial'); assert.ok(G.resolve(s,`collect:ivo:${mode}`));
    assert.equal(s.luck,9); assert.equal(s.forms.some(f=>f.id==='porcelain'),false);
    assert.equal(s.forms.some(f=>f.id==='bells'),mode==='plain');
    assert.equal(s.gold,mode==='cash'?14:8);
    const without={...s,favors:[]}; assert.equal(G.score(s)-G.score(without),40);
    const before=JSON.stringify(s); offered(s,'trial');
    const again=JSON.stringify(s); assert.equal(G.resolve(s,`collect:ivo:${mode}`),false); assert.equal(JSON.stringify(s),again);
    assert.ok(G.restore(before));
  }
  const crowded=withForms(encounter('market'),['moth']); G.resolve(crowded,'lend:edda:moth');
  crowded.forms=['honey','velvet','echo','bells','antlers','fox','halo','roots','shadow','tail'].map(id=>({id,level:1})); offered(crowded,'mirror');
  assert.equal(G.fitting(crowded,'edda','full').fits,false); assert.equal(G.fitting(crowded,'edda','plain').fits,false);
  assert.ok(G.resolve(crowded,'collect:edda:cash')); assert.equal(crowded.forms.length,10);
});

test('Guest actions validate venue, form, status and mode before mutation; older saves acquire an empty guest ledger', () => {
  const s=withForms(encounter('change'),['moth']);
  for(const action of ['lend:edda:moth','lend:missing:moth','collect:edda:full']) {
    const before=JSON.stringify(s); assert.equal(G.resolve(s,action),false); assert.equal(JSON.stringify(s),before);
  }
  offered(s,'market');
  for(const action of ['lend:edda:tail','lend:edda:clockwork','lend:edda:moth:extra']) {
    const before=JSON.stringify(s); assert.equal(G.resolve(s,action),false); assert.equal(JSON.stringify(s),before);
  }
  G.resolve(s,'lend:edda:moth'); offered(s,'market'); const wrongPlace=JSON.stringify(s);
  assert.equal(G.resolve(s,'collect:edda:full'),false); assert.equal(JSON.stringify(s),wrongPlace);
  offered(s,'mirror'); const wrongMode=JSON.stringify(s);
  for(const action of ['collect:edda','collect:edda:nope','collect:edda:full:extra']) {assert.equal(G.resolve(s,action),false); assert.equal(JSON.stringify(s),wrongMode);}
  for(const phase of ['ready','rolled','encounter','result','ended']) {
    const legacy=phase==='encounter'?encounter('market'):G.createGame('v2');
    legacy.phase=phase; if(phase==='result')legacy.result={title:'Existing record',text:'Keep these exact words.'};
    legacy.version=2; delete legacy.favors;
    const rng=legacy.rng, loaded=G.restore(JSON.stringify(legacy)); assert.ok(loaded,phase);
    assert.equal(loaded.rng,rng); assert.deepEqual(loaded.favors,[]); assert.equal(loaded.phase,phase);
    assert.deepEqual(loaded.result,legacy.result);
  }
  for(const favors of [null,[null],[{id:'edda',trait:'tail',level:1,status:'lent'}],[{id:'edda',trait:'moth',level:5,status:'lent'}],[{id:'edda',trait:'moth',level:1,status:'returned',mode:'free'}],[s.favors[0],s.favors[0]]]) {
    assert.equal(G.restore(JSON.stringify({...s,favors})),null);
  }
});

test('Guest UI explains lost abilities, marks collection spaces, preserves receipts on reload and resolves layered rewards', () => {
  const s=withForms(encounter('market'),['moth','honey','ribbons']);
  const ui=launch(JSON.stringify(s));
  try {
    const choice=ui.w.document.querySelector('[data-action="choose:lend:edda:moth"]');
    assert.ok(choice.textContent.includes('Pauses Amber kite')); choice.click();
    assert.equal(ui.w.document.querySelectorAll('.guest-marker').length,2);
    assert.ok(ui.w.document.querySelector('.on-loan').textContent.includes('Moth wings on loan'));
    const saved=ui.w.localStorage.getItem(G.SAVE_KEY), reloaded=launch(saved);
    assert.ok(reloaded.w.document.querySelector('.on-loan')); reloaded.dom.window.close();
    ui.click('guest:edda'); assert.ok(ui.w.document.querySelector('dialog').textContent.includes('On loan: Moth wings'));
    ui.click('close'); assert.deepEqual(ui.errors,[]);
    const collect=G.restore(saved); offered(collect,'mirror');
    const fittingUI=launch(JSON.stringify(collect));
    try {
      assert.ok(fittingUI.w.document.querySelector('[data-action="choose:collect:edda:full"]').textContent.includes('Replaces ribbon arms'));
      fittingUI.click('choose:collect:edda:layer');
      const loaded=G.restore(fittingUI.w.localStorage.getItem(G.SAVE_KEY)); assert.ok(G.hasCombo(loaded,'amber_kite'));
      assert.equal(loaded.forms.find(f=>f.id==='moth').level,2); assert.equal(loaded.luck,2);
      assert.equal(fittingUI.w.document.querySelectorAll('.guest-marker').length,0);
      assert.deepEqual(fittingUI.errors,[]);
    } finally {fittingUI.dom.window.close();}
  } finally {ui.dom.window.close();}
});

test('300 games pursuing guests can complete every favor, finish the last-turn fitting, and restore at each decision', () => {
  const completed=new Set(); let settled=0;
  for(let n=0;n<300;n++) {
    let s=G.createGame('guests-'+n),steps=0;
    while(s.phase!=='ended') {
      assert.ok(++steps<100);
      if(s.phase==='ready')G.roll(s);
      else if(s.phase==='rolled') {
        pickMove(s);
        const value=idx=>{
          const type=G.TILES[(s.position+s.dice[idx])%24].type;
          if(G.waitingGuests(s,type).length)return 10;
          if(s.turn<12 && G.GUESTS.some(g=>g.from===type && !G.favor(s,g.id) && s.forms.some(f=>g.wants.includes(f.id))))return 5;
          return 0;
        };
        if(value(1-s.moveIndex)>value(s.moveIndex))G.swap(s);
        assert.ok(G.move(s));
      } else if(s.phase==='encounter') {
        let action=pickEncounter(s);
        const collect=G.waitingGuests(s,s.pending.type)[0];
        const loan=G.GUESTS.find(g=>g.from===s.pending.type && !G.favor(s,g.id) && s.forms.some(f=>g.wants.includes(f.id)));
        if(collect) {
          const mode=G.fitting(s,collect.id,'full').allowed?'full':'cash'; action=`collect:${collect.id}:${mode}`;
          completed.add(collect.id); settled++;
        } else if(loan && s.turn<13)action=`lend:${loan.id}:${s.forms.find(f=>loan.wants.includes(f.id)).id}`;
        if(G.choicePressure(s,action))action=pickEncounter(s);
        assert.ok(G.resolve(s,action),`${n}/${action}`);
      } else G.next(s);
      const loaded=G.restore(JSON.stringify(s)); assert.ok(loaded,`${n}/${s.phase}`); s=loaded;
      assert.ok(s.forms.length<=G.MAX_FORMS); assert.ok(s.forms.every(f=>G.slotForms(s,f.id).length<=G.MAX_LAYERS));
    }
  }
  assert.equal(completed.size,3); assert.ok(settled>150,`${settled} favors settled`);
  const last=withForms(encounter('fortune'),['shadow']); G.resolve(last,'lend:rook:shadow'); offered(last,'chaos'); last.turn=18;
  assert.ok(G.resolve(last,'collect:rook:full')); assert.ok(G.hasCombo(last,'afterimage')); assert.ok(G.next(last)); assert.equal(last.phase,'ended');
  assert.equal(last.favors[0].status,'returned');
});

test('All traits reach four authored stages and mirrors deepen the complete form without exceeding the cap', () => {
  for(const trait of G.TRAITS) {
    const s=encounter('change',[trait.id,'honey']);
    for(let stage=1;stage<=4;stage++) {
      offered(s,'change',[trait.id,'honey']); s.grounded=true;
      assert.ok(G.resolve(s,trait.id),trait.id+'/'+stage); assert.equal(G.level(s,trait.id),stage);
      assert.ok(s.result.text.length>90); assert.ok(!s.result.text.includes('undefined'));
      assert.ok(G.restore(JSON.stringify(s)));
    }
    offered(s,'change',[trait.id,'honey']); s.grounded=true; const capped=JSON.stringify(s);
    assert.equal(G.resolve(s,trait.id),false); assert.equal(JSON.stringify(s),capped);
  }
  const s=withForms(encounter('mirror'),['honey','porcelain','moth','ribbons','chorus']);
  s.forms[0].level=4; s.grounded=true; s.luck=1;
  const poor=JSON.stringify(s); assert.equal(G.resolve(s,'deepen'),false); assert.equal(JSON.stringify(s),poor);
  s.luck=2; assert.ok(G.resolve(s,'deepen')); assert.equal(s.luck,0); assert.equal(G.level(s,'honey'),4);
  assert.ok(s.forms.slice(1).every(f=>f.level===2)); assert.equal(s.totalChanges,4); assert.ok(G.restore(JSON.stringify(s)));
  const free=withForms(encounter('mirror'),['glass','antlers','roots']); free.luck=0;
  assert.equal(G.deepenCost(free),0); assert.ok(G.resolve(free,'deepen')); assert.ok(free.forms.every(f=>f.level===2));
});

test('Mental urges restrict stated choices, can be grounded, and retain benefits through the turn', () => {
  const hunger=withForms(encounter('change',['honey','glass']),['appetite','honey']);
  assert.ok(G.choicePressure(hunger,'honey')); assert.ok(G.choicePressure(hunger,'decline')); assert.equal(G.choicePressure(hunger,'glass'),'');
  const before=JSON.stringify(hunger); assert.equal(G.resolve(hunger,'honey'),false); assert.equal(JSON.stringify(hunger),before);
  hunger.forms[0].level=3; hunger.luck=1; assert.equal(G.steady(hunger),false);
  hunger.luck=2; assert.ok(G.steady(hunger)); assert.equal(hunger.luck,0); assert.ok(G.resolve(hunger,'honey'));
  assert.ok(G.next(hunger)); assert.ok(G.roll(hunger)); assert.equal(hunger.grounded,false);
  const poor=withForms(encounter('market',['glass','honey']),['appetite']); poor.gold=0;
  assert.equal(G.choicePressure(poor,'leave'),''); assert.ok(G.resolve(poor,'leave'));
  const dream=withForms(G.createGame('dream-control'),['reverie','roots']); G.roll(dream);
  dream.dice=[2,6]; dream.moveIndex=1; assert.equal(G.swap(dream),false); assert.equal(G.rerollCost(dream),0);
  dream.luck=0; assert.equal(G.focusCost(dream),0); assert.ok(G.steady(dream)); assert.ok(G.swap(dream));
  const choir=withForms(encounter('trial'),['chorus','porcelain']);
  assert.equal(G.checkDetails(choir,'nerve').count,2); assert.ok(G.choicePressure(choir,'moon')); assert.equal(G.focusCost(choir),0);
  assert.ok(G.steady(choir)); assert.equal(G.choicePressure(choir,'moon'),''); assert.equal(G.checkDetails(choir,'nerve').count,2);
});

test('Implanted commands survive saves and grounding, override urges, and expire only after the required decisions', () => {
  const acquired=new Set();
  for(let n=0;n<30;n++) {const s=G.createGame('instruction-'+n); offered(s,'change',['hypnosis','honey']); s.turn=1; G.resolve(s,'hypnosis'); acquired.add(s.command.kind); assert.ok(s.result.text.includes(G.commandText(s))); assert.ok(G.restore(JSON.stringify(s)));}
  assert.equal(acquired.size,3);
  let bottle=withForms(encounter('change',['honey','glass']),['appetite','honey','hypnosis']);
  bottle.command={kind:'bottle',remaining:2,issuedTurn:0}; bottle.grounded=true;
  assert.equal(G.commandedAction(bottle),'honey'); assert.equal(G.choicePressure(bottle,'honey'),'');
  const locked=JSON.stringify(bottle); assert.equal(G.resolve(bottle,'glass'),false); assert.equal(JSON.stringify(bottle),locked);
  assert.ok(G.resolve(bottle,'honey')); assert.equal(bottle.command.remaining,1);
  bottle=G.restore(JSON.stringify(bottle)); offered(bottle,'change',['glass','honey']); bottle.turn=2;
  assert.ok(G.resolve(bottle,'glass')); assert.equal(bottle.command,null);
  const route=withForms(G.createGame('command-conflict'),['reverie']); route.command={kind:'route',remaining:1,issuedTurn:0};
  G.roll(route); assert.ok(route.dice[route.moveIndex]<=route.dice[1-route.moveIndex]); route.grounded=true;
  route.dice=[2,6];route.moveIndex=0;assert.equal(G.swap(route),false); assert.ok(G.move(route)); assert.equal(route.command,null);
  const trial=withForms(encounter('trial'),['chorus','porcelain','clockwork','hypnosis']);
  trial.command={kind:'trial',remaining:1,issuedTurn:0}; trial.grounded=true;
  assert.equal(G.commandedAction(trial),'moon'); const luck=trial.luck;
  assert.equal(G.resolve(trial,'brass'),false); assert.ok(G.resolve(trial,'moon')); assert.equal(trial.command,null); assert.ok(trial.luck>=luck+2);
  const waiting=withForms(encounter('mirror'),['hypnosis']); waiting.command={kind:'bottle',remaining:1,issuedTurn:0};
  assert.ok(G.resolve(waiting,'restore')); assert.equal(G.level(waiting,'hypnosis'),0); assert.equal(waiting.command.kind,'bottle');
  const replaced=withForms(encounter('change',['dim','honey']),['hypnosis','clockwork']);
  replaced.command={kind:'bottle',remaining:1,issuedTurn:0}; replaced.luck=0;
  assert.ok(G.resolve(replaced,'dim')); assert.equal(replaced.luck,3); // Obedience pays before the combo ends; new Soft focus adds one.
  assert.equal(G.hasCombo(replaced,'clockwork_obedience'),false); assert.equal(replaced.command,null);
  const newlyMade=withForms(encounter('change',['clockwork','honey']),['hypnosis']);
  newlyMade.command={kind:'bottle',remaining:1,issuedTurn:0}; newlyMade.luck=0;
  assert.ok(G.resolve(newlyMade,'clockwork')); assert.equal(newlyMade.luck,0); // A newly formed combo cannot pay retroactively.
});

test('New physical combinations alter movement, costs, rolls and fortune probabilities', () => {
  const wings=rolledWith(['glass','moth','honey','ribbons'],[2,4]); assert.ok(G.glide(wings)); assert.equal(G.movement(wings),5); assert.equal(G.power(wings),4);
  const mist=rolledWith(['mist','shadow','honey'],[3,4]); assert.ok(G.adjust(mist,1)); mist.position=5; mist.luck=1; assert.ok(G.move(mist)); assert.equal(mist.luck,2);
  const hands=rolledWith(['manyhands','clockwork'],[4,2]); assert.ok(G.flip(hands)); assert.equal(G.power(hands),5); assert.equal(G.rerollCost(hands),0);
  const shop=withForms(encounter('market',['glass','moth']),['appetite','ribbons']); shop.gold=1;
  assert.equal(G.marketPrice(shop),1); assert.ok(G.resolve(shop,'glass')); assert.equal(shop.gold,0);
  for(const ids of [['glass','stars'],['dim','stars']]) {
    const s=withForms(encounter('fortune'),ids); s.power=1;
    const info=G.checkDetails(s,'charm',false); assert.equal(info.onesHigh,true);
    const wins=[1,2,3,4,5,6].filter(d=>(d===1?6:d)+info.bonus>=10).length;
    assert.equal(G.checkChance(s,'charm',false),Math.round(wins/6*100));
  }
  const three=withForms(encounter('trial'),['chorus','bells']); three.grounded=true; three.power=1;
  const info=G.checkDetails(three,'weird'); assert.equal(info.count,3);
  let wins=0;for(let a=1;a<=6;a++)for(let b=1;b<=6;b++)for(let c=1;c<=6;c++)if(Math.max(a,b,c)+info.bonus>=info.target)wins++;
  assert.equal(G.checkChance(three,'weird'),Math.round(wins/216*100));
  assert.ok(G.resolve(three,'moon')); assert.equal(three.result.check.rolls.length,3); assert.ok(G.restore(JSON.stringify(three)));
});

test('Soft focus hides printed numbers without changing the saved quantities; calculus restores reading and boosts checks', () => {
  const s=rolledWith(['dim'],[2,5]); const ui=launch(JSON.stringify(s));
  try {
    assert.ok(!/\d/.test(ui.w.document.querySelector('#app').textContent));
    assert.equal(ui.w.document.querySelector('.move-die').getAttribute('aria-label'),'Die: two');
    ui.click('collection'); assert.ok(!/\d/.test(ui.w.document.querySelector('dialog').textContent));
    assert.deepEqual(JSON.parse(ui.w.localStorage.getItem(G.SAVE_KEY)).dice,[2,5]); assert.deepEqual(ui.errors,[]);
  } finally {ui.dom.window.close();}
  const clear=withForms(encounter('trial'),['dim','calculus','glass']);
  assert.ok(G.numbersReadable(clear)); assert.equal(G.focusCost(clear),0);
  assert.equal(G.checkDetails(clear,'nerve').bonus,clear.power+G.stats(clear).nerve+1);
  clear.forms.find(f=>f.id==='calculus').level=3; assert.equal(G.checkDetails(clear,'nerve').bonus,clear.power+G.stats(clear).nerve+2);
  const readable=launch(JSON.stringify(clear));try {assert.ok(readable.w.document.querySelector('.power-chip').textContent.includes('5'));assert.deepEqual(readable.errors,[]);}finally{readable.dom.window.close();}
  const rest=withForms(G.createGame('soft-focus'),['dim']); rest.luck=1; G.roll(rest); assert.equal(rest.luck,2);
});

test('The final reflection accounts for deep layers, their interactions, mental changes, and unfinished commands', () => {
  const s=withForms(G.createGame('final-reflection'),['honey','porcelain','moth','ribbons','manyhands','mist','appetite','hypnosis','calculus','antlers']);
  s.forms.forEach(f=>f.level=4); s.phase='ended';s.turn=18;s.command={kind:'bottle',remaining:1,issuedTurn:17};
  const report=G.describeForm(s); assert.ok(report.body.join(' ').includes('amber')); assert.ok(report.interactions.some(p=>p.includes('ribbons brace'))); assert.ok(report.mind.some(p=>p.includes('instruction remains')));
  for(const won of [false,true]) {s.won=won; const ui=launch(JSON.stringify(s));try {const form=ui.w.document.querySelector('.form-report');assert.ok(form);for(const f of s.forms)assert.ok(form.textContent.includes(G.TRAITS.find(t=>t.id===f.id).name));assert.ok(!form.textContent.includes('undefined'));assert.deepEqual(ui.errors,[]);}finally{ui.dom.window.close();}}
  const ordinary=G.describeForm(G.createGame('human'));assert.ok(ordinary.body[0].includes('familiar weight'));assert.deepEqual(ordinary.interactions,[]);
});

test('Version 3 migration retains loans, log text, randomness and phase; malformed commands are rejected', () => {
  const s=withForms(encounter('market'),['moth']); G.resolve(s,'lend:edda:moth');
  s.version=3; delete s.grounded; delete s.command;
  const restored=G.restore(JSON.stringify(s));assert.ok(restored);assert.equal(restored.version,4);assert.equal(restored.rng,s.rng);assert.deepEqual(restored.favors,s.favors);assert.deepEqual(restored.log,s.log);assert.equal(restored.phase,s.phase);assert.equal(restored.command,null);
  for(const command of [{kind:'unknown',remaining:1,issuedTurn:0},{kind:'route',remaining:0,issuedTurn:0},{kind:'bottle',remaining:1,issuedTurn:20},{}])assert.equal(G.restore(JSON.stringify({...restored,command})),null);
});

test('Combined mental restrictions always leave a legal encounter action, including at zero resources', () => {
  const minds=['appetite','reverie','chorus','hypnosis','dim','calculus'];
  for(let bits=1;bits<64;bits++) {
    const ids=minds.filter((_,i)=>bits&(1<<i));if(ids.length>3)continue;
    for(const type of Object.keys(G.TILE_ICONS)) for(const kind of [null,'bottle','trial']) {
      const s=withForms(encounter(type,['honey','glass']),ids);s.forms.forEach(f=>f.level=3);s.gold=0;s.luck=0;
      s.command=kind?{kind,remaining:1,issuedTurn:0}:null;
      const actions=[...s.pending.offers,'wild','deepen','restore','decline','rest','gold','safe','gamble','leave',...G.TRIALS.map(t=>t.id)];
      assert.ok(actions.some(action=>G.resolve(structuredClone(s),action)),ids+'/'+type+'/'+kind);
    }
  }
  const s=withForms(encounter('trial'),['chorus','hypnosis','appetite']);
  s.command={kind:'trial',remaining:1,issuedTurn:0};s.forms[0].level=3;
  const ui=launch(JSON.stringify(s));
  try {const enabled=[...ui.w.document.querySelectorAll('.choices button')].filter(b=>!b.disabled);assert.equal(enabled.length,1);assert.equal(enabled[0].dataset.action,'choose:moon');ui.click('steady');assert.equal(ui.w.document.querySelector('[data-action="choose:brass"]').disabled,true);assert.deepEqual(ui.errors,[]);}finally{ui.dom.window.close();}
});

test('Illustrated entries open for undiscovered and held traits without changing the game', () => {
  const s=G.createGame('illustrated-book'); s.forms=[{id:'honey',level:3}]; s.seen=['honey'];
  const ui=launch(JSON.stringify(s));
  try {
    const saved=ui.w.localStorage.getItem(G.SAVE_KEY);
    ui.click('collection');
    const plates=[...ui.w.document.querySelectorAll('.collection-item img')];
    assert.equal(plates.length,G.TRAITS.length);
    assert.equal(new Set(plates.map(img=>img.getAttribute('src'))).size,G.TRAITS.length);
    for(const t of G.TRAITS) {
      ui.click('trait:'+t.id);
      assert.equal(ui.w.document.querySelectorAll('.growth-pages details').length,G.MAX_STAGE);
      assert.ok(ui.w.document.querySelector('.form-plate img').alt.includes(t.name));
      assert.ok(!ui.w.document.querySelector('dialog').textContent.includes('undefined'));
      ui.click('collection');
    }
    ui.click('combinations'); assert.equal(ui.w.document.querySelectorAll('.recipe-card').length,G.COMBINATIONS.length);
    ui.click('combo:amber_kite'); assert.equal(ui.w.document.querySelectorAll('.combo-plate').length,3);
    ui.click('trait:honey'); assert.ok(ui.w.document.querySelector('.growth-pages details[open]').textContent.includes('Stage 3'));
    assert.equal(ui.w.localStorage.getItem(G.SAVE_KEY),saved);
    assert.equal(art.traitArt('../../invalid'), '');
    assert.deepEqual(ui.errors,[]);
  } finally { ui.dom.window.close(); }
});

test('A commanded trial stays visible when a guest fitting would normally be featured', () => {
  const s=encounter('trial'); s.turn=2;
  s.favors=[{id:'ivo',trait:'velvet',level:2,status:'lent'}];
  s.command={kind:'trial',remaining:1,issuedTurn:1};
  const ui=launch(JSON.stringify(s));
  try {
    assert.equal(ui.w.document.querySelector('.usual-actions').open,true);
    assert.equal(ui.w.document.querySelector('[data-action="choose:collect:ivo:full"]').disabled,true);
    assert.equal(ui.w.document.querySelector('[data-action="choose:brass"]').disabled,false);
    ui.click('choose:brass');
    assert.equal(JSON.parse(ui.w.localStorage.getItem(G.SAVE_KEY)).command,null);
    assert.deepEqual(ui.errors,[]);
  } finally { ui.dom.window.close(); }
});

 test('Playful forms stack movement, offer, rest and check rules without duplicate benefits', () => {
  const paper=rolledWith(['paper','ribbons'],[2,5]); assert.ok(G.adjust(paper,-1)); assert.equal(G.movement(paper),1); assert.equal(G.power(paper),5);
  const balloon=rolledWith(['balloon','honey'],[4,1]); assert.ok(G.glide(balloon)); assert.equal(G.movement(balloon),6); assert.equal(G.power(balloon),1); assert.ok(G.restore(JSON.stringify(balloon)));
  balloon.forms.push({id:'glass',level:1},{id:'moth',level:1}); assert.equal(G.movement(balloon),7); assert.equal(G.power(balloon),1);
  assert.match(views.activeRule(balloon,G.COMBINATIONS.find(c=>c.id==='sugar_lift')),/3 extra spaces at no power cost/);
  const offers=rolledWith(['paper','calculus','appetite','stars','ribbons'],[4,5]); assert.ok(G.move(offers)); assert.equal(offers.pending.type,'market'); assert.equal(offers.pending.offers.length,4); assert.equal(new Set(offers.pending.offers).size,4); assert.ok(G.restore(JSON.stringify(offers)));
  for(const action of ['rest','gold']) { const rest=withForms(encounter('rest'),['balloon','roots','halo']); rest.luck=0; rest.gold=0; assert.ok(G.resolve(rest,action)); assert.equal(rest.gold,3); assert.equal(rest.luck,2); }
  const swarm=withForms(encounter('trial'),['swarm','chorus','glass','bells','porcelain']); assert.equal(G.checkDetails(swarm,'weird').count,3); assert.equal(G.checkDetails(swarm,'weird').onesHigh,true); assert.equal(G.checkDetails(swarm,'charm',false).count,1); assert.equal(G.checkDetails(swarm,'charm',false).onesHigh,true);
  const rehearsal=withForms(encounter('trial'),['puppet','echo']); for(let power=1;power<=6;power++) {rehearsal.power=power; assert.equal(G.checkDetails(rehearsal,'charm').bonus,power+1+(power<=2?2:0)); assert.equal(G.checkDetails(rehearsal,'charm',false).bonus,power+1);}
 });

 test('String commands pay from the pre-choice form and remain once per obedience across saves', () => {
  let route=rolledWith(['puppet','hypnosis','clockwork'],[1,5]); route.command={kind:'route',remaining:2,issuedTurn:0};route.gold=0;route.luck=0;
  route=G.restore(JSON.stringify(route)); assert.ok(G.move(route)); assert.equal(route.gold,3); assert.equal(route.luck,2); assert.equal(route.command.remaining,1);
  const paid=JSON.stringify(route); assert.equal(G.move(route),false); assert.equal(JSON.stringify(route),paid);
  const bottle=withForms(encounter('change',['ribbons','paper']),['puppet','hypnosis']);bottle.command={kind:'bottle',remaining:1,issuedTurn:0};bottle.gold=0;
  assert.ok(G.resolve(bottle,'ribbons')); assert.equal(bottle.gold,3); assert.equal(G.level(bottle,'puppet'),0);assert.equal(bottle.command,null);
  const newCombo=withForms(encounter('change',['puppet','paper']),['hypnosis']);newCombo.command={kind:'bottle',remaining:1,issuedTurn:0};newCombo.gold=0;
  assert.ok(G.resolve(newCombo,'puppet'));assert.equal(newCombo.gold,0);
  const body=withForms(G.createGame('paper-body'),['paper','balloon','swarm','puppet','ribbons']);body.forms.forEach(f=>f.level=4);
  const report=G.describeForm(body);assert.ok(report.interactions.some(p=>p.includes('wooden joints hold folded paper')));assert.ok(!report.body.join(' ').includes('undefined'));
 });
