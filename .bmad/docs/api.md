# Backend API Reference

Base URL: `http://localhost:8000` (Development)

## Authentication
Currently, the API uses a hardcoded `DEFAULT_USER_ID = 1`. No authentication tokens are required for the current version.

## Common Error Responses

Most endpoints return standard HTTP error codes:

- `400 Bad Request`: Invalid input or logic error (e.g., negative XP, insufficient gold).
- `404 Not Found`: Resource (User, Task, Item) not found.
- `500 Internal Server Error`: Server-side processing error.

**Error Response Body:**
```json
{
  "detail": "Error message description"
}
```

## Endpoints

### Weeks
> Manage learning weeks and curriculum intervals.

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/weeks` | Get all weeks with task completion summary. |
| `GET` | `/weeks/{week_id}` | Get a specific week with all tasks and status. |
| `GET` | `/weeks/number/{week_number}` | Get a week by its sequential number (e.g., 1). |

### Tasks
> specific learning activities and their completion status.

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/tasks/{task_id}` | Get a specific task details by string ID (e.g., 'w1-d1'). |
| `POST` | `/tasks/{task_id}/complete` | Mark a task as completed. Returns RPG rewards (XP/Gold) and updates. |
| `POST` | `/tasks/{task_id}/uncomplete` | Mark a task as incomplete. Deducts previously awarded rewards. |

### Reflections
> User's weekly reflections and notes.

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/reflections` | Get all reflections for the default user. |
| `GET` | `/reflections/week/{week_id}` | Get reflection for a specific week. |
| `POST` | `/reflections` | Create or update a reflection. Body: `{"week_id": int, "content": str}`. |

### Progress
> User statistics and dashboard data.

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/progress` | Get overall stats (level, streak, badges count, completion %). |
| `GET` | `/progress/calendar` | Get heatmap data for task completions over the last 2 years. |

### RPG System
> Gamification logic including quests, challenges, and shop.

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/rpg/state` | Get consolidated RPG state (XP, Gold, Hearts, Active Quest, Challenges). |
| `POST` | `/rpg/award-xp` | Manually award XP (e.g., from frontend games). Query: `?amount={int}`. |
| `POST` | `/rpg/buy/{item_id}` | Buy an item from the shop. Items: `streak_freeze`, `potion_focus`, `heart_refill`. |

### Quizzes
> Interactive practice quizzes.

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/quizzes/{quiz_id}/questions` | Get questions for a quiz. Answers are hidden. |
| `POST` | `/quizzes/submit` | Submit quiz answers for grading and XP. Body: `QuizSubmission`. |

### Badges & Achievements
> Visual rewards for milestones.

| Method | Endpoint | Description |
| :--- | :--- | :--- |
| `GET` | `/badges` | Get all badges and their unlock status. |
| `GET` | `/achievements` | Get all achievements and their unlock status. |

## Data Models

### RPGState
```json
{
  "xp": 0,
  "level": 1,
  "next_level_xp": 100,
  "gold": 0,
  "streak": 0,
  "focus_points": 5,
  "focus_cap": 5,
  "active_quest": null,
  "hearts": 3,
  "streak_freeze_count": 0
}
```

### TaskCompletionResult
Contains comprehensive update deltas after completing a task:
- `xp_gained`, `gold_gained`: Amount added.
- `level_up`: Boolean indicating if user leveled up.
- `new_level`: Current level after update.
- `badges_unlocked`: List of badge IDs awarded.
- `achievements_unlocked`: List of achievement IDs awarded.
- `boss_damage`: Damage dealt to active boss (if any).
