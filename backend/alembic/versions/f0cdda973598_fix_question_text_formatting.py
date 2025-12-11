"""fix_question_text_formatting

Revision ID: f0cdda973598
Revises: 92e1d2bb20f1
Create Date: 2025-12-11 12:35:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'f0cdda973598'
down_revision: Union[str, None] = '92e1d2bb20f1'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # Fix formatting for Question 137
    # Original: What does \n do inside a string?
    # Target: What does the escape sequence backslash-n do inside a string?
    op.execute("UPDATE questions SET text = 'What does the escape sequence backslash-n do inside a string?' WHERE id = 137")
    
    # Fix formatting for Question 134
    # Original: What is the correct syntax for the print() function in Python?
    op.execute("UPDATE questions SET text = 'What is the correct syntax for the `print()` function in Python?' WHERE id = 134")
    
    # Fix formatting for Question 135
    # Original: What does the text inside the parentheses of a print() statement need to be wrapped in?
    op.execute("UPDATE questions SET text = 'What does the text inside the parentheses of a `print()` statement need to be wrapped in?' WHERE id = 135")
    
    # Fix formatting for Question 145
    # Original: What is the correct syntax to assign the value 'Angela' to a variable called name?
    op.execute("UPDATE questions SET text = 'What is the correct syntax to assign the value `''Angela''` to a variable called `name`?' WHERE id = 145")
    
    # Fix formatting for Question 151
    # Original: Why shouldn't you use 'print' or 'input' as variable names?
    op.execute("UPDATE questions SET text = 'Why shouldn''t you use `print` or `input` as variable names?' WHERE id = 151")


def downgrade() -> None:
    # Revert formatting for Question 137
    op.execute("UPDATE questions SET text = 'What does \\n do inside a string?' WHERE id = 137")
    
    # Revert formatting for Question 134
    op.execute("UPDATE questions SET text = 'What is the correct syntax for the print() function in Python?' WHERE id = 134")
    
    # Revert formatting for Question 135
    op.execute("UPDATE questions SET text = 'What does the text inside the parentheses of a print() statement need to be wrapped in?' WHERE id = 135")
    
    # Revert formatting for Question 145
    op.execute("UPDATE questions SET text = 'What is the correct syntax to assign the value ''Angela'' to a variable called name?' WHERE id = 145")
    
    # Revert formatting for Question 151
    op.execute("UPDATE questions SET text = 'Why shouldn''t you use ''print'' or ''input'' as variable names?' WHERE id = 151")
