# After hours — version 0.8

After each chapter-two recovery day, **Make plans for the evening** opens an optional outing. Mara is human again before going out. Ordinary-coffee shifts unlock the same opportunities. Choosing the next shift directly skips the evening without a penalty.

There are two conversations with each of Nadia, Theo, and Inez, with two answers per conversation. One outing fits into each recovery day. The second meeting with a person follows their first; completed meetings do not repeat. Five recovery evenings mean one playthrough cannot see all six meetings.

- Nadia: a walk by the cinema, then a night when she needs company herself. Mara can talk about the cafe or ask for time away from it. An ordinary-only playthrough never claims she has been transformed.
- Theo: a photograph of his first change into a radio, then his plans to ask for a share in the business. Mara can encourage the conversation or help with the figures. Inez has not made an ownership offer to anyone.
- Inez: meeting Bea, a regular who is spending the evening as a wooden coat stand, then finding Inez's name in an old recovery ledger. Ada is named as the previous owner. Inez's first form remains a later question.

Answers add a notebook entry, increase the relevant relationship once, and appear in the People panel. The next shift recalls the most recent evening. The chapter decision acknowledges time with Nadia and Theo's plans where applicable. An album in the notebook retains the three companion illustrations after their first completed outing.

## Save behavior

`arc.evenings` is added only when an answer is chosen. Each entry stores the person, conversation number, answer ID, and originating shift. `arc.visit.outing` reserves the current evening and preserves an unanswered scene across saves. Availability and count helpers only read state. The shared visit flag prevents seeing multiple people on the same evening; answer guards reject the wrong person, conversation, or a repeated effect. Advancing a shift cannot discard an unanswered outing.

Existing saves need no migration. A saved recovery day can enter the new scenes immediately. Finished chapter saves retain their ending; load an earlier save or start again to see the outings. Money, specials, physical recovery times, and gallery discoveries are not changed by evening choices.

## Illustrations

Generated with the built-in imagegen tool, using the approved cast board as the character and style reference. The exact prompt set is [downtime-art-prompts.json](downtime-art-prompts.json). All three were inspected before integration.

| Workspace asset | Generated source |
| --- | --- |
| [nadia-walk.png](../assets/scenes/nadia-walk.png) | `exec-a88a758e-e860-49a3-99f6-a9da6310012f.png` |
| [theo-radio-v2.png](../assets/scenes/theo-radio-v2.png) | `exec-7b28b1cd-f760-4fc5-9114-60f9508b29e3.png` |
| [inez-bea.png](../assets/scenes/inez-bea.png) | `exec-71a0b138-ce11-4a8f-a126-1f1b968d86a0.png` |

Originals remain in the local Codex generated-images directory. The build copies the workspace assets into `dist/assets`; no live game asset depends on the generation directory.

Theo's initial illustration had an extra arm behind his neck. A targeted built-in imagegen edit removed it, retaining the hand holding the photograph and the hand pointing at it. The corrected version was visually checked for two arms and natural shoulder connections. The original remains in `assets/scenes/theo-radio.png` for reference; the build publishes `theo-radio-v2.png` at the existing `dist/assets/theo-radio.png` URL. The exact edit prompt is [theo-radio-correction-prompt.txt](theo-radio-correction-prompt.txt).
