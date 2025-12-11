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
    # 138: `print("Hello\nWorld")`
    op.execute("UPDATE questions SET text = 'What will `print(\"Hello\\nWorld\")` output?' WHERE id = 138")
    
    # 140: `print("Hello" + "Angela")`
    op.execute("UPDATE questions SET text = 'What will `print(\"Hello\" + \"Angela\")` output?' WHERE id = 140")
    
    # 142: `input()`
    op.execute("UPDATE questions SET text = 'What does the `input()` function do?' WHERE id = 142")
    
    # 143: `input()`
    op.execute("UPDATE questions SET text = 'What data type does `input()` always return?' WHERE id = 143")
    
    # 147: `len('Python')`
    op.execute("UPDATE questions SET text = 'What does `len(''Python'')` return?' WHERE id = 147")
    
    # 283: `import random`, `from random import choice`
    op.execute("UPDATE questions SET text = 'What is the difference between `import random` and `from random import choice`?' WHERE id = 283")
    
    # 285: `for i in range(len(word))`
    op.execute("UPDATE questions SET text = 'What does `for i in range(len(word))` allow you to do?' WHERE id = 285")
    
    # 287: `letter not in word`
    op.execute("UPDATE questions SET text = 'What does `letter not in word` check?' WHERE id = 287")
    
    # 288: `_` join
    op.execute("UPDATE questions SET text = 'What does `''_''``.join([''a'', ''_'', ''c''])` produce?' WHERE id = 288")
    
    # 291: list check
    op.execute("UPDATE questions SET text = 'How do you check if all blanks have been filled in `[''a'', ''p'', ''p'', ''l'', ''e'']`?' WHERE id = 291")
    
    # 292: True/False
    op.execute("UPDATE questions SET text = 'Check Membership\\nReturn `True` if item exists in the list, `False` otherwise.' WHERE id = 292")
    
    # 294: True/False
    op.execute("UPDATE questions SET text = 'Game Over Logic\\nReturn `True` if lives are 0, `False` otherwise.' WHERE id = 294")
    
    # 295: True
    op.execute("UPDATE questions SET text = 'Check Win Condition\\nReturn `True` if there are no underscores left in the display list.' WHERE id = 295")


def downgrade() -> None:
    # Revert all changes
    op.execute("UPDATE questions SET text = 'What will print(\"Hello\\nWorld\") output?' WHERE id = 138")
    op.execute("UPDATE questions SET text = 'What will print(\"Hello\" + \"Angela\") output?' WHERE id = 140")
    op.execute("UPDATE questions SET text = 'What does the input() function do?' WHERE id = 142")
    op.execute("UPDATE questions SET text = 'What data type does input() always return?' WHERE id = 143")
    op.execute("UPDATE questions SET text = 'What does len(''Python'') return?' WHERE id = 147")
    op.execute("UPDATE questions SET text = 'What is the difference between ''import random'' and ''from random import choice''?' WHERE id = 283")
    op.execute("UPDATE questions SET text = 'What does ''for i in range(len(word))'' allow you to do?' WHERE id = 285")
    op.execute("UPDATE questions SET text = 'What does ''letter not in word'' check?' WHERE id = 287")
    op.execute("UPDATE questions SET text = 'What does ''_''.join([''a'', ''_'', ''c'']) produce?' WHERE id = 288")
    op.execute("UPDATE questions SET text = 'How do you check if all blanks have been filled in [''a'', ''p'', ''p'', ''l'', ''e'']?' WHERE id = 291")
    op.execute("UPDATE questions SET text = 'Check Membership\\nReturn True if item exists in the list, False otherwise.' WHERE id = 292")
    op.execute("UPDATE questions SET text = 'Game Over Logic\\nReturn True if lives are 0, False otherwise.' WHERE id = 294")
    op.execute("UPDATE questions SET text = 'Check Win Condition\\nReturn True if there are no underscores left in the display list.' WHERE id = 295")
