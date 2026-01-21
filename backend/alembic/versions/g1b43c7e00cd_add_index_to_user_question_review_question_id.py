"""add_index_to_user_question_review_question_id

Revision ID: g1b43c7e00cd
Revises: f0cdda973598
Create Date: 2025-12-25 22:00:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'g1b43c7e00cd'
down_revision: Union[str, None] = 'f0cdda973598'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Add index on question_id for faster lookups
    op.create_index(
        'ix_user_question_reviews_question_id',
        'user_question_reviews',
        ['question_id'],
        unique=False
    )


def downgrade() -> None:
    op.drop_index('ix_user_question_reviews_question_id', table_name='user_question_reviews')
