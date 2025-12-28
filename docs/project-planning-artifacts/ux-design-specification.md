---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13, 14]
inputDocuments:
  - docs/project_context.md
  - docs/ui-component-inventory-frontend.md
  - docs/prd.md
---

# UX Design Specification - 100 Days of Code

**Author:** Sam  
**Date:** 2025-12-28  

---

## Executive Summary

### Project Vision

A gamified Python learning platform that transforms a 100-day coding journey into an engaging RPG experience. Users progress through daily lessons, complete interactive quizzes, write and execute Python code directly in the browser, and earn rewards while leveling up their coding skills.

### Target Users

| User Type | Description |
|-----------|-------------|
| **Primary** | Python beginners following a structured 100-day curriculum |
| **Profile** | Self-motivated learners who enjoy gamification and progress tracking |
| **Tech Level** | Comfortable with browsers, may not have Python installed locally |
| **Devices** | Primarily desktop/laptop (code editing), some mobile for review |

### Key Design Challenges

1. **Information Density** - Dashboard displays many stats (XP, gold, streak, hearts, level, boss) with risk of cognitive overwhelm
2. **Tab Navigation** - Practice page has 3 tabs (Deep Dive, Quiz, Challenges) needing clear visual hierarchy
3. **Code Editor UX** - Pyodide can be slow on first load, requiring graceful loading states
4. **Day Navigation** - 100 days requires efficient selection with "today" anchor
5. **Mobile Responsiveness** - Code editing on mobile is inherently challenging

### Design Opportunities

1. **Celebration Moments** - Level-ups, badge unlocks, boss defeats could have delightful micro-animations
2. **Progress Visualization** - 100-day journey could be visualized as an interactive map or timeline
3. **Dark Theme Excellence** - Already dark-first; opportunity for premium/luxurious aesthetic
4. **Typography Hierarchy** - New fonts (Outfit/DM Sans) can establish stronger visual identity
5. **Micro-interactions** - Hover states and transitions on stat changes add polish

---

## Core User Experience

### Defining Experience

The core user loop is: **Read Daily Deep Dive → Take Quiz → Code Challenge → Earn XP → Repeat**

The **Practice page** is the critical experience where 80% of user time is spent. This is where users consume content, answer questions, and run code—the defining interaction of the product.

### Platform Strategy

| Dimension | Decision |
|-----------|----------|
| **Primary Platform** | Web (React SPA) |
| **Input Mode** | Mouse/keyboard primary, touch for navigation |
| **Offline** | Deferred to Phase 2 (PWA) |
| **Device Priority** | Desktop/laptop first, tablet second, mobile review-only |
| **Special Feature** | Browser-based Python execution (Pyodide) |

### Effortless Interactions

| Interaction | Requirement |
|-------------|-------------|
| **Day Navigation** | Jump to any day instantly, current day highlighted |
| **Tab Switching** | Deep Dive ↔ Quiz ↔ Challenges with no loading |
| **Code Execution** | Click Run, see output immediately |
| **Answer Feedback** | Instant correct/incorrect with explanation |
| **Progress Tracking** | XP and level update visibly after each action |

### Critical Success Moments

| Moment | Why Critical |
|--------|--------------|
| **First Quiz Complete** | User must feel "I can do this!" |
| **First Code Runs** | Magic moment - Python works in browser! |
| **Level Up** | Reward moment must feel earned and celebratory |
| **Boss Defeat** | Culmination of effort, maximum satisfaction |
| **Streak Continuation** | Daily return motivation |

### Experience Principles

1. **Progress is Always Visible** - XP, level, streak shown prominently; every action shows impact with smooth animations
2. **Learning Before Testing** - Deep Dive content always accessible before/during quiz
3. **Instant Feedback** - No waiting for results; code runs immediately, answers verify instantly
4. **Celebrate Meaningfully** - Reserve big celebrations for significant milestones (level-up, boss); subtle feedback for small wins
5. **Graceful Degradation** - Slow loads or failures shouldn't break the experience; always show progress
6. **Intentional Friction** - Strategic confirmation points for learning moments (quiz submission)

---

## Desired Emotional Response

### Primary Emotional Goals

| Emotion | When | Design Implication |
|---------|------|-------------------|
| **Empowered** | After completing code challenge | "I CAN code!" - clear success signals |
| **Accomplished** | Daily progress, level-ups | Visible progress + celebration |
| **Curious** | Browsing Deep Dive content | Engaging content, "what's next?" hooks |
| **Determined** | Returning daily, maintaining streak | Streak visualization, gentle urgency |

### Emotional Journey Mapping

| Stage | Desired Emotion | UX Support |
|-------|-----------------|------------|
| **Discovery** | Intrigued → "This looks fun!" | Appealing dark theme, XP/level visible |
| **First Use** | Confident → "I can do this" | Easy Day 1, quick wins |
| **Core Loop** | Flow state → Focused engagement | Minimal distractions, clear progression |
| **Mistake/Error** | Encouraged → "Let me try again" | Friendly error messages, SRS support |
| **Achievement** | Triumph → "I'm getting better!" | Celebration animations, badge pop |
| **Return Visit** | Motivated → "Keep the streak!" | Streak counter prominent |

### Micro-Emotions

| Positive (Target) | Negative (Avoid) |
|-------------------|------------------|
| ✅ Confidence | ❌ Confusion |
| ✅ Delight (at surprises) | ❌ Frustration (at bugs) |
| ✅ Accomplishment | ❌ Overwhelm |
| ✅ Belonging (leaderboard) | ❌ Inadequacy (vs others) |
| ✅ Trust (saved progress) | ❌ Anxiety (lost work) |

### Emotional Design Principles

1. **Fail Forward** - Errors should feel like learning opportunities, not punishments
2. **Quick Wins Early** - First interactions must generate immediate success feelings
3. **Surprise Sparingly** - Delight on milestones, not every action (avoid fatigue)
4. **Safe to Experiment** - Code editor should feel like a sandbox, not an exam
5. **Progress Over Perfection** - Celebrate showing up and trying, not just mastery

---

## UX Pattern Analysis & Inspiration

### Inspiring Products Analysis

| App | What They Do Well | Relevance |
|-----|-------------------|-----------|  
| **Duolingo** | Streak gamification, XP system, daily goals, celebration animations | Direct competitor pattern for gamified learning |
| **LeetCode** | Code editor UX, test case feedback, difficulty progression | Code challenge UX patterns |
| **Notion** | Dark theme excellence, clean typography, minimal UI | Visual design inspiration |
| **GitHub** | Activity heatmap calendar, contribution streaks | Calendar/streak visualization |

### Transferable UX Patterns

**Navigation Patterns:**
- Duolingo's lesson structure → Clear daily path with unlockable progression
- LeetCode's tabbed code view → Split pane for problem/code/output

**Interaction Patterns:**
- Duolingo's celebration confetti → Adapt for level-ups and boss defeats
- LeetCode's instant test feedback → Apply to coding challenge verification
- Streak fire animation → Visual urgency for daily return

**Visual Patterns:**
- Notion's dark mode → Premium dark theme with subtle gradients
- GitHub's contribution graph → Activity calendar with intensity levels

### Anti-Patterns to Avoid

| Anti-Pattern | Why Avoid |
|--------------|-----------|  
| Pushy notifications | Conflicts with "Safe to Experiment" principle |
| Complicated onboarding | Violates "Quick Wins Early" principle |
| Leaderboard shame | Creates "inadequacy" emotion we want to avoid |
| Hidden progress | Contradicts "Progress Always Visible" principle |

### Design Inspiration Strategy

| Category | Strategy |
|----------|----------|
| **Adopt** | Duolingo's streak mechanics, GitHub's heatmap calendar |
| **Adapt** | LeetCode's code editor (simplify for beginners), Duolingo's XP (add RPG layer) |
| **Avoid** | Aggressive monetization prompts, social comparison anxiety |

---

## Design System Foundation

### Design System Choice

**Tailwind CSS + Shadcn/Radix UI** (Themeable System approach - already implemented)

### Rationale for Selection

1. **Already Established** - 125+ components built on this foundation
2. **Modern & Maintained** - Tailwind and Radix are industry-standard
3. **Accessible** - Radix primitives have WCAG compliance built-in
4. **Customizable** - CSS variables allow easy theming
5. **Dark Theme Ready** - Already implemented

### Implementation Approach

| Phase | Action |
|-------|--------|
| **Extend** | Add missing primitives from Shadcn as needed |
| **Refine** | Tighten design tokens in `tailwind.config.js` |
| **Document** | Create component usage guidelines |

### Customization Strategy

| Token | Refinement |
|-------|-----------|
| **Colors** | Add semantic colors (success, warning, error) |
| **Animation** | Add celebration/success animations |
| **Shadows** | Add glow effects for RPG aesthetic |

---

## Visual Foundation

### Color System

| Token | Value | Usage |
|-------|-------|-------|
| `primary-500` | #eab308 | Gold - XP, highlights, CTAs |
| `accent-500` | #d946ef | Fuchsia - Magic effects, badges |
| `surface-950` | #020617 | Main background |
| `surface-900` | #0f172a | Card backgrounds |
| `surface-100` | #f1f5f9 | Primary text |
| `green-500` | #22c55e | Success states |
| `red-500` | #ef4444 | Error states |

### Typography Scale

| Level | Font | Size | Weight | Usage |
|-------|------|------|--------|-------|
| H1 | Outfit | 2.5rem | 700 | Page titles |
| H2 | Outfit | 1.75rem | 600 | Section headers |
| H3 | Outfit | 1.25rem | 600 | Card titles |
| Body | DM Sans | 1rem | 400 | Paragraph text |
| Code | JetBrains Mono | 0.875rem | 400 | Code blocks |

### Spacing System

Use Tailwind's default scale: 4, 8, 12, 16, 24, 32, 48, 64px

---

## User Journeys

### Primary Flow: Daily Learning

```
Dashboard → Practice (Day N) → Deep Dive Tab → Quiz Tab → Challenges Tab → XP Awarded → Dashboard
```

### Key Touchpoints

| Touchpoint | Emotion | UX Priority |
|------------|---------|-------------|
| Open app | Motivated | Show streak, today's day |
| Start quiz | Confident | Clear instructions |
| Answer question | Focused | Instant feedback |
| Complete day | Accomplished | Celebration animation |
| Level up | Triumphant | Big celebration |

---

## Component Strategy

### Existing Components (Keep)

| Component | Location | Status |
|-----------|----------|--------|
| Button, Card, Tabs | `ui/` | ✅ Complete |
| Quiz, QuestionRenderer | `Quiz/` | ✅ Complete |
| CodeEditor | `components/` | ✅ Complete |
| CharacterCard, StatCard | `components/` | ✅ Complete |

### Enhancement Opportunities

| Component | Enhancement |
|-----------|-------------|
| **DaySelectorBar** | Add "Today" anchor button, current day glow |
| **QuizResult** | Add confetti animation on high score |
| **LevelUpModal** | Create dedicated celebration overlay |
| **StreakCounter** | Add fire animation when streak > 7 |

---

## UX Patterns

### Navigation Pattern

- **Global Nav:** Navbar with 6 main sections
- **Local Nav:** Tabs within Practice page
- **Day Nav:** Horizontal scrollable selector

### Feedback Patterns

| Action | Feedback |
|--------|----------|
| Correct answer | Green flash + checkmark + XP pop |
| Wrong answer | Red flash + explanation + SRS queue |
| Code runs | Output appears immediately |
| Task complete | XP animation + optional achievement |

### Loading Patterns

| Scenario | Pattern |
|----------|---------|
| Page load | Skeleton shimmer |
| Pyodide init | "Starting Python..." with spinner |
| API call | Subtle spinner in button |

---

## Responsive Strategy

### Breakpoints

| Breakpoint | Width | Layout Changes |
|------------|-------|----------------|
| `sm` | 640px | Stack navigation |
| `md` | 768px | Side-by-side content |
| `lg` | 1024px | Full layout |

### Mobile Priorities

1. ✅ Dashboard - Works well
2. ✅ Deep Dive reading - Works well
3. ⚠️ Quiz - Needs touch-friendly options
4. ⚠️ Code Editor - Desktop recommended

---

## Accessibility Checklist

| Requirement | Status |
|-------------|--------|
| Keyboard navigation | ✅ Via Radix |
| Color contrast (AA) | ✅ Verified |
| Focus indicators | ✅ Custom ring |
| Screen reader labels | ⚠️ Audit needed |
| Reduced motion | ⚠️ Add `prefers-reduced-motion` |

---

## Implementation Priorities

### Phase 1: Quick Wins (This Sprint)
- [ ] Add "Today" button to DaySelectorBar
- [ ] Add confetti component for celebrations
- [ ] Audit ARIA labels on Quiz components

### Phase 2: Polish (Next Sprint)
- [ ] Create LevelUpModal overlay
- [ ] Add streak fire animation
- [ ] Implement `prefers-reduced-motion`

### Phase 3: Enhancement (Backlog)
- [ ] Progress visualization (100-day map)
- [ ] Improved mobile code editor UX
- [ ] Storybook documentation

---

## Summary

This UX Design Specification establishes:

1. **Vision** - Gamified Python learning with RPG mechanics
2. **Principles** - Progress visible, celebrate meaningfully, fail forward
3. **Emotions** - Empowered, accomplished, curious, determined
4. **Patterns** - Inspired by Duolingo, LeetCode, Notion
5. **System** - Tailwind + Shadcn foundation (already in place)
6. **Priorities** - Practice page is core, celebration moments matter

**Next Steps:** Use this spec to guide UI improvements and new feature development.

---

*Document generated through BMAD UX Design Workflow*
*Completed: 2025-12-28*
