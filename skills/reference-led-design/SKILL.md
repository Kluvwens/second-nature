---
name: reference-led-design
description: Improve a generic or AI-looking game interface, website, or app through visual comparison with credited design work. Use when the user requests stronger art direction, a less template-like result, or comparison with human-made products. Not for prose-only editing or routine functional fixes.
---

# Reference-led design

Turn a complaint such as “this looks AI-coded” into specific, visible problems and repair them. The goal is a product with a coherent identity and usable interactions. Appearance is not evidence of who authored it; do not promise human authorship or an AI-detector result.

## Start with the actual artifact

Inspect the running interface, its existing visual brief, and the user's current viewport. Preserve work in progress and saves. Capture a before view before changing the layout. Look beyond the opening screen: inspect a real decision, a populated state, and a constrained viewport where relevant.

Find what competes with the task. Common failures worth investigating include:

- A large title, repeated slogan, or empty illustration area displacing the main action.
- Every piece of information presented as the same bordered card, regardless of its purpose.
- A single icon used as a logo, scene illustration, button, and reward with no change of meaning.
- Small uppercase labels, weak contrast, or a decorative type treatment applied to essential rules.
- Fiction or imagery that could be replaced with another game's nouns without changing the design.
- A plausible desktop screenshot hiding excessive scrolling, missing controls, or unreadable content at the user's real size.

These are questions, not a blacklist. A grid, a serif, a gradient, or a dashboard can be the right design. Explain the defect in context before replacing it.

## Compare with credited work

Find a small set of relevant finished products. Prefer the original designer, artist, publisher, or studio's documentation and component images. Verify credits when calling something human-made. For an established visual product, older credited editions can provide clear provenance.

Inspect actual pixels. Search snippets, marketing descriptions, and a list of admired brands do not establish a visual comparison. Look at the comparable component or task: a board against a board, a decision screen against a decision screen. Record the source URL, what was visibly inspected, and any limitations. Do not claim to have inspected an inaccessible PDF or image.

Make the comparison operational:

| Reference observation | Current artifact | Consequence for the user | Proposed change |
| --- | --- | --- | --- |
| What is visibly present, with its source | The particular element or state that falls short | Why it affects recognition, reading, orientation, or action | A concrete change that can be checked afterward |

Separate observation from interpretation. A publisher's credits establish authorship; your judgment about hierarchy or readability is your analysis. Do not invent user research or score your own work as objectively “professional.”

Study relationships: contrast between scenery and controls, type hierarchy, density, landmarks, interaction timing, and what the designer chose to omit. Do not copy another work's characters, map, logo, or distinctive composition into the product. References are not permission to redistribute their assets.

## Choose a direction that changes the structure

State the product-specific organizing idea in plain language. For example, an impossible café can become a navigable place with recognizable rooms. That is more useful than “premium, immersive, handcrafted.”

Choose the few defects with the greatest effect on the experience. At least one change should address the root defect identified by the comparison. A new palette, grain overlay, random rotation, or renamed CSS classes is not a structural correction when hierarchy and interaction remain the problem.

Give different functions appropriate forms. A route, character record, current choice, and reference library need not share a card template. Keep the primary action near the state it changes. Let secondary information recede without hiding costs, consequences, or required controls.

Use content-specific art when it materially supplies identity or orientation. Match the medium to the brief. Do not stretch generic line icons into scene illustrations. Keep text and interactive targets in code when that improves legibility and accessibility. Preserve a readable fallback if an illustration fails to load. Label generated artwork accurately and retain its prompt and local source asset.

For writing, follow the project's voice and any requested writing skill. Remove redundant interface slogans without flattening narrative detail. A sensory passage and a button label have different jobs.

## Implement and compare again

Preserve the authorized scope, mechanics, data, choices, and save compatibility unless the user requested changes to them. Work within the existing project and remove superseded presentation code where practical. Do not add unrelated features to make the revision seem substantial.

Check the revised artifact in the same meaningful states and sizes used for the baseline. Ask:

- Can the player identify their position, the current decision, and its cost?
- Does the art help orientation without obscuring hit targets or state?
- Is the text readable at actual size, with unambiguous interaction labels?
- Can the layout accommodate a populated inventory, long choice, or combined effect?
- Are keyboard focus, reduced motion, and small-screen operation still usable?
- Which specific reference-derived defect is now corrected, and what remains weaker?

Use measurements when they answer a question: document overflow, control position, text size, clipping, or state persistence. Functional tests do not prove visual quality; a screenshot does not prove working behavior. Perform both checks as appropriate, including the repository's required build and tests.

Stop when the identified defects have been addressed and checked. Report concrete changes, sources, validation, and material remaining limits. Do not declare parity with a credited artist simply because the page is more polished.

## Worked example

Read [the Hex & Honey comparison](references/hex-and-honey.md) when applying this workflow to a board-game interface. It demonstrates an inadequate cosmetic pass and the more useful comparison that followed. Its visual direction is specific to that game, not a required style for other products.
