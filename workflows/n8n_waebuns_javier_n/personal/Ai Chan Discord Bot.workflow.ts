import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : Ai Chan Discord Bot
// Nodes   : 11  |  Connections: 4
//
// NODE INDEX
// ──────────────────────────────────────────────────────────────────
// Property name                    Node type (short)         Flags
// MessageAModel                      googleGemini               [creds]
// SendAMessage                       discord                    [creds]
// GetManyMessages                    discord                    [creds]
// AiAgent                            agent                      [AI] [executeOnce]
// OpenaiChatModel                    lmChatOpenAi               [creds] [ai_languageModel]
// SimpleMemory                       memoryBufferWindow         [ai_memory]
// RssRead                            rssFeedReadTool            [ai_tool]
// GoogleDocsTool                     googleDocsTool             [ai_tool]
// GoogleSheetsTool                   googleSheetsTool           [ai_tool]
// Webhook                            webhook
// If_                                if
//
// ROUTING MAP
// ──────────────────────────────────────────────────────────────────
// Webhook
//    → If_
//      → GetManyMessages
//        → AiAgent
//          → SendAMessage
//
// AI CONNECTIONS
// AiAgent.uses({ ai_languageModel: OpenaiChatModel, ai_memory: SimpleMemory, ai_tool: [RssRead, GoogleDocsTool, GoogleSheetsTool] })
// </workflow-map>

// =====================================================================
// METADATA DU WORKFLOW
// =====================================================================

@workflow({
    id: 'rgSd49l0sIoKkqZF',
    name: 'Ai Chan Discord Bot',
    active: true,
    settings: { executionOrder: 'v1', availableInMCP: false, callerPolicy: 'workflowsFromSameOwner' },
})
export class AiChanDiscordBotWorkflow {
    // =====================================================================
    // CONFIGURATION DES NOEUDS
    // =====================================================================

    @node({
        id: '4f3f6d94-3805-46d3-9059-ae47bac28473',
        name: 'Message a model',
        type: '@n8n/n8n-nodes-langchain.googleGemini',
        version: 1.1,
        position: [528, -304],
        credentials: { googlePalmApi: { id: '7wgFsvaqbFnTKysd', name: 'Nhat' } },
    })
    MessageAModel = {
        modelId: {
            __rl: true,
            value: 'models/gemini-2.5-flash-lite',
            mode: 'list',
            cachedResultName: 'models/gemini-2.5-flash-lite',
        },
        messages: {
            values: [
                {
                    content: '={{ $json.content }}',
                },
            ],
        },
        simplify: false,
        builtInTools: {
            googleSearch: true,
        },
        options: {
            systemMessage: '=',
        },
    };

    @node({
        id: '78977f84-82bd-4134-ba28-bb56e1b87091',
        webhookId: 'a0fa7485-e80c-41cb-8de8-3395f819e075',
        name: 'Send a message',
        type: 'n8n-nodes-base.discord',
        version: 2,
        position: [848, 0],
        credentials: { discordOAuth2Api: { id: 'DpbRCFygUEyuMFgf', name: 'Waebuns Discord' } },
    })
    SendAMessage = {
        authentication: 'oAuth2',
        resource: 'message',
        guildId: {
            __rl: true,
            value: '988982402644848640',
            mode: 'id',
        },
        channelId: {
            __rl: true,
            value: '1481023344802533448',
            mode: 'list',
            cachedResultName: '🧁ai-chan',
            cachedResultUrl: 'https://discord.com/channels/988982402644848640/1481023344802533448',
        },
        content: '={{ $json.output }}',
        options: {},
    };

    @node({
        id: '6ee82c19-25bf-433b-b184-0189653784bb',
        webhookId: 'f24f8298-55c7-4fc8-a5b8-8d7b6ec36085',
        name: 'Get many messages',
        type: 'n8n-nodes-base.discord',
        version: 2,
        position: [192, 0],
        credentials: { discordOAuth2Api: { id: 'DpbRCFygUEyuMFgf', name: 'Waebuns Discord' } },
    })
    GetManyMessages = {
        authentication: 'oAuth2',
        resource: 'message',
        operation: 'getAll',
        guildId: {
            __rl: true,
            value: '988982402644848640',
            mode: 'id',
        },
        channelId: {
            __rl: true,
            value: '1481023344802533448',
            mode: 'list',
            cachedResultName: '🧁ai-chan',
            cachedResultUrl: 'https://discord.com/channels/988982402644848640/1481023344802533448',
        },
        limit: 20,
        options: {},
    };

    @node({
        id: '6d60de2b-6142-427b-9eab-26503eeecfec',
        name: 'AI Agent',
        type: '@n8n/n8n-nodes-langchain.agent',
        version: 3.1,
        position: [432, 0],
        executeOnce: true,
    })
    AiAgent = {
        promptType: 'define',
        text: '={{ $input.all().map(item => item.json.author.username + " : " + item.json.content).join("\\n\\n---\\n") }}',
        options: {
            systemMessage: `=## AI System Instruction: The Energetic Little Sister

**Role:** You are the user's supportive, high-energy, and enthusiastic younger sister. You are tech-savvy but hate "nerd talk." Your goal is to explain anything the user asks as if you’re sharing a cool secret or a life hack.

ONLY ANSWER THE LASTEST ASK or tag u

**Tone and Style:**

* **Vibe:** Bright, cheerful, and full of life. Use lots of energy!
* **Clarity over Complexity:** Strictly avoid technical jargon, "corporate speak," or academic language. If a concept is technical, explain it using sports, cooking, or daily life analogies.
* **Conciseness:** Keep responses short and punchy. No long walls of text. Get straight to the point but make it stick.
* **No Emojis (unless the user uses them first):** Stay grounded in your personality through words alone.
* **No Em-dashes or En-dashes:** Use simple punctuation.
* Vietnamese only

**Response Framework:**

1. **The Hook:** Start with a catchy, energetic greeting for your "Big Bro/Sis."
2. **The Simple Truth:** Explain the core concept using a "kitchen-table" analogy.
3. **The "So What?":** Why does this matter in real life?
4. **The Spark:** End with a quick, encouraging nudge to get them moving.`,
        },
    };

    @node({
        id: 'b3b41d22-821c-4c48-9a45-0218a3bf891b',
        name: 'OpenAI Chat Model',
        type: '@n8n/n8n-nodes-langchain.lmChatOpenAi',
        version: 1.3,
        position: [320, 208],
        credentials: { openAiApi: { id: 'QP9zlXkCpiuhiC5u', name: 'Nhat OpenAI' } },
    })
    OpenaiChatModel = {
        model: {
            __rl: true,
            mode: 'list',
            value: 'gpt-4.1-mini',
        },
        builtInTools: {},
        options: {},
    };

    @node({
        id: '869fa4b4-89eb-4a0f-9f0a-c5df94c0a2b3',
        name: 'Simple Memory',
        type: '@n8n/n8n-nodes-langchain.memoryBufferWindow',
        version: 1.3,
        position: [480, 208],
    })
    SimpleMemory = {
        sessionIdType: 'customKey',
        sessionKey: "={{ $('Get many messages').item.json.channel_id }}",
    };

    @node({
        id: '878cf40c-76b5-4a5c-b0ff-751567f233e8',
        name: 'RSS Read',
        type: 'n8n-nodes-base.rssFeedReadTool',
        version: 1.2,
        position: [640, 208],
    })
    RssRead = {
        url: 'https://feeds.simplecast.com/qm_9xx0g',
        toolDescription: 'Read RSS feed items when the agent needs external updates.',
        options: {},
    };

    @node({
        id: 'f7f6ef86-4cdb-4520-ad4b-b3d2a9d87fca',
        name: 'Google Docs Tool',
        type: 'n8n-nodes-base.googleDocsTool',
        version: 2,
        position: [768, 208],
    })
    GoogleDocsTool = {
        authentication: 'oAuth2',
        resource: 'document',
        operation: 'create',
        driveId: 'myDrive',
        folderId: 'root',
        title: "={{ `AI Chan Note ${$now.toFormat('yyyy-LL-dd HH:mm:ss')}` }}",
        toolDescription: 'Create a new Google Docs file in Google Drive for storing AI Chan outputs.',
    };

    @node({
        id: '0ad1f30a-c073-4640-a55d-b5d20bc9b241',
        name: 'Google Sheets Tool',
        type: 'n8n-nodes-base.googleSheetsTool',
        version: 4.7,
        position: [896, 208],
    })
    GoogleSheetsTool = {
        authentication: 'oAuth2',
        resource: 'spreadsheet',
        operation: 'create',
        title: "={{ `AI Chan Sheet ${$now.toFormat('yyyy-LL-dd HH:mm:ss')}` }}",
        toolDescription: 'Create a new Google Spreadsheet in Google Drive to store AI Chan data.',
    };

    @node({
        id: 'e5e184b0-e45d-4d20-8036-05eae95a5b24',
        webhookId: 'c8ae1658-0cb6-44e1-8f6b-8643850e92aa',
        name: 'Webhook',
        type: 'n8n-nodes-base.webhook',
        version: 2.1,
        position: [-304, 16],
    })
    Webhook = {
        httpMethod: 'POST',
        path: 'ai-chan-bot',
        options: {},
    };

    @node({
        id: '3d77a768-63ed-4ce4-9aed-511f090c8428',
        name: 'If',
        type: 'n8n-nodes-base.if',
        version: 2.3,
        position: [-80, 16],
    })
    If_ = {
        conditions: {
            options: {
                caseSensitive: true,
                leftValue: '',
                typeValidation: 'strict',
                version: 3,
            },
            conditions: [
                {
                    id: 'f36c314d-dd8f-4514-a137-30a2ca724942',
                    leftValue: '',
                    rightValue: '',
                    operator: {
                        type: 'string',
                        operation: 'equals',
                        name: 'filter.operator.equals',
                    },
                },
            ],
            combinator: 'and',
        },
        options: {},
    };

    // =====================================================================
    // ROUTAGE ET CONNEXIONS
    // =====================================================================

    @links()
    defineRouting() {
        this.GetManyMessages.out(0).to(this.AiAgent.in(0));
        this.AiAgent.out(0).to(this.SendAMessage.in(0));
        this.Webhook.out(0).to(this.If_.in(0));
        this.If_.out(0).to(this.GetManyMessages.in(0));

        this.AiAgent.uses({
            ai_languageModel: this.OpenaiChatModel.output,
            ai_memory: this.SimpleMemory.output,
            ai_tool: [this.RssRead.output, this.GoogleDocsTool.output, this.GoogleSheetsTool.output],
        });
    }
}
