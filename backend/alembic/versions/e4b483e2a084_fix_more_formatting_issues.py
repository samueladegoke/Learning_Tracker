"""fix_more_formatting_issues

Revision ID: e4b483e2a084
Revises: f0cdda973598
Create Date: 2025-12-11 12:45:00.000000

"""
from typing import Sequence, Union

from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic.
revision: str = 'e4b483e2a084'
down_revision: Union[str, None] = 'f0cdda973598'
branch_labels: Union[str, Sequence[str], None] = None
depends_on: Union[str, Sequence[str], None] = None


def upgrade() -> None:
    # 138: Avoid escape sequence entirely
    op.execute("UPDATE questions SET text = 'What will print(\"Hello\" followed by newline then \"World\") output?' WHERE id = 138")
    
    # 288: Fix join syntax
    op.execute("UPDATE questions SET text = 'What does \"_\".join([''a'', ''_'', ''c'']) produce?' WHERE id = 288")
    
    # 292: Remove newline escape, use colon
    op.execute("UPDATE questions SET text = 'Check Membership: Return True if item exists in the list, False otherwise.' WHERE id = 292")
    
    # 293: Remove newline escape, use colon  
    op.execute("UPDATE questions SET text = 'Update Display: Given a word, a display list of blanks, and a guess, update the display to show the letter at correct positions.' WHERE id = 293")
    
    # 294: Remove newline escape, use colon
    op.execute("UPDATE questions SET text = 'Game Over Logic: Return True if lives are 0, False otherwise.' WHERE id = 294")
    
    # 295: Remove newline escape, use colon
    op.execute("UPDATE questions SET text = 'Check Win Condition: Return True if there are no underscores left in the display list.' WHERE id = 295")


def downgrade() -> None:
    # Revert to original text (with issues)
    op.execute("UPDATE questions SET text = 'What will print(\"Hello\\nWorld\") output?' WHERE id = 138")
    op.execute("UPDATE questions SET text = 'What does ''_''.join([''a'', ''_'', ''c'']) produce?' WHERE id = 288")
    op.execute("UPDATE questions SET text = 'Check Membership\nReturn True if item exists in the list, False otherwise.' WHERE id = 292")
    op.execute("UPDATE questions SET text = 'Update Display\nGiven a word, a display list of blanks, and a guess, update the display to show the letter at correct positions.' WHERE id = 293")
    op.execute("UPDATE questions SET text = 'Game Over Logic\nReturn True if lives are 0, False otherwise.' WHERE id = 294")
    op.execute("UPDATE questions SET text = 'Check Win Condition\nReturn True if there are no underscores left in the display list.' WHERE id = 295")
