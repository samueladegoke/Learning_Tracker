"""Add coding challenge fields to questions

Revision ID: 8682cacee66d
Revises: a3c2581f194d
Create Date: 2025-12-16 18:18:07.917764

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = '8682cacee66d'
down_revision: Union[str, None] = 'a3c2581f194d'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Use batch_alter_table for SQLite compatibility
    with op.batch_alter_table('questions', schema=None) as batch_op:
        batch_op.add_column(sa.Column('code', sa.Text(), nullable=True))
        batch_op.add_column(sa.Column('starter_code', sa.Text(), nullable=True))
        batch_op.add_column(sa.Column('test_cases', sa.Text(), nullable=True))
        batch_op.add_column(sa.Column('solution_code', sa.Text(), nullable=True))
        batch_op.add_column(sa.Column('difficulty', sa.String(length=20), nullable=True))
        batch_op.add_column(sa.Column('topic_tag', sa.String(length=100), nullable=True))
        batch_op.add_column(sa.Column('explanation', sa.Text(), nullable=True))


def downgrade() -> None:
    with op.batch_alter_table('questions', schema=None) as batch_op:
        batch_op.drop_column('explanation')
        batch_op.drop_column('topic_tag')
        batch_op.drop_column('difficulty')
        batch_op.drop_column('solution_code')
        batch_op.drop_column('test_cases')
        batch_op.drop_column('starter_code')
        batch_op.drop_column('code')
