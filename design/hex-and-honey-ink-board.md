# Hex & Honey: the ink board

4 October 2026. The user asked for a larger overhaul and supplied two black, white, and red visual references, then clarified that they should guide the style rather than be embedded in the board. This revision replaces the interface structure and stylesheet. It does not change the story game's appearance or save format.

## References and provenance

The supplied liquid-ink image, `Alara_a_start_website_white_black_red_transformation_--profil_bae6780f-1780-47ef-9a91-1c223e610b4e_0.png`, informs the black, warm white, and vivid red palette. The second supplied image, `Alara_a_start_boardgame_white_black_red_transformation_--prof_488cd0b4-451c-4f5d-9fb4-f2858f4bffa8_3.png`, informs the fine red routes, glossy red pawn, pale pieces, and open central area. Neither reference is embedded or shipped in the game. The initial literal background-image use was removed after the user's clarification; its source copy, built copy, markup, CSS, and build step are all removed. The original supplied files remain untouched. Their authorship has not been verified.

For a comparison with credited work, I inspected [TZAAR on Kris Burm's official site](https://www.gipf.com/tzaar/intro/intro.html), including its [box photograph](https://www.gipf.com/tzaar/pictures/images/tzaarbox.jpg). The photograph shows fine connecting lines beneath black and white ringed pieces, with stacks rising above the surface. The site explains the choice between capturing opposing pieces and strengthening one's own. The useful visual lesson is the hierarchy: pieces read first, connections second. The publisher's rules PDF was too large for the web tool; it was not inspected. No TZAAR artwork is included in the game.

The [earlier comparison](hex-and-honey-visual-comparison.md) records the Root and Dungeon Degenerates component photographs actually inspected in the previous pass. Their different treatment of map, action area, and player record remains relevant. Those references are comparisons, not a claim that this prototype matches their illustration or production quality.

## What changed

| Problem in the previous interface | Decision in this revision |
| --- | --- |
| The café image improved the board but left a familiar collection of paper panels around it. | Give the board and dice one dark playing surface, the encounter a separate reading column, and the forms a horizontal hand beneath both. |
| The user preferred the contrast and restraint of the supplied references. | Use warm paper, ink black, and red; replace the green palette and round panel styling. Fine paths sit beneath high-contrast pieces. |
| The two dice assignments required repeated swapping to compare. | Present two selectable route choices with movement, power, destination, and relevant check odds. The current choice includes active movement adjustments; switching clears them exactly as the existing swap action does. |
| Stacked forms read as rows in a character dashboard. | Group acquired traits by body slot as physical-looking pieces. Offset the second layer, retain its own level and stat, and show active combination rules below the hand. |
| The illustrated board becomes dense on a narrow screen. | Default to the graphic board, retaining the café illustration behind a persistent view switch. Both render the same twenty-four spaces and guest markers. |
| A completed move could leave the next decision below the board on phones. | Move encounters, results, and endings above the board on narrow screens. Keep dice first during route selection and provide anchors for board, decision, and form. |

The graphic board's center displays the selected destination number and name. The red piece marks the current location, the ring marks the destination, and the dashed line traces the selected move. These are game state, not decorative components. A charcoal CSS surface and a fine SVG grid provide the board's structure; its route, pieces, and controls remain DOM and SVG elements.

New interface copy uses the write-naturally skill. Existing transformation passages and guest scenes are retained. The original café illustration remains an AI-generated asset; its [prompt is recorded here](hex-and-honey-map-prompt.txt).

## Validation

Browser inspection covered the graphic board, the alternate illustration, both dice assignments, a saved three-trait Amber kite combination, a trial, its result, and the form book. Route selection cleared the active glide, updated movement and power, and changed the preview to the exact odds shown at the resulting trial. Reloading retained the board-view preference and current turn.

The desktop layout was inspected at 1440 × 1000 and the phone layout at 390 × 844. Neither had horizontal document overflow. Desktop form pieces occupied approximately 204px per slot; the two layers remained separately readable. Phone encounter prose is 17px, and the decision appears before the board after moving. A final check in the user's actual 360px-wide pane exposed center text crowding the bottom path. Smaller responsive type and the shorter “turns left” label corrected it; the pane has no horizontal overflow and the opening dice tray starts at y=255. Screenshots are retained under `artifacts/hex-and-honey/`: `ink-overhaul-desktop.jpg`, `ink-overhaul-mobile.jpg`, and `ink-overhaul-live-pane.jpg`. The desktop image includes an active three-trait combination; the phone image shows trial choices. These are different states, not a matched before/after comparison.

Automated checks cover route selection, adjustment resets, exact trial previews, independently persisted board preference, blocked browser storage, existing transformations, all fourteen combinations, all nine guest loans, older saves, and complete seeded games. The full test suite also covers the separate story game. The build and all 54 tests pass. The browser console reported no warnings or errors during the checked play sequence.

Source: `src/dice/table.css`, `board-view.mjs`, `form-views.mjs`, and `app.mjs`. The superseded `house.css` is removed. The view preference uses `hex-and-honey.board-view`; the version 3 game state and `hex-and-honey.v1` save key remain unchanged.

After removing the literal reference image, the corrected surface was checked at 1280 × 720 and 360 × 674, with no horizontal overflow or console errors. The saved turn and acquired fox tail remained intact. Current screenshots are `artifacts/hex-and-honey/reference-correction-desktop.jpg` and `reference-correction-mobile.jpg`; the earlier ink-overhaul screenshots show the superseded bitmap background. The build and all 54 tests pass after the correction.

## Remaining limits

The portrait and trait symbols are still simple SVG artwork. The abstract route offers less sense of place than the café illustration, which is why both remain available. The full form hand sits below the board on desktop; active movement abilities stay next to the dice, but inspecting every trait requires scrolling. These are tradeoffs of the current composition, not evidence of human authorship.
