# Implementation Plan - Evolution API Integration

This plan outlines the steps to integrate Evolution API as an alternative WhatsApp provider alongside GreenAPI. The goal is to allow the SaaS to host its own numbers using a self-hosted Evolution API instance.

## User Review Required
> [!IMPORTANT]
> **Hosting Requirement**: You explicitly mentioned "local hosted". You will need to provision a server (VPS like DigitalOcean, Hetzner, or AWS EC2) to run the Evolution API Docker container. This cannot run directly on Vercel. This plan assumes you will have an Evolution API URL (e.g., `https://wa.yoursaas.com`) and a Global API Key.

> [!WARNING]
> **Database Migration**: We will modify the `numbers` table. Existing rows will default to `green-api`.

## Proposed Architecture

### 1. Evolution API Instance (The "Backend" Host)
You will run a dedicated VPS (e.g., 4GB+ RAM, Ubuntu) running Evolution API via Docker Compose.
**Critical Architecture Decisions:**
-   **Persistence**: We MUST use **PostgreSQL** (not SQLite) and **Redis** for the Evolution container. This ensures that if the container restarts, WhatsApp sessions are NOT lost.
-   **Security**: The Evolution API will be protected by a `GLOBAL_API_KEY`. This key will live ONLY in Vercel's environment variables (`EVOLUTION_API_KEY`).
-   **Network**: The VPS should expose Evolution API via SSL (HTTPS). You can use Caddy or Nginx reverse proxy.

### 2. Database Schema
We need to distinguish which provider a number uses and store provider-specific metadata.

#### [MODIFY] [supabase_schema.sql](file:///d:/SKUL/Sasha/AdminPanel/supabase_schema.sql)
-   Add `provider` column (enum: `green-api`, `evolution`).
-   Add `instance_data` JSONB column.
    -   For Evolution, this stores: `{ "instanceName": "...", "integrationId": "..." }`
    -   We will use a naming convention for instances: `saas_<user_id_short>_<random>` to prevent collisions.

### 3. Backend Logic (Vercel Functions)
We will create a "Gateway" pattern to abstract the providers. The frontend will rarely know which provider it's using except for the "Scan QR" UI differences.

#### [NEW] `api/_utils/providers/evolution.js`
-   **Instance Management**:
    -   `createInstance`: calls `/instance/create`. Configures webhooks *immediately* upon creation.
    -   `deleteInstance`: calls `/instance/delete`.
-   **Connection**:
    -   `connect`: calls `/instance/connect/{instance}`. Returns the base64 QR code or pairing code.
-   **Messaging**:
    -   `sendMessage`: Standard text/media sending.
-   **Webhook Handling**:
    -   **Security Hole Fix**: Verify `HTTP_EVOX_SIGNATURE` header using HMAC-SHA256 to ensure data comes from YOUR server, not a hacker.

#### [NEW] `api/_utils/providers/index.js`
-   Factory function: `getProvider(numberRow)` -> returns correct provider class.

#### [MODIFY] `api/v1/webhooks/evolution.js`
-   Receives events from Evolution.
-   Verifies signature.
-   Updates `numbers` table status (connected, disconnected).
-   Inserts into `chats`/`messages` tables.

### 4. Frontend
#### [MODIFY] `src/pages/Numbers.jsx`
-   **Add Number Flow**:
    -   User selects "Evolution API" (or we make it default).
    -   Backend generates instance -> returns instance name.
    -   UI calls "Connect" -> Backend returns QR.
    -   UI polls for status "open" (Connected).

## Infrastructure & Security "Holes" Plugged
1.  **Session Loss**: Solved by enforce Postgres/Redis in Docker Compose.
2.  **Spoofing**: Solved by `HTTP_EVOX_SIGNATURE` verification.
3.  **Data Leak**: Users NEVER talk to Evolution directly. Vercel proxies all requests. The `GLOBAL_API_KEY` never leaves Vercel.
4.  **Orphaned Instances**: "Delete Number" in UI must aggressively try to delete the instance on Evolution. We will add a "Sync" cron job later to clean up zombies.

## Verification Plan

### Manual Verification
1.  **Infrastructure**: Deploy `docker-compose.yml` to VPS. Verify Healthcheck.
2.  **Security**: Try to call Evolution API without key -> Expect 403.
3.  **Flow**:
    -   Create Number (Evolution) -> Check Postgres (Evolution DB) for new entry.
    -   Scan QR -> Check Vercel DB `numbers.status` = 'active'.
    -   Kill VPS Container -> Restart -> Check if status remains 'active' (Persistence test).

## Docker Setup for Evolution (For your reference)
We will provide a `docker-compose.evolution.yml` file you can use to launch the server.
