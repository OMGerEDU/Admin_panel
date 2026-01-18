# .gitignore

```
### VisualStudioCode ###
.vscode/*
!.vscode/settings.json
!.vscode/tasks.json
!.vscode/launch.json
!.vscode/extensions.json
!.vscode/*.code-snippets

# Local History for Visual Studio Code
.history/

# Built Visual Studio Code Extensions
*.vsix

### VisualStudioCode Patch ###
# Ignore all local history of files
.history
.ionide

# End of https://www.toptal.com/developers/gitignore/api/visualstudiocode
node_modules
```

# favicon.png

This is a binary file of the type: Image

# images\brand\cover-white.png

This is a binary file of the type: Image

# images\brand\cover.png

This is a binary file of the type: Image

# mint.json

```json
{
  "$schema": "https://mintlify.com/schema.json",
  "name": "Evolution API Documentation",
  "versions": ["v1", "v2"],
  "openapi": ["/openapi/openapi-v1.json", "/openapi/openapi-fixed.json"],
  "feedback": {
    "suggestEdit": false
  },
  "logo": {
    "dark": "/images/brand/cover-white.png",
    "light": "/images/brand/cover.png"
  },
  "favicon": "/favicon.png",
  "colors": {
    "primary": "#49BC94",
    "light": "#49BC94",
    "dark": "#49BC94",
    "background": {
      "dark": "#18181B"
    },
    "anchors": {
      "from": "#FF7F57",
      "to": "#9563FF"
    }
  },
  "topbarCtaButton": {
    "name": "GitHub",
    "url": "https://github.com/EvolutionAPI/evolution-api"
  },
  "primaryTab": {
    "name": "Português",
    "isDefaultHidden": true
  },
  "tabs": [
    {
      "name": "Português",
      "url": "v1/pt",
      "version": "v1"
    },
    {
      "name": "Português",
      "url": "v2/pt",
      "version": "v2"
    },
    {
      "name": "English",
      "url": "v2/en",
      "version": "v2"
    },
    {
      "name": "English",
      "url": "v1/en",
      "version": "v1"
    },
    {
      "name": "API",
      "url": "v1/api-reference",
      "version": "v1"
    },
    {
      "name": "API",
      "url": "v2/api-reference",
      "version": "v2"
    }
  ],
  "navigation": [
    {
      "group": "Iniciar",
      "pages": [
        "v2/pt/get-started/introduction",
        {
          "group": "Pré-requisitos",
          "icon": "triangle-exclamation",
          "pages": ["v2/pt/requirements/database", "v2/pt/requirements/redis"]
        },
        {
          "group": "Instalação",
          "icon": "wrench",
          "pages": [
            "v2/pt/install/docker",
            "v2/pt/install/nvm",
            "v2/pt/install/nginx"
          ]
        },
        {
          "group": "Integrações",
          "icon": "toolbox",
          "pages": [
            {
              "group": "Eventos",
              "icon": "calendar",
              "pages": [
                "v2/pt/integrations/websocket",
                "v2/pt/integrations/rabbitmq",
                "v2/pt/integrations/sqs"
              ]
            },
            {
              "group": "Chatbots",
              "icon": "robot",
              "pages": [
                "v2/pt/integrations/chatwoot",
                "v2/pt/integrations/evoai",
                "v2/pt/integrations/evolution-bot",
                "v2/pt/integrations/typebot",
                "v2/pt/integrations/openai",
                "v2/pt/integrations/dify",
                "v2/pt/integrations/flowise"
              ]
            },
            {
              "group": "Canais",
              "icon": "message",
              "pages": [
                "v2/pt/integrations/cloudapi",
                "v2/pt/integrations/evolution-channel"
              ]
            },
            {
              "group": "Armazenamento",
              "icon": "database",
              "pages": ["v2/pt/integrations/s3minio"]
            }
          ]
        },
        "v2/pt/env",
        "v2/pt/updates",
        {
          "group": "Configuração",
          "icon": "wrench",
          "pages": [
            "v2/pt/configuration/available-resources",
            "v2/pt/configuration/webhooks"
          ]
        }
      ],
      "version": "v2"
    },
    {
      "group": "Getting Started",
      "pages": [
        "v2/en/get-started/introduction",
        {
          "group": "Requirements",
          "icon": "triangle-exclamation",
          "pages": ["v2/en/requirements/database", "v2/en/requirements/redis"]
        },
        {
          "group": "Install",
          "icon": "wrench",
          "pages": [
            "v2/en/install/docker",
            "v2/en/install/nvm",
            "v2/en/install/nginx"
          ]
        },
        {
          "group": "Integrations",
          "icon": "toolbox",
          "pages": [
            {
              "group": "Events",
              "icon": "calendar",
              "pages": [
                "v2/en/integrations/websocket",
                "v2/en/integrations/rabbitmq",
                "v2/en/integrations/sqs"
              ]
            },
            {
              "group": "Chatbots",
              "icon": "robot",
              "pages": [
                "v2/en/integrations/chatwoot",
                "v2/en/integrations/evoai",
                "v2/en/integrations/evolution-bot",
                "v2/en/integrations/typebot",
                "v2/en/integrations/openai",
                "v2/en/integrations/dify",
                "v2/en/integrations/flowise"
              ]
            },
            {
              "group": "Channels",
              "icon": "message",
              "pages": [
                "v2/en/integrations/cloudapi",
                "v2/en/integrations/evolution-channel"
              ]
            },
            {
              "group": "Storage",
              "icon": "database",
              "pages": ["v2/en/integrations/s3minio"]
            }
          ]
        },
        "v2/en/env",
        "v2/en/updates",
        {
          "group": "Configuration",
          "icon": "wrench",
          "pages": [
            "v2/en/configuration/available-resources",
            "v2/en/configuration/webhooks"
          ]
        }
      ],
      "version": "v2"
    },
    {
      "group": "Início",
      "pages": ["v2/api-reference/get-information"],
      "version": "v2"
    },
    {
      "group": "Instances",
      "pages": [
        "v2/api-reference/instance-controller/create-instance-basic",
        "v2/api-reference/instance-controller/fetch-instances",
        "v2/api-reference/instance-controller/instance-connect",
        "v2/api-reference/instance-controller/restart-instance",
        "v2/api-reference/instance-controller/connection-state",
        "v2/api-reference/instance-controller/logout-instance",
        "v2/api-reference/instance-controller/delete-instance",
        "v2/api-reference/instance-controller/set-presence"
      ],
      "version": "v2"
    },
    {
      "group": "Webhook",
      "pages": [
        "v2/api-reference/webhook/set", 
        "v2/api-reference/webhook/get"
      ],
      "version": "v2"
    },
    {
      "group": "Settings",
      "pages": [
        "v2/api-reference/settings/set",
        "v2/api-reference/settings/get"
      ],
      "version": "v2"
    },
    {
      "group": "Send Message",
      "pages": [
        "v2/api-reference/message-controller/send-text",
        "v2/api-reference/message-controller/send-status",
        "v2/api-reference/message-controller/send-media",
        "v2/api-reference/message-controller/send-audio",
        "v2/api-reference/message-controller/send-sticker",
        "v2/api-reference/message-controller/send-location",
        "v2/api-reference/message-controller/send-contact",
        "v2/api-reference/message-controller/send-reaction",
        "v2/api-reference/message-controller/send-poll",
        "v2/api-reference/message-controller/send-list",
        "v2/api-reference/message-controller/send-button"
      ],
      "version": "v2"
    },
    {
      "group": "Chat Controller",
      "pages": [
        "v2/api-reference/chat-controller/check-is-whatsapp",
        "v2/api-reference/chat-controller/mark-as-read",
        "v2/api-reference/chat-controller/mark-as-unread",
        "v2/api-reference/chat-controller/archive-chat",
        "v2/api-reference/chat-controller/delete-message-for-everyone",
        "v2/api-reference/chat-controller/update-message",
        "v2/api-reference/chat-controller/send-presence",
        "v2/api-reference/chat-controller/updateBlockStatus",
        "v2/api-reference/chat-controller/fetch-profilepic-url",
        "v2/api-reference/chat-controller/get-base64",
        "v2/api-reference/chat-controller/find-contacts",
        "v2/api-reference/chat-controller/find-messages",
        "v2/api-reference/chat-controller/find-status-message",
        "v2/api-reference/chat-controller/find-chats"
      ],
      "version": "v2"
    },
    {
      "group": "Profile Settings",
      "pages": [
        "v2/api-reference/profile-settings/fetch-business-profile",
        "v2/api-reference/profile-settings/fetch-profile",
        "v2/api-reference/profile-settings/update-profile-name",
        "v2/api-reference/profile-settings/update-profile-status",
        "v2/api-reference/profile-settings/update-profile-picture",
        "v2/api-reference/profile-settings/remove-profile-picture",
        "v2/api-reference/profile-settings/fetch-privacy-settings",
        "v2/api-reference/profile-settings/update-privacy-settings"
      ],
      "version": "v2"
    },
    {
      "group": "Group Controller",
      "pages": [
        "v2/api-reference/group-controller/group-create",
        "v2/api-reference/group-controller/update-group-picture",
        "v2/api-reference/group-controller/update-group-subject",
        "v2/api-reference/group-controller/update-group-description",
        "v2/api-reference/group-controller/fetch-invite-code",
        "v2/api-reference/group-controller/revoke-invite-code",
        "v2/api-reference/group-controller/send-invite-url",
        "v2/api-reference/group-controller/find-group-by-invite-code",
        "v2/api-reference/group-controller/find-group-by-jid",
        "v2/api-reference/group-controller/fetch-all-groups",
        "v2/api-reference/group-controller/find-participants",
        "v2/api-reference/group-controller/update-participant",
        "v2/api-reference/group-controller/update-setting",
        "v2/api-reference/group-controller/toggle-ephemeral",
        "v2/api-reference/group-controller/leave-group"
      ],
      "version": "v2"
    },
    {
      "group": "Typebot",
      "pages": [
        "v2/api-reference/integrations/typebot/set-typebot",
        "v2/api-reference/integrations/typebot/start-typebot",
        "v2/api-reference/integrations/typebot/find-typebot",
        "v2/api-reference/integrations/typebot/fetch-typebot",
        "v2/api-reference/integrations/typebot/update-typebot",
        "v2/api-reference/integrations/typebot/delete-typebot",
        "v2/api-reference/integrations/typebot/change-session-status",
        "v2/api-reference/integrations/typebot/fetch-session",
        "v2/api-reference/integrations/typebot/settings-typebot",
        "v2/api-reference/integrations/typebot/find-settings-typebot"
      ],
      "version": "v2"
    },
    {
      "group": "OpenAI",
      "pages": [
        "v2/api-reference/integrations/openai/create-bot",
        "v2/api-reference/integrations/openai/find-bot",
        "v2/api-reference/integrations/openai/find-bots",
        "v2/api-reference/integrations/openai/update-bot",
        "v2/api-reference/integrations/openai/delete-bot",
        "v2/api-reference/integrations/openai/find-creds-openai",
        "v2/api-reference/integrations/openai/set-creds",
        "v2/api-reference/integrations/openai/delete-creds",
        "v2/api-reference/integrations/openai/settings-openai",
        "v2/api-reference/integrations/openai/find-settings",
        "v2/api-reference/integrations/openai/change-status",
        "v2/api-reference/integrations/openai/find-session"
      ],
      "version": "v2"
    },
    {
      "group": "Evolution Bot",
      "pages": [
        "v2/api-reference/integrations/evolution/create-bot",
        "v2/api-reference/integrations/evolution/find-bot",
        "v2/api-reference/integrations/evolution/fetch-bots",
        "v2/api-reference/integrations/evolution/update",
        "v2/api-reference/integrations/evolution/delete-bot",
        "v2/api-reference/integrations/evolution/set-settings",
        "v2/api-reference/integrations/evolution/find-settings",
        "v2/api-reference/integrations/evolution/change-status-session",
        "v2/api-reference/integrations/evolution/fetch-session"
      ],
      "version": "v2"
    },
    {
      "group": "Dify",
      "pages": [
        "v2/api-reference/integrations/dify/create-dify",
        "v2/api-reference/integrations/dify/find-dify",
        "v2/api-reference/integrations/dify/find-bot-dify",
        "v2/api-reference/integrations/dify/update-dify",
        "v2/api-reference/integrations/dify/set-settings-dify",
        "v2/api-reference/integrations/dify/find-settings",
        "v2/api-reference/integrations/dify/change-status",
        "v2/api-reference/integrations/dify/find-status"
      ],
      "version": "v2"
    },
    
    {
      "group": "n8n",
      "pages": [
        "v2/api-reference/integrations/n8n/create-n8n",
        "v2/api-reference/integrations/n8n/find-n8n",
        "v2/api-reference/integrations/n8n/update-n8n",
        "v2/api-reference/integrations/n8n/set-settings-n8n",
        "v2/api-reference/integrations/n8n/find-settings",
        "v2/api-reference/integrations/n8n/change-status",
        "v2/api-reference/integrations/n8n/find-status"
      ],
      "version": "v2"
    },
    {
      "group": "EvoAI",
      "pages": [
        "v2/api-reference/integrations/evoai/create-evoai",
        "v2/api-reference/integrations/evoai/find-evoai",
        "v2/api-reference/integrations/evoai/update-evoai",
        "v2/api-reference/integrations/evoai/set-settings-evoai",
        "v2/api-reference/integrations/evoai/find-settings",
        "v2/api-reference/integrations/evoai/change-status",
        "v2/api-reference/integrations/evoai/find-status"
      ],
      "version": "v2"
    },
    {
      "group": "Flowise",
      "pages": [
        "v2/api-reference/integrations/flowise/create-bot",
        "v2/api-reference/integrations/flowise/find-flowise-bots",
        "v2/api-reference/integrations/flowise/find-flowise-bot",
        "v2/api-reference/integrations/flowise/update-flowise-bot",
        "v2/api-reference/integrations/flowise/delete-flowise-bot",
        "v2/api-reference/integrations/flowise/set-settings",
        "v2/api-reference/integrations/flowise/find-settings",
        "v2/api-reference/integrations/flowise/change-session-status",
        "v2/api-reference/integrations/flowise/find-sessions"
      ],
      "version": "v2"
    },
    {
      "group": "Chatwoot",
      "pages": [
        "v2/api-reference/integrations/chatwoot/set-chatwoot",
        "v2/api-reference/integrations/chatwoot/find-chatwoot"
        
      ],
      "version": "v2"
    },
    {
      "group": "Websocket",
      "pages": [
        "v2/api-reference/integrations/websocket/set-websocket",
        "v2/api-reference/integrations/websocket/find-websocket"
      ],
      "version": "v2"
    },
    {
      "group": "SQS",
      "pages": [
        "v2/api-reference/integrations/sqs/set-sqs",
        "v2/api-reference/integrations/sqs/find-sqs"
      ],
      "version": "v2"
    },
    {
      "group": "RabbitMQ",
      "pages": [
        "v2/api-reference/integrations/rabbitmq/set-rabbitmq",
        "v2/api-reference/integrations/rabbitmq/find-rabbitmq"
      ],
      "version": "v2"
    },
    {
      "group": "Iniciar",
      "pages": [
        "v1/pt/get-started/introduction",
        {
          "group": "Instalação",
          "icon": "wrench",
          "pages": ["v1/pt/install/docker", "v1/pt/install/nvm"]
        },
        {
          "group": "Recursos Opcionais",
          "icon": "toolbox",
          "pages": [
            "v1/pt/optional-resources/mongo-db",
            "v1/pt/optional-resources/rabbitmq",
            "v1/pt/optional-resources/redis",
            "v1/pt/optional-resources/websocket"
          ]
        },
        "v1/pt/env",
        "v1/pt/updates",
        {
          "group": "Configuração",
          "icon": "wrench",
          "pages": [
            "v1/pt/configuration/available-resources",
            "v1/pt/configuration/webhooks"
          ]
        }
      ],
      "version": "v1"
    },
    {
      "group": "Getting Started",
      "pages": [
        "v1/en/get-started/introduction",
        {
          "group": "Install",
          "icon": "wrench",
          "pages": ["v1/en/install/docker", "v1/en/install/nvm"]
        },
        {
          "group": "Optional Resources",
          "icon": "toolbox",
          "pages": [
            "v1/en/optional-resources/mongo-db",
            "v1/en/optional-resources/rabbitmq",
            "v1/en/optional-resources/redis",
            "v1/en/optional-resources/websocket"
          ]
        },
        "v1/en/env",
        "v1/en/updates",
        {
          "group": "Configuration",
          "icon": "wrench",
          "pages": [
            "v1/en/configuration/available-resources",
            "v1/en/configuration/webhooks"
          ]
        }
      ],
      "version": "v1"
    },
    {
      "group": "Início",
      "pages": ["v1/api-reference/get-information"],
      "version": "v1"
    },
    {
      "group": "Instances",
      "pages": [
        "v1/api-reference/instance-controller/create-instance-basic",
        "v1/api-reference/instance-controller/fetch-instances",
        "v1/api-reference/instance-controller/instance-connect",
        "v1/api-reference/instance-controller/restart-instance",
        "v1/api-reference/instance-controller/connection-state",
        "v1/api-reference/instance-controller/logout-instance",
        "v1/api-reference/instance-controller/delete-instance",
        "v1/api-reference/instance-controller/set-presence"
      ],
      "version": "v1"
    },
    {
      "group": "Webhook",
      "pages": ["v1/api-reference/webhook/set", "v1/api-reference/webhook/get"],
      "version": "v1"
    },
    {
      "group": "Settings",
      "pages": [
        "v1/api-reference/settings/set",
        "v1/api-reference/settings/get"
      ],
      "version": "v1"
    },
    {
      "group": "Send Message",
      "pages": [
        "v1/api-reference/message-controller/send-template",
        "v1/api-reference/message-controller/send-text",
        "v1/api-reference/message-controller/send-status",
        "v1/api-reference/message-controller/send-media",
        "v1/api-reference/message-controller/send-audio",
        "v1/api-reference/message-controller/send-sticker",
        "v1/api-reference/message-controller/send-location",
        "v1/api-reference/message-controller/send-contact",
        "v1/api-reference/message-controller/send-reaction",
        "v1/api-reference/message-controller/send-poll",
        "v1/api-reference/message-controller/send-list"
      ],
      "version": "v1"
    },
    {
      "group": "Chat Controller",
      "pages": [
        "v1/api-reference/chat-controller/check-is-whatsapp",
        "v1/api-reference/chat-controller/mark-as-read",
        "v1/api-reference/chat-controller/archive-chat",
        "v1/api-reference/chat-controller/delete-message-for-everyone",
        "v1/api-reference/chat-controller/send-presence",
        "v1/api-reference/chat-controller/fetch-profilepic-url",
        "v1/api-reference/chat-controller/find-contacts",
        "v1/api-reference/chat-controller/find-messages",
        "v1/api-reference/chat-controller/find-status-message",
        "v1/api-reference/chat-controller/update-message",
        "v1/api-reference/chat-controller/find-chats"
      ],
      "version": "v1"
    },
    {
      "group": "Profile Settings",
      "pages": [
        "v1/api-reference/profile-settings/fetch-business-profile",
        "v1/api-reference/profile-settings/fetch-profile",
        "v1/api-reference/profile-settings/update-profile-name",
        "v1/api-reference/profile-settings/update-profile-status",
        "v1/api-reference/profile-settings/update-profile-picture",
        "v1/api-reference/profile-settings/remove-profile-picture",
        "v1/api-reference/profile-settings/fetch-privacy-settings",
        "v1/api-reference/profile-settings/update-privacy-settings"
      ],
      "version": "v1"
    },
    {
      "group": "Group Controller",
      "pages": [
        "v1/api-reference/group-controller/group-create",
        "v1/api-reference/group-controller/update-group-picture",
        "v1/api-reference/group-controller/update-group-subject",
        "v1/api-reference/group-controller/update-group-description",
        "v1/api-reference/group-controller/fetch-invite-code",
        "v1/api-reference/group-controller/accept-invite-code",
        "v1/api-reference/group-controller/revoke-invite-code",
        "v1/api-reference/group-controller/send-invite-url",
        "v1/api-reference/group-controller/find-group-by-invite-code",
        "v1/api-reference/group-controller/find-group-by-jid",
        "v1/api-reference/group-controller/fetch-all-groups",
        "v1/api-reference/group-controller/find-participants",
        "v1/api-reference/group-controller/update-participant",
        "v1/api-reference/group-controller/update-setting",
        "v1/api-reference/group-controller/toggle-ephemeral",
        "v1/api-reference/group-controller/leave-group"
      ],
      "version": "v1"
    },
    {
      "group": "Typebot",
      "pages": [
        "v1/api-reference/integrations/typebot/set-typebot",
        "v1/api-reference/integrations/typebot/start-typebot",
        "v1/api-reference/integrations/typebot/find-typebot",
        "v1/api-reference/integrations/typebot/change-session-status"
      ],
      "version": "v1"
    },
    {
      "group": "Chatwoot",
      "pages": [
        "v1/api-reference/integrations/chatwoot/set-chatwoot",
        "v1/api-reference/integrations/chatwoot/find-chatwoot"
      ],
      "version": "v1"
    },
    {
      "group": "SQS",
      "pages": [
        "v1/api-reference/integrations/sqs/set-sqs",
        "v1/api-reference/integrations/sqs/find-sqs"
      ],
      "version": "v1"
    },
    {
      "group": "RabbitMQ",
      "pages": [
        "v1/api-reference/integrations/rabbitmq/set-rabbitmq",
        "v1/api-reference/integrations/rabbitmq/find-rabbitmq"
      ],
      "version": "v1"
    },
    {
      "group": "WebSocket",
      "pages": [
        "v1/api-reference/integrations/websocket/set-websocket",
        "v1/api-reference/integrations/websocket/find-websocket"
      ],
      "version": "v1"
    }
  ],
  "footerSocials": {
    "website": "https://evolution-api.com",
    "github": "https://github.com/EvolutionAPI/evolution-api"
  }
}

```

# openapi\openapi-v1.json

```json
{
  "openapi": "3.0.3",
  "info": {
    "title": "Evolution API",
    "version": "1.7.1"
  },
  "servers": [
    {
      "url": "https://{server-url}",
      "variables": {
        "server-url": {
          "default": "evolution-example",
          "description": "The URL of your EvolutionAPI server"
        }
      },
      "description": "Your instance domain"
    }
  ],
  "paths": {
    "/instance/create": {
      "post": {
        "operationId": "createInstance",
        "summary": "Create Instance",
        "tags": ["Instance Controller"],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": ["instanceName"],
                "properties": {
                  "instanceName": {
                    "type": "string",
                    "description": "instance (Instance name)"
                  },
                  "token": {
                    "type": "string",
                    "description": "apikey (Enter or leave empty to create dynamically)"
                  },
                  "qrcode": {
                    "type": "boolean",
                    "description": "Create QR Code automatically after creation"
                  },
                  "number": {
                    "type": "string",
                    "description": "559999999999 (Instance owner number with Country Code)"
                  },
                  "integration": {
                    "type": "string",
                    "description": "WhatsApp engine",
                    "enum": ["WHATSAPP-BAILEYS", "WHATSAPP-BUSINESS"]
                  },
                  "webhook": {
                    "type": "string",
                    "description": "Webhook URL"
                  },
                  "webhook_by_events": {
                    "type": "boolean",
                    "description": "Enable Webhook by events"
                  },
                  "events": {
                    "type": "array",
                    "items": {
                      "type": "string",
                      "enum": [
                        "APPLICATION_STARTUP",
                        "QRCODE_UPDATED",
                        "MESSAGES_SET",
                        "MESSAGES_UPSERT",
                        "MESSAGES_UPDATE",
                        "MESSAGES_DELETE",
                        "SEND_MESSAGE",
                        "CONTACTS_SET",
                        "CONTACTS_UPSERT",
                        "CONTACTS_UPDATE",
                        "PRESENCE_UPDATE",
                        "CHATS_SET",
                        "CHATS_UPSERT",
                        "CHATS_UPDATE",
                        "CHATS_DELETE",
                        "GROUPS_UPSERT",
                        "GROUP_UPDATE",
                        "GROUP_PARTICIPANTS_UPDATE",
                        "CONNECTION_UPDATE",
                        "CALL",
                        "NEW_JWT_TOKEN",
                        "TYPEBOT_START",
                        "TYPEBOT_CHANGE_STATUS"
                      ]
                    },
                    "description": "Events to be sent to the Webhook"
                  },
                  "reject_call": {
                    "type": "boolean",
                    "description": "Reject WhatsApp calls automatically"
                  },
                  "msg_call": {
                    "type": "string",
                    "description": "Message to be sent when a call is rejected automatically"
                  },
                  "groups_ignore": {
                    "type": "boolean",
                    "description": "Ignore group messages"
                  },
                  "always_online": {
                    "type": "boolean",
                    "description": "Keep WhatsApp always online"
                  },
                  "read_messages": {
                    "type": "boolean",
                    "description": "Send read receipts to received messages"
                  },
                  "read_status": {
                    "type": "boolean",
                    "description": "Show sent messages read status"
                  },
                  "websocket_enabled": {
                    "type": "boolean",
                    "description": "Enable websocket"
                  },
                  "websocket_events": {
                    "type": "array",
                    "items": {
                      "type": "string",
                      "enum": [
                        "APPLICATION_STARTUP",
                        "QRCODE_UPDATED",
                        "MESSAGES_SET",
                        "MESSAGES_UPSERT",
                        "MESSAGES_UPDATE",
                        "MESSAGES_DELETE",
                        "SEND_MESSAGE",
                        "CONTACTS_SET",
                        "CONTACTS_UPSERT",
                        "CONTACTS_UPDATE",
                        "PRESENCE_UPDATE",
                        "CHATS_SET",
                        "CHATS_UPSERT",
                        "CHATS_UPDATE",
                        "CHATS_DELETE",
                        "GROUPS_UPSERT",
                        "GROUP_UPDATE",
                        "GROUP_PARTICIPANTS_UPDATE",
                        "CONNECTION_UPDATE",
                        "CALL",
                        "NEW_JWT_TOKEN",
                        "TYPEBOT_START",
                        "TYPEBOT_CHANGE_STATUS"
                      ]
                    },
                    "description": "Events to be sent to the websocket"
                  },
                  "rabbitmq_enabled": {
                    "type": "boolean",
                    "description": "Enable RabbitMQ"
                  },
                  "rabbitmq_events": {
                    "type": "array",
                    "items": {
                      "type": "string",
                      "enum": [
                        "APPLICATION_STARTUP",
                        "QRCODE_UPDATED",
                        "MESSAGES_SET",
                        "MESSAGES_UPSERT",
                        "MESSAGES_UPDATE",
                        "MESSAGES_DELETE",
                        "SEND_MESSAGE",
                        "CONTACTS_SET",
                        "CONTACTS_UPSERT",
                        "CONTACTS_UPDATE",
                        "PRESENCE_UPDATE",
                        "CHATS_SET",
                        "CHATS_UPSERT",
                        "CHATS_UPDATE",
                        "CHATS_DELETE",
                        "GROUPS_UPSERT",
                        "GROUP_UPDATE",
                        "GROUP_PARTICIPANTS_UPDATE",
                        "CONNECTION_UPDATE",
                        "CALL",
                        "NEW_JWT_TOKEN",
                        "TYPEBOT_START",
                        "TYPEBOT_CHANGE_STATUS"
                      ]
                    },
                    "description": "Events to be sent to the RabbitMQ"
                  },
                  "sqs_enabled": {
                    "type": "boolean",
                    "description": "Enable SQS"
                  },
                  "sqs_events": {
                    "type": "array",
                    "items": {
                      "type": "string",
                      "enum": [
                        "APPLICATION_STARTUP",
                        "QRCODE_UPDATED",
                        "MESSAGES_SET",
                        "MESSAGES_UPSERT",
                        "MESSAGES_UPDATE",
                        "MESSAGES_DELETE",
                        "SEND_MESSAGE",
                        "CONTACTS_SET",
                        "CONTACTS_UPSERT",
                        "CONTACTS_UPDATE",
                        "PRESENCE_UPDATE",
                        "CHATS_SET",
                        "CHATS_UPSERT",
                        "CHATS_UPDATE",
                        "CHATS_DELETE",
                        "GROUPS_UPSERT",
                        "GROUP_UPDATE",
                        "GROUP_PARTICIPANTS_UPDATE",
                        "CONNECTION_UPDATE",
                        "CALL",
                        "NEW_JWT_TOKEN",
                        "TYPEBOT_START",
                        "TYPEBOT_CHANGE_STATUS"
                      ]
                    },
                    "description": "Events to be sent to the SQS"
                  },
                  "typebot_url": {
                    "type": "string",
                    "description": "URL for the typebot instance"
                  },
                  "typebot": {
                    "type": "string",
                    "description": "Typebot flow name"
                  },
                  "typebot_expire": {
                    "type": "integer",
                    "description": "Seconds to expire TODO"
                  },
                  "typebot_keyword_finish": {
                    "type": "string",
                    "description": "Keyword to finish the typebot flow"
                  },
                  "typebot_delay_message": {
                    "type": "integer",
                    "description": "Default delay for the typebot messages"
                  },
                  "typebot_unknown_message": {
                    "type": "string",
                    "description": "TODO"
                  },
                  "typebot_listening_from_me": {
                    "type": "boolean",
                    "description": "Typebot listen messages sent by the connected number"
                  },
                  "proxy": {
                    "type": "object",
                    "properties": {
                      "host": {
                        "type": "string",
                        "description": "Proxy host"
                      },
                      "port": {
                        "type": "string",
                        "description": "Proxy port"
                      },
                      "protocol": {
                        "type": "string",
                        "description": "Proxy protocol",
                        "enum": ["http", "https"]
                      },
                      "username": {
                        "type": "string",
                        "description": "Proxy username"
                      },
                      "password": {
                        "type": "string",
                        "description": "Proxy password"
                      }
                    }
                  },
                  "chatwoot_account_id": {
                    "type": "integer",
                    "description": "Chatwoot account ID"
                  },
                  "chatwoot_token": {
                    "type": "string",
                    "description": "Chatwoot authentication token"
                  },
                  "chatwoot_url": {
                    "type": "string",
                    "description": "Chatwoot server URL"
                  },
                  "chatwoot_sign_msg": {
                    "type": "boolean",
                    "description": "Send message signature on Chatwoot"
                  },
                  "chatwoot_reopen_conversation": {
                    "type": "boolean",
                    "description": "Reopen conversation on Chatwoot"
                  },
                  "chatwoot_conversation_pending": {
                    "type": "boolean",
                    "description": "TODO"
                  }
                }
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "Created",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "instance": {
                      "type": "object",
                      "properties": {
                        "instanceName": {
                          "type": "string",
                          "description": "The name of the instance"
                        },
                        "instanceId": {
                          "type": "string",
                          "description": "The unique identifier for the instance"
                        },
                        "webhook_wa_business": {
                          "type": "string",
                          "description": "The webhook URL for WhatsApp Business integration"
                        },
                        "access_token_wa_business": {
                          "type": "string",
                          "description": "The access token for WhatsApp Business"
                        },
                        "status": {
                          "type": "string",
                          "description": "The current status of the instance"
                        }
                      }
                    },
                    "hash": {
                      "type": "object",
                      "properties": {
                        "apikey": {
                          "type": "string",
                          "description": "The API key for authentication"
                        }
                      }
                    },
                    "settings": {
                      "type": "object",
                      "properties": {
                        "reject_call": {
                          "type": "boolean",
                          "description": "Indicates whether calls are rejected"
                        },
                        "msg_call": {
                          "type": "string",
                          "description": "Message to be sent when a call is rejected"
                        },
                        "groups_ignore": {
                          "type": "boolean",
                          "description": "Indicates whether groups are ignored"
                        },
                        "always_online": {
                          "type": "boolean",
                          "description": "Indicates whether the instance is always online"
                        },
                        "read_messages": {
                          "type": "boolean",
                          "description": "Indicates whether messages are marked as read"
                        },
                        "read_status": {
                          "type": "boolean",
                          "description": "Indicates whether status updates are marked as read"
                        },
                        "sync_full_history": {
                          "type": "boolean",
                          "description": "Indicates whether the full message history is synchronized"
                        }
                      }
                    }
                  },
                  "example": {
                    "instance": {
                      "instanceName": "teste-docs",
                      "instanceId": "af6c5b7c-ee27-4f94-9ea8-192393746ddd",
                      "webhook_wa_business": null,
                      "access_token_wa_business": "",
                      "status": "created"
                    },
                    "hash": {
                      "apikey": "123456"
                    },
                    "settings": {
                      "reject_call": false,
                      "msg_call": "",
                      "groups_ignore": true,
                      "always_online": false,
                      "read_messages": false,
                      "read_status": false,
                      "sync_full_history": false
                    }
                  }
                }
              }
            }
          },
          "403": {
            "description": "Forbidden",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "status": {
                      "type": "integer",
                      "description": "The HTTP status of the response"
                    },
                    "error": {
                      "type": "string",
                      "description": "The error message indicating the type of error"
                    },
                    "response": {
                      "type": "object",
                      "properties": {
                        "message": {
                          "type": "array",
                          "items": {
                            "type": "string"
                          },
                          "description": "List of detailed error messages"
                        }
                      }
                    }
                  },
                  "example": {
                    "status": 403,
                    "error": "Forbidden",
                    "response": {
                      "message": [
                        "This name \"instance-example-name\" is already in use."
                      ]
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/instance/fetchInstances": {
      "get": {
        "operationId": "fetchInstances",
        "summary": "Fetch Instances",
        "tags": ["Instance Controller"],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instanceName",
            "description": "Name of the instance to be fetched",
            "in": "query",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Returns the instance with the name informed in the parameter, or all the instances if empty.",
        "responses": {
          "200": {
            "description": "Ok",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "status": {
                      "type": "integer",
                      "description": "The HTTP status of the response"
                    },
                    "error": {
                      "type": "string",
                      "description": "The error message indicating the type of error"
                    },
                    "response": {
                      "type": "object",
                      "properties": {
                        "message": {
                          "type": "array",
                          "items": {
                            "type": "string"
                          },
                          "description": "List of detailed error messages"
                        }
                      }
                    }
                  },
                  "example": [
                    {
                      "instance": {
                        "instanceName": "example-name",
                        "instanceId": "421a4121-a3d9-40cc-a8db-c3a1df353126",
                        "owner": "553198296801@s.whatsapp.net",
                        "profileName": "Guilherme Gomes",
                        "profilePictureUrl": null,
                        "profileStatus": "This is the profile status.",
                        "status": "open",
                        "serverUrl": "https://example.evolution-api.com",
                        "apikey": "B3844804-481D-47A4-B69C-F14B4206EB56",
                        "integration": {
                          "integration": "WHATSAPP-BAILEYS",
                          "webhook_wa_business": "https://example.evolution-api.com/webhook/whatsapp/db5e11d3-ded5-4d91-b3fb-48272688f206"
                        }
                      }
                    },
                    {
                      "instance": {
                        "instanceName": "teste-docs",
                        "instanceId": "af6c5b7c-ee27-4f94-9ea8-192393746ddd",
                        "status": "close",
                        "serverUrl": "https://example.evolution-api.com",
                        "apikey": "123456",
                        "integration": {
                          "token": "123456",
                          "webhook_wa_business": "https://example.evolution-api.com/webhook/whatsapp/teste-docs"
                        }
                      }
                    }
                  ],
                  "required": ["message"]
                }
              }
            }
          }
        }
      }
    },
    "/instance/connect/{instance}": {
      "get": {
        "operationId": "instanceConnect",
        "summary": "Instances Connect",
        "tags": ["Instance Controller"],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "ID of the instance to connect",
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "number",
            "description": "Phone number (with country code) to be connected",
            "in": "query",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Generates and returns the QR code for WhatsApp connection",
        "responses": {
          "200": {
            "description": "Ok",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "pairingCode": {
                      "type": "string",
                      "description": "The unique code used for pairing a device or account."
                    },
                    "code": {
                      "type": "string",
                      "description": "A specific code associated with the pairing process. This may include tokens or other identifiers."
                    },
                    "count": {
                      "type": "integer",
                      "description": "The count or number of attempts or instances related to the pairing process."
                    }
                  },
                  "example": {
                    "pairingCode": "WZYEH1YY",
                    "code": "2@y8eK+bjtEjUWy9/FOM...",
                    "count": 1
                  }
                }
              }              
            }
          },
          "404": {
            "description": "Instance not found",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "status": {
                      "type": "integer",
                      "description": "The HTTP status of the response"
                    },
                    "error": {
                      "type": "string",
                      "description": "The error message indicating the type of error"
                    },
                    "response": {
                      "type": "object",
                      "properties": {
                        "message": {
                          "type": "array",
                          "items": {
                            "type": "string"
                          },
                          "description": "List of detailed error messages"
                        }
                      }
                    }
                  },
                  "example": {
                    "status": 404,
                    "error": "Not Found",
                    "response": {
                      "message": [
                        "The \"invalid-instance\" instance does not exist"
                      ]
                    }
                  }
                }
              }              
            }
          }
        }
      }
    },
    "/instance/restart/{instance}": {
      "put": {
        "operationId": "restartInstance",
        "summary": "Restart Instance",
        "tags": ["Instance Controller"],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "ID of the instance to connect",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Restarts the instance",
        "responses": {
          "200": {
            "description": "Ok",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "instance": {
                      "type": "object",
                      "properties": {
                        "instanceName": {
                          "type": "string",
                          "description": "The name of the instance."
                        },
                        "state": {
                          "type": "string",
                          "description": "The state of the instance."
                        }
                      }
                    }
                  },
                  "example": {
                    "instance": {
                      "instanceName": "teste-docs",
                      "state": "open"
                    }
                  }
                }
              }              
            }
          },
          "404": {
            "description": "Instance not found",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "status": {
                      "type": "integer",
                      "description": "The HTTP status of the response"
                    },
                    "error": {
                      "type": "string",
                      "description": "The error message indicating the type of error"
                    },
                    "response": {
                      "type": "object",
                      "properties": {
                        "message": {
                          "type": "array",
                          "items": {
                            "type": "string"
                          },
                          "description": "List of detailed error messages"
                        }
                      }
                    }
                  },
                  "example": {
                    "status": 404,
                    "error": "Not Found",
                    "response": {
                      "message": [
                        "The \"invalid-instance\" instance does not exist"
                      ]
                    }
                  }
                }
              }              
            }
          }
        }
      }
    },
    "/instance/connectionState/{instance}": {
      "get": {
        "operationId": "connectionState",
        "summary": "Connection State",
        "tags": ["Instance Controller"],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "ID of the instance to connect",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Gets the state of the connection",
        "responses": {
          "200": {
            "description": "Ok",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "instance": {
                      "type": "object",
                      "properties": {
                        "instanceName": {
                          "type": "string",
                          "description": "The name of the instance."
                        },
                        "state": {
                          "type": "string",
                          "description": "The state of the instance."
                        }
                      }
                    }
                  },
                  "example": {
                    "instance": {
                      "instanceName": "teste-docs",
                      "state": "open"
                    }
                  }
                }
              }              
            }
          },
          "404": {
            "description": "Instance not found",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "status": {
                      "type": "integer",
                      "description": "The HTTP status of the response"
                    },
                    "error": {
                      "type": "string",
                      "description": "The error message indicating the type of error"
                    },
                    "response": {
                      "type": "object",
                      "properties": {
                        "message": {
                          "type": "array",
                          "items": {
                            "type": "string"
                          },
                          "description": "List of detailed error messages"
                        }
                      }
                    }
                  },
                  "example": {
                    "status": 404,
                    "error": "Not Found",
                    "response": {
                      "message": [
                        "The \"invalid-instance\" instance does not exist"
                      ]
                    }
                  }
                }
              }              
            }
          }
        }
      }
    },
    "/instance/logout/{instance}": {
      "delete": {
        "operationId": "logoutInstance",
        "summary": "Logout Instance",
        "tags": ["Instance Controller"],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "ID of the instance to connect",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Makes logout on instance",
        "responses": {
          "200": {
            "description": "Ok",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "status": {
                      "type": "string",
                      "description": "The status of the response."
                    },
                    "error": {
                      "type": "boolean",
                      "description": "Indicates whether an error occurred."
                    },
                    "response": {
                      "type": "object",
                      "properties": {
                        "message": {
                          "type": "string",
                          "description": "A message related to the response."
                        }
                      }
                    }
                  },
                  "example": {
                    "status": "SUCCESS",
                    "error": false,
                    "response": {
                      "message": "Instance logged out"
                    }
                  }
                }
              }              
            }
          },
          "404": {
            "description": "Instance not found",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "status": {
                      "type": "integer",
                      "description": "The HTTP status of the response"
                    },
                    "error": {
                      "type": "string",
                      "description": "The error message indicating the type of error"
                    },
                    "response": {
                      "type": "object",
                      "properties": {
                        "message": {
                          "type": "array",
                          "items": {
                            "type": "string"
                          },
                          "description": "List of detailed error messages"
                        }
                      }
                    }
                  },
                  "example": {
                    "status": 404,
                    "error": "Not Found",
                    "response": {
                      "message": [
                        "The \"invalid-instance\" instance does not exist"
                      ]
                    }
                  }
                }
              }              
            }
          }
        }
      }
    },
    "/instance/delete/{instance}": {
      "delete": {
        "operationId": "deleteInstance",
        "summary": "Delete Instance",
        "tags": ["Instance Controller"],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "ID of the instance to connect",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Deletes instance",
        "responses": {
          "200": {
            "description": "Ok",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "status": {
                      "type": "string",
                      "description": "The status of the response."
                    },
                    "error": {
                      "type": "boolean",
                      "description": "Indicates whether an error occurred."
                    },
                    "response": {
                      "type": "object",
                      "properties": {
                        "message": {
                          "type": "string",
                          "description": "A message related to the response."
                        }
                      }
                    }
                  },
                  "example": {
                    "status": "SUCCESS",
                    "error": false,
                    "response": {
                      "message": "Instance deleted"
                    }
                  }
                }
              }              
            }
          },
          "404": {
            "description": "Instance not found",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "status": {
                      "type": "integer",
                      "description": "The HTTP status of the response"
                    },
                    "error": {
                      "type": "string",
                      "description": "The error message indicating the type of error"
                    },
                    "response": {
                      "type": "object",
                      "properties": {
                        "message": {
                          "type": "array",
                          "items": {
                            "type": "string"
                          },
                          "description": "List of detailed error messages"
                        }
                      }
                    }
                  },
                  "example": {
                    "status": 404,
                    "error": "Not Found",
                    "response": {
                      "message": [
                        "The \"invalid-instance\" instance does not exist"
                      ]
                    }
                  }
                }
              }              
            }
          }
        }
      }
    },
    "/instance/setPresence/{instance}": {
      "post": {
        "operationId": "setPresence",
        "summary": "Set Presence",
        "tags": ["Instance Controller"],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "ID of the instance to connect",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Deletes instance",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": ["presence"],
                "properties": {
                  "presence": {
                    "type": "string",
                    "enum": ["available", "unavailable"]
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Ok",
            "content": {}
          },
          "404": {
            "description": "Instance not found",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "status": {
                      "type": "integer",
                      "description": "The HTTP status of the response"
                    },
                    "error": {
                      "type": "string",
                      "description": "The error message indicating the type of error"
                    },
                    "response": {
                      "type": "object",
                      "properties": {
                        "message": {
                          "type": "array",
                          "items": {
                            "type": "string"
                          },
                          "description": "List of detailed error messages"
                        }
                      }
                    }
                  },
                  "example": {
                    "status": 404,
                    "error": "Not Found",
                    "response": {
                      "message": [
                        "The \"invalid-instance\" instance does not exist"
                      ]
                    }
                  }
                }
              }              
            }
          }
        }
      }
    },
    "/webhook/set/{instance}": {
      "post": {
        "operationId": "setWebhook",
        "summary": "Set Webhook",
        "tags": ["Webhook Controller"],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "ID of the instance to connect",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Set Webhook for instance",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": [
                  "url",
                  "events"
                ],
                "properties": {
                  "url": {
                    "type": "string",
                    "description": "Webhook URL"
                  },
                  "webhook_by_events": {
                    "type": "boolean",
                    "description": "Enables Webhook by events"
                  },
                  "webhook_base64": {
                    "type": "boolean",
                    "description": "Sends files in base64 when available"
                  },
                  "events": {
                    "type": "array",
                    "minItems": 1,
                    "items": {
                      "type": "string",
                      "enum": [
                        "APPLICATION_STARTUP",
                        "QRCODE_UPDATED",
                        "MESSAGES_SET",
                        "MESSAGES_UPSERT",
                        "MESSAGES_UPDATE",
                        "MESSAGES_DELETE",
                        "SEND_MESSAGE",
                        "CONTACTS_SET",
                        "CONTACTS_UPSERT",
                        "CONTACTS_UPDATE",
                        "PRESENCE_UPDATE",
                        "CHATS_SET",
                        "CHATS_UPSERT",
                        "CHATS_UPDATE",
                        "CHATS_DELETE",
                        "GROUPS_UPSERT",
                        "GROUP_UPDATE",
                        "GROUP_PARTICIPANTS_UPDATE",
                        "CONNECTION_UPDATE",
                        "CALL",
                        "NEW_JWT_TOKEN",
                        "TYPEBOT_START",
                        "TYPEBOT_CHANGE_STATUS"
                      ]
                    },
                    "description": "Events to be sent to the Webhook"
                  }
                }
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "Created",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "webhook": {
                      "type": "object",
                      "properties": {
                        "instanceName": {
                          "type": "string",
                          "description": "The name of the instance."
                        },
                        "webhook": {
                          "type": "object",
                          "properties": {
                            "url": {
                              "type": "string",
                              "description": "The URL of the webhook."
                            },
                            "events": {
                              "type": "array",
                              "items": {
                                "type": "string"
                              },
                              "description": "List of events the webhook is subscribed to."
                            },
                            "enabled": {
                              "type": "boolean",
                              "description": "Indicates whether the webhook is enabled."
                            }
                          }
                        }
                      }
                    }
                  },
                  "example": {
                    "webhook": {
                      "instanceName": "teste-docs",
                      "webhook": {
                        "url": "https://example.com",
                        "events": [
                          "APPLICATION_STARTUP"
                        ],
                        "enabled": true
                      }
                    }
                  }
                }
              }              
            }
          }
        }
      }
    },
    "/webhook/find/{instance}": {
      "get": {
        "operationId": "findWebhook",
        "summary": "Find Webhook",
        "tags": ["Webhook Controller"],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "ID of the instance to connect",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Fetch Webhook configuration",
        "responses": {
          "200": {
            "description": "Ok",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "enabled": {
                      "type": "boolean",
                      "description": "Indicates whether the webhook is enabled."
                    },
                    "url": {
                      "type": "string",
                      "description": "The URL of the webhook."
                    },
                    "events": {
                      "type": "array",
                      "items": {
                        "type": "string"
                      },
                      "description": "List of events the webhook is subscribed to."
                    }
                  },
                  "example": {
                    "enabled": true,
                    "url": "https://example.com",
                    "events": [
                      "APPLICATION_STARTUP"
                    ]
                  }
                }
              }              
            }
          }
        }
      }
    },
    "/settings/set/{instance}": {
      "post": {
        "operationId": "setSettings",
        "summary": "Set Settings",
        "tags": ["Settings Controller"],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "ID of the instance to connect",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Set settings",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": [
                  "reject_call",
                  "groups_ignore",
                  "always_online",
                  "read_messages",
                  "read_status",
                  "sync_full_history"
                ],
                "properties": {
                  "reject_call": {
                    "type": "boolean",
                    "description": "Reject calls automatically"
                  },
                  "msg_call": {
                    "type": "string",
                    "description": "Message to be sent when a call is rejected automatically"
                  },
                  "groups_ignore": {
                    "type": "boolean",
                    "description": "Ignore group messages"
                  },
                  "always_online": {
                    "type": "boolean",
                    "description": "Always show WhatsApp online"
                  },
                  "read_messages": {
                    "type": "boolean",
                    "description": "Send read receipts"
                  },
                  "read_status": {
                    "type": "boolean",
                    "description": "See message status"
                  },
                  "sync_full_history": {
                    "type": "boolean",
                    "description": "Syncronize full WhatsApp history with EvolutionAPI"
                  }
                }
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "Created",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "settings": {
                      "type": "object",
                      "properties": {
                        "instanceName": {
                          "type": "string",
                          "description": "The name of the instance."
                        },
                        "settings": {
                          "type": "object",
                          "properties": {
                            "reject_call": {
                              "type": "boolean",
                              "description": "Indicates whether to reject incoming calls."
                            },
                            "groups_ignore": {
                              "type": "boolean",
                              "description": "Indicates whether to ignore group messages."
                            },
                            "always_online": {
                              "type": "boolean",
                              "description": "Indicates whether to always keep the instance online."
                            },
                            "read_messages": {
                              "type": "boolean",
                              "description": "Indicates whether to mark messages as read."
                            },
                            "read_status": {
                              "type": "boolean",
                              "description": "Indicates whether to read status updates."
                            },
                            "sync_full_history": {
                              "type": "boolean",
                              "description": "Indicates whether to synchronize full message history."
                            }
                          }
                        }
                      }
                    }
                  },
                  "example": {
                    "settings": {
                      "instanceName": "teste-docs",
                      "settings": {
                        "reject_call": true,
                        "groups_ignore": true,
                        "always_online": true,
                        "read_messages": true,
                        "read_status": true,
                        "sync_full_history": false
                      }
                    }
                  }
                }
              }              
            }
          }
        }
      }
    },
    "/settings/find/{instance}": {
      "get": {
        "operationId": "findWebhook",
        "summary": "Find Webhook",
        "tags": ["Webhook Controller"],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "ID of the instance to connect",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Fetch Webhook configuration",
        "responses": {
          "200": {
            "description": "Ok",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "reject_call": {
                      "type": "boolean",
                      "description": "Indicates whether to reject incoming calls."
                    },
                    "groups_ignore": {
                      "type": "boolean",
                      "description": "Indicates whether to ignore group messages."
                    },
                    "always_online": {
                      "type": "boolean",
                      "description": "Indicates whether to always keep the instance online."
                    },
                    "read_messages": {
                      "type": "boolean",
                      "description": "Indicates whether to mark messages as read."
                    },
                    "read_status": {
                      "type": "boolean",
                      "description": "Indicates whether to read status updates."
                    },
                    "sync_full_history": {
                      "type": "boolean",
                      "description": "Indicates whether to synchronize full message history."
                    }
                  },
                  "example": {
                    "reject_call": true,
                    "groups_ignore": true,
                    "always_online": true,
                    "read_messages": true,
                    "read_status": true,
                    "sync_full_history": false
                  }
                }
              }              
            }
          }
        }
      }
    },
    "/message/sendTemplate/{instance}": {
      "post": {
        "operationId": "sendTemplate",
        "summary": "Send Template",
        "tags": ["Message Controller"],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "ID of the instance to connect",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Send a template message with the Official WhatsApp API",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "number": {
                    "type": "string",
                    "description": "Message receiver number with country code"
                  },
                  "templateMessage": {
                    "type": "object",
                    "properties": {
                      "name": {
                        "type": "string",
                        "description": "Template name"
                      },
                      "language": {
                        "type": "string",
                        "description": "Template language",
                        "example": "pt_BR"
                      },
                      "components": {
                        "type": "array",
                        "description": "Template components",
                        "items": {
                          "type": "object",
                          "properties": {
                            "type": {
                              "type": "string",
                              "enum": ["header", "body", "button"]
                            },
                            "sub_type": {
                              "type": "string",
                              "enum": [
                                "quick_reply",
                                "url",
                                "copy_code",
                                "catalog"
                              ]
                            },
                            "index": {
                              "type": "string",
                              "description": "Button index from 0-9"
                            },
                            "parameters": {
                              "type": "array",
                              "items": {
                                "type": "object",
                                "properties": {
                                  "type": {
                                    "type": "string",
                                    "description": "Parameter type",
                                    "enum": [
                                      "payload",
                                      "text",
                                      "coupon_code",
                                      "currency",
                                      "date_time",
                                      "image",
                                      "document",
                                      "video"
                                    ]
                                  },
                                  "text": {
                                    "type": "string",
                                    "description": "Parameter text"
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Ok",
            "content": {}
          }
        }
      }
    },
    "/message/sendText/{instance}": {
      "post": {
        "operationId": "sendText",
        "summary": "Send Text",
        "tags": ["Message Controller"],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "ID of the instance to connect",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Send plain text message",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": [
                  "number",
                  "textMessage"
                ],
                "properties": {
                  "number": {
                    "type": "string",
                    "description": "Number to receive the message (with country code)"
                  },
                  "options": {
                    "type": "object",
                    "properties": {
                      "delay": {
                        "type": "integer",
                        "description": "Presence time in milliseconds before sending message"
                      },
                      "presence": {
                        "type": "string",
                        "description": "Presence type to show ",
                        "enum": ["composing", "recording"]
                      },
                      "linkPreview": {
                        "type": "boolean",
                        "description": "Shows a preview of the target website if there's a link within the message"
                      },
                      "quoted": {
                        "type": "object",
                        "properties": {
                          "key": {
                            "type": "object",
                            "properties": {
                              "remoteJid": {
                                "type": "string",
                                "description": "Receiver phone number with country code"
                              },
                              "fromMe": {
                                "type": "boolean",
                                "description": "If the message is from the owner number"
                              },
                              "id": {
                                "type": "string",
                                "description": "Message ID"
                              },
                              "participant": {
                                "type": "string",
                                "description": "TODO"
                              }
                            }
                          },
                          "message": {
                            "type": "object",
                            "properties": {
                              "conversation": {
                                "type": "string",
                                "description": "Quoted message content"
                              }
                            }
                          }
                        }
                      },
                      "mentions": {
                        "type": "object",
                        "properties": {
                          "everyOne": {
                            "type": "boolean",
                            "description": "Mentions everyone"
                          },
                          "mentioned": {
                            "type": "array",
                            "items": {
                              "type": "string",
                              "description": "Receiver phone number with country code"
                            }
                          }
                        }
                      }
                    }
                  },
                  "textMessage": {
                    "type": "object",
                    "properties": {
                      "text": {
                        "type": "string",
                        "description": "Text message content"
                      }
                    }
                  }
                }
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "Created",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "key": {
                      "type": "object",
                      "properties": {
                        "remoteJid": {
                          "type": "string",
                          "description": "The remote Jid."
                        },
                        "fromMe": {
                          "type": "boolean",
                          "description": "Indicates whether the message was sent by the user."
                        },
                        "id": {
                          "type": "string",
                          "description": "The ID of the message."
                        }
                      }
                    },
                    "message": {
                      "type": "object",
                      "properties": {
                        "extendedTextMessage": {
                          "type": "object",
                          "properties": {
                            "text": {
                              "type": "string",
                              "description": "The text message."
                            }
                          }
                        }
                      }
                    },
                    "messageTimestamp": {
                      "type": "string",
                      "description": "The timestamp of the message."
                    },
                    "status": {
                      "type": "string",
                      "description": "The status of the message."
                    }
                  },
                  "example": {
                    "key": {
                      "remoteJid": "553198296801@s.whatsapp.net",
                      "fromMe": true,
                      "id": "BAE594145F4C59B4"
                    },
                    "message": {
                      "extendedTextMessage": {
                        "text": "Olá!"
                      }
                    },
                    "messageTimestamp": "1717689097",
                    "status": "PENDING"
                  }
                }
              }              
            }
          }
        }
      }
    },
    "/message/sendMedia/{instance}": {
      "post": {
        "operationId": "sendMedia",
        "summary": "Send Media",
        "tags": ["Message Controller"],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "ID of the instance to connect",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Send media message",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": [
                  "number",
                  "mediaMessage"
                ],
                "properties": {
                  "number": {
                    "type": "string",
                    "description": "Number to receive the message (with country code)"
                  },
                  "options": {
                    "type": "object",
                    "properties": {
                      "delay": {
                        "type": "integer",
                        "description": "Presence time in milliseconds before sending message"
                      },
                      "presence": {
                        "type": "string",
                        "description": "Presence type to show ",
                        "enum": ["composing", "recording"]
                      }
                    }
                  },
                  "mediaMessage": {
                    "type": "object",
                    "properties": {
                      "mediaType": {
                        "type": "string",
                        "description": "Media type",
                        "enum": ["image", "video", "document", "audio"]
                      },
                      "fileName": {
                        "type": "string",
                        "description": "Name of the file (for media type `document` only)",
                        "example": "evolution-api.pdf"
                      },
                      "caption": {
                        "type": "string",
                        "description": "Caption to send with media (except with media type `audio`)"
                      },
                      "media": {
                        "type": "string",
                        "description": "Media URL or file in base64"
                      }
                    }
                  }
                }
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "Created",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "key": {
                      "type": "object",
                      "properties": {
                        "remoteJid": {
                          "type": "string",
                          "description": "The remote Jid."
                        },
                        "fromMe": {
                          "type": "boolean",
                          "description": "Indicates whether the message was sent by the user."
                        },
                        "id": {
                          "type": "string",
                          "description": "The ID of the message."
                        }
                      },
                      "description": "The key of the message, which identifies the message in the chat."
                    },
                    "message": {
                      "type": "object",
                      "properties": {
                        "imageMessage": {
                          "type": "object",
                          "properties": {
                            "url": {
                              "type": "string",
                              "description": "The URL of the image."
                            },
                            "mimetype": {
                              "type": "string",
                              "description": "The MIME type of the image."
                            },
                            "caption": {
                              "type": "string",
                              "description": "The caption text of the image."
                            },
                            "fileSha256": {
                              "type": "string",
                              "description": "The SHA-256 hash of the image file."
                            },
                            "fileLength": {
                              "type": "string",
                              "description": "The length of the image file."
                            },
                            "height": {
                              "type": "integer",
                              "description": "The height of the image."
                            },
                            "width": {
                              "type": "integer",
                              "description": "The width of the image."
                            },
                            "mediaKey": {
                              "type": "string",
                              "description": "The media key of the image."
                            },
                            "fileEncSha256": {
                              "type": "string",
                              "description": "The SHA-256 hash of the encrypted image file."
                            },
                            "directPath": {
                              "type": "string",
                              "description": "The direct path to the image."
                            },
                            "mediaKeyTimestamp": {
                              "type": "string",
                              "description": "The timestamp of the media key."
                            },
                            "jpegThumbnail": {
                              "type": "string",
                              "description": "The JPEG thumbnail of the image."
                            },
                            "contextInfo": {
                              "type": "object",
                              "description": "Additional context information."
                            }
                          },
                          "description": "Details of the image message."
                        }
                      },
                      "description": "The message content, which may include various types of messages like text, images, etc."
                    },
                    "messageTimestamp": {
                      "type": "string",
                      "description": "The timestamp of the message, represented as a string."
                    },
                    "status": {
                      "type": "string",
                      "description": "The status of the message, such as sent, received, or pending."
                    }
                  },
                  "example": {
                    "key": {
                      "remoteJid": "553198296801@s.whatsapp.net",
                      "fromMe": true,
                      "id": "BAE5F5A632EAE722"
                    },
                    "message": {
                      "imageMessage": {
                        "url": "https://mmg.whatsapp.net/o1/v/t62.7118-2...",
                        "mimetype": "image/png",
                        "caption": "Caption text",
                        "fileSha256": "VbCGkGBv5SZStLD5PHdkBWpQav/lNsXcY...",
                        "fileLength": "1305757",
                        "height": 1080,
                        "width": 1920,
                        "mediaKey": "aFQK9Ocw5tE7Nf0iBA42Xcb4Dee6G1k/pLL...",
                        "fileEncSha256": "bGVtYeR3458RwC0p1tsGDNuj+vOu/...",
                        "directPath": "/o1/v/t62.7118-24/f1/m232/up-oil...",
                        "mediaKeyTimestamp": "1717775573",
                        "jpegThumbnail": "/9j/2wBDABALDA4MChAODQ4SERATG...",
                        "contextInfo": {}
                      }
                    },
                    "messageTimestamp": "1717775575",
                    "status": "PENDING"
                  }
                }
              }
            }
          }
        }
      }
    },
    "/message/sendWhatsAppAudio/{instance}": {
      "post": {
        "operationId": "sendWhatsAppAudio",
        "summary": "Send WhatsApp Audio",
        "tags": ["Message Controller"],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "ID of the instance to connect",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Send WhatsApp Audio",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": [
                  "number",
                  "audioMessage"
                ],
                "properties": {
                  "number": {
                    "type": "string",
                    "description": "Number to receive the message (with country code)"
                  },
                  "options": {
                    "type": "object",
                    "properties": {
                      "delay": {
                        "type": "integer",
                        "description": "Presence time in milliseconds before sending message"
                      },
                      "presence": {
                        "type": "string",
                        "description": "Presence type to show ",
                        "enum": ["recording"],
                        "default": "recording"
                      },
                      "encoding": {
                        "type": "boolean",
                        "description": "If the audio must be encoded or not"
                      }
                    }
                  },
                  "audioMessage": {
                    "type": "object",
                    "properties": {
                      "audio": {
                        "type": "string",
                        "description": "Audio URL or file in base64"
                      }
                    }
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Ok",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "key": {
                      "type": "object",
                      "properties": {
                        "remoteJid": {
                          "type": "string",
                          "description": "The remote Jid."
                        },
                        "fromMe": {
                          "type": "boolean",
                          "description": "Indicates whether the message was sent by the user."
                        },
                        "id": {
                          "type": "string",
                          "description": "The ID of the message."
                        }
                      },
                      "description": "The key of the message, which identifies the message in the chat."
                    },
                    "message": {
                      "type": "object",
                      "properties": {
                        "audioMessage": {
                          "type": "object",
                          "properties": {
                            "url": {
                              "type": "string",
                              "description": "The URL of the audio message."
                            },
                            "mimetype": {
                              "type": "string",
                              "description": "The MIME type of the audio message."
                            },
                            "fileSha256": {
                              "type": "string",
                              "description": "The SHA-256 hash of the audio file."
                            },
                            "fileLength": {
                              "type": "string",
                              "description": "The length of the audio file."
                            },
                            "seconds": {
                              "type": "integer",
                              "description": "The duration of the audio message in seconds."
                            },
                            "ptt": {
                              "type": "boolean",
                              "description": "Indicates whether the audio message is a push-to-talk (PTT) message."
                            },
                            "mediaKey": {
                              "type": "string",
                              "description": "The media key of the audio message."
                            },
                            "fileEncSha256": {
                              "type": "string",
                              "description": "The SHA-256 hash of the encrypted audio file."
                            },
                            "directPath": {
                              "type": "string",
                              "description": "The direct path to the audio file."
                            },
                            "mediaKeyTimestamp": {
                              "type": "string",
                              "description": "The timestamp of the media key."
                            }
                          },
                          "description": "Details of the audio message."
                        }
                      },
                      "description": "The message content, which may include various types of messages like text, images, audio, etc."
                    },
                    "messageTimestamp": {
                      "type": "string",
                      "description": "The timestamp of the message, represented as a string."
                    },
                    "status": {
                      "type": "string",
                      "description": "The status of the message, such as sent, received, or pending."
                    }
                  },
                  "example": {
                    "key": {
                      "remoteJid": "553198296801@s.whatsapp.net",
                      "fromMe": true,
                      "id": "BAE5EFED2AB0BB9F"
                    },
                    "message": {
                      "audioMessage": {
                        "url": "https://mmg.whatsapp.net/v/t62.7114-24/21428511_985284763127087_5662928...",
                        "mimetype": "audio/mp4",
                        "fileSha256": "DJPBnRns6QADzZNH2j0R88mUtFQ4aiOm9aZf6dio2G0=",
                        "fileLength": "670662",
                        "seconds": 42,
                        "ptt": true,
                        "mediaKey": "+A3X1Tuyzeh87cCVZpfuKpL3Y4RYdYr3sCDurjSlBTY=",
                        "fileEncSha256": "s4tKvHOXIZAw5668/Xcy4zoFba4vW8klmNYC78yOPZs=",
                        "directPath": "/v/t62.7114-24/21428511_985284763127087_5662928477636351284_n.enc...",
                        "mediaKeyTimestamp": "1717776942"
                      }
                    },
                    "messageTimestamp": "1717776942",
                    "status": "PENDING"
                  }
                }
              }
            }
          }
        }
      }
    },
    "/message/sendSticker/{instance}": {
      "post": {
        "operationId": "sendSticker",
        "summary": "Send Sticker",
        "tags": ["Message Controller"],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "ID of the instance to connect",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Send Sticker",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": [
                  "number",
                  "stickerMessage"
                ],
                "properties": {
                  "number": {
                    "type": "string",
                    "description": "Number to receive the message (with country code)"
                  },
                  "options": {
                    "type": "object",
                    "properties": {
                      "delay": {
                        "type": "integer",
                        "description": "Presence time in milliseconds before sending message"
                      },
                      "presence": {
                        "type": "string",
                        "description": "Presence type to show ",
                        "enum": ["composing"],
                        "default": "composing"
                      }
                    }
                  },
                  "stickerMessage": {
                    "type": "object",
                    "properties": {
                      "image": {
                        "type": "string",
                        "description": "Image URL or file in base64"
                      }
                    }
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Ok",
            "content": {}
          }
        }
      }
    },
    "/message/sendStatus/{instance}": {
      "post": {
        "operationId": "sendStatus",
        "summary": "Send Status",
        "tags": ["Message Controller"],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "ID of the instance to connect",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Post WhatsApp status (stories)",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": ["statusMessage"],
                "properties": {
                  "statusMessage": {
                    "type": "object",
                    "required": [
                      "type"
                    ],
                    "properties": {
                      "type": {
                        "type": "string",
                        "description": "status type",
                        "enum": ["text", "image", "audio"]
                      },
                      "content": {
                        "type": "string",
                        "description": "Text content for type `text` or file URL for type `image` and `audio`"
                      },
                      "caption": {
                        "type": "string",
                        "description": "Text caption for type `image` status"
                      },
                      "backgroundColor": {
                        "type": "string",
                        "description": "Background hex color"
                      },
                      "font": {
                        "type": "integer",
                        "description": "1 - Serif, 2 - Norican Regular, 3 - Bryndan Write, 4 - BebasNeue Regular, 5 - Oswald Heavy"
                      },
                      "allContacts": {
                        "type": "boolean",
                        "description": "true to send to all contacts or false to send to statusJidList"
                      },
                      "statusJidList": {
                        "type": "array",
                        "items": {
                          "type": "string",
                          "description": "Receivers numbers with country code"
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "Created",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "key": {
                      "type": "object",
                      "properties": {
                        "remoteJid": {
                          "type": "string",
                          "description": "The remote Jid."
                        },
                        "fromMe": {
                          "type": "boolean",
                          "description": "Indicates whether the message was sent by the user."
                        },
                        "id": {
                          "type": "string",
                          "description": "The ID of the message."
                        }
                      },
                      "description": "The key of the message, which identifies the message in the chat."
                    },
                    "message": {
                      "type": "object",
                      "properties": {
                        "extendedTextMessage": {
                          "type": "object",
                          "properties": {
                            "text": {
                              "type": "string",
                              "description": "The text content of the message."
                            },
                            "backgroundArgb": {
                              "type": "integer",
                              "description": "The background color of the text message, represented as ARGB integer value."
                            },
                            "font": {
                              "type": "string",
                              "description": "The font used in the text message."
                            }
                          },
                          "description": "Details of the extended text message."
                        }
                      },
                      "description": "The message content, which may include various types of messages like text, images, etc."
                    },
                    "messageTimestamp": {
                      "type": "string",
                      "description": "The timestamp of the message, represented as a string."
                    },
                    "status": {
                      "type": "string",
                      "description": "The status of the message, such as sent, received, or pending."
                    },
                    "participant": {
                      "type": "string",
                      "description": "The participant in the chat to whom the message was sent."
                    }
                  },
                  "example": {
                    "key": {
                      "remoteJid": "status@broadcast",
                      "fromMe": true,
                      "id": "BAE5FAB9E65A3DA8"
                    },
                    "message": {
                      "extendedTextMessage": {
                        "text": "example",
                        "backgroundArgb": 4294910617,
                        "font": "FB_SCRIPT"
                      }
                    },
                    "messageTimestamp": "1717691767",
                    "status": "PENDING",
                    "participant": "553198296801:17@s.whatsapp.net"
                  }
                }
              }              
            }
          }
        }
      }
    },
    "/message/sendLocation/{instance}": {
      "post": {
        "operationId": "sendLocation",
        "summary": "Send Location",
        "tags": ["Message Controller"],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "ID of the instance to connect",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Send Location",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": [
                  "number",
                  "locationMessage"
                ],
                "properties": {
                  "number": {
                    "type": "string",
                    "description": "Number to receive the message (with country code)"
                  },
                  "options": {
                    "type": "object",
                    "properties": {
                      "delay": {
                        "type": "integer",
                        "description": "Presence time in milliseconds before sending message"
                      },
                      "presence": {
                        "type": "string",
                        "description": "Presence type to show ",
                        "enum": ["composing"],
                        "default": "composing"
                      }
                    }
                  },
                  "locationMessage": {
                    "type": "object",
                    "required": [
                      "latitude",
                      "longitude"
                    ],
                    "properties": {
                      "name": {
                        "type": "string",
                        "description": "Location name"
                      },
                      "address": {
                        "type": "string",
                        "description": "Location address"
                      },
                      "latitude": {
                        "type": "number",
                        "description": "Location latitude"
                      },
                      "longitude": {
                        "type": "number",
                        "description": "Location longitude"
                      }
                    }
                  }
                }
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "Created",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "key": {
                      "type": "object",
                      "properties": {
                        "remoteJid": {
                          "type": "string",
                          "description": "The remote Jid."
                        },
                        "fromMe": {
                          "type": "boolean",
                          "description": "Indicates whether the message was sent by the user."
                        },
                        "id": {
                          "type": "string",
                          "description": "The ID of the message."
                        }
                      },
                      "description": "The key of the message, which identifies the message in the chat."
                    },
                    "message": {
                      "type": "object",
                      "properties": {
                        "locationMessage": {
                          "type": "object",
                          "properties": {
                            "degreesLatitude": {
                              "type": "number",
                              "format": "float",
                              "description": "The latitude of the location."
                            },
                            "degreesLongitude": {
                              "type": "number",
                              "format": "float",
                              "description": "The longitude of the location."
                            },
                            "name": {
                              "type": "string",
                              "description": "The name of the location."
                            },
                            "address": {
                              "type": "string",
                              "description": "The address of the location."
                            },
                            "contextInfo": {
                              "type": "object",
                              "description": "Additional context information."
                            }
                          },
                          "description": "Details of the location message."
                        }
                      },
                      "description": "The message content, which may include various types of messages like text, images, location, etc."
                    },
                    "messageTimestamp": {
                      "type": "string",
                      "description": "The timestamp of the message, represented as a string."
                    },
                    "status": {
                      "type": "string",
                      "description": "The status of the message, such as sent, received, or pending."
                    }
                  },
                  "example": {
                    "key": {
                      "remoteJid": "553198296801@s.whatsapp.net",
                      "fromMe": true,
                      "id": "BAE51B6FF4470AF9"
                    },
                    "message": {
                      "locationMessage": {
                        "degreesLatitude": -19.93359,
                        "degreesLongitude": -43.93851,
                        "name": "Palácio da Liberdade",
                        "address": "Praça da Liberdade, Belo Horizonte, MG 30140-050",
                        "contextInfo": {}
                      }
                    },
                    "messageTimestamp": "1717779606",
                    "status": "PENDING"
                  }
                }
              }
            }
          }
        }
      }
    },
    "/message/sendContact/{instance}": {
      "post": {
        "operationId": "sendContact",
        "summary": "Send Contact",
        "tags": ["Message Controller"],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "ID of the instance to connect",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Send Contact",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": [
                  "number",
                  "contactMessage"
                ],
                "properties": {
                  "number": {
                    "type": "string",
                    "description": "Number to receive the message (with country code)"
                  },
                  "options": {
                    "type": "object",
                    "properties": {
                      "delay": {
                        "type": "integer",
                        "description": "Presence time in milliseconds before sending message"
                      },
                      "presence": {
                        "type": "string",
                        "description": "Presence type to show ",
                        "enum": ["composing"],
                        "default": "composing"
                      }
                    }
                  },
                  "contactMessage": {
                    "type": "array",
                    "minItems": 1,
                    "items": {
                      "type": "object",
                      "required": ["fullname", "wuid", "phoneNumber"],
                      "properties": {
                        "fullName": {
                          "type": "string",
                          "description": "Contact full name"
                        },
                        "wuid": {
                          "type": "string",
                          "description": "Phone number non-stylized with country code (553198296801)"
                        },
                        "phoneNumber": {
                          "type": "string",
                          "description": "Phone number stylized (+55 31 9 9999-9999)"
                        },
                        "organization": {
                          "type": "string",
                          "description": "Organization name for the contact"
                        },
                        "email": {
                          "type": "string",
                          "description": "Contact email address"
                        },
                        "url": {
                          "type": "string",
                          "description": "Page URL"
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "Created",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "key": {
                      "type": "object",
                      "properties": {
                        "remoteJid": {
                          "type": "string",
                          "description": "The remote Jid."
                        },
                        "fromMe": {
                          "type": "boolean",
                          "description": "Indicates whether the message was sent by the user."
                        },
                        "id": {
                          "type": "string",
                          "description": "The ID of the message."
                        }
                      },
                      "description": "The key of the message, which identifies the message in the chat."
                    },
                    "message": {
                      "type": "object",
                      "properties": {
                        "contactMessage": {
                          "type": "object",
                          "properties": {
                            "displayName": {
                              "type": "string",
                              "description": "The display name of the contact."
                            },
                            "vcard": {
                              "type": "string",
                              "description": "The vCard format contact information."
                            },
                            "contextInfo": {
                              "type": "object",
                              "description": "Additional context information."
                            }
                          },
                          "description": "Details of the contact message."
                        }
                      },
                      "description": "The message content, which may include various types of messages like text, images, contact, etc."
                    },
                    "messageTimestamp": {
                      "type": "string",
                      "description": "The timestamp of the message, represented as a string."
                    },
                    "status": {
                      "type": "string",
                      "description": "The status of the message, such as sent, received, or pending."
                    }
                  },
                  "example": {
                    "key": {
                      "remoteJid": "553198296801@s.whatsapp.net",
                      "fromMe": true,
                      "id": "BAE58DA6CBC941BC"
                    },
                    "message": {
                      "contactMessage": {
                        "displayName": "Guilherme Gomes",
                        "vcard": "BEGIN:VCARD\nVERSION:3.0\nN:Guilherme Gomes\nFN:Guilherme Gomes\nORG:AtendAI;\nEMAIL:...",
                        "contextInfo": {}
                      }
                    },
                    "messageTimestamp": "1717780437",
                    "status": "PENDING"
                  }
                }
              }
            }
          }
        }
      }
    },
    "/message/sendReaction/{instance}": {
      "post": {
        "operationId": "sendReaction",
        "summary": "Send Reaction",
        "tags": ["Message Controller"],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "ID of the instance to connect",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Send Reaction",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "reactionMessage": {
                    "type": "object",
                    "properties": {
                      "key": {
                        "type": "object",
                        "properties": {
                          "remoteJid": {
                            "type": "string",
                            "description": "Chat contact or group remote JID"
                          },
                          "fromMe": {
                            "type": "boolean",
                            "description": "If the message was sent by the instance owner or not"
                          },
                          "id": {
                            "type": "string",
                            "description": "Message ID"
                          }
                        }
                      },
                      "reaction": {
                        "type": "string",
                        "description": "Reaction emoji",
                        "example": "🚀"
                      }
                    }
                  }
                }
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "Created",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "key": {
                      "type": "object",
                      "properties": {
                        "remoteJid": {
                          "type": "string",
                          "description": "The remote Jid."
                        },
                        "fromMe": {
                          "type": "boolean",
                          "description": "Indicates whether the message was sent by the user."
                        },
                        "id": {
                          "type": "string",
                          "description": "The ID of the message."
                        }
                      },
                      "description": "The key of the message, which identifies the message in the chat."
                    },
                    "message": {
                      "type": "object",
                      "properties": {
                        "reactionMessage": {
                          "type": "object",
                          "properties": {
                            "key": {
                              "type": "object",
                              "properties": {
                                "remoteJid": {
                                  "type": "string",
                                  "description": "The remote Jid of the original message."
                                },
                                "fromMe": {
                                  "type": "boolean",
                                  "description": "Indicates whether the original message was sent by the user."
                                },
                                "id": {
                                  "type": "string",
                                  "description": "The ID of the original message."
                                }
                              },
                              "description": "The key of the original message to which the reaction is linked."
                            },
                            "text": {
                              "type": "string",
                              "description": "The reaction text or emoji."
                            },
                            "senderTimestampMs": {
                              "type": "string",
                              "description": "The timestamp when the reaction was sent, in milliseconds."
                            }
                          },
                          "description": "Details of the reaction message."
                        }
                      },
                      "description": "The message content, which may include various types of messages like text, images, reaction, etc."
                    },
                    "messageTimestamp": {
                      "type": "string",
                      "description": "The timestamp of the message, represented as a string."
                    },
                    "status": {
                      "type": "string",
                      "description": "The status of the message, such as sent, received, or pending."
                    }
                  },
                  "example": {
                    "key": {
                      "remoteJid": "553198296801@s.whatsapp.net",
                      "fromMe": true,
                      "id": "BAE569F0E38F858D"
                    },
                    "message": {
                      "reactionMessage": {
                        "key": {
                          "remoteJid": "553198296801@s.whatsapp.net",
                          "fromMe": true,
                          "id": "BAE58DA6CBC941BC"
                        },
                        "text": "🚀",
                        "senderTimestampMs": "1717781105034"
                      }
                    },
                    "messageTimestamp": "1717781105",
                    "status": "PENDING"
                  }
                }
              }
            }
          }
        }
      }
    },
    "/message/sendPoll/{instance}": {
      "post": {
        "operationId": "sendPoll",
        "summary": "Send Poll",
        "tags": ["Message Controller"],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "ID of the instance to connect",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Send Poll",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": [
                  "number",
                  "pollMessage"
                ],
                "properties": {
                  "number": {
                    "type": "string",
                    "description": "Number to receive the message (with country code)"
                  },
                  "options": {
                    "type": "object",
                    "properties": {
                      "delay": {
                        "type": "integer",
                        "description": "Presence time in milliseconds before sending message"
                      },
                      "presence": {
                        "type": "string",
                        "description": "Presence type to show ",
                        "enum": ["composing", "recording"]
                      }
                    }
                  },
                  "pollMessage": {
                    "type": "object",
                    "required": [
                      "name",
                      "selectableCount",
                      "values"
                    ],
                    "properties": {
                      "name": {
                        "type": "string",
                        "description": "Name of the poll"
                      },
                      "selectableCount": {
                        "type": "integer",
                        "minimum": 1,
                        "description": "How many options each person can select"
                      },
                      "values": {
                        "type": "array",
                        "minItems": 1,
                        "items": {
                          "type": "string"
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "Created",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "key": {
                      "type": "object",
                      "properties": {
                        "remoteJid": {
                          "type": "string",
                          "description": "The remote Jid."
                        },
                        "fromMe": {
                          "type": "boolean",
                          "description": "Indicates whether the message was sent by the user."
                        },
                        "id": {
                          "type": "string",
                          "description": "The ID of the message."
                        }
                      },
                      "description": "The key of the message, which identifies the message in the chat."
                    },
                    "message": {
                      "type": "object",
                      "properties": {
                        "messageContextInfo": {
                          "type": "object",
                          "properties": {
                            "messageSecret": {
                              "type": "string",
                              "description": "The secret of the message context."
                            }
                          },
                          "description": "Information about the context of the message."
                        },
                        "pollCreationMessage": {
                          "type": "object",
                          "properties": {
                            "name": {
                              "type": "string",
                              "description": "The name of the poll."
                            },
                            "options": {
                              "type": "array",
                              "items": {
                                "type": "object",
                                "properties": {
                                  "optionName": {
                                    "type": "string",
                                    "description": "The name of the poll option."
                                  }
                                }
                              },
                              "description": "The options available in the poll."
                            },
                            "selectableOptionsCount": {
                              "type": "integer",
                              "description": "The number of options that can be selected in the poll."
                            }
                          },
                          "description": "Details of the poll creation message."
                        }
                      },
                      "description": "The message content, which may include various types of messages like text, images, poll creation, etc."
                    },
                    "messageTimestamp": {
                      "type": "string",
                      "description": "The timestamp of the message, represented as a string."
                    },
                    "status": {
                      "type": "string",
                      "description": "The status of the message, such as sent, received, or pending."
                    }
                  },
                  "example": {
                    "key": {
                      "remoteJid": "553198296801@s.whatsapp.net",
                      "fromMe": true,
                      "id": "BAE53EC8D8E1FD8A"
                    },
                    "message": {
                      "messageContextInfo": {
                        "messageSecret": "lX/+cLHHNfnTTKZi+88mrhoyi6KNuUzWjgfaB0bTfOY="
                      },
                      "pollCreationMessage": {
                        "name": "Poll Name",
                        "options": [
                          { "optionName": "Option 1" },
                          { "optionName": "Option 2" },
                          { "optionName": "Option 3" }
                        ],
                        "selectableOptionsCount": 1
                      }
                    },
                    "messageTimestamp": "1717781848",
                    "status": "PENDING"
                  }
                }
              }
            }
          }
        }
      }
    },
    "/message/sendList/{instance}": {
      "post": {
        "operationId": "sendList",
        "summary": "Send List",
        "tags": ["Message Controller"],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "ID of the instance to connect",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Send List",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "number": {
                    "type": "string",
                    "description": "Number to receive the message (with country code)"
                  },
                  "options": {
                    "type": "object",
                    "properties": {
                      "delay": {
                        "type": "integer",
                        "description": "Presence time in milliseconds before sending message"
                      },
                      "presence": {
                        "type": "string",
                        "description": "Presence type to show ",
                        "enum": ["composing", "recording"]
                      }
                    }
                  },
                  "listMessage": {
                    "type": "object",
                    "properties": {
                      "title": {
                        "type": "string",
                        "description": "List title"
                      },
                      "description": {
                        "type": "string",
                        "description": "List description"
                      },
                      "buttonText": {
                        "type": "string",
                        "description": "Button text"
                      },
                      "footerText": {
                        "type": "string",
                        "description": "Footer text"
                      },
                      "sections": {
                        "type": "array",
                        "items": {
                          "type": "object",
                          "properties": {
                            "title": {
                              "type": "string",
                              "description": "Section title"
                            },
                            "rows": {
                              "type": "array",
                              "items": {
                                "type": "object",
                                "properties": {
                                  "title": {
                                    "type": "string",
                                    "description": "Row title"
                                  },
                                  "description": {
                                    "type": "string",
                                    "description": "Row description"
                                  },
                                  "rowId": {
                                    "type": "string",
                                    "description": "Row ID"
                                  }
                                }
                              }
                            }
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "Created",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "key": {
                      "type": "object",
                      "properties": {
                        "remoteJid": {
                          "type": "string",
                          "description": "The remote Jid."
                        },
                        "fromMe": {
                          "type": "boolean",
                          "description": "Indicates whether the message was sent by the user."
                        },
                        "id": {
                          "type": "string",
                          "description": "The ID of the message."
                        }
                      },
                      "description": "The key of the message, which identifies the message in the chat."
                    },
                    "message": {
                      "type": "object",
                      "properties": {
                        "listMessage": {
                          "type": "object",
                          "properties": {
                            "title": {
                              "type": "string",
                              "description": "The title of the list message."
                            },
                            "description": {
                              "type": "string",
                              "description": "The description of the list message."
                            },
                            "buttonText": {
                              "type": "string",
                              "description": "The text of the button in the list message."
                            },
                            "listType": {
                              "type": "string",
                              "description": "The type of the list."
                            },
                            "sections": {
                              "type": "array",
                              "items": {
                                "type": "object",
                                "properties": {
                                  "title": {
                                    "type": "string",
                                    "description": "The title of the section."
                                  },
                                  "rows": {
                                    "type": "array",
                                    "items": {
                                      "type": "object",
                                      "properties": {
                                        "title": {
                                          "type": "string",
                                          "description": "The title of the row."
                                        },
                                        "description": {
                                          "type": "string",
                                          "description": "The description of the row."
                                        },
                                        "rowId": {
                                          "type": "string",
                                          "description": "The ID of the row."
                                        }
                                      }
                                    }
                                  }
                                }
                              },
                              "description": "The sections in the list message."
                            },
                            "contextInfo": {
                              "type": "object",
                              "description": "Additional context information."
                            }
                          },
                          "description": "Details of the list message."
                        }
                      },
                      "description": "The message content, which may include various types of messages like text, images, list, etc."
                    },
                    "messageTimestamp": {
                      "type": "string",
                      "description": "The timestamp of the message, represented as a string."
                    },
                    "status": {
                      "type": "string",
                      "description": "The status of the message, such as sent, received, or pending."
                    }
                  },
                  "example": {
                    "key": {
                      "remoteJid": "553198296801@s.whatsapp.net",
                      "fromMe": true,
                      "id": "BAE5096096C5E261"
                    },
                    "message": {
                      "listMessage": {
                        "title": "List Title",
                        "description": "List description",
                        "buttonText": "Click Me",
                        "listType": "PRODUCT_LIST",
                        "sections": [
                          {
                            "title": "Section title",
                            "rows": [
                              {
                                "title": "Row 1",
                                "description": "Row 1 description",
                                "rowId": "1"
                              },
                              {
                                "title": "Row 2",
                                "description": "Row 2 description",
                                "rowId": "2"
                              }
                            ]
                          },
                          {
                            "title": "Section 2",
                            "rows": [
                              {
                                "title": "Row 1",
                                "description": "Row 1 description",
                                "rowId": "1"
                              },
                              {
                                "title": "Row 2",
                                "description": "Row 2 description",
                                "rowId": "2"
                              }
                            ]
                          }
                        ],
                        "contextInfo": {}
                      }
                    },
                    "messageTimestamp": "1717782429",
                    "status": "PENDING"
                  },
                  "required": ["message"]
                }
              }
            }
          }
        }
      }
    },
    "/chat/whatsappNumbers/{instance}": {
      "post": {
        "operationId": "whatsappNumbers",
        "summary": "WhatsApp Numbers",
        "tags": ["Chat Controller"],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "ID of the instance to connect",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Check if numbers are on WhatsApp",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "numbers": {
                    "type": "array",
                    "description": "Phone numbers (with country code) to be checked",
                    "items": {
                      "type": "string"
                    }
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Ok",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "type": "object",
                    "properties": {
                      "exists": {
                        "type": "boolean",
                        "description": "Indicates whether the WhatsApp account exists."
                      },
                      "jid": {
                        "type": "string",
                        "description": "The JID of the WhatsApp account."
                      },
                      "number": {
                        "type": "string",
                        "description": "The phone number associated with the WhatsApp account."
                      }
                    }
                  },
                  "description": "Array of objects representing WhatsApp account existence information.",
                  "example": [
                    {
                      "exists": true,
                      "jid": "553198296801@s.whatsapp.net",
                      "number": "553198296801"
                    }
                  ]
                }
              }              
            }
          }
        }
      }
    },
    "/chat/markMessageAsRead/{instance}": {
      "put": {
        "operationId": "markMessageAsRead",
        "summary": "Mark Message As Read",
        "tags": ["Chat Controller"],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "ID of the instance to connect",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Mark message as read",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "read_messages": {
                    "type": "array",
                    "description": "Messages to be mark as read",
                    "items": {
                      "type": "object",
                      "properties": {
                        "remoteJid": {
                          "type": "string",
                          "description": "Chat contact or group remote JID"
                        },
                        "fromMe": {
                          "type": "boolean",
                          "description": "If the message was sent by the instance owner or the contact"
                        },
                        "id": {
                          "type": "string",
                          "description": "Message ID"
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "Created",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "message": {
                      "type": "string",
                      "description": "A brief message describing the action performed."
                    },
                    "read": {
                      "type": "string",
                      "description": "The status of the read action."
                    }
                  },
                  "example": {
                    "message": "Read messages",
                    "read": "success"
                  }
                }
              }              
            }
          }
        }
      }
    },
    "/chat/archiveChat/{instance}": {
      "put": {
        "operationId": "archiveChat",
        "summary": "Archive Chat",
        "tags": ["Chat Controller"],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "ID of the instance to connect",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Archive Chat",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": ["lastMessage", "archive"],
                "properties": {
                  "lastMessage": {
                    "type": "object",
                    "description": "Messages to be mark as read",
                    "required": ["key"],
                    "properties": {
                      "key": {
                        "type": "object",
                        "required": ["remoteJid", "fromMe", "id"],
                        "properties": {
                          "remoteJid": {
                            "type": "string",
                            "description": "Chat contact or group remote JID"
                          },
                          "fromMe": {
                            "type": "boolean",
                            "description": "If the message was sent by the instance owner or the contact"
                          },
                          "id": {
                            "type": "string",
                            "description": "Message ID"
                          }
                        }
                      }
                    }
                  },
                  "archive": {
                    "type": "boolean",
                    "description": "Whether to archive the chat or not"
                  }
                }
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "Created",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "chatId": {
                      "type": "string",
                      "description": "The ID of the chat."
                    },
                    "archived": {
                      "type": "boolean",
                      "description": "Indicates whether the chat is archived."
                    }
                  },
                  "example": {
                    "chatId": "553198296801@s.whatsapp.net",
                    "archived": true
                  }
                }
              }              
            }
          }
        }
      }
    },
    "/chat/deleteMessageForEveryone/{instance}": {
      "delete": {
        "operationId": "deleteMessageForEveryone",
        "summary": "Delete Message For Everyone",
        "tags": ["Chat Controller"],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "ID of the instance to connect",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Delete Message For Everyone",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": ["id", "remoteJid", "fromMe"],
                "properties": {
                  "id": {
                    "type": "string",
                    "description": "Message ID"
                  },
                  "remoteJid": {
                    "type": "string",
                    "description": "Chat contact or group remote JID"
                  },
                  "fromMe": {
                    "type": "boolean",
                    "description": "If the message was sent by the instance owner or the contact"
                  },
                  "participant": {
                    "type": "string",
                    "description": "Participant for group messages only TODO"
                  }
                }
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "Created",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "key": {
                      "type": "object",
                      "properties": {
                        "remoteJid": {
                          "type": "string",
                          "description": "The remote JID (Jabber ID) of the WhatsApp account."
                        },
                        "fromMe": {
                          "type": "boolean",
                          "description": "Indicates whether the message was sent by the user."
                        },
                        "id": {
                          "type": "string",
                          "description": "The ID of the message."
                        }
                      },
                      "description": "The key that identifies the message in the chat."
                    },
                    "message": {
                      "type": "object",
                      "properties": {
                        "protocolMessage": {
                          "type": "object",
                          "properties": {
                            "key": {
                              "type": "object",
                              "properties": {
                                "remoteJid": {
                                  "type": "string",
                                  "description": "The remote JID (Jabber ID) of the WhatsApp account in the referenced message."
                                },
                                "fromMe": {
                                  "type": "boolean",
                                  "description": "Indicates whether the referenced message was sent by the user."
                                },
                                "id": {
                                  "type": "string",
                                  "description": "The ID of the referenced message."
                                }
                              },
                              "description": "The key that identifies the referenced message."
                            },
                            "type": {
                              "type": "string",
                              "description": "The type of protocol message, e.g., 'REVOKE'."
                            }
                          },
                          "description": "Details of the protocol message."
                        }
                      },
                      "description": "The content of the message."
                    },
                    "messageTimestamp": {
                      "type": "string",
                      "description": "The timestamp of the message, represented as a string."
                    },
                    "status": {
                      "type": "string",
                      "description": "The status of the message, such as sent, received, or pending."
                    }
                  },
                  "description": "Schema representing a WhatsApp protocol message, including the key, message content, timestamp, and status.",
                  "example": {
                    "key": {
                      "remoteJid": "553198296801@s.whatsapp.com",
                      "fromMe": true,
                      "id": "BAE5EABBD912C4E2"
                    },
                    "message": {
                      "protocolMessage": {
                        "key": {
                          "remoteJid": "553198296801@s.whatsapp.com",
                          "fromMe": true,
                          "id": "BAE52B567D0E3DD8"
                        },
                        "type": "REVOKE"
                      }
                    },
                    "messageTimestamp": "1718108455",
                    "status": "PENDING"
                  }
                }
              }              
            }
          }
        }
      }
    },
    "/chat/sendPresence/{instance}": {
      "post": {
        "operationId": "sendPresence",
        "summary": "Send Presence",
        "tags": ["Chat Controller"],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "ID of the instance to connect",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Send Presence (typing...)",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": ["number", "options"],
                "properties": {
                  "number": {
                    "type": "string",
                    "description": "Receiver phone number with country code"
                  },
                  "options": {
                    "type": "object",
                    "required": ["delay", "presence"],
                    "properties": {
                      "delay": {
                        "type": "integer",
                        "description": "Presence display time in milliseconds"
                      },
                      "presence": {
                        "type": "string",
                        "description": "Presence type",
                        "enum": ["composing", "recording"]
                      }
                    }
                  }
                }
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "Created",
            "content": {}
          }
        }
      }
    },
    "/chat/fetchProfilePictureUrl/{instance}": {
      "post": {
        "operationId": "fetchProfilePictureUrl",
        "summary": "Fetch Profile Picture URL",
        "tags": ["Chat Controller"],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "ID of the instance to connect",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Fetch Profile Picture URL",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "number": {
                    "type": "string",
                    "description": "Number to fetch profile picture URL"
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Ok",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "wuid": {
                      "type": "string",
                      "description": "The WhatsApp User ID (WUID)."
                    },
                    "profilePictureUrl": {
                      "type": "string",
                      "description": "URL of the user's profile picture."
                    }
                  },
                  "example": {
                    "wuid": "553198296801@s.whatsapp.net",
                    "profilePictureUrl": "https://pps.whatsapp.net/v/t61.2..."
                  }
                }
              }              
            }
          }
        }
      }
    },
    "/chat/findContacts/{instance}": {
      "post": {
        "operationId": "findContacts",
        "summary": "Find Contacts",
        "tags": ["Chat Controller"],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "ID of the instance to connect",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Find all contacts or just one from ID",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "where": {
                    "type": "object",
                    "properties": {
                      "id": {
                        "type": "string",
                        "description": "Contact number"
                      }
                    }
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Ok",
            "content": {}
          }
        }
      }
    },
    "/chat/getBase64FromMediaMessage/{instance}": {
      "post": {
        "operationId": "getBase64FromMediaMessage",
        "summary": "Get Base64 From Media Message",
        "tags": ["Chat Controller"],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "ID of the instance to connect",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Get base64 from media message",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": ["message"],
                "properties": {
                  "message": {
                    "type": "object",
                    "properties": {
                      "key": {
                        "type": "object",
                        "properties": {
                          "id": {
                            "type": "string",
                            "description": "Message ID"
                          }
                        }
                      }
                    }
                  },
                  "convertToMp4": {
                    "type": "boolean",
                    "description": "Convert video to MP4, for video only"
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Ok",
            "content": {}
          }
        }
      }
    },
    "/chat/findMessages/{instance}": {
      "post": {
        "operationId": "findMessages",
        "summary": "Find Messages",
        "tags": ["Chat Controller"],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "ID of the instance to connect",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Find all messages",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "where": {
                    "type": "object",
                    "properties": {
                      "key": {
                        "type": "object",
                        "properties": {
                          "remoteJid": {
                            "type": "string",
                            "description": "Contact or group remote JID"
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Ok",
            "content": {}
          }
        }
      }
    },
    "/chat/findStatusMessage/{instance}": {
      "post": {
        "operationId": "findStatusMessage",
        "summary": "Find Status Message",
        "tags": ["Chat Controller"],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "ID of the instance to connect",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Find status message",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "where": {
                    "type": "object",
                    "properties": {
                      "_id": {
                        "type": "string",
                        "description": "MongoDB message ID"
                      },
                      "id": {
                        "type": "string",
                        "description": "Message ID (from WhatsApp)"
                      },
                      "remoteJid": {
                        "type": "string",
                        "description": "Contact or group remote JID"
                      },
                      "fromMe": {
                        "type": "boolean",
                        "description": "Whether the message is from the instance owner or not"
                      }
                    }
                  },
                  "limit": {
                    "type": "integer",
                    "description": "Limit for the return"
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Ok",
            "content": {}
          }
        }
      }
    },
    "/chat/updateMessage/{instance}": {
      "put": {
        "operationId": "updateMessage",
        "summary": "Update Message",
        "tags": ["Chat Controller"],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "ID of the instance to connect",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Update message",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "number": {
                    "type": "integer",
                    "description": "Receiver phone number with country code"
                  },
                  "text": {
                    "type": "string",
                    "description": "New message content"
                  },
                  "key": {
                    "type": "object",
                    "properties": {
                      "remoteJid": {
                        "type": "string",
                        "description": "Chat contact or group remote JID"
                      },
                      "fromMe": {
                        "type": "boolean",
                        "description": "If the message was sent by the instance owner or not"
                      },
                      "id": {
                        "type": "string",
                        "description": "Message ID"
                      }
                    }
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Ok",
            "content": {}
          }
        }
      }
    },
    "/chat/findChats/{instance}": {
      "get": {
        "operationId": "findChats",
        "summary": "Find Chats",
        "tags": ["Chat Controller"],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "ID of the instance to connect",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Find all chats",
        "responses": {
          "200": {
            "description": "Ok",
            "content": {}
          }
        }
      }
    },
    "/chat/fetchBusinessProfile/{instance}": {
      "post": {
        "operationId": "fetchBusinessProfile",
        "summary": "Fetch Business Profile",
        "tags": ["Chat Controller"],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "ID of the instance to connect",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Fetch business profile from phone number",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "number": {
                    "type": "string",
                    "description": "Phone number with country code"
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Ok",
            "content": {}
          }
        }
      }
    },
    "/chat/fetchProfile/{instance}": {
      "post": {
        "operationId": "fetchBusinessProfile",
        "summary": "Fetch Business Profile",
        "tags": ["Chat Controller"],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "ID of the instance to connect",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Fetch business profile from phone number",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "number": {
                    "type": "string",
                    "description": "Phone number with country code"
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Ok",
            "content": {}
          }
        }
      }
    },
    "/chat/updateProfileName/{instance}": {
      "post": {
        "operationId": "updateProfileName",
        "summary": "Update Profile Name",
        "tags": ["Chat Controller"],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "ID of the instance to connect",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Update profile name",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "name": {
                    "type": "string",
                    "description": "New name for profile"
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Ok",
            "content": {}
          }
        }
      }
    },
    "/chat/updateProfileStatus/{instance}": {
      "post": {
        "operationId": "updateProfileStatus",
        "summary": "Update Profile Status",
        "tags": ["Chat Controller"],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "ID of the instance to connect",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Update profile status",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "status": {
                    "type": "string",
                    "description": "New status for profile"
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Ok",
            "content": {}
          }
        }
      }
    },
    "/chat/updateProfilePicture/{instance}": {
      "put": {
        "operationId": "updateProfilePicture",
        "summary": "Update Profile Picture",
        "tags": ["Chat Controller"],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "ID of the instance to connect",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Update profile picture",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "picture": {
                    "type": "string",
                    "description": "New spicture URL"
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Ok",
            "content": {}
          }
        }
      }
    },
    "/chat/removeProfilePicture/{instance}": {
      "delete": {
        "operationId": "removeProfilePicture",
        "summary": "Remove Profile Picture",
        "tags": ["Chat Controller"],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "ID of the instance to connect",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Update profile picture",
        "responses": {
          "200": {
            "description": "Ok",
            "content": {}
          }
        }
      }
    },
    "/chat/fetchPrivacySettings/{instance}": {
      "get": {
        "operationId": "fetchPrivacySettings",
        "summary": "Fetch Privacy Settings",
        "tags": ["Chat Controller"],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "ID of the instance to connect",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Fetch privacy settings",
        "responses": {
          "200": {
            "description": "Ok",
            "content": {}
          }
        }
      }
    },
    "/chat/updatePrivacySettings/{instance}": {
      "put": {
        "operationId": "updatePrivacySettings",
        "summary": "Update Privacy Settings",
        "tags": ["Chat Controller"],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "ID of the instance to connect",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Update privacy settings",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "privacySettings": {
                    "type": "object",
                    "properties": {
                      "readreceipts": {
                        "type": "string",
                        "enum": ["all", "none"]
                      },
                      "profile": {
                        "type": "string",
                        "enum": ["all", "contacts", "contact_blacklist", "none"]
                      },
                      "status": {
                        "type": "string",
                        "enum": ["all", "contacts", "contact_blacklist", "none"]
                      },
                      "online": {
                        "type": "string",
                        "enum": ["all", "match_last_seen"]
                      },
                      "last": {
                        "type": "string",
                        "enum": ["all", "contacts", "contact_blacklist", "none"]
                      },
                      "groupadd": {
                        "type": "string",
                        "enum": ["all", "contacts", "contact_blacklist"]
                      }
                    }
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Ok",
            "content": {}
          }
        }
      }
    },
    "/group/create/{instance}": {
      "post": {
        "operationId": "createGroup",
        "summary": "Create Group",
        "tags": ["Group Controller"],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "ID of the instance to connect",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Create group",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "subject": {
                    "type": "object",
                    "description": "Group subject"
                  },
                  "description": {
                    "type": "string",
                    "description": "Group description"
                  },
                  "participants": {
                    "type": "array",
                    "description": "Group members phone numbers with country code",
                    "items": {
                      "type": "string"
                    }
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Ok",
            "content": {}
          }
        }
      }
    },
    "/group/updateGroupPicture/{instance}": {
      "put": {
        "operationId": "createGroup",
        "summary": "Create Group",
        "tags": ["Group Controller"],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "ID of the instance to connect",
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "groupJid",
            "description": "Group remote JID",
            "required": true,
            "in": "query",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Create group",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "image": {
                    "type": "object",
                    "description": "New profile picture image URL"
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Ok",
            "content": {}
          }
        }
      }
    },
    "/group/updateGroupSubject/{instance}": {
      "put": {
        "operationId": "updateGroupSubject",
        "summary": "Update Group Subject",
        "tags": ["Group Controller"],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "ID of the instance to connect",
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "groupJid",
            "description": "Group remote JID",
            "required": true,
            "in": "query",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Update group subject",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "subject": {
                    "type": "object",
                    "description": "New group subject"
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Ok",
            "content": {}
          }
        }
      }
    },
    "/group/updateGroupDescription/{instance}": {
      "put": {
        "operationId": "updateGroupDescription",
        "summary": "Update Group Description",
        "tags": ["Group Controller"],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "ID of the instance to connect",
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "groupJid",
            "description": "Group remote JID",
            "required": true,
            "in": "query",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Update group description",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "description": {
                    "type": "object",
                    "description": "New group description"
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Ok",
            "content": {}
          }
        }
      }
    },
    "/group/inviteCode/{instance}": {
      "get": {
        "operationId": "fetchInviteCode",
        "summary": "Fetch Group Invite Code",
        "tags": ["Group Controller"],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "ID of the instance to connect",
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "groupJid",
            "description": "Group remote JID",
            "required": true,
            "in": "query",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Fetch group invite code",
        "responses": {
          "200": {
            "description": "Ok",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "inviteUrl": {
                      "type": "string",
                      "description": "The URL for the WhatsApp group invite."
                    },
                    "inviteCode": {
                      "type": "string",
                      "description": "The code for the WhatsApp group invite."
                    }
                  },
                  "example": {
                    "inviteUrl": "https://chat.whatsapp.com/DgQvyfXzY01B6rGrpZpYze",
                    "inviteCode": "DgQvyfXzY01B6rGrpZpYze"
                  }
                }
              }              
            }
          }
        }
      }
    },
    "/group/acceptInviteCode/{instance}": {
      "get": {
        "operationId": "fetchInviteCode",
        "summary": "Fetch Group Invite Code",
        "tags": ["Group Controller"],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "ID of the instance to connect",
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "inviteCode",
            "description": "Group invite code",
            "required": true,
            "in": "query",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Fetch group invite code",
        "responses": {
          "200": {
            "description": "Ok",
            "content": {}
          }
        }
      }
    },
    "/group/revokeInviteCode/{instance}": {
      "put": {
        "operationId": "fetchInviteCode",
        "summary": "Fetch Group Invite Code",
        "tags": ["Group Controller"],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "ID of the instance to connect",
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "groupJid",
            "description": "Group remote JID",
            "required": true,
            "in": "query",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Fetch group invite code",
        "responses": {
          "200": {
            "description": "Ok",
            "content": {}
          }
        }
      }
    },
    "/group/sendInvite/{instance}": {
      "post": {
        "operationId": "sendGroupInvite",
        "summary": "Send Group Invite",
        "tags": ["Group Controller"],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "ID of the instance to connect",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Send group invite",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": ["groupJid", "numbers"],
                "properties": {
                  "groupJid": {
                    "type": "string",
                    "description": "Group remote JID"
                  },
                  "description": {
                    "type": "string",
                    "description": "Description to send with the invitation"
                  },
                  "numbers": {
                    "type": "array",
                    "description": "Numbers to receive the invitation",
                    "items": {
                      "type": "string"
                    }
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Ok",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "send": {
                      "type": "boolean",
                      "description": "Indicates if the invite was sent successfully."
                    },
                    "inviteUrl": {
                      "type": "string",
                      "description": "The URL for the WhatsApp group invite."
                    }
                  },
                  "example": {
                    "send": true,
                    "inviteUrl": "https://chat.whatsapp.com/DgQvyfXzY01B6rGrpZpYze"
                  }
                }
              }              
            }
          }
        }
      }
    },
    "/group/inviteInfo/{instance}": {
      "get": {
        "operationId": "findGroupByInviteCode",
        "summary": "Find Group By Invite Code",
        "tags": ["Group Controller"],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "ID of the instance to connect",
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "inviteCode",
            "in": "query",
            "description": "Group invite code",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Find group by invite code",
        "responses": {
          "200": {
            "description": "Ok",
            "content": {}
          }
        }
      }
    },
    "/group/findGroupInfos/{instance}": {
      "get": {
        "operationId": "findGroupByJid",
        "summary": "Find Group By Remote JID",
        "tags": ["Group Controller"],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "ID of the instance to connect",
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "groupJid",
            "in": "query",
            "required": true,
            "description": "Group remote JID",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Find group by remote JID",
        "responses": {
          "200": {
            "description": "Ok",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "id": {
                      "type": "string",
                      "description": "The ID of the group."
                    },
                    "subject": {
                      "type": "string",
                      "description": "The subject (name) of the group."
                    },
                    "subjectOwner": {
                      "type": "string",
                      "description": "The ID of the user who set the subject."
                    },
                    "subjectTime": {
                      "type": "integer",
                      "description": "The timestamp when the subject was set."
                    },
                    "pictureUrl": {
                      "type": "string",
                      "description": "URL of the group's profile picture."
                    },
                    "size": {
                      "type": "integer",
                      "description": "The number of participants in the group."
                    },
                    "creation": {
                      "type": "integer",
                      "description": "The timestamp when the group was created."
                    },
                    "owner": {
                      "type": "string",
                      "description": "The ID of the group owner."
                    },
                    "desc": {
                      "type": "string",
                      "description": "The description of the group."
                    },
                    "descId": {
                      "type": "string",
                      "description": "The ID of the description message."
                    },
                    "restrict": {
                      "type": "boolean",
                      "description": "Indicates if the group is restricted (only admins can send messages)."
                    },
                    "announce": {
                      "type": "boolean",
                      "description": "Indicates if the group is an announcement group (only admins can send messages)."
                    },
                    "participants": {
                      "type": "array",
                      "items": {
                        "type": "object",
                        "properties": {
                          "id": {
                            "type": "string",
                            "description": "The ID of the participant."
                          },
                          "admin": {
                            "type": "string",
                            "description": "The role of the participant (e.g., 'admin', 'superadmin')."
                          }
                        }
                      },
                      "description": "List of participants in the group."
                    }
                  },
                  "example": {
                    "id": "120363295648424210@g.us",
                    "subject": "Example Group",
                    "subjectOwner": "553198296801@s.whatsapp.net",
                    "subjectTime": 1714769954,
                    "pictureUrl": null,
                    "size": 1,
                    "creation": 1714769954,
                    "owner": "553198296801@s.whatsapp.net",
                    "desc": "optional",
                    "descId": "BAE57E16498982ED",
                    "restrict": false,
                    "announce": false,
                    "participants": [
                      {
                        "id": "553198296801@s.whatsapp.net",
                        "admin": "superadmin"
                      }
                    ]
                  }
                }
              }              
            }
          }
        }
      }
    },
    "/group/fetchAllGroups/{instance}": {
      "get": {
        "operationId": "fetchAllGroups",
        "summary": "Fetch All Groups",
        "tags": ["Group Controller"],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "ID of the instance to connect",
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "getParticipants",
            "in": "query",
            "required": true,
            "description": "Whether to get the group members or not",
            "schema": {
              "type": "boolean"
            }
          }
        ],
        "description": "Fetch all groups",
        "responses": {
          "200": {
            "description": "Ok",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "type": "object",
                    "properties": {
                      "id": {
                        "type": "string",
                        "description": "The ID of the group."
                      },
                      "subject": {
                        "type": "string",
                        "description": "The subject (name) of the group."
                      },
                      "subjectOwner": {
                        "type": "string",
                        "description": "The ID of the user who set the subject."
                      },
                      "subjectTime": {
                        "type": "integer",
                        "description": "The timestamp when the subject was set."
                      },
                      "pictureUrl": {
                        "type": "string",
                        "description": "URL of the group's profile picture."
                      },
                      "size": {
                        "type": "integer",
                        "description": "The number of participants in the group."
                      },
                      "creation": {
                        "type": "integer",
                        "description": "The timestamp when the group was created."
                      },
                      "owner": {
                        "type": "string",
                        "description": "The ID of the group owner."
                      },
                      "desc": {
                        "type": "string",
                        "description": "The description of the group."
                      },
                      "descId": {
                        "type": "string",
                        "description": "The ID of the description message."
                      },
                      "restrict": {
                        "type": "boolean",
                        "description": "Indicates if the group is restricted (only admins can send messages)."
                      },
                      "announce": {
                        "type": "boolean",
                        "description": "Indicates if the group is an announcement group (only admins can send messages)."
                      }
                    },
                    "required": ["id", "subject", "subjectOwner", "subjectTime", "size", "creation", "owner", "restrict", "announce"]
                  },
                  "description": "Array of objects representing WhatsApp group details.",
                  "example": [
                    {
                      "id": "120363295648424210@g.us",
                      "subject": "Example Group",
                      "subjectOwner": "553198296801@s.whatsapp.net",
                      "subjectTime": 1714769954,
                      "pictureUrl": null,
                      "size": 1,
                      "creation": 1714769954,
                      "owner": "553198296801@s.whatsapp.net",
                      "desc": "optional",
                      "descId": "BAE57E16498982ED",
                      "restrict": false,
                      "announce": false
                    }
                  ]
                }
              }              
            }
          }
        }
      }
    },
    "/group/participants/{instance}": {
      "get": {
        "operationId": "fetchAllGroupMembers",
        "summary": "Fetch All Group Members",
        "tags": ["Group Controller"],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "ID of the instance to connect",
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "groupJid",
            "in": "query",
            "required": true,
            "description": "Group remote JID",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Fetch all group members",
        "responses": {
          "200": {
            "description": "Ok",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "participants": {
                      "type": "array",
                      "items": {
                        "type": "object",
                        "properties": {
                          "id": {
                            "type": "string",
                            "description": "The ID of the participant."
                          },
                          "admin": {
                            "type": "string",
                            "description": "The role of the participant (e.g., 'admin', 'superadmin')."
                          }
                        },
                        "required": ["id"]
                      },
                      "description": "List of participants in the group."
                    }
                  },
                  "example": {
                    "participants": [
                      {
                        "id": "553198296801@s.whatsapp.net",
                        "admin": "superadmin"
                      }
                    ]
                  }
                }
              }              
            }
          }
        }
      }
    },
    "/group/updateParticipant/{instance}": {
      "put": {
        "operationId": "updateParticipant",
        "summary": "Update Group Members",
        "tags": ["Group Controller"],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "ID of the instance to connect",
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "groupJid",
            "in": "query",
            "required": true,
            "description": "Group remote JID",
            "schema": {
              "type": "boolean"
            }
          }
        ],
        "description": "Update group members",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "action": {
                    "type": "string",
                    "enum": ["add", "remove", "promote", "demote"]
                  },
                  "participants": {
                    "type": "array",
                    "description": "Group members phone numbers with country code",
                    "items": {
                      "type": "string"
                    }
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Ok",
            "content": {}
          }
        }
      }
    },
    "/group/updateSetting/{instance}": {
      "put": {
        "operationId": "updateSetting",
        "summary": "Update Group Settings",
        "tags": ["Group Controller"],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "ID of the instance to connect",
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "groupJid",
            "in": "query",
            "required": true,
            "description": "Group remote JID",
            "schema": {
              "type": "boolean"
            }
          }
        ],
        "description": "Update group settings",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "action": {
                    "type": "string",
                    "description": "Group setting (`announcement` = only admins can send messages; `not_announcement` = everyone can send messages; `locked` = only admins can edit group settings; `unlocked` = everyone can edit group settings",
                    "enum": [
                      "announcement",
                      "not_announcement",
                      "locked",
                      "unlocked"
                    ]
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Ok",
            "content": {}
          }
        }
      }
    },
    "/group/toggleEphemeral/{instance}": {
      "put": {
        "operationId": "toggleEphemeral",
        "summary": "Toggle Ephemeral Group Messages",
        "tags": ["Group Controller"],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "ID of the instance to connect",
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "groupJid",
            "in": "query",
            "required": true,
            "description": "Group remote JID",
            "schema": {
              "type": "boolean"
            }
          }
        ],
        "description": "Toggle temporary messages on group",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": ["expiration"],
                "properties": {
                  "expiration": {
                    "type": "integer",
                    "description": "Time to expire message (in seconds)"
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Ok",
            "content": {}
          }
        }
      }
    },
    "/group/leaveGroup/{instance}": {
      "delete": {
        "operationId": "leaveGroup",
        "summary": "Leave Group",
        "tags": ["Group Controller"],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "ID of the instance to connect",
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "groupJid",
            "in": "query",
            "required": true,
            "description": "Group remote JID",
            "schema": {
              "type": "boolean"
            }
          }
        ],
        "description": "Leave group",
        "responses": {
          "200": {
            "description": "Ok",
            "content": {}
          }
        }
      }
    },
    "/typebot/set/{instance}": {
      "post": {
        "operationId": "setTypebot",
        "summary": "Set Typebot",
        "tags": ["Typebot Controller"],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "ID of the instance to connect",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Set typebot",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "enabled": {
                    "type": "boolean"
                  },
                  "url": {
                    "type": "string",
                    "description": "Typebot URL"
                  },
                  "typebot": {
                    "type": "string",
                    "description": "Typebot name"
                  },
                  "expire": {
                    "type": "integer",
                    "description": "Time to expire the sessions"
                  },
                  "keyword_finish": {
                    "type": "string",
                    "description": "Key word to finish typebot flow"
                  },
                  "delay_message": {
                    "type": "integer",
                    "description": "Default delay for text messages"
                  },
                  "unknown_message": {
                    "type": "string",
                    "description": "'Unknown message' error message"
                  },
                  "listening_from_me": {
                    "type": "boolean",
                    "description": "Start typebot for your own messages"
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Ok",
            "content": {}
          }
        }
      }
    },
    "/typebot/start/{instance}": {
      "post": {
        "operationId": "startTypebot",
        "summary": "Start Typebot",
        "tags": ["Typebot Controller"],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "ID of the instance to connect",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Start typebot",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "url": {
                    "type": "string",
                    "description": "Typebot URL"
                  },
                  "typebot": {
                    "type": "string",
                    "description": "Typebot name"
                  },
                  "remoteJid": {
                    "type": "string",
                    "description": "Receiver remote JID"
                  },
                  "startSession": {
                    "type": "boolean",
                    "description": "Start a new session"
                  },
                  "variables": {
                    "type": "array",
                    "items": {
                      "type": "object",
                      "properties": {
                        "name": {
                          "type": "string",
                          "description": "Variable name"
                        },
                        "value": {
                          "type": "string",
                          "description": "Variable value"
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Ok",
            "content": {}
          }
        }
      }
    },
    "/typebot/find/{instance}": {
      "get": {
        "operationId": "findTypebot",
        "summary": "Find Typebot",
        "tags": ["Typebot Controller"],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "ID of the instance to connect",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Find typebot",
        "responses": {
          "200": {
            "description": "Ok",
            "content": {}
          }
        }
      }
    },
    "/typebot/changeStatus/{instance}": {
      "post": {
        "operationId": "changeTypebotStatus",
        "summary": "Change Typebot Status",
        "tags": ["Typebot Controller"],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "ID of the instance to connect",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Start typebot",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "remoteJid": {
                    "type": "string",
                    "description": "Receiver remote JID"
                  },
                  "status": {
                    "type": "string",
                    "description": "New typebot status",
                    "enum": ["opened", "closed", "paused"]
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Ok",
            "content": {}
          }
        }
      }
    },
    "/chatwoot/set/{instance}": {
      "post": {
        "operationId": "setChatwoot",
        "summary": "Set Chatwoot",
        "tags": ["Chatwoot Controller"],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "ID of the instance to connect",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Set Chatwoot",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "enabled": {
                    "type": "boolean"
                  },
                  "account_id": {
                    "type": "string",
                    "description": "Chatwoot account ID"
                  },
                  "token": {
                    "type": "string",
                    "description": "Chatwoot token"
                  },
                  "url": {
                    "type": "string",
                    "description": "Chatwoot server URL"
                  },
                  "sign_msg": {
                    "type": "boolean",
                    "description": "Sign message with user name"
                  },
                  "sign_delimiter": {
                    "type": "string",
                    "description": "Delimiter for sign before the message. Use `\n` for line break"
                  },
                  "reopen_conversation": {
                    "type": "boolean"
                  },
                  "conversation_pending": {
                    "type": "boolean"
                  },
                  "import_contacts": {
                    "type": "boolean"
                  },
                  "import_messages": {
                    "type": "boolean"
                  },
                  "days_limit_import_messages": {
                    "type": "integer",
                    "description": "TODO"
                  },
                  "auto_create": {
                    "type": "boolean"
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Ok",
            "content": {}
          }
        }
      }
    },
    "/chatwoot/find/{instance}": {
      "get": {
        "operationId": "findChatwoot",
        "summary": "Find Chatwoot",
        "tags": ["Chatwoot Controller"],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "ID of the instance to connect",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Find Chatwoot",
        "responses": {
          "200": {
            "description": "Ok",
            "content": {}
          }
        }
      }
    },
    "/sqs/set/{instance}": {
      "post": {
        "operationId": "setSQS",
        "summary": "Set SQS",
        "tags": ["SQS Controller"],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "ID of the instance to connect",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Set SQS",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "enabled": {
                    "type": "boolean"
                  },
                  "events": {
                    "type": "array",
                    "items": {
                      "type": "string",
                      "enum": [
                        "APPLICATION_STARTUP",
                        "QRCODE_UPDATED",
                        "MESSAGES_SET",
                        "MESSAGES_UPSERT",
                        "MESSAGES_UPDATE",
                        "MESSAGES_DELETE",
                        "SEND_MESSAGE",
                        "CONTACTS_SET",
                        "CONTACTS_UPSERT",
                        "CONTACTS_UPDATE",
                        "PRESENCE_UPDATE",
                        "CHATS_SET",
                        "CHATS_UPSERT",
                        "CHATS_UPDATE",
                        "CHATS_DELETE",
                        "GROUPS_UPSERT",
                        "GROUP_UPDATE",
                        "GROUP_PARTICIPANTS_UPDATE",
                        "CONNECTION_UPDATE",
                        "CALL",
                        "NEW_JWT_TOKEN"
                      ]
                    },
                    "description": "Events to be sent to the Webhook"
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Ok",
            "content": {}
          }
        }
      }
    },
    "/sqs/find/{instance}": {
      "get": {
        "operationId": "findSQS",
        "summary": "Find SQS",
        "tags": ["SQS Controller"],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "ID of the instance to connect",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Find SQS",
        "responses": {
          "200": {
            "description": "Ok",
            "content": {}
          }
        }
      }
    },
    "/rabbitmq/set/{instance}": {
      "post": {
        "operationId": "setRabbitMQ",
        "summary": "Set RabbitMQ",
        "tags": ["RabbitMQ Controller"],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "ID of the instance to connect",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Set RabbitMQ",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "enabled": {
                    "type": "boolean"
                  },
                  "events": {
                    "type": "array",
                    "items": {
                      "type": "string",
                      "enum": [
                        "APPLICATION_STARTUP",
                        "QRCODE_UPDATED",
                        "MESSAGES_SET",
                        "MESSAGES_UPSERT",
                        "MESSAGES_UPDATE",
                        "MESSAGES_DELETE",
                        "SEND_MESSAGE",
                        "CONTACTS_SET",
                        "CONTACTS_UPSERT",
                        "CONTACTS_UPDATE",
                        "PRESENCE_UPDATE",
                        "CHATS_SET",
                        "CHATS_UPSERT",
                        "CHATS_UPDATE",
                        "CHATS_DELETE",
                        "GROUPS_UPSERT",
                        "GROUP_UPDATE",
                        "GROUP_PARTICIPANTS_UPDATE",
                        "CONNECTION_UPDATE",
                        "CALL",
                        "NEW_JWT_TOKEN"
                      ]
                    },
                    "description": "Events to be sent to the Webhook"
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Ok",
            "content": {}
          }
        }
      }
    },
    "/rabbitmq/find/{instance}": {
      "get": {
        "operationId": "findRabbitMQ",
        "summary": "Find RabbitMQ",
        "tags": ["RabbitMQ Controller"],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "ID of the instance to connect",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Find RabbitMQ",
        "responses": {
          "200": {
            "description": "Ok",
            "content": {}
          }
        }
      }
    },
    "/websocket/set/{instance}": {
      "post": {
        "operationId": "setWebsocket",
        "summary": "Set Websocket",
        "tags": ["Websocket Controller"],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "ID of the instance to connect",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Set Websocket",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "enabled": {
                    "type": "boolean"
                  },
                  "events": {
                    "type": "array",
                    "items": {
                      "type": "string",
                      "enum": [
                        "APPLICATION_STARTUP",
                        "QRCODE_UPDATED",
                        "MESSAGES_SET",
                        "MESSAGES_UPSERT",
                        "MESSAGES_UPDATE",
                        "MESSAGES_DELETE",
                        "SEND_MESSAGE",
                        "CONTACTS_SET",
                        "CONTACTS_UPSERT",
                        "CONTACTS_UPDATE",
                        "PRESENCE_UPDATE",
                        "CHATS_SET",
                        "CHATS_UPSERT",
                        "CHATS_UPDATE",
                        "CHATS_DELETE",
                        "GROUPS_UPSERT",
                        "GROUP_UPDATE",
                        "GROUP_PARTICIPANTS_UPDATE",
                        "CONNECTION_UPDATE",
                        "CALL",
                        "NEW_JWT_TOKEN"
                      ]
                    },
                    "description": "Events to be sent to the Webhook"
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Ok",
            "content": {}
          }
        }
      }
    },
    "/websocket/find/{instance}": {
      "get": {
        "operationId": "findWebsocket",
        "summary": "Find Websocket",
        "tags": ["Websocket Controller"],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "ID of the instance to connect",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Find Websocket",
        "responses": {
          "200": {
            "description": "Ok",
            "content": {}
          }
        }
      }
    },
    "/": {
      "get": {
        "operationId": "getEvoInfo",
        "summary": "Get information about your EvolutionAPI",
        "deprecated": false,
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "ID of the instance to connect",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Get information about your EvolutionAPI",
        "responses": {
          "200": {
            "description": "Ok",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "status": {
                      "type": "integer",
                      "description": "The HTTP status of the response"
                    },
                    "message": {
                      "type": "string",
                      "description": "Descriptive message about the current state of the API"
                    },
                    "version": {
                      "type": "string",
                      "description": "The current version of the API"
                    },
                    "swagger": {
                      "type": "string",
                      "description": "URL to the API's Swagger documentation"
                    },
                    "manager": {
                      "type": "string",
                      "description": "URL to the API manager"
                    },
                    "documentation": {
                      "type": "string",
                      "description": "URL to the detailed API documentation"
                    }
                  },
                  "example": {
                    "status": 200,
                    "message": "Welcome to the Evolution API, it is working!",
                    "version": "1.7.4",
                    "swagger": "http://example.evolution-api.com/docs",
                    "manager": "http://example.evolution-api.com/manager",
                    "documentation": "https://doc.evolution-api.com"
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  "components": {
    "securitySchemes": {
      "ApiKeyAuth": {
        "type": "apiKey",
        "in": "header",
        "name": "apikey",
        "description": "Your authorization key header"
      }
    }
  }
}

```

# openapi\openapi-v2.json

```json
{
  "openapi": "3.0.3",
  "info": {
    "title": "Evolution API",
    "version": "2.1.1"
  },
  "servers": [
    {
      "url": "https://{server-url}",
      "variables": {
        "server-url": {
          "default": "evolution-example",
          "description": "The URL of your EvolutionAPI server"
        }
      },
      "description": "Your instance domain"
    }
  ],
  "paths": {
    "/instance/create": {
      "post": {
        "operationId": "createInstance",
        "summary": "Create Instance",
        "tags": [
          "Instance Controller"
        ],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "requestBody": {
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": [
                  "instanceName",
                  "integration"
                ],
                "properties": {
                  "instanceName": {
                    "type": "string",
                    "description": "instance (Instance name)"
                  },
                  "token": {
                    "type": "string",
                    "description": "apikey (Enter or leave empty to create dynamically)"
                  },
                  "qrcode": {
                    "type": "boolean",
                    "description": "Create QR Code automatically after creation"
                  },
                  "number": {
                    "type": "string",
                    "description": "559999999999 (Instance owner number with Country Code)"
                  },
                  "integration": {
                    "type": "string",
                    "description": "WhatsApp engine",
                    "enum": [
                      "WHATSAPP-BAILEYS",
                      "WHATSAPP-BUSINESS"
                    ]
                  },
                  "rejectCall": {
                    "type": "boolean",
                    "description": "Reject WhatsApp calls automatically"
                  },
                  "msgCall": {
                    "type": "string",
                    "description": "Message to be sent when a call is rejected automatically"
                  },
                  "groupsIgnore": {
                    "type": "boolean",
                    "description": "Ignore group messages"
                  },
                  "alwaysOnline": {
                    "type": "boolean",
                    "description": "Keep WhatsApp always online"
                  },
                  "readMessages": {
                    "type": "boolean",
                    "description": "Send read receipts to received messages"
                  },
                  "readStatus": {
                    "type": "boolean",
                    "description": "Show sent messages read status"
                  },
                  "syncFullHistory": {
                    "type": "boolean",
                    "description": "Syncronize full WhatsApp history with EvolutionAPI"
                  },
                  "proxyHost": {
                    "type": "string",
                    "description": "proxy host"
                  },
                  "proxyPort": {
                    "type": "string",
                    "description": "proxy port"
                  },
                  "proxyProtocol": {
                    "type": "string",
                    "description": "proxy protocol"
                  },
                  "proxyUsername": {
                    "type": "string",
                    "description": "proxy Username"
                  },
                  "proxyPassword": {
                    "type": "string",
                    "description": "proxy password"
                  },
                  "webhook": {
                    "type": "object",
                    "properties": {
                      "url": {
                        "type": "string",
                        "description": "The URL of the webhook."
                      },
                      "byEvents": {
                        "type": "boolean",
                        "description": "Enable Webhook by events"
                      },
                      "base64": {
                        "type": "boolean",
                        "description": "Sends files in base64 when available"
                      },
                      "headers": {
                        "type": "object",
                        "description": "Headers for send the API from webhook",
                        "properties": {
                          "authorization": {
                            "type": "string",
                            "description": "Your authorization key header"
                          },
                          "Content-Type": {
                            "type": "string",
                            "description": "content-type"
                          }
                        }
                      },
                      "events": {
                        "type": "array",
                        "items": {
                          "type": "string",
                          "enum": [
                            "APPLICATION_STARTUP",
                            "QRCODE_UPDATED",
                            "MESSAGES_SET",
                            "MESSAGES_UPSERT",
                            "MESSAGES_UPDATE",
                            "MESSAGES_DELETE",
                            "SEND_MESSAGE",
                            "CONTACTS_SET",
                            "CONTACTS_UPSERT",
                            "CONTACTS_UPDATE",
                            "PRESENCE_UPDATE",
                            "CHATS_SET",
                            "CHATS_UPSERT",
                            "CHATS_UPDATE",
                            "CHATS_DELETE",
                            "GROUPS_UPSERT",
                            "GROUP_UPDATE",
                            "GROUP_PARTICIPANTS_UPDATE",
                            "CONNECTION_UPDATE",
                            "CALL",
                            "NEW_JWT_TOKEN",
                            "TYPEBOT_START",
                            "TYPEBOT_CHANGE_STATUS"
                          ]
                        },
                        "description": "Events to be sent to the Webhook"
                      }
                    },
                    "description": "Webhook URL"
                  },
                  "rabbitmq": {
                    "type": "object",
                    "properties": {
                      "enabled": {
                        "type": "boolean",
                        "description": "Enable RabbitMQ"
                      },
                      "events": {
                        "type": "array",
                        "items": {
                          "type": "string",
                          "enum": [
                            "APPLICATION_STARTUP",
                            "QRCODE_UPDATED",
                            "MESSAGES_SET",
                            "MESSAGES_UPSERT",
                            "MESSAGES_UPDATE",
                            "MESSAGES_DELETE",
                            "SEND_MESSAGE",
                            "CONTACTS_SET",
                            "CONTACTS_UPSERT",
                            "CONTACTS_UPDATE",
                            "PRESENCE_UPDATE",
                            "CHATS_SET",
                            "CHATS_UPSERT",
                            "CHATS_UPDATE",
                            "CHATS_DELETE",
                            "GROUPS_UPSERT",
                            "GROUP_UPDATE",
                            "GROUP_PARTICIPANTS_UPDATE",
                            "CONNECTION_UPDATE",
                            "LABELS_EDIT",
                            "LABELS_ASSOCIATION",
                            "CALL",
                            "TYPEBOT_START",
                            "TYPEBOT_CHANGE_STATUS"
                          ]
                        },
                        "description": "Events to be sent to the RabbitMQ"
                      }
                    }
                  },
                  "sqs": {
                    "type": "object",
                    "properties": {
                      "enabled": {
                        "type": "boolean",
                        "description": "Enable SQS"
                      },
                      "events": {
                        "type": "array",
                        "items": {
                          "type": "string",
                          "enum": [
                            "APPLICATION_STARTUP",
                            "QRCODE_UPDATED",
                            "MESSAGES_SET",
                            "MESSAGES_UPSERT",
                            "MESSAGES_UPDATE",
                            "MESSAGES_DELETE",
                            "SEND_MESSAGE",
                            "CONTACTS_SET",
                            "CONTACTS_UPSERT",
                            "CONTACTS_UPDATE",
                            "PRESENCE_UPDATE",
                            "CHATS_SET",
                            "CHATS_UPSERT",
                            "CHATS_UPDATE",
                            "CHATS_DELETE",
                            "GROUPS_UPSERT",
                            "GROUP_UPDATE",
                            "GROUP_PARTICIPANTS_UPDATE",
                            "CONNECTION_UPDATE",
                            "CALL",
                            "NEW_JWT_TOKEN",
                            "TYPEBOT_START",
                            "TYPEBOT_CHANGE_STATUS"
                          ]
                        },
                        "description": "Events to be sent to the SQS"
                      }
                    },
                    "description": "Enable SQS"
                  },
                  "chatwootAccountId": {
                    "type": "integer",
                    "description": "Chatwoot account ID"
                  },
                  "chatwootToken": {
                    "type": "string",
                    "description": "Chatwoot authentication token"
                  },
                  "chatwootUrl": {
                    "type": "string",
                    "description": "Chatwoot server URL"
                  },
                  "chatwootSignMsg": {
                    "type": "boolean",
                    "description": "Send message signature on Chatwoot"
                  },
                  "chatwootReopenConversation": {
                    "type": "boolean",
                    "description": "Reopen conversation on Chatwoot"
                  },
                  "chatwootConversationPending": {
                    "type": "boolean",
                    "description": "TODO"
                  },
                  "chatwootImportContacts": {
                    "type": "boolean",
                    "description": "Import Chatwoot contacts"
                  },
                  "chatwootNameInbox": {
                    "type": "string",
                    "description": "Name inbox chatwoot"
                  },
                  "chatwootMergeBrazilContacts": {
                    "type": "boolean",
                    "description": "TODO"
                  },
                  "chatwootImportMessages": {
                    "type": "boolean",
                    "description": "Import chatwoot messages"
                  },
                  "chatwootDaysLimitImportMessages": {
                    "type": "integer",
                    "description": "Limit message import chatwoot"
                  },
                  "chatwootOrganization": {
                    "type": "string",
                    "description": "Evolution Bot"
                  },
                  "chatwootLogo": {
                    "type": "string",
                    "description": "https://evolution-api.com/files/evolution-api-favicon.png"
                  }
                }
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "Created",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "instance": {
                      "type": "object",
                      "properties": {
                        "instanceName": {
                          "type": "string",
                          "description": "The name of the instance"
                        },
                        "instanceId": {
                          "type": "string",
                          "description": "The unique identifier for the instance"
                        },
                        "webhook_wa_business": {
                          "type": "string",
                          "description": "The webhook URL for WhatsApp Business integration"
                        },
                        "access_token_wa_business": {
                          "type": "string",
                          "description": "The access token for WhatsApp Business"
                        },
                        "status": {
                          "type": "string",
                          "description": "The current status of the instance"
                        }
                      }
                    },
                    "hash": {
                      "type": "object",
                      "properties": {
                        "apikey": {
                          "type": "string",
                          "description": "The API key for authentication"
                        }
                      }
                    },
                    "settings": {
                      "type": "object",
                      "properties": {
                        "reject_call": {
                          "type": "boolean",
                          "description": "Indicates whether calls are rejected"
                        },
                        "msg_call": {
                          "type": "string",
                          "description": "Message to be sent when a call is rejected"
                        },
                        "groups_ignore": {
                          "type": "boolean",
                          "description": "Indicates whether groups are ignored"
                        },
                        "always_online": {
                          "type": "boolean",
                          "description": "Indicates whether the instance is always online"
                        },
                        "read_messages": {
                          "type": "boolean",
                          "description": "Indicates whether messages are marked as read"
                        },
                        "read_status": {
                          "type": "boolean",
                          "description": "Indicates whether status updates are marked as read"
                        },
                        "sync_full_history": {
                          "type": "boolean",
                          "description": "Indicates whether the full message history is synchronized"
                        }
                      }
                    }
                  },
                  "example": {
                    "instance": {
                      "instanceName": "teste-docs",
                      "instanceId": "af6c5b7c-ee27-4f94-9ea8-192393746ddd",
                      "webhook_wa_business": null,
                      "access_token_wa_business": "",
                      "status": "created"
                    },
                    "hash": {
                      "apikey": "123456"
                    },
                    "settings": {
                      "reject_call": false,
                      "msg_call": "",
                      "groups_ignore": true,
                      "always_online": false,
                      "read_messages": false,
                      "read_status": false,
                      "sync_full_history": false
                    }
                  }
                }
              }
            }
          },
          "403": {
            "description": "Forbidden",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "status": {
                      "type": "integer",
                      "description": "The HTTP status of the response"
                    },
                    "error": {
                      "type": "string",
                      "description": "The error message indicating the type of error"
                    },
                    "response": {
                      "type": "object",
                      "properties": {
                        "message": {
                          "type": "array",
                          "items": {
                            "type": "string"
                          },
                          "description": "List of detailed error messages"
                        }
                      }
                    }
                  },
                  "example": {
                    "status": 403,
                    "error": "Forbidden",
                    "response": {
                      "message": [
                        "This name \"instance-example-name\" is already in use."
                      ]
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/instance/fetchInstances": {
      "get": {
        "operationId": "fetchInstances",
        "summary": "Fetch Instances",
        "tags": [
          "Instance Controller"
        ],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instanceName",
            "description": "Name of the instance to be fetched",
            "in": "query",
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "instanceId",
            "description": "ID of the instance to be fetched",
            "in": "query",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Returns the instance with the name informed in the parameter, or all the instances if empty.",
        "responses": {
          "200": {
            "description": "Ok",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "status": {
                      "type": "integer",
                      "description": "The HTTP status of the response"
                    },
                    "error": {
                      "type": "string",
                      "description": "The error message indicating the type of error"
                    },
                    "response": {
                      "type": "object",
                      "properties": {
                        "message": {
                          "type": "array",
                          "items": {
                            "type": "string"
                          },
                          "description": "List of detailed error messages"
                        }
                      }
                    }
                  },
                  "example": [
                    {
                      "instance": {
                        "instanceName": "example-name",
                        "instanceId": "421a4121-a3d9-40cc-a8db-c3a1df353126",
                        "owner": "553198296801@s.whatsapp.net",
                        "profileName": "Guilherme Gomes",
                        "profilePictureUrl": null,
                        "profileStatus": "This is the profile status.",
                        "status": "open",
                        "serverUrl": "https://example.evolution-api.com",
                        "apikey": "B3844804-481D-47A4-B69C-F14B4206EB56",
                        "integration": {
                          "integration": "WHATSAPP-BAILEYS",
                          "webhook_wa_business": "https://example.evolution-api.com/webhook/whatsapp/db5e11d3-ded5-4d91-b3fb-48272688f206"
                        }
                      }
                    },
                    {
                      "instance": {
                        "instanceName": "teste-docs",
                        "instanceId": "af6c5b7c-ee27-4f94-9ea8-192393746ddd",
                        "status": "close",
                        "serverUrl": "https://example.evolution-api.com",
                        "apikey": "123456",
                        "integration": {
                          "token": "123456",
                          "webhook_wa_business": "https://example.evolution-api.com/webhook/whatsapp/teste-docs"
                        }
                      }
                    }
                  ],
                  "required": [
                    "message"
                  ]
                }
              }
            }
          }
        }
      }
    },
    "/instance/connect/{instance}": {
      "get": {
        "operationId": "instanceConnect",
        "summary": "Instances Connect",
        "tags": [
          "Instance Controller"
        ],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "Name of the instance to connect",
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "number",
            "description": "Phone number (with country code) to be connected",
            "in": "query",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Generates and returns the QR code for WhatsApp connection",
        "responses": {
          "200": {
            "description": "Ok",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "pairingCode": {
                      "type": "string",
                      "description": "The unique code used for pairing a device or account."
                    },
                    "code": {
                      "type": "string",
                      "description": "A specific code associated with the pairing process. This may include tokens or other identifiers."
                    },
                    "count": {
                      "type": "integer",
                      "description": "The count or number of attempts or instances related to the pairing process."
                    }
                  },
                  "example": {
                    "pairingCode": "WZYEH1YY",
                    "code": "2@y8eK+bjtEjUWy9/FOM...",
                    "count": 1
                  }
                }
              }
            }
          },
          "404": {
            "description": "Instance not found",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "status": {
                      "type": "integer",
                      "description": "The HTTP status of the response"
                    },
                    "error": {
                      "type": "string",
                      "description": "The error message indicating the type of error"
                    },
                    "response": {
                      "type": "object",
                      "properties": {
                        "message": {
                          "type": "array",
                          "items": {
                            "type": "string"
                          },
                          "description": "List of detailed error messages"
                        }
                      }
                    }
                  },
                  "example": {
                    "status": 404,
                    "error": "Not Found",
                    "response": {
                      "message": [
                        "The \"invalid-instance\" instance does not exist"
                      ]
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/instance/restart/{instance}": {
      "put": {
        "operationId": "restartInstance",
        "summary": "Restart Instance",
        "tags": [
          "Instance Controller"
        ],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "Name of the instance to restart",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Restarts the instance",
        "responses": {
          "200": {
            "description": "Ok",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "instance": {
                      "type": "object",
                      "properties": {
                        "instanceName": {
                          "type": "string",
                          "description": "The name of the instance."
                        },
                        "state": {
                          "type": "string",
                          "description": "The state of the instance."
                        }
                      }
                    }
                  },
                  "example": {
                    "instance": {
                      "instanceName": "teste-docs",
                      "state": "open"
                    }
                  }
                }
              }
            }
          },
          "404": {
            "description": "Instance not found",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "status": {
                      "type": "integer",
                      "description": "The HTTP status of the response"
                    },
                    "error": {
                      "type": "string",
                      "description": "The error message indicating the type of error"
                    },
                    "response": {
                      "type": "object",
                      "properties": {
                        "message": {
                          "type": "array",
                          "items": {
                            "type": "string"
                          },
                          "description": "List of detailed error messages"
                        }
                      }
                    }
                  },
                  "example": {
                    "status": 404,
                    "error": "Not Found",
                    "response": {
                      "message": [
                        "The \"invalid-instance\" instance does not exist"
                      ]
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/instance/connectionState/{instance}": {
      "get": {
        "operationId": "connectionState",
        "summary": "Connection State",
        "tags": [
          "Instance Controller"
        ],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "Name of the instance to get status connect",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Gets the state of the connection",
        "responses": {
          "200": {
            "description": "Ok",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "instance": {
                      "type": "object",
                      "properties": {
                        "instanceName": {
                          "type": "string",
                          "description": "The name of the instance."
                        },
                        "state": {
                          "type": "string",
                          "description": "The state of the instance."
                        }
                      }
                    }
                  },
                  "example": {
                    "instance": {
                      "instanceName": "teste-docs",
                      "state": "open"
                    }
                  }
                }
              }
            }
          },
          "404": {
            "description": "Instance not found",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "status": {
                      "type": "integer",
                      "description": "The HTTP status of the response"
                    },
                    "error": {
                      "type": "string",
                      "description": "The error message indicating the type of error"
                    },
                    "response": {
                      "type": "object",
                      "properties": {
                        "message": {
                          "type": "array",
                          "items": {
                            "type": "string"
                          },
                          "description": "List of detailed error messages"
                        }
                      }
                    }
                  },
                  "example": {
                    "status": 404,
                    "error": "Not Found",
                    "response": {
                      "message": [
                        "The \"invalid-instance\" instance does not exist"
                      ]
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/instance/logout/{instance}": {
      "delete": {
        "operationId": "logoutInstance",
        "summary": "Logout Instance",
        "tags": [
          "Instance Controller"
        ],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "Name of the instance to logout",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Makes logout on instance",
        "responses": {
          "200": {
            "description": "Ok",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "status": {
                      "type": "string",
                      "description": "The status of the response."
                    },
                    "error": {
                      "type": "boolean",
                      "description": "Indicates whether an error occurred."
                    },
                    "response": {
                      "type": "object",
                      "properties": {
                        "message": {
                          "type": "string",
                          "description": "A message related to the response."
                        }
                      }
                    }
                  },
                  "example": {
                    "status": "SUCCESS",
                    "error": false,
                    "response": {
                      "message": "Instance logged out"
                    }
                  }
                }
              }
            }
          },
          "404": {
            "description": "Instance not found",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "status": {
                      "type": "integer",
                      "description": "The HTTP status of the response"
                    },
                    "error": {
                      "type": "string",
                      "description": "The error message indicating the type of error"
                    },
                    "response": {
                      "type": "object",
                      "properties": {
                        "message": {
                          "type": "array",
                          "items": {
                            "type": "string"
                          },
                          "description": "List of detailed error messages"
                        }
                      }
                    }
                  },
                  "example": {
                    "status": 404,
                    "error": "Not Found",
                    "response": {
                      "message": [
                        "The \"invalid-instance\" instance does not exist"
                      ]
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/instance/delete/{instance}": {
      "delete": {
        "operationId": "deleteInstance",
        "summary": "Delete Instance",
        "tags": [
          "Instance Controller"
        ],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "Name of the instance to delete",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Delete instance",
        "responses": {
          "200": {
            "description": "Ok",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "status": {
                      "type": "string",
                      "description": "The status of the response."
                    },
                    "error": {
                      "type": "boolean",
                      "description": "Indicates whether an error occurred."
                    },
                    "response": {
                      "type": "object",
                      "properties": {
                        "message": {
                          "type": "string",
                          "description": "A message related to the response."
                        }
                      }
                    }
                  },
                  "example": {
                    "status": "SUCCESS",
                    "error": false,
                    "response": {
                      "message": "Instance deleted"
                    }
                  }
                }
              }
            }
          },
          "404": {
            "description": "Instance not found",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "status": {
                      "type": "integer",
                      "description": "The HTTP status of the response"
                    },
                    "error": {
                      "type": "string",
                      "description": "The error message indicating the type of error"
                    },
                    "response": {
                      "type": "object",
                      "properties": {
                        "message": {
                          "type": "array",
                          "items": {
                            "type": "string"
                          },
                          "description": "List of detailed error messages"
                        }
                      }
                    }
                  },
                  "example": {
                    "status": 404,
                    "error": "Not Found",
                    "response": {
                      "message": [
                        "The \"invalid-instance\" instance does not exist"
                      ]
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/instance/setPresence/{instance}": {
      "post": {
        "operationId": "setPresence",
        "summary": "Set Presence",
        "tags": [
          "Instance Controller"
        ],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "Name of the instance to connect",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Deletes instance",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": [
                  "presence"
                ],
                "properties": {
                  "presence": {
                    "type": "string",
                    "enum": [
                      "available",
                      "unavailable"
                    ]
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Ok",
            "content": {}
          },
          "404": {
            "description": "Instance not found",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "status": {
                      "type": "integer",
                      "description": "The HTTP status of the response"
                    },
                    "error": {
                      "type": "string",
                      "description": "The error message indicating the type of error"
                    },
                    "response": {
                      "type": "object",
                      "properties": {
                        "message": {
                          "type": "array",
                          "items": {
                            "type": "string"
                          },
                          "description": "List of detailed error messages"
                        }
                      }
                    }
                  },
                  "example": {
                    "status": 404,
                    "error": "Not Found",
                    "response": {
                      "message": [
                        "The \"invalid-instance\" instance does not exist"
                      ]
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/webhook/set/{instance}": {
      "post": {
        "operationId": "setWebhook",
        "summary": "Set Webhook",
        "tags": [
          "Webhook Controller"
        ],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "Name of the instance",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Set Webhook for instance",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": [
                  "url",
                  "events",
                  "enabled",
                  "webhookByEvents",
                  "webhookBase64"
                ],
                "properties": {
                  "enabled": {
                    "type": "boolean",
                    "description": "enable webhook to instance"
                  },
                  "url": {
                    "type": "string",
                    "description": "Webhook URL"
                  },
                  "webhookByEvents": {
                    "type": "boolean",
                    "description": "Enables Webhook by events"
                  },
                  "webhookBase64": {
                    "type": "boolean",
                    "description": "Sends files in base64 when available"
                  },
                  "events": {
                    "type": "array",
                    "minItems": 1,
                    "items": {
                      "type": "string",
                      "enum": [
                        "APPLICATION_STARTUP",
                        "QRCODE_UPDATED",
                        "MESSAGES_SET",
                        "MESSAGES_UPSERT",
                        "MESSAGES_UPDATE",
                        "MESSAGES_DELETE",
                        "SEND_MESSAGE",
                        "CONTACTS_SET",
                        "CONTACTS_UPSERT",
                        "CONTACTS_UPDATE",
                        "PRESENCE_UPDATE",
                        "CHATS_SET",
                        "CHATS_UPSERT",
                        "CHATS_UPDATE",
                        "CHATS_DELETE",
                        "GROUPS_UPSERT",
                        "GROUP_UPDATE",
                        "GROUP_PARTICIPANTS_UPDATE",
                        "CONNECTION_UPDATE",
                        "CALL",
                        "NEW_JWT_TOKEN",
                        "TYPEBOT_START",
                        "TYPEBOT_CHANGE_STATUS"
                      ]
                    },
                    "description": "Events to be sent to the Webhook"
                  }
                }
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "Created",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "webhook": {
                      "type": "object",
                      "properties": {
                        "instanceName": {
                          "type": "string",
                          "description": "The name of the instance."
                        },
                        "webhook": {
                          "type": "object",
                          "properties": {
                            "url": {
                              "type": "string",
                              "description": "The URL of the webhook."
                            },
                            "events": {
                              "type": "array",
                              "items": {
                                "type": "string"
                              },
                              "description": "List of events the webhook is subscribed to."
                            },
                            "enabled": {
                              "type": "boolean",
                              "description": "Indicates whether the webhook is enabled."
                            }
                          }
                        }
                      }
                    }
                  },
                  "example": {
                    "webhook": {
                      "instanceName": "teste-docs",
                      "webhook": {
                        "url": "https://example.com",
                        "events": [
                          "APPLICATION_STARTUP"
                        ],
                        "enabled": true
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/webhook/find/{instance}": {
      "get": {
        "operationId": "findWebhook",
        "summary": "Find Webhook",
        "tags": [
          "Webhook Controller"
        ],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "Name of the instance",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Fetch Webhook configuration",
        "responses": {
          "200": {
            "description": "Ok",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "enabled": {
                      "type": "boolean",
                      "description": "Indicates whether the webhook is enabled."
                    },
                    "url": {
                      "type": "string",
                      "description": "The URL of the webhook."
                    },
                    "events": {
                      "type": "array",
                      "items": {
                        "type": "string"
                      },
                      "description": "List of events the webhook is subscribed to."
                    }
                  },
                  "example": {
                    "enabled": true,
                    "url": "https://example.com",
                    "events": [
                      "APPLICATION_STARTUP"
                    ]
                  }
                }
              }
            }
          }
        }
      }
    },
    "/settings/set/{instance}": {
      "post": {
        "operationId": "setSettings",
        "summary": "Set Settings",
        "tags": [
          "Settings Controller"
        ],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "Name of the instance",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Set settings",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": [
                  "rejectCall",
                  "groupsIgnore",
                  "alwaysOnline",
                  "readMessages",
                  "readStatus",
                  "syncFullHistory",
                  "msgCall"
                ],
                "properties": {
                  "rejectCall": {
                    "type": "boolean",
                    "description": "Reject calls automatically"
                  },
                  "msgCall": {
                    "type": "string",
                    "description": "Message to be sent when a call is rejected automatically"
                  },
                  "groupsIgnore": {
                    "type": "boolean",
                    "description": "Ignore group messages"
                  },
                  "alwaysOnline": {
                    "type": "boolean",
                    "description": "Always show WhatsApp online"
                  },
                  "readMessages": {
                    "type": "boolean",
                    "description": "Send read receipts"
                  },
                  "readStatus": {
                    "type": "boolean",
                    "description": "See message status"
                  },
                  "syncFullHistory": {
                    "type": "boolean",
                    "description": "Syncronize full WhatsApp history with EvolutionAPI"
                  }
                }
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "Created",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "settings": {
                      "type": "object",
                      "properties": {
                        "instanceName": {
                          "type": "string",
                          "description": "The name of the instance."
                        },
                        "settings": {
                          "type": "object",
                          "properties": {
                            "reject_call": {
                              "type": "boolean",
                              "description": "Indicates whether to reject incoming calls."
                            },
                            "groups_ignore": {
                              "type": "boolean",
                              "description": "Indicates whether to ignore group messages."
                            },
                            "always_online": {
                              "type": "boolean",
                              "description": "Indicates whether to always keep the instance online."
                            },
                            "read_messages": {
                              "type": "boolean",
                              "description": "Indicates whether to mark messages as read."
                            },
                            "read_status": {
                              "type": "boolean",
                              "description": "Indicates whether to read status updates."
                            },
                            "sync_full_history": {
                              "type": "boolean",
                              "description": "Indicates whether to synchronize full message history."
                            }
                          }
                        }
                      }
                    }
                  },
                  "example": {
                    "settings": {
                      "instanceName": "teste-docs",
                      "settings": {
                        "reject_call": true,
                        "groups_ignore": true,
                        "always_online": true,
                        "read_messages": true,
                        "read_status": true,
                        "sync_full_history": false
                      }
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/settings/find/{instance}": {
      "get": {
        "operationId": "findWebhook",
        "summary": "Find Webhook",
        "tags": [
          "Webhook Controller"
        ],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "Name of the instance to get settings",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Fetch Webhook configuration",
        "responses": {
          "200": {
            "description": "Ok",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "reject_call": {
                      "type": "boolean",
                      "description": "Indicates whether to reject incoming calls."
                    },
                    "groups_ignore": {
                      "type": "boolean",
                      "description": "Indicates whether to ignore group messages."
                    },
                    "always_online": {
                      "type": "boolean",
                      "description": "Indicates whether to always keep the instance online."
                    },
                    "read_messages": {
                      "type": "boolean",
                      "description": "Indicates whether to mark messages as read."
                    },
                    "read_status": {
                      "type": "boolean",
                      "description": "Indicates whether to read status updates."
                    },
                    "sync_full_history": {
                      "type": "boolean",
                      "description": "Indicates whether to synchronize full message history."
                    }
                  },
                  "example": {
                    "reject_call": true,
                    "groups_ignore": true,
                    "always_online": true,
                    "read_messages": true,
                    "read_status": true,
                    "sync_full_history": false
                  }
                }
              }
            }
          }
        }
      }
    },
    "/message/sendText/{instance}": {
      "post": {
        "operationId": "sendText",
        "summary": "Send Text",
        "tags": [
          "Message Controller"
        ],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "Name of the instance",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Send plain text message",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": [
                  "number",
                  "text"
                ],
                "properties": {
                  "number": {
                    "type": "string",
                    "description": "Number to receive the message (with country code)"
                  },
                  "text": {
                    "type": "string",
                    "description": "Test message to send"
                  },
                  "delay": {
                    "type": "integer",
                    "description": "Presence time in milliseconds before sending message"
                  },
                  "linkPreview": {
                    "type": "boolean",
                    "description": "Shows a preview of the target website if there's a link within the message"
                  },
                  "mentionsEveryOne": {
                    "type": "boolean",
                    "description": "Mentioned everyone when the message send"
                  },
                  "mentioned": {
                    "type": "array",
                    "items": {
                      "type": "string",
                      "enum": [
                        "{{remoteJID}}"
                      ]
                    },
                    "description": "Numbers to mention"
                  },
                  "quoted": {
                    "type": "object",
                    "properties": {
                      "key": {
                        "type": "object",
                        "properties": {
                          "id": {
                            "type": "string",
                            "description": "Quoted message ID"
                          }
                        }
                      },
                      "message": {
                        "type": "object",
                        "properties": {
                          "conversation": {
                            "type": "string",
                            "description": "Quoted message content"
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "Created",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "key": {
                      "type": "object",
                      "properties": {
                        "remoteJid": {
                          "type": "string",
                          "description": "The remote Jid."
                        },
                        "fromMe": {
                          "type": "boolean",
                          "description": "Indicates whether the message was sent by the user."
                        },
                        "id": {
                          "type": "string",
                          "description": "The ID of the message."
                        }
                      }
                    },
                    "message": {
                      "type": "object",
                      "properties": {
                        "extendedTextMessage": {
                          "type": "object",
                          "properties": {
                            "text": {
                              "type": "string",
                              "description": "The text message."
                            }
                          }
                        }
                      }
                    },
                    "messageTimestamp": {
                      "type": "string",
                      "description": "The timestamp of the message."
                    },
                    "status": {
                      "type": "string",
                      "description": "The status of the message."
                    }
                  },
                  "example": {
                    "key": {
                      "remoteJid": "553198296801@s.whatsapp.net",
                      "fromMe": true,
                      "id": "BAE594145F4C59B4"
                    },
                    "message": {
                      "extendedTextMessage": {
                        "text": "Olá!"
                      }
                    },
                    "messageTimestamp": "1717689097",
                    "status": "PENDING"
                  }
                }
              }
            }
          }
        }
      }
    },
    "/message/sendMedia/{instance}": {
      "post": {
        "operationId": "sendMedia",
        "summary": "Send Media",
        "tags": [
          "Message Controller"
        ],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "Name instance",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Send media message",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": [
                  "number",
                  "mediatype",
                  "mimetype",
                  "caption",
                  "media",
                  "fileName"
                ],
                "properties": {
                  "number": {
                    "type": "string",
                    "description": "Number to receive the message (with country code)"
                  },
                  "mediatype": {
                    "type": "string",
                    "description": "Image, video or document"
                  },
                  "mimetype": {
                    "type": "string",
                    "description": "image/png"
                  },
                  "caption": {
                    "type": "string",
                    "description": "Teste de caption"
                  },
                  "media": {
                    "type": "string",
                    "description": "Url or base64"
                  },
                  "fileName": {
                    "type": "string",
                    "description": "Image.png"
                  },
                  "delay": {
                    "type": "integer",
                    "description": "Presence time in milliseconds before sending message"
                  },
                  "linkPreview": {
                    "type": "boolean",
                    "description": "Shows a preview of the target website if there's a link within the message"
                  },
                  "mentionsEveryOne": {
                    "type": "boolean",
                    "description": "Mentioned everyone when the message send"
                  },
                  "mentioned": {
                    "type": "array",
                    "items": {
                      "type": "string",
                      "enum": [
                        "{{remoteJID}}"
                      ]
                    },
                    "description": "Numbers to mention"
                  },
                  "quoted": {
                    "type": "object",
                    "properties": {
                      "key": {
                        "type": "object",
                        "properties": {
                          "id": {
                            "type": "string",
                            "description": "Quoted message ID"
                          }
                        }
                      },
                      "message": {
                        "type": "object",
                        "properties": {
                          "conversation": {
                            "type": "string",
                            "description": "Quoted message content"
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "Created",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "key": {
                      "type": "object",
                      "properties": {
                        "remoteJid": {
                          "type": "string",
                          "description": "The remote Jid."
                        },
                        "fromMe": {
                          "type": "boolean",
                          "description": "Indicates whether the message was sent by the user."
                        },
                        "id": {
                          "type": "string",
                          "description": "The ID of the message."
                        }
                      },
                      "description": "The key of the message, which identifies the message in the chat."
                    },
                    "message": {
                      "type": "object",
                      "properties": {
                        "imageMessage": {
                          "type": "object",
                          "properties": {
                            "url": {
                              "type": "string",
                              "description": "The URL of the image."
                            },
                            "mimetype": {
                              "type": "string",
                              "description": "The MIME type of the image."
                            },
                            "caption": {
                              "type": "string",
                              "description": "The caption text of the image."
                            },
                            "fileSha256": {
                              "type": "string",
                              "description": "The SHA-256 hash of the image file."
                            },
                            "fileLength": {
                              "type": "string",
                              "description": "The length of the image file."
                            },
                            "height": {
                              "type": "integer",
                              "description": "The height of the image."
                            },
                            "width": {
                              "type": "integer",
                              "description": "The width of the image."
                            },
                            "mediaKey": {
                              "type": "string",
                              "description": "The media key of the image."
                            },
                            "fileEncSha256": {
                              "type": "string",
                              "description": "The SHA-256 hash of the encrypted image file."
                            },
                            "directPath": {
                              "type": "string",
                              "description": "The direct path to the image."
                            },
                            "mediaKeyTimestamp": {
                              "type": "string",
                              "description": "The timestamp of the media key."
                            },
                            "jpegThumbnail": {
                              "type": "string",
                              "description": "The JPEG thumbnail of the image."
                            },
                            "contextInfo": {
                              "type": "object",
                              "description": "Additional context information."
                            }
                          },
                          "description": "Details of the image message."
                        }
                      },
                      "description": "The message content, which may include various types of messages like text, images, etc."
                    },
                    "messageTimestamp": {
                      "type": "string",
                      "description": "The timestamp of the message, represented as a string."
                    },
                    "status": {
                      "type": "string",
                      "description": "The status of the message, such as sent, received, or pending."
                    }
                  },
                  "example": {
                    "key": {
                      "remoteJid": "553198296801@s.whatsapp.net",
                      "fromMe": true,
                      "id": "BAE5F5A632EAE722"
                    },
                    "message": {
                      "imageMessage": {
                        "url": "https://mmg.whatsapp.net/o1/v/t62.7118-2...",
                        "mimetype": "image/png",
                        "caption": "Caption text",
                        "fileSha256": "VbCGkGBv5SZStLD5PHdkBWpQav/lNsXcY...",
                        "fileLength": "1305757",
                        "height": 1080,
                        "width": 1920,
                        "mediaKey": "aFQK9Ocw5tE7Nf0iBA42Xcb4Dee6G1k/pLL...",
                        "fileEncSha256": "bGVtYeR3458RwC0p1tsGDNuj+vOu/...",
                        "directPath": "/o1/v/t62.7118-24/f1/m232/up-oil...",
                        "mediaKeyTimestamp": "1717775573",
                        "jpegThumbnail": "/9j/2wBDABALDA4MChAODQ4SERATG...",
                        "contextInfo": {}
                      }
                    },
                    "messageTimestamp": "1717775575",
                    "status": "PENDING"
                  }
                }
              }
            }
          }
        }
      }
    },
    "/message/sendWhatsAppAudio/{instance}": {
      "post": {
        "operationId": "sendWhatsAppAudio",
        "summary": "Send WhatsApp Audio",
        "tags": [
          "Message Controller"
        ],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "ID of the instance to connect",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Send WhatsApp Audio",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": [
                  "number",
                  "audio"
                ],
                "properties": {
                  "number": {
                    "type": "string",
                    "description": "Number to receive the message (with country code)"
                  },
                  "audio": {
                    "type": "string",
                    "description": "url or base64 "
                  },
                  "delay": {
                    "type": "integer",
                    "description": "Presence time in milliseconds before sending message"
                  },
                  "linkPreview": {
                    "type": "boolean",
                    "description": "Shows a preview of the target website if there's a link within the message"
                  },
                  "mentionsEveryOne": {
                    "type": "boolean",
                    "description": "Mentioned everyone when the message send"
                  },
                  "mentioned": {
                    "type": "array",
                    "items": {
                      "type": "string",
                      "enum": [
                        "{{remoteJID}}"
                      ]
                    },
                    "description": "Numbers to mention"
                  },
                  "quoted": {
                    "type": "object",
                    "properties": {
                      "key": {
                        "type": "object",
                        "properties": {
                          "id": {
                            "type": "string",
                            "description": "Quoted message ID"
                          }
                        }
                      },
                      "message": {
                        "type": "object",
                        "properties": {
                          "conversation": {
                            "type": "string",
                            "description": "Quoted message content"
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Ok",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "key": {
                      "type": "object",
                      "properties": {
                        "remoteJid": {
                          "type": "string",
                          "description": "The remote Jid."
                        },
                        "fromMe": {
                          "type": "boolean",
                          "description": "Indicates whether the message was sent by the user."
                        },
                        "id": {
                          "type": "string",
                          "description": "The ID of the message."
                        }
                      },
                      "description": "The key of the message, which identifies the message in the chat."
                    },
                    "message": {
                      "type": "object",
                      "properties": {
                        "audioMessage": {
                          "type": "object",
                          "properties": {
                            "url": {
                              "type": "string",
                              "description": "The URL of the audio message."
                            },
                            "mimetype": {
                              "type": "string",
                              "description": "The MIME type of the audio message."
                            },
                            "fileSha256": {
                              "type": "string",
                              "description": "The SHA-256 hash of the audio file."
                            },
                            "fileLength": {
                              "type": "string",
                              "description": "The length of the audio file."
                            },
                            "seconds": {
                              "type": "integer",
                              "description": "The duration of the audio message in seconds."
                            },
                            "ptt": {
                              "type": "boolean",
                              "description": "Indicates whether the audio message is a push-to-talk (PTT) message."
                            },
                            "mediaKey": {
                              "type": "string",
                              "description": "The media key of the audio message."
                            },
                            "fileEncSha256": {
                              "type": "string",
                              "description": "The SHA-256 hash of the encrypted audio file."
                            },
                            "directPath": {
                              "type": "string",
                              "description": "The direct path to the audio file."
                            },
                            "mediaKeyTimestamp": {
                              "type": "string",
                              "description": "The timestamp of the media key."
                            }
                          },
                          "description": "Details of the audio message."
                        }
                      },
                      "description": "The message content, which may include various types of messages like text, images, audio, etc."
                    },
                    "messageTimestamp": {
                      "type": "string",
                      "description": "The timestamp of the message, represented as a string."
                    },
                    "status": {
                      "type": "string",
                      "description": "The status of the message, such as sent, received, or pending."
                    }
                  },
                  "example": {
                    "key": {
                      "remoteJid": "553198296801@s.whatsapp.net",
                      "fromMe": true,
                      "id": "BAE5EFED2AB0BB9F"
                    },
                    "message": {
                      "audioMessage": {
                        "url": "https://mmg.whatsapp.net/v/t62.7114-24/21428511_985284763127087_5662928...",
                        "mimetype": "audio/mp4",
                        "fileSha256": "DJPBnRns6QADzZNH2j0R88mUtFQ4aiOm9aZf6dio2G0=",
                        "fileLength": "670662",
                        "seconds": 42,
                        "ptt": true,
                        "mediaKey": "+A3X1Tuyzeh87cCVZpfuKpL3Y4RYdYr3sCDurjSlBTY=",
                        "fileEncSha256": "s4tKvHOXIZAw5668/Xcy4zoFba4vW8klmNYC78yOPZs=",
                        "directPath": "/v/t62.7114-24/21428511_985284763127087_5662928477636351284_n.enc...",
                        "mediaKeyTimestamp": "1717776942"
                      }
                    },
                    "messageTimestamp": "1717776942",
                    "status": "PENDING"
                  }
                }
              }
            }
          }
        }
      }
    },
    "/message/sendSticker/{instance}": {
      "post": {
        "operationId": "sendSticker",
        "summary": "Send Sticker",
        "tags": [
          "Message Controller"
        ],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "Name of the instance",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Send Sticker",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": [
                  "number",
                  "sticker"
                ],
                "properties": {
                  "number": {
                    "type": "string",
                    "description": "Number to receive the message (with country code)"
                  },
                  "sticker": {
                    "type": "string",
                    "description": "Url or base64 "
                  },
                  "delay": {
                    "type": "integer",
                    "description": "Presence time in milliseconds before sending message"
                  },
                  "linkPreview": {
                    "type": "boolean",
                    "description": "Shows a preview of the target website if there's a link within the message"
                  },
                  "mentionsEveryOne": {
                    "type": "boolean",
                    "description": "Mentioned everyone when the message send"
                  },
                  "mentioned": {
                    "type": "array",
                    "items": {
                      "type": "string",
                      "enum": [
                        "{{remoteJID}}"
                      ]
                    },
                    "description": "Numbers to mention"
                  },
                  "quoted": {
                    "type": "object",
                    "properties": {
                      "key": {
                        "type": "object",
                        "properties": {
                          "id": {
                            "type": "string",
                            "description": "Quoted message ID"
                          }
                        }
                      },
                      "message": {
                        "type": "object",
                        "properties": {
                          "conversation": {
                            "type": "string",
                            "description": "Quoted message content"
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Ok",
            "content": {}
          }
        }
      }
    },
    "/message/sendStatus/{instance}": {
      "post": {
        "operationId": "sendStatus",
        "summary": "Send Status",
        "tags": [
          "Message Controller"
        ],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "Name of the instance ",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Post WhatsApp status (stories)",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": [
                  "type",
                  "caption",
                  "content",
                  "backgroundColor",
                  "font",
                  "allContacts",
                  "statusJidList"
                ],
                "properties": {
                  "type": {
                    "type": "string",
                    "description": "status type",
                    "enum": [
                      "text",
                      "image",
                      "audio"
                    ]
                  },
                  "content": {
                    "type": "string",
                    "description": "status type"
                  },
                  "caption": {
                    "type": "string",
                    "description": "Optional for image or video"
                  },
                  "backgroundColor": {
                    "type": "string",
                    "description": "Exemple #008000"
                  },
                  "font": {
                    "type": "number",
                    "description": "1 = SERIF 2 = NORICAN_REGULAR 3 = BRYNDAN_WRITE 4 = BEBASNEUE_REGULAR 5 = OSWALD_HEAVY "
                  },
                  "allContacts": {
                    "type": "boolean",
                    "description": "true to send to all contacts or false to send to statusJidList below "
                  },
                  "statusJidList": {
                    "type": "array",
                    "description": "Numbers to send status",
                    "items": {
                      "type": "string",
                      "enum": [
                        "{{remoteJID}}"
                      ]
                    }
                  }
                }
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "Created",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "key": {
                      "type": "object",
                      "properties": {
                        "remoteJid": {
                          "type": "string",
                          "description": "The remote Jid."
                        },
                        "fromMe": {
                          "type": "boolean",
                          "description": "Indicates whether the message was sent by the user."
                        },
                        "id": {
                          "type": "string",
                          "description": "The ID of the message."
                        }
                      },
                      "description": "The key of the message, which identifies the message in the chat."
                    },
                    "message": {
                      "type": "object",
                      "properties": {
                        "extendedTextMessage": {
                          "type": "object",
                          "properties": {
                            "text": {
                              "type": "string",
                              "description": "The text content of the message."
                            },
                            "backgroundArgb": {
                              "type": "integer",
                              "description": "The background color of the text message, represented as ARGB integer value."
                            },
                            "font": {
                              "type": "string",
                              "description": "The font used in the text message."
                            }
                          },
                          "description": "Details of the extended text message."
                        }
                      },
                      "description": "The message content, which may include various types of messages like text, images, etc."
                    },
                    "messageTimestamp": {
                      "type": "string",
                      "description": "The timestamp of the message, represented as a string."
                    },
                    "status": {
                      "type": "string",
                      "description": "The status of the message, such as sent, received, or pending."
                    },
                    "participant": {
                      "type": "string",
                      "description": "The participant in the chat to whom the message was sent."
                    }
                  },
                  "example": {
                    "key": {
                      "remoteJid": "status@broadcast",
                      "fromMe": true,
                      "id": "BAE5FAB9E65A3DA8"
                    },
                    "message": {
                      "extendedTextMessage": {
                        "text": "example",
                        "backgroundArgb": 4294910617,
                        "font": "FB_SCRIPT"
                      }
                    },
                    "messageTimestamp": "1717691767",
                    "status": "PENDING",
                    "participant": "553198296801:17@s.whatsapp.net"
                  }
                }
              }
            }
          }
        }
      }
    },
    "/message/sendLocation/{instance}": {
      "post": {
        "operationId": "sendLocation",
        "summary": "Send Location",
        "tags": [
          "Message Controller"
        ],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "Name of the instance",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Send Location",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": [
                  "number",
                  "name",
                  "address",
                  "latitude",
                  "longitude"
                ],
                "properties": {
                  "number": {
                    "type": "string",
                    "description": "Number to receive the message (with country code)"
                  },
                  "name": {
                    "type": "string",
                    "description": "Name the city"
                  },
                  "address": {
                    "type": "string",
                    "description": "Location address"
                  },
                  "latitude": {
                    "type": "number",
                    "description": "Latitude location"
                  },
                  "longitude": {
                    "type": "number",
                    "description": "Longitude location"
                  },
                  "delay": {
                    "type": "integer",
                    "description": "Presence time in milliseconds before sending message"
                  },
                  "linkPreview": {
                    "type": "boolean",
                    "description": "Shows a preview of the target website if there's a link within the message"
                  },
                  "mentionsEveryOne": {
                    "type": "boolean",
                    "description": "Mentioned everyone when the message send"
                  },
                  "mentioned": {
                    "type": "array",
                    "items": {
                      "type": "string",
                      "enum": [
                        "{{remoteJID}}"
                      ]
                    },
                    "description": "Numbers to mention"
                  },
                  "quoted": {
                    "type": "object",
                    "properties": {
                      "key": {
                        "type": "object",
                        "properties": {
                          "id": {
                            "type": "string",
                            "description": "Quoted message ID"
                          }
                        }
                      },
                      "message": {
                        "type": "object",
                        "properties": {
                          "conversation": {
                            "type": "string",
                            "description": "Quoted message content"
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "Created",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "key": {
                      "type": "object",
                      "properties": {
                        "remoteJid": {
                          "type": "string",
                          "description": "The remote Jid."
                        },
                        "fromMe": {
                          "type": "boolean",
                          "description": "Indicates whether the message was sent by the user."
                        },
                        "id": {
                          "type": "string",
                          "description": "The ID of the message."
                        }
                      },
                      "description": "The key of the message, which identifies the message in the chat."
                    },
                    "message": {
                      "type": "object",
                      "properties": {
                        "locationMessage": {
                          "type": "object",
                          "properties": {
                            "degreesLatitude": {
                              "type": "number",
                              "format": "float",
                              "description": "The latitude of the location."
                            },
                            "degreesLongitude": {
                              "type": "number",
                              "format": "float",
                              "description": "The longitude of the location."
                            },
                            "name": {
                              "type": "string",
                              "description": "The name of the location."
                            },
                            "address": {
                              "type": "string",
                              "description": "The address of the location."
                            },
                            "contextInfo": {
                              "type": "object",
                              "description": "Additional context information."
                            }
                          },
                          "description": "Details of the location message."
                        }
                      },
                      "description": "The message content, which may include various types of messages like text, images, location, etc."
                    },
                    "messageTimestamp": {
                      "type": "string",
                      "description": "The timestamp of the message, represented as a string."
                    },
                    "status": {
                      "type": "string",
                      "description": "The status of the message, such as sent, received, or pending."
                    }
                  },
                  "example": {
                    "key": {
                      "remoteJid": "553198296801@s.whatsapp.net",
                      "fromMe": true,
                      "id": "BAE51B6FF4470AF9"
                    },
                    "message": {
                      "locationMessage": {
                        "degreesLatitude": -19.93359,
                        "degreesLongitude": -43.93851,
                        "name": "Palácio da Liberdade",
                        "address": "Praça da Liberdade, Belo Horizonte, MG 30140-050",
                        "contextInfo": {}
                      }
                    },
                    "messageTimestamp": "1717779606",
                    "status": "PENDING"
                  }
                }
              }
            }
          }
        }
      }
    },
    "/message/sendContact/{instance}": {
      "post": {
        "operationId": "sendContact",
        "summary": "Send Contact",
        "tags": [
          "Message Controller"
        ],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "Name of the instance",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Send Contact",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": [
                  "number",
                  "contact"
                ],
                "properties": {
                  "number": {
                    "type": "string",
                    "description": "Number to receive the message (with country code)"
                  },
                  "contact": {
                    "type": "array",
                    "minItems": 1,
                    "items": {
                      "type": "object",
                      "required": [
                        "fullname",
                        "wuid",
                        "phoneNumber",
                        "organization",
                        "email",
                        "url"
                      ],
                      "properties": {
                        "fullName": {
                          "type": "string",
                          "description": "Contact full name"
                        },
                        "wuid": {
                          "type": "string",
                          "description": "Phone number non-stylized with country code (553198296801)"
                        },
                        "phoneNumber": {
                          "type": "string",
                          "description": "Phone number stylized (+55 31 9 9999-9999)"
                        },
                        "organization": {
                          "type": "string",
                          "description": "Organization name for the contact"
                        },
                        "email": {
                          "type": "string",
                          "description": "Contact email address"
                        },
                        "url": {
                          "type": "string",
                          "description": "Page URL"
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "Created",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "key": {
                      "type": "object",
                      "properties": {
                        "remoteJid": {
                          "type": "string",
                          "description": "The remote Jid."
                        },
                        "fromMe": {
                          "type": "boolean",
                          "description": "Indicates whether the message was sent by the user."
                        },
                        "id": {
                          "type": "string",
                          "description": "The ID of the message."
                        }
                      },
                      "description": "The key of the message, which identifies the message in the chat."
                    },
                    "message": {
                      "type": "object",
                      "properties": {
                        "contactMessage": {
                          "type": "object",
                          "properties": {
                            "displayName": {
                              "type": "string",
                              "description": "The display name of the contact."
                            },
                            "vcard": {
                              "type": "string",
                              "description": "The vCard format contact information."
                            },
                            "contextInfo": {
                              "type": "object",
                              "description": "Additional context information."
                            }
                          },
                          "description": "Details of the contact message."
                        }
                      },
                      "description": "The message content, which may include various types of messages like text, images, contact, etc."
                    },
                    "messageTimestamp": {
                      "type": "string",
                      "description": "The timestamp of the message, represented as a string."
                    },
                    "status": {
                      "type": "string",
                      "description": "The status of the message, such as sent, received, or pending."
                    }
                  },
                  "example": {
                    "key": {
                      "remoteJid": "553198296801@s.whatsapp.net",
                      "fromMe": true,
                      "id": "BAE58DA6CBC941BC"
                    },
                    "message": {
                      "contactMessage": {
                        "displayName": "Guilherme Gomes",
                        "vcard": "BEGIN:VCARD\nVERSION:3.0\nN:Guilherme Gomes\nFN:Guilherme Gomes\nORG:AtendAI;\nEMAIL:...",
                        "contextInfo": {}
                      }
                    },
                    "messageTimestamp": "1717780437",
                    "status": "PENDING"
                  }
                }
              }
            }
          }
        }
      }
    },
    "/message/sendReaction/{instance}": {
      "post": {
        "operationId": "sendReaction",
        "summary": "Send Reaction",
        "tags": [
          "Message Controller"
        ],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "Name of the instance",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Send Reaction",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "key": {
                    "type": "object",
                    "properties": {
                      "remoteJid": {
                        "type": "string",
                        "description": "Chat contact or group remote JID"
                      },
                      "fromMe": {
                        "type": "boolean",
                        "description": "If the message was sent by the instance owner or not"
                      },
                      "id": {
                        "type": "string",
                        "description": "Message ID"
                      }
                    }
                  },
                  "reaction": {
                    "type": "string",
                    "description": "Reaction emoji",
                    "example": "🚀"
                  }
                }
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "Created",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "key": {
                      "type": "object",
                      "properties": {
                        "remoteJid": {
                          "type": "string",
                          "description": "The remote Jid."
                        },
                        "fromMe": {
                          "type": "boolean",
                          "description": "Indicates whether the message was sent by the user."
                        },
                        "id": {
                          "type": "string",
                          "description": "The ID of the message."
                        }
                      },
                      "description": "The key of the message, which identifies the message in the chat."
                    },
                    "message": {
                      "type": "object",
                      "properties": {
                        "reactionMessage": {
                          "type": "object",
                          "properties": {
                            "key": {
                              "type": "object",
                              "properties": {
                                "remoteJid": {
                                  "type": "string",
                                  "description": "The remote Jid of the original message."
                                },
                                "fromMe": {
                                  "type": "boolean",
                                  "description": "Indicates whether the original message was sent by the user."
                                },
                                "id": {
                                  "type": "string",
                                  "description": "The ID of the original message."
                                }
                              },
                              "description": "The key of the original message to which the reaction is linked."
                            },
                            "text": {
                              "type": "string",
                              "description": "The reaction text or emoji."
                            },
                            "senderTimestampMs": {
                              "type": "string",
                              "description": "The timestamp when the reaction was sent, in milliseconds."
                            }
                          },
                          "description": "Details of the reaction message."
                        }
                      },
                      "description": "The message content, which may include various types of messages like text, images, reaction, etc."
                    },
                    "messageTimestamp": {
                      "type": "string",
                      "description": "The timestamp of the message, represented as a string."
                    },
                    "status": {
                      "type": "string",
                      "description": "The status of the message, such as sent, received, or pending."
                    }
                  },
                  "example": {
                    "key": {
                      "remoteJid": "553198296801@s.whatsapp.net",
                      "fromMe": true,
                      "id": "BAE569F0E38F858D"
                    },
                    "message": {
                      "reactionMessage": {
                        "key": {
                          "remoteJid": "553198296801@s.whatsapp.net",
                          "fromMe": true,
                          "id": "BAE58DA6CBC941BC"
                        },
                        "text": "🚀",
                        "senderTimestampMs": "1717781105034"
                      }
                    },
                    "messageTimestamp": "1717781105",
                    "status": "PENDING"
                  }
                }
              }
            }
          }
        }
      }
    },
    "/message/sendPoll/{instance}": {
      "post": {
        "operationId": "sendPoll",
        "summary": "Send Poll",
        "tags": [
          "Message Controller"
        ],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "Name of the instance",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Send Poll",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": [
                  "number",
                  "name",
                  "selectableCount",
                  "values"
                ],
                "properties": {
                  "number": {
                    "type": "string",
                    "description": "{{remoteJid}}"
                  },
                  "name": {
                    "type": "string",
                    "description": "Main text of the poll"
                  },
                  "selectableCount": {
                    "type": "number",
                    "description": "Ex: 1"
                  },
                  "values": {
                    "type": "array",
                    "items": {
                      "type": "string",
                      "enum": [
                        "Question 1",
                        "Question 2",
                        "Question 3"
                      ]
                    },
                    "description": "Values for question"
                  },
                  "delay": {
                    "type": "integer",
                    "description": "Presence time in milliseconds before sending message"
                  },
                  "linkPreview": {
                    "type": "boolean",
                    "description": "Shows a preview of the target website if there's a link within the message"
                  },
                  "mentionsEveryOne": {
                    "type": "boolean",
                    "description": "Mentioned everyone when the message send"
                  },
                  "mentioned": {
                    "type": "array",
                    "items": {
                      "type": "string",
                      "enum": [
                        "{{remoteJID}}"
                      ]
                    },
                    "description": "Numbers to mention"
                  },
                  "quoted": {
                    "type": "object",
                    "properties": {
                      "key": {
                        "type": "object",
                        "properties": {
                          "id": {
                            "type": "string",
                            "description": "Quoted message ID"
                          }
                        }
                      },
                      "message": {
                        "type": "object",
                        "properties": {
                          "conversation": {
                            "type": "string",
                            "description": "Quoted message content"
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "Created",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "key": {
                      "type": "object",
                      "properties": {
                        "remoteJid": {
                          "type": "string",
                          "description": "The remote Jid."
                        },
                        "fromMe": {
                          "type": "boolean",
                          "description": "Indicates whether the message was sent by the user."
                        },
                        "id": {
                          "type": "string",
                          "description": "The ID of the message."
                        }
                      },
                      "description": "The key of the message, which identifies the message in the chat."
                    },
                    "message": {
                      "type": "object",
                      "properties": {
                        "messageContextInfo": {
                          "type": "object",
                          "properties": {
                            "messageSecret": {
                              "type": "string",
                              "description": "The secret of the message context."
                            }
                          },
                          "description": "Information about the context of the message."
                        },
                        "pollCreationMessage": {
                          "type": "object",
                          "properties": {
                            "name": {
                              "type": "string",
                              "description": "The name of the poll."
                            },
                            "options": {
                              "type": "array",
                              "items": {
                                "type": "object",
                                "properties": {
                                  "optionName": {
                                    "type": "string",
                                    "description": "The name of the poll option."
                                  }
                                }
                              },
                              "description": "The options available in the poll."
                            },
                            "selectableOptionsCount": {
                              "type": "integer",
                              "description": "The number of options that can be selected in the poll."
                            }
                          },
                          "description": "Details of the poll creation message."
                        }
                      },
                      "description": "The message content, which may include various types of messages like text, images, poll creation, etc."
                    },
                    "messageTimestamp": {
                      "type": "string",
                      "description": "The timestamp of the message, represented as a string."
                    },
                    "status": {
                      "type": "string",
                      "description": "The status of the message, such as sent, received, or pending."
                    }
                  },
                  "example": {
                    "key": {
                      "remoteJid": "553198296801@s.whatsapp.net",
                      "fromMe": true,
                      "id": "BAE53EC8D8E1FD8A"
                    },
                    "message": {
                      "messageContextInfo": {
                        "messageSecret": "lX/+cLHHNfnTTKZi+88mrhoyi6KNuUzWjgfaB0bTfOY="
                      },
                      "pollCreationMessage": {
                        "name": "Poll Name",
                        "options": [
                          {
                            "optionName": "Option 1"
                          },
                          {
                            "optionName": "Option 2"
                          },
                          {
                            "optionName": "Option 3"
                          }
                        ],
                        "selectableOptionsCount": 1
                      }
                    },
                    "messageTimestamp": "1717781848",
                    "status": "PENDING"
                  }
                }
              }
            }
          }
        }
      }
    },
    "/message/sendList/{instance}": {
      "post": {
        "operationId": "sendList",
        "summary": "Send List",
        "tags": [
          "Message Controller"
        ],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "Name of the instance",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Send List",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": [
                  "number",
                  "title",
                  "description",
                  "buttonText",
                  "footerText",
                  "values"
                ],
                "properties": {
                  "number": {
                    "type": "string",
                    "description": "{{remoteJid}}"
                  },
                  "title": {
                    "type": "string",
                    "description": "Title of list"
                  },
                  "description": {
                    "type": "string",
                    "description": "Description for lists"
                  },
                  "buttonText": {
                    "type": "string",
                    "description": "Text Button"
                  },
                  "footerText": {
                    "type": "string",
                    "description": "footer list\nhttps://examplelink.com.br"
                  },
                  "values": {
                    "type": "array",
                    "items": {
                      "type": "object",
                      "properties": {
                        "title": {
                          "type": "string",
                          "description": "title item of list"
                        },
                        "rows": {
                          "type": "array",
                          "items": {
                            "type": "object",
                            "properties": {
                              "title": {
                                "type": "string",
                                "description": "Title of row"
                              },
                              "description": {
                                "type": "string",
                                "description": "Description of row"
                              },
                              "rowId": {
                                "type": "string",
                                "description": "Id of row"
                              }
                            }
                          }
                        }
                      }
                    }
                  },
                  "delay": {
                    "type": "integer",
                    "description": "Presence time in milliseconds before sending message"
                  },
                  "linkPreview": {
                    "type": "boolean",
                    "description": "Shows a preview of the target website if there's a link within the message"
                  },
                  "mentionsEveryOne": {
                    "type": "boolean",
                    "description": "Mentioned everyone when the message send"
                  },
                  "mentioned": {
                    "type": "array",
                    "items": {
                      "type": "string",
                      "enum": [
                        "{{remoteJID}}"
                      ]
                    },
                    "description": "Numbers to mention"
                  },
                  "quoted": {
                    "type": "object",
                    "properties": {
                      "key": {
                        "type": "object",
                        "properties": {
                          "id": {
                            "type": "string",
                            "description": "Quoted message ID"
                          }
                        }
                      },
                      "message": {
                        "type": "object",
                        "properties": {
                          "conversation": {
                            "type": "string",
                            "description": "Quoted message content"
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "Created",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "key": {
                      "type": "object",
                      "properties": {
                        "remoteJid": {
                          "type": "string",
                          "description": "The remote Jid."
                        },
                        "fromMe": {
                          "type": "boolean",
                          "description": "Indicates whether the message was sent by the user."
                        },
                        "id": {
                          "type": "string",
                          "description": "The ID of the message."
                        }
                      },
                      "description": "The key of the message, which identifies the message in the chat."
                    },
                    "message": {
                      "type": "object",
                      "properties": {
                        "messageContextInfo": {
                          "type": "object",
                          "properties": {
                            "messageSecret": {
                              "type": "string",
                              "description": "The secret of the message context."
                            }
                          },
                          "description": "Information about the context of the message."
                        },
                        "pollCreationMessage": {
                          "type": "object",
                          "properties": {
                            "name": {
                              "type": "string",
                              "description": "The name of the poll."
                            },
                            "options": {
                              "type": "array",
                              "items": {
                                "type": "object",
                                "properties": {
                                  "optionName": {
                                    "type": "string",
                                    "description": "The name of the poll option."
                                  }
                                }
                              },
                              "description": "The options available in the poll."
                            },
                            "selectableOptionsCount": {
                              "type": "integer",
                              "description": "The number of options that can be selected in the poll."
                            }
                          },
                          "description": "Details of the poll creation message."
                        }
                      },
                      "description": "The message content, which may include various types of messages like text, images, poll creation, etc."
                    },
                    "messageTimestamp": {
                      "type": "string",
                      "description": "The timestamp of the message, represented as a string."
                    },
                    "status": {
                      "type": "string",
                      "description": "The status of the message, such as sent, received, or pending."
                    }
                  },
                  "example": {
                    "key": {
                      "remoteJid": "553198296801@s.whatsapp.net",
                      "fromMe": true,
                      "id": "BAE53EC8D8E1FD8A"
                    },
                    "message": {
                      "messageContextInfo": {
                        "messageSecret": "lX/+cLHHNfnTTKZi+88mrhoyi6KNuUzWjgfaB0bTfOY="
                      },
                      "pollCreationMessage": {
                        "name": "Poll Name",
                        "options": [
                          {
                            "optionName": "Option 1"
                          },
                          {
                            "optionName": "Option 2"
                          },
                          {
                            "optionName": "Option 3"
                          }
                        ],
                        "selectableOptionsCount": 1
                      }
                    },
                    "messageTimestamp": "1717781848",
                    "status": "PENDING"
                  }
                }
              }
            }
          }
        }
      }
    },
    "/message/sendButtons/{instance}": {
      "post": {
        "operationId": "sendList",
        "summary": "Send Buttons",
        "tags": [
          "Message Controller"
        ],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "Name of the instance",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Send Buttons",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": [
                  "number",
                  "title",
                  "description",
                  "footer",
                  "buttons"
                ],
                "properties": {
                  "number": {
                    "type": "string",
                    "description": "{{remoteJid}}"
                  },
                  "title": {
                    "type": "string",
                    "description": "Title Button"
                  },
                  "description": {
                    "type": "string",
                    "description": "Description for buttons"
                  },
                  "footer": {
                    "type": "string",
                    "description": "Text Button"
                  },
                  "buttons": {
                    "type": "array",
                    "items": {
                      "type": "object",
                      "properties": {
                        "title": {
                          "type": "string",
                          "description": "Types: reply,url,call"
                        },
                        "displayText": {
                          "type": "string",
                          "description": "Text of button"
                        },
                        "id": {
                          "type": "string",
                          "description": "Id button"
                        }
                      }
                    }
                  },
                  "delay": {
                    "type": "integer",
                    "description": "Presence time in milliseconds before sending message"
                  },
                  "linkPreview": {
                    "type": "boolean",
                    "description": "Shows a preview of the target website if there's a link within the message"
                  },
                  "mentionsEveryOne": {
                    "type": "boolean",
                    "description": "Mentioned everyone when the message send"
                  },
                  "mentioned": {
                    "type": "array",
                    "items": {
                      "type": "string",
                      "enum": [
                        "{{remoteJID}}"
                      ]
                    },
                    "description": "Numbers to mention"
                  },
                  "quoted": {
                    "type": "object",
                    "properties": {
                      "key": {
                        "type": "object",
                        "properties": {
                          "id": {
                            "type": "string",
                            "description": "Quoted message ID"
                          }
                        }
                      },
                      "message": {
                        "type": "object",
                        "properties": {
                          "conversation": {
                            "type": "string",
                            "description": "Quoted message content"
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "Created",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "key": {
                      "type": "object",
                      "properties": {
                        "remoteJid": {
                          "type": "string",
                          "description": "The remote Jid."
                        },
                        "fromMe": {
                          "type": "boolean",
                          "description": "Indicates whether the message was sent by the user."
                        },
                        "id": {
                          "type": "string",
                          "description": "The ID of the message."
                        }
                      },
                      "description": "The key of the message, which identifies the message in the chat."
                    },
                    "message": {
                      "type": "object",
                      "properties": {
                        "messageContextInfo": {
                          "type": "object",
                          "properties": {
                            "messageSecret": {
                              "type": "string",
                              "description": "The secret of the message context."
                            }
                          },
                          "description": "Information about the context of the message."
                        },
                        "pollCreationMessage": {
                          "type": "object",
                          "properties": {
                            "name": {
                              "type": "string",
                              "description": "The name of the poll."
                            },
                            "options": {
                              "type": "array",
                              "items": {
                                "type": "object",
                                "properties": {
                                  "optionName": {
                                    "type": "string",
                                    "description": "The name of the poll option."
                                  }
                                }
                              },
                              "description": "The options available in the poll."
                            },
                            "selectableOptionsCount": {
                              "type": "integer",
                              "description": "The number of options that can be selected in the poll."
                            }
                          },
                          "description": "Details of the poll creation message."
                        }
                      },
                      "description": "The message content, which may include various types of messages like text, images, poll creation, etc."
                    },
                    "messageTimestamp": {
                      "type": "string",
                      "description": "The timestamp of the message, represented as a string."
                    },
                    "status": {
                      "type": "string",
                      "description": "The status of the message, such as sent, received, or pending."
                    }
                  },
                  "example": {
                    "key": {
                      "remoteJid": "553198296801@s.whatsapp.net",
                      "fromMe": true,
                      "id": "BAE53EC8D8E1FD8A"
                    },
                    "message": {
                      "messageContextInfo": {
                        "messageSecret": "lX/+cLHHNfnTTKZi+88mrhoyi6KNuUzWjgfaB0bTfOY="
                      },
                      "pollCreationMessage": {
                        "name": "Poll Name",
                        "options": [
                          {
                            "optionName": "Option 1"
                          },
                          {
                            "optionName": "Option 2"
                          },
                          {
                            "optionName": "Option 3"
                          }
                        ],
                        "selectableOptionsCount": 1
                      }
                    },
                    "messageTimestamp": "1717781848",
                    "status": "PENDING"
                  }
                }
              }
            }
          }
        }
      }
    },
    "/chat/whatsappNumbers/{instance}": {
      "post": {
        "operationId": "whatsappNumbers",
        "summary": "WhatsApp Numbers",
        "tags": [
          "Chat Controller"
        ],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "Name of the instance",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Check if numbers are on WhatsApp",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "numbers": {
                    "type": "array",
                    "description": "Phone numbers (with country code) to be checked",
                    "items": {
                      "type": "string"
                    }
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Ok",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "type": "object",
                    "properties": {
                      "exists": {
                        "type": "boolean",
                        "description": "Indicates whether the WhatsApp account exists."
                      },
                      "jid": {
                        "type": "string",
                        "description": "The JID of the WhatsApp account."
                      },
                      "number": {
                        "type": "string",
                        "description": "The phone number associated with the WhatsApp account."
                      }
                    }
                  },
                  "description": "Array of objects representing WhatsApp account existence information.",
                  "example": [
                    {
                      "exists": true,
                      "jid": "553198296801@s.whatsapp.net",
                      "number": "553198296801"
                    }
                  ]
                }
              }
            }
          }
        }
      }
    },
    "/chat/markMessageAsRead/{instance}": {
      "post": {
        "operationId": "markMessageAsRead",
        "summary": "Mark Message As Read",
        "tags": [
          "Chat Controller"
        ],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "Name of the instance",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Mark message as read",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": [
                  "readMessages"
                ],
                "properties": {
                  "readMessages": {
                    "type": "array",
                    "description": "Messages to be mark as read",
                    "items": {
                      "type": "object",
                      "properties": {
                        "remoteJid": {
                          "type": "string",
                          "description": "Chat contact or group remote JID"
                        },
                        "fromMe": {
                          "type": "boolean",
                          "description": "If the message was sent by the instance owner or the contact"
                        },
                        "id": {
                          "type": "string",
                          "description": "Message ID"
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "Created",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "message": {
                      "type": "string",
                      "description": "A brief message describing the action performed."
                    },
                    "read": {
                      "type": "string",
                      "description": "The status of the read action."
                    }
                  },
                  "example": {
                    "message": "Read messages",
                    "read": "success"
                  }
                }
              }
            }
          }
        }
      }
    },
    "/chat/markChatUnread/{instance}": {
      "post": {
        "operationId": "markMessageAsRead",
        "summary": "Mark Message As Unread",
        "tags": [
          "Chat Controller"
        ],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "Name of the instance",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Mark message as read",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": [
                  "lastMessage",
                  "chat"
                ],
                "properties": {
                  "lastMessage": {
                    "type": "array",
                    "description": "Messages to be mark as unread",
                    "items": {
                      "type": "object",
                      "properties": {
                        "remoteJid": {
                          "type": "string",
                          "description": "Chat contact or group remote JID"
                        },
                        "fromMe": {
                          "type": "boolean",
                          "description": "If the message was sent by the instance owner or the contact"
                        },
                        "id": {
                          "type": "string",
                          "description": "Message ID"
                        }
                      }
                    }
                  },
                  "chat": {
                    "type": "string",
                    "description": "remoteJid here"
                  }
                }
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "Created",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "message": {
                      "type": "string",
                      "description": "A brief message describing the action performed."
                    },
                    "read": {
                      "type": "string",
                      "description": "The status of the read action."
                    }
                  },
                  "example": {
                    "message": "Read messages",
                    "read": "success"
                  }
                }
              }
            }
          }
        }
      }
    },
    "/chat/archiveChat/{instance}": {
      "post": {
        "operationId": "archiveChat",
        "summary": "Archive Chat",
        "tags": [
          "Chat Controller"
        ],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "Name of the instance",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Archive Chat",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": [
                  "lastMessage",
                  "archive",
                  "chat"
                ],
                "properties": {
                  "lastMessage": {
                    "type": "object",
                    "description": "Messages to be mark as read",
                    "required": [
                      "key"
                    ],
                    "properties": {
                      "key": {
                        "type": "object",
                        "required": [
                          "remoteJid",
                          "fromMe",
                          "id"
                        ],
                        "properties": {
                          "remoteJid": {
                            "type": "string",
                            "description": "Chat contact or group remote JID"
                          },
                          "fromMe": {
                            "type": "boolean",
                            "description": "If the message was sent by the instance owner or the contact"
                          },
                          "id": {
                            "type": "string",
                            "description": "Message ID"
                          }
                        }
                      }
                    }
                  },
                  "archive": {
                    "type": "boolean",
                    "description": "Whether to archive the chat or not"
                  },
                  "chat": {
                    "type": "string",
                    "description": "remoteJid here"
                  }
                }
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "Created",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "chatId": {
                      "type": "string",
                      "description": "The ID of the chat."
                    },
                    "archived": {
                      "type": "boolean",
                      "description": "Indicates whether the chat is archived."
                    }
                  },
                  "example": {
                    "chatId": "553198296801@s.whatsapp.net",
                    "archived": true
                  }
                }
              }
            }
          }
        }
      }
    },
    "/chat/deleteMessageForEveryone/{instance}": {
      "delete": {
        "operationId": "deleteMessageForEveryone",
        "summary": "Delete Message For Everyone",
        "tags": [
          "Chat Controller"
        ],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "Name instance",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Delete Message For Everyone",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": [
                  "id",
                  "remoteJid",
                  "fromMe",
                  "paticipant"
                ],
                "properties": {
                  "id": {
                    "type": "string",
                    "description": "Message ID"
                  },
                  "remoteJid": {
                    "type": "string",
                    "description": "Chat contact or group remote JID"
                  },
                  "fromMe": {
                    "type": "boolean",
                    "description": "If the message was sent by the instance owner or the contact"
                  },
                  "participant": {
                    "type": "string",
                    "description": "Participant for group messages only TODO"
                  }
                }
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "Created",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "key": {
                      "type": "object",
                      "properties": {
                        "remoteJid": {
                          "type": "string",
                          "description": "The remote JID (Jabber ID) of the WhatsApp account."
                        },
                        "fromMe": {
                          "type": "boolean",
                          "description": "Indicates whether the message was sent by the user."
                        },
                        "id": {
                          "type": "string",
                          "description": "The ID of the message."
                        }
                      },
                      "description": "The key that identifies the message in the chat."
                    },
                    "message": {
                      "type": "object",
                      "properties": {
                        "protocolMessage": {
                          "type": "object",
                          "properties": {
                            "key": {
                              "type": "object",
                              "properties": {
                                "remoteJid": {
                                  "type": "string",
                                  "description": "The remote JID (Jabber ID) of the WhatsApp account in the referenced message."
                                },
                                "fromMe": {
                                  "type": "boolean",
                                  "description": "Indicates whether the referenced message was sent by the user."
                                },
                                "id": {
                                  "type": "string",
                                  "description": "The ID of the referenced message."
                                }
                              },
                              "description": "The key that identifies the referenced message."
                            },
                            "type": {
                              "type": "string",
                              "description": "The type of protocol message, e.g., 'REVOKE'."
                            }
                          },
                          "description": "Details of the protocol message."
                        }
                      },
                      "description": "The content of the message."
                    },
                    "messageTimestamp": {
                      "type": "string",
                      "description": "The timestamp of the message, represented as a string."
                    },
                    "status": {
                      "type": "string",
                      "description": "The status of the message, such as sent, received, or pending."
                    }
                  },
                  "description": "Schema representing a WhatsApp protocol message, including the key, message content, timestamp, and status.",
                  "example": {
                    "key": {
                      "remoteJid": "553198296801@s.whatsapp.com",
                      "fromMe": true,
                      "id": "BAE5EABBD912C4E2"
                    },
                    "message": {
                      "protocolMessage": {
                        "key": {
                          "remoteJid": "553198296801@s.whatsapp.com",
                          "fromMe": true,
                          "id": "BAE52B567D0E3DD8"
                        },
                        "type": "REVOKE"
                      }
                    },
                    "messageTimestamp": "1718108455",
                    "status": "PENDING"
                  }
                }
              }
            }
          }
        }
      }
    },
    "/chat/sendPresence/{instance}": {
      "post": {
        "operationId": "sendPresence",
        "summary": "Send Presence",
        "tags": [
          "Chat Controller"
        ],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "Name of the instance",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Send Presence (typing...)",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": [
                  "number",
                  "options"
                ],
                "properties": {
                  "number": {
                    "type": "string",
                    "description": "Receiver phone number with country code"
                  },
                  "options": {
                    "type": "object",
                    "required": [
                      "delay",
                      "presence",
                      "number"
                    ],
                    "properties": {
                      "delay": {
                        "type": "integer",
                        "description": "Presence display time in milliseconds"
                      },
                      "presence": {
                        "type": "string",
                        "description": "Presence type",
                        "enum": [
                          "composing",
                          "recording"
                        ]
                      },
                      "number": {
                        "type": "string",
                        "description": "Number contact"
                      }
                    }
                  }
                }
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "Created",
            "content": {}
          }
        }
      }
    },
    "/message/updateBlockStatus/{instance}": {
      "post": {
        "operationId": "updateBlockStatus",
        "summary": "Update block status",
        "tags": [
          "Chat Controller"
        ],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "Name of the instance",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Block status to contacts",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": [
                  "number",
                  "status"
                ],
                "properties": {
                  "number": {
                    "type": "string",
                    "description": " Phone number with country code"
                  },
                  "status": {
                    "type": "string",
                    "description": "Values: block, unblock "
                  }
                }
              }
            }
          }
        },
        "responses": {
          "201": {
            "description": "Created",
            "content": {}
          }
        }
      }
    },
    "/chat/fetchProfilePictureUrl/{instance}": {
      "post": {
        "operationId": "fetchProfilePictureUrl",
        "summary": "Fetch Profile Picture URL",
        "tags": [
          "Chat Controller"
        ],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "Name instance",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Fetch Profile Picture URL",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": [
                  "number"
                ],
                "properties": {
                  "number": {
                    "type": "string",
                    "description": "Number to fetch profile picture URL: {{remoteJid}}"
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Ok",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "wuid": {
                      "type": "string",
                      "description": "The WhatsApp User ID (WUID)."
                    },
                    "profilePictureUrl": {
                      "type": "string",
                      "description": "URL of the user's profile picture."
                    }
                  },
                  "example": {
                    "wuid": "553198296801@s.whatsapp.net",
                    "profilePictureUrl": "https://pps.whatsapp.net/v/t61.2..."
                  }
                }
              }
            }
          }
        }
      }
    },
    "/chat/findContacts/{instance}": {
      "post": {
        "operationId": "findContacts",
        "summary": "Find Contacts",
        "tags": [
          "Chat Controller"
        ],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "Name instance",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Here it is possible to list all contacts or just one,using the 'where' option.",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": [
                  "where"
                ],
                "properties": {
                  "where": {
                    "type": "object",
                    "properties": {
                      "id": {
                        "type": "string",
                        "description": "Contact number: optional"
                      }
                    }
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Ok",
            "content": {}
          }
        }
      }
    },
    "/chat/getBase64FromMediaMessage/{instance}": {
      "post": {
        "operationId": "getBase64FromMediaMessage",
        "summary": "Get Base64 From Media Message",
        "tags": [
          "Chat Controller"
        ],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "Name instance",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Get base64 from media message",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": [
                  "message",
                  "convertToMp4"
                ],
                "properties": {
                  "message": {
                    "type": "object",
                    "properties": {
                      "key": {
                        "type": "object",
                        "properties": {
                          "id": {
                            "type": "string",
                            "description": "Message ID"
                          }
                        }
                      }
                    }
                  },
                  "convertToMp4": {
                    "type": "boolean",
                    "description": "Convert video to MP4, for video only"
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Ok",
            "content": {}
          }
        }
      }
    },
    "/chat/findMessages/{instance}": {
      "post": {
        "operationId": "findMessages",
        "summary": "Find Messages",
        "tags": [
          "Chat Controller"
        ],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "Name instance",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Find all messages",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "where": {
                    "type": "object",
                    "properties": {
                      "key": {
                        "type": "object",
                        "properties": {
                          "remoteJid": {
                            "type": "string",
                            "description": "Contact or group remote JID"
                          }
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Ok",
            "content": {}
          }
        }
      }
    },
    "/chat/findStatusMessage/{instance}": {
      "post": {
        "operationId": "findStatusMessage",
        "summary": "Find Status Message",
        "tags": [
          "Chat Controller"
        ],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "Name instance",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Find status message",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": [
                  "where"
                ],
                "properties": {
                  "where": {
                    "type": "object",
                    "properties": {
                      "_id": {
                        "type": "string",
                        "description": "MongoDB message ID"
                      },
                      "id": {
                        "type": "string",
                        "description": "Message ID (from WhatsApp)"
                      },
                      "remoteJid": {
                        "type": "string",
                        "description": "Contact or group remote JID"
                      },
                      "fromMe": {
                        "type": "boolean",
                        "description": "Whether the message is from the instance owner or not"
                      }
                    }
                  },
                  "limit": {
                    "type": "integer",
                    "description": "Limit for the return"
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Ok",
            "content": {}
          }
        }
      }
    },
    "/chat/updateMessage/{instance}": {
      "post": {
        "operationId": "updateMessage",
        "summary": "Update Message",
        "tags": [
          "Chat Controller"
        ],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "Name instance",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Update message",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": [
                  "number",
                  "text",
                  "key"
                ],
                "properties": {
                  "number": {
                    "type": "integer",
                    "description": "Receiver phone number with country code"
                  },
                  "text": {
                    "type": "string",
                    "description": "New message content"
                  },
                  "key": {
                    "type": "object",
                    "properties": {
                      "remoteJid": {
                        "type": "string",
                        "description": "Chat contact or group remote JID"
                      },
                      "fromMe": {
                        "type": "boolean",
                        "description": "If the message was sent by the instance owner or not"
                      },
                      "id": {
                        "type": "string",
                        "description": "Message ID"
                      }
                    }
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Ok",
            "content": {}
          }
        }
      }
    },
    "/chat/findChats/{instance}": {
      "post": {
        "operationId": "findChats",
        "summary": "Find Chats",
        "tags": [
          "Chat Controller"
        ],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "Name instance",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Find all chats",
        "responses": {
          "200": {
            "description": "Ok",
            "content": {}
          }
        }
      }
    },
    "/chat/fetchBusinessProfile/{instance}": {
      "post": {
        "operationId": "fetchBusinessProfile",
        "summary": "Fetch Business Profile",
        "tags": [
          "Chat Controller"
        ],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "Name of the instance",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Fetch business profile from phone number",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": [
                  "number"
                ],
                "properties": {
                  "number": {
                    "type": "string",
                    "description": "Phone number with country code"
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Ok",
            "content": {}
          }
        }
      }
    },
    "/chat/fetchProfile/{instance}": {
      "post": {
        "operationId": "fetchBusinessProfile",
        "summary": "Fetch Business Profile",
        "tags": [
          "Chat Controller"
        ],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "Name of the instance",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Fetch profile from phone number",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": [
                  "number"
                ],
                "properties": {
                  "number": {
                    "type": "string",
                    "description": "Phone number with country code"
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Ok",
            "content": {}
          }
        }
      }
    },
    "/chat/updateProfileName/{instance}": {
      "post": {
        "operationId": "updateProfileName",
        "summary": "Update Profile Name",
        "tags": [
          "Chat Controller"
        ],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "Name instance",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Update profile name",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": [
                  "name"
                ],
                "properties": {
                  "name": {
                    "type": "string",
                    "description": "New name for profile"
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Ok",
            "content": {}
          }
        }
      }
    },
    "/chat/updateProfileStatus/{instance}": {
      "post": {
        "operationId": "updateProfileStatus",
        "summary": "Update Profile Status",
        "tags": [
          "Chat Controller"
        ],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "Name of the instance",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Update profile status",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": [
                  "status"
                ],
                "properties": {
                  "status": {
                    "type": "string",
                    "description": "New status for profile"
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Ok",
            "content": {}
          }
        }
      }
    },
    "/chat/updateProfilePicture/{instance}": {
      "post": {
        "operationId": "updateProfilePicture",
        "summary": "Update Profile Picture",
        "tags": [
          "Chat Controller"
        ],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "Name instance",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Update profile picture",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": [
                  "picture"
                ],
                "properties": {
                  "picture": {
                    "type": "string",
                    "description": "New spicture URL"
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Ok",
            "content": {}
          }
        }
      }
    },
    "/chat/removeProfilePicture/{instance}": {
      "delete": {
        "operationId": "removeProfilePicture",
        "summary": "Remove Profile Picture",
        "tags": [
          "Chat Controller"
        ],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "Name instance",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Update profile picture",
        "responses": {
          "200": {
            "description": "Ok",
            "content": {}
          }
        }
      }
    },
    "/chat/fetchPrivacySettings/{instance}": {
      "get": {
        "operationId": "fetchPrivacySettings",
        "summary": "Fetch Privacy Settings",
        "tags": [
          "Chat Controller"
        ],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "Name of the instance ",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Fetch privacy settings",
        "responses": {
          "200": {
            "description": "Ok",
            "content": {}
          }
        }
      }
    },
    "/chat/updatePrivacySettings/{instance}": {
      "post": {
        "operationId": "updatePrivacySettings",
        "summary": "Update Privacy Settings",
        "tags": [
          "Chat Controller"
        ],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "Name of the instance ",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Update privacy settings",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": [
                  "readreceipts",
                  "profile",
                  "status",
                  "online",
                  "last",
                  "groupadd"
                ],
                "properties": {
                  "readreceipts": {
                    "type": "string",
                    "enum": [
                      "all",
                      "none"
                    ]
                  },
                  "profile": {
                    "type": "string",
                    "enum": [
                      "all",
                      "contacts",
                      "contact_blacklist",
                      "none"
                    ]
                  },
                  "status": {
                    "type": "string",
                    "enum": [
                      "all",
                      "contacts",
                      "contact_blacklist",
                      "none"
                    ]
                  },
                  "online": {
                    "type": "string",
                    "enum": [
                      "all",
                      "match_last_seen"
                    ]
                  },
                  "last": {
                    "type": "string",
                    "enum": [
                      "all",
                      "contacts",
                      "contact_blacklist",
                      "none"
                    ]
                  },
                  "groupadd": {
                    "type": "string",
                    "enum": [
                      "all",
                      "contacts",
                      "contact_blacklist"
                    ]
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Ok",
            "content": {}
          }
        }
      }
    },
    "/group/create/{instance}": {
      "post": {
        "operationId": "createGroup",
        "summary": "Create Group",
        "tags": [
          "Group Controller"
        ],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "Name of the instance ",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Create group",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": [
                  "subject",
                  "description",
                  "participants"
                ],
                "properties": {
                  "subject": {
                    "type": "object",
                    "description": "Group subject"
                  },
                  "description": {
                    "type": "string",
                    "description": "Group description"
                  },
                  "participants": {
                    "type": "array",
                    "description": "Group members phone numbers with country code",
                    "items": {
                      "type": "string"
                    }
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Ok",
            "content": {}
          }
        }
      }
    },
    "/group/updateGroupPicture/{instance}": {
      "post": {
        "summary": "Update group picture",
        "tags": [
          "Update group picture"
        ],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "Name of the instance ",
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "groupJid",
            "description": "Group remote JID",
            "required": true,
            "in": "query",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Update group picture",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": [
                  "image"
                ],
                "properties": {
                  "image": {
                    "type": "string",
                    "description": "New profile picture image URL"
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Ok",
            "content": {}
          }
        }
      }
    },
    "/group/updateGroupSubject/{instance}": {
      "post": {
        "operationId": "updateGroupSubject",
        "summary": "Update Group Subject",
        "tags": [
          "Group Controller"
        ],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "Name of the instance ",
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "groupJid",
            "description": "Group remote JID",
            "required": true,
            "in": "query",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Update group subject",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": [
                  "subject"
                ],
                "properties": {
                  "subject": {
                    "type": "string",
                    "description": "New group subject"
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Ok",
            "content": {}
          }
        }
      }
    },
    "/group/updateGroupDescription/{instance}": {
      "post": {
        "operationId": "updateGroupDescription",
        "summary": "Update Group Description",
        "tags": [
          "Group Controller"
        ],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "Name of the instance ",
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "groupJid",
            "description": "Group remote JID",
            "required": true,
            "in": "query",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Update group description",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": [
                  "description"
                ],
                "properties": {
                  "description": {
                    "type": "string",
                    "description": "New group description"
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Ok",
            "content": {}
          }
        }
      }
    },
    "/group/inviteCode/{instance}": {
      "get": {
        "operationId": "fetchInviteCode",
        "summary": "Fetch Group Invite Code",
        "tags": [
          "Group Controller"
        ],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "Name of the instance ",
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "groupJid",
            "description": "Group remote JID",
            "required": true,
            "in": "query",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Fetch group invite code",
        "responses": {
          "200": {
            "description": "Ok",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "inviteUrl": {
                      "type": "string",
                      "description": "The URL for the WhatsApp group invite."
                    },
                    "inviteCode": {
                      "type": "string",
                      "description": "The code for the WhatsApp group invite."
                    }
                  },
                  "example": {
                    "inviteUrl": "https://chat.whatsapp.com/DgQvyfXzY01B6rGrpZpYze",
                    "inviteCode": "DgQvyfXzY01B6rGrpZpYze"
                  }
                }
              }
            }
          }
        }
      }
    },
    "/group/acceptInviteCode/{instance}": {
      "get": {
        "operationId": "fetchInviteCode",
        "summary": "Fetch Group Invite Code",
        "tags": [
          "Group Controller"
        ],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "ID of the instance to connect",
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "inviteCode",
            "description": "Group invite code",
            "required": true,
            "in": "query",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Fetch group invite code",
        "responses": {
          "200": {
            "description": "Ok",
            "content": {}
          }
        }
      }
    },
    "/group/revokeInviteCode/{instance}": {
      "post": {
        "operationId": "fetchInviteCode",
        "summary": "Fetch Group Invite Code",
        "tags": [
          "Group Controller"
        ],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "Name of the instance ",
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "groupJid",
            "description": "Group remote JID",
            "required": true,
            "in": "query",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Revoke group invite",
        "responses": {
          "200": {
            "description": "Ok",
            "content": {}
          }
        }
      }
    },
    "/group/sendInvite/{instance}": {
      "post": {
        "operationId": "sendGroupInvite",
        "summary": "Send Group Invite",
        "tags": [
          "Group Controller"
        ],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "Name of the instance ",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Send group invite",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": [
                  "groupJid",
                  "description",
                  "numbers"
                ],
                "properties": {
                  "groupJid": {
                    "type": "string",
                    "description": "Group remote JID"
                  },
                  "description": {
                    "type": "string",
                    "description": "Description to send with the invitation"
                  },
                  "numbers": {
                    "type": "array",
                    "description": "Numbers to receive the invitation",
                    "items": {
                      "type": "string"
                    }
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Ok",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "send": {
                      "type": "boolean",
                      "description": "Indicates if the invite was sent successfully."
                    },
                    "inviteUrl": {
                      "type": "string",
                      "description": "The URL for the WhatsApp group invite."
                    }
                  },
                  "example": {
                    "send": true,
                    "inviteUrl": "https://chat.whatsapp.com/DgQvyfXzY01B6rGrpZpYze"
                  }
                }
              }
            }
          }
        }
      }
    },
    "/group/inviteInfo/{instance}": {
      "get": {
        "operationId": "findGroupByInviteCode",
        "summary": "Find Group By Invite Code",
        "tags": [
          "Group Controller"
        ],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "Name of the instance ",
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "inviteCode",
            "in": "query",
            "description": "Group invite code",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Find group by invite code",
        "responses": {
          "200": {
            "description": "Ok",
            "content": {}
          }
        }
      }
    },
    "/group/findGroupInfos/{instance}": {
      "get": {
        "operationId": "findGroupByJid",
        "summary": "Find Group By Remote JID",
        "tags": [
          "Group Controller"
        ],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "Name of the instance ",
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "groupJid",
            "in": "query",
            "required": true,
            "description": "Group remote JID",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Find group by remote JID",
        "responses": {
          "200": {
            "description": "Ok",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "id": {
                      "type": "string",
                      "description": "The ID of the group."
                    },
                    "subject": {
                      "type": "string",
                      "description": "The subject (name) of the group."
                    },
                    "subjectOwner": {
                      "type": "string",
                      "description": "The ID of the user who set the subject."
                    },
                    "subjectTime": {
                      "type": "integer",
                      "description": "The timestamp when the subject was set."
                    },
                    "pictureUrl": {
                      "type": "string",
                      "description": "URL of the group's profile picture."
                    },
                    "size": {
                      "type": "integer",
                      "description": "The number of participants in the group."
                    },
                    "creation": {
                      "type": "integer",
                      "description": "The timestamp when the group was created."
                    },
                    "owner": {
                      "type": "string",
                      "description": "The ID of the group owner."
                    },
                    "desc": {
                      "type": "string",
                      "description": "The description of the group."
                    },
                    "descId": {
                      "type": "string",
                      "description": "The ID of the description message."
                    },
                    "restrict": {
                      "type": "boolean",
                      "description": "Indicates if the group is restricted (only admins can send messages)."
                    },
                    "announce": {
                      "type": "boolean",
                      "description": "Indicates if the group is an announcement group (only admins can send messages)."
                    },
                    "participants": {
                      "type": "array",
                      "items": {
                        "type": "object",
                        "properties": {
                          "id": {
                            "type": "string",
                            "description": "The ID of the participant."
                          },
                          "admin": {
                            "type": "string",
                            "description": "The role of the participant (e.g., 'admin', 'superadmin')."
                          }
                        }
                      },
                      "description": "List of participants in the group."
                    }
                  },
                  "example": {
                    "id": "120363295648424210@g.us",
                    "subject": "Example Group",
                    "subjectOwner": "553198296801@s.whatsapp.net",
                    "subjectTime": 1714769954,
                    "pictureUrl": null,
                    "size": 1,
                    "creation": 1714769954,
                    "owner": "553198296801@s.whatsapp.net",
                    "desc": "optional",
                    "descId": "BAE57E16498982ED",
                    "restrict": false,
                    "announce": false,
                    "participants": [
                      {
                        "id": "553198296801@s.whatsapp.net",
                        "admin": "superadmin"
                      }
                    ]
                  }
                }
              }
            }
          }
        }
      }
    },
    "/group/fetchAllGroups/{instance}": {
      "get": {
        "operationId": "fetchAllGroups",
        "summary": "Fetch All Groups",
        "tags": [
          "Group Controller"
        ],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "Name of the instance ",
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "getParticipants",
            "in": "query",
            "required": true,
            "description": "Whether to get the group members or not",
            "schema": {
              "type": "boolean"
            }
          }
        ],
        "description": "Fetch all groups",
        "responses": {
          "200": {
            "description": "Ok",
            "content": {
              "application/json": {
                "schema": {
                  "type": "array",
                  "items": {
                    "type": "object",
                    "properties": {
                      "id": {
                        "type": "string",
                        "description": "The ID of the group."
                      },
                      "subject": {
                        "type": "string",
                        "description": "The subject (name) of the group."
                      },
                      "subjectOwner": {
                        "type": "string",
                        "description": "The ID of the user who set the subject."
                      },
                      "subjectTime": {
                        "type": "integer",
                        "description": "The timestamp when the subject was set."
                      },
                      "pictureUrl": {
                        "type": "string",
                        "description": "URL of the group's profile picture."
                      },
                      "size": {
                        "type": "integer",
                        "description": "The number of participants in the group."
                      },
                      "creation": {
                        "type": "integer",
                        "description": "The timestamp when the group was created."
                      },
                      "owner": {
                        "type": "string",
                        "description": "The ID of the group owner."
                      },
                      "desc": {
                        "type": "string",
                        "description": "The description of the group."
                      },
                      "descId": {
                        "type": "string",
                        "description": "The ID of the description message."
                      },
                      "restrict": {
                        "type": "boolean",
                        "description": "Indicates if the group is restricted (only admins can send messages)."
                      },
                      "announce": {
                        "type": "boolean",
                        "description": "Indicates if the group is an announcement group (only admins can send messages)."
                      }
                    },
                    "required": [
                      "id",
                      "subject",
                      "subjectOwner",
                      "subjectTime",
                      "size",
                      "creation",
                      "owner",
                      "restrict",
                      "announce"
                    ]
                  },
                  "description": "Array of objects representing WhatsApp group details.",
                  "example": [
                    {
                      "id": "120363295648424210@g.us",
                      "subject": "Example Group",
                      "subjectOwner": "553198296801@s.whatsapp.net",
                      "subjectTime": 1714769954,
                      "pictureUrl": null,
                      "size": 1,
                      "creation": 1714769954,
                      "owner": "553198296801@s.whatsapp.net",
                      "desc": "optional",
                      "descId": "BAE57E16498982ED",
                      "restrict": false,
                      "announce": false
                    }
                  ]
                }
              }
            }
          }
        }
      }
    },
    "/group/participants/{instance}": {
      "get": {
        "operationId": "fetchAllGroupMembers",
        "summary": "Fetch All Group Members",
        "tags": [
          "Group Controller"
        ],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "Name of the instance ",
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "groupJid",
            "in": "query",
            "required": true,
            "description": "Group remote JID",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Fetch all group members",
        "responses": {
          "200": {
            "description": "Ok",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "participants": {
                      "type": "array",
                      "items": {
                        "type": "object",
                        "properties": {
                          "id": {
                            "type": "string",
                            "description": "The ID of the participant."
                          },
                          "admin": {
                            "type": "string",
                            "description": "The role of the participant (e.g., 'admin', 'superadmin')."
                          }
                        },
                        "required": [
                          "id"
                        ]
                      },
                      "description": "List of participants in the group."
                    }
                  },
                  "example": {
                    "participants": [
                      {
                        "id": "553198296801@s.whatsapp.net",
                        "admin": "superadmin"
                      }
                    ]
                  }
                }
              }
            }
          }
        }
      }
    },
    "/group/updateParticipant/{instance}": {
      "post": {
        "operationId": "updateParticipant",
        "summary": "Update Group Members",
        "tags": [
          "Group Controller"
        ],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "Name of the instance ",
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "groupJid",
            "in": "query",
            "required": true,
            "description": "Group remote JID",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Update group members",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "action": {
                    "type": "string",
                    "enum": [
                      "add",
                      "remove",
                      "promote",
                      "demote"
                    ]
                  },
                  "participants": {
                    "type": "array",
                    "description": "Group members phone numbers with country code",
                    "items": {
                      "type": "string"
                    }
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Ok",
            "content": {}
          }
        }
      }
    },
    "/group/updateSetting/{instance}": {
      "post": {
        "operationId": "updateSetting",
        "summary": "Update Group Settings",
        "tags": [
          "Group Controller"
        ],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "Name of the instance ",
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "groupJid",
            "in": "query",
            "required": true,
            "description": "Group remote JID",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Update group settings",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "action": {
                    "type": "string",
                    "description": "Group setting (`announcement` = only admins can send messages; `not_announcement` = everyone can send messages; `locked` = only admins can edit group settings; `unlocked` = everyone can edit group settings",
                    "enum": [
                      "announcement",
                      "not_announcement",
                      "locked",
                      "unlocked"
                    ]
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Ok",
            "content": {}
          }
        }
      }
    },
    "/group/toggleEphemeral/{instance}": {
      "post": {
        "operationId": "toggleEphemeral",
        "summary": "Toggle Ephemeral Group Messages",
        "tags": [
          "Group Controller"
        ],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "Name of the instance ",
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "groupJid",
            "in": "query",
            "required": true,
            "description": "Group remote JID",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Toggle temporary messages on group",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": [
                  "expiration"
                ],
                "properties": {
                  "expiration": {
                    "type": "integer",
                    "description": "Time to expire message (in seconds)"
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Ok",
            "content": {}
          }
        }
      }
    },
    "/group/leaveGroup/{instance}": {
      "delete": {
        "operationId": "leaveGroup",
        "summary": "Leave Group",
        "tags": [
          "Group Controller"
        ],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "Name of the instance ",
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "groupJid",
            "in": "query",
            "required": true,
            "description": "Group remote JID",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Leave group",
        "responses": {
          "200": {
            "description": "Ok",
            "content": {}
          }
        }
      }
    },
    "/typebot/create/{instance}": {
      "post": {
        "operationId": "setTypebot",
        "summary": "Create Typebot",
        "tags": [
          "Typebot Controller"
        ],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "Name of the instance",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Set typebot",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": [
                  "enabled",
                  "url",
                  "typebot",
                  "triggerType",
                  "triggerOperator",
                  "triggerValue",
                  "expire",
                  "keywordFinish",
                  "delayMessage",
                  "unknownMessage",
                  "listeningFromMe",
                  "stopBotFromMe",
                  "keepOpen",
                  "debounceTime"
                ],
                "properties": {
                  "enabled": {
                    "type": "boolean"
                  },
                  "url": {
                    "type": "string",
                    "description": "Typebot URL"
                  },
                  "typebot": {
                    "type": "string",
                    "description": "Typebot name"
                  },
                  "triggerType": {
                    "type": "string",
                    "description": "All or keyword"
                  },
                  "triggerOperator": {
                    "type": "string",
                    "description": "Operator logic, ex: contains, equals, startsWith, endsWith, regex"
                  },
                  "triggerValue": {
                    "type": "string",
                    "description": "All or keyword"
                  },
                  "expire": {
                    "type": "number",
                    "description": "Time to expire session"
                  },
                  "keywordFinish": {
                    "type": "string",
                    "description": "Keyword to finish session"
                  },
                  "delayMessage": {
                    "type": "number",
                    "description": "Delay when the bot send message"
                  },
                  "unknownMessage": {
                    "type": "string",
                    "description": "Unrecognized message"
                  },
                  "listeningFromMe": {
                    "type": "boolean",
                    "description": "Marked as viewed"
                  },
                  "stopBotFromMe": {
                    "type": "boolean",
                    "description": "Stop bot when I send message"
                  },
                  "keepOpen": {
                    "type": "boolean",
                    "description": "Keep session open"
                  },
                  "debounceTime": {
                    "type": "number",
                    "description": "Start typebot for your own messages"
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Ok",
            "content": {}
          }
        }
      }
    },
    "/typebot/start/{instance}": {
      "post": {
        "operationId": "startTypebot",
        "summary": "Start Typebot",
        "tags": [
          "Typebot Controller"
        ],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "Name of the instance",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Start typebot",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "url": {
                    "type": "string",
                    "description": "Typebot URL"
                  },
                  "typebot": {
                    "type": "string",
                    "description": "Typebot name"
                  },
                  "remoteJid": {
                    "type": "string",
                    "description": "Receiver remote JID"
                  },
                  "startSession": {
                    "type": "boolean",
                    "description": "Start a new session"
                  },
                  "variables": {
                    "type": "array",
                    "items": {
                      "type": "object",
                      "properties": {
                        "name": {
                          "type": "string",
                          "description": "Variable name"
                        },
                        "value": {
                          "type": "string",
                          "description": "Variable value"
                        }
                      }
                    }
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Ok",
            "content": {}
          }
        }
      }
    },
    "/typebot/changeStatus/{instance}": {
      "post": {
        "operationId": "startTypebot",
        "summary": "Change Session Status",
        "tags": [
          "Typebot Controller"
        ],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "Name of the instance",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Change status session",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "remoteJid": {
                    "type": "string",
                    "description": "{{remoteJid}}"
                  },
                  "status": {
                    "type": "string",
                    "description": "Typebot status, types: opened, paused, closed"
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Ok",
            "content": {}
          }
        }
      }
    },
    "/typebot/settings/{instance}": {
      "post": {
        "operationId": "startTypebot",
        "summary": "Change Session Status",
        "tags": [
          "Typebot Controller"
        ],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "Name of the instance",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Set settings typebot",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": [
                  "expire",
                  "keywordFinish",
                  "delayMessage",
                  "unknownMessage",
                  "listeningFromMe",
                  "stopBotFromMe",
                  "keepOpen",
                  "debounceTime",
                  "ignoreJids",
                  "typebotIdFallback"
                ],
                "properties": {
                  "expire": {
                    "type": "string",
                    "description": "Time to expire session bot"
                  },
                  "keywordFinish": {
                    "type": "string",
                    "description": "Keyword to finished session"
                  },
                  "delayMessage": {
                    "type": "string",
                    "description": "Delay when the bot send message"
                  },
                  "unknownMessage": {
                    "type": "string",
                    "description": "Unrecognized message"
                  },
                  "listeningFromMe": {
                    "type": "string",
                    "description": ""
                  },
                  "stopBotFromMe": {
                    "type": "string",
                    "description": "Stop bot when I send message"
                  },
                  "keepOpen": {
                    "type": "string",
                    "description": "Keep session open"
                  },
                  "debounceTime": {
                    "type": "string",
                    "description": "Time "
                  },
                  "ignoreJids": {
                    "type": "string",
                    "description": "Jids ignore from bot"
                  },
                  "typebotIdFallback": {
                    "type": "string",
                    "description": "Id fallback"
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Ok",
            "content": {}
          }
        }
      }
    },
    "/typebot/fetchSettings/{instance}": {
      "get": {
        "operationId": "findTypebot",
        "summary": "Find Typebot",
        "tags": [
          "Typebot Controller"
        ],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "Name of the instance",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Find typebot settings",
        "responses": {
          "200": {
            "description": "Ok",
            "content": {}
          }
        }
      }
    },
    "/typebot/find/{instance}": {
      "get": {
        "operationId": "findTypebot",
        "summary": "Find Typebot",
        "tags": [
          "Typebot Controller"
        ],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "Name of the instance",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Find typebot",
        "responses": {
          "200": {
            "description": "Ok",
            "content": {}
          }
        }
      }
    },
    "/typebot/fetch/:typebotId/{instance}": {
      "get": {
        "operationId": "findTypebot",
        "summary": "Find Typebot",
        "tags": [
          "Typebot Controller"
        ],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "Name of the instance",
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "typebotId",
            "in": "path",
            "required": true,
            "description": "ID of the typebot",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Find typebot",
        "responses": {
          "200": {
            "description": "Ok",
            "content": {}
          }
        }
      }
    },
    "/typebot/fetchSessions/:typebotId/{instance}": {
      "get": {
        "operationId": "findTypebot",
        "summary": "Find session typebot",
        "tags": [
          "Typebot Controller"
        ],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "Name of the instance",
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "typebotId",
            "in": "path",
            "required": true,
            "description": "ID of the typebot",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Find session typebot",
        "responses": {
          "200": {
            "description": "Ok",
            "content": {}
          }
        }
      }
    },
    "/typebot/update/:typebotId/{instance}": {
      "post": {
        "operationId": "changeTypebotStatus",
        "summary": "Change Typebot Status",
        "tags": [
          "Typebot Controller"
        ],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "Name of the instance",
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "typebotId",
            "in": "path",
            "required": true,
            "description": "ID of the typebot",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Start typebot",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": [
                  "enabled",
                  "url",
                  "typebot",
                  "expire",
                  "keywordFinish",
                  "delayMessage",
                  "unknownMessage",
                  "listeningFromMe",
                  "stopBotFromMe",
                  "keepOpen",
                  "debounceTime",
                  "triggerType",
                  "triggerOperator",
                  "triggerValue"
                ],
                "properties": {
                  "enabled": {
                    "type": "boolean",
                    "description": "Enable typebot"
                  },
                  "url": {
                    "type": "string",
                    "description": "Url of typebot"
                  },
                  "typebot": {
                    "type": "string",
                    "description": "Nmae typebot"
                  },
                  "expire": {
                    "type": "number",
                    "description": "Time to expire session"
                  },
                  "keywordFinish": {
                    "type": "string",
                    "description": "Keyword to finished session"
                  },
                  "delayMessage": {
                    "type": "number",
                    "description": "Delay when the bot send message"
                  },
                  "unknownMessage": {
                    "type": "string",
                    "description": "Unrecognized message"
                  },
                  "listeningFromMe": {
                    "type": "boolean",
                    "description": "Listening message for me"
                  },
                  "stopBotFromMe": {
                    "type": "boolean",
                    "description": "Stop bot when I send message"
                  },
                  "keepOpen": {
                    "type": "boolean",
                    "description": "Keep session open"
                  },
                  "debounceTime": {
                    "type": "number",
                    "description": "The timestamp of the message."
                  },
                  "triggerType": {
                    "type": "string",
                    "description": "All or keyword"
                  },
                  "triggerOperator": {
                    "type": "string",
                    "description": "Operator logic, ex: contains, equals, startsWith, endsWith, regex"
                  },
                  "triggerValue": {
                    "type": "string",
                    "description": "Ex: evolution"
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Ok",
            "content": {}
          }
        }
      }
    },
    "/typebot/delete/:typebotId/{instance}": {
      "delete": {
        "operationId": "changeTypebotStatus",
        "summary": "Delete Status",
        "tags": [
          "Typebot Controller"
        ],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "Name of the instance",
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "typebotId",
            "in": "path",
            "required": true,
            "description": "ID of the typebot",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Delete typebot",
        "responses": {
          "200": {
            "description": "Ok",
            "content": {}
          }
        }
      }
    },
    "/chatwoot/set/{instance}": {
      "post": {
        "operationId": "setChatwoot",
        "summary": "Set Chatwoot",
        "tags": [
          "Chatwoot Controller"
        ],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "Name of the instance",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Set Chatwoot",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": [
                  "enabled",
                  "accountId",
                  "token",
                  "url",
                  "signMsg",
                  "reopenConversation",
                  "conversationPending",
                  "nameInbox",
                  "mergeBrazilContacts",
                  "importContacts",
                  "importMessages",
                  "daysLimitImportMessages",
                  "signDelimiter",
                  "autoCreate",
                  "organization",
                  "logo",
                  "ignoreJids"
                ],
                "properties": {
                  "enabled": {
                    "type": "boolean",
                    "description": "Enable chatwoot"
                  },
                  "accountId": {
                    "type": "string",
                    "description": "Chatwoot account ID"
                  },
                  "token": {
                    "type": "string",
                    "description": "Chatwoot token"
                  },
                  "url": {
                    "type": "string",
                    "description": "Chatwoot server URL"
                  },
                  "signMsg": {
                    "type": "boolean",
                    "description": "Sign message with user name"
                  },
                  "reopenConversation": {
                    "type": "boolean",
                    "description": ""
                  },
                  "conversationPending": {
                    "type": "boolean"
                  },
                  "nameInbox": {
                    "type": "string",
                    "description": "Name inbox chatwoot"
                  },
                  "mergeBrazilContacts": {
                    "type": "boolean"
                  },
                  "importContacts": {
                    "type": "boolean",
                    "description": "Import Chatwoot contacts"
                  },
                  "importMessages": {
                    "type": "boolean",
                    "description": "Import chatwoot messages"
                  },
                  "daysLimitImportMessages": {
                    "type": "integer"
                  },
                  "signDelimiter": {
                    "type": "string",
                    "description": "Break line"
                  },
                  "autoCreate": {
                    "type": "boolean"
                  },
                  "organization": {
                    "type": "string",
                    "description": "Name organization"
                  },
                  "logo": {
                    "type": "string",
                    "description": "Url logo"
                  },
                  "ignoreJids": {
                    "type": "array",
                    "items": {
                      "type": "string",
                      "description": "Jids ignore"
                    }
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Ok",
            "content": {}
          }
        }
      }
    },
    "/chatwoot/find/{instance}": {
      "get": {
        "operationId": "findChatwoot",
        "summary": "Find Chatwoot",
        "tags": [
          "Chatwoot Controller"
        ],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "Name of the instance",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Find Chatwoot",
        "responses": {
          "200": {
            "description": "Ok",
            "content": {}
          }
        }
      }
    },
    "/sqs/set/{instance}": {
      "post": {
        "operationId": "setSQS",
        "summary": "Set SQS",
        "tags": [
          "SQS Controller"
        ],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "Name of the instance",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Set SQS",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": [
                  "sqs"
                ],
                "properties": {
                  "sqs": {
                    "type": "object",
                    "properties": {
                      "enabled": {
                        "type": "boolean"
                      },
                      "events": {
                        "type": "array",
                        "items": {
                          "type": "string",
                          "enum": [
                            "APPLICATION_STARTUP",
                            "QRCODE_UPDATED",
                            "MESSAGES_SET",
                            "MESSAGES_UPSERT",
                            "MESSAGES_UPDATE",
                            "MESSAGES_DELETE",
                            "SEND_MESSAGE",
                            "CONTACTS_SET",
                            "CONTACTS_UPSERT",
                            "CONTACTS_UPDATE",
                            "PRESENCE_UPDATE",
                            "CHATS_SET",
                            "CHATS_UPSERT",
                            "CHATS_UPDATE",
                            "CHATS_DELETE",
                            "GROUPS_UPSERT",
                            "GROUP_UPDATE",
                            "GROUP_PARTICIPANTS_UPDATE",
                            "CONNECTION_UPDATE",
                            "LABELS_EDIT",
                            "LABELS_ASSOCIATION",
                            "CALL",
                            "TYPEBOT_START",
                            "TYPEBOT_CHANGE_STATUS"
                          ]
                        },
                        "description": "Events to be sent to the Webhook"
                      }
                    }
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Ok",
            "content": {}
          }
        }
      }
    },
    "/sqs/find/{instance}": {
      "get": {
        "operationId": "findSQS",
        "summary": "Find SQS",
        "tags": [
          "SQS Controller"
        ],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "Name of the instance",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Find SQS",
        "responses": {
          "200": {
            "description": "Ok",
            "content": {}
          }
        }
      }
    },
    "/rabbitmq/set/{instance}": {
      "post": {
        "operationId": "setRabbitMQ",
        "summary": "Set RabbitMQ",
        "tags": [
          "RabbitMQ Controller"
        ],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "Name of the instance",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Set RabbitMQ",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": [
                  "rabbitmq"
                ],
                "properties": {
                  "rabbitmq": {
                    "type": "object",
                    "properties": {
                      "enabled": {
                        "type": "boolean"
                      },
                      "events": {
                        "type": "array",
                        "items": {
                          "type": "string",
                          "enum": [
                            "APPLICATION_STARTUP",
                            "QRCODE_UPDATED",
                            "MESSAGES_SET",
                            "MESSAGES_UPSERT",
                            "MESSAGES_UPDATE",
                            "MESSAGES_DELETE",
                            "SEND_MESSAGE",
                            "CONTACTS_SET",
                            "CONTACTS_UPSERT",
                            "CONTACTS_UPDATE",
                            "PRESENCE_UPDATE",
                            "CHATS_SET",
                            "CHATS_UPSERT",
                            "CHATS_UPDATE",
                            "CHATS_DELETE",
                            "GROUPS_UPSERT",
                            "GROUP_UPDATE",
                            "GROUP_PARTICIPANTS_UPDATE",
                            "CONNECTION_UPDATE",
                            "LABELS_EDIT",
                            "LABELS_ASSOCIATION",
                            "CALL",
                            "TYPEBOT_START",
                            "TYPEBOT_CHANGE_STATUS"
                          ]
                        },
                        "description": "Events to be sent to the Webhook"
                      }
                    }
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Ok",
            "content": {}
          }
        }
      }
    },
    "/rabbitmq/find/{instance}": {
      "get": {
        "operationId": "findRabbitMQ",
        "summary": "Find RabbitMQ",
        "tags": [
          "RabbitMQ Controller"
        ],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "Name of the instance",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Find RabbitMQ",
        "responses": {
          "200": {
            "description": "Ok",
            "content": {}
          }
        }
      }
    },
    "/websocket/set/{instance}": {
      "post": {
        "operationId": "setWebsocket",
        "summary": "Set Websocket",
        "tags": [
          "Websocket Controller"
        ],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "Name of the instance",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Set Websocket",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": [
                  "websocket"
                ],
                "properties": {
                  "websocket": {
                    "type": "object",
                    "properties": {
                      "enabled": {
                        "type": "boolean"
                      },
                      "events": {
                        "type": "array",
                        "items": {
                          "type": "string",
                          "enum": [
                            "APPLICATION_STARTUP",
                            "QRCODE_UPDATED",
                            "MESSAGES_SET",
                            "MESSAGES_UPSERT",
                            "MESSAGES_UPDATE",
                            "MESSAGES_DELETE",
                            "SEND_MESSAGE",
                            "CONTACTS_SET",
                            "CONTACTS_UPSERT",
                            "CONTACTS_UPDATE",
                            "PRESENCE_UPDATE",
                            "CHATS_SET",
                            "CHATS_UPSERT",
                            "CHATS_UPDATE",
                            "CHATS_DELETE",
                            "GROUPS_UPSERT",
                            "GROUP_UPDATE",
                            "GROUP_PARTICIPANTS_UPDATE",
                            "CONNECTION_UPDATE",
                            "LABELS_EDIT",
                            "LABELS_ASSOCIATION",
                            "CALL",
                            "TYPEBOT_START",
                            "TYPEBOT_CHANGE_STATUS"
                          ]
                        },
                        "description": "Events to be sent to the websocket"
                      }
                    }
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Ok",
            "content": {}
          }
        }
      }
    },
    "/websocket/find/{instance}": {
      "get": {
        "operationId": "findWebsocket",
        "summary": "Find Websocket",
        "tags": [
          "Websocket Controller"
        ],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "Name of the instance",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Find Websocket",
        "responses": {
          "200": {
            "description": "Ok",
            "content": {}
          }
        }
      }
    },
    "/openai/create/{instance}": {
      "post": {
        "operationId": "createBotOpenAI",
        "summary": "Create OpenAI",
        "tags": [
          "OpenIA Controller"
        ],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "Name of the instance",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Create an OpenAI bot with detailed configuration",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": [
                  "enabled",
                  "openaiCredsId",
                  "botType",
                  "assistantId",
                  "functionUrl",
                  "model",
                  "systemMessages",
                  "assistantMessages",
                  "userMessages",
                  "maxTokens",
                  "triggerType",
                  "triggerOperator",
                  "triggerValue",
                  "expire",
                  "keywordFinish",
                  "delayMessage",
                  "unknownMessage",
                  "listeningFromMe",
                  "stopBotFromMe",
                  "keepOpen",
                  "debounceTime",
                  "ignoreJids"
                ],
                "properties": {
                  "enabled": {
                    "type": "boolean",
                    "description": "Indicates whether the bot is enabled"
                  },
                  "openaiCredsId": {
                    "type": "string",
                    "description": "ID of the OpenAI credentials"
                  },
                  "botType": {
                    "type": "string",
                    "description": "Type of the bot (e.g., 'assistant')"
                  },
                  "assistantId": {
                    "type": "string",
                    "description": "Unique identifier for the assistant"
                  },
                  "functionUrl": {
                    "type": "string",
                    "description": "URL for additional bot functionality"
                  },
                  "model": {
                    "type": "string",
                    "description": "Model to be used (e.g., 'gpt-4o')"
                  },
                  "systemMessages": {
                    "type": "array",
                    "items": {
                      "type": "string"
                    },
                    "description": "Messages to define system behavior"
                  },
                  "assistantMessages": {
                    "type": "array",
                    "items": {
                      "type": "string"
                    },
                    "description": "Predefined assistant messages"
                  },
                  "userMessages": {
                    "type": "array",
                    "items": {
                      "type": "string"
                    },
                    "description": "Predefined user messages"
                  },
                  "maxTokens": {
                    "type": "integer",
                    "description": "Maximum number of tokens per interaction"
                  },
                  "triggerType": {
                    "type": "string",
                    "description": "Type of trigger for the bot"
                  },
                  "triggerOperator": {
                    "type": "string",
                    "description": "Operator for trigger evaluation"
                  },
                  "triggerValue": {
                    "type": "string",
                    "description": "Value to trigger the bot"
                  },
                  "expire": {
                    "type": "integer",
                    "description": "Expiration time in seconds"
                  },
                  "keywordFinish": {
                    "type": "string",
                    "description": "Keyword to terminate the bot interaction"
                  },
                  "delayMessage": {
                    "type": "integer",
                    "description": "Delay before the bot responds, in milliseconds"
                  },
                  "unknownMessage": {
                    "type": "string",
                    "description": "Message to display for unrecognized input"
                  },
                  "listeningFromMe": {
                    "type": "boolean",
                    "description": "Indicates if the bot listens to messages from the user"
                  },
                  "stopBotFromMe": {
                    "type": "boolean",
                    "description": "Indicates if the bot can be stopped by the user"
                  },
                  "keepOpen": {
                    "type": "boolean",
                    "description": "Indicates if the bot session remains open"
                  },
                  "debounceTime": {
                    "type": "integer",
                    "description": "Debounce time for message processing"
                  },
                  "ignoreJids": {
                    "type": "array",
                    "items": {
                      "type": "string"
                    },
                    "description": "List of JIDs to ignore"
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Ok",
            "content": {}
          }
        }
      }
    },
    "/openai/find/{instance}": {
      "get": {
        "operationId": "findBotOpenAI",
        "summary": "Find OpenAI Bots",
        "tags": [
          "OpenIA Controller"
        ],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "Name of the instance",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Get OpenAI bot with detailed configuration",
        "responses": {
          "200": {
            "description": "Ok",
            "content": {}
          }
        }
      }
    },
    "/openai/find/:openaiBotId/{instance}": {
      "get": {
        "operationId": "findBotOpenAI",
        "summary": "Find OpenAI Bot",
        "tags": [
          "OpenIA Controller"
        ],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "Name of the instance",
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "openaiBotId",
            "in": "path",
            "required": true,
            "description": "ID of the bot",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Get OpenAI bot with detailed configuration",
        "responses": {
          "200": {
            "description": "Ok",
            "content": {}
          }
        }
      }
    },
    "/openai/delete/:openaiBotId/{instance}": {
      "delete": {
        "operationId": "deleteBotOpenAI",
        "summary": "Delete OpenAI Bot",
        "tags": [
          "OpenIA Controller"
        ],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "Name of the instance",
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "openaiBotId",
            "in": "path",
            "required": true,
            "description": "ID of the bot",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Delete bot OpenAi",
        "responses": {
          "200": {
            "description": "Ok",
            "content": {}
          }
        }
      }
    },
    "/openai/update/:openaiBotId/{instance}": {
      "put": {
        "operationId": "updateBotOpenAI",
        "summary": "Update OpenAI Bot",
        "tags": [
          "OpenIA Controller"
        ],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "Name of the instance",
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "openaiBotId",
            "in": "path",
            "required": true,
            "description": "ID of the bot",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Update OpenAI bot with detailed configuration",
        "requestBody": {
          "description": "Configuration for the OpenAI bot instance",
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "enabled": {
                    "type": "boolean",
                    "description": "Indicates if the bot is enabled"
                  },
                  "openaiCredsId": {
                    "type": "string",
                    "description": "The OpenAI credentials ID"
                  },
                  "botType": {
                    "type": "string",
                    "enum": [
                      "assistant",
                      "chatCompletion"
                    ],
                    "description": "The type of bot (either 'assistant' or 'chatCompletion')"
                  },
                  "assistantId": {
                    "type": "string",
                    "description": "The ID of the assistant (only if 'botType' is 'assistant')"
                  },
                  "functionUrl": {
                    "type": "string",
                    "description": "The function URL that the bot will call"
                  },
                  "model": {
                    "type": "string",
                    "description": "The OpenAI model to use for chat completion (e.g., 'gpt-4o')"
                  },
                  "systemMessages": {
                    "type": "array",
                    "items": {
                      "type": "string"
                    },
                    "description": "The system messages to define the assistant behavior"
                  },
                  "assistantMessages": {
                    "type": "array",
                    "items": {
                      "type": "string"
                    },
                    "description": "Messages to be sent by the assistant"
                  },
                  "userMessages": {
                    "type": "array",
                    "items": {
                      "type": "string"
                    },
                    "description": "Messages sent by the user"
                  },
                  "maxTokens": {
                    "type": "integer",
                    "description": "Maximum number of tokens for the bot's responses"
                  },
                  "triggerType": {
                    "type": "string",
                    "enum": [
                      "all",
                      "keyword"
                    ],
                    "description": "The trigger type for the bot (e.g., 'keyword' or 'all')"
                  },
                  "triggerOperator": {
                    "type": "string",
                    "enum": [
                      "equals",
                      "contains",
                      "startsWith",
                      "endsWith",
                      "regex",
                      "none"
                    ],
                    "description": "The operator to match the trigger type"
                  },
                  "triggerValue": {
                    "type": "string",
                    "description": "The value that triggers the bot (e.g., 'teste')"
                  },
                  "expire": {
                    "type": "integer",
                    "description": "The expiration time of the bot instance in minutes"
                  },
                  "keywordFinish": {
                    "type": "string",
                    "description": "Keyword to end the bot interaction"
                  },
                  "delayMessage": {
                    "type": "integer",
                    "description": "Time in milliseconds to delay the message"
                  },
                  "unknownMessage": {
                    "type": "string",
                    "description": "Message to send if the bot doesn't recognize the input"
                  },
                  "listeningFromMe": {
                    "type": "boolean",
                    "description": "Indicates if the bot should listen for messages from the user"
                  },
                  "stopBotFromMe": {
                    "type": "boolean",
                    "description": "Indicates if the bot can be stopped by the user"
                  },
                  "keepOpen": {
                    "type": "boolean",
                    "description": "Indicates if the bot session should remain open"
                  },
                  "debounceTime": {
                    "type": "integer",
                    "description": "Time in milliseconds for the debounce delay"
                  },
                  "ignoreJids": {
                    "type": "array",
                    "items": {
                      "type": "string"
                    },
                    "description": "List of JIDs to ignore"
                  }
                },
                "required": [
                  "enabled",
                  "openaiCredsId",
                  "botType",
                  "model"
                ]
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Ok",
            "content": {}
          }
        }
      }
    },
    "/openai/creds/{instance}": {
      "post": {
        "operationId": "credsBotOpenAI",
        "summary": "Creds OpenAI Bot",
        "tags": [
          "OpenIA Controller"
        ],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "Name of the instance",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Creds openia bot configuration",
        "requestBody": {
          "description": "Configuration for the OpenAI bot instance",
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "apiKey": {
                    "type": "string",
                    "description": ""
                  },
                  "name": {
                    "type": "string",
                    "description": ""
                  }
                },
                "required": [
                  "apiKey",
                  "name"
                ]
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Ok",
            "content": {}
          }
        }
      },
      "get": {
        "operationId": "getBotOpenAICreds",
        "summary": "Find OpenAI Creds",
        "tags": [
          "OpenIA Controller"
        ],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "Name of the instance",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Get OpenAI Creds",
        "responses": {
          "200": {
            "description": "Ok",
            "content": {}
          }
        }
      }
    },
    "/openai/creds/:openaiCredsId/{instance}": {
      "delete": {
        "operationId": "deleteCredsOpenAI",
        "summary": "Delete OpenAI Creds",
        "tags": [
          "OpenIA Controller"
        ],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "Name of the instance",
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "openaiCredsId",
            "in": "path",
            "required": true,
            "description": "ID of the creds",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Delete bot OpenAi",
        "responses": {
          "200": {
            "description": "Ok",
            "content": {}
          }
        }
      }
    },
    "/openai/settings/{instance}": {
      "post": {
        "operationId": "setOpenAISettings",
        "summary": "Set OpenAI Bot Settings",
        "tags": [
          "OpenAI Controller"
        ],
        "description": "Set settings for an OpenAI bot instance.",
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "Name of the instance",
            "schema": {
              "type": "string"
            }
          }
        ],
        "requestBody": {
          "description": "Configuration for updating the OpenAI bot settings",
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "openaiCredsId": {
                    "type": "string",
                    "description": "The OpenAI credentials ID"
                  },
                  "expire": {
                    "type": "integer",
                    "description": "Expiration time in seconds"
                  },
                  "keywordFinish": {
                    "type": "string",
                    "description": "Keyword to finish the interaction"
                  },
                  "delayMessage": {
                    "type": "integer",
                    "description": "Delay time for the message in milliseconds"
                  },
                  "unknownMessage": {
                    "type": "string",
                    "description": "Message when the input is not recognized"
                  },
                  "listeningFromMe": {
                    "type": "boolean",
                    "description": "Indicates if the bot is listening for commands from the user"
                  },
                  "stopBotFromMe": {
                    "type": "boolean",
                    "description": "Indicates if the bot should stop upon user command"
                  },
                  "keepOpen": {
                    "type": "boolean",
                    "description": "Indicates if the bot session should remain open"
                  },
                  "debounceTime": {
                    "type": "integer",
                    "description": "Time in milliseconds to wait before processing the next input"
                  },
                  "ignoreJids": {
                    "type": "array",
                    "items": {
                      "type": "string"
                    },
                    "description": "List of JIDs (Jabber IDs) to ignore"
                  },
                  "openaiIdFallback": {
                    "type": "string",
                    "description": "Fallback OpenAI credentials ID if the main one fails"
                  }
                },
                "required": [
                  "openaiCredsId",
                  "expire",
                  "keywordFinish",
                  "delayMessage",
                  "unknownMessage",
                  "listeningFromMe",
                  "stopBotFromMe",
                  "keepOpen",
                  "debounceTime",
                  "ignoreJids",
                  "openaiIdFallback"
                ]
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Successfully updated OpenAI bot settings",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "success": {
                      "type": "boolean",
                      "description": "Indicates if the update was successful"
                    },
                    "message": {
                      "type": "string",
                      "description": "Details about the operation"
                    }
                  }
                }
              }
            }
          },
          "400": {
            "description": "Bad Request - Invalid input parameters"
          },
          "500": {
            "description": "Internal Server Error"
          }
        }
      }
    },
    "/openai/fetchSettings/{instance}": {
      "get": {
        "operationId": "findSettingsOpenAI",
        "summary": "Find OpenAI Settings",
        "tags": [
          "OpenIA Controller"
        ],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "Name of the instance",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Find settings OpenAi",
        "responses": {
          "200": {
            "description": "Ok",
            "content": {}
          }
        }
      }
    },
    "/openai/changeStatus/{instance}": {
      "post": {
        "operationId": "changeOpenAIStatus",
        "summary": "Change OpenAI Bot Status",
        "tags": [
          "OpenAI Controller"
        ],
        "description": "Changes the status of the OpenAI bot instance.",
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "Name of the instance",
            "schema": {
              "type": "string"
            }
          }
        ],
        "requestBody": {
          "description": "Body for changing the status of the OpenAI bot",
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "remoteJid": {
                    "type": "string",
                    "description": "The JID (Jabber ID) of the remote contact"
                  },
                  "status": {
                    "type": "string",
                    "enum": [
                      "opened",
                      "paused",
                      "closed"
                    ],
                    "description": "Status of the bot instance. Possible values: 'opened', 'paused', 'closed'"
                  }
                },
                "required": [
                  "remoteJid",
                  "status"
                ]
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Successfully changed the bot status",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "success": {
                      "type": "boolean",
                      "description": "Indicates if the status change was successful"
                    },
                    "message": {
                      "type": "string",
                      "description": "Details about the status change operation"
                    }
                  }
                }
              }
            }
          },
          "400": {
            "description": "Bad Request - Invalid input parameters"
          },
          "500": {
            "description": "Internal Server Error"
          }
        }
      }
    },
    "/openai/fetchSessions/:openaiBotId/{instance}": {
      "get": {
        "operationId": "fetchSessions",
        "summary": "Fetch sessions of the OpenAI bot instance",
        "tags": [
          "OpenAI Controller"
        ],
        "description": "Fetches the sessions of the specified OpenAI bot instance.",
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "openaiBotId",
            "in": "path",
            "required": true,
            "description": "ID of the OpenAI bot",
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "Name of the instance",
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successfully fetched sessions",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "message": {
                      "type": "string",
                      "example": "OK"
                    }
                  }
                }
              }
            }
          },
          "400": {
            "description": "Bad Request - Invalid parameters"
          },
          "404": {
            "description": "Not Found - No sessions found for the given bot and instance"
          },
          "500": {
            "description": "Internal Server Error"
          }
        }
      }
    },
    "/dify/create/{instance}": {
      "post": {
        "operationId": "createDifyBot",
        "summary": "Create a new Dify bot instance",
        "tags": [
          "Dify Controller"
        ],
        "description": "Creates a new Dify bot with the provided configuration",
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "Name of the instance",
            "schema": {
              "type": "string"
            }
          }
        ],
        "requestBody": {
          "description": "Configuration for the Dify bot instance",
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "enabled": {
                    "type": "boolean"
                  },
                  "botType": {
                    "type": "string",
                    "enum": [
                      "chatBot",
                      "textGenerator",
                      "agent",
                      "workflow"
                    ]
                  },
                  "apiUrl": {
                    "type": "string"
                  },
                  "apiKey": {
                    "type": "string"
                  },
                  "triggerType": {
                    "type": "string",
                    "enum": [
                      "all",
                      "keyword"
                    ]
                  },
                  "triggerOperator": {
                    "type": "string",
                    "enum": [
                      "contains",
                      "equals",
                      "startsWith",
                      "endsWith",
                      "regex",
                      "none"
                    ]
                  },
                  "triggerValue": {
                    "type": "string"
                  },
                  "expire": {
                    "type": "integer"
                  },
                  "keywordFinish": {
                    "type": "string"
                  },
                  "delayMessage": {
                    "type": "integer"
                  },
                  "unknownMessage": {
                    "type": "string"
                  },
                  "listeningFromMe": {
                    "type": "boolean"
                  },
                  "stopBotFromMe": {
                    "type": "boolean"
                  },
                  "keepOpen": {
                    "type": "boolean"
                  },
                  "debounceTime": {
                    "type": "integer"
                  },
                  "ignoreJids": {
                    "type": "array",
                    "items": {
                      "type": "string"
                    }
                  }
                },
                "required": [
                  "enabled",
                  "botType",
                  "apiUrl",
                  "apiKey"
                ]
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Bot instance created successfully",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "message": {
                      "type": "string",
                      "example": "Bot instance created successfully"
                    }
                  }
                }
              }
            }
          },
          "400": {
            "description": "Bad Request - Invalid or missing parameters"
          },
          "404": {
            "description": "Not Found - Instance could not be created"
          },
          "500": {
            "description": "Internal Server Error"
          }
        }
      }
    },
    "/dify/find/{instance}": {
      "get": {
        "operationId": "fetchDify",
        "summary": "Fetch Bot Dify",
        "tags": [
          "OpenAI Controller"
        ],
        "description": "Fetches dify bots.",
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "Name of the instance",
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successfully fetched sessions",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "message": {
                      "type": "string",
                      "example": "OK"
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/dify/find/:difyId/{instance}": {
      "get": {
        "operationId": "findDify",
        "summary": "Find Bot Dify",
        "tags": [
          "OpenAI Controller"
        ],
        "description": "Update dify bot.",
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "Name of the instance",
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "difyId",
            "in": "path",
            "required": true,
            "description": "ID of the dify bot",
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successfully fetched sessions",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "message": {
                      "type": "string",
                      "example": "OK"
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/dify/update/:difyId/{instance}": {
      "put": {
        "operationId": "updateDifyBot",
        "summary": "Create a new Dify bot instance",
        "tags": [
          "Dify Controller"
        ],
        "description": "Update bot Dify",
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "Name of the instance",
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "difyId",
            "in": "path",
            "required": true,
            "description": "Id bot dify",
            "schema": {
              "type": "string"
            }
          }
        ],
        "requestBody": {
          "description": "Configuration for the Dify bot instance",
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "enabled": {
                    "type": "boolean"
                  },
                  "botType": {
                    "type": "string",
                    "enum": [
                      "chatBot",
                      "textGenerator",
                      "agent",
                      "workflow"
                    ]
                  },
                  "apiUrl": {
                    "type": "string"
                  },
                  "apiKey": {
                    "type": "string"
                  },
                  "triggerType": {
                    "type": "string",
                    "enum": [
                      "all",
                      "keyword"
                    ]
                  },
                  "triggerOperator": {
                    "type": "string",
                    "enum": [
                      "contains",
                      "equals",
                      "startsWith",
                      "endsWith",
                      "regex",
                      "none"
                    ]
                  },
                  "triggerValue": {
                    "type": "string"
                  },
                  "expire": {
                    "type": "integer"
                  },
                  "keywordFinish": {
                    "type": "string"
                  },
                  "delayMessage": {
                    "type": "integer"
                  },
                  "unknownMessage": {
                    "type": "string"
                  },
                  "listeningFromMe": {
                    "type": "boolean"
                  },
                  "stopBotFromMe": {
                    "type": "boolean"
                  },
                  "keepOpen": {
                    "type": "boolean"
                  },
                  "debounceTime": {
                    "type": "integer"
                  },
                  "ignoreJids": {
                    "type": "array",
                    "items": {
                      "type": "string"
                    }
                  }
                },
                "required": [
                  "enabled",
                  "botType",
                  "apiUrl",
                  "apiKey"
                ]
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Bot instance created successfully",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "message": {
                      "type": "string",
                      "example": "Bot instance created successfully"
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/dify/settings/{instance}": {
      "post": {
        "operationId": "updateDifySettings",
        "summary": "Atualiza as configurações do bot Dify",
        "tags": [
          "Dify Controller"
        ],
        "description": "Atualiza as configurações do bot Dify.",
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "Nome da instância",
            "schema": {
              "type": "string"
            }
          }
        ],
        "requestBody": {
          "description": "Configurações do bot Dify",
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "expire": {
                    "type": "integer",
                    "description": "Tempo de expiração em minutos.",
                    "example": 20
                  },
                  "keywordFinish": {
                    "type": "string",
                    "description": "Palavra-chave que finalizará o bot.",
                    "example": "#SAIR"
                  },
                  "delayMessage": {
                    "type": "integer",
                    "description": "Tempo de delay antes do envio de uma nova mensagem (em milissegundos).",
                    "example": 1000
                  },
                  "unknownMessage": {
                    "type": "string",
                    "description": "Mensagem que será enviada quando o bot não reconhecer o comando.",
                    "example": "Mensagem não reconhecida"
                  },
                  "listeningFromMe": {
                    "type": "boolean",
                    "description": "Define se o bot deve ouvir mensagens enviadas pelo próprio usuário.",
                    "example": false
                  },
                  "stopBotFromMe": {
                    "type": "boolean",
                    "description": "Define se o bot deve parar ao receber mensagens enviadas pelo próprio usuário.",
                    "example": false
                  },
                  "keepOpen": {
                    "type": "boolean",
                    "description": "Define se o bot deve manter a conversa aberta após uma resposta.",
                    "example": false
                  },
                  "debounceTime": {
                    "type": "integer",
                    "description": "Tempo de debounce (em milissegundos).",
                    "example": 0
                  },
                  "ignoreJids": {
                    "type": "array",
                    "items": {
                      "type": "string"
                    },
                    "description": "Lista de JIDs a serem ignorados.",
                    "example": []
                  },
                  "difyIdFallback": {
                    "type": "string",
                    "description": "ID de fallback do bot Dify.",
                    "example": "clyja4oys0a3uqpy7k3bd7swe"
                  }
                },
                "required": [
                  "expire",
                  "keywordFinish",
                  "delayMessage",
                  "unknownMessage",
                  "listeningFromMe",
                  "stopBotFromMe",
                  "keepOpen",
                  "debounceTime",
                  "difyIdFallback",
                  "ignoreJids"
                ]
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Configurações do bot Dify atualizadas com sucesso.",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "message": {
                      "type": "string",
                      "example": "Configurações do bot Dify atualizadas com sucesso"
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/dify/fetchSettings/{instance}": {
      "get": {
        "operationId": "findDifySettings",
        "summary": "Find settings dify bot",
        "tags": [
          "Dify Controller"
        ],
        "description": "Find settigns dify bot",
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "Nome da instância",
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Configurações do bot Dify atualizadas com sucesso.",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "message": {
                      "type": "string",
                      "example": "Configurações do bot Dify atualizadas com sucesso"
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/dify/changeStatus/{instance}": {
      "post": {
        "operationId": "changeDifyBotStatus",
        "summary": "Altera o status do bot Dify",
        "tags": [
          "Dify Controller"
        ],
        "description": "Altera o status de um bot Dify. O status pode ser `opened`, `paused`, ou `closed`. O status `closed` encerra a interação do bot.",
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "Nome da instância",
            "schema": {
              "type": "string"
            }
          }
        ],
        "requestBody": {
          "description": "Dados para alterar o status do bot Dify",
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "remoteJid": {
                    "type": "string",
                    "description": "Número de telefone remoto no formato E.164 (ex: 5511912345678@s.whatsapp.net)",
                    "example": "5511912345678@s.whatsapp.net"
                  },
                  "status": {
                    "type": "string",
                    "enum": [
                      "opened",
                      "paused",
                      "closed"
                    ],
                    "description": "Status a ser atribuído ao bot Dify. Os valores válidos são `opened`, `paused` e `closed`.",
                    "example": "closed"
                  }
                },
                "required": [
                  "remoteJid",
                  "status"
                ]
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Status do bot Dify alterado com sucesso.",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "message": {
                      "type": "string",
                      "example": "Status do bot Dify alterado para closed com sucesso"
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/dify/fetchSessions/:difyId/{instance}": {
      "get": {
        "operationId": "fetchDifyBotSessions",
        "summary": "Recupera as sessões ativas do bot Dify",
        "tags": [
          "Dify Controller"
        ],
        "description": "Recupera as sessões ativas de um bot Dify específico, com base no ID do bot (`difyId`) e na instância do bot (`instance`).",
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "difyId",
            "in": "path",
            "required": true,
            "description": "ID único do bot Dify.",
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "Nome da instância.",
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Sessões recuperadas com sucesso.",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "sessions": {
                      "type": "string"
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/n8n/create/{instance}": {
      "post": {
        "operationId": "createN8nBot",
        "summary": "Create a new n8n bot instance",
        "tags": [
          "n8n Controller"
        ],
        "description": "Creates a new n8n bot with the provided configuration",
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "Name of the instance",
            "schema": {
              "type": "string"
            }
          }
        ],
        "requestBody": {
          "description": "Configuration for the n8n bot instance",
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "enabled": {
                    "type": "boolean"
                  },
                  "webhookUrl": {
                    "type": "string"
                  },
                  "basicAuthUser": {
                    "type": "string"
                  },
                  "basicAuthPassword": {
                    "type": "string"
                  },
                  "triggerType": {
                    "type": "string",
                    "enum": [
                      "all",
                      "keyword"
                    ]
                  },
                  "triggerOperator": {
                    "type": "string",
                    "enum": [
                      "contains",
                      "equals",
                      "startsWith",
                      "endsWith",
                      "regex",
                      "none"
                    ]
                  },
                  "triggerValue": {
                    "type": "string"
                  },
                  "expire": {
                    "type": "integer"
                  },
                  "keywordFinish": {
                    "type": "string"
                  },
                  "delayMessage": {
                    "type": "integer"
                  },
                  "unknownMessage": {
                    "type": "string"
                  },
                  "listeningFromMe": {
                    "type": "boolean"
                  },
                  "stopBotFromMe": {
                    "type": "boolean"
                  },
                  "keepOpen": {
                    "type": "boolean"
                  },
                  "debounceTime": {
                    "type": "integer"
                  },
                  "ignoreJids": {
                    "type": "array",
                    "items": {
                      "type": "string"
                    }
                  }
                },
                "required": [
                  "enabled",
                  "webhookUrl"
                ]
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "n8n bot instance created successfully",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "message": {
                      "type": "string",
                      "example": "n8n bot instance created successfully"
                    }
                  }
                }
              }
            }
          },
          "400": {
            "description": "Bad Request - Invalid or missing parameters"
          },
          "404": {
            "description": "Not Found - Instance could not be created"
          },
          "500": {
            "description": "Internal Server Error"
          }
        }
      }
    },
    "/n8n/find/{instance}": {
      "get": {
        "operationId": "fetchN8n",
        "summary": "Fetch n8n Bot",
        "tags": [
          "n8n Controller"
        ],
        "description": "Fetches n8n bots.",
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "Name of the instance",
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successfully fetched sessions",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "message": {
                      "type": "string",
                      "example": "OK"
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/n8n/find/:n8nId/{instance}": {
      "get": {
        "operationId": "findN8n",
        "summary": "Find n8n Bot",
        "tags": [
          "n8n Controller"
        ],
        "description": "Update n8n bot.",
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "Name of the instance",
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "n8nId",
            "in": "path",
            "required": true,
            "description": "ID of the n8n bot",
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successfully fetched sessions",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "message": {
                      "type": "string",
                      "example": "OK"
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/n8n/update/:n8nId/{instance}": {
      "put": {
        "operationId": "updateN8nBot",
        "summary": "Create a new n8n bot instance",
        "tags": [
          "n8n Controller"
        ],
        "description": "Update bot n8n",
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "Name of the instance",
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "n8nId",
            "in": "path",
            "required": true,
            "description": "Id bot n8n",
            "schema": {
              "type": "string"
            }
          }
        ],
        "requestBody": {
          "description": "Configuration for the n8n bot instance",
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "enabled": {
                    "type": "boolean"
                  },
                  "webhookUrl": {
                    "type": "string"
                  },
                  "basicAuthUser": {
                    "type": "string"
                  },
                  "basicAuthPassword": {
                    "type": "string"
                  },
                  "triggerType": {
                    "type": "string",
                    "enum": [
                      "all",
                      "keyword"
                    ]
                  },
                  "triggerOperator": {
                    "type": "string",
                    "enum": [
                      "contains",
                      "equals",
                      "startsWith",
                      "endsWith",
                      "regex",
                      "none"
                    ]
                  },
                  "triggerValue": {
                    "type": "string"
                  },
                  "expire": {
                    "type": "integer"
                  },
                  "keywordFinish": {
                    "type": "string"
                  },
                  "delayMessage": {
                    "type": "integer"
                  },
                  "unknownMessage": {
                    "type": "string"
                  },
                  "listeningFromMe": {
                    "type": "boolean"
                  },
                  "stopBotFromMe": {
                    "type": "boolean"
                  },
                  "keepOpen": {
                    "type": "boolean"
                  },
                  "debounceTime": {
                    "type": "integer"
                  },
                  "ignoreJids": {
                    "type": "array",
                    "items": {
                      "type": "string"
                    }
                  }
                },
                "required": [
                  "enabled",
                  "webhookUrl"
                ]
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "n8n bot instance created successfully",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "message": {
                      "type": "string",
                      "example": "n8n bot instance created successfully"
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/n8n/settings/{instance}": {
      "post": {
        "operationId": "updateN8nSettings",
        "summary": "Atualiza as configurações do bot n8n",
        "tags": [
          "n8n Controller"
        ],
        "description": "Atualiza as configurações do bot n8n.",
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "Nome da instância",
            "schema": {
              "type": "string"
            }
          }
        ],
        "requestBody": {
          "description": "Configurações do bot n8n",
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "expire": {
                    "type": "integer",
                    "description": "Tempo de expiração em minutos.",
                    "example": 20
                  },
                  "keywordFinish": {
                    "type": "string",
                    "description": "Palavra-chave que finalizará o bot.",
                    "example": "#SAIR"
                  },
                  "delayMessage": {
                    "type": "integer",
                    "description": "Tempo de delay antes do envio de uma nova mensagem (em milissegundos).",
                    "example": 1000
                  },
                  "unknownMessage": {
                    "type": "string",
                    "description": "Mensagem que será enviada quando o bot não reconhecer o comando.",
                    "example": "Mensagem não reconhecida"
                  },
                  "listeningFromMe": {
                    "type": "boolean",
                    "description": "Define se o bot deve ouvir mensagens enviadas pelo próprio usuário.",
                    "example": false
                  },
                  "stopBotFromMe": {
                    "type": "boolean",
                    "description": "Define se o bot deve parar ao receber mensagens enviadas pelo próprio usuário.",
                    "example": false
                  },
                  "keepOpen": {
                    "type": "boolean",
                    "description": "Define se o bot deve manter a conversa aberta após uma resposta.",
                    "example": false
                  },
                  "debounceTime": {
                    "type": "integer",
                    "description": "Tempo de debounce (em milissegundos).",
                    "example": 0
                  },
                  "ignoreJids": {
                    "type": "array",
                    "items": {
                      "type": "string"
                    },
                    "description": "Lista de JIDs a serem ignorados.",
                    "example": []
                  },
                  "n8nIdFallback": {
                    "type": "string",
                    "description": "ID de fallback do bot n8n.",
                    "example": "clyja4oys0a3uqpy7k3bd7swe"
                  }
                },
                "required": [
                  "expire",
                  "keywordFinish",
                  "delayMessage",
                  "unknownMessage",
                  "listeningFromMe",
                  "stopBotFromMe",
                  "keepOpen",
                  "debounceTime",
                  "n8nIdFallback",
                  "ignoreJids"
                ]
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Configurações do bot n8n atualizadas com sucesso.",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "message": {
                      "type": "string",
                      "example": "Configurações do bot n8n atualizadas com sucesso"
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/n8n/fetchSettings/{instance}": {
      "get": {
        "operationId": "findN8nSettings",
        "summary": "Find settings n8n bot",
        "tags": [
          "n8n Controller"
        ],
        "description": "Find settigns n8n bot",
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "Nome da instância",
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Configurações do bot n8n atualizadas com sucesso.",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "message": {
                      "type": "string",
                      "example": "Configurações do bot n8n atualizadas com sucesso"
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/n8n/changeStatus/{instance}": {
      "post": {
        "operationId": "changeN8nBotStatus",
        "summary": "Altera o status do bot n8n",
        "tags": [
          "n8n Controller"
        ],
        "description": "Altera o status de um bot n8n. O status pode ser `opened`, `paused`, ou `closed`. O status `closed` encerra a interação do bot.",
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "Nome da instância",
            "schema": {
              "type": "string"
            }
          }
        ],
        "requestBody": {
          "description": "Dados para alterar o status do bot n8n",
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "remoteJid": {
                    "type": "string",
                    "description": "Número de telefone remoto no formato E.164 (ex: 5511912345678@s.whatsapp.net)",
                    "example": "5511912345678@s.whatsapp.net"
                  },
                  "status": {
                    "type": "string",
                    "enum": [
                      "opened",
                      "paused",
                      "closed"
                    ],
                    "description": "Status a ser atribuído ao bot n8n. Os valores válidos são `opened`, `paused` e `closed`.",
                    "example": "closed"
                  }
                },
                "required": [
                  "remoteJid",
                  "status"
                ]
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Status do bot n8n alterado com sucesso.",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "message": {
                      "type": "string",
                      "example": "Status do bot n8n alterado para closed com sucesso"
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/n8n/fetchSessions/:n8nId/{instance}": {
      "get": {
        "operationId": "fetchN8nBotSessions",
        "summary": "Recupera as sessões ativas do bot n8n",
        "tags": [
          "n8n Controller"
        ],
        "description": "Recupera as sessões ativas de um bot n8n específico, com base no ID do bot (`n8nId`) e na instância do bot (`instance`).",
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "n8nId",
            "in": "path",
            "required": true,
            "description": "ID único do bot n8n.",
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "Nome da instância.",
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Sessões recuperadas com sucesso.",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "sessions": {
                      "type": "string"
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/evoai/create/{instance}": {
      "post": {
        "operationId": "createEvoAIBot",
        "summary": "Create a new evoai bot instance",
        "tags": [
          "EvoAI Controller"
        ],
        "description": "Creates a new EvoAI bot with the provided configuration",
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "Name of the instance",
            "schema": {
              "type": "string"
            }
          }
        ],
        "requestBody": {
          "description": "Configuration for the EvoAI bot instance",
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "enabled": {
                    "type": "boolean"
                  },
                  "agentUrl": {
                    "type": "string"
                  },
                  "apiKey": {
                    "type": "string"
                  },
                  "triggerType": {
                    "type": "string",
                    "enum": [
                      "all",
                      "keyword"
                    ]
                  },
                  "triggerOperator": {
                    "type": "string",
                    "enum": [
                      "contains",
                      "equals",
                      "startsWith",
                      "endsWith",
                      "regex",
                      "none"
                    ]
                  },
                  "triggerValue": {
                    "type": "string"
                  },
                  "expire": {
                    "type": "integer"
                  },
                  "keywordFinish": {
                    "type": "string"
                  },
                  "delayMessage": {
                    "type": "integer"
                  },
                  "unknownMessage": {
                    "type": "string"
                  },
                  "listeningFromMe": {
                    "type": "boolean"
                  },
                  "stopBotFromMe": {
                    "type": "boolean"
                  },
                  "keepOpen": {
                    "type": "boolean"
                  },
                  "debounceTime": {
                    "type": "integer"
                  },
                  "ignoreJids": {
                    "type": "array",
                    "items": {
                      "type": "string"
                    }
                  }
                },
                "required": [
                  "enabled",
                  "agentUrl"
                ]
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "EvoAI bot instance created successfully",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "message": {
                      "type": "string",
                      "example": "EvoAI bot instance created successfully"
                    }
                  }
                }
              }
            }
          },
          "400": {
            "description": "Bad Request - Invalid or missing parameters"
          },
          "404": {
            "description": "Not Found - Instance could not be created"
          },
          "500": {
            "description": "Internal Server Error"
          }
        }
      }
    },
    "/evoai/find/{instance}": {
      "get": {
        "operationId": "fetchEvoAIBot",
        "summary": "Fetch EvoAI Bot",
        "tags": [
          "EvoAI Controller"
        ],
        "description": "Fetches EvoAI bots.",
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "Name of the instance",
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successfully fetched sessions",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "message": {
                      "type": "string",
                      "example": "OK"
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/evoai/find/:evoaiId/{instance}": {
      "get": {
        "operationId": "findEvoAIBot",
        "summary": "Find EvoAI Bot",
        "tags": [
          "EvoAI Controller"
        ],
        "description": "Update EvoAI bot.",
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "Name of the instance",
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "evoaiId",
            "in": "path",
            "required": true,
            "description": "ID of the EvoAI bot",
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successfully fetched sessions",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "message": {
                      "type": "string",
                      "example": "OK"
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/evoai/update/:evoaiId/{instance}": {
      "put": {
        "operationId": "updateEvoAIBot",
        "summary": "Create a new EvoAI bot instance",
        "tags": [
          "EvoAI Controller"
        ],
        "description": "Update bot EvoAI",
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "Name of the instance",
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "evoaiId",
            "in": "path",
            "required": true,
            "description": "Id bot EvoAI",
            "schema": {
              "type": "string"
            }
          }
        ],
        "requestBody": {
          "description": "Configuration for the EvoAI bot instance",
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "enabled": {
                    "type": "boolean"
                  },
                  "agentUrl": {
                    "type": "string"
                  },
                  "apiKey": {
                    "type": "string"
                  },
                  "triggerType": {
                    "type": "string",
                    "enum": [
                      "all",
                      "keyword"
                    ]
                  },
                  "triggerOperator": {
                    "type": "string",
                    "enum": [
                      "contains",
                      "equals",
                      "startsWith",
                      "endsWith",
                      "regex",
                      "none"
                    ]
                  },
                  "triggerValue": {
                    "type": "string"
                  },
                  "expire": {
                    "type": "integer"
                  },
                  "keywordFinish": {
                    "type": "string"
                  },
                  "delayMessage": {
                    "type": "integer"
                  },
                  "unknownMessage": {
                    "type": "string"
                  },
                  "listeningFromMe": {
                    "type": "boolean"
                  },
                  "stopBotFromMe": {
                    "type": "boolean"
                  },
                  "keepOpen": {
                    "type": "boolean"
                  },
                  "debounceTime": {
                    "type": "integer"
                  },
                  "ignoreJids": {
                    "type": "array",
                    "items": {
                      "type": "string"
                    }
                  }
                },
                "required": [
                  "enabled",
                  "agentUrl"
                ]
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "EvoAI bot instance created successfully",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "message": {
                      "type": "string",
                      "example": "EvoAI bot instance created successfully"
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/evoai/settings/{instance}": {
      "post": {
        "operationId": "updateEvoAISettings",
        "summary": "Atualiza as configurações do bot EvoAI",
        "tags": [
          "EvoAI Controller"
        ],
        "description": "Atualiza as configurações do bot EvoAI.",
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "Nome da instância",
            "schema": {
              "type": "string"
            }
          }
        ],
        "requestBody": {
          "description": "Configurações do bot EvoAI",
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "expire": {
                    "type": "integer",
                    "description": "Tempo de expiração em minutos.",
                    "example": 20
                  },
                  "keywordFinish": {
                    "type": "string",
                    "description": "Palavra-chave que finalizará o bot.",
                    "example": "#SAIR"
                  },
                  "delayMessage": {
                    "type": "integer",
                    "description": "Tempo de delay antes do envio de uma nova mensagem (em milissegundos).",
                    "example": 1000
                  },
                  "unknownMessage": {
                    "type": "string",
                    "description": "Mensagem que será enviada quando o bot não reconhecer o comando.",
                    "example": "Mensagem não reconhecida"
                  },
                  "listeningFromMe": {
                    "type": "boolean",
                    "description": "Define se o bot deve ouvir mensagens enviadas pelo próprio usuário.",
                    "example": false
                  },
                  "stopBotFromMe": {
                    "type": "boolean",
                    "description": "Define se o bot deve parar ao receber mensagens enviadas pelo próprio usuário.",
                    "example": false
                  },
                  "keepOpen": {
                    "type": "boolean",
                    "description": "Define se o bot deve manter a conversa aberta após uma resposta.",
                    "example": false
                  },
                  "debounceTime": {
                    "type": "integer",
                    "description": "Tempo de debounce (em milissegundos).",
                    "example": 0
                  },
                  "ignoreJids": {
                    "type": "array",
                    "items": {
                      "type": "string"
                    },
                    "description": "Lista de JIDs a serem ignorados.",
                    "example": []
                  },
                  "evoaiIdFallback": {
                    "type": "string",
                    "description": "ID de fallback do bot EvoAI.",
                    "example": "clyja4oys0a3uqpy7k3bd7swe"
                  }
                },
                "required": [
                  "expire",
                  "keywordFinish",
                  "delayMessage",
                  "unknownMessage",
                  "listeningFromMe",
                  "stopBotFromMe",
                  "keepOpen",
                  "debounceTime",
                  "evoaiIdFallback",
                  "ignoreJids"
                ]
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Configurações do bot EvoAI atualizadas com sucesso.",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "message": {
                      "type": "string",
                      "example": "Configurações do bot EvoAI atualizadas com sucesso"
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/evoai/fetchSettings/{instance}": {
      "get": {
        "operationId": "findEvoAISettings",
        "summary": "Find settings EvoAI bot",
        "tags": [
          "EvoAI Controller"
        ],
        "description": "Find settigns EvoAI bot",
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "Nome da instância",
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Configurações do bot EvoAI atualizadas com sucesso.",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "message": {
                      "type": "string",
                      "example": "Configurações do bot EvoAI atualizadas com sucesso"
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/evoai/changeStatus/{instance}": {
      "post": {
        "operationId": "changeEvoAIBotStatus",
        "summary": "Altera o status do bot EvoAI",
        "tags": [
          "EvoAI Controller"
        ],
        "description": "Altera o status de um bot EvoAI. O status pode ser `opened`, `paused`, ou `closed`. O status `closed` encerra a interação do bot.",
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "Nome da instância",
            "schema": {
              "type": "string"
            }
          }
        ],
        "requestBody": {
          "description": "Dados para alterar o status do bot EvoAI",
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "remoteJid": {
                    "type": "string",
                    "description": "Número de telefone remoto no formato E.164 (ex: 5511912345678@s.whatsapp.net)",
                    "example": "5511912345678@s.whatsapp.net"
                  },
                  "status": {
                    "type": "string",
                    "enum": [
                      "opened",
                      "paused",
                      "closed"
                    ],
                    "description": "Status a ser atribuído ao bot EvoAI. Os valores válidos são `opened`, `paused` e `closed`.",
                    "example": "closed"
                  }
                },
                "required": [
                  "remoteJid",
                  "status"
                ]
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Status do bot EvoAI alterado com sucesso.",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "message": {
                      "type": "string",
                      "example": "Status do bot EvoAI alterado para closed com sucesso"
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/evoai/fetchSessions/:evoaiId/{instance}": {
      "get": {
        "operationId": "fetchEvoAIBotSessions",
        "summary": "Recupera as sessões ativas do bot EvoAI",
        "tags": [
          "EvoAI Controller"
        ],
        "description": "Recupera as sessões ativas de um bot EvoAI específico, com base no ID do bot (`evoaiId`) e na instância do bot (`instance`).",
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "evoaiId",
            "in": "path",
            "required": true,
            "description": "ID único do bot EvoAI.",
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "Nome da instância.",
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Sessões recuperadas com sucesso.",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "sessions": {
                      "type": "string"
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/flowise/create/{instance}": {
      "post": {
        "operationId": "createFlowiseInstance",
        "summary": "Cria uma nova instância do Flowise",
        "tags": [
          "Flowise Controller"
        ],
        "description": "Create Bot Flowise",
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "Nome da instância",
            "schema": {
              "type": "string"
            }
          }
        ],
        "requestBody": {
          "description": "Configuração para a instância do Flowise",
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "enabled": {
                    "type": "boolean",
                    "description": "Indica se a instância está habilitada ou não.",
                    "example": true
                  },
                  "apiUrl": {
                    "type": "string",
                    "description": "URL da API do Flowise.",
                    "example": "http://dify.site.com/v1"
                  },
                  "apiKey": {
                    "type": "string",
                    "description": "Chave de API (opcional).",
                    "example": "app-123456"
                  },
                  "triggerType": {
                    "type": "string",
                    "enum": [
                      "all",
                      "keyword"
                    ],
                    "description": "Tipo de gatilho para o bot.",
                    "example": "keyword"
                  },
                  "triggerOperator": {
                    "type": "string",
                    "enum": [
                      "contains",
                      "equals",
                      "startsWith",
                      "endsWith",
                      "regex",
                      "none"
                    ],
                    "description": "Operador para o gatilho.",
                    "example": "equals"
                  },
                  "triggerValue": {
                    "type": "string",
                    "description": "Valor do gatilho.",
                    "example": "teste"
                  },
                  "expire": {
                    "type": "integer",
                    "description": "Tempo de expiração do bot em minutos.",
                    "example": 0
                  },
                  "keywordFinish": {
                    "type": "string",
                    "description": "Palavra-chave para encerrar a interação.",
                    "example": "#SAIR"
                  },
                  "delayMessage": {
                    "type": "integer",
                    "description": "Tempo de atraso para a mensagem, em milissegundos.",
                    "example": 1000
                  },
                  "unknownMessage": {
                    "type": "string",
                    "description": "Mensagem padrão quando a entrada não for reconhecida.",
                    "example": "Mensagem não reconhecida"
                  },
                  "listeningFromMe": {
                    "type": "boolean",
                    "description": "Indica se o bot deve ouvir apenas mensagens enviadas por você.",
                    "example": false
                  },
                  "stopBotFromMe": {
                    "type": "boolean",
                    "description": "Indica se o bot deve ser parado quando você enviar uma mensagem.",
                    "example": false
                  },
                  "keepOpen": {
                    "type": "boolean",
                    "description": "Indica se a instância do bot deve permanecer aberta.",
                    "example": false
                  },
                  "debounceTime": {
                    "type": "integer",
                    "description": "Tempo de debounce para a entrada, em milissegundos.",
                    "example": 0
                  },
                  "ignoreJids": {
                    "type": "array",
                    "items": {
                      "type": "string"
                    },
                    "description": "Lista de JIDs (identificadores de usuário) que o bot deve ignorar.",
                    "example": [
                      "1234567890@s.whatsapp.net"
                    ]
                  }
                },
                "required": [
                  "enabled",
                  "apiUrl",
                  "triggerType",
                  "triggerOperator",
                  "triggerValue"
                ]
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Instância do Flowise criada com sucesso",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "message": {
                      "type": "string",
                      "example": "Instância do Flowise criada com sucesso"
                    }
                  }
                }
              }
            }
          },
          "400": {
            "description": "Erro na requisição, parâmetros inválidos",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "error": {
                      "type": "string",
                      "example": "Parâmetros inválidos fornecidos"
                    }
                  }
                }
              }
            }
          },
          "404": {
            "description": "Instância não encontrada",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "error": {
                      "type": "string",
                      "example": "Instância não encontrada"
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/flowise/find/{instance}": {
      "get": {
        "operationId": "fetchFlowiseBotSessions",
        "summary": "Recupera as sessões ativas do bot Flowise",
        "tags": [
          "Dify Controller"
        ],
        "description": "Fetch bots flowise",
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "Nome da instância.",
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Sessões recuperadas com sucesso.",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "sessions": {
                      "type": "string"
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/flowise/find/:flowiseId/{instance}": {
      "get": {
        "operationId": "fetchFlowiseBotSessions",
        "summary": "Recupera as sessões ativas do bot Flowise",
        "tags": [
          "Dify Controller"
        ],
        "description": "Fetch bots flowise",
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "Nome da instância.",
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "flowiseId",
            "in": "path",
            "required": true,
            "description": "Id Bot Flowise",
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Sessões recuperadas com sucesso.",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "sessions": {
                      "type": "string"
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/flowise/update/:flowiseId/{instance}": {
      "post": {
        "operationId": "updateFlowiseInstance",
        "summary": "Atualiza uma instância do Flowise",
        "tags": [
          "Flowise Controller"
        ],
        "description": "Update flowise bot",
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "flowiseId",
            "in": "path",
            "required": true,
            "description": "ID da instância do Flowise",
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "Nome da instância",
            "schema": {
              "type": "string"
            }
          }
        ],
        "requestBody": {
          "description": "Configuração para atualizar a instância do Flowise",
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "enabled": {
                    "type": "boolean",
                    "description": "Indica se a instância está habilitada ou não.",
                    "example": true
                  },
                  "apiUrl": {
                    "type": "string",
                    "description": "URL da API do Flowise.",
                    "example": "http://dify.site.com/v1"
                  },
                  "apiKey": {
                    "type": "string",
                    "description": "Chave de API (opcional).",
                    "example": "app-123456"
                  },
                  "triggerType": {
                    "type": "string",
                    "enum": [
                      "all",
                      "keyword"
                    ],
                    "description": "Tipo de gatilho para o bot.",
                    "example": "keyword"
                  },
                  "triggerOperator": {
                    "type": "string",
                    "enum": [
                      "contains",
                      "equals",
                      "startsWith",
                      "endsWith",
                      "regex",
                      "none"
                    ],
                    "description": "Operador para o gatilho.",
                    "example": "equals"
                  },
                  "triggerValue": {
                    "type": "string",
                    "description": "Valor do gatilho.",
                    "example": "teste"
                  },
                  "expire": {
                    "type": "integer",
                    "description": "Tempo de expiração do bot em minutos.",
                    "example": 0
                  },
                  "keywordFinish": {
                    "type": "string",
                    "description": "Palavra-chave para encerrar a interação.",
                    "example": "#SAIR"
                  },
                  "delayMessage": {
                    "type": "integer",
                    "description": "Tempo de atraso para a mensagem, em milissegundos.",
                    "example": 1000
                  },
                  "unknownMessage": {
                    "type": "string",
                    "description": "Mensagem padrão quando a entrada não for reconhecida.",
                    "example": "Mensagem não reconhecida"
                  },
                  "listeningFromMe": {
                    "type": "boolean",
                    "description": "Indica se o bot deve ouvir apenas mensagens enviadas por você.",
                    "example": false
                  },
                  "stopBotFromMe": {
                    "type": "boolean",
                    "description": "Indica se o bot deve ser parado quando você enviar uma mensagem.",
                    "example": false
                  },
                  "keepOpen": {
                    "type": "boolean",
                    "description": "Indica se a instância do bot deve permanecer aberta.",
                    "example": false
                  },
                  "debounceTime": {
                    "type": "integer",
                    "description": "Tempo de debounce para a entrada, em milissegundos.",
                    "example": 0
                  },
                  "ignoreJids": {
                    "type": "array",
                    "items": {
                      "type": "string"
                    },
                    "description": "Lista de JIDs (identificadores de usuário) que o bot deve ignorar.",
                    "example": [
                      "1234567890@s.whatsapp.net"
                    ]
                  }
                },
                "required": [
                  "enabled",
                  "apiUrl",
                  "triggerType",
                  "triggerOperator",
                  "triggerValue"
                ]
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Instância do Flowise atualizada com sucesso",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "message": {
                      "type": "string",
                      "example": "Instância do Flowise atualizada com sucesso"
                    }
                  }
                }
              }
            }
          },
          "400": {
            "description": "Erro na requisição, parâmetros inválidos",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "error": {
                      "type": "string",
                      "example": "Parâmetros inválidos fornecidos"
                    }
                  }
                }
              }
            }
          },
          "404": {
            "description": "Instância não encontrada",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "error": {
                      "type": "string",
                      "example": "Instância não encontrada"
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/flowise/delete/:flowiseId/{instance}": {
      "delete": {
        "operationId": "deleteBot",
        "summary": "Delete Bot Flowise",
        "tags": [
          "Group Controller"
        ],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "Name of the instance ",
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "flowiseId",
            "in": "query",
            "required": true,
            "description": "Id Bot Flowise",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Delete Bot",
        "responses": {
          "200": {
            "description": "Ok",
            "content": {}
          }
        }
      }
    },
    "/flowise/settings/{instance}": {
      "post": {
        "operationId": "setlowiseSettings",
        "summary": "Set as configurações do Flowise",
        "tags": [
          "Flowise Controller"
        ],
        "description": "Set Settings Flowise bot",
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "Nome da instância",
            "schema": {
              "type": "string"
            }
          }
        ],
        "requestBody": {
          "description": "Configuração para atualizar as preferências da instância do Flowise",
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "expire": {
                    "type": "integer",
                    "description": "Tempo de expiração do bot, em minutos.",
                    "example": 20
                  },
                  "keywordFinish": {
                    "type": "string",
                    "description": "Palavra-chave que encerra a interação com o bot.",
                    "example": "#SAIR"
                  },
                  "delayMessage": {
                    "type": "integer",
                    "description": "Tempo de atraso para a mensagem, em milissegundos.",
                    "example": 1000
                  },
                  "unknownMessage": {
                    "type": "string",
                    "description": "Mensagem enviada quando o bot não reconhece a entrada.",
                    "example": "Mensagem não reconhecida"
                  },
                  "listeningFromMe": {
                    "type": "boolean",
                    "description": "Indica se o bot deve ouvir apenas as mensagens enviadas pelo usuário.",
                    "example": false
                  },
                  "stopBotFromMe": {
                    "type": "boolean",
                    "description": "Indica se o bot deve ser interrompido quando o usuário envia uma mensagem.",
                    "example": false
                  },
                  "keepOpen": {
                    "type": "boolean",
                    "description": "Indica se o bot deve permanecer aberto após a interação.",
                    "example": false
                  },
                  "debounceTime": {
                    "type": "integer",
                    "description": "Tempo de debounce em milissegundos para a entrada do usuário.",
                    "example": 0
                  },
                  "ignoreJids": {
                    "type": "array",
                    "items": {
                      "type": "string"
                    },
                    "description": "Lista de JIDs que devem ser ignorados pelo bot.",
                    "example": []
                  },
                  "flowiseIdFallback": {
                    "type": "string",
                    "description": "ID do Flowise a ser utilizado como fallback caso a instância atual não esteja disponível.",
                    "example": "clyja4oys0a3uqpy7k3bd7swe"
                  }
                },
                "required": [
                  "expire",
                  "keywordFinish",
                  "delayMessage",
                  "unknownMessage",
                  "listeningFromMe",
                  "stopBotFromMe",
                  "keepOpen",
                  "debounceTime",
                  "ignoreJids",
                  "flowiseIdFallback"
                ]
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Configurações da instância do Flowise atualizadas com sucesso",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "message": {
                      "type": "string",
                      "example": "Configurações da instância do Flowise atualizadas com sucesso"
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/flowise/fetchSessions/:flowiseId/{instance}": {
      "get": {
        "operationId": "fetchFlowiseSessions",
        "summary": "Recupera as sessões ativas do bot Flowise",
        "tags": [
          "Dify Controller"
        ],
        "description": "Fetch session flowise",
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "Nome da instância.",
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "flowiseId",
            "in": "path",
            "required": true,
            "description": "Id Bot Flowise",
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Sessões recuperadas com sucesso.",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "sessions": {
                      "type": "string"
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/flowise/fetchSettings/{instance}": {
      "get": {
        "operationId": "fetchFlowiseSettings",
        "summary": "Recupera os configurações do bot flowise",
        "tags": [
          "Dify Controller"
        ],
        "description": "Fetch settings flowise",
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "Nome da instância.",
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Sessões recuperadas com sucesso.",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "sessions": {
                      "type": "string"
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/flowise/changeStatus/{instance}": {
      "post": {
        "operationId": "changeFlowiseStatus",
        "summary": "Atualiza o status de uma instância Flowise",
        "tags": [
          "Flowise Controller"
        ],
        "description": "Atualiza os settings do bot flowise",
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "Nome da instância",
            "schema": {
              "type": "string"
            }
          }
        ],
        "requestBody": {
          "description": "Corpo da requisição contendo o identificador remoto e o status a ser atualizado",
          "required": true,
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "remoteJid": {
                    "type": "string",
                    "description": "Identificador remoto do WhatsApp no formato JID",
                    "example": "5511912345678@s.whatsapp.net"
                  },
                  "status": {
                    "type": "string",
                    "description": "Novo status para a instância",
                    "enum": [
                      "opened",
                      "paused",
                      "closed"
                    ],
                    "example": "closed"
                  }
                },
                "required": [
                  "remoteJid",
                  "status"
                ]
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Status da instância Flowise atualizado com sucesso",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "message": {
                      "type": "string",
                      "example": "Status alterado com sucesso"
                    }
                  }
                }
              }
            }
          },
          "400": {
            "description": "Erro na requisição, parâmetros inválidos ou ausentes",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "error": {
                      "type": "string",
                      "example": "Parâmetros inválidos fornecidos"
                    }
                  }
                }
              }
            }
          },
          "404": {
            "description": "Instância do Flowise não encontrada",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "error": {
                      "type": "string",
                      "example": "Instância não encontrada"
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/evolutionBot/create/{instance}": {
      "post": {
        "operationId": "createEvolutionBot",
        "summary": "Create Evolution Bot",
        "tags": [
          "Evolution Bot Controller"
        ],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "Name of the instance",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Create a new Evolution Bot configuration.",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": [
                  "enabled",
                  "apiUrl",
                  "expire",
                  "keywordFinish",
                  "delayMessage",
                  "unknownMessage",
                  "listeningFromMe",
                  "stopBotFromMe",
                  "keepOpen",
                  "debounceTime",
                  "triggerType",
                  "triggerOperator",
                  "triggerValue"
                ],
                "properties": {
                  "enabled": {
                    "type": "boolean",
                    "description": "Enable Evolution Bot"
                  },
                  "apiUrl": {
                    "type": "string",
                    "description": "API URL for the bot"
                  },
                  "apiKey": {
                    "type": "string",
                    "description": "API Key for authentication (optional)"
                  },
                  "triggerType": {
                    "type": "string",
                    "description": "Trigger type, e.g., 'all' or 'keyword'"
                  },
                  "triggerOperator": {
                    "type": "string",
                    "description": "Operator logic, e.g., 'contains', 'equals', 'startsWith', 'endsWith', 'regex'"
                  },
                  "triggerValue": {
                    "type": "string",
                    "description": "Trigger value, e.g., 'test'"
                  },
                  "expire": {
                    "type": "number",
                    "description": "Expiration time for the session (in seconds)"
                  },
                  "keywordFinish": {
                    "type": "string",
                    "description": "Keyword to terminate the session"
                  },
                  "delayMessage": {
                    "type": "number",
                    "description": "Delay time (in ms) for sending messages"
                  },
                  "unknownMessage": {
                    "type": "string",
                    "description": "Message displayed when an unknown input is received"
                  },
                  "listeningFromMe": {
                    "type": "boolean",
                    "description": "Listen to messages sent by the bot owner"
                  },
                  "stopBotFromMe": {
                    "type": "boolean",
                    "description": "Stop bot when the owner sends a message"
                  },
                  "keepOpen": {
                    "type": "boolean",
                    "description": "Keep the session open after processing messages"
                  },
                  "debounceTime": {
                    "type": "number",
                    "description": "Time delay to debounce messages"
                  },
                  "ignoreJids": {
                    "type": "array",
                    "items": {
                      "type": "string"
                    },
                    "description": "List of JIDs to ignore"
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Evo bot criado com sucesso",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "message": {
                      "type": "string",
                      "example": "Sucess"
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/evolutionBot/fetch/:evolutionBotId/{instance}": {
      "get": {
        "operationId": "findEvo",
        "summary": "Find Bot Evo",
        "tags": [
          "OpenAI Controller"
        ],
        "description": "Update evo bot.",
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "Name of the instance",
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "evolutionBotId",
            "in": "path",
            "required": true,
            "description": "ID of the evo bot",
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successfully fetched sessions",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "message": {
                      "type": "string",
                      "example": "OK"
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/evolutionBot/update/:evolutionBotId/{instance}": {
      "put": {
        "operationId": "updateEvolutionBot",
        "summary": "Update Evolution Bot",
        "tags": [
          "Evolution Bot Controller"
        ],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "evolutionBotId",
            "in": "path",
            "required": true,
            "description": "ID of the Evolution Bot to update",
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "Name of the instance",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Update an existing Evolution Bot configuration.",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": [
                  "enabled",
                  "apiUrl",
                  "triggerType",
                  "triggerOperator",
                  "triggerValue",
                  "expire",
                  "keywordFinish",
                  "delayMessage",
                  "unknownMessage",
                  "listeningFromMe",
                  "stopBotFromMe",
                  "keepOpen",
                  "debounceTime"
                ],
                "properties": {
                  "enabled": {
                    "type": "boolean",
                    "description": "Enable or disable the Evolution Bot"
                  },
                  "apiUrl": {
                    "type": "string",
                    "description": "API URL for the bot"
                  },
                  "apiKey": {
                    "type": "string",
                    "description": "API Key for authentication (optional)"
                  },
                  "triggerType": {
                    "type": "string",
                    "description": "Trigger type, e.g., 'all' or 'keyword'"
                  },
                  "triggerOperator": {
                    "type": "string",
                    "description": "Operator logic, e.g., 'contains', 'equals', 'startsWith', 'endsWith', 'regex'"
                  },
                  "triggerValue": {
                    "type": "string",
                    "description": "Trigger value, e.g., 'test'"
                  },
                  "expire": {
                    "type": "number",
                    "description": "Expiration time for the session (in seconds)"
                  },
                  "keywordFinish": {
                    "type": "string",
                    "description": "Keyword to terminate the session"
                  },
                  "delayMessage": {
                    "type": "number",
                    "description": "Delay time (in ms) for sending messages"
                  },
                  "unknownMessage": {
                    "type": "string",
                    "description": "Message displayed when an unknown input is received"
                  },
                  "listeningFromMe": {
                    "type": "boolean",
                    "description": "Listen to messages sent by the bot owner"
                  },
                  "stopBotFromMe": {
                    "type": "boolean",
                    "description": "Stop bot when the owner sends a message"
                  },
                  "keepOpen": {
                    "type": "boolean",
                    "description": "Keep the session open after processing messages"
                  },
                  "debounceTime": {
                    "type": "number",
                    "description": "Time delay to debounce messages"
                  },
                  "ignoreJids": {
                    "type": "array",
                    "items": {
                      "type": "string"
                    },
                    "description": "List of JIDs to ignore"
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Evo bot atualizado com sucesso",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "message": {
                      "type": "string",
                      "example": "Sucess"
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/evolutionBot/find/{instance}": {
      "get": {
        "operationId": "findEvo",
        "summary": "Find Bots Evo",
        "tags": [
          "OpenAI Controller"
        ],
        "description": "Update evo bots.",
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "Name of the instance",
            "schema": {
              "type": "string"
            }
          }
        ],
        "responses": {
          "200": {
            "description": "Successfully fetched sessions",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "message": {
                      "type": "string",
                      "example": "OK"
                    }
                  }
                }
              }
            }
          }
        }
      }
    },
    "/evolutionBot/delete/:evolutionBotId/{instance}": {
      "delete": {
        "operationId": "deleteBot",
        "summary": "Delete Bot Evolution",
        "tags": [
          "Group Controller"
        ],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "Name of the instance ",
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "evolutionBotId",
            "in": "query",
            "required": true,
            "description": "Id Bot Evolution",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Delete Bot",
        "responses": {
          "200": {
            "description": "Ok",
            "content": {}
          }
        }
      }
    },
    "/evolutionBot/settings/{instance}": {
      "post": {
        "operationId": "createEvolutionBotSettings",
        "summary": "Create Evolution Bot Settings",
        "tags": [
          "Evolution Bot Controller"
        ],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "Name of the instance",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Configure settings for an Evolution Bot.",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "required": [
                  "expire",
                  "keywordFinish",
                  "delayMessage",
                  "unknownMessage",
                  "listeningFromMe",
                  "stopBotFromMe",
                  "keepOpen",
                  "debounceTime",
                  "botIdFallback"
                ],
                "properties": {
                  "expire": {
                    "type": "number",
                    "description": "Expiration time for the session (in seconds)"
                  },
                  "keywordFinish": {
                    "type": "string",
                    "description": "Keyword to terminate the session"
                  },
                  "delayMessage": {
                    "type": "number",
                    "description": "Delay time (in ms) for sending messages"
                  },
                  "unknownMessage": {
                    "type": "string",
                    "description": "Message displayed when an unknown input is received"
                  },
                  "listeningFromMe": {
                    "type": "boolean",
                    "description": "Listen to messages sent by the bot owner"
                  },
                  "stopBotFromMe": {
                    "type": "boolean",
                    "description": "Stop bot when the owner sends a message"
                  },
                  "keepOpen": {
                    "type": "boolean",
                    "description": "Keep the session open after processing messages"
                  },
                  "debounceTime": {
                    "type": "number",
                    "description": "Time delay to debounce messages"
                  },
                  "ignoreJids": {
                    "type": "array",
                    "items": {
                      "type": "string"
                    },
                    "description": "List of JIDs to ignore"
                  },
                  "botIdFallback": {
                    "type": "string",
                    "description": "Fallback bot ID to use"
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Ok",
            "content": {}
          }
        }
      }
    },
    "/evolutionBot/fetchSettings/{instance}": {
      "get": {
        "operationId": "findEvolutionBot",
        "summary": "Find EvoBot",
        "tags": [
          "Evolution Bot Controller"
        ],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "Name of the instance",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Find evolution bot settings",
        "responses": {
          "200": {
            "description": "Ok",
            "content": {}
          }
        }
      }
    },
    "/evolutionBot/fetchSessions/:evolutionBotId/{instance}": {
      "get": {
        "operationId": "findEvolutionBot",
        "summary": "Find EvoBot session",
        "tags": [
          "Evolution Bot Controller"
        ],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "Name of the instance",
            "schema": {
              "type": "string"
            }
          },
          {
            "name": "evolutionBotId",
            "in": "path",
            "required": true,
            "description": "ID of the evo bot",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Find evolution bot settings",
        "responses": {
          "200": {
            "description": "Ok",
            "content": {}
          }
        }
      }
    },
    "/evolutionBot/changeStatus/{instance}": {
      "post": {
        "operationId": "changeEvobotStatus",
        "summary": "Change Session Status",
        "tags": [
          "Typebot Controller"
        ],
        "deprecated": false,
        "security": [
          {
            "ApiKeyAuth": []
          }
        ],
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "Name of the instance",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Change status session",
        "requestBody": {
          "content": {
            "application/json": {
              "schema": {
                "type": "object",
                "properties": {
                  "remoteJid": {
                    "type": "string",
                    "description": "{{remoteJid}}"
                  },
                  "status": {
                    "type": "string",
                    "description": "Typebot status, types: opened, paused, closed"
                  }
                }
              }
            }
          }
        },
        "responses": {
          "200": {
            "description": "Ok",
            "content": {}
          }
        }
      }
    },
    "/": {
      "get": {
        "operationId": "getEvoInfo",
        "summary": "Get information about your EvolutionAPI",
        "deprecated": false,
        "parameters": [
          {
            "name": "instance",
            "in": "path",
            "required": true,
            "description": "ID of the instance to connect",
            "schema": {
              "type": "string"
            }
          }
        ],
        "description": "Get information about your EvolutionAPI",
        "responses": {
          "200": {
            "description": "Ok",
            "content": {
              "application/json": {
                "schema": {
                  "type": "object",
                  "properties": {
                    "status": {
                      "type": "integer",
                      "description": "The HTTP status of the response"
                    },
                    "message": {
                      "type": "string",
                      "description": "Descriptive message about the current state of the API"
                    },
                    "version": {
                      "type": "string",
                      "description": "The current version of the API"
                    },
                    "swagger": {
                      "type": "string",
                      "description": "URL to the API's Swagger documentation"
                    },
                    "manager": {
                      "type": "string",
                      "description": "URL to the API manager"
                    },
                    "documentation": {
                      "type": "string",
                      "description": "URL to the detailed API documentation"
                    }
                  },
                  "example": {
                    "status": 200,
                    "message": "Welcome to the Evolution API, it is working!",
                    "version": "1.7.4",
                    "swagger": "http://example.evolution-api.com/docs",
                    "manager": "http://example.evolution-api.com/manager",
                    "documentation": "https://doc.evolution-api.com"
                  }
                }
              }
            }
          }
        }
      }
    }
  },
  "components": {
    "securitySchemes": {
      "ApiKeyAuth": {
        "type": "apiKey",
        "in": "header",
        "name": "apikey",
        "description": "Your authorization key header"
      }
    }
  }
}

```

# package.json

```json
{
  "dependencies": {
    "react-icons": "^5.0.1"
  }
}

```

# README.md

```md
# Mintlify Starter Kit 
 
Click on `Use this template` to copy the Mintlify starter kit. The starter kit contains examples including

- Guide pages
- Navigation
- Customizations
- API Reference pages
- Use of popular components

### Development

Install the [Mintlify CLI](https://www.npmjs.com/package/mintlify) to preview the documentation changes locally. To install, use the following command

\`\`\`
npm i -g mintlify
\`\`\`

Run the following command at the root of your documentation (where mint.json is)

\`\`\`
mintlify dev
\`\`\`

### Publishing Changes

Install our Github App to autopropagate changes from youre repo to your deployment. Changes will be deployed to production automatically after pushing to the default branch. Find the link to install on your dashboard. 

#### Troubleshooting

- Mintlify dev isn't running - Run `mintlify install` it'll re-install dependencies.
- Page loads as a 404 - Make sure you are running in a folder with `mint.json`

```

# v1\api-reference\authentication.mdx

```mdx
---
title: 'Autenticação'
---

Em Definições selecione a opção Referência de API. Copie o token gerado e use no header Authorization nas suas requisições como `Bearer <token copiado>`.

```

# v1\api-reference\chat-controller\archive-chat.mdx

```mdx
---
title: 'Archive Chat'
openapi: openapi-v1 PUT /chat/archiveChat/{instance}
---
```

# v1\api-reference\chat-controller\check-is-whatsapp.mdx

```mdx
---
title: 'Check is WhatsApp'
openapi: openapi-v1 POST /chat/whatsappNumbers/{instance}
---
```

# v1\api-reference\chat-controller\delete-message-for-everyone.mdx

```mdx
---
title: 'Delete Message for Everyone'
openapi: openapi-v1 DELETE /chat/deleteMessageForEveryone/{instance}
---
```

# v1\api-reference\chat-controller\fetch-profilepic-url.mdx

```mdx
---
title: 'Fetch Profile Picture URL'
openapi: openapi-v1 POST /chat/fetchProfilePictureUrl/{instance}
---
```

# v1\api-reference\chat-controller\find-chats.mdx

```mdx
---
title: 'Find Chats'
openapi: openapi-v1 GET /chat/findChats/{instance}
---
```

# v1\api-reference\chat-controller\find-contacts.mdx

```mdx
---
title: 'Find Contacts'
openapi: openapi-v1 POST /chat/findContacts/{instance}
---
```

# v1\api-reference\chat-controller\find-messages.mdx

```mdx
---
title: 'Find Messages'
openapi: openapi-v1 POST /chat/findMessages/{instance}
---
```

# v1\api-reference\chat-controller\find-status-message.mdx

```mdx
---
title: 'Find Status Message'
openapi: openapi-v1 POST /chat/findStatusMessage/{instance}
---
```

# v1\api-reference\chat-controller\mark-as-read.mdx

```mdx
---
title: 'Mark Message As Read'
openapi: openapi-v1 PUT /chat/markMessageAsRead/{instance}
---
```

# v1\api-reference\chat-controller\send-presence.mdx

```mdx
---
title: 'Send Presence'
openapi: openapi-v1 POST /chat/sendPresence/{instance}
---
```

# v1\api-reference\chat-controller\update-message.mdx

```mdx
---
title: 'Update Message'
openapi: openapi-v1 PUT /chat/updateMessage/{instance}
---
```

# v1\api-reference\get-information.mdx

```mdx
---
title: 'Get Information'
openapi: openapi-v1  GET /
---
```

# v1\api-reference\group-controller\accept-invite-code.mdx

```mdx
---
title: 'Accept Invite Code'
openapi: openapi-v1 GET /group/acceptInviteCode/{instance}
---
```

# v1\api-reference\group-controller\fetch-all-groups.mdx

```mdx
---
title: 'Fetch All Groups'
openapi: openapi-v1 GET /group/fetchAllGroups/{instance}
---
```

# v1\api-reference\group-controller\fetch-invite-code.mdx

```mdx
---
title: 'Fetch Invite Code'
openapi: openapi-v1 GET /group/inviteCode/{instance}
---
```

# v1\api-reference\group-controller\find-group-by-invite-code.mdx

```mdx
---
title: 'Find Group by Invite Code'
openapi: openapi-v1 GET /group/inviteInfo/{instance}
---
```

# v1\api-reference\group-controller\find-group-by-jid.mdx

```mdx
---
title: 'Find Group by JID'
openapi: openapi-v1 GET /group/findGroupInfos/{instance}
---
```

# v1\api-reference\group-controller\find-participants.mdx

```mdx
---
title: 'Find Group Members'
openapi: openapi-v1 GET /group/participants/{instance}
---
```

# v1\api-reference\group-controller\group-create.mdx

```mdx
---
title: 'Create Group'
openapi: openapi-v1 POST /group/create/{instance}
---
```

# v1\api-reference\group-controller\leave-group.mdx

```mdx
---
title: 'Leave Group'
openapi: openapi-v1 DELETE /group/leaveGroup/{instance}
---
```

# v1\api-reference\group-controller\revoke-invite-code.mdx

```mdx
---
title: 'Revoke Invite Code'
openapi: openapi-v1 PUT /group/revokeInviteCode/{instance}
---
```

# v1\api-reference\group-controller\send-invite-url.mdx

```mdx
---
title: 'Send Group Invite'
openapi: openapi-v1 POST /group/sendInvite/{instance}
---
```

# v1\api-reference\group-controller\toggle-ephemeral.mdx

```mdx
---
title: 'Toggle Ephemeral'
openapi: openapi-v1 PUT /group/toggleEphemeral/{instance}
---
```

# v1\api-reference\group-controller\update-group-description.mdx

```mdx
---
title: 'Update Group Description'
openapi: openapi-v1 PUT /group/updateGroupDescription/{instance}
---
```

# v1\api-reference\group-controller\update-group-picture.mdx

```mdx
---
title: 'Update Group Picture'
openapi: openapi-v1 PUT /group/updateGroupPicture/{instance}
---
```

# v1\api-reference\group-controller\update-group-subject.mdx

```mdx
---
title: 'Update Group Subject'
openapi: openapi-v1 PUT /group/updateGroupSubject/{instance}
---
```

# v1\api-reference\group-controller\update-participant.mdx

```mdx
---
title: 'Update Group Members'
openapi: openapi-v1 PUT /group/updateParticipant/{instance}
---
```

# v1\api-reference\group-controller\update-setting.mdx

```mdx
---
title: 'Update Group Setting'
openapi: openapi-v1 PUT /group/updateSetting/{instance}
---
```

# v1\api-reference\instance-controller\connection-state.mdx

```mdx
---
title: 'Connection State'
openapi: openapi-v1 GET /instance/connectionState/{instance}
---
```

# v1\api-reference\instance-controller\create-instance-basic.mdx

```mdx
---
title: 'Create Instance Basic'
openapi: openapi-v1 POST /instance/create
---
```

# v1\api-reference\instance-controller\delete-instance.mdx

```mdx
---
title: 'Delete Instance'
openapi: openapi-v1 DELETE /instance/delete/{instance}
---
```

# v1\api-reference\instance-controller\fetch-instances.mdx

```mdx
---
title: 'Fetch Instances'
openapi: openapi-v1 GET /instance/fetchInstances
---
```

# v1\api-reference\instance-controller\instance-connect.mdx

```mdx
---
title: 'Instance Connect'
openapi: openapi-v1 GET /instance/connect/{instance}
---
```

# v1\api-reference\instance-controller\logout-instance.mdx

```mdx
---
title: 'Logout Instance'
openapi: openapi-v1 DELETE /instance/logout/{instance}
---
```

# v1\api-reference\instance-controller\restart-instance.mdx

```mdx
---
title: 'Restart Instance'
openapi: openapi-v1 PUT /instance/restart/{instance}
---
```

# v1\api-reference\instance-controller\set-presence.mdx

```mdx
---
title: 'Set Presence'
openapi: openapi-v1 POST /instance/setPresence/{instance}
---
```

# v1\api-reference\integrations\chatwoot\find-chatwoot.mdx

```mdx
---
title: 'Find Chatwoot'
openapi: openapi-v1 GET /chatwoot/find/{instance}
---
```

# v1\api-reference\integrations\chatwoot\set-chatwoot.mdx

```mdx
---
title: 'Set Chatwoot'
openapi: openapi-v1 POST /chatwoot/set/{instance}
---
```

# v1\api-reference\integrations\rabbitmq\find-rabbitmq.mdx

```mdx
---
title: 'Find RabbitMQ'
openapi: openapi-v1 GET /rabbitmq/find/{instance}
---
```

# v1\api-reference\integrations\rabbitmq\set-rabbitmq.mdx

```mdx
---
title: 'Set RabbitMQ'
openapi: openapi-v1 POST /rabbitmq/set/{instance}
---
```

# v1\api-reference\integrations\sqs\find-sqs.mdx

```mdx
---
title: 'Find SQS'
openapi: openapi-v1 GET /sqs/find/{instance}
---
```

# v1\api-reference\integrations\sqs\set-sqs.mdx

```mdx
---
title: 'Set SQS'
openapi: openapi-v1 POST /sqs/set/{instance}
---
```

# v1\api-reference\integrations\typebot\change-session-status.mdx

```mdx
---
title: 'Change Typebot Status'
openapi: openapi-v1 POST /typebot/changeStatus/{instance}
---
```

# v1\api-reference\integrations\typebot\find-typebot.mdx

```mdx
---
title: 'Find Typebot'
openapi: openapi-v1 GET /typebot/find/{instance}
---
```

# v1\api-reference\integrations\typebot\set-typebot.mdx

```mdx
---
title: 'Set Typebot'
openapi: openapi-v1 POST /typebot/set/{instance}
---
```

# v1\api-reference\integrations\typebot\start-typebot.mdx

```mdx
---
title: 'Start Typebot'
openapi: openapi-v1 POST /typebot/start/{instance}
---
```

# v1\api-reference\integrations\websocket\find-websocket.mdx

```mdx
---
title: 'Set Chatwoot'
openapi: openapi-v1 POST /chatwoot/set/{instance}
---
```

# v1\api-reference\integrations\websocket\set-websocket.mdx

```mdx
---
title: 'Find Chatwoot'
openapi: openapi-v1 GET /chatwoot/find/{instance}
---
```

# v1\api-reference\message-controller\send-audio.mdx

```mdx
---
title: 'Send WhatsApp Audio'
openapi: openapi-v1 POST /message/sendWhatsAppAudio/{instance}
---
```

# v1\api-reference\message-controller\send-contact.mdx

```mdx
---
title: 'Send Contact'
openapi: openapi-v1 POST /message/sendContact/{instance}
---
```

# v1\api-reference\message-controller\send-list.mdx

```mdx
---
title: 'Send List'
openapi: openapi-v1 POST /message/sendList/{instance}
---
```

# v1\api-reference\message-controller\send-location.mdx

```mdx
---
title: 'Send Location'
openapi: openapi-v1  POST /message/sendLocation/{instance}
---
```

# v1\api-reference\message-controller\send-media.mdx

```mdx
---
title: 'Send Media'
openapi: openapi-v1  POST /message/sendMedia/{instance}
---
```

# v1\api-reference\message-controller\send-poll.mdx

```mdx
---
title: 'Send Poll'
openapi: openapi-v1  POST /message/sendPoll/{instance}
---
```

# v1\api-reference\message-controller\send-reaction.mdx

```mdx
---
title: 'Send Reaction'
openapi: openapi-v1  POST /message/sendReaction/{instance}
---
```

# v1\api-reference\message-controller\send-status.mdx

```mdx
---
title: 'Send Status'
openapi: openapi-v1  POST /message/sendStatus/{instance}
---
```

# v1\api-reference\message-controller\send-sticker.mdx

```mdx
---
title: 'Send Sticker'
openapi: openapi-v1  POST /message/sendSticker/{instance}
---
```

# v1\api-reference\message-controller\send-template.mdx

```mdx
---
title: 'Send Template'
openapi: openapi-v1  POST /message/sendTemplate/{instance}
---
```

# v1\api-reference\message-controller\send-text.mdx

```mdx
---
title: 'Send Plain Text'
openapi: openapi-v1  POST /message/sendText/{instance}
---
```

# v1\api-reference\profile-settings\fetch-business-profile.mdx

```mdx
---
title: 'Fetch Business Profile'
openapi: openapi-v1  POST /chat/fetchBusinessProfile/{instance}
---
```

# v1\api-reference\profile-settings\fetch-privacy-settings.mdx

```mdx
---
title: 'Fetch Privacy Settings'
openapi: openapi-v1  GET /chat/fetchPrivacySettings/{instance}
---
```

# v1\api-reference\profile-settings\fetch-profile.mdx

```mdx
---
title: 'Fetch Profile'
openapi: openapi-v1  POST /chat/fetchProfile/{instance}
---
```

# v1\api-reference\profile-settings\remove-profile-picture.mdx

```mdx
---
title: 'Remove Profile Picture'
openapi: openapi-v1  PUT /chat/removeProfilePicture/{instance}
---
```

# v1\api-reference\profile-settings\update-privacy-settings.mdx

```mdx
---
title: 'Update Privacy Settings'
openapi: openapi-v1  PUT /chat/updatePrivacySettings/{instance}
---
```

# v1\api-reference\profile-settings\update-profile-name.mdx

```mdx
---
title: 'Update Profile Name'
openapi: openapi-v1  POST /chat/updateProfileName/{instance}
---
```

# v1\api-reference\profile-settings\update-profile-picture.mdx

```mdx
---
title: 'Update Profile Picture'
openapi: openapi-v1  PUT /chat/updateProfilePicture/{instance}
---
```

# v1\api-reference\profile-settings\update-profile-status.mdx

```mdx
---
title: 'Update Profile Status'
openapi: openapi-v1  POST /chat/updateProfileStatus/{instance}
---
```

# v1\api-reference\settings\get.mdx

```mdx
---
title: 'Find Settings'
openapi: openapi-v1  GET /settings/find/{instance}
---
```

# v1\api-reference\settings\set.mdx

```mdx
---
title: 'Set Settings'
openapi: openapi-v1  POST /settings/set/{instance}
---
```

# v1\api-reference\webhook\get.mdx

```mdx
---
title: 'Find Webhook'
openapi: openapi-v1  GET /webhook/find/{instance}
---
```

# v1\api-reference\webhook\set.mdx

```mdx
---
title: 'Set Webhook'
openapi: openapi-v1  POST /webhook/set/{instance}
---
```

# v1\en\configuration\available-resources.mdx

```mdx
---
title: 'Available Resources'
icon: wrench
---

## Messaging and Group features

### Messages (Individual or Group)

| Feature | Availability | Description |
|-:|:-:|-|
| Send Text                 | ✅ | (Plain, bold, italic, strikethrough, monospaced text and emojis) |
| Send Media                | ✅ | (Vídeo, image and document) |
| Send Narrated Audio       | ✅ | (Working fine in Android and iOS) |
| Send Location             | ✅ | (With name and description of the place) |
| Send Contact              | ✅ | (With Name, Company, Phone, Email and Url) |
| Send Reaction             | ✅ | (Send any emoji for reaction) |
| Send Link Preview         | ✅ | (Searching for SEO information) 🆕 |
| Send Reply                | ✅ | (Mark messages in reply) 🆕 |
| Send Mention              | ✅ | (Individual, some or all members) 🆕 |
| Send Poll Message         | ✅ | (Send and receive votes from a poll) 🆕 |
| Send Status/Storie        | ✅ | (Text, linkpreview, vídeo, image and waveform) 🆕 |
| Send Sticker              | ✅ | (Static Image) 🆕 |
| Send List (Homolog)       | ✅ | (Testing) |
| Send Buttons (Deprecated) | ❌ | (Only works on Cloud API) |

### Profile

|            Feature | Availability | Description                               |
| -----------------: | :----------: | ----------------------------------------- |
|        Update Name |      ✅      | (Change the connected profile name)       |
|     Update Picture |      ✅      | (Change the connected profile picture) 🆕 |
|      Update Status |      ✅      | (Change the connected profile status) 🆕  |
| And many others... |              |                                           |

### Group

|            Feature | Availability | Description                            |
| ------------------ | :----------: | -------------------------------------- |
|       Create Group |      ✅      | (New groups)                           |
|     Update Picture |      ✅      | (Change group picture)                 |
|     Update Subject |      ✅      | (Change group name) 🆕                 |
| Update Description |      ✅      | (Change group description) 🆕          |
|   Fetch All Groups |      ✅      | (Fetch all groups and participants) 🆕 |
| And many others... |              |                                         |

```

# v1\en\configuration\webhooks.mdx

```mdx
---
title: 'Webhooks'
icon: webhook
---

Webhooks enable real-time integration between the Evolution API and WhatsApp™, allowing automated data synchronization and sharing.

It is exactly this feature that enables the creation of self-service bots and multi-service systems.

## Activating webhooks

There is two ways to activate the webhook:
  - In the `.env` with global events
  - By calling the endpoint `/webhook/instance`

### Instance webhook events

Most of the users will prefer the activation by instance, this way is easier to control the events that are received, however in some cases a global webhook is needed this could be done by using the global webhook variable.

Here is an example with some commonly listened events:

\`\`\`json /webhook/instance
{
  "url": "{{webhookUrl}}",
    "webhook_by_events": false,
    "webhook_base64": false,
    "events": [
        "QRCODE_UPDATED",
        "MESSAGES_UPSERT",
        "MESSAGES_UPDATE",
        "MESSAGES_DELETE",
        "SEND_MESSAGE",
        "CONNECTION_UPDATE",
        "TYPEBOT_START",
        "TYPEBOT_CHANGE_STATUS"
    ]    
}
\`\`\`
### Parameters

| Parameter         | Type      | Required  | Description |
| ----------------- | --------- | --------- | ----------- |
| enabled           | boolean   | Required  | Enter "true" to create or change Webhook data, or "false" if you want to stop using it. |
| url               | string    | Required  | Webhook URL to receive event data. |
| webhook_by_events | boolean   | Optional  | Want to generate a specific Webhook URL for each of your events. |
| events            | array     | Optional  | List of events to be processed. If you don't want to use some of these events, just remove them from the list. |

<Note>
It is extremely necessary that the payload obey the rules for creating a JSON file, considering the correct arrangement of items, formatting, square brackets, braces and commas, etc.
Before consuming the endpoint, if you have questions about the JSON formatting, go to https://jsonlint.com/ and validate.
</Note>

### Global Webhook events 

Each instance's Webhook URL and events will be requested at the time it is created
Define a global webhook that will listen for enabled events from all instances

\`\`\`bash .env
WEBHOOK_GLOBAL_URL=''
WEBHOOK_GLOBAL_ENABLED=false

# With this option activated, you work with a url per webhook event, respecting the global url and the name of each event
WEBHOOK_GLOBAL_WEBHOOK_BY_EVENTS=false

## Set the events you want to hear, all listed events below are supported
WEBHOOK_EVENTS_APPLICATION_STARTUP=false
WEBHOOK_EVENTS_QRCODE_UPDATED=true

# Some extra events for errors
WEBHOOK_EVENTS_ERRORS=false
WEBHOOK_EVENTS_ERRORS_WEBHOOK=
\`\`\`
## Supported events

These are the available and supported webhook events:

| **Environment variable**   | **URL**                    | **Description** |
| -------------------------- | -------------------------- | --------------- |
| APPLICATION_STARTUP        | /application-startup       | Notifies you when an application startup |
| QRCODE_UPDATED             | /qrcode-updated            | Sends the base64 of the qrcode for reading |
| CONNECTION_UPDATE          | /connection-update         | Informs the status of the connection with WhatsApp |
| MESSAGES_SET               | /messages-set              | Sends a list of all your messages uploaded on WhatsApp. This event occurs only once |
| MESSAGES_UPSERT            | /messages-upsert           | Notifies you when a message is received |
| MESSAGES_UPDATE            | /messages-update           | Tells you when a message is updated |
| MESSAGES_DELETE            | /messages-delete           | Tells you when a message is deleted |
| SEND_MESSAGE               | /send-message              | Notifies when a message is sent |
| CONTACTS_SET               | /contacts-set              | Performs initial loading of all contacts.This event occurs only once |
| CONTACTS_UPSERT            | /contacts-upsert           | Reloads all contacts with additional information.This event occurs only once |
| CONTACTS_UPDATE            | /contacts-update           | Informs you when the chat is updated |
| PRESENCE_UPDATE            | /presence-update           | Informs if the user is online, if he is performing some action like writing or recording and his last seen: 'unavailable', 'available', 'composing', 'recording', 'paused' |
| CHATS_SET                  | /chats-set                 | Send a list of all loaded chats |
| CHATS_UPDATE               | /chats-update              | Informs you when the chat is updated |
| CHATS_UPSERT               | /chats-upsert              | Sends any new chat information |
| CHATS_DELETE               | /chats-delete              | Notify you when a message is deleted |
| GROUPS_UPSERT              | /groups-upsert             | Notifies when a group is created |
| GROUPS_UPDATE              | /groups-update             | Notifies when a group has its information updated |
| GROUP_PARTICIPANTS_UPDATE  | /group-participants-update | Notifies when an action occurs involving a participant: 'add', 'remove', 'promote', 'demote' |
| NEW_TOKEN                  | /new-jwt                   | Notifies when the token (jwt) is updated |

## Webhook by events

When enabling the WEBHOOK_BY_EVENTS options in the global and local webhooks, the following paths will be added at the end of the webhook.

<Note>
Add on the end of the url the event name with a dash (-) between the words that compose the event for the event.
</Note>
 
### Example

 Assuming your webhook url was `https://sub.domain.com/webhook/`. Evolution will add automatically in the end of the url the name of the event when `webhook_by_events` is set to true.

|  **Event**                 | **New webhook by Events URL**                            |
| -------------------------- | -------------------------------------------------------- |
| APPLICATION_STARTUP        | https://sub.domain.com/webhook/application-startup       |
| QRCODE_UPDATED             | https://sub.domain.com/webhook/qrcode-updated            |
| CONNECTION_UPDATE          | https://sub.domain.com/webhook/connection-update         |
| MESSAGES_SET               | https://sub.domain.com/webhook/messages-set              |
| MESSAGES_UPSERT            | https://sub.domain.com/webhook/messages-upsert           |
| MESSAGES_UPDATE            | https://sub.domain.com/webhook/messages-update           |
| MESSAGES_DELETE            | https://sub.domain.com/webhook/messages-delete           |
| SEND_MESSAGE               | https://sub.domain.com/webhook/send-message              |
| CONTACTS_SET               | https://sub.domain.com/webhook/contacts-set              |
| CONTACTS_UPSERT            | https://sub.domain.com/webhook/contacts-upsert           |
| CONTACTS_UPDATE            | https://sub.domain.com/webhook/contacts-update           |
| PRESENCE_UPDATE            | https://sub.domain.com/webhook/presence-update           |
| CHATS_SET                  | https://sub.domain.com/webhook/chats-set                 |
| CHATS_UPDATE               | https://sub.domain.com/webhook/chats-update              |
| CHATS_UPSERT               | https://sub.domain.com/webhook/chats-upsert              |
| CHATS_DELETE               | https://sub.domain.com/webhook/chats-delete              |
| GROUPS_UPSERT              | https://sub.domain.com/webhook/groups-upsert             |
| GROUPS_UPDATE              | https://sub.domain.com/webhook/groups-update             |
| GROUP_PARTICIPANTS_UPDATE  | https://sub.domain.com/webhook/group-participants-update |
| NEW_TOKEN                  | https://sub.domain.com/webhook/new-jwt                   |

 ## Find Webhook

If necessary, there is an option to find any active webhook on the specific instance.

| Method | Endpoint                              |
| ------ | ------------------------------------- |
| GET    | [baseUrl]/webhook/find/[instance]     |


### Data returned from the Request:

Calling the endpoint will return all the information about the webhook that is being used by the instance.

\`\`\`json Result
{
  "enabled": true,
  "url": "[url]",
  "webhookByEvents": false,
  "events": [
    [events]
  ]
}
\`\`\`

```

# v1\en\env.mdx

```mdx
---
title: Environment Variables
icon: gear
---

See the example env file in the [official repository](https://github.com/EvolutionAPI/evolution-api/blob/main/Docker/.env.example).

## Key Variables
| Variable | Description | Example |
| --- | --- | --- |
| `SERVER_URL` | The address for your running server. This address is used to return internal request data, such as webhook links. | https://example.evolution-api.com |
| `WEBSOCKET_ENABLED` | Enable or disable WebSocket | true |
| `WEBSOCKET_GLOBAL_EVENTS` | Enable Websocket globally | true |
| `CONFIG_SESSION_PHONE_CLIENT` | Name that will be displayed on smartphone connection | EvolutionAPI |
| `CONFIG_SESSION_PHONE_NAME` | Browser name that will be displayed on smartphone connection | Chrome |

## Logs

| Variable | Description | Example |
| --- | --- | --- |
| `LOG_LEVEL` | Logs to be shown: ERROR, WARN, DEBUG, INFO, LOG, VERBOSE, DARK, WEBHOOKS | ERROR,WARN,DEBUG,INFO,LOG,VERBOSE,DARK,WEBHOOKS |
| `LOG_COLOR` | Show colors in Logs (true or false) | true |
| `LOG_BAILEYS` | Which Baileys logs to show: "fatal", "error", "warn", "info", "debug", and "trace" | error |

## Temporary Storage
Temporary data storage. Values are `true` or `false` to store or not.

| Variable | Description |
| --- | --- |
| `STORE_MESSAGES` | Store messages |
| `STORE_MESSAGE_UP` | Store message updates |
| `STORE_CONTACTS` | Store contacts |
| `STORE_CHATS` | Store chats |

## Temporary Storage Cleaning
Cleaning temporary storage.

| Variable | Description |
| --- | --- |
| `CLEAN_STORE_CLEANING_INTERVAL` | Cleaning interval in seconds |
| `CLEAN_STORE_MESSAGES` | Whether to delete messages (true or false) |
| `CLEAN_STORE_MESSAGE_UP` | Whether to delete message updates (true or false) |
| `CLEAN_STORE_CONTACTS` | Whether to delete contacts (true or false) |
| `CLEAN_STORE_CHATS` | Whether to delete chats (true or false) |

## Persistent Storage
Connection configurations:

| Variable | Description | Example |
| --- | --- | --- |
| `DATABASE_ENABLED` | Whether persistent storage is enabled | true |
| `DATABASE_CONNECTION_URI` | MongoDB connection URI | mongodb://username:password@host:port/database |
| `DATABASE_CONNECTION_DB_PREFIX_NAME` | Prefix name for database connection logs | error |

Which data to save (true or false):
| Variable | Description |
| --- | --- |
| `DATABASE_SAVE_DATA_INSTANCE` | Save instance data |
| `DATABASE_SAVE_DATA_NEW_MESSAGE` | Save new messages |
| `DATABASE_SAVE_MESSAGE_UPDATE` | Save message updates |
| `DATABASE_SAVE_DATA_CONTACTS` | Save contacts |
| `DATABASE_SAVE_DATA_CHATS` | Save chats |

## Redis

| Variable | Description | Example |
| --- | --- | --- |
| `CACHE_REDIS_ENABLED`        | Whether Redis is enabled (true or false)        | true |
| `CACHE_REDIS_URI`            | Redis connection URI                            | redis://redis:6379 |
| `CACHE_REDIS_PREFIX_KEY`     | Key name prefix                                 | evolution |
| `CACHE_REDIS_TTL`            | Time to keep cached data in Redis               | 604800 |
| `CACHE_REDIS_SAVE_INSTANCES` | Save WhatsApp connection credentials on Redis   | false |
| `CACHE_LOCAL_ENABLED`        | Cache data in memory (an alternative for Redis) | false |
| `CACHE_LOCAL_TTL`            | Time to keep cached data in memory              | 604800 |

## RabbitMQ

| Variable                                      | Description                                                                 | Example |
|-----------------------------------------------|-----------------------------------------------------------------------------|--------:|
| `RABBITMQ_ENABLED`                            | Enables RabbitMQ (true or false)                                            | true    |
| `RABBITMQ_GLOBAL_ENABLED`                     | Enables RabbitMQ globally (true or false)                                   | false   |
| `RABBITMQ_URI`                                | RabbitMQ connection URI                                                     | amqp://guest:guest@rabbitmq:5672 |
| `RABBITMQ_EXCHANGE_NAME`                      | Exchange name                                                               | evolution_exchange |
| `RABBITMQ_EVENTS_APPLICATION_STARTUP`         | Sends an event on app startup                                               | false   |
| `RABBITMQ_EVENTS_QRCODE_UPDATED`              | Sends QR Code Update events                                                 | true    |
| `RABBITMQ_EVENTS_MESSAGES_SET`                | Sends Message Creation events (message retrieval)                           | true    |
| `RABBITMQ_EVENTS_MESSAGES_UPSERT`             | Sends Message Receipt events                                                | true    |
| `RABBITMQ_EVENTS_MESSAGES_UPDATE`             | Sends Message Update events                                                 | true    |
| `RABBITMQ_EVENTS_MESSAGES_DELETE`             | Sends Message Deletion events                                               | true    |
| `RABBITMQ_EVENTS_SEND_MESSAGE`                | Sends Message Sending events                                                | true    |
| `RABBITMQ_EVENTS_CONTACTS_SET`                | Sends Contact Creation events                                               | true    |
| `RABBITMQ_EVENTS_CONTACTS_UPSERT`             | Sends Contact Creation events (contact retrieval)                           | true    |
| `RABBITMQ_EVENTS_CONTACTS_UPDATE`             | Sends Contact Update events                                                 | true    |
| `RABBITMQ_EVENTS_PRESENCE_UPDATE`             | Sends Presence Update events ("typing..." or "recording...")                | true    |
| `RABBITMQ_EVENTS_CHATS_SET`                   | Sends Chat Creation events (chat retrieval)                                 | true    |
| `RABBITMQ_EVENTS_CHATS_UPSERT`                | Sends Chat Creation events (message receipt or sending in new chats)        | true    |
| `RABBITMQ_EVENTS_CHATS_UPDATE`                | Sends Chat Update events                                                    | true    |
| `RABBITMQ_EVENTS_CHATS_DELETE`                | Sends Chat Deletion events                                                  | true    |
| `RABBITMQ_EVENTS_GROUPS_UPSERT`               | Sends Group Creation events                                                 | true    |
| `RABBITMQ_EVENTS_GROUPS_UPDATE`               | Sends Group Update events                                                   | true    |
| `RABBITMQ_EVENTS_GROUP_PARTICIPANTS_UPDATE`   | Sends Group Participant Update events                                       | true    |
| `RABBITMQ_EVENTS_CONNECTION_UPDATE`           | Sends Connection Update events                                              | true    |
| `RABBITMQ_EVENTS_LABELS_EDIT`                 | Sends Label Edit events                                                     | true    |
| `RABBITMQ_EVENTS_LABELS_ASSOCIATION`          | Sends Label Association events                                              | true    |
| `RABBITMQ_EVENTS_CALL`                        | Sends Call events                                                           | true    |
| `RABBITMQ_EVENTS_TYPEBOT_START`               | Sends Typebot flow start events                                             | false   |
| `RABBITMQ_EVENTS_TYPEBOT_CHANGE_STATUS`       | Sends Typebot status update events                                          | false   |

## SQS

| Variable                  | Description                             |
| ------------------------- | --------------------------------------- |
| `SQS_ENABLED`             | Whether SQS is enabled (true or false)  |
| `SQS_ACCESS_KEY_ID`       | SQS access key ID                       |
| `SQS_SECRET_ACCESS_KEY`   | SQS access key                          |
| `SQS_ACCOUNT_ID`          | Account ID                              |
| `SQS_REGION`              | SQS region                              |

## Instances

| Variable | Description | Example |
| --- | --- | --- |
| `DEL_INSTANCE` | In how many minutes an instance will be deleted if not connected. Use "false" to never delete. | 5 |
| `DEL_TEMP_INSTANCES` | Delete closed instances on startup | true |

## CORS

| Variable | Description | Example |
| --- | --- | --- |
| `CORS_ORIGIN` | Allowed origins for the API, separated by commas (use "*" to accept requests from any origin). | https://my-frontend.com,https://my-other-frontend.com |
| `CORS_METHODS` | Allowed HTTP methods, separated by commas. | POST,GET,PUT,DELETE |
| `CORS_CREDENTIALS` | Allow cookies in requests (true or false). | true |

## Webhook

| Variable | Description |
| --- | --- |
| `WEBHOOK_GLOBAL_URL` | URL to receive webhook requests |
| `WEBHOOK_GLOBAL_ENABLED` | Whether webhooks are enabled (true or false) |
| `WEBHOOK_GLOBAL_WEBHOOK_BY_EVENTS` | Enable specific webhook events |

Webhook events with true or false values:
| Variable |
| --- |
| `WEBHOOK_EVENTS_APPLICATION_STARTUP` |
| `WEBHOOK_EVENTS_QRCODE_UPDATED` |
| `WEBHOOK_EVENTS_MESSAGES_SET` |
| `WEBHOOK_EVENTS_MESSAGES_UPSERT` |
| `WEBHOOK_EVENTS_MESSAGES_UPDATE` |
| `WEBHOOK_EVENTS_MESSAGES_DELETE` |
| `WEBHOOK_EVENTS_SEND_MESSAGE` |
| `WEBHOOK_EVENTS_CONTACTS_SET` |
| `WEBHOOK_EVENTS_CONTACTS_UPSERT` |
| `WEBHOOK_EVENTS_CONTACTS_UPDATE` |
| `WEBHOOK_EVENTS_PRESENCE_UPDATE` |
| `WEBHOOK_EVENTS_CHATS_SET` |
| `WEBHOOK_EVENTS_CHATS_UPSERT` |
| `WEBHOOK_EVENTS_CHATS_UPDATE` |
| `WEBHOOK_EVENTS_CHATS_DELETE` |
| `WEBHOOK_EVENTS_GROUPS_UPSERT` |
| `WEBHOOK_EVENTS_GROUPS_UPDATE` |
| `WEBHOOK_EVENTS_GROUP_PARTICIPANTS_UPDATE` |
| `WEBHOOK_EVENTS_CONNECTION_UPDATE` |
| `WEBHOOK_EVENTS_LABELS_EDIT` |
| `WEBHOOK_EVENTS_LABELS_ASSOCIATION` |
| `WEBHOOK_EVENTS_CALL` |
| `WEBHOOK_EVENTS_NEW_JWT_TOKEN` |
| `WEBHOOK_EVENTS_TYPEBOT_START` |
| `WEBHOOK_EVENTS_TYPEBOT_CHANGE_STATUS` |
| `WEBHOOK_EVENTS_CHAMA_AI_ACTION` |
| `WEBHOOK_EVENTS_ERRORS` |
| `WEBHOOK_EVENTS_ERRORS_WEBHOOK` |

## QR Code

| Variable | Description |
| --- | --- |
| `QRCODE_LIMIT` | Duration for which the QR code will last |
| `QRCODE_COLOR` | Color of the generated QR code |

## Typebot

| Variable | Description |
| --- | --- |
| `TYPEBOT_API_VERSION` | API version (fixed version or latest) |
| `TYPEBOT_KEEP_OPEN` | Keep Typebot open (true or false) |

## Authentication

| Variable | Description |
| --- | --- |
| `AUTHENTICATION_TYPE` | Authentication type (`jwt` or `apikey`) |
| `AUTHENTICATION_API_KEY` | API key to be used for authentication |
| `AUTHENTICATION_EXPOSE_IN_FETCH_INSTANCES` | |
| `AUTHENTICATION_JWT_EXPIRIN_IN` | JWT token expiration time |
| `AUTHENTICATION_JWT_SECRET` | Secret used to generate the JWT |

```

# v1\en\get-started\introduction.mdx

```mdx
---
title: 'Introduction'
icon: hand-wave
---

**Evolution API** is a project dedicated to empowering small businesses, entrepreneurs, freelancers, and individuals with limited resources.

Our mission is to provide a **WhatsApp™** messaging solution via API, enabling these groups to strengthen their local or online businesses.

Best of all, our service is **completely free**, designed to support those striving to succeed in a competitive market landscape.

Access our [repository](https://github.com/EvolutionAPI/evolution-api) and join our [community](https://evolution-api.com) to be a part of the project.

## Quick Start

<Note>
You will need to have Docker installed on your machine; see the [Official Docker Documentation](https://docs.docker.com/engine/install/).
</Note>
To run the test version and test the main features of the API, copy the command below, change the value of `AUTHENTICATION_API_KEY` to one of your choice, and execute the command:

~~~ sh Terminal
docker run -d \
    --name evolution_api \
    -p 8080:8080 \
    -e AUTHENTICATION_API_KEY=change-me \
    atendai/evolution-api:latest
~~~

<Note>CLI execution is recommended for quick deployments, mainly for testing or development. It should not be used in production. Instead, we recommend using docker-compose for easier deployment and maintenance.</Note>

This will run a Docker container exposing the application on port 8080, and you can start testing and requesting the WhatsApp QR code using the authentication variable content with the apikey header set.

To ensure the API is running, access http://localhost:8080 in your browser. This should be the response from your browser:

~~~ json
{
   "status":200,
   "message":"Welcome to the Evolution API, it is working!",
   "version":"1.x.x",
   "swagger":"http://localhost:8080/docs",
   "manager":"http://localhost:8080/manager",
   "documentation":"https://doc.evolution-api.com"
}
~~~

## Installation
Learn how to install the full version at:

<CardGroup cols={2}>
  <Card title="Installation with Docker" icon="docker" href="/en/install/docker">
    Learn how to install the complete EvolutionAPI using Docker.
  </Card>
  <Card title="NVM" icon="js" href="https://www.postman.com/agenciadgcode/workspace/evolution-api">
    Use the official API collection for Postman.
  </Card>
</CardGroup>

<CardGroup cols={2}>
  <Card title="API Documentation" icon="book" href="/en/definitions/connections">
    View the API documentation with code examples.
  </Card>
  <Card title="Postman Collection" icon="webhook" href="https://www.postman.com/agenciadgcode/workspace/evolution-api">
    Use the official API collection for Postman.
  </Card>
</CardGroup>

```

# v1\en\install\docker.mdx

```mdx
---
title: Docker
icon: docker
---

<Note>
  These installation instructions assume you have already installed Docker on your machine. You can find
  information on how to install Docker in the
  [Official Docker Documentation](https://docs.docker.com/engine/install/).
</Note>

EvolutionAPI is Docker-ready and can be easily deployed with Docker in both standalone and swarm modes. The official EvolutionAPI repository contains all the necessary compose files to install the API.

## Docker Run
### Quick Start

<Warning>
  CLI installation is recommended for quick deployment, mainly for testing or development. It should not be
  used for production. Instead, we recommend that you [use docker-compose](#docker-compose) for
  easier deployment and maintenance.
</Warning>

The fastest way to deploy EvolutionAPI with Docker is by using `docker run` on the command line interface.

~~~ bash Terminal
docker run -d \
    --name evolution-api \
    -p 8080:8080 \
    -e AUTHENTICATION_API_KEY=change-me \
    atendai/evolution-api
~~~

This will run a Docker container exposing the application on port 8080, and you can start testing and requesting the WhatsApp QR code using the authentication variable content with the `apikey` header set.

### Quick Start with Volumes

You can also deploy using Docker volumes to keep your EvolutionAPI's persistent data and all WhatsApp instances on your local machine, avoiding issues with container restarts by using `docker run` on the command line interface.

Run the following command to deploy EvolutionAPI with the necessary volumes. This command maps the `evolution_store` and `evolution_instances` volumes to their respective directories inside the container.

~~~ bash Terminal
docker run -d \
    --name evolution-api \
    -p 8080:8080 \
    -e AUTHENTICATION_API_KEY=change-me \
    -v evolution_store:/evolution/store \
    -v evolution_instances:/evolution/instances \
    atendai/evolution-api
~~~

## Docker Compose

Deploying EvolutionAPI using Docker Compose simplifies the setup and management of your Docker containers. It allows you to define your Docker environment in a `docker-compose.yaml` file and then use a single command to start everything.

This is a Docker Compose example for standalone environments, i.e., a single running server. For synchronization of two servers in parallel, use Swarm. This is for more advanced Docker users.

### Standalone

<Warning>
  **Warning:** the commands featured here as `docker compose` might not work on older versions, and must be replaced by `docker-compose`.
</Warning>

Docker standalone is suitable when your Evolution API will be running on just one machine, and you don't need scalability or other Docker Swarm features for now. It's the most convenient way to use Docker for most people.

Create a `docker-compose.yml` file with this content:

~~~ yaml docker-compose.yml
version: '3'
services:
  evolution-api:
    container_name: evolution_api
    image: atendai/evolution-api
    restart: always
    ports:
      - "8080:8080"
    env_file:
      - .env
    volumes:
      - evolution_store:/evolution/store
      - evolution_instances:/evolution/instances

volumes:
  evolution_store:
  evolution_instances:
~~~

Create a `.env` file in the same directory with the following:

~~~ bash .env
AUTHENTICATION_API_KEY=change-me
~~~
<Note>
  For more configurations, take the example file from the
  [official repository](https://github.com/EvolutionAPI/evolution-api/blob/main/Docker/.env.example). And see the
  guide [here](/en/install/env).
</Note>

Navigate to the directory containing your docker-compose.yml file and run:
services defined in the file

~~~ bash
docker compose up -d
~~~

This command will download the necessary Docker images, create the defined services, networks, and volumes, and start the EvolutionAPI service.

After running the docker-compose up command, you should see logs indicating that the services are running.

~~~ bash
docker logs evolution_api
~~~

To stop the service, use:
~~~ bash
docker compose down
~~~

Open your browser and go to http://localhost:8080 to check if the EvolutionAPI is operational.
```

# v1\en\install\nvm.mdx

```mdx
---
title: NVM
icon: js
---

Evolution API can be easily installed using the Node Version Manager (NVM). Follow these steps to set up your environment and start the Evolution API on your server.

## Install NVM

First, download and install Node.js. You can do this by running the following commands:

\`\`\`bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
\`\`\`

Now, just point to the NVM directories and install Node:

\`\`\`bash Terminal
# Load bash source into the environment
source ~/.bashrc

# Directories
export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # This loads nvm

# Install node:
nvm install v20.10.0 && nvm use v20.10.0
\`\`\`

Confirm that NVM was successfully installed:

\`\`\`bash
command -v nvm
\`\`\`

<Info>
    If you haven't configured it yet, you can also set up your private server's timezone with the following command:

    \`\`\`bash
    dpkg-reconfigure tzdata
    \`\`\`
</Info>

Clone the official GitHub repository to your private server.

\`\`\`bash
git clone https://github.com/EvolutionAPI/evolution-api.git
\`\`\`

Next, navigate to the folder where the project is located.

\`\`\`bash
cd evolution-api
npm install
\`\`\`

Now, let's copy the `env.yml` file with the settings you need to edit.

\`\`\`bash
cp src/dev-env.yml src/env.yml
nano src/env.yml
\`\`\`

This command creates a copy of the default environment file.

Next, open the env.yml file in a text editor to enter your configuration settings. You can use nano, a command-line text editor, for this purpose:

\`\`\`bash
nano src/env.yml
\`\`\`

In the nano editor, navigate through the file and replace the default values with your specific settings. This can include database connection strings, API keys, server ports, etc.

<Info>
    Refer to the environment variables section for detailed instructions on how to set up your `env.yml` file.
</Info>

To start the Evolution API, use the following command:

\`\`\`bash
npm run build
npm run start:prod
\`\`\`

## Install and Configure PM2

Use PM2 to install PM2 and start the manager for the API process:

\`\`\`bash Terminal
npm install pm2 -g
pm2 start 'npm run start:prod' --name ApiEvolution
pm2 startup
pm2 save --force
\`\`\`

<Info>
    Optional:
    You may need to allocate more memory for PM2, especially if your server has the capacity:

    \`\`\`sh
    pm2 start 'npm run start:prod' --name ApiEvolution -- start --node-args="--max-old-space-size=4096" --max-memory-restart 4G
    \`\`\`

    In the example above, it is assumed that your VPS has at least 4GB of RAM available exclusively for the Evolution API.

    Available memory may vary, we recommend at least 1GB to run Evolution.
</Info>

If you want to ensure the API is running, simply use your browser to access http://localhost:8080. This should be the response from your browser:

\`\`\`json http://localhost:8080/
{
    "status": 200,
    "message": "Welcome to Evolution API, it is working!",
    "version": "1.x.x",
    "documentation": "http://localhost:8080/docs"
}
\`\`\`

<Tip>
    Make your life easier with the JSON Formatter extension in [Google Chrome](https://chromewebstore.google.com/detail/json-formatter/gpmodmeblccallcadopbcoeoejepgpnb?hl=pt-BR) or [Microsoft Edge](https://microsoftedge.microsoft.com/addons/detail/json-formatter/hdebmbedhflilekbidmmdiaiilaegkjl).
</Tip>

EvolutionAPI has built-in Swagger endpoint documentation, which you can use to see all possible endpoints and test requests by accessing `http://localhost:8080/docs`.

## Nginx Configuration

First, let's install, start, enable, and test the Nginx service on your private server.

\`\`\`bash Terminal
apt-get install -y nginx
systemctl start nginx
systemctl enable nginx
systemctl status nginx
\`\`\`

If the information "Active: active (running)" appears in green, it means that Nginx is running and you can proceed to the next step.

### Remove Default Nginx Configuration

First, remove the default site file that comes enabled with Nginx:

\`\`\`bash
rm /etc/nginx/sites-enabled/default
\`\`\`

### Create a new server block file in the directory

\`\`\`bash
nano /etc/nginx/conf.d/default.conf
\`\`\`

Next, paste the Nginx configuration into the `default.conf` file:

\`\`\`nginx /etc/nginx/conf.d/default.conf
server {
  listen 80;
  listen [::]:80;
  server_name _;
  root /var/www/html/;
  index index.php index.html index.htm index.nginx-debian.html;

location / {
    try_files $uri $uri/ /index.php;
  }

location ~ \.php$ {
    fastcgi_pass unix:/run/php/php7.4-fpm.sock;
    fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
    include fastcgi_params;
    include snippets/fastcgi-php.conf;
  }

# Long browser cache time can speed up repeat visits to your page
location ~* \.(jpg|jpeg|gif|png|webp|svg|woff|woff2|ttf|css|js|ico|xml)$ {
       access_log off;
       log_not_found off;
       expires 360d;
  }

# disable access to hidden files
location ~ /\.ht {
      access_log off;
      log_not_found off;
      deny all;
  }
}
\`\`\`

After making changes to the Nginx settings, it is essential to reload the Nginx service. This ensures that any modifications you have made are applied and become effective.

Run the following command in the terminal to reload Nginx:

\`\`\`bash
systemctl reload nginx
\`\`\`

Make the nginx user the owner of the web directory, by default, it is owned by the root user:

\`\`\`bash
chown www-data:www-data /usr/share/nginx/html -R
\`\`\`

Now, create a Virtual Host pointing to your subdomain by editing the `api` file:

\`\`\`bash
cd ~
nano /etc/nginx/sites-available/api
\`\`\`

Next, paste the Nginx configuration into the `api` file:

\`\`\`nginx /etc/nginx/sites-available/api
server {
  server_name replace-this-with-your-cool-domain.com;

location / {
    proxy_pass http://127.0.0.1:8080;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_cache_bypass $http_upgrade;
  }
}
\`\`\`

Create a symbolic link between the `api` and `sites-enabled` files:

\`\`\`bash
ln -s /etc/nginx/sites-available/api /etc/nginx/sites-enabled
\`\`\`

Next, validate the Nginx configuration for the subdomain:

\`\`\`bash
nginx -t
\`\`\`

<Note>
    **This message should appear on your terminal if everything has been set up correctly:**
    _nginx: the configuration file /etc/nginx/nginx.conf syntax is ok nginx: configuration file /etc/nginx/nginx.conf test is successful_
</Note>

Reload Nginx for the changes to take effect.

\`\`\`bash
systemctl reload nginx
\`\`\`

## Install Certbot for SSL Certificate

To secure your Evolution API with an SSL certificate, you can use Certbot. Install Certbot using the following command:

\`\`\`bash
snap install --classic certbot
\`\`\`

### Certify the API subdomain

\`\`\`bash
certbot --nginx -d replace-this-with-your-cool-domain.com
\`\`\`

You will be asked if you want to enter an email to receive notifications when the generated certificate is close to its expiration date.

<Note>
    If the certification is successful, at the end of the process, a line with the following message will be displayed:

    "Congratulations! You have successfully enabled HTTPS"
</Note>
```

# v1\en\optional-resources\mongo-db.mdx

```mdx
---
title: MongoDB
icon: database
---

# Setup

MongoDB, a NoSQL database, is known for high performance and scalability. It's ideal for handling large data volumes in the Evolution API.

Set the MongoDB environment variables in the `.env` for Docker or the `dev-env.yml` for NPM file as follows:

~~~ shell .env or dev-env.yml
# Set to true to enable MongoDB.
DATABASE_ENABLED=true
# Your MongoDB connection string.
DATABASE_CONNECTION_URI=mongodb://user:password@database_URL/?authSource=admin&readPreference=primary&ssl=false&directConnection=true
# Prefix for your database name.
DATABASE_CONNECTION_DB_PREFIX_NAME=evo
# Save WhatsApp connection credentials on Mongo
DATABASE_SAVE_DATA_INSTANCE=false 
# Save new messages on Mongo
DATABASE_SAVE_DATA_NEW_MESSAGE=false 
# Save message updates on Mongo
DATABASE_SAVE_MESSAGE_UPDATE=false
# Save imported contacts and new ones
DATABASE_SAVE_DATA_CONTACTS=false 
# Save imported chats and new ones
DATABASE_SAVE_DATA_CHATS=false 
~~~

# Migrate your data in NPM or NVM

Stop the PM2 execution:

**Flush and Stop**: Clears all logs from PM2, useful for troubleshooting after the update and temporarily stops the Evolution API to safely apply updates.

~~~ shell
# Clear all PM2 logs
pm2 flush

# Stop the current Evolution API process
pm2 stop ApiEvolution
~~~

**Evolution API directory**: access your directory installation with the following command:
~~~
cd evolution-api
~~~

**Migrate command**: Run the migration command in the installation directory:
~~~
npx evolution-manager api migrate-to-mongo
~~~

Follow the script steps and migrate specific WhatsApp instances or all your instances.

```

# v1\en\optional-resources\rabbitmq.mdx

```mdx
---
title: RabbitMQ
icon: rabbit
---
# Activating RabbitMQ

To effectively utilize RabbitMQ with the Evolution API for managing WhatsApp instances, it's essential to activate RabbitMQ on each individual WhatsApp instance. This activation allows each instance to start receiving and processing AMQP (Advanced Message Queuing Protocol) queue requests that are specific to that particular WhatsApp instance.

In other words, for each WhatsApp instance where you want to use RabbitMQ, you need to ensure that RabbitMQ integration is enabled. This setup will allow the instance to communicate with the RabbitMQ server and handle its queue of messages and requests. Enabling RabbitMQ on each instance is crucial for proper distribution and management of messaging tasks across different WhatsApp instances in your system.

## RabbitMQ setup for an individual instance

For **developers** who wants to use in their applications AMQP messaging system, you could use RabbitMQ for queue your instances actions.

To configure RabbitMQ for individual WhatsApp instances in the Evolution API, you can use the following endpoint:

~~~ POST
[baseUrl]/rabbitmq/set/[instance_name]
~~~

This endpoint allows you to enable RabbitMQ and specify which events each WhatsApp instance should subscribe to in the AMQP queue. Below is an example of the JSON body for this endpoint:

~~~ json
{
    "enabled": true,
    "events": [
        // List of events to subscribe to. Uncomment the events you need.
        "APPLICATION_STARTUP",
        "QRCODE_UPDATED",
        "MESSAGES_SET",
        "MESSAGES_UPSERT",
        "MESSAGES_UPDATE",
        "MESSAGES_DELETE",
        "SEND_MESSAGE",
        "CONTACTS_SET",
        "CONTACTS_UPSERT",
        "CONTACTS_UPDATE",
        "PRESENCE_UPDATE",
        "CHATS_SET",
        "CHATS_UPSERT",
        "CHATS_UPDATE",
        "CHATS_DELETE",
        "GROUPS_UPSERT",
        "GROUP_UPDATE",
        "GROUP_PARTICIPANTS_UPDATE",
        "CONNECTION_UPDATE",
        "CALL",
        "NEW_JWT_TOKEN"
    ]    
}
~~~

<Note>Remove unused events to keep low resource usage with RabbitMQ.</Note>

When setting up RabbitMQ integration, adjust the events array in the JSON body to include only the events you want to subscribe to. Uncomment any event you wish to enable for RabbitMQ notifications.

Now you can send to your application the messages and consume them in RabbitMQ.

<Note>If you want more in-depth over personalized configuration and installation check the environment variables section.</Note>

Checkout RabbitMQ environment variables [here](/en/env#rabbitmq)

```

# v1\en\optional-resources\redis.mdx

```mdx
---
title: Redis
icon: layer-group
---

# Setup

Redis is an in-memory data structure store, used as a database, cache, and message broker. It supports data structures such as strings, hashes, lists, sets, and more. Incorporating Redis can significantly improve the performance of Evolution API by enabling faster data access and efficient caching.

Set the Redis environment variables in the `.env` for Docker or the `dev-env.yml` for NPM file as follows:

~~~ shell
# Set to true to enable Redis.
CACHE_REDIS_ENABLED=false
# Redis server URI
CACHE_REDIS_URI=redis://redis:6379
# Prefix key word for redis data
CACHE_REDIS_PREFIX_KEY=evolution
# Time to keep data cached
CACHE_REDIS_TTL=604800
# Save WhatsApp credentials on Redis
CACHE_REDIS_SAVE_INSTANCES=true
~~~
Checkout more on [Environment Variables](/en/env#redis).

```

# v1\en\optional-resources\websocket.mdx

```mdx
---
title: Websocket
icon: plug
---

Evolution API utilizes socket.io to emit events, leveraging WebSocket technology. This makes the development of integrations more efficient and straightforward for developers. WebSocket provides a full-duplex communication channel over a single, long-lived connection, enabling real-time data flow between the client and server.

<Info>In order to activate websockets, you must define the environment variable `WEBSOCKET_ENABLED` as `true`. Learn more on [Enviroment Variables](/en/env)</Info>

## Connecting to WebSocket

To connect to the WebSocket server in the Evolution API, you can use the following URL format:
~~~
wss://api.yoursite.com/instance_name
~~~

Replace api.yoursite.com with your actual API domain and instance_name with the name of your specific instance.

Example of Establishing a WebSocket Connection Here's a basic example of how to establish a WebSocket connection using JavaScript:

~~~ JavaScript
const socket = io('wss://api.yoursite.com/instance_name', {
  transports: ['websocket']
});

socket.on('connect', () => {
  console.log('Connected to Evolution API WebSocket');
});

// Listening to events
socket.on('event_name', (data) => {
  console.log('Event received:', data);
});

// Handling disconnection
socket.on('disconnect', () => {
  console.log('Disconnected from Evolution API WebSocket');
});
~~~

In this example, replace event_name with the specific event you want to listen to.


## Handling Events

Once connected, you can listen for various events emitted by the server. Each event may carry data relevant to the event's context. For instance, if you're listening for message updates, you might receive data containing the updated message content and metadata.


## Sending Messages

You can also send messages to the server using the emit method:

~~~ javascript
socket.emit('send_message', { message: 'Hello, World!' });
// In this case, send_message is the event name, and the object { message: 'Hello, World!' } is the data being sent.
~~~


## Closing the Connection

To close the WebSocket connection, use the disconnect method:

~~~ javascript
socket.disconnect();
~~~

Remember to handle the connection responsibly, disconnecting when your application or component unmounts to prevent memory leaks and ensure efficient resource usage.

By leveraging WebSockets, Evolution API offers a powerful way to interact with the system in real time, providing a seamless experience for both developers and end-users.

```

# v1\en\updates.mdx

```mdx
---
title: Updates
icon: code-pull-request
---

Keeping your Evolution API instance up to date is crucial for security, performance, and access to new features. The update method depends on how you initially installed the API. This guide covers the steps to update your Evolution API using Docker Compose and NPM.

<Warning>
  Before updating Evolution, ensure that all integrated applications are working correctly with Evolution. Update at your own risk.
</Warning>

## Updating with Docker

If you initially set up your Evolution API using Docker, follow these steps to update:

### Updating with Docker CLI

If your Evolution API was initially installed using Docker Compose via the command line interface (CLI) and not through Portainer or any other container management tool, follow these steps to update it:

1. **Navigate to the Docker Compose Directory**: Open a terminal and go to the directory where your Docker Compose file (`docker-compose.yml`) is located.

2. **Pull the Latest Image**: Update the Evolution API image to the latest version by running the following command:

~~~ shell Terminal
docker-compose pull atendai/evolution-api:latest
~~~

3. **Stop and Restart the Containers**: After pulling the latest image, stop the current containers and restart them. This can be done using the following command:

~~~ shell Terminal
docker-compose down && docker-compose up -d
~~~

### Updating with Portainer

If you are using Portainer for container management, follow these steps to update your Evolution API:

1. **Access the Portainer Dashboard**: Open your Portainer dashboard in a web browser.

2. **Navigate to Your Containers**: Go to the 'Stacks' section where your Evolution API container is listed.

3. **Update the Compose File**:
    - Locate the `image` field in your Docker Compose configuration.

~~~ yaml
# ... (other services and configurations)
  evolution_api:
    # Update the Evolution API image version here
    # Use 'atendai/evolution-api:latest' for the latest version
    # Or specify a specific version like 'atendai/evolutionapi:v1.6.0'
    image: atendai/evolution-api:v1.x.x
    networks:
      - your_network

# ... (remaining Docker Compose configuration)
~~~

    - Update the value to `atendai/evolution-api:latest` for the latest version, or use `atendai/evolutionapi:v1.x.x` for a specific version.
    - After making the changes, click the 'Deploy' button at the bottom of the compose editing window.

4. **Verify the Update**: After recreating the container, verify that the Evolution API is running on the latest version. This can usually be checked via the API version endpoint or logs.

<Note>
    For production environments, it is advisable to specify a specific version of the Evolution API (e.g., atendai/evolution-api:v1.x.x) instead of using latest. This practice ensures stability and predictability, protecting your production environment from potential issues caused by unexpected changes in the latest version.
</Note>

## Updating with NPM

Updating your Evolution API installation via NPM involves several steps to ensure a smooth transition to the new version. Here is a step-by-step guide:

1. **Clean and Stop**: Clean all PM2 logs, useful for troubleshooting after the update, and temporarily stop the Evolution API to apply updates safely.

~~~ shell Terminal
# Clean all PM2 logs
pm2 flush

# Stop the current Evolution API process
pm2 stop ApiEvolution
~~~

2. **Reset the Local Repository and Pull the Latest Updates**: Ensure your local codebase is synchronized with the latest commit and pull the latest updates from the repository. Optionally, switch to a specific version if not using the latest. This is recommended for production environments.

~~~ shell Terminal
# Reset your local repository to the latest commit
git reset --hard HEAD

# Pull the latest updates from the repository
git pull

# For a specific version, use 'git checkout main' for the latest,
# or 'git checkout 1.x.x' for a specific version. Example:
git checkout 1.x.x
~~~

3. **Clean Installation**: Remove the current `node_modules` directory to avoid potential conflicts with new dependencies and install the required Node.js dependencies for the updated version.

~~~ shell Terminal
# Remove the current node_modules directory to ensure a clean installation
rm -rf node_modules

# Install the dependencies with NPM
npm i

# Restart the Evolution API with the updated version
pm2 start ApiEvolution

# Optionally, view the PM2 logs for the Evolution API
pm2 log ApiEvolution
~~~

```

# v1\pt\configuration\available-resources.mdx

```mdx
---
title: 'Recursos Disponíveis'
icon: wrench
---

## Recursos de Mensagens e Grupos

### Mensagens (Individuais ou em Grupo)

| Recurso | Disponibilidade | Descrição |
|-:|:-:|-|
| Envio de Texto | ✅ | (Texto simples, em negrito, itálico, riscado, em formato de código e emojis) |
| Envio de Mídia | ✅ | (Vídeo, imagem e documento) |
| Envio de Áudio Narrado | ✅ | (Funcionando bem no Android e iOS) |
| Envio de Localização | ✅ | (Com nome e descrição do local) |
| Envio de Contato | ✅ | (Com Nome, Empresa, Telefone, E-mail e URL) |
| Envio de Reação | ✅ | (Envie qualquer emoji para reação) |
| Envio de Pré-visualização de Link | ✅ | (Busca por informações de SEO) 🆕 |
| Envio de Resposta | ✅ | (Marcar mensagens em resposta) 🆕 |
| Envio de Menção | ✅ | (Individual, para alguns ou todos os membros) 🆕 |
| Envio de Enquete | ✅ | (Enviar e receber votos de uma enquete) 🆕 |
| Envio de Status/História | ✅ | (Texto, pré-visualização de link, vídeo, imagem e forma de onda) 🆕 |
| Envio de Adesivo | ✅ | (Imagem estática) 🆕 |
| Envio de Lista (Homologação) | ✅ | (Testando) |
| Envio de Botões (Descontinuado) | ❌ | (Só funciona na API em nuvem) |

### Perfil

| Recurso | Disponibilidade | Descrição |
| --- | :---: | --- |
| Atualizar Nome | ✅ | (Alterar o nome do perfil conectado) |
| Atualizar Foto | ✅ | (Alterar a foto do perfil conectado) 🆕 |
| Atualizar Status | ✅ | (Alterar o status do perfil conectado) 🆕 |
| E muitos outros... |  |  |

### Grupo

| Recurso | Disponibilidade | Descrição |
| --- | :---: | --- |
| Criar Grupo | ✅ | (Novos grupos) |
| Atualizar Foto | ✅ | (Alterar foto do grupo) |
| Atualizar Assunto | ✅ | (Alterar o nome do grupo) 🆕 |
| Atualizar Descrição | ✅ | (Alterar a descrição do grupo) 🆕 |
| Obter Todos os Grupos | ✅ | (Obter todos os grupos e participantes) 🆕 |
| E muitos outros... |  |  |

```

# v1\pt\configuration\webhooks.mdx

```mdx
---
title: 'Webhooks'
icon: webhook
---

Os Webhooks permitem integração em tempo real entre a Evolution API e o WhatsApp™, permitindo sincronização e compartilhamento automatizados de dados.

É exatamente esse recurso que possibilita a criação de bots de autoatendimento e sistemas multi-serviço.

## Ativando Webhooks

Existem duas maneiras de ativar o webhook:
  - No arquivo `.env` com eventos globais
  - Chamando o endpoint `/webhook/instance`

### Eventos de webhook da instância

A maioria dos usuários preferirá a ativação por instância, desta forma é mais fácil controlar os eventos recebidos, no entanto em alguns casos é necessário um webhook global,
isso pode ser feito usando a variável de webhook global.

Aqui está um exemplo com alguns eventos comuns ouvidos:

\`\`\`json /webhook/instance
{
  "url": "{{webhookUrl}}",
  "webhook_by_events": false,
  "webhook_base64": false,
  "events": [
      "QRCODE_UPDATED",
      "MESSAGES_UPSERT",
      "MESSAGES_UPDATE",
      "MESSAGES_DELETE",
      "SEND_MESSAGE",
      "CONNECTION_UPDATE",
      "TYPEBOT_START",
      "TYPEBOT_CHANGE_STATUS"
  ]    
}
\`\`\`
### Parâmetros

| Parâmetro         | Tipo    | Obrigatório  | Descrição                                                                                                       |
| ----------------- | ------- | ------------ | --------------------------------------------------------------------------------------------------------------- |
| enabled           | boolean | Sim          | Insira "true" para criar ou alterar dados do Webhook, ou "false" se quiser parar de usá-lo.                     |
| url               | string  | Sim          | URL do Webhook para receber dados do evento.                                                                    |
| webhook_by_events | boolean | Não          | Deseja gerar uma URL específica do Webhook para cada um dos seus eventos.                                       |
| events            | array   | Não          | Lista de eventos a serem processados. Se você não quiser usar alguns desses eventos, apenas remova-os da lista. |

<Note>
É extremamente necessário que o payload obedeça às regras para criar um arquivo JSON, considerando o arranjo correto de itens, formatação, colchetes, chaves e vírgulas, etc.
Antes de consumir o endpoint, se tiver dúvidas sobre a formatação JSON, vá para https://jsonlint.com/ e valide.
</Note>

### Eventos Globais de Webhook

Cada URL e eventos de Webhook da instância serão solicitados no momento em que forem criados
Defina um webhook global que ouvirá eventos habilitados de todas as instâncias

\`\`\`bash .env
WEBHOOK_GLOBAL_URL=''
WEBHOOK_GLOBAL_ENABLED=false

# Com esta opção ativada, você trabalha com uma URL por evento de webhook, respeitando a URL global e o nome de cada evento
WEBHOOK_GLOBAL_WEBHOOK_BY_EVENTS=false

## Defina os eventos que você deseja ouvir, todos os eventos listados abaixo são suportados
WEBHOOK_EVENTS_APPLICATION_STARTUP=false
WEBHOOK_EVENTS_QRCODE_UPDATED=true

# Alguns eventos extras para erros
WEBHOOK_EVENTS_ERRORS=false
WEBHOOK_EVENTS_ERRORS_WEBHOOK=
\`\`\`
## Eventos Suportados

Estes são os eventos de webhook disponíveis e suportados:

| **Variável de ambiente**   | **URL**                    | **Descrição** |
| -------------------------- | -------------------------- | ------------- |
| APPLICATION_STARTUP        | /application-startup       | Notifica quando uma inicialização de aplicativo ocorre |
| QRCODE_UPDATED             | /qrcode-updated            | Envia o base64 do qrcode para leitura |
| CONNECTION_UPDATE          | /connection-update         | Informa o status da conexão com o WhatsApp |
| MESSAGES_SET               | /messages-set              | Envia uma lista de todas as suas mensagens carregadas no WhatsApp. Este evento ocorre apenas uma vez |
| MESSAGES_UPSERT            | /messages-upsert           | Notifica quando uma mensagem é recebida |
| MESSAGES_UPDATE            | /messages-update           | Informa quando uma mensagem é atualizada |
| MESSAGES_DELETE            | /messages-delete           | Informa quando uma mensagem é excluída |
| SEND_MESSAGE               | /send-message              | Notifica quando uma mensagem é enviada |
| CONTACTS_SET               | /contacts-set              | Realiza o carregamento inicial de todos os contatos. Este evento ocorre apenas uma vez |
| CONTACTS_UPSERT            | /contacts-upsert           | Recarrega todos os contatos com informações adicionais. Este evento ocorre apenas uma vez |
| CONTACTS_UPDATE            | /contacts-update           | Informa quando o contato é atualizado |
| PRESENCE_UPDATE            | /presence-update           | Informa se o usuário está online, se ele está realizando alguma ação como escrever ou gravar e seu último visto: 'indisponível', 'disponível', 'compondo', 'gravando', 'pausado' |
| CHATS_SET                  | /chats-set                 | Envia uma lista de todos os chats carregados |
| CHATS_UPDATE               | /chats-update              | Informa quando o chat é atualizado |
| CHATS_UPSERT               | /chats-upsert              | Envia qualquer nova informação de chat |
| CHATS_DELETE               | /chats-delete              | Notifica quando um chat é excluído |
| GROUPS_UPSERT              | /groups-upsert             | Notifica quando um grupo é criado |
| GROUPS_UPDATE              | /groups-update             | Notifica quando um grupo tem suas informações atualizadas |
| GROUP_PARTICIPANTS_UPDATE  | /group-participants-update | Notifica quando uma ação ocorre envolvendo um participante: 'adicionar', 'remover', 'promover', 'rebaixar' |
| NEW_TOKEN                  | /new-jwt                   | Notifica quando o token (jwt) é atualizado |

## Webhook por eventos

Ao habilitar as opções WEBHOOK_BY_EVENTS nos webhooks globais e locais, os seguintes caminhos serão adicionados ao final do webhook.

<Note>
Adicione ao final da URL o nome do evento com um traço (-) entre as palavras que compõem o evento.
</Note>
 
### Exemplo

 Supondo que sua URL de webhook fosse `https://sub.domain.com/webhook/`. A Evolution adicionará automaticamente ao final da URL o nome do evento quando `webhook_by_events` estiver definido como verdadeiro.

|  **Evento**                 | **Nova URL de Webhook por Eventos**                     |
| -------------------------- | -------------------------------------------------------- |
| APPLICATION_STARTUP        | https://sub.domain.com/webhook/application-startup       |
| QRCODE_UPDATED             | https://sub.domain.com/webhook/qrcode-updated            |
| CONNECTION_UPDATE          | https://sub.domain.com/webhook/connection-update         |
| MESSAGES_SET               | https://sub.domain.com/webhook/messages-set              |
| MESSAGES_UPSERT            | https://sub.domain.com/webhook/messages-upsert           |
| MESSAGES_UPDATE            | https://sub.domain.com/webhook/messages-update           |
| MESSAGES_DELETE            | https://sub.domain.com/webhook/messages-delete           |
| SEND_MESSAGE               | https://sub.domain.com/webhook/send-message              |
| CONTACTS_SET               | https://sub.domain.com/webhook/contacts-set              |
| CONTACTS_UPSERT            | https://sub.domain.com/webhook/contacts-upsert           |
| CONTACTS_UPDATE            | https://sub.domain.com/webhook/contacts-update           |
| PRESENCE_UPDATE            | https://sub.domain.com/webhook/presence-update           |
| CHATS_SET                  | https://sub.domain.com/webhook/chats-set                 |
| CHATS_UPDATE               | https://sub.domain.com/webhook/chats-update              |
| CHATS_UPSERT               | https://sub.domain.com/webhook/chats-upsert              |
| CHATS_DELETE               | https://sub.domain.com/webhook/chats-delete              |
| GROUPS_UPSERT              | https://sub.domain.com/webhook/groups-upsert             |
| GROUPS_UPDATE              | https://sub.domain.com/webhook/groups-update             |
| GROUP_PARTICIPANTS_UPDATE  | https://sub.domain.com/webhook/group-participants-update |
| NEW_TOKEN                  | https://sub.domain.com/webhook/new-jwt                   |

 ## Localizando Webhook

Se necessário, há uma opção para localizar qualquer webhook ativo na instância específica.

| Método | Endpoint                              |
| ------ | ------------------------------------- |
| GET    | [baseUrl]/webhook/find/[instance]     |


### Dados retornados da solicitação:

Chamando o endpoint retornará todas as informações sobre o webhook que está sendo usado pela instância.

\`\`\`json Resultado
{
  "enabled": true,
  "url": "[url]",
  "webhookByEvents": false,
  "events": [
    [eventos]
  ]
}
\`\`\`

```

# v1\pt\env.mdx

```mdx
---
title: Variáveis de Ambiente
icon: gear
---

Veja o arquivo de exemplo do env no [repositório oficial](https://github.com/EvolutionAPI/evolution-api/blob/main/Docker/.env.example).

## Principais variáveis
| Variável | Valor | Exemplo |
| --- | --- | --- |
| `SERVER_URL` | O endereço para seu servidor em execução. Esse endereço é utilizado para retornar dados de requisição interna, como links de webhook. | https://exemplo.evolution-api.com |
| `WEBSOCKET_ENABLED` | Habilitar ou não o WebSocket | true |
| `WEBSOCKET_GLOBAL_EVENTS` | Habilita os WebSocket de forma global | true |
| `CONFIG_SESSION_PHONE_CLIENT` | Nome que será exibido na conexão do smartphone | EvolutionAPI |
| `CONFIG_SESSION_PHONE_NAME` | Nome do navegador que será exibido na conexão do smartphone | Chrome |


## Logs

| Variável | Valor | Exemplo |
| --- | --- | --- |
| `LOG_LEVEL` | Logs que serão mostrados entre: ERROR,WARN,DEBUG,INFO,LOG,VERBOSE,DARK,WEBHOOKS | ERROR,WARN,DEBUG,INFO,LOG,VERBOSE,DARK,WEBHOOKS |
| `LOG_COLOR` | Mostrar ou não cores nos Logs (true ou false) | true |
| `LOG_BAILEYS` | Quais logs da Baileys serão mostrados entre: "fatal", "error", "warn", "info", "debug" e "trace" | error |


## Storage Temporáreo
Armazenamento temporáreo de dados. Valores são `true` ou `false` para armazena ou não.

| Variável | Valor |
| --- | --- |
| `STORE_MESSAGES` | Guarda mensagens |
| `STORE_MESSAGE_UP` | Guarda atualização das mensagens |
| `STORE_CONTACTS` | Guarda contatos |
| `STORE_CHATS` | Guarda conversas |


## Limpeza do Storage Temporáreo
Limpeza do armazenamento temporáreo.

| Variável | Valor |
| --- | --- |
| `CLEAN_STORE_CLEANING_INTERVAL` | Intervalo de limpeza em segundos |
| `CLEAN_STORE_MESSAGES` | Se excluirá as mensagens (true ou false) |
| `CLEAN_STORE_MESSAGE_UP` | Se excluirá as atualizações de mensagens (true ou false) |
| `CLEAN_STORE_CONTACTS` | Se excluirá os contatos (true ou false) |
| `CLEAN_STORE_CHATS` | Se excluirá as conversas (true ou false) |

## Storage Persistente
Configurações de conexão:

| Variável | Valor | Exemplo |
| --- | --- | --- |
| `DATABASE_ENABLED` | Se o armazenamento persistente está habilitado | true |
| `DATABASE_CONNECTION_URI` | A URI de conexão do MongoDB | true |
| `DATABASE_CONNECTION_DB_PREFIX_NAME` | Quais logs da Baileys serão mostrados entre: "fatal", "error", "warn", "info", "debug" e "trace" | error |

Quais dados serão salvos (true ou false)
| Variável | Valor |
| --- | --- |
| `DATABASE_SAVE_DATA_INSTANCE` | Salva dados de instâncias  |
| `DATABASE_SAVE_DATA_NEW_MESSAGE` | Salva novas mensagens |
| `DATABASE_SAVE_MESSAGE_UPDATE` | Salva atualizações de mensagens |
| `DATABASE_SAVE_DATA_CONTACTS` | Salva contatos |
| `DATABASE_SAVE_DATA_CHATS` | Salva conversas |


## Redis

| Variável | Valor | Exemplo |
| --- | --- | --- |
| `CACHE_REDIS_ENABLED`         | Se o Redis está habilitado (true ou false)            | true |
| `CACHE_REDIS_URI`             | A URI de conexão do Redis                             | redis://redis:6379 |
| `CACHE_REDIS_PREFIX_KEY`      | Prefixo do nome de chave                              | evolution |
| `CACHE_REDIS_TTL`             | Tempo para manter os dados no Redis                   | 604800 |
| `CACHE_REDIS_SAVE_INSTANCES`  | Salva as credencias de conexão do whatsapp no Redis   | false |
| `CACHE_LOCAL_ENABLED`         | Faz cache em memória, alternativa ao Redis            | false |
| `CACHE_LOCAL_TTL`             | Tempo para manter os dados localmente                 | 604800 |

## RabbitMQ

| Variável | Valor | Exemplo |
|-----------------------------------------------|-------------------------------------------------------------------------------------------| ---: |
| `RABBITMQ_ENABLED`                            | Habilita o RabbitMQ (true ou false)                                                       | true |
| `RABBITMQ_GLOBAL_ENABLED`                     | Habilita o RabbitMQ de forma global (true ou false)                                       | false |
| `RABBITMQ_URI`                                | URI de conexão do RabbitMQ                                                                | amqp://guest:guest@rabbitmq:5672 |
| `RABBITMQ_EXCHANGE_NAME`                      | Nome do exchange                                                                          | evolution_exchange |
| `RABBITMQ_EVENTS_APPLICATION_STARTUP`         | Envia um evento na inicialização do app                                                   | false |
| `RABBITMQ_EVENTS_QRCODE_UPDATED`              | Envia eventos de Atualização do QR Code                                                   | true |
| `RABBITMQ_EVENTS_MESSAGES_SET`                | Envia eventos de Criação de Mensagens (recuperação de mensagens)                          | true |
| `RABBITMQ_EVENTS_MESSAGES_UPSERT`             | Envia eventos de Recebimento de Mensagens                                                 | true |
| `RABBITMQ_EVENTS_MESSAGES_UPDATE`             | Envia eventos de Atualização de Mensagens                                                 | true |
| `RABBITMQ_EVENTS_MESSAGES_DELETE`             | Envia eventos de Deleção de Mensagens                                                     | true |
| `RABBITMQ_EVENTS_SEND_MESSAGE`                | Envia eventos de Envio de Mensagens                                                       | true |
| `RABBITMQ_EVENTS_CONTACTS_SET`                | Envia eventos de Criação de Contatos                                                      | true |
| `RABBITMQ_EVENTS_CONTACTS_UPSERT`             | Envia eventos de Criação de Contatos (recuperação de contatos)                            | true |
| `RABBITMQ_EVENTS_CONTACTS_UPDATE`             | Envia eventos de Atualização de Contatos                                                  | true |
| `RABBITMQ_EVENTS_PRESENCE_UPDATE`             | Envia eventos de Atualização de presença ("digitando..." ou "gravando...")                | true |
| `RABBITMQ_EVENTS_CHATS_SET`                   | Envia eventos de Criação de Conversas (recuperação de conversas)                          | true |
| `RABBITMQ_EVENTS_CHATS_UPSERT`                | Envia eventos de Criação de Conversas (recebimento ou envio de mensagens em novos chats)  | true |
| `RABBITMQ_EVENTS_CHATS_UPDATE`                | Envia eventos de Atualização de Conversas                                                 | true |
| `RABBITMQ_EVENTS_CHATS_DELETE`                | Envia eventos de Deleção de Conversas                                                     | true |
| `RABBITMQ_EVENTS_GROUPS_UPSERT`               | Envia eventos de Criação de Grupos                                                        | true |
| `RABBITMQ_EVENTS_GROUPS_UPDATE`               | Envia eventos de Atualização de Grupos                                                    | true |
| `RABBITMQ_EVENTS_GROUP_PARTICIPANTS_UPDATE`   | Envia eventos de Atualização nos Participantes de Grupos                                  | true |
| `RABBITMQ_EVENTS_CONNECTION_UPDATE`           | Envia eventos de Atualização de Conexão                                                   | true |
| `RABBITMQ_EVENTS_LABELS_EDIT`                 | Envia eventos de Edição de Etiquetas                                                      | true |
| `RABBITMQ_EVENTS_LABELS_ASSOCIATION`          | Envia eventos de Associação de Etiquetas                                                  | true |
| `RABBITMQ_EVENTS_CALL`                        | Envia eventos de Chamadas                                                                 | true |
| `RABBITMQ_EVENTS_TYPEBOT_START`               | Envia eventos de Início de fluxo do Typebot                                               | false |
| `RABBITMQ_EVENTS_TYPEBOT_CHANGE_STATUS`       | Envia eventos de Atualização no status do Typebot                                         | false |

## SQS

| Variável                  | Valor                               |
| ------------------------- | ----------------------------------------- |
| `SQS_ENABLED`             | Se o SQS está habilitado (true ou false)  |
| `SQS_ACCESS_KEY_ID`       | O ID de chave do SQS                      |
| `SQS_SECRET_ACCESS_KEY`   | Chave de acesso                           |
| `SQS_ACCOUNT_ID`          | ID da conta                               |
| `SQS_REGION`              | Região do SQS                             |

## Instâncias

| Variável | Valor | Exemplo |
| --- | --- | --- |
| `DEL_INSTANCE` | Em quantos minutos uma instânica será excluída se não conectada. Use "false" para nunca excluir. | 5 |
| `DEL_TEMP_INSTANCES` | Deleta instâncias fechadas na inicialização | true |


## CORS

| Variável | Valor | Exemplo |
| --- | --- | --- |
| `CORS_ORIGIN` | As origens permitidas pela API separadas por vírgula (utilize "*" para aceiteitar requisições de qualquer origem). | https://meu-frontend.com,https://meu-outro-frontend.com |
| `CORS_METHODS` | Métodos HTTP permitidos separados por vírgula. | POST,GET,PUT,DELETE |
| `CORS_CREDENTIALS` | Permisão de cookies em requisições (true ou false). | true |


## Webhook

| Variável | Valor |
| --- | --- |
| `WEBHOOK_GLOBAL_URL` | Url que receberá as requisições de webhook |
| `WEBHOOK_GLOBAL_ENABLED` | Se os webhooks estão habilitados (true ou false) |
| `WEBHOOK_GLOBAL_WEBHOOK_BY_EVENTS` |  |

Eventos de webhook com valor true ou false:
| Variável |
| --- |
| `WEBHOOK_EVENTS_APPLICATION_STARTUP` |
| `WEBHOOK_EVENTS_QRCODE_UPDATED` |
| `WEBHOOK_EVENTS_MESSAGES_SET` |
| `WEBHOOK_EVENTS_MESSAGES_UPSERT` |
| `WEBHOOK_EVENTS_MESSAGES_UPDATE` |
| `WEBHOOK_EVENTS_MESSAGES_DELETE` |
| `WEBHOOK_EVENTS_SEND_MESSAGE` |
| `WEBHOOK_EVENTS_CONTACTS_SET` |
| `WEBHOOK_EVENTS_CONTACTS_UPSERT` |
| `WEBHOOK_EVENTS_CONTACTS_UPDATE` |
| `WEBHOOK_EVENTS_PRESENCE_UPDATE` |
| `WEBHOOK_EVENTS_CHATS_SET` |
| `WEBHOOK_EVENTS_CHATS_UPSERT` |
| `WEBHOOK_EVENTS_CHATS_UPDATE` |
| `WEBHOOK_EVENTS_CHATS_DELETE` |
| `WEBHOOK_EVENTS_GROUPS_UPSERT` |
| `WEBHOOK_EVENTS_GROUPS_UPDATE` |
| `WEBHOOK_EVENTS_GROUP_PARTICIPANTS_UPDATE` |
| `WEBHOOK_EVENTS_CONNECTION_UPDATE` |
| `WEBHOOK_EVENTS_LABELS_EDIT` |
| `WEBHOOK_EVENTS_LABELS_ASSOCIATION` |
| `WEBHOOK_EVENTS_CALL` |
| `WEBHOOK_EVENTS_NEW_JWT_TOKEN` |
| `WEBHOOK_EVENTS_TYPEBOT_START` |
| `WEBHOOK_EVENTS_TYPEBOT_CHANGE_STATUS` |
| `WEBHOOK_EVENTS_CHAMA_AI_ACTION` |
| `WEBHOOK_EVENTS_ERRORS` |
| `WEBHOOK_EVENTS_ERRORS_WEBHOOK` |


## QR Code

| Variável | Valor |
| --- | --- |
| `QRCODE_LIMIT` | Por quanto tempo o QR code durará |
| `QRCODE_COLOR` | Cor do QR code gerado |

## Typebot

| Variável | Valor |
| --- | --- |
| `TYPEBOT_API_VERSION` | Versão da API (versão fixa ou latest) |
| `TYPEBOT_KEEP_OPEN` | Mantém o Typebot aberto (true ou false) |


## Autenticação

| Variável | Valor |
| --- | --- |
| `AUTHENTICATION_TYPE` | Tipo de autenticação (`jwt` ou `apikey`) |
| `AUTHENTICATION_API_KEY` | Chave da API que será usada para autenticação |
| `AUTHENTICATION_EXPOSE_IN_FETCH_INSTANCES` | |
| `AUTHENTICATION_JWT_EXPIRIN_IN` | Tempo de expiração do token JWT |
| `AUTHENTICATION_JWT_SECRET` | Segredo usado para gerar o JWT |

```

# v1\pt\get-started\introduction.mdx

```mdx
---
sidebarTitle: 'Introdução'
title: 'Introdução'
icon: hand-wave
---



**Evolution API** é um projeto dedicado a capacitar pequenas empresas, empreendedores, freelancers e indivíduos com recursos limitados.

Nossa missão é fornecer uma solução de mensagens de **WhatsApp™** via API, permitindo que esses grupos reforcem seus negócios locais ou online.

O melhor de tudo é que o nosso serviço é **totalmente gratuito**, concebido para apoiar aqueles que se esforçam para ter sucesso num cenário de mercado competitivo.

Acesse nosso [repositório](https://github.com/EvolutionAPI/evolution-api) e faça parte da nossa [comunidade](https://evolution-api.com) para fazer parte do projeto.

## Início Rápido

<Note>
Você precisará ter o Docker instalado em sua máquina, veja a [Documentação Oficial do Docker](https://docs.docker.com/engine/install/)
</Note>
Para executar a versão de teste e testar as principais funcionalidades da API, copie o comando abaixo, modifique o valor de `AUTHENTICATION_API_KEY` para um de sua preferência, e execute o comando:
~~~ sh
docker run -d \
    --name evolution_api \
    -p 8080:8080 \
    -e AUTHENTICATION_API_KEY=mude-me \
    atendai/evolution-api:latest
~~~

<Note>A execução via CLI é recomendada para implantações rápidas, principalmente para testes ou desenvolvimento. Não deve ser usada em produção. Em vez disso, recomendamos que você use o docker-compose para facilitar a implantação e manutenção.</Note>

Isso executará um contêiner Docker expondo a aplicação na porta 8080 e você poderá começar a testar e solicitar o código QR do WhatsApp usando o conteúdo da variável de autenticação com o cabeçalho apikey definido.

Para garantir que a API está em execução, acesse http://localhost:8080 em seu navegador. Esta deve ser a resposta do seu navegador:

~~~ json
{
   "status":200,
   "message":"Welcome to the Evolution API, it is working!",
   "version":"1.x.x",
   "swagger":"http://localhost:8080/docs",
   "manager":"http://localhost:8080/manager",
   "documentation":"https://doc.evolution-api.com"
}
~~~

## Instalação
Veja como instalar a versão completa em:

<CardGroup cols={2}>
  <Card title="Instalação com Docker" icon="docker" href="/pt/install/docker">
    Veja como instalar a EvolutionAPI completa pelo Docker
  </Card>
  <Card title="NVM" icon="js" href="https://www.postman.com/agenciadgcode/workspace/evolution-api">
    Utilize a coleção oficial da API para Postman.
  </Card>
</CardGroup>

<CardGroup cols={2}>
  <Card title="Documentação da API" icon="book" href="/pt/definitions/connections">
    Veja a documentação da API com exemplos de código
  </Card>
  <Card title="Coleção Postman" icon="webhook" href="https://www.postman.com/agenciadgcode/workspace/evolution-api">
    Utilize a coleção oficial da API para Postman.
  </Card>
</CardGroup>

```

# v1\pt\install\docker.mdx

```mdx
---
title: Docker
icon: docker
---

<Note>
  Estas instruções de instalação assumem que você já instalou o Docker em sua máquina. Você pode encontrar
  informações sobre como instalar o Docker na
  [Documentação Oficial do Docker](https://docs.docker.com/engine/install/).
</Note>

O EvolutionAPI está pronto para o Docker e pode ser facilmente implantado com o Docker no modo standalone e swarm. O repositório oficial do 
EvolutionAPI possui todos os arquivos de composição necessários para instalar a API.

## Docker Run
### Início Rápido

<Warning>
  A instalação CLI é recomendada para implantação rápida, principalmente para testes ou desenvolvimento. Não deve
  ser usada para produção. Em vez disso, recomendamos que você [use o docker-compose](#docker-compose) para
  facilitar a implantação e a manutenção.  
</Warning>

A maneira mais rápida de fazer deploy da EvolutionAPI com o Docker é usando `docker run` na interface de linha de
comando.

~~~ bash Terminal
docker run -d \
    --name evolution-api \
    -p 8080:8080 \
    -e AUTHENTICATION_API_KEY=mude-me \
    atendai/evolution-api
~~~

Isso executará um contêiner do Docker expondo a aplicação na porta 8080 e você poderá começar a testar e solicitar
o código QR do WhatsApp usando o conteúdo da variável de autenticação com o cabeçalho `apikey` definido.

### Início Rápido com Volumes

Você também pode fazer deploy usando volumes docker para manter os dados persistentes da sua EvolutionAPI e todas
as instâncias do WhatsApp em sua máquina local, evitando problemas com a reinicialização do contêiner usando o
`docker run` na interface de linha de comando.

Execute o comando a seguir para implementar o EvolutionAPI com os volumes necessários. Este comando mapeia os
volumes `evolution_store` e `evolution_instances` para os respectivos diretórios dentro do contêiner.

~~~ bash Terminal
docker run -d \
    --name evolution-api \
    -p 8080:8080 \
    -e AUTHENTICATION_API_KEY=mude-me \
    -v evolution_store:/evolution/store \
    -v evolution_instances:/evolution/instances \
    atendai/evolution-api
~~~

## Docker Compose

Fazer deploy da EvolutionAPI usando o Docker Compose simplifica a configuração e o gerenciamento de seus
contêineres Docker. Ele permite que você defina seu ambiente Docker em um arquivo `docker-compose.yaml` e, em
seguida, use um único comando para iniciar tudo.

Este é um exemplo do Docker Compose para ambientes standalone, ou seja, um único servidor em execução. Para a
sincronização de dois servidores em paralelo, use o Swarm. Isso é para usuários Docker mais avançados.

### Standalone

<Warning>
  **Atenção:** os comandos aqui descritos como `docker compose`, podem não funcionar em versões mais antigas, e devem ser substituídos por `docker-compose`.
</Warning>

O Docker standalone é adequado quando sua API de evolução será executada apenas em uma máquina e você não precisará
de escalabilidade ou outros recursos do Docker Swarm por enquanto. É a maneira mais conveniente de usar o Docker
para a maioria das pessoas.

Crie um arquivo `docker-compose.yml` com este conteúdo:

~~~ yaml docker-compose.yml
version: '3'
services:
  evolution-api:
    container_name: evolution_api
    image: atendai/evolution-api
    restart: always
    ports:
      - "8080:8080"
    env_file:
      - .env
    volumes:
      - evolution_store:/evolution/store
      - evolution_instances:/evolution/instances

volumes:
  evolution_store:
  evolution_instances:
~~~

Crie um arquivo `.env` no mesmo diretório com o seguinte:

~~~ bash .env
AUTHENTICATION_API_KEY=mude-me
~~~
<Note>
  Para mais configurações, pegue o arquivo de exemplo no
  [repositório oficial](https://github.com/EvolutionAPI/evolution-api/blob/main/Docker/.env.example). E veja o
  guia [aqui](/pt/install/env)
</Note>

Navegue até o diretório que contém seu arquivo docker-compose.yml e execute:
serviços definidos no arquivo

~~~ bash
docker compose up -d
~~~

Este comando baixará as imagens Docker necessárias, criará os serviços, redes e volumes definidos e iniciará o serviço da EvolutionAPI.

Após executar o comando docker-compose up, você deve ver os logs indicando que os serviços estão em execução.

~~~ bash
docker logs evolution_api
~~~

Para parar o serviço, utilize:
~~~ bash
docker compose down
~~~

Abra seu navegador e acesse http://localhost:8080 para verificar se o EvolutionAPI está operacional.
```

# v1\pt\install\nvm.mdx

```mdx
---
title: NVM
icon: js
---

Evolution API pode ser facilmente instalado usando o Node Version Manager (NVM). Siga estas etapas para configurar seu ambiente e iniciar a Evolution API em seu servidor.

## Instalar NVM

Primeiro, baixe e instale o Node.js. Você pode fazer isso executando os seguintes comandos:

\`\`\`bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
\`\`\`

Agora apenas aponte os diretórios do NVM e instale o node:

\`\`\`bash Terminal
# Carrege a fonte do bash para o ambiente
source ~/.bashrc

# Diretórios
export NVM_DIR="$([ -z "${XDG_CONFIG_HOME-}" ] && printf %s "${HOME}/.nvm" || printf %s "${XDG_CONFIG_HOME}/nvm")"
[ -s "$NVM_DIR/nvm.sh" ] && \. "$NVM_DIR/nvm.sh" # Isso carrega o nvm

# Instala o node:
nvm install v20.10.0 && nvm use v20.10.0
\`\`\`

Confirme que o NVM foi instalado com sucesso:

\`\`\`bash
command -v nvm
\`\`\`

<Info>
    Se você ainda não configurou, também pode configurar o fuso horário do seu servidor privado com o seguinte comando:

    \`\`\`bash
    dpkg-reconfigure tzdata
    \`\`\`
</Info>

Clone o repositório oficial do Github para seu servidor privado.

\`\`\`bash
git clone https://github.com/EvolutionAPI/evolution-api.git
\`\`\`

Em seguida, acesse a pasta onde o projeto está

\`\`\`bash
cd evolution-api
npm install
\`\`\`

Agora vamos copiar o arquivo `env.yml` com as configurações que você precisa editar.

\`\`\`bash
cp src/dev-env.yml src/env.yml
nano src/env.yml
\`\`\`

Este comando cria uma cópia do arquivo de ambiente padrão.

A seguir, abra o arquivo env.yml em um editor de texto para inserir suas configurações de configuração. Você pode usar o nano, um editor de texto da linha de comando, para este propósito:

\`\`\`bash Terminal
nano src/env.yml
\`\`\`

No editor nano, navegue pelo arquivo e substitua os valores padrão pelas suas configurações específicas. Isso pode incluir strings de conexão de banco de dados, chaves de API, portas do servidor, etc.

<Info>
    Acesse a seção de variáveis de ambiente para instruções detalhadas sobre como configurar seu arquivo `env.yml`.
</Info>

Para iniciar a Evolution API, use o seguinte comando:

\`\`\`bash
npm run build
npm run start:prod
\`\`\`

## Instalar e Configurar o PM2

Use o PM2 para instalar o PM2 e iniciar o gerenciador para o processo da API:

\`\`\`bash Terminal
npm install pm2 -g
pm2 start 'npm run start:prod' --name ApiEvolution
pm2 startup
pm2 save --force
\`\`\`

<Info> 
    Opcional:
    Você pode precisar alocar mais memória para o PM2, especialmente se o seu servidor tiver capacidade:

    \`\`\`sh
    pm2 start 'npm run start:prod' --name ApiEvolution -- start --node-args="--max-old-space-size=4096" --max-memory-restart 4G
    \`\`\`

    No exemplo acima, é assumido que seu VPS tem pelo menos 4GB de RAM disponível exclusivamente para a Evolution API.

    A memória disponível pode variar, recomendamos pelo menos 1GB para executar a Evolution.
</Info>

Se você quiser ter certeza de que a API está em execução, basta usar seu navegador para acessar http://localhost:8080. Esta deve ser a resposta do seu navegador:

\`\`\`json http://localhost:8080/
{
    "status": 200,
    "message": "Bem-vindo à Evolution API, ela está funcionando!",
    "version": "1.x.x",
    "documentation": "http://localhost:8080/docs"
}
\`\`\`

<Tip>
    Facilite sua vida com a extensão JSON Formatter no [Google Chrome](https://chromewebstore.google.com/detail/json-formatter/gpmodmeblccallcadopbcoeoejepgpnb?hl=pt-BR) ou [Microsoft Edge](https://microsoftedge.microsoft.com/addons/detail/json-formatter/hdebmbedhflilekbidmmdiaiilaegkjl).
</Tip>

A EvolutionAPI possui uma documentação de ponto de extremidade Swagger integrada, que você pode usar para ver todos os pontos de extremidade possíveis e testar as solicitações acessando `http://localhost:8080/docs`.

## Configuração do Nginx

Primeiro, vamos instalar, iniciar, habilitar e testar o serviço Nginx em seu servidor privado.

\`\`\`bash Terminal
apt-get install -y nginx
systemctl start nginx
systemctl enable nginx
systemctl status nginx
\`\`\`

Se a informação "Ativo: ativo (em execução)" aparecer em verde, significa que o Nginx está em execução e você pode prosseguir para a próxima etapa.

### Remover Configuração Padrão do Nginx

Primeiro, remova o arquivo do site padrão que vem habilitado com o Nginx:

\`\`\`bash
rm /etc/nginx/sites-enabled/default
\`\`\`

### Criar um novo arquivo de bloco do servidor no diretório

\`\`\`bash 
nano /etc/nginx/conf.d/default.conf
\`\`\`

Em seguida, cole a configuração do Nginx no arquivo `default.conf`:

\`\`\`nginx /etc/nginx/conf.d/default.conf
server {
  listen 80;
  listen [::]:80;
  server_name _;
  root /var/www/html/;
  index index.php index.html index.htm index.nginx-debian.html;

location / {
    try_files $uri $uri/ /index.php;
  }

location ~ \.php$ {
    fastcgi_pass unix:/run/php/php7.4-fpm.sock;
    fastcgi_param SCRIPT_FILENAME $document_root$fastcgi_script_name;
    include fastcgi_params;
    include snippets/fastcgi-php.conf;
  }

# Um longo tempo de cache do navegador pode acelerar visitas repetidas à sua página
location ~* \.(jpg|jpeg|gif|png|webp|svg|woff|woff2|ttf|css|js|ico|xml)$ {
       access_log off;
       log_not_found off;
       expires 360d;
  }

# desativar acesso a arquivos ocultos
location ~ /\.ht {
      access_log off;
      log_not_found off;
      deny all;
  }
}
\`\`\`

Após fazer alterações nas configurações do Nginx, é essencial recarregar o serviço Nginx. Isso garante que quaisquer modificações que você fez sejam aplicadas e se tornem eficazes.

Execute o seguinte comando no terminal para recarregar o Nginx:

\`\`\`bash
systemctl reload nginx
\`\`\`

Faça o usuário nginx ser o proprietário do diretório da web, por padrão, ele é de propriedade do usuário root:

\`\`\`bash
chown www-data:www-data /usr/share/nginx/html -R
\`\`\`

Agora, crie um Virtual Host apontando para seu subdomínio editando o arquivo `api`:

\`\`\`bash
cd ~
nano /etc/nginx/sites-available/api
\`\`\`

Em seguida, cole a configuração do Nginx no arquivo `api`:

\`\`\`nginx /etc/nginx/sites-available/api
server {
  server_name substitua-isso-pelo-seu-domínio-legal.com;

location / {
    proxy_pass http://127.0.0.1:8080;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_cache_bypass $http_upgrade;
  }
}

\`\`\`

Crie um link simbólico entre os arquivos `api` e `sites-enabled`:

\`\`\`bash
ln -s /etc/nginx/sites-available/api /etc/nginx/sites-enabled
\`\`\`

Em seguida, valide a configuração do Nginx para o subdomínio:

\`\`\`bash
nginx -t
\`\`\`

<Note>
    **Esta mensagem deve aparecer no seu terminal se tudo tiver sido configurado corretamente:**
    _nginx: the configuration file /etc/nginx/nginx.conf syntax is ok nginx: configuration file /etc/nginx/nginx.conf test is successful_
</Note>

Recarregue o Nginx para que as alterações se tornem efetivas.

\`\`\`bash
systemctl reload nginx
\`\`\`

## Instalar o Certbot para o Certificado SSL

Para proteger sua Evolution API com um certificado SSL, você pode usar o Certbot. Instale o Certbot usando o seguinte comando:

\`\`\`bash
snap install --classic certbot
\`\`\`

### Certificar o subdomínio da API

\`\`\`bash
certbot --nginx -d substitua-isso-pelo-seu-domínio-legal.com
\`\`\`

Será perguntado se você deseja inserir um email para receber notificações quando o certificado gerado estiver perto da data de expiração.

<Note> 
    Se a certificação for bem-sucedida, ao final do processo será exibida uma linha com a seguinte mensagem:

    "Congratulations! You have successfully enabled HTTPS"
</Note>

```

# v1\pt\optional-resources\mongo-db.mdx

```mdx
---
title: MongoDB
icon: database
---

# Setup

MongoDB, um banco de dados NoSQL, é conhecido por seu alto desempenho e escalabilidade. Ele é ideal para lidar com altos volumes de dados na EvolutionAPI.

Defina as variáveis de ambiente do MongoDB no arquivo `.env` para Docker ou o `dev-env.yml` para NPM da seguinte forma:

~~~ shell
# Defina como true para habilitar o MongoDB.
DATABASE_ENABLED=true
# Sua string de conexão do MongoDB.
DATABASE_CONNECTION_URI=mongodb://user:password@database_URL/?authSource=admin&readPreference=primary&ssl=false&directConnection=true
# Prefixo para o nome do banco de dados.
DATABASE_CONNECTION_DB_PREFIX_NAME=evo
# Salva as credencias de conexão do whatsapp no mongoDB
DATABASE_SAVE_DATA_INSTANCE=false 
# Salva as mensagens novas no mongo
DATABASE_SAVE_DATA_NEW_MESSAGE=false 
# Salva as atualizações de mensagens no mongo
DATABASE_SAVE_MESSAGE_UPDATE=false
# Salva os contatos importados e novos contatos
DATABASE_SAVE_DATA_CONTACTS=false 
# Salva os chats importados e novos
DATABASE_SAVE_DATA_CHATS=false 
~~~

# Migração de dados

Alternar entre o armazenamento local para o MongoDB não transfere automaticamente suas instâncias do WhatsApp que estão atualmente sincronizadas com o local storage original.

<Note>Certifique-se de já ter uma instância do MongoDB em execução com um banco de dados criado.</Note>

Claro, aqui está a tradução da documentação para o português:

# Migre seus dados no NPM ou NVM

Pare a execução do PM2:

**Flush e Stop**: Limpa todos os logs do PM2, útil para solução de problemas após a atualização e para parar temporariamente a Evolution API para aplicar atualizações com segurança.

~~~ shell
# Limpar todos os logs do PM2
pm2 flush

# Parar o processo atual da Evolution API
pm2 stop ApiEvolution
~~~

**Diretório da Evolution API**: acesse o diretório de instalação com o seguinte comando:
~~~
cd evolution-api
~~~

**Comando de migração**: Execute o comando de migração no diretório de instalação:
~~~
npx evolution-manager api migrate-to-mongo
~~~

Siga os passos do script e migre instâncias específicas do WhatsApp ou todas as suas instâncias.
```

# v1\pt\optional-resources\rabbitmq.mdx

```mdx
---
title: RabbitMQ
icon: rabbit
---

# Ativando RabbitMQ

Para utilizar efetivamente o **RabbitMQ** com a **Evolution API** para gerenciar instâncias do WhatsApp, é essencial **ativar o RabbitMQ** em cada **instância individual** do WhatsApp. <br/>
Esta ativação permite que cada instância comece a receber e processar solicitações de fila AMQP (Advanced Message Queuing Protocol) específicas para essa instância do WhatsApp.

Em outras palavras, para cada instância do WhatsApp onde você deseja usar o RabbitMQ, você precisa garantir que a integração com o RabbitMQ esteja habilitada. Essa configuração permitirá que a instância se comunique com o servidor RabbitMQ e gerencie sua fila de mensagens e solicitações. Habilitar o RabbitMQ em cada instância é crucial para a distribuição e gestão adequadas das tarefas de mensagens entre as diferentes instâncias do WhatsApp no seu sistema.

## Configuração do RabbitMQ para uma instância individual

Para **desenvolvedores** que desejam usar o sistema de mensagens AMQP em suas aplicações, você pode usar o RabbitMQ para enfileirar as ações das suas instâncias.

Para configurar o RabbitMQ para instâncias individuais do WhatsApp na Evolution API, você pode usar o seguinte endpoint:

~~~ POST
[baseUrl]/rabbitmq/set/[instance_name]
~~~

Este endpoint permite habilitar o RabbitMQ e especificar quais eventos cada instância do WhatsApp deve assinar na fila AMQP. Abaixo está um exemplo do corpo JSON para este endpoint:

~~~ json
{
    "enabled": true,
    "events": [
        // Lista de eventos para assinar. Descomente os eventos que você precisar.
        "APPLICATION_STARTUP",
        "QRCODE_UPDATED",
        "MESSAGES_SET",
        "MESSAGES_UPSERT",
        "MESSAGES_UPDATE",
        "MESSAGES_DELETE",
        "SEND_MESSAGE",
        "CONTACTS_SET",
        "CONTACTS_UPSERT",
        "CONTACTS_UPDATE",
        "PRESENCE_UPDATE",
        "CHATS_SET",
        "CHATS_UPSERT",
        "CHATS_UPDATE",
        "CHATS_DELETE",
        "GROUPS_UPSERT",
        "GROUP_UPDATE",
        "GROUP_PARTICIPANTS_UPDATE",
        "CONNECTION_UPDATE",
        "CALL",
        "NEW_JWT_TOKEN"
    ]    
}
~~~

<Note>Remova eventos não utilizados para manter o baixo uso de recursos com o RabbitMQ.</Note>

Ao configurar a integração com o RabbitMQ, ajuste o array de eventos no corpo JSON para incluir apenas os eventos aos quais você deseja assinar. Descomente qualquer evento que você deseja habilitar para notificações do RabbitMQ.

Agora você pode enviar mensagens para sua aplicação e consumi-las no RabbitMQ.

<Note>Se você quiser uma configuração mais detalhada e personalizada, consulte a seção de variáveis de ambiente.</Note>

Confira as variáveis de ambiente do RabbitMQ [aqui](/pt/env#rabbitmq)
```

# v1\pt\optional-resources\redis.mdx

```mdx
---
title: Redis
icon: layer-group
---

# Configuração

O Redis é um armazenamento de estrutura de dados em memória, usado como banco de dados, cache e corretor de mensagens. Ele suporta estruturas de dados como strings, hashes, listas, conjuntos e muito mais. Incorporar o Redis pode melhorar significativamente o desempenho da Evolution API, permitindo acesso mais rápido aos dados e cache eficiente.

Defina as variáveis de ambiente do Redis no arquivo `.env` para Docker ou no arquivo `dev-env.yml` para NPM da seguinte forma:

~~~ shell
# Defina como true para habilitar o Redis.
CACHE_REDIS_ENABLED=false
# URI do seu servidor Redis.
CACHE_REDIS_URI=redis://redis:6379
# Chave de prefixo para dados do Redis.
CACHE_REDIS_PREFIX_KEY=evolution
# Tempo que os dados são mantidos em cache
CACHE_REDIS_TTL=604800
# Salva as credencias de conexão do whatsapp no redis
CACHE_REDIS_SAVE_INSTANCES=true
~~~
Veja mais em [Variáveis de ambiente](/pt/env#redis).
```

# v1\pt\optional-resources\websocket.mdx

```mdx
---
title: Websocket
icon: plug
---

Evolution API utiliza o socket.io para emitir eventos, aproveitando a tecnologia WebSocket. Isso torna o desenvolvimento de integrações mais eficiente e direto para os desenvolvedores. WebSocket fornece um canal de comunicação full-duplex sobre uma única conexão duradoura, permitindo o fluxo de dados em tempo real entre o cliente e o servidor.

<Info>Para ativar os websockets, defina a variável de ambiente `WEBSOCKET_ENABLED` como `true`. Veja mais em [Variáveis de Ambiente](/pt/env)</Info>

## Conexão ao WebSocket

Para se conectar ao servidor WebSocket na Evolution API, você pode usar o seguinte formato de URL:
~~~
wss://api.seusite.com/nome_instancia
~~~

Substitua api.seusite.com pelo domínio real da sua API e nome_instancia pelo nome da sua instância específica.

Exemplo de Estabelecimento de Conexão WebSocket Aqui está um exemplo básico de como estabelecer uma conexão WebSocket usando JavaScript:

~~~ JavaScript
const socket = io('wss://api.seusite.com/nome_instancia', {
  transports: ['websocket']
});

socket.on('connect', () => {
  console.log('Conectado ao WebSocket da Evolution API');
});

// Escutando eventos
socket.on('nome_evento', (data) => {
  console.log('Evento recebido:', data);
});

// Lidando com desconexão
socket.on('disconnect', () => {
  console.log('Desconectado do WebSocket da Evolution API');
});
~~~

Neste exemplo, substitua `nome_evento` pelo evento específico que você deseja escutar.

## Manipulando Eventos

Uma vez conectado, você pode escutar vários eventos emitidos pelo servidor. Cada evento pode carregar dados relevantes para o contexto do evento. Por exemplo, se estiver ouvindo atualizações de mensagens, você pode receber dados contendo o conteúdo da mensagem atualizada e metadados.


## Enviando Mensagens

Você também pode enviar mensagens para o servidor usando o método emit:

~~~ javascript
socket.emit('send_message', { message: 'Olá, Mundo!' });
// Neste caso, send_message é o nome do evento, e o objeto { message: 'Olá, Mundo!' } é os dados sendo enviados.
~~~


## Fechando a Conexão

Para fechar a conexão WebSocket, use o método disconnect:

~~~ javascript
socket.disconnect();
~~~

Lembre-se de manipular a conexão de forma responsável, desconectando quando sua aplicação ou componente for desmontado para evitar vazamentos de memória e garantir o uso eficiente de recursos.

Ao aproveitar os WebSockets, a Evolution API oferece uma maneira poderosa de interagir com o sistema em tempo real, proporcionando uma experiência contínua tanto para desenvolvedores quanto para usuários finais.

```

# v1\pt\updates.mdx

```mdx
---
title: Atualização
icon: code-pull-request
---

Manter sua instância da Evolution API atualizada é crucial para segurança, desempenho e acesso a novos recursos. O método de atualização depende de como você inicialmente instalou a API. Este guia cobre os passos para atualizar sua Evolution API usando Docker Compose e NPM.

<Note>Antes de atualizar a Evolution, certifique-se de que todos os aplicativos integrados estão realmente funcionando com a Evolution. Atualize por sua conta e risco.</Note>

## Atualização com Docker

Se você configurou inicialmente sua Evolution API usando Docker, siga estas etapas para atualizar:

### Atualização com Docker CLI

Se sua Evolution API foi instalada inicialmente usando Docker Compose via interface de linha de comando (CLI), e não através do Portainer ou qualquer outra ferramenta de gerenciamento de contêiner, siga estas etapas para atualizá-la:

1. **Navegue até o Diretório do Docker Compose**: Abra um terminal e vá para o diretório onde seu arquivo Docker Compose (`docker-compose.yml`) está localizado.

2. **Puxe a Imagem Mais Recente**: Atualize a imagem da Evolution API para a versão mais recente executando o seguinte comando:

~~~ shell
docker compose pull atendai/evolution-api:latest
~~~

3. **Pare e Reinicie os Contêineres**: Após puxar a imagem mais recente, pare os contêineres atuais e reinicie-os. Isso pode ser feito usando o seguinte comando:

~~~ shell
docker compose down && docker compose up -d
~~~

## Atualização com Portainer

Se você está usando o Portainer para gerenciamento de contêineres, siga estas etapas para atualizar sua Evolution API:

1. **Acesse o Painel do Portainer**: Abra o painel do Portainer em um navegador web.

2. **Navegue até Seus Contêineres**: Vá para a seção 'Stacks' onde seu contêiner da Evolution API está listado.

3. **Atualize o Compose**:
    - Localize o campo `image` na sua configuração do Docker Compose.

~~~ yaml stack-file.yml
# ... (outros serviços e configurações)
  evolution_api:
    # Atualize a versão da imagem da Evolution API aqui
    # Use 'atendai/evolution-api:latest' para a versão mais recente
    # Ou especifique uma versão específica como 'atendai/evolutionapi:v1.6.0'
    image: atendai/evolution-api:v1.x.x
    networks:
      - your_network

# ... (restante da configuração do Docker Compose)
~~~

    - Atualize o valor para `atendai/evolution-api:latest` para a versão mais recente, ou use `atendai/evolutionapi:v1.x.x` para uma versão específica.
    - Após fazer as alterações, clique no botão 'Deploy' no final da janela de edição do compose.

4. **Verifique a Atualização**: Após recriar o contêiner, verifique se a Evolution API está executando a versão mais recente. Isso pode ser verificado tipicamente através do endpoint de versão da API ou dos logs.

<Note>
    Para ambientes de produção, é recomendável especificar uma versão particular da Evolution API (ex.: atendai/evolution-api:v1.x.x) em vez de usar latest.
    Esta prática garante estabilidade e previsibilidade, pois protege seu ambiente de produção de problemas potenciais decorrentes de mudanças inesperadas na versão mais recente.
</Note>

Seguindo esses passos, você pode garantir que sua Evolution API esteja sempre atualizada usando o Portainer.

## Atualização com NPM

Atualizar sua instalação da Evolution API via NPM envolve várias etapas para garantir uma transição suave para a nova versão. Aqui está um guia passo a passo:

1. **Limpar e Parar**: Limpe todos os logs do PM2, útil para resolução de problemas após a atualização, e pare temporariamente a Evolution API para aplicar as atualizações com segurança.

~~~ shell Terminal
# Limpar todos os logs do PM2
pm2 flush

# Parar o processo atual da Evolution API
pm2 stop ApiEvolution
~~~

2. **Resetar o repositório local e puxar as atualizações mais recentes**: Garanta que seu código local esteja em sincronia com o commit mais recente e baixe as atualizações mais recentes do repositório. Opcionalmente, mude para uma versão específica se não estiver usando a mais recente. É recomendado para ambientes de produção.

~~~ shell Terminal
# Resetar seu repositório local para o commit mais recente
git reset --hard HEAD

# Puxar as atualizações mais recentes do repositório
git pull

# Para uma versão específica, use 'git checkout main' para a mais recente,
# ou 'git checkout 1.x.x' para uma versão específica. Exemplo:
git checkout 1.x.x
~~~

3. **Instalação Limpa**: Remova o `node_modules` existente para evitar possíveis conflitos com novas dependências e instale as dependências necessárias do Node.js para a versão atualizada.

~~~ shell Terminal
# Remover o diretório node_modules atual para garantir uma instalação limpa
rm -rf node_modules

# Instalar dependências com NPM
npm i

# Reiniciar a Evolution API com a versão atualizada
pm2 start ApiEvolution

# Opcionalmente, visualizar os logs do PM2 para a Evolution API
pm2 log ApiEvolution
~~~
```

# v2\api-reference\authentication.mdx

```mdx
---
title: 'Autenticação'
---

Em Definições selecione a opção Referência de API. Copie o token gerado e use no header Authorization nas suas requisições como `Bearer <token copiado>`.

```

# v2\api-reference\chat-controller\archive-chat.mdx

```mdx
---
title: 'Archive Chat'
openapi: openapi-v2 POST /chat/archiveChat/{instance}
---
```

# v2\api-reference\chat-controller\check-is-whatsapp.mdx

```mdx
---
title: 'Check is WhatsApp'
openapi: openapi-v2 POST /chat/whatsappNumbers/{instance}
---
```

# v2\api-reference\chat-controller\delete-message-for-everyone.mdx

```mdx
---
title: 'Delete Message for Everyone'
openapi: openapi-v2 DELETE /chat/deleteMessageForEveryone/{instance}
---
```

# v2\api-reference\chat-controller\fetch-profilepic-url.mdx

```mdx
---
title: 'Fetch Profile Picture URL'
openapi: openapi-v2 POST /chat/fetchProfilePictureUrl/{instance}
---
```

# v2\api-reference\chat-controller\find-chats.mdx

```mdx
---
title: 'Find Chats'
openapi: openapi-v2 POST /chat/findChats/{instance}
---
```

# v2\api-reference\chat-controller\find-contacts.mdx

```mdx
---
title: 'Find Contacts'
openapi: openapi-v2 POST /chat/findContacts/{instance}
---
```

# v2\api-reference\chat-controller\find-messages.mdx

```mdx
---
title: 'Find Messages'
openapi: openapi-v2 POST /chat/findMessages/{instance}
---
```

# v2\api-reference\chat-controller\find-status-message.mdx

```mdx
---
title: 'Find Status Message'
openapi: openapi-v2 POST /chat/findStatusMessage/{instance}
---
```

# v2\api-reference\chat-controller\get-base64.mdx

```mdx
---
title: 'Get Base64'
openapi: openapi-v2 POST /chat/getBase64FromMediaMessage/{instance}
---
```

# v2\api-reference\chat-controller\mark-as-read.mdx

```mdx
---
title: 'Mark Message As Read'
openapi: openapi-v2 POST /chat/markMessageAsRead/{instance}
---
```

# v2\api-reference\chat-controller\mark-as-unread.mdx

```mdx
---
title: 'Mark Message As Unread'
openapi: openapi-v2 POST /chat/markChatUnread/{instance}
---
```

# v2\api-reference\chat-controller\send-presence.mdx

```mdx
---
title: 'Send Presence'
openapi: openapi-v2 POST /chat/sendPresence/{instance}
---
```

# v2\api-reference\chat-controller\update-message.mdx

```mdx
---
title: 'Update Message'
openapi: openapi-v2 POST /chat/updateMessage/{instance}
---
```

# v2\api-reference\chat-controller\updateBlockStatus.mdx

```mdx
---
title: 'Update Block Status'
openapi: openapi-v2 POST /message/updateBlockStatus/{instance}
---
```

# v2\api-reference\get-information.mdx

```mdx
---
title: 'Get Information'
openapi: openapi-v2 GET /
---
```

# v2\api-reference\group-controller\accept-invite-code.mdx

```mdx
---
title: 'Accept Invite Code'
openapi: openapi-v2 GET /group/acceptInviteCode/{instance}
---
```

# v2\api-reference\group-controller\fetch-all-groups.mdx

```mdx
---
title: 'Fetch All Groups'
openapi: openapi-v2 GET /group/fetchAllGroups/{instance}
---
```

# v2\api-reference\group-controller\fetch-invite-code.mdx

```mdx
---
title: 'Fetch Invite Code'
openapi: openapi-v2 GET /group/inviteCode/{instance}
---
```

# v2\api-reference\group-controller\find-group-by-invite-code.mdx

```mdx
---
title: 'Find Group by Invite Code'
openapi: openapi-v2 GET /group/inviteInfo/{instance}
---
```

# v2\api-reference\group-controller\find-group-by-jid.mdx

```mdx
---
title: 'Find Group by JID'
openapi: openapi-v2 GET /group/findGroupInfos/{instance}
---
```

# v2\api-reference\group-controller\find-participants.mdx

```mdx
---
title: 'Find Group Members'
openapi: openapi-v2 GET /group/participants/{instance}
---
```

# v2\api-reference\group-controller\group-create.mdx

```mdx
---
title: 'Create Group'
openapi: openapi-v2 POST /group/create/{instance}
---
```

# v2\api-reference\group-controller\leave-group.mdx

```mdx
---
title: 'Leave Group'
openapi: openapi-v2 DELETE /group/leaveGroup/{instance}
---
```

# v2\api-reference\group-controller\revoke-invite-code.mdx

```mdx
---
title: 'Revoke Invite Code'
openapi: openapi-v2 POST /group/revokeInviteCode/{instance}
---
```

# v2\api-reference\group-controller\send-invite-url.mdx

```mdx
---
title: 'Send Group Invite'
openapi: openapi-v2 POST /group/sendInvite/{instance}
---
```

# v2\api-reference\group-controller\toggle-ephemeral.mdx

```mdx
---
title: 'Toggle Ephemeral'
openapi: openapi-v2 POST /group/toggleEphemeral/{instance}
---
```

# v2\api-reference\group-controller\update-group-description.mdx

```mdx
---
title: 'Update Group Description'
openapi: openapi-v2 POST /group/updateGroupDescription/{instance}
---
```

# v2\api-reference\group-controller\update-group-picture.mdx

```mdx
---
title: 'Update Group Picture'
openapi: openapi-v2 POST /group/updateGroupPicture/{instance}
---
```

# v2\api-reference\group-controller\update-group-subject.mdx

```mdx
---
title: 'Update Group Subject'
openapi: openapi-v2 POST /group/updateGroupSubject/{instance}
---
```

# v2\api-reference\group-controller\update-participant.mdx

```mdx
---
title: 'Update Group Members'
openapi: openapi-v2 POST /group/updateParticipant/{instance}
---
```

# v2\api-reference\group-controller\update-setting.mdx

```mdx
---
title: 'Update Group Setting'
openapi: openapi-v2 POST /group/updateSetting/{instance}
---
```

# v2\api-reference\instance-controller\connection-state.mdx

```mdx
---
title: 'Connection State'
openapi: openapi-v2 GET /instance/connectionState/{instance}
---
```

# v2\api-reference\instance-controller\create-instance-basic.mdx

```mdx
---
title: 'Create Instance'
openapi: openapi-v2 POST /instance/create
---
```

# v2\api-reference\instance-controller\delete-instance.mdx

```mdx
---
title: 'Delete Instance'
openapi: openapi-v2 DELETE /instance/delete/{instance}
---
```

# v2\api-reference\instance-controller\fetch-instances.mdx

```mdx
---
title: 'Fetch Instances'
openapi: openapi-v2 GET /instance/fetchInstances
---
```

# v2\api-reference\instance-controller\instance-connect.mdx

```mdx
---
title: 'Instance Connect'
openapi: openapi-v2 GET /instance/connect/{instance}
---
```

# v2\api-reference\instance-controller\logout-instance.mdx

```mdx
---
title: 'Logout Instance'
openapi: openapi-v2 DELETE /instance/logout/{instance}
---
```

# v2\api-reference\instance-controller\restart-instance.mdx

```mdx
---
title: 'Restart Instance'
openapi: openapi-v2 PUT /instance/restart/{instance}
---
```

# v2\api-reference\instance-controller\set-presence.mdx

```mdx
---
title: 'Set Presence'
openapi: openapi-v2 POST /instance/setPresence/{instance}
---
```

# v2\api-reference\integrations\chatwoot\find-chatwoot.mdx

```mdx
---
title: 'Find Chatwoot'
openapi: openapi-v2 GET /chatwoot/find/{instance}
---
```

# v2\api-reference\integrations\chatwoot\set-chatwoot.mdx

```mdx
---
title: 'Set Chatwoot'
openapi: openapi-v2 POST /chatwoot/set/{instance}
---
```

# v2\api-reference\integrations\dify\change-status.mdx

```mdx
---
title: 'Change Status Bot'
openapi: openapi-v2 POST /dify/changeStatus/{instance}
---
```

# v2\api-reference\integrations\dify\create-dify.mdx

```mdx
---
title: 'Create Dify Bot'
openapi: openapi-v2 POST /dify/create/{instance}
---
```

# v2\api-reference\integrations\dify\find-bot-dify.mdx

```mdx
---
title: 'Find Dify Bot'
openapi: openapi-v2 GET /dify/find/:difyId/{instance}
---
```

# v2\api-reference\integrations\dify\find-dify.mdx

```mdx
---
title: 'Find Dify Bots'
openapi: openapi-v2 GET /dify/find/{instance}
---
```

# v2\api-reference\integrations\dify\find-settings.mdx

```mdx
---
title: 'Find Dify Settings'
openapi: openapi-v2 GET /dify/fetchSettings/{instance}
---
```

# v2\api-reference\integrations\dify\find-status.mdx

```mdx
---
title: 'Find Status Bot'
openapi: openapi-v2 GET /dify/fetchSessions/:difyId/{instance}
---
```

# v2\api-reference\integrations\dify\set-settings-dify.mdx

```mdx
---
title: 'Set Dify Settings'
openapi: openapi-v2 POST /dify/settings/{instance}
---
```

# v2\api-reference\integrations\dify\update-dify.mdx

```mdx
---
title: 'Update Dify Bot'
openapi: openapi-v2 PUT /dify/update/:difyId/{instance}
---
```

# v2\api-reference\integrations\evoai\change-status.mdx

```mdx
---
title: 'Change Status Bot'
openapi: openapi-v2 POST /evoai/changeStatus/{instance}
---
```

# v2\api-reference\integrations\evoai\create-evoai.mdx

```mdx
---
title: 'Create EvoAI Bot'
openapi: openapi-v2 POST /evoai/create/{instance}
---
```

# v2\api-reference\integrations\evoai\find-bot-evoai.mdx

```mdx
---
title: 'Find EvoAI Bot'
openapi: openapi-v2 GET /evoai/find/:evoaiId/{instance}
---
```

# v2\api-reference\integrations\evoai\find-evoai.mdx

```mdx
---
title: 'Find EvoAI Bots'
openapi: openapi-v2 GET /evoai/find/{instance}
---
```

# v2\api-reference\integrations\evoai\find-settings.mdx

```mdx
---
title: 'Find EvoAI Settings'
openapi: openapi-v2 GET /evoai/fetchSettings/{instance}
---
```

# v2\api-reference\integrations\evoai\find-status.mdx

```mdx
---
title: 'Find Status Bot'
openapi: openapi-v2 GET /evoai/fetchSessions/:evoaiId/{instance}
---
```

# v2\api-reference\integrations\evoai\set-settings-evoai.mdx

```mdx
---
title: 'Set EvoAI Settings'
openapi: openapi-v2 POST /evoai/settings/{instance}
---
```

# v2\api-reference\integrations\evoai\update-evoai.mdx

```mdx
---
title: 'Update EvoAI Bot'
openapi: openapi-v2 PUT /evoai/update/:evoaiId/{instance}
---
```

# v2\api-reference\integrations\evolution\change-status-session.mdx

```mdx
---
title: 'Change Evolution Bot status'
openapi: openapi-v2 POST /evolutionBot/changeStatus/{instance}
---
```

# v2\api-reference\integrations\evolution\create-bot.mdx

```mdx
---
title: 'Create Evolution Bot'
openapi: openapi-v2 POST /evolutionBot/create/{instance}
---
```

# v2\api-reference\integrations\evolution\delete-bot.mdx

```mdx
---
title: 'Delete Evolution Bot'
openapi: openapi-v2 DELETE /evolutionBot/delete/:evolutionBotId/{instance}
---
```

# v2\api-reference\integrations\evolution\fetch-bots.mdx

```mdx
---
title: 'Fetch Evolution Bot'
openapi: openapi-v2 GET /evolutionBot/fetch/:evolutionBotId/{instance}
---
```

# v2\api-reference\integrations\evolution\fetch-session.mdx

```mdx
---
title: 'Fetch Evolution Bot Session'
openapi: openapi-v2 GET /evolutionBot/fetchSessions/:evolutionBotId/{instance}
---
```

# v2\api-reference\integrations\evolution\find-bot.mdx

```mdx
---
title: 'Find Evolution Bots'
openapi: openapi-v2 GET /evolutionBot/find/{instance}
---
```

# v2\api-reference\integrations\evolution\find-settings.mdx

```mdx
---
title: 'Find Settings Bot'
openapi: openapi-v2 GET /evolutionBot/fetchSettings/{instance}
---
```

# v2\api-reference\integrations\evolution\set-settings.mdx

```mdx
---
title: 'Set Settings Bot'
openapi: openapi-v2 POST /evolutionBot/settings/{instance}
---
```

# v2\api-reference\integrations\evolution\update.mdx

```mdx
---
title: 'Update Evolution Bot'
openapi: openapi-v2 PUT /evolutionBot/update/:evolutionBotId/{instance}
---
```

# v2\api-reference\integrations\flowise\change-session-status.mdx

```mdx
---
title: 'Change Status Session'
openapi: openapi-v2 POST /flowise/changeStatus/{instance}
---
```

# v2\api-reference\integrations\flowise\create-bot.mdx

```mdx
---
title: 'Create Flowise Bot'
openapi: openapi-v2 POST /flowise/create/{instance}
---
```

# v2\api-reference\integrations\flowise\delete-flowise-bot.mdx

```mdx
---
title: 'Delete Flowise Bot'
openapi: openapi-v2 DELETE /flowise/delete/:flowiseId/{instance}
---
```

# v2\api-reference\integrations\flowise\find-flowise-bot.mdx

```mdx
---
title: 'Find Flowise Bot'
openapi: openapi-v2 GET /flowise/find/:flowiseId/{instance}
---
```

# v2\api-reference\integrations\flowise\find-flowise-bots.mdx

```mdx
---
title: 'Find Flowise Bots'
openapi: openapi-v2 GET /flowise/find/{instance}
---
```

# v2\api-reference\integrations\flowise\find-sessions.mdx

```mdx
---
title: 'Find Sessions Flowise'
openapi: openapi-v2 GET /flowise/fetchSessions/:flowiseId/{instance}
---
```

# v2\api-reference\integrations\flowise\find-settings.mdx

```mdx
---
title: 'Find Flowise settings'
openapi: openapi-v2 GET /flowise/fetchSettings/{instance}
---
```

# v2\api-reference\integrations\flowise\set-settings.mdx

```mdx
---
title: 'Set Settings Flowise Bots'
openapi: openapi-v2 POST /flowise/settings/{instance}
---
```

# v2\api-reference\integrations\flowise\update-flowise-bot.mdx

```mdx
---
title: 'Update Flowise Bot'
openapi: openapi-v2 POST /flowise/update/:flowiseId/{instance}
---
```

# v2\api-reference\integrations\n8n\change-status.mdx

```mdx
---
title: 'Change Status Bot'
openapi: openapi-v2 POST /n8n/changeStatus/{instance}
---
```

# v2\api-reference\integrations\n8n\create-n8n.mdx

```mdx
---
title: 'Create n8n Bot'
openapi: openapi-v2 POST /n8n/create/{instance}
---
```

# v2\api-reference\integrations\n8n\find-bot-n8n.mdx

```mdx
---
title: 'Find n8n Bot'
openapi: openapi-v2 GET /n8n/find/:n8nId/{instance}
---
```

# v2\api-reference\integrations\n8n\find-n8n.mdx

```mdx
---
title: 'Find n8n Bots'
openapi: openapi-v2 GET /n8n/find/{instance}
---
```

# v2\api-reference\integrations\n8n\find-settings.mdx

```mdx
---
title: 'Find n8n Settings'
openapi: openapi-v2 GET /n8n/fetchSettings/{instance}
---
```

# v2\api-reference\integrations\n8n\find-status.mdx

```mdx
---
title: 'Find Status Bot'
openapi: openapi-v2 GET /n8n/fetchSessions/:n8nId/{instance}
---
```

# v2\api-reference\integrations\n8n\set-settings-n8n.mdx

```mdx
---
title: 'Set n8n Settings'
openapi: openapi-v2 POST /n8n/settings/{instance}
---
```

# v2\api-reference\integrations\n8n\update-n8n.mdx

```mdx
---
title: 'Update n8n Bot'
openapi: openapi-v2 PUT /n8n/update/:n8nId/{instance}
---
```

# v2\api-reference\integrations\openai\change-status.mdx

```mdx
---
title: 'Change status OpenAI'
openapi: openapi-v2 POST /openai/changeStatus/{instance}
---
```

# v2\api-reference\integrations\openai\create-bot.mdx

```mdx
---
title: 'Create OpenIA Bot'
openapi: openapi-v2 POST /openai/create/{instance}
---
```

# v2\api-reference\integrations\openai\delete-bot.mdx

```mdx
---
title: 'Delete OpenIA Bot'
openapi: openapi-v2 DELETE /openai/delete/:openaiBotId/{instance}
---
```

# v2\api-reference\integrations\openai\delete-creds.mdx

```mdx
---
title: 'Delete OpenIA Bot'
openapi: openapi-v2 DELETE /openai/creds/:openaiCredsId/{instance}
---
```

# v2\api-reference\integrations\openai\find-bot.mdx

```mdx
---
title: 'Find OpenIA Bot'
openapi: openapi-v2 GET /openai/find/:openaiBotId/{instance}
---
```

# v2\api-reference\integrations\openai\find-bots.mdx

```mdx
---
title: 'Find OpenIA Bots'
openapi: openapi-v2 GET /openai/find/{instance}
---
```

# v2\api-reference\integrations\openai\find-creds-openai.mdx

```mdx
---
title: 'Find OpenIA Creds'
openapi: openapi-v2 GET /openai/creds/{instance}
---
```

# v2\api-reference\integrations\openai\find-session.mdx

```mdx
---
title: 'Find sessions OpenAI'
openapi: openapi-v2 GET /openai/fetchSessions/:openaiBotId/{instance}
---
```

# v2\api-reference\integrations\openai\find-settings.mdx

```mdx
---
title: 'Find settings OpenAI'
openapi: openapi-v2 GET /openai/fetchSettings/{instance}
---
```

# v2\api-reference\integrations\openai\set-creds.mdx

```mdx
---
title: 'Creds config OpenAI'
openapi: openapi-v2 POST /openai/creds/{instance}
---
```

# v2\api-reference\integrations\openai\settings-openai.mdx

```mdx
---
title: 'Settigns config OpenAI'
openapi: openapi-v2 POST /openai/settings/{instance}
---
```

# v2\api-reference\integrations\openai\update-bot.mdx

```mdx
---
title: 'Update Bot'
openapi: openapi-v2 PUT /openai/update/:openaiBotId/{instance}
---
```

# v2\api-reference\integrations\rabbitmq\find-rabbitmq.mdx

```mdx
---
title: 'Find RabbitMQ'
openapi: openapi-v2 GET /rabbitmq/find/{instance}
---
```

# v2\api-reference\integrations\rabbitmq\set-rabbitmq.mdx

```mdx
---
title: 'Set RabbitMQ'
openapi: openapi-v2 POST /rabbitmq/set/{instance}
---
```

# v2\api-reference\integrations\sqs\find-sqs.mdx

```mdx
---
title: 'Find SQS'
openapi: openapi-v2 GET /sqs/find/{instance}
---
```

# v2\api-reference\integrations\sqs\set-sqs.mdx

```mdx
---
title: 'Set SQS'
openapi: openapi-v2 POST /sqs/set/{instance}
---
```

# v2\api-reference\integrations\typebot\change-session-status.mdx

```mdx
---
title: 'Change Session Status'
openapi: openapi-v2 POST /typebot/changeStatus/{instance}
---
```

# v2\api-reference\integrations\typebot\delete-typebot.mdx

```mdx
---
title: 'Delete Typebot'
openapi: openapi-v2 Delete /typebot/delete/:typebotId/{instance}
---
```

# v2\api-reference\integrations\typebot\fetch-session.mdx

```mdx
---
title: 'Fetch Session Typebot'
openapi: openapi-v2 GET /typebot/fetchSessions/:typebotId/{instance}
---
```

# v2\api-reference\integrations\typebot\fetch-typebot.mdx

```mdx
---
title: 'Fetch Typebot'
openapi: openapi-v2 GET /typebot/fetch/:typebotId/{instance}
---
```

# v2\api-reference\integrations\typebot\find-settings-typebot.mdx

```mdx
---
title: 'Fetch Typebot Settings'
openapi: openapi-v2 GET /typebot/fetchSettings/{instance}
---
```

# v2\api-reference\integrations\typebot\find-typebot.mdx

```mdx
---
title: 'Find Typebot'
openapi: openapi-v2 GET /typebot/find/{instance}
---
```

# v2\api-reference\integrations\typebot\set-typebot.mdx

```mdx
---
title: 'Create Typebot'
openapi: openapi-v2 POST /typebot/create/{instance}
---
```

# v2\api-reference\integrations\typebot\settings-typebot.mdx

```mdx
---
title: 'Settings Typebot'
openapi: openapi-v2 POST /typebot/settings/{instance}
---
```

# v2\api-reference\integrations\typebot\start-typebot.mdx

```mdx
---
title: 'Start Typebot'
openapi: openapi-v2 POST /typebot/start/{instance}
---
```

# v2\api-reference\integrations\typebot\update-typebot.mdx

```mdx
---
title: 'Update Typebot'
openapi: openapi-v2 POST /typebot/update/:typebotId/{instance}
---
```

# v2\api-reference\integrations\websocket\find-websocket.mdx

```mdx
---
title: 'Find Websocket'
openapi: openapi-v2 GET /websocket/find/{instance}
---
```

# v2\api-reference\integrations\websocket\set-websocket.mdx

```mdx
---
title: 'Set Websocket'
openapi: openapi-v2 POST /websocket/set/{instance}
---
```

# v2\api-reference\message-controller\send-audio.mdx

```mdx
---
title: 'Send WhatsApp Audio'
openapi: openapi-v2 POST /message/sendWhatsAppAudio/{instance}
---
```

# v2\api-reference\message-controller\send-button.mdx

```mdx
---
title: 'Send Buttons'
openapi: openapi-v2 POST /message/sendButtons/{instance}
---
```

# v2\api-reference\message-controller\send-contact.mdx

```mdx
---
title: 'Send Contact'
openapi: openapi-v2 POST /message/sendContact/{instance}
---
```

# v2\api-reference\message-controller\send-list.mdx

```mdx
---
title: 'Send List'
openapi: openapi-v2 POST /message/sendList/{instance}
---
```

# v2\api-reference\message-controller\send-location.mdx

```mdx
---
title: 'Send Location'
openapi: openapi-v2 POST /message/sendLocation/{instance}
---
```

# v2\api-reference\message-controller\send-media.mdx

```mdx
---
title: 'Send Media'
openapi: openapi-v2 POST /message/sendMedia/{instance}
---
```

# v2\api-reference\message-controller\send-poll.mdx

```mdx
---
title: 'Send Poll'
openapi: openapi-v2 POST /message/sendPoll/{instance}
---
```

# v2\api-reference\message-controller\send-reaction.mdx

```mdx
---
title: 'Send Reaction'
openapi: openapi-v2 POST /message/sendReaction/{instance}
---
```

# v2\api-reference\message-controller\send-status.mdx

```mdx
---
title: 'Send Status'
openapi: openapi-v2 POST /message/sendStatus/{instance}
---
```

# v2\api-reference\message-controller\send-sticker.mdx

```mdx
---
title: 'Send Sticker'
openapi: openapi-v2 POST /message/sendSticker/{instance}
---
```

# v2\api-reference\message-controller\send-text.mdx

```mdx
---
title: 'Send Plain Text'
openapi: openapi-v2 POST /message/sendText/{instance}
---
```

# v2\api-reference\profile-settings\fetch-business-profile.mdx

```mdx
---
title: 'Fetch Business Profile'
openapi: openapi-v2 POST /chat/fetchBusinessProfile/{instance}
---
```

# v2\api-reference\profile-settings\fetch-privacy-settings.mdx

```mdx
---
title: 'Fetch Privacy Settings'
openapi: openapi-v2 GET /chat/fetchPrivacySettings/{instance}
---
```

# v2\api-reference\profile-settings\fetch-profile.mdx

```mdx
---
title: 'Fetch Profile'
openapi: openapi-v2 POST /chat/fetchProfile/{instance}
---
```

# v2\api-reference\profile-settings\remove-profile-picture.mdx

```mdx
---
title: 'Remove Profile Picture'
openapi: openapi-v2 DELETE /chat/removeProfilePicture/{instance}
---
```

# v2\api-reference\profile-settings\update-privacy-settings.mdx

```mdx
---
title: 'Update Privacy Settings'
openapi: openapi-v2 POST /chat/updatePrivacySettings/{instance}
---
```

# v2\api-reference\profile-settings\update-profile-name.mdx

```mdx
---
title: 'Update Profile Name'
openapi: openapi-v2 POST /chat/updateProfileName/{instance}
---
```

# v2\api-reference\profile-settings\update-profile-picture.mdx

```mdx
---
title: 'Update Profile Picture'
openapi: openapi-v2 POST /chat/updateProfilePicture/{instance}
---
```

# v2\api-reference\profile-settings\update-profile-status.mdx

```mdx
---
title: 'Update Profile Status'
openapi: openapi-v2 POST /chat/updateProfileStatus/{instance}
---
```

# v2\api-reference\settings\get.mdx

```mdx
---
title: 'Find Settings'
openapi: openapi-v2 GET /settings/find/{instance}
---
```

# v2\api-reference\settings\set.mdx

```mdx
---
title: 'Set Settings'
openapi: openapi-v2 POST /settings/set/{instance}
---
```

# v2\api-reference\webhook\get.mdx

```mdx
---
title: 'Find Webhook'
openapi: openapi-v2 GET /webhook/find/{instance}
---
```

# v2\api-reference\webhook\set.mdx

```mdx
---
title: 'Set Webhook'
openapi: openapi-v2 POST /webhook/set/{instance}
---
```

# v2\en\configuration\available-resources.mdx

```mdx
---
title: 'Available Features'
icon: wrench
---

## Messaging and Group Features

### Messages (Individual or Group)

| Feature | Availability | Description |
|-:|:-:|-|
| Send Text | ✅ | (Plain text, bold, italic, strikethrough, code format, and emojis) |
| Send Media | ✅ | (Video, image, and document) |
| Send Voice Message | ✅ | (Works well on Android and iOS) |
| Send Location | ✅ | (With name and description of the place) |
| Send Contact | ✅ | (With Name, Company, Phone, Email, and URL) |
| Send Reaction | ✅ | (Send any emoji as a reaction) |
| Send Link Preview | ✅ | (Fetches SEO information) 🆕 |
| Send Reply | ✅ | (Mark messages as a reply) 🆕 |
| Send Mention | ✅ | (Individual, to some or all members) 🆕 |
| Send Poll | ✅ | (Send and receive votes on a poll) 🆕 |
| Send Status/Story | ✅ | (Text, link preview, video, image, and waveform) 🆕 |
| Send Sticker | ✅ | (Static image) 🆕 |
| Send List (Staging) | ✅ | (Testing) |
| Send Buttons (Discontinued) | ❌ | (Only works on cloud API) |

### Profile

| Feature | Availability | Description |
| --- | :---: | --- |
| Update Name | ✅ | (Change the connected profile name) |
| Update Photo | ✅ | (Change the connected profile picture) 🆕 |
| Update Status | ✅ | (Change the connected profile status) 🆕 |
| And many more... |  |  |

### Group

| Feature | Availability | Description |
| --- | :---: | --- |
| Create Group | ✅ | (New groups) |
| Update Photo | ✅ | (Change group photo) |
| Update Subject | ✅ | (Change group name) 🆕 |
| Update Description | ✅ | (Change group description) 🆕 |
| Get All Groups | ✅ | (Get all groups and participants) 🆕 |
| And many more... |  |  |
```

# v2\en\configuration\webhooks.mdx

```mdx
---
title: 'Webhooks'
icon: webhook
---

Webhooks allow real-time integration between the Evolution API and WhatsApp™, enabling automated data synchronization and sharing.

This feature is exactly what makes it possible to create self-service bots and multi-service systems.

## Enabling Webhooks

There are two ways to enable the webhook:
  - In the `.env` file with global events
  - By calling the `/webhook/instance` endpoint

### Instance Webhook Events

Most users will prefer instance-based activation, as it makes it easier to control the received events. However, in some cases, a global webhook is necessary. This can be done using the global webhook variable.

Here is an example with some common events being listened to:

\`\`\`json /webhook/instance
{
  "url": "{{webhookUrl}}",
  "webhook_by_events": false,
  "webhook_base64": false,
  "events": [
      "QRCODE_UPDATED",
      "MESSAGES_UPSERT",
      "MESSAGES_UPDATE",
      "MESSAGES_DELETE",
      "SEND_MESSAGE",
      "CONNECTION_UPDATE",
      "TYPEBOT_START",
      "TYPEBOT_CHANGE_STATUS"
  ]    
}
\`\`\`
### Parameters

| Parameter         | Type    | Required  | Description                                                                                                       |
| ----------------- | ------- | --------- | ----------------------------------------------------------------------------------------------------------------- |
| enabled           | boolean | Yes       | Enter "true" to create or change Webhook data, or "false" if you want to stop using it.                           |
| url               | string  | Yes       | Webhook URL to receive event data.                                                                                |
| webhook_by_events | boolean | No        | Whether to generate a specific Webhook URL for each of your events.                                               |
| events            | array   | No        | List of events to be processed. If you don't want to use some of these events, simply remove them from the list.  |

<Note>
It is extremely necessary that the payload follows the rules to create a JSON file, considering the correct arrangement of items, formatting, brackets, braces, commas, etc.
Before consuming the endpoint, if you have doubts about the JSON formatting, go to https://jsonlint.com/ and validate.
</Note>

### Global Webhook Events

Each instance's Webhook URL and events will be requested when they are created.
Set up a global webhook that will listen to enabled events from all instances.

\`\`\`bash .env
WEBHOOK_GLOBAL_URL=''
WEBHOOK_GLOBAL_ENABLED=false

# With this option enabled, you work with one URL per webhook event, respecting the global URL and each event's name
WEBHOOK_GLOBAL_WEBHOOK_BY_EVENTS=false

## Set the events you want to listen to; all events listed below are supported
WEBHOOK_EVENTS_APPLICATION_STARTUP=false
WEBHOOK_EVENTS_QRCODE_UPDATED=true

# Some extra events for errors
WEBHOOK_EVENTS_ERRORS=false
WEBHOOK_EVENTS_ERRORS_WEBHOOK=
\`\`\`
## Supported Events

These are the available and supported webhook events:

| **Environment Variable**   | **URL**                    | **Description** |
| -------------------------- | -------------------------- | --------------- |
| APPLICATION_STARTUP        | /application-startup       | Notifies when an application startup occurs |
| QRCODE_UPDATED             | /qrcode-updated            | Sends the QR code in base64 format for scanning |
| CONNECTION_UPDATE          | /connection-update         | Informs the status of the WhatsApp connection |
| MESSAGES_SET               | /messages-set              | Sends a list of all messages loaded in WhatsApp. This event occurs only once |
| MESSAGES_UPSERT            | /messages-upsert           | Notifies when a message is received |
| MESSAGES_UPDATE            | /messages-update           | Informs when a message is updated |
| MESSAGES_DELETE            | /messages-delete           | Informs when a message is deleted |
| SEND_MESSAGE               | /send-message              | Notifies when a message is sent |
| CONTACTS_SET               | /contacts-set              | Performs the initial loading of all contacts. This event occurs only once |
| CONTACTS_UPSERT            | /contacts-upsert           | Reloads all contacts with additional information. This event occurs only once |
| CONTACTS_UPDATE            | /contacts-update           | Informs when a contact is updated |
| PRESENCE_UPDATE            | /presence-update           | Informs if the user is online, performing an action such as typing or recording, and their last seen status: 'unavailable', 'available', 'typing', 'recording', 'paused' |
| CHATS_SET                  | /chats-set                 | Sends a list of all loaded chats |
| CHATS_UPDATE               | /chats-update              | Informs when a chat is updated |
| CHATS_UPSERT               | /chats-upsert              | Sends any new chat information |
| CHATS_DELETE               | /chats-delete              | Notifies when a chat is deleted |
| GROUPS_UPSERT              | /groups-upsert             | Notifies when a group is created |
| GROUPS_UPDATE              | /groups-update             | Notifies when a group has its information updated |
| GROUP_PARTICIPANTS_UPDATE  | /group-participants-update | Notifies when an action occurs involving a participant: 'add', 'remove', 'promote', 'demote' |
| NEW_TOKEN                  | /new-jwt                   | Notifies when the token (jwt) is updated |

## Webhook by Events

When enabling the WEBHOOK_BY_EVENTS options in both global and local webhooks, the following paths will be appended to the end of the webhook URL.

<Note>
Add the event name at the end of the URL with a hyphen (-) between the words that make up the event.
</Note>
 
### Example

Suppose your webhook URL is `https://sub.domain.com/webhook/`. Evolution will automatically add the event name to the end of the URL when `webhook_by_events` is set to true.

|  **Event**                 | **New Event-Specific Webhook URL**                     |
| -------------------------- | ------------------------------------------------------ |
| APPLICATION_STARTUP        | https://sub.domain.com/webhook/application-startup       |
| QRCODE_UPDATED             | https://sub.domain.com/webhook/qrcode-updated            |
| CONNECTION_UPDATE          | https://sub.domain.com/webhook/connection-update         |
| MESSAGES_SET               | https://sub.domain.com/webhook/messages-set              |
| MESSAGES_UPSERT            | https://sub.domain.com/webhook/messages-upsert           |
| MESSAGES_UPDATE            | https://sub.domain.com/webhook/messages-update           |
| MESSAGES_DELETE            | https://sub.domain.com/webhook/messages-delete           |
| SEND_MESSAGE               | https://sub.domain.com/webhook/send-message              |
| CONTACTS_SET               | https://sub.domain.com/webhook/contacts-set              |
| CONTACTS_UPSERT            | https://sub.domain.com/webhook/contacts-upsert           |
| CONTACTS_UPDATE            | https://sub.domain.com/webhook/contacts-update           |
| PRESENCE_UPDATE            | https://sub.domain.com/webhook/presence-update           |
| CHATS_SET                  | https://sub.domain.com/webhook/chats-set                 |
| CHATS_UPDATE               | https://sub.domain.com/webhook/chats-update              |
| CHATS_UPSERT               | https://sub.domain.com/webhook/chats-upsert              |
| CHATS_DELETE               | https://sub.domain.com/webhook/chats-delete              |
| GROUPS_UPSERT              | https://sub.domain.com/webhook/groups-upsert             |
| GROUPS_UPDATE              | https://sub.domain.com/webhook/groups-update             |
| GROUP_PARTICIPANTS_UPDATE  | https://sub.domain.com/webhook/group-participants-update |
| NEW_TOKEN                  | https://sub.domain.com/webhook/new-jwt                   |

## Locating Webhook

If necessary, there is an option to locate any active webhook on the specific instance.

| Method | Endpoint                              |
| ------ | ------------------------------------- |
| GET    | [baseUrl]/webhook/find/[instance]     |


### Data returned from the request:

Calling the endpoint will return all information about the webhook being used by the instance.

\`\`\`json Result
{
  "enabled": true,
  "url": "[url]",
  "webhookByEvents": false,
  "events": [
    [events]
  ]
}
\`\`\`
```

# v2\en\env.mdx

```mdx
---
title: Environment Variables
icon: gear
---

See the example env file in the [official repository](https://github.com/EvolutionAPI/evolution-api/blob/main/Docker/.env.example).

## Server

| Variable | Value | Example |
| --- | --- | --- |
| SERVER_TYPE | The type of server (http or https) | http |
| SERVER_PORT | Port on which the server will run | 8080 |
| SERVER_URL | The address for your running server. This address is used to return data from internal requests, such as webhook links. | https://example.evolution-api.com |

## Telemetry

| Variable | Value | Example |
| --- | --- | --- |
| TELEMETRY | Enables or disables telemetry (true or false) | true |
| TELEMETRY_URL | URL of the telemetry server | https://telemetry.example.com |

## CORS

| Variable | Value | Example |
| --- | --- | --- |
| CORS_ORIGIN | Allowed origins for the API, separated by commas (use "*" to accept requests from any origin) | * |
| CORS_METHODS | Allowed HTTP methods, separated by commas | GET,POST,PUT,DELETE |
| CORS_CREDENTIALS | Permission for cookies in requests (true or false) | true |

## Logs

| Variable | Value | Example |
| --- | --- | --- |
| LOG_LEVEL | Logs that will be displayed among: ERROR, WARN, DEBUG, INFO, LOG, VERBOSE, DARK, WEBHOOKS | ERROR,WARN,DEBUG,INFO,LOG,VERBOSE,DARK,WEBHOOKS |
| LOG_COLOR | Whether or not to show colors in Logs (true or false) | true |
| LOG_BAILEYS | Which Baileys logs will be displayed among: "fatal", "error", "warn", "info", "debug", "trace" | error |

## Instances

| Variable | Value | Example |
| --- | --- | --- |
| DEL_INSTANCE | In how many minutes an instance will be deleted if not connected. Use "false" to never delete | false |

## Persistent Storage

| Variable | Value | Example |
| --- | --- | --- |
| DATABASE_ENABLED | Whether persistent storage is enabled (true or false) | true |
| DATABASE_PROVIDER | Database provider (postgresql or mysql) | postgresql |
| DATABASE_CONNECTION_URI | The database connection URI | postgresql://user:pass@localhost:5432/evolution?schema=public |
| DATABASE_CONNECTION_CLIENT_NAME | Client name for the database connection, used to separate one API installation from another using the same database | evolution_exchange |

### Which data will be saved (true or false)

| Variable | Value |
| --- | --- |
| DATABASE_SAVE_DATA_INSTANCE | Saves instance data |
| DATABASE_SAVE_DATA_NEW_MESSAGE | Saves new messages |
| DATABASE_SAVE_MESSAGE_UPDATE | Saves message updates |
| DATABASE_SAVE_DATA_CONTACTS | Saves contacts |
| DATABASE_SAVE_DATA_CHATS | Saves chats |
| DATABASE_SAVE_DATA_LABELS | Saves labels |
| DATABASE_SAVE_DATA_HISTORIC | Saves event history |

## RabbitMQ

| Variable | Value | Example |
| --- | --- | --- |
| RABBITMQ_ENABLED | Enables RabbitMQ (true or false) | false |
| RABBITMQ_URI | RabbitMQ connection URI | amqp://localhost |
| RABBITMQ_EXCHANGE_NAME | Exchange name | evolution |
| RABBITMQ_GLOBAL_ENABLED | Enables RabbitMQ globally (true or false) | false |

### Choose the events you want to send to RabbitMQ

| Variable | Value | Example |
| --- | --- | --- |
| RABBITMQ_EVENTS_APPLICATION_STARTUP | Sends an event on app startup (true or false) | false |
| RABBITMQ_EVENTS_INSTANCE_CREATE | Sends instance creation events (true or false) | false |
| RABBITMQ_EVENTS_INSTANCE_DELETE | Sends instance deletion events (true or false) | false |
| RABBITMQ_EVENTS_QRCODE_UPDATED | Sends QR Code update events (true or false) | false |
| RABBITMQ_EVENTS_MESSAGES_SET | Sends message creation events (message retrieval) (true or false) | false |
| RABBITMQ_EVENTS_MESSAGES_UPSERT | Sends message receipt events (true or false) | false |
| RABBITMQ_EVENTS_MESSAGES_EDITED | Sends message editing events (true or false) | false |
| RABBITMQ_EVENTS_MESSAGES_UPDATE | Sends message update events (true or false) | false |
| RABBITMQ_EVENTS_MESSAGES_DELETE | Sends message deletion events (true or false) | false |
| RABBITMQ_EVENTS_SEND_MESSAGE | Sends message sending events (true or false) | false |
| RABBITMQ_EVENTS_CONTACTS_SET | Sends contact creation events (true or false) | false |
| RABBITMQ_EVENTS_CONTACTS_UPSERT | Sends contact retrieval events (true or false) | false |
| RABBITMQ_EVENTS_CONTACTS_UPDATE | Sends contact update events (true or false) | false |
| RABBITMQ_EVENTS_PRESENCE_UPDATE | Sends presence update events ("typing..." or "recording...") (true or false) | false |
| RABBITMQ_EVENTS_CHATS_SET | Sends chat creation events (chat retrieval) (true or false) | false |
| RABBITMQ_EVENTS_CHATS_UPSERT | Sends chat creation events (receiving or sending messages in new chats) (true or false) | false |
| RABBITMQ_EVENTS_CHATS_UPDATE | Sends chat update events (true or false) | false |
| RABBITMQ_EVENTS_CHATS_DELETE | Sends chat deletion events (true or false) | false |
| RABBITMQ_EVENTS_GROUPS_UPSERT | Sends group creation events (true or false) | false |
| RABBITMQ_EVENTS_GROUP_UPDATE | Sends group update events (true or false) | false |
| RABBITMQ_EVENTS_GROUP_PARTICIPANTS_UPDATE | Sends group participant update events (true or false) | false |
| RABBITMQ_EVENTS_CONNECTION_UPDATE | Sends connection update events (true or false) | false |
| RABBITMQ_EVENTS_CALL | Sends call events (true or false) | false |
| RABBITMQ_EVENTS_TYPEBOT_START | Sends Typebot flow start events (true or false) | false |
| RABBITMQ_EVENTS_TYPEBOT_CHANGE_STATUS | Sends Typebot status update events (true or false) | false |

## SQS

| Variable | Value | Example |
| --- | --- | --- |
| SQS_ENABLED | Whether SQS is enabled (true or false) | false |
| SQS_ACCESS_KEY_ID | SQS key ID | - |
| SQS_SECRET_ACCESS_KEY | Access key | - |
| SQS_ACCOUNT_ID | Account ID | - |
| SQS_REGION | SQS region | - |

## WebSocket

| Variable | Value | Example |
| --- | --- | --- |
| WEBSOCKET_ENABLED | Enables WebSocket (true or false) | false |
| WEBSOCKET_GLOBAL_EVENTS | Enables global events in WebSocket (true or false) | false |

## WhatsApp Business API

| Variable | Value | Example |
| --- | --- | --- |
| WA_BUSINESS_TOKEN_WEBHOOK | Token used to validate the webhook in the Facebook APP | evolution |
| WA_BUSINESS_URL | WhatsApp Business API URL | https://graph.facebook.com |
| WA_BUSINESS_VERSION | WhatsApp Business API version | v20.0 |
| WA_BUSINESS_LANGUAGE | WhatsApp Business API language | en_US |

## Global Webhook

| Variable | Value | Example |
| --- | --- | --- |
| WEBHOOK_GLOBAL_ENABLED | Whether webhooks are globally enabled (true or false) | false |
| WEBHOOK_GLOBAL_URL | URL that will receive webhook requests | https://webhook.example.com |
| WEBHOOK_GLOBAL_WEBHOOK_BY_EVENTS | Enables webhook by event, respecting the global URL and each event's name (true or false) | false |

### Webhook events with true or false value

| Variable |
| --- |
| WEBHOOK_EVENTS_APPLICATION_STARTUP |
| WEBHOOK_EVENTS_QRCODE_UPDATED |
| WEBHOOK_EVENTS_MESSAGES_SET |
| WEBHOOK_EVENTS_MESSAGES_UPSERT |
| WEBHOOK_EVENTS_MESSAGES_EDITED |
| WEBHOOK_EVENTS_MESSAGES_UPDATE |
| WEBHOOK_EVENTS_MESSAGES_DELETE |
| WEBHOOK_EVENTS_SEND_MESSAGE |
| WEBHOOK_EVENTS_CONTACTS_SET |
| WEBHOOK_EVENTS_CONTACTS_UPSERT |
| WEBHOOK_EVENTS_CONTACTS_UPDATE |
| WEBHOOK_EVENTS_PRESENCE_UPDATE |
| WEBHOOK_EVENTS_CHATS_SET |
| WEBHOOK_EVENTS_CHATS_UPSERT |
| WEBHOOK_EVENTS_CHATS_UPDATE |
| WEBHOOK_EVENTS_CHATS_DELETE |
| WEBHOOK_EVENTS_GROUPS_UPSERT |
| WEBHOOK_EVENTS_GROUPS_UPDATE |
| WEBHOOK_EVENTS_GROUP_PARTICIPANTS_UPDATE |
| WEBHOOK_EVENTS_CONNECTION_UPDATE |
| WEBHOOK_EVENTS_LABELS_EDIT |
| WEBHOOK_EVENTS_LABELS_ASSOCIATION |
| WEBHOOK_EVENTS_CALL |
| WEBHOOK_EVENTS_TYPEBOT_START |
| WEBHOOK_EVENTS_TYPEBOT_CHANGE_STATUS |
| WEBHOOK_EVENTS_ERRORS |
| WEBHOOK_EVENTS_ERRORS_WEBHOOK |

## Session Configurations

| Variable | Value | Example |
| --- | --- | --- |
| CONFIG_SESSION_PHONE_CLIENT | Name that will be displayed on the smartphone connection | Evolution API |
| CONFIG_SESSION_PHONE_NAME | Browser name (Chrome, Firefox, Edge, Opera, Safari) | Chrome |

## QR Code

| Variable | Value | Example |
| --- | --- | --- |
| QRCODE_LIMIT | How long the QR code will last | 30 |
| QRCODE_COLOR | Color of the generated QR code | #175197 |

## Typebot

| Variable | Value | Example |
| --- | --- | --- |
| TYPEBOT_API_VERSION | API version (fixed

 version or latest) | latest |

## Chatwoot

| Variable | Value | Example |
| --- | --- | --- |
| CHATWOOT_ENABLED | Enables integration with Chatwoot (true or false) | false |
| CHATWOOT_MESSAGE_READ | Marks the client's last WhatsApp message as read when sending a message in Chatwoot (true or false) | true |
| CHATWOOT_MESSAGE_DELETE | Deletes the message in Chatwoot when deleted in WhatsApp (true or false) | true |
| CHATWOOT_IMPORT_DATABASE_CONNECTION_URI | Database connection URI for Chatwoot to import messages | postgresql://user:password@host:5432/chatwoot?sslmode=disable |
| CHATWOOT_IMPORT_PLACEHOLDER_MEDIA_MESSAGE | Imports media messages as a placeholder in Chatwoot (true or false) | true |

## OpenAI

| Variable | Value | Example |
| --- | --- | --- |
| OPENAI_ENABLED | Enables integration with OpenAI (true or false) | false |

## Dify

| Variable | Value | Example |
| --- | --- | --- |
| DIFY_ENABLED | Enables integration with Dify (true or false) | false |

## Cache

| Variable | Value | Example |
| --- | --- | --- |
| CACHE_REDIS_ENABLED | Enables Redis cache (true or false) | true |
| CACHE_REDIS_URI | Redis connection URI | redis://localhost:6379/6 |
| CACHE_REDIS_PREFIX_KEY | Prefix to differentiate data from one installation to another using the same Redis | evolution |
| CACHE_REDIS_SAVE_INSTANCES | Saves WhatsApp connection credentials in Redis (true or false) | false |
| CACHE_LOCAL_ENABLED | Enables local in-memory cache as an alternative to Redis (true or false) | false |

## Amazon S3 / MinIO

| Variable | Value | Example |
| --- | --- | --- |
| S3_ENABLED | Enables storage on S3 (true or false) | false |
| S3_ACCESS_KEY | S3 access key | - |
| S3_SECRET_KEY | S3 secret key | - |
| S3_BUCKET | S3 bucket name | evolution |
| S3_PORT | S3 connection port | 443 |
| S3_ENDPOINT | S3 (or MinIO) endpoint | s3.amazonaws.com |
| S3_USE_SSL | Uses SSL for S3 connection (true or false) | true |

## Authentication

| Variable | Value | Example |
| --- | --- | --- |
| AUTHENTICATION_API_KEY | API key used for global authentication | 429683C4C977415CAAFCCE10F7D57E11 |
| AUTHENTICATION_EXPOSE_IN_FETCH_INSTANCES | Shows instances in the fetch endpoint (true or false) | true |

## Language

| Variable | Value | Example |
| --- | --- | --- |
| LANGUAGE | API language | en |
```

# v2\en\get-started\introduction.mdx

```mdx
---
sidebarTitle: 'Introduction'
title: 'Introduction'
icon: hand-wave
---

**Evolution API v2** is a robust platform dedicated to empowering small businesses, entrepreneurs, freelancers, and individuals with limited resources, 
going beyond a simple messaging solution via **WhatsApp™**.

Our mission is to provide a comprehensive API that enables these groups to strengthen their businesses, whether locally or online, by integrating with **multiple platforms and services**.

The best part is that our service is **completely free**, designed to support those striving to succeed in a competitive market landscape.

Originally, **Evolution API** started as a WhatsApp control API based on CodeChat, utilizing the Baileys library. Over time, the platform expanded to 
support not only WhatsApp but also integrations with services like **Typebot, Chatwoot, Dify, and OpenAI**. 
Additionally, the Evolution API supports both the WhatsApp API based on Baileys and the official WhatsApp Business API, with future support planned for Instagram and Messenger.

Visit our [repository](https://github.com/EvolutionAPI/evolution-api) and join our [community](https://evolution-api.com) to be a part of the project.

## Installation
Learn how to install the full version at:

<CardGroup cols={2}>
  <Card title="Installation with Docker" icon="docker" href="/v2/pt/install/docker">
    Learn how to install the full Evolution API with Docker
  </Card>
  <Card title="NVM" icon="js" href="/v2/pt/install/nvm">
    Learn how to install the Evolution API with NVM
  </Card>
</CardGroup>

<CardGroup cols={2}>
  <Card title="API Documentation" icon="book" href="/v2/pt/definitions/connections">
    View the API documentation with code examples
  </Card>
  <Card title="Postman Collection" icon="webhook" href="https://www.postman.com/agenciadgcode/evolution-api/collection/gqr041s/evolution-api-v2-0">
    Use the official API collection for Postman.
  </Card>
</CardGroup>
```

# v2\en\install\docker.mdx

```mdx
---
title: Docker
icon: docker
---

<Note>  
  **Prerequisites:** Before proceeding with the installation of Evolution API v2 using Docker, make sure you have already configured the necessary services, such as PostgreSQL and Redis. Follow the links below for more details:
  
  - [Database Configuration](/v2/pt/requirements/database)
  - [Redis Configuration](/v2/pt/requirements/redis)
</Note>

<Note>  
  These installation instructions assume that you have already installed Docker on your machine. You can find information on how to install Docker in the  
  [Official Docker Documentation](https://docs.docker.com/engine/install/).
</Note>

Evolution API v2 is Docker-ready and can be easily deployed with Docker in standalone or swarm mode. 
The official Evolution API repository contains all the necessary composition files to install and run the API.

## Docker Compose

Deploying Evolution API v2 using Docker Compose simplifies the setup and management of your Docker containers. 
It allows you to define your Docker environment in a `docker-compose.yaml` file and then use a single command to start everything.

### Docker Compose File

The following example illustrates how to configure Docker Compose for standalone environments, i.e., a single running server. 
For syncing two servers in parallel or for greater scalability, use Docker Swarm, recommended for more advanced users.

#### Standalone Configuration

<Warning>  
  **Attention:** The commands described here as `docker compose` may not work in older versions of Docker. 
  If you are using an older version, replace with `docker-compose`.
</Warning>

Docker standalone is suitable when Evolution API will run on just one machine, without the need for immediate scalability. 
This is the most convenient method for most users.

To get started, create a `docker-compose.yml` file with the following content:

~~~ yaml
version: '3.9'
services:
  evolution-api:
    container_name: evolution_api
    image: atendai/evolution-api:v2.1.1
    restart: always
    ports:
      - "8080:8080"
    env_file:
      - .env
    volumes:
      - evolution_instances:/evolution/instances

volumes:
  evolution_instances:
~~~

Next, create a `.env` file in the same directory with the following minimal content:

~~~ bash
AUTHENTICATION_API_KEY=change-me
~~~

<Note>  
  For more configurations, you can get the example file from the
  [official repository](https://github.com/EvolutionAPI/evolution-api/blob/main/.env.example). Also, check the environment variables guide [here](/v2/pt/env).
</Note>

### Starting the API

Navigate to the directory containing the `docker-compose.yml` file and run the following command to start the services defined in the file:

~~~ bash
docker compose up -d
~~~

This command will download the necessary Docker images, create the defined services, networks, and volumes, and start the Evolution API service.

### Checking the Logs

After running the `docker compose up` command, you can check the logs to confirm that the services are running correctly:

~~~ bash
docker logs evolution_api
~~~

### Stopping the Service

To stop the service, use the command:

~~~ bash
docker compose down
~~~

### Accessing the API

Open your browser and go to [http://localhost:8080](http://localhost:8080) to check if the Evolution API is operational.

## Docker Swarm

To set up and manage a Docker Swarm cluster for Evolution API v2, follow the instructions below. Docker Swarm is ideal for environments that require scalability and high availability.

### Docker Swarm Installation


#### Configuring the Manager Server

If you are using a Hetzner server, run:

~~~ bash
sudo apt-get update && apt-get install -y apparmor-utils
~~~

**Step 1: Hostname Configuration**

1. Change the machine's hostname to identify it in the cluster:

~~~ bash
hostnamectl set-hostname manager1
~~~

2. Edit the `/etc/hosts` file to add the new name:

~~~ bash
nano /etc/hosts
~~~

Add the line:

~~~ bash
127.0.0.1    manager1
~~~

3. Reboot the system to apply the changes:

~~~ bash
reboot
~~~

4. Check the hostname:

~~~ bash
hostnamectl
~~~

**Step 2: Docker Installation**

Install Docker by running:

~~~ bash
curl -fsSL https://get.docker.com | bash
~~~

**Step 3: Starting the Swarm**

Start Docker Swarm:

~~~ bash
docker swarm init --advertise-addr IP_SERVER
~~~

**Step 4: Docker Swarm Network Configuration**

Create the overlay network for Docker Swarm:

~~~ bash
docker network create --driver=overlay network_public
~~~

Note the command generated to register the Workers:

~~~ bash
docker swarm join --token HASH IP_SERVER:2377
~~~

#### Configuring the Worker Server

If you are using a Hetzner server, run:

~~~ bash
sudo apt-get update && apt-get install -y apparmor-utils
~~~

**Step 1: Hostname Configuration**

1. Change the machine's hostname to identify it in the cluster:

~~~ bash
hostnamectl set-hostname worker1
~~~

2. Edit the `/etc/hosts` file to add the new name:

~~~ bash
nano /etc/hosts
~~~

Add the line:

~~~ bash
127.0.0.1    worker1
~~~

3. Reboot the system to apply the changes:

~~~ bash
reboot
~~~

**Step 2: Docker Installation**

Install Docker by running:

~~~ bash
curl -fsSL https://get.docker.com | bash
~~~

**Step 3: Adding the Worker to the Cluster**

Run the previously obtained command to add the Worker to the cluster:

~~~ bash
docker swarm join --token HASH IP_SERVER:2377
~~~

### Prerequisites for Evolution API via Swarm

#### Installing Traefik

To install Traefik on Docker Swarm, follow the instructions below:

1. On the manager server, create a `traefik.yaml` file:

~~~ bash
nano traefik.yaml
~~~

2. Add the following content to the file:

~~~ yaml
version: "3.7"

services:
  traefik:
    image: traefik:2.11.2
    command:
      - "--api.dashboard=true"
      - "--providers.docker.swarmMode=true"
      - "--providers.docker.endpoint=unix:///var/run/docker.sock"
      - "--providers.docker.exposedbydefault=false"
      - "--providers.docker.network=network_public"
      - "--entrypoints.web.address=:80"
      - "--entrypoints.web.http.redirections.entryPoint.to=websecure"
      - "--entrypoints.web.http.redirections.entryPoint.scheme=https"
      - "--entrypoints.web.http.redirections.entrypoint.permanent=true"
      - "--entrypoints.websecure.address=:443"
      - "--certificatesresolvers.letsencryptresolver.acme.httpchallenge=true"
      - "--certificatesresolvers.letsencryptresolver.acme.httpchallenge.entrypoint=web"
      - "--certificatesresolvers.letsencryptresolver.acme.email=your@email.com"
      - "--certificatesresolvers.letsencryptresolver.acme.storage=/etc/traefik/letsencrypt/acme.json"
      - "--log.level=DEBUG"
      - "--log.format=common"
      - "--log.filePath=/var/log/traefik/traefik.log"
      - "--accesslog=true"
      - "--accesslog.filepath=/var/log/traefik/access-log"
    deploy:
      placement:
        constraints:
          - node.role == manager
      restart_policy:
        condition: on-failure
        delay: 5s
      labels:
        - "traefik.enable=true"
        - "traefik.http.middlewares.redirect-https.redirectscheme.scheme=https"
        - "traefik.http.middlewares.redirect-https.redirectscheme.permanent=true"
        - "traefik.http.routers.http-catchall.rule=hostregexp(`{host:.+}`)"
        - "traefik.http.routers.http-catchall.entrypoints=web"
        - "traefik.http.routers.http-catchall.middlewares=redirect-https@docker"
        - "traefik.http.routers.http-catchall.priority=1"
    volumes:
      - "/var/run

/docker.sock:/var/run/docker.sock:ro"
      - "vol_certificates:/etc/traefik/letsencrypt"
    ports:
      - target: 80
        published: 80
        mode: host
      - target: 443
        published: 443
        mode: host
    networks:
      - network_public

volumes:
  vol_certificates:
    external: true
    name: volume_swarm_certificates

networks:
  network_public:
    external: true
    name: network_public
~~~

3. Run the following command to deploy the Traefik stack:

~~~ bash
docker stack deploy --prune --resolve-image always -c traefik.yaml traefik
~~~

### Deploying Evolution API v2

Finally, to deploy Evolution API v2 on Docker Swarm, use the configuration file available [here](https://github.com/EvolutionAPI/evolution-api/blob/v2.0.0/Docker/swarm/evolution_api_v2.yaml) with the following content:

~~~ yaml
version: "3.7"

services:
  evolution_v2:


    image: atendai/evolution-api:v2.1.1
    volumes:
      - evolution_instances:/evolution/instances
    networks:
      - network_public
    environment:
      - SERVER_URL=https://evo2.site.com
      - DEL_INSTANCE=false
      - DATABASE_ENABLED=true
      - DATABASE_PROVIDER=postgresql
      - DATABASE_CONNECTION_URI=postgresql://postgres:PASSWORD@postgres:5432/evolution
      - DATABASE_SAVE_DATA_INSTANCE=true
      - DATABASE_SAVE_DATA_NEW_MESSAGE=true
      - DATABASE_SAVE_MESSAGE_UPDATE=true
      - DATABASE_SAVE_DATA_CONTACTS=true
      - DATABASE_SAVE_DATA_CHATS=true
      - DATABASE_SAVE_DATA_LABELS=true
      - DATABASE_SAVE_DATA_HISTORIC=true
      - DATABASE_CONNECTION_CLIENT_NAME=evolution_v2
      - RABBITMQ_ENABLED=false
      - RABBITMQ_URI=amqp://admin:admin@rabbitmq:5672/default
      - CACHE_REDIS_ENABLED=true
      - CACHE_REDIS_URI=redis://evo_redis:6379/1
      - CACHE_REDIS_PREFIX_KEY=evolution_v2
      - CACHE_REDIS_SAVE_INSTANCES=false
      - CACHE_LOCAL_ENABLED=false
      - S3_ENABLED=true
      - S3_ACCESS_KEY=
      - S3_SECRET_KEY=
      - S3_BUCKET=evolution
      - S3_PORT=443
      - S3_ENDPOINT=files.site.com
      - S3_USE_SSL=true
      - AUTHENTICATION_API_KEY=429683C4C977415CAAFCCE10F7D57E11
    deploy:
      mode: replicated
      replicas: 1
      placement:
        constraints:
          - node.hostname == evolution-manager
      labels:
        - traefik.enable=true
        - traefik.http.routers.evolution_v2.rule=Host(`evo2.site.com`)
        - traefik.http.routers.evolution_v2.entrypoints=websecure
        - traefik.http.routers.evolution_v2.tls.certresolver=letsencryptresolver
        - traefik.http.routers.evolution_v2.service=evolution_v2
        - traefik.http.services.evolution_v2.loadbalancer.server.port=8080
        - traefik.http.services.evolution_v2.loadbalancer.passHostHeader=true

volumes:
  evolution_instances:
    external: true
    name: evolution_v2_data

networks:
  network_public:
    external: true
    name: network_public
~~~

After configuring and saving the file, deploy the stack with the command:

~~~ bash
docker stack deploy --prune --resolve-image always -c evolution_api_v2.yaml evolution_v2
~~~

### Accessing the API

Open your browser and go to [https://evo2.site.com](https://evo2.site.com) to check if the Evolution API is operational.
```

# v2\en\install\nginx.mdx

```mdx
---
title: Nginx and SSL
icon: globe  
---

## Nginx Configuration

To securely expose the Evolution API on the web, you can configure Nginx as a reverse proxy.

### Installing Nginx

Install, start, and enable Nginx:

\`\`\`bash
apt-get install -y nginx
systemctl start nginx
systemctl enable nginx
systemctl status nginx
\`\`\`

If the message "Active: active (running)" appears, Nginx is working correctly.

### Nginx Configuration

Remove the default Nginx configuration:

\`\`\`bash
rm /etc/nginx/sites-enabled/default
\`\`\`

Create a new configuration file:

\`\`\`bash
nano /etc/nginx/conf.d/default.conf
\`\`\`

Add the following configuration:

\`\`\`nginx
server {
  listen 80;
  listen [::]:80;
  server_name _;

  location / {
    proxy_pass http://127.0.0.1:8080;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_cache_bypass $http_upgrade;
  }

  location ~* \.(jpg|jpeg|gif|png|webp|svg|woff|woff2|ttf|css|js|ico|xml)$ {
    expires 360d;
  }

  location ~ /\.ht {
    deny all;
  }
}
\`\`\`

Reload Nginx to apply the changes:

\`\`\`bash
systemctl reload nginx
\`\`\`

If necessary, make the `nginx` user the owner of the web directory:

\`\`\`bash
chown www-data:www-data /usr/share/nginx/html -R
\`\`\`

To configure a Virtual Host, create a configuration file:

\`\`\`bash
nano /etc/nginx/sites-available/api
\`\`\`

Add the following configuration:

\`\`\`nginx
server {
  server_name replace-this-with-your-cool-domain.com;

  location / {
    proxy_pass http://127.0.0.1:8080;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_cache_bypass $http_upgrade;
  }
}
\`\`\`

Create a symbolic link to enable the configuration:

\`\`\`bash
ln -s /etc/nginx/sites-available/api /etc/nginx/sites-enabled
nginx -t
\`\`\`

Reload Nginx:

\`\`\`bash
systemctl reload nginx
\`\`\`

## Install Certbot for SSL Certificate

To secure your Evolution API with SSL, install Certbot:

\`\`\`bash
snap install --classic certbot
\`\`\`

### Configure SSL with Certbot

To configure SSL, use the command:

\`\`\`bash
certbot --nginx -d replace-this-with-your-cool-domain.com
\`\`\`

<Note>  
If the process is successful, you will see the message "Congratulations! You have successfully enabled HTTPS".
</Note>
```

# v2\en\install\nvm.mdx

```mdx
---
title: NVM 
icon: js  
---

## Prerequisites

Before starting the installation of Evolution API v2, ensure that you have already configured the necessary services, such as PostgreSQL and Redis. Follow the links below for more details:

- [Database Configuration](/v2/pt/requirements/database)
- [Redis Configuration](/v2/pt/requirements/redis)

## NVM Installation

Evolution API can be easily installed using Node Version Manager (NVM). Follow these steps to set up your environment and start the Evolution API on your server.

### Install NVM

First, download and install Node.js with the following commands:

\`\`\`bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
\`\`\`

Now, load the environment and install Node.js:

\`\`\`bash
# Load NVM into the current environment
source ~/.bashrc

# Install and use the required Node.js version
nvm install v20.10.0 && nvm use v20.10.0
\`\`\`

Confirm that NVM was successfully installed:

\`\`\`bash
command -v nvm
\`\`\`

<Info>  
If you haven't set it up yet, you can also configure your server's timezone with the command:

\`\`\`bash
dpkg-reconfigure tzdata
\`\`\`
</Info>

## Cloning the Repository and Installing Dependencies

Clone the official Evolution API v2 repository from the correct branch:

\`\`\`bash
git clone -b v2.0.0 https://github.com/EvolutionAPI/evolution-api.git
\`\`\`

Navigate to the project directory and install the dependencies:

\`\`\`bash
cd evolution-api
npm install
\`\`\`

## Environment Variables Configuration

Now let's configure the environment variables. First, copy the `.env.example` file to `.env`:

\`\`\`bash
cp ./.env.example ./.env
\`\`\`

Edit the `.env` file with your specific settings:

\`\`\`bash
nano ./.env
\`\`\`

Replace the default values with your configurations, such as database connection strings, API keys, server ports, etc.

<Info>  
Visit the [environment variables section](/v2/pt/env) for detailed instructions on how to configure your `.env` file.
</Info>

## Database Generation and Deployment

After setting up the environment, you will need to generate the Prisma client files and deploy the migrations to the database. Use the following commands, depending on the database you are using (PostgreSQL or MySQL):

1. Generate the Prisma client files:

    \`\`\`bash
    npm run db:generate
    \`\`\`

2. Deploy the migrations:

    \`\`\`bash
    npm run db:deploy
    \`\`\`
    
## Starting the Evolution API

After configuration, you can start the Evolution API with the following command:

\`\`\`bash
npm run build
npm run start:prod
\`\`\`

## PM2 Installation and Configuration

Use PM2 to manage the API process:

\`\`\`bash
npm install pm2 -g
pm2 start 'npm run start:prod' --name ApiEvolution
pm2 startup
pm2 save --force
\`\`\`

<Info>  
If your server has more memory, consider configuring PM2 to utilize more resources:

\`\`\`bash
pm2 start 'npm run start:prod' --name ApiEvolution -- start --node-args="--max-old-space-size=4096" --max-memory-restart 4G
\`\`\`

This is recommended for servers with at least 4GB of RAM exclusively available for the Evolution API.
</Info>

To verify that the API is running, visit [http://localhost:8080](http://localhost:8080). You should see the following response:

\`\`\`json
{
  "status": 200,
  "message": "Welcome to the Evolution API, it is working!",
  "version": "2.0.10",
  "clientName": "evolution01",
  "manager": "https://evo2.site.com/manager",
  "documentation": "https://doc.evolution-api.com"
}
\`\`\`

<Tip>  
Make your life easier with the JSON Formatter extension on [Google Chrome](https://chromewebstore.google.com/detail/json-formatter/gpmodmeblccallcadopbcoeoejepgpnb?hl=en) or [Microsoft Edge](https://microsoftedge.microsoft.com/addons/detail/json-formatter/hdebmbedhflilekbidmmdiaiilaegkjl).
</Tip>
```

# v2\en\integrations\chatwoot.mdx

```mdx
---
title: Chatwoot  
icon: comment  
---

The Evolution API allows direct integration with **Chatwoot**, a customer support platform that centralizes communications from multiple channels. This documentation details how to configure this integration both when creating a new instance and in an existing instance.

## Chatwoot Integration Configuration

### 1. Configuration During Instance Creation

You can configure Chatwoot directly when creating a new instance in the Evolution API. Use the following request body for the `/instance/create` endpoint:

#### Endpoint

~~~http
POST {{baseUrl}}/instance/create
~~~

#### Request Body

~~~json
{
    "instanceName": "INSTANCE NAME",
    "number": "WHATSAPP NUMBER TO GENERATE PAIRING CODE",
    "qrcode": true,
    "integration": "WHATSAPP-BAILEYS",
    "chatwootAccountId": "1",
    "chatwootToken": "TOKEN",
    "chatwootUrl": "https://chatwoot.com",
    "chatwootSignMsg": true,
    "chatwootReopenConversation": true,
    "chatwootConversationPending": false,
    "chatwootImportContacts": true,
    "chatwootNameInbox": "evolution",
    "chatwootMergeBrazilContacts": true,
    "chatwootImportMessages": true,
    "chatwootDaysLimitImportMessages": 3,
    "chatwootOrganization": "Evolution Bot",
    "chatwootLogo": "https://evolution-api.com/files/evolution-api-favicon.png"
}
~~~

### 2. Configuration for Existing Instances

If you already have an instance created and want to configure or change the integration with Chatwoot, use the `/chatwoot/set/{{instance}}` endpoint with the following request format:

#### Endpoint

~~~http
POST {{baseUrl}}/chatwoot/set/{{instance}}
~~~

#### Request Body

Here is an example of how the request body should look to configure the integration:

~~~json
{
    "enabled": true,
    "accountId": "1",
    "token": "TOKEN",
    "url": "https://chatwoot.com",
    "signMsg": true,
    "reopenConversation": true,
    "conversationPending": false,
    "nameInbox": "evolution",
    "mergeBrazilContacts": true,
    "importContacts": true,
    "importMessages": true,
    "daysLimitImportMessages": 2,
    "signDelimiter": "\n",
    "autoCreate": true,
    "organization": "BOT",
    "logo": "your_logo_link"
}
~~~

### Parameters Explanation

- **`enabled`**: Enables (`true`) or disables (`false`) the Chatwoot integration for the instance.
- **`accountId`**: The Chatwoot account ID associated with the integration.
- **`token`**: The authentication token of the admin user in Chatwoot.
- **`url`**: The base URL of Chatwoot. Important: Do not include a trailing `/` in the URL.
- **`signMsg`**: When enabled (`true`), adds the attendant's signature to the messages sent.
- **`reopenConversation`**: Defines whether the integration should always reopen the same conversation (`true`) or create a new one.
- **`conversationPending`**: Starts conversations as pending (`true`), awaiting action from an attendant.
- **`nameInbox`**: Custom name for the inbox in Chatwoot. If not provided, the instance name will be used.
- **`mergeBrazilContacts`**: Merges Brazilian contacts that have the additional `9` digit in their numbers (`true`).
- **`importContacts`**: Imports WhatsApp contacts into Chatwoot (`true`).
- **`importMessages`**: Imports WhatsApp messages into Chatwoot (`true`).
- **`daysLimitImportMessages`**: Sets the limit of days for importing old WhatsApp messages.
- **`signDelimiter`**: Delimiter used to separate the signature from the message body.
- **`autoCreate`**: If enabled (`true`), automatically creates the inbox configuration in Chatwoot.
- **`organization`**: The name of the bot command contact, used to customize the interaction.
- **`logo`**: URL of the image to be used as the profile picture for the bot command contact.

## Steps to Configure the Integration

1. **Obtain Credentials and URLs**:
   - Access the Chatwoot dashboard and obtain the `accountId` and `token` of the admin user.
   - Verify your Chatwoot's base URL and configure it without a trailing `/`.

2. **Create or Configure the Instance**:
   - Use the `/instance/create` endpoint to configure Chatwoot during instance creation.
   - Use the `/chatwoot/set/{{instance}}` endpoint to configure Chatwoot in an existing instance.

3. **Verify the Configuration**:
   - Access Chatwoot to ensure the inbox has been created and the settings are correct.
   - Test sending and receiving messages to confirm the integration.

## Final Considerations

The integration of Evolution API with Chatwoot allows you to centralize and automate WhatsApp communication directly in your customer support platform. With options for customization, importing contacts and messages, and the ability to reopen existing conversations, this integration offers flexibility to meet the specific needs of your workflow.

<Info>  
For more details on other integrations and configurations, check the [environment variables section](/v2/pt/env).
</Info>
```

# v2\en\integrations\cloudapi.mdx

```mdx
---
title: WhatsApp Cloud API
icon: whatsapp
---

Evolution API v2 allows you to integrate your application with the official WhatsApp Cloud API to manage messages, contacts, and other functionalities directly through the API. Below are the prerequisites and the integration process.

## Prerequisites

Before starting the integration with the WhatsApp Cloud API, ensure that the following steps have been completed:

### 1. Business Manager (BM) Creation and Approval

To use the official WhatsApp Cloud API, you need an approved **Business Manager** (BM). This process involves:

- Creating an account on [Facebook Business Manager](https://business.facebook.com/).
- Following the steps to verify your business.
- Waiting for your account approval.

### 2. Creating the App on Facebook Developers

After your BM is approved, you need to create an app on the [Facebook Developers](https://developers.facebook.com/) platform:

- Access your Facebook Developers account and click on **My Apps**.
- Click on **Create App** and follow the instructions to set up a new app.
- Make sure to add the WhatsApp API to your app.

### 3. Configuring the Number in the App

After creating the app, you need to configure the WhatsApp number:

- In your app's dashboard on Facebook Developers, go to the **WhatsApp** section.
- Add and verify the phone number you want to use with the Cloud API.
- Note the **Number ID** provided.

### 4. Create a Permanent Token

To avoid the access token from expiring, create a **permanent token** for the admin user of your BM:

- Go to the **Access Tokens** section on Facebook Developers.
- Generate a token with the necessary permissions for the WhatsApp API.
- Ensure that this token is permanent, so it doesn't need to be renewed periodically.

## Configuration in Evolution API v2

Now that you have completed the prerequisites, follow the steps below to configure the integration with Evolution API v2.

### 1. Creating the Instance

To create an instance that uses the WhatsApp Cloud API, you need to access the `/instance/create` route of Evolution API v2 with the following request body:

\`\`\`json
{
    "instanceName": "INSTANCE NAME",
    "token": "PERMANENT TOKEN OF BM ADMIN USER",
    "number": "WHATSAPP NUMBER ID",
    "businessId": "BUSINESS ID OF WHATSAPP ACCOUNT",
    "qrcode": false,
    "integration": "WHATSAPP-BUSINESS"
}
\`\`\`

### Request Body Parameters:

- **`instanceName`**: The name of the instance you are creating.
- **`token`**: Permanent token generated for the admin user of your BM.
- **`number`**: WhatsApp Number ID that you configured in the Facebook Developers app.
- **`businessId`**: ID of the business account associated with WhatsApp.
- **`qrcode`**: Set to `false` because the integration is token-based, not QR Code-based.
- **`integration`**: Use `"WHATSAPP-BUSINESS"` to specify that this integration is with the official WhatsApp Business API.

### Example Request:

\`\`\`bash
curl -X POST http://API_URL/instance/create \
-H "Content-Type: application/json" \
-d '{
    "instanceName": "MyInstance",
    "token": "EAAGm0PX4ZCpsBA...",
    "number": "1234567890",
    "businessId": "9876543210",
    "qrcode": false,
    "integration": "WHATSAPP-BUSINESS"
}'
\`\`\`

### 2. Webhook Configuration

After creating the instance, you need to configure the webhook in the Meta app to receive events and messages from WhatsApp.

#### Webhook URL

In your app's dashboard on Facebook Developers, configure the webhook with the following URL:

\`\`\`plaintext
API_URL/webhook/meta
\`\`\`

#### Webhook Token

The token to validate the webhook should be configured in the `WA_BUSINESS_TOKEN_WEBHOOK` variable in your `.env` file:

\`\`\`plaintext
WA_BUSINESS_TOKEN_WEBHOOK=your_webhook_token
\`\`\`

This token will be used by Meta to validate requests sent to your webhook.

### Conclusion

With the instance created and the webhook configured, your Evolution API v2 is ready to operate with the official WhatsApp Cloud API. All messages and events related to the configured number will be automatically managed by Evolution API.

This documentation provides a clear and detailed overview of how to integrate the WhatsApp Cloud API with Evolution API v2, from the necessary preparation to the final configuration. By following all the steps, you will be prepared to utilize WhatsApp functionalities in your application through Evolution API v2.
```

# v2\en\integrations\dify.mdx

```mdx
---
title: Dify
icon: robot
---

Evolution API allows the creation and management of bots using Dify technology, providing advanced automation and interactivity through different types of bots, such as chatBots, textGenerators, agents, and workflows. Below, you will find detailed instructions on how to configure bots, manage sessions, and set default configurations.

## 1. Creating Bots in Dify

You can configure various bots in Dify using triggers to initiate interactions. Bot configuration can be done through the `/dify/create/{{instance}}` endpoint.

### Endpoint for Bot Creation

#### Endpoint

~~~http
POST {{baseUrl}}/dify/create/{{instance}}
~~~

#### Request Body

Here is an example of a JSON body to configure a bot in Dify:

~~~json
{
    "enabled": true,
    "botType": "chatBot", /* chatBot, textGenerator, agent, workflow */
    "apiUrl": "http://dify.site.com/v1",
    "apiKey": "app-123456",
    // options
    "triggerType": "keyword", /* all or keyword */
    "triggerOperator": "equals", /* contains, equals, startsWith, endsWith, regex, none */
    "triggerValue": "test",
    "expire": 0,
    "keywordFinish": "#EXIT",
    "delayMessage": 1000,
    "unknownMessage": "Message not recognized",
    "listeningFromMe": false,
    "stopBotFromMe": false,
    "keepOpen": false,
    "debounceTime": 0,
    "ignoreJids": []
}
~~~

### Parameters Explanation

- **`enabled`**: Enables (`true`) or disables (`false`) the bot.
- **`botType`**: Type of Dify bot (`chatBot`, `textGenerator`, `agent`, `workflow`).
- **`apiUrl`**: Dify API URL (without a trailing `/`).
- **`apiKey`**: API key provided by Dify.
- **Options**:
  - **`triggerType`**: Type of trigger to start the bot (`all` or `keyword`).
  - **`triggerOperator`**: Operator used to evaluate the trigger (`contains`, `equals`, `startsWith`, `endsWith`, `regex`, `none`).
  - **`triggerValue`**: Value used in the trigger (e.g., a keyword or regex).
  - **`expire`**: Time in minutes after which the bot expires, restarting if the session has expired.
  - **`keywordFinish`**: Keyword that ends the bot session.
  - **`delayMessage`**: Delay (in milliseconds) to simulate typing before sending a message.
  - **`unknownMessage`**: Message sent when the user's input is not recognized.
  - **`listeningFromMe`**: Defines if the bot should listen to messages sent by the user (`true` or `false`).
  - **`stopBotFromMe`**: Defines if the bot should stop when the user sends a message (`true` or `false`).
  - **`keepOpen`**: Keeps the session open, preventing the bot from restarting for the same contact.
  - **`debounceTime`**: Time (in seconds) to combine multiple messages into one.
  - **`ignoreJids`**: List of JIDs of contacts that will not activate the bot.

## 2. Dify Default Settings

You can define default settings that will be applied if parameters are not passed during bot creation.

### Endpoint for Default Settings

#### Endpoint

~~~http
POST {{baseUrl}}/dify/settings/{{instance}}
~~~

#### Request Body

Here is an example of default settings:

~~~json
{
    "expire": 20,
    "keywordFinish": "#EXIT",
    "delayMessage": 1000,
    "unknownMessage": "Message not recognized",
    "listeningFromMe": false,
    "stopBotFromMe": false,
    "keepOpen": false,
    "debounceTime": 0,
    "ignoreJids": [],
    "difyIdFallback": "clyja4oys0a3uqpy7k3bd7swe"
}
~~~

### Parameters Explanation

- **`expire`**: Time in minutes after which the bot expires.
- **`keywordFinish`**: Keyword that ends the bot session.
- **`delayMessage`**: Delay to simulate typing before sending a message.
- **`unknownMessage`**: Message sent when the user's input is not recognized.
- **`listeningFromMe`**: Defines if the bot should listen to messages sent by the user.
- **`stopBotFromMe`**: Defines if the bot should stop when the user sends a message.
- **`keepOpen`**: Keeps the session open, preventing the bot from restarting for the same contact.
- **`debounceTime`**: Time to combine multiple messages into one.
- **`ignoreJids`**: List of JIDs of contacts that will not activate the bot.
- **`difyIdFallback`**: Fallback bot ID that will be used if no trigger is activated.

## 3. Managing Dify Sessions

You can manage the bot sessions by changing the status between open, paused, or closed for each specific contact.

### Endpoint for Session Management

#### Endpoint

~~~http
POST {{baseUrl}}/dify/changeStatus/{{instance}}
~~~

#### Request Body

Here is an example of how to manage the session status:

~~~json
{
    "remoteJid": "5511912345678@s.whatsapp.net",
    "status": "closed"
}
~~~

### Parameters Explanation

- **`remoteJid`**: JID (identifier) of the contact on WhatsApp.
- **`status`**: Session status (`opened`, `paused`, `closed`).

## 4. Automatic and Special Variables in Dify

When a Dify session is started, some predefined variables are automatically sent:

~~~json
inputs: {
    remoteJid: "Contact JID",
    pushName: "Contact name",
    instanceName: "Instance name",
    serverUrl: "API server URL",
    apiKey: "Evolution API Key"
};
~~~

### Automatic Variables Explanation

- **`remoteJid`**: JID of the contact the bot is interacting with.
- **`pushName`**: Contact's name on WhatsApp.
- **`instanceName`**: Name of the instance running the bot.
- **`serverUrl`**: URL of the server where Evolution API is hosted.
- **`apiKey`**: API key used to authenticate requests.

### Special Variables for Workflows

In the case of **workflow** bots, the received message is sent in the `query` variable within the inputs. This allows the workflow to process the message directly based on the content of the `query` variable.

### Example of Variables for Workflow

~~~json
inputs: {
    remoteJid: "Contact JID",
    pushName: "Contact name",
    instanceName: "Instance name",
    serverUrl: "API server URL",
    apiKey: "Evolution API Key",
    query: "Received message content"
}
~~~

## Final Considerations

The integration of Evolution API with Dify offers a robust way to automate interactions on WhatsApp, using different types of bots to meet the specific needs of your business. With the ability to configure triggers, manage sessions, and use automatic variables, you can optimize the workflow and improve the end-user experience.
```

# v2\en\integrations\evoai.mdx

```mdx
---
title: EvoAI
icon: robot
---

Evolution API allows the creation and management of bots using EvoAI technology, providing advanced automation and interactivity through different types of bots. EvoAI is our own technology developed by the Evolution team. You can learn more at [evo-ai.co](https://evo-ai.co). Below, you will find detailed instructions on how to configure bots, manage sessions, and set default configurations.

## 1. Creating Bots in EvoAI

You can configure various bots in EvoAI using triggers to initiate interactions. Bot configuration can be done through the `/evoai/create/{{instance}}` endpoint.

### Endpoint for Bot Creation

#### Endpoint

~~~http
POST {{baseUrl}}/evoai/create/{{instance}}
~~~

#### Request Body

Here is an example of a JSON body to configure a bot in EvoAI:

~~~json
{
    "enabled": true,
    "agentUrl": "http://evoai.site.com/v1",
    "apiKey": "app-123456",
    // options
    "triggerType": "keyword", /* all or keyword */
    "triggerOperator": "equals", /* contains, equals, startsWith, endsWith, regex, none */
    "triggerValue": "test",
    "expire": 0,
    "keywordFinish": "#EXIT",
    "delayMessage": 1000,
    "unknownMessage": "Message not recognized",
    "listeningFromMe": false,
    "stopBotFromMe": false,
    "keepOpen": false,
    "debounceTime": 0,
    "ignoreJids": []
}
~~~

### Parameters Explanation

- **`enabled`**: Enables (`true`) or disables (`false`) the bot.
- **`agentUrl`**: EvoAI API URL (without a trailing `/`).
- **`apiKey`**: API key provided by EvoAI.
- **Options**:
  - **`triggerType`**: Type of trigger to start the bot (`all` or `keyword`).
  - **`triggerOperator`**: Operator used to evaluate the trigger (`contains`, `equals`, `startsWith`, `endsWith`, `regex`, `none`).
  - **`triggerValue`**: Value used in the trigger (e.g., a keyword or regex).
  - **`expire`**: Time in minutes after which the bot expires, restarting if the session has expired.
  - **`keywordFinish`**: Keyword that ends the bot session.
  - **`delayMessage`**: Delay (in milliseconds) to simulate typing before sending a message.
  - **`unknownMessage`**: Message sent when the user's input is not recognized.
  - **`listeningFromMe`**: Defines if the bot should listen to messages sent by the user (`true` or `false`).
  - **`stopBotFromMe`**: Defines if the bot should stop when the user sends a message (`true` or `false`).
  - **`keepOpen`**: Keeps the session open, preventing the bot from restarting for the same contact.
  - **`debounceTime`**: Time (in seconds) to combine multiple messages into one.
  - **`ignoreJids`**: List of JIDs of contacts that will not activate the bot.

## 2. EvoAI Default Settings

You can define default settings that will be applied if parameters are not passed during bot creation.

### Endpoint for Default Settings

#### Endpoint

~~~http
POST {{baseUrl}}/evoai/settings/{{instance}}
~~~

#### Request Body

Here is an example of default settings:

~~~json
{
    "expire": 20,
    "keywordFinish": "#EXIT",
    "delayMessage": 1000,
    "unknownMessage": "Message not recognized",
    "listeningFromMe": false,
    "stopBotFromMe": false,
    "keepOpen": false,
    "debounceTime": 0,
    "ignoreJids": [],
    "evoaiIdFallback": "clyja4oys0a3uqpy7k3bd7swe"
}
~~~

### Parameters Explanation

- **`expire`**: Time in minutes after which the bot expires.
- **`keywordFinish`**: Keyword that ends the bot session.
- **`delayMessage`**: Delay to simulate typing before sending a message.
- **`unknownMessage`**: Message sent when the user's input is not recognized.
- **`listeningFromMe`**: Defines if the bot should listen to messages sent by the user.
- **`stopBotFromMe`**: Defines if the bot should stop when the user sends a message.
- **`keepOpen`**: Keeps the session open, preventing the bot from restarting for the same contact.
- **`debounceTime`**: Time to combine multiple messages into one.
- **`ignoreJids`**: List of JIDs of contacts that will not activate the bot.
- **`evoaiIdFallback`**: Fallback bot ID that will be used if no trigger is activated.

## 3. Managing EvoAI Sessions

You can manage the bot sessions by changing the status between open, paused, or closed for each specific contact.

### Endpoint for Session Management

#### Endpoint

~~~http
POST {{baseUrl}}/evoai/changeStatus/{{instance}}
~~~

#### Request Body

Here is an example of how to manage the session status:

~~~json
{
    "remoteJid": "5511912345678@s.whatsapp.net",
    "status": "closed"
}
~~~

### Parameters Explanation

- **`remoteJid`**: JID (identifier) of the contact on WhatsApp.
- **`status`**: Session status (`opened`, `paused`, `closed`).

## 4. Automatic Variables in EvoAI

When an EvoAI session is started, some predefined variables are automatically sent:

~~~json
inputs: {
    remoteJid: "Contact JID",
    pushName: "Contact name",
    instanceName: "Instance name",
    serverUrl: "API server URL",
    apiKey: "Evolution API Key"
};
~~~

### Automatic Variables Explanation

- **`remoteJid`**: JID of the contact the bot is interacting with.
- **`pushName`**: Contact's name on WhatsApp.
- **`instanceName`**: Name of the instance running the bot.
- **`serverUrl`**: URL of the server where Evolution API is hosted.
- **`apiKey`**: API key used to authenticate requests.

## Final Considerations

The integration of Evolution API with EvoAI offers a robust way to automate interactions on WhatsApp. With the ability to configure triggers, manage sessions, and use automatic variables, you can optimize the workflow and improve the end-user experience.
```

# v2\en\integrations\evolution-bot.mdx

```mdx
---
title: Evolution Bot
icon: robot
---

**Evolution Bot** is a universal chatbot integration that allows the use of any API URL or automation to create automated interactions. When using Evolution Bot, your API must return a response in the form of a JSON containing the `message` field, which will be sent back to the user. This system offers flexibility to build chatbots that seamlessly integrate with your custom APIs.

## 1. Creating Bots in Evolution Bot

You can configure bots in Evolution Bot using triggers to initiate interactions. Bot configuration can be done through the `/evolutionBot/create/{{instance}}` endpoint.

### Endpoint for Bot Creation

#### Endpoint

~~~http
POST {{baseUrl}}/evolutionBot/create/{{instance}}
~~~

#### Request Body

Here is an example of a JSON body to configure a bot in Evolution Bot:

~~~json
{
    "enabled": true,
    "apiUrl": "http://api.site.com/v1",
    "apiKey": "app-123456", // optional
    // options
    "triggerType": "keyword", /* all or keyword */
    "triggerOperator": "equals", /* contains, equals, startsWith, endsWith, regex, none */
    "triggerValue": "test",
    "expire": 0,
    "keywordFinish": "#EXIT",
    "delayMessage": 1000,
    "unknownMessage": "Message not recognized",
    "listeningFromMe": false,
    "stopBotFromMe": false,
    "keepOpen": false,
    "debounceTime": 0,
    "ignoreJids": []
}
~~~

### Parameters Explanation

- **`enabled`**: Enables (`true`) or disables (`false`) the bot.
- **`apiUrl`**: API URL that the bot will call (without a trailing `/`).
- **`apiKey`**: API key provided by your application (optional).
- **Options**:
  - **`triggerType`**: Type of trigger to start the bot (`all` or `keyword`).
  - **`triggerOperator`**: Operator used to evaluate the trigger (`contains`, `equals`, `startsWith`, `endsWith`, `regex`, `none`).
  - **`triggerValue`**: Value used in the trigger (e.g., a keyword or regex).
  - **`expire`**: Time in minutes after which the bot expires, restarting if the session has expired.
  - **`keywordFinish`**: Keyword that ends the bot session.
  - **`delayMessage`**: Delay (in milliseconds) to simulate typing before sending a message.
  - **`unknownMessage`**: Message sent when the user's input is not recognized.
  - **`listeningFromMe`**: Defines if the bot should listen to messages sent by the user (`true` or `false`).
  - **`stopBotFromMe`**: Defines if the bot should stop when the user sends a message (`true` or `false`).
  - **`keepOpen`**: Keeps the session open, preventing the bot from restarting for the same contact.
  - **`debounceTime`**: Time (in seconds) to combine multiple messages into one.
  - **`ignoreJids`**: List of JIDs of contacts that will not activate the bot.

### Example of API Response

Your API's response should be in JSON format and contain the message to be sent to the user in the `message` field:

~~~json
{
    "message": "Your response here"
}
~~~

## 2. Default Settings for Evolution Bot

You can define default settings that will be applied if parameters are not passed during bot creation.

### Endpoint for Default Settings

#### Endpoint

~~~http
POST {{baseUrl}}/evolutionBot/settings/{{instance}}
~~~

#### Request Body

Here is an example of default settings:

~~~json
{
    "expire": 20,
    "keywordFinish": "#EXIT",
    "delayMessage": 1000,
    "unknownMessage": "Message not recognized",
    "listeningFromMe": false,
    "stopBotFromMe": false,
    "keepOpen": false,
    "debounceTime": 0,
    "ignoreJids": [],
    "evolutionBotIdFallback": "clyja4oys0a3uqpy7k3bd7swe"
}
~~~

### Parameters Explanation

- **`expire`**: Time in minutes after which the bot expires.
- **`keywordFinish`**: Keyword that ends the bot session.
- **`delayMessage`**: Delay to simulate typing before sending a message.
- **`unknownMessage`**: Message sent when the user's input is not recognized.
- **`listeningFromMe`**: Defines if the bot should listen to messages sent by the user.
- **`stopBotFromMe`**: Defines if the bot should stop when the user sends a message.
- **`keepOpen`**: Keeps the session open, preventing the bot from restarting for the same contact.
- **`debounceTime`**: Time to combine multiple messages into one.
- **`ignoreJids`**: List of JIDs of contacts that will not activate the bot.
- **`evolutionBotIdFallback`**: Fallback bot ID that will be used if no trigger is activated.

## 3. Managing Evolution Bot Sessions

You can manage the bot sessions by changing the status between open, paused, or closed for each specific contact.

### Endpoint for Session Management

#### Endpoint

~~~http
POST {{baseUrl}}/evolutionBot/changeStatus/{{instance}}
~~~

#### Request Body

Here is an example of how to manage the session status:

~~~json
{
    "remoteJid": "5511912345678@s.whatsapp.net",
    "status": "closed"
}
~~~

### Parameters Explanation

- **`remoteJid`**: JID (identifier) of the contact on WhatsApp.
- **`status`**: Session status (`opened`, `paused`, `closed`).

## 4. Automatic and Special Variables in Evolution Bot

When an Evolution Bot session is started, some predefined variables are automatically sent:

~~~json
inputs: {
    remoteJid: "Contact JID",
    pushName: "Contact name",
    instanceName: "Instance name",
    serverUrl: "API server URL",
    apiKey: "Evolution API Key"
};
~~~

### Explanation of Automatic Variables

- **`remoteJid`**: JID of the contact the bot is interacting with.
- **`pushName`**: Contact's name on WhatsApp.
- **`instanceName`**: Name of the instance running the bot.
- **`serverUrl`**: URL of the server where Evolution API is hosted.
- **`apiKey`**: API key used to authenticate requests.

### Final Considerations

Evolution Bot offers a flexible platform for integrating chatbots with your custom APIs, enabling advanced automation and personalized interactions on WhatsApp. With support for triggers, session management, and automatic variable configuration, you can build a robust and effective chatbot experience for your users.
```

# v2\en\integrations\evolution-channel.mdx

```mdx
---
title: Evolution Channel
icon: messages
---

**Evolution Channel** is a universal integration channel that allows messages to be received through webhooks, providing flexibility to connect various systems and applications with the Evolution API. This channel facilitates automation and message management, supporting multiple integrations and workflows.

---

## 1. Configuring the Evolution Instance

To configure an instance in the Evolution Channel, you need to access the `/instance/create` route of the Evolution API with the following request body:

### Creating the Instance

**Endpoint**
\`\`\`http
POST {{baseUrl}}/instance/create
\`\`\`

**Request Body**

Here is an example of how to create an instance in the Evolution Channel:
\`\`\`json
{
    "instanceName": "INSTANCE NAME",
    "token": "INSTANCE TOKEN (OPTIONAL)",
    "number": "INSTANCE NUMBER ID",
    "qrcode": false,
    "integration": "EVOLUTION"
}
\`\`\`

### Request Body Parameters

- **`instanceName`**: Name of the instance you are creating.
- **`token`**: Optional token to authenticate the instance.
- **`number`**: Number ID of the instance that will be used to receive and send messages.
- **`qrcode`**: Set to `false` because the integration does not require a QR Code.
- **`integration`**: Use `"EVOLUTION"` to specify that this integration is with the universal Evolution channel.

**Example Request**
\`\`\`bash
curl -X POST http://API_URL/instance/create \
-H "Content-Type: application/json" \
-d '{
    "instanceName": "MyInstance",
    "token": "123456",
    "number": "9876543210",
    "qrcode": false,
    "integration": "EVOLUTION"
}'
\`\`\`

---

## 2. Message Input in the Evolution Channel

After creating the instance, the Evolution Channel will receive the messages sent to the configured instance. These messages are sent to the `{baseUrl}/webhook/evolution` route as POST requests. This is the entry point for messages that the Evolution Channel will process.

**Webhook URL for Message Input**
\`\`\`http
POST {{baseUrl}}/webhook/evolution
\`\`\`

### Example of Message Input Payload

Here is an example of the payload format sent to the Evolution Channel when a message is received:

\`\`\`json
{
    "numberId": "1234567", 
    "key": {
        "remoteJid": "557499879409",
        "fromMe": false,
        "id": "ABC1234"
    },
    "pushName": "Davidson",
    "message": {
        "conversation": "What is your name?"
    },
    "messageType": "conversation"
}
\`\`\`

### Explanation of Payload Fields

- **`numberId`**: ID of the number registered when creating the instance.
- **`key.remoteJid`**: Number or unique ID of the contact who sent the message.
- **`key.fromMe`**: Indicates whether the message was sent by the contact (`false`) or by the system itself (`true`).
- **`key.id`**: Unique ID of the message.
- **`pushName`**: Name of the contact who sent the message.
- **`message.conversation`**: Content of the received message.
- **`messageType`**: Type of message (in this case, `conversation`).

---

## 3. Feedback and Postbacks

The Evolution Channel sends feedback and postbacks through configured event channels such as webhooks, RabbitMQ, or SQS. This allows you to receive real-time notifications about the status of messages and interactions, keeping your system up to date.

**Examples of Event Channels**
- **Webhook**: Notifications are sent to a specified HTTP endpoint.
- **RabbitMQ**: Messages are sent to a configured RabbitMQ queue.
- **SQS**: Messages are sent to an AWS SQS queue.

**Event Channel Configuration**
To configure event channels, define the necessary parameters in your configuration file or directly in the instance, according to the Evolution API specifications.

---

## Conclusion

With the instance created and the message input webhook configured, your Evolution API is ready to operate with the Evolution Channel. All received messages and associated events will be managed centrally, allowing for seamless and efficient integration with your messaging and automation systems.

This documentation provides a clear and detailed overview of how to integrate the Evolution Channel with the Evolution API, from instance creation to configuring webhooks and event channels. By following these steps, you will be prepared to use the universal Evolution channel in your application.
```

# v2\en\integrations\flowise.mdx

```mdx
---
title: Flowise
icon: robot
---

Evolution API allows the creation and management of bots using Flowise technology, providing advanced automation and interactivity through different types of interactions. Below, you will find detailed instructions on how to configure bots, manage sessions, and set default configurations.

## 1. Creating Bots in Flowise

You can configure various bots in Flowise using triggers to initiate interactions. Bot configuration can be done through the `/flowise/create/{{instance}}` endpoint.

### Endpoint for Bot Creation

#### Endpoint

~~~http
POST {{baseUrl}}/flowise/create/{{instance}}
~~~

#### Request Body

Here is an example of a JSON body to configure a bot in Flowise:

~~~json
{
    "enabled": true,
    "apiUrl": "http://flowise.site.com/v1",
    "apiKey": "app-123456", // optional
    // options
    "triggerType": "keyword", /* all or keyword */
    "triggerOperator": "equals", /* contains, equals, startsWith, endsWith, regex, none */
    "triggerValue": "test",
    "expire": 0,
    "keywordFinish": "#EXIT",
    "delayMessage": 1000,
    "unknownMessage": "Message not recognized",
    "listeningFromMe": false,
    "stopBotFromMe": false,
    "keepOpen": false,
    "debounceTime": 0,
    "ignoreJids": []
}
~~~

### Parameters Explanation

- **`enabled`**: Enables (`true`) or disables (`false`) the bot.
- **`apiUrl`**: Flowise API URL (without a trailing `/`).
- **`apiKey`**: API key provided by Flowise (optional).
- **Options**:
  - **`triggerType`**: Type of trigger to start the bot (`all` or `keyword`).
  - **`triggerOperator`**: Operator used to evaluate the trigger (`contains`, `equals`, `startsWith`, `endsWith`, `regex`, `none`).
  - **`triggerValue`**: Value used in the trigger (e.g., a keyword or regex).
  - **`expire`**: Time in minutes after which the bot expires, restarting if the session has expired.
  - **`keywordFinish`**: Keyword that ends the bot session.
  - **`delayMessage`**: Delay (in milliseconds) to simulate typing before sending a message.
  - **`unknownMessage`**: Message sent when the user's input is not recognized.
  - **`listeningFromMe`**: Defines if the bot should listen to messages sent by the user (`true` or `false`).
  - **`stopBotFromMe`**: Defines if the bot should stop when the user sends a message (`true` or `false`).
  - **`keepOpen`**: Keeps the session open, preventing the bot from restarting for the same contact.
  - **`debounceTime`**: Time (in seconds) to combine multiple messages into one.
  - **`ignoreJids`**: List of JIDs of contacts that will not activate the bot.

## 2. Flowise Default Settings

You can define default settings that will be applied if parameters are not passed during bot creation.

### Endpoint for Default Settings

#### Endpoint

~~~http
POST {{baseUrl}}/flowise/settings/{{instance}}
~~~

#### Request Body

Here is an example of default settings:

~~~json
{
    "expire": 20,
    "keywordFinish": "#EXIT",
    "delayMessage": 1000,
    "unknownMessage": "Message not recognized",
    "listeningFromMe": false,
    "stopBotFromMe": false,
    "keepOpen": false,
    "debounceTime": 0,
    "ignoreJids": [],
    "flowiseIdFallback": "clyja4oys0a3uqpy7k3bd7swe"
}
~~~

### Parameters Explanation

- **`expire`**: Time in minutes after which the bot expires.
- **`keywordFinish`**: Keyword that ends the bot session.
- **`delayMessage`**: Delay to simulate typing before sending a message.
- **`unknownMessage`**: Message sent when the user's input is not recognized.
- **`listeningFromMe`**: Defines if the bot should listen to messages sent by the user.
- **`stopBotFromMe`**: Defines if the bot should stop when the user sends a message.
- **`keepOpen`**: Keeps the session open, preventing the bot from restarting for the same contact.
- **`debounceTime`**: Time to combine multiple messages into one.
- **`ignoreJids`**: List of JIDs of contacts that will not activate the bot.
- **`flowiseIdFallback`**: Fallback bot ID that will be used if no trigger is activated.

## 3. Managing Flowise Sessions

You can manage the bot sessions by changing the status between open, paused, or closed for each specific contact.

### Endpoint for Session Management

#### Endpoint

~~~http
POST {{baseUrl}}/flowise/changeStatus/{{instance}}
~~~

#### Request Body

Here is an example of how to manage the session status:

~~~json
{
    "remoteJid": "5511912345678@s.whatsapp.net",
    "status": "closed"
}
~~~

### Parameters Explanation

- **`remoteJid`**: JID (identifier) of the contact on WhatsApp.
- **`status`**: Session status (`opened`, `paused`, `closed`).

## 4. Automatic and Special Variables in Flowise

When a Flowise session is started, some predefined variables are automatically sent:

~~~json
inputs: {
    remoteJid: "Contact JID",
    pushName: "Contact name",
    instanceName: "Instance name",
    serverUrl: "API server URL",
    apiKey: "Evolution API Key"
};
~~~

### Explanation of Automatic Variables

- **`remoteJid`**: JID of the contact the bot is interacting with.
- **`pushName`**: Contact's name on WhatsApp.
- **`instanceName`**: Name of the instance running the bot.
- **`serverUrl`**: URL of the server where Evolution API is hosted.
- **`apiKey`**: API key used to authenticate requests.

### Special Variables for Workflows

In the case of **workflow** bots, the received message is sent in the `query` variable within the inputs. This allows the workflow to process the message directly based on the content of the `query` variable.

### Example of Variables for Workflow

~~~json
inputs: {
    remoteJid: "Contact JID",
    pushName: "Contact name",
    instanceName: "Instance name",
    serverUrl: "API server URL",
    apiKey: "Evolution API Key",
    query: "Received message content"
}
~~~

## Final Considerations

The integration of Evolution API with Flowise offers a robust way to automate interactions on WhatsApp, using different types of bots to meet the specific needs of your business. With the ability to configure triggers, manage sessions, and use automatic variables, you can optimize the workflow and improve the end-user experience.
```

# v2\en\integrations\openai.mdx

```mdx
---
title: OpenAI  
icon: robot
---

The Evolution API allows for the creation and management of bots using OpenAI technology, enabling automated and personalized interactions through virtual assistants or chat completion models. Below, you will find detailed instructions on how to configure credentials, create bots, manage sessions, and set default configurations, including the use of speech-to-text recognition.

## 1. Creating OpenAI Credentials

Before creating bots, you need to configure the OpenAI API credentials. This is done using the `/openai/creds/{{instance}}` endpoint.

### Endpoint for Credential Creation

#### Endpoint

~~~http
POST {{baseUrl}}/openai/creds/{{instance}}
~~~

#### Request Body

Here is an example of how to register a new OpenAI credential:

~~~json
{
    "name": "apikey",
    "apiKey": "sk-proj-..."
}
~~~

### Parameters Explanation

- **`name`**: Identifier name for the credential.
- **`apiKey`**: API key provided by OpenAI.

## 2. Creating Bots with OpenAI

After configuring the credentials, you can create various bots that use the trigger system to initiate interactions. This can be done through the `/openai/create/{{instance}}` endpoint.

### Endpoint for Bot Creation

#### Endpoint

~~~http
POST {{baseUrl}}/openai/create/{{instance}}
~~~

#### Request Body

Here is an example of how to create a bot using OpenAI:

~~~json
{
    "enabled": true,
    "openaiCredsId": "clyrx36wj0001119ucjjzxik1",
    "botType": "assistant", 
    // for assistants
    "assistantId": "asst_LRNyh6qC4qq8NTyPjHbcJjSp",
    "functionUrl": "https://n8n.site.com", 
    // for chat completion
    "model": "gpt-4",
    "systemMessages": [
        "You are a helpful assistant."
    ],
    "assistantMessages": [
        "\n\nHello there, how may I assist you today?"
    ],
    "userMessages": [
        "Hello!"
    ],
    "maxTokens": 300,
    // options
    "triggerType": "keyword", 
    "triggerOperator": "equals", 
    "triggerValue": "test",
    "expire": 20,
    "keywordFinish": "#EXIT",
    "delayMessage": 1000,
    "unknownMessage": "Message not recognized",
    "listeningFromMe": false,
    "stopBotFromMe": false,
    "keepOpen": false,
    "debounceTime": 10,
    "ignoreJids": []
}
~~~

### Parameters Explanation

- **`enabled`**: Enables (`true`) or disables (`false`) the bot.
- **`openaiCredsId`**: ID of the previously registered credential.
- **`botType`**: Type of bot (`assistant` or `chatCompletion`).
  - **For Assistants (`assistant`)**:
    - **`assistantId`**: ID of the OpenAI assistant.
    - **`functionUrl`**: URL that will be called if the assistant needs to perform an action.
  - **For Chat Completion (`chatCompletion`)**:
    - **`model`**: OpenAI model to be used (e.g., `gpt-4`).
    - **`systemMessages`**: Messages that configure the bot's behavior.
    - **`assistantMessages`**: Initial messages from the bot.
    - **`userMessages`**: Example user messages.
    - **`maxTokens`**: Maximum number of tokens used in the response.
- **Options**:
  - **`triggerType`**: Type of trigger to start the bot (`all` or `keyword`).
  - **`triggerOperator`**: Operator used to evaluate the trigger (`contains`, `equals`, `startsWith`, `endsWith`, `regex`, `none`).
  - **`triggerValue`**: Value used in the trigger (e.g., a keyword or regex).
  - **`expire`**: Time in minutes after which the bot expires, restarting if the session has expired.
  - **`keywordFinish`**: Keyword that ends the bot session.
  - **`delayMessage`**: Delay (in milliseconds) to simulate typing before sending a message.
  - **`unknownMessage`**: Message sent when the user's input is not recognized.
  - **`listeningFromMe`**: Defines if the bot should listen to messages sent by the user (`true` or `false`).
  - **`stopBotFromMe`**: Defines if the bot should stop when the user sends a message (`true` or `false`).
  - **`keepOpen`**: Keeps the session open, preventing the bot from restarting for the same contact.
  - **`debounceTime`**: Time (in seconds) to combine multiple messages into one.
  - **`ignoreJids`**: List of JIDs of contacts that will not activate the bot.

## 3. Managing OpenAI Sessions

You can manage the bot sessions by changing the status between open, paused, or closed for each specific contact.

### Endpoint for Session Management

#### Endpoint

~~~http
POST {{baseUrl}}/openai/changeStatus/{{instance}}
~~~

#### Request Body

Here is an example of how to manage the session status:

~~~json
{
    "remoteJid": "5511912345678@s.whatsapp.net",
    "status": "closed"
}
~~~

### Parameters Explanation

- **`remoteJid`**: JID (identifier) of the contact on WhatsApp.
- **`status`**: Session status (`opened`, `paused`, `closed`).

## 4. OpenAI Default Settings

You can define default settings that will be applied if parameters are not passed during bot creation. This also includes the option to use speech-to-text recognition.

### Endpoint for Default Settings

#### Endpoint

~~~http
POST {{baseUrl}}/openai/settings/{{instance}}
~~~

#### Request Body

Here is an example of default settings:

~~~json
{
    "openaiCredsId": "clyja4oys0a3uqpy7k3bd7swe",
    "expire": 20,
    "keywordFinish": "#EXIT",
    "delayMessage": 1000,
    "unknownMessage": "Message not recognized",
    "listeningFromMe": false,
    "stopBotFromMe": false,
    "keepOpen": false,
    "debounceTime": 0,
    "ignoreJids": [],
    "openaiIdFallback": "clyja4oys0a3uqpy7k3bd7swe",
    "speechToText": true
}
~~~

### Parameters Explanation

- **`openaiCredsId`**: ID of the OpenAI credential to be used as default.
- **`expire`**: Time in minutes after which the bot expires.
- **`keywordFinish`**: Keyword that ends the bot session.
- **`delayMessage`**: Delay to simulate typing before sending a message.
- **`unknownMessage`**: Message sent when the user's input is not recognized.
- **`listeningFromMe`**: Defines if the bot should listen to messages sent by the user.
- **`stopBotFromMe`**: Defines if the bot should stop when the user sends a message.
- **`keepOpen`**: Keeps the session open, preventing the bot from restarting for the same contact.
- **`debounceTime`**: Time to combine multiple messages into one.
- **`ignoreJids`**: List of JIDs of contacts that will not activate the bot.
- **`openaiIdFallback`**: Fallback bot ID that will be used if no trigger is activated.
- **`speechToText`**: Defines if the speech-to-text recognition feature should be activated using the default credential.

### Webhook with `speechToText`

When the `speechToText` parameter is enabled, the Evolution API automatically converts received audio to text using the OpenAI credential. The audio transcription is then included in the webhook sent by the API.

#### Example of Webhook with `speechToText`

~~~json
{
    "event": "message",
    "data": {
        "message": {
            "id": "message-id",
            "from": "sender-number",
            "to": "receiver-number",
            "content": "Text message",
            "speechToText": "This is the transcribed text from the audio."
        }
    }
}
~~~

## Final Considerations

The integration of Evolution API with OpenAI offers a powerful way to automate interactions on WhatsApp, using artificial intelligence to provide dynamic and personalized responses. With the right settings, you can create highly efficient virtual assistants, manage sessions, and set default configurations, including the use of speech recognition to automatically convert audio to text.
```

# v2\en\integrations\rabbitmq.mdx

```mdx
---
title: RabbitMQ  
icon: rabbit
---

The Evolution API allows integration with **RabbitMQ** to manage events and message queues, facilitating efficient and scalable task communication and processing. Below, you will find information on how to configure RabbitMQ both globally and for individual instances.

## Global RabbitMQ Configuration

With the new global configuration, it's possible to centralize event processing in unified queues, rather than configuring separate queues for each instance. This simplifies event management as all system events are routed through specific queues based on the event type.

### Environment Variable Configuration

Here are the necessary environment variables to enable and configure RabbitMQ globally:

\`\`\`plaintext
RABBITMQ_ENABLED=true
RABBITMQ_URI=amqp://admin:admin@localhost:5672/default
RABBITMQ_EXCHANGE_NAME=evolution_exchange
RABBITMQ_GLOBAL_ENABLED=true
\`\`\`

### Configurable Events

With global mode enabled (`RABBITMQ_GLOBAL_ENABLED=true`), all events are queued in specific queues by event type rather than by instance. Here is a list of events you can activate globally:

\`\`\`plaintext
RABBITMQ_EVENTS_APPLICATION_STARTUP=true
RABBITMQ_EVENTS_INSTANCE_CREATE=true
RABBITMQ_EVENTS_INSTANCE_DELETE=true
RABBITMQ_EVENTS_QRCODE_UPDATED=true
RABBITMQ_EVENTS_MESSAGES_SET=true
RABBITMQ_EVENTS_MESSAGES_UPSERT=true
RABBITMQ_EVENTS_MESSAGES_EDITED=true
RABBITMQ_EVENTS_MESSAGES_UPDATE=true
RABBITMQ_EVENTS_MESSAGES_DELETE=true
RABBITMQ_EVENTS_SEND_MESSAGE=true
RABBITMQ_EVENTS_CONTACTS_SET=true
RABBITMQ_EVENTS_CONTACTS_UPSERT=true
RABBITMQ_EVENTS_CONTACTS_UPDATE=true
RABBITMQ_EVENTS_PRESENCE_UPDATE=true
RABBITMQ_EVENTS_CHATS_SET=true
RABBITMQ_EVENTS_CHATS_UPSERT=true
RABBITMQ_EVENTS_CHATS_UPDATE=true
RABBITMQ_EVENTS_CHATS_DELETE=true
RABBITMQ_EVENTS_GROUPS_UPSERT=true
RABBITMQ_EVENTS_GROUP_UPDATE=true
RABBITMQ_EVENTS_GROUP_PARTICIPANTS_UPDATE=true
RABBITMQ_EVENTS_CONNECTION_UPDATE=true
RABBITMQ_EVENTS_CALL=true
RABBITMQ_EVENTS_TYPEBOT_START=true
RABBITMQ_EVENTS_TYPEBOT_CHANGE_STATUS=true
\`\`\`

### Operation

- **Queue by Event**: In global mode, events are queued in specific queues for each event type. For example, all message update events (`MESSAGES_UPDATE`) will be queued in the same queue, regardless of the originating instance.
- **Ease of Management**: This approach simplifies the management and monitoring of events, allowing for centralized operations and simplifying the logic for message consumption in your system.

## RabbitMQ Configuration for Individual Instances

While global configuration is recommended for centralizing event processing, it's still possible to configure RabbitMQ for individual instances if segmentation by instance is needed.

### Endpoint for Individual Configuration

To configure RabbitMQ for a specific WhatsApp instance in the Evolution API, use the following endpoint:

~~~ http
POST [baseUrl]/rabbitmq/set/[instance_name]
~~~

### Request Body

Here is an example of a JSON request body to configure events for a specific instance:

~~~ json
{
    "enabled": true,
    "events": [
        "APPLICATION_STARTUP",
        "QRCODE_UPDATED",
        "MESSAGES_SET",
        "MESSAGES_UPSERT",
        "MESSAGES_UPDATE",
        "MESSAGES_DELETE",
        "SEND_MESSAGE",
        "CONTACTS_SET",
        "CONTACTS_UPSERT",
        "CONTACTS_UPDATE",
        "PRESENCE_UPDATE",
        "CHATS_SET",
        "CHATS_UPSERT",
        "CHATS_UPDATE",
        "CHATS_DELETE",
        "GROUPS_UPSERT",
        "GROUP_UPDATE",
        "GROUP_PARTICIPANTS_UPDATE",
        "CONNECTION_UPDATE",
        "CALL",
        "NEW_JWT_TOKEN"
    ]
}
~~~

<Note>  
Remove unused events to optimize RabbitMQ resource usage.
</Note>

When configuring RabbitMQ integration for individual instances, adjust the event array in the JSON body to include only the events relevant to that instance.

## Final Considerations

RabbitMQ configuration in the Evolution API offers flexibility to manage events centrally with global configuration or segmented by instance, depending on your system's needs. Use the global configuration to simplify event management in complex environments, or configure it individually for more granular control.

<Info>  
For more details on RabbitMQ environment variables and other advanced configurations, consult the [environment variables section](/v2/pt/env#rabbitmq).
</Info>
```

# v2\en\integrations\s3minio.mdx

```mdx
Aqui está a tradução para o inglês:

---

title: S3/Minio  
icon: cloud

---

The Evolution API supports integration with Amazon S3 or Minio to store WhatsApp media files such as images, audio, and documents. This integration allows files to be stored securely and made accessible, with links automatically generated and included in the webhooks sent by the API.

## Environment Variable Configuration

To enable S3 or Minio storage, you need to set the appropriate environment variables in the Evolution API's `.env` file. Below are the required variables and their functions:

### Configuration Variables for S3

\`\`\`plaintext
S3_ENABLED=true
S3_ACCESS_KEY=lJiKQSKlco6UfSUJSnZt
S3_SECRET_KEY=gZXkzkXQwhME8XEmZVNF0ImSWxIpbXeJ5UoPy4s1
S3_BUCKET=evolution
S3_PORT=443
S3_ENDPOINT=s3.eu-west-3.amazonaws.com
S3_USE_SSL=true
S3_REGION=eu-west-3
\`\`\`

### Explanation of Variables

- **`S3_ENABLED`**: Enables (`true`) or disables (`false`) the use of S3 or Minio for file storage.
- **`S3_ACCESS_KEY`**: Access key provided by the service provider (AWS or Minio).
- **`S3_SECRET_KEY`**: Secret key corresponding to the access key, used for authentication.
- **`S3_BUCKET`**: Name of the bucket where files will be stored.
- **`S3_PORT`**: Port used for the connection, usually `443` for SSL connections.
- **`S3_ENDPOINT`**: Endpoint of the S3 or Minio service. For Amazon S3, it’s necessary to include the region in the format `region: s3.[region].amazonaws.com`, e.g., `s3.eu-west-3.amazonaws.com`.
- **`S3_USE_SSL`**: Defines whether the connection should use SSL (`true` or `false`).
- **`S3_REGION`**: The region of the S3 bucket (default is `us-east-1`).

### Configuration Examples

#### Amazon S3

When using Amazon S3, it is essential to specify the endpoint correctly, including the region. Here is an example:

\`\`\`plaintext
S3_ENABLED=true
S3_ACCESS_KEY=your-aws-access-key
S3_SECRET_KEY=your-aws-secret-key
S3_BUCKET=my-s3-bucket
S3_PORT=443
S3_ENDPOINT=s3.eu-west-3.amazonaws.com
S3_USE_SSL=true
S3_REGION=eu-west-3
\`\`\`

#### Minio

For Minio, the endpoint can be the service's custom domain:

\`\`\`plaintext
S3_ENABLED=true
S3_ACCESS_KEY=your-minio-access-key
S3_SECRET_KEY=your-minio-secret-key
S3_BUCKET=my-minio-bucket
S3_PORT=443
S3_ENDPOINT=minio.mycompany.com
S3_USE_SSL=true
\`\`\`

## How Media Storage Works

When S3 or Minio storage is correctly configured, all media files received from WhatsApp (such as images, videos, audio, etc.) are automatically uploaded to the configured bucket. The public URL of the stored file is then generated and included in the Evolution API webhook.

### Webhook with `mediaUrl`

When a media file is received and stored, the webhook sent by the Evolution API will include the `mediaUrl` in the message body. This allows your application to directly access the file stored in S3 or Minio.

### Webhook Example

Here is an example of how the webhook with `mediaUrl` might appear:

~~~json
{
    "event": "messages.upsert",
    "data": {
        "message": {
            ...
            "mediaUrl": "https://files.evolution-api-pro.com/bucket/path/to/media/file.jpg",
            ...
        }
    }
}
~~~

## Final Considerations

Integrating the Evolution API with Amazon S3 or Minio for media file storage provides a scalable and secure solution for managing WhatsApp media content. By correctly configuring the environment variables, you ensure that all media files are stored and accessible as needed, providing greater control over data and the ability to easily integrate it into your applications.

<Info>  
For more details on environment variables and other advanced configurations, consult the [environment variables section](/v2/pt/env#s3).
</Info>
```

# v2\en\integrations\sqs.mdx

```mdx
---
title: Amazon SQS  
icon: aws
---

The Evolution API allows integration with **Amazon SQS (Simple Queue Service)** to manage events and message queues in a scalable and reliable way. Similar to RabbitMQ, SQS in the Evolution API can be configured globally or for individual instances.

## Global SQS Configuration

To enable SQS and configure centralized event processing, use the following environment variables:

### Environment Variable Configuration

\`\`\`plaintext
SQS_ENABLED=true
SQS_ACCESS_KEY_ID=your-access-key-id
SQS_SECRET_ACCESS_KEY=your-secret-access-key
SQS_ACCOUNT_ID=your-account-id
SQS_REGION=your-region
\`\`\`

### Explanation of Variables

- **`SQS_ENABLED`**: Enables (`true`) or disables (`false`) integration with Amazon SQS.
- **`SQS_ACCESS_KEY_ID`**: AWS access key for authentication.
- **`SQS_SECRET_ACCESS_KEY`**: Secret key corresponding to the access key for authentication.
- **`SQS_ACCOUNT_ID`**: AWS account ID where SQS is configured.
- **`SQS_REGION`**: AWS region where your SQS queues are located (e.g., `us-east-1`).

### How It Works

- **Queue by Event**: In global mode, all events are queued in specific queues by event type. This means that events from different instances are centralized in unified event queues, simplifying processing and monitoring.

## SQS Configuration for Individual Instances

Although global configuration is recommended for centralized event processing, you can configure SQS for individual instances if you need to segment queues by instance.

### Endpoint for Individual Configuration

To configure SQS for a specific WhatsApp instance in the Evolution API, use the following endpoint:

~~~ http
POST [baseUrl]/sqs/set/[instance_name]
~~~

### Request Body

Here is an example of the JSON body to configure events in a specific instance:

~~~ json
{
    "enabled": true,
    "events": [
        "APPLICATION_STARTUP",
        "QRCODE_UPDATED",
        "MESSAGES_SET",
        "MESSAGES_UPSERT",
        "MESSAGES_UPDATE",
        "MESSAGES_DELETE",
        "SEND_MESSAGE",
        "CONTACTS_SET",
        "CONTACTS_UPSERT",
        "CONTACTS_UPDATE",
        "PRESENCE_UPDATE",
        "CHATS_SET",
        "CHATS_UPSERT",
        "CHATS_UPDATE",
        "CHATS_DELETE",
        "GROUPS_UPSERT",
        "GROUP_UPDATE",
        "GROUP_PARTICIPANTS_UPDATE",
        "CONNECTION_UPDATE",
        "CALL",
        "NEW_JWT_TOKEN"
    ]
}
~~~

<Note>  
Remove unused events to optimize SQS resource usage.
</Note>

### How It Works

- **Instance Segmentation**: When configuring SQS for individual instances, each instance can have its specific queues for the configured events. This allows for greater control and segmentation of events if you need to separate processing by instance.

## Final Considerations

Integration with Amazon SQS in the Evolution API offers a powerful solution for managing events in a scalable and reliable way, both centrally and segmented by instance. Use the global configuration to simplify processing in complex environments, or configure individually for more granular control.

<Info>  
For more details on environment variables and other advanced configurations, refer to the [environment variables section](/v2/pt/env#sqs).
</Info>
```

# v2\en\integrations\typebot.mdx

```mdx
---
title: Typebot  
icon: robot
---

The Evolution API allows integration with **Typebot** to automate interactions and respond to WhatsApp messages based on configured triggers. Below, you will find detailed instructions on how to configure, manage sessions, manually initiate bots, and use predefined variables.

## 1. Configuring Bots in Typebot

You can configure various bots in Typebot using triggers to start interactions. The bot configuration can be done via the `/typebot/create/{{instance}}` endpoint.

### Endpoint for Bot Configuration

#### Endpoint

~~~http
POST {{baseUrl}}/typebot/create/{{instance}}
~~~

#### Request Body

Here is an example JSON body to configure a bot:

~~~json
{
    "enabled": true,
    "url": "https://bot.dgcode.com.br",
    "typebot": "my-typebot-uoz1rg9",
    "triggerType": "keyword",
    "triggerOperator": "regex",
    "triggerValue": "^atend.*",
    "expire": 20,
    "keywordFinish": "#EXIT",
    "delayMessage": 1000,
    "unknownMessage": "Message not recognized",
    "listeningFromMe": false,
    "stopBotFromMe": false,
    "keepOpen": false,
    "debounceTime": 10
}
~~~

### Explanation of Parameters

- **`enabled`**: Activates (`true`) or deactivates (`false`) the bot.
- **`url`**: The URL of the Typebot API (without the trailing `/`).
- **`typebot`**: The public name of the bot in Typebot.
- **`triggerType`**: The type of trigger to start the bot (`keyword`, `all`, `none`).
- **`triggerOperator`**: The operator used to evaluate the trigger (`contains`, `equals`, `startsWith`, `endsWith`, `regex`).
- **`triggerValue`**: The value used in the trigger (e.g., a keyword or regex).
- **`expire`**: Time in minutes after which the bot expires, restarting if the session has expired.
- **`keywordFinish`**: Keyword that, when received, ends the bot session.
- **`delayMessage`**: Delay (in milliseconds) to simulate typing before sending a message.
- **`unknownMessage`**: Message sent when the user's input is not recognized.
- **`listeningFromMe`**: Determines if the bot should listen to messages sent by the user themselves (`true` or `false`).
- **`stopBotFromMe`**: Determines if the bot should stop when the user sends a message (`true` or `false`).
- **`keepOpen`**: Keeps the session open, preventing the bot from restarting for the same contact.
- **`debounceTime`**: Time (in seconds) to combine multiple messages into one.

## 2. Managing Typebot Sessions

You can manage Typebot sessions for each specific contact, changing the session status between open, paused, or closed.

### Endpoint for Session Management

#### Endpoint

~~~http
POST {{baseUrl}}/typebot/changeStatus/{{instance}}
~~~

#### Request Body

Here is an example of how to manage the session status:

~~~json
{
    "remoteJid": "5511912345678@s.whatsapp.net",
    "status": "closed"
}
~~~

### Explanation of Parameters

- **`remoteJid`**: JID (identifier) of the contact on WhatsApp.
- **`status`**: Session status (`opened`, `paused`, `closed`).

## 3. Default Typebot Configuration

You can set default configurations that will be applied if parameters are not passed during bot creation.

### Default Configuration

Here is an example of a default configuration:

~~~json
{
    "expire": 20,
    "keywordFinish": "#EXIT",
    "delayMessage": 1000,
    "unknownMessage": "Message not recognized",
    "listeningFromMe": false,
    "stopBotFromMe": false,
    "keepOpen": false,
    "debounceTime": 10,
    "ignoreJids": [],
    "typebotIdFallback": "clyja4oys0a3uqpy7k3bd7swe"
}
~~~

### Explanation of Parameters

- **`expire`**: Time in minutes after which the bot expires.
- **`keywordFinish`**: Keyword that ends the bot session.
- **`delayMessage`**: Delay to simulate typing before sending a message.
- **`unknownMessage`**: Message sent when the user's input is not recognized.
- **`listeningFromMe`**: Determines if the bot should listen to messages sent by the user themselves.
- **`stopBotFromMe`**: Determines if the bot should stop when the user sends a message.
- **`keepOpen`**: Keeps the session open, preventing the bot from restarting for the same contact.
- **`debounceTime`**: Time to combine multiple messages into one.
- **`ignoreJids`**: List of JIDs of contacts that will not trigger the bot.
- **`typebotIdFallback`**: ID of the fallback bot to be used if no trigger is activated.

## 4. Active Bot Initialization

In addition to using triggers, you can actively start a bot for a specific contact using the `/typebot/start/{{instance}}` endpoint.

### Endpoint for Active Initialization

#### Endpoint

~~~http
POST {{baseUrl}}/typebot/start/{{instance}}
~~~

#### Request Body

Here is an example of how to actively start a bot:

~~~json
{
    "url": "https://bot.dgcode.com.br",
    "typebot": "fluxo-unico-3uuso28",
    "remoteJid": "557499879409@s.whatsapp.net",
    "startSession": false,
    "variables": [
        {
            "name": "pushName",
            "value": "Davidson Gomes"
        }
    ]
}
~~~

### Explanation of Parameters

- **`url`**: The URL of the Typebot API (without the trailing `/`).
- **`typebot`**: The public name of the bot in Typebot.
- **`remoteJid`**: JID (identifier) of the contact on WhatsApp.
- **`startSession`**: Determines if the session should start with the bot (`true` or `false`).
- **`variables`**: Custom variables that can be passed to the bot (e.g., user's name).

### Predefined Variables

When a Typebot session is initiated, some predefined variables are automatically sent:

~~~json
const prefilledVariables = {
    remoteJid: "JID of the contact",
    pushName: "Contact's name",
    instanceName: "Name of the instance",
    serverUrl: "API server URL",
    apiKey: "Evolution API key",
    ownerJid: "JID of the number connected to the instance"
};
~~~

#### Explanation of Predefined Variables

- **`remoteJid`**: JID of the contact interacting with the bot.
- **`pushName`**: Name of the contact on WhatsApp.
- **`instanceName`**: Name of the instance running the bot.
- **`serverUrl`**: URL of the server where the Evolution API is hosted.
- **`apiKey`**: API key used to authenticate requests.
- **`ownerJid`**: JID of the phone number connected to the instance.

### Interaction with Variables Passed in `startTypebot`

When you use the `startTypebot` endpoint, the variables passed in the request body are combined with the predefined variables. This allows you to add or overwrite specific information to further customize the bot interaction.

### Final Considerations

Integration of the Evolution API with Typebot offers a powerful and flexible way to automate interactions on WhatsApp. With predefined variables and the ability to actively start bots, you can personalize the user experience and optimize customer service workflows.
```

# v2\en\integrations\websocket.mdx

```mdx
---
Title: WebSocket  
Icon: plug
---

The Evolution API uses `socket.io` to emit real-time events, leveraging WebSocket technology. This makes integration development more efficient and straightforward for developers. WebSocket provides a full-duplex communication channel over a single, long-lasting connection, enabling real-time data flow between the client and the server.

<Info>  
To enable WebSockets, set the `WEBSOCKET_ENABLED` environment variable to `true`. See more details in [Environment Variables](/v2/en/env).
</Info>

## WebSocket Operating Modes

### Global Mode

In **global mode**, the `WEBSOCKET_GLOBAL_EVENTS` environment variable must be set to `true`. In this mode, the WebSocket is initialized when the service starts and sends events from all instances, regardless of channels. This means that any client connected to the WebSocket will receive global events, covering all Evolution API instances configured in the system.

- **Activation**: Configure in the `.env` file:

    \`\`\`plaintext
    WEBSOCKET_GLOBAL_EVENTS=true
    \`\`\`

- **Functionality**: Ideal for scenarios where you want to monitor or process events from all instances simultaneously without needing to establish a separate connection for each instance.

- **Connection**: In global mode, the WebSocket connection **does not** require the use of `/instance_name` in the URL. The connection URL will simply be:

    \`\`\`plaintext
    wss://api.yoursite.com
    \`\`\`

### Traditional Mode

In **traditional mode**, the WebSocket can only be connected after executing the `set` command on the instance. This allows the WebSocket to be specific to each instance, and real-time communication is restricted to that instance.

- **Activation**: Ensure that `WEBSOCKET_GLOBAL_EVENTS` is set to `false` or not configured, and follow the traditional instance setup flow.

- **Functionality**: Ideal for scenarios where you want more isolated real-time communication, focused on a single instance, allowing greater control and segmentation of events.

- **Connection**: In traditional mode, the WebSocket connection requires the use of `/instance_name` in the URL:

    \`\`\`plaintext
    wss://api.yoursite.com/instance_name
    \`\`\`

## Connecting to the WebSocket

### Global Mode

In global mode, the connection URL is simpler and does not require the instance name:

~~~plaintext
wss://api.yoursite.com
~~~

### Traditional Mode

In traditional mode, use the following URL format:

~~~plaintext
wss://api.yoursite.com/instance_name
~~~

Replace `api.yoursite.com` with your API's actual domain and `instance_name` with your specific instance name.

### WebSocket Connection Example

Here is a basic example of how to establish a WebSocket connection using JavaScript:

~~~javascript
const socket = io('wss://api.yoursite.com/instance_name', {
  transports: ['websocket']
});

socket.on('connect', () => {
  console.log('Connected to the Evolution API WebSocket');
});

// Listening to events
socket.on('event_name', (data) => {
  console.log('Event received:', data);
});

// Handling disconnection
socket.on('disconnect', () => {
  console.log('Disconnected from the Evolution API WebSocket');
});
~~~

In this example, replace `event_name` with the specific event you want to listen to.

## Handling Events

Once connected, you can listen to various events emitted by the server. Each event can carry data relevant to the event's context. For instance, if you are listening for message updates, you may receive data containing the updated message content and metadata.

## Closing the Connection

To close the WebSocket connection, use the `disconnect` method:

~~~javascript
socket.disconnect();
~~~

Remember to handle the connection responsibly by disconnecting when your application or component is unmounted to avoid memory leaks and ensure efficient resource usage.

## Final Considerations

The Evolution API provides a powerful way to interact in real-time through WebSockets, offering a seamless experience for both developers and end users. Whether in global mode, monitoring all instances simultaneously, or in traditional mode, focused on a single instance, the system's flexibility allows for adaptation to the specific needs of your project.
```

# v2\en\requirements\database.mdx

```mdx
---
title: Database
icon: database
---

The database is a fundamental part of the Evolution API v2, responsible for storing all the application's critical information. The API supports both PostgreSQL and MySQL, using Prisma as the ORM (Object-Relational Mapping) to facilitate interaction with these databases.

## Database Choice

Evolution API v2 offers the flexibility to choose between PostgreSQL and MySQL as the database provider. The choice can be configured through the `DATABASE_PROVIDER` environment variable, and connections are managed by Prisma.

## Installation and Configuration

### Using Docker

The easiest and fastest way to set up a database for Evolution API v2 is through Docker. Below are the instructions to configure both PostgreSQL and MySQL using Docker Compose.

#### PostgreSQL

To set up PostgreSQL via Docker, follow these steps:

1. Download the `docker-compose.yaml` file for PostgreSQL available [here](https://github.com/EvolutionAPI/evolution-api/blob/v2.0.0/Docker/postgres/docker-compose.yaml).
2. Navigate to the directory where the file was downloaded and run the command:

\`\`\`bash
docker-compose up -d
\`\`\`

3. The PostgreSQL instance will be available at `localhost` on port `5432`.

#### MySQL

To set up MySQL via Docker, follow these steps:

1. Download the `docker-compose.yaml` file for MySQL available [here](https://github.com/EvolutionAPI/evolution-api/blob/v2.0.0/Docker/mysql/docker-compose.yaml).
2. Navigate to the directory where the file was downloaded and run the command:

\`\`\`bash
docker-compose up -d
\`\`\`

3. The MySQL instance will be available at `localhost` on port `3306`.

### Environment Variables Configuration

After setting up the database, define the following environment variables in your `.env` file:

\`\`\`env
# Enable the use of the database
DATABASE_ENABLED=true

# Choose the database provider: postgresql or mysql
DATABASE_PROVIDER=postgresql

# Database connection URI
DATABASE_CONNECTION_URI='postgresql://user:pass@localhost:5432/evolution?schema=public'

# Client name for the database connection
DATABASE_CONNECTION_CLIENT_NAME=evolution_exchange

# Choose the data you want to save in the application database
DATABASE_SAVE_DATA_INSTANCE=true
DATABASE_SAVE_DATA_NEW_MESSAGE=true
DATABASE_SAVE_MESSAGE_UPDATE=true
DATABASE_SAVE_DATA_CONTACTS=true
DATABASE_SAVE_DATA_CHATS=true
DATABASE_SAVE_DATA_LABELS=true
DATABASE_SAVE_DATA_HISTORIC=true
\`\`\`

### Local Installation

If you prefer to set up the database locally without using Docker, follow the instructions below:

#### PostgreSQL

1. Install PostgreSQL on your machine. On Ubuntu-based systems, for example, you can use:

\`\`\`bash
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib
\`\`\`

2. Start the PostgreSQL service:

\`\`\`bash
sudo service postgresql start
\`\`\`

3. Create a database for Evolution API v2:

\`\`\`bash
sudo -u postgres createdb evolution
\`\`\`

#### MySQL

1. Install MySQL on your machine. On Ubuntu-based systems, you can use:

\`\`\`bash
sudo apt-get update
sudo apt-get install mysql-server
\`\`\`

2. Start the MySQL service:

\`\`\`bash
sudo service mysql start
\`\`\`

3. Create a database for Evolution API v2:

\`\`\`bash
mysql -u root -p -e "CREATE DATABASE evolution;"
\`\`\`
```

# v2\en\requirements\redis.mdx

```mdx
---
title: Redis
icon: layer-group
---

Redis is used by Evolution API v2 as a caching system to optimize the application's performance and speed. It can be configured to store temporary information and improve operational efficiency.

## Installation and Configuration

### Using Docker

The easiest and fastest way to set up Redis for Evolution API v2 is through Docker. Below are the instructions to configure Redis using Docker Compose.

#### Redis

To set up Redis via Docker, follow these steps:

1. Download the `docker-compose.yaml` file for Redis available [here](https://github.com/EvolutionAPI/evolution-api/blob/v2.0.0/Docker/redis/docker-compose.yaml).
2. Navigate to the directory where the file was downloaded and run the command:

\`\`\`bash
docker-compose up -d
\`\`\`

3. The Redis instance will be available at `localhost` on port `6379`.

### Environment Variables Configuration

After setting up Redis, define the following environment variables in your `.env` file:

\`\`\`env
# Enable Redis cache
CACHE_REDIS_ENABLED=true

# Redis connection URI
CACHE_REDIS_URI=redis://localhost:6379/6

# Prefix to differentiate data from different installations using the same Redis
CACHE_REDIS_PREFIX_KEY=evolution

# Enable to save connection information in Redis instead of the database
CACHE_REDIS_SAVE_INSTANCES=false

# Enable local cache
CACHE_LOCAL_ENABLED=false
\`\`\`

### Local Installation

If you prefer to set up Redis locally without using Docker, follow the instructions below:

#### Redis

1. Install Redis on your machine. On Ubuntu-based systems, for example, you can use:

\`\`\`bash
sudo apt-get update
sudo apt-get install redis-server
\`\`\`

2. Start the Redis service:

\`\`\`bash
sudo service redis-server start
\`\`\`

3. Verify that Redis is running correctly with the command:

\`\`\`bash
redis-cli ping
\`\`\`

If everything is working correctly, you will see the response `PONG`.

### Cache Configuration in Evolution API v2

After installing and configuring Redis, the next step is to configure caching in Evolution API v2 using environment variables. This will enable the API to use Redis to cache important data and improve the overall performance of the application.
```

# v2\en\updates.mdx

```mdx
---
title: Update
icon: code-pull-request
---

Keeping your Evolution API instance updated is crucial for security, performance, and access to new features. The update method depends on how you initially installed the API. This guide covers the steps to update your Evolution API using Docker Compose and NPM.

<Note>Before updating Evolution, make sure all integrated applications are actually working with Evolution. Update at your own risk.</Note>

## Updating with Docker

If you initially set up your Evolution API using Docker, follow these steps to update:

### Updating with Docker CLI

If your Evolution API was initially installed using Docker Compose via the command-line interface (CLI), and not through Portainer or any other container management tool, follow these steps to update it:

1. **Navigate to the Docker Compose Directory**: Open a terminal and go to the directory where your Docker Compose file (`docker-compose.yml`) is located.

2. **Pull the Latest Image**: Update the Evolution API image to the latest version by running the following command:

~~~ shell
docker compose pull atendai/evolution-api:v2.1.1
~~~

3. **Stop and Restart the Containers**: After pulling the latest image, stop the current containers and restart them. This can be done using the following command:

~~~ shell
docker compose down && docker compose up -d
~~~

## Updating with Portainer

If you are using Portainer for container management, follow these steps to update your Evolution API:

1. **Access the Portainer Dashboard**: Open the Portainer dashboard in a web browser.

2. **Navigate to Your Containers**: Go to the 'Stacks' section where your Evolution API container is listed.

3. **Update the Compose**:
    - Locate the `image` field in your Docker Compose configuration.

~~~ yaml stack-file.yml
# ... (other services and configurations)
  evolution_api:
    # Update the Evolution API image version here
    # Use 'atendai/evolution-api:latest' for the latest version
    # Or specify a specific version like 'atendai/evolutionapi:v2.1.1'
    image: atendai/evolution-api:v2.x.x
    networks:
      - your_network
~~~

    - Update the value to `atendai/evolution-api:v2.1.1` for the latest version, or use `atendai/evolutionapi:v2.x.x` for a specific version.
    - After making the changes, click the 'Deploy' button at the end of the compose editing window.

4. **Verify the Update**: After recreating the container, verify that the Evolution API is running the latest version. This can typically be checked through the API version endpoint or the logs.

<Note>
    For production environments, it is recommended to specify a particular version of the Evolution API (e.g., atendai/evolution-api:v1.x.x) instead of using latest.
    This practice ensures stability and predictability, as it protects your production environment from potential issues arising from unexpected changes in the latest version.
</Note>

By following these steps, you can ensure that your Evolution API is always up to date using Portainer.

## Updating with NPM

Updating your Evolution API installation via NPM involves several steps to ensure a smooth transition to the new version. Here’s a step-by-step guide:

1. **Clean and Stop**: Clear all PM2 logs, which is useful for troubleshooting after the update, and temporarily stop the Evolution API to apply updates safely.

~~~ shell Terminal
# Clear all PM2 logs
pm2 flush

# Stop the current Evolution API process
pm2 stop ApiEvolution
~~~

2. **Reset the Local Repository and Pull the Latest Updates**: Ensure that your local code is in sync with the latest commit and pull the latest updates from the repository. Optionally, switch to a specific version if you are not using the latest one. This is recommended for production environments.

~~~ shell Terminal
# Reset your local repository to the latest commit
git reset --hard HEAD

# Pull the latest updates from the repository
git pull

# For a specific version, use 'git checkout main' for the latest,
# or 'git checkout 1.x.x' for a specific version. Example:
git checkout 1.x.x
~~~

3. **Clean Installation**: Remove the existing `node_modules` to avoid potential conflicts with new dependencies and install the necessary Node.js dependencies for the updated version.

~~~ shell Terminal
# Remove the current node_modules directory to ensure a clean installation
rm -rf node_modules

# Install dependencies with NPM
npm i

# Restart the Evolution API with the updated version
pm2 start ApiEvolution

# Optionally, view the PM2 logs for the Evolution API
pm2 log ApiEvolution
~~~
```

# v2\pt\configuration\available-resources.mdx

```mdx
---
title: 'Recursos Disponíveis'
icon: wrench
---

## Recursos de Mensagens e Grupos

### Mensagens (Individuais ou em Grupo)

| Recurso | Disponibilidade | Descrição |
|-:|:-:|-|
| Envio de Texto | ✅ | (Texto simples, em negrito, itálico, riscado, em formato de código e emojis) |
| Envio de Mídia | ✅ | (Vídeo, imagem e documento) |
| Envio de Áudio Narrado | ✅ | (Funcionando bem no Android e iOS) |
| Envio de Localização | ✅ | (Com nome e descrição do local) |
| Envio de Contato | ✅ | (Com Nome, Empresa, Telefone, E-mail e URL) |
| Envio de Reação | ✅ | (Envie qualquer emoji para reação) |
| Envio de Pré-visualização de Link | ✅ | (Busca por informações de SEO) 🆕 |
| Envio de Resposta | ✅ | (Marcar mensagens em resposta) 🆕 |
| Envio de Menção | ✅ | (Individual, para alguns ou todos os membros) 🆕 |
| Envio de Enquete | ✅ | (Enviar e receber votos de uma enquete) 🆕 |
| Envio de Status/História | ✅ | (Texto, pré-visualização de link, vídeo, imagem e forma de onda) 🆕 |
| Envio de Adesivo | ✅ | (Imagem estática) 🆕 |
| Envio de Lista (Homologação) | ✅ | (Testando) |
| Envio de Botões (Descontinuado) | ❌ | (Só funciona na API em nuvem) |

### Perfil

| Recurso | Disponibilidade | Descrição |
| --- | :---: | --- |
| Atualizar Nome | ✅ | (Alterar o nome do perfil conectado) |
| Atualizar Foto | ✅ | (Alterar a foto do perfil conectado) 🆕 |
| Atualizar Status | ✅ | (Alterar o status do perfil conectado) 🆕 |
| E muitos outros... |  |  |

### Grupo

| Recurso | Disponibilidade | Descrição |
| --- | :---: | --- |
| Criar Grupo | ✅ | (Novos grupos) |
| Atualizar Foto | ✅ | (Alterar foto do grupo) |
| Atualizar Assunto | ✅ | (Alterar o nome do grupo) 🆕 |
| Atualizar Descrição | ✅ | (Alterar a descrição do grupo) 🆕 |
| Obter Todos os Grupos | ✅ | (Obter todos os grupos e participantes) 🆕 |
| E muitos outros... |  |  |

```

# v2\pt\configuration\webhooks.mdx

```mdx
---
title: 'Webhooks'
icon: webhook
---

Os Webhooks permitem integração em tempo real entre a Evolution API e o WhatsApp™, permitindo sincronização e compartilhamento automatizados de dados.

É exatamente esse recurso que possibilita a criação de bots de autoatendimento e sistemas multi-serviço.

## Ativando Webhooks

Existem duas maneiras de ativar o webhook:
  - No arquivo `.env` com eventos globais
  - Chamando o endpoint `/webhook/instance`

### Eventos de webhook da instância

A maioria dos usuários preferirá a ativação por instância, desta forma é mais fácil controlar os eventos recebidos, no entanto em alguns casos é necessário um webhook global,
isso pode ser feito usando a variável de webhook global.

Aqui está um exemplo com alguns eventos comuns ouvidos:

\`\`\`json /webhook/instance
{
  "url": "{{webhookUrl}}",
  "webhook_by_events": false,
  "webhook_base64": false,
  "events": [
      "QRCODE_UPDATED",
      "MESSAGES_UPSERT",
      "MESSAGES_UPDATE",
      "MESSAGES_DELETE",
      "SEND_MESSAGE",
      "CONNECTION_UPDATE",
      "TYPEBOT_START",
      "TYPEBOT_CHANGE_STATUS"
  ]    
}
\`\`\`
### Parâmetros

| Parâmetro         | Tipo    | Obrigatório  | Descrição                                                                                                       |
| ----------------- | ------- | ------------ | --------------------------------------------------------------------------------------------------------------- |
| enabled           | boolean | Sim          | Insira "true" para criar ou alterar dados do Webhook, ou "false" se quiser parar de usá-lo.                     |
| url               | string  | Sim          | URL do Webhook para receber dados do evento.                                                                    |
| webhook_by_events | boolean | Não          | Deseja gerar uma URL específica do Webhook para cada um dos seus eventos.                                       |
| events            | array   | Não          | Lista de eventos a serem processados. Se você não quiser usar alguns desses eventos, apenas remova-os da lista. |

<Note>
É extremamente necessário que o payload obedeça às regras para criar um arquivo JSON, considerando o arranjo correto de itens, formatação, colchetes, chaves e vírgulas, etc.
Antes de consumir o endpoint, se tiver dúvidas sobre a formatação JSON, vá para https://jsonlint.com/ e valide.
</Note>

### Eventos Globais de Webhook

Cada URL e eventos de Webhook da instância serão solicitados no momento em que forem criados
Defina um webhook global que ouvirá eventos habilitados de todas as instâncias

\`\`\`bash .env
WEBHOOK_GLOBAL_URL=''
WEBHOOK_GLOBAL_ENABLED=false

# Com esta opção ativada, você trabalha com uma URL por evento de webhook, respeitando a URL global e o nome de cada evento
WEBHOOK_GLOBAL_WEBHOOK_BY_EVENTS=false

## Defina os eventos que você deseja ouvir, todos os eventos listados abaixo são suportados
WEBHOOK_EVENTS_APPLICATION_STARTUP=false
WEBHOOK_EVENTS_QRCODE_UPDATED=true

# Alguns eventos extras para erros
WEBHOOK_EVENTS_ERRORS=false
WEBHOOK_EVENTS_ERRORS_WEBHOOK=
\`\`\`
## Eventos Suportados

Estes são os eventos de webhook disponíveis e suportados:

| **Variável de ambiente**   | **URL**                    | **Descrição** |
| -------------------------- | -------------------------- | ------------- |
| APPLICATION_STARTUP        | /application-startup       | Notifica quando uma inicialização de aplicativo ocorre |
| QRCODE_UPDATED             | /qrcode-updated            | Envia o base64 do qrcode para leitura |
| CONNECTION_UPDATE          | /connection-update         | Informa o status da conexão com o WhatsApp |
| MESSAGES_SET               | /messages-set              | Envia uma lista de todas as suas mensagens carregadas no WhatsApp. Este evento ocorre apenas uma vez |
| MESSAGES_UPSERT            | /messages-upsert           | Notifica quando uma mensagem é recebida |
| MESSAGES_UPDATE            | /messages-update           | Informa quando uma mensagem é atualizada |
| MESSAGES_DELETE            | /messages-delete           | Informa quando uma mensagem é excluída |
| SEND_MESSAGE               | /send-message              | Notifica quando uma mensagem é enviada |
| CONTACTS_SET               | /contacts-set              | Realiza o carregamento inicial de todos os contatos. Este evento ocorre apenas uma vez |
| CONTACTS_UPSERT            | /contacts-upsert           | Recarrega todos os contatos com informações adicionais. Este evento ocorre apenas uma vez |
| CONTACTS_UPDATE            | /contacts-update           | Informa quando o contato é atualizado |
| PRESENCE_UPDATE            | /presence-update           | Informa se o usuário está online, se ele está realizando alguma ação como escrever ou gravar e seu último visto: 'indisponível', 'disponível', 'compondo', 'gravando', 'pausado' |
| CHATS_SET                  | /chats-set                 | Envia uma lista de todos os chats carregados |
| CHATS_UPDATE               | /chats-update              | Informa quando o chat é atualizado |
| CHATS_UPSERT               | /chats-upsert              | Envia qualquer nova informação de chat |
| CHATS_DELETE               | /chats-delete              | Notifica quando um chat é excluído |
| GROUPS_UPSERT              | /groups-upsert             | Notifica quando um grupo é criado |
| GROUPS_UPDATE              | /groups-update             | Notifica quando um grupo tem suas informações atualizadas |
| GROUP_PARTICIPANTS_UPDATE  | /group-participants-update | Notifica quando uma ação ocorre envolvendo um participante: 'adicionar', 'remover', 'promover', 'rebaixar' |
| NEW_TOKEN                  | /new-jwt                   | Notifica quando o token (jwt) é atualizado |

## Webhook por eventos

Ao habilitar as opções WEBHOOK_BY_EVENTS nos webhooks globais e locais, os seguintes caminhos serão adicionados ao final do webhook.

<Note>
Adicione ao final da URL o nome do evento com um traço (-) entre as palavras que compõem o evento.
</Note>
 
### Exemplo

 Supondo que sua URL de webhook fosse `https://sub.domain.com/webhook/`. A Evolution adicionará automaticamente ao final da URL o nome do evento quando `webhook_by_events` estiver definido como verdadeiro.

|  **Evento**                 | **Nova URL de Webhook por Eventos**                     |
| -------------------------- | -------------------------------------------------------- |
| APPLICATION_STARTUP        | https://sub.domain.com/webhook/application-startup       |
| QRCODE_UPDATED             | https://sub.domain.com/webhook/qrcode-updated            |
| CONNECTION_UPDATE          | https://sub.domain.com/webhook/connection-update         |
| MESSAGES_SET               | https://sub.domain.com/webhook/messages-set              |
| MESSAGES_UPSERT            | https://sub.domain.com/webhook/messages-upsert           |
| MESSAGES_UPDATE            | https://sub.domain.com/webhook/messages-update           |
| MESSAGES_DELETE            | https://sub.domain.com/webhook/messages-delete           |
| SEND_MESSAGE               | https://sub.domain.com/webhook/send-message              |
| CONTACTS_SET               | https://sub.domain.com/webhook/contacts-set              |
| CONTACTS_UPSERT            | https://sub.domain.com/webhook/contacts-upsert           |
| CONTACTS_UPDATE            | https://sub.domain.com/webhook/contacts-update           |
| PRESENCE_UPDATE            | https://sub.domain.com/webhook/presence-update           |
| CHATS_SET                  | https://sub.domain.com/webhook/chats-set                 |
| CHATS_UPDATE               | https://sub.domain.com/webhook/chats-update              |
| CHATS_UPSERT               | https://sub.domain.com/webhook/chats-upsert              |
| CHATS_DELETE               | https://sub.domain.com/webhook/chats-delete              |
| GROUPS_UPSERT              | https://sub.domain.com/webhook/groups-upsert             |
| GROUPS_UPDATE              | https://sub.domain.com/webhook/groups-update             |
| GROUP_PARTICIPANTS_UPDATE  | https://sub.domain.com/webhook/group-participants-update |
| NEW_TOKEN                  | https://sub.domain.com/webhook/new-jwt                   |

 ## Localizando Webhook

Se necessário, há uma opção para localizar qualquer webhook ativo na instância específica.

| Método | Endpoint                              |
| ------ | ------------------------------------- |
| GET    | [baseUrl]/webhook/find/[instance]     |


### Dados retornados da solicitação:

Chamando o endpoint retornará todas as informações sobre o webhook que está sendo usado pela instância.

\`\`\`json Resultado
{
  "enabled": true,
  "url": "[url]",
  "webhookByEvents": false,
  "events": [
    [eventos]
  ]
}
\`\`\`

```

# v2\pt\env.mdx

```mdx
---
title: Variáveis de Ambiente
icon: gear
---

Veja o arquivo de exemplo do env no [repositório oficial](https://github.com/EvolutionAPI/evolution-api/blob/main/Docker/.env.example).

## Server

| Variável | Valor | Exemplo |
| --- | --- | --- |
| SERVER_TYPE | O tipo de servidor (http ou https) | http |
| SERVER_PORT | Porta em que o servidor será executado | 8080 |
| SERVER_URL | O endereço para seu servidor em execução. Esse endereço é utilizado para retornar dados de requisição interna, como links de webhook. | https://exemplo.evolution-api.com |

## Telemetria

| Variável | Valor | Exemplo |
| --- | --- | --- |
| TELEMETRY | Habilita ou desabilita a telemetria (true ou false) | true |
| TELEMETRY_URL | URL do servidor de telemetria | https://telemetry.example.com |

## CORS

| Variável | Valor | Exemplo |
| --- | --- | --- |
| CORS_ORIGIN | As origens permitidas pela API separadas por vírgula (utilize "*" para aceitar requisições de qualquer origem) | * |
| CORS_METHODS | Métodos HTTP permitidos separados por vírgula | GET,POST,PUT,DELETE |
| CORS_CREDENTIALS | Permissão de cookies em requisições (true ou false) | true |

## Logs

| Variável | Valor | Exemplo |
| --- | --- | --- |
| LOG_LEVEL | Logs que serão mostrados entre: ERROR, WARN, DEBUG, INFO, LOG, VERBOSE, DARK, WEBHOOKS | ERROR,WARN,DEBUG,INFO,LOG,VERBOSE,DARK,WEBHOOKS |
| LOG_COLOR | Mostrar ou não cores nos Logs (true ou false) | true |
| LOG_BAILEYS | Quais logs da Baileys serão mostrados entre: "fatal", "error", "warn", "info", "debug", "trace" | error |

## Instâncias

| Variável | Valor | Exemplo |
| --- | --- | --- |
| DEL_INSTANCE | Em quantos minutos uma instância será excluída se não conectada. Use "false" para nunca excluir | false |

## Armazenamento Persistente

| Variável | Valor | Exemplo |
| --- | --- | --- |
| DATABASE_ENABLED | Se o armazenamento persistente está habilitado (true ou false) | true |
| DATABASE_PROVIDER | Provedor de banco de dados (postgresql ou mysql) | postgresql |
| DATABASE_CONNECTION_URI | A URI de conexão do banco de dados | postgresql://user:pass@localhost:5432/evolution?schema=public |
| DATABASE_CONNECTION_CLIENT_NAME | Nome do cliente para a conexão com o banco de dados, usado para separar uma instalação da API de outra que usa o mesmo banco | evolution_exchange |

### Quais dados serão salvos (true ou false)

| Variável | Valor |
| --- | --- |
| DATABASE_SAVE_DATA_INSTANCE | Salva dados de instâncias |
| DATABASE_SAVE_DATA_NEW_MESSAGE | Salva novas mensagens |
| DATABASE_SAVE_MESSAGE_UPDATE | Salva atualizações de mensagens |
| DATABASE_SAVE_DATA_CONTACTS | Salva contatos |
| DATABASE_SAVE_DATA_CHATS | Salva conversas |
| DATABASE_SAVE_DATA_LABELS | Salva etiquetas |
| DATABASE_SAVE_DATA_HISTORIC | Salva histórico de eventos |

## RabbitMQ

| Variável | Valor | Exemplo |
| --- | --- | --- |
| RABBITMQ_ENABLED | Habilita o RabbitMQ (true ou false) | false |
| RABBITMQ_URI | URI de conexão do RabbitMQ | amqp://localhost |
| RABBITMQ_EXCHANGE_NAME | Nome do exchange | evolution |
| RABBITMQ_GLOBAL_ENABLED | Habilita o RabbitMQ de forma global (true ou false) | false |

### Escolha os eventos que deseja enviar para o RabbitMQ

| Variável | Valor | Exemplo |
| --- | --- | --- |
| RABBITMQ_EVENTS_APPLICATION_STARTUP | Envia um evento na inicialização do app (true ou false) | false |
| RABBITMQ_EVENTS_INSTANCE_CREATE | Envia eventos de criação de instância (true ou false) | false |
| RABBITMQ_EVENTS_INSTANCE_DELETE | Envia eventos de deleção de instância (true ou false) | false |
| RABBITMQ_EVENTS_QRCODE_UPDATED | Envia eventos de atualização do QR Code (true ou false) | false |
| RABBITMQ_EVENTS_MESSAGES_SET | Envia eventos de criação de mensagens (recuperação de mensagens) (true ou false) | false |
| RABBITMQ_EVENTS_MESSAGES_UPSERT | Envia eventos de recebimento de mensagens (true ou false) | false |
| RABBITMQ_EVENTS_MESSAGES_EDITED | Envia eventos de edição de mensagens (true ou false) | false |
| RABBITMQ_EVENTS_MESSAGES_UPDATE | Envia eventos de atualização de mensagens (true ou false) | false |
| RABBITMQ_EVENTS_MESSAGES_DELETE | Envia eventos de deleção de mensagens (true ou false) | false |
| RABBITMQ_EVENTS_SEND_MESSAGE | Envia eventos de envio de mensagens (true ou false) | false |
| RABBITMQ_EVENTS_CONTACTS_SET | Envia eventos de criação de contatos (true ou false) | false |
| RABBITMQ_EVENTS_CONTACTS_UPSERT | Envia eventos de recuperação de contatos (true ou false) | false |
| RABBITMQ_EVENTS_CONTACTS_UPDATE | Envia eventos de atualização de contatos (true ou false) | false |
| RABBITMQ_EVENTS_PRESENCE_UPDATE | Envia eventos de atualização de presença ("digitando..." ou "gravando...") (true ou false) | false |
| RABBITMQ_EVENTS_CHATS_SET | Envia eventos de criação de conversas (recuperação de conversas) (true ou false) | false |
| RABBITMQ_EVENTS_CHATS_UPSERT | Envia eventos de criação de conversas (recebimento ou envio de mensagens em novos chats) (true ou false) | false |
| RABBITMQ_EVENTS_CHATS_UPDATE | Envia eventos de atualização de conversas (true ou false) | false |
| RABBITMQ_EVENTS_CHATS_DELETE | Envia eventos de deleção de conversas (true ou false) | false |
| RABBITMQ_EVENTS_GROUPS_UPSERT | Envia eventos de criação de grupos (true ou false) | false |
| RABBITMQ_EVENTS_GROUP_UPDATE | Envia eventos de atualização de grupos (true ou false) | false |
| RABBITMQ_EVENTS_GROUP_PARTICIPANTS_UPDATE | Envia eventos de atualização nos participantes de grupos (true ou false) | false |
| RABBITMQ_EVENTS_CONNECTION_UPDATE | Envia eventos de atualização de conexão (true ou false) | false |
| RABBITMQ_EVENTS_CALL | Envia eventos de chamadas (true ou false) | false |
| RABBITMQ_EVENTS_TYPEBOT_START | Envia eventos de início de fluxo do Typebot (true ou false) | false |
| RABBITMQ_EVENTS_TYPEBOT_CHANGE_STATUS | Envia eventos de atualização no status do Typebot (true ou false) | false |

## SQS

| Variável | Valor | Exemplo |
| --- | --- | --- |
| SQS_ENABLED | Se o SQS está habilitado (true ou false) | false |
| SQS_ACCESS_KEY_ID | O ID de chave do SQS | - |
| SQS_SECRET_ACCESS_KEY | Chave de acesso | - |
| SQS_ACCOUNT_ID | ID da conta | - |
| SQS_REGION | Região do SQS | - |

## WebSocket

| Variável | Valor | Exemplo |
| --- | --- | --- |
| WEBSOCKET_ENABLED | Habilita o WebSocket (true ou false) | false |
| WEBSOCKET_GLOBAL_EVENTS | Habilita eventos globais no WebSocket (true ou false) | false |

## WhatsApp Business API

| Variável | Valor | Exemplo |
| --- | --- | --- |
| WA_BUSINESS_TOKEN_WEBHOOK | Token usado para validar o webhook no Facebook APP | evolution |
| WA_BUSINESS_URL | URL da API do WhatsApp Business | https://graph.facebook.com |
| WA_BUSINESS_VERSION | Versão da API do WhatsApp Business | v20.0 |
| WA_BUSINESS_LANGUAGE | Idioma da API do WhatsApp Business | en_US |

## Webhook Global

| Variável | Valor | Exemplo |
| --- | --- | --- |
| WEBHOOK_GLOBAL_ENABLED | Se os webhooks estão habilitados globalmente (true ou false) | false |
| WEBHOOK_GLOBAL_URL | URL que receberá as requisições de webhook | https://webhook.example.com |
| WEBHOOK_GLOBAL_WEBHOOK_BY_EVENTS | Ativa webhook por evento, respeitando a URL global e o nome de cada evento (true ou false) | false |

### Eventos de webhook com valor true ou false

| Variável |
| --- |
| WEBHOOK_EVENTS_APPLICATION_STARTUP |
| WEBHOOK_EVENTS_QRCODE_UPDATED |
| WEBHOOK_EVENTS_MESSAGES_SET |
| WEBHOOK_EVENTS_MESSAGES_UPSERT |
| WEBHOOK_EVENTS_MESSAGES_EDITED |
| WEBHOOK_EVENTS_MESSAGES_UPDATE |
| WEBHOOK_EVENTS_MESSAGES_DELETE |
| WEBHOOK_EVENTS_SEND_MESSAGE |
| WEBHOOK_EVENTS_CONTACTS_SET |
| WEBHOOK_EVENTS_CONTACTS_UPSERT |
| WEBHOOK_EVENTS_CONTACTS_UPDATE |
| WEBHOOK_EVENTS_PRESENCE_UPDATE |
| WEBHOOK_EVENTS_CHATS_SET |
| WEBHOOK_EVENTS_CHATS_UPSERT

 |
| WEBHOOK_EVENTS_CHATS_UPDATE |
| WEBHOOK_EVENTS_CHATS_DELETE |
| WEBHOOK_EVENTS_GROUPS_UPSERT |
| WEBHOOK_EVENTS_GROUPS_UPDATE |
| WEBHOOK_EVENTS_GROUP_PARTICIPANTS_UPDATE |
| WEBHOOK_EVENTS_CONNECTION_UPDATE |
| WEBHOOK_EVENTS_LABELS_EDIT |
| WEBHOOK_EVENTS_LABELS_ASSOCIATION |
| WEBHOOK_EVENTS_CALL |
| WEBHOOK_EVENTS_TYPEBOT_START |
| WEBHOOK_EVENTS_TYPEBOT_CHANGE_STATUS |
| WEBHOOK_EVENTS_ERRORS |
| WEBHOOK_EVENTS_ERRORS_WEBHOOK |

## Configurações de Sessão

| Variável | Valor | Exemplo |
| --- | --- | --- |
| CONFIG_SESSION_PHONE_CLIENT | Nome que será exibido na conexão do smartphone | Evolution API |
| CONFIG_SESSION_PHONE_NAME | Nome do navegador (Chrome, Firefox, Edge, Opera, Safari) | Chrome |

## QR Code

| Variável | Valor | Exemplo |
| --- | --- | --- |
| QRCODE_LIMIT | Por quanto tempo o QR code durará | 30 |
| QRCODE_COLOR | Cor do QR code gerado | #175197 |

## Typebot

| Variável | Valor | Exemplo |
| --- | --- | --- |
| TYPEBOT_API_VERSION | Versão da API (versão fixa ou latest) | latest |

## Chatwoot

| Variável | Valor | Exemplo |
| --- | --- | --- |
| CHATWOOT_ENABLED | Habilita a integração com Chatwoot (true ou false) | false |
| CHATWOOT_MESSAGE_READ | Marca como lida a última mensagem do cliente no WhatsApp ao enviar uma mensagem no Chatwoot (true ou false) | true |
| CHATWOOT_MESSAGE_DELETE | Deleta a mensagem no Chatwoot quando deletada no WhatsApp (true ou false) | true |
| CHATWOOT_IMPORT_DATABASE_CONNECTION_URI | URI de conexão com o banco de dados do Chatwoot para importar mensagens | postgresql://user:password@host:5432/chatwoot?sslmode=disable |
| CHATWOOT_IMPORT_PLACEHOLDER_MEDIA_MESSAGE | Importa as mensagens de mídia como placeholder no Chatwoot (true ou false) | true |

## OpenAI

| Variável | Valor | Exemplo |
| --- | --- | --- |
| OPENAI_ENABLED | Habilita a integração com OpenAI (true ou false) | false |

## Dify

| Variável | Valor | Exemplo |
| --- | --- | --- |
| DIFY_ENABLED | Habilita a integração com Dify (true ou false) | false |

## Cache

| Variável | Valor | Exemplo |
| --- | --- | --- |
| CACHE_REDIS_ENABLED | Habilita o cache Redis (true ou false) | true |
| CACHE_REDIS_URI | A URI de conexão do Redis | redis://localhost:6379/6 |
| CACHE_REDIS_PREFIX_KEY | Prefixo para diferenciar dados de uma instalação para outra usando o mesmo Redis | evolution |
| CACHE_REDIS_SAVE_INSTANCES | Salva as credenciais de conexão do WhatsApp no Redis (true ou false) | false |
| CACHE_LOCAL_ENABLED | Habilita o cache local em memória como alternativa ao Redis (true ou false) | false |

## Amazon S3 / MinIO

| Variável | Valor | Exemplo |
| --- | --- | --- |
| S3_ENABLED | Habilita o armazenamento no S3 (true ou false) | false |
| S3_ACCESS_KEY | Chave de acesso do S3 | - |
| S3_SECRET_KEY | Chave secreta do S3 | - |
| S3_BUCKET | Nome do bucket no S3 | evolution |
| S3_PORT | Porta de conexão ao S3 | 443 |
| S3_ENDPOINT | Endpoint do S3 (ou MinIO) | s3.amazonaws.com |
| S3_USE_SSL | Usa SSL para conexão ao S3 (true ou false) | true |

## Autenticação

| Variável | Valor | Exemplo |
| --- | --- | --- |
| AUTHENTICATION_API_KEY | Chave da API usada para autenticação global | 429683C4C977415CAAFCCE10F7D57E11 |
| AUTHENTICATION_EXPOSE_IN_FETCH_INSTANCES | Exibe as instâncias no endpoint de fetch (true ou false) | true |

## Idioma

| Variável | Valor | Exemplo |
| --- | --- | --- |
| LANGUAGE | Idioma da API | en |
```

# v2\pt\get-started\introduction.mdx

```mdx
---
sidebarTitle: 'Introdução'
title: 'Introdução'
icon: hand-wave
---



**Evolution API v2** é uma plataforma robusta dedicada a capacitar pequenas empresas, empreendedores, freelancers e indivíduos com recursos limitados, 
indo além de uma simples solução de mensagens via **WhatsApp™**.

Nossa missão é fornecer uma API abrangente que permite a esses grupos reforçarem seus negócios, seja localmente ou online, integrando-se com **múltiplas plataformas e serviços**.

O melhor de tudo é que o nosso serviço é **totalmente gratuito**, concebido para apoiar aqueles que se esforçam para ter sucesso num cenário de mercado competitivo.

Originalmente, a **Evolution API** começou como uma API de controle de WhatsApp baseada no CodeChat, utilizando a biblioteca Baileys. Com o tempo, a plataforma se expandiu para 
suportar não apenas o WhatsApp, mas também integrações com serviços como **Typebot, Chatwoot, Dify e OpenAI**. 
Além disso, a Evolution API suporta tanto a API de WhatsApp baseada no Baileys quanto a API oficial do WhatsApp Business, com suporte futuro planejado para Instagram e Messenger.

Acesse nosso [repositório](https://github.com/EvolutionAPI/evolution-api) e faça parte da nossa [comunidade](https://evolution-api.com) para fazer parte do projeto.

## Instalação
Veja como instalar a versão completa em:

<CardGroup cols={2}>
  <Card title="Instalação com Docker" icon="docker" href="/v2/pt/install/docker">
    Veja como instalar a EvolutionAPI completa pelo Docker
  </Card>
  <Card title="NVM" icon="js" href="/v2/pt/install/nvm">
    Veja como instalar a EvolutionAPI com o NVM
  </Card>
</CardGroup>

<CardGroup cols={2}>
  <Card title="Documentação da API" icon="book" href="/v2/pt/definitions/connections">
    Veja a documentação da API com exemplos de código
  </Card>
  <Card title="Coleção Postman" icon="webhook" href="https://www.postman.com/agenciadgcode/evolution-api/collection/gqr041s/evolution-api-v2-0">
    Utilize a coleção oficial da API para Postman.
  </Card>
</CardGroup>

```

# v2\pt\install\docker.mdx

```mdx
---
title: Docker
icon: docker
---

<Note>  
  **Pré-requisitos:** Antes de prosseguir com a instalação da Evolution API v2 utilizando Docker, certifique-se de que você já tenha configurado os serviços necessários, como PostgreSQL e Redis. Siga os links abaixo para mais detalhes:
  
  - [Configuração do Banco de Dados](/v2/pt/requirements/database)
  - [Configuração do Redis](/v2/pt/requirements/redis)
</Note>

<Note>  
  Estas instruções de instalação assumem que você já instalou o Docker em sua máquina. Você pode encontrar
  informações sobre como instalar o Docker na  
  [Documentação Oficial do Docker](https://docs.docker.com/engine/install/).
</Note>

A Evolution API v2 está pronta para o Docker e pode ser facilmente implantada com Docker no modo standalone ou swarm. 
O repositório oficial do Evolution API contém todos os arquivos de composição necessários para instalar e executar a API.

## Docker Compose

Implantar a Evolution API v2 usando o Docker Compose simplifica a configuração e o gerenciamento de seus contêineres Docker. 
Ele permite que você defina seu ambiente Docker em um arquivo `docker-compose.yaml` e, em seguida, use um único comando para iniciar tudo.

### Arquivo Docker Compose

O exemplo a seguir ilustra como configurar o Docker Compose para ambientes standalone, ou seja, um único servidor em execução. 
Para a sincronização de dois servidores em paralelo ou maior escalabilidade, utilize o Docker Swarm, recomendado para usuários mais avançados.

#### Configuração Standalone

<Warning>  
  **Atenção:** Os comandos aqui descritos como `docker compose`, podem não funcionar em versões mais antigas do Docker. 
  Caso você esteja usando uma versão mais antiga, substitua por `docker-compose`.
</Warning>

O Docker standalone é adequado quando a Evolution API será executada em apenas uma máquina, sem a necessidade de escalabilidade imediata. 
Esta é a forma mais conveniente para a maioria dos usuários.

Para começar, crie um arquivo `docker-compose.yml` com o seguinte conteúdo:

~~~ yaml
version: '3.9'
services:
  evolution-api:
    container_name: evolution_api
    image: atendai/evolution-api:v2.1.1
    restart: always
    ports:
      - "8080:8080"
    env_file:
      - .env
    volumes:
      - evolution_instances:/evolution/instances

volumes:
  evolution_instances:
~~~

Em seguida, crie um arquivo `.env` no mesmo diretório com o seguinte conteúdo mínimo:

~~~ bash
AUTHENTICATION_API_KEY=mude-me
~~~

<Note>  
  Para mais configurações, você pode pegar o arquivo de exemplo no
  [repositório oficial](https://github.com/EvolutionAPI/evolution-api/blob/main/.env.example). Confira também o guia de variáveis de ambiente [aqui](/v2/pt/env).
</Note>

### Inicializando a API

Navegue até o diretório que contém o arquivo `docker-compose.yml` e execute o seguinte comando para iniciar os serviços definidos no arquivo:

~~~ bash
docker compose up -d
~~~

Esse comando baixará as imagens Docker necessárias, criará os serviços, redes e volumes definidos, e iniciará o serviço da Evolution API.

### Verificando os Logs

Após executar o comando `docker compose up`, você pode verificar os logs para confirmar se os serviços estão em execução corretamente:

~~~ bash
docker logs evolution_api
~~~

### Parando o Serviço

Para parar o serviço, utilize o comando:

~~~ bash
docker compose down
~~~

### Acessando a API

Abra seu navegador e acesse [http://localhost:8080](http://localhost:8080) para verificar se a Evolution API está operacional.

## Docker Swarm

Para configurar e gerenciar um cluster Docker Swarm para a Evolution API v2, siga as instruções abaixo. O Docker Swarm é ideal para ambientes que exigem escalabilidade e alta disponibilidade.

### Instalação do Docker Swarm


#### Configurando o Servidor Manager

Se estiver utilizando um servidor da Hetzner, execute:

~~~ bash
sudo apt-get update && apt-get install -y apparmor-utils
~~~

**Etapa 1: Configuração do Hostname**

1. Mude o hostname da máquina para identificá-la no cluster:

~~~ bash
hostnamectl set-hostname manager1
~~~

2. Edite o arquivo `/etc/hosts` para adicionar o novo nome:

~~~ bash
nano /etc/hosts
~~~

Adicione a linha:

~~~ bash
127.0.0.1    manager1
~~~

3. Reinicie o sistema para aplicar as alterações:

~~~ bash
reboot
~~~

4. Verifique o hostname:

~~~ bash
hostnamectl
~~~

**Etapa 2: Instalação do Docker**

Instale o Docker executando:

~~~ bash
curl -fsSL https://get.docker.com | bash
~~~

**Etapa 3: Iniciando o Swarm**

Inicie o Docker Swarm:

~~~ bash
docker swarm init --advertise-addr IP_SERVER
~~~

**Etapa 4: Configuração da Rede do Docker Swarm**

Crie a rede overlay para o Docker Swarm:

~~~ bash
docker network create --driver=overlay network_public
~~~

Anote o comando gerado para registrar os Workers:

~~~ bash
docker swarm join --token HASH IP_SERVER:2377
~~~

#### Configurando o Servidor Worker

Se estiver utilizando um servidor da Hetzner, execute:

~~~ bash
sudo apt-get update && apt-get install -y apparmor-utils
~~~

**Etapa 1: Configuração do Hostname**

1. Mude o hostname da máquina para identificá-la no cluster:

~~~ bash
hostnamectl set-hostname worker1
~~~

2. Edite o arquivo `/etc/hosts` para adicionar o novo nome:

~~~ bash
nano /etc/hosts
~~~

Adicione a linha:

~~~ bash
127.0.0.1    worker1
~~~

3. Reinicie o sistema para aplicar as alterações:

~~~ bash
reboot
~~~

**Etapa 2: Instalação do Docker**

Instale o Docker executando:

~~~ bash
curl -fsSL https://get.docker.com | bash
~~~

**Etapa 3: Adicionar o Worker ao Cluster**

Execute o comando obtido anteriormente para adicionar o Worker ao cluster:

~~~ bash
docker swarm join --token HASH IP_SERVER:2377
~~~

### Pré-requisitos para a Evolution API via Swarm

#### Instalação do Traefik

Para instalar o Traefik no Docker Swarm, siga as instruções abaixo:

1. No servidor manager, crie um arquivo `traefik.yaml`:

~~~ bash
nano traefik.yaml
~~~

2. Adicione o seguinte conteúdo ao arquivo:

~~~ yaml
version: "3.7"

services:
  traefik:
    image: traefik:2.11.2
    command:
      - "--api.dashboard=true"
      - "--providers.docker.swarmMode=true"
      - "--providers.docker.endpoint=unix:///var/run/docker.sock"
      - "--providers.docker.exposedbydefault=false"
      - "--providers.docker.network=network_public"
      - "--entrypoints.web.address=:80"
      - "--entrypoints.web.http.redirections.entryPoint.to=websecure"
      - "--entrypoints.web.http.redirections.entryPoint.scheme=https"
      - "--entrypoints.web.http.redirections.entrypoint.permanent=true"
      - "--entrypoints.websecure.address=:443"
      - "--certificatesresolvers.letsencryptresolver.acme.httpchallenge=true"
      - "--certificatesresolvers.letsencryptresolver.acme.httpchallenge.entrypoint=web"
      - "--certificatesresolvers.letsencryptresolver.acme.email=seu@email.com"
      - "--certificatesresolvers.letsencryptresolver.acme.storage=/etc/traefik/letsencrypt/acme.json"
      - "--log.level=DEBUG"
      - "--log.format=common"
      - "--log.filePath=/var/log/traefik/traefik.log"
      - "--accesslog=true"
      - "--accesslog.filepath=/var/log/traefik/access-log"
    deploy:
      placement:
        constraints:
          - node.role == manager
      restart_policy:
        condition: on-failure
        delay: 5s
      labels:
        - "traefik.enable=true"
        - "traefik.http.middlewares.redirect-https.redirectscheme.scheme=https"
        - "traefik.http.middlewares.redirect-https.redirectscheme.permanent=true"
        - "traefik.http.routers.http-catchall.rule=hostregexp(`{host:.+}`)"
        - "traefik.http.routers.http-catchall.entrypoints=web"
        - "traefik.http.routers.http-catchall.middlewares=redirect-https@docker"
        - "traefik.http.routers.http-catchall.priority=1"
    volumes:
      - "/var/run

/docker.sock:/var/run/docker.sock:ro"
      - "vol_certificates:/etc/traefik/letsencrypt"
    ports:
      - target: 80
        published: 80
        mode: host
      - target: 443
        published: 443
        mode: host
    networks:
      - network_public

volumes:
  vol_certificates:
    external: true
    name: volume_swarm_certificates

networks:
  network_public:
    external: true
    name: network_public
~~~

3. Execute o comando abaixo para fazer o deploy da stack Traefik:

~~~ bash
docker stack deploy --prune --resolve-image always -c traefik.yaml traefik
~~~

### Deploy da Evolution API v2

Finalmente, para implantar a Evolution API v2 no Docker Swarm, use o arquivo de configuração disponível [aqui](https://github.com/EvolutionAPI/evolution-api/blob/v2.0.0/Docker/swarm/evolution_api_v2.yaml) com o seguinte conteúdo:

~~~ yaml
version: "3.7"

services:
  evolution_v2:
    image: atendai/evolution-api:v2.1.1
    volumes:
      - evolution_instances:/evolution/instances
    networks:
      - network_public
    environment:
      - SERVER_URL=https://evo2.site.com
      - DEL_INSTANCE=false
      - DATABASE_ENABLED=true
      - DATABASE_PROVIDER=postgresql
      - DATABASE_CONNECTION_URI=postgresql://postgres:SENHA@postgres:5432/evolution
      - DATABASE_SAVE_DATA_INSTANCE=true
      - DATABASE_SAVE_DATA_NEW_MESSAGE=true
      - DATABASE_SAVE_MESSAGE_UPDATE=true
      - DATABASE_SAVE_DATA_CONTACTS=true
      - DATABASE_SAVE_DATA_CHATS=true
      - DATABASE_SAVE_DATA_LABELS=true
      - DATABASE_SAVE_DATA_HISTORIC=true
      - DATABASE_CONNECTION_CLIENT_NAME=evolution_v2
      - RABBITMQ_ENABLED=false
      - RABBITMQ_URI=amqp://admin:admin@rabbitmq:5672/default
      - CACHE_REDIS_ENABLED=true
      - CACHE_REDIS_URI=redis://evo_redis:6379/1
      - CACHE_REDIS_PREFIX_KEY=evolution_v2
      - CACHE_REDIS_SAVE_INSTANCES=false
      - CACHE_LOCAL_ENABLED=false
      - S3_ENABLED=true
      - S3_ACCESS_KEY=
      - S3_SECRET_KEY=
      - S3_BUCKET=evolution
      - S3_PORT=443
      - S3_ENDPOINT=files.site.com
      - S3_USE_SSL=true
      - AUTHENTICATION_API_KEY=429683C4C977415CAAFCCE10F7D57E11
    deploy:
      mode: replicated
      replicas: 1
      placement:
        constraints:
          - node.hostname == evolution-manager
      labels:
        - traefik.enable=true
        - traefik.http.routers.evolution_v2.rule=Host(`evo2.site.com`)
        - traefik.http.routers.evolution_v2.entrypoints=websecure
        - traefik.http.routers.evolution_v2.tls.certresolver=letsencryptresolver
        - traefik.http.routers.evolution_v2.service=evolution_v2
        - traefik.http.services.evolution_v2.loadbalancer.server.port=8080
        - traefik.http.services.evolution_v2.loadbalancer.passHostHeader=true

volumes:
  evolution_instances:
    external: true
    name: evolution_v2_data

networks:
  network_public:
    external: true
    name: network_public
~~~

Após configurar e salvar o arquivo, faça o deploy da stack com o comando:

~~~ bash
docker stack deploy --prune --resolve-image always -c evolution_api_v2.yaml evolution_v2
~~~

### Acessando a API

Abra seu navegador e acesse [https://evo2.site.com](https://evo2.site.com) para verificar se a Evolution API está operacional.

```

# v2\pt\install\nginx.mdx

```mdx
---
title: Nginx e SSL
icon: globe  
---

## Configuração do Nginx

Para expor a Evolution API na web de forma segura, você pode configurar o Nginx como um proxy reverso.

### Instalação do Nginx

Instale, inicie e habilite o Nginx:

\`\`\`bash
apt-get install -y nginx
systemctl start nginx
systemctl enable nginx
systemctl status nginx
\`\`\`

Se a informação "Ativo: ativo (em execução)" aparecer, o Nginx está funcionando corretamente.

### Configuração do Nginx

Remova a configuração padrão do Nginx:

\`\`\`bash
rm /etc/nginx/sites-enabled/default
\`\`\`

Crie um novo arquivo de configuração:

\`\`\`bash
nano /etc/nginx/conf.d/default.conf
\`\`\`

Adicione a seguinte configuração:

\`\`\`nginx
server {
  listen 80;
  listen [::]:80;
  server_name _;

  location / {
    proxy_pass http://127.0.0.1:8080;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_cache_bypass $http_upgrade;
  }

  location ~* \.(jpg|jpeg|gif|png|webp|svg|woff|woff2|ttf|css|js|ico|xml)$ {
    expires 360d;
  }

  location ~ /\.ht {
    deny all;
  }
}
\`\`\`

Recarregue o Nginx para aplicar as alterações:

\`\`\`bash
systemctl reload nginx
\`\`\`

Se necessário, faça o usuário `nginx` ser o proprietário do diretório da web:

\`\`\`bash
chown www-data:www-data /usr/share/nginx/html -R
\`\`\`

Para configurar um Virtual Host, crie um arquivo de configuração:

\`\`\`bash
nano /etc/nginx/sites-available/api
\`\`\`

Adicione a seguinte configuração:

\`\`\`nginx
server {
  server_name substitua-isso-pelo-seu-domínio-legal.com;

  location / {
    proxy_pass http://127.0.0.1:8080;
    proxy_http_version 1.1;
    proxy_set_header Upgrade $http_upgrade;
    proxy_set_header Connection 'upgrade';
    proxy_set_header Host $host;
    proxy_set_header X-Real-IP $remote_addr;
    proxy_set_header X-Forwarded-Proto $scheme;
    proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
    proxy_cache_bypass $http_upgrade;
  }
}
\`\`\`

Crie um link simbólico para habilitar a configuração:

\`\`\`bash
ln -s /etc/nginx/sites-available/api /etc/nginx/sites-enabled
nginx -t
\`\`\`

Recarregue o Nginx:

\`\`\`bash
systemctl reload nginx
\`\`\`

## Instalar o Certbot para o Certificado SSL

Para proteger sua Evolution API com SSL, instale o Certbot:

\`\`\`bash
snap install --classic certbot
\`\`\`

### Configurar SSL com Certbot

Para configurar o SSL, use o comando:

\`\`\`bash
certbot --nginx -d substitua-isso-pelo-seu-domínio-legal.com
\`\`\`

<Note>  
Se o processo for bem-sucedido, você verá a mensagem "Congratulations! You have successfully enabled HTTPS".
</Note>

```

# v2\pt\install\nvm.mdx

```mdx
---
title: NVM 
icon: js  
---

## Pré-requisitos

Antes de iniciar a instalação da Evolution API v2, certifique-se de que você já configurou os serviços necessários, como PostgreSQL e Redis. Siga os links abaixo para mais detalhes:

- [Configuração do Banco de Dados](/v2/pt/requirements/database)
- [Configuração do Redis](/v2/pt/requirements/redis)

## Instalação do NVM

A Evolution API pode ser facilmente instalada usando o Node Version Manager (NVM). Siga estas etapas para configurar seu ambiente e iniciar a Evolution API em seu servidor.

### Instalar NVM

Primeiro, baixe e instale o Node.js com os seguintes comandos:

\`\`\`bash
curl -o- https://raw.githubusercontent.com/nvm-sh/nvm/v0.39.7/install.sh | bash
\`\`\`

Agora, carregue o ambiente e instale o Node.js:

\`\`\`bash
# Carregar o NVM no ambiente atual
source ~/.bashrc

# Instalar e usar a versão necessária do Node.js
nvm install v20.10.0 && nvm use v20.10.0
\`\`\`

Confirme que o NVM foi instalado com sucesso:

\`\`\`bash
command -v nvm
\`\`\`

<Info>  
Se você ainda não configurou, também pode configurar o fuso horário do seu servidor com o comando:

\`\`\`bash
dpkg-reconfigure tzdata
\`\`\`
</Info>

## Clonando o Repositório e Instalando Dependências

Clone o repositório oficial da Evolution API v2 a partir da branch correta:

\`\`\`bash
git clone -b v2.0.0 https://github.com/EvolutionAPI/evolution-api.git
\`\`\`

Acesse o diretório do projeto e instale as dependências:

\`\`\`bash
cd evolution-api
npm install
\`\`\`

## Configuração de Variáveis de Ambiente

Agora vamos configurar as variáveis de ambiente. Primeiro, copie o arquivo `.env.example` para `.env`:

\`\`\`bash
cp ./.env.example ./.env
\`\`\`

Edite o arquivo `.env` com suas configurações específicas:

\`\`\`bash
nano ./.env
\`\`\`

Substitua os valores padrão pelas suas configurações, como strings de conexão de banco de dados, chaves de API, portas do servidor, etc.

<Info>  
Acesse a [seção de variáveis de ambiente](/v2/pt/env) para instruções detalhadas sobre como configurar seu arquivo `.env`.
</Info>

## Geração e Deploy do Banco de Dados

Após configurar o ambiente, você precisará realizar a geração dos arquivos do cliente Prisma e o deploy das migrations no banco de dados. Utilize os comandos abaixo, dependendo do banco de dados que você está utilizando (PostgreSQL ou MySQL):

1. Gerar os arquivos do cliente Prisma:

    \`\`\`bash
    npm run db:generate
    \`\`\`

2. Realizar o deploy das migrations:

    \`\`\`bash
    npm run db:deploy
    \`\`\`
    
## Inicializando a Evolution API

Após a configuração, você pode iniciar a Evolution API com o seguinte comando:

\`\`\`bash
npm run build
npm run start:prod
\`\`\`

## Instalação e Configuração do PM2

Use o PM2 para gerenciar o processo da API:

\`\`\`bash
npm install pm2 -g
pm2 start 'npm run start:prod' --name ApiEvolution
pm2 startup
pm2 save --force
\`\`\`

<Info>  
Se o seu servidor tiver mais memória, considere configurar o PM2 para utilizar mais recursos:

\`\`\`bash
pm2 start 'npm run start:prod' --name ApiEvolution -- start --node-args="--max-old-space-size=4096" --max-memory-restart 4G
\`\`\`

Isso é recomendado para servidores com pelo menos 4GB de RAM disponíveis exclusivamente para a Evolution API.
</Info>

Para verificar se a API está em execução, acesse [http://localhost:8080](http://localhost:8080). Você deve ver a seguinte resposta:

\`\`\`json
{
  "status": 200,
  "message": "Welcome to the Evolution API, it is working!",
  "version": "2.0.10",
  "clientName": "evolution01",
  "manager": "https://evo2.site.com/manager",
  "documentation": "https://doc.evolution-api.com"
}
\`\`\`

<Tip>  
Facilite sua vida com a extensão JSON Formatter no [Google Chrome](https://chromewebstore.google.com/detail/json-formatter/gpmodmeblccallcadopbcoeoejepgpnb?hl=pt-BR) ou [Microsoft Edge](https://microsoftedge.microsoft.com/addons/detail/json-formatter/hdebmbedhflilekbidmmdiaiilaegkjl).
</Tip>
```

# v2\pt\integrations\chatwoot.mdx

```mdx
---
title: Chatwoot  
icon: comment  
---

A Evolution API permite uma integração direta com o **Chatwoot**, uma plataforma de suporte ao cliente que centraliza comunicações de múltiplos canais. Esta documentação detalha como configurar essa integração tanto durante a criação de uma nova instância quanto em uma instância já existente.

## Configuração da Integração com Chatwoot

### 1. Configuração na Criação da Instância

Você pode configurar o Chatwoot diretamente ao criar uma nova instância na Evolution API. Use o seguinte corpo de requisição para o endpoint `/instance/create`:

#### Endpoint

~~~http
POST {{baseUrl}}/instance/create
~~~

#### Corpo da Requisição

~~~json
{
    "instanceName": "NOME DA INSTANCIA",
    "number": "NUMERO DO WHATSAPP PARA GERAR O PAIRING CODE",
    "qrcode": true,
    "integration": "WHATSAPP-BAILEYS",
    "chatwootAccountId": "1",
    "chatwootToken": "TOKEN",
    "chatwootUrl": "https://chatwoot.com",
    "chatwootSignMsg": true,
    "chatwootReopenConversation": true,
    "chatwootConversationPending": false,
    "chatwootImportContacts": true,
    "chatwootNameInbox": "evolution",
    "chatwootMergeBrazilContacts": true,
    "chatwootImportMessages": true,
    "chatwootDaysLimitImportMessages": 3,
    "chatwootOrganization": "Evolution Bot",
    "chatwootLogo": "https://evolution-api.com/files/evolution-api-favicon.png"
}
~~~

### 2. Configuração para Instâncias Existentes

Se você já tem uma instância criada e deseja configurar ou alterar a integração com o Chatwoot, utilize o endpoint `/chatwoot/set/{{instance}}` com o seguinte formato de requisição:

#### Endpoint

~~~http
POST {{baseUrl}}/chatwoot/set/{{instance}}
~~~

#### Corpo da Requisição

Aqui está um exemplo de como deve ser o corpo da requisição para configurar a integração:

~~~json
{
    "enabled": true,
    "accountId": "1",
    "token": "TOKEN",
    "url": "https://chatwoot.com",
    "signMsg": true,
    "reopenConversation": true,
    "conversationPending": false,
    "nameInbox": "evolution",
    "mergeBrazilContacts": true,
    "importContacts": true,
    "importMessages": true,
    "daysLimitImportMessages": 2,
    "signDelimiter": "\n",
    "autoCreate": true,
    "organization": "BOT",
    "logo": "link_da_sua_logo"
}
~~~

### Explicação dos Parâmetros

- **`enabled`**: Ativa (`true`) ou desativa (`false`) a integração do Chatwoot para a instância.
- **`accountId`**: ID da conta do Chatwoot associada à integração.
- **`token`**: Token de autenticação do usuário administrador da conta no Chatwoot.
- **`url`**: URL base do Chatwoot. Importante: Não incluir a `/` no final da URL.
- **`signMsg`**: Quando ativado (`true`), adiciona a assinatura com o nome do atendente nas mensagens enviadas.
- **`reopenConversation`**: Define se a integração deve sempre reabrir a mesma conversa (`true`) ou criar uma nova.
- **`conversationPending`**: Inicia as conversas como pendentes (`true`), aguardando ação de um atendente.
- **`nameInbox`**: Nome customizado da inbox no Chatwoot. Se não fornecido, a instância usará o nome da instância.
- **`mergeBrazilContacts`**: Faz merge de contatos brasileiros que possuem o dígito `9` adicional em seus números (`true`).
- **`importContacts`**: Importa os contatos da agenda do WhatsApp para o Chatwoot (`true`).
- **`importMessages`**: Importa as mensagens do WhatsApp para o Chatwoot (`true`).
- **`daysLimitImportMessages`**: Define o número limite de dias para importação de mensagens antigas do WhatsApp.
- **`signDelimiter`**: Delimitador usado para separar a assinatura do corpo da mensagem.
- **`autoCreate`**: Se ativado (`true`), cria automaticamente a configuração da inbox no Chatwoot.
- **`organization`**: Nome do contato do bot de comandos, usado para personalizar a interação.
- **`logo`**: URL da imagem a ser usada como foto de perfil do contato do bot de comandos.

## Passos para Configurar a Integração

1. **Obtenha as Credenciais e URLs**:
   - Acesse o painel do Chatwoot e obtenha o `accountId` e o `token` do usuário administrador.
   - Verifique a URL base do seu Chatwoot e configure sem a `/` final.

2. **Crie ou Configure a Instância**:
   - Use o endpoint `/instance/create` para configurar o Chatwoot durante a criação da instância.
   - Use o endpoint `/chatwoot/set/{{instance}}` para configurar o Chatwoot em uma instância já existente.

3. **Verifique a Configuração**:
   - Acesse o Chatwoot para garantir que a inbox foi criada e que as configurações estão corretas.
   - Teste o envio e recebimento de mensagens para confirmar a integração.

## Considerações Finais

A integração da Evolution API com o Chatwoot permite centralizar e automatizar a comunicação do WhatsApp diretamente na sua plataforma de atendimento ao cliente. Com opções de personalização, importação de contatos e mensagens, e a possibilidade de reabrir conversas existentes, esta integração oferece flexibilidade para atender às necessidades específicas do seu fluxo de trabalho.

<Info>  
Para mais detalhes sobre outras integrações e configurações, consulte a [seção de variáveis de ambiente](/v2/pt/env).
</Info>
```

# v2\pt\integrations\cloudapi.mdx

```mdx
---
title: WhatsApp Cloud API
icon: whatsapp
---

A Evolution API v2 permite integrar sua aplicação com a Cloud API oficial do WhatsApp para gerenciar mensagens, contatos, e outras funcionalidades diretamente através da API. A seguir, são detalhados os pré-requisitos e o processo de integração.

## Pré-requisitos

Antes de iniciar a integração com a Cloud API do WhatsApp, você deve garantir que os seguintes passos foram concluídos:

### 1. Criação da Business Manager (BM) e Aprovação

Para utilizar a Cloud API oficial do WhatsApp, você precisa de uma **Business Manager** (BM) aprovada. Este processo envolve:

- Criar uma conta no [Facebook Business Manager](https://business.facebook.com/).
- Seguir os passos para verificação da sua empresa.
- Aguardar a aprovação da sua conta.

### 2. Criação do App no Facebook Developers

Após a aprovação da sua BM, você precisa criar um aplicativo na plataforma [Facebook Developers](https://developers.facebook.com/):

- Acesse a sua conta do Facebook Developers e clique em **Meus Apps**.
- Clique em **Criar App** e siga as instruções para configurar um novo aplicativo.
- Certifique-se de adicionar a API do WhatsApp ao seu aplicativo.

### 3. Configuração do Número no Aplicativo

Após criar o aplicativo, você precisa configurar o número do WhatsApp:

- No painel do seu aplicativo no Facebook Developers, vá para a seção **WhatsApp**.
- Adicione e verifique o número de telefone que deseja usar com a Cloud API.
- Anote o **Number ID** fornecido.

### 4. Criar um Token Permanente

Para evitar que o token de acesso expire, crie um **token permanente** para o usuário admin da sua BM:

- Vá para a seção **Tokens de Acesso** no Facebook Developers.
- Gere um token com as permissões necessárias para a API do WhatsApp.
- Certifique-se de que este token é permanente, para não precisar ser renovado periodicamente.

## Configuração na Evolution API v2

Agora que você completou os pré-requisitos, siga os passos abaixo para configurar a integração com a Evolution API v2.

### 1. Criação da Instância

Para criar uma instância que utiliza a Cloud API do WhatsApp, você precisará acessar a rota `/instance/create` da Evolution API v2 com o seguinte corpo de requisição:

\`\`\`json
{
    "instanceName": "NOME DA INSTANCIA",
    "token": "TOKEN PERMANENTE DO USUARIO ADMIN DA BM",
    "number": "NUMBER ID DO WHATSAPP",
    "businessId": "BUSINESS ID DA CONTA DO WHATSAPP",
    "qrcode": false,
    "integration": "WHATSAPP-BUSINESS"
}
\`\`\`

### Parâmetros do Corpo da Requisição:

- **`instanceName`**: Nome da instância que você está criando.
- **`token`**: Token permanente gerado para o usuário admin da sua BM.
- **`number`**: Number ID do WhatsApp que você configurou no aplicativo do Facebook Developers.
- **`businessId`**: ID da conta de negócios associada ao WhatsApp.
- **`qrcode`**: Defina como `false` pois a integração é baseada em token, e não em QR Code.
- **`integration`**: Use `"WHATSAPP-BUSINESS"` para especificar que esta integração é com a API oficial do WhatsApp Business.

### Exemplo de Requisição:

\`\`\`bash
curl -X POST http://API_URL/instance/create \
-H "Content-Type: application/json" \
-d '{
    "instanceName": "MinhaInstancia",
    "token": "EAAGm0PX4ZCpsBA...",
    "number": "1234567890",
    "businessId": "9876543210",
    "qrcode": false,
    "integration": "WHATSAPP-BUSINESS"
}'
\`\`\`

### 2. Configuração do Webhook

Depois de criar a instância, é necessário configurar o webhook no aplicativo da Meta para receber eventos e mensagens do WhatsApp.

#### URL do Webhook

No painel do seu aplicativo no Facebook Developers, configure o webhook com a seguinte URL:

\`\`\`plaintext
API_URL/webhook/meta
\`\`\`

#### Token do Webhook

O token para validar o webhook deve ser configurado na variável `WA_BUSINESS_TOKEN_WEBHOOK` no seu arquivo `.env`:

\`\`\`plaintext
WA_BUSINESS_TOKEN_WEBHOOK=seu_token_webhook
\`\`\`

Este token será usado pela Meta para validar as requisições enviadas para o seu webhook.

### Conclusão

Com a instância criada e o webhook configurado, a sua Evolution API v2 está pronta para operar com a Cloud API oficial do WhatsApp. Todas as mensagens e eventos relacionados ao número configurado serão gerenciados automaticamente pela Evolution API.

Esta documentação fornece uma visão clara e detalhada de como integrar a Cloud API do WhatsApp com a Evolution API v2, desde a preparação necessária até a configuração final. Se você seguir todas as etapas, estará preparado para utilizar as funcionalidades do WhatsApp em sua aplicação através da Evolution API v2.
```

# v2\pt\integrations\dify.mdx

```mdx
---
title: Dify
icon: robot
---

A Evolution API permite a criação e gerenciamento de bots utilizando a tecnologia Dify, proporcionando automação e interatividade avançada através de diferentes tipos de bots, como chatBots, textGenerators, agents, e workflows. A seguir, você encontrará as instruções detalhadas sobre como configurar bots, gerenciar sessões e definir configurações padrão.

## 1. Criação de Bots no Dify

Você pode configurar diversos bots no Dify utilizando triggers para iniciar as interações. A configuração do bot pode ser feita através do endpoint `/dify/create/{{instance}}`.

### Endpoint para Criação de Bots

#### Endpoint

~~~http
POST {{baseUrl}}/dify/create/{{instance}}
~~~

#### Corpo da Requisição

Aqui está um exemplo de corpo JSON para configurar um bot no Dify:

~~~json
{
    "enabled": true,
    "botType": "chatBot", /* chatBot, textGenerator, agent, workflow */
    "apiUrl": "http://dify.site.com/v1",
    "apiKey": "app-123456",
    // opções
    "triggerType": "keyword", /* all ou keyword */
    "triggerOperator": "equals", /* contains, equals, startsWith, endsWith, regex, none */
    "triggerValue": "teste",
    "expire": 0,
    "keywordFinish": "#SAIR",
    "delayMessage": 1000,
    "unknownMessage": "Mensagem não reconhecida",
    "listeningFromMe": false,
    "stopBotFromMe": false,
    "keepOpen": false,
    "debounceTime": 0,
    "ignoreJids": []
}
~~~

### Explicação dos Parâmetros

- **`enabled`**: Ativa (`true`) ou desativa (`false`) o bot.
- **`botType`**: Tipo do bot Dify (`chatBot`, `textGenerator`, `agent`, `workflow`).
- **`apiUrl`**: URL da API do Dify (sem a `/` no final).
- **`apiKey`**: Chave da API fornecida pelo Dify.
- **Opções**:
  - **`triggerType`**: Tipo de trigger para iniciar o bot (`all` ou `keyword`).
  - **`triggerOperator`**: Operador utilizado para avaliar o trigger (`contains`, `equals`, `startsWith`, `endsWith`, `regex`, `none`).
  - **`triggerValue`**: Valor utilizado no trigger (por exemplo, uma palavra-chave ou regex).
  - **`expire`**: Tempo em minutos após o qual o bot expira, reiniciando se a sessão expirou.
  - **`keywordFinish`**: Palavra-chave que encerra a sessão do bot.
  - **`delayMessage`**: Delay (em milissegundos) para simular a digitação antes de enviar uma mensagem.
  - **`unknownMessage`**: Mensagem enviada quando a entrada do usuário não é reconhecida.
  - **`listeningFromMe`**: Define se o bot deve escutar as mensagens enviadas pelo próprio usuário (`true` ou `false`).
  - **`stopBotFromMe`**: Define se o bot deve parar quando o próprio usuário envia uma mensagem (`true` ou `false`).
  - **`keepOpen`**: Mantém a sessão aberta, evitando que o bot seja reiniciado para o mesmo contato.
  - **`debounceTime`**: Tempo (em segundos) para juntar várias mensagens em uma só.
  - **`ignoreJids`**: Lista de JIDs de contatos que não ativarão o bot.

## 2. Configurações Padrão do Dify

Você pode definir configurações padrão que serão aplicadas caso os parâmetros não sejam passados durante a criação do bot.

### Endpoint para Configurações Padrão

#### Endpoint

~~~http
POST {{baseUrl}}/dify/settings/{{instance}}
~~~

#### Corpo da Requisição

Aqui está um exemplo de configuração padrão:

~~~json
{
    "expire": 20,
    "keywordFinish": "#SAIR",
    "delayMessage": 1000,
    "unknownMessage": "Mensagem não reconhecida",
    "listeningFromMe": false,
    "stopBotFromMe": false,
    "keepOpen": false,
    "debounceTime": 0,
    "ignoreJids": [],
    "difyIdFallback": "clyja4oys0a3uqpy7k3bd7swe"
}
~~~

### Explicação dos Parâmetros

- **`expire`**: Tempo em minutos após o qual o bot expira.
- **`keywordFinish`**: Palavra-chave que encerra a sessão do bot.
- **`delayMessage`**: Delay para simular a digitação antes de enviar uma mensagem.
- **`unknownMessage`**: Mensagem enviada quando a entrada do usuário não é reconhecida.
- **`listeningFromMe`**: Define se o bot deve escutar as mensagens enviadas pelo próprio usuário.
- **`stopBotFromMe`**: Define se o bot deve parar quando o próprio usuário envia uma mensagem.
- **`keepOpen`**: Mantém a sessão aberta, evitando que o bot seja reiniciado para o mesmo contato.
- **`debounceTime`**: Tempo para juntar várias mensagens em uma só.
- **`ignoreJids`**: Lista de JIDs de contatos que não ativarão o bot.
- **`difyIdFallback`**: ID do bot de fallback que será utilizado caso nenhum trigger seja ativado.

## 3. Gerenciamento de Sessões do Dify

Você pode gerenciar as sessões do bot, alterando o status entre aberta, pausada ou fechada para cada contato específico.

### Endpoint para Gerenciamento de Sessões

#### Endpoint

~~~http
POST {{baseUrl}}/dify/changeStatus/{{instance}}
~~~

#### Corpo da Requisição

Aqui está um exemplo de como gerenciar o status da sessão:

~~~json
{
    "remoteJid": "5511912345678@s.whatsapp.net",
    "status": "closed"
}
~~~

### Explicação dos Parâmetros

- **`remoteJid`**: JID (identificador) do contato no WhatsApp.
- **`status`**: Status da sessão (`opened`, `paused`, `closed`).

## 4. Variáveis Automáticas e Especiais no Dify

Quando uma sessão do Dify é iniciada, algumas variáveis predefinidas são automaticamente enviadas:

~~~json
inputs: {
    remoteJid: "JID do contato",
    pushName: "Nome do contato",
    instanceName: "Nome da instância",
    serverUrl: "URL do servidor da API",
    apiKey: "Chave de API da Evolution"
};
~~~

### Explicação das Variáveis Automáticas

- **`remoteJid`**: JID do contato com quem o bot está interagindo.
- **`pushName`**: Nome do contato no WhatsApp.
- **`instanceName`**: Nome da instância que está executando o bot.
- **`serverUrl`**: URL do servidor onde a Evolution API está hospedada.
- **`apiKey`**: Chave de API usada para autenticar as requisições.

### Variáveis Especiais para Workflows

No caso de bots do tipo **workflow**, a mensagem recebida é enviada na variável `query` dentro dos inputs. Isso permite que o workflow processe a mensagem diretamente com base no conteúdo da variável `query`.

### Exemplo de Variáveis para Workflow

~~~json
inputs: {
    remoteJid: "JID do contato",
    pushName: "Nome do contato",
    instanceName: "Nome da instância",
    serverUrl: "URL do servidor da API",
    apiKey: "Chave de API da Evolution",
    query: "Conteúdo da mensagem recebida"
}
~~~

## Considerações Finais

A integração da Evolution API com o Dify oferece uma maneira robusta de automatizar interações no WhatsApp, utilizando diferentes tipos de bots para atender às necessidades específicas do seu negócio. Com a capacidade de configurar triggers, gerenciar sessões e utilizar variáveis automáticas, você pode otimizar o fluxo de trabalho e melhorar a experiência do usuário final.
```

# v2\pt\integrations\evoai.mdx

```mdx
---
title: EvoAI
icon: robot
description: https://github.com/EvolutionAPI/evo-ai/
---

A Evolution API permite a criação e gerenciamento de bots usando a tecnologia EvoAI, fornecendo automação avançada e interatividade através de diferentes tipos de bots. A EvoAI é nossa própria tecnologia desenvolvida pela equipe da Evolution. Você pode saber mais em [evo-ai.co](https://evo-ai.co). Abaixo, você encontrará instruções detalhadas sobre como configurar bots, gerenciar sessões e definir configurações padrão.

## 1. Criando Bots no EvoAI

Você pode configurar vários bots no EvoAI usando gatilhos para iniciar interações. A configuração do bot pode ser feita através do endpoint `/evoai/create/{{instance}}`.

### Endpoint para Criação de Bot

#### Endpoint

~~~http
POST {{baseUrl}}/evoai/create/{{instance}}
~~~

#### Corpo da Requisição

Aqui está um exemplo de um corpo JSON para configurar um bot no EvoAI:

~~~json
{
    "enabled": true,
    "agentUrl": "http://evoai.site.com/v1",
    "apiKey": "app-123456",
    // opções
    "triggerType": "keyword", /* all ou keyword */
    "triggerOperator": "equals", /* contains, equals, startsWith, endsWith, regex, none */
    "triggerValue": "test",
    "expire": 0,
    "keywordFinish": "#SAIR",
    "delayMessage": 1000,
    "unknownMessage": "Mensagem não reconhecida",
    "listeningFromMe": false,
    "stopBotFromMe": false,
    "keepOpen": false,
    "debounceTime": 0,
    "ignoreJids": []
}
~~~

### Explicação dos Parâmetros

- **`enabled`**: Ativa (`true`) ou desativa (`false`) o bot.
- **`agentUrl`**: URL da API EvoAI (sem uma barra `/` no final).
- **`apiKey`**: Chave de API fornecida pelo EvoAI.
- **Opções**:
  - **`triggerType`**: Tipo de gatilho para iniciar o bot (`all` ou `keyword`).
  - **`triggerOperator`**: Operador usado para avaliar o gatilho (`contains`, `equals`, `startsWith`, `endsWith`, `regex`, `none`).
  - **`triggerValue`**: Valor usado no gatilho (por exemplo, uma palavra-chave ou regex).
  - **`expire`**: Tempo em minutos após o qual o bot expira, reiniciando se a sessão expirou.
  - **`keywordFinish`**: Palavra-chave que encerra a sessão do bot.
  - **`delayMessage`**: Atraso (em milissegundos) para simular digitação antes de enviar uma mensagem.
  - **`unknownMessage`**: Mensagem enviada quando a entrada do usuário não é reconhecida.
  - **`listeningFromMe`**: Define se o bot deve ouvir mensagens enviadas pelo usuário (`true` ou `false`).
  - **`stopBotFromMe`**: Define se o bot deve parar quando o usuário enviar uma mensagem (`true` ou `false`).
  - **`keepOpen`**: Mantém a sessão aberta, impedindo que o bot reinicie para o mesmo contato.
  - **`debounceTime`**: Tempo (em segundos) para combinar várias mensagens em uma.
  - **`ignoreJids`**: Lista de JIDs de contatos que não ativarão o bot.

## 2. Configurações Padrão do EvoAI

Você pode definir configurações padrão que serão aplicadas se os parâmetros não forem passados durante a criação do bot.

### Endpoint para Configurações Padrão

#### Endpoint

~~~http
POST {{baseUrl}}/evoai/settings/{{instance}}
~~~

#### Corpo da Requisição

Aqui está um exemplo de configurações padrão:

~~~json
{
    "expire": 20,
    "keywordFinish": "#SAIR",
    "delayMessage": 1000,
    "unknownMessage": "Mensagem não reconhecida",
    "listeningFromMe": false,
    "stopBotFromMe": false,
    "keepOpen": false,
    "debounceTime": 0,
    "ignoreJids": [],
    "evoaiIdFallback": "clyja4oys0a3uqpy7k3bd7swe"
}
~~~

### Explicação dos Parâmetros

- **`expire`**: Tempo em minutos após o qual o bot expira.
- **`keywordFinish`**: Palavra-chave que encerra a sessão do bot.
- **`delayMessage`**: Atraso para simular digitação antes de enviar uma mensagem.
- **`unknownMessage`**: Mensagem enviada quando a entrada do usuário não é reconhecida.
- **`listeningFromMe`**: Define se o bot deve ouvir mensagens enviadas pelo usuário.
- **`stopBotFromMe`**: Define se o bot deve parar quando o usuário enviar uma mensagem.
- **`keepOpen`**: Mantém a sessão aberta, impedindo que o bot reinicie para o mesmo contato.
- **`debounceTime`**: Tempo para combinar várias mensagens em uma.
- **`ignoreJids`**: Lista de JIDs de contatos que não ativarão o bot.
- **`evoaiIdFallback`**: ID do bot de fallback que será usado se nenhum gatilho for ativado.

## 3. Gerenciando Sessões do EvoAI

Você pode gerenciar as sessões do bot alterando o status entre aberto, pausado ou fechado para cada contato específico.

### Endpoint para Gerenciamento de Sessão

#### Endpoint

~~~http
POST {{baseUrl}}/evoai/changeStatus/{{instance}}
~~~

#### Corpo da Requisição

Aqui está um exemplo de como gerenciar o status da sessão:

~~~json
{
    "remoteJid": "5511912345678@s.whatsapp.net",
    "status": "closed"
}
~~~

### Explicação dos Parâmetros

- **`remoteJid`**: JID (identificador) do contato no WhatsApp.
- **`status`**: Status da sessão (`opened`, `paused`, `closed`).

## 4. Variáveis Automáticas no EvoAI

Quando uma sessão do EvoAI é iniciada, algumas variáveis predefinidas são enviadas automaticamente:

~~~json
inputs: {
    remoteJid: "JID do contato",
    pushName: "Nome do contato",
    instanceName: "Nome da instância",
    serverUrl: "URL do servidor API",
    apiKey: "Chave da API Evolution"
};
~~~

### Explicação das Variáveis Automáticas

- **`remoteJid`**: JID do contato com o qual o bot está interagindo.
- **`pushName`**: Nome do contato no WhatsApp.
- **`instanceName`**: Nome da instância que está executando o bot.
- **`serverUrl`**: URL do servidor onde a Evolution API está hospedada.
- **`apiKey`**: Chave de API usada para autenticar solicitações.

## Considerações Finais

A integração da Evolution API com o EvoAI oferece uma maneira robusta de automatizar interações no WhatsApp. Com a capacidade de configurar gatilhos, gerenciar sessões e usar variáveis automáticas, você pode otimizar o fluxo de trabalho e melhorar a experiência do usuário final.
```

# v2\pt\integrations\evolution-bot.mdx

```mdx
---
title: Evolution Bot
icon: robot
---

O **Evolution Bot** é uma integração de chatbot universal que permite a utilização de qualquer URL de API ou automação para criar interações automatizadas. Ao utilizar o Evolution Bot, sua API deve retornar a resposta na forma de um JSON contendo o campo `message`, que será enviado de volta ao usuário. Este sistema oferece flexibilidade para construir chatbots que se integram perfeitamente com suas APIs personalizadas.

## 1. Criação de Bots no Evolution Bot

Você pode configurar bots no Evolution Bot utilizando triggers para iniciar as interações. A configuração do bot pode ser feita através do endpoint `/evolutionBot/create/{{instance}}`.

### Endpoint para Criação de Bots

#### Endpoint

~~~http
POST {{baseUrl}}/evolutionBot/create/{{instance}}
~~~

#### Corpo da Requisição

Aqui está um exemplo de corpo JSON para configurar um bot no Evolution Bot:

~~~json
{
    "enabled": true,
    "apiUrl": "http://api.site.com/v1",
    "apiKey": "app-123456", // optional
    // opções
    "triggerType": "keyword", /* all ou keyword */
    "triggerOperator": "equals", /* contains, equals, startsWith, endsWith, regex, none */
    "triggerValue": "teste",
    "expire": 0,
    "keywordFinish": "#SAIR",
    "delayMessage": 1000,
    "unknownMessage": "Mensagem não reconhecida",
    "listeningFromMe": false,
    "stopBotFromMe": false,
    "keepOpen": false,
    "debounceTime": 0,
    "ignoreJids": []
}
~~~

### Explicação dos Parâmetros

- **`enabled`**: Ativa (`true`) ou desativa (`false`) o bot.
- **`apiUrl`**: URL da API que será chamada pelo bot (sem a `/` no final).
- **`apiKey`**: Chave da API fornecida pela sua aplicação (opcional).
- **Opções**:
  - **`triggerType`**: Tipo de trigger para iniciar o bot (`all` ou `keyword`).
  - **`triggerOperator`**: Operador utilizado para avaliar o trigger (`contains`, `equals`, `startsWith`, `endsWith`, `regex`, `none`).
  - **`triggerValue`**: Valor utilizado no trigger (por exemplo, uma palavra-chave ou regex).
  - **`expire`**: Tempo em minutos após o qual o bot expira, reiniciando se a sessão expirou.
  - **`keywordFinish`**: Palavra-chave que encerra a sessão do bot.
  - **`delayMessage`**: Delay (em milissegundos) para simular a digitação antes de enviar uma mensagem.
  - **`unknownMessage`**: Mensagem enviada quando a entrada do usuário não é reconhecida.
  - **`listeningFromMe`**: Define se o bot deve escutar as mensagens enviadas pelo próprio usuário (`true` ou `false`).
  - **`stopBotFromMe`**: Define se o bot deve parar quando o próprio usuário envia uma mensagem (`true` ou `false`).
  - **`keepOpen`**: Mantém a sessão aberta, evitando que o bot seja reiniciado para o mesmo contato.
  - **`debounceTime`**: Tempo (em segundos) para juntar várias mensagens em uma só.
  - **`ignoreJids`**: Lista de JIDs de contatos que não ativarão o bot.

### Exemplo de Retorno da API

A resposta da sua API deve estar no formato JSON e conter a mensagem a ser enviada ao usuário no campo `message`:

~~~json
{
    "message": "Sua resposta aqui"
}
~~~

## 2. Configurações Padrão do Evolution Bot

Você pode definir configurações padrão que serão aplicadas caso os parâmetros não sejam passados durante a criação do bot.

### Endpoint para Configurações Padrão

#### Endpoint

~~~http
POST {{baseUrl}}/evolutionBot/settings/{{instance}}
~~~

#### Corpo da Requisição

Aqui está um exemplo de configuração padrão:

~~~json
{
    "expire": 20,
    "keywordFinish": "#SAIR",
    "delayMessage": 1000,
    "unknownMessage": "Mensagem não reconhecida",
    "listeningFromMe": false,
    "stopBotFromMe": false,
    "keepOpen": false,
    "debounceTime": 0,
    "ignoreJids": [],
    "evolutionBotIdFallback": "clyja4oys0a3uqpy7k3bd7swe"
}
~~~

### Explicação dos Parâmetros

- **`expire`**: Tempo em minutos após o qual o bot expira.
- **`keywordFinish`**: Palavra-chave que encerra a sessão do bot.
- **`delayMessage`**: Delay para simular a digitação antes de enviar uma mensagem.
- **`unknownMessage`**: Mensagem enviada quando a entrada do usuário não é reconhecida.
- **`listeningFromMe`**: Define se o bot deve escutar as mensagens enviadas pelo próprio usuário.
- **`stopBotFromMe`**: Define se o bot deve parar quando o próprio usuário envia uma mensagem.
- **`keepOpen`**: Mantém a sessão aberta, evitando que o bot seja reiniciado para o mesmo contato.
- **`debounceTime`**: Tempo para juntar várias mensagens em uma só.
- **`ignoreJids`**: Lista de JIDs de contatos que não ativarão o bot.
- **`evolutionBotIdFallback`**: ID do bot de fallback que será utilizado caso nenhum trigger seja ativado.

## 3. Gerenciamento de Sessões do Evolution Bot

Você pode gerenciar as sessões do bot, alterando o status entre aberta, pausada ou fechada para cada contato específico.

### Endpoint para Gerenciamento de Sessões

#### Endpoint

~~~http
POST {{baseUrl}}/evolutionBot/changeStatus/{{instance}}
~~~

#### Corpo da Requisição

Aqui está um exemplo de como gerenciar o status da sessão:

~~~json
{
    "remoteJid": "5511912345678@s.whatsapp.net",
    "status": "closed"
}
~~~

### Explicação dos Parâmetros

- **`remoteJid`**: JID (identificador) do contato no WhatsApp.
- **`status`**: Status da sessão (`opened`, `paused`, `closed`).

## 4. Variáveis Automáticas e Especiais no Evolution Bot

Quando uma sessão do Evolution Bot é iniciada, algumas variáveis predefinidas são automaticamente enviadas:

~~~json
inputs: {
    remoteJid: "JID do contato",
    pushName: "Nome do contato",
    instanceName: "Nome da instância",
    serverUrl: "URL do servidor da API",
    apiKey: "Chave de API da Evolution"
};
~~~

### Explicação das Variáveis Automáticas

- **`remoteJid`**: JID do contato com quem o bot está interagindo.
- **`pushName`**: Nome do contato no WhatsApp.
- **`instanceName`**: Nome da instância que está executando o bot.
- **`serverUrl`**: URL do servidor onde a Evolution API está hospedada.
- **`apiKey`**: Chave de API usada para autenticar as requisições.

### Considerações Finais

O Evolution Bot oferece uma plataforma flexível para integração de chatbots com suas APIs personalizadas, permitindo automação avançada e interações personalizadas no WhatsApp. Com o suporte para triggers, gerenciamento de sessões e configuração de variáveis automáticas, você pode construir uma experiência de chatbot robusta e eficaz para seus usuários.
```

# v2\pt\integrations\evolution-channel.mdx

```mdx
---
title: Canal Evolution
icon: messages
---

O **Evolution Channel** é um canal universal de integração que permite a entrada de mensagens através de webhooks, proporcionando flexibilidade para conectar diversos sistemas e aplicativos com a Evolution API. Este canal facilita a automação e o gerenciamento de mensagens, suportando diversas integrações e fluxos de trabalho.

---

## 1. Configuração da Instância Evolution

Para configurar uma instância no Evolution Channel, você precisará acessar a rota `/instance/create` da Evolution API com o seguinte corpo de requisição:

### Criação da Instância

**Endpoint**
\`\`\`http
POST {{baseUrl}}/instance/create
\`\`\`

**Corpo da Requisição**

Aqui está um exemplo de como criar uma instância no Evolution Channel:
\`\`\`json
{
    "instanceName": "NOME DA INSTANCIA",
    "token": "TOKEN DA INSTANCIA (OPCIONAL)",
    "number": "NUMBER ID DA INSTANCIA",
    "qrcode": false,
    "integration": "EVOLUTION"
}
\`\`\`

### Parâmetros do Corpo da Requisição

- **`instanceName`**: Nome da instância que você está criando.
- **`token`**: Token opcional para autenticar a instância.
- **`number`**: Number ID da instância que será utilizado para receber e enviar mensagens.
- **`qrcode`**: Defina como `false` pois a integração não requer QR Code.
- **`integration`**: Use `"EVOLUTION"` para especificar que esta integração é com o canal universal Evolution.

**Exemplo de Requisição**
\`\`\`bash
curl -X POST http://API_URL/instance/create \
-H "Content-Type: application/json" \
-d '{
    "instanceName": "MinhaInstancia",
    "token": "123456",
    "number": "9876543210",
    "qrcode": false,
    "integration": "EVOLUTION"
}'
\`\`\`

---

## 2. Entrada de Mensagens no Evolution Channel

Após a criação da instância, o Evolution Channel receberá as mensagens enviadas para a instância configurada. Essas mensagens são enviadas para a rota `{baseUrl}/webhook/evolution` como requisições POST. Este é o ponto de entrada para as mensagens que o Evolution Channel irá processar.

**URL do Webhook para Entrada de Mensagens**
\`\`\`http
POST {{baseUrl}}/webhook/evolution
\`\`\`

### Exemplo de Payload de Entrada de Mensagem

Aqui está um exemplo do formato de payload enviado para o Evolution Channel quando uma mensagem é recebida:

\`\`\`json
{
    "numberId": "1234567", 
    "key": {
        "remoteJid": "557499879409",
        "fromMe": false,
        "id": "ABC1234"
    },
    "pushName": "Davidson",
    "message": {
        "conversation": "Qual o seu nome?"
    },
    "messageType": "conversation"
}
\`\`\`

### Explicação dos Campos do Payload

- **`numberId`**: ID do número cadastrado na criação da instância.
- **`key.remoteJid`**: Número ou ID único do contato que enviou a mensagem.
- **`key.fromMe`**: Indica se a mensagem foi enviada pelo contato (`false`) ou pelo próprio sistema (`true`).
- **`key.id`**: ID único da mensagem.
- **`pushName`**: Nome do contato que enviou a mensagem.
- **`message.conversation`**: Conteúdo da mensagem recebida.
- **`messageType`**: Tipo da mensagem (neste caso, `conversation`).

---

## 3. Feedback e Postbacks

O Evolution Channel envia feedback e postbacks através dos canais de eventos configurados, como webhooks, RabbitMQ, ou SQS. Isso permite que você receba notificações em tempo real sobre o status das mensagens e interações, mantendo seu sistema atualizado.

**Exemplos de Canais de Eventos**
- **Webhook**: Notificações são enviadas para um endpoint HTTP especificado.
- **RabbitMQ**: Mensagens são enviadas para uma fila RabbitMQ configurada.
- **SQS**: Mensagens são enviadas para uma fila SQS da AWS.

**Configuração de Canais de Eventos**
Para configurar os canais de eventos, defina os parâmetros necessários no seu arquivo de configuração ou diretamente na instância, conforme as especificações da Evolution API.

---

## Conclusão

Com a instância criada e a configuração do webhook de entrada de mensagens, a sua Evolution API está pronta para operar com o Evolution Channel. Todas as mensagens recebidas e os eventos associados serão gerenciados de forma centralizada, permitindo uma integração fluida e eficiente com seus sistemas de mensagens e automação.

Esta documentação fornece uma visão clara e detalhada de como integrar o Evolution Channel com a Evolution API, desde a criação da instância até a configuração dos webhooks e canais de eventos. Seguindo estas etapas, você estará preparado para utilizar o canal universal Evolution em sua aplicação.
```

# v2\pt\integrations\flowise.mdx

```mdx
---
title: Flowise
icon: robot
---

A Evolution API permite a criação e gerenciamento de bots utilizando a tecnologia Flowise, proporcionando automação e interatividade avançada através de diferentes tipos de interações. A seguir, você encontrará as instruções detalhadas sobre como configurar bots, gerenciar sessões e definir configurações padrão.

## 1. Criação de Bots no Flowise

Você pode configurar diversos bots no Flowise utilizando triggers para iniciar as interações. A configuração do bot pode ser feita através do endpoint `/flowise/create/{{instance}}`.

### Endpoint para Criação de Bots

#### Endpoint

~~~http
POST {{baseUrl}}/flowise/create/{{instance}}
~~~

#### Corpo da Requisição

Aqui está um exemplo de corpo JSON para configurar um bot no Flowise:

~~~json
{
    "enabled": true,
    "apiUrl": "http://flowise.site.com/v1",
    "apiKey": "app-123456", // optional
    // opções
    "triggerType": "keyword", /* all ou keyword */
    "triggerOperator": "equals", /* contains, equals, startsWith, endsWith, regex, none */
    "triggerValue": "teste",
    "expire": 0,
    "keywordFinish": "#SAIR",
    "delayMessage": 1000,
    "unknownMessage": "Mensagem não reconhecida",
    "listeningFromMe": false,
    "stopBotFromMe": false,
    "keepOpen": false,
    "debounceTime": 0,
    "ignoreJids": []
}
~~~

### Explicação dos Parâmetros

- **`enabled`**: Ativa (`true`) ou desativa (`false`) o bot.
- **`apiUrl`**: URL da API do Flowise (sem a `/` no final).
- **`apiKey`**: Chave da API fornecida pelo Flowise (opcional).
- **Opções**:
  - **`triggerType`**: Tipo de trigger para iniciar o bot (`all` ou `keyword`).
  - **`triggerOperator`**: Operador utilizado para avaliar o trigger (`contains`, `equals`, `startsWith`, `endsWith`, `regex`, `none`).
  - **`triggerValue`**: Valor utilizado no trigger (por exemplo, uma palavra-chave ou regex).
  - **`expire`**: Tempo em minutos após o qual o bot expira, reiniciando se a sessão expirou.
  - **`keywordFinish`**: Palavra-chave que encerra a sessão do bot.
  - **`delayMessage`**: Delay (em milissegundos) para simular a digitação antes de enviar uma mensagem.
  - **`unknownMessage`**: Mensagem enviada quando a entrada do usuário não é reconhecida.
  - **`listeningFromMe`**: Define se o bot deve escutar as mensagens enviadas pelo próprio usuário (`true` ou `false`).
  - **`stopBotFromMe`**: Define se o bot deve parar quando o próprio usuário envia uma mensagem (`true` ou `false`).
  - **`keepOpen`**: Mantém a sessão aberta, evitando que o bot seja reiniciado para o mesmo contato.
  - **`debounceTime`**: Tempo (em segundos) para juntar várias mensagens em uma só.
  - **`ignoreJids`**: Lista de JIDs de contatos que não ativarão o bot.

## 2. Configurações Padrão do Flowise

Você pode definir configurações padrão que serão aplicadas caso os parâmetros não sejam passados durante a criação do bot.

### Endpoint para Configurações Padrão

#### Endpoint

~~~http
POST {{baseUrl}}/flowise/settings/{{instance}}
~~~

#### Corpo da Requisição

Aqui está um exemplo de configuração padrão:

~~~json
{
    "expire": 20,
    "keywordFinish": "#SAIR",
    "delayMessage": 1000,
    "unknownMessage": "Mensagem não reconhecida",
    "listeningFromMe": false,
    "stopBotFromMe": false,
    "keepOpen": false,
    "debounceTime": 0,
    "ignoreJids": [],
    "flowiseIdFallback": "clyja4oys0a3uqpy7k3bd7swe"
}
~~~

### Explicação dos Parâmetros

- **`expire`**: Tempo em minutos após o qual o bot expira.
- **`keywordFinish`**: Palavra-chave que encerra a sessão do bot.
- **`delayMessage`**: Delay para simular a digitação antes de enviar uma mensagem.
- **`unknownMessage`**: Mensagem enviada quando a entrada do usuário não é reconhecida.
- **`listeningFromMe`**: Define se o bot deve escutar as mensagens enviadas pelo próprio usuário.
- **`stopBotFromMe`**: Define se o bot deve parar quando o próprio usuário envia uma mensagem.
- **`keepOpen`**: Mantém a sessão aberta, evitando que o bot seja reiniciado para o mesmo contato.
- **`debounceTime`**: Tempo para juntar várias mensagens em uma só.
- **`ignoreJids`**: Lista de JIDs de contatos que não ativarão o bot.
- **`flowiseIdFallback`**: ID do bot de fallback que será utilizado caso nenhum trigger seja ativado.

## 3. Gerenciamento de Sessões do Flowise

Você pode gerenciar as sessões do bot, alterando o status entre aberta, pausada ou fechada para cada contato específico.

### Endpoint para Gerenciamento de Sessões

#### Endpoint

~~~http
POST {{baseUrl}}/flowise/changeStatus/{{instance}}
~~~

#### Corpo da Requisição

Aqui está um exemplo de como gerenciar o status da sessão:

~~~json
{
    "remoteJid": "5511912345678@s.whatsapp.net",
    "status": "closed"
}
~~~

### Explicação dos Parâmetros

- **`remoteJid`**: JID (identificador) do contato no WhatsApp.
- **`status`**: Status da sessão (`opened`, `paused`, `closed`).

## 4. Variáveis Automáticas e Especiais no Flowise

Quando uma sessão do Flowise é iniciada, algumas variáveis predefinidas são automaticamente enviadas:

~~~json
inputs: {
    remoteJid: "JID do contato",
    pushName: "Nome do contato",
    instanceName: "Nome da instância",
    serverUrl: "URL do servidor da API",
    apiKey: "Chave de API da Evolution"
};
~~~

### Explicação das Variáveis Automáticas

- **`remoteJid`**: JID do contato com quem o bot está interagindo.
- **`pushName`**: Nome do contato no WhatsApp.
- **`instanceName`**: Nome da instância que está executando o bot.
- **`serverUrl`**: URL do servidor onde a Evolution API está hospedada.
- **`apiKey`**: Chave de API usada para autenticar as requisições.

### Variáveis Especiais para Workflows

No caso de bots do tipo **workflow**, a mensagem recebida é enviada na variável `query` dentro dos inputs. Isso permite que o workflow processe a mensagem diretamente com base no conteúdo da variável `query`.

### Exemplo de Variáveis para Workflow

~~~json
inputs: {
    remoteJid: "JID do contato",
    pushName: "Nome do contato",
    instanceName: "Nome da instância",
    serverUrl: "URL do servidor da API",
    apiKey: "Chave de API da Evolution",
    query: "Conteúdo da mensagem recebida"
}
~~~

## Considerações Finais

A integração da Evolution API com o Flowise oferece uma maneira robusta de automatizar interações no WhatsApp, utilizando diferentes tipos de bots para atender às necessidades específicas do seu negócio. Com a capacidade de configurar triggers, gerenciar sessões e utilizar variáveis automáticas, você pode otimizar o fluxo de trabalho e melhorar a experiência do usuário final.
```

# v2\pt\integrations\openai.mdx

```mdx
---
title: OpenAI  
icon: robot
---

A Evolution API permite a criação e gerenciamento de bots utilizando a tecnologia OpenAI, permitindo interações automatizadas e personalizadas através de assistentes virtuais ou modelos de chat completions. A seguir, você encontrará instruções detalhadas sobre como configurar credenciais, criar bots, gerenciar sessões e definir configurações padrão, incluindo o uso de reconhecimento de fala (speech-to-text).

## 1. Criação de Credenciais do OpenAI

Antes de criar bots, é necessário configurar as credenciais da API do OpenAI. Isso é feito utilizando o endpoint `/openai/creds/{{instance}}`.

### Endpoint para Criação de Credenciais

#### Endpoint

~~~http
POST {{baseUrl}}/openai/creds/{{instance}}
~~~

#### Corpo da Requisição

Aqui está um exemplo de como cadastrar uma nova credencial do OpenAI:

~~~json
{
    "name": "apikey",
    "apiKey": "sk-proj-..."
}
~~~

### Explicação dos Parâmetros

- **`name`**: Nome identificador da credencial.
- **`apiKey`**: Chave da API fornecida pelo OpenAI.

## 2. Criação de Bots com OpenAI

Após configurar as credenciais, você pode criar vários bots que utilizam o sistema de triggers para iniciar as interações. Isso pode ser feito através do endpoint `/openai/create/{{instance}}`.

### Endpoint para Criação de Bots

#### Endpoint

~~~http
POST {{baseUrl}}/openai/create/{{instance}}
~~~

#### Corpo da Requisição

Aqui está um exemplo de como criar um bot utilizando OpenAI:

~~~json
{
    "enabled": true,
    "openaiCredsId": "clyrx36wj0001119ucjjzxik1",
    "botType": "assistant", 
    // para assistentes
    "assistantId": "asst_LRNyh6qC4qq8NTyPjHbcJjSp",
    "functionUrl": "https://n8n.site.com", 
    // para chat completion
    "model": "gpt-4",
    "systemMessages": [
        "You are a helpful assistant."
    ],
    "assistantMessages": [
        "\n\nHello there, how may I assist you today?"
    ],
    "userMessages": [
        "Hello!"
    ],
    "maxTokens": 300,
    // opções
    "triggerType": "keyword", 
    "triggerOperator": "equals", 
    "triggerValue": "teste",
    "expire": 20,
    "keywordFinish": "#SAIR",
    "delayMessage": 1000,
    "unknownMessage": "Mensagem não reconhecida",
    "listeningFromMe": false,
    "stopBotFromMe": false,
    "keepOpen": false,
    "debounceTime": 10,
    "ignoreJids": []
}
~~~

### Explicação dos Parâmetros

- **`enabled`**: Ativa (`true`) ou desativa (`false`) o bot.
- **`openaiCredsId`**: ID da credencial cadastrada anteriormente.
- **`botType`**: Tipo do bot (`assistant` ou `chatCompletion`).
  - **Para Assistentes (`assistant`)**:
    - **`assistantId`**: ID do assistente OpenAI.
    - **`functionUrl`**: URL que será chamada caso o assistente necessite realizar uma ação.
  - **Para Chat Completion (`chatCompletion`)**:
    - **`model`**: Modelo do OpenAI a ser utilizado (ex.: `gpt-4`).
    - **`systemMessages`**: Mensagens que configuram o comportamento do bot.
    - **`assistantMessages`**: Mensagens iniciais do bot.
    - **`userMessages`**: Mensagens de exemplo do usuário.
    - **`maxTokens`**: Número máximo de tokens utilizados na resposta.
- **Opções**:
  - **`triggerType`**: Tipo de trigger para iniciar o bot (`all` ou `keyword`).
  - **`triggerOperator`**: Operador utilizado para avaliar o trigger (`contains`, `equals`, `startsWith`, `endsWith`, `regex`, `none`).
  - **`triggerValue`**: Valor utilizado no trigger (por exemplo, uma palavra-chave ou regex).
  - **`expire`**: Tempo em minutos após o qual o bot expira, reiniciando se a sessão expirou.
  - **`keywordFinish`**: Palavra-chave que encerra a sessão do bot.
  - **`delayMessage`**: Delay (em milissegundos) para simular a digitação antes de enviar uma mensagem.
  - **`unknownMessage`**: Mensagem enviada quando a entrada do usuário não é reconhecida.
  - **`listeningFromMe`**: Define se o bot deve escutar as mensagens enviadas pelo próprio usuário (`true` ou `false`).
  - **`stopBotFromMe`**: Define se o bot deve parar quando o próprio usuário envia uma mensagem (`true` ou `false`).
  - **`keepOpen`**: Mantém a sessão aberta, evitando que o bot seja reiniciado para o mesmo contato.
  - **`debounceTime`**: Tempo (em segundos) para juntar várias mensagens em uma só.
  - **`ignoreJids`**: Lista de JIDs de contatos que não ativarão o bot.

## 3. Gerenciamento de Sessões do OpenAI

Você pode gerenciar as sessões do bot, alterando o status entre aberta, pausada ou fechada para cada contato específico.

### Endpoint para Gerenciamento de Sessões

#### Endpoint

~~~http
POST {{baseUrl}}/openai/changeStatus/{{instance}}
~~~

#### Corpo da Requisição

Aqui está um exemplo de como gerenciar o status da sessão:

~~~json
{
    "remoteJid": "5511912345678@s.whatsapp.net",
    "status": "closed"
}
~~~

### Explicação dos Parâmetros

- **`remoteJid`**: JID (identificador) do contato no WhatsApp.
- **`status`**: Status da sessão (`opened`, `paused`, `closed`).

## 4. Configurações Padrão do OpenAI

Você pode definir configurações padrão que serão aplicadas caso os parâmetros não sejam passados durante a criação do bot. Inclui também a opção de usar reconhecimento de fala (speech-to-text).

### Endpoint para Configurações Padrão

#### Endpoint

~~~http
POST {{baseUrl}}/openai/settings/{{instance}}
~~~

#### Corpo da Requisição

Aqui está um exemplo de configuração padrão:

~~~json
{
    "openaiCredsId": "clyja4oys0a3uqpy7k3bd7swe",
    "expire": 20,
    "keywordFinish": "#SAIR",
    "delayMessage": 1000,
    "unknownMessage": "Mensagem não reconhecida",
    "listeningFromMe": false,
    "stopBotFromMe": false,
    "keepOpen": false,
    "debounceTime": 0,
    "ignoreJids": [],
    "openaiIdFallback": "clyja4oys0a3uqpy7k3bd7swe",
    "speechToText": true
}
~~~

### Explicação dos Parâmetros

- **`openaiCredsId`**: ID da credencial do OpenAI a ser usada como padrão.
- **`expire`**: Tempo em minutos após o qual o bot expira.
- **`keywordFinish`**: Palavra-chave que encerra a sessão do bot.
- **`delayMessage`**: Delay para simular a digitação antes de enviar uma mensagem.
- **`unknownMessage`**: Mensagem enviada quando a entrada do usuário não é reconhecida.
- **`listeningFromMe`**: Define se o bot deve escutar as mensagens enviadas pelo próprio usuário.
- **`stopBotFromMe`**: Define se o bot deve parar quando o próprio usuário envia uma mensagem.
- **`keepOpen`**: Mantém a sessão aberta, evitando que o bot seja reiniciado para o mesmo contato.
- **`debounceTime`**: Tempo para juntar várias mensagens em uma só.
- **`ignoreJids`**: Lista de JIDs de contatos que não ativarão o bot.
- **`openaiIdFallback`**: ID do bot de fallback que será utilizado caso nenhum trigger seja ativado.
- **`speechToText`**: Define se a funcionalidade de reconhecimento de fala (speech-to-text) deve ser ativada usando a credencial definida por padrão.

### Webhook com `speechToText`

Quando o parâmetro `speechToText` está ativado, a Evolution API converte automaticamente os áudios recebidos em texto utilizando a credencial do OpenAI. A transcrição do áudio é então incluída no webhook enviado pela API.

#### Exemplo de Webhook com `speechToText`

~~~json
{
    "event": "message",
    "data": {
        "message": {
            "id": "message-id",
            "from": "sender-number",
            "to": "receiver-number",
            "content": "Text message",
            "speech

ToText": "This is the transcribed text from the audio."
        }
    }
}
~~~

## Considerações Finais

A integração da Evolution API com o OpenAI oferece uma maneira poderosa de automatizar interações no WhatsApp, utilizando a inteligência artificial para fornecer respostas dinâmicas e personalizadas. Com as configurações corretas, você pode criar assistentes virtuais altamente eficientes, gerenciar sessões e definir configurações padrão, incluindo o uso de reconhecimento de fala para converter áudios em texto automaticamente.
```

# v2\pt\integrations\rabbitmq.mdx

```mdx
---
title: RabbitMQ
icon: rabbit
---

A Evolution API permite a integração com o **RabbitMQ** para gerenciar eventos e filas de mensagens, facilitando a comunicação e processamento de tarefas de forma eficiente e escalável. A seguir, você encontrará informações sobre como configurar o RabbitMQ tanto em modo global quanto em instâncias individuais.

## Configuração Global do RabbitMQ

Com a nova configuração global, é possível centralizar o processamento de eventos em filas unificadas, em vez de configurar filas separadas para cada instância. Isso simplifica a gestão de eventos, pois todos os eventos do sistema passam por filas específicas de acordo com o tipo de evento.

### Configuração de Variáveis de Ambiente

Aqui estão as variáveis de ambiente necessárias para habilitar e configurar o RabbitMQ em modo global:

\`\`\`plaintext
RABBITMQ_ENABLED=true
RABBITMQ_URI=amqp://admin:admin@localhost:5672/default
RABBITMQ_EXCHANGE_NAME=evolution_exchange
RABBITMQ_GLOBAL_ENABLED=true
\`\`\`

### Eventos Configuráveis

Com o modo global habilitado (`RABBITMQ_GLOBAL_ENABLED=true`), todos os eventos são enfileirados em filas específicas por tipo de evento, em vez de por instância. Aqui está a lista de eventos que você pode ativar globalmente:

\`\`\`plaintext
RABBITMQ_EVENTS_APPLICATION_STARTUP=true
RABBITMQ_EVENTS_INSTANCE_CREATE=true
RABBITMQ_EVENTS_INSTANCE_DELETE=true
RABBITMQ_EVENTS_QRCODE_UPDATED=true
RABBITMQ_EVENTS_MESSAGES_SET=true
RABBITMQ_EVENTS_MESSAGES_UPSERT=true
RABBITMQ_EVENTS_MESSAGES_EDITED=true
RABBITMQ_EVENTS_MESSAGES_UPDATE=true
RABBITMQ_EVENTS_MESSAGES_DELETE=true
RABBITMQ_EVENTS_SEND_MESSAGE=true
RABBITMQ_EVENTS_CONTACTS_SET=true
RABBITMQ_EVENTS_CONTACTS_UPSERT=true
RABBITMQ_EVENTS_CONTACTS_UPDATE=true
RABBITMQ_EVENTS_PRESENCE_UPDATE=true
RABBITMQ_EVENTS_CHATS_SET=true
RABBITMQ_EVENTS_CHATS_UPSERT=true
RABBITMQ_EVENTS_CHATS_UPDATE=true
RABBITMQ_EVENTS_CHATS_DELETE=true
RABBITMQ_EVENTS_GROUPS_UPSERT=true
RABBITMQ_EVENTS_GROUP_UPDATE=true
RABBITMQ_EVENTS_GROUP_PARTICIPANTS_UPDATE=true
RABBITMQ_EVENTS_CONNECTION_UPDATE=true
RABBITMQ_EVENTS_CALL=true
RABBITMQ_EVENTS_TYPEBOT_START=true
RABBITMQ_EVENTS_TYPEBOT_CHANGE_STATUS=true
\`\`\`

### Funcionamento

- **Fila por Evento**: No modo global, os eventos são enfileirados em filas específicas para cada tipo de evento. Por exemplo, todos os eventos de atualização de mensagens (`MESSAGES_UPDATE`) serão enfileirados na mesma fila, independentemente da instância de origem.
- **Facilidade de Gerenciamento**: Essa abordagem facilita o gerenciamento e monitoramento dos eventos, permitindo uma centralização das operações e simplificando a lógica de consumo de mensagens no seu sistema.

## Configuração do RabbitMQ para Instâncias Individuais

Embora a configuração global seja recomendada para centralizar o processamento de eventos, ainda é possível configurar o RabbitMQ para instâncias individuais, caso haja necessidade de segmentação por instância.

### Endpoint para Configuração Individual

Para configurar o RabbitMQ para uma instância específica do WhatsApp na Evolution API, utilize o seguinte endpoint:

~~~ http
POST [baseUrl]/rabbitmq/set/[instance_name]
~~~

### Corpo da Requisição

Aqui está um exemplo do corpo JSON para configurar eventos em uma instância específica:

~~~ json
{
    "enabled": true,
    "events": [
        "APPLICATION_STARTUP",
        "QRCODE_UPDATED",
        "MESSAGES_SET",
        "MESSAGES_UPSERT",
        "MESSAGES_UPDATE",
        "MESSAGES_DELETE",
        "SEND_MESSAGE",
        "CONTACTS_SET",
        "CONTACTS_UPSERT",
        "CONTACTS_UPDATE",
        "PRESENCE_UPDATE",
        "CHATS_SET",
        "CHATS_UPSERT",
        "CHATS_UPDATE",
        "CHATS_DELETE",
        "GROUPS_UPSERT",
        "GROUP_UPDATE",
        "GROUP_PARTICIPANTS_UPDATE",
        "CONNECTION_UPDATE",
        "CALL",
        "NEW_JWT_TOKEN"
    ]
}
~~~

<Note>  
Remova eventos não utilizados para otimizar o uso de recursos do RabbitMQ.
</Note>

Ao configurar a integração com o RabbitMQ para instâncias individuais, ajuste o array de eventos no corpo JSON para incluir apenas os eventos relevantes para aquela instância.

## Considerações Finais

A configuração do RabbitMQ na Evolution API oferece flexibilidade para gerenciar eventos de forma centralizada com a configuração global, ou de forma segmentada por instância, dependendo das necessidades do seu sistema. Utilize a configuração global para simplificar a gestão de eventos em ambientes complexos, ou configure individualmente para controle mais granular.

<Info>  
Para mais detalhes sobre as variáveis de ambiente do RabbitMQ e outras configurações avançadas, consulte a [seção de variáveis de ambiente](/v2/pt/env#rabbitmq).
</Info>

```

# v2\pt\integrations\s3minio.mdx

```mdx
---
title: S3/Minio  
icon: cloud  
---

A Evolution API suporta a integração com Amazon S3 ou Minio para armazenar arquivos de mídia do WhatsApp, como imagens, áudios e documentos. Essa integração permite que os arquivos sejam armazenados de forma segura e acessível, com links gerados automaticamente e incluídos nos webhooks enviados pela API.

## Configuração de Variáveis de Ambiente

Para habilitar o armazenamento S3 ou Minio, você deve definir as variáveis de ambiente adequadas no arquivo `.env` da Evolution API. Abaixo estão as variáveis necessárias e suas funções:

### Variáveis de Configuração para S3

\`\`\`plaintext
S3_ENABLED=true
S3_ACCESS_KEY=lJiKQSKlco6UfSUJSnZt
S3_SECRET_KEY=gZXkzkXQwhME8XEmZVNF0ImSWxIpbXeJ5UoPy4s1
S3_BUCKET=evolution
S3_PORT=443
S3_ENDPOINT=s3.eu-west-3.amazonaws.com
S3_USE_SSL=true
S3_REGION=eu-west-3
\`\`\`

### Explicação das Variáveis

- **`S3_ENABLED`**: Ativa (`true`) ou desativa (`false`) o uso do S3 ou Minio para armazenamento de arquivos.
- **`S3_ACCESS_KEY`**: Chave de acesso fornecida pelo provedor do serviço (AWS ou Minio).
- **`S3_SECRET_KEY`**: Chave secreta correspondente à chave de acesso, usada para autenticação.
- **`S3_BUCKET`**: Nome do bucket onde os arquivos serão armazenados.
- **`S3_PORT`**: Porta utilizada para a conexão. Normalmente `443` para conexões SSL.
- **`S3_ENDPOINT`**: Endpoint do serviço S3 ou Minio. Para Amazon S3, é necessário incluir a região no formato `region: s3.[region].amazonaws.com`, por exemplo, `s3.eu-west-3.amazonaws.com`.
- **`S3_USE_SSL`**: Define se a conexão deve usar SSL (`true` ou `false`).
- **`S3_REGION`**: A região do bucket S3 (padrão é `us-east-1`).

### Exemplos de Configuração

#### Amazon S3

Ao utilizar o Amazon S3, é essencial especificar o endpoint corretamente, incluindo a região. Aqui está um exemplo:

\`\`\`plaintext
S3_ENABLED=true
S3_ACCESS_KEY=your-aws-access-key
S3_SECRET_KEY=your-aws-secret-key
S3_BUCKET=my-s3-bucket
S3_PORT=443
S3_ENDPOINT=s3.eu-west-3.amazonaws.com
S3_USE_SSL=true
S3_REGION=eu-west-3
\`\`\`

#### Minio

Para Minio, o endpoint pode ser o domínio personalizado do serviço:

\`\`\`plaintext
S3_ENABLED=true
S3_ACCESS_KEY=your-minio-access-key
S3_SECRET_KEY=your-minio-secret-key
S3_BUCKET=my-minio-bucket
S3_PORT=443
S3_ENDPOINT=minio.mycompany.com
S3_USE_SSL=true
\`\`\`

## Como Funciona o Armazenamento de Mídia

Quando o armazenamento S3 ou Minio é configurado corretamente, todos os arquivos de mídia recebidos do WhatsApp (como imagens, vídeos, áudios, etc.) são automaticamente enviados para o bucket configurado. A URL pública do arquivo armazenado é então gerada e incluída no webhook da Evolution API.

### Webhook com `mediaUrl`

Quando um arquivo de mídia é recebido e armazenado, o webhook enviado pela Evolution API incluirá o `mediaUrl` no corpo da mensagem. Isso permite que sua aplicação acesse diretamente o arquivo armazenado no S3 ou Minio.

### Exemplo de Webhook

Aqui está um exemplo de como o webhook com `mediaUrl` pode aparecer:

~~~json
{
    "event": "messages.upsert",
    "data": {
        "message": {
            ...
            "mediaUrl": "https://files.evolution-api-pro.com/bucket/path/to/media/file.jpg",
            ...
        }
    }
}
~~~

## Considerações Finais

Integrar a Evolution API com Amazon S3 ou Minio para o armazenamento de arquivos de mídia oferece uma solução escalável e segura para gerenciar conteúdos de mídia do WhatsApp. Ao configurar as variáveis de ambiente corretamente, você garante que todos os arquivos de mídia sejam armazenados e acessíveis conforme necessário, proporcionando maior controle sobre os dados e a capacidade de integrá-los facilmente em suas aplicações.

<Info>  
Para mais detalhes sobre as variáveis de ambiente e outras configurações avançadas, consulte a [seção de variáveis de ambiente](/v2/pt/env#s3).
</Info>
```

# v2\pt\integrations\sqs.mdx

```mdx
---
title: Amazon SQS
icon: aws
---

A Evolution API permite a integração com o **Amazon SQS (Simple Queue Service)** para gerenciar eventos e filas de mensagens de forma escalável e confiável. Assim como no RabbitMQ, o SQS na Evolution API pode ser configurado tanto de maneira global quanto para instâncias individuais.

## Configuração Global do SQS

Para habilitar o SQS e configurar o processamento de eventos de forma centralizada, utilize as seguintes variáveis de ambiente:

### Configuração de Variáveis de Ambiente

\`\`\`plaintext
SQS_ENABLED=true
SQS_ACCESS_KEY_ID=your-access-key-id
SQS_SECRET_ACCESS_KEY=your-secret-access-key
SQS_ACCOUNT_ID=your-account-id
SQS_REGION=your-region
\`\`\`

### Explicação das Variáveis

- **`SQS_ENABLED`**: Ativa (`true`) ou desativa (`false`) a integração com o Amazon SQS.
- **`SQS_ACCESS_KEY_ID`**: Chave de acesso da AWS para autenticação.
- **`SQS_SECRET_ACCESS_KEY`**: Chave secreta correspondente à chave de acesso para autenticação.
- **`SQS_ACCOUNT_ID`**: ID da conta AWS onde o SQS está configurado.
- **`SQS_REGION`**: Região da AWS onde suas filas SQS estão localizadas (por exemplo, `us-east-1`).

### Funcionamento

- **Fila por Evento**: No modo global, todos os eventos são enfileirados em filas específicas para cada tipo de evento. Isso significa que eventos de diferentes instâncias são centralizados em filas unificadas por evento, simplificando o processamento e o monitoramento.

## Configuração do SQS para Instâncias Individuais

Embora a configuração global seja recomendada para centralizar o processamento de eventos, você pode configurar o SQS para instâncias individuais caso precise segmentar as filas por instância.

### Endpoint para Configuração Individual

Para configurar o SQS para uma instância específica do WhatsApp na Evolution API, utilize o seguinte endpoint:

~~~ http
POST [baseUrl]/sqs/set/[instance_name]
~~~

### Corpo da Requisição

Aqui está um exemplo do corpo JSON para configurar eventos em uma instância específica:

~~~ json
{
    "enabled": true,
    "events": [
        "APPLICATION_STARTUP",
        "QRCODE_UPDATED",
        "MESSAGES_SET",
        "MESSAGES_UPSERT",
        "MESSAGES_UPDATE",
        "MESSAGES_DELETE",
        "SEND_MESSAGE",
        "CONTACTS_SET",
        "CONTACTS_UPSERT",
        "CONTACTS_UPDATE",
        "PRESENCE_UPDATE",
        "CHATS_SET",
        "CHATS_UPSERT",
        "CHATS_UPDATE",
        "CHATS_DELETE",
        "GROUPS_UPSERT",
        "GROUP_UPDATE",
        "GROUP_PARTICIPANTS_UPDATE",
        "CONNECTION_UPDATE",
        "CALL",
        "NEW_JWT_TOKEN"
    ]
}
~~~

<Note>  
Remova eventos não utilizados para otimizar o uso de recursos do SQS.
</Note>

### Funcionamento

- **Segmentação por Instância**: Ao configurar o SQS para instâncias individuais, cada instância pode ter suas próprias filas específicas para os eventos configurados. Isso permite maior controle e segmentação dos eventos, caso você precise separar o processamento por instância.

## Considerações Finais

A integração com o Amazon SQS na Evolution API oferece uma solução poderosa para gerenciar eventos de forma escalável e confiável, tanto de maneira centralizada quanto segmentada por instância. Utilize a configuração global para simplificar o processamento em ambientes complexos, ou configure individualmente para um controle mais granular.

<Info>  
Para mais detalhes sobre as variáveis de ambiente e outras configurações avançadas, consulte a [seção de variáveis de ambiente](/v2/pt/env#sqs).
</Info>
```

# v2\pt\integrations\typebot.mdx

```mdx
---
title: Typebot
icon: robot
---

A Evolution API permite integrar bots do **Typebot** para automatizar interações e responder a mensagens do WhatsApp com base em triggers configurados. A seguir, você encontrará as instruções detalhadas sobre como configurar, gerenciar sessões, inicializar bots manualmente e utilizar variáveis predefinidas.

## 1. Configuração de Bots no Typebot

Você pode configurar diversos bots no Typebot utilizando triggers para iniciar as interações. A configuração do bot pode ser feita através do endpoint `/typebot/create/{{instance}}`.

### Endpoint para Configuração de Bots

#### Endpoint

~~~http
POST {{baseUrl}}/typebot/create/{{instance}}
~~~

#### Corpo da Requisição

Aqui está um exemplo de corpo JSON para configurar um bot:

~~~json
{
    "enabled": true,
    "url": "https://bot.dgcode.com.br",
    "typebot": "my-typebot-uoz1rg9",
    "triggerType": "keyword",
    "triggerOperator": "regex",
    "triggerValue": "^atend.*",
    "expire": 20,
    "keywordFinish": "#SAIR",
    "delayMessage": 1000,
    "unknownMessage": "Mensagem não reconhecida",
    "listeningFromMe": false,
    "stopBotFromMe": false,
    "keepOpen": false,
    "debounceTime": 10
}
~~~

### Explicação dos Parâmetros

- **`enabled`**: Ativa (`true`) ou desativa (`false`) o bot.
- **`url`**: URL da API do Typebot (sem a `/` no final).
- **`typebot`**: Nome público do bot no Typebot.
- **`triggerType`**: Tipo de trigger para iniciar o bot (`keyword`, `all`, `none`).
- **`triggerOperator`**: Operador utilizado para avaliar o trigger (`contains`, `equals`, `startsWith`, `endsWith`, `regex`).
- **`triggerValue`**: Valor utilizado no trigger (por exemplo, uma palavra-chave ou regex).
- **`expire`**: Tempo em minutos após o qual o bot expira, reiniciando se a sessão expirou.
- **`keywordFinish`**: Palavra-chave que, quando recebida, encerra a sessão do bot.
- **`delayMessage`**: Delay (em milissegundos) para simular a digitação antes de enviar uma mensagem.
- **`unknownMessage`**: Mensagem enviada quando a entrada do usuário não é reconhecida.
- **`listeningFromMe`**: Define se o bot deve escutar as mensagens enviadas pelo próprio usuário (`true` ou `false`).
- **`stopBotFromMe`**: Define se o bot deve parar quando o próprio usuário envia uma mensagem (`true` ou `false`).
- **`keepOpen`**: Mantém a sessão aberta, evitando que o bot seja reiniciado para o mesmo contato.
- **`debounceTime`**: Tempo (em segundos) para juntar várias mensagens em uma só.

## 2. Gerenciamento de Sessões do Typebot

Você pode gerenciar as sessões do Typebot para cada contato específico, alterando o status da sessão entre aberta, pausada ou fechada.

### Endpoint para Gerenciamento de Sessões

#### Endpoint

~~~http
POST {{baseUrl}}/typebot/changeStatus/{{instance}}
~~~

#### Corpo da Requisição

Aqui está um exemplo de como gerenciar o status da sessão:

~~~json
{
    "remoteJid": "5511912345678@s.whatsapp.net",
    "status": "closed"
}
~~~

### Explicação dos Parâmetros

- **`remoteJid`**: JID (identificador) do contato no WhatsApp.
- **`status`**: Status da sessão (`opened`, `paused`, `closed`).

## 3. Configuração Padrão do Typebot

Você pode definir configurações padrão que serão aplicadas caso os parâmetros não sejam passados durante a criação do bot.

### Configuração Padrão

Aqui está um exemplo de configuração padrão:

~~~json
{
    "expire": 20,
    "keywordFinish": "#SAIR",
    "delayMessage": 1000,
    "unknownMessage": "Mensagem não reconhecida",
    "listeningFromMe": false,
    "stopBotFromMe": false,
    "keepOpen": false,
    "debounceTime": 10,
    "ignoreJids": [],
    "typebotIdFallback": "clyja4oys0a3uqpy7k3bd7swe"
}
~~~

### Explicação dos Parâmetros

- **`expire`**: Tempo em minutos após o qual o bot expira.
- **`keywordFinish`**: Palavra-chave que encerra a sessão do bot.
- **`delayMessage`**: Delay para simular a digitação antes de enviar uma mensagem.
- **`unknownMessage`**: Mensagem enviada quando a entrada do usuário não é reconhecida.
- **`listeningFromMe`**: Define se o bot deve escutar as mensagens enviadas pelo próprio usuário.
- **`stopBotFromMe`**: Define se o bot deve parar quando o próprio usuário envia uma mensagem.
- **`keepOpen`**: Mantém a sessão aberta, evitando que o bot seja reiniciado para o mesmo contato.
- **`debounceTime`**: Tempo para juntar várias mensagens em uma só.
- **`ignoreJids`**: Lista de JIDs de contatos que não ativarão o bot.
- **`typebotIdFallback`**: ID do bot de fallback que será utilizado caso nenhum trigger seja ativado.

## 4. Inicialização Ativa de um Bot

Além de usar triggers, você pode inicializar um bot de forma ativa para um contato específico usando o endpoint `/typebot/start/{{instance}}`.

### Endpoint para Inicialização Ativa

#### Endpoint

~~~http
POST {{baseUrl}}/typebot/start/{{instance}}
~~~

#### Corpo da Requisição

Aqui está um exemplo de como iniciar um bot de forma ativa:

~~~json
{
    "url": "https://bot.dgcode.com.br",
    "typebot": "fluxo-unico-3uuso28",
    "remoteJid": "557499879409@s.whatsapp.net",
    "startSession": false,
    "variables": [
        {
            "name": "pushName",
            "value": "Davidson Gomes"
        }
    ]
}
~~~

### Explicação dos Parâmetros

- **`url`**: URL da API do Typebot (sem a `/` no final).
- **`typebot`**: Nome público do bot no Typebot.
- **`remoteJid`**: JID (identificador) do contato no WhatsApp.
- **`startSession`**: Define se a sessão deve ser iniciada com o bot (`true` ou `false`).
- **`variables`**: Variáveis personalizadas que podem ser passadas ao bot (por exemplo, nome do usuário).

### Variáveis Predefinidas

Quando uma sessão do Typebot é iniciada, algumas variáveis predefinidas são automaticamente enviadas:

~~~json
const prefilledVariables = {
    remoteJid: "JID do contato",
    pushName: "Nome do contato",
    instanceName: "Nome da instância",
    serverUrl: "URL do servidor da API",
    apiKey: "Chave de API da Evolution",
    ownerJid: "JID do número conectado à instância"
};
~~~

#### Explicação das Variáveis Predefinidas

- **`remoteJid`**: JID do contato com quem o bot está interagindo.
- **`pushName`**: Nome do contato no WhatsApp.
- **`instanceName`**: Nome da instância que está executando o bot.
- **`serverUrl`**: URL do servidor onde a Evolution API está hospedada.
- **`apiKey`**: Chave de API usada para autenticar as requisições.
- **`ownerJid`**: JID do número de telefone conectado à instância.

### Interação com Variáveis Passadas no `startTypebot`

Quando você utiliza o endpoint `startTypebot`, as variáveis passadas no corpo da requisição são combinadas com as variáveis predefinidas. Isso permite que você adicione ou sobrescreva informações específicas para personalizar ainda mais a interação do bot.

### Considerações Finais

A integração da Evolution API com o Typebot oferece uma maneira poderosa e flexível de automatizar interações no WhatsApp. Com variáveis predefinidas e a capacidade de iniciar bots de forma ativa, você pode personalizar a experiência do usuário final e otimizar o fluxo de atendimento.

```

# v2\pt\integrations\websocket.mdx

```mdx
---
title: WebSocket
icon: plug
---

A Evolution API utiliza o `socket.io` para emitir eventos em tempo real, aproveitando a tecnologia WebSocket. Isso torna o desenvolvimento de integrações mais eficiente e direto para os desenvolvedores. O WebSocket fornece um canal de comunicação full-duplex sobre uma única conexão duradoura, permitindo o fluxo de dados em tempo real entre o cliente e o servidor.

<Info>  
Para ativar os WebSockets, defina a variável de ambiente `WEBSOCKET_ENABLED` como `true`. Veja mais detalhes em [Variáveis de Ambiente](/v2/pt/env).
</Info>

## Modos de Operação do WebSocket

### Modo Global

No **modo global**, a variável de ambiente `WEBSOCKET_GLOBAL_EVENTS` deve ser definida como `true`. Nesse modo, o WebSocket é inicializado no start do serviço e envia eventos de todas as instâncias, independentemente dos canais. Isso significa que qualquer cliente conectado ao WebSocket receberá eventos globais, abrangendo todas as instâncias da Evolution API configuradas no sistema.

- **Ativação**: Configure no arquivo `.env`:

    \`\`\`plaintext
    WEBSOCKET_GLOBAL_EVENTS=true
    \`\`\`

- **Funcionamento**: Ideal para cenários onde você deseja monitorar ou processar eventos de todas as instâncias simultaneamente, sem precisar estabelecer uma conexão separada para cada instância.

- **Conexão**: No modo global, a conexão ao WebSocket **não** requer o uso do `/nome_instancia` na URL. A URL de conexão será simplesmente:

    \`\`\`plaintext
    wss://api.seusite.com
    \`\`\`

### Modo Tradicional

No **modo tradicional**, o WebSocket só pode ser conectado após a execução do comando `set` na instância. Isso permite que o WebSocket seja específico para cada instância, e a comunicação em tempo real é restrita àquela instância.

- **Ativação**: Certifique-se de que `WEBSOCKET_GLOBAL_EVENTS` esteja definido como `false` ou não esteja configurado, e siga o fluxo tradicional de configuração da instância.

- **Funcionamento**: Ideal para cenários onde você deseja uma comunicação em tempo real mais isolada, focada em uma única instância, permitindo maior controle e segmentação dos eventos.

- **Conexão**: No modo tradicional, a conexão ao WebSocket requer o uso do `/nome_instancia` na URL:

    \`\`\`plaintext
    wss://api.seusite.com/nome_instancia
    \`\`\`

## Conexão ao WebSocket

### Modo Global

No modo global, a URL de conexão é mais simples e não requer o nome da instância:

~~~plaintext
wss://api.seusite.com
~~~

### Modo Tradicional

No modo tradicional, utilize o seguinte formato de URL:

~~~plaintext
wss://api.seusite.com/nome_instancia
~~~

Substitua `api.seusite.com` pelo domínio real da sua API e `nome_instancia` pelo nome da sua instância específica.

### Exemplo de Estabelecimento de Conexão WebSocket

Aqui está um exemplo básico de como estabelecer uma conexão WebSocket usando JavaScript:

~~~javascript
const socket = io('wss://api.seusite.com/nome_instancia', {
  transports: ['websocket']
});

socket.on('connect', () => {
  console.log('Conectado ao WebSocket da Evolution API');
});

// Escutando eventos
socket.on('nome_evento', (data) => {
  console.log('Evento recebido:', data);
});

// Lidando com desconexão
socket.on('disconnect', () => {
  console.log('Desconectado do WebSocket da Evolution API');
});
~~~

Neste exemplo, substitua `nome_evento` pelo evento específico que você deseja escutar.

## Manipulação de Eventos

Uma vez conectado, você pode escutar vários eventos emitidos pelo servidor. Cada evento pode carregar dados relevantes para o contexto do evento. Por exemplo, se estiver ouvindo atualizações de mensagens, você pode receber dados contendo o conteúdo da mensagem atualizada e metadados.

## Fechamento da Conexão

Para fechar a conexão WebSocket, utilize o método `disconnect`:

~~~javascript
socket.disconnect();
~~~

Lembre-se de manipular a conexão de forma responsável, desconectando quando sua aplicação ou componente for desmontado para evitar vazamentos de memória e garantir o uso eficiente de recursos.

## Considerações Finais

A Evolution API oferece uma forma poderosa de interação em tempo real através dos WebSockets, proporcionando uma experiência contínua tanto para desenvolvedores quanto para usuários finais. Seja no modo global, monitorando todas as instâncias simultaneamente, ou no modo tradicional, focado em uma única instância, a flexibilidade do sistema permite a adaptação às necessidades específicas do seu projeto.

```

# v2\pt\requirements\database.mdx

```mdx
---
title: Banco de Dados
icon: database
---

O banco de dados é uma parte fundamental da Evolution API v2, responsável por armazenar todas as informações críticas da aplicação. A API suporta tanto PostgreSQL quanto MySQL, utilizando o Prisma como ORM (Object-Relational Mapping) para facilitar a interação com esses bancos de dados.

## Escolha do Banco de Dados

A Evolution API v2 permite a flexibilidade de escolher entre PostgreSQL e MySQL como provedor de banco de dados. A escolha pode ser configurada através da variável de ambiente `DATABASE_PROVIDER` e as conexões são gerenciadas pelo Prisma.

## Instalação e Configuração

### Utilizando Docker

A maneira mais fácil e rápida de configurar um banco de dados para a Evolution API v2 é através do Docker. Abaixo estão as instruções para configurar tanto o PostgreSQL quanto o MySQL usando Docker Compose.

#### PostgreSQL

Para configurar o PostgreSQL via Docker, siga os passos abaixo:

1. Baixe o arquivo `docker-compose.yaml` para o PostgreSQL disponível [aqui](https://github.com/EvolutionAPI/evolution-api/blob/main/Docker/postgres/docker-compose.yaml).
2. Navegue até o diretório onde o arquivo foi baixado e execute o comando:

\`\`\`bash
docker-compose up -d
\`\`\`

3. A instância do PostgreSQL estará disponível no endereço `localhost` na porta `5432`.

#### MySQL

Para configurar o MySQL via Docker, siga os passos abaixo:

1. Baixe o arquivo `docker-compose.yaml` para o MySQL disponível [aqui](https://github.com/EvolutionAPI/evolution-api/blob/v2.0.0/Docker/mysql/docker-compose.yaml).
2. Navegue até o diretório onde o arquivo foi baixado e execute o comando:

\`\`\`bash
docker-compose up -d
\`\`\`

3. A instância do MySQL estará disponível no endereço `localhost` na porta `3306`.

### Configuração das Variáveis de Ambiente

Após configurar o banco de dados, defina as seguintes variáveis de ambiente no seu arquivo `.env`:

\`\`\`env
# Habilitar o uso do banco de dados
DATABASE_ENABLED=true

# Escolher o provedor do banco de dados: postgresql ou mysql
DATABASE_PROVIDER=postgresql

# URI de conexão com o banco de dados
DATABASE_CONNECTION_URI='postgresql://user:pass@localhost:5432/evolution?schema=public'

# Nome do cliente para a conexão do banco de dados
DATABASE_CONNECTION_CLIENT_NAME=evolution_exchange

# Escolha os dados que você deseja salvar no banco de dados da aplicação
DATABASE_SAVE_DATA_INSTANCE=true
DATABASE_SAVE_DATA_NEW_MESSAGE=true
DATABASE_SAVE_MESSAGE_UPDATE=true
DATABASE_SAVE_DATA_CONTACTS=true
DATABASE_SAVE_DATA_CHATS=true
DATABASE_SAVE_DATA_LABELS=true
DATABASE_SAVE_DATA_HISTORIC=true
\`\`\`

### Instalação Local

Caso prefira configurar o banco de dados localmente sem utilizar Docker, siga as instruções abaixo:

#### PostgreSQL

1. Instale o PostgreSQL na sua máquina. Em sistemas baseados em Ubuntu, por exemplo, você pode usar:

\`\`\`bash
sudo apt-get update
sudo apt-get install postgresql postgresql-contrib
\`\`\`

2. Inicie o serviço do PostgreSQL:

\`\`\`bash
sudo service postgresql start
\`\`\`

3. Crie um banco de dados para a Evolution API v2:

\`\`\`bash
sudo -u postgres createdb evolution
\`\`\`

#### MySQL

1. Instale o MySQL na sua máquina. Em sistemas baseados em Ubuntu, você pode usar:

\`\`\`bash
sudo apt-get update
sudo apt-get install mysql-server
\`\`\`

2. Inicie o serviço do MySQL:

\`\`\`bash
sudo service mysql start
\`\`\`

3. Crie um banco de dados para a Evolution API v2:

\`\`\`bash
mysql -u root -p -e "CREATE DATABASE evolution;"
\`\`\`

```

# v2\pt\requirements\redis.mdx

```mdx
---
title: Redis
icon: layer-group
---

O Redis é utilizado pela Evolution API v2 como um sistema de cache para otimizar o desempenho e a velocidade da aplicação. Ele pode ser configurado para armazenar informações temporárias e melhorar a eficiência das operações.

## Instalação e Configuração

### Utilizando Docker

A maneira mais fácil e rápida de configurar o Redis para a Evolution API v2 é através do Docker. Abaixo estão as instruções para configurar o Redis usando Docker Compose.

#### Redis

Para configurar o Redis via Docker, siga os passos abaixo:

1. Baixe o arquivo `docker-compose.yaml` para o Redis disponível [aqui](https://github.com/EvolutionAPI/evolution-api/blob/v2.0.0/Docker/redis/docker-compose.yaml).
2. Navegue até o diretório onde o arquivo foi baixado e execute o comando:

\`\`\`bash
docker-compose up -d
\`\`\`

3. A instância do Redis estará disponível no endereço `localhost` na porta `6379`.

### Configuração das Variáveis de Ambiente

Após configurar o Redis, defina as seguintes variáveis de ambiente no seu arquivo `.env`:

\`\`\`env
# Habilitar o cache Redis
CACHE_REDIS_ENABLED=true

# URI de conexão com o Redis
CACHE_REDIS_URI=redis://localhost:6379/6

# Prefixo para diferenciar os dados de diferentes instalações que utilizam o mesmo Redis
CACHE_REDIS_PREFIX_KEY=evolution

# Habilitar para salvar as informações de conexão no Redis ao invés do banco de dados
CACHE_REDIS_SAVE_INSTANCES=false

# Habilitar o cache local
CACHE_LOCAL_ENABLED=false
\`\`\`

### Instalação Local

Caso prefira configurar o Redis localmente sem utilizar Docker, siga as instruções abaixo:

#### Redis

1. Instale o Redis na sua máquina. Em sistemas baseados em Ubuntu, por exemplo, você pode usar:

\`\`\`bash
sudo apt-get update
sudo apt-get install redis-server
\`\`\`

2. Inicie o serviço do Redis:

\`\`\`bash
sudo service redis-server start
\`\`\`

3. Verifique se o Redis está rodando corretamente com o comando:

\`\`\`bash
redis-cli ping
\`\`\`

Se tudo estiver funcionando corretamente, você verá a resposta `PONG`.

### Configuração do Cache na Evolution API v2

Após a instalação e configuração do Redis, a próxima etapa é configurar o cache na Evolution API v2 utilizando as variáveis de ambiente. Isso permitirá que a API utilize o Redis para cachear dados importantes e melhorar a performance geral da aplicação.

```

# v2\pt\updates.mdx

```mdx
---
title: Atualização
icon: code-pull-request
---

Manter sua instância da Evolution API atualizada é crucial para segurança, desempenho e acesso a novos recursos. O método de atualização depende de como você inicialmente instalou a API. Este guia cobre os passos para atualizar sua Evolution API usando Docker Compose e NPM.

<Note>Antes de atualizar a Evolution, certifique-se de que todos os aplicativos integrados estão realmente funcionando com a Evolution. Atualize por sua conta e risco.</Note>

## Atualização com Docker

Se você configurou inicialmente sua Evolution API usando Docker, siga estas etapas para atualizar:

### Atualização com Docker CLI

Se sua Evolution API foi instalada inicialmente usando Docker Compose via interface de linha de comando (CLI), e não através do Portainer ou qualquer outra ferramenta de gerenciamento de contêiner, siga estas etapas para atualizá-la:

1. **Navegue até o Diretório do Docker Compose**: Abra um terminal e vá para o diretório onde seu arquivo Docker Compose (`docker-compose.yml`) está localizado.

2. **Puxe a Imagem Mais Recente**: Atualize a imagem da Evolution API para a versão mais recente executando o seguinte comando:

~~~ shell
docker pull atendai/evolution-api:v2.1.1
~~~

3. **Pare e Reinicie os Contêineres**: Após puxar a imagem mais recente, pare os contêineres atuais e reinicie-os. Isso pode ser feito usando o seguinte comando:

~~~ shell
docker compose down && docker compose up -d
~~~

## Atualização com Portainer

Se você está usando o Portainer para gerenciamento de contêineres, siga estas etapas para atualizar sua Evolution API:

1. **Acesse o Painel do Portainer**: Abra o painel do Portainer em um navegador web.

2. **Navegue até Seus Contêineres**: Vá para a seção 'Stacks' onde seu contêiner da Evolution API está listado.

3. **Atualize o Compose**:
    - Localize o campo `image` na sua configuração do Docker Compose.

~~~ yaml stack-file.yml
# ... (outros serviços e configurações)
  evolution_api:
    # Atualize a versão da imagem da Evolution API aqui
    # Use 'atendai/evolution-api:latest' para a versão mais recente
    # Ou especifique uma versão específica como 'atendai/evolutionapi:2.1.1'
    image: atendai/evolution-api:v2.x.x
    networks:
      - your_network

~~~

    - Atualize o valor para `atendai/evolution-api:v2.1.1` para a versão mais recente, ou use `atendai/evolutionapi:v2.x.x` para uma versão específica.
    - Após fazer as alterações, clique no botão 'Deploy' no final da janela de edição do compose.

4. **Verifique a Atualização**: Após recriar o contêiner, verifique se a Evolution API está executando a versão mais recente. Isso pode ser verificado tipicamente através do endpoint de versão da API ou dos logs.

<Note>
    Para ambientes de produção, é recomendável especificar uma versão particular da Evolution API (ex.: atendai/evolution-api:v1.x.x) em vez de usar latest.
    Esta prática garante estabilidade e previsibilidade, pois protege seu ambiente de produção de problemas potenciais decorrentes de mudanças inesperadas na versão mais recente.
</Note>

Seguindo esses passos, você pode garantir que sua Evolution API esteja sempre atualizada usando o Portainer.

## Atualização com NPM

Atualizar sua instalação da Evolution API via NPM envolve várias etapas para garantir uma transição suave para a nova versão. Aqui está um guia passo a passo:

1. **Limpar e Parar**: Limpe todos os logs do PM2, útil para resolução de problemas após a atualização, e pare temporariamente a Evolution API para aplicar as atualizações com segurança.

~~~ shell Terminal
# Limpar todos os logs do PM2
pm2 flush

# Parar o processo atual da Evolution API
pm2 stop ApiEvolution
~~~

2. **Resetar o repositório local e puxar as atualizações mais recentes**: Garanta que seu código local esteja em sincronia com o commit mais recente e baixe as atualizações mais recentes do repositório. Opcionalmente, mude para uma versão específica se não estiver usando a mais recente. É recomendado para ambientes de produção.

~~~ shell Terminal
# Resetar seu repositório local para o commit mais recente
git reset --hard HEAD

# Puxar as atualizações mais recentes do repositório
git pull

# Para uma versão específica, use 'git checkout main' para a mais recente,
# ou 'git checkout 1.x.x' para uma versão específica. Exemplo:
git checkout 1.x.x
~~~

3. **Instalação Limpa**: Remova o `node_modules` existente para evitar possíveis conflitos com novas dependências e instale as dependências necessárias do Node.js para a versão atualizada.

~~~ shell Terminal
# Remover o diretório node_modules atual para garantir uma instalação limpa
rm -rf node_modules

# Instalar dependências com NPM
npm i

# Reiniciar a Evolution API com a versão atualizada
pm2 start ApiEvolution

# Opcionalmente, visualizar os logs do PM2 para a Evolution API
pm2 log ApiEvolution
~~~
```

