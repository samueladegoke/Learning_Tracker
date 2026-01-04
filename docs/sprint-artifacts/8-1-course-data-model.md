# Story 8.1: Course Data Model

As an **Administrator**,
I want a flexible course data model that supports modules, days, and units,
So that the platform can host multiple courses.

## Acceptance Criteria

- [ ] **Given** the database is migrated
- [ ] **When** the admin creates a course
- [ ] **Then** the system supports this hierarchy:
  - Course (name, description, total_days)
    - Module (week/section, title, focus)
      - Day (number, title, description)
        - Unit (type: deep_dive|quiz|challenge, content)
- [ ] **And** existing "100 Days of Code" data is migrated to this structure

## Technical Notes
- Create Alembic migrations for `courses`, `modules`, `days`, `units` tables
- Write data migration script for existing content
- Update all existing routers to query by course_id
