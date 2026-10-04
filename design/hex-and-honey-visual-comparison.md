# Comparing Hex & Honey with credited game design

4 October 2026. This records the third visual pass and the first application of the new `reference-led-design` skill. It is a design assessment, not a claim that the result is human-made or equivalent to the reference work.

## What the second pass missed

The previous revision improved the rules and added meaningful combinations. Visually, it retained a familiar three-column panel layout. A repeated game title and a large central emblem occupied most of the board; the playable path was a uniform border of icons. The encounter card used the same moth symbol as the brand and the change spaces. Five empty form slots consumed space before the player acquired anything.

The ivory-and-green palette and paper borders did not resolve that structure. In the user's actual 360 × 674 browser pane, the dice tray began at y=664, below the useful opening view. Encounter prose was 13px. Those were observable problems, independent of who wrote the code.

## References actually inspected

**Root.** [Publisher's component gallery and credits](https://ledergames.com/products/root-a-game-of-woodland-might-and-right). Cole Wehrle designed the game; Kyle Ferrin illustrated it; Cole Wehrle, Kyle Ferrin, Nick Brachmann, and Jaime Willems are credited for graphic design and layout. I visually inspected the [fall-board photograph](https://ledergames.com/cdn/shop/products/51-RootBaseGameBoard-Fall-Editv2-Web.png?v=1617976948&width=640) and [Eyrie player-board photograph](https://ledergames.com/cdn/shop/products/52B-RootBaseFactionBoardwithComponents-Editv2-web.png?v=1617976948&width=640). Light clearings and paths separate playable areas from the dark woodland. The faction board groups phases, actions, and tracks instead of treating every fact as an interchangeable card.

**Dungeon Degenerates.** [Publisher's retailer page and credits](https://goblinkomegamall.com/pages/retailers), with its [map illustration](https://cdn.shopify.com/s/files/1/0537/4361/files/DD_MAP_600x600.jpg?v=1660689282). The publisher credits Sean Äaberg as creator and illustrator. I visually inspected the map: different terrain colors, particular buildings, and strong silhouettes make its regions distinguishable. That specificity is the useful comparison; its subject matter and palette would not suit Second Nature unchanged.

The following judgments are my interpretation of those images. No reference artwork was copied into the game.

| Design question | Previous Hex & Honey | Change in this pass |
| --- | --- | --- |
| Is the board a place the player can recognize? | A repeated title in an empty center, surrounded by equal squares. | A café map with a market, arch, moon fountain, mirror, salon, and exit. Numbered markers and the selected route remain readable above the illustration. |
| Does the next action appear where it is useful? | Dice beneath the full board; a large heading precedes play. | Dice, resources, ability controls, and destination are grouped above the map. The decorative heading and edition stamp are removed. |
| Do different functions have distinct presentation? | Player sheet, encounter, traits, and abilities all repeat bordered panels. | The encounter is the main paper reading surface. The character record sits on the table below it on desktop; the map has its own spatial structure. |
| Is the game readable at the user's real size? | 13px prose and a dice tray starting at y=664 in a 360px-wide pane. | 17px prose and a dice tray starting at y=149 at the same width and height. The page has no horizontal overflow. |
| Do forms deserve the space they occupy? | Unchanged slots take as much structural space as acquired traits. | Only occupied slots are listed; the initial form has a short explanation. Layered traits remain adjacent, and active combination rules stay available. |

## What remains weaker than the references

The café map is one AI-generated illustration. The established portrait is still a simple procedural SVG, and individual traits do not yet have the breadth of bespoke illustration found across the credited games' components. The map's detail also becomes small on a narrow phone screen. The code keeps markers, labels, and interaction separate so those remain readable and usable. These limits matter more than declaring the result “handcrafted.”

## Implementation and verification

The map is [house-map-v3.png](../assets/dice/house-map-v3.png), generated with the built-in image tool. Its [complete prompt](hex-and-honey-map-prompt.txt) is retained. The numbered route is rendered by `src/dice/board-view.mjs`; typography and layout live in `src/dice/house.css`. The previous central SVG emblem and superseded stylesheet were removed.

The twenty-four space IDs, movement rules, transformation mechanics, RNG, costs, and save format are unchanged. Browser checks cover a fresh game, a saved honey/wings/ribbons combination, gliding into the correct trial, resolving that trial, and opening the fourteen-recipe form book at 390 × 844. The mobile form book has no internal horizontal overflow. Desktop was inspected at 1280 × 900. The actual user pane was measured separately at 360 × 674; no claim is made that its size matches the desktop screenshot.

Before and after screenshots are retained locally under `artifacts/hex-and-honey/`: `before-reference-pass.jpg`, `after-reference-pass-mobile.jpg`, and `after-reference-pass-desktop.jpg`. The before image is the narrow user pane, so compare it with the mobile after image, not the desktop image.

The reusable skill is authored in [skills/reference-led-design/SKILL.md](../skills/reference-led-design/SKILL.md) and installed in the user's personal Codex skills folder. Its bundled validator passes. Applying it here exposed both the visual hierarchy problem and the mobile action-placement problem; the skill does not treat passing engine tests as evidence of visual quality.
