---
stepsCompleted: [1, 2, 3, 4, 5, 6, 7]
---

# Workflow Creation Plan: content-ingestion

## Initial Project Context

- **Module:** custom/stand-alone
- **Target Location:** c:\Users\USER\Documents\Programming\100 Days of Code\bmad-custom-src\workflows\content-ingestion
- **Created:** 2025-12-10

## Requirements Gathering

### 1. Purpose & Scope
- **Goal:** Ingest and format content for the "Practice" page tabs (Deep Dive, Quiz).
- **Primary User:** Developer/Content Manager.
- **Outcome:** Populated content files in `frontend/src/components/content/DeepDive` and database seeds.
- **Excluded:** Transcripts tab (removed - provides minimal learning value beyond Deep Dive).

### 2. Workflow Type
- **Classification:** Action Workflow (Data Extraction & Enrichment pipeline).

### 3. Structure
- **Pattern:** Linear Pipeline.
  1. **Extraction:** Run `scripts/extract_day_content.py` to generate `data/day_metadata.json` and parse all content files.
  2. **Parsing:** Parse specific "Day Folder" content for quizzes, code snippets, and supplementary resources.
  3. **Enrichment:** Use Ref/Exa MCPs to find additional context/examples for the extracted Topics.
  4. **Formatting:**
      - Generate `DeepDiveDayX.jsx` (New Logic needed - currently manual).
      - Generate `questions.json` (Merge extracted quizzes with enriched content).

### 4. Inputs
- **Udemy Folder:** `c:\Users\USER\Documents\Programming\100 Days of Code\Udemy - 100 Days of Code...`
- **Master Script:** `scripts/extract_day_content.py` (Handles VTT, TXT, HTML, MD, PDF parsing + metadata + code extraction).
- **Questions Script:** `scripts/migrate_questions.py` (Exports generic seeds to JSON).
- **Tools:** `ref` (Documentation), `exa` (Web Search), `filesystem` (Read/Write).

### 5. Success Criteria
- **Quality:** Content is accurate to the video subtitles and enriched with relevant web examples.
- **Completeness:** Deep Dive and Quiz are populated for the target Day.
- **Format:** Valid JSX and JSON that compiles without error.

## Tools Configuration

### Core BMAD Tools
- **Party-Mode:** Excluded - Workflow is a linear automation pipeline.
- **Advanced Elicitation:** Excluded - Requirements are static (Udemy Content).
- **Brainstorming:** Excluded - No creative generation needed.

### LLM Features
- **Web-Browsing:** Included (Exa) - Use cases: Finding real-world examples and context for "Deep Dive" topics to enrich the local content.
- **File I/O:** Included - Operations: Reading extracted JSON, writing JSX components and Questions JSON.
- **Sub-Agents:** Excluded - Single stream execution.
- **Sub-Processes:** Excluded - Simple sequential steps.

### Memory Systems
- **Sidecar File:** Excluded - workflow is stateless per run.

### External Integrations
- **scripts/extract_day_content.py:** Core engine for parsing all content files (VTT, TXT, HTML, MD, PDF) and generating metadata.
- **scripts/migrate_questions.py:** Utility for exporting question seeds.
- **Ref (MCP):** Documentation lookup to validate generated Python code snippets.
- **DeepDiveTemplate.txt:** (New Requirement) Standardized template for React component generation.

### Installation Requirements
- **Python Scripts:** Already present in `scripts/`.
- **Node.js:** Required for running the frontend (already verified).
- **User Installation Preference:** Tools are already installed.
- **Supabase Credentials:**
  - **Location:** `frontend/.env`
  - **Variables:**
    - `VITE_SUPABASE_URL`: Project URL
    - `VITE_SUPABASE_ANON_KEY`: Public/Anon Key
    - `SUPABASE_SERVICE_KEY`: Service Key (Backend only, used by seeding script)
  - **Script Configuration**: `scripts/seed_supabase_questions.py` reads `SUPABASE_SERVICE_KEY` directly from `frontend/.env`.
    - **No Manual Action Required**: The script will automatically load the key from the .env file.

## Output Format Design

**Format Type**: Strict Template

**Output Requirements**:
- **Document Type**: React Component (`.jsx`)
- **File Format**: JSX (React Functional Component)
- **Validation**: Must compile with existing project dev server.

**Structure Specifications**:
- **Layout**: CSS Grid (1 col mobile, 3 cols desktop).
- **Styling**: Tailwind CSS (Project Theme: `surface-200`, `primary-400`).
- **Components**: must use `CodeBlock` and `Lucide` icons.

**Template Information (DeepDiveTemplate.jsx)**:
```jsx
import CodeBlock from '../../CodeBlock'
import { Lightbulb } from 'lucide-react'

export default function DeepDiveDay{{day_num}}() {
    return (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            {/* Main Content Area */}
            <div className="lg:col-span-2 space-y-8 text-surface-200 leading-relaxed">
                {/* Loop Over Sections Here */}
                <section className="space-y-4">
                    <h2 className="text-2xl font-bold text-surface-100 flex items-center gap-2">
                        <span className="text-primary-400">{{section_num}}.</span> {{section_title}}
                    </h2>
                    <p>{{section_content}}</p>
                    <CodeBlock code={`{{code_snippet}}`} />
                </section>
            </div>

            {/* Sidebar Area */}
            <div className="space-y-6">
                <div className="bg-surface-800/30 p-6 rounded-xl border border-surface-700 sticky top-24">
                     <h3 className="text-lg font-bold text-surface-100 mb-4 flex items-center gap-2">
                        <Lightbulb className="w-5 h-5 text-yellow-500 inline mr-2" /> Pro Tips
                    </h3>
                    <div className="space-y-4">
                         {/* Pro Tip Items */}
                    </div>
                </div>
            </div>
        </div>
    )
}
```

**Special Considerations**:
- **Strict Imports**: Relative path `../../CodeBlock` is critical.
- **Escaping**: Code snippets inside `CodeBlock` must handle template literals correctly.

## Special Character Rendering Guidelines

> ⚠️ **CRITICAL**: Lessons learned from debugging escape sequence rendering issues in quiz questions.

### The Escape Sequence Problem

When storing and displaying escape sequences like `\n`, `\t`, `\r` in question text, multiple layers of interpretation occur:

1. **Database (PostgreSQL)**: Stores the literal characters
2. **JSON Serialization**: Supabase API returns `\\n` in JSON which...
3. **JavaScript JSON.parse()**: Interprets `\\n` as an actual newline character
4. **Frontend Rendering**: Must convert interpreted escape sequences back to display text

### Correct Storage Format

For questions that DISPLAY escape sequences (e.g., "What does `\n` do?"):

| Layer | Value | Notes |
|-------|-------|-------|
| In DB | `What does \n do?` | Literal backslash + n |
| In JSON | `What does \\n do?` | JSON-escaped |
| In JS | Actual newline | After JSON.parse() |
| Display | `\n` | After InlineCode conversion |

**Database UPDATE Examples**:
```sql
-- WRONG: Will be interpreted as newline
UPDATE questions SET text = 'What does \n do?' WHERE id = X;

-- CORRECT: Use dollar-quoted string with literal \n
UPDATE questions SET text = $txt$What does \n do?$txt$ WHERE id = X;

-- CORRECT: Double-escape for standard strings  
UPDATE questions SET text = 'What does \\n do?' WHERE id = X;
```

### InlineCode Component Usage

The `InlineCode` component handles backtick-wrapped text and converts interpreted escape sequences back to display text:

```jsx
// Text with backticks: "What does `\n` do?"
// Renders: What does <code>\n</code> do?

// The component converts actual newlines back to literal \n text
const displayPart = part
    .replace(/\n/g, '\\n')
    .replace(/\t/g, '\\t')
    .replace(/\r/g, '\\r')
```

### MCQ vs Coding Challenge Rendering

| Question Type | Has Options | Newline Handling |
|---------------|-------------|------------------|
| **MCQ** | Yes (array with items) | Use `InlineCode` - NO splitting |
| **Coding Challenge** | No (empty array) | Split on `\\n` for title/description |

**Critical Rule**: MCQ questions should NEVER use the `\\n` splitting logic. The splitting was designed for coding challenges that have a title + description format.

### Question Text Patterns

**MCQ Questions mentioning escape sequences**:
```json
{
  "text": "What does `\\n` do inside a string?",
  "options": ["Creates a new line", "Prints the letter n", ...]
}
```

**Coding Challenge Questions**:
```json
{
  "text": "Check Membership\\nReturn `True` if item exists in the list.",
  "options": []
}
```

### Verification Checklist

Before deploying questions with special characters:

- [ ] Check question renders correctly in local dev (`npm run dev`)
- [ ] Verify `\n` appears as literal text, not as a line break
- [ ] Confirm backtick-wrapped code has proper styling
- [ ] Test both MCQ and Coding Challenge question types
- [ ] Verify in production after Vercel deployment

### Common Mistakes

1. **Over-escaping**: Using `\\\\n` instead of `\\n` in JSON files
2. **Under-escaping**: Using raw `\n` in SQL UPDATE statements
3. **Wrong splitting**: Applying `\\n` split to MCQ questions (breaks inline `\n` mentions)
4. **Missing InlineCode**: Not wrapping question text component with escape handling
5. **Missing Icon Imports**: Using icons (like `RefreshCw` for Pro Tips) in the template/component without importing them from `lucide-react`.



## Quiz Question Schema

**Format Type**: JSON Array

**Output Requirements**:
- **File Format**: JSON (`scripts/data/questions/day-X.json`)
- **Validation**: Must pass `seed_supabase_questions.py` schema validation.

**Question Type Distribution** (Minimum: 20 questions per day, no maximum):
- **MCQ**: 10-12 questions (~50%) - Conceptual understanding (Bloom's: Remember, Understand)
- **Coding**: 5-7 questions (~25%) - Practical application (Bloom's: Apply, Analyze)
- **Code-Correction**: 3-5 questions (~15-20%) - Debugging skills (Bloom's: Analyze, Evaluate)

> Note: Percentages are approximate targets. Actual distribution may vary slightly per day.

**Difficulty Distribution** (per day):
- **Easy**: ~30% - Foundation concepts
- **Medium**: ~50% - Core learning focus
- **Hard**: ~20% - Stretch challenges

**MCQ Question Schema**:
```json
{
  "question_type": "mcq",
  "text": "Question text here",
  "options": ["Option A", "Option B", "Option C", "Option D"],
  "correct_index": 0,
  "difficulty": "easy|medium|hard",
  "topic_tag": "topic-name",
  "explanation": "Why the correct answer is correct."
}
```

**Coding Question Schema**:
```json
{
  "question_type": "coding",
  "text": "Problem Title\\nProblem description here.",
  "starter_code": "def function_name(param):\\n    # Instructions\\n    pass",
  "test_cases": [
    {"function_call": "function_name(arg)", "expected": "expected_output"}
  ],
  "difficulty": "easy|medium|hard",
  "topic_tag": "topic-name",
  "solution_code": "def function_name(param):\\n    return solution"
}
```

**Code-Correction Question Schema**:
```json
{
  "question_type": "code-correction",
  "text": "Fix the bug in the following code",
  "code": "def greet(name):\\n    print('Hello ' + Name)  # Bug here",
  "options": ["Change Name to name", "Add return statement", "Use f-string", "Remove print"],
  "correct_index": 0,
  "difficulty": "easy|medium|hard",
  "topic_tag": "debugging",
  "explanation": "Python is case-sensitive. 'Name' is undefined, but 'name' (the parameter) is."
}
```

**Topic Coverage Guidelines**:
- Questions MUST cover all major topics extracted in Step 2.
- Include at least one code-correction question per major concept to build debugging skills.
- Coding questions should include at least one question per major code concept from the day.

## Content Section Guidelines

**Deep Dive Structure** (Target per day):
- **Main Sections**: 4-6 sections covering ALL key concepts from the day's lessons
- **Pro Tips**: 3-5 tips in the sidebar (common pitfalls, best practices, shortcuts)
- **Code Examples**: At least 1-2 `CodeBlock` per section with real, runnable examples
- **Key Takeaways**: Include brief summaries at the end of major sections

**Section Content Requirements** (to replace Transcripts functionality):
- **Concept Explanation**: Clear explanation of the concept (2-3 paragraphs)
- **Visual Aids**: Use `<ul>` grids for data types, operators, or comparison tables
- **Code Walkthrough**: Step-by-step explanation of code examples
- **Common Errors**: Highlight common mistakes and how to avoid them
- **Real-World Application**: Brief mention of where/when to use the concept

**Section Numbering**:
- Use `01.`, `02.`, `03.` format (zero-padded)
- Section titles should be concise (2-4 words)

**Enhanced Pro Tip Format**:
```jsx
<div>
  <h4 className="font-medium text-primary-400 text-sm uppercase tracking-wider mb-1">Tip Title</h4>
  <p className="text-sm text-surface-400">
    Tip content with <code>inline code</code> examples. 
    Include common gotchas, shortcuts, or best practices here.
  </p>
</div>
<div className="w-full h-px bg-surface-700/50"></div> {/* Divider between tips */}
```

**Content Depth Checklist**:
- [ ] All lesson topics from the day folder are covered
- [ ] Each `CodeBlock` has context explaining what it does
- [ ] Pro Tips reference real debugging scenarios
- [ ] Content is self-sufficient (user shouldn't need external resources)

## Router Integration Checklist

**Files to Update** (in `frontend/src/pages/Practice.jsx`):
1. **Import Statement**: Add `import DeepDiveDayX from '../components/content/DeepDive/DayX'`
2. **DAY_META Object**: Add entry with `{ day: X, title: 'Day Title', quiz_id: 'day-X-practice' }`
3. **DeepDive Component Map**: Add `'day-X': DeepDiveDayX` to the components object

**Database Seeding**:
1. Create `scripts/data/questions/day-X.json`
2. Run `python scripts/seed_supabase_questions.py --force`

**Verification**:
1. Run `npm run dev` in frontend
2. Navigate to `/practice`
3. Select Day X and verify Deep Dive renders
4. Switch to Quiz tab and verify questions load

## Workflow Structure Design

**Pattern**: Linear Pipeline with User Selection

**Step Sequence**:
1. **`step-01-init`**:
    - **Goal**: Initialize environment, load project config, and detect the target "Day" (e.g., Day 8).
    - **Auto-Detect**: Check `courses/` for next available day folder.

2. **`step-02-extraction`**:
    - **Goal**: Execute `scripts/extract_day_content.py` to parse VTTs and generate `data/day_metadata.json`.
    - **Output**: Raw JSON metadata + Cleaned VTT text.

3. **`step-03-selection`**:
    - **Goal**: Present extracted Topics to User. User MUST select *one* topic for the Deep Dive (Focus mechanism).
    - **Interaction**: Menu [1] Topic A, [2] Topic B, [C] Confirm.

4. **`step-04-enrichment`**:
    - **Goal**: Enrich selected Topic.
    - **Actions**:
        - `Exa`: Search for "Python {topic} real world examples".
        - `Ref`: Search Supabase/Python docs for best practices.

5. **`step-05-generation`**:
    - **Goal**: Generate `DeepDiveDayX.jsx`.
    - **Input**: Enriched Data + `DeepDiveTemplate.jsx` + Extracted Code Snippet.
    - **Constraint**: Must strict-follow the template structure.

6. **`step-06-integration`**:
    - **Goal**: Integrate into App.
    - **Actions**:
        - Update `Practice.jsx` (Add Day to Router).
        - Update `seed_questions.py` (Add new questions).
        - Run `scripts/migrate_questions.py` (Generate JSON).

**Interaction Patterns**:
- **Menu-Driven**: Critical at Step 3 (Selection).
- **Auto-Proceed**: Step 2 (Extraction) should run automatically if configured.

## Build Summary

**Files Generated:**
- `workflow.md`: Main entry point.
- `steps/step-01-init.md`: Environment & context loader.
- `steps/step-02-extraction.md`: Script execution wrapper.
- `steps/step-03-selection.md`: Topic selection logic.
- `steps/step-04-enrichment.md`: Exa/Ref integration.
- `steps/step-05-generation.md`: Component generator.
- `steps/step-06-integration.md`: Router & Database verification.
- `templates/DeepDiveTemplate.txt`: Strict React component structure.

**Customizations:**
- **Step 2**: Direct integration with `extract_day_content.py`.
- **Step 5**: Specific `CodeBlock` imports relative to the target directory.
- **Validation**: Added explicit checks for `day_metadata.json`.

**Next Steps**:
- Run the workflow for a test day (e.g., Day 8).
- Verify the generated `DeepDiveDay8.jsx` compiles.


## Important Findings & Lessons Learned

> ⚠️ **CRITICAL UPDATES (2025-12-14)**

### 1. Backend Dependency
- **Issue**: Content pages (e.g., Deep Dive, Quiz) often fail or hang if the backend FastAPI service is not running.
- **Requirement**: Always launch the backend (`uvicorn app.main:app --reload`) before testing content rendering.
- **Impact**: `Practice.jsx` relies on `quizApi` which calls the backend. If backend is down, fetches fail, potentially causing white screens or infinite loading states.

### 2. Code-Correction Question Type
- **Bug**: `quizApi.js` was missing the `code` column in its SELECT query (`getQuestions`).
- **Fix**: Added `code` to the SELECT list in `frontend/src/api/quizApi.js`.
- **Validation**:
    - JSON files must use `question_type: "code-correction"`.
    - JSON files must have a `code` field containing the snippet to fix.
    - Database schema must have a `code` column.
    - Frontend `Practice.jsx` has specific rendering logic for this type.

### 3. API & Scoring
- **Bug**: `submitQuiz` in `quizApi.js` was hardcoded for `mcq` and `coding` types only.
- **Fix**: Updated `submitQuiz` to treat `code-correction` scoring identically to `mcq` (comparing `correct_index`).
- **Lesson**: When adding new question types, update BOTH the fetching logic (`getQuestions`) AND the scoring logic (`submitQuiz`).
