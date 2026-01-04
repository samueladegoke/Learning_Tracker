# Story 8.3: Course Import from JSON/YAML

As an **Administrator**,
I want to import a course outline from a structured file,
So that I can quickly create courses without manual data entry.

## Acceptance Criteria

- [ ] **Given** the admin uploads a JSON or YAML file via admin interface
- [ ] **When** the import endpoint processes the file
- [ ] **Then** validate the structure matches expected schema:
  ```yaml
  name: "My Course"
  description: "Course description"
  modules:
    - title: "Week 1"
      focus: "Basics"
      days:
        - number: 1
          title: "Introduction"
          units:
            - type: "deep_dive"
              content: "Markdown content..."
  ```
- [ ] **And** report validation errors before import
- [ ] **And** create all records transactionally (all-or-nothing)
- [ ] **And** return created course ID on success

## Technical Notes
- Create `POST /api/admin/courses/import` endpoint
- Implement JSON Schema or Pydantic validation
- Use SQLAlchemy nested transactions
