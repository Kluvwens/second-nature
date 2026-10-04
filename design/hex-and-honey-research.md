# Hex & Honey: forms and tabletop revision

Research and implementation: 4 October 2026. Applies to the standalone game at `/dice/`.

This records the first stacking revision. The current game adds [four-stage forms, mental effects, and an illustrated trait book](hex-and-honey-deep-forms.md): 24 traits, 27 combinations, three layers per slot, and ten traits overall. The original research remains below.

## Board-game references

These references informed specific decisions. No publisher artwork, layouts, or card text were copied into the game.

| Reference | What I examined | Decision in Hex & Honey |
| --- | --- | --- |
| [Evolution](https://www.northstargames.com/collections/evolution/products/evolution), [official trait-card index](https://www.evolutiondigitalgame.com/card-index/) | The product's component photography and the interaction rules for traits such as Cooperation and Foraging. Traits can trigger each other rather than simply add numbers. | Keep the body slots visible. Give combinations named rules that change movement, checks, resources, or available offers. Show which rules a replacement would remove. |
| [Dice Forge](https://www.libellud.com/game/dice-forge/), [official hero aid](https://cdn.svc.asmodee.net/production-libelludv2/uploads/2026/08/DF_HERO-AID_EN_HD_compressed.pdf) | Official component photographs, the modular dice premise, and the hero aid. Improving a die changes later decisions. | Separate movement from power visibly. Add an opposite-face power adjustment, a free reroll, and movement abilities with explicit timing. Use distinct physical colors for resources and components. |
| [Cubitos](https://www.alderac.com/cubitos-old/), [publisher rulebook](https://www.alderac.com/wp-content/uploads/2021/02/Cubitos_BaseGame_Rulebook-lowrez.pdf) | Publisher description and indexed rulebook text about dice abilities and their timing. The full PDF could not be opened by the web reader. | Put ability timing on the recipe cards. Reset limited uses when a new turn starts, preserve them across reloads, and clear movement adjustments when the dice are swapped or rerolled. |
| [Ahoy](https://ledergames.com/products/ahoy) | Publisher description of assigning dice to faction-specific actions. | Keep the existing two-die assignment as the main decision. Forms supply additional uses and adjustments instead of replacing that decision with automatic bonuses. |

The visual changes follow the component photographs: cream encounter cards, a pale green player sheet, inked borders, a folded board, colored spaces, a small pawn, and an eighteen-position turn track. The central cup-and-moth drawing is original SVG. Active traits sit in their body slots; combination rules sit immediately below them. The form book provides the full recipe list.

## How stacking works

There are fifteen traits across five slots. A normal new trait replaces everything in its slot. Repeating an existing trait raises that trait to stage three while preserving its other layer. Spending two luck keeps a second different trait in the same slot. Limits: two traits per slot and seven total. Market prices are charged separately from layering.

Fourteen combinations are implemented in `src/dice/combinations.mjs`. Each includes ingredients, timing, a mechanical rule, and a physical description. Examples:

- Living honey and moth wings allow a two-space glide at a cost of one power. Layering ribbon arms alongside the wings braces them and removes that cost.
- Porcelain glaze and a bell chorus roll two trial dice and keep the better result. Starfield skin and an independent shadow turn check rolls of one into six. These effects can operate together, with the displayed odds accounting for both.
- Honey layered beneath porcelain gives one free reroll each turn. Later rerolls still cost luck.
- Antlers and roots collect one gold when movement passes a change square. Landing on that square alone does not pay.
- Clockwork hands and tomorrow's echo turn the power die onto its opposite face once per turn. Adding further combinations does not grant a second use of that same action.

The offer generator favors a missing ingredient 65% of the time when a completable recipe is available. It still allows unrelated offers. Replacements preview both gained and lost combinations. The player sheet describes the improved glide correctly when Amber kite is active.

The writing follows the standing write-naturally skill and `style-and-cast.md`: second person, present tense, specific physical checks, and Mara's uneasy interest. Thirty separate growth passages cover the later stages. Combined forms receive their own sensations and practical consequences rather than only a list of modifiers.

## Saves and verification

The storage key remains `hex-and-honey.v1`. Version-one saves migrate to version two, retaining their seed, random-generator state, resources, current phase, forms, journal, and completed results. Future rolls and offers follow the revised rules, so old seeds do not promise identical future games across versions. The Second Nature campaign's save system is separate.

Validation includes exact probability enumeration for both trial modifiers, all fourteen recipes, layering limits and costs, replacement previews, market prices, reward timing, ability-use limits across reloads, and migration in every phase. There are 800 simulated complete games: 500 using the original basic strategy and 300 using layers and combination abilities. The full repository suite contains 46 passing tests.

Browser verification covers the form book at a 345-pixel pane width and a desktop board. A separate local test game with seed `amber-study-5` reaches Amber kite on turn four through normal controls: take honey, take moth wings, collect the safe fortune, then layer ribbons at the mirror. This verifies the preview, two-luck charge, retained wings, changed portrait, combined prose, and free-power glide. The user's existing save on `127.0.0.1` is not replaced by that test.
