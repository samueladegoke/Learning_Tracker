# Story: The Juice Update (UX Overhaul)

**Epic:** 1-UX-Improvements
**Status:** review
**Owner:** User

## Description
Enhance the user experience of the Learning Tracker by implementing a "Deep Glass" aesthetic, adding smooth animations with `framer-motion`, and gamifying interactions ("Juice").

## Acceptance Criteria
- [ ] **Visuals**: Application uses a dark, multi-stop radial gradient background.
- [ ] **Cards**: All cards use glassmorphism (`backdrop-blur-xl`, semi-transparent backgrounds).
- [ ] **Navbar**: Active tab has a sliding "pill" animation backing it.
- [ ] **Dashboard**: Stats (XP, Gold) animate (count up) on load.
- [ ] **Dashboard**: Items stagger in (one by one) rather than popping in all at once.
- [ ] **Quest Log**: Completing a task animates it out smoothly; the list reorders automatically.
- [ ] **Performance**: No laggy animations; transitions are smooth.

## Tasks
- [x] Install `framer-motion`
- [x] Update `index.css` with "Deep Glass" tokens (gradients, card styles)
- [x] Refactor `Navbar` to use `LayoutGroup` or `layoutId` for active state
- [x] Refactor `Dashboard` to use `AnimatePresence` and `motion.div`
- [x] Implement `NumberTicker` for stats
- [x] Refactor `QuestLog` for list transitions

## Dev Agent Record
### File List
- frontend/src/index.css
- frontend/src/components/Navbar.jsx
- frontend/src/pages/Dashboard.jsx
- frontend/src/components/QuestLog.jsx
- frontend/package.json
- frontend/.env
- frontend/src/api/client.js

### Change Log
- Installed framer-motion
- Overhauled global CSS for glassmorphism
- Animated core dashboard components
- Fixed API connection issues
