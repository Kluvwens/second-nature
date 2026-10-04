// Further transformations. The engine owns their rules and state.
export const PLAYFUL_TRAITS = [
  {id:'paper',name:'Paperfold',slot:'skin',stat:'nerve',icon:'book',detail:'A crease crosses your palm. Your skin folds neatly along it.',text:'You rub a thumb across your palm and hear the dry whisper of paper. A straight crease runs beneath your fingers. When you press it, your hand folds in half without hurting. You unfold it at once. The crease stays, ready for the next time, and you catch yourself smoothing it flat against the table.'},
  {id:'balloon',name:'Balloon crown',slot:'crown',stat:'charm',icon:'sun',detail:'Small living balloons lift from your hair, each tugging at your balance.',text:'Something bumps the lamp above you. Three red balloons rise from your hair on fine, pale stems. You catch one and feel your fingers around it as clearly as a hand against your cheek. Releasing it lifts your chin. You hold the chair with your other hand while it decides how much of you to take along.'},
  {id:'swarm',name:'A hundred small selves',slot:'shadow',stat:'weird',icon:'stars',detail:'Little ink-dark shapes leave your outline and carry your sense of touch with them.',text:'The edge of your shadow frays into tiny wings. One dark shape climbs onto the table, and you feel the wood beneath its feet. You turn your hand over. A second little self slips out between your fingers. Calling them back is easy; realizing that you are the one on the table takes longer.'},
  {id:'puppet',name:'String joints',slot:'limbs',stat:'nerve',icon:'ribbon',detail:'Wooden joints click beneath threads that run back to your own fingers.',text:'Your wrist turns with a small wooden click. A pale thread rises from it to the index finger of your other hand. You lift that finger; the wrist follows. Lowering both hands tangles the line. You spend a moment putting yourself back in order, annoyed by how satisfying the final click feels.'},
];

export const PLAYFUL_GROWTH = {
  paper:[
    'The creases travel up your arms. Your elbows flatten into crisp folded corners, and the skin between them takes on a fine ivory grain. You pinch one sleeve and find it printed against you. It still looks like cloth until you try to pull it free.',
    'Your chest folds inward along a line you can feel from collar to waist. For a moment you stand almost edge-on to the room, thin enough to slide between two pages. You open yourself carefully. Your ribs unfold into a set of paper fans, holding the familiar shape a little farther from the truth.',
    'The last soft weight leaves you. Your whole body becomes one continuous folded sheet, your face held in the planes above a sharp collar. You can flatten yourself across the table or lift into a complicated standing figure. You keep your brass clip at the top corner. It is reassuringly heavy.',
  ],
  balloon:[
    'More balloons bud along the stems. They bob against one another when you turn, and the touches arrive across your scalp in a jumble. You rise onto your toes without meaning to. Sitting down now takes a firm grip on the seat.',
    'The stems reach down your back and branch around your shoulders. A whole cluster swells above you, lifting until your shoes clear the floor. You pull at the table edge to travel along it. For three easy seconds you enjoy the glide before you remember that letting go means going up.',
    'Round, buoyant chambers unfold through your shoulders and hips. Your body hangs among dozens of living balloons, each carrying a little of your weight and all of its own sensation. You move one cluster left and another right to turn your face toward the table. Walking seems like a surprisingly elaborate habit.',
  ],
  swarm:[
    'The little selves begin leaving your sleeves in twos and threes. You can feel the air under each pair of wings. Your hand grows thinner while they circle, then fills out when they settle against it. You try sending just one to the far side of the table. Several volunteer.',
    'Your arms come apart into a cloud of ink-dark wings. They keep the shape of arms when you concentrate, down to the small bend in your left little finger. Someone shifts a chair nearby and a dozen of you turn toward the noise. You gather them back before answering.',
    'Your outline breaks into hundreds of small winged selves. Nothing remains in the middle except the space they agree to leave. You arrange them into your height, your shoulders, the familiar slant of your mouth. One lands on the rim of your cup. You can stay standing and look up at yourself from there.',
  ],
  puppet:[
    'Round wooden hinges settle into your elbows and knees. Threads loop from each joint back to your hands. You take a step by lifting two fingers, then catch your own knee before it swings too far. It takes practice to make a movement look accidental.',
    'Polished wood spreads through your shoulders and torso. Each breath separates the fitted pieces a little, with a quiet knock as they close. Your fingers work the strings almost without help now. You watch them lift your own arm and cannot decide which part of the movement belongs to the habit.',
    'Your face settles into carved wood, freckles still marked across the crooked nose. Every part of you hangs from articulated joints, with the strings returning to your own hands. You cross your fingers and feel your whole frame draw itself upright. No one is holding the other end. You check anyway.',
  ],
};

export const PLAYFUL_DETAILS = {
  paper:['Fine creases cross your paper-textured skin; a hand can fold flat and open again.','Your body folds from a continuous sheet, with your face and clothing carried across its ivory planes.'],
  balloon:['Living balloons rise from your hair and tug at your balance when they drift.','A crowd of buoyant chambers carries your body among living balloons; turning means shifting their separate pulls.'],
  swarm:['Little winged selves leave your outline, each keeping its own thread of sensation.','Hundreds of ink-dark winged selves hold the arrangement of your body, with open air between them.'],
  puppet:['Wooden joints click beneath fine strings that return to your own fingers.','Carved wooden pieces make up your articulated body, and your own hands work the strings that hold its posture.'],
};

export const PLAYFUL_STAGE_THREE = {
  paper:'Your chest folds nearly flat and opens on paper ribs, holding your outline in crisp ivory planes.',
  balloon:'Clusters of living balloons lift you clear of the floor on stems that branch around your shoulders.',
  swarm:'Your arms gather from clouds of little winged selves, thinning wherever one flies away.',
  puppet:'Wooden joints and fitted pieces run through your limbs and torso, with the strings returning to your hands.',
};

export const PLAYFUL_COMBINATIONS = [
  {id:'folded_map',name:'Folded map',needs:['paper','ribbons'],timing:'Before moving',rule:'Adjust movement by 1 space either way without changing power.',text:'A ribbon slips into one of your creases and pulls it open. The fold continues beyond your wrist, briefly making a corner in the air beside the board. You reach around it and touch a space beyond your fingertips. The board lies flat again when you withdraw your hand.'},
  {id:'crease_memory',name:'Crease memory',needs:['paper','calculus'],timing:'Transformation offers',rule:'See one extra transformation offer, up to four in total.',text:'You fold one possibility into your palm and consider the next. When you open your hand, the first is still there, held along a crease. You can compare them without losing either. Your fingers keep making room for another.'},
  {id:'sugar_lift',name:'Sugar lift',needs:['balloon','honey'],timing:'Before moving',rule:'Glide 2 extra spaces without spending power.',text:'Honey stretches into thin amber films beneath the balloons. Each film catches the next small draft, pulling you across the room with barely a bob. You catch the table before drifting past it. One sticky thread stays attached to the edge until you remember to let go.'},
  {id:'tether',name:'Well tethered',needs:['balloon','roots'],timing:'Rest space',rule:'Either rest choice gives both 2 luck and 3 gold.',text:'Your roots catch a chair leg just as the balloons lift you. The pull settles between them, leaving you suspended at a comfortable height. You sit back against empty air. For once, two parts of you disagree in a useful way.'},
  {id:'quorum',name:'Quorum',needs:['swarm','chorus'],timing:'Trial check',rule:'Roll three check dice and keep the highest.',text:'Each small self takes a different thought out for a circuit of the room. The voices return with details the others miss: a loose hinge, a steady rhythm, the place to begin. You call them close and wait until enough of you agree.'},
  {id:'hive_lantern',name:'Hive lantern',needs:['swarm','glass'],timing:'Every check',rule:'A check die showing 1 counts as 6, including fortune checks.',text:'The little selves settle against your hollow glass, wings ticking softly along its inner wall. One finds a sliver of light and the others turn toward it. The glow travels through you until even your smallest outline casts a clear shadow.'},
  {id:'obedient_hands',name:'Obedient hands',needs:['puppet','hypnosis'],timing:'Fulfill a command',rule:'Each commanded decision pays 3 gold when you carry it out.',text:'Your fingers take up the slack as the sentence returns. You can feel exactly which strings it will pull. Your wooden palm opens to receive something at the end of the movement, though nothing waits there yet. You close it and watch for the moment when your fingers begin to loosen.'},
  {id:'dress_rehearsal',name:'Dress rehearsal',needs:['puppet','echo'],timing:'Trial check',rule:'Gain +2 on trial checks when your power is 1 or 2.',text:'Your echo makes the movement first. You watch its strings cross, see where the wrist catches, and lift your finger a little higher. The second attempt belongs to you. It is strange to remember a mistake your hands have not made.'},
];

export const PLAYFUL_COMPOSITES = [
  {needs:['paper','ribbons'],text:'Ribbons thread through your folds and draw them open. You can flatten a crease without flattening the whole of yourself, although an absent tug sometimes closes the wrong elbow.'},
  {needs:['balloon','honey'],text:'Thin honey films stretch between the balloons. Light passes through them in amber patches, and each small draft moves across you as a tug at several edges at once.'},
  {needs:['balloon','roots'],text:'The balloons pull upward while your roots feel for something to hold. Between them, your weight can settle almost anywhere; letting go takes agreement at both ends.'},
  {needs:['swarm','glass'],text:'Little winged selves move along the inside of your glass. You can feel their feet against the clear wall and feel the wall around their feet, without finding a useful distinction between the two.'},
  {needs:['puppet','ribbons','paper'],text:'Your wooden joints hold folded paper panels together while ribbons take the place of strings. A small pull unfolds an arm; a larger one opens that whole side of you. You keep your hands where you can watch them.'},
  {needs:['puppet','echo'],text:'The outline beside you runs through your next movement with its strings showing. Your own fingers wait a fraction behind, borrowing the parts that work and leaving the awkward turn to fade.'},
];
