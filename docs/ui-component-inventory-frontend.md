# UI Component Inventory - Frontend

> **Generated:** 2025-12-28  
> **Scan Level:** Exhaustive

---

## Design System Overview

### Color Palette (Tailwind)

| Token | Value | Usage |
|-------|-------|-------|
| `primary-400` | #facc15 | Gold accents, XP, highlights |
| `primary-500` | #eab308 | Primary buttons, active states |
| `accent-500` | #d946ef | Fuchsia accent, magic effects |
| `surface-950` | #020617 | Main background |
| `surface-900` | #0f172a | Card backgrounds |
| `surface-800` | #1e293b | Elevated surfaces |
| `surface-700` | #334155 | Borders, dividers |
| `surface-400` | #94a3b8 | Muted text |
| `surface-100` | #f1f5f9 | Primary text |

### Typography

| Class | Font | Weight | Usage |
|-------|------|--------|-------|
| `font-display` | Outfit | 500-700 | Headings, titles |
| `font-body` | DM Sans | 400-600 | Body text, labels |
| `font-mono` | JetBrains Mono | 400-500 | Code, terminal |

### Animations

| Name | Duration | Description |
|------|----------|-------------|
| `pulse-slow` | 3s | Slow pulse for attention |
| `float` | 6s | Gentle up/down floating |
| `glow` | 2s | Gold glow effect |

---

## UI Primitives (Shadcn/Radix)

Located in `src/components/ui/`

| Component | File | Props | Usage |
|-----------|------|-------|-------|
| **Button** | `button.jsx` | variant, size, asChild | Primary/secondary actions |
| **Card** | `card.jsx` | className | Content containers |
| **Tabs** | `tabs.jsx` | value, onValueChange | Tab navigation |
| **Progress** | `progress.jsx` | value | Progress bars |
| **Tooltip** | `tooltip.jsx` | content | Hover info |
| **Skeleton** | `skeleton.jsx` | className | Loading placeholders |

---

## Page Components

### Dashboard (`/`)

| Component | File | Description |
|-----------|------|-------------|
| CharacterCard | `CharacterCard.jsx` | XP bar, level, avatar |
| StatCard | `StatCard.jsx` | Individual stat display |
| QuestLog | `QuestLog.jsx` | Active quests, boss HP |
| Leaderboard | `Leaderboard.jsx` | Top players ranking |
| DailyReviewWidget | `DailyReviewWidget.jsx` | SRS review reminder |
| ShopModal | `ShopModal.jsx` | Item purchase dialog |

### Practice (`/practice`)

| Component | File | Description |
|-----------|------|-------------|
| DaySelectorBar | `Quiz/DaySelectorBar.jsx` | Day 1-100 navigation |
| Quiz | `Quiz/Quiz.jsx` | Main quiz container |
| QuestionRenderer | `Quiz/QuestionRenderer.jsx` | MCQ/Coding question display |
| OptionButton | `Quiz/OptionButton.jsx` | Multiple choice option |
| QuizPagination | `Quiz/QuizPagination.jsx` | Question navigation |
| QuizResult | `Quiz/QuizResult.jsx` | Score summary |
| QuizMasteryOverlay | `Quiz/QuizMasteryOverlay.jsx` | Completion celebration |
| CodeEditor | `CodeEditor.jsx` | Pyodide code runner |

### Progress (`/progress`)

| Component | File | Description |
|-----------|------|-------------|
| BadgeCard | `BadgeCard.jsx` | Badge display |
| ProgressBar | `ProgressBar.jsx` | Generic progress |
| ProgressRing | `ProgressRing.jsx` | Circular progress |

### Planner (`/planner`)

| Component | File | Description |
|-----------|------|-------------|
| WeekAccordion | `WeekAccordion.jsx` | Expandable week sections |
| TaskCard | `TaskCard.jsx` | Individual task item |

### Calendar (`/calendar`)

| Component | File | Description |
|-----------|------|-------------|
| (inline) | `Calendar.jsx` | Activity heatmap grid |

### Shared

| Component | File | Description |
|-----------|------|-------------|
| Navbar | `Navbar.jsx` | Top navigation bar |
| ErrorBoundary | `ErrorBoundary.jsx` | Error catching wrapper |
| DashboardLoadingSkeleton | `DashboardLoadingSkeleton.jsx` | Dashboard loading state |
| PracticeLoadingSkeleton | `PracticeLoadingSkeleton.jsx` | Practice loading state |
| CurrentSyncStatus | `CurrentSyncStatus.jsx` | API sync indicator |
| CodeBlock | `CodeBlock.jsx` | Syntax highlighted code |
| InlineCode | `InlineCode.jsx` | Inline code styling |

---

## Content Components (DeepDive)

Located in `src/components/content/`

| Range | Count | Description |
|-------|-------|-------------|
| Day1-Day20 | 20 | Python basics, syntax |
| Day21-Day40 | 20 | Intermediate concepts |
| Day41-Day60 | 20 | OOP, modules |
| Day61-Day80 | 20 | Advanced topics |
| Day81-Day86 | 6 | Projects, review |
| DeepDiveLoader | 1 | Lazy loading wrapper |

**Total:** 86 content components + 1 loader

---

## Component Patterns

### Card Pattern
```jsx
<div className="card p-6">
  <h3 className="text-xl font-display text-surface-100">Title</h3>
  <p className="text-surface-400">Content</p>
</div>
```

### Button Pattern
```jsx
<Button variant="default" size="lg">
  Primary Action
</Button>
<Button variant="outline" size="sm">
  Secondary
</Button>
```

### Tab Pattern
```jsx
<Tabs defaultValue="quiz" onValueChange={setTab}>
  <TabsList>
    <TabsTrigger value="deepdive">Deep Dive</TabsTrigger>
    <TabsTrigger value="quiz">Quiz</TabsTrigger>
  </TabsList>
  <TabsContent value="deepdive">...</TabsContent>
  <TabsContent value="quiz">...</TabsContent>
</Tabs>
```

---

## CSS Custom Classes

Defined in `src/index.css`:

| Class | Description |
|-------|-------------|
| `.btn-primary` | Gradient gold button with glow |
| `.btn-secondary` | Glass-effect secondary button |
| `.card` | Glass card with border gradient |
| `.card-hover` | Card with hover lift effect |
| `.input` | Styled input field |
| `.badge-glow` | Animated badge effect |
| `.stat-card` | Compact stat display |
| `.tab-trigger` | Custom tab styling |

---

## State Management

- **No Redux/Zustand** - Uses React state + props
- **Context:** `PythonContext` for Pyodide runtime
- **Custom Hooks:**
  - `useDayQuiz` - Quiz data fetching with refetch
  - `useDayMeta` - Day navigation helpers
  - `usePythonRunner` - Pyodide code execution

---

## Accessibility Notes

- All interactive elements have `tabIndex`
- Keyboard navigation supported in quiz
- Color contrast meets WCAG AA (verified)
- Error states have ARIA labels
