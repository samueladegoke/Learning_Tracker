---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11]
inputDocuments: ['docs/project_context.md', '100_DAYS_OF_CODE_CURRICULUM.md', 'README.md', 'DEPLOYMENT_GUIDE.md', 'requirements.txt']
documentCounts:
  briefs: 1
  research: 0
  brainstorming: 0
  projectDocs: 3
hasProjectContext: true
workflowType: 'prd'
lastStep: 0
project_name: '100 Days of Code'
user_name: 'Sam'
date: '2025-12-10'
---

# Product Requirements Document - 100 Days of Code

**Author:** Sam
**Date:** 2025-12-10

## Executive Summary

**100 Days of Code: Learning Tracker** is a gamified, full-stack web application designed to bridge the gap between passive video watching and active skill acquisition for Dr. Angela Yu's Python Bootcamp. It solves the critical problem of **attrition in self-paced learning** by replacing the "feedback void" with a structured, interactive, and rewarding RPG-style environment.

This PRD serves a specific strategic purpose: **Architectural Hardening**. We are documenting the *existing* brownfield system (FastAPI/React) to establish a solid baseline for **scalability, standardization, and automated quality assurance**, enabling future expansion to multi-user support.

### What Makes This Special

**Curriculum-Coupled Gamification:** Unlike generic habit trackers, this application is context-aware. It understands that "Day 7" is "Hangman" and rewards the user not just for logging time, but for completing specific milestones.
**Identity Transformation:** By using RPG mechanics (XP, Levels, Class Badges), the application helps the user visualize their transition from "Novice" to "Professional Python Developer," turning daily grinding into a meaningful progression system.

## Project Classification

**Technical Type:** `web_app` (React SPA + FastAPI Backend)
**Domain:** `edtech` (Self-directed Learning / Gamification)
**Complexity:** `medium` (Complex state management, distinct from high-compliance domains)
**Project Context:** **Brownfield** - Hardening and Standardizing an existing MVP.

## Success Criteria

### User Success

*   **Day 3 Survival:** > 60% of users complete Day 3 (First hard logic milestone).
*   **Day 14 Habit:** > 40% of users reach Day 14 (Habit solidified).
*   **Identity Shift:** User completes "Hangman" (Day 7) and actively engages with the badge system (viewing/sharing), signifying a transition from "trying" to "being" a developer.

### Technical Success

*   **Perceived Latency < 100ms:** Implement **Optimistic UI** for all Task/XP interactions. Visual feedback must be instant (<100ms), masking any actual network latency.
*   **Zero Data Consistency Failures:**
    *   **Trust:** 100% Test Coverage on `sync logic` and `achievements.py`.
    *   **Resilience:** Automated "Safe Merge" strategy for client-server sort conflicts.
    *   **Stability:** No "User Reset" required during schema migrations.

### Business Success

*   **Project Completion Rate:** The primary KPI is moving users from "Watchers" (passive video consumers) to "Doers" (active project builders).
*   **Conversion:** Tracking Day 3 conversion as a leading indicator for long-term retention.

### Product Scope

#### MVP - Minimum Viable Product (Hardening)
*   **Core Loop Hardening:** Day 1-14 experience is bug-free and optimistic.
*   **Data Integrity:** Sync logic is robust and tested.
*   **Project Context Compliance:** All code adheres to standardized rules.

#### Growth Features (Post-MVP)
*   Multi-user support with authentication.
*   Social features (Leaderboards, "Party Mode" for study groups).
*   Mobile-optimized layout or native app.

#### Vision (Future)
*   A collaborative learning ecosystem where cohorts of students progress through the 100 Days together, sharing code and competing on efficiency, not just completion.

## User Journeys

### Journey 1: Alex - The "Day 7 Wall" (Primary User)
**Scenario:** Reaching the first significant difficulty spike (Hangman Logic).
**Pain:** Imposter syndrome, temptation to quit, staring at a blank editor.
**Solution:** Alex logs in and is greeted by a "Level 3 - Novice" badge. The "Practice" tab offers a low-stakes "Warm-up" quiz before the main project.
**Outcome:** Alex completes the hard task, hears the specific "Success Sound," and unlocks the "Logic Master" achievement. **Identity Reinforced.**

### Journey 2: Dan - The Seamless Upgrade (Technical User)
**Scenario:** Deploying a new feature (Leaderboards) that alters the Customer Table.
**Pain:** Fear of breaking production data (Data Loss Aversion).
**Solution:** Dan runs the deployment script. The system detects the schema change, snapshots the DB (Automated Backup), applies the Alembic migration, and verifies integrity.
**Outcome:** Zero downtime. "It just works." **Trust Reinforced.**

### Journey Requirements Summary
1.  **Warm-up/Practice Mode:** Low-stakes engagement loops to bridge skill gaps.
2.  **Contextual History:** Showing past wins on the dashboard to combat imposter syndrome.
3.  **Migration Safety:** Automated DB backup/verify hooks (Hardening Requirement).

## Innovation & Novel Patterns

### 1. Local-First Architecture (The "Code Anywhere" Engine)
**The Innovation:** Verified PWA + Pyodide (WASM) runtime.
**Differentiator:** **Offline-Ready Coding**. Enables "Commuter Learning" – users can solve logic puzzles without an internet connection. Competitors require active socket connections.

### 2. Zero-Liability Sandbox (Security)
**The Innovation:** Client-side execution model.
**Differentiator:** Unrestricted Python use (e.g., `turtle` graphics, infinite loops) without risking platform stability. We don't need to ban `import os` because it's *their* OS.

### 3. The Pedagogical Compiler (Feedback)
**The Innovation:** Runtime context injection.
**Differentiator:** The system injects hidden "Unit Tests" into the user's local scope. Feedback is instant (<10ms) and specific ("Your variable `x` is wrong"), reinforcing the "Tight Loop" of learning.

## Web App Specific Requirements

### Project-Type Overview
**100 Days of Code** is a **Progressive Web App (PWA)** that leverages **Client-Side Execution (Pyodide)** to deliver a zero-latency coding experience. Unlike traditional web apps that rely on server round-trips for logic, this application behaves more like a local IDE, pushing compute to the edge (the user's browser).

### Technical Architecture Considerations

#### 1. Local-First State Persistence (Anti-Frustration)
*   **Strategy:** "Local-First, Server-Second." User progress is saved immediately to `localStorage` (debounced 200ms) before attempting async background sync to the backend.
*   **Safety:** "Draft Saved" indicators must be visible. If network fails, data remains local and syncs on reconnection.

#### 2. Performance: "Time-to-Code"
*   **Metric:** Dashboard Interactive < 0.8s (LCP). Editor Ready < 2.0s.
*   **Code Splitting:** Pyodide runtime (~30MB) must be lazy-loaded via a Web Worker only when the user enters the "Editor" route, keeping the landing/dashboard lightweight.
*   **Mobile Constraint:** Phone interface restricts complex coding to "View Only" or "Review" modes due to screen real estate and memory constraints.

### Implementation Considerations

#### Environment Reproducibility
*   **Versioning:** Frontend configuration must strictly pin the `pyodide` SDK version and `micropip` package versions to ensure consistent execution behavior across updates.

#### Accessibility & SEO
*   **Editor Trap:** Monaco Editor must have a clearly labeled `Ctrl+M` escape hatch for keyboard navigation.
*   **Hybrid Routing:** Public pages (Curriculum, Landing) must be statically indexable or standard React routes (not hidden behind auth) to ensure SEO visibility.

## Project Scoping & Phased Development

### MVP Strategy & Philosophy

**MVP Approach:** **Hash-Based Hardening (The "Solo" MVP)**
We are prioritizing **Depth over Breadth**. Instead of adding half-baked multi-user features, we are hardening the single-player experience to be indistinguishable from a native app.
**Philosophy:** "If it breaks for one user, it breaks for a million. Fix the one first."

### MVP Feature Set (Phase 1: Hardening)

**Core User Journeys Supported:**
1.  **Alex (The Learner):** Seamless Day 1-14 progression without data loss.
2.  **Dan (The Maintainer):** Safe deployment of schema changes.

**Must-Have Capabilities:**
*   **Local Persistence:** Robust `localStorage` sync.
*   **Optimistic UI:** Instant feedback on all interactions.
*   **Environment Safety:** Pinned Pyodide versions.
*   **Curriculum-Native Logic:** Day specific logic (Hangman, Higher/Lower) fully implemented and tested.

### Post-MVP Roadmap

**Phase 2: The Multi-User Layer**
*   Supabase Authentication (Email/Magic Link).
*   Cloud Sync (Backup local state to DB).
*   Public Profiles (ReadOnly view of other users).

**Phase 3: The Social Ecosystem**
*   Leaderboards (Global & Cohort based).
*   "Party Mode" (Real-time multiplayer coding).
*   Mobile Native Wrapper (Capacitor/React Native).

### Risk Mitigation Strategy

**Technical Risks:**
*   **Risk:** Pyodide memory leaks on mobile.
*   **Mitigation:** "View Only" mode fallback for mobile devices.

**Market Risks:**
*   **Risk:** Users churn before Day 3.
*   **Mitigation:** "Optimistic UI" ensures the first few interactions feel incredibly fast and rewarding.

**Resource Risks:**
*   **Risk:** Burnout from scope creep.
*   **Mitigation:** Ruthless cutting of non-hardening features (Auth, Social) from Phase 1.

## Functional Requirements

### 1. The Learning Engine (Core Loop)
*   **FR1 (Content Access):** Users can access all Daily Content (Videos, Transcripts, Quizzes) without explicit login (System uses implicit `DEFAULT_USER_ID`).
*   **FR2 (Completion Tracking):** Users can mark a Day or specific Task as "Completed".
*   **FR3 (Streak Logic):** The System calculates "Current Streak" based on consecutive days with >0 completed tasks, resetting after 48h inactivity.
*   **FR4 (Progress Persistence):** The System persists completion status to both `localStorage` (Immediate) and Backend Database (Async).

### 2. The Runtime (Pyodide Execution)
*   **FR5 (Client-Side Execution):** Users can execute Python code within the browser context using Pyodide (WASM).
*   **FR6 (Standard Library):** The Runtime supports Python Standard Library modules (e.g., `math`, `random`, `datetime`).
*   **FR7 (Execution Isolation):** The System executes user code in a Web Worker to prevent UI thread blocking.
*   **FR8 (Timeout Protection):** The System terminates execution if it exceeds 10 seconds (infinite loop protection).
*   **FR9 (Output Capture):** The System captures `stdout` and `stderr` from the ephemeral runtime and displays it in the Console Component.

### 3. Data Resilience (Local-First Sync)
*   **FR10 (Offline Save):** The System saves all user progress to `localStorage` regardless of network status.
*   **FR11 (State Restoration):** On application load, the System hydrates the Dashboard state from `localStorage` first (Optimistic UI).
*   **FR12 (Conflict Resolution):** If Backend and Local states differ, the System prefers the state with the most recent timestamp (Last Write Wins).

### 4. System Integrity (Hardening)
*   **FR13 (Migration Safety):** The Backend can apply schema migrations (Alembic) without data loss or downtime for the Default User.
*   **FR14 (Environment Verification):** The Frontend validates that the loaded `pyodide` version matches the configuration before allowing code execution.

## Non-Functional Requirements

### Performance (The "Native Feel")
*   **NFR1 (Dashboard Load):** The Dashboard must be interactive (TTI) within **1.0 second** on 4G networks (using Optimistic UI). Constraint: Main Bundle < **150KB gzipped**.
*   **NFR2 (Code Runtime):** The Pyodide runtime must initialize within **3.0 seconds** on first load, and **<1.0 second** on subsequent loads (Service Worker Cache).
*   **NFR3 (Input Latency):** Typing in the standard inputs must have <50ms latency (no blocking JS).

### Reliability (Data Durability)
*   **NFR4 (Offline Persistence):** 100% of progress data must be saved to `localStorage` before any network request is attempted.
*   **NFR5 (Sync Latency):** Local data syncs to Backend DB within **60s** of connection restoration.
*   **NFR6 (Crash Resilience):** UI thread never freezes > **200ms** (Execution isolation).

### Accessibility (Inclusive Design)
*   **NFR7 (Keyboard):** Full Tab navigation + `Ctrl+M` Editor Escape.
*   **NFR8 (Contrast):** Text contrast must meet WCAG AA standards (4.5:1).
