# Story 8.2: Course Admin CRUD API

As an **Administrator**,
I want API endpoints to create, read, update, and delete courses,
So that I can manage course content programmatically.

## Acceptance Criteria

- [ ] **Given** the admin is authenticated with admin role
- [ ] **When** they call course management endpoints
- [ ] **Then** support the following operations:
  - `POST /api/admin/courses` - Create course
  - `GET /api/admin/courses` - List all courses
  - `GET /api/admin/courses/{id}` - Get course with modules/days/units
  - `PUT /api/admin/courses/{id}` - Update course metadata
  - `DELETE /api/admin/courses/{id}` - Soft delete course
- [ ] **And** validate admin JWT claims before allowing mutations

## Technical Notes
- Create `app/routers/admin/courses.py` with CRUD operations
- Implement role-based access control (RBAC) middleware
- Add `is_admin` flag to User model
