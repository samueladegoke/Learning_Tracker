"""Add Phase 2 infrastructure: is_admin, Course, UserArtifact, curriculum_day

Revision ID: h2026010401_phase2_infrastructure
Revises: g1b43c7e00cd_add_index_to_user_question_review_question_id
Create Date: 2026-01-04 19:46:00.000000

"""
from alembic import op
import sqlalchemy as sa


# revision identifiers, used by Alembic
revision = 'h2026010401_phase2_infrastructure'
down_revision = 'g1b43c7e00cd_add_index_to_user_question_review_question_id'
branch_labels = None
depends_on = None


def upgrade():
    # 1. Add is_admin to users table
    op.add_column('users', sa.Column('is_admin', sa.Boolean(), nullable=True, server_default='false'))
    
    # 2. Add curriculum_day to tasks table (1-100 for "100 Days of Code")
    op.add_column('tasks', sa.Column('curriculum_day', sa.Integer(), nullable=True))
    
    # 3. Create courses table
    op.create_table(
        'courses',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('name', sa.String(200), nullable=False),
        sa.Column('description', sa.Text(), nullable=True),
        sa.Column('total_days', sa.Integer(), nullable=False, server_default='100'),
        sa.Column('is_active', sa.Boolean(), nullable=False, server_default='true'),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.Column('updated_at', sa.DateTime(), nullable=True, onupdate=sa.func.now()),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_courses_name', 'courses', ['name'], unique=True)
    
    # 4. Add active_course_id to users table (with FK constraint)
    op.add_column('users', sa.Column('active_course_id', sa.Integer(), nullable=True))
    op.create_foreign_key(
        'fk_users_active_course_id',
        'users', 'courses',
        ['active_course_id'], ['id']
    )
    
    # 5. Create user_artifacts table for proof of work
    op.create_table(
        'user_artifacts',
        sa.Column('id', sa.Integer(), nullable=False),
        sa.Column('user_id', sa.Integer(), nullable=False),
        sa.Column('day', sa.Integer(), nullable=False),
        sa.Column('artifact_type', sa.String(20), nullable=False),  # 'image', 'url', 'reflection'
        sa.Column('content', sa.Text(), nullable=True),  # URL, reflection text, or storage path
        sa.Column('storage_path', sa.String(500), nullable=True),  # Supabase Storage path for images
        sa.Column('xp_bonus', sa.Integer(), nullable=False, server_default='10'),
        sa.Column('created_at', sa.DateTime(), nullable=False, server_default=sa.func.now()),
        sa.ForeignKeyConstraint(['user_id'], ['users.id'], ondelete='CASCADE'),
        sa.PrimaryKeyConstraint('id')
    )
    op.create_index('ix_user_artifacts_user_id', 'user_artifacts', ['user_id'])
    op.create_index('ix_user_artifacts_user_day', 'user_artifacts', ['user_id', 'day'])
    
    # 6. Seed default course "100 Days of Code" (idempotent - skip if exists)
    op.execute("""
        INSERT INTO courses (name, description, total_days, is_active)
        SELECT '100 Days of Code', 'Complete Python Bootcamp by Dr. Angela Yu', 100, true
        WHERE NOT EXISTS (SELECT 1 FROM courses WHERE name = '100 Days of Code')
    """)
    
    # 7. Set all existing users to default course
    op.execute("UPDATE users SET active_course_id = 1 WHERE active_course_id IS NULL")


def downgrade():
    # Remove user artifacts table
    op.drop_index('ix_user_artifacts_user_day', 'user_artifacts')
    op.drop_index('ix_user_artifacts_user_id', 'user_artifacts')
    op.drop_table('user_artifacts')
    
    # Remove active_course_id from users
    op.drop_column('users', 'active_course_id')
    
    # Remove courses table
    op.drop_index('ix_courses_name', 'courses')
    op.drop_table('courses')
    
    # Remove curriculum_day from tasks
    op.drop_column('tasks', 'curriculum_day')
    
    # Remove is_admin from users
    op.drop_column('users', 'is_admin')
