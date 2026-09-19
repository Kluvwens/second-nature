# Second Nature

A playable two-chapter narrative prototype built with Twine/Twee, SugarCube 2.37.3 and Tweego 2.1.1. All prose, styles, and game logic are editable source files.

## Play

[Play Second Nature](https://kluvwens.github.io/second-nature/) · [GitHub repository](https://github.com/Kluvwens/second-nature)

Run `npm start`, then open http://127.0.0.1:4173. The compiled game is in `dist/index.html`. It can also be opened directly, with its `assets` folder beside it; the localhost version provides a consistent browser origin for saves.

Version 0.9 uses a compact illustrated reader with dark espresso backgrounds, copper accents, and warm cream text. Regular scenes fit into short reading pages with **Continue** and **Back** controls; choices appear on the final page. Large screens show the scene illustration beside the prose, and smaller screens use a shallow image above it. Detailed transformation scenes retain a longer scrolling format. **Mara** opens the appearance, finances, galleries, and portrait comparison panels. The existing **View illustration** and full-resolution link behavior is unchanged.

The narration, dialogue, choice notes, and notebook text use the write-naturally skill. The 0.7 editorial pass removed repeated explanations of what scenes mean and grounded more of Mara's reactions in what she sees, feels, and does. New scenes follow that voice. [AGENTS.md](AGENTS.md) records the user's instruction to apply the skill whenever writing game text.

The story includes an illustrated apartment move-in before work, three customer orders, and a choice of ordinary coffee or Golden Hour. Golden Hour transforms Mara into a honey slime woman across three illustrated stages: hands, face and hair, then her complete body. Her immediate reaction is panic and a demand for reversal; liking some sensations complicates her fear. Each scene can be enlarged or opened at full resolution. A gallery records experienced stages, and a matched portrait pair compares her human and honey forms.

The shift also includes practicing control of her new body, conversations with Theo and Nadia, a notebook, a relationship panel, shift earnings, browser autosaves, save slots, and save-file export/import through **Save / Load**. After returning to the apartment, **Try to sleep** advances to the next morning. The first special wears off overnight; Mara wakes human, while her discoveries, memories, relationships, and earnings persist. An unchanged morning is also available on the ordinary-coffee route.

**Begin the next shift**, at the end of the following morning's conversation, opens chapter two. Five additional shifts introduce house recipes through everyday incidents: a rush, a regular visiting, a machine fault, a tea delivery, and a lighting problem. Each scene offers the drink or ordinary coffee, without a catalogue or a named transformation on the choice. All five new forms remain accessible in a single playthrough: a porcelain automaton, a porcelain cup, an espresso machine, a paper moth, and a living shadow. There are six transformation types including Golden Hour. Each new route has a detailed transformation, adjustment, work session, choices, aftermath, a conversation or private reflection, evening, and recovery. The cup and espresso-machine routes include repeated handling and use during service; the robot route explores precise movement and suggested routines. Five three-panel transformation illustrations and four service scenes join the existing art.

Each new shift can also be worked with ordinary coffee. A four-task or twelve-task session affects tips, while wages remain $88. Physical recovery slows with accumulated specials: the first new special after declining Golden Hour lasts 18 hours; later specials last 26–30 hours, remaining into the following day. The timeline advances through that recovery, and the following day is reserved before another shift. Work choices and enjoyment do not change duration. Five further shifts lead to a choice between staying with written terms or moving temporarily into Nadia's spare room. Romance routes and an open-ended calendar are not implemented.

Nadia now reacts with sustained surprise to every unfamiliar form, including the original honey change. She remembers new forms she has actually witnessed. Inez gradually involves Mara in invoices, suppliers, regulars, and stock decisions, hinting at a much later succession story; this chapter does not offer or transfer ownership.

**Make plans for the evening** now appears after each chapter-two recovery day. Spend time with Nadia, Theo, or Inez: each has two different meetings with two responses per meeting. Nadia has plans and problems beyond the cafe; Theo reveals his first transformation and his hopes for the business; Inez introduces Bea, a regular spending her day as a coat stand, and lets Mara look through older records. Twelve possible answers produce later dialogue, notebook entries, and memories in the People panel. The notebook's **After-hours illustrations** album retains three new full-resolution scenes. These outings also work after ordinary shifts, cost no wages, and can be skipped. One evening fits into each recovery day, so seeing all six meetings takes more than one playthrough. [Story, save behavior, artwork, and prompts](design/after-hours.md).

**Take a minute before working** opens a new optional experiment for each of the five later forms. Try a familiar habit or investigate a new sensation: ten outcomes, each remembered in the notebook. The expansion adds detail to the changes, service, nights, and recoveries, including the honey evening. Six new illustrations show porcelain hands, the paper moth, the living shadow, Nadia encountering the cup and shadow, and the espresso machine after closing. Scene art and the gallery follow the choices actually made. [Story details, artwork, and prompts](design/body-detail.md).

## Publish an update

GitHub Pages publishes the committed `dist` folder. After editing the game, run `npm run build` and `npm test`, then commit the source, artwork, and rebuilt `dist` files and push `main`. The **Publish game** workflow tests that build again before deploying it. The compiled game is included in the repository, so the deployment runner does not need the local Windows compiler.

Browser saves belong to the address where you play. To move a localhost save to the hosted game, export it through **Save / Load**, then import the file on the hosted site. Visiting the hosted site does not move or delete local saves.

## Develop

Requires Node.js and the local compiler described below. Building and serving need no npm packages; the compiled-runtime tests use the pinned jsdom development dependency. Run `npm.cmd ci` to restore test dependencies on another machine.

```powershell
npm.cmd run build
npm.cmd test
npm.cmd start
```

Rebuild after source edits, then refresh the browser. **Restart** resets the current playthrough; existing manual saves remain available. Saves belong to this origin and prototype save ID. Version 0.9 preserves the 0.2–0.8 story/save identifiers and state schema. Notebook entries already stored in saves retain their original wording; new entries use the revised text. The optional day field defaults to day one for older saves, and chapter-two state is created only when its entry choice is taken. Existing first-chapter saves can continue from **Closing** through the morning or directly from **MorningRules**. A saved chapter-two recovery day can enter the new evenings immediately. The internal StoryTitle retains its old version label for storage compatibility; the visible game and browser titles are set separately. Reading-page turns do not change story state or replay consequences. Reloading starts at the beginning of the current scene. Version 0.1 saves are not deleted or migrated.

- `src/story/first-shift.twee`: prose, passages, and choices.
- `src/story/other-menu.twee`: five-shift chapter, ordinary route, relationships, recovery, and endings.
- `src/story/new-transformations.twee`: five distinct transformation and work routes.
- `src/story/after-hours.twee`: optional recovery evenings, companion follow-ups, later dialogue, and the evening album.
- `src/story/other-gallery.twee`: discoveries retained after physical recovery.
- `src/story/interface.twee`: layout, notebook, people, illustration gallery, and portrait comparison.
- `src/systems.js`: serializable game state and choice consequences.
- `src/interface.js`: SugarCube configuration, scene artwork, and viewport-aware reading pages.
- `src/styles.css`: responsive interface.
- `assets/characters/mara-honey-slime-v2.png`: paired human/honey portraits.
- `assets/scenes/honey-onset.png`, `honey-spreading.png`, and `honey-settled.png`: illustrated transformation stages.
- `assets/scenes/apartment-arrival.png`: morning move-in illustration.
- `assets/scenes/cafe-welcome.png`, `counter-training.png`, and `golden-hour-cup.png`: cafe and break scenes.
- `assets/scenes/nadia-human.png`, `nadia-honey.png`, and `apartment-honey-evening.png`: branch-specific conversation and closing art.
- `assets/scenes/morning-human.png`: the next morning's human baseline and recovery illustration; exact built-in image prompt in [design/morning-human-prompt.md](design/morning-human-prompt.md).
- `assets/concepts/second-nature-cast-cel-v3.png`: approved cast/cafe style reference.
- `design/style-and-cast.md`: story and art brief.

## Local tools

Tools are installed only in this project. The build uses `TWEEGO_PATH=.tools/formats` to select SugarCube 2.37.3 rather than the older version bundled with Tweego.

Official sources:

- [Tweego](https://www.motoslave.net/tweego/), [Windows x64 2.1.1 archive](https://github.com/tmedwards/tweego/releases/download/v2.1.1/tweego-2.1.1-windows-x64.zip). Extract into `.tools/tweego` so `tweego.exe` is directly inside it.
- [SugarCube](https://www.motoslave.net/sugarcube/2/), [2.37.3 Twine 2 archive](https://www.motoslave.net/sugarcube/download.php/2/sugarcube-2.37.3-for-twine-2.1-local.zip). Extract into `.tools/formats`, yielding `.tools/formats/sugarcube-2/format.js`.
- [SugarCube API documentation](https://www.motoslave.net/sugarcube/2/docs/).

Observed SHA-256 checksums of the downloaded archives:

```text
Tweego:    38102CC40906AE90B43F5ED1D97985D7C395376F54A14438E3FDA63C1C8FD28B
SugarCube: DA00A8C15EC4E88A9E231A3FF6C516C57055F84231BB999F869ED34ADE353DAB
```

These record the downloaded artifacts; they are not separately authenticated publisher signatures. Licenses are included in `.tools` and SugarCube's license is copied into `dist`.

On another platform, install the matching Tweego binary and set `TWEEGO_BINARY` to its absolute path. Do not run the Windows executable there.

## Art

Concepts, scene illustrations, and paired portraits were made with the built-in image generation tool. The nine new v0.5 assets and exact prompt sets are indexed in [design/other-menu-art.md](design/other-menu-art.md). The v0.3 scenes and prompts are in [design/scene-art-v3-prompts.md](design/scene-art-v3-prompts.md). Honey transformation assets and exact scene prompts are in [design/honey-sequence-prompts.md](design/honey-sequence-prompts.md); the matched portrait prompt is in [design/mara-honey-slime-v2-prompt.txt](design/mara-honey-slime-v2-prompt.txt). Images are served locally; no external fonts, analytics, or runtime network services are required. The portrait pair is displayed with CSS positioning rather than destructively modifying the source image. The older hair-lock portrait is retained as an archive and is not used in the current game.

## Validation

`npm test` checks complete drink/decline paths, earnings, relationship consequences, error recovery, duplicate/reloaded choices, and passage destinations. It also executes the compiled SugarCube HTML in jsdom and checks passages, dialogs, autosaving, and manual save restoration. Browser playthrough and layout results are recorded in `design/prototype-validation.md`.
