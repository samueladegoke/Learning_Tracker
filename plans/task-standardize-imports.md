# Task: Standardize Frontend Import Styles

## Context
During the code review (see [`plans/code-review-improvement-plan.md`](plans/code-review-improvement-plan.md)), we identified 127 files with inconsistent import styles. Some use relative imports (`../components/...`) while others use path aliases (`@/components/...`).

## Goal
Standardize all frontend imports to use the `@/` path alias for consistency and maintainability.

## Current State
The project has a jsconfig.json configured with the `@/` alias pointing to `src/`. However, imports are mixed:

```jsx
// Inconsistent examples found:
import { useAuth } from '../contexts/AuthContext'  // relative
import { Card } from '@/components/ui/card'         // alias
import { api } from "../../convex/_generated/api"   // relative (convex)
```

## Rules to Apply

1. **All `src/` imports should use `@/` alias:**
   - `../components/X` → `@/components/X`
   - `../contexts/X` → `@/contexts/X`
   - `../utils/X` → `@/utils/X`
   - `../data/X` → `@/data/X`
   - `../hooks/X` → `@/hooks/X`
   - `../pages/X` → `@/pages/X`

2. **Convex imports remain relative:**
   - `../../convex/_generated/api` - keep as is (outside src/)
   - `../../../convex/_generated/api` - keep as is (outside src/)

3. **External packages remain unchanged:**
   - `import { useState } from 'react'`
   - `import { motion } from 'framer-motion'`

## Files to Update

Based on the search, these file categories need updates:

### Pages (7 files)
- `frontend/src/pages/WorldMap.jsx`
- `frontend/src/pages/Reflections.jsx`
- `frontend/src/pages/Progress.jsx`
- `frontend/src/pages/Practice.jsx`
- `frontend/src/pages/Planner.jsx`
- `frontend/src/pages/Login.jsx`
- `frontend/src/pages/Dashboard.jsx`
- `frontend/src/pages/Calendar.jsx`

### Components (many files)
- `frontend/src/components/Navbar.jsx`
- `frontend/src/components/ProtectedRoute.jsx`
- `frontend/src/components/ShopModal.jsx`
- `frontend/src/components/QuizHistory.jsx`
- `frontend/src/components/CharacterCard.jsx`
- `frontend/src/components/CodeEditor.jsx`
- `frontend/src/components/DailyReviewWidget.jsx`
- `frontend/src/components/SkillTree/SkillTree.jsx`
- `frontend/src/components/practice/DaySelector.jsx`
- `frontend/src/components/practice/Quiz.jsx`
- `frontend/src/components/Quiz/Quiz.jsx`
- `frontend/src/components/Quiz/QuestionRenderer.jsx`
- `frontend/src/components/Quiz/QuizResult.jsx`
- `frontend/src/components/content/DeepDive/*.jsx` (100 files)

### Contexts (1 file)
- `frontend/src/contexts/CourseContext.jsx`

## Approach

### Option A: Automated Script (Recommended)
Create a codemod script to automatically transform imports:

```bash
# Example using sed or a Node script
# This would transform all relative imports to alias imports
```

### Option B: Manual Updates
Update each file manually, starting with the most frequently imported files.

### Option C: ESLint Auto-fix
Add an ESLint rule to enforce import style and run `eslint --fix`:

```js
// .eslintrc.js
module.exports = {
  rules: {
    'no-restricted-imports': ['error', {
      patterns: [{
        group: ['../../*'],
        message: 'Use @/ alias for imports from src/'
      }]
    }]
  }
}
```

## Verification

After changes, run:
1. `npm run build` - Ensure no build errors
2. `npm test` - Ensure tests pass
3. `npm run dev` - Manual smoke test

## Estimated Effort
- **Automated**: 30 minutes (script creation + verification)
- **Manual**: 2-3 hours (127 files × ~1 minute each)

## Priority
Medium - This is a code quality improvement that doesn't affect functionality but improves maintainability.

## Related
- [`plans/code-review-improvement-plan.md`](plans/code-review-improvement-plan.md) - Full improvement plan
- [`frontend/jsconfig.json`](frontend/jsconfig.json) - Path alias configuration
