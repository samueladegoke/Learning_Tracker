"""add_user_question_review_table

Revision ID: d931537e2c7a
Revises: 8682cacee66d
Create Date: 2025-12-19 15:10:27.000623

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'd931537e2c7a'
down_revision: Union[str, None] = '8682cacee66d'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Create user_question_reviews table for SRS tracking
    op.create_table('user_question_reviews',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('question_id', sa.Integer(), nullable=False),
        sa.Column('interval_index', sa.Integer(), nullable=True, default=0),
        sa.Column('due_date', sa.DateTime(), nullable=False),
        sa.Column('success_count', sa.Integer(), nullable=True, default=0),
        sa.Column('is_mastered', sa.Boolean(), nullable=True, default=False),
        sa.Column('last_reviewed_at', sa.DateTime(), nullable=True),
        sa.Column('created_at', sa.DateTime(), nullable=True),
        sa.ForeignKeyConstraint(['question_id'], ['questions.id'], ),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index(op.f('ix_user_question_reviews_id'), 'user_question_reviews', ['id'], unique=False)
    op.create_index(op.f('ix_user_question_reviews_user_id'), 'user_question_reviews', ['user_id'], unique=False)
    op.create_index(op.f('ix_user_question_reviews_due_date'), 'user_question_reviews', ['due_date'], unique=False)


def downgrade() -> None:
    op.drop_index(op.f('ix_user_question_reviews_due_date'), table_name='user_question_reviews')
    op.drop_index(op.f('ix_user_question_reviews_user_id'), table_name='user_question_reviews')
    op.drop_index(op.f('ix_user_question_reviews_id'), table_name='user_question_reviews')
    op.drop_table('user_question_reviews')
