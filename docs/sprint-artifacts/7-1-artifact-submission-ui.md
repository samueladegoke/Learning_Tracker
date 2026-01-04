# Story 7.1: Artifact Submission UI

As a **Learner**,
I want to submit proof of my work (screenshot, commit link, or reflection) when completing a task,
So that I can demonstrate my learning and earn bonus XP.

## Acceptance Criteria

- [ ] **Given** the user completes a quiz or challenge
- [ ] **When** they click "Complete Day"
- [ ] **Then** display an optional artifact submission modal with options:
  - Upload screenshot (PNG/JPG, max 5MB)
  - Paste GitHub commit URL
  - Write a short reflection (min 50 characters)
- [ ] **And** allow skipping artifact submission (reduced XP)
- [ ] **And** award +10 bonus XP for artifact submission

## Technical Notes
- Create `ArtifactSubmissionModal.jsx` component
- Use Supabase Storage for file uploads
- Create `user_artifacts` table with `user_id`, `day`, `type`, `content`
