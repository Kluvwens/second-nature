# Second Nature prototype validation

## Current build: 0.9.0

Verified 2026-09-19. All twenty-seven tests pass. After the last artwork-routing adjustment, the affected compiled-runtime checks were rerun and passed.

- Five optional body experiments each support two outcomes, one saved notebook entry, and a short return to the existing work choices. Checks cover all ten outcomes, save/load before and after answering, repeated-event guards, later shifts, and no changes to money, relationships, exposure count, or recovery time.
- Six additional scene illustrations are included in the build and full-resolution viewer. The full campaign retains fourteen gallery images when it follows the tested work branches and invites Nadia for every form. Each gallery link opens its own image. Private visits do not show Nadia artwork; first-dose recovery shows human artwork; older espresso visits retain the night image without a render-time state change.
- The actual v0.8 browser save continued in v0.9. At the normal 608 × 638 preview size, the moth adjustment, three-choice entry, and both experiment reading pages fit without document, horizontal, or prose overflow. The new illustration loaded and was visually inspected in the page.
- At 390 × 844, the sensory experiment, work, result, private afternoon, three-page night, and three-page recovery were checked. The final choices remained inside the viewport and the checked pages had no document, horizontal, or prose overflow. The illustration dialog exposed the correct full-resolution moth image. The viewport override was reset afterward.
- SHA-256 checks confirm all six new source images match their published assets. The corrected Theo radio source still matches the published `theo-radio.png`. Existing story/save identifiers, wages, and transformation durations are unchanged.

Story notes, image paths, and the exact built-in generation prompts are linked from [body-detail.md](body-detail.md).

## Historical build: 0.8.0

Verified 2026-09-19. Twenty-four tests pass against the compiled game and state system.

- Six evening conversations, twelve responses, three companion illustrations, and next-shift callbacks are implemented. The compiled runtime exercises every response, saves and reloads each result, opens the new People memories, and checks the unlocked album and full-resolution links.
- The new state tests reject outings during transformation, reserve one person per recovery day, reject answers for another person or conversation, prevent duplicate relationship/journal effects, and retain unfinished outings across serialization. They cover second conversations on the final recovery day and the chapter ending afterward.
- Existing recovery saves show the new optional entry without a migration or render-time mutation. Ordinary-only routes do not invent transformation experience or make Nadia a witness. Money, exposure count, and physical recovery are unaffected by outings.
- The actual v0.7 browser save continued from recovery into the outing choices and Bea's encounter. The four-choice hub was checked at the normal compact preview and at 390 x 844. All three Bea encounter pages and both response pages at phone size had no document, horizontal, or prose overflow; final choices stayed inside the viewport. The response also passed both reading pages at the restored 608 x 638 preview size.
- Browser inspection confirmed the notebook album opens the correct Bea image and exposes the established full-resolution hyperlink. All three new illustrations were visually inspected and copied into the project before building. The viewport override was reset.

Story details and image provenance are in [after-hours.md](after-hours.md). The chapter still has five recovery evenings, so all six companion meetings cannot be seen in one playthrough. No new playable Mara form or ownership transfer is introduced.

## Historical build: 0.7.0

Verified 2026-09-19. All nineteen existing tests pass against the rebuilt SugarCube HTML and state system.

- Applied the write-naturally skill across both chapters, all six transformation routes, dialogue, choice notes, notebook entries, and supporting interface copy. Revisions replace repeated thematic explanations with concrete thoughts and actions while retaining detailed physical sensations and conflicting reactions.
- Root `AGENTS.md` records the user's standing instruction to use this skill whenever writing game text. The story brief links to that instruction.
- Choices, event identifiers, conditions, earnings, recovery timing, illustrations, and save identifiers are unchanged. The existing runtime checks cover all five new forms, honey and ordinary routes, both session lengths and endings, galleries, and save/load behavior.
- The browser continued its v0.6 cup save in v0.7. Nadia's scene displays the revised text, and the evening, lingering morning, and recovery pages were checked at the normal 608 x 638 preview size: no horizontal, document, or prose overflow across the seven checked pages. The final choice remains inside the viewport. A screenshot confirmed the revised recovery page renders correctly.
- Existing serialized notebook entries retain their old wording; entries created after the update use the revision. No save migration or new artwork was needed.

## Historical build: 0.6.0

Verified 2026-09-19. Nineteen tests pass against the compiled SugarCube HTML and state system.

- The six-choice transformation catalogue is replaced by a single contextual recipe during each shift. All five introductions and both drink/ordinary routes are exercised. The full campaign still reaches all five transformations, both approaches/session lengths, recovery, galleries, and both chapter endings.
- The encounter is stored per visit. A 0.5 save at the old `OtherMenu` passage derives a contextual encounter without render-time state changes. Previously discovered forms are skipped when deriving later encounters; the saved encounter cannot change simply because its form becomes discovered.
- Nadia's honey encounter and all five new-form encounters now sustain surprise and difficulty recognizing Mara. New witnessed-form history distinguishes a repeat from a first sight. Private choices do not create witnessed memories. Compiled runtime checks cover first, repeat, and ordinary visits.
- Small shop-management lessons are present across the five shifts, including ordinary-coffee routes. Each shift records its lesson once. Neither ending transfers ownership; the staying branch offers a later morning learning the shop order with Inez.
- The existing v0.5 browser save continued into Len's contextual invitation in v0.6, with just two choices and no named transformation. Browser checks at the normal compact preview size and 390 x 844 found no document or prose overflow in the checked regular reading pages. The cup route was played through to Nadia's rewritten reaction, which occupies short reading pages. Transformation prose keeps its intentional scrolling format.
- Existing art, the full-resolution viewer, finances, recovery timing, and save identifiers remain in place. The viewport override is reset before handoff.

The long-term succession direction is recorded in [style-and-cast.md](style-and-cast.md); only early mentorship hints are implemented. No new images were generated for this narrative revision.

## Historical build: 0.5.0

Verified 2026-09-19. Fifteen tests pass against the compiled SugarCube HTML and state system.

- A saved 0.4 morning with no chapter-two state continues through the new entry choice. Storage identifiers and schema remain unchanged; new serializable state is created on entry.
- A single campaign completes robot, cup, espresso machine, paper moth, and living shadow routes across five further shifts. Both approaches and both service lengths are exercised across the runtime playthroughs. Ordinary-coffee alternatives and both final endings are exercised.
- New-form onset, completed form, current portrait text, correct sequence/service assets, illustration enlargement, full-resolution links, and galleries are checked in the compiled game. Every gallery link is exercised to catch stale loop captures.
- Saves are restored while in each new form the following morning, preserving active state, discoveries, earnings, and recovery. Past forms remain in the gallery after returning to human.
- A first new special after declining honey lasts 18 hours and fades before dawn. With the first honey in history, successive new specials last 26, 27, 28, 29, and 30 hours. Sleeping does not instantly reset a lingering form; recovery follows its recorded elapsed time. Session length has no effect on duration.
- Repeated choices cannot duplicate a payment, disclosure, exposure, recovery record, or next-shift advance. Five further shifts end the trial. Ordinary shifts add earnings without inventing transformations.
- Existing honey/ordinary first-shift tests, dialogue, earnings, portrait comparison, autosaves, and save/load behavior remain intact.
- Browser testing continued the actual prior-version morning into chapter two, exercised the six-choice menu at 1280 x 720 and 390 x 844, then played the espresso-machine route through adjustment, the twelve-order service, Nadia, evening, and next-morning persistence. Regular reading pages checked so far have no document or prose overflow at the phone size. Detailed transformation passages deliberately retain scrolling.
- Browser gallery inspection confirmed both the sequence and service scene, with the established full-resolution hyperlink. All nine generated illustrations were inspected and copied into the workspace before compilation. The normal viewport is restored before handoff.

Artwork, saved paths, and exact built-in prompts are in [other-menu-art.md](other-menu-art.md). The authored duration curve and five-shift chapter are finite; an open-ended calendar, form combinations, and romance routes remain outside this build. Very short viewports or enlarged text can require scrolling when one paragraph cannot fit; content is never clipped. File export/import has not been round-trip tested.

## Historical build: 0.4.0

Verified 2026-09-19. Ten tests pass against the compiled SugarCube HTML and the state system.

- The first Golden Hour wears off on the authored overnight transition: day two, human form, no active honey-shape control. Earnings, relationships, reactions, journal history, and discovered images remain intact.
- The transition is idempotent and handles older saved state without a day field. It cannot duplicate the recovery entry or pay wages again.
- The ordinary-coffee route gets an ordinary morning and never gains false transformation memories or an unlocked honey gallery.
- Both routes continue through the morning conversation. The honey route retains all three transformation illustrations plus the new recovery illustration, and its historical portrait comparison remains available.
- Saving and loading after recovery restores day two and human appearance while retaining transformation history.
- Browser playthrough reached the new morning from the complete honey route, showing $137 and the correct human-again status. The morning illustration was inspected on desktop.
- Both new passages were paged through at 390 x 844: no horizontal, document, or prose overflow, with final choices inside the viewport. The normal viewport was restored afterward.

The existing illustration viewer and full-resolution hyperlink were retained at the user's request. New built-in image artwork and exact prompt: [morning-human-prompt.md](morning-human-prompt.md).

Longer recovery after later specials is foreshadowed in dialogue and recorded as future design direction. It is not yet a simulated duration system or a playable second shift.

## Historical build: 0.3.0

Verified 2026-09-19 with SugarCube 2.37.3 and Tweego 2.1.1.

Eight automated tests pass against the compiled HTML and state system. Existing route, earnings, disclosure, save/load, and gallery checks remain intact. The runtime checks now open the character sheet through **Mara**, and verify that Nadia and the apartment use the appropriate human/honey artwork.

Browser checks used the actual served build, with a separate test tab:

- Inspected the desktop opening at 1280 x 720, with the illustration beside the prose and the choice visible without scrolling.
- Played the complete honey route at 700 x 630. Checked each reading page for document overflow, prose overflow, and choices below the viewport. Regular scenes fit after adjustments to the short-window art height and choice layout; the three detailed transformation scenes intentionally retain scrolling.
- Checked both apartment choices, correct orders, mistake branches, the longer break scene, body-control choices, disclosures, and the ending. The correct honey route still finishes at $137.
- Inspected the opening and human route at 390 x 844, including Nadia's human artwork and the character dialog. A five-pixel overflow in the post-order mistake scene was traced to scrollbar-dependent text wrapping; stable gutter width and a small rounding allowance fixed it. Both pages of that scene were rechecked with no overflow and the choice inside the viewport.
- Verified Back/Continue navigation and resizing between desktop, a compact preview, and a phone size. Reading pages preserve the story scene and do not apply gameplay events.
- Fixed first-load measurement before SugarCube reveals a passage by measuring on the next frame and observing reader-size changes.
- Visually inspected all six generated illustrations and copied them into the project before building. The built-in image tool's exact prompts and saved paths are in [scene-art-v3-prompts.md](scene-art-v3-prompts.md).

The version 0.2 storage identifiers and state schema are retained. Existing saves remain usable; already-applied consequences are not replayed. Very short viewports or enlarged system text can still require scrolling when a single content block cannot fit. No text is clipped to force a fit. Filesystem save export/import has not been round-trip tested.

## Historical build: 0.2.0

Verified 2026-09-19 with SugarCube 2.37.3 and Tweego 2.1.1.

Eight automated tests pass. They check the complete honey and ordinary-coffee routes, correct earnings and disclosures, recoverable mistakes, idempotent consequences, authored passage destinations, and transformation-state save round trips. The compiled SugarCube runtime tests exercise both apartment choices, all three honey stages, gradual artwork unlocking, illustration enlargement, the gallery and comparison, body-control choices, dialogs, autosaves, and manual save restoration.

The browser check used the actual compiled game served at `http://127.0.0.1:4173/`:

- Played the new apartment move-in, both initial correct orders, and all three honey transformation stages through normal UI choices.
- Visually inspected the apartment, hand close-up, mirror transition, and complete honey form in their enlarged illustration dialogs. Each loaded its expected local artwork and exposed the full-resolution link.
- Confirmed the sidebar changes from human to hands, then face/hair, then the complete honey portrait. The comparison becomes available after the final stage.
- Inspected the completed-form illustration dialog and reading layout at 390 x 844. The image loaded correctly, text remained readable, and the document had no horizontal overflow.

Version 0.2 has a separate story/save ID because the previous hair-change sequence and state are incompatible with the new flow. Version 0.1 saves are left intact and are not migrated. Save-file export/import remains supplied by SugarCube; an actual filesystem export/import round trip was not part of this verification.

The five new assets and their exact generation prompts are recorded in [honey-sequence-prompts.md](honey-sequence-prompts.md). All were produced using the built-in image tool. The former hair-lock portrait remains an unused archive.

## Historical build: 0.1.0

Verified 2026-09-19. The following notes describe the earlier prototype, superseded by the full honey transformation above.

### Automated checks

Seven tests pass with `npm test`:

- Complete Golden Hour route, correct tips/wages, relationship disclosures, and journal entries.
- Complete ordinary-coffee route with unchanged appearance and equivalent possible earnings.
- Wrong orders remain recoverable; wages are paid with no tips and higher stress.
- Repeated choices and restored state cannot apply both drink options or duplicate wages.
- Every authored choice has a valid destination and consequence.
- Compiled SugarCube HTML runs the Golden Hour route, comparison dialog, notebook, people panel, saves dialog, autosaves, and manual save/load restoration in jsdom.
- Compiled SugarCube HTML runs the decline/mistake/private-conversation route in jsdom.

The compiled-runtime tests found a collision with SugarCube's existing `choice` macro. The custom widget is now named `snChoice`.

### Browser checks

The first preview was blocked by the startup alert from the macro collision. A fresh preview of the corrected build was inspected successfully in the Codex in-app browser.

- Played all three correct orders, drank Golden Hour, chose the cautious reaction, disclosed to Theo and Nadia, and reached the ending.
- Confirmed 3/3 orders, $7 in tips, $95 shift pay, and $137 deposit savings.
- Visually inspected the opening, first transformation, paired portrait comparison, and save dialog.
- Checked normal desktop layout and a 390 x 844 viewport override. Reading content had no horizontal overflow; the narrow layout stacked correctly and text remained readable.
- Confirmed reloading restores the finished shift.
- Verified autosaves appeared in the actual browser save dialog.
- Fixed low-contrast dialog titles, section headings, and empty save-slot buttons, then rebuilt and visually rechecked them.
- Restored the normal viewport and restarted the prototype at its opening for the user.

The save-file export/import controls are supplied by SugarCube and visible in the save dialog. A filesystem export/import round trip was not part of this verification. Audio and subsequent shifts are not implemented.

### Artwork

The baseline/Golden Hour portrait pair is stored at `assets/characters/mara-golden-hour.png`. It was generated with the built-in image tool from the approved clean cel-shaded cast board. Exact prompt: `design/mara-golden-hour-prompt.txt`.

The two portraits retain matching framing, clothing, pose, and face identity; the changed portrait adds a pale honey-gold face-framing lock. Final portrait assets remain subject to user review.
