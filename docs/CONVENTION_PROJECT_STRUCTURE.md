# Convention: Project structure and file naming

All project-structure and workflow-naming conventions live here.

## Structure

```
n8n-template/
├── docs/               # Conventions and shared documentation
├── templates/          # Reusable workflow templates (reference only)
├── dev/
│   └── [Project Name]/    # One folder per project
│       ├── README.md      # Project-specific docs and workflow notes
│       └── *.json         # Workflow exports for this project
└── README.md
```

- **templates/** — Reusable workflows to copy or reference when building new flows. Not tied to a single project.
- **dev/[Project Name]/** — Each subfolder is one project. Put that project's workflow JSONs here and add a **README.md** describing the project and its workflows.

## File naming

Use this convention for workflow JSON files:

**`[Project name] - Dev - Project description.json`**

| Part                | Meaning                                                            |
| ------------------- | ------------------------------------------------------------------ |
| Project name        | Same as the folder name (e.g. `AAA - Linkedin Outreach`)           |
| Dev                 | Literal `- Dev -` (space, hyphen, space)                           |
| Project description | Short description of the workflow (e.g. `Import Lead to HeyReach`) |

**Example:**  
`AAA - Linkedin Outreach - Dev - Import Lead to HeyReach.json`  
→ Project: AAA - Linkedin Outreach, env: Dev, workflow: Import Lead to HeyReach.

## Per-project README

Inside each **dev/[Project Name]/** folder, keep a **README.md** that describes:

- What the project does
- Which workflows it includes and what each does
- Any setup or config (credentials, IDs, env vars) needed to run them
