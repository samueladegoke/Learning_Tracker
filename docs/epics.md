---
stepsCompleted: [1, 2, 3, 4]
inputDocuments: ['docs/prd.md', 'docs/project_context.md', 'README.md']
---

# Epics and Stories: 100 Days of Code (Hardening Phase)

## 1. Extracted Requirements

### Functional Requirements
FR1: Users can load Daily Content (Video, Text, Quiz) without authentication.
FR2: Users can mark a Day or specific Task as "Completed" (persisted locally).
FR3: Users can view their "Streak" based on consecutive days completed.
FR4: Users can execute Python code in-browser via Pyodide (WASM).
FR5: Users receive "Instant Feedback" (<100ms) on syntax errors.
FR6: The System isolates user code (Web Worker) to prevent UI freezing.
FR7: The System saves all interaction state to `localStorage` immediately (Debounced).
FR8: The System restores the last known state upon page reload (even if offline).
FR9: The System attempts to sync with the backend *only* when network is available.
FR10: Administrators can deploy schema migrations without resetting user progress.
FR11: The Frontend validates that the loaded `pyodide` version matches the configuration before allowing code execution.
FR12: The System resolves data sync conflicts by preferring the state with the most recent timestamp (Last Write Wins).
FR13: The System loads runtime configuration (Pyodide URL, Package List) from a static JSON file to ensure reproducibility.
FR14: The System awards XP to the Default User profile immediately upon Task Completion.

### Non-Functional Requirements
NFR1: Dashboard TTI < 1.0s on 4G.
NFR2: Pyodide Init < 3.0s (Cold), < 1.0s (Warm).
NFR3: Typing latency < 50ms.
NFR4: 100% data saved locally before network req.
NFR5: Sync to backend within 60s of connection.
NFR6: UI never freezes > 200ms.
NFR7: Full Tab navigation + `Ctrl+M` Editor Escape.
NFR8: WCAG AA Contrast.

### Additional Requirements
- **Local-First Architecture:** The application must function primarily as a PWA, with the backend serving as a backup/sync target.
- **Environment Pinning:** Frontend must strictly define `pyodide` and package versions.
- **Optimistic UI:** All interactions (Tick box, Run code) must reflect instantly in UI.

## 2. Requirements Coverage Map

### FR Coverage Map

FR1: Epic 1 - Core content loading loop.
FR2: Epic 1 - Progress tracking persistence.
FR3: Epic 1 - Streak calculation logic.
FR4: Epic 2 - Pyodide execution environment.
FR5: Epic 2 - Syntax error feedback loop.
FR6: Epic 2 - Web Worker isolation.
FR7: Epic 1 - State persistence strategy.
FR8: Epic 1 - State restoration on load.
FR9: Epic 3 - Background sync logic.
FR10: Epic 4 - Schema migration safety.
FR11: Epic 2 - Runtime version control.
FR12: Epic 3 - Conflict resolution strategy.
FR13: Epic 2 - Runtime configuration loading.
FR14: Epic 1 - Gamification logic.

## 3. Epics

### Epic 1: The Resilient Learning Core (Offline-First) — `[PHASE 2 - DEFERRED]`

> 🚧 **STATUS: NOT IMPLEMENTED.** Current MVP uses Server-First architecture. See `architecture.md` for details.

**Goal:** Enable users to seamlessly access content, track completions, and earn XP with zero latency, regardless of network status.
**Value:** Users trust the app to never lose their progress or block them from learning due to bad internet.
**FRs covered:** FR1, FR2, FR3, FR7, FR8, FR14
### Story 1.1: Local Persistence Layer
As a User,
I want my progress to be saved immediately to my device,
So that I never lose work even if I accidentally close the tab or lose internet.

**Acceptance Criteria:**
**Given** the user checks a "Task Completed" box
**When** the click event fires
**Then** the application states must be updated in Redux/State
**And** the state must be written to `localStorage` within 200ms
**And** a "Saving..." indicator should NOT be shown (Optimistic UI)

### Story 1.2: Offline Content Access
As a Commuter,
I want to load the "Day 1" curriculum without a network connection,
So that I can learn on the train.

**Acceptance Criteria:**
**Given** the user is offline
**When** they navigate to `/day/1`
**Then** the text content and static assets must load from the Service Worker cache or local bundle
**And** the "Video" component should show a graceful "Offline" placeholder if not cached

### Story 1.3: Streak & XP Calculation Logic
As a Learner,
I want to see my Streak and XP go up immediately when I finish a task,
So that I feel verified and rewarded instantly.

**Acceptance Criteria:**
**Given** the user completes the final task of a Day
**When** the checkbox is clicked
**Then** the "Streak" counter increment logic must run locally
**And** the "XP" balance must increase by the designated amount immediately
**And** a confetti or sound effect must play (Optimistic Feedback)

### Story 1.4: State Restoration Boot Sequence
As a User,
I want the app to remember exactly where I left off when I reload,
So that I don't have to find my place again.

**Acceptance Criteria:**
**Given** a fresh page load (F5)
**When** the app initializes
**Then** it must hydrate the Redux store from `localStorage`
**And** if `lastVisitedUrl` exists, redirect the user there
**And** show the correct "Completed" state for all checkboxes

### Epic 2: The Browser Runtime (Pyodide Hardening) — `[PARTIALLY IMPLEMENTED]`

> 🟡 **STATUS: PARTIALLY IMPLEMENTED.** Pyodide execution works but runs on main thread (no Web Worker isolation). Runtime version pinning not enforced via config file.

**Goal:** Provide a stable, safe, and reproducible Python execution environment in the browser.
**Value:** Users get a "Real Python" experience that doesn't crash their tab or behave inconsistently across sessions.
**FRs covered:** FR4, FR5, FR6, FR11, FR13
### Story 2.1: Web Worker Infrastructure
As a Frontend Developer (representing User Stability),
I want the Python runtime to live in a dedicated Web Worker,
So that heavy calculations or infinite loops never freeze the main UI thread.

**Acceptance Criteria:**
**Given** the application loads
**When** the `usePyodide` hook initializes
**Then** it must spawn a `pyodide.worker.js` file
**And** communication must happen strictly via `postMessage` (Async)
**And** the main thread must remain responsive (60fps) even while Python calculates `99999**99999`
**And** the worker can be forcibly terminated and restarted if it becomes unresponsive (>5s timeout)

### Story 2.2: Runtime Version Pinning
As an Administrator,
I want to strictly control which version of Pyodide and packages are loaded via a config file,
So that all students have the exact same environment and no "it works on my machine" bugs occur.

**Acceptance Criteria:**
**Given** the Web Worker initializes
**When** it requests the Pyodide URL
**Then** it must fetch `runtime_config.json` first
**And** use the `pyodide_url` and `packages` list defined there
**And** if the config is missing or malformed, it should fail gracefully with a user-facing error

### Story 2.3: Safe Code Execution & Output Capture
As a Student,
I want to see the output of my `print()` statements immediately,
So that I can debug my code.

**Acceptance Criteria:**
**Given** the user types `print("Hello")` and clicks "Run"
**When** the message is sent to the worker
**Then** the worker must capture `stdout` and `stderr`
**And** stream it back to the main thread via `postMessage`
**And** the UI must display it in the Console component

### Story 2.4: Instant Syntax Feedback
As a Learner,
I want to know if I missed a colon before I try to run the code,
So that I can learn Python syntax faster.

**Acceptance Criteria:**
**Given** the user is typing in the CodeMirror editor
**When** they stop typing for 500ms (Debounce)
**Then** the code should be statically analyzed (e.g., via `pyflakes` or Pyodide syntax check)
**And** red squiggles should appear under syntax errors
**And** no execution context should be created (Static check only)

### Epic 3: Cloud Synchronization & Resilience — `[PHASE 2 - DEFERRED]`

> 🚧 **STATUS: NOT IMPLEMENTED.** Current MVP uses direct API calls without background sync or conflict resolution.

**Goal:** Securely backup local progress to the cloud without interrupting the user's flow.
**Value:** Users have peace of mind that their hard work is backed up, without the app feeling "sluggish" or dependent on the server.
**FRs covered:** FR9, FR12
### Story 3.1: Background Sync Loop
As a User,
I want my progress to back up to the cloud automatically when I have internet,
So that I can eventually switch devices without losing data.

**Acceptance Criteria:**
**Given** the user is online
**When** the "Internet Connection" event allows (navigator.onLine)
**Then** the app should check if there are unsynced changes in `localStorage`
**And** push them to the Supabase backend
**And** update the local state "Synced" timestamp
**And** retry with exponential backoff if the request fails

### Story 3.2: Last-Write-Wins Conflict Resolution
As a User,
I want the app to handle conflicts nicely if I used another device,
So that I don't get confused by "merge conflict" errors.

**Acceptance Criteria:**
**Given** a sync occurs where backend data differs from local data
**When** the timestamps are compared
**Then** the record with the newer `updated_at` timestamp should overwrite the older one
**And** this resolution should happen silently in the background
**And** the UI should update (Optimistic > Confirmed) if the remote state won

### Epic 4: Maintenance & Observability
**Goal:** Ensure the system can evolve without breaking existing user data.
**Value:** Long-term project stability and ability to ship updates without fear.
**FRs covered:** FR10
**Implementation Notes:** Database migrations must account for the local-first nature (e.g. queueing changes).

### Story 4.1: Non-Destructive Schema Migrations
As an Administrator,
I want to apply database updates (adding columns) without breaking older clients,
So that users with cached offline versions don't crash when they finally reconnect.

**Acceptance Criteria:**
**Given** a new schema migration (e.g., adding `difficulty` column to `Tasks`)
**When** it is applied to Supabase
**Then** the `seed.py` and `migration_manager.py` scripts must ensure the column is nullable
**And** older client versions must ignore the new field without erroring
**And** frontend must gracefully handle missing optional fields from the API

### Story 4.2: Hard Reset & Debug Panel
As a Tester/Developer,
I want a hidden menu where I can wipe local state or inspect sync status,
So that I can verify the app recovers from edge cases without clearing my entire browser cache.

**Acceptance Criteria:**
**Given** the user navigates into the "Settings" modal
**When** they click "Advanced Options" (or Konami code)
**Then** a "Danger Zone" should appear
**And** it should offer "Wipe Local Storage", "Force Sync", and "View Logs" options
**And** clicking "Wipe" should reload the app as a fresh user immediately
