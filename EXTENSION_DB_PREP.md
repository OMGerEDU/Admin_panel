## Builders Extension → Supabase DB Integration (Preparation)

**Goal:** move the extension from the old n8n webhook (`BACKEND_AUTH_URL`) to Supabase-based auth + data, without breaking existing behavior in `builders_production_v1.1`.

This file is a **spec + checklist** for the new schema + API operations the extension will use.

---

## 1. Current Extension Behavior (what we must preserve)

- **Auth flow in `popup.js`**
  - Uses `BACKEND_AUTH_URL` (`verifyUserCredentials`) with:
    - **Request body**:
      - `action: "verifyUser"`
      - `username`
      - `password`
    - **Expected response** (any of these shapes are currently supported):
      - `{ exists: true, active: true, accounts: [...] }`
      - `{ success: true, active: true, accounts: [...] }`
  - **Error cases**:
    - `exists === false` → "משתמש לא נמצא במערכת"
    - `active === false` → "המשתמש לא פעיל"
    - any other → "פרטים לא תקינים"
  - **On success**:
    - Saves `accounts` to `chrome.storage.local` as:
      - `[{ name, id, token, username, isDefault? }, ...]`
    - Picks a **selected account** (either default or first).

- **Green API usage**
  - All WhatsApp operations are **direct to Green API**, not via backend:
    - Fetch chats, history, send text, send files, etc.
  - The backend only needs to:
    - **Authenticate user**.
    - **Return list of allowed Green API accounts** for that user.

---

## 2. Target Supabase Data Model (high level)

We will drive extension access from the same schema as the admin panel:

- **`profiles`** (per Supabase auth user)
  - Key fields we will rely on:
    - `id` (UUID, references `auth.users.id`)
    - `full_name`
    - `email`
    - `is_active` (boolean, or equivalent flag – add if missing)

- **`organizations`**
  - Link users to organizations if multi-tenant.

- **`organization_members`**
  - Map: user ↔ organization
  - Use RLS to ensure user only sees their org’s numbers.

- **`numbers`**
  - Green API instances that the extension will use.
  - Key fields:
    - `id` (PK)
    - `organization_id`
    - `name` (friendly label)
    - `instance_id` (→ extension `id`)
    - `api_token` (→ extension `token`)
    - `status` (`active` / `inactive`)

> **Important:** the extension needs a **flat list of accounts** (id + token + name) that it is allowed to use for the logged-in user.

---

## 3. New API Endpoint (to be implemented on Supabase side)

We will create **one primary endpoint** that replicates the old webhook contract:

- **Endpoint**: `POST /api/extension/auth`
- **Auth mechanism**: Supabase email/password (server-side).
- **Request body** (from extension, keep exactly):

```json
{
  "action": "verifyUser",
  "username": "<email or username>",
  "password": "<password>"
}
```

- **Backend steps (pseudocode)**:
  1. Validate `action === "verifyUser"`.
  2. Use Supabase **service role** key (server-only) to:
     - `auth.signInWithPassword({ email: username, password })`.
  3. If login fails:
     - Return `{ exists: false, active: false }` or an error string.
  4. If login succeeds:
     - Load `profile` for that user.
     - Check `is_active` (or similar).
     - Resolve user's organizations via `organization_members`.
     - Fetch all **active `numbers`** for these organizations.
  5. Map numbers → **extension accounts array**:

```json
{
  "success": true,
  "exists": true,
  "active": true,
  "accounts": [
    {
      "name": "Main WhatsApp",
      "id": "<numbers.instance_id>",
      "token": "<numbers.api_token>",
      "username": "<profiles.email>",
      "isDefault": true
    }
  ]
}
```

- **Error responses (must match extension logic)**:
  - User not found:

```json
{ "exists": false, "active": false }
```

  - User found but inactive:

```json
{ "exists": true, "active": false }
```

  - Generic failure:

```json
{ "success": false, "error": "פרטים לא תקינים" }
```

---

## 4. Changes Needed in Supabase Schema

To support this endpoint cleanly:

- **Profiles**
  - Ensure `profiles` has:
    - `is_active boolean default true` (or `status` enum).

- **Numbers**
  - Confirm the `numbers` table has:
    - `organization_id` FK.
    - `instance_id` (string).
    - `api_token` (string).
    - `name` (string, optional but recommended).
    - `status` / `is_active` flag.

- **Organization membership**
  - Ensure:
    - `organization_members(user_id, organization_id)` exists.
    - RLS policies let **backend/service-role** see all, but normal anon cannot.

> Any missing columns should be added in `supabase_schema.sql` as idempotent `alter table ... add column if not exists ...` statements.

---

## 5. Changes Needed in the Extension (after backend is ready)

When the Supabase endpoint is up, we will update `builders_production_v1.1`:

- **In `popup.js`**
  - Replace:

```js
const BACKEND_AUTH_URL = "https://n8n-railway-custom-production-1086.up.railway.app/webhook/73539861-4649-4b44-ac5b-62a60677a9b8";
```

  - With something like (final URL TBD):

```js
const BACKEND_AUTH_URL = "https://<your-admin-panel-domain>/api/extension/auth";
```

  - Keep the **request body** and **response parsing** identical, so no other code changes are required.

- **Optional future step**
  - Add another endpoint for logging sent messages to Supabase `logs` table, but this is **not required** for the first migration.

---

## 6. Migration Checklist

- **Step 1 – Schema**
  - [ ] Confirm / add `profiles.is_active`.
  - [ ] Confirm `numbers` has `instance_id`, `api_token`, `name`, `status`.
  - [ ] Confirm `organization_members` links users ↔ organizations.
  - [ ] Ensure RLS for `numbers` and `organization_members` are correct.

- **Step 2 – Backend endpoint**
  - [ ] Implement `POST /api/extension/auth` using Supabase server SDK.
  - [ ] Match **exact** response shapes listed above.
  - [ ] Test with:
    - Valid active user with numbers.
    - Valid inactive user.
    - Non-existent user.

- **Step 3 – Extension**
  - [ ] Point `BACKEND_AUTH_URL` to the new endpoint.
  - [ ] Test onboarding flow end-to-end:
    - Successful login → accounts loaded → chats work.
    - Failed login → correct error messages.

- **Step 4 – Rollout**
  - [ ] Publish new backend first.
  - [ ] Then ship new extension build that points to the Supabase-backed endpoint.

---

This document is only a **preparation/spec file** – next steps are:
1. Update `supabase_schema.sql` where needed.
2. Implement the `/api/extension/auth` handler.
3. Then update the extension’s `BACKEND_AUTH_URL`.


