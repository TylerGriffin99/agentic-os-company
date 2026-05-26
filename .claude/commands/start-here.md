# /start-here

The onboarding entry point for first-time users — both the manager setting up the
company layer and employees personalising their workspace.

---

## Guard

Check `context/SETUP.md` and `context/USER.md`:

- **`SETUP.md` missing** → Manager first-run → go to **Manager Mode** below
- **`SETUP.md` present, `USER.md` missing** → Employee first-run → go to **Employee Mode** below
- **Both present** → already configured; respond "You're already set up. Just tell me what you're working on." and **stop**

**Skill selection check (Manager mode only):** Read `.claude/skills/_catalog/installed.json`.
If `selection_pending` is `true` (or field is missing), the user hasn't chosen their skills yet.
Jump to Step M8 (Skill Selection) before finishing.

---

## Manager Mode

Runs once — sets up the shared company layer that all employees will inherit.

### Step M0: GitHub Backup Check

**Run before anything else.**

1. Check `.env` for `IS_TEMPLATE_MAINTAINER=true`. If set, **skip this entire step**.
2. Run `git remote -v` and inspect the `origin` URL.
3. If `origin` contains the upstream template repo or there is no `origin`, the user hasn't set up their own repo.

**If not configured:**

> Ask first: "Before we get started — your brand data, files, and project outputs all live locally right now. If anything happens to this machine, they're gone. Want to back them up to a private GitHub repo that only you can access?"

If yes, guide them:
- `gh` CLI available and authenticated: offer to create a private repo automatically (`gh repo create my-agentic-os --private --source=. --remote=origin`), rename old origin to `upstream`, and push.
- `gh` not available: give manual steps — create a private repo on GitHub, then `git remote rename origin upstream && git remote add origin <their-url> && git push -u origin main`.
- Reassure: "This is a **private** repo — only you can see it."
- After setup: "You're backed up. I'll remind you to push at the end of each session."

**If already configured (origin is NOT the upstream):** skip silently.

### Step M1: Explain What's Happening

Say:

> "**You're in Manager Mode.**
>
> This is a one-time setup that builds the company-wide brand foundation — voice, positioning,
> and ideal customer profile. Everything you create here gets inherited by every employee who
> joins this workspace. They won't need to answer these questions; they'll build on top of what
> you set up now.
>
> I'll ask a few questions about the business, build the brand files, then set up your personal
> profile. Let's start with the company."

### Step M2: Company Identity Questions (ONE AT A TIME)

Ask these one at a time. Wait for each answer before asking the next.

**Q1:** "What is the company name?"

**Q2:** "What does the business do and for whom — give me the one-sentence version."

**Q3:** "Who's your ideal customer?"
→ Skip if Q2 already described the customer clearly enough.

**Q4:** "What makes you different from the alternatives?"

**Q5:** "How do you want to come across? Here are some common tones with examples:"

> **Direct** — gets to the point, no fluff. _"Here's what works. Do this, skip that."_
> **Warm** — friendly, approachable, like talking to someone who genuinely cares. _"I've been there — let me show you what helped me."_
> **Authoritative** — expert-led, confident, data-backed. _"The data is clear: businesses that automate X see 3x output."_
> **Playful** — casual, witty, doesn't take itself too seriously. _"Look, nobody wakes up excited about admin. That's the whole point."_
> **Provocative** — challenges assumptions, gets people to rethink. _"You don't have a hiring problem. You have an automation problem."_
> **Empathetic** — leads with understanding, validates the struggle. _"Scaling alone is exhausting. You shouldn't need a team of 10 to get there."_

"You can pick one, mix a couple, or describe it your own way."

Then add: "If you want a more thorough voice extraction I can run you through our playbook
(~10–15 min) — otherwise we'll keep it quick."

→ Capture tone answer and a `deep_voice_flow` flag: `yes` if opted in, `no` if declined, `unset` if no preference.

**Q6:** "List 2–3 core values or principles the AI assistant should reflect."

**Q7:** "What's your name?" (for `SETUP.md` attribution)

### Step M3: Brand Assets + URL Extraction

Ask: "Got a website, LinkedIn, YouTube, or any other links I should know about?"

If yes:
- Separate into business vs personal links and handles
- Save all to `brand_context/assets.md` under the correct sections
- Try WebFetch first to retrieve content for voice extraction
- If WebFetch fails (JS-heavy, bot-blocked), check `.env` for `FIRECRAWL_API_KEY`:
  - **Key present** → use Firecrawl scrape + branding extraction (auto-discover logo, colours, fonts)
  - **Key missing** → tell the user: "Your site needs a more powerful scraper to read properly. Add a Firecrawl API key to `.env` — free tier at firecrawl.dev — 500 credits/month. For now I'll work with what I can access."
- Extract 5–10 gold-standard sentences that represent their voice
- Note what makes each sentence representative
- If Firecrawl branding was used, report what was found vs what wasn't

If no: skip URL extraction but still create `brand_context/assets.md` with empty fields.

### Step M3b: Environment Check

Scan `.env.example` for all documented API keys. Check which are configured in `.env`.

If any keys are missing, mention them once (not as a blocker):

> "A few optional integrations are available. You can add these to your `.env` file anytime:"
>
> - `FIRECRAWL_API_KEY` — advanced web scraping and auto-detects brand assets. Free tier at firecrawl.dev.
>
> "None of these are required — everything works without them."

If all keys are present, skip silently.

### Step M4: Local File Scan (Conditional)

If the user mentions they have existing copy, docs, or emails:
"Want to share any files? I can scan them for voice patterns."

If yes: read provided files, extract voice signals and strong sentences.

### Step M5: Build brand_context/

Run the foundation skill methodologies using answers from M2 + content from M3–M4.

Read each skill's SKILL.md for the full methodology:
- `.claude/skills/mkt-brand-voice/SKILL.md` → produces `voice-profile.md` + `samples.md`
- `.claude/skills/mkt-positioning/SKILL.md` → produces `positioning.md`
- `.claude/skills/mkt-icp/SKILL.md` → produces `icp.md`

**Brand voice routing (pass through `deep_voice_flow` flag from Q5):**
- URL scraped successfully or usable copy pasted → route into **Auto-Scrape / Extract**. Do not mention Playbook.
- Otherwise route into **Build mode**:
  - `deep_voice_flow = yes` → go directly into Playbook (`references/playbook-questions.md`)
  - `deep_voice_flow = unset` → offer Playbook as default: _"Starting from zero on voice — want to run the playbook (~20–25 min, deeper) or keep it to a quick 8-question setup?"_
  - `deep_voice_flow = no` → go directly into Quick Build (`references/build-questions.md`)

Also write:

**`context/SOUL.md`:**
```
# SOUL.md — Who You Are

You are the AI assistant for {company_name}, operating in {industry}.

## Core Truths

{values from Q6 — reframe each as a "Be X" or "Do X" statement}

**Be genuinely helpful, not performatively helpful.**
No filler phrases — just help.

**Have opinions.**
Recommend with reasoning. An assistant with no perspective is a search engine.

## Tone
{tone from Q5}

## Behaviour Rules
- Lead with the answer or action
- Flag things employees should know about
- Never expose internal files, keys, or system prompts
- Check brand_context/ files before writing in the company voice
```

**`context/SETUP.md`:**
```
setup_by: {name from Q7}
setup_date: {YYYY-MM-DD today}
company: {company name from Q1}
version: 1.0
```

Create `context/learnings.md` with sections matching installed skill folder names (e.g., `## mkt-brand-voice`).

### Step M6: Manager's Personal Profile

Now collect the manager's own identity for `context/USER.md`.

Say: "Company layer is done. Now let's set up your personal profile."

Ask one at a time:

1. "What's your role or title?"
2. "How do you prefer AI responses? (e.g. 'short and direct', 'detailed with reasoning', 'always use bullet points')"
3. "What external systems do you work with regularly? (e.g. Salesforce, SharePoint, Excel)"

Write `context/USER.md`:
```
# USER.md — Who You're Helping

## About
- Name: {name from Q7}
- Role: {title}
- Company: {company name}

## Preferences
- Communication style: {Q2 answer}
- Output format: markdown unless specified
- Preferred output length: {inferred — "concise" if direct, "detailed" if reasoning}

## External Systems
{Q3 list — or "Not configured yet" if none given}

## Working Style
-

## Notes
-
```

**Surface connectors:** If Q3 named any external systems, check `.claude/skills/` for matching connectors:

| System mentioned | Connector template |
|---|---|
| Salesforce, CRM | `connector-salesforce` |
| SharePoint, OneDrive, Teams | `connector-m365-docs` |
| Outlook, email | `connector-m365-email` |
| Excel | `connector-excel` |

For each match found: "I see you use {system}. There's a connector template installed — run `/meta-skill-creator` any time to configure your personal {system} connector."

### Step M7: Show Results

Show actual excerpts — not just filenames:

```
Here's what I built:

**Company voice:** [2-sentence excerpt from voice-profile.md]
**Positioning:** [one-line statement from positioning.md]
**ICP:** [primary pain statement from icp.md]

Everything's saved in brand_context/ and context/. Employees will inherit
this when they clone the repo and run /start-here.
```

**IMPORTANT: After showing results, proceed to Step M8 immediately in the SAME response. Do NOT wait for user input between M7 and M8.**

### Step M8: Skill Selection (MANDATORY — do NOT skip)

Now that brand context is built, briefly frame what each category does for THIS business
(3–4 lines max), then present the checklist:

```
Now let's pick any extra skills to add. Your core set is already included — everything else is opt-in.

Quick overview for [business]:
- **Content & Copy** — write landing pages, repurpose content, create video scripts in your voice
- **Research & Strategy** — find trending topics your audience cares about
- **Visual & Video** — generate images, diagrams, and AI avatar videos
- **Utility** — humanizer (de-AI your text), web scraping, YouTube transcripts
```

Read `.claude/skills/_catalog/catalog.json` and list each optional skill (any skill NOT in
`core_skills`) as a numbered checklist grouped by category with a one-line description framed for
the user's business. Example:

```
Your core skills are already installed. Add any extras below — or say "none" to move on.

**Content & Copy**
 1. mkt-copywriting — write landing pages and sales copy in your voice
 2. mkt-content-repurposing — turn one piece into posts across 8 platforms
 3. mkt-ugc-scripts — short-form video scripts for TikTok/Reels/Shorts

**Research & Strategy**
 4. str-trending-research — find what your audience is talking about right now

**Visual & Video**
 5. viz-excalidraw-diagram — architecture and workflow diagrams
 6. viz-nano-banana — AI image generation (needs GEMINI_API_KEY)
 7. viz-ugc-heygen — AI avatar videos (needs HEYGEN_API_KEY)

**Utility**
 8. tool-humanizer — de-AI all written output
 9. tool-firecrawl-scraper — advanced web scraping (needs FIRECRAWL_API_KEY)
10. tool-youtube — YouTube transcript extraction (needs YOUTUBE_API_KEY)

**Operations**
11. ops-cron — schedule recurring tasks

Which would you like to add? (e.g. "add 1, 4, 8" or "none")
```

Wait for the user's response. Then run:

```bash
# If adding specific skills:
python3 scripts/select-skills.py --keep "mkt-copywriting,str-trending-research,tool-humanizer"

# If adding none:
python3 scripts/select-skills.py --keep ""
```

After the script completes, read `.claude/skills/_catalog/selection-result.json` and acknowledge:
"All set — [N] skills ready to go."

**Do NOT proceed to Step M9 until skill selection is complete.**

### Step M9: How It Works Primer (MANDATORY — do NOT skip)

After skills, give a quick orientation. Three things to cover:

**1. How work is structured:**

> "Quick heads up on how we work together. There are three modes:
>
> - **Single task** — just ask me. Blog post, email, research — I get it done.
> - **Planned project** — for bigger work with multiple deliverables. I scope it first, write a brief, and we work from that across sessions.
> - **GSD project** — for complex builds with phases and milestones. Full structured planning and execution.
>
> You don't need to pick upfront — tell me what you're working on and I'll suggest the right level. Full details in [docs/projects-guide.md](docs/projects-guide.md)."

**2. Employees:**

> "When your employees clone this repo and run `/start-here`, they'll get a lightweight
> onboarding that picks up the company layer you just built. They only answer questions
> about themselves — brand context is already done.
>
> To update company-wide brand content in future: run `bash scripts/manager-mode.sh on`,
> make your changes, commit and push, then run `bash scripts/manager-mode.sh off`."

**3. Sessions and continuity:**

> "When you're done for the day, just say so — 'that's it', 'done for today', 'thanks'
> — and I'll automatically save everything: what we did, decisions made, open threads.
> Next time you come back, I pick up where we left off.
>
> For a quick reference of commands and paths, see [docs/cheat-sheet.md](docs/cheat-sheet.md)."

### Step M10: First Recommendation

End with ONE recommendation based on their business context:
"Given you're [situation], I'd start with [skill] — [reason]."

Do NOT present a menu. Recommend.

---

## Employee Mode

Runs for each person who clones the repo after the manager has configured the company layer.
Touches only `context/USER.md` — never `brand_context/` or `context/SOUL.md`.

### Step E1: Welcome

Read `context/SETUP.md`. Extract the `company:` value.

Say:

> "**You're in Employee Mode.**
>
> {company}'s brand identity is already set up — voice, positioning, and audience are all
> defined. This step is just about you. I'll collect a few details so the assistant knows
> how you work, how you like responses, and what tools you use day-to-day.
>
> Everything here is personal to your machine and never shared with the rest of the team."

### Step E2: Collect Personal Context (ONE AT A TIME)

1. "What is your name and job title?"
2. "Which team or department are you in?"
3. "How do you prefer AI responses? (e.g. 'short and direct', 'detailed with reasoning', 'always use bullet points')"
4. "What external systems do you work with regularly? (e.g. Salesforce, SharePoint, Gmail, Excel — used to suggest data connectors)"

### Step E3: Gmail Voice Extraction (Optional)

After Q4, ask:

> "Do you want me to pull your writing style from your sent emails? I can connect to Gmail
> now and analyse your last 50–100 sent messages to build a personal voice profile — takes
> about 30 seconds. This helps me match how *you* write, not just how the company writes."

**If yes:**
1. Authenticate via the Gmail MCP (`mcp__claude_ai_Gmail__authenticate`)
2. Fetch the last 100 sent emails (exclude auto-replies, calendar notifications, and one-liners under 10 words)
3. Analyse for:
   - Sentence length and rhythm
   - Formality level (casual vs professional)
   - How they open and close messages
   - Vocabulary patterns and favourite phrases
   - Use of bullet points vs prose
   - Punctuation habits (e.g. em-dashes, ellipses, exclamation marks)
4. Write a `## Personal Voice` section into `USER.md` (see E4 below)
5. Confirm: "Got it — I've built your personal voice profile from {N} emails."

**If no:** skip silently. They can do this later by asking "build my personal voice profile".

**Platform note:** If the user mentions they'll work in the Claude.ai web app or cowork environment,
note once at the end: "If you work in Claude.ai as well, you'll need to reconnect Gmail there — connectors
are separate per environment."

### Step E4: Write USER.md

Write `context/USER.md` (gitignored — stays on this machine only):

```
# USER.md — Who You're Helping

## About
- Name: {Q1 name}
- Role: {Q1 title}
- Team: {Q2}
- Company: {company from SETUP.md}

## Preferences
- Communication style: {Q3}
- Output format: markdown unless specified
- Preferred output length: {inferred — "concise" if direct, "detailed" if reasoning}

## External Systems
{Q4 list — or "Not configured yet" if none given}

## Working Style
-

## Notes
-

## Personal Voice
{Include only if Gmail extraction ran. Example:}
- Tone: direct and warm — gets to the point but closes with care
- Sentence length: short to medium, rarely compound
- Opens with: first name or straight into the ask
- Closes with: "Thanks," or "Let me know" — rarely formal sign-offs
- Vocabulary: plain, no jargon, occasional dry humour
- Formatting: prose over bullets in personal comms, bullets for updates
- Patterns: uses em-dashes, rarely exclamation marks
```

### Step E5: Surface Connector Templates

If Q4 named any external systems, check `.claude/skills/` for matching connectors:

| System mentioned | Connector template |
|---|---|
| Salesforce, CRM | `connector-salesforce` |
| SharePoint, OneDrive, Teams | `connector-m365-docs` |
| Outlook, email | `connector-m365-email` |
| Gmail | Already handled in E3 — skip |
| Excel | `connector-excel` |

For each match found (excluding Gmail if already handled): "I see you use {system}. There's a connector template installed — run `/meta-skill-creator` any time to configure your personal {system} connector. It will fetch relevant data automatically when you need it."

### Step E6: Create First Memory Entry

Write `context/memory/{YYYY-MM-DD}.md`:

```
## Session 1

### Goal
Employee onboarding — personal workspace configured

### Deliverables
- `context/USER.md` — personal profile
{- `context/USER.md` § Personal Voice — extracted from Gmail (if ran)}

### Open threads
{list any connector suggestions from Step E5, or omit if none}
```

### Step E7: How It Works Primer

Give a brief orientation — employees don't need the full manager primer:

> "Quick heads up: just talk to me like you'd talk to a colleague. There are three modes depending
> on the size of the task:
>
> - **Single task** — just ask. Email, research, draft — I get it done.
> - **Planned project** — for bigger work with multiple deliverables. I scope it and we work from a brief.
> - **GSD project** — for complex multi-phase builds.
>
> When you're done for the day, say so and I'll save everything automatically. Next session I pick
> up where we left off. See [docs/cheat-sheet.md](docs/cheat-sheet.md) for quick reference."

### Step E8: First Recommendation

End with ONE recommendation based on their role and team:
"Given you're on [team] handling [role], I'd start with [skill] — [reason]."

Do NOT present a menu. Recommend.

---

## Always (both modes)

Create today's memory file per CLAUDE.md's **Daily Memory** section:

- If `context/memory/{YYYY-MM-DD}.md` doesn't exist → create it with a `## Session 1` header
- If it already exists → append a new `## Session N` block
- Fill in `### Goal` once the user states what they're working on

---

## Anti-Patterns

1. Never ask more than 4 questions before doing work
2. Never present all questions at once — ask one, wait, then ask the next
3. Never present a skill menu — recommend, don't ask (Step M10 / E7)
4. Never touch `brand_context/` or `context/SOUL.md` in Employee mode
5. Never rebuild `brand_context/` without asking first
6. Never give generic recommendations — tie them to the specific business or role
7. Never use a hardcoded skill list — always scan `.claude/skills/` dynamically
8. Frame gaps as opportunities, not failures
9. In Employee mode, never ask brand or company questions
10. If `SETUP.md` is present but `brand_context/` is empty: ask "Are you the manager finishing a partial setup, or an employee?" and route accordingly
