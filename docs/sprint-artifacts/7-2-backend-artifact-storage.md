# Story 7.2: Backend Artifact Storage

As a **System**,
I want to store and validate proof artifacts securely,
So that users can review their learning portfolio later.

## Acceptance Criteria

- [ ] **Given** a user submits an artifact
- [ ] **When** the `POST /api/artifacts` endpoint is called
- [ ] **Then** validate the artifact type and size
- [ ] **And** store metadata in `user_artifacts` table
- [ ] **And** upload files to Supabase Storage bucket `artifacts`
- [ ] **And** return the artifact ID and storage URL

## Technical Notes
- Create Alembic migration for `user_artifacts` table
- Implement file validation (type, size)
- Configure Supabase Storage policies for authenticated users
