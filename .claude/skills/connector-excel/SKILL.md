---
name: connector-excel
description: >
  TEMPLATE — configure via /meta-skill-creator to create your personal Excel
  connector. Fetches structured data from named workbooks and pricing sheets at
  inference time so Claude has live spreadsheet data when you are working on
  estimates, reports, or analysis. Do NOT invoke this template directly — use
  /meta-skill-creator to generate personal-connector-excel.
---

# Excel Connector Template

Reads structured data from Excel workbooks at inference time. Configure via
`/meta-skill-creator` to create `personal-connector-excel`.

## What to Configure (meta-skill-creator will ask)

- Which workbooks to read (local paths or OneDrive URLs)
- Which sheets or named ranges to extract
- What the data represents (e.g. "pricing rates", "project BOM", "rate card")
- Whether to fetch on demand or cache for the session

## What a Configured Connector Does

1. Opens the configured workbook(s) using Python (openpyxl) or the Microsoft
   Graph API (for OneDrive-hosted files)
2. Extracts the configured sheets or ranges as structured data
3. Returns the data as a markdown table or JSON block in context
4. Claude uses this for estimates, analysis, or populating templates

## Outcome

Spreadsheet data injected into task context as a structured table.

## Context Needs

| File | Load level | Purpose |
|------|-----------|---------|
| `context/USER.md` | External Systems field | Confirms Excel is configured |
| `context/learnings.md` | `## connector-excel` section | Prior usage notes |

## Dependencies

| Dependency | Required? | What it provides | Without it |
|-----------|-----------|-----------------|------------|
| `openpyxl` (Python) | For local files | Read .xlsx without Office | Use Graph API path instead |
| Microsoft Graph API | For OneDrive files | Remote file access | Use local file path |

## Rules
- Template only — do not run directly
- For local files: verify openpyxl is installed (`pip install openpyxl`)
- Never write back to the workbook — read-only access only
- Return no more than 500 rows without asking the employee to filter first

## Self-Update
Add workbook format issues and size limit patterns to Rules as encountered.
