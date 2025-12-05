# Frontend Guide

## Technology Stack
- **React 18.2** with Vite 5
- **TailwindCSS 3.4** for styling
- **Pyodide 0.26** for in-browser Python execution

---

## Page Components

### Dashboard (`Dashboard.jsx`)
Main hub displaying:
- RPG stats (XP bar, level, gold, HP)
- Quest log with active challenges
- Shop for purchasing items
- Boss battle status

### Calendar (`Calendar.jsx`)
- Heatmap-style task completion calendar
- Day-by-day task tracking
- Streak visualization

### Practice (`Practice.jsx`)
Per-day learning content with three tabs:
- **Deep Dive**: Concept explanations with `CodeBlock` examples
- **Quiz**: MCQ + coding challenges with Pyodide execution
- **Transcripts**: Collapsible lesson summaries

**Key Pattern - Day Routing:**
```jsx
const DAY_META = {
    'day-1': { label, title, quizId, topics },
    'day-2': { ... },
    'day-3': { ... }
}

function DeepDive({ activeDay }) {
    const components = { 'day-1': DeepDiveDay1, ... }
    const Component = components[activeDay]
    return Component ? <Component /> : <Fallback />
}
```

### Progress (`Progress.jsx`)
- Overall completion stats
- Achievement badges
- Weekly progress charts

### Planner (`Planner.jsx`)
- Task scheduling
- Goal setting

### Reflections (`Reflections.jsx`)
- Weekly reflection journal
- Notes and insights

---

## API Clients

### `client.js` - Backend API
```javascript
import { rpgAPI, tasksAPI, progressAPI, weeksAPI } from '../api/client'

// Usage
const state = await rpgAPI.getState()
await tasksAPI.complete(taskId)
```

### `quizApi.js` - Supabase Direct
```javascript
import { quizApi } from '../api/quizApi'

// Fetches from Supabase directly (RLS protected)
const questions = await quizApi.getQuizQuestions('day-3-practice')
```

---

## Components

| Component | Purpose |
|-----------|---------|
| `CodeBlock` | Syntax-highlighted code display |
| `CodeEditor` | Editable code with Pyodide execution |
| `QuestLog` | Active quest/challenge display |
| `XPBar` | Animated XP progress indicator |
| `ShopItem` | Purchasable item card |
| `BossBattle` | Boss HP and attack interface |

---

## Styling Conventions

### Color Tokens
```css
/* Surface colors (dark theme) */
--surface-100: /* lightest text */
--surface-400: /* secondary text */
--surface-700: /* borders */
--surface-800: /* card backgrounds */
--surface-900: /* deepest backgrounds */

/* Primary accent */
--primary-400: /* highlights */
--primary-600: /* buttons, active states */
```

### Common Patterns
```jsx
// Card pattern
<div className="bg-surface-800/30 rounded-xl border border-surface-700 p-6">

// Interactive button
<button className="bg-primary-600 hover:bg-primary-500 transition-colors">
```
