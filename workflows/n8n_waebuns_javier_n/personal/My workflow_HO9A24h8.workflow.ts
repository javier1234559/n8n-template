import { workflow, node, links } from '@n8n-as-code/transformer';

// <workflow-map>
// Workflow : My workflow
// Nodes   : 13  |  Connections: 14
//
// NODE INDEX
// ──────────────────────────────────────────────────────────────────
// Property name                    Node type (short)         Flags
// If_                                if                         
// If1                                if                         
// Code                               code                       
// CreateNewFileAndCommit             github                     
// UpdateFileContentAndCommit         github                     
// LoopOverItems2                     splitInBatches             
// StickyNote5                        stickyNote                 
// GetAFile                           github                     
// Globals1                           set                        
// GetManyWorkflows                   n8n                        
// Every10Mins                        scheduleTrigger            
// Wait                               wait                       
// Wait1                              wait                       
//
// ROUTING MAP
// ──────────────────────────────────────────────────────────────────
// Every10Mins
//    → Globals1
//      → GetManyWorkflows
//        → LoopOverItems2
//         .out(1) → GetAFile
//            → If_
//              → Code
//                → If1
//                  → UpdateFileContentAndCommit
//                    → Wait
//                      → LoopOverItems2 (↩ loop)
//                 .out(1) → LoopOverItems2 (↩ loop)
//             .out(1) → CreateNewFileAndCommit
//                → Wait1
//                  → LoopOverItems2 (↩ loop)
// </workflow-map>

// =====================================================================
// METADATA DU WORKFLOW
// =====================================================================

@workflow({
    id: "HO9A24h8YFg3NnjE",
    name: "My workflow",
    active: false,
    settings: { executionOrder: "v1", availableInMCP: false }
})
export class MyWorkflow {

    // =====================================================================
// CONFIGURATION DES NOEUDS
// =====================================================================

    @node({
        id: "ad25c816-a64c-44b9-814a-326b27cff87c",
        name: "If",
        type: "n8n-nodes-base.if",
        version: 2.2,
        position: [368, 496]
    })
    If_ = {
        conditions: {
            options: {
                caseSensitive: true,
                leftValue: "",
                typeValidation: "strict",
                version: 2
            },
            conditions: [
                {
                    id: "16a9182d-059d-4774-ba95-654fb4293fdb",
                    leftValue: "={{ $json.error }}",
                    rightValue: "",
                    operator: {
                        type: "string",
                        operation: "notExists",
                        singleValue: true
                    }
                }
            ],
            combinator: "and"
        },
        options: {}
    };

    @node({
        id: "6fd5345d-2d4a-4fbd-bb0f-6778d054101c",
        name: "If1",
        type: "n8n-nodes-base.if",
        version: 2.2,
        position: [816, 480]
    })
    If1 = {
        conditions: {
            options: {
                caseSensitive: true,
                leftValue: "",
                typeValidation: "strict",
                version: 2
            },
            conditions: [
                {
                    id: "e0c66624-429a-4f1f-bf7b-1cc1b32bad7b",
                    leftValue: "={{ $json.content }}",
                    rightValue: "={{ $('Loop Over Items2').item.json.toJsonString() }}",
                    operator: {
                        type: "string",
                        operation: "notEquals"
                    }
                }
            ],
            combinator: "and"
        },
        options: {}
    };

    @node({
        id: "89f12736-4f0e-45df-9508-47e6c5138095",
        name: "Code",
        type: "n8n-nodes-base.code",
        version: 2,
        position: [608, 480]
    })
    Code = {
        jsCode: `let items = $input.all()

for (item of items) {
    item.json.content = Buffer.from(item.json.content, 'base64').toString('utf8')
}

return items;
`
    };

    @node({
        id: "17296d88-aa8e-428a-b056-1eb782031f87",
        webhookId: "8491fde6-8f34-4d5b-9b68-1f6206cc779e",
        name: "Create new file and commit",
        type: "n8n-nodes-base.github",
        version: 1,
        position: [608, 752]
    })
    CreateNewFileAndCommit = {
        resource: "file",
        owner: {
            __rl: true,
            value: "javier1234559",
            mode: "list",
            cachedResultName: "javier1234559",
            cachedResultUrl: "https://github.com/javier1234559"
        },
        repository: {
            __rl: true,
            value: "n8n-backup",
            mode: "list",
            cachedResultName: "n8n-backup",
            cachedResultUrl: "https://github.com/javier1234559/n8n-backup"
        },
        filePath: "={{$node[\"Globals1\"].json[\"repo\"][\"path\"]}}{{ $('Loop Over Items2').item.json.name }}.json",
        fileContent: "={{ $('Loop Over Items2').item.json.toJsonString()  }}",
        commitMessage: "=[N8N Backup] {{ $('Loop Over Items2').item.json.name }}.json"
    };

    @node({
        id: "e97c8fa0-6e60-49a3-bba3-c000a8ecadc3",
        webhookId: "e08d3b22-5d7c-4d08-bd6f-79f52c11760c",
        name: "Update file content and commit",
        type: "n8n-nodes-base.github",
        version: 1,
        position: [1056, 464]
    })
    UpdateFileContentAndCommit = {
        resource: "file",
        operation: "edit",
        owner: "={{$node[\"Globals1\"].json[\"repo\"][\"owner\"]}}",
        repository: "={{$node[\"Globals1\"].json[\"repo\"][\"name\"]}}",
        filePath: "={{$node[\"Globals1\"].json[\"repo\"][\"path\"]}}{{ $('Loop Over Items2').item.json.name }}.json",
        fileContent: "={{ $('Loop Over Items2').item.json.toJsonString()  }}",
        commitMessage: "=[N8N Backup] {{ $('Loop Over Items2').item.json.name }}.json"
    };

    @node({
        id: "39937c0d-6909-42ae-96f3-27a76dd5689c",
        name: "Loop Over Items2",
        type: "n8n-nodes-base.splitInBatches",
        version: 3,
        position: [-80, 416]
    })
    LoopOverItems2 = {
        options: {}
    };

    @node({
        id: "f3e1431a-f83e-4446-af17-c8bae6daa841",
        name: "Sticky Note5",
        type: "n8n-nodes-base.stickyNote",
        version: 1,
        position: [0, 96]
    })
    StickyNote5 = {
        content: `## Edit this node 👇
repo.owner = id github count
repo.name = github repo name`,
        height: 100,
        width: 270,
        color: 4
    };

    @node({
        id: "781288dc-a010-48f3-ba1b-23e39e093910",
        webhookId: "31886b56-83f2-44ff-ada2-cf2b62a11651",
        name: "Get a file",
        type: "n8n-nodes-base.github",
        version: 1,
        position: [160, 432]
    })
    GetAFile = {
        resource: "file",
        operation: "get",
        owner: "={{$node[\"Globals1\"].json[\"repo\"][\"owner\"]}}",
        repository: "={{$node[\"Globals1\"].json[\"repo\"][\"name\"]}}",
        filePath: "={{$node[\"Globals1\"].json[\"repo\"][\"path\"]}}{{$json[\"name\"]}}.json",
        asBinaryProperty: false,
        additionalParameters: {}
    };

    @node({
        id: "6cd158a2-d44b-4cb7-bb36-7b8a3fa2722b",
        name: "Globals1",
        type: "n8n-nodes-base.set",
        version: 1,
        position: [160, 208]
    })
    Globals1 = {
        values: {
            string: [
                {
                    name: "repo.owner",
                    value: "javier1234559"
                },
                {
                    name: "repo.name",
                    value: "n8n-backup"
                },
                {
                    name: "repo.path",
                    value: "workflows/"
                }
            ]
        },
        options: {}
    };

    @node({
        id: "9066d936-2e9a-4ac5-903e-4db3186fbbe0",
        name: "Get many workflows",
        type: "n8n-nodes-base.n8n",
        version: 1,
        position: [368, 208]
    })
    GetManyWorkflows = {
        filters: {
            activeWorkflows: false,
            excludePinnedData: true
        },
        requestOptions: {}
    };

    @node({
        id: "f52bab64-7ccc-4b23-937f-3ac70701741f",
        name: "Every 10 mins",
        type: "n8n-nodes-base.scheduleTrigger",
        version: 1.2,
        position: [-80, 208]
    })
    Every10Mins = {
        rule: {
            interval: [
                {
                    field: "minutes",
                    minutesInterval: 10
                }
            ]
        }
    };

    @node({
        id: "004d2b09-8e28-44df-aa85-3710fce24369",
        webhookId: "a0386b0e-868d-442e-9087-69d05c3ff278",
        name: "Wait",
        type: "n8n-nodes-base.wait",
        version: 1.1,
        position: [1264, 832]
    })
    Wait = {
        amount: 10
    };

    @node({
        id: "e8bcefb2-454a-46f9-bd3d-decf7611af8f",
        webhookId: "a0386b0e-868d-442e-9087-69d05c3ff278",
        name: "Wait1",
        type: "n8n-nodes-base.wait",
        version: 1.1,
        position: [864, 752]
    })
    Wait1 = {
        amount: 10
    };


    // =====================================================================
// ROUTAGE ET CONNEXIONS
// =====================================================================

    @links()
    defineRouting() {
        this.If_.out(0).to(this.Code.in(0));
        this.If_.out(1).to(this.CreateNewFileAndCommit.in(0));
        this.If1.out(0).to(this.UpdateFileContentAndCommit.in(0));
        this.If1.out(1).to(this.LoopOverItems2.in(0));
        this.Code.out(0).to(this.If1.in(0));
        this.CreateNewFileAndCommit.out(0).to(this.Wait1.in(0));
        this.UpdateFileContentAndCommit.out(0).to(this.Wait.in(0));
        this.LoopOverItems2.out(1).to(this.GetAFile.in(0));
        this.GetAFile.out(0).to(this.If_.in(0));
        this.Globals1.out(0).to(this.GetManyWorkflows.in(0));
        this.GetManyWorkflows.out(0).to(this.LoopOverItems2.in(0));
        this.Every10Mins.out(0).to(this.Globals1.in(0));
        this.Wait.out(0).to(this.LoopOverItems2.in(0));
        this.Wait1.out(0).to(this.LoopOverItems2.in(0));
    }
}