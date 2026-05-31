# Project Rules & Claude Configuration

## ⛔ MANDATORY FIRST STEP — DO NOT SKIP
Before responding to ANY message in this session, you MUST:
1. Read `.claude/memory/session_status.md`
2. Read `.claude/memory/feedback.md`
3. Ask: "Is this still current, or are we working on something different today?"
4. Only then address the user's question.

Do NOT answer first and read later. Do NOT skip this even if the user's message seems urgent or obvious. This applies to the very first message of every session.

## Memory System

All persistent context lives in `.claude/memory/`.

**Always read at session start:**
- `session_status.md` — in-progress work and what's next
- `feedback.md` — corrections and preferences

**Read on mandatory triggers (not discretion):**
- Before writing any code → `patterns.md`
- Before debugging → `bugs_fixed.md`
- Before architectural changes → `decisions.md`
- For any domain-specific work → the matching domain file (e.g. `permission_matrix.md`, `api_contracts.md`)

Discretion ("load if needed") is the failure mode — Claude regularly decides it doesn't need the file, then re-investigates a documented bug. Treat these triggers as mandatory.

**Reference docs — `.claude/memory/docs/`:**
- `docs/addons/` — per-subsystem architecture references
- `docs/process/` — reusable workflows loaded on trigger (see Operational Procedures below)
- `docs/features/` — post-implementation records
- `docs/architecture/` — cross-cutting design references
- `docs/plans/` — future work, not yet built
- `docs/archived/` — superseded or completed docs (historical reference only; do not read unless the user explicitly asks)

**What NOT to save in memory:**
- File paths or code structure — Claude can grep for it
- Git history — `git log` is authoritative
- Anything already in this CLAUDE.md
- Temporary task steps or current conversation state
- Step-by-step fix implementations — the fix lives in the code
- Operational parameters that scale with user activity — these belong behind an API, not in memory files
- Ephemeral plan state — plans go in `.claude/memory/docs/plans/` (committed) or `~/.claude/plans/` (per-conversation)

**What TO save:**
- Decisions with a "why" not obvious from the code (include "when NOT to apply" clause)
- Root cause patterns likely to recur elsewhere (end with "Key" diagnostic shortcut)
- Corrections and preferences (include trigger phrases so they self-activate)
- Rules established during development

## Operational Procedures

When triggered, read the full procedure doc before executing:
- "wrap up", "end of session", "/wrapup" → `.claude/memory/docs/process/session_end_process.md`
- (add project-specific triggers as your workflow matures — e.g. "create release", "run the import pipeline", "scaffold a new module")

Do not execute procedures from memory. Always read the doc first — it may have changed since you last saw it.

## Complex Multi-File Changes
For any task that touches more than 3 files:
1. Write a plan first — list every file and exactly what will change in each
2. Wait for user approval before writing any code
3. Implement in logical chunks (e.g. backend first, then frontend), one commit per chunk

## Git Checkpoint
Before starting any risky or multi-file change, remind the user:
> "Make sure you have a clean git commit so you can revert if needed."

## Todo List Management
When the user says "parking lot", "do this later", "add to todo", or similar phrases, append to TODO.md. First check if a related entry already exists — if so, update it with any new context rather than creating a duplicate. Keep entries in the order they were added.

## End of Session
When the user says "I'm done", "session over", "wrap up", or invokes /wrapup, follow the session-end procedure at `.claude/memory/docs/process/session_end_process.md`. Do not improvise — read the procedure first.

After the procedure runs, always update `session_status.md` to reflect either next steps or "nothing pending".

## Optional: Slash Commands

These are shortcuts for the natural-language phrases above. You can skip them — natural language works.

### /remember
Ask: "What should I remember?" Then determine the right file:
- Architectural decision → append to `decisions.md` with date, reasoning, and "when NOT to apply" clause
- Correction or preference → append to `feedback.md` with date, why, and trigger phrase for activation
- Reusable pattern or rule → append to `patterns.md` with origin context
- Bug root cause → append to `bugs_fixed.md` with symptom/cause/fix/Key line
- If unclear, ask: "Is this a decision, a correction, a pattern, or a bug?"

### /decisions
Ask: "What did you decide, why, and when should this NOT apply?" Append to `decisions.md`.

### /feedback
Ask: "What should I do differently, and what's the trigger phrase that should activate this rule?" Append to `feedback.md`.

### /bug
Ask: "What was the symptom, root cause, fix, and Key diagnostic shortcut for future recurrence?" Append to `bugs_fixed.md`.

### /todo
Follow the Todo List Management rule above.

### /status
Ask: "What's done and what's next?" Update `session_status.md`.

## App Architecture (React Native / Expo)

This project is an Expo-managed React Native app (Expo SDK 54, React 19, Expo Router for navigation, JavaScript — no TypeScript).

- **State Management:** All API data and shared state flows through the store in `src/store/`. NEVER call APIs directly from screens or components using fetch/axios. Components dispatch actions / read selectors; they do not manage async operations themselves.
- **API Calls:** All API calls live in `src/api/` and are consumed via the store layer. New API endpoints get an `src/api/` module first, then a store slice/thunk, then UI.
- **Navigation:** Routing is file-based via Expo Router under `app/`. Screen files under `src/screens/` are mounted from route files in `app/`. Add a new route by creating the file in `app/`, then wiring its screen component from `src/screens/`.
- **Components:** Keep components small and focused. Extract shared logic into custom hooks (`use*.js`). Compose, don't inherit. Reusable UI lives in `src/components/`.
- **Theme / Styling:** Use tokens from `src/theme/` (colors, spacing, typography). Do not hardcode hex values, font sizes, or spacing literals in components — pull from the theme.
- **Platform Considerations:** This app targets Android, iOS, and Web (via `react-native-web`). When using a library or API, verify it supports all three or gate the code path with `Platform.OS`. Test web behavior for any new screen — many gesture/animation libs behave differently on web.
- **New Features:** Build in this order — API module → store slice → screen component → route. Don't start with the UI and back-fill state plumbing; you'll end up with components that fetch directly and bypass the store.
- **Payments:** Stripe and SSLCommerz are both integrated. When touching checkout, verify the change works on both providers and on web + native.
- **Assets & Bundling:** Heavy assets go in `assets/`. For build-time concerns (Metro, EAS), check `metro.config.js` and `eas.json` before changing anything that affects bundling — these files are tuned for the current setup.
