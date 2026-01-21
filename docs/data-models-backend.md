# Backend Data Models
Generated: 2025-12-10

## Core Entities

### User
- **Table:** `users`
- **Purpose:** Central entity tracking player progress.
- **Key Fields:** `id`, `username`, `xp`, `level`, `streak`, `gold`, `focus_points`, `hearts`.
- **Relationships:** One-to-many with Badges, Quests, Challenges, TaskStatuses, Reflections.

### Week
- **Table:** `weeks`
- **Purpose:** curriculum container.
- **Key Fields:** `week_number`, `title`, `focus`, `milestone`.
- **Relationships:** One-to-many with Tasks.

### Task
- **Table:** `tasks`
- **Purpose:** Unit of work/learning.
- **Key Fields:** `task_id` (string e.g. "w1-d1"), `week_id`, `type`, `xp_reward`, `difficulty`.
- **Relationships:** Many-to-one with Week. Joined to User via `user_task_statuses`.

## Gamification Entities

### UserTaskStatus
- **Table:** `user_task_statuses`
- **Purpose:** Tracks completion state of tasks per user.
- **Key Fields:** `completed`, `completed_at`.

### Quest & UserQuest
- **Tables:** `quests`, `user_quests`
- **Purpose:** Boss battles and multi-task goals.
- **Logic:** `UserQuest` tracks `boss_hp_remaining` and `completed_at`.

### Challenge & UserChallenge
- **Tables:** `challenges`, `user_challenges`
- **Purpose:** Time-bound or count-bound goals (e.g., "Complete 10 tasks").
- **Logic:** `UserChallenge` tracks `progress` vs `goal_count`.

### Badge & Achievement
- **Tables:** `badges`, `achievements`
- **Purpose:** Milestone rewards.
- **Storage:** `user_badges` and `user_achievements` link these to Users with `earned_at`.

### Inventory
- **Table:** `user_inventory`
- **Purpose:** Store RPG items (shields, cosmetics).
- **Key Fields:** `item_type`, `item_key`, `quantity`.

### Quiz
- **Tables:** `questions`, `quiz_results`
- **Purpose:** Practice content and scoring history.
