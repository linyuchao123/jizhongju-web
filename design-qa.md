# 迹中局 · 颐和谜境 QA

Date: 2026-10-31. Implementation: http://127.0.0.1:4173/

## Visual targets and evidence

Source: user supplied IMG_5297.png (1290×2796, screenshot with phone chrome), plus current map screenshots showing atmosphere tint and four-point coverage. The reference supplies mature hand-painted garden detail, mineral greens, paper labels and a red exploration path. It is an inspiration reference, not a selected pixel-exact web layout. Source includes decorative phone chrome; implementation intentionally retains the accepted universal platform navigation and live geographic map.

Full comparison: `qa/comparison-palace-v3.jpg` combines the actual source, live map screenshot and post-fix mobile story in one image. Source is proportionally normalized to fit 490×900 without distortion. Desktop implementation 1440×1000 CSS/pixels; mobile 390×844 CSS/pixels, density 1. Story and map are different states, explicitly compared for art direction, not identical geometry/layout.

Rendered captures:
- `qa/map-world-v3.png`: consistent global land/water colors.
- `qa/map-beijing-v3.png`: regional green and subdued relief.
- `qa/map-palace-v3.png`: water surface, main buildings, expanded labels and directory.
- `qa/palace-game-desktop.png`: actual live observation task, matched raster illustration, aligned points and readable choices.
- `qa/palace-dossier-mobile.png`: scrollable digital dossier, complete text and mode controls.
- `qa/palace-observation-mobile-v3.png`: post-fix mobile task.
- `qa/palace-collection-desktop.png`: inventory with actual item art; capture caught page transition, so visual judgment used the settled story/inventory UI as well.

Focused checks used full-resolution story captures for text, transparency edges, tap controls and hotspot alignment; the combined board alone is insufficient to read fine UI.

## Findings and fix history

- [P1, fixed] Globe had asymmetric atmosphere coloring. Explicit atmosphere-blend 0 and disabled global raster tint. Post-fix world capture has a consistent palette.
- [P2, fixed] Regional relief was washed out and overly sculpted. Deeper forest/park colors, reduced hillshade, terrain delayed until z14.5; pitch bounded 52 degrees. Post-fix Beijing capture keeps the regional view legible.
- [P1, fixed] Only four scenic labels and incorrect tower center. Added 55 unique major scenic/entrance anchors, search and categories. Tower placed at the actual octagonal footprint. Approximate observation anchors remain explicitly identified.
- [P2, fixed] Mobile cover crop removed the context behind observation targets; translucent task paper obscured text. Restricted observation image to its own 280px stage and increased paper opacity. Compare `palace-observation-mobile.png` with `palace-observation-mobile-v2.png` and `-v3.png` at the same state/viewport.
- [P2, fixed] Observation labels did not align with scene depth. Expanded desktop observation coordinate space and repositioned mobile targets; near target now aligns to the visible railing, mid to trees, far to lake. Recaptured desktop and mobile v3.
- [P2, fixed] Archive name hook promised a twist not present in the script. Replaced with the consistent question about why the notebook brings the player here.

## Five fidelity surfaces

- Typography: Chinese serif display headings and paper dialogue fit the literary direction; sans UI metadata and coherent Phosphor controls retain the universal shell. Desktop headings and mobile wrapping inspected. No artificial reference calligraphy clone.
- Spacing/layout: desktop stage preserves art to the left and scrollable task to right; mobile uses full-width stage then task. Dossier scrolls without trapping its CTA offscreen. Main buttons were activated via the UI, including those requiring panel scroll.
- Colors/tokens: deep jade, warm ivory, muted brass and red map accents. Revised task opacity preserves legibility. No hemisphere tint remains in the observed global state.
- Images: 14 generated subject-specific assets, equal-size WebP conversion with alpha preserved for items. Matching palace/corridor/bridge branch images, separate NPC portrait. These are narrative illustrations, not documentary photographs. No generic SVG recreation of the reference imagery.
- Copy/content: six connected scenes, explicit fiction/fact distinction, meaningful feedback, source links, no invented GPS verification or live-LLM claim. Archive, adventure, collection and profile share consistent state.

## Interaction verification

Browser UI completed all six chapters, three observation points, wrong-answer feedback and correct recovery, RenShou branch, memory title, photo upload to IndexedDB, six rewards, storyteller ending, automatic record and poster generation. Replay retained inventory/history; pause/reload/resume returned to the observation chapter. Map search found 谐趣园; all 55 entries present in directory. Desktop and 390×844 checked.

Automated suite: 20 tests cover continuous camera, distance/accuracy, bounded coordinates, materials/geometry, chapter assets and map ids, corrupted saves, reward idempotency, skip prevention, all three ending records and replay retention. Production build and hosting output verified.

Console: no new runtime errors after repaired state parser and deliberate reload. Log history still contains the earlier transient HMR syntax error; it was fixed and is not a current error.

## Known implementation limits

The live map uses public vector footprints and low-resolution DEM, not photogrammetry. It cannot reproduce the reference's individually painted trees and intricate architectural façades as surveyed navigable 3D. This remains a material visual-data limitation, explicitly disclosed in the map explanation and handoff; detailed licensed assets and field verification are still needed for that quality tier. The reference's illustrative richness is implemented in the story scenes. 55 covers major attractions/entrances, not every minor garden object; 20 are reference observation anchors. No field route survey, cloud sync, actual camera-permission capture, low-end-device performance or real-time LLM verification was performed.

## Implementation checklist

- [x] Map palette and lighting corrected; directory expanded.
- [x] Story → adventure → rewards → gallery → records loop implemented.
- [x] Matching art, phone layout and reload state checked.
- [x] Build and 20 tests passed.
- [ ] Future production: detailed 3D assets, finer DEM and field route validation; real AI and cloud account storage.

final result: passed

## 2026-10-31 launch supplement

New mobile account screenshot: `qa/account-mobile-final.png`, 390×844 pixels/CSS at density 1. Source direction remains the existing pale paper/jade platform and actual garden raster art. Visual check: title/body hierarchy consistent, labels legible, balanced margins, sharp matching garden art, password visibility and guest controls reachable. The screenshot was actually opened and inspected. Local dual-mode homepage and field lock states were also observed through browser UI. No new P0/P1/P2 layout defect found in these captured states. Launch tests: 29 pass; see docs/deployment-2026-10-31.md for exact live-network and audio/GPS verification limits. This supplements, rather than expands, the scope of the earlier visual QA pass.

## 2026-10-31 offline rewrite
Mobile 390×844 inspected. One archive entry, no startup GPS/camera gate, uncropped real photos, joint submission UI, native camera input. Finder centres destination when location times out; selected answer survives return. Voice toolbar corrected from a floating overlap to a sticky separate row. Evidence: qa/trail-mobile-final.png. Source/limits: docs/offline-rewrite-2026-10-31.md. No field visit claimed.

## Leshoutang single-scene checkpoint
final result: passed

Source: user-approved cinematic screenshots (Aheng portrait, full-bleed scene, ivory lower dialogue panel, illustrated collectibles). New content follows workbook row 2, so this is style-preserving scene authoring rather than a pixel clone of the old gate.

Compared source and current desktop opening in the same image: qa/leshoutang-style-comparison.jpg. The full-screen scene, mineral green treatment, portrait/dialogue anatomy, typography and tool hierarchy remain. New floating journal and three-object investigation cards are intentional story-specific additions. No blocking P0/P1/P2 visual differences for this checkpoint.

390×844 phone opening inspected in qa/leshoutang-mobile.png: title, journal page, portrait, dialogue and action are readable; content scrolls on shorter displays. Browser walkthrough verified all three investigations, wrong/correct answer paths, seal award, route preview and reset; no console errors. Generated artefacts are labelled interpretations, and demonstration does not claim photo/GPS verification. Latest test and build results are recorded in docs/leshoutang-first-scene.md.
