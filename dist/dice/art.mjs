const illustratedTraits = new Set(['paper','balloon','swarm','puppet','antlers','fox','halo','honey','porcelain','stars','glass','mist','velvet','bells','echo','moth','clockwork','ribbons','tail','manyhands','shadow','roots','appetite','reverie','chorus','hypnosis','dim','calculus']);
export function traitArt(id, cls = '', alt = '') {
  if (!illustratedTraits.has(id)) return '';
  return `<img class="trait-art ${cls}" src="./forms/${id}.png" width="1024" height="1024" loading="lazy" decoding="async" alt="${alt}">`;
}
const paths = {
  hands: '<path d="M3 18V9l2-1 2 7V5l2-1 2 10V3l2-1 1 12 2-7 2 1-1 11-5 4H7Zm17-6 2 2-1 6-3 3"/>',
  mist: '<path d="M3 7c4-5 7 4 11 0s7-2 7-2M2 12c5-5 8 4 12 0s7-2 8-2M4 18c4-4 7 3 11 0s5-1 6-1"/>',
  eye: '<path d="M2 12c6-10 14-10 20 0-6 10-14 10-20 0Z"/><circle cx="12" cy="12" r="4"/><path d="M12 2v3m0 14v3"/>',
  voices: '<path d="M3 3h13v11H9l-4 4v-4H3ZM9 17h7l4 4v-4h2V7h-3M6 7h7m-7 3h5"/>',
  spiral: '<path d="M12 12c0-4 6-3 6 1 0 7-12 7-12-1C6 1 23 1 23 12c0 12-22 14-22 0"/>',
  journal: '<path d="M6 3h12v19H6ZM3 6h5M3 11h5M3 16h5m4-9h4m-4 5h4m-4 5h3"/>',
  moth: '<path d="M12 8C7 1 0 3 3 10l7 4C2 11 3 22 10 18l2-5 2 5c7 4 8-7 0-4l7-4c3-7-4-9-9-2Z"/><path d="M12 8v11m0-11-3-4m3 4 3-4"/>',
  stars: '<path d="m12 2 2.8 7.2L22 12l-7.2 2.8L12 22l-2.8-7.2L2 12l7.2-2.8Z"/><path d="m20 2 .5 1.5L22 4l-1.5.5L20 6l-.5-1.5L18 4l1.5-.5Z"/>',
  crown: '<path d="m3 7 5 4 4-7 4 7 5-4-2 12H5Z"/><path d="M6 16h12"/>',
  antlers: '<path d="M8 21v-6L4 9V3m4 12 4-4V5m4 16v-6l4-6V3M4 8 1 5m11 4L9 6m7 9-4-4m8-3 3-3"/>',
  door: '<path d="M5 22V9a7 7 0 0 1 14 0v13ZM9 21V9a3 3 0 0 1 6 0v12M3 22h18"/><path d="M12 13h1"/>',
  bag: '<path d="m8 3 2 5h4l2-5Zm2 5C1 13 2 22 12 22s11-9 2-14Z"/><path d="M10 14h4m-4 3h4m-2-5v7"/>',
  bolt: '<path d="m14 2-11 12h8l-1 8L21 9h-8Z"/>',
  moon: '<path d="M20 15A9 9 0 0 1 9 3a9 9 0 1 0 11 12Z"/><path d="m18 2 1 3 3 1-3 1-1 3-1-3-3-1 3-1Z"/>',
  diamond: '<path d="m12 2 9 10-9 10L3 12Zm0 0L8 12l4 10 4-10Z"/><path d="M3 12h18"/>',
  drop: '<path d="M12 2C10 7 4 11 4 15a8 8 0 0 0 16 0c0-4-6-8-8-13Z"/><path d="M8 14c-1 3 1 5 3 5"/>',
  fox: '<path d="m3 2 9 6 9-6-2 13-7 7-7-7Z"/><path d="m5 12 7 10 7-10M8 12h1m6 0h1"/>',
  sun: '<circle cx="12" cy="12" r="5"/><path d="M12 1v3m0 16v3M1 12h3m16 0h3M4 4l2 2m12 12 2 2M4 20l2-2M18 6l2-2"/>',
  music: '<path d="M9 18V5l12-3v13M9 9l12-3"/><ellipse cx="5" cy="19" rx="4" ry="3"/><ellipse cx="17" cy="16" rx="4" ry="3"/>',
  bell: '<path d="M4 17h16l-3-5V8a5 5 0 0 0-10 0v4ZM9 20a3 3 0 0 0 6 0M12 1v2"/>',
  gear: '<path d="m9 2 6 0 1 4 4 1 2 5-3 3v4l-5 3-3-3H7l-4-4 2-4-2-4 4-3Z"/><circle cx="12" cy="12" r="4"/>',
  ribbon: '<path d="M12 12C-3 7 5-3 12 5c7-8 15 2 0 7Zm-2 1-5 9 6-3 1-6 1 6 6 3-5-9"/>',
  tail: '<path d="M3 21C22 23 23 1 12 2 5 2 6 13 12 11c-1 5-4 7-9 7Z"/>',
  leaf: '<path d="M4 20C-2 5 13 8 20 2c4 14-5 20-16 18ZM4 20 17 7M9 15V9m0 6h7"/>',
  arrow: '<path d="M4 12h15m-6-6 6 6-6 6"/>',
  swap: '<path d="M3 7h17l-4-4m4 14H3l4 4M3 7l4 4m13 6-4-4"/>',
  book: '<path d="M12 5C8 2 4 2 2 3v17c3-1 6-1 10 1 4-2 7-2 10-1V3c-2-1-6-1-10 2Zm0 0v16"/>',
  volume: '<path d="m3 9 4 0 5-5v16l-5-5H3Zm13-2c4 3 4 7 0 10m3-14c6 5 6 13 0 18"/>',
  mute: '<path d="m3 9 4 0 5-5v16l-5-5H3Zm13 0 6 6m0-6-6 6"/>',
  check: '<path d="m5 12 4 5L20 5"/>',
  coin: '<circle cx="12" cy="12" r="9"/><circle cx="12" cy="12" r="6"/><path d="M12 8v8"/>',
  dice: '<rect x="3" y="3" width="18" height="18" rx="4"/><circle cx="8" cy="8" r=".7"/><circle cx="16" cy="8" r=".7"/><circle cx="12" cy="12" r=".7"/><circle cx="8" cy="16" r=".7"/><circle cx="16" cy="16" r=".7"/>',
};
export function icon(name, cls = '') { return `<svg class="icon ${cls}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.35" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths[name] || paths.stars}</svg>`; }
export function dieFace(value, cls = '') {
  const positions = { 1: [4], 2: [0,8], 3: [0,4,8], 4: [0,2,6,8], 5: [0,2,4,6,8], 6: [0,2,3,5,6,8] };
  return `<span class="die ${cls}" role="img" aria-label="Die: ${value}">${Array.from({length:9}, (_,i) => `<i class="${positions[value].includes(i) ? 'pip' : ''}"></i>`).join('')}</span>`;
}
export function portrait(forms) {
  const has = id => forms.some(f => f.id === id);
  const skin = has('honey') ? '#c99545' : has('porcelain') ? '#d4d9cc' : has('stars') ? '#697580' : '#c99b7c';
  return `<svg viewBox="0 0 260 275" class="portrait" role="img" aria-label="Mara, with your current transformations">
  <defs><radialGradient id="portrait-glow"><stop stop-color="#696c4b" stop-opacity=".4"/><stop offset="1" stop-color="#202826" stop-opacity="0"/></radialGradient><pattern id="portrait-stars" width="23" height="23" patternUnits="userSpaceOnUse"><circle cx="10" cy="12" r="1" fill="#f4d9a2"/></pattern></defs>
  <rect width="260" height="275" fill="#202826"/><circle cx="130" cy="133" r="125" fill="url(#portrait-glow)"/>
  <g fill="none" stroke="#a89964" opacity=".3"><path d="M34 252V114a96 96 0 0 1 192 0v138M42 252V114a88 88 0 0 1 176 0v138"/><circle cx="130" cy="130" r="71"/><path d="M130 12v14M26 130h14m180 0h14M55 55l9 9m132 0 9-9"/></g>
  ${has('moth') ? `<path d="M124 162C32 64-15 94 33 188c-44 78 48 74 93 24M136 162c92-98 139-68 91 26 44 78-48 74-93 24" fill="${has('honey') ? '#c99643' : '#8d8970'}" stroke="#d3bc82" stroke-width="2"/><path d="m35 141 77 47-66 37m179-84-77 47 66 37" fill="none" stroke="${has('honey') ? '#996b36' : '#293c37'}" stroke-width="8"/>${has('ribbons') ? '<path d="m30 115 71 123m129-123-71 123" fill="none" stroke="#a2bd88" stroke-width="4"/>' : ''}` : ''}
  ${has('shadow') ? '<path d="M212 275c36-90-26-151-41-133-19 30 10 59-12 94l-20 39Z" fill="#101718"/><circle cx="178" cy="163" r="2" fill="#eed6a3"/>' : ''}
  ${has('tail') ? '<path d="M193 265c73-17 34-60 49-89-63 26-18 57-70 67" fill="#b5754b" stroke="#d9b879" stroke-width="2"/>' : ''}
  <path d="M74 154c-18-75 15-100 56-101 60-2 72 61 54 108l-14 59H84Z" fill="#513c32" stroke="#262a25" stroke-width="3"/>
  <path d="m107 160-4 35-37 14-14 66h164l-20-66-41-14-4-35" fill="${skin}" stroke="#493d32" stroke-width="2"/>
  <path d="M66 210 104 195l27 24 24-24 42 16 19 64H52Z" fill="#436351" stroke="#233c33" stroke-width="2"/>
  <path d="m104 195 1 37 26-13 22 13 2-37M130 219v56M75 224l-9 50m122-50 11 50" fill="none" stroke="#92a48a" stroke-opacity=".5"/>
  <path d="M87 105c-7 23 0 49 15 65 16 19 37 21 54-1 13-16 20-39 16-62l-37-31Z" fill="${skin}" stroke="#453b32" stroke-width="2"/>
  <path d="M80 124c-18-51 31-88 74-66 24 12 30 35 20 74l-12-27c-17 3-31-12-39-22-4 23-24 37-43 41Z" fill="#634a39" stroke="#43382f" stroke-width="2"/>
  <path d="M101 93c-21 38-27 39-17 76m78-74c29 44 9 66 15 86" fill="none" stroke="#8d6b49" stroke-width="5"/>
  <path d="m95 128 18-1m27 0 17 2" fill="none" stroke="#59463a" stroke-width="3"/>
  <path d="M97 135q8-7 16 0m28 0q8-6 15 1" fill="none" stroke="#363e35" stroke-width="2"/><circle cx="105" cy="134" r="2.6" fill="#708376"/><circle cx="148" cy="135" r="2.6" fill="#708376"/>
  <path d="m128 134-4 12 6 2m-12 13q10 5 20-1" fill="none" stroke="#815d4d" stroke-width="1.6"/>
  <g fill="#805c44"><circle cx="102" cy="144" r="1"/><circle cx="108" cy="147" r="1"/><circle cx="114" cy="143" r="1"/><circle cx="143" cy="146" r="1"/><circle cx="150" cy="144" r="1"/><circle cx="155" cy="148" r="1"/></g>
  <path d="m159 88 14 14m-17-10 14 14" stroke="#d8b46d" stroke-width="3"/>
  ${has('stars') ? '<path d="M88 122h82v34l-29 28h-25l-27-30Z" fill="url(#portrait-stars)"/>' : ''}
  ${has('porcelain') ? '<path d="M143 158q-4-15 10-18m-10 14 12-5m-8-3-2-8" fill="none" stroke="#668b9e" stroke-width="2"/>' : ''}
  ${has('porcelain') && has('honey') ? '<path d="m88 141 12 4-2 10 8 12-7-2-8-14Zm59 18 8-8 8 2-8 18-9 7-5-4Z" fill="#e5e2ce" stroke="#789499" stroke-width="1"/><path d="m157 155-5 9 3 5" fill="none" stroke="#c89443" stroke-width="2"/>' : ''}
  ${has('antlers') ? '<path d="M105 71 81 42l-3-24m9 32-25-4-8-18m91 45 25-34 3-24m-11 36 25-9 6-15" fill="none" stroke="#d5c898" stroke-width="6" stroke-linecap="round"/>' : ''}
  ${has('fox') ? '<path d="m77 85-5-53 39 29m43 0 35-32-4 60" fill="#b57d54" stroke="#e4c191" stroke-width="2"/><path d="m81 63-1-17 20 19m67-3 13-15-2 22" fill="#564334"/>' : ''}
  ${has('halo') ? '<ellipse cx="129" cy="36" rx="48" ry="12" fill="none" stroke="#e5c581" stroke-width="4" transform="rotate(-9 129 36)"/>' : ''}
  ${has('bells') || has('velvet') || has('echo') ? '<g fill="none" stroke="#dbc390" stroke-width="1.3"><path d="M177 145q13 10 0 20m7-26q20 15 0 32M69 147q-12 10 0 20"/></g>' : ''}
  ${has('clockwork') ? '<g fill="#b69a60" stroke="#e0c38d"><circle cx="78" cy="251" r="12"/><circle cx="179" cy="251" r="12"/><path d="M78 242v18m-9-9h18m92-9v18m-9-9h18"/></g>' : ''}
  ${has('ribbons') ? '<path d="M73 239q-40 10 0 26t-8 21m120-47q40 10 0 26t8 21" fill="none" stroke="#94b097" stroke-width="8"/>' : ''}
  ${has('roots') ? '<path d="m80 271-18-20-17 2m17-2-3-13m123 33 18-20 17 2m-17-2 3-13" fill="none" stroke="#b3ad7c" stroke-width="3"/>' : ''}
  ${has('manyhands') ? '<path d="M73 220 34 204l-9 24m162-8 39-16 9 24M73 240l-31 7-5 22m150-29 31 7 5 22" fill="none" stroke="#c99b7c" stroke-width="10" stroke-linecap="round"/>' : ''}
  ${has('glass') ? '<path d="M98 174 130 188l32-14m-52 23 20 50 22-50M98 124l16 43m37-43-16 43" fill="none" stroke="#e6f1eb" stroke-width="3" opacity=".8"/>' : ''}
  ${has('mist') ? '<path d="M25 240q55-30 103 0t110-5M18 258q70-24 115 0t112-3M30 275q57-25 107-3t94-2" fill="none" stroke="#c3cbc5" stroke-width="10" opacity=".45"/>' : ''}
  ${has('paper') ? '<path d="m92 181 38 30 37-31-13 54-24-23-22 23ZM64 235l31 18-30 13m130-31-31 18 31 13" fill="#e8dfcc" stroke="#5b554b" stroke-width="2"/>' : ''}
  ${has('balloon') ? '<g stroke="#e1c79b" stroke-width="2"><path d="m64 48 44 40m22-60v51m67-33-46 42" fill="none"/><ellipse cx="61" cy="29" rx="17" ry="22" fill="#b44031"/><ellipse cx="130" cy="16" rx="17" ry="22" fill="#e4d7b8"/><ellipse cx="200" cy="26" rx="17" ry="22" fill="#b44031"/></g>' : ''}
  ${has('swarm') ? '<g fill="#d2b98f"><path d="m31 182 10 5-3 8 7-8 8-2-9-4-6 3Zm178-30 10 5-3 8 7-8 8-2-9-4-6 3ZM19 218l10 5-3 8 7-8 8-2-9-4-6 3Zm188 14 10 5-3 8 7-8 8-2-9-4-6 3Z"/></g>' : ''}
  ${has('puppet') ? '<g fill="none" stroke="#b48e65" stroke-width="3"><circle cx="74" cy="240" r="8"/><circle cx="185" cy="240" r="8"/><path d="m74 240 64-51 47 51" stroke="#cb4e3d"/></g>' : ''}
  ${forms.some(f=>['appetite','reverie','chorus','hypnosis','dim','calculus'].includes(f.id)) ? '<path d="M93 29q38-27 76 0M101 22q29-18 59 0" fill="none" stroke="#f05940" stroke-width="2"/>' : ''}
  <g fill="#dcc18a"><path d="m36 85 2 5 5 2-5 2-2 5-2-5-5-2 5-2ZM221 203l2 5 5 2-5 2-2 5-2-5-5-2 5-2Z"/></g></svg>`;
}
