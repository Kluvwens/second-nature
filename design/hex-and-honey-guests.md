# House guests

The next layer of Hex & Honey gives the player a reason to aim for a particular room. A guest borrows an active trait, pays 2 gold, and promises an alteration somewhere else. That trait's stats and combinations disappear immediately. Taking and collecting a loan each use a whole encounter; the eighteenth turn still resolves before midnight.

| Guest | Lend at | Collect at | Loan → extra trait |
| --- | --- | --- | --- |
| Edda, a seamstress inside a self-sewing coat | Market | Mirror | Wings → honey; ribbons → honey; clockwork → echo |
| Ivo, a singer inside a bottle | Rest | Trial | Velvet → echo; bells → porcelain; echo → velvet |
| Mr. Rook, an empty waistcoat in need of an understudy | Fortune | Wild magic | Tail → fox ears; shadow → starfield; roots → antlers |

The returned trait gains one stage, capped at three. Every offered pair supports an existing combination. A full fitting replaces incompatible traits in the affected slots; the two-voice fitting deliberately installs both voices in one slot. An optional layered fitting keeps existing traits and costs 2 luck per conflicting slot, subject to the usual seven-trait and two-per-slot limits. An existing copy of a gift retains its level. Previews calculate the complete prospective form before showing gains, losses, costs, and capacity.

Taking just the upgraded loan pays 3 luck instead of granting the extra trait. Selling it pays 6 gold and 2 luck and leaves it with the guest. Any completed favor adds 40 score. Each guest lends once per evening. Unfinished tickets grant no completion points. Guests have distinct loan, collection, return, sale, and ending passages; the nine traits have separate physical loan and return descriptions.

## Decisions in the interface

Claim tickets live beside the board's turn record. They show the next collection location and distance, or “Collect here” during the relevant encounter. The matching route tokens carry the guest's initial. Movement previews and tile inspection identify waiting guests. Collecting takes the place of the ordinary venue action, so Ivo's fitting competes with a seal attempt.

The earlier Root comparison established a useful principle: put a rule beside the action it changes. Here, the collection button shows exactly which traits and combinations it replaces. The guest does not add another permanent resource bar. At a relevant guest encounter, its scene takes precedence; ordinary venue choices remain available through an expandable link. This removes a duplicate introduction and a second complete decision list from the initial view. No new reference imagery or generated art was added in this pass.

## Compatibility and validation

- Keep the same storage key. Accept versions 1 and 2 and add an empty guest ledger; preserve existing forms, pending offers, result text, journal, resources, and RNG.
- Resolve loans and fittings without consuming randomness. Invalid actions, insufficient luck, and capacity failures leave the save unchanged. Completion cannot pay twice.
- Engine and UI tests cover all nine loans at all three stages, overlapping slots, compound combinations, replacement losses, two-slot layering costs, full inventories, wrong locations, duplicate claims, sales, old saves, and the final-turn fitting.
- The suite includes 300 runs that pursue guests, alongside the existing 800 simulated board games. All three guests are completed across those runs. This establishes legal, terminating play and save compatibility; it is not a claim of exhaustive balance testing.
- Browser playthrough uses `edda-12`: take wings on turn 1, lend them at the turn-2 market, take ribbons on turn 3, collect at the turn-4 mirror. Spending 2 luck at the fitting preserves the ribbons and creates Amber kite with stage-2 wings and living honey. Reloading preserves the loan and the eventual fitting.
- Inspect the live collection screen at desktop and phone widths, including the ordinary-action disclosure and the claim-ticket dialog. Browser screenshots are saved under `artifacts/hex-and-honey/guest-fitting-*.jpg`.
