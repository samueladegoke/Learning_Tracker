# FRONTEND KNOWLEDGE BASE

**Scope:** React 18 SPA with Vite, Tailwind CSS, Pyodide

## OVERVIEW

React SPA for gamified learning dashboard. Vite bundler, Tailwind styling, React Router v6, Framer Motion animations. Pyodide enables browser Python execution for coding challenges.

## STRUCTURE

```
frontend/
├── src/
│   ├── pages/            # Route components
│   ├── components/       # Reusable UI (40+ components)
│   ├── contexts/         # React Context providers
│   ├── api/              # API client + Supabase
│   ├── hooks/            # Custom React hooks
│   ├── lib/              # Utility libraries
│   ├── utils/            # Helper functions
│   ├── App.jsx           # Router + layout
│   └── main.jsx          # Entry point
├── e2e/                  # Playwright E2E tests
├── tests/                # Vitest unit tests
├── public/               # Static assets
└── dist/                 # Production build
```

## WHERE TO LOOK

| Task | Location |
|------|----------|
| Add new page | `src/pages/` + update `App.jsx` routes |
| Add component | `src/components/` |
| Auth state | `src/contexts/AuthContext.jsx` |
| Course data | `src/contexts/CourseContext.jsx` |
| Python runtime | `src/contexts/PythonContext.jsx` |
| API calls | `src/api/client.js` |
| Supabase client | `src/api/supabase.js` |
| Tailwind config | `tailwind.config.js` |

## CONVENTIONS

**Path Alias**: `@/` maps to `src/` - use for all imports.
```jsx
import { Button } from '@/components/ui/button'
```

**Component Naming**: PascalCase, `.jsx` extension.

**Styling**: Tailwind utility classes. Custom palette in config:
- Primary: yellow-400/500 (`#FACC15`, `#EAB308`)
- Accent: pink-500 (`#EC4899`)
- Surface: slate-800/900 (`#1E293B`, `#0F172A`)

**Context Pattern**: Wrap providers in App.jsx order matters.

**Animations**: Framer Motion for page transitions, micro-interactions.

## ANTI-PATTERNS

- **DO NOT** use inline styles - use Tailwind
- **DO NOT** fetch in components directly - use hooks or context
- **DO NOT** skip error boundaries around Pyodide components
- **DO NOT** hardcode API URLs - use env vars (`VITE_API_URL`)

## KEY COMPONENTS

| Component | Purpose |
|-----------|---------|
| `CodeEditor` | CodeMirror + Pyodide execution |
| `QuestLog` | RPG quest display |
| `CharacterCard` | User avatar + stats |
| `DailyReviewWidget` | Spaced repetition cards |
| `Confetti` | Celebration animations |
| `Navbar` | Navigation + user status |

## PYODIDE NOTES

- Requires Cross-Origin Isolation headers (configured)
- ~20MB WASM download on first load
- `PythonContext` manages singleton instance
- Wrap in `CodeEditorErrorBoundary` for graceful failures

## COMMANDS

```bash
npm run dev          # Dev server :5173
npm run build        # Production build
npm run preview      # Preview prod build

# Testing
npm test             # Vitest unit
npm run test:e2e     # Playwright headless
npm run test:e2e:ui  # Playwright UI mode
```
