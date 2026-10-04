// Every guest trades an immediate loss for a known, reachable combination.
export const GUESTS = [
  {
    id: 'edda', name: 'Edda', title: 'The seamstress', initial: 'E',
    from: 'market', to: 'mirror', wants: ['moth', 'ribbons', 'clockwork'],
    partners: { moth: 'honey', ribbons: 'honey', clockwork: 'echo' },
    request: 'A woman sits inside a coat that is sewing itself. Every few stitches she slaps a sleeve flat. “Too many elbows,” she says. “Let me borrow something that bends properly. I’ll meet you at the looking glass for the fitting.”',
    waiting: 'Edda lifts a measuring tape toward your ordinary hands, then lets it fall. “Come back with wings, ribbons, or those lovely brass fingers. I can work with any of those.”',
    pickup: 'Your reflection wears Edda’s coat. You do not. She stands between you, pinning the empty air. “I made an adjustment.” You look at the extra parcel beside your claim ticket. “You made two.”',
    thanks: 'Edda folds the finished coat over her arm. Its elbows finally agree about where they belong. She taps the pocket where she keeps your measurements.',
    cash: '“Keep it,” you say, before you can reconsider. Edda takes out her purse. The coat reaches around her to shake your hand, using a movement you recognize.',
    ending: 'Edda’s measuring tape peeks out of your pocket. You put it back before it can measure anything else.',
  },
  {
    id: 'ivo', name: 'Ivo', title: 'The singer in the bottle', initial: 'I',
    from: 'rest', to: 'trial', wants: ['velvet', 'bells', 'echo'],
    partners: { velvet: 'echo', bells: 'porcelain', echo: 'velvet' },
    request: 'A little man stands inside the fountain’s empty bottle, mouthing a furious song. You loosen the cork. “My voice is on the other side of the stage,” he says. “Lend me yours until the curtain goes up? I can pay in harmonies.”',
    waiting: 'Ivo cups a hand to his ear. “Something with a little carry. Velvet, bells, an echo. Yours is perfectly nice, but I’ve got to fill a room from inside a bottle.”',
    pickup: 'A familiar note comes through the trial door. Ivo leans from his bottle on the judges’ table. “There you are. I put something in the lower register.” You feel the note against your throat before you open your mouth.',
    thanks: 'Ivo raises his bottle like a hat. You hear him practising your laugh, then stopping when he notices you listening.',
    cash: 'You push the bottle back toward the stage. “Keep the voice.” Ivo stops mid-note. He counts out six very small coins; each becomes ordinary gold when it touches your palm.',
    ending: 'From somewhere under the counter, Ivo sings the first line of a song you have not taught him yet.',
  },
  {
    id: 'rook', name: 'Mr. Rook', title: 'The understudy', initial: 'R',
    from: 'fortune', to: 'chaos', wants: ['tail', 'shadow', 'roots'],
    partners: { tail: 'fox', shadow: 'stars', roots: 'antlers' },
    request: 'A waistcoat hangs over an empty chair. Its watch chain rises as someone checks the time. “My replacement hasn’t arrived,” says the chair. “Could I borrow whatever follows you around? Collect it at the wild box. I’ll teach it a trick.”',
    waiting: 'The empty waistcoat turns toward your feet. “A tail would do. Roots, if they’re willing. Or a shadow with initiative. Mine left before I could ask for a reference.”',
    pickup: 'The wild box scratches from inside. Mr. Rook sits on the lid. “Very quick learner,” he says. “We had a disagreement about who was in charge.” Something beneath him knocks twice.',
    thanks: 'Mr. Rook’s waistcoat bows. The chair stays empty. You decide against asking what, exactly, needed an understudy.',
    cash: 'You leave the claim ticket beneath the watch chain. “Sounds like you two deserve each other.” Mr. Rook pays without haggling. The box knocks again, more insistently.',
    ending: 'A second set of footsteps follows yours for three paces, then hurries back toward Mr. Rook’s chair.',
  },
];

export const LOAN_TEXT = {
  moth: 'Edda touches the base of each wing with the blunt end of a needle. The weight lifts from your shoulders. You turn too quickly without it and catch the table. Across from you, the wings open against her coat. You reach back once more, although you already know what you will find.',
  ribbons: 'You lay a ribbon hand across Edda’s palm. She winds the green lengths onto a spool; familiar fingers uncurl behind them. You flex each one. The spool gives an answering twitch. You ask her to keep it somewhere warm, then pretend to examine a button.',
  clockwork: 'Edda holds out two gloves. Your brass fingers slip into them, and the precise little stops in your joints fade. You try to pick up the needle. You miss on the first attempt. She says nothing, which is somehow worse.',
  velvet: 'You speak your name into Ivo’s bottle. The low note settles around him like a scarf. When you ask whether that is enough, your voice comes out without its velvet undertone. You had forgotten how much effort it takes to carry it across a room.',
  bells: 'You let one chord fall into the bottle. Ivo catches it against his chest. The next word leaves your mouth without a single bright overtone, and the sudden quiet makes you touch your throat. From behind the glass, your bells try a scale.',
  echo: 'Your next sentence reaches the bottle before you speak. Ivo catches the cork and seals it in. You wait for the warning that usually comes before your voice. Nothing. You choose a word just to hear it arrive on time.',
  tail: 'Your tail curls around the empty waistcoat. You feel the last brush of lining, then your balance shifts forward. The copper tip flicks from beneath Mr. Rook’s chair. It is still making the little impatient movement you keep trying to stop.',
  shadow: 'Your shadow steps around your shoes and sits in the empty chair. For a moment you can still feel where it bends its knees. Then the pull leaves your ankles. A plain, obedient shadow falls behind you. You test it twice.',
  roots: 'You feel your roots find the chair legs. They loosen from your shoes, one fine thread after another, until the floor goes quiet beneath you. You can see Mr. Rook tapping a heel. You can no longer feel it from across the room.',
};

export const RETURN_TEXT = {
  moth: 'The wings settle back into your shoulders with a slow, spreading pressure. You flex them beneath your shirt. Their edges reach farther than you remember. You could fold them away. Instead, you test the weight of the air once before making room for the next change.',
  ribbons: 'Green lengths slide up your arms and separate into fingers. You reach for the parcel before Edda pushes it across the table; your hand gets there first. You draw it back slowly, watching the extra length gather at your wrist.',
  clockwork: 'The first click travels from your fingertip to your elbow. Brass joints catch in a finer sequence than before. You pick up a pin by its point, turn it once, and put it down exactly where it was. That still feels much too good.',
  velvet: 'Your voice comes back on an exhale. The note sits low behind your ribs, warm enough to make you stop in the middle of a word. Ivo waits. You finish the word more quietly, though everyone at the next table turns anyway.',
  bells: 'A chord rises through your throat and settles behind your teeth. You try a careful hum. This time you can hold one note while another climbs above it. You close your mouth before the judges mistake that for the start of a performance.',
  echo: 'You hear yourself say “That feels different.” Then the words reach your mouth. Beneath them runs a second, quieter answer, far enough ahead that you cannot quite catch it. You lean toward your own voice before you notice what you are doing.',
  tail: 'The familiar weight returns at the base of your spine. Your tail sweeps behind you and catches the chair before you sit. You keep your hands on the table. Mr. Rook clears his throat, as though he expects credit.',
  shadow: 'Your shadow catches your heels on its way out of the box. The pull runs through your calves. It stands when you stand, but its head turns a little farther, checking the room behind you. You ask what it learned. It puts a finger to its lips.',
  roots: 'Your roots thread back beneath your shoes. The floor opens into a scatter of small pressures: dropped pins, a chair rocking, the wild box shifting against Mr. Rook’s foot. You can tell which way its lid will jump. You step aside.',
};
