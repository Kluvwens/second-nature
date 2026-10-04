# Deep forms and altered minds

This expansion grows Hex & Honey from 15 to 24 traits and from 14 to 27 combinations. Second Nature's story and saves remain separate.

The subsequent [Paperfold expansion](hex-and-honey-playful-forms.md) brings the current totals to 28 traits and 35 combinations. The rules introduced here remain in place.

## Bodies that keep changing

Each trait now has four authored stages. The last stages change the whole silhouette or material: honey becomes a mobile pool, porcelain a vessel, moth wings a segmented winged body, ribbons a woven body, and roots a walking trunk. New physical traits add hollow glass, extra hands, and a body that loosens into mist.

You can carry ten traits, with three in a slot. Adding a layer costs two luck and advances every earlier trait in that slot by one stage. A mirror can advance every growing trait for two luck. Walking conservatory makes that mirror action free. Previews show which combinations begin or end and which earlier layers deepen.

The current-form report and both endings account for every held trait. They use the actual stages and describe selected physical interactions. Loaned or removed changes are excluded. The report also records mental changes and any unfinished command.

## Decisions under pressure

| Trait | Benefit | Restriction |
| --- | --- | --- |
| Collector's hunger | One extra offer | Prefer an unfamiliar change when one is affordable |
| Dream logic | First reroll of the turn is free | Use the larger die for movement |
| Chorus mind | Keep the better of two trial dice | Attempt your strongest remaining trial |
| Planted command | Charm from the trait; clockwork can reward obedience | A delayed instruction forces a route, free change, or weakest trial |
| Soft focus | Luck on acquisition, advancement, and each new turn | Printed numbers become unreadable; dice pips remain countable |
| Cold calculus | An extra point on all checks, or two at deep stages | No choice restriction; restores reading through Soft focus |

Clear your head suppresses the first three pressures for the rest of the turn. It costs one luck, or two with a deep mental trait. Grounded dreams, Private room, and Clear intervals make it free. Benefits remain active.

Commands have priority over ordinary urges and are enforced in the engine. They do not disappear when you clear your head or remove hypnosis. Acquisition and advancement plant an instruction for a later decision; deep hypnosis requires two obeyed decisions. A completed instruction expires. A new hypnosis advancement replaces the previous instruction. Bottle commands still permit layering. A trial command with no seals left asks you to take the parting coin.

Number blindness changes the presentation, including numeric control labels and live announcements. It does not alter the underlying quantities or save. Dice retain their pips and spoken word labels. Cold calculus makes printed numbers readable again.

## New combinations

Prism and Uncounted sky treat ones as sixes on all checks. Lantern wings lengthens the glide; Assembly line shares the first free reroll allowance and permits a die flip. Loose outline adjusts movement, Amber weather rewards passing a rest space, and Open-handed lowers market changes to one gold. Many-voiced gives the best of three trial dice. Clockwork obedience pays luck when an instruction is fulfilled. Physical and mental rules remain active together; the UI reports their effective values.

## Illustrated form book

The 24 original plates share an ivory, near-black, and vermilion palette. They show one trait at its deep stages. The game labels larger plates as form-book illustrations; they are not generated portraits of every possible current combination. The exact current form is described by the prose and stage labels. Offers and the form hand use small images; the form book and trait entries show larger plates and all four authored stages.

The supplied style references inform the palette and composition. They are not used as board backgrounds or pasted into the illustrations. Each asset uses a separate built-in image generation call, with prompts and provenance recorded in:

- [Crown and skin plates](art/hex-honey-crown-skin-prompts.md)
- [Body and voice plates](art/hex-honey-body-voice-prompts.md)
- [Mind and shadow plates](art/hex-honey-mind-shadow-prompts.md)

Sources live in `assets/dice/forms/`; the build copies each required plate to `dist/dice/forms/` and fails if any are missing. Images load lazily and remain separate from saved game state.

## Compatibility and verification

The schema is version 4; the existing browser key is unchanged. Versions 1–3 migrate without resetting the random generator, resources, phase, stored prose, or version-3 guest ledger. New command and grounding fields default to empty. Reloading preserves planted instructions and once-per-turn abilities.

The engine tests cover four-stage growth, layer limits, whole-form deepening, rule interactions, exact check probabilities, commands across saves, numeric masking, final descriptions, and old-save migration. Exhaustive combinations of mental traits and commands must leave a legal encounter action even at zero resources. Existing simulations complete 1,100 seeded games across ordinary, layered, and guest-focused play, checking saves at each decision.

The completed build passes all 64 repository tests (37 dice-game checks and 27 story checks). A separate review simulated 1,000 additional games with stacked mental traits and two-use commands, with 65,164 matching save round-trips. Clockwork obedience pays according to the combination held before the commanded choice, including when that choice removes hypnosis; a combination formed by the choice does not pay retroactively.

Browser checks at 1440×1100 and 390×844 verified the illustrated book, stage entries, transformation offers, numeric masking, a forced trial after acquisition, persistence after reload, and command expiry after obedience. Neither viewport had horizontal overflow in those views. All 24 source PNGs match their built copies. Test play used the localhost origin; the user's 127.0.0.1 save was not reset.
