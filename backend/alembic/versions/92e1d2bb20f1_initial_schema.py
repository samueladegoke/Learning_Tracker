"""initial_schema

Revision ID: 92e1d2bb20f1
Revises: 
Create Date: 2025-12-10 01:09:51.263845

Complete schema migration for Learning Tracker database.
Creates all tables matching the SQLAlchemy models.
"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '92e1d2bb20f1'
down_revision: Union[str, None] = None
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Users table
    op.create_table('users',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('username', sa.String(length=50), nullable=False),
        sa.Column('xp', sa.Integer(), nullable=True, server_default='0'),
        sa.Column('level', sa.Integer(), nullable=True, server_default='1'),
        sa.Column('streak', sa.Integer(), nullable=True, server_default='0'),
        sa.Column('best_streak', sa.Integer(), nullable=True, server_default='0'),
        sa.Column('gold', sa.Integer(), nullable=True, server_default='0'),
        sa.Column('focus_points', sa.Integer(), nullable=True, server_default='5'),
        sa.Column('focus_refreshed_at', sa.DateTime(), nullable=True),
        sa.Column('hearts', sa.Integer(), nullable=True, server_default='3'),
        sa.Column('last_heart_loss', sa.DateTime(), nullable=True),
        sa.Column('streak_freeze_count', sa.Integer(), nullable=True, server_default='0'),
        sa.Column('last_checkin_at', sa.DateTime(), nullable=True),
        sa.Column('current_week', sa.Integer(), nullable=True, server_default='1'),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('username')
    )
    op.create_index(op.f('ix_users_id'), 'users', ['id'], unique=False)

    # Weeks table
    op.create_table('weeks',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('week_number', sa.Integer(), nullable=False),
        sa.Column('title', sa.String(length=200), nullable=False),
        sa.Column('focus', sa.String(length=500), nullable=True),
        sa.Column('milestone', sa.String(length=500), nullable=True),
        sa.Column('checkin_prompt', sa.Text(), nullable=True),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('week_number')
    )
    op.create_index(op.f('ix_weeks_id'), 'weeks', ['id'], unique=False)

    # Tasks table
    op.create_table('tasks',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('task_id', sa.String(length=50), nullable=False),
        sa.Column('week_id', sa.Integer(), nullable=False),
        sa.Column('day', sa.String(length=20), nullable=False),
        sa.Column('description', sa.Text(), nullable=False),
        sa.Column('type', sa.String(length=50), nullable=True),
        sa.Column('xp_reward', sa.Integer(), nullable=True, server_default='10'),
        sa.Column('badge_reward', sa.String(length=50), nullable=True),
        sa.Column('difficulty', sa.String(length=20), nullable=True, server_default="'normal'"),
        sa.Column('category', sa.String(length=20), nullable=True, server_default="'weekly'"),
        sa.Column('due_date', sa.DateTime(), nullable=True),
        sa.Column('is_boss_task', sa.Boolean(), nullable=True, server_default='false'),
        sa.ForeignKeyConstraint(['week_id'], ['weeks.id'], ),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('task_id')
    )
    op.create_index(op.f('ix_tasks_id'), 'tasks', ['id'], unique=False)

    # User Task Statuses table
    op.create_table('user_task_statuses',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('task_id', sa.Integer(), nullable=False),
        sa.Column('completed', sa.Boolean(), nullable=True, server_default='false'),
        sa.Column('completed_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['task_id'], ['tasks.id'], ),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_user_task_statuses_id'), 'user_task_statuses', ['id'], unique=False)

    # Reflections table
    op.create_table('reflections',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('week_id', sa.Integer(), nullable=False),
        sa.Column('content', sa.Text(), nullable=False),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.Column('updated_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.ForeignKeyConstraint(['week_id'], ['weeks.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_reflections_id'), 'reflections', ['id'], unique=False)

    # Badges table
    op.create_table('badges',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('badge_id', sa.String(length=50), nullable=False),
        sa.Column('name', sa.String(length=100), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('xp_value', sa.Integer(), nullable=True, server_default='0'),
        sa.Column('difficulty', sa.String(length=20), nullable=True, server_default="'normal'"),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('badge_id')
    )
    op.create_index(op.f('ix_badges_id'), 'badges', ['id'], unique=False)

    # Achievements table
    op.create_table('achievements',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('achievement_id', sa.String(length=50), nullable=False),
        sa.Column('name', sa.String(length=120), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('xp_value', sa.Integer(), nullable=True, server_default='0'),
        sa.Column('difficulty', sa.String(length=20), nullable=True, server_default="'normal'"),
        sa.PrimaryKeyConstraint('id'),
        sa.UniqueConstraint('achievement_id')
    )
    op.create_index(op.f('ix_achievements_id'), 'achievements', ['id'], unique=False)

    # User Badges table
    op.create_table('user_badges',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('badge_id', sa.Integer(), nullable=False),
        sa.Column('earned_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['badge_id'], ['badges.id'], ),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_user_badges_id'), 'user_badges', ['id'], unique=False)

    # User Achievements table
    op.create_table('user_achievements',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('achievement_id', sa.Integer(), nullable=False),
        sa.Column('earned_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['achievement_id'], ['achievements.id'], ),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_user_achievements_id'), 'user_achievements', ['id'], unique=False)

    # Quests table
    op.create_table('quests',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(length=150), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('boss_hp', sa.Integer(), nullable=True, server_default='100'),
        sa.Column('reward_xp_bonus', sa.Integer(), nullable=True, server_default='0'),
        sa.Column('reward_badge_id', sa.String(length=50), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_quests_id'), 'quests', ['id'], unique=False)

    # Quest Tasks table
    op.create_table('quest_tasks',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('quest_id', sa.Integer(), nullable=False),
        sa.Column('task_id', sa.Integer(), nullable=False),
        sa.ForeignKeyConstraint(['quest_id'], ['quests.id'], ),
        sa.ForeignKeyConstraint(['task_id'], ['tasks.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_quest_tasks_id'), 'quest_tasks', ['id'], unique=False)

    # User Quests table
    op.create_table('user_quests',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('quest_id', sa.Integer(), nullable=False),
        sa.Column('boss_hp_remaining', sa.Integer(), nullable=True, server_default='0'),
        sa.Column('started_at', sa.DateTime(), nullable=True),
        sa.Column('completed_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['quest_id'], ['quests.id'], ),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_user_quests_id'), 'user_quests', ['id'], unique=False)

    # Challenges table
    op.create_table('challenges',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(length=150), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('goal_count', sa.Integer(), nullable=True, server_default='0'),
        sa.Column('ends_at', sa.DateTime(), nullable=True),
        sa.Column('reward_badge_id', sa.String(length=50), nullable=True),
        sa.Column('reward_item', sa.String(length=50), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_challenges_id'), 'challenges', ['id'], unique=False)

    # User Challenges table
    op.create_table('user_challenges',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('challenge_id', sa.Integer(), nullable=False),
        sa.Column('progress', sa.Integer(), nullable=True, server_default='0'),
        sa.Column('completed_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['challenge_id'], ['challenges.id'], ),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_user_challenges_id'), 'user_challenges', ['id'], unique=False)

    # User Inventory table
    op.create_table('user_inventory',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('item_type', sa.String(length=50), nullable=False),
        sa.Column('item_key', sa.String(length=100), nullable=False),
        sa.Column('quantity', sa.Integer(), nullable=True, server_default='0'),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_user_inventory_id'), 'user_inventory', ['id'], unique=False)

    # Quiz Results table
    op.create_table('quiz_results',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('quiz_id', sa.String(length=50), nullable=False),
        sa.Column('score', sa.Integer(), nullable=True, server_default='0'),
        sa.Column('total_questions', sa.Integer(), nullable=True, server_default='0'),
        sa.Column('completed_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_quiz_results_id'), 'quiz_results', ['id'], unique=False)

    # Questions table
    op.create_table('questions',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('quiz_id', sa.String(length=50), nullable=False),
        sa.Column('text', sa.Text(), nullable=False),
        sa.Column('options', sa.Text(), nullable=False),
        sa.Column('correct_index', sa.Integer(), nullable=False),
        sa.Column('explanation', sa.Text(), nullable=True),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_questions_id'), 'questions', ['id'], unique=False)
    op.create_index(op.f('ix_questions_quiz_id'), 'questions', ['quiz_id'], unique=False)


def downgrade() -> None:
    op.drop_table('questions')
    op.drop_table('quiz_results')
    op.drop_table('user_inventory')
    op.drop_table('user_challenges')
    op.drop_table('challenges')
    op.drop_table('user_quests')
    op.drop_table('quest_tasks')
    op.drop_table('quests')
    op.drop_table('user_achievements')
    op.drop_table('user_badges')
    op.drop_table('achievements')
    op.drop_table('badges')
    op.drop_table('reflections')
    op.drop_table('user_task_statuses')
    op.drop_table('tasks')
    op.drop_table('weeks')
    op.drop_table('users')
