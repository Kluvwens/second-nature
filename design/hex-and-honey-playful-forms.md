# Four more shapes for the House

Hex & Honey now has 28 traits and 35 combinations. This is an additive expansion to version 4: existing saves retain their forms, stage, commands, resources, and random-generator state. Future offers use the larger trait pool.

Each new trait has four written stages, an original illustration, a portrait marker, and descriptions for the final reflection.

| Trait | What happens at the deep stages | Combinations |
| --- | --- | --- |
| Paperfold | Your body becomes a continuous folded sheet, capable of flattening across the table | Ribbons adjust movement; Cold calculus reveals an extra offer |
| Balloon crown | You hang among living balloons, shifting their pulls to move | Honey gives free gliding; roots give both rest rewards |
| A hundred small selves | Hundreds of winged selves hold the arrangement of your body | Chorus mind rolls three trial dice; glass makes check ones count as sixes |
| String joints | You become an articulated wooden figure whose strings return to your own hands | Hypnosis pays gold for obeyed instructions; Tomorrow's echo helps low-power trials |

The rules stack with older combinations. Sugar lift removes the power cost of Lantern wings' longer glide. Additional offers stop at four, including appetite and market bonuses. Well tethered and Grounded light give the same pair of rest rewards once, even when both are active. Command rewards use the form held before the choice, so a forced replacement still earns an existing reward; a newly formed combination does not pay retroactively.

Six new composite passages describe the physical interactions in the final reflection, including a wooden frame holding folded paper panels with ribbons for strings.

## Artwork

Three subagents handled the prose and two pairs of illustrations. Each PNG was generated with a separate built-in imagegen call, inspected, and copied unchanged into `assets/dice/forms/`. The build copies them into `dist/dice/forms/`.

- [Paperfold and Balloon crown: exact prompts and provenance](art/hex-honey-paper-balloon-prompts.md)
- [Swarm and String joints: exact prompts and provenance](art/hex-honey-swarm-puppet-prompts.md)

The plates keep the game's ivory, near-black, and vermilion printmaking style. Large illustrations are labelled as glimpses of deep stages; the current-form description follows the actual saved layers.

## Verification

The build passes all 66 tests, including four-stage growth and illustrations for all 28 traits. New checks exercise free glide at one power, a free three-space glide with Lantern wings, the four-offer cap, overlapping rest rewards, swarm check rules, low-power trial bonuses, and command rewards across reloads and forced replacements. The existing 1,100-game simulations continue to pass. A separate agent reviewed the integration for reward timing and overlapping rules.
