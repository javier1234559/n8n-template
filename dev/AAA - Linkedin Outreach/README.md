# AAA - Linkedin Outreach

Project workflows for LinkedIn outreach (HeyReach) and HubSpot CRM sync.

## Workflows

### 1. Webhook (`AAA - Linkedin Outreach - Dev - Webhook.json`)

- **Trigger:** Webhook (POST) at path `webhook`
- **Flow:** Receives payload → Set node stores `received` (body or full JSON) → returns last node output
- **In n8n:** [Open workflow](https://n8n.waebuns.com/projects/81WdIT6ivkvOdyLq/workflows/dM5RMAP4W5QZGxo2) — move it into your folder via the UI (⋯ → Move to folder) if needed.

### 2. Import Lead to HeyReach (`AAA - Linkedin Outreach - Dev - Import Lead to HeyReach.json`)

- **Trigger:** Manual
- **Flow:** Google Sheet → loop each row → import lead to HeyReach (HTTP) → on error update sheet with `is_error` / `error_message` → if `In_campaign` add to campaign → loop back
- **Configure:** Spreadsheet ID, sheet name, HeyReach API key, list ID, campaign ID, LinkedIn account ID. See root README for details.

### 3. Webhook HeyReach add to HubSpot CRM (`AAA - Linkedin Outreach - Dev - Webhook HeyReach add to HubSpot CRM.json`)

- **Trigger:** Webhook (POST) – events from HeyReach/outreach
- **Flow:**
  1. **Webhook Data** – Map body to `firstname`, `lastname`, `email`, `linkedin`, `company_name`, `company_domain`. All later nodes use this Set as the single source of variables.
  2. **Company** – Search HubSpot by `company_domain` → if not found: create company → wait 5s → search again → set company data (companyId, companyName) into the flow.
  3. **Contact** – Search HubSpot by `email` → if not found: create/update contact (upsert) → wait 5s → search again → set contact data (contactId).
  4. **Deal** – Create deal (stage required), associate company + contact → wait 5s → set deal data (dealId, dealUrl).
  5. **Slack** – Send notification with contact/company and link to deal.

**Configure in n8n:**

- **Webhook HeyReach:** Path (e.g. `heyreach-to-hubspot`). Point HeyReach webhook to this URL.
- **Webhook body:** Ensure your payload uses `firstname`/`firstName`, `lastname`/`lastName`, `email`, `linkedin`/`linkedInProfileUrl`, `company_name`/`companyName`, `company_domain`/`domain` (or adjust expressions in **Webhook Data**).
- **HubSpot:** Credentials (API key or OAuth2). Company search uses **searchByDomain** (needs `company_domain`). Contact search uses **search** with email filter. Deal **create** needs a valid **stage** (e.g. replace `appointmentscheduled` with your pipeline stage ID from HubSpot).
- **Set Deal Data:** Set `dealUrl` to your HubSpot URL pattern (replace `YOUR_PORTAL_ID` with your HubSpot portal ID).
- **Slack Notification:** Set channel (e.g. `#leads`) and credentials. For Block Kit UI, use the Slack node’s **Blocks** option and paste a [Block Kit](https://app.slack.com/block-kit-builder) JSON that uses `{{ $json.firstname }}`, `{{ $json.dealUrl }}`, etc.

**Merge behaviour:** When a search returns no rows, the Merge node still runs with one empty input and keeps the other (webhook/company/contact) so the “create then search again” path works.
