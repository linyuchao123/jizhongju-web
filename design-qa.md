# 迹中局 Web prototype — design QA

final result: passed

## Scope and visual truth

User accepted the three generated art directions, then explicitly changed the product into a conventional shared platform with five navigation items and separate immersive stories. The implemented layout follows that accepted product change; this is not a pixel-for-pixel recreation of the original single-story landing mockups.

Source visual truth:
- `/Users/xiaolin/.codex/generated_images/01a18bb6-049b-7b90-b043-51e6d01adac3/exec-2f3bdff1-10b1-4231-ad0d-fc44932fd497.png` — light forest-green platform and architectural miniature direction.
- `/Users/xiaolin/.codex/generated_images/01a18bb6-049b-7b90-b043-51e6d01adac3/exec-f6900096-9357-4d65-a1cf-f7274922ce75.png` — cinematic lakeside story and ticket/letter direction.
- Accepted product brief: map / story archives / adventure / collection / profile, selectable digital archives, full-browser story mode, Web first.

## Captures and normalization

- Desktop CSS viewport: 1440 × 1024. Screenshot `qa/archive-desktop.png`: 1440 × 1131 (full page, content extends below viewport). `qa/story-opening.png`: 1440 × 1024. Browser-rendered, not inferred from code.
- Mobile CSS viewport: 390 × 844. `qa/archive-mobile.png`: 390 × 844. Also inspected the mobile story and map in the actual browser.
- No device frame; browser screenshots use 1 screenshot pixel per CSS pixel. Browser's display panel can scale the visible preview; captured image dimensions were checked separately.
- Source and implementation were put together and opened as actual comparison boards: `qa/comparison-platform.png`, `qa/comparison-story.png`. Sources preserve their original aspect ratio; thumbnails fit within 720 × 700 for side-by-side art-direction comparison, without stretching.
- Deliberate state/layout differences: original concept was a single-story entry; approved platform is an archive collection. Accordingly composition was reviewed against the revised brief rather than treating requested changes as fidelity regressions.
- Focused comparison: live 1440 screenshots inspected full-size for archive typography, card controls, detail modal, chapter controls and button contrast; PNG output opened separately at native 900 × 1280. Smaller type and poster clipping could not be judged from overview boards alone.

## Required fidelity surfaces

- Typography: system Chinese sans for UI and Songti serif for literary headings. Source family hierarchy retained. Primary explanatory text and answer options enlarged after first inspection; metadata remains secondary. Long titles wrap intentionally; orphaned map title fixed.
- Spacing/layout: desktop 100px top nav, wide archive grid with asymmetric featured card, shared platform structure. Mobile uses a single-column archive and fixed five-item bottom navigation. No horizontal overflow at 1440 or 390 CSS pixels. Page and chapter scroll reset added.
- Colors/tokens: pale green-white shared platform, forest-green controls, restrained cinnabar story CTA; separate dark story atmosphere. Corrected light-button hover to retain visible text contrast.
- Imagery/assets: three separate generated raster assets, inspected and copied into `public/assets/`. Original UI mock screenshots are not used as flattened app surfaces. Map explicitly marked artistic and non-navigational. Phosphor library supplies UI icons.
- Copy/content: five requested navigation labels, story previews vs active story clearly distinguished. Only one playable story; two planned stories marked as previews. AI hints are explicitly preset. Location/photo collection is labeled unverified. Fiction and non-historical content are clearly stated.

## Interaction checks performed in actual browser

- All five navigation destinations, including unstarted adventure and unlocked collection.
- Story filter, search no-results state, restore all stories.
- Bookmark story, verify it appears in profile, remove bookmark.
- Open story detail, choose preview or field capture mode, close modal.
- Preview: enter story → open letter → first act.
- Wrong answer feedback, first-tier hint, correct answer and evidence collection.
- Choose breakfast branch, pause, reload page, resume same chapter/branch.
- Complete breakfast branch, third act, collect all three pieces.
- Click three map fragments; final reveal stays disabled until all three placed; ending opens after completion.
- Generate PNG, inspect poster layout, inspect download filename and full image data. Decoded sample is `qa/sample-poster.png` (900 × 1280).
- Open profile after ending, verify completion record and counts.
- Mobile archive, detail and field-capture layout; no horizontal overflow (document and immersive container both 390 CSS px).
- Assets loaded successfully; final browser warning/error logs empty.
- Agent-generated test progress cleared through product confirmation UI; user preview left in fresh archive state.

## Comparison history / fixes

1. [P2] Poster hero draw exceeded its image area, covering the brand line. Fixed canvas clipping to exactly 900 × 520; regenerated and opened `qa/sample-poster.png`, verified clean text/image separation. Evidence: `qa/poster-fixed.png` and native sample.
2. [P2] Map description left a single trailing Chinese character on a third line. Rephrased to “一张戏票，走进老北京。” and reduced map title font. Rechecked desktop and mobile map.
3. [P2] Light buttons inherited dark hover background with dark text. Added explicit light-button and puzzle-button hover colors; rechecked current assets and styles.
4. [P2] Navigation/next chapter could preserve a prior scroll offset. Added page/chapter scroll reset, rechecked mobile navigation.
5. [P2] Mobile hidden return label left an unnamed story back button. Added persistent accessible aria-label, verified locator can operate it.
6. [P2] Underlying platform remained in the accessibility tree during modals. Added inert to platform header/main while overlays are active; final dialog snapshots show the active modal content.
7. Improved fragment tray with actual city-image crops and snap animation; kept click alternative for keyboard/mobile users.

## Remaining limits / P3 follow-ups

- Real GPS permission granting and native photo chooser were not exercised; no private location was requested during testing. Their UI is implemented but end-to-end device validation remains outstanding.
- Drag/drop pointer gesture not exercised; accessible click path tested to completion.
- This is a frontend prototype, not a production location game. AI, exact navigation SDK, identity, cross-device sync, source-verified cultural knowledge and WeChat mini-program remain future work.
- Original concept's miniature terrain separation is represented in the image language and piece tray; advanced 3D terrain assembly is not implemented.
- Decorative brand mark uses system Chinese typography; final brand lettering can be customized later.

## Implementation checklist

- [x] Requested five-page platform and distinct story mode.
- [x] Generated image assets present with provenance.
- [x] Core preview complete through final reveal and PNG output.
- [x] Browser progress recovery and accurate demo labels.
- [x] Desktop/mobile browser inspection, fixes and post-fix evidence.
- [x] Production build succeeds.
- [ ] Real-world route/permissions/photo validation and backend integrations (outside this frontend delivery).
