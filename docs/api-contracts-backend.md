# Backend API Contracts
Generated: 2025-12-10

## Base URL
`/api` (configured for Vercel rewriting)

## Router Modules

### Tasks (`/api/tasks`)
- `GET /{task_id}`: Retrieve task details and user status.
- `POST /{task_id}/complete`: Complete a task. Triggers:
    - XP/Gold award
    - Level up check
    - Quest boss damage
    - Challenge progress
    - Badge/Achievement unlocking
- `POST /{task_id}/uncomplete`: Revert task completion (removes rewards).

### Weeks (`/api/weeks`)
- `GET /`: List all weeks.
- `GET /{week_number}`: Get details for a specific week including task list.

### Progress (`/api/progress`)
- `GET /`: Get current user stats (XP, level, streak, completion %).

### RPG (`/api/rpg`)
- `GET /state`: Get full RPG state (Hearts, Inventory, Active Quest).
- `POST /shop/buy`: Purchase items with gold.

### Quizzes (`/api/quizzes`)
- `GET /{quiz_id}`: Get questions.
- `POST /{quiz_id}/submit`: Submit answers and get score.

### Reflections (`/api/reflections`)
- `GET /`: List user reflections.
- `POST /`: Submit a new weekly reflection.

## Patterns
- **Authentication:** Currently hardcoded to `DEFAULT_USER_ID = 1` for single-player MVP.
- **Response Format:** JSON (Pydantic models).
- **Error Handling:** Standard HTTP codes (404 Not Found, etc.).
