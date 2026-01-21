---
description: Evolution API Master Agent - Expert knowledge and workflows for Evolution API v2 Integration
---

# Evolution API Master Agent

This workflow documents the **Evolution API v2** integration within the **EvolutionBackend** project. It serves as the single source of truth for the Backend Service implementation and the Exposed API endpoints.

## 🏗️ Architecture

The backend acts as a **Proxy** and **Orchestrator** for the Evolution API.
- **Frontend** calls `EvolutionBackend` endpoints (`/api/...`).
- **Backend Service** (`src/services/evolution.js`) normalizes calls to the Evolution API container.
- **Webhooks** are received at `/api/webhooks/evolution` and stored/processed (e.g., QR codes are cached in memory).

> [!IMPORTANT]
> Do NOT call Evolution API directly from the Frontend. Always use the Backend API to ensure API Key protection and data normalization.

---

## 🛠️ Internal Service (`src/services/evolution.js`)

The `evolution.js` service handles all direct HTTP communication including retries and authentication.

### Key Methods

| Method | Evolution Endpoint | Note |
| :--- | :--- | :--- |
| `createInstance(name, options)` | `POST /instance/create` | Only creates the instance. Does NOT generate QR automatically in v2. |
| `connect(name)` | `GET /instance/connect/:name` | **Required** after creation to trigger QR generation. |
| `fetchChats(name)` | `POST /chat/findChats/:name` | Use `findChats` instead of `fetchAllChats` for stability. |
| `fetchGroups(name)` | `POST /chat/findChats/:name` | Filters chats for `@g.us` JIDs. |
| `sendText(name, number, text)` | `POST /message/sendText/:name` | |
| `sendMedia(name, number, url)` | `POST /message/sendMedia/:name` | Supports images, video, documents. |
| `updateMessage(name, key, txt)` | `PUT /chat/updateMessage/:name` | Edit sent text messages. |
| `sendSticker(name, number, url)` | `POST /message/sendSticker/:name` | Send sticker from URL. |
| `sendPresence(name, number, status)` | `POST /chat/sendPresence/:name` | Status: composing, recording, etc. |
| `getBase64(name, messageObj)` | `POST /chat/getBase64FromMediaMessage/:name` | Returns base64 of media message. |

---

## 🚀 Exposed API Routes (`src/routes/`)

These are the endpoints available to the Admin Panel / Frontend.

### 1. Instance Management (`/api/instances`)

**Create Instance (Smart Flow)**
- **Endpoint**: `POST /api/instances`
- **Logic**: Calls `createInstance` -> Checks for QR -> If missing, calls `connect` -> Polls Webhook Store for QR.
- **Body**:
  ```json
  {
    "instanceName": "my-instance",
    "qrcode": true,
    "integration": "WHATSAPP-BAILEYS"
  }
  ```

**Get QR Code**
- **Endpoint**: `GET /api/instances/:name/qr`
- **Logic**: Forces a generation of the QR code (calls `connect`).

**Connection State**
- **Endpoint**: `GET /api/instances/:name` (Returns specific state) or `GET /api/instances` (List all).

### 2. Messaging (`/api/messages`)

**Send Text**
- **Endpoint**: `POST /api/messages/text`
- **Body**: `{ "instanceName": "name", "number": "12345...", "text": "Hello" }`

**Send Media**
- **Endpoint**: `POST /api/messages/media`
- **Body**: `{ "instanceName": "name", "number": "...", "media": "http://...", "mediatype": "image", "caption": "..." }`

**Supported Types**: `text`, `media`, `audio`, `location`, `contact`, `reaction`, `poll`.

**Send Sticker**
- **Endpoint**: `POST /api/messages/sticker`
- **Body**: `{ "instanceName": "name", "number": "...", "sticker": "http://..." }`

**Send Voice Note (PTT)**
- **Endpoint**: `POST /api/messages/audio`
- **Body**: `{ "instanceName": "name", "number": "...", "audioUrl": "http://...", "ptt": true }`

### 3. Chats & Groups (`/api/chats`)

**Fetch Chats**
- **Endpoint**: `GET /api/chats?instanceName=...`
- **Logic**: Proxies `findChats`.

**Message Actions**
- **Mark as Read**: `PUT /api/chats/mark-read`
- **Delete Message**: `DELETE /api/chats/delete-message` (Delete for everyone)
- **Find Messages**: `POST /api/chats/find-messages` (Search history)
- **Edit Message**: `PUT /api/chats/update-message` (`{ "messageKey": "...", "newMessage": "..." }`)
- **Set Presence**: `POST /api/chats/presence` (`{ "presence": "composing" }`)
- **Download Media**: `POST /api/chats/download-media` (`{ "message": {...} }`)

---

## 📡 Webhooks

**Endpoint**: `POST /api/webhooks/evolution/:event`

- **Core Logic**:
  - Events are logged.
  - `qrcode-updated` events are **Store in Memory** (`qrCodeStore`).
  - This allows the `create` endpoint to "poll" internally and return the QR immediately to the frontend.

---

## ⚠️ Known Issues & Troubleshooting

### 1. QR Code Generation
**Issue**: `POST /instance/create` returns `qrcode: null` even with `qrcode: true`.
**Fix**: You must call `GET /instance/connect/{name}` immediately after creation. The Backend `POST /api/instances` handles this automatically.

### 2. Fetching Groups
**Issue**: There is no dedicated `fetchAllGroups` that works reliably in some v2 versions.
**Fix**: We use `fetchChats` and filter for `id.includes('@g.us')`.

### 3. Error Handling
- Evolution API errors often come in nested objects (`error.response.data.response.message`).
- The backend wraps these in a standardized JSON error:
  ```json
  {
    "success": false,
    "error": "Detailed error message",
    "code": "EVOLUTION_ERROR"
  }
  ```

### 4. 404 Errors
- If `fetchChats` or `sendText` returns 404:
  - Check if the instance exists (`GET /api/instances`).
  - Check if the instance is `open` (connected).
  - Verify the instance Name in the URL matches exactly (case-sensitive).
