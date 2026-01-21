"""add composite index to user_question_reviews

Revision ID: 3d19e7a78eff
Revises: d931537e2c7a
Create Date: 2025-12-19 16:10:35.841157

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '3d19e7a78eff'
down_revision: Union[str, None] = 'd931537e2c7a'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Add composite index for performance
    op.create_index('ix_user_question_reviews_user_due', 'user_question_reviews', ['user_id', 'due_date'], unique=False)


def downgrade() -> None:
    # Remove composite index
    op.drop_index('ix_user_question_reviews_user_due', table_name='user_question_reviews')
