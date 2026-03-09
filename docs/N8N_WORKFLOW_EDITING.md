# n8n workflow editing guidelines

Use this doc when editing workflow JSON (locally or via MCP). It reduces mistakes and keeps flows working.

## 1. Source of truth

- **Decide one canonical source:** e.g. `dev/[Project Name]/*.json` is truth; the n8n cloud instance is a deployment target.
- **Do not rewrite a workflow from scratch.** Start from the existing JSON (or the user’s backup). Preserve the graph and node names unless the user explicitly asks to change the flow.
- When the user provides a backup or “current” workflow, treat that as the structure to keep; only apply the minimal change they asked for.

## 2. Minimal edits only

- Change **only what’s requested** (e.g. one node’s `parameters.assignments`, or one node’s options).
- After edits: **same node set and same node names** unless the user asked to add/remove nodes. If you add or remove a node, update **every** connection that referenced the old structure.
- Do not remove nodes the user did not ask to remove (e.g. Global Variable, Edit Fields). Do not replace IF/Filter logic with different conditions unless asked.

## 3. How n8n connections work

- **Connections use node names.** Keys in `connections` are exact node names (e.g. `"Set Data"`, `"Loop Over Items"`). Renaming a node breaks every connection that references it.
- **Split In Batches (Loop Over Items):** Has **two** outputs:
  - **First output** (`main[0]`): when there are **no more items** (loop done). Often connects to nothing `[]` or to a final node.
  - **Second output** (`main[1]`): **next item** in the batch. This is the “process this item” path (e.g. → Set Data).
  - Wrong: connecting the “loop done” output to the main processing path. Right: second output → Set Data (or next step in the loop).
- **IF / Filter / HTTP (continueOnFail):** Two outputs = two arrays in `connections`. First = true/success, second = false/error. Keep the same order and semantics as in the user’s workflow.
- **Trigger:** Usually one output → first node (e.g. Global Variable or Get Leads). Do not insert an extra “Edit Fields” or empty Set in between unless the user asked for it.

## 4. Node-specific gotchas

- **Set node:** `parameters.assignments.assignments[]` with `id`, `name`, `value`, `type`. Use sheet column names exactly as in the user’s sheet (e.g. `profileLink`, `first_name`, `is_import_to_campagin`). For expressions use `={{ $json.fieldName }}`. Add `includeOtherFields: true` only if the backup had it.
- **Google Sheets “update”:** Needs a **unique key** to find the row (e.g. `profileLink` or `row_number`). Set `matchingColumns` to that key and include that key in `value` so the node knows which row to update. Do not use a non-unique column (e.g. `is_import_to_campagin`) as the only matching column unless the user’s backup explicitly does that.
- **IF / Filter:** Use the same `conditions` structure and `operator` as in the user’s workflow (e.g. `notEmpty`, `equals`, `notEqual`). Do not swap or guess condition format.
- **Credentials:** Preserve `credentials: {}` or the same credential references as in the backup; do not strip or change them unless asked.

## 5. Pre-push checklist

Before saving or syncing a workflow:

- [ ] Node count and node names match the user’s backup (or the requested diff).
- [ ] Every node name used in `connections` exists in `nodes`.
- [ ] Loop Over Items: second output goes to “process item” path; first output is “loop done”.
- [ ] Success vs error branches (HeyReach, IF, etc.) are wired correctly.
- [ ] Set Data (or the node you changed) uses the **exact** sheet column names the user provided.
- [ ] No unintended nodes removed (Global Variable, Filter, Wait, Wait1, Edit Fields, Mark as import, Mark as error, etc.).

## 6. Mistakes to avoid (log)

- **Replacing the whole workflow** instead of editing only the requested node (e.g. Set Data).
- **Removing or bypassing Global Variable** and changing the trigger → first-step flow.
- **Connecting the Loop’s “no more items” output** to the main processing path instead of the “next item” output.
- **Using wrong condition structure** for IF/Filter (e.g. wrong operator or leftValue).
- **Using wrong or non-unique matchingColumns** for Google Sheets update (e.g. matching on a boolean instead of profileLink/row_number).
- **Adding new nodes or branches** the user did not ask for (e.g. extra “Mark as Added to Campaign” with different semantics).
- **Ignoring the user’s backup** and inventing a new flow; always prefer their structure and only apply the minimal change.

---

When in doubt: **start from the user’s JSON, change one thing, then re-verify connections and node names.**
