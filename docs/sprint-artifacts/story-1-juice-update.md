# Story: The Juice Update (UX Overhaul)

**Epic:** 1-UX-Improvements
**Status:** done
**Owner:** User

## Description
Enhance the user experience of the Learning Tracker by implementing a "Deep Glass" aesthetic, adding smooth animations with `framer-motion`, and gamifying interactions ("Juice").
**Phase 2 Update:** Evolve the aesthetic to "Nano Banana Pro" standards using a Cyber-Industrial Yellow theme and Professional Vector Icons.

## Acceptance Criteria
- [x] **Visuals**: Application uses a dark, multi-stop radial gradient background.
- [x] **Cards**: All cards use glassmorphism (`backdrop-blur-xl`, semi-transparent backgrounds).
- [x] **Theme**: Primary accent color is "Electric Banana" (Yellow-400/Amber-500).
- [x] **Icons**: **ZERO EMOJIS**. All UI icons are `lucide-react` vectors.
- [x] **Navbar**: Active tab has a sliding "pill" animation backing it.
- [x] **Dashboard**: Stats (XP, Gold) animate (count up) on load.
- [x] **Dashboard**: Items stagger in (one by one).
- [x] **Performance**: No laggy animations; transitions are smooth.

## Tasks
### Phase 1: The Juice (Completed)
- [x] Install `framer-motion`
- [x] Update `index.css` with "Deep Glass" tokens (gradients, card styles)
- [x] Refactor `Navbar` to use `LayoutGroup` or `layoutId` for active state
- [x] Refactor `Dashboard` to use `AnimatePresence` and `motion.div`
- [x] Implement `NumberTicker` for stats
- [x] Refactor `QuestLog` for list transitions

### Phase 2: Nano Banana Pro (New)
- [x] Install `lucide-react`
- [x] Update `tailwind.config.js` tokens (`primary` -> Yellow)
- [x] Refactor `Navbar.jsx`: Replace Emojis with Lucide Icons
- [x] Refactor `Dashboard.jsx`: Replace Emojis with Lucide Icons
- [x] Refactor `QuestLog.jsx`: Replace Checkboxes with Custom Vector Controls
- [x] Verify "No Emojis" policy across app

## Dev Agent Record
### File List
- frontend/src/index.css
- frontend/tailwind.config.js
- frontend/package.json
- frontend/package-lock.json
- frontend/playwright.config.ts
- frontend/src/components/Navbar.jsx
- frontend/src/components/BadgeCard.jsx
- frontend/src/components/CharacterCard.jsx
- frontend/src/components/CodeEditor.jsx
- frontend/src/components/QuestLog.jsx
- frontend/src/components/ShopModal.jsx
- frontend/src/components/TaskCard.jsx
- frontend/src/components/WeekAccordion.jsx
- frontend/src/components/content/DeepDive/Day1.jsx
- frontend/src/components/content/DeepDive/Day2.jsx
- frontend/src/components/content/DeepDive/Day3.jsx
- frontend/src/components/content/DeepDive/Day4.jsx
- frontend/src/components/content/DeepDive/Day5.jsx
- frontend/src/components/content/DeepDive/Day6.jsx
- frontend/src/components/content/Transcripts/Day1.jsx
- frontend/src/components/content/Transcripts/Day2.jsx
- frontend/src/components/content/Transcripts/Day3.jsx
- frontend/src/components/content/Transcripts/Day4.jsx
- frontend/src/components/content/Transcripts/Day5.jsx
- frontend/src/components/content/Transcripts/Day6.jsx
- frontend/src/pages/Calendar.jsx
- frontend/src/pages/Dashboard.jsx
- frontend/src/pages/Planner.jsx
- frontend/src/pages/Practice.jsx
- frontend/src/pages/Progress.jsx
- frontend/src/pages/Reflections.jsx
- frontend/src/utils/xpUtils.js
- frontend/tests/e2e/dashboard.spec.ts
- docs/sprint-artifacts/story-1-juice-update.md
