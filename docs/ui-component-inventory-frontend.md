# Frontend UI Inventory
Generated: 2025-12-10

## Application Structure

### Pages (`src/pages`)
| Page | Route | Description |
| :--- | :--- | :--- |
| **Dashboard** | `/` | Main HUD. Shows Weeks, RPG stats, Active Quest. |
| **Planner** | `/planner` | Task scheduling and overview. |
| **Practice** | `/practice/*` | Coding exercises and Quizzes. |
| **Progress** | `/progress` | Stats, Badges, Achievements view. |
| **Calendar** | `/calendar` | Linear view of tasks/dates. |
| **Reflections** | `/reflections` | User journal entries. |

### Global Contexts (`src/contexts`)
- **PythonContext:** Manages `pyodide` runtime.
    - **Key Feature:** `executionMutex` to serialize Python execution.
    - **Exports:** `runPython(code)`, `isLoading`, `isReady`.

## Components (`src/components`)

### Navigation & Layout
- **Navbar:** Top navigation with "Pill" animation.

### Task Management
- **TaskCard:** Individual task item with Toggle Button.
- **WeekAccordion:** Collapsible list of tasks per week.

### RPG & Gamification
- **StatCard:** Displays XP, Streak, Hearts, Gold.
- **ProgressRing:** Circular progress visualization.
- **QuestLog:** Sidebar/Widget showing active Boss/Challenge.
- **ShopModal:** item purchasing interface.
- **BadgeCard:** Visual representation of earned badges.
- **CharacterCard:** Avatar/Character display.

### Utilities
- **CodeEditor:** Monaco-based editor for coding tasks.
- **CodeBlock:** Syntax highlighting display.
- **CurrentSyncStatus:** Offline/Sync state indicator.
