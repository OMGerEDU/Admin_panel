# .gitignore

```
# Logs
logs
*.log
npm-debug.log*
yarn-debug.log*
yarn-error.log*
pnpm-debug.log*
lerna-debug.log*

node_modules
dist
dist-ssr
*.local

# Editor directories and files
.vscode/*
!.vscode/extensions.json
.idea
.DS_Store
*.suo
*.ntvs*
*.njsproj
*.sln
*.sw?

# Environment files
.env
.env.local
.env.*.local

# Ignore parent directory files
../.env
../*.md
../landing-page/
../DEPLOYMENT_GUIDE.md


```

# deploy_schema.bat

```bat
@echo off
echo ==========================================
echo      Supabase Schema Deployment
echo ==========================================
echo.
echo.
echo Generating SQL script you can paste into Supabase SQL Editor...
echo.

node scripts/deploy_schema.js

echo.
echo Done. Scroll up, copy the SQL block, and paste it into Supabase Dashboard -> SQL Editor.
echo.
pause

```

# DEPLOY.md

```md
# מדריך העלאה לפרודקשן 🚀

## אפשרויות העלאה

### 1. **Vercel** (מומלץ - הכי קל) ⭐
- ✅ חינם
- ✅ מהיר מאוד
- ✅ אוטומטי מ-GitHub
- ✅ HTTPS אוטומטי
- ✅ CDN גלובלי

### 2. **Railway** (יש לך כבר שם n8n)
- ✅ חינם (עם הגבלות)
- ✅ קל להגדרה
- ✅ באותו מקום כמו n8n

### 3. **Netlify**
- ✅ חינם
- ✅ קל מאוד
- ✅ אוטומטי מ-GitHub

### 4. **Render**
- ✅ חינם
- ✅ פשוט

---

## שיטה 1: Vercel (מומלץ)

### שלב 1: העלה ל-GitHub
\`\`\`bash
cd admin-panel
git init
git add .
git commit -m "Initial commit - Admin Panel"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/builders-admin-panel.git
git push -u origin main
\`\`\`

### שלב 2: העלה ב-Vercel
1. היכנס ל: https://vercel.com
2. התחבר עם GitHub
3. לחץ "Add New Project"
4. בחר את ה-repository
5. Vercel יזהה אוטומטית שזה Vite project
6. לחץ "Deploy"

**זה הכל!** האתר יהיה זמין תוך דקות ב-URL כמו:
`https://builders-admin-panel.vercel.app`

---

## שיטה 2: Railway (יש לך כבר שם)

### שלב 1: העלה ל-GitHub
\`\`\`bash
cd admin-panel
git init
git add .
git commit -m "Initial commit - Admin Panel"
git branch -M main
git remote add origin https://github.com/YOUR_USERNAME/builders-admin-panel.git
git push -u origin main
\`\`\`

### שלב 2: העלה ב-Railway
1. היכנס ל: https://railway.app
2. לחץ "New Project"
3. בחר "Deploy from GitHub repo"
4. בחר את ה-repository
5. Railway יזהה אוטומטית שזה Node.js project
6. הגדר:
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npx serve -s dist -p $PORT`
   - **Output Directory:** `dist`

**הערה:** צריך להתקין `serve`:
\`\`\`bash
npm install -g serve
\`\`\`

או להוסיף ל-`package.json`:
\`\`\`json
{
  "scripts": {
    "start": "serve -s dist -p $PORT"
  },
  "dependencies": {
    "serve": "^14.2.0"
  }
}
\`\`\`

---

## שיטה 3: Netlify

### שלב 1: Build מקומי
\`\`\`bash
cd admin-panel
npm install
npm run build
\`\`\`

### שלב 2: העלה ל-Netlify
1. היכנס ל: https://netlify.com
2. התחבר עם GitHub
3. לחץ "Add new site" → "Import an existing project"
4. בחר את ה-repository
5. הגדר:
   - **Build command:** `npm run build`
   - **Publish directory:** `dist`

---

## שיטה 4: Build ידני + העלאה

### שלב 1: Build
\`\`\`bash
cd admin-panel
npm install
npm run build
\`\`\`

הקבצים יווצרו בתיקייה `dist/`

### שלב 2: העלה את `dist/` לכל שרת:
- **cPanel** - העלה את `dist/` ל-`public_html/`
- **FTP** - העלה את `dist/` לשרת
- **AWS S3** - העלה את `dist/` ל-S3 bucket

---

## הגדרת Environment Variables (אם צריך)

אם יש לך environment variables, הוסף אותם ב-Vercel/Railway:

**Vercel:**
- Settings → Environment Variables

**Railway:**
- Variables → Add Variable

---

## CORS Issues

אם יש בעיות CORS, צריך להוסיף ב-n8n:
- Allow CORS headers
- או להוסיף את ה-domain ל-whitelist

---

## המלצה שלי

**השתמש ב-Vercel** - הכי קל ומהיר! 🚀

1. העלה ל-GitHub
2. חבר ל-Vercel
3. Deploy אוטומטי
4. סיימת!

---

## בדיקה אחרי העלאה

1. בדוק שהאתר נטען
2. בדוק התחברות
3. בדוק API calls (פתח Console ב-DevTools)
4. בדוק Responsive (mobile/tablet)

---

## Troubleshooting

### האתר לא נטען:
- בדוק Console ב-DevTools
- בדוק Network tab
- בדוק שהבנייה הצליחה

### API calls לא עובדים:
- בדוק CORS headers
- בדוק שה-URL של n8n נכון
- בדוק Network tab לראות את ה-requests

### 404 errors:
- בדוק שה-`base` ב-`vite.config.js` נכון
- ב-Vercel: הוסף `vercel.json` עם rewrites

---

**עדכון אחרון:** היום


```

# EXTENSION_DB_PREP.md

```md
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

\`\`\`json
{
  "action": "verifyUser",
  "username": "<email or username>",
  "password": "<password>"
}
\`\`\`

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

\`\`\`json
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
\`\`\`

- **Error responses (must match extension logic)**:
  - User not found:

\`\`\`json
{ "exists": false, "active": false }
\`\`\`

  - User found but inactive:

\`\`\`json
{ "exists": true, "active": false }
\`\`\`

  - Generic failure:

\`\`\`json
{ "success": false, "error": "פרטים לא תקינים" }
\`\`\`

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

\`\`\`js
const BACKEND_AUTH_URL = "https://n8n-railway-custom-production-1086.up.railway.app/webhook/73539861-4649-4b44-ac5b-62a60677a9b8";
\`\`\`

  - With something like (final URL TBD):

\`\`\`js
const BACKEND_AUTH_URL = "https://<your-admin-panel-domain>/api/extension/auth";
\`\`\`

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



```

# generated_supabase_schema.txt

```txt
-- Enable UUID extension if not already enabled
create extension if not exists "uuid-ossp";

create table if not exists public.profiles (
  id uuid not null references auth.users on delete cascade,
  email text,
  full_name text,
  avatar_url text,
  -- Mark if user is allowed to use the system (for extension + app)
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (id)
);

-- Ensure is_active exists even if table already created previously
alter table public.profiles
  add column if not exists is_active boolean default true;

-- Enable RLS
alter table public.profiles enable row level security;

-- Policies for profiles
drop policy if exists "Public profiles are viewable by everyone." on public.profiles;
create policy "Public profiles are viewable by everyone." on public.profiles
  for select using (true);

drop policy if exists "Users can insert their own profile." on public.profiles;
create policy "Users can insert their own profile." on public.profiles
  for insert with check (auth.uid() = id);

drop policy if exists "Users can update own profile." on public.profiles;
create policy "Users can update own profile." on public.profiles
  for update using (auth.uid() = id);

-- Create a table for Organizations
create table if not exists public.organizations (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  owner_id uuid references public.profiles(id) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.organizations enable row level security;

-- Create a table for Organization Members
create table if not exists public.organization_members (
  id uuid default uuid_generate_v4() primary key,
  organization_id uuid references public.organizations(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  role text check (role in ('admin', 'member')) default 'member',
  joined_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(organization_id, user_id)
);

-- Enable RLS
alter table public.organization_members enable row level security;

-- Policies for Organizations
drop policy if exists "Users can view own organizations" on public.organizations;
create policy "Users can view own organizations" on public.organizations
  for select using (
    exists (
      select 1 from public.organization_members
      where organization_id = public.organizations.id
      and user_id = auth.uid()
    )
  );

drop policy if exists "Users can create organizations" on public.organizations;
create policy "Users can create organizations" on public.organizations
  for insert with check (auth.uid() = owner_id);

-- Policies for Organization Members
drop policy if exists "Members can view other members" on public.organization_members;
create policy "Members can view other members" on public.organization_members
  for select using (
    exists (
      select 1 from public.organization_members as om
      where om.organization_id = public.organization_members.organization_id
      and om.user_id = auth.uid()
    )
  );

drop policy if exists "Members can add members" on public.organization_members;
create policy "Members can add members" on public.organization_members
  for insert with check (
      exists (
          select 1 from public.organization_members as om
          where om.organization_id = organization_id
          and om.user_id = auth.uid()
          and om.role = 'admin'
      )
      OR
      -- Allow self-insert if you are the owner creating the org (this is tricky, usually handled by backend or function. 
      -- For simplicity in this demo, we might need a trusted function to create org+member together)
      -- Allowing initial member creation:
       exists (
          select 1 from public.organizations as o
          where o.id = organization_id
          and o.owner_id = auth.uid()
       )
  );

drop policy if exists "Admins can delete members" on public.organization_members;
create policy "Admins can delete members" on public.organization_members
  for delete using (
      exists (
          select 1 from public.organization_members as om
          where om.organization_id = public.organization_members.organization_id
          and om.user_id = auth.uid()
          and om.role = 'admin'
      )
      OR
      exists (
          select 1 from public.organizations as o
          where o.id = public.organization_members.organization_id
          and o.owner_id = auth.uid()
      )
  );

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to create profile on signup
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- PLANS Table
create table if not exists public.plans (
  id uuid default uuid_generate_v4() primary key,
  name text not null unique, -- 'Free', 'Pro', 'Agency'
  price_monthly numeric,
  numbers_limit int, -- -1 for unlimited
  instances_limit int, -- -1 for unlimited
  invites_limit int, -- -1 for unlimited
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Seed Plans (Idempotent)
insert into public.plans (name, price_monthly, numbers_limit, instances_limit, invites_limit)
values 
  ('Free', 0, 2, 1, 0),
  ('Pro', 29, 10, 10, 1),
  ('Agency', 99, -1, -1, -1)
on conflict (name) do nothing;

-- SUBSCRIPTIONS / USER PLANS Table
create table if not exists public.subscriptions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) not null,
  plan_id uuid references public.plans(id) not null,
  status text check (status in ('active', 'canceled', 'past_due')) default 'active',
  current_period_end timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id) -- One active subscription per user for simplicity
);

-- Enable RLS for Subscriptions
alter table public.subscriptions enable row level security;

drop policy if exists "Users can view own subscription" on public.subscriptions;
create policy "Users can view own subscription" on public.subscriptions
  for select using (auth.uid() = user_id);

drop policy if exists "Users can insert own subscription" on public.subscriptions;
create policy "Users can insert own subscription" on public.subscriptions
  for insert with check (auth.uid() = user_id);

drop policy if exists "Users can update own subscription" on public.subscriptions;
create policy "Users can update own subscription" on public.subscriptions
  for update using (auth.uid() = user_id);

-- NUMBERS Table
create table if not exists public.numbers (
  id uuid default uuid_generate_v4() primary key,
  phone_number text not null,
  user_id uuid references public.profiles(id), -- Owner
  organization_id uuid references public.organizations(id), -- If belongs to org
  status text default 'active',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(phone_number)
);

-- Enable RLS for Numbers
alter table public.numbers enable row level security;

-- Policy: Users see numbers they own OR numbers in their organization
drop policy if exists "Users can check own or org numbers" on public.numbers;
create policy "Users can check own or org numbers" on public.numbers
  for select using (
    auth.uid() = user_id OR 
    exists (
      select 1 from public.organization_members om
      where om.organization_id = public.numbers.organization_id
      and om.user_id = auth.uid()
    )
  );

drop policy if exists "Users can insert numbers" on public.numbers;
create policy "Users can insert numbers" on public.numbers
  for insert with check (auth.uid() = user_id);

drop policy if exists "Users can update own numbers" on public.numbers;
create policy "Users can update own numbers" on public.numbers
  for update using (auth.uid() = user_id);

drop policy if exists "Users can delete own numbers" on public.numbers;
create policy "Users can delete own numbers" on public.numbers
  for delete using (auth.uid() = user_id);

-- CHATS Table
create table if not exists public.chats (
  id uuid default uuid_generate_v4() primary key,
  number_id uuid references public.numbers(id) not null,
  remote_jid text not null, -- The other person's ID (e.g., WhatsApp JID)
  name text,
  last_message text,
  last_message_at timestamp with time zone default timezone('utc'::text, now()),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for Chats
alter table public.chats enable row level security;

-- Policy: Users see chats for numbers they have access to
drop policy if exists "Users can view chats for their numbers" on public.chats;
create policy "Users can view chats for their numbers" on public.chats
  for select using (
    exists (
      select 1 from public.numbers n
      where n.id = public.chats.number_id
      and (
        n.user_id = auth.uid() OR
        exists (
          select 1 from public.organization_members om
          where om.organization_id = n.organization_id
          and om.user_id = auth.uid()
        )
      )
    )
  );

drop policy if exists "Users can insert chats for their numbers" on public.chats;
create policy "Users can insert chats for their numbers" on public.chats
  for insert with check (
    exists (
      select 1 from public.numbers n
      where n.id = public.chats.number_id
      and n.user_id = auth.uid()
    )
  );

drop policy if exists "Users can update chats for their numbers" on public.chats;
create policy "Users can update chats for their numbers" on public.chats
  for update using (
    exists (
      select 1 from public.numbers n
      where n.id = public.chats.number_id
      and n.user_id = auth.uid()
    )
  );

-- MESSAGES Table (Optional, but good for history)
create table if not exists public.messages (
    id uuid default uuid_generate_v4() primary key,
    chat_id uuid references public.chats(id) not null,
    content text,
    is_from_me boolean default false,
    timestamp timestamp with time zone default timezone('utc'::text, now()) not null,
    media_meta jsonb -- Store media metadata (urlFile, downloadUrl, jpegThumbnail, fileName, etc.)
);

-- Add media_meta column if table already exists
alter table public.messages
add column if not exists media_meta jsonb;

alter table public.messages enable row level security;

drop policy if exists "Users can view messages for accessible chats" on public.messages;
create policy "Users can view messages for accessible chats" on public.messages
  for select using (
      exists (
          select 1 from public.chats c
          where c.id = public.messages.chat_id
          and exists (
              select 1 from public.numbers n
              where n.id = c.number_id
              and (
                  n.user_id = auth.uid() OR
                  exists (
                      select 1 from public.organization_members om
                      where om.organization_id = n.organization_id
                      and om.user_id = auth.uid()
                  )
              )
          )
      )
  );

drop policy if exists "Users can insert messages for accessible chats" on public.messages;
create policy "Users can insert messages for accessible chats" on public.messages
  for insert with check (
      exists (
          select 1 from public.chats c
          where c.id = public.messages.chat_id
          and exists (
              select 1 from public.numbers n
              where n.id = c.number_id
              and n.user_id = auth.uid()
          )
      )
  );


-- Update NUMBERS table with Green-API fields
alter table public.numbers 
add column if not exists instance_id text,
add column if not exists api_token text,
add column if not exists last_seen timestamp with time zone,
add column if not exists settings jsonb default '{}'::jsonb;

-- Ensure instance_id is unique
create unique index if not exists numbers_instance_id_idx on public.numbers (instance_id);

-- WEBHOOKS Table
create table if not exists public.webhooks (
  id uuid default uuid_generate_v4() primary key,
  organization_id uuid references public.organizations(id) on delete cascade not null,
  url text not null,
  events jsonb default '[]'::jsonb, -- Array of event names
  is_active boolean default true,
  secret text,
  retry_policy jsonb default '{"max_retries": 3, "backoff": "exponential"}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for Webhooks
alter table public.webhooks enable row level security;

drop policy if exists "Users can view webhooks for their orgs" on public.webhooks;
create policy "Users can view webhooks for their orgs" on public.webhooks
  for select using (
    exists (
      select 1 from public.organization_members om
      where om.organization_id = public.webhooks.organization_id
      and om.user_id = auth.uid()
    )
  );

drop policy if exists "Admins can manage webhooks" on public.webhooks;
create policy "Admins can manage webhooks" on public.webhooks
  for all using (
    exists (
      select 1 from public.organization_members om
      where om.organization_id = public.webhooks.organization_id
      and om.user_id = auth.uid()
      and om.role = 'admin'
    )
  );

-- LOGS Table
create table if not exists public.logs (
  id uuid default uuid_generate_v4() primary key,
  organization_id uuid references public.organizations(id),
  number_id uuid references public.numbers(id),
  level text check (level in ('info', 'warn', 'error', 'debug')) default 'info',
  message text not null,
  meta jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for Logs
alter table public.logs enable row level security;

drop policy if exists "Users can view logs for their scope" on public.logs;
create policy "Users can view logs for their scope" on public.logs
  for select using (
    (organization_id is not null AND exists (
      select 1 from public.organization_members om
      where om.organization_id = public.logs.organization_id
      and om.user_id = auth.uid()
    ))
    OR
    (number_id is not null AND exists (
      select 1 from public.numbers n
      where n.id = public.logs.number_id
      and n.user_id = auth.uid()
    ))
  );

-- AUTOMATION JOBS Table (Simple Queue)
create table if not exists public.automation_jobs (
  id uuid default uuid_generate_v4() primary key,
  organization_id uuid references public.organizations(id),
  type text not null, -- 'sync_contacts', 'broadcast', 'check_status'
  payload jsonb,
  status text check (status in ('pending', 'processing', 'completed', 'failed')) default 'pending',
  run_at timestamp with time zone default timezone('utc'::text, now()),
  result jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for Jobs
alter table public.automation_jobs enable row level security;

drop policy if exists "Users can view jobs" on public.automation_jobs;
create policy "Users can view jobs" on public.automation_jobs
  for select using (
    exists (
      select 1 from public.organization_members om
      where om.organization_id = public.automation_jobs.organization_id
      and om.user_id = auth.uid()
    )
  );

drop policy if exists "Users can insert jobs for their orgs" on public.automation_jobs;
create policy "Users can insert jobs for their orgs" on public.automation_jobs
  for insert with check (
    exists (
      select 1 from public.organization_members om
      where om.organization_id = public.automation_jobs.organization_id
      and om.user_id = auth.uid()
    )
  );

drop policy if exists "Users can update jobs for their orgs" on public.automation_jobs;
create policy "Users can update jobs for their orgs" on public.automation_jobs
  for update using (
    exists (
      select 1 from public.organization_members om
      where om.organization_id = public.automation_jobs.organization_id
      and om.user_id = auth.uid()
    )
  );

```

# gitadd.sh

```sh
git add .
git commit -m "auto update"
git push origin main
```

# index.html

```html
<!doctype html>
<html lang="he" dir="rtl">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/svg+xml" href="/vite.svg" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>GreenBuilders - WhatsApp CRM Admin</title>
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>


```

# package.json

```json
{
  "name": "builders-admin-panel",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "scripts": {
    "dev": "vite",
    "build": "vite build",
    "preview": "vite preview"
  },
  "dependencies": {
    "@radix-ui/react-slot": "^1.2.4",
    "@supabase/supabase-js": "^2.87.1",
    "@tanstack/react-query": "^5.13.4",
    "class-variance-authority": "^0.7.0",
    "clsx": "^2.0.0",
    "framer-motion": "^10.16.5",
    "i18next": "^23.7.11",
    "lucide-react": "^0.294.0",
    "react": "^18.2.0",
    "react-dom": "^18.2.0",
    "react-i18next": "^13.5.0",
    "react-router-dom": "^6.20.0",
    "tailwind-merge": "^2.1.0"
  },
  "devDependencies": {
    "@types/react": "^18.2.43",
    "@types/react-dom": "^18.2.17",
    "@vitejs/plugin-react": "^4.2.1",
    "autoprefixer": "^10.4.16",
    "dotenv": "^16.3.1",
    "pg": "^8.16.3",
    "postcss": "^8.4.32",
    "tailwindcss": "^3.3.6",
    "vite": "^5.0.8"
  }
}

```

# postcss.config.js

```js
export default {
  plugins: {
    tailwindcss: {},
    autoprefixer: {},
  },
}

```

# push_to_main.bat

```bat
@echo off

set MSG=%~1
if "%MSG%"=="" set MSG=Update

echo Staging changes...
git add .

echo Committing with message: %MSG%
git commit -m "%MSG%"

echo Pushing to main...
git push origin main

echo Done!
pause

```

# README.md

```md
# Builders Admin Panel

פאנל ניהול ב-React לניהול משתמשים וחשבונות Green API.

## התקנה

\`\`\`bash
cd admin-panel
npm install
\`\`\`

## הרצה

\`\`\`bash
npm run dev
\`\`\`

האפליקציה תיפתח ב-`http://localhost:3000`

## Build לפרודקשן

\`\`\`bash
npm run build
\`\`\`

הקבצים יווצרו בתיקייה `dist/`

## מבנה הפרויקט

\`\`\`
admin-panel/
├── src/
│   ├── components/      # Components של React
│   │   ├── Login.jsx
│   │   ├── Dashboard.jsx
│   │   ├── UsersManagement.jsx
│   │   ├── AccountsManagement.jsx
│   │   └── Settings.jsx
│   ├── services/        # API calls
│   │   └── api.js
│   ├── styles/          # CSS files
│   ├── App.jsx
│   └── main.jsx
├── package.json
└── vite.config.js
\`\`\`

## API Endpoints

כל ה-API calls מתחברים ל-n8n webhooks:

- `/webhook/73539861-4649-4b44-ac5b-62a60677a9b8` - אימות משתמש
- `/webhook/getUsers` - רשימת משתמשים
- `/webhook/createUser` - יצירת משתמש
- `/webhook/updateUser` - עדכון משתמש
- `/webhook/deleteUser` - מחיקת משתמש

## תכונות

- ✅ התחברות משתמשים
- ✅ ניהול משתמשים (CRUD)
- 🚧 ניהול חשבונות (בפיתוח)
- 🚧 הגדרות (בפיתוח)


```

# reinit_git.ps1

```ps1
 
```

# scripts\deploy_schema.js

```js
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const schemaPath = path.join(__dirname, '..', 'supabase_schema.sql');
const outputPath = path.join(__dirname, '..', 'generated_supabase_schema.txt');

try {
    const schema = fs.readFileSync(schemaPath, 'utf8');

    // Write to a .txt file so it can be sent or uploaded easily
    fs.writeFileSync(outputPath, schema, 'utf8');

    console.log('\n--- SUPABASE SCHEMA DEPLOYMENT ---\n');
    console.log('A text file with the full SQL has been generated.\n');
    console.log(`File path: ${outputPath}\n`);
    console.log('You can attach or upload this file, or open it and paste the contents into Supabase Dashboard -> SQL Editor.\n');
} catch (err) {
    console.error('Error reading schema file:', err);
}

```

# scripts\push_api.js

```js
import dotenv from 'dotenv';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const token = process.env.SUPABASE_ACCESS_TOKEN;
const projectId = process.env.SUPABASE_PROJECT_ID;

if (!token || token.includes('YOUR_')) {
    console.error('ERROR: SUPABASE_ACCESS_TOKEN is missing or invalid in .env');
    console.error('Get one here: https://supabase.com/dashboard/account/tokens');
    process.exit(1);
}

if (!projectId) {
    console.error('ERROR: SUPABASE_PROJECT_ID is missing in .env');
    process.exit(1);
}

const schemaPath = path.join(__dirname, '..', 'supabase_schema.sql');
const apiUrl = `https://api.supabase.com/v1/projects/${projectId}/sql`;

async function pushSchema() {
    try {
        console.log(`Target Project ID: ${projectId}`);
        console.log('Reading schema file...');
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');

        console.log('Sending SQL to Supabase API...');

        const response = await fetch(apiUrl, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${token}`
            },
            body: JSON.stringify({
                query: schemaSql
            })
        });

        if (!response.ok) {
            const errorText = await response.text();
            throw new Error(`API Error (${response.status}): ${errorText}`);
        }

        console.log('SUCCESS: Schema successfully deployed!');
    } catch (err) {
        console.error('DEPLOYMENT FAILED:', err.message);
        process.exit(1);
    }
}

pushSchema();

```

# scripts\push_db.js

```js
import dotenv from 'dotenv';
import pg from 'pg';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

dotenv.config();

const { Client } = pg;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const schemaPath = path.join(__dirname, '..', 'supabase_schema.sql');

const dbUrl = process.env.DATABASE_URL;

async function pushSchema() {
    if (!dbUrl || dbUrl.includes('[PASSWORD]')) {
        console.error('ERROR: DATABASE_URL is invalid.');
        return fallback();
    }

    // Try to force port 6543 (Transaction Pooler) if 5432 fails or is set
    const connectionString = dbUrl.replace(':5432', ':6543');
    console.log(`Attempting connection to Port 6543 (Bypassing potential 5432 blocks)...`);

    const client = new Client({
        connectionString,
        ssl: { rejectUnauthorized: false },
        connectionTimeoutMillis: 5000, 
    });

    try {
        await client.connect();
        console.log('Connected to database!');
        
        const schemaSql = fs.readFileSync(schemaPath, 'utf8');
        await client.query(schemaSql);
        
        console.log('\n[SUCCESS] Database updated successfully.');
    } catch (err) {
        console.error('\n[ERROR] Connection Failed:', err.message);
        if (err.code === 'ETIMEDOUT') {
             console.error('Your network is blocking the database connection.');
        }
        fallback();
    } finally {
        await client.end().catch(() => {});
    }
}

function fallback() {
    console.log('\n==================================================');
    console.log('           MANUAL FALLBACK INSTRUCTIONS');
    console.log('==================================================');
    console.log('Since automation failed, please run this SQL manually:');
    console.log('1. Go to https://supabase.com/dashboard/project/_/sql');
    console.log('2. Paste the SQL below and run it:\n');
    
    try {
        const schema = fs.readFileSync(schemaPath, 'utf8');
        console.log(schema);
    } catch (e) { console.log('Error reading schema file'); }
    
    console.log('\n==================================================');
    process.exit(1);
}

pushSchema();

```

# SQL

```
Done. Scroll up, copy the SQL block, and paste it into Supabase Dashboard - Editor.

```

# src\App.jsx

```jsx
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './context/AuthContext'
import { LanguageProvider } from './context/LanguageContext'
import { ThemeProvider } from './context/ThemeContext'
import RootLayout from './layouts/RootLayout'
import DashboardLayout from './layouts/DashboardLayout'
import AuthLayout from './layouts/AuthLayout'
import LandingPage from './pages/LandingPage'
import Login from './pages/Login'
import Signup from './pages/Signup'
import Dashboard from './pages/Dashboard'
import Chats from './pages/Chats'
import Numbers from './pages/Numbers'
import Webhooks from './pages/Webhooks'
import Logs from './pages/Logs'
import Automation from './pages/Automation'
import Settings from './pages/Settings'
import Extension from './pages/Extension'
import './index.css'

function App() {
  return (
    <BrowserRouter>
      <LanguageProvider>
        <ThemeProvider>
          <AuthProvider>
            <Routes>
              <Route element={<RootLayout />}>
                {/* Public */}
                <Route path="/" element={<LandingPage />} />

                {/* Auth */}
                <Route element={<AuthLayout />}>
                  <Route path="/login" element={<Login />} />
                  <Route path="/signup" element={<Signup />} />
                </Route>

                {/* Dashboard */}
                <Route path="/app" element={<DashboardLayout />}>
                  <Route index element={<Navigate to="/app/dashboard" replace />} />
                  <Route path="dashboard" element={<Dashboard />} />
                  <Route path="chats" element={<Chats />} />
                  <Route path="numbers" element={<Numbers />} />
                  <Route path="webhooks" element={<Webhooks />} />
                  <Route path="logs" element={<Logs />} />
                  <Route path="automation" element={<Automation />} />
                  <Route path="settings" element={<Settings />} />
                  <Route path="extension" element={<Extension />} />
                </Route>
              </Route>
            </Routes>
          </AuthProvider>
        </ThemeProvider>
      </LanguageProvider>
    </BrowserRouter>
  )
}

export default App

```

# src\components\AccountsManagement.jsx

```jsx
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from './ui/table';
import { Plus, Trash2, RefreshCw, CheckCircle2, XCircle } from 'lucide-react';

export default function AccountsManagement() {
    const { t } = useTranslation();
    const { user } = useAuth();
    const [accounts, setAccounts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchAccounts();
    }, [user]);

    const fetchAccounts = async () => {
        if (!user) return;
        
        try {
            setLoading(true);
            // Fetch numbers which represent Green-API accounts
            const { data, error } = await supabase
                .from('numbers')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setAccounts(data || []);
        } catch (error) {
            console.error('Error fetching accounts:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleDelete = async (accountId) => {
        if (!confirm(t('common.confirm_delete'))) return;

        try {
            const { error } = await supabase
                .from('numbers')
                .delete()
                .eq('id', accountId);

            if (error) throw error;
            fetchAccounts();
        } catch (error) {
            console.error('Error deleting account:', error);
            alert(error.message);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">{t('accounts_management.title')}</h2>
                    <p className="text-muted-foreground">{t('accounts_management.subtitle')}</p>
                </div>
                <Button onClick={fetchAccounts} variant="outline">
                    <RefreshCw className="mr-2 h-4 w-4" />
                    {t('common.refresh')}
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>{t('accounts_management.list_title')}</CardTitle>
                    <CardDescription>{t('accounts_management.list_desc')}</CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="text-center py-8 text-muted-foreground">{t('common.loading')}</div>
                    ) : accounts.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">{t('common.no_data')}</div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>{t('numbers_page.phone_number')}</TableHead>
                                    <TableHead>{t('common.instance_id')}</TableHead>
                                    <TableHead>{t('status')}</TableHead>
                                    <TableHead>{t('common.date')}</TableHead>
                                    <TableHead className="text-right">{t('common.actions')}</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {accounts.map((account) => (
                                    <TableRow key={account.id}>
                                        <TableCell className="font-medium">
                                            {account.phone_number || '-'}
                                        </TableCell>
                                        <TableCell>
                                            <code className="text-xs bg-muted px-2 py-1 rounded">
                                                {account.instance_id || '-'}
                                            </code>
                                        </TableCell>
                                        <TableCell>
                                            {account.status === 'active' ? (
                                                <div className="flex items-center gap-2">
                                                    <CheckCircle2 className="h-4 w-4 text-green-500" />
                                                    <span className="text-sm">{t('connected')}</span>
                                                </div>
                                            ) : (
                                                <div className="flex items-center gap-2">
                                                    <XCircle className="h-4 w-4 text-red-500" />
                                                    <span className="text-sm">{t('disconnected')}</span>
                                                </div>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {new Date(account.created_at).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <Button
                                                variant="ghost"
                                                size="icon"
                                                onClick={() => handleDelete(account.id)}
                                            >
                                                <Trash2 className="h-4 w-4" />
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

```

# src\components\Dashboard.jsx

```jsx
import { useState } from 'react'
import '../styles/Dashboard.css'
import UsersManagement from './UsersManagement'
import AccountsManagement from './AccountsManagement'
import Settings from './Settings'

function Dashboard({ user, onLogout }) {
  const [activeTab, setActiveTab] = useState('users')

  return (
    <div className="dashboard">
      <header className="dashboard-header">
        <div className="header-left">
          <h1>Builders Admin Panel</h1>
        </div>
        <div className="header-right">
          <span className="user-info">שלום, {user?.username || 'משתמש'}</span>
          <button onClick={onLogout} className="logout-button">
            התנתק
          </button>
        </div>
      </header>

      <nav className="dashboard-nav">
        <button
          className={activeTab === 'users' ? 'active' : ''}
          onClick={() => setActiveTab('users')}
        >
          ניהול משתמשים
        </button>
        <button
          className={activeTab === 'accounts' ? 'active' : ''}
          onClick={() => setActiveTab('accounts')}
        >
          ניהול חשבונות
        </button>
        <button
          className={activeTab === 'settings' ? 'active' : ''}
          onClick={() => setActiveTab('settings')}
        >
          הגדרות
        </button>
      </nav>

      <main className="dashboard-content">
        {activeTab === 'users' && <UsersManagement />}
        {activeTab === 'accounts' && <AccountsManagement />}
        {activeTab === 'settings' && <Settings />}
      </main>
    </div>
  )
}

export default Dashboard


```

# src\components\Header.jsx

```jsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate, useLocation } from 'react-router-dom';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';
import { Button } from './ui/button';
import { Sun, Moon, Languages, LogOut, ChevronRight, Home } from 'lucide-react';

export function Header() {
    const { theme, toggleTheme } = useTheme();
    const { toggleLang, lang } = useLanguage();
    const { user, signOut } = useAuth();
    const { t } = useTranslation();
    const navigate = useNavigate();
    const location = useLocation();

    const handleSignOut = async () => {
        await signOut();
        navigate('/login', { replace: true });
    };

    const getBreadcrumbs = () => {
        const path = location.pathname;
        const parts = path.split('/').filter(Boolean);
        
        if (parts.length === 0 || (parts.length === 1 && parts[0] === 'app')) {
            return [{ label: t('dashboard'), path: '/app/dashboard' }];
        }

        const breadcrumbs = [{ label: t('dashboard'), path: '/app/dashboard' }];
        
        const routeMap = {
            'dashboard': t('dashboard'),
            'chats': t('chats'),
            'numbers': t('numbers'),
            'webhooks': t('webhooks'),
            'logs': t('logs'),
            'automation': t('automation'),
            'settings': t('settings'),
            'extension': t('extension'),
            'plans': t('landing.plans.select'),
        };

        if (parts[0] === 'app' && parts[1]) {
            const page = parts[1];
            if (routeMap[page]) {
                breadcrumbs.push({ label: routeMap[page], path: `/app/${page}` });
            }
        }

        return breadcrumbs;
    };

    const breadcrumbs = getBreadcrumbs();

    return (
        <header className="flex h-16 items-center border-b bg-background px-6 justify-between sticky top-0 z-10">
            <div className="flex items-center gap-2 font-semibold text-lg">
                {breadcrumbs.map((crumb, index) => (
                    <React.Fragment key={crumb.path}>
                        {index > 0 && <ChevronRight className="h-4 w-4 text-muted-foreground" />}
                        {index === breadcrumbs.length - 1 ? (
                            <span className="text-foreground">{crumb.label}</span>
                        ) : (
                            <button
                                onClick={() => navigate(crumb.path)}
                                className="text-muted-foreground hover:text-foreground transition-colors"
                            >
                                {index === 0 ? <Home className="h-4 w-4" /> : crumb.label}
                            </button>
                        )}
                    </React.Fragment>
                ))}
            </div>

            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={toggleTheme}>
                    {theme === 'dark' ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
                </Button>

                <Button variant="ghost" size="icon" onClick={toggleLang} title={lang === 'en' ? 'Switch to Hebrew' : 'Switch to English'}>
                    <Languages className="h-5 w-5" />
                    <span className="sr-only">Display Language</span>
                </Button>

                <div className="flex items-center gap-2 border-l pl-4 ml-2 rtl:border-r rtl:border-l-0 rtl:pr-4 rtl:pl-0">
                    <div className="text-sm font-medium hidden sm:block">
                        {user?.email}
                    </div>
                    <Button variant="ghost" size="icon" onClick={handleSignOut} title={t('logout')}>
                        <LogOut className="h-5 w-5" />
                    </Button>
                </div>
            </div>
        </header>
    );
}

```

# src\components\Login.jsx

```jsx
import { useState } from 'react'
import { login } from '../services/api'
import '../styles/Login.css'

function Login({ onLogin }) {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    const result = await login(username, password)

    if (result.success && result.data) {
      const { data } = result
      
      // Check if user is authenticated
      if ((data.exists === true || data.success === true) && data.active === true) {
        onLogin({
          username: data.username || username,
          userId: data.userId,
          ...data,
        })
      } else if (data.exists === false) {
        setError('משתמש לא נמצא במערכת')
      } else if (data.active === false) {
        setError('המשתמש לא פעיל')
      } else {
        setError('פרטים לא תקינים')
      }
    } else {
      setError(result.error || 'שגיאה בהתחברות')
    }

    setLoading(false)
  }

  return (
    <div className="login-container">
      <div className="login-card">
        <div className="login-header">
          <h1>Builders</h1>
          <p>Admin Panel</p>
        </div>
        
        <form onSubmit={handleSubmit} className="login-form">
          <div className="form-group">
            <label htmlFor="username">שם משתמש</label>
            <input
              id="username"
              type="text"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
              autoComplete="username"
              placeholder="הכנס שם משתמש"
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">סיסמה</label>
            <input
              id="password"
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              autoComplete="current-password"
              placeholder="הכנס סיסמה"
            />
          </div>

          {error && <div className="error-message">{error}</div>}

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'מתחבר...' : 'התחבר'}
          </button>
        </form>
      </div>
    </div>
  )
}

export default Login


```

# src\components\MainLayout.jsx

```jsx
import { useState } from 'react';
import Sidebar from './Sidebar';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import { useAuth } from '../context/AuthContext';

export default function MainLayout({ children }) {
    const [isSidebarOpen, setSidebarOpen] = useState(false);
    const { theme, toggleTheme } = useTheme();
    const { lang, toggleLang, t } = useLanguage();
    const { signOut, user } = useAuth();

    return (
        <div className="flex min-h-screen bg-[var(--bg-primary)] text-[var(--text-primary)]">
            {/* Sidebar */}
            <Sidebar isOpen={isSidebarOpen} toggleSidebar={() => setSidebarOpen(!isSidebarOpen)} />

            {/* Backdrop for mobile */}
            {isSidebarOpen && (
                <div
                    className="fixed inset-0 z-30 bg-black/50 lg:hidden"
                    onClick={() => setSidebarOpen(false)}
                />
            )}

            {/* Main Content Area */}
            <div className="flex-1 flex flex-col min-w-0">

                {/* Header */}
                <header className="h-[var(--header-height)] sticky top-0 z-20 bg-[var(--bg-glass)] backdrop-blur-md border-b border-[var(--border-color)] flex items-center justify-between px-6">
                    <button
                        className="lg:hidden p-2 rounded hover:bg-[var(--bg-secondary)]"
                        onClick={() => setSidebarOpen(true)}
                    >
                        ☰
                    </button>

                    <div className="flex-1"></div>

                    <div className="flex items-center gap-4">
                        <button
                            onClick={toggleLang}
                            className="p-2 rounded hover:bg-[var(--bg-secondary)] font-bold text-sm"
                        >
                            {lang === 'en' ? '🇮🇱 HE' : '🇺🇸 EN'}
                        </button>

                        <button
                            onClick={toggleTheme}
                            className="p-2 rounded hover:bg-[var(--bg-secondary)] text-xl"
                            title="Toggle Theme"
                        >
                            {theme === 'dark' ? '☀️' : '🌙'}
                        </button>

                        <div className="h-6 w-px bg-[var(--border-color)] mx-2"></div>

                        <div className="flex items-center gap-3">
                            <span className="hidden md:block text-sm font-medium opacity-80">{user?.email}</span>
                            <button
                                onClick={signOut}
                                className="text-sm bg-[var(--bg-secondary)] border border-[var(--border-color)] px-3 py-1.5 rounded hover:border-[var(--status-error)] hover:text-[var(--status-error)] transition-colors"
                            >
                                {t('logout')}
                            </button>
                        </div>
                    </div>
                </header>

                {/* Page Content */}
                <main className="flex-1 p-6 overflow-auto">
                    <div className="max-w-6xl mx-auto space-y-6 animate-fade-in">
                        {children}
                    </div>
                </main>

                {/* Footer */}
                <footer className="py-4 text-center text-sm text-[var(--text-secondary)] border-t border-[var(--border-color)]">
                    &copy; {new Date().getFullYear()} Builders Extension. All rights reserved.
                </footer>
            </div>
        </div>
    );
}

```

# src\components\Settings.jsx

```jsx
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { User, Mail, Image, Bell, Lock } from 'lucide-react';

export default function Settings() {
    const { t } = useTranslation();
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        avatar_url: ''
    });

    useEffect(() => {
        fetchProfile();
    }, [user]);

    const fetchProfile = async () => {
        if (!user) return;
        
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (error) throw error;
            setProfile(data);
            setFormData({
                full_name: data.full_name || '',
                email: data.email || user.email || '',
                avatar_url: data.avatar_url || ''
            });
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        if (!user) return;

        try {
            setSaving(true);
            const { error } = await supabase
                .from('profiles')
                .update({
                    full_name: formData.full_name,
                    email: formData.email,
                    avatar_url: formData.avatar_url
                })
                .eq('id', user.id);

            if (error) throw error;
            alert(t('settings_page.profile_updated'));
            fetchProfile();
        } catch (error) {
            console.error('Error updating profile:', error);
            alert(error.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="text-center py-8 text-muted-foreground">{t('common.loading')}</div>;
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">{t('settings')}</h2>
                <p className="text-muted-foreground">{t('settings_page.subtitle')}</p>
            </div>

            {/* Profile Settings */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        {t('settings_page.profile')}
                    </CardTitle>
                    <CardDescription>{t('settings_page.general')}</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSaveProfile} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium flex items-center gap-2">
                                <User className="h-4 w-4" />
                                {t('settings_page.full_name')}
                            </label>
                            <Input
                                value={formData.full_name}
                                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                placeholder={t('settings_page.full_name')}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium flex items-center gap-2">
                                <Mail className="h-4 w-4" />
                                {t('settings_page.email')}
                            </label>
                            <Input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder={t('settings_page.email')}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium flex items-center gap-2">
                                <Image className="h-4 w-4" />
                                {t('settings_page.avatar_url')}
                            </label>
                            <Input
                                type="url"
                                value={formData.avatar_url}
                                onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
                                placeholder="https://example.com/avatar.jpg"
                            />
                            {formData.avatar_url && (
                                <img
                                    src={formData.avatar_url}
                                    alt="Avatar"
                                    className="w-16 h-16 rounded-full object-cover"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                    }}
                                />
                            )}
                        </div>
                        <Button type="submit" disabled={saving}>
                            {saving ? t('common.loading') : t('settings_page.update_profile')}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {/* Notifications */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Bell className="h-5 w-5" />
                        {t('settings_page.notifications')}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium">{t('settings_page.email_notifications')}</p>
                                <p className="text-sm text-muted-foreground">
                                    Receive email notifications for important events
                                </p>
                            </div>
                            <input type="checkbox" defaultChecked className="rounded" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Security */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Lock className="h-5 w-5" />
                        {t('settings_page.security')}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                            {t('settings_page.change_password_info')}
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

```

# src\components\Sidebar.jsx

```jsx
import React from 'react';
import { NavLink } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { cn } from '../lib/utils';
import { LayoutDashboard, Smartphone, Settings, FileText, Bot, Webhook, Chrome, MessageSquare } from 'lucide-react';

export function Sidebar({ className }) {
    const { t } = useTranslation();

    const links = [
        { href: '/app/dashboard', label: t('dashboard'), icon: LayoutDashboard },
        { href: '/app/chats', label: t('chats'), icon: MessageSquare },
        { href: '/app/numbers', label: t('numbers'), icon: Smartphone },
        { href: '/app/webhooks', label: t('webhooks'), icon: Webhook },
        { href: '/app/logs', label: t('logs'), icon: FileText },
        { href: '/app/automation', label: t('automation'), icon: Bot },
        { href: '/app/settings', label: t('settings'), icon: Settings },
        { href: '/app/extension', label: t('extension'), icon: Chrome },
    ];

    return (
        <div className={cn("pb-12 w-64 border-r bg-card h-screen sticky top-0", className)}>
            <div className="space-y-4 py-4">
                <div className="px-3 py-2">
                    <h2 className="mb-2 px-4 text-lg font-semibold tracking-tight text-primary">
                        GreenManager
                    </h2>
                    <div className="space-y-1">
                        {links.map((link) => (
                            <NavLink
                                key={link.href}
                                to={link.href}
                                className={({ isActive }) =>
                                    cn(
                                        "flex items-center rounded-md px-3 py-2 text-sm font-medium hover:bg-accent hover:text-accent-foreground transition-all",
                                        isActive ? "bg-accent text-accent-foreground shadow-sm" : "transparent"
                                    )
                                }
                            >
                                <link.icon className="mr-2 h-4 w-4 rtl:ml-2 rtl:mr-0" />
                                <span>{link.label}</span>
                            </NavLink>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}

```

# src\components\ui\button.jsx

```jsx
import * as React from "react"
import { Slot } from "@radix-ui/react-slot"
import { cva } from "class-variance-authority"
import { cn } from "../../lib/utils"

const buttonVariants = cva(
    "inline-flex items-center justify-center whitespace-nowrap rounded-md text-sm font-medium ring-offset-background transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50",
    {
        variants: {
            variant: {
                default: "bg-primary text-primary-foreground hover:bg-primary/90",
                destructive:
                    "bg-destructive text-destructive-foreground hover:bg-destructive/90",
                outline:
                    "border border-input bg-background hover:bg-accent hover:text-accent-foreground",
                secondary:
                    "bg-secondary text-secondary-foreground hover:bg-secondary/80",
                ghost: "hover:bg-accent hover:text-accent-foreground",
                link: "text-primary underline-offset-4 hover:underline",
            },
            size: {
                default: "h-10 px-4 py-2",
                sm: "h-9 rounded-md px-3",
                lg: "h-11 rounded-md px-8",
                icon: "h-10 w-10",
            },
        },
        defaultVariants: {
            variant: "default",
            size: "default",
        },
    }
)

const Button = React.forwardRef(({ className, variant, size, asChild = false, ...props }, ref) => {
    const Comp = asChild ? Slot : "button"
    return (
        <Comp
            className={cn(buttonVariants({ variant, size, className }))}
            ref={ref}
            {...props}
        />
    )
})
Button.displayName = "Button"

export { Button, buttonVariants }

```

# src\components\ui\card.jsx

```jsx
import * as React from "react"
import { cn } from "../../lib/utils"

const Card = React.forwardRef(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn(
            "rounded-lg border bg-card text-card-foreground shadow-sm",
            className
        )}
        {...props}
    />
))
Card.displayName = "Card"

const CardHeader = React.forwardRef(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("flex flex-col space-y-1.5 p-6", className)}
        {...props}
    />
))
CardHeader.displayName = "CardHeader"

const CardTitle = React.forwardRef(({ className, ...props }, ref) => (
    <h3
        ref={ref}
        className={cn(
            "text-2xl font-semibold leading-none tracking-tight",
            className
        )}
        {...props}
    />
))
CardTitle.displayName = "CardTitle"

const CardDescription = React.forwardRef(({ className, ...props }, ref) => (
    <p
        ref={ref}
        className={cn("text-sm text-muted-foreground", className)}
        {...props}
    />
))
CardDescription.displayName = "CardDescription"

const CardContent = React.forwardRef(({ className, ...props }, ref) => (
    <div ref={ref} className={cn("p-6 pt-0", className)} {...props} />
))
CardContent.displayName = "CardContent"

const CardFooter = React.forwardRef(({ className, ...props }, ref) => (
    <div
        ref={ref}
        className={cn("flex items-center p-6 pt-0", className)}
        {...props}
    />
))
CardFooter.displayName = "CardFooter"

export { Card, CardHeader, CardFooter, CardTitle, CardDescription, CardContent }

```

# src\components\ui\input.jsx

```jsx
import * as React from "react"
import { cn } from "../../lib/utils"

const Input = React.forwardRef(({ className, type, ...props }, ref) => (
    <input
        type={type}
        className={cn(
            "flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50",
            className
        )}
        ref={ref}
        {...props}
    />
))
Input.displayName = "Input"

export { Input }

```

# src\components\ui\table.jsx

```jsx
import * as React from "react"
import { cn } from "../../lib/utils"

const Table = React.forwardRef(({ className, ...props }, ref) => (
    <div className="relative w-full overflow-auto">
        <table
            ref={ref}
            className={cn("w-full caption-bottom text-sm", className)}
            {...props}
        />
    </div>
))
Table.displayName = "Table"

const TableHeader = React.forwardRef(({ className, ...props }, ref) => (
    <thead ref={ref} className={cn("[&_tr]:border-b", className)} {...props} />
))
TableHeader.displayName = "TableHeader"

const TableBody = React.forwardRef(({ className, ...props }, ref) => (
    <tbody
        ref={ref}
        className={cn("[&_tr:last-child]:border-0", className)}
        {...props}
    />
))
TableBody.displayName = "TableBody"

const TableFooter = React.forwardRef(({ className, ...props }, ref) => (
    <tfoot
        ref={ref}
        className={cn(
            "border-t bg-muted/50 font-medium [&>tr]:last:border-b-0",
            className
        )}
        {...props}
    />
))
TableFooter.displayName = "TableFooter"

const TableRow = React.forwardRef(({ className, ...props }, ref) => (
    <tr
        ref={ref}
        className={cn(
            "border-b transition-colors hover:bg-muted/50 data-[state=selected]:bg-muted",
            className
        )}
        {...props}
    />
))
TableRow.displayName = "TableRow"

const TableHead = React.forwardRef(({ className, ...props }, ref) => (
    <th
        ref={ref}
        className={cn(
            "h-12 px-4 text-left rtl:text-right align-middle font-medium text-muted-foreground [&:has([role=checkbox])]:pr-0",
            className
        )}
        {...props}
    />
))
TableHead.displayName = "TableHead"

const TableCell = React.forwardRef(({ className, ...props }, ref) => (
    <td
        ref={ref}
        className={cn("p-4 align-middle [&:has([role=checkbox])]:pr-0", className)}
        {...props}
    />
))
TableCell.displayName = "TableCell"

const TableCaption = React.forwardRef(({ className, ...props }, ref) => (
    <caption
        ref={ref}
        className={cn("mt-4 text-sm text-muted-foreground", className)}
        {...props}
    />
))
TableCaption.displayName = "TableCaption"

export {
    Table,
    TableHeader,
    TableBody,
    TableFooter,
    TableHead,
    TableRow,
    TableCell,
    TableCaption,
}

```

# src\components\UsersManagement.jsx

```jsx
import { useState, useEffect } from 'react'
import { getUsers, createUser, updateUser, deleteUser } from '../services/api'
import '../styles/UsersManagement.css'

function UsersManagement() {
  const [users, setUsers] = useState([])
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState('')
  const [showAddModal, setShowAddModal] = useState(false)
  const [editingUser, setEditingUser] = useState(null)

  useEffect(() => {
    loadUsers()
  }, [])

  const loadUsers = async () => {
    setLoading(true)
    setError('')
    
    const result = await getUsers()
    
    if (result.success) {
      // Assuming the API returns { users: [...] } or direct array
      const usersList = result.data?.users || result.data || []
      setUsers(Array.isArray(usersList) ? usersList : [])
    } else {
      setError('שגיאה בטעינת משתמשים: ' + result.error)
    }
    
    setLoading(false)
  }

  const handleAddUser = async (userData) => {
    const result = await createUser(userData)
    
    if (result.success) {
      setShowAddModal(false)
      loadUsers()
    } else {
      setError('שגיאה ביצירת משתמש: ' + result.error)
    }
  }

  const handleUpdateUser = async (userId, userData) => {
    const result = await updateUser(userId, userData)
    
    if (result.success) {
      setEditingUser(null)
      loadUsers()
    } else {
      setError('שגיאה בעדכון משתמש: ' + result.error)
    }
  }

  const handleDeleteUser = async (userId) => {
    if (!confirm('האם אתה בטוח שברצונך למחוק את המשתמש?')) {
      return
    }

    const result = await deleteUser(userId)
    
    if (result.success) {
      loadUsers()
    } else {
      setError('שגיאה במחיקת משתמש: ' + result.error)
    }
  }

  return (
    <div className="users-management">
      <div className="section-header">
        <h2>ניהול משתמשים</h2>
        <button className="add-button" onClick={() => setShowAddModal(true)}>
          + הוסף משתמש
        </button>
      </div>

      {error && <div className="error-message">{error}</div>}

      {loading ? (
        <div className="loading">טוען משתמשים...</div>
      ) : (
        <div className="users-table">
          <table>
            <thead>
              <tr>
                <th>שם משתמש</th>
                <th>סטטוס</th>
                <th>חשבונות</th>
                <th>פעולות</th>
              </tr>
            </thead>
            <tbody>
              {users.length === 0 ? (
                <tr>
                  <td colSpan="4" className="empty-state">
                    אין משתמשים
                  </td>
                </tr>
              ) : (
                users.map((user) => (
                  <tr key={user.id || user.userId}>
                    <td>{user.username}</td>
                    <td>
                      <span className={`status ${user.active ? 'active' : 'inactive'}`}>
                        {user.active ? 'פעיל' : 'לא פעיל'}
                      </span>
                    </td>
                    <td>{user.accounts?.length || 0} חשבונות</td>
                    <td>
                      <button
                        className="edit-button"
                        onClick={() => setEditingUser(user)}
                      >
                        ערוך
                      </button>
                      <button
                        className="delete-button"
                        onClick={() => handleDeleteUser(user.id || user.userId)}
                      >
                        מחק
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}

      {showAddModal && (
        <UserModal
          onClose={() => setShowAddModal(false)}
          onSave={handleAddUser}
        />
      )}

      {editingUser && (
        <UserModal
          user={editingUser}
          onClose={() => setEditingUser(null)}
          onSave={(userData) => handleUpdateUser(editingUser.id || editingUser.userId, userData)}
        />
      )}
    </div>
  )
}

function UserModal({ user, onClose, onSave }) {
  const [formData, setFormData] = useState({
    username: user?.username || '',
    password: '',
    active: user?.active !== undefined ? user.active : true,
  })

  const handleSubmit = (e) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <div className="modal-overlay" onClick={onClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <h3>{user ? 'ערוך משתמש' : 'הוסף משתמש'}</h3>
        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label>שם משתמש</label>
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value })}
              required
            />
          </div>
          {!user && (
            <div className="form-group">
              <label>סיסמה</label>
              <input
                type="password"
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                required={!user}
              />
            </div>
          )}
          <div className="form-group">
            <label>
              <input
                type="checkbox"
                checked={formData.active}
                onChange={(e) => setFormData({ ...formData, active: e.target.checked })}
              />
              משתמש פעיל
            </label>
          </div>
          <div className="modal-actions">
            <button type="button" onClick={onClose}>
              ביטול
            </button>
            <button type="submit">שמור</button>
          </div>
        </form>
      </div>
    </div>
  )
}

export default UsersManagement


```

# src\context\AuthContext.jsx

```jsx
import { createContext, useContext, useState, useEffect } from 'react';
import { supabase } from '../lib/supabaseClient';

const AuthContext = createContext();

export function AuthProvider({ children }) {
    const [session, setSession] = useState(null);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        // Set loading to false after a timeout to prevent infinite loading
        const timeout = setTimeout(() => {
            setLoading(false);
        }, 1000);

        supabase.auth.getSession().then(({ data: { session }, error }) => {
            clearTimeout(timeout);
            if (error) {
                console.error('Error getting session:', error);
                // Don't block app if auth fails - might be 404 from missing schema
            }
            setSession(session);
            setUser(session?.user ?? null);
            setLoading(false);
        }).catch((error) => {
            clearTimeout(timeout);
            console.error('Failed to get session:', error);
            setLoading(false);
        });

        let subscription;
        try {
            const { data } = supabase.auth.onAuthStateChange((_event, session) => {
                setSession(session);
                setUser(session?.user ?? null);
                setLoading(false);
            });
            subscription = data?.subscription;
        } catch (error) {
            console.error('Failed to set up auth listener:', error);
            setLoading(false);
        }

        return () => {
            clearTimeout(timeout);
            subscription?.unsubscribe();
        };
    }, []);

    const signIn = async (credentials) => {
        return await supabase.auth.signInWithPassword(credentials);
    };

    const signUp = async (credentials) => {
        return await supabase.auth.signUp(credentials);
    };

    const signOut = async () => {
        const { error } = await supabase.auth.signOut();
        if (!error) {
            setSession(null);
            setUser(null);
        }
        return { error };
    };

    const value = {
        session,
        user,
        signIn,
        signUp,
        signOut,
    };

    return (
        <AuthContext.Provider value={value}>
            {loading ? (
                <div className="flex items-center justify-center min-h-screen">
                    <div className="text-muted-foreground">Loading...</div>
                </div>
            ) : (
                children
            )}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}

```

# src\context\LanguageContext.jsx

```jsx
import { createContext, useContext, useState, useEffect } from 'react';
import i18n from '../i18n';

const LanguageContext = createContext();

export function LanguageProvider({ children }) {
    const [lang, setLang] = useState(localStorage.getItem('lang') || 'en');

    useEffect(() => {
        document.documentElement.dir = lang === 'he' ? 'rtl' : 'ltr';
        document.documentElement.lang = lang;
        localStorage.setItem('lang', lang);
        // Sync i18next language with our context
        if (i18n.language !== lang) {
            i18n.changeLanguage(lang);
        }
    }, [lang]);

    // Proxy to i18next so everything uses a single translation source
    const t = (key, options) => i18n.t(key, options);

    const toggleLang = () => {
        setLang(prev => prev === 'en' ? 'he' : 'en');
    };

    return (
        <LanguageContext.Provider value={{ lang, setLang, toggleLang, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export const useLanguage = () => useContext(LanguageContext);

```

# src\context\ThemeContext.jsx

```jsx
import { createContext, useContext, useEffect, useState } from 'react';

const ThemeContext = createContext();

export function ThemeProvider({ children }) {
    // Check local storage or system preference
    const [theme, setTheme] = useState(() => {
        if (typeof window !== 'undefined') {
            const saved = localStorage.getItem('theme');
            if (saved) return saved;
            return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
        }
        return 'light';
    });

    useEffect(() => {
        const root = window.document.documentElement;
        if (theme === 'dark') {
            root.classList.add('dark');
        } else {
            root.classList.remove('dark');
        }
        localStorage.setItem('theme', theme);
    }, [theme]);

    const toggleTheme = () => {
        setTheme(prev => prev === 'light' ? 'dark' : 'light');
    };

    return (
        <ThemeContext.Provider value={{ theme, toggleTheme }}>
            {children}
        </ThemeContext.Provider>
    );
}

export const useTheme = () => useContext(ThemeContext);

```

# src\i18n.js

```js
import i18n from 'i18next';
import { initReactI18next } from 'react-i18next';

const resources = {
    "en": {
        "translation": {
            "dashboard": "Dashboard",
            "dashboard.overview_desc": "Activity overview and statistics",
            "dashboard.chart_coming_soon": "Analytics Chart Coming Soon",
            "dashboard.chart_desc": "Message volume, error rates, and usage trends will be displayed here",
            "numbers": "Numbers",
            "chats": "Chats",
            "settings": "Settings",
            "logout": "Log Out",
            "welcome": "Welcome back",
            "status": "Status",
            "connected": "Connected",
            "disconnected": "Disconnected",
            "add_number": "Add Number",
            "webhooks": "Webhooks",
            "logs": "Logs",
            "automation": "Automation",
            "extension": "Extension",
            "total_numbers": "Total Numbers",
            "active": "Active",
            "system_status": "System Status",
            "healthy": "Healthy",
            "all_systems_operational": "All systems operational",
            "recent_errors": "Recent Errors",
            "last_24_hours": "Last 24 hours",
            "api_usage": "API Usage",
            "requests_today": "Requests today",
            "overview": "Overview",
            "recent_activity": "Recent Activity",
            "latest_actions": "Latest actions performed.",
            "instance_synced": "Instance synced",
            "synced_successfully": "synced successfully",
            "ago": "ago",
            "chart_placeholder": "Chart Placeholder",
            "common": {
                "name": "Name",
                "actions": "Actions",
                "filter": "Filter",
                "instance_id": "Instance ID",
                "last_seen": "Last Seen",
                "type": "Type",
                "date": "Date",
                "search": "Search",
                "save": "Save",
                "cancel": "Cancel",
                "delete": "Delete",
                "edit": "Edit",
                "add": "Add",
                "close": "Close",
                "confirm": "Confirm",
                "loading": "Loading...",
                "no_data": "No data available",
                "refresh": "Refresh",
                "confirm_delete": "Are you sure you want to delete this item?",
                "sync": "Sync",
                "syncing": "Syncing..."
            },
            "numbers_page": {
                "title": "Numbers",
                "subtitle": "Manage your Green-API instances.",
                "list_title": "Instances",
                "list_desc": "List of all connected WhatsApp instances.",
                "search_placeholder": "Filter instances...",
                "refresh": "Refresh",
                "delete_instance": "Delete Instance",
                "phone_number": "Phone Number"
            },
            "chats_page": {
                "title": "Chats",
                "subtitle": "Manage your WhatsApp conversations",
                "select_number": "Select a number",
                "no_number_selected": "No number selected",
                "no_chats": "No chats available",
                "search_chats": "Search or start new chat",
                "type_message": "Type a message...",
                "send": "Send",
                "new_chat": "New Chat",
                "chat_with": "Chat with",
                "open_image": "Open Image",
                "open_video": "Open Video",
                "video_message": "Video Message",
                "audio_not_available": "Audio message (not available for download)",
                "document_message": "Document Message",
                "download_document": "Download Document",
                "sticker_message": "Sticker",
                "view_sticker": "View Sticker",
                "location_message": "Location",
                "view_location": "View Location",
                "online_status": "Online"
            },
            "login": {
                "title": "Welcome Back",
                "subtitle": "Enter your credentials to access your account",
                "email": "Email",
                "password": "Password",
                "submit": "Sign In",
                "forgot_password": "Forgot password?",
                "no_account": "Don't have an account?"
            },
            "signup": {
                "title": "Create an account",
                "subtitle": "Enter your information below to create your account",
                "full_name": "Full Name",
                "email": "Email",
                "password": "Password",
                "password_hint": "Password must be at least 6 characters",
                "create_account": "Create Account",
                "creating": "Creating account...",
                "check_email": "Check your email",
                "account_created": "Account created! Please check your email to confirm your account.",
                "already_have_account": "Already have an account?"
            },
            "landing": {
                "hero_title": "Manage Green-API Numbers in One Place",
                "hero_subtitle": "Enterprise-grade dashboard for monitoring, logging, and automating your WhatsApp infrastructure.",
                "get_started": "Get Started",
                "features": "Features",
                "pricing": "Pricing",
                "view_demo": "View Demo",
                "footer": "Built by Builders..",
                "features_list": {
                    "instant_connection": "Instant Connection",
                    "instant_connection_desc": "Connect your WA instances in seconds with QR code scanning.",
                    "auto_recovery": "Auto-Recovery",
                    "auto_recovery_desc": "Automatic webhook retries and disconnection alerts.",
                    "secure_tokens": "Secure Tokens",
                    "secure_tokens_desc": "Encrypted storage for all your API keys and secrets.",
                    "real_time_analytics": "Real-time Analytics",
                    "real_time_analytics_desc": "Monitor message throughput and error rates live.",
                    "role_management": "Role Management",
                    "role_management_desc": "Granular permissions for admins and team members.",
                    "uptime": "99.9% Uptime",
                    "uptime_desc": "Built on reliable infrastructure for mission-critical apps."
                },
                "plans": {
                    "free": "Free",
                    "pro": "Pro",
                    "agency": "Agency",
                    "popular": "Popular",
                    "features": "Features",
                    "select": "Choose Plan",
                    "month": "/month",
                    "numbers": "Numbers",
                    "users": "Users",
                    "team_members": "Team Members",
                    "basic_webhooks": "Basic Webhooks",
                    "advanced_webhooks": "Advanced webhooks",
                    "priority_log_retention": "Priority Log Retention",
                    "dedicated_support": "Dedicated Support",
                    "custom_integrations": "Custom Integrations",
                    "unlimited": "Unlimited"
                }
            },
            "create_org": "Create Organization",
            "create": "Create",
            "error": "Error",
            "success": "Success",
            "invalid_email_or_password": "Invalid email or password",
            "unexpected_error": "An unexpected error occurred",
            "failed_to_create_account": "Failed to create account",
            "webhooks_page": {
                "subtitle": "Manage webhook endpoints for your integrations",
                "list_title": "Webhooks",
                "list_desc": "Configure webhooks to receive real-time events",
                "add_webhook": "Add Webhook",
                "edit_webhook": "Edit Webhook",
                "url": "URL",
                "events": "Events",
                "secret": "Secret",
                "active": "Active",
                "inactive": "Inactive",
                "retry_policy": "Retry Policy"
            },
            "logs_page": {
                "subtitle": "View system logs and activity",
                "list_title": "Logs",
                "list_desc": "Monitor all system events and errors",
                "filter_by_level": "Filter by Level",
                "filter_by_number": "Filter by Number",
                "all_levels": "All Levels",
                "all_logs": "All Logs",
                "system_logs": "System Logs",
                "system": "System",
                "info": "Info",
                "warn": "Warning",
                "error": "Error",
                "debug": "Debug",
                "level": "Level",
                "message": "Message",
                "metadata": "Metadata",
                "clear_logs": "Clear Logs"
            },
            "automation_page": {
                "subtitle": "Manage automated tasks and jobs",
                "list_title": "Automation Jobs",
                "list_desc": "View and manage scheduled automation tasks",
                "create_job": "Create Job",
                "job_type": "Job Type",
                "status": "Status",
                "pending": "Pending",
                "processing": "Processing",
                "completed": "Completed",
                "failed": "Failed",
                "run_at": "Run At",
                "result": "Result",
                "payload": "Payload",
                "sync_contacts": "Sync Contacts",
                "broadcast": "Broadcast",
                "check_status": "Check Status"
            },
            "settings_page": {
                "subtitle": "Manage your account settings",
                "profile": "Profile",
                "general": "General Settings",
                "full_name": "Full Name",
                "email": "Email",
                "avatar_url": "Avatar URL",
                "update_profile": "Update Profile",
                "profile_updated": "Profile updated successfully",
                "notifications": "Notifications",
                "email_notifications": "Email Notifications",
                "security": "Security",
                "change_password": "Change Password",
                "change_password_info": "Password management is handled through Supabase Auth. Use the password reset feature from the login page to change your password.",
                "current_password": "Current Password",
                "new_password": "New Password",
                "confirm_password": "Confirm Password"
            },
            "extension_page": {
                "subtitle": "Install and manage browser extension",
                "installation": "Installation",
                "get_extension": "Get the extension for your browser",
                "chrome_extension": "Chrome Extension",
                "version": "Version",
                "install": "Install",
                "preview": "Preview",
                "how_it_looks": "How it looks in the browser",
                "download": "Download",
                "instructions": "Installation Instructions",
                "step1": "Download the extension file",
                "step2": "Open Chrome and go to chrome://extensions/",
                "step3": "Enable Developer mode",
                "step4": "Click 'Load unpacked' and select the extension folder"
            },
            "accounts_management": {
                "title": "Green-API Accounts",
                "subtitle": "Manage your Green-API account connections",
                "list_title": "Connected Accounts",
                "list_desc": "List of all your Green-API accounts and instances"
            }
        }
    },
    "he": {
        "translation": {
            "dashboard": "לוח בקרה",
            "dashboard.overview_desc": "סקירה כללית של פעילות וסטטיסטיקות",
            "dashboard.chart_coming_soon": "תרשים אנליטיקה בקרוב",
            "dashboard.chart_desc": "נפח הודעות, שיעורי שגיאות ומגמות שימוש יוצגו כאן",
            "numbers": "מספרים",
            "chats": "צ'אטים",
            "settings": "הגדרות",
            "logout": "התנתק",
            "welcome": "ברוך שובך",
            "status": "סטטוס",
            "connected": "מחובר",
            "disconnected": "מנותק",
            "add_number": "הוסף מספר",
            "webhooks": "Webhooks",
            "logs": "לוגים",
            "automation": "אוטומציה",
            "extension": "תוסף",
            "total_numbers": "סה\"כ מספרים",
            "active": "פעיל",
            "system_status": "סטטוס מערכת",
            "healthy": "בריא",
            "all_systems_operational": "כל המערכות פועלות",
            "recent_errors": "שגיאות אחרונות",
            "last_24_hours": "24 שעות אחרונות",
            "api_usage": "שימוש ב-API",
            "requests_today": "בקשות היום",
            "overview": "סקירה כללית",
            "recent_activity": "פעילות אחרונה",
            "latest_actions": "הפעולות האחרונות שבוצעו.",
            "instance_synced": "מופע מסונכרן",
            "synced_successfully": "סונכרן בהצלחה",
            "ago": "לפני",
            "chart_placeholder": "מקום לתרשים",
            "common": {
                "name": "שם",
                "actions": "פעולות",
                "filter": "סינון",
                "instance_id": "מזהה מופע",
                "last_seen": "נראה לאחרונה",
                "type": "סוג",
                "date": "תאריך",
                "search": "חיפוש",
                "save": "שמור",
                "cancel": "ביטול",
                "delete": "מחק",
                "edit": "ערוך",
                "add": "הוסף",
                "close": "סגור",
                "confirm": "אישור",
                "loading": "טוען...",
                "no_data": "אין נתונים זמינים",
                "refresh": "רענן",
                "confirm_delete": "האם אתה בטוח שברצונך למחוק פריט זה?",
                "sync": "סנכרן",
                "syncing": "מסנכרן..."
            },
            "numbers_page": {
                "title": "מספרים",
                "subtitle": "נהל את מופעי ה-Green-API שלך.",
                "list_title": "מופעים",
                "list_desc": "רשימת כל מופעי ה-WhatsApp המחוברים.",
                "search_placeholder": "סנן מופעים...",
                "refresh": "רענן",
                "delete_instance": "מחק מופע",
                "phone_number": "מספר טלפון"
            },
            "chats_page": {
                "title": "צ'אטים",
                "subtitle": "נהל את שיחות ה-WhatsApp שלך",
                "select_number": "בחר מספר",
                "no_number_selected": "לא נבחר מספר",
                "no_chats": "אין צ'אטים זמינים",
                "search_chats": "חפש או התחל צ'אט חדש",
                "type_message": "הקלד הודעה...",
                "send": "שלח",
                "new_chat": "צ'אט חדש",
                "chat_with": "צ'אט עם",
                "open_image": "פתח תמונה",
                "open_video": "פתח וידאו",
                "video_message": "הודעת וידאו",
                "audio_not_available": "הודעת קול (לא זמינה להורדה)",
                "document_message": "הודעת מסמך",
                "download_document": "הורד מסמך",
                "sticker_message": "סטיקר",
                "view_sticker": "צפה בסטיקר",
                "location_message": "מיקום",
                "view_location": "צפה במיקום",
                "online_status": "מחובר עכשיו"
            },
            "login": {
                "title": "ברוכים הבאים",
                "subtitle": "הכנס את פרטי ההתחברות שלך",
                "email": "אימייל",
                "password": "סיסמה",
                "submit": "התחבר",
                "forgot_password": "שכחת סיסמה?",
                "no_account": "אין לך חשבון?"
            },
            "signup": {
                "title": "צור חשבון",
                "subtitle": "הכנס את הפרטים שלך כדי ליצור חשבון",
                "full_name": "שם מלא",
                "email": "אימייל",
                "password": "סיסמה",
                "password_hint": "הסיסמה חייבת להכיל לפחות 6 תווים",
                "create_account": "צור חשבון",
                "creating": "יוצר חשבון...",
                "check_email": "בדוק את האימייל שלך",
                "account_created": "החשבון נוצר! אנא בדוק את האימייל שלך כדי לאשר את החשבון.",
                "already_have_account": "כבר יש לך חשבון?"
            },
            "landing": {
                "hero_title": "נהל מספרי Green-API במקום אחד",
                "hero_subtitle": "מערכת ארגונית לניטור, לוגים ואוטומציה של תשתיות ה-WhatsApp שלך.",
                "get_started": "התחל עכשיו",
                "features": "פיצ'רים",
                "pricing": "מחירים",
                "view_demo": "צפה בהדגמה",
                "footer": "נבנה על ידי Builders. קוד המקור זמין ב-GitHub.",
                "features_list": {
                    "instant_connection": "חיבור מיידי",
                    "instant_connection_desc": "חבר מופעי WA תוך שניות עם סריקת QR.",
                    "auto_recovery": "שחזור אוטומטי",
                    "auto_recovery_desc": "ניסיונות webhook אוטומטיים והתראות ניתוק.",
                    "secure_tokens": "אסימונים מאובטחים",
                    "secure_tokens_desc": "אחסון מוצפן לכל מפתחות ה-API והסודות שלך.",
                    "real_time_analytics": "אנליטיקה בזמן אמת",
                    "real_time_analytics_desc": "עקוב אחר תפוקת הודעות ושיעורי שגיאות בזמן אמת.",
                    "role_management": "ניהול תפקידים",
                    "role_management_desc": "הרשאות מפורטות למנהלים וחברי צוות.",
                    "uptime": "99.9% זמן פעילות",
                    "uptime_desc": "נבנה על תשתית אמינה ליישומים קריטיים."
                },
                "plans": {
                    "free": "חינם",
                    "pro": "מקצועי",
                    "agency": "סוכנות",
                    "popular": "פופולרי",
                    "features": "פיצ'רים כוללים",
                    "select": "בחר תוכנית",
                    "month": "/חודש",
                    "numbers": "מספרים",
                    "users": "משתמשים",
                    "team_members": "חברי צוות",
                    "basic_webhooks": "Webhooks בסיסיים",
                    "advanced_webhooks": "Webhooks מתקדמים",
                    "priority_log_retention": "שמירת לוגים עדיפות",
                    "dedicated_support": "תמיכה ייעודית",
                    "custom_integrations": "אינטגרציות מותאמות",
                    "unlimited": "ללא הגבלה"
                }
            },
            "create_org": "צור ארגון",
            "create": "צור",
            "error": "שגיאה",
            "success": "הצלחה",
            "invalid_email_or_password": "אימייל או סיסמה לא תקינים",
            "unexpected_error": "אירעה שגיאה בלתי צפויה",
            "failed_to_create_account": "יצירת החשבון נכשלה",
            "webhooks_page": {
                "subtitle": "נהל נקודות קצה של webhooks לאינטגרציות שלך",
                "list_title": "Webhooks",
                "list_desc": "הגדר webhooks כדי לקבל אירועים בזמן אמת",
                "add_webhook": "הוסף Webhook",
                "edit_webhook": "ערוך Webhook",
                "url": "כתובת URL",
                "events": "אירועים",
                "secret": "סוד",
                "active": "פעיל",
                "inactive": "לא פעיל",
                "retry_policy": "מדיניות ניסיון חוזר"
            },
            "logs_page": {
                "subtitle": "צפה בלוגים ופעילות המערכת",
                "list_title": "לוגים",
                "list_desc": "עקוב אחר כל אירועי ושגיאות המערכת",
                "filter_by_level": "סנן לפי רמה",
                "filter_by_number": "סנן לפי מספר",
                "all_levels": "כל הרמות",
                "all_logs": "כל הלוגים",
                "system_logs": "לוגי מערכת",
                "system": "מערכת",
                "info": "מידע",
                "warn": "אזהרה",
                "error": "שגיאה",
                "debug": "דיבוג",
                "level": "רמה",
                "message": "הודעה",
                "metadata": "מטא-נתונים",
                "clear_logs": "נקה לוגים"
            },
            "automation_page": {
                "subtitle": "נהל משימות אוטומטיות ועבודות",
                "list_title": "עבודות אוטומציה",
                "list_desc": "צפה ונהל משימות אוטומציה מתוזמנות",
                "create_job": "צור עבודה",
                "job_type": "סוג עבודה",
                "status": "סטטוס",
                "pending": "ממתין",
                "processing": "מעבד",
                "completed": "הושלם",
                "failed": "נכשל",
                "run_at": "הרץ ב",
                "result": "תוצאה",
                "payload": "נתונים",
                "sync_contacts": "סנכרן אנשי קשר",
                "broadcast": "שידור",
                "check_status": "בדוק סטטוס"
            },
            "settings_page": {
                "subtitle": "נהל את הגדרות החשבון שלך",
                "profile": "פרופיל",
                "general": "הגדרות כלליות",
                "full_name": "שם מלא",
                "email": "אימייל",
                "avatar_url": "כתובת תמונת פרופיל",
                "update_profile": "עדכן פרופיל",
                "profile_updated": "הפרופיל עודכן בהצלחה",
                "notifications": "התראות",
                "email_notifications": "התראות אימייל",
                "security": "אבטחה",
                "change_password": "שנה סיסמה",
                "change_password_info": "ניהול סיסמה מתבצע דרך Supabase Auth. השתמש בפיצ'ר איפוס סיסמה מדף ההתחברות כדי לשנות את הסיסמה שלך.",
                "current_password": "סיסמה נוכחית",
                "new_password": "סיסמה חדשה",
                "confirm_password": "אשר סיסמה"
            },
            "extension_page": {
                "subtitle": "התקן ונהל תוסף דפדפן",
                "installation": "התקנה",
                "get_extension": "קבל את התוסף לדפדפן שלך",
                "chrome_extension": "תוסף Chrome",
                "version": "גרסה",
                "install": "התקן",
                "preview": "תצוגה מקדימה",
                "how_it_looks": "איך זה נראה בדפדפן",
                "download": "הורד",
                "instructions": "הוראות התקנה",
                "step1": "הורד את קובץ התוסף",
                "step2": "פתח Chrome ועבור ל-chrome://extensions/",
                "step3": "הפעל מצב מפתח",
                "step4": "לחץ על 'טען לא ארוז' ובחר את תיקיית התוסף"
            },
            "accounts_management": {
                "title": "חשבונות Green-API",
                "subtitle": "נהל את חיבורי חשבונות ה-Green-API שלך",
                "list_title": "חשבונות מחוברים",
                "list_desc": "רשימת כל חשבונות ו-מופעי ה-Green-API שלך"
            }
        }
    }
};

i18n
    .use(initReactI18next)
    .init({
        resources,
        lng: "en", // default language
        fallbackLng: "en",
        interpolation: {
            escapeValue: false
        }
    });

export default i18n;

```

# src\index.css

```css
@tailwind base;
@tailwind components;
@tailwind utilities;

@layer base {
  :root {
    /* WhatsApp-like light theme */
    --background: 120 20% 98%; /* very light warm background */
    --foreground: 210 40% 10%;

    --card: 0 0% 100%;
    --card-foreground: 210 40% 10%;

    --popover: 0 0% 100%;
    --popover-foreground: 210 40% 10%;

    /* WhatsApp primary green */
    --primary: 164 100% 34%; /* ~#00a884 */
    --primary-foreground: 0 0% 100%;

    --secondary: 210 20% 94%;
    --secondary-foreground: 210 40% 15%;

    --muted: 210 20% 94%;
    --muted-foreground: 215 15% 45%;

    --accent: 164 80% 40%;
    --accent-foreground: 0 0% 100%;

    --destructive: 0 84% 60%;
    --destructive-foreground: 0 0% 100%;

    --border: 210 20% 90%;
    --input: 210 20% 90%;
    --ring: 164 100% 34%;

    --radius: 0.75rem;
  }

  .dark {
    /* WhatsApp-like dark theme */
    --background: 210 30% 6%; /* ~#0a1014 */
    --foreground: 210 40% 96%;

    --card: 210 30% 10%; /* ~#111b21 */
    --card-foreground: 210 40% 96%;

    --popover: 210 30% 10%;
    --popover-foreground: 210 40% 96%;

    --primary: 164 100% 34%; /* #00a884 */
    --primary-foreground: 210 40% 10%;

    --secondary: 210 25% 16%; /* ~#202c33 */
    --secondary-foreground: 210 40% 96%;

    --muted: 210 25% 16%;
    --muted-foreground: 210 15% 65%;

    --accent: 164 80% 40%;
    --accent-foreground: 210 40% 96%;

    --destructive: 0 70% 40%;
    --destructive-foreground: 210 40% 96%;

    --border: 210 25% 18%;
    --input: 210 25% 18%;
    --ring: 164 100% 34%;
  }
}

@layer base {
  * {
    @apply border-border;
  }
  body {
    @apply bg-background text-foreground;
  }
}

```

# src\layouts\AuthLayout.jsx

```jsx
import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

export default function AuthLayout() {
    const { user } = useAuth();

    // Redirect to dashboard if already logged in
    if (user) {
        return <Navigate to="/app/dashboard" replace />;
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-muted/50">
            <div className="w-full max-w-[400px] p-4">
                <Outlet />
            </div>
        </div>
    );
}

```

# src\layouts\DashboardLayout.jsx

```jsx
import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { Sidebar } from '../components/Sidebar';
import { Header } from '../components/Header';

export default function DashboardLayout() {
    const { user } = useAuth();

    // If we are strictly checking for auth here, we ensure we don't render protected content
    // validation is simplified for now
    if (!user) {
        return <Navigate to="/login" replace />;
    }

    return (
        <div className="flex min-h-screen bg-background text-foreground">
            {/* Desktop Sidebar */}
            <Sidebar className="hidden md:block" />

            <div className="flex-1 flex flex-col">
                <Header />
                <main className="flex-1 p-6 overflow-auto bg-muted/20">
                    <Outlet />
                </main>
            </div>
        </div>
    );
}

```

# src\layouts\RootLayout.jsx

```jsx
import { QueryClientProvider } from '@tanstack/react-query';
import { queryClient } from '../lib/react-query';
import { Outlet } from 'react-router-dom';

export default function RootLayout() {
    return (
        <QueryClientProvider client={queryClient}>
            <Outlet />
        </QueryClientProvider>
    );
}

```

# src\lib\logger.js

```js
// Logger utility - for adding logs from anywhere in the app
import { supabase } from './supabaseClient';

/**
 * Add a log entry
 * @param {string} level - 'info' | 'warn' | 'error' | 'debug'
 * @param {string} message - Log message
 * @param {object} meta - Optional metadata
 * @param {string} numberId - Optional number_id (for instance-specific logs)
 * @param {string} organizationId - Optional organization_id
 */
export async function addLog(level, message, meta = null, numberId = null, organizationId = null) {
  try {
    const { error } = await supabase
      .from('logs')
      .insert({
        level,
        message,
        meta: meta ? JSON.parse(JSON.stringify(meta)) : null,
        number_id: numberId,
        organization_id: organizationId,
      });

    if (error) {
      console.error('Failed to add log:', error);
      return { success: false, error };
    }

    return { success: true };
  } catch (error) {
    console.error('Error adding log:', error);
    return { success: false, error: error.message };
  }
}

// Convenience functions
export const logger = {
  info: (message, meta, numberId, organizationId) =>
    addLog('info', message, meta, numberId, organizationId),
  warn: (message, meta, numberId, organizationId) =>
    addLog('warn', message, meta, numberId, organizationId),
  error: (message, meta, numberId, organizationId) =>
    addLog('error', message, meta, numberId, organizationId),
  debug: (message, meta, numberId, organizationId) =>
    addLog('debug', message, meta, numberId, organizationId),
};


```

# src\lib\messageCache.js

```js
// Message cache - prevents redundant Green API calls
// Similar to extension's caching strategy

const CACHE_TTL = 5 * 60 * 1000; // 5 minutes
const SYNC_COOLDOWN = 30 * 1000; // 30 seconds between syncs for same chat

const cache = {
  chats: new Map(), // chatId -> { data, timestamp }
  messages: new Map(), // chatId -> { data, timestamp, lastSync }
  lastFullSync: null, // timestamp of last full sync
};

/**
 * Check if we should sync chats (not synced recently)
 */
export function shouldSyncChats() {
  if (!cache.lastFullSync) return true;
  const timeSinceSync = Date.now() - cache.lastFullSync;
  return timeSinceSync > CACHE_TTL;
}

/**
 * Mark chats as synced
 */
export function markChatsSynced() {
  cache.lastFullSync = Date.now();
}

/**
 * Check if we should sync messages for a chat
 */
export function shouldSyncMessages(chatId) {
  const cached = cache.messages.get(chatId);
  if (!cached) return true;
  
  const timeSinceSync = Date.now() - (cached.lastSync || 0);
  return timeSinceSync > SYNC_COOLDOWN;
}

/**
 * Mark messages as synced for a chat
 */
export function markMessagesSynced(chatId) {
  const cached = cache.messages.get(chatId) || {};
  cached.lastSync = Date.now();
  cache.messages.set(chatId, cached);
}

/**
 * Get cached messages count for a chat (to avoid unnecessary syncs)
 */
export function getCachedMessageCount(chatId) {
  const cached = cache.messages.get(chatId);
  return cached?.data?.length || 0;
}

/**
 * Clear cache for a chat (when user explicitly syncs)
 */
export function clearChatCache(chatId) {
  cache.messages.delete(chatId);
}

/**
 * Clear all cache
 */
export function clearAllCache() {
  cache.chats.clear();
  cache.messages.clear();
  cache.lastFullSync = null;
}


```

# src\lib\react-query.js

```js
import { QueryClient } from '@tanstack/react-query';

export const queryClient = new QueryClient({
    defaultOptions: {
        queries: {
            refetchOnWindowFocus: false,
            retry: 1,
        },
    },
});

```

# src\lib\supabaseClient.js

```js
import { createClient } from '@supabase/supabase-js'

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || ''
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || ''

// Only log errors in development, not during build
if (import.meta.env.DEV && (!supabaseUrl || !supabaseAnonKey)) {
  console.warn('Missing Supabase environment variables!')
  console.warn('VITE_SUPABASE_URL:', supabaseUrl ? '✓' : '✗')
  console.warn('VITE_SUPABASE_ANON_KEY:', supabaseAnonKey ? '✓' : '✗')
}

// Create client with fallback - use actual values if available, otherwise use placeholders
// This prevents build errors but will show errors at runtime if env vars are missing
let supabase;
try {
  const hasValidConfig = supabaseUrl && supabaseAnonKey && 
    !supabaseUrl.includes('placeholder') && 
    !supabaseAnonKey.includes('placeholder');
  
  supabase = createClient(
    supabaseUrl || 'https://placeholder.supabase.co',
    supabaseAnonKey || 'placeholder-key',
    {
      auth: {
        persistSession: hasValidConfig, // Enable persistence only if config is valid
        autoRefreshToken: hasValidConfig,
        detectSessionInUrl: true, // Detect auth callback from email confirmation
      },
    }
  )
} catch (error) {
  console.error('Failed to create Supabase client:', error)
  // Create a minimal mock client to prevent crashes
  supabase = {
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: null } }),
      signInWithPassword: () => Promise.resolve({ error: { message: 'Supabase not configured' } }),
      signOut: () => Promise.resolve({ error: null }),
    }
  }
}

export { supabase }

```

# src\lib\utils.js

```js
import { clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs) {
    return twMerge(clsx(inputs))
}

```

# src\main.jsx

```jsx
import React from 'react'
import ReactDOM from 'react-dom/client'
import App from './App.jsx'
import './index.css'
import './i18n'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
)


```

# src\pages\Automation.jsx

```jsx
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Plus, Play, Clock, CheckCircle2, XCircle, Loader2 } from 'lucide-react';

export default function Automation() {
    const { t } = useTranslation();
    const { user } = useAuth();
    const [jobs, setJobs] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchJobs();
        // Poll for updates every 5 seconds
        const interval = setInterval(fetchJobs, 5000);
        return () => clearInterval(interval);
    }, [user]);

    const fetchJobs = async () => {
        if (!user) return;
        
        try {
            setLoading(true);
            // Get user's organizations
            const { data: orgs } = await supabase
                .from('organization_members')
                .select('organization_id')
                .eq('user_id', user.id);

            if (!orgs || orgs.length === 0) {
                setJobs([]);
                return;
            }

            const orgIds = orgs.map(o => o.organization_id);
            const { data, error } = await supabase
                .from('automation_jobs')
                .select('*')
                .in('organization_id', orgIds)
                .order('created_at', { ascending: false })
                .limit(50);

            if (error) throw error;
            setJobs(data || []);
        } catch (error) {
            console.error('Error fetching jobs:', error);
        } finally {
            setLoading(false);
        }
    };

    const createJob = async (type) => {
        if (!user) return;

        try {
            // Get first organization
            const { data: orgs } = await supabase
                .from('organization_members')
                .select('organization_id')
                .eq('user_id', user.id)
                .limit(1)
                .single();

            if (!orgs) {
                alert('Please create an organization first');
                return;
            }

            const { error } = await supabase
                .from('automation_jobs')
                .insert({
                    organization_id: orgs.organization_id,
                    type: type,
                    status: 'pending',
                    payload: {}
                });

            if (error) throw error;
            fetchJobs();
        } catch (error) {
            console.error('Error creating job:', error);
            alert(error.message);
        }
    };

    const getStatusIcon = (status) => {
        switch (status) {
            case 'completed':
                return <CheckCircle2 className="h-4 w-4 text-green-500" />;
            case 'failed':
                return <XCircle className="h-4 w-4 text-red-500" />;
            case 'processing':
                return <Loader2 className="h-4 w-4 text-blue-500 animate-spin" />;
            case 'pending':
                return <Clock className="h-4 w-4 text-yellow-500" />;
            default:
                return <Clock className="h-4 w-4" />;
        }
    };

    const getStatusBadgeColor = (status) => {
        switch (status) {
            case 'completed':
                return 'bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300';
            case 'failed':
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
            case 'processing':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
            case 'pending':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getTypeLabel = (type) => {
        const labels = {
            'sync_contacts': t('automation_page.sync_contacts'),
            'broadcast': t('automation_page.broadcast'),
            'check_status': t('automation_page.check_status')
        };
        return labels[type] || type;
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">{t('automation')}</h2>
                    <p className="text-muted-foreground">{t('automation_page.subtitle')}</p>
                </div>
                <div className="flex gap-2">
                    <Button variant="outline" onClick={() => createJob('sync_contacts')}>
                        <Plus className="mr-2 h-4 w-4" />
                        {t('automation_page.sync_contacts')}
                    </Button>
                    <Button variant="outline" onClick={() => createJob('check_status')}>
                        <Plus className="mr-2 h-4 w-4" />
                        {t('automation_page.check_status')}
                    </Button>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>{t('automation_page.list_title')}</CardTitle>
                    <CardDescription>{t('automation_page.list_desc')}</CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="text-center py-8 text-muted-foreground">{t('common.loading')}</div>
                    ) : jobs.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">{t('common.no_data')}</div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>{t('automation_page.job_type')}</TableHead>
                                    <TableHead>{t('automation_page.status')}</TableHead>
                                    <TableHead>{t('automation_page.run_at')}</TableHead>
                                    <TableHead>{t('automation_page.result')}</TableHead>
                                    <TableHead>{t('common.date')}</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {jobs.map((job) => (
                                    <TableRow key={job.id}>
                                        <TableCell className="font-medium">
                                            {getTypeLabel(job.type)}
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center gap-2">
                                                {getStatusIcon(job.status)}
                                                <span className={`text-xs px-2 py-1 rounded ${getStatusBadgeColor(job.status)}`}>
                                                    {t(`automation_page.${job.status}`)}
                                                </span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            {job.run_at ? new Date(job.run_at).toLocaleString() : '-'}
                                        </TableCell>
                                        <TableCell>
                                            {job.result ? (
                                                <details>
                                                    <summary className="text-xs text-muted-foreground cursor-pointer">
                                                        {t('automation_page.result')}
                                                    </summary>
                                                    <pre className="text-xs mt-1 p-2 bg-muted rounded overflow-auto max-w-md">
                                                        {JSON.stringify(job.result, null, 2)}
                                                    </pre>
                                                </details>
                                            ) : (
                                                '-'
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            {new Date(job.created_at).toLocaleString()}
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

```

# src\pages\Chats.jsx

```jsx
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../context/ThemeContext';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Plus, Search, Send, Phone } from 'lucide-react';
import { cn } from '../lib/utils';
import { sendMessage as sendGreenMessage } from '../services/greenApi';
import {
    fullSync,
    syncMessagesToSupabase,
    pollNewMessages,
    syncChatsToSupabase,
} from '../services/messageSync';
import {
    shouldSyncChats,
    markChatsSynced,
    shouldSyncMessages,
    markMessagesSynced,
    clearChatCache,
} from '../lib/messageCache';
import { logger } from '../lib/logger';

export default function Chats() {
    const { t } = useTranslation();
    const { user } = useAuth();
    const { theme } = useTheme();
    const navigate = useNavigate();
    const [numbers, setNumbers] = useState([]);
    const [selectedNumber, setSelectedNumber] = useState(null);
    const [chats, setChats] = useState([]);
    const [selectedChat, setSelectedChat] = useState(null);
    const [messages, setMessages] = useState([]);
    const [newMessage, setNewMessage] = useState('');
    const [loading, setLoading] = useState(true);
    const [syncing, setSyncing] = useState(false);
    const [isPolling, setIsPolling] = useState(false);
    const [messagesLoading, setMessagesLoading] = useState(false);
    const [hasMoreMessages, setHasMoreMessages] = useState(true);
    const [oldestMessageTs, setOldestMessageTs] = useState(null);
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        fetchNumbers();
    }, [user]);

    useEffect(() => {
        if (selectedNumber) {
            fetchChats();
        }
    }, [selectedNumber]);

    useEffect(() => {
        if (selectedChat) {
            fetchMessages();
        }
    }, [selectedChat]);

    const fetchNumbers = async () => {
        if (!user) return;
        
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('numbers')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setNumbers(data || []);
            if (data && data.length > 0 && !selectedNumber) {
                setSelectedNumber(data[0]);
            }
        } catch (error) {
            console.error('Error fetching numbers:', error);
        } finally {
            setLoading(false);
        }
    };

    const fetchChats = async (forceSync = false) => {
        if (!selectedNumber) return;

        try {
            // Always load from Supabase first (fast)
            const { data, error } = await supabase
                .from('chats')
                .select('*')
                .eq('number_id', selectedNumber.id)
                .order('last_message_at', { ascending: false });

            if (error) throw error;
            setChats(data || []);

            // Only sync from Green API if needed (smart caching)
            if (
                forceSync ||
                (selectedNumber.instance_id &&
                    selectedNumber.api_token &&
                    shouldSyncChats())
            ) {
                // Background sync - don't block UI
                syncChatsToSupabase(
                    selectedNumber.id,
                    selectedNumber.instance_id,
                    selectedNumber.api_token,
                    false, // Don't enrich all names
                )
                    .then(() => {
                        markChatsSynced();
                        // Refresh from Supabase after sync
                        return supabase
                            .from('chats')
                            .select('*')
                            .eq('number_id', selectedNumber.id)
                            .order('last_message_at', { ascending: false });
                    })
                    .then(({ data: refreshedData }) => {
                        if (refreshedData) {
                            setChats(refreshedData);
                        }
                    })
                    .catch((err) => {
                        console.error('Background chat sync error:', err);
                    });
            }
        } catch (error) {
            console.error('Error fetching chats:', error);
        }
    };

    const PAGE_SIZE = 50;

    const fetchMessages = async (initial = true, forceSync = false) => {
        if (!selectedChat) return;

        try {
            setMessagesLoading(true);
            if (initial) {
                setHasMoreMessages(true);
                setOldestMessageTs(null);
                setMessages([]);
            }

            // SMART: Only sync from Green API if:
            // 1. Force sync requested (user clicked sync)
            // 2. No messages in DB yet
            // 3. Haven't synced recently (cache check)
            const shouldSync =
                forceSync ||
                (selectedNumber?.instance_id &&
                    selectedNumber?.api_token &&
                    selectedChat.remote_jid &&
                    shouldSyncMessages(selectedChat.id));

            if (shouldSync) {
                // Check if we have any messages first
                const { count } = await supabase
                    .from('messages')
                    .select('*', { count: 'exact', head: true })
                    .eq('chat_id', selectedChat.id);

                // Only sync if we have < 20 messages or force sync
                if (forceSync || (count || 0) < 20) {
                    // Background sync - don't block UI
                    syncMessagesToSupabase(
                        selectedChat.id,
                        selectedNumber.instance_id,
                        selectedNumber.api_token,
                        selectedChat.remote_jid,
                        initial ? PAGE_SIZE * 2 : PAGE_SIZE, // Load more on initial
                    )
                        .then(() => {
                            markMessagesSynced(selectedChat.id);
                        })
                        .catch((err) => {
                            console.error('Background message sync error:', err);
                        });
                }
            }

            // Load from Supabase (always fast, even if sync is running)
            let query = supabase
                .from('messages')
                .select('*')
                .eq('chat_id', selectedChat.id)
                .order('timestamp', { ascending: false })
                .limit(PAGE_SIZE);

            if (!initial && oldestMessageTs) {
                query = query.lt('timestamp', oldestMessageTs);
            }

            const { data, error } = await query;

            if (error) throw error;

            const batch = data || [];
            if (batch.length === 0) {
                if (initial) {
                    setMessages([]);
                    setHasMoreMessages(false);
                } else {
                    setHasMoreMessages(false);
                }
                return;
            }

            // We queried descending; UI expects ascending
            const reversed = [...batch].reverse();

            if (initial) {
                setMessages(reversed);
            } else {
                setMessages((prev) => [...reversed, ...prev]);
            }

            const newOldest = reversed[0]?.timestamp;
            if (newOldest) {
                setOldestMessageTs(newOldest);
            }

            if (batch.length < PAGE_SIZE) {
                setHasMoreMessages(false);
            }
        } catch (error) {
            console.error('Error fetching messages:', error);
        } finally {
            setMessagesLoading(false);
        }
    };

    const handleLoadMoreMessages = async () => {
        if (!hasMoreMessages || messagesLoading || !selectedChat) return;
        await fetchMessages(false);
    };

    const sendMessage = async () => {
        if (!newMessage.trim() || !selectedChat) return;

        try {
            // Send via Green API if possible
            if (selectedNumber?.instance_id && selectedNumber?.api_token && selectedChat.remote_jid) {
                const result = await sendGreenMessage(
                    selectedNumber.instance_id,
                    selectedNumber.api_token,
                    selectedChat.remote_jid,
                    newMessage,
                );

                if (!result.success) {
                    console.error('Failed sending via Green API:', result.error);
                    await logger.error('Failed to send message via Green API', {
                        error: result.error,
                        chat_id: selectedChat.remote_jid
                    }, selectedNumber.id);
                } else {
                    await logger.info('Message sent', {
                        chat_id: selectedChat.remote_jid,
                        message_length: newMessage.length
                    }, selectedNumber.id);
                }
            }

            // Always insert into Supabase so UI is consistent
            const { data, error } = await supabase
                .from('messages')
                .insert({
                    chat_id: selectedChat.id,
                    content: newMessage,
                    is_from_me: true,
                    timestamp: new Date().toISOString(),
                })
                .select()
                .single();

            if (error) throw error;
            setMessages([...messages, data]);
            setNewMessage('');

            // Update chat last message
            await supabase
                .from('chats')
                .update({
                    last_message: newMessage,
                    last_message_at: new Date().toISOString(),
                })
                .eq('id', selectedChat.id);
        } catch (error) {
            console.error('Error sending message:', error);
        }
    };

    const handleFullSync = async () => {
        if (!selectedNumber?.id || !selectedNumber.instance_id || !selectedNumber.api_token) {
            console.warn('Missing number Green API configuration for sync');
            await logger.warn('Sync attempted without Green API credentials', null, selectedNumber?.id);
            return;
        }

        setSyncing(true);
        try {
            // Clear cache to force fresh sync
            clearChatCache(selectedChat?.id);
            
            await logger.info('Starting full sync', { instance_id: selectedNumber.instance_id }, selectedNumber.id);
            
            const result = await fullSync(
                selectedNumber.id,
                selectedNumber.instance_id,
                selectedNumber.api_token,
                50,
            );

            if (!result.success) {
                console.error('Full sync failed:', result.error);
                await logger.error('Full sync failed', { error: result.error }, selectedNumber.id);
            } else {
                await logger.info('Full sync completed', { 
                    chats: result.data?.chats?.length || 0,
                    messages: result.data?.messages?.length || 0
                }, selectedNumber.id);
            }

            // Force refresh after sync
            await fetchChats(true);
            if (selectedChat) {
                await fetchMessages(true, true); // initial + force sync
            }
        } catch (error) {
            console.error('Error during full sync:', error);
            await logger.error('Full sync error', { error: error.message }, selectedNumber?.id);
        } finally {
            setSyncing(false);
        }
    };

    // SMART Polling: Slower interval + only refresh if we got a notification
    useEffect(() => {
        if (!selectedNumber?.instance_id || !selectedNumber?.api_token) {
            return;
        }

        setIsPolling(true);
        let lastNotificationTime = Date.now();
        
        const interval = setInterval(() => {
            pollNewMessages(
                selectedNumber.instance_id,
                selectedNumber.api_token,
                async (message) => {
                    // Only refresh if we actually got a new message
                    const now = Date.now();
                    if (now - lastNotificationTime > 1000) {
                        // Throttle: max once per second
                        lastNotificationTime = now;
                        // Only refresh the current chat, not all chats
                        if (selectedChat) {
                            // Clear cache and force refresh
                            clearChatCache(selectedChat.id);
                            await fetchMessages(true, true);
                        }
                        // Light refresh of chat list (just last_message)
                        await fetchChats();
                    }
                },
            );
        }, 15000); // Slower: 15 seconds instead of 5

        return () => {
            clearInterval(interval);
            setIsPolling(false);
        };
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [selectedNumber?.instance_id, selectedNumber?.api_token, selectedChat?.id]);

    const getChatInitials = (chat) => {
        const base = (chat.name || chat.remote_jid || 'WA').toString();
        const letters = base.replace(/[^A-Za-zא-ת0-9]/g, '').slice(0, 2);
        return letters.toUpperCase() || 'WA';
    };

    const filteredChats = chats.filter((chat) =>
        (chat.name || '').toLowerCase().includes(searchTerm.toLowerCase()) ||
        (chat.remote_jid || '').toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="flex h-[calc(100vh-8rem)] bg-background dark:bg-[#0a1014] text-sm">
            {/* Left Sidebar - Numbers & Chats (WhatsApp-style) */}
            <div className="w-96 border-r border-border dark:border-[#202c33] flex flex-col bg-card dark:bg-[#111b21] text-foreground dark:text-white">
                {/* Number Selector / Top bar */}
                <div className="p-3 border-b border-border dark:border-[#202c33] bg-secondary dark:bg-[#202c33]">
                    <div className="flex items-center gap-2 mb-3">
                        <select
                            value={selectedNumber?.id || ''}
                            onChange={(e) => {
                                const num = numbers.find((n) => n.id === e.target.value);
                                setSelectedNumber(num || null);
                                setSelectedChat(null);
                            }}
                            className="flex-1 px-3 py-2 rounded-md border-0 bg-secondary dark:bg-[#202c33] text-sm text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#8696a0] outline-none focus:ring-2 focus:ring-primary"
                        >
                            <option value="">{t('chats_page.select_number')}</option>
                            {numbers.map((num) => (
                                <option key={num.id} value={num.id}>
                                    {num.phone_number || num.instance_id || num.id.slice(0, 8)}
                                </option>
                            ))}
                        </select>
                        <Button
                            size="icon"
                            onClick={() => navigate('/app/numbers')}
                            title={t('add_number')}
                            className="bg-primary hover:bg-primary/90 dark:bg-[#00a884] dark:hover:bg-[#00a884]/90 text-primary-foreground dark:text-white border-0"
                        >
                            <Plus className="h-4 w-4" />
                        </Button>
                        <Button
                            size="sm"
                            onClick={handleFullSync}
                            disabled={syncing || !selectedNumber}
                            className="ml-1 bg-primary hover:bg-primary/90 dark:bg-[#00a884] dark:hover:bg-[#00a884]/90 text-primary-foreground dark:text-white border-0 text-xs px-3"
                        >
                            {syncing ? t('common.syncing') || 'Syncing...' : t('common.sync') || 'Sync'}
                        </Button>
                    </div>
                    {/* Search */}
                    <div className="relative">
                        <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground dark:text-[#8696a0]" />
                        <Input
                            placeholder={t('chats_page.search_chats')}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="pl-9 border-0 bg-secondary dark:bg-[#202c33] text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#8696a0] focus-visible:ring-2 focus-visible:ring-primary"
                        />
                    </div>
                </div>

                {/* Chats List */}
                <div className="flex-1 overflow-y-auto bg-card dark:bg-[#111b21]">
                    {!selectedNumber ? (
                        <div className="p-8 text-center text-muted-foreground dark:text-[#8696a0]">
                            {t('chats_page.no_number_selected')}
                        </div>
                    ) : filteredChats.length === 0 ? (
                        <div className="p-8 text-center text-muted-foreground dark:text-[#8696a0]">
                            {t('chats_page.no_chats')}
                        </div>
                    ) : (
                        filteredChats.map((chat) => (
                            <div
                                key={chat.id}
                                onClick={() => setSelectedChat(chat)}
                                className={cn(
                                    "px-4 py-3 border-b border-border dark:border-[#202c33] cursor-pointer hover:bg-secondary dark:hover:bg-[#202c33] transition-colors",
                                    selectedChat?.id === chat.id && "bg-secondary dark:bg-[#202c33]"
                                )}
                            >
                                <div className="flex items-center gap-3">
                                    <div className="w-12 h-12 rounded-full bg-gradient-to-br from-primary to-primary/80 dark:from-[#00a884] dark:to-[#005c4b] flex items-center justify-center text-sm font-semibold text-primary-foreground dark:text-white">
                                        {getChatInitials(chat)}
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <p className="font-medium truncate text-foreground dark:text-[#e9edef]">{chat.name || chat.remote_jid}</p>
                                        <p className="text-sm text-muted-foreground dark:text-[#8696a0] truncate">
                                            {chat.last_message || t('chats_page.no_chats')}
                                        </p>
                                    </div>
                                    {chat.last_message_at && (
                                        <span className="text-xs text-muted-foreground dark:text-[#8696a0] whitespace-nowrap">
                                            {new Date(chat.last_message_at).toLocaleTimeString([], { 
                                                hour: '2-digit', 
                                                minute: '2-digit' 
                                            })}
                                        </span>
                                    )}
                                </div>
                            </div>
                        ))
                    )}
                </div>
            </div>

            {/* Right Side - Chat Messages */}
            <div className="flex-1 flex flex-col bg-background dark:bg-[#0a1014]">
                {selectedChat ? (
                    <>
                        {/* Chat Header */}
                        <div className="p-3 border-b border-border dark:border-[#202c33] bg-secondary dark:bg-[#202c33] flex items-center gap-3 text-foreground dark:text-[#e9edef]">
                            <div className="w-10 h-10 rounded-full bg-primary/20 dark:bg-[#00a884]/20 flex items-center justify-center">
                                <Phone className="h-5 w-5 text-primary dark:text-[#00a884]" />
                            </div>
                            <div className="flex flex-col">
                                <span className="font-semibold">
                                    {selectedChat.name || selectedChat.remote_jid}
                                </span>
                                <span className="text-xs text-muted-foreground dark:text-[#8696a0]">{t('chats_page.online_status') || ''}</span>
                            </div>
                        </div>

                        {/* Messages */}
                        <div
                            className="flex-1 overflow-y-auto px-4 py-3 space-y-2 bg-background dark:bg-[#0a1014]"
                            onScroll={(e) => {
                                if (e.currentTarget.scrollTop < 40) {
                                    handleLoadMoreMessages();
                                }
                            }}
                        >
                            {hasMoreMessages && messages.length > 0 && (
                                <div className="flex justify-center pb-2">
                                    <button
                                        type="button"
                                        onClick={handleLoadMoreMessages}
                                        disabled={messagesLoading}
                                        className="text-xs text-muted-foreground dark:text-[#8696a0] hover:text-foreground dark:hover:text-[#e9edef] disabled:opacity-60"
                                    >
                                        {messagesLoading ? t('common.loading') : t('common.refresh')}
                                    </button>
                                </div>
                            )}
                            {messages.length === 0 && !messagesLoading ? (
                                <div className="text-center text-muted-foreground dark:text-[#8696a0] py-8">
                                    {t('common.no_data')}
                                </div>
                            ) : (
                                messages.map((message) => {
                                    const mediaMeta = message.media_meta || {};
                                    const typeMessage = mediaMeta.typeMessage || mediaMeta.type || '';
                                    
                                    return (
                                        <div
                                            key={message.id}
                                            className={cn(
                                                "flex",
                                                message.is_from_me ? "justify-end" : "justify-start"
                                            )}
                                        >
                                            <div
                                                className={cn(
                                                    "max-w-[70%] rounded-lg px-3 py-2 shadow-sm text-[13px] leading-snug",
                                                    message.is_from_me
                                                        ? "bg-primary/90 dark:bg-[#005c4b] text-primary-foreground dark:text-[#e9edef] rounded-br-none"
                                                        : "bg-secondary dark:bg-[#202c33] text-foreground dark:text-[#e9edef] rounded-bl-none"
                                                )}
                                            >
                                                {/* Image Message */}
                                                {typeMessage === 'imageMessage' && (
                                                    <div className="space-y-2">
                                                        {mediaMeta.jpegThumbnail ? (
                                                            <img
                                                                src={`data:image/jpeg;base64,${mediaMeta.jpegThumbnail}`}
                                                                alt="image"
                                                                className="max-w-[220px] max-h-[220px] rounded-lg block mb-1"
                                                                onError={(e) => { e.target.style.display = 'none'; }}
                                                            />
                                                        ) : mediaMeta.urlFile || mediaMeta.downloadUrl ? (
                                                            <img
                                                                src={mediaMeta.urlFile || mediaMeta.downloadUrl}
                                                                alt="image"
                                                                className="max-w-[220px] max-h-[220px] rounded-lg block mb-1"
                                                                onError={(e) => { e.target.style.display = 'none'; }}
                                                            />
                                                        ) : null}
                                                        {(mediaMeta.caption || message.content) && (
                                                            <div className="text-sm">{mediaMeta.caption || message.content}</div>
                                                        )}
                                                        {(mediaMeta.urlFile || mediaMeta.downloadUrl) && (
                                                            <a
                                                                href={mediaMeta.urlFile || mediaMeta.downloadUrl}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="block mt-1 text-xs text-primary/80 dark:text-[#53bdeb] hover:underline"
                                                            >
                                                                📷 {t('chats_page.open_image') || 'Open Image'}
                                                            </a>
                                                        )}
                                                    </div>
                                                )}
                                                
                                                {/* Video Message */}
                                                {typeMessage === 'videoMessage' && (
                                                    <div className="space-y-2">
                                                        {mediaMeta.jpegThumbnail && (
                                                            <img
                                                                src={`data:image/jpeg;base64,${mediaMeta.jpegThumbnail}`}
                                                                alt="video"
                                                                className="max-w-[220px] max-h-[220px] rounded-lg block mb-1"
                                                            />
                                                        )}
                                                        <div>🎥 {t('chats_page.video_message') || 'Video Message'}</div>
                                                        {(mediaMeta.downloadUrl || mediaMeta.urlFile) && (
                                                            <a
                                                                href={mediaMeta.downloadUrl || mediaMeta.urlFile}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="block mt-1 text-xs text-primary/80 dark:text-[#53bdeb] hover:underline"
                                                            >
                                                                🎥 {t('chats_page.open_video') || 'Open Video'}
                                                            </a>
                                                        )}
                                                        {(mediaMeta.caption || message.content) && (
                                                            <div className="text-sm mt-2">{mediaMeta.caption || message.content}</div>
                                                        )}
                                                    </div>
                                                )}
                                                
                                                {/* Audio/Voice Message */}
                                                {(typeMessage === 'audioMessage' || typeMessage === 'ptt') && (
                                                    <div className="space-y-2">
                                                        <div className="flex items-center gap-2">
                                                            <span className="text-lg">🎵</span>
                                                            {mediaMeta.downloadUrl || mediaMeta.url ? (
                                                                <audio
                                                                    controls
                                                                    preload="metadata"
                                                                    className="max-w-[250px] h-8 outline-none"
                                                                    style={{ width: '100%' }}
                                                                >
                                                                    <source src={mediaMeta.downloadUrl || mediaMeta.url} type={mediaMeta.mimeType || 'audio/ogg; codecs=opus'} />
                                                                </audio>
                                                            ) : (
                                                                <div className="text-xs text-muted-foreground dark:text-[#8696a0]">
                                                                    {t('chats_page.audio_not_available') || 'Audio message (not available for download)'}
                                                                </div>
                                                            )}
                                                        </div>
                                                        {mediaMeta.seconds && mediaMeta.seconds > 0 && (
                                                            <div className="text-xs text-muted-foreground dark:text-[#8696a0]">
                                                                {Math.floor(mediaMeta.seconds / 60)}:{(mediaMeta.seconds % 60).toString().padStart(2, '0')}
                                                            </div>
                                                        )}
                                                        {message.content && (
                                                            <div className="text-sm mt-2">{message.content}</div>
                                                        )}
                                                    </div>
                                                )}
                                                
                                                {/* Document Message */}
                                                {typeMessage === 'documentMessage' && (
                                                    <div className="space-y-2">
                                                        <div>📄 {t('chats_page.document_message') || 'Document Message'}</div>
                                                        {mediaMeta.fileName && (
                                                            <div className="font-semibold text-sm">{mediaMeta.fileName}</div>
                                                        )}
                                                        {(mediaMeta.downloadUrl || mediaMeta.urlFile) && (
                                                            <a
                                                                href={mediaMeta.downloadUrl || mediaMeta.urlFile}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="block mt-1 text-xs text-primary/80 dark:text-[#53bdeb] hover:underline"
                                                            >
                                                                📄 {t('chats_page.download_document') || 'Download Document'}
                                                            </a>
                                                        )}
                                                        {(mediaMeta.caption || message.content) && (
                                                            <div className="text-sm mt-2">{mediaMeta.caption || message.content}</div>
                                                        )}
                                                    </div>
                                                )}
                                                
                                                {/* Sticker Message */}
                                                {typeMessage === 'stickerMessage' && (
                                                    <div className="space-y-2">
                                                        <div>🩹 {t('chats_page.sticker_message') || 'Sticker'}</div>
                                                        {mediaMeta.downloadUrl && (
                                                            <a
                                                                href={mediaMeta.downloadUrl}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="block mt-1 text-xs text-primary/80 dark:text-[#53bdeb] hover:underline"
                                                            >
                                                                {t('chats_page.view_sticker') || 'View Sticker'}
                                                            </a>
                                                        )}
                                                    </div>
                                                )}
                                                
                                                {/* Location Message */}
                                                {typeMessage === 'locationMessage' && (
                                                    <div className="space-y-2">
                                                        <div>📍 {t('chats_page.location_message') || 'Location'}</div>
                                                        {mediaMeta.latitude && mediaMeta.longitude && (
                                                            <a
                                                                href={`https://www.google.com/maps?q=${mediaMeta.latitude},${mediaMeta.longitude}`}
                                                                target="_blank"
                                                                rel="noopener noreferrer"
                                                                className="block mt-1 text-xs text-primary/80 dark:text-[#53bdeb] hover:underline"
                                                            >
                                                                {t('chats_page.view_location') || 'View Location'}
                                                            </a>
                                                        )}
                                                    </div>
                                                )}
                                                
                                                {/* Regular Text Message (or fallback) */}
                                                {!typeMessage && (
                                                    <p className="text-sm">{message.content}</p>
                                                )}
                                                
                                                <p className="text-[11px] text-muted-foreground dark:text-[#8696a0] mt-1 text-right">
                                                    {new Date(message.timestamp).toLocaleTimeString([], {
                                                        hour: '2-digit',
                                                        minute: '2-digit'
                                                    })}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })
                            )}
                            {messagesLoading && messages.length === 0 && (
                                <div className="text-center text-muted-foreground dark:text-[#8696a0] py-4">
                                    {t('common.loading')}
                                </div>
                            )}
                        </div>

                        {/* Message Input */}
                        <div className="px-4 py-3 border-t border-border dark:border-[#202c33] bg-secondary dark:bg-[#202c33]">
                            <div className="flex gap-2">
                                <Input
                                    placeholder={t('chats_page.type_message')}
                                    value={newMessage}
                                    onChange={(e) => setNewMessage(e.target.value)}
                                    onKeyPress={(e) => {
                                        if (e.key === 'Enter' && !e.shiftKey) {
                                            e.preventDefault();
                                            sendMessage();
                                        }
                                    }}
                                    className="flex-1 border-0 bg-secondary dark:bg-[#202c33] text-foreground dark:text-white placeholder:text-muted-foreground dark:placeholder:text-[#8696a0] focus-visible:ring-2 focus-visible:ring-primary"
                                />
                                <Button
                                    onClick={sendMessage}
                                    disabled={!newMessage.trim()}
                                    className="bg-primary hover:bg-primary/90 dark:bg-[#00a884] dark:hover:bg-[#00a884]/90 text-primary-foreground dark:text-white border-0"
                                >
                                    <Send className="h-4 w-4" />
                                </Button>
                            </div>
                        </div>
                    </>
                ) : (
                    <div className="flex-1 flex items-center justify-center bg-background dark:bg-[#0a1014]">
                        <div className="text-center text-muted-foreground dark:text-[#8696a0]">
                            <Phone className="h-16 w-16 mx-auto mb-4 opacity-40" />
                            <p className="text-lg text-foreground dark:text-[#e9edef]">{t('chats_page.select_number')}</p>
                            <p className="text-sm mt-2">{t('chats_page.no_chats')}</p>
                        </div>
                    </div>
                )}
            </div>
        </div>
    );
}


```

# src\pages\Dashboard.jsx

```jsx
import { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { useTranslation } from 'react-i18next';
import { supabase } from '../lib/supabaseClient';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Smartphone, AlertTriangle, CheckCircle2, Activity, Plus } from 'lucide-react';
import { Link } from 'react-router-dom';

export default function Dashboard() {
    const { user } = useAuth();
    const { t } = useTranslation();
    const [loading, setLoading] = useState(true);
    const [stats, setStats] = useState({
        totalNumbers: 0,
        activeNumbers: 0,
        recentErrors: 0,
        apiUsage: 0,
        recentActivity: []
    });

    useEffect(() => {
        fetchDashboardData();
    }, [user]);

    const fetchDashboardData = async () => {
        if (!user) return;
        
        try {
            setLoading(true);
            
            // Fetch numbers for the user
            const { data: numbers, error: numbersError } = await supabase
                .from('numbers')
                .select('*')
                .eq('user_id', user.id);

            if (numbersError) throw numbersError;

            const activeNumbers = numbers?.filter(n => n.status === 'active').length || 0;
            const totalNumbers = numbers?.length || 0;

            // Fetch recent errors from logs (last 24 hours)
            const yesterday = new Date();
            yesterday.setHours(yesterday.getHours() - 24);
            
            const { count: errorCount } = await supabase
                .from('logs')
                .select('*', { count: 'exact', head: true })
                .eq('level', 'error')
                .gte('created_at', yesterday.toISOString());

            // Fetch recent activity (last 10 logs)
            const { data: recentLogs } = await supabase
                .from('logs')
                .select('*, numbers(phone_number, instance_id)')
                .order('created_at', { ascending: false })
                .limit(10);

            // Calculate API usage from logs (count of info/error/warn logs in last 24 hours as proxy)
            const { count: apiUsageCount } = await supabase
                .from('logs')
                .select('*', { count: 'exact', head: true })
                .in('level', ['info', 'warn', 'error'])
                .gte('created_at', yesterday.toISOString());

            setStats({
                totalNumbers,
                activeNumbers,
                recentErrors: errorCount || 0,
                apiUsage: apiUsageCount || 0, // API calls approximated from log activity
                recentActivity: recentLogs || []
            });
        } catch (error) {
            console.error('Error fetching dashboard data:', error);
        } finally {
            setLoading(false);
        }
    };

    const statsData = [
        { 
            title: t('total_numbers'), 
            value: stats.totalNumbers.toString(), 
            icon: Smartphone, 
            color: "text-blue-500", 
            desc: `${stats.activeNumbers} ${t('active')}` 
        },
        { 
            title: t('system_status'), 
            value: t('healthy'), 
            icon: CheckCircle2, 
            color: "text-green-500", 
            desc: t('all_systems_operational') 
        },
        { 
            title: t('recent_errors'), 
            value: stats.recentErrors.toString(), 
            icon: AlertTriangle, 
            color: "text-yellow-500", 
            desc: t('last_24_hours') 
        },
        { 
            title: t('api_usage'), 
            value: stats.apiUsage > 0 ? `${(stats.apiUsage / 1000).toFixed(1)}k` : "0", 
            icon: Activity, 
            color: "text-violet-500", 
            desc: t('requests_today') 
        }
    ];

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">{t('dashboard')}</h2>
                    <p className="text-muted-foreground">
                        {t('welcome')}, {user?.email}
                    </p>
                </div>
                <div className="flex items-center gap-2">
                    <Link to="/app/numbers">
                        <Button>
                            <Plus className="mr-2 h-4 w-4" />
                            {t('add_number')}
                        </Button>
                    </Link>
                </div>
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
                {loading ? (
                    <div className="col-span-4 text-center py-8 text-muted-foreground">{t('common.loading')}</div>
                ) : (
                    statsData.map((stat, i) => (
                    <Card key={i}>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">
                                {stat.title}
                            </CardTitle>
                            <stat.icon className={`h-4 w-4 ${stat.color}`} />
                        </CardHeader>
                        <CardContent>
                            <div className="text-2xl font-bold">{stat.value}</div>
                            <p className="text-xs text-muted-foreground">
                                {stat.desc}
                            </p>
                        </CardContent>
                    </Card>
                    ))
                )}
            </div>

            <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-7">
                <Card className="col-span-4">
                    <CardHeader>
                        <CardTitle>{t('overview')}</CardTitle>
                        <CardDescription>
                            {t('dashboard.overview_desc')}
                        </CardDescription>
                    </CardHeader>
                    <CardContent className="pl-2">
                        <div className="h-[200px] flex flex-col items-center justify-center text-muted-foreground bg-accent/20 rounded-md p-4">
                            <div className="text-center space-y-2">
                                <Activity className="h-12 w-12 mx-auto opacity-50" />
                                <p className="text-sm font-medium">{t('dashboard.chart_coming_soon')}</p>
                                <p className="text-xs">{t('dashboard.chart_desc')}</p>
                            </div>
                        </div>
                    </CardContent>
                </Card>
                <Card className="col-span-3">
                    <CardHeader>
                        <CardTitle>{t('recent_activity')}</CardTitle>
                        <CardDescription>
                            {t('latest_actions')}
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="space-y-4">
                            {loading ? (
                                <div className="text-center py-4 text-muted-foreground">{t('common.loading')}</div>
                            ) : stats.recentActivity.length === 0 ? (
                                <div className="text-center py-4 text-muted-foreground">{t('common.no_data')}</div>
                            ) : (
                                stats.recentActivity.slice(0, 5).map((log, i) => (
                                    <div key={log.id || i} className="flex items-center justify-between">
                                        <div className="space-y-1">
                                            <p className="text-sm font-medium leading-none">
                                                {log.numbers ? (
                                                    `${t('instance_synced')} ${log.numbers.phone_number || log.numbers.instance_id || ''}`
                                                ) : (
                                                    log.message || t('instance_synced')
                                                )}
                                            </p>
                                            <p className="text-sm text-muted-foreground">
                                                {log.level === 'error' ? '⚠️ ' : '✓ '}
                                                {log.message || t('synced_successfully')}
                                            </p>
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            {new Date(log.created_at).toLocaleTimeString([], { 
                                                hour: '2-digit', 
                                                minute: '2-digit' 
                                            })}
                                        </div>
                                    </div>
                                ))
                            )}
                        </div>
                    </CardContent>
                </Card>
            </div>
        </div>
    );
}

```

# src\pages\Extension.jsx

```jsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Download, Chrome, CheckCircle2, ExternalLink } from 'lucide-react';

export default function Extension() {
    const { t } = useTranslation();

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">{t('extension')}</h2>
                <p className="text-muted-foreground">{t('extension_page.subtitle')}</p>
            </div>

            <div className="grid gap-6 md:grid-cols-2">
                <Card>
                    <CardHeader>
                        <CardTitle>{t('extension_page.installation')}</CardTitle>
                        <CardDescription>{t('extension_page.get_extension')}</CardDescription>
                    </CardHeader>
                    <CardContent className="space-y-4">
                        <div className="flex items-center p-4 border rounded-lg bg-card">
                            <Chrome className="h-8 w-8 text-blue-500 mr-4" />
                            <div className="flex-1">
                                <h4 className="font-semibold">{t('extension_page.chrome_extension')}</h4>
                                <p className="text-sm text-muted-foreground">{t('extension_page.version')} 2.4.0</p>
                            </div>
                            <Button>
                                <Download className="mr-2 h-4 w-4" />
                                {t('extension_page.download')}
                            </Button>
                        </div>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader>
                        <CardTitle>{t('extension_page.preview')}</CardTitle>
                        <CardDescription>{t('extension_page.how_it_looks')}</CardDescription>
                    </CardHeader>
                    <CardContent>
                        <div className="border rounded-lg p-4 shadow-xl bg-background max-w-[300px] mx-auto">
                            {/* Mock Extension UI */}
                            <div className="flex items-center justify-between border-b pb-2 mb-2">
                                <span className="font-bold text-sm text-primary">GreenManager</span>
                                <div className="h-2 w-2 rounded-full bg-green-500"></div>
                            </div>
                            <div className="space-y-2">
                                <div className="h-8 bg-muted rounded w-full"></div>
                                <div className="h-20 bg-muted rounded w-full"></div>
                                <div className="flex justify-end">
                                    <div className="h-8 bg-primary rounded w-16"></div>
                                </div>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            </div>

            {/* Installation Instructions */}
            <Card>
                <CardHeader>
                    <CardTitle>{t('extension_page.instructions')}</CardTitle>
                </CardHeader>
                <CardContent>
                    <ol className="space-y-3 list-decimal list-inside">
                        <li className="text-sm">{t('extension_page.step1')}</li>
                        <li className="text-sm">{t('extension_page.step2')}</li>
                        <li className="text-sm">{t('extension_page.step3')}</li>
                        <li className="text-sm">{t('extension_page.step4')}</li>
                    </ol>
                    <div className="mt-4 p-4 bg-muted rounded-lg">
                        <div className="flex items-start gap-2">
                            <CheckCircle2 className="h-5 w-5 text-green-500 mt-0.5" />
                            <div>
                                <p className="font-medium text-sm">Extension Features</p>
                                <ul className="text-sm text-muted-foreground mt-1 space-y-1">
                                    <li>• Quick send messages from any webpage</li>
                                    <li>• View chat history</li>
                                    <li>• Manage numbers on the go</li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

```

# src\pages\LandingPage.jsx

```jsx
import React from 'react';
import { useTranslation } from 'react-i18next';
import { Button } from '../components/ui/button';
import { Link } from 'react-router-dom';
import { Check, Shield, Zap, RefreshCw, BarChart3, Lock } from 'lucide-react';

export default function LandingPage() {
    const { t } = useTranslation();

    return (
        <div className="flex min-h-screen flex-col">
            {/* Header */}
            <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
                <div className="container flex h-16 items-center justify-between">
                    <div className="flex gap-2 items-center font-bold text-xl tracking-tight">
                        <span className="text-[#00a884]">Green</span>Builders
                    </div>
                    <nav className="flex items-center gap-4">
                        <Link to="/login">
                            <Button variant="ghost">{t('login.submit')}</Button>
                        </Link>
                        <Link to="/signup">
                            <Button>{t('landing.get_started')}</Button>
                        </Link>
                    </nav>
                </div>
            </header>

            <main className="flex-1">
                {/* Hero Section */}
                <section className="flex min-h-[calc(100vh-4rem)] items-center justify-center pb-8 pt-6 md:pb-12 md:pt-10 lg:py-16">
                    <div className="container flex max-w-[64rem] flex-col items-center gap-6 text-center">
                        <h1 className="font-heading text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-blue-600">
                            {t('landing.hero_title')}
                        </h1>
                        <p className="max-w-[42rem] leading-normal text-muted-foreground sm:text-xl sm:leading-8">
                            {t('landing.hero_subtitle')}
                        </p>
                        <div className="space-x-4 flex items-center justify-center gap-4 mt-2">
                            <Link to="/login">
                                <Button size="lg" className="h-12 px-8 text-lg">
                                    {t('landing.get_started')}
                                </Button>
                            </Link>
                            <Button variant="outline" size="lg" className="h-12 px-8 text-lg">
                                {t('landing.view_demo')}
                            </Button>
                        </div>
                    </div>
                </section>

                {/* Features Grid */}
                <section className="container space-y-6 bg-slate-50 py-8 dark:bg-transparent md:py-12 lg:py-24">
                    <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
                        <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
                            {t('landing.features')}
                        </h2>
                    </div>
                    <div className="mx-auto grid justify-center gap-4 sm:grid-cols-2 md:max-w-[64rem] md:grid-cols-3">
                        <FeatureCard
                            icon={<Zap className="h-10 w-10 text-primary" />}
                            title={t('landing.features_list.instant_connection')}
                            description={t('landing.features_list.instant_connection_desc')}
                        />
                        <FeatureCard
                            icon={<RefreshCw className="h-10 w-10 text-primary" />}
                            title={t('landing.features_list.auto_recovery')}
                            description={t('landing.features_list.auto_recovery_desc')}
                        />
                        <FeatureCard
                            icon={<Shield className="h-10 w-10 text-primary" />}
                            title={t('landing.features_list.secure_tokens')}
                            description={t('landing.features_list.secure_tokens_desc')}
                        />
                        <FeatureCard
                            icon={<BarChart3 className="h-10 w-10 text-primary" />}
                            title={t('landing.features_list.real_time_analytics')}
                            description={t('landing.features_list.real_time_analytics_desc')}
                        />
                        <FeatureCard
                            icon={<Lock className="h-10 w-10 text-primary" />}
                            title={t('landing.features_list.role_management')}
                            description={t('landing.features_list.role_management_desc')}
                        />
                        <FeatureCard
                            icon={<Check className="h-10 w-10 text-primary" />}
                            title={t('landing.features_list.uptime')}
                            description={t('landing.features_list.uptime_desc')}
                        />
                    </div>
                </section>

                {/* Pricing Section */}
            <section className="container space-y-6 py-8 md:py-12 lg:py-24">
                <div className="mx-auto flex max-w-[58rem] flex-col items-center space-y-4 text-center">
                    <h2 className="font-heading text-3xl leading-[1.1] sm:text-3xl md:text-6xl">
                        {t('landing.pricing')}
                    </h2>
                </div>
                <div className="grid grid-cols-1 gap-8 md:grid-cols-3 md:gap-8">
                    {/* Free Plan */}
                    <div className="flex flex-col rounded-lg border bg-background p-6 shadow-sm">
                        <h3 className="font-bold text-xl">{t('landing.plans.free')}</h3>
                        <div className="mt-4 text-4xl font-bold">$0</div>
                        <div className="text-sm text-muted-foreground">{t('landing.plans.month')}</div>
                        <ul className="mt-6 flex-1 space-y-3 text-sm">
                            <li className="flex"><Check className="mr-2 h-4 w-4 text-primary" /> 2 {t('landing.plans.numbers')}</li>
                            <li className="flex"><Check className="mr-2 h-4 w-4 text-primary" /> {t('landing.plans.basic_webhooks')}</li>
                            <li className="flex"><Check className="mr-2 h-4 w-4 text-primary" /> 1 {t('landing.plans.users')}</li>
                        </ul>
                        <Link to="/signup">
                            <Button className="mt-8 w-full" variant="outline">{t('landing.plans.select')}</Button>
                        </Link>
                    </div>

                    {/* Pro Plan */}
                    <div className="flex flex-col rounded-lg border bg-background p-6 shadow-md border-primary/20 relative">
                        <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-gradient-to-r from-primary to-blue-600 px-3 py-1 text-xs text-white shadow-md font-medium">
                            {t('landing.plans.popular')}
                        </div>
                        <h3 className="font-bold text-xl">{t('landing.plans.pro')}</h3>
                        <div className="mt-4 text-4xl font-bold">$29</div>
                        <div className="text-sm text-muted-foreground">{t('landing.plans.month')}</div>
                        <ul className="mt-6 flex-1 space-y-3 text-sm">
                            <li className="flex"><Check className="mr-2 h-4 w-4 text-primary" /> 10 {t('landing.plans.numbers')}</li>
                            <li className="flex"><Check className="mr-2 h-4 w-4 text-primary" /> {t('landing.plans.advanced_webhooks')}</li>
                            <li className="flex"><Check className="mr-2 h-4 w-4 text-primary" /> {t('landing.plans.priority_log_retention')}</li>
                            <li className="flex"><Check className="mr-2 h-4 w-4 text-primary" /> 5 {t('landing.plans.team_members')}</li>
                        </ul>
                        <Link to="/signup">
                            <Button className="mt-8 w-full">{t('landing.plans.select')}</Button>
                        </Link>
                    </div>

                    {/* Agency Plan */}
                    <div className="flex flex-col rounded-lg border bg-background p-6 shadow-sm">
                        <h3 className="font-bold text-xl">{t('landing.plans.agency')}</h3>
                        <div className="mt-4 text-4xl font-bold">$99</div>
                        <div className="text-sm text-muted-foreground">{t('landing.plans.month')}</div>
                        <ul className="mt-6 flex-1 space-y-3 text-sm">
                            <li className="flex"><Check className="mr-2 h-4 w-4 text-primary" /> {t('landing.plans.unlimited')} {t('landing.plans.numbers')}</li>
                            <li className="flex"><Check className="mr-2 h-4 w-4 text-primary" /> {t('landing.plans.dedicated_support')}</li>
                            <li className="flex"><Check className="mr-2 h-4 w-4 text-primary" /> {t('landing.plans.custom_integrations')}</li>
                            <li className="flex"><Check className="mr-2 h-4 w-4 text-primary" /> {t('landing.plans.unlimited')} {t('landing.plans.users')}</li>
                        </ul>
                        <Link to="/signup">
                            <Button className="mt-8 w-full" variant="outline">{t('landing.plans.select')}</Button>
                        </Link>
                    </div>
                </div>
            </section>
        </main>

        {/* Footer */}
        <footer className="py-6 md:px-8 md:py-0">
            <div className="container flex flex-col items-center justify-between gap-4 md:h-24 md:flex-row">
                <p className="text-center text-sm leading-loose text-muted-foreground md:text-left">
                    {t('landing.footer')}
                </p>
            </div>
        </footer>
        </div>
    );
}

function FeatureCard({ icon, title, description }) {
    return (
        <div className="relative overflow-hidden rounded-lg border bg-background p-2">
            <div className="flex h-[180px] flex-col justify-between rounded-md p-6">
                {icon}
                <div className="space-y-2">
                    <h3 className="font-bold">{title}</h3>
                    <p className="text-sm text-muted-foreground">{description}</p>
                </div>
            </div>
        </div>
    )
}

```

# src\pages\Login.jsx

```jsx
import { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { useNavigate } from 'react-router-dom'
import { useTranslation } from 'react-i18next'
import { Button } from '../components/ui/button'
import { Input } from '../components/ui/input'
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '../components/ui/card'
import { Loader2 } from 'lucide-react'
import { Link } from 'react-router-dom'

export default function Login() {
    const [loading, setLoading] = useState(false)
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState('')
    const navigate = useNavigate()
    const { signIn, user } = useAuth()
    const { t } = useTranslation()

    // Redirect if already logged in
    useEffect(() => {
        if (user) {
            navigate('/app/dashboard', { replace: true })
        }
    }, [user, navigate])

    const handleLogin = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')

        try {
            const { data, error: signInError } = await signIn({ email, password })

            if (signInError) {
                setError(signInError.message || 'Invalid email or password')
                return
            }

            // Success - AuthContext will update and redirect
            if (data?.session) {
                navigate('/app/dashboard', { replace: true })
            }
        } catch (err) {
            console.error('Login error:', err)
            setError(err.message || 'An unexpected error occurred')
        } finally {
            setLoading(false)
        }
    }

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-900 p-4">
            <Card className="w-full max-w-md shadow-lg">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold text-center">
                        {t('login.title')}
                    </CardTitle>
                    <CardDescription className="text-center">
                        {t('login.subtitle')}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleLogin} className="space-y-4">
                        {error && (
                            <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-md">
                                {error}
                            </div>
                        )}
                        <div className="space-y-2">
                            <Input
                                type="email"
                                placeholder={t('login.email')}
                                value={email}
                                required
                                onChange={(e) => setEmail(e.target.value)}
                                disabled={loading}
                            />
                        </div>
                        <div className="space-y-2">
                            <Input
                                type="password"
                                placeholder={t('login.password')}
                                value={password}
                                required
                                onChange={(e) => setPassword(e.target.value)}
                                disabled={loading}
                            />
                        </div>
                        <Button className="w-full" disabled={loading}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {t('login.submit')}
                        </Button>
                    </form>
                </CardContent>
                <CardFooter className="flex flex-col gap-2">
                    <div className="text-sm text-center text-muted-foreground">
                        Don't have an account?{' '}
                        <Link to="/signup" className="text-primary hover:underline font-medium">
                            {t('create')}
                        </Link>
                    </div>
                </CardFooter>
            </Card>
        </div>
    )
}

```

# src\pages\Logs.jsx

```jsx
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Input } from '../components/ui/input';
import { Button } from '../components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Search, AlertCircle, Info, AlertTriangle, Bug, X, RefreshCw } from 'lucide-react';
import { cn } from '../lib/utils';

export default function Logs() {
    const { t } = useTranslation();
    const { user } = useAuth();
    const [logs, setLogs] = useState([]);
    const [loading, setLoading] = useState(true);
    const [searchTerm, setSearchTerm] = useState('');
    const [levelFilter, setLevelFilter] = useState('all');
    const [selectedTab, setSelectedTab] = useState('all'); // 'all' or number_id
    const [numbers, setNumbers] = useState([]);

    useEffect(() => {
        fetchNumbers();
    }, [user]);

    useEffect(() => {
        fetchLogs();
    }, [user, levelFilter, selectedTab]);

    const fetchNumbers = async () => {
        if (!user) return;
        
        try {
            const { data } = await supabase
                .from('numbers')
                .select('id, phone_number, instance_id')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });
            setNumbers(data || []);
        } catch (error) {
            console.error('Error fetching numbers:', error);
        }
    };

    const fetchLogs = async () => {
        if (!user) return;
        
        try {
            setLoading(true);
            let query = supabase
                .from('logs')
                .select('*, numbers(phone_number, instance_id)')
                .order('created_at', { ascending: false })
                .limit(200); // Increased limit

            // Filter by level
            if (levelFilter !== 'all') {
                query = query.eq('level', levelFilter);
            }

            // Filter by number (tab selection)
            if (selectedTab !== 'all') {
                query = query.eq('number_id', selectedTab);
            }

            const { data, error } = await query;
            if (error) throw error;
            setLogs(data || []);
        } catch (error) {
            console.error('Error fetching logs:', error);
        } finally {
            setLoading(false);
        }
    };

    const getLevelIcon = (level) => {
        switch (level) {
            case 'error':
                return <AlertCircle className="h-4 w-4 text-red-500" />;
            case 'warn':
                return <AlertTriangle className="h-4 w-4 text-yellow-500" />;
            case 'info':
                return <Info className="h-4 w-4 text-blue-500" />;
            case 'debug':
                return <Bug className="h-4 w-4 text-gray-500" />;
            default:
                return <Info className="h-4 w-4" />;
        }
    };

    const getLevelBadgeColor = (level) => {
        switch (level) {
            case 'error':
                return 'bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300';
            case 'warn':
                return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300';
            case 'info':
                return 'bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300';
            case 'debug':
                return 'bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300';
            default:
                return 'bg-gray-100 text-gray-800';
        }
    };

    const getNumberDisplayName = (number) => {
        return number?.phone_number || number?.instance_id || '-';
    };

    const filteredLogs = logs.filter(log => {
        const matchesSearch = 
            log.message?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            log.meta?.toString().toLowerCase().includes(searchTerm.toLowerCase()) ||
            getNumberDisplayName(log.numbers)?.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesSearch;
    });

    // Group logs by number for tab counts
    const logsByNumber = {};
    filteredLogs.forEach(log => {
        const key = log.number_id || 'no-instance';
        if (!logsByNumber[key]) {
            logsByNumber[key] = {
                count: 0,
                name: log.number_id ? getNumberDisplayName(log.numbers) : t('logs_page.system_logs')
            };
        }
        logsByNumber[key].count++;
    });

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">{t('logs')}</h2>
                    <p className="text-muted-foreground">{t('logs_page.subtitle')}</p>
                </div>
                <Button
                    variant="outline"
                    size="icon"
                    onClick={fetchLogs}
                    title={t('common.refresh')}
                >
                    <RefreshCw className="h-4 w-4" />
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>{t('logs_page.list_title')}</CardTitle>
                    <CardDescription>{t('logs_page.list_desc')}</CardDescription>
                </CardHeader>
                <CardContent>
                    {/* Tabs for instances */}
                    <div className="mb-4 border-b border-border">
                        <div className="flex gap-2 overflow-x-auto">
                            <button
                                onClick={() => setSelectedTab('all')}
                                className={cn(
                                    "px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
                                    selectedTab === 'all'
                                        ? "border-primary text-primary"
                                        : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                                )}
                            >
                                {t('logs_page.all_logs') || 'All Logs'}
                                {logsByNumber['all'] && (
                                    <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-muted">
                                        {filteredLogs.length}
                                    </span>
                                )}
                            </button>
                            {numbers.map((num) => {
                                const key = num.id;
                                const count = logsByNumber[key]?.count || 0;
                                return (
                                    <button
                                        key={num.id}
                                        onClick={() => setSelectedTab(num.id)}
                                        className={cn(
                                            "px-4 py-2 text-sm font-medium border-b-2 transition-colors whitespace-nowrap",
                                            selectedTab === num.id
                                                ? "border-primary text-primary"
                                                : "border-transparent text-muted-foreground hover:text-foreground hover:border-border"
                                        )}
                                    >
                                        {getNumberDisplayName(num)}
                                        {count > 0 && (
                                            <span className="ml-2 px-2 py-0.5 text-xs rounded-full bg-muted">
                                                {count}
                                            </span>
                                        )}
                                    </button>
                                );
                            })}
                        </div>
                    </div>

                    {/* Filters */}
                    <div className="flex flex-wrap gap-4 mb-4">
                        <div className="flex-1 min-w-[200px]">
                            <div className="relative">
                                <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                                <Input
                                    placeholder={t('common.search')}
                                    value={searchTerm}
                                    onChange={(e) => setSearchTerm(e.target.value)}
                                    className="pl-9"
                                />
                            </div>
                        </div>
                        <select
                            value={levelFilter}
                            onChange={(e) => setLevelFilter(e.target.value)}
                            className="px-3 py-2 rounded-md border bg-background text-sm"
                        >
                            <option value="all">{t('logs_page.all_levels')}</option>
                            <option value="info">{t('logs_page.info')}</option>
                            <option value="warn">{t('logs_page.warn')}</option>
                            <option value="error">{t('logs_page.error')}</option>
                            <option value="debug">{t('logs_page.debug')}</option>
                        </select>
                        {(levelFilter !== 'all') && (
                            <Button
                                variant="outline"
                                size="sm"
                                onClick={() => setLevelFilter('all')}
                            >
                                <X className="h-4 w-4 mr-2" />
                                {t('common.filter')}
                            </Button>
                        )}
                    </div>

                    {/* Logs Table */}
                    {loading ? (
                        <div className="text-center py-8 text-muted-foreground">{t('common.loading')}</div>
                    ) : filteredLogs.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">{t('common.no_data')}</div>
                    ) : (
                        <div className="rounded-md border">
                            <Table>
                                <TableHeader>
                                    <TableRow>
                                        <TableHead className="w-[100px]">{t('logs_page.level')}</TableHead>
                                        <TableHead>{t('logs_page.message')}</TableHead>
                                        <TableHead className="w-[150px]">{t('numbers')}</TableHead>
                                        <TableHead className="w-[180px]">{t('common.date')}</TableHead>
                                    </TableRow>
                                </TableHeader>
                                <TableBody>
                                    {filteredLogs.map((log) => (
                                        <TableRow key={log.id}>
                                            <TableCell>
                                                <div className="flex items-center gap-2">
                                                    {getLevelIcon(log.level)}
                                                    <span className={cn("text-xs px-2 py-1 rounded", getLevelBadgeColor(log.level))}>
                                                        {log.level}
                                                    </span>
                                                </div>
                                            </TableCell>
                                            <TableCell className="max-w-md">
                                                <p className="truncate">{log.message}</p>
                                                {log.meta && (
                                                    <details className="mt-1">
                                                        <summary className="text-xs text-muted-foreground cursor-pointer hover:text-foreground">
                                                            {t('logs_page.metadata')}
                                                        </summary>
                                                        <pre className="text-xs mt-1 p-2 bg-muted rounded overflow-auto max-h-40">
                                                            {JSON.stringify(log.meta, null, 2)}
                                                        </pre>
                                                    </details>
                                                )}
                                            </TableCell>
                                            <TableCell>
                                                <span className="text-sm">
                                                    {log.number_id ? (
                                                        getNumberDisplayName(log.numbers)
                                                    ) : (
                                                        <span className="text-muted-foreground italic">
                                                            {t('logs_page.system') || 'System'}
                                                        </span>
                                                    )}
                                                </span>
                                            </TableCell>
                                            <TableCell>
                                                <span className="text-xs text-muted-foreground">
                                                    {new Date(log.created_at).toLocaleString()}
                                                </span>
                                            </TableCell>
                                        </TableRow>
                                    ))}
                                </TableBody>
                            </Table>
                        </div>
                    )}
                </CardContent>
            </Card>
        </div>
    );
}

```

# src\pages\Numbers.jsx

```jsx
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Search, Plus, MoreHorizontal, RefreshCw, X, Edit, Trash2 } from 'lucide-react';
import { logger } from '../lib/logger';

// Simple Badge component since we don't have it in UI lib yet
function StatusBadge({ status, t }) {
    const styles = {
        active: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
        inactive: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
        pending: "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300"
    };
    const statusText = {
        active: t('connected'),
        inactive: t('disconnected'),
        pending: 'Pending'
    };
    return (
        <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${styles[status] || styles.pending}`}>
            {statusText[status] || status}
        </span>
    );
}

export default function Numbers() {
    const { t } = useTranslation();
    const { user } = useAuth();
    const [searchTerm, setSearchTerm] = useState('');
    const [numbers, setNumbers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingNumber, setEditingNumber] = useState(null);
    const [showDeleteConfirm, setShowDeleteConfirm] = useState(null);
    const [formData, setFormData] = useState({
        phone_number: '',
        instance_id: '',
        api_token: '',
        status: 'active'
    });
    const [saving, setSaving] = useState(false);

    useEffect(() => {
        fetchNumbers();
    }, [user]);

    const fetchNumbers = async () => {
        if (!user) return;
        
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('numbers')
                .select('*')
                .eq('user_id', user.id)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setNumbers(data || []);
        } catch (error) {
            console.error('Error fetching numbers:', error);
        } finally {
            setLoading(false);
        }
    };

    const formatLastSeen = (timestamp) => {
        if (!timestamp) return t('common.no_data');
        const date = new Date(timestamp);
        const now = new Date();
        const diffMs = now - date;
        const diffMins = Math.floor(diffMs / 60000);
        const diffHours = Math.floor(diffMs / 3600000);
        const diffDays = Math.floor(diffMs / 86400000);

        if (diffMins < 1) return t('common.loading');
        if (diffMins < 60) return `${diffMins} ${t('ago')}`;
        if (diffHours < 24) return `${diffHours}h ${t('ago')}`;
        return `${diffDays}d ${t('ago')}`;
    };

    const handleAddNumber = async (e) => {
        e.preventDefault();
        if (!user) return;

        try {
            setSaving(true);
            if (editingNumber) {
                // Update existing number
                const { error } = await supabase
                    .from('numbers')
                    .update({
                        phone_number: formData.phone_number,
                        instance_id: formData.instance_id,
                        api_token: formData.api_token,
                        status: formData.status
                    })
                    .eq('id', editingNumber.id);

                if (error) throw error;
                
                await logger.info(
                    `Number updated: ${formData.phone_number || formData.instance_id}`,
                    { number_id: editingNumber.id },
                    editingNumber.id
                );
            } else {
                // Insert new number
                const { error } = await supabase
                    .from('numbers')
                    .insert({
                        user_id: user.id,
                        phone_number: formData.phone_number,
                        instance_id: formData.instance_id,
                        api_token: formData.api_token,
                        status: formData.status
                    });

                if (error) throw error;
                
                await logger.info(
                    `New number added: ${formData.phone_number || formData.instance_id}`,
                    { instance_id: formData.instance_id }
                );
            }
            
            setShowModal(false);
            setEditingNumber(null);
            setFormData({ phone_number: '', instance_id: '', api_token: '', status: 'active' });
            fetchNumbers();
        } catch (error) {
            console.error('Error saving number:', error);
            await logger.error('Failed to save number', { error: error.message });
            alert(error.message);
        } finally {
            setSaving(false);
        }
    };

    const handleEditNumber = (number) => {
        setEditingNumber(number);
        setFormData({
            phone_number: number.phone_number || '',
            instance_id: number.instance_id || '',
            api_token: number.api_token || '', // Note: In production, you might want to mask this
            status: number.status || 'active'
        });
        setShowModal(true);
    };

    const handleDeleteNumber = async (numberId) => {
        if (!confirm(t('common.confirm_delete'))) return;

        try {
            const { error } = await supabase
                .from('numbers')
                .delete()
                .eq('id', numberId);

            if (error) throw error;

            await logger.warn('Number deleted', { number_id: numberId }, numberId);
            setShowDeleteConfirm(null);
            fetchNumbers();
        } catch (error) {
            console.error('Error deleting number:', error);
            await logger.error('Failed to delete number', { error: error.message }, numberId);
            alert(error.message);
        }
    };

    const filteredNumbers = numbers.filter(num =>
        num.phone_number?.toLowerCase().includes(searchTerm.toLowerCase()) ||
        num.instance_id?.toLowerCase().includes(searchTerm.toLowerCase())
    );

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">{t('numbers_page.title')}</h2>
                    <p className="text-muted-foreground">{t('numbers_page.subtitle')}</p>
                </div>
                <Button onClick={() => setShowModal(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    {t('add_number')}
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>{t('numbers_page.list_title')}</CardTitle>
                    <CardDescription>
                        {t('numbers_page.list_desc')}
                    </CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="flex items-center py-4">
                        <Input
                            placeholder={t('numbers_page.search_placeholder')}
                            value={searchTerm}
                            onChange={(e) => setSearchTerm(e.target.value)}
                            className="max-w-sm"
                        />
                    </div>
                    <div className="rounded-md border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>{t('common.name')}</TableHead>
                                    <TableHead>{t('common.instance_id')}</TableHead>
                                    <TableHead>{t('status')}</TableHead>
                                    <TableHead>{t('common.last_seen')}</TableHead>
                                    <TableHead className="text-right">{t('common.actions')}</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {loading ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                            {t('common.loading')}
                                        </TableCell>
                                    </TableRow>
                                ) : filteredNumbers.length === 0 ? (
                                    <TableRow>
                                        <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                                            {t('common.no_data')}
                                        </TableCell>
                                    </TableRow>
                                ) : (
                                    filteredNumbers.map((number) => (
                                        <TableRow key={number.id}>
                                            <TableCell className="font-medium">
                                                {number.phone_number || number.instance_id || number.id.slice(0, 8)}
                                            </TableCell>
                                            <TableCell>{number.instance_id || '-'}</TableCell>
                                            <TableCell>
                                                <StatusBadge status={number.status || 'pending'} t={t} />
                                            </TableCell>
                                            <TableCell>{formatLastSeen(number.last_seen)}</TableCell>
                                            <TableCell className="text-right">
                                                <div className="flex justify-end gap-2">
                                                    <Button 
                                                        variant="ghost" 
                                                        size="icon"
                                                        onClick={fetchNumbers}
                                                        title={t('numbers_page.refresh')}
                                                    >
                                                        <RefreshCw className="h-4 w-4" />
                                                    </Button>
                                                    <Button 
                                                        variant="ghost" 
                                                        size="icon"
                                                        onClick={() => handleEditNumber(number)}
                                                        title={t('common.edit')}
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button 
                                                        variant="ghost" 
                                                        size="icon"
                                                        onClick={() => setShowDeleteConfirm(number.id)}
                                                        title={t('common.delete')}
                                                        className="text-destructive hover:text-destructive"
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </TableCell>
                                        </TableRow>
                                    ))
                                )}
                            </TableBody>
                        </Table>
                    </div>
                </CardContent>
            </Card>

            {/* Add/Edit Number Modal */}
            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <Card className="w-full max-w-md">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>{editingNumber ? t('common.edit') : t('add_number')}</CardTitle>
                                <Button
                                    variant="ghost"
                                    size="icon"
                                    onClick={() => {
                                        setShowModal(false);
                                        setEditingNumber(null);
                                        setFormData({ phone_number: '', instance_id: '', api_token: '', status: 'active' });
                                    }}
                                >
                                    <X className="h-4 w-4" />
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleAddNumber} className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium">{t('numbers_page.phone_number')}</label>
                                    <Input
                                        value={formData.phone_number}
                                        onChange={(e) => setFormData({ ...formData, phone_number: e.target.value })}
                                        placeholder="+1234567890"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium">{t('common.instance_id')}</label>
                                    <Input
                                        value={formData.instance_id}
                                        onChange={(e) => setFormData({ ...formData, instance_id: e.target.value })}
                                        placeholder="Instance ID from Green-API"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium">API Token</label>
                                    <Input
                                        type="password"
                                        value={formData.api_token}
                                        onChange={(e) => setFormData({ ...formData, api_token: e.target.value })}
                                        placeholder="Green-API token"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium">{t('status')}</label>
                                    <select
                                        value={formData.status}
                                        onChange={(e) => setFormData({ ...formData, status: e.target.value })}
                                        className="w-full px-3 py-2 rounded-md border bg-background text-sm"
                                    >
                                        <option value="active">{t('connected')}</option>
                                        <option value="inactive">{t('disconnected')}</option>
                                    </select>
                                </div>
                                <div className="flex gap-2">
                                    <Button type="submit" className="flex-1" disabled={saving}>
                                        {saving ? t('common.loading') : t('common.add')}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => {
                                            setShowModal(false);
                                            setEditingNumber(null);
                                            setFormData({ phone_number: '', instance_id: '', api_token: '', status: 'active' });
                                        }}
                                    >
                                        {t('common.cancel')}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            )}

            {/* Delete Confirmation Modal */}
            {showDeleteConfirm && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <Card className="w-full max-w-md">
                        <CardHeader>
                            <CardTitle>{t('common.delete')}</CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="mb-4">{t('common.confirm_delete')}</p>
                            <div className="flex gap-2 justify-end">
                                <Button
                                    variant="outline"
                                    onClick={() => setShowDeleteConfirm(null)}
                                >
                                    {t('common.cancel')}
                                </Button>
                                <Button
                                    variant="destructive"
                                    onClick={() => handleDeleteNumber(showDeleteConfirm)}
                                >
                                    {t('common.delete')}
                                </Button>
                            </div>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}

```

# src\pages\OrganizationSettings.jsx

```jsx
import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { ArrowLeft, UserPlus, Trash2, Crown, User } from 'lucide-react';

export default function OrganizationSettings() {
    const { orgId } = useParams();
    const { t } = useTranslation();
    const { user } = useAuth();
    const navigate = useNavigate();
    const [org, setOrg] = useState(null);
    const [members, setMembers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [inviteEmail, setInviteEmail] = useState('');
    const [inviting, setInviting] = useState(false);
    const [isAdmin, setIsAdmin] = useState(false);

    useEffect(() => {
        fetchOrgDetails();
    }, [orgId, user]);

    const fetchOrgDetails = async () => {
        try {
            setLoading(true);
            // Fetch Org
            const { data: orgData, error: orgError } = await supabase
                .from('organizations')
                .select('*')
                .eq('id', orgId)
                .single();
            if (orgError) throw orgError;
            setOrg(orgData);

            // Check if user is admin
            const { data: memberData } = await supabase
                .from('organization_members')
                .select('role')
                .eq('organization_id', orgId)
                .eq('user_id', user?.id)
                .single();
            
            setIsAdmin(memberData?.role === 'admin' || orgData.owner_id === user?.id);

            // Fetch Members
            const { data: membersData, error: membersError } = await supabase
                .from('organization_members')
                .select(`
                    id,
                    role,
                    joined_at,
                    profiles:user_id (id, email, full_name, avatar_url)
                `)
                .eq('organization_id', orgId)
                .order('joined_at', { ascending: false });

            if (membersError) throw membersError;
            setMembers(membersData || []);

        } catch (error) {
            console.error(error);
        } finally {
            setLoading(false);
        }
    };

    const handleInvite = async (e) => {
        e.preventDefault();
        if (!inviteEmail || !isAdmin) return;

        try {
            setInviting(true);
            // Lookup user by email from profiles
            const { data: profileData, error: profileError } = await supabase
                .from('profiles')
                .select('id')
                .eq('email', inviteEmail)
                .single();

            if (profileError || !profileData) {
                alert('User not found. Please make sure the user has signed up first.');
                return;
            }

            // Check if user is already a member
            const { data: existingMember } = await supabase
                .from('organization_members')
                .select('id')
                .eq('organization_id', orgId)
                .eq('user_id', profileData.id)
                .single();

            if (existingMember) {
                alert('User is already a member of this organization.');
                return;
            }

            // Add user to organization
            const { error: insertError } = await supabase
                .from('organization_members')
                .insert({
                    organization_id: orgId,
                    user_id: profileData.id,
                    role: 'member'
                });

            if (insertError) throw insertError;

            alert('Member added successfully!');
            setInviteEmail('');
            fetchOrgDetails();
        } catch (error) {
            console.error('Error inviting member:', error);
            alert(error.message || 'Failed to add member');
        } finally {
            setInviting(false);
        }
    };

    const handleRemoveMember = async (memberId, memberUserId) => {
        if (!isAdmin) return;
        if (!confirm('Are you sure you want to remove this member?')) return;

        // Prevent removing the owner
        if (org?.owner_id === memberUserId) {
            alert('Cannot remove the organization owner');
            return;
        }

        try {
            const { error } = await supabase
                .from('organization_members')
                .delete()
                .eq('id', memberId);

            if (error) throw error;
            fetchOrgDetails();
        } catch (error) {
            console.error('Error removing member:', error);
            alert(error.message);
        }
    };

    if (loading) return <div className="text-center py-8 text-muted-foreground">{t('common.loading')}</div>;
    if (!org) return <div className="text-center py-8">{t('error')}: Organization not found</div>;

    return (
        <div className="space-y-6">
            <div className="flex items-center gap-4">
                <Button variant="ghost" size="icon" onClick={() => navigate('/app/dashboard')}>
                    <ArrowLeft className="h-4 w-4" />
                </Button>
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">{org.name} {t('settings')}</h2>
                    <p className="text-muted-foreground">Organization ID: {org.id.slice(0, 8)}...</p>
                </div>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        {t('settings_page.profile')}
                    </CardTitle>
                    <CardDescription>{t('settings_page.general')}</CardDescription>
                </CardHeader>
                <CardContent>
                    <div className="space-y-2">
                        <p className="text-sm font-medium">{t('common.name')}</p>
                        <p className="text-lg">{org.name}</p>
                        <p className="text-sm font-medium mt-4">{t('common.date')}</p>
                        <p className="text-sm text-muted-foreground">
                            {new Date(org.created_at).toLocaleDateString()}
                        </p>
                    </div>
                </CardContent>
            </Card>

            <Card>
                <CardHeader>
                    <CardTitle>Members</CardTitle>
                    <CardDescription>Manage organization members</CardDescription>
                </CardHeader>
                <CardContent>
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>{t('common.name')}</TableHead>
                                <TableHead>{t('login.email')}</TableHead>
                                <TableHead>Role</TableHead>
                                <TableHead>{t('common.date')}</TableHead>
                                {isAdmin && <TableHead className="text-right">{t('common.actions')}</TableHead>}
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {members.map(member => (
                                <TableRow key={member.id}>
                                    <TableCell className="font-medium">
                                        <div className="flex items-center gap-2">
                                            {member.role === 'admin' || org.owner_id === member.profiles?.id ? (
                                                <Crown className="h-4 w-4 text-yellow-500" />
                                            ) : (
                                                <User className="h-4 w-4 text-muted-foreground" />
                                            )}
                                            {member.profiles?.full_name || member.profiles?.email || 'Unknown'}
                                        </div>
                                    </TableCell>
                                    <TableCell>{member.profiles?.email || '-'}</TableCell>
                                    <TableCell>
                                        <span className={`text-xs px-2 py-1 rounded ${
                                            member.role === 'admin' || org.owner_id === member.profiles?.id
                                                ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300'
                                                : 'bg-muted'
                                        }`}>
                                            {org.owner_id === member.profiles?.id ? 'Owner' : member.role}
                                        </span>
                                    </TableCell>
                                    <TableCell>
                                        {new Date(member.joined_at).toLocaleDateString()}
                                    </TableCell>
                                    {isAdmin && (
                                        <TableCell className="text-right">
                                            {org.owner_id !== member.profiles?.id && (
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleRemoveMember(member.id, member.profiles?.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            )}
                                        </TableCell>
                                    )}
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                </CardContent>
            </Card>

            {isAdmin && (
                <Card>
                    <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                            <UserPlus className="h-5 w-5" />
                            Invite Member
                        </CardTitle>
                        <CardDescription>
                            Add a member to this organization. The user must already have an account.
                        </CardDescription>
                    </CardHeader>
                    <CardContent>
                        <form onSubmit={handleInvite} className="flex gap-2">
                            <Input
                                type="email"
                                placeholder={t('login.email')}
                                value={inviteEmail}
                                onChange={(e) => setInviteEmail(e.target.value)}
                                required
                                className="flex-1"
                            />
                            <Button type="submit" disabled={inviting}>
                                {inviting ? t('common.loading') : 'Invite'}
                            </Button>
                        </form>
                        <p className="text-xs text-muted-foreground mt-2">
                            Note: The user must already be registered. Enter their email address to add them.
                        </p>
                    </CardContent>
                </Card>
            )}
        </div>
    );
}

```

# src\pages\Plans.jsx

```jsx
import { useState, useEffect } from 'react'
import { supabase } from '../lib/supabaseClient'
import { useAuth } from '../context/AuthContext'
import { useTranslation } from 'react-i18next'
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card'
import { Button } from '../components/ui/button'
import { Check } from 'lucide-react'

export default function Plans() {
  const { session } = useAuth()
  const { t } = useTranslation()
  const [plans, setPlans] = useState([])
  const [currentSubscription, setCurrentSubscription] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    fetchPlans()
    fetchSubscription()
  }, [])

  const fetchPlans = async () => {
    const { data, error } = await supabase.from('plans').select('*').order('price_monthly')
    if (error) console.error('Error fetching plans:', error)
    else setPlans(data || [])
  }

  const fetchSubscription = async () => {
    const { data, error } = await supabase
      .from('subscriptions')
      .select('*, plans(*)')
      .eq('user_id', session.user.id)
      .single()

    if (error && error.code !== 'PGRST116') console.error('Error fetching sub:', error)
    else setCurrentSubscription(data)
    setLoading(false)
  }

  const handleSubscribe = async (planId) => {
    const { error } = await supabase.from('subscriptions').upsert({
      user_id: session.user.id,
      plan_id: planId,
      status: 'active'
    }, { onConflict: 'user_id' })

    if (error) alert('Error subscribing: ' + error.message)
    else {
      alert('Subscribed successfully!')
      fetchSubscription()
    }
  }

  if (loading) return <div className="text-center py-8 text-muted-foreground">{t('common.loading')}</div>

  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">{t('landing.plans.select')}</h2>
        <p className="text-muted-foreground">{t('landing.pricing')}</p>
      </div>

      {currentSubscription && (
        <Card className="border-primary/20 bg-primary/5">
          <CardContent className="pt-6">
            <div className="flex items-center gap-2 text-primary">
              <span className="text-xl">💎</span>
              <span>
                {t('landing.plans.select')}: <span className="font-bold">{currentSubscription.plans?.name}</span> ({currentSubscription.status})
              </span>
            </div>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {plans.map(plan => {
          const isCurrent = currentSubscription?.plan_id === plan.id;

          return (
            <Card key={plan.id} className={`flex flex-col ${isCurrent ? 'border-primary shadow-lg' : ''}`}>
              <CardHeader>
                <CardTitle className="text-2xl">{plan.name}</CardTitle>
                <div className="text-4xl font-bold">
                  ${plan.price_monthly}
                  <span className="text-base font-normal text-muted-foreground">{t('landing.plans.month')}</span>
                </div>
              </CardHeader>
              <CardContent className="flex-1 flex flex-col">
                <ul className="mb-8 space-y-3 text-sm flex-grow">
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    {plan.numbers_limit === -1 ? t('landing.plans.unlimited') : plan.numbers_limit} {t('landing.plans.numbers')}
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    {plan.instances_limit === -1 ? t('landing.plans.unlimited') : plan.instances_limit} {t('numbers')}
                  </li>
                  <li className="flex items-center gap-2">
                    <Check className="h-4 w-4 text-green-500" />
                    {plan.invites_limit === -1 ? t('landing.plans.unlimited') : plan.invites_limit} {t('landing.plans.team_members')}
                  </li>
                </ul>

                <Button
                  onClick={() => handleSubscribe(plan.id)}
                  disabled={isCurrent}
                  className="w-full"
                  variant={isCurrent ? 'outline' : 'default'}
                >
                  {isCurrent ? t('landing.plans.select') : t('landing.plans.select')}
                </Button>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}

```

# src\pages\Settings.jsx

```jsx
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { User, Mail, Image, Bell, Lock } from 'lucide-react';

export default function Settings() {
    const { t } = useTranslation();
    const { user } = useAuth();
    const [profile, setProfile] = useState(null);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [formData, setFormData] = useState({
        full_name: '',
        email: '',
        avatar_url: ''
    });

    useEffect(() => {
        fetchProfile();
    }, [user]);

    const fetchProfile = async () => {
        if (!user) return;
        
        try {
            setLoading(true);
            const { data, error } = await supabase
                .from('profiles')
                .select('*')
                .eq('id', user.id)
                .single();

            if (error) throw error;
            setProfile(data);
            setFormData({
                full_name: data.full_name || '',
                email: data.email || user.email || '',
                avatar_url: data.avatar_url || ''
            });
        } catch (error) {
            console.error('Error fetching profile:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSaveProfile = async (e) => {
        e.preventDefault();
        if (!user) return;

        try {
            setSaving(true);
            const { error } = await supabase
                .from('profiles')
                .update({
                    full_name: formData.full_name,
                    email: formData.email,
                    avatar_url: formData.avatar_url
                })
                .eq('id', user.id);

            if (error) throw error;
            alert(t('settings_page.profile_updated'));
            fetchProfile();
        } catch (error) {
            console.error('Error updating profile:', error);
            alert(error.message);
        } finally {
            setSaving(false);
        }
    };

    if (loading) {
        return <div className="text-center py-8 text-muted-foreground">{t('common.loading')}</div>;
    }

    return (
        <div className="space-y-6">
            <div>
                <h2 className="text-3xl font-bold tracking-tight">{t('settings')}</h2>
                <p className="text-muted-foreground">{t('settings_page.subtitle')}</p>
            </div>

            {/* Profile Settings */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5" />
                        {t('settings_page.profile')}
                    </CardTitle>
                    <CardDescription>{t('settings_page.general')}</CardDescription>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleSaveProfile} className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium flex items-center gap-2">
                                <User className="h-4 w-4" />
                                {t('settings_page.full_name')}
                            </label>
                            <Input
                                value={formData.full_name}
                                onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                                placeholder={t('settings_page.full_name')}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium flex items-center gap-2">
                                <Mail className="h-4 w-4" />
                                {t('settings_page.email')}
                            </label>
                            <Input
                                type="email"
                                value={formData.email}
                                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                                placeholder={t('settings_page.email')}
                            />
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium flex items-center gap-2">
                                <Image className="h-4 w-4" />
                                {t('settings_page.avatar_url')}
                            </label>
                            <Input
                                type="url"
                                value={formData.avatar_url}
                                onChange={(e) => setFormData({ ...formData, avatar_url: e.target.value })}
                                placeholder="https://example.com/avatar.jpg"
                            />
                            {formData.avatar_url && (
                                <img
                                    src={formData.avatar_url}
                                    alt="Avatar"
                                    className="w-16 h-16 rounded-full object-cover"
                                    onError={(e) => {
                                        e.target.style.display = 'none';
                                    }}
                                />
                            )}
                        </div>
                        <Button type="submit" disabled={saving}>
                            {saving ? t('common.loading') : t('settings_page.update_profile')}
                        </Button>
                    </form>
                </CardContent>
            </Card>

            {/* Notifications */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Bell className="h-5 w-5" />
                        {t('settings_page.notifications')}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <div className="flex items-center justify-between">
                            <div>
                                <p className="font-medium">{t('settings_page.email_notifications')}</p>
                                <p className="text-sm text-muted-foreground">
                                    Receive email notifications for important events
                                </p>
                            </div>
                            <input type="checkbox" defaultChecked className="rounded" />
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Security */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Lock className="h-5 w-5" />
                        {t('settings_page.security')}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <div className="space-y-4">
                        <p className="text-sm text-muted-foreground">
                            {t('settings_page.change_password_info')}
                        </p>
                        <p className="text-xs text-muted-foreground">
                            To change your password, please use the password reset feature from the login page.
                        </p>
                    </div>
                </CardContent>
            </Card>
        </div>
    );
}

```

# src\pages\Signup.jsx

```jsx
import { useState } from 'react';
import { useTranslation } from 'react-i18next';
import { useNavigate } from 'react-router-dom';
import { supabase } from '../lib/supabaseClient';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '../components/ui/card';
import { Link } from 'react-router-dom';
import { Loader2 } from 'lucide-react';

export default function Signup() {
    const { t } = useTranslation();
    const navigate = useNavigate();
    const [loading, setLoading] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [fullName, setFullName] = useState('');
    const [error, setError] = useState('');
    const [success, setSuccess] = useState(false);

    const handleSignup = async (e) => {
        e.preventDefault();
        setLoading(true);
        setError('');
        setSuccess(false);

        try {
            const { data, error: signUpError } = await supabase.auth.signUp({
                email,
                password,
                options: {
                    data: {
                        full_name: fullName || email.split('@')[0],
                    },
                    emailRedirectTo: `${window.location.origin}/app/dashboard`,
                }
            });

            if (signUpError) {
                setError(signUpError.message || 'Failed to create account');
                return;
            }

            // Check if email confirmation is required
            if (data.user && !data.session) {
                // Email confirmation required
                setSuccess(true);
                setError('');
            } else if (data.session) {
                // Auto-confirmed, redirect to dashboard
                navigate('/app/dashboard', { replace: true });
            }
        } catch (err) {
            console.error('Signup error:', err);
            setError(err.message || 'An unexpected error occurred');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-slate-50 dark:bg-slate-900 p-4">
            <Card className="w-full max-w-md">
                <CardHeader className="space-y-1">
                    <CardTitle className="text-2xl font-bold tracking-tight">{t('signup.title')}</CardTitle>
                    <CardDescription>
                        {t('signup.subtitle')}
                    </CardDescription>
                </CardHeader>
                <form onSubmit={handleSignup}>
                    <CardContent className="space-y-4">
                        {error && (
                            <div className="p-3 text-sm text-red-600 bg-red-50 dark:bg-red-900/20 dark:text-red-400 rounded-md">
                                {error}
                            </div>
                        )}
                        {success && (
                            <div className="p-3 text-sm text-green-600 bg-green-50 dark:bg-green-900/20 dark:text-green-400 rounded-md">
                                {t('signup.account_created')}
                            </div>
                        )}
                        <div className="space-y-2">
                            <label htmlFor="name" className="text-sm font-medium leading-none">
                                {t('signup.full_name')}
                            </label>
                            <Input 
                                id="name" 
                                placeholder="John Doe" 
                                value={fullName}
                                onChange={(e) => setFullName(e.target.value)}
                                required 
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="email" className="text-sm font-medium leading-none">
                                {t('signup.email')}
                            </label>
                            <Input 
                                id="email" 
                                type="email" 
                                placeholder="m@example.com" 
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required 
                            />
                        </div>
                        <div className="space-y-2">
                            <label htmlFor="password" className="text-sm font-medium leading-none">
                                {t('signup.password')}
                            </label>
                            <Input 
                                id="password" 
                                type="password" 
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                minLength={6}
                                required 
                            />
                            <p className="text-xs text-muted-foreground">{t('signup.password_hint')}</p>
                        </div>
                    </CardContent>
                    <CardFooter className="flex flex-col gap-4">
                        <Button className="w-full" disabled={loading || success}>
                            {loading && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                            {loading ? t('signup.creating') : success ? t('signup.check_email') : t('signup.create_account')}
                        </Button>
                        <div className="text-center text-sm text-muted-foreground">
                            {t('signup.already_have_account')}{' '}
                            <Link to="/login" className="underline underline-offset-4 hover:text-primary">
                                {t('login.submit')}
                            </Link>
                        </div>
                    </CardFooter>
                </form>
            </Card>
        </div>
    );
}

```

# src\pages\Webhooks.jsx

```jsx
import { useState, useEffect } from 'react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../context/AuthContext';
import { supabase } from '../lib/supabaseClient';
import { Button } from '../components/ui/button';
import { Input } from '../components/ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../components/ui/card';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '../components/ui/table';
import { Plus, Trash2, Edit, Power, PowerOff, ExternalLink } from 'lucide-react';

export default function Webhooks() {
    const { t } = useTranslation();
    const { user } = useAuth();
    const [webhooks, setWebhooks] = useState([]);
    const [loading, setLoading] = useState(true);
    const [showModal, setShowModal] = useState(false);
    const [editingWebhook, setEditingWebhook] = useState(null);
    const [formData, setFormData] = useState({
        url: '',
        events: [],
        is_active: true,
        secret: ''
    });

    useEffect(() => {
        fetchWebhooks();
    }, [user]);

    const fetchWebhooks = async () => {
        if (!user) return;
        
        try {
            setLoading(true);
            // First get user's organizations
            const { data: orgs } = await supabase
                .from('organization_members')
                .select('organization_id')
                .eq('user_id', user.id);

            if (!orgs || orgs.length === 0) {
                setWebhooks([]);
                return;
            }

            const orgIds = orgs.map(o => o.organization_id);
            const { data, error } = await supabase
                .from('webhooks')
                .select('*, organizations(name)')
                .in('organization_id', orgIds)
                .order('created_at', { ascending: false });

            if (error) throw error;
            setWebhooks(data || []);
        } catch (error) {
            console.error('Error fetching webhooks:', error);
        } finally {
            setLoading(false);
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!user) return;

        try {
            // Get first organization for now (or create one)
            const { data: orgs } = await supabase
                .from('organization_members')
                .select('organization_id')
                .eq('user_id', user.id)
                .limit(1)
                .single();

            if (!orgs) {
                alert('Please create an organization first');
                return;
            }

            const webhookData = {
                organization_id: orgs.organization_id,
                url: formData.url,
                events: formData.events,
                is_active: formData.is_active,
                secret: formData.secret || null
            };

            if (editingWebhook) {
                const { error } = await supabase
                    .from('webhooks')
                    .update(webhookData)
                    .eq('id', editingWebhook.id);
                if (error) throw error;
            } else {
                const { error } = await supabase
                    .from('webhooks')
                    .insert(webhookData);
                if (error) throw error;
            }

            setShowModal(false);
            setEditingWebhook(null);
            setFormData({ url: '', events: [], is_active: true, secret: '' });
            fetchWebhooks();
        } catch (error) {
            console.error('Error saving webhook:', error);
            alert(error.message);
        }
    };

    const handleDelete = async (id) => {
        if (!confirm('Are you sure you want to delete this webhook?')) return;

        try {
            const { error } = await supabase
                .from('webhooks')
                .delete()
                .eq('id', id);
            if (error) throw error;
            fetchWebhooks();
        } catch (error) {
            console.error('Error deleting webhook:', error);
            alert(error.message);
        }
    };

    const toggleActive = async (webhook) => {
        try {
            const { error } = await supabase
                .from('webhooks')
                .update({ is_active: !webhook.is_active })
                .eq('id', webhook.id);
            if (error) throw error;
            fetchWebhooks();
        } catch (error) {
            console.error('Error toggling webhook:', error);
        }
    };

    return (
        <div className="space-y-6">
            <div className="flex items-center justify-between">
                <div>
                    <h2 className="text-3xl font-bold tracking-tight">{t('webhooks')}</h2>
                    <p className="text-muted-foreground">{t('webhooks_page.subtitle')}</p>
                </div>
                <Button onClick={() => setShowModal(true)}>
                    <Plus className="mr-2 h-4 w-4" />
                    {t('webhooks_page.add_webhook')}
                </Button>
            </div>

            <Card>
                <CardHeader>
                    <CardTitle>{t('webhooks_page.list_title')}</CardTitle>
                    <CardDescription>{t('webhooks_page.list_desc')}</CardDescription>
                </CardHeader>
                <CardContent>
                    {loading ? (
                        <div className="text-center py-8 text-muted-foreground">{t('common.loading')}</div>
                    ) : webhooks.length === 0 ? (
                        <div className="text-center py-8 text-muted-foreground">{t('common.no_data')}</div>
                    ) : (
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>{t('webhooks_page.url')}</TableHead>
                                    <TableHead>{t('webhooks_page.events')}</TableHead>
                                    <TableHead>{t('status')}</TableHead>
                                    <TableHead>{t('common.date')}</TableHead>
                                    <TableHead className="text-right">{t('common.actions')}</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {webhooks.map((webhook) => (
                                    <TableRow key={webhook.id}>
                                        <TableCell className="font-medium">
                                            <div className="flex items-center gap-2">
                                                <ExternalLink className="h-4 w-4 text-muted-foreground" />
                                                <span className="max-w-xs truncate">{webhook.url}</span>
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex flex-wrap gap-1">
                                                {(webhook.events || []).slice(0, 2).map((event, i) => (
                                                    <span key={i} className="text-xs bg-muted px-2 py-1 rounded">
                                                        {event}
                                                    </span>
                                                ))}
                                                {(webhook.events || []).length > 2 && (
                                                    <span className="text-xs text-muted-foreground">
                                                        +{(webhook.events || []).length - 2}
                                                    </span>
                                                )}
                                            </div>
                                        </TableCell>
                                        <TableCell>
                                            <Button
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => toggleActive(webhook)}
                                            >
                                                {webhook.is_active ? (
                                                    <>
                                                        <Power className="h-4 w-4 mr-1 text-green-500" />
                                                        {t('connected')}
                                                    </>
                                                ) : (
                                                    <>
                                                        <PowerOff className="h-4 w-4 mr-1 text-red-500" />
                                                        {t('disconnected')}
                                                    </>
                                                )}
                                            </Button>
                                        </TableCell>
                                        <TableCell>
                                            {new Date(webhook.created_at).toLocaleDateString()}
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <div className="flex justify-end gap-2">
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => {
                                                        setEditingWebhook(webhook);
                                                        setFormData({
                                                            url: webhook.url,
                                                            events: webhook.events || [],
                                                            is_active: webhook.is_active,
                                                            secret: webhook.secret || ''
                                                        });
                                                        setShowModal(true);
                                                    }}
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    variant="ghost"
                                                    size="icon"
                                                    onClick={() => handleDelete(webhook.id)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    )}
                </CardContent>
            </Card>

            {showModal && (
                <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
                    <Card className="w-full max-w-md">
                        <CardHeader>
                            <CardTitle>
                                {editingWebhook ? t('webhooks_page.edit_webhook') : t('webhooks_page.add_webhook')}
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <form onSubmit={handleSubmit} className="space-y-4">
                                <div>
                                    <label className="text-sm font-medium">{t('webhooks_page.url')}</label>
                                    <Input
                                        type="url"
                                        value={formData.url}
                                        onChange={(e) => setFormData({ ...formData, url: e.target.value })}
                                        placeholder="https://example.com/webhook"
                                        required
                                    />
                                </div>
                                <div>
                                    <label className="text-sm font-medium">{t('webhooks_page.secret')}</label>
                                    <Input
                                        type="text"
                                        value={formData.secret}
                                        onChange={(e) => setFormData({ ...formData, secret: e.target.value })}
                                        placeholder="Optional webhook secret"
                                    />
                                </div>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="checkbox"
                                        id="is_active"
                                        checked={formData.is_active}
                                        onChange={(e) => setFormData({ ...formData, is_active: e.target.checked })}
                                        className="rounded"
                                    />
                                    <label htmlFor="is_active" className="text-sm font-medium">
                                        {t('webhooks_page.active')}
                                    </label>
                                </div>
                                <div className="flex gap-2">
                                    <Button type="submit" className="flex-1">
                                        {editingWebhook ? t('common.save') : t('common.add')}
                                    </Button>
                                    <Button
                                        type="button"
                                        variant="outline"
                                        onClick={() => {
                                            setShowModal(false);
                                            setEditingWebhook(null);
                                            setFormData({ url: '', events: [], is_active: true, secret: '' });
                                        }}
                                    >
                                        {t('common.cancel')}
                                    </Button>
                                </div>
                            </form>
                        </CardContent>
                    </Card>
                </div>
            )}
        </div>
    );
}

```

# src\services\api.js

```js
// API Base URL
const API_BASE_URL = 'https://n8n-railway-custom-production-1086.up.railway.app'

// Helper function for API calls
async function apiCall(endpoint, method = 'GET', body = null) {
  const url = `${API_BASE_URL}${endpoint}`
  
  const options = {
    method,
    headers: {
      'Content-Type': 'application/json',
    },
  }

  if (body) {
    options.body = JSON.stringify(body)
  }

  try {
    const response = await fetch(url, options)
    
    if (!response.ok) {
      const errorText = await response.text()
      throw new Error(`HTTP ${response.status}: ${errorText}`)
    }

    const data = await response.json()
    return { success: true, data }
  } catch (error) {
    console.error('API Error:', error)
    return { success: false, error: error.message }
  }
}

// Authentication
export async function login(username, password) {
  return apiCall('/webhook/73539861-4649-4b44-ac5b-62a60677a9b8', 'POST', {
    action: 'verifyUser',
    username,
    password,
  })
}

// Users Management
export async function getUsers() {
  return apiCall('/webhook/getUsers', 'POST', {
    action: 'getUsers',
  })
}

export async function createUser(userData) {
  return apiCall('/webhook/createUser', 'POST', {
    action: 'createUser',
    ...userData,
  })
}

export async function updateUser(userId, userData) {
  return apiCall('/webhook/updateUser', 'POST', {
    action: 'updateUser',
    userId,
    ...userData,
  })
}

export async function deleteUser(userId) {
  return apiCall('/webhook/deleteUser', 'POST', {
    action: 'deleteUser',
    userId,
  })
}

// Accounts Management
export async function getUserAccounts(userId) {
  return apiCall('/webhook/getUserAccounts', 'POST', {
    action: 'getUserAccounts',
    userId,
  })
}

export async function addAccount(userId, accountData) {
  return apiCall('/webhook/addAccount', 'POST', {
    action: 'addAccount',
    userId,
    ...accountData,
  })
}

export async function updateAccount(userId, accountId, accountData) {
  return apiCall('/webhook/updateAccount', 'POST', {
    action: 'updateAccount',
    userId,
    accountId,
    ...accountData,
  })
}

export async function deleteAccount(userId, accountId) {
  return apiCall('/webhook/deleteAccount', 'POST', {
    action: 'deleteAccount',
    userId,
    accountId,
  })
}


```

# src\services\greenApi.js

```js
// Green API service - core WhatsApp messaging features
// This module is used by both the admin panel and (optionally) the extension.

const GREEN_API_BASE = 'https://api.green-api.com';

/**
 * Generic Green API call with basic retry and 429 (rate limit) handling.
 */
async function greenApiCall(instanceId, token, endpoint, options = {}) {
  if (!instanceId || !token) {
    return { success: false, error: 'Missing Green API instanceId or token' };
  }

  const url = `${GREEN_API_BASE}/waInstance${instanceId}/${endpoint}/${token}`;

  const config = {
    method: options.method || 'GET',
    headers: {
      'Content-Type': 'application/json',
      ...(options.headers || {}),
    },
  };

  if (options.body) {
    config.body = JSON.stringify(options.body);
  }

  let retries = 3;
  let backoff = 1000;

  while (retries > 0) {
    try {
      const response = await fetch(url, config);

      if (response.status === 429) {
        const retryAfterHeader = response.headers.get('Retry-After');
        const retryAfter =
          retryAfterHeader != null ? parseInt(retryAfterHeader, 10) : 5;
        await new Promise((resolve) => setTimeout(resolve, retryAfter * 1000));
        retries -= 1;
        continue;
      }

      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`Green API ${response.status}: ${errorText}`);
      }

      const data = await response.json();
      return { success: true, data };
    } catch (error) {
      console.error('Green API error:', error);
      retries -= 1;
      if (retries <= 0) {
        return { success: false, error: error.message || 'Green API error' };
      }
      await new Promise((resolve) => setTimeout(resolve, backoff));
      backoff *= 2;
    }
  }

  return { success: false, error: 'Green API request failed' };
}

// 1. Chat list
export async function getChats(instanceId, token) {
  // Endpoint name may differ depending on Green API version; adjust if needed.
  return greenApiCall(instanceId, token, 'getChats');
}

// 2. Chat history
export async function getChatHistory(instanceId, token, chatId, count = 100) {
  return greenApiCall(instanceId, token, 'getChatHistory', {
    method: 'POST',
    body: {
      chatId,
      count,
    },
  });
}

// 3. Incoming notifications (new messages, events)
export async function receiveNotification(instanceId, token) {
  return greenApiCall(instanceId, token, 'receiveNotification');
}

// 4. Delete processed notification
export async function deleteNotification(instanceId, token, receiptId) {
  return greenApiCall(instanceId, token, `deleteNotification/${receiptId}`, {
    method: 'DELETE',
  });
}

// 5. Send text message
export async function sendMessage(instanceId, token, chatId, message) {
  return greenApiCall(instanceId, token, 'sendMessage', {
    method: 'POST',
    body: {
      chatId,
      message,
    },
  });
}

// 6. Send media via URL
export async function sendFileByUrl(
  instanceId,
  token,
  chatId,
  url,
  fileName,
  caption = '',
) {
  return greenApiCall(instanceId, token, 'sendFileByUrl', {
    method: 'POST',
    body: {
      chatId,
      urlFile: url,
      fileName,
      caption,
    },
  });
}

// 7. Chat info (name, etc.)
export async function getChatInfo(instanceId, token, chatId) {
  return greenApiCall(instanceId, token, 'getChatInfo', {
    method: 'POST',
    body: { chatId },
  });
}

// 8. Avatar
export async function getAvatar(instanceId, token, chatId) {
  return greenApiCall(instanceId, token, 'getAvatar', {
    method: 'POST',
    body: { chatId },
  });
}

// 9. Check WhatsApp number
export async function checkWhatsApp(instanceId, token, phoneNumber) {
  return greenApiCall(instanceId, token, 'checkWhatsapp', {
    method: 'POST',
    body: { phoneNumber },
  });
}

// 10. Message status
export async function getMessageStatus(instanceId, token, chatId, messageId) {
  return greenApiCall(instanceId, token, 'getMessageStatus', {
    method: 'POST',
    body: { chatId, idMessage: messageId },
  });
}

// Phone normalization helper (Israeli-focused, similar to extension behavior)
export function normalizePhoneNumber(phone) {
  let cleaned = phone.replace(/\D/g, '');

  if (cleaned.startsWith('0')) {
    cleaned = '972' + cleaned.substring(1);
  }

  if (!cleaned.startsWith('972')) {
    cleaned = '972' + cleaned;
  }

  return `${cleaned}@c.us`;
}

// Convenience helper: load chats with basic enrichment (name/avatar where possible)
export async function loadFullChats(instanceId, token) {
  const chatsResult = await getChats(instanceId, token);

  if (!chatsResult.success) {
    return chatsResult;
  }

  const chats = chatsResult.data || [];

  const enrichedChats = await Promise.all(
    chats.map(async (chat) => {
      try {
        const [infoResult, avatarResult] = await Promise.all([
          getChatInfo(instanceId, token, chat.id || chat.chatId || chat.chatIdString),
          getAvatar(instanceId, token, chat.id || chat.chatId || chat.chatIdString).catch(
            () => ({ success: false }),
          ),
        ]);

        return {
          ...chat,
          // Try a few possible shapes based on Green API docs / existing extension
          name:
            (infoResult.success && (infoResult.data?.name || infoResult.data?.chatName)) ||
            chat.name ||
            chat.id ||
            chat.chatId ||
            chat.chatIdString,
          avatar: avatarResult.success ? avatarResult.data?.urlAvatar : null,
        };
      } catch (error) {
        console.error('Failed to enrich chat:', error);
        return {
          ...chat,
          name: chat.name || chat.id || chat.chatId || chat.chatIdString,
        };
      }
    }),
  );

  return { success: true, data: enrichedChats };
}

export { greenApiCall };



```

# src\services\messageSync.js

```js
import { supabase } from '../lib/supabaseClient';
import {
  getChats,
  getChatHistory,
  receiveNotification,
  deleteNotification,
  getChatInfo,
} from './greenApi';

/**
 * Sync chats from Green API into Supabase `chats` table for a given number.
 *
 * @param {string} numberId - Supabase numbers.id
 * @param {string} instanceId - Green API instance ID
 * @param {string} token - Green API token
 */
/**
 * Sync chats - SMART + BATCHED:
 * - Single Green API call (getChats)
 * - Single select from Supabase for existing chats
 * - Single upsert back to Supabase
 *
 * This avoids hundreds of per-chat SELECTs and drastically reduces network traffic.
 */
export async function syncChatsToSupabase(numberId, instanceId, token, enrichNames = false) {
  try {
    // 1) Fetch chats list from Green API (one request)
    const result = await getChats(instanceId, token);

    if (!result.success) {
      return result;
    }

    const chats = result.data || [];
    if (chats.length === 0) {
      return { success: true, data: [] };
    }

    // 2) Fetch all existing chats for this number in a single query
    const { data: existingChats, error: existingError } = await supabase
      .from('chats')
      .select('id, remote_jid, name')
      .eq('number_id', numberId);

    if (existingError) {
      console.error('Error fetching existing chats during sync:', existingError);
    }

    const existingMap = new Map(
      (existingChats || []).map((c) => [c.remote_jid, c]),
    );

    const rows = [];

    // 3) Build rows to upsert (no per-chat SELECTs)
    for (const chat of chats) {
      const chatRemoteId =
        chat.id || chat.chatId || chat.chatIdString || chat.remoteJid;

      if (!chatRemoteId) continue;

      const lastText =
        chat.lastMessage?.textMessage ||
        chat.lastMessage?.extendedTextMessage?.text ||
        chat.lastMessage?.message ||
        null;

      const lastTs =
        chat.lastMessage?.timestamp != null
          ? new Date(chat.lastMessage.timestamp * 1000).toISOString()
          : null;

      const existing = existingMap.get(chatRemoteId);

      let displayName =
        existing?.name ||
        chat.name ||
        chat.chatName ||
        chat.pushName ||
        chatRemoteId;

      // Optional enrichment for names when explicitly requested (e.g. for a single chat)
      if (enrichNames && !existing?.name) {
        try {
          const infoResult = await getChatInfo(instanceId, token, chatRemoteId);
          if (infoResult.success) {
            displayName =
              infoResult.data?.name ||
              infoResult.data?.chatName ||
              displayName;
          }
        } catch {
          // Ignore enrichment errors – we still upsert basic info
        }
      }

      rows.push({
        id: existing?.id, // when present, Supabase will update instead of insert
        number_id: numberId,
        remote_jid: chatRemoteId,
        name: displayName,
        last_message: lastText,
        last_message_at: lastTs,
      });
    }

    if (rows.length === 0) {
      return { success: true, data: [] };
    }

    // 4) Upsert all chats in a single call
    const { data: upserted, error: upsertError } = await supabase
      .from('chats')
      .upsert(rows)
      .select();

    if (upsertError) {
      console.error('Error upserting chats during sync:', upsertError);
      return {
        success: false,
        error: upsertError.message || 'Failed to upsert chats',
      };
    }

    return { success: true, data: upserted || [] };
  } catch (error) {
    console.error('syncChatsToSupabase error:', error);
    return { success: false, error: error.message || 'Failed to sync chats' };
  }
}

/**
 * Sync messages for a given chat from Green API into Supabase `messages` table.
 *
 * @param {string} chatId - Supabase chats.id
 * @param {string} instanceId - Green API instance ID
 * @param {string} token - Green API token
 * @param {string} remoteJid - Chat JID in Green API format
 * @param {number} limit - How many messages to load
 */
export async function syncMessagesToSupabase(
  chatId,
  instanceId,
  token,
  remoteJid,
  limit = 100,
) {
  try {
    const result = await getChatHistory(instanceId, token, remoteJid, limit);

    if (!result.success) {
      return result;
    }

    const messages = result.data || [];
    const synced = [];

    for (const msg of messages) {
      const ts =
        msg.timestamp != null
          ? new Date(msg.timestamp * 1000).toISOString()
          : new Date().toISOString();

      const { data: existing, error: fetchError } = await supabase
        .from('messages')
        .select('id')
        .eq('chat_id', chatId)
        .eq('timestamp', ts)
        .maybeSingle();

      if (fetchError) {
        console.error('Error fetching existing message during sync:', fetchError);
        continue;
      }

      if (existing?.id) {
        continue;
      }

      const isOutgoing =
        msg.type === 'outgoing' ||
        msg.type === 'outgoingMessage' ||
        msg.fromMe === true;

      // Green API sometimes uses type + typeMessage, sometimes only one of them
      const type = msg.typeMessage || msg.type || '';

      // Text / caption first (exactly like extension)
      let content =
        msg.textMessage ||
        msg.extendedTextMessage?.text ||
        msg.extendedTextMessageData?.text ||
        msg.message ||
        msg.conversation ||
        msg.caption ||
        '';

      // Build media metadata (exactly like extension's makeBubble)
      let mediaMeta = null;
      
      if (type === 'imageMessage' || type === 'image') {
        // Image message - save all media info (handle nested imageMessage object)
        const imageMsg = msg.imageMessage || msg;
        mediaMeta = {
          type: 'image',
          typeMessage: 'imageMessage',
          urlFile: imageMsg.urlFile || msg.urlFile || imageMsg.downloadUrl || msg.downloadUrl || imageMsg.mediaUrl || msg.mediaUrl || null,
          downloadUrl: imageMsg.downloadUrl || msg.downloadUrl || imageMsg.urlFile || msg.urlFile || imageMsg.mediaUrl || msg.mediaUrl || null,
          jpegThumbnail: imageMsg.jpegThumbnail || msg.jpegThumbnail || null,
          caption: imageMsg.caption || msg.caption || content || null,
        };
        if (!content) content = '📷 Image';
      } else if (type === 'videoMessage' || type === 'video') {
        // Video message (handle nested videoMessage object)
        const videoMsg = msg.videoMessage || msg;
        mediaMeta = {
          type: 'video',
          typeMessage: 'videoMessage',
          urlFile: videoMsg.urlFile || msg.urlFile || videoMsg.downloadUrl || msg.downloadUrl || videoMsg.mediaUrl || msg.mediaUrl || null,
          downloadUrl: videoMsg.downloadUrl || msg.downloadUrl || videoMsg.urlFile || msg.urlFile || videoMsg.mediaUrl || msg.mediaUrl || null,
          jpegThumbnail: videoMsg.jpegThumbnail || msg.jpegThumbnail || null,
          caption: videoMsg.caption || msg.caption || content || null,
        };
        if (!content) content = '🎥 Video';
      } else if (type === 'audioMessage' || type === 'audio' || type === 'ptt') {
        // Audio/voice message (handle nested audioMessage object)
        const audioMsg = msg.audioMessage || msg;
        const audioUrl = audioMsg.downloadUrl || msg.downloadUrl || audioMsg.url || msg.url || audioMsg.mediaUrl || msg.mediaUrl || null;
        const duration = audioMsg.seconds || msg.seconds || audioMsg.duration || msg.duration || audioMsg.length || msg.length || 0;
        mediaMeta = {
          type: 'audio',
          typeMessage: type === 'ptt' ? 'ptt' : 'audioMessage',
          downloadUrl: audioUrl,
          url: audioUrl,
          seconds: duration,
          duration: duration,
          mimeType: audioMsg.mimeType || msg.mimeType || 'audio/ogg; codecs=opus',
        };
        if (!content) content = '🎵 Audio';
      } else if (type === 'documentMessage' || type === 'document') {
        // Document message (handle nested documentMessage object)
        const docMsg = msg.documentMessage || msg;
        mediaMeta = {
          type: 'document',
          typeMessage: 'documentMessage',
          fileName: docMsg.fileName || msg.fileName || null,
          downloadUrl: docMsg.downloadUrl || msg.downloadUrl || docMsg.url || msg.url || docMsg.urlFile || msg.urlFile || null,
          caption: docMsg.caption || msg.caption || content || null,
        };
        if (!content) content = '📄 Document';
      } else if (type === 'stickerMessage') {
        mediaMeta = {
          type: 'sticker',
          typeMessage: 'stickerMessage',
          downloadUrl: msg.downloadUrl || msg.urlFile || null,
        };
        if (!content) content = '🩹 Sticker';
      } else if (type === 'locationMessage') {
        mediaMeta = {
          type: 'location',
          typeMessage: 'locationMessage',
          latitude: msg.latitude || msg.locationMessage?.latitude || null,
          longitude: msg.longitude || msg.locationMessage?.longitude || null,
        };
        if (!content) content = '📍 Location';
      }

      // If we still don't have text, use generic media label
      if (!content && !mediaMeta) {
        content = '[Media]';
      }

      const { data, error } = await supabase
        .from('messages')
        .insert({
          chat_id: chatId,
          content,
          is_from_me: isOutgoing,
          timestamp: ts,
          media_meta: mediaMeta, // Store media metadata (exactly like extension)
        })
        .select()
        .single();

      if (!error && data) synced.push(data);
    }

    return { success: true, data: synced };
  } catch (error) {
    console.error('syncMessagesToSupabase error:', error);
    return {
      success: false,
      error: error.message || 'Failed to sync messages',
    };
  }
}

/**
 * Full sync: chats + messages for a given number.
 * SMART: Only sync messages for chats that don't have many messages yet.
 */
export async function fullSync(numberId, instanceId, token, messageLimit = 50) {
  const chatsResult = await syncChatsToSupabase(numberId, instanceId, token, false); // Don't enrich all names

  if (!chatsResult.success) {
    return chatsResult;
  }

  // Only sync messages for chats that have < 10 messages in DB (new chats)
  const chatsToSync = [];
  for (const chat of chatsResult.data) {
    const { count } = await supabase
      .from('messages')
      .select('*', { count: 'exact', head: true })
      .eq('chat_id', chat.id);

    if ((count || 0) < 10) {
      chatsToSync.push(chat);
    }
  }

  const allMessages = [];

  // Batch sync with delay to avoid rate limits
  for (let i = 0; i < chatsToSync.length; i++) {
    const chat = chatsToSync[i];
    
    // Add small delay between chats to avoid rate limiting
    if (i > 0) {
      await new Promise(resolve => setTimeout(resolve, 200));
    }

    const messagesResult = await syncMessagesToSupabase(
      chat.id,
      instanceId,
      token,
      chat.remote_jid,
      messageLimit,
    );

    if (messagesResult.success && messagesResult.data) {
      allMessages.push(...messagesResult.data);
    }
  }

  return {
    success: true,
    data: {
      chats: chatsResult.data,
      messages: allMessages,
    },
  };
}

/**
 * Poll for new Green API notifications and call a callback on new messages.
 * The caller is responsible for scheduling (setInterval).
 */
export async function pollNewMessages(instanceId, token, onNewMessage) {
  try {
    const result = await receiveNotification(instanceId, token);

    if (!result.success || !result.data) {
      return { success: false };
    }

    const notification = result.data;

    const type = notification?.body?.typeWebhook;
    if (type === 'incomingMessageReceived' || type === 'outgoingMessageStatus') {
      const message = notification.body?.messageData;
      if (onNewMessage && message) {
        await onNewMessage(message, notification);
      }
    }

    if (notification?.receiptId) {
      await deleteNotification(instanceId, token, notification.receiptId);
    }

    return { success: true, data: notification };
  } catch (error) {
    console.error('pollNewMessages error:', error);
    return { success: false, error: error.message || 'Polling failed' };
  }
}



```

# supabase_schema.sql

```sql
-- Enable UUID extension if not already enabled
create extension if not exists "uuid-ossp";

create table if not exists public.profiles (
  id uuid not null references auth.users on delete cascade,
  email text,
  full_name text,
  avatar_url text,
  -- Mark if user is allowed to use the system (for extension + app)
  is_active boolean default true,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  primary key (id)
);

-- Ensure is_active exists even if table already created previously
alter table public.profiles
  add column if not exists is_active boolean default true;

-- Enable RLS
alter table public.profiles enable row level security;

-- Policies for profiles
drop policy if exists "Public profiles are viewable by everyone." on public.profiles;
create policy "Public profiles are viewable by everyone." on public.profiles
  for select using (true);

drop policy if exists "Users can insert their own profile." on public.profiles;
create policy "Users can insert their own profile." on public.profiles
  for insert with check (auth.uid() = id);

drop policy if exists "Users can update own profile." on public.profiles;
create policy "Users can update own profile." on public.profiles
  for update using (auth.uid() = id);

-- Create a table for Organizations
create table if not exists public.organizations (
  id uuid default uuid_generate_v4() primary key,
  name text not null,
  owner_id uuid references public.profiles(id) not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS
alter table public.organizations enable row level security;

-- Create a table for Organization Members
create table if not exists public.organization_members (
  id uuid default uuid_generate_v4() primary key,
  organization_id uuid references public.organizations(id) on delete cascade not null,
  user_id uuid references public.profiles(id) on delete cascade not null,
  role text check (role in ('admin', 'member')) default 'member',
  joined_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(organization_id, user_id)
);

-- Enable RLS
alter table public.organization_members enable row level security;

-- Policies for Organizations
drop policy if exists "Users can view own organizations" on public.organizations;
create policy "Users can view own organizations" on public.organizations
  for select using (
    exists (
      select 1 from public.organization_members
      where organization_id = public.organizations.id
      and user_id = auth.uid()
    )
  );

drop policy if exists "Users can create organizations" on public.organizations;
create policy "Users can create organizations" on public.organizations
  for insert with check (auth.uid() = owner_id);

-- Policies for Organization Members
drop policy if exists "Members can view other members" on public.organization_members;
create policy "Members can view other members" on public.organization_members
  for select using (
    exists (
      select 1 from public.organization_members as om
      where om.organization_id = public.organization_members.organization_id
      and om.user_id = auth.uid()
    )
  );

drop policy if exists "Members can add members" on public.organization_members;
create policy "Members can add members" on public.organization_members
  for insert with check (
      exists (
          select 1 from public.organization_members as om
          where om.organization_id = organization_id
          and om.user_id = auth.uid()
          and om.role = 'admin'
      )
      OR
      -- Allow self-insert if you are the owner creating the org (this is tricky, usually handled by backend or function. 
      -- For simplicity in this demo, we might need a trusted function to create org+member together)
      -- Allowing initial member creation:
       exists (
          select 1 from public.organizations as o
          where o.id = organization_id
          and o.owner_id = auth.uid()
       )
  );

drop policy if exists "Admins can delete members" on public.organization_members;
create policy "Admins can delete members" on public.organization_members
  for delete using (
      exists (
          select 1 from public.organization_members as om
          where om.organization_id = public.organization_members.organization_id
          and om.user_id = auth.uid()
          and om.role = 'admin'
      )
      OR
      exists (
          select 1 from public.organizations as o
          where o.id = public.organization_members.organization_id
          and o.owner_id = auth.uid()
      )
  );

-- Function to handle new user signup
create or replace function public.handle_new_user()
returns trigger as $$
begin
  insert into public.profiles (id, email, full_name, avatar_url)
  values (new.id, new.email, new.raw_user_meta_data->>'full_name', new.raw_user_meta_data->>'avatar_url');
  return new;
end;
$$ language plpgsql security definer;

-- Trigger to create profile on signup
drop trigger if exists on_auth_user_created on auth.users;
create trigger on_auth_user_created
  after insert on auth.users
  for each row execute procedure public.handle_new_user();

-- PLANS Table
create table if not exists public.plans (
  id uuid default uuid_generate_v4() primary key,
  name text not null unique, -- 'Free', 'Pro', 'Agency'
  price_monthly numeric,
  numbers_limit int, -- -1 for unlimited
  instances_limit int, -- -1 for unlimited
  invites_limit int, -- -1 for unlimited
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Seed Plans (Idempotent)
insert into public.plans (name, price_monthly, numbers_limit, instances_limit, invites_limit)
values 
  ('Free', 0, 2, 1, 0),
  ('Pro', 29, 10, 10, 1),
  ('Agency', 99, -1, -1, -1)
on conflict (name) do nothing;

-- SUBSCRIPTIONS / USER PLANS Table
create table if not exists public.subscriptions (
  id uuid default uuid_generate_v4() primary key,
  user_id uuid references public.profiles(id) not null,
  plan_id uuid references public.plans(id) not null,
  status text check (status in ('active', 'canceled', 'past_due')) default 'active',
  current_period_end timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id) -- One active subscription per user for simplicity
);

-- Enable RLS for Subscriptions
alter table public.subscriptions enable row level security;

drop policy if exists "Users can view own subscription" on public.subscriptions;
create policy "Users can view own subscription" on public.subscriptions
  for select using (auth.uid() = user_id);

drop policy if exists "Users can insert own subscription" on public.subscriptions;
create policy "Users can insert own subscription" on public.subscriptions
  for insert with check (auth.uid() = user_id);

drop policy if exists "Users can update own subscription" on public.subscriptions;
create policy "Users can update own subscription" on public.subscriptions
  for update using (auth.uid() = user_id);

-- NUMBERS Table
create table if not exists public.numbers (
  id uuid default uuid_generate_v4() primary key,
  phone_number text not null,
  user_id uuid references public.profiles(id), -- Owner
  organization_id uuid references public.organizations(id), -- If belongs to org
  status text default 'active',
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(phone_number)
);

-- Enable RLS for Numbers
alter table public.numbers enable row level security;

-- Policy: Users see numbers they own OR numbers in their organization
drop policy if exists "Users can check own or org numbers" on public.numbers;
create policy "Users can check own or org numbers" on public.numbers
  for select using (
    auth.uid() = user_id OR 
    exists (
      select 1 from public.organization_members om
      where om.organization_id = public.numbers.organization_id
      and om.user_id = auth.uid()
    )
  );

drop policy if exists "Users can insert numbers" on public.numbers;
create policy "Users can insert numbers" on public.numbers
  for insert with check (auth.uid() = user_id);

drop policy if exists "Users can update own numbers" on public.numbers;
create policy "Users can update own numbers" on public.numbers
  for update using (auth.uid() = user_id);

drop policy if exists "Users can delete own numbers" on public.numbers;
create policy "Users can delete own numbers" on public.numbers
  for delete using (auth.uid() = user_id);

-- CHATS Table
create table if not exists public.chats (
  id uuid default uuid_generate_v4() primary key,
  number_id uuid references public.numbers(id) not null,
  remote_jid text not null, -- The other person's ID (e.g., WhatsApp JID)
  name text,
  last_message text,
  last_message_at timestamp with time zone default timezone('utc'::text, now()),
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for Chats
alter table public.chats enable row level security;

-- Policy: Users see chats for numbers they have access to
drop policy if exists "Users can view chats for their numbers" on public.chats;
create policy "Users can view chats for their numbers" on public.chats
  for select using (
    exists (
      select 1 from public.numbers n
      where n.id = public.chats.number_id
      and (
        n.user_id = auth.uid() OR
        exists (
          select 1 from public.organization_members om
          where om.organization_id = n.organization_id
          and om.user_id = auth.uid()
        )
      )
    )
  );

drop policy if exists "Users can insert chats for their numbers" on public.chats;
create policy "Users can insert chats for their numbers" on public.chats
  for insert with check (
    exists (
      select 1 from public.numbers n
      where n.id = public.chats.number_id
      and n.user_id = auth.uid()
    )
  );

drop policy if exists "Users can update chats for their numbers" on public.chats;
create policy "Users can update chats for their numbers" on public.chats
  for update using (
    exists (
      select 1 from public.numbers n
      where n.id = public.chats.number_id
      and n.user_id = auth.uid()
    )
  );

-- MESSAGES Table (Optional, but good for history)
create table if not exists public.messages (
    id uuid default uuid_generate_v4() primary key,
    chat_id uuid references public.chats(id) not null,
    content text,
    is_from_me boolean default false,
    timestamp timestamp with time zone default timezone('utc'::text, now()) not null,
    media_meta jsonb -- Store media metadata (urlFile, downloadUrl, jpegThumbnail, fileName, etc.)
);

-- Add media_meta column if table already exists
alter table public.messages
add column if not exists media_meta jsonb;

alter table public.messages enable row level security;

drop policy if exists "Users can view messages for accessible chats" on public.messages;
create policy "Users can view messages for accessible chats" on public.messages
  for select using (
      exists (
          select 1 from public.chats c
          where c.id = public.messages.chat_id
          and exists (
              select 1 from public.numbers n
              where n.id = c.number_id
              and (
                  n.user_id = auth.uid() OR
                  exists (
                      select 1 from public.organization_members om
                      where om.organization_id = n.organization_id
                      and om.user_id = auth.uid()
                  )
              )
          )
      )
  );

drop policy if exists "Users can insert messages for accessible chats" on public.messages;
create policy "Users can insert messages for accessible chats" on public.messages
  for insert with check (
      exists (
          select 1 from public.chats c
          where c.id = public.messages.chat_id
          and exists (
              select 1 from public.numbers n
              where n.id = c.number_id
              and n.user_id = auth.uid()
          )
      )
  );


-- Update NUMBERS table with Green-API fields
alter table public.numbers 
add column if not exists instance_id text,
add column if not exists api_token text,
add column if not exists last_seen timestamp with time zone,
add column if not exists settings jsonb default '{}'::jsonb;

-- Ensure instance_id is unique
create unique index if not exists numbers_instance_id_idx on public.numbers (instance_id);

-- WEBHOOKS Table
create table if not exists public.webhooks (
  id uuid default uuid_generate_v4() primary key,
  organization_id uuid references public.organizations(id) on delete cascade not null,
  url text not null,
  events jsonb default '[]'::jsonb, -- Array of event names
  is_active boolean default true,
  secret text,
  retry_policy jsonb default '{"max_retries": 3, "backoff": "exponential"}'::jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for Webhooks
alter table public.webhooks enable row level security;

drop policy if exists "Users can view webhooks for their orgs" on public.webhooks;
create policy "Users can view webhooks for their orgs" on public.webhooks
  for select using (
    exists (
      select 1 from public.organization_members om
      where om.organization_id = public.webhooks.organization_id
      and om.user_id = auth.uid()
    )
  );

drop policy if exists "Admins can manage webhooks" on public.webhooks;
create policy "Admins can manage webhooks" on public.webhooks
  for all using (
    exists (
      select 1 from public.organization_members om
      where om.organization_id = public.webhooks.organization_id
      and om.user_id = auth.uid()
      and om.role = 'admin'
    )
  );

-- LOGS Table
create table if not exists public.logs (
  id uuid default uuid_generate_v4() primary key,
  organization_id uuid references public.organizations(id),
  number_id uuid references public.numbers(id),
  level text check (level in ('info', 'warn', 'error', 'debug')) default 'info',
  message text not null,
  meta jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for Logs
alter table public.logs enable row level security;

drop policy if exists "Users can view logs for their scope" on public.logs;
create policy "Users can view logs for their scope" on public.logs
  for select using (
    (organization_id is not null AND exists (
      select 1 from public.organization_members om
      where om.organization_id = public.logs.organization_id
      and om.user_id = auth.uid()
    ))
    OR
    (number_id is not null AND exists (
      select 1 from public.numbers n
      where n.id = public.logs.number_id
      and n.user_id = auth.uid()
    ))
  );

-- AUTOMATION JOBS Table (Simple Queue)
create table if not exists public.automation_jobs (
  id uuid default uuid_generate_v4() primary key,
  organization_id uuid references public.organizations(id),
  type text not null, -- 'sync_contacts', 'broadcast', 'check_status'
  payload jsonb,
  status text check (status in ('pending', 'processing', 'completed', 'failed')) default 'pending',
  run_at timestamp with time zone default timezone('utc'::text, now()),
  result jsonb,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);

-- Enable RLS for Jobs
alter table public.automation_jobs enable row level security;

drop policy if exists "Users can view jobs" on public.automation_jobs;
create policy "Users can view jobs" on public.automation_jobs
  for select using (
    exists (
      select 1 from public.organization_members om
      where om.organization_id = public.automation_jobs.organization_id
      and om.user_id = auth.uid()
    )
  );

drop policy if exists "Users can insert jobs for their orgs" on public.automation_jobs;
create policy "Users can insert jobs for their orgs" on public.automation_jobs
  for insert with check (
    exists (
      select 1 from public.organization_members om
      where om.organization_id = public.automation_jobs.organization_id
      and om.user_id = auth.uid()
    )
  );

drop policy if exists "Users can update jobs for their orgs" on public.automation_jobs;
create policy "Users can update jobs for their orgs" on public.automation_jobs
  for update using (
    exists (
      select 1 from public.organization_members om
      where om.organization_id = public.automation_jobs.organization_id
      and om.user_id = auth.uid()
    )
  );

```

# tailwind.config.js

```js
/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    darkMode: "class",
    theme: {
        extend: {
            colors: {
                border: "hsl(var(--border))",
                input: "hsl(var(--input))",
                ring: "hsl(var(--ring))",
                background: "hsl(var(--background))",
                foreground: "hsl(var(--foreground))",
                primary: {
                    DEFAULT: "hsl(var(--primary))",
                    foreground: "hsl(var(--primary-foreground))",
                },
                secondary: {
                    DEFAULT: "hsl(var(--secondary))",
                    foreground: "hsl(var(--secondary-foreground))",
                },
                destructive: {
                    DEFAULT: "hsl(var(--destructive))",
                    foreground: "hsl(var(--destructive-foreground))",
                },
                muted: {
                    DEFAULT: "hsl(var(--muted))",
                    foreground: "hsl(var(--muted-foreground))",
                },
                accent: {
                    DEFAULT: "hsl(var(--accent))",
                    foreground: "hsl(var(--accent-foreground))",
                },
                popover: {
                    DEFAULT: "hsl(var(--popover))",
                    foreground: "hsl(var(--popover-foreground))",
                },
                card: {
                    DEFAULT: "hsl(var(--card))",
                    foreground: "hsl(var(--card-foreground))",
                },
            },
            borderRadius: {
                lg: "var(--radius)",
                md: "calc(var(--radius) - 2px)",
                sm: "calc(var(--radius) - 4px)",
            },
            fontFamily: {
                sans: ["Inter", "sans-serif"],
            }
        },
    },
    plugins: [],
}

```

# vercel.json

```json
{
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "rewrites": [
    {
      "source": "/(.*)",
      "destination": "/index.html"
    }
  ]
}
```

# vite.config.js

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    open: true
  },
  build: {
    outDir: 'dist',
    sourcemap: false,
    minify: 'esbuild',
    rollupOptions: {
      output: {
        manualChunks: undefined
      }
    }
  }
})


```

