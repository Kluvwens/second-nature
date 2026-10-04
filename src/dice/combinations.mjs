import { PLAYFUL_COMBINATIONS } from './playful-forms.mjs';
import { EXTRA_COMBINATIONS, DEEP_GROWTH, EXTRA_GROWTH } from './deep-forms.mjs';
// Rules and physical consequences belong together so the player can inspect both.
export const COMBINATIONS = [
  { id: 'counterbalance', name: 'Counterbalance', needs: ['fox', 'tail'], timing: 'Before moving', rule: 'Adjust movement by 1 space either way. Power stays the same.',
    text: 'Your ears turn toward a footstep and your tail swings the other way. You catch your balance before you know you have lost it. On the next step you try it deliberately, placing your foot just beyond the edge of a floorboard.' },
  { id: 'amber_wings', name: 'Amber wings', needs: ['honey', 'moth'], timing: 'Before moving', rule: 'Glide 2 extra spaces by giving up 1 power. You need at least 2 power.',
    text: 'Honey draws out between the veins of your wings. They sag against your back, heavier than paper now. You spread them carefully. The amber stretches thin enough to hold the air, though keeping it spread takes most of your attention.' },
  { id: 'second_hand', name: 'Second hand', needs: ['clockwork', 'echo'], timing: 'Once per turn', rule: 'Turn the power die onto its opposite face: 1 ↔ 6, 2 ↔ 5, 3 ↔ 4.',
    text: 'You hear your fingers click before they move. With your eyes closed, you follow the sound through the next bend of each brass joint. Your hand turns the die over. You already know what number will face up.' },
  { id: 'resonance', name: 'Resonance', needs: ['porcelain', 'bells'], timing: 'Trial check', rule: 'Roll two check dice and keep the higher result.',
    text: 'The next note catches in your porcelain ribs. You feel it ring back through your throat, clearer than the first. You brace a hand against your chest until the sound fades. The blue flowers under the glaze tremble with it.' },
  { id: 'afterimage', name: 'Afterimage', needs: ['stars', 'shadow'], timing: 'Trial check', rule: 'A check die showing 1 counts as 6. Other faces keep their value.',
    text: 'The stars under your skin keep shining after your shadow passes over them. For a moment a second outline stands behind you, lit at every joint. You lift one hand. The outline finishes the gesture your real hand abandons.' },
  { id: 'long_reach', name: 'Long reach', needs: ['honey', 'ribbons'], timing: 'Night market', rule: 'Buying a transformation costs 2 gold instead of 3.',
    text: 'Your ribbons darken as honey soaks along their weave. You draw one finger across the table and leave a narrow amber thread. It stays attached when you lift your hand. You can pick up a coin from the far end without leaning out of your chair.' },
  { id: 'busker', name: 'An encore', needs: ['velvet', 'tail'], timing: 'Failed trial', rule: 'Gain 2 gold when you miss a trial, as well as the usual 1 luck.',
    text: 'Your tail starts keeping time with your voice. You try a few quiet notes and it follows each one, brushing the floor on the beat. Several faces turn. You stop singing, but a coin has already landed beside your foot.' },
  { id: 'groundwire', name: 'Grounded light', needs: ['halo', 'roots'], timing: 'Breathing room', rule: 'Either rest choice gives both rewards: 2 luck and 3 gold.',
    text: 'The light above your head sinks through you in a slow, warm line. Your roots uncurl against the cool floor. You sit down and feel the current settle between them. For the first time since the ring appeared, your jaw unclenches.' },
  { id: 'grafted_crown', name: 'New growth', needs: ['antlers', 'roots'], timing: 'While moving', rule: 'Gain 1 gold if you pass a change square. Landing on one does not count.',
    text: 'A green bud opens at the tip of an antler. Below your shoes, the roots turn toward it. You feel a tug through your spine whenever you pass another bottle of changing draught. You begin to recognise the tug before you see the label.' },
  { id: 'glazed_honey', name: 'Glazed honey', needs: ['honey', 'porcelain'], timing: 'Once per turn', rule: 'Your first reroll each turn is free. Later rerolls cost 1 luck.',
    text: 'The glaze forms over the honey without driving it out. You bend a finger and a hairline crack opens, amber welling through before the porcelain knits shut. You test the same joint twice. It holds, although you can feel the liquid moving inside it.' },
  { id: 'night_speech', name: 'A word ahead', needs: ['velvet', 'echo'], timing: 'Failed fortune check', rule: 'Take 2 gold on a missed gamble, as well as the usual 1 luck.',
    text: 'Your low voice answers a question nobody has asked. A moment later the words reach you from across the table. You recognise the exchange and find that you have time to choose a different answer.' },
  { id: 'star_silk', name: 'Star silk', needs: ['stars', 'ribbons'], timing: 'Arrive at a market', rule: 'The market offers three transformations instead of two.',
    text: 'Small lights slip out along your ribbon fingers. You stretch them toward a dark shelf and the points of light travel ahead, picking out a third bottle behind the others. When you draw your hand back, its label stays clear in your mind.' },
  { id: 'amber_kite', name: 'Amber kite', needs: ['honey', 'moth', 'ribbons'], timing: 'Improves Amber wings', rule: 'Your ribbons brace the wings. Gliding no longer costs power.',
    text: 'You pull a ribbon tight beneath each amber wing. The sag lifts. Air presses evenly across the honey instead of pooling at the edges, and you can hold the span without concentrating on every inch of it. You take one foot off the floor, then the other.' },
  { id: 'music_box', name: 'Music box', needs: ['porcelain', 'clockwork', 'bells'], timing: 'Once per turn', rule: 'Turn the power die onto its opposite face. Resonance still gives two trial dice.',
    text: 'A brass finger taps your wrist. The note travels through the glaze and comes back in time with a second tap. You keep the rhythm going, feeling the little gears find it. When you reach for the die, your fingers settle around its opposite corners.' },
];

export const GROWTH = {
  antlers: ['A new fork grows from each antler. You feel the added weight when you turn toward the table, then adjust your shoulders to carry it.', 'The branches spread wider than your shoulders. You turn sideways through the curtain, holding it clear with one hand until every branch is through.'],
  fox: ['You pick out a whispered number beneath the music. Your ears turn separately now, one toward the dice and the other toward the door.', 'The room breaks into separate sounds: a cup on felt, a breath held at the next table, the scrape inside a closed drawer. You lower your ears until the noise becomes bearable.'],
  halo: ['The ring divides into two narrow bands. You reach up to straighten one, and both turn beneath your fingers without touching them.', 'A third band settles inside the others. Their hum follows the rhythm of your breathing. You slow it deliberately and watch the light steady.'],
  honey: ['Your elbow softens when you lean on it. You catch yourself, watching the amber spread, then draw the arm back into shape. It takes less effort the second time.', 'You pull a long thread of honey between finger and thumb. The feeling stretches along its whole length. You wind it back into your palm rather than let any of it fall.'],
  porcelain: ['Blue leaves branch across your wrists. When you flex, the glaze moves with you; you keep expecting the sharp resistance of a crack.', 'The pattern reaches your fingertips. You lay all ten on the table and hear a neat row of notes, each one felt somewhere beneath your ribs.'],
  stars: ['A cluster of lights drifts up your arm. You press a thumb over it and watch the stars flow around the pressure.', 'The space beneath your skin looks deeper than your arm should allow. You trace a familiar freckle until your eyes can settle on the surface again.'],
  velvet: ['You speak at your usual volume and the far table turns. You lower your voice, testing how little breath it needs to carry.', 'You can hold a note through the length of a slow exhale. It stays even when your hand begins to shake. You stop before anyone asks for another.'],
  bells: ['A lower note joins the first. It rings in your collarbones when you say your name, and you feel the two sounds part when you change the vowel.', 'You whisper and hear a whole chord, quiet but distinct. Closing your mouth cuts it off cleanly now. You practise that part several times.'],
  echo: ['The echo reaches you a full breath early. You listen to a sentence you have yet to finish and change the last word.', 'You hear two possible answers in your own voice. One is close, the other faint. You choose the faint one and wait until your mouth catches up.'],
  moth: ['Your wings open beyond the sides of the chair. A slow stroke lifts your heels. You grip the seat until they touch the floor again.', 'You can feel the air curling along every wing vein. A small adjustment holds you level; you keep one hand on the table while you try another.'],
  clockwork: ['A second set of joints settles into your thumbs. You roll a coin across your fingers without dropping it, then try to make yourself put it down.', 'You feel the gears take up the slack before each movement. Even the smallest turn arrives exactly where you intend. Your handwriting is still recognisably yours.'],
  ribbons: ['You unbraid a hand into five long strips. Each still feels like a finger, even laid flat across the cloth. Folding them back is easier than watching it happen.', 'Your forearms divide into narrow ribbons as well. You wind them around a chair rung and pull; the woven grip holds your weight without a knot.'],
  tail: ['Your tail grows long enough to reach the table behind you. You tuck it against your chair, embarrassed by how much attention that takes.', 'You can curl the tip around a cup handle. You lift it an inch, set it down, and look over your shoulder to check that you really did.'],
  shadow: ['Your shadow reaches the next square before you do. You stop moving and it waits, one hand raised as though holding the place.', 'It presses flat against the far wall while you stand by the table. You recognise your own posture in it and copy the turn of its head.'],
  roots: ['Thicker roots curl around your ankles. You feel a coin beneath the rug and work it free without bending down.', 'The roots spread whenever you stand still. You can feel the joins between the floorboards and the hollow space below them. You draw them back before taking a step.'],
};
COMBINATIONS.push(...EXTRA_COMBINATIONS);
for (const [id, passages] of Object.entries(DEEP_GROWTH)) GROWTH[id] = [GROWTH[id][0], ...passages];
Object.assign(GROWTH, EXTRA_GROWTH);

COMBINATIONS.push(...PLAYFUL_COMBINATIONS);
