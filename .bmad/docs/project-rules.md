# Project Rules

This document outlines the custom Cursor rules (.mdc) enabling AI agents to work effectively with this specific project context.

## Active Rules

### 1. Udemy Content Synchronization
- **File**: `.cursor/rules/udemy-content-sync.mdc`
- **Purpose**: Enforces alignment between the implementation of "Days" and the source material from the Udemy course.
- **Workflow**:
  1.  **Audit**: Before implementing a Day, the agent MUST list the files in the corresponding `Udemy - ...` directory.
  2.  **Verify**: Keys terms, algorithms, and project requirements are extracted from the source (VTT/Code).
  3.  **Implement**: Content (Deep Dive, Transcripts, Quiz) is built matching the verify source.
- **Triggers**: Always active (`alwaysApply: true`), matching `frontend/src/components/content/**/*`, `Practice.jsx`, and seed scripts.

## Installation
These rules are located in `.cursor/rules/`. No extra installation is required; they are automatically loaded by Cursor.
