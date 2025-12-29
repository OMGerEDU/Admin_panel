# .gitignore

```
deploy_schema.bat
push_to_main.bat
SUPABASE_EXTENSION_AUTH_SPEC.md
INSTALLATION.txt
supabase_schema.sql
```

# alias.js

```js
// Alias stub - provides compatibility layer for DOM selectors
(function() {
  'use strict';
  
  // This file ensures compatibility between different selector patterns
  // No-op in unified version as we use consistent selectors
  console.log('[Builders] Alias loaded');
})();


```

# auth.js

```js
// Authentication Helper
// Reusable login logic that can be used in both React app and extension

/**
 * Login with email and password using Supabase
 * @param {string} email - User email
 * @param {string} password - User password
 * @returns {Promise<{session: Session, user: User}>} Session and user data
 * @throws {Error} If login fails
 */
async function loginWithEmailPassword(email, password) {
  const supabase = await getSupabaseClient();
  
  const { data, error } = await supabase.auth.signInWithPassword({
    email: email.trim(),
    password: password
  });
  
  if (error) {
    // Normalize error for extension / UI
    throw new Error(error.message || 'Invalid email or password');
  }
  
  if (!data.session || !data.user) {
    throw new Error('Login failed: No session or user data received');
  }
  
  return {
    session: data.session,
    user: data.user
  };
}

/**
 * Fetch user's active numbers from Supabase
 * This function queries the numbers table based on the user's organization membership
 * @param {string} accessToken - Supabase access token from session
 * @returns {Promise<Array>} Array of number objects with id, token, name, etc.
 */
async function fetchUserNumbers(session, userId) {
  const supabase = await getSupabaseClient();
  
  // IMPORTANT: Set the session on the client for authenticated requests
  if (session && session.access_token) {
    try {
      const { data: sessionData, error: sessionError } = await supabase.auth.setSession({
        access_token: session.access_token,
        refresh_token: session.refresh_token || ''
      });
      
      if (sessionError) {
        console.error('[AUTH] Error setting session:', sessionError);
        // Try to continue anyway - might still work with RLS
      }
    } catch (e) {
      console.warn('[AUTH] Could not set session, continuing anyway:', e);
    }
  }
  
  try {
    // Use the userId passed in, or get it from the session
    const userIdToUse = userId || session?.user?.id;
    
    if (!userIdToUse) {
      throw new Error('User ID not available');
    }
    
    console.log('[AUTH] Fetching numbers for user:', userIdToUse);
    
    // First, get the user's profile to check if active
    const { data: profile, error: profileError } = await supabase
      .from('profiles')
      .select('id, is_active, email')
      .eq('id', userIdToUse)
      .single();
    
    if (profileError) {
      console.error('[AUTH] Error fetching profile:', profileError);
      throw new Error('Failed to fetch user profile');
    }
    
    if (!profile || !profile.is_active) {
      throw new Error('User is not active');
    }
    
    // Get user's organizations via organization_members
    const { data: orgMembers, error: orgError } = await supabase
      .from('organization_members')
      .select('organization_id')
      .eq('user_id', profile.id);
    
    if (orgError) {
      console.error('[AUTH] Error fetching organizations:', orgError);
      throw new Error('Failed to fetch user organizations');
    }
    
    const orgIds = orgMembers?.map(m => m.organization_id) || [];
    
    // Fetch active numbers for these organizations
    // Also include numbers directly owned by the user (user_id)
    let numbers = [];
    
    if (orgIds.length > 0) {
      // Fetch numbers from organizations
      const { data: orgNumbers, error: orgNumbersError } = await supabase
        .from('numbers')
        .select('id, phone_number, instance_id, api_token, status, organization_id, user_id')
        .in('organization_id', orgIds)
        .eq('status', 'active');
      
      if (orgNumbersError) {
        console.error('[AUTH] Error fetching org numbers:', orgNumbersError);
      } else {
        numbers = numbers.concat(orgNumbers || []);
      }
    }
    
    // Also fetch numbers directly owned by the user (always, even if no orgs)
    const { data: userNumbers, error: userNumbersError } = await supabase
      .from('numbers')
      .select('id, phone_number, instance_id, api_token, status, organization_id, user_id')
      .eq('user_id', userIdToUse)
      .eq('status', 'active');
    
    if (userNumbersError) {
      console.error('[AUTH] Error fetching user numbers:', userNumbersError);
    } else {
      numbers = numbers.concat(userNumbers || []);
    }
    
    // Remove duplicates (by id)
    const uniqueNumbers = Array.from(
      new Map(numbers.map(num => [num.id, num])).values()
    );
    
    // Filter out duplicates and ensure we have instance_id and api_token
    const validNumbers = uniqueNumbers.filter(num => num.instance_id && num.api_token);
    
    console.log('[AUTH] Found', validNumbers.length, 'valid numbers:', validNumbers.map(n => ({ 
      id: n.instance_id, 
      name: n.phone_number,
      hasToken: !!n.api_token 
    })));
    
    // Transform numbers to extension account format
    const accounts = validNumbers.map((num, index) => ({
      name: num.phone_number || `חשבון ${index + 1}`, // Use phone_number as name if available
      id: num.instance_id,
      token: num.api_token,
      username: profile.email,
      isDefault: index === 0 // First account is default
    }));
    
    console.log('[AUTH] Returning', accounts.length, 'accounts');
    return accounts;
    
  } catch (error) {
    console.error('[AUTH] Error in fetchUserNumbers:', error);
    throw error;
  }
}

/**
 * Fetch user's subscription/plan information
 * @param {Session} session - Supabase session
 * @param {string} userId - User ID
 * @returns {Promise<Object>} Subscription and plan data
 */
async function fetchUserSubscription(session, userId) {
  const supabase = await getSupabaseClient();
  
  // Set session for authenticated requests
  if (session && session.access_token) {
    try {
      await supabase.auth.setSession({
        access_token: session.access_token,
        refresh_token: session.refresh_token || ''
      });
    } catch (e) {
      console.warn('[AUTH] Could not set session for subscription fetch:', e);
    }
  }
  
  try {
    const userIdToUse = userId || session?.user?.id;
    if (!userIdToUse) {
      throw new Error('User ID not available');
    }
    
    // Fetch subscription
    const { data: subscription, error: subError } = await supabase
      .from('subscriptions')
      .select('id, status, current_period_end, plan_id')
      .eq('user_id', userIdToUse)
      .eq('status', 'active')
      .single();
    
    if (subError && subError.code !== 'PGRST116') { // PGRST116 = no rows returned
      console.error('[AUTH] Error fetching subscription:', subError);
    }
    
    // If subscription found, fetch plan details
    if (subscription && subscription.plan_id) {
      const { data: plan, error: planError } = await supabase
        .from('plans')
        .select('id, name, price_monthly, numbers_limit, instances_limit, invites_limit')
        .eq('id', subscription.plan_id)
        .single();
      
      if (!planError && plan) {
        return {
          plan: plan.name || 'Free',
          planDetails: plan,
          status: subscription.status,
          periodEnd: subscription.current_period_end
        };
      }
    }
    
    // Default to Free plan if no subscription
    return {
      plan: 'Free',
      planDetails: {
        name: 'Free',
        price_monthly: 0,
        numbers_limit: 2,
        instances_limit: 1,
        invites_limit: 0
      },
      status: 'active',
      periodEnd: null
    };
    
  } catch (error) {
    console.error('[AUTH] Error in fetchUserSubscription:', error);
    // Return default Free plan on error
    return {
      plan: 'Free',
      planDetails: {
        name: 'Free',
        price_monthly: 0,
        numbers_limit: 2,
        instances_limit: 1,
        invites_limit: 0
      },
      status: 'active',
      periodEnd: null
    };
  }
}

/**
 * Get chat URL for admin panel
 * Finds numberId from Supabase and builds URL with phone number
 * @param {string} instanceId - Green API instance ID
 * @param {string} phoneNumber - Phone number (e.g., "972501234567" or "972501234567@c.us")
 * @param {string} baseUrl - Base URL for admin panel (default: https://admin-panel-788h-git-main-omgeredus-projects.vercel.app)
 * @returns {Promise<string|null>} Full URL to chat in admin panel, or null if not found
 */
async function getChatUrlFromJid(instanceId, phoneNumber, session = null, baseUrl = 'https://ferns.builders-tech.com') {
  const supabase = await getSupabaseClient();
  
  try {
    // Set session on the client if provided
    if (session && session.access_token) {
      try {
        await supabase.auth.setSession({
          access_token: session.access_token,
          refresh_token: session.refresh_token || ''
        });
      } catch (e) {
        console.warn('[CHAT URL] Could not set session, continuing anyway:', e);
      }
    }
    
    // Extract phone number from JID if needed (remove @c.us)
    const cleanPhone = phoneNumber.replace('@c.us', '').replace('+', '');
    
    console.log('[CHAT URL] Searching for:', { instanceId, phoneNumber: cleanPhone, baseUrl });
    await saveLog('info', `[CHAT URL] Searching - instanceId: ${instanceId}, phone: ${cleanPhone}`);
    
    // Check if session is set
    const { data: { session: currentSession } } = await supabase.auth.getSession();
    console.log('[CHAT URL] Current session:', currentSession ? 'exists' : 'none');
    await saveLog('info', `[CHAT URL] Session status: ${currentSession ? 'exists' : 'none'}`);
    
    // Find numberId by instance_id
    console.log('[CHAT URL] Querying numbers table...');
    const { data: number, error: numberError } = await supabase
      .from('numbers')
      .select('id, instance_id, phone_number, user_id, organization_id')
      .eq('instance_id', instanceId)
      .single();
    
    console.log('[CHAT URL] Query result:', { 
      hasData: !!number, 
      hasError: !!numberError,
      error: numberError ? JSON.stringify(numberError) : null
    });
    
    if (numberError) {
      const errorMsg = `[CHAT URL] Error finding number: ${numberError.message || JSON.stringify(numberError)}`;
      console.error(errorMsg, numberError);
      await saveLog('error', errorMsg, numberError);
      
      // Try to see what numbers exist
      const { data: allNumbers } = await supabase
        .from('numbers')
        .select('id, instance_id, phone_number')
        .limit(10);
      console.log('[CHAT URL] Available numbers:', allNumbers);
      await saveLog('info', `[CHAT URL] Available numbers: ${JSON.stringify(allNumbers)}`);
      
      return null;
    }
    
    if (!number) {
      const errorMsg = `[CHAT URL] Number not found for instance_id: ${instanceId}`;
      console.error(errorMsg);
      await saveLog('error', errorMsg);
      
      // Try to see what numbers exist
      const { data: allNumbers } = await supabase
        .from('numbers')
        .select('id, instance_id, phone_number')
        .limit(10);
      console.log('[CHAT URL] Available numbers:', allNumbers);
      await saveLog('info', `[CHAT URL] Available numbers: ${JSON.stringify(allNumbers)}`);
      
      return null;
    }
    
    const numberId = number.id;
    console.log('[CHAT URL] Found number:', { numberId, phone: number.phone_number, instance_id: number.instance_id });
    await saveLog('info', `[CHAT URL] Found number - id: ${numberId}, phone: ${number.phone_number}`);
    
    // Build URL: /app/chats/{numberId}/{phoneNumber}
    const url = `${baseUrl}/app/chats/${numberId}/${cleanPhone}`;
    console.log('[CHAT URL] Built URL:', url);
    await saveLog('success', `[CHAT URL] Built URL: ${url}`, { numberId, phoneNumber: cleanPhone });
    return url;
    
  } catch (error) {
    const errorMsg = `[CHAT URL] Error: ${error.message}`;
    console.error(errorMsg, error);
    await saveLog('error', errorMsg, error);
    return null;
  }
}

/**
 * Save log to chrome.storage for debugging
 */
async function saveLog(level, message, data = null) {
  try {
    const timestamp = new Date().toISOString();
    const logEntry = {
      level,
      message,
      data,
      timestamp
    };
    
    // Get existing logs
    const { debugLogs = [] } = await chrome.storage.local.get(['debugLogs']);
    
    // Add new log (keep last 50 entries)
    const newLogs = [...debugLogs, logEntry].slice(-50);
    
    await chrome.storage.local.set({ debugLogs: newLogs });
  } catch (e) {
    // Silently fail - logging shouldn't break the app
    console.warn('[LOG] Failed to save log:', e);
  }
}

/**
 * Logout from Supabase
 */
async function logout() {
  const supabase = await getSupabaseClient();
  await supabase.auth.signOut();
}


```

# background.js

```js
// Background service worker for context menu
chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: "openBuilders",
    title: "פתח ב-Builders",
    contexts: ["selection"]
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (info.menuItemId === "openBuilders" && info.selectionText) {
    // The popup will handle the phone number when opened
    chrome.action.openPopup();
  }
});


```

# content.js

```js
function unique(arr){ return Array.from(new Set(arr)).filter(Boolean); }

function grabPotentialPhones(){
  const results = [];

  // 1) elements that declare telephone
  document.querySelectorAll('[data-tid*="phone" i],[data-tid="telephone"], [data-testid*="phone" i], [href^="tel:"], a[href*="tel:"]').forEach(el=>{
    const t = (el.textContent||"").trim() || (el.getAttribute('href')||"").replace(/^tel:/i, '').trim();
    if(t) results.push(t);
  });

  // 2) Look for phone numbers in href attributes
  document.querySelectorAll('a[href*="tel:"], a[href*="phone"]').forEach(el=>{
    const href = el.getAttribute('href') || '';
    const telMatch = href.match(/tel:([+\d\s\-()]+)/i);
    if(telMatch && telMatch[1]) {
      results.push(telMatch[1].trim());
    }
  });

  // 3) scan whole body for common phone patterns (Israeli + international)
  // Improved regex to catch more patterns: 050-123-4567, 050 123 4567, 0501234567, +972-50-123-4567, etc.
  const rx = /(\+?\d{1,4}[-.\s]?)?(\(?\d{1,4}\)?[-.\s]?)?(0\d{1,2}[-.\s]?)?\d{2,3}[-.\s]?\d{3,4}[-.\s]?\d{3,4}/g;
  const text = document.body.innerText || document.body.textContent || "";
  let m;
  while((m = rx.exec(text))){
    if(m[0] && m[0].replace(/[^\d+]/g, '').length >= 8) { // At least 8 digits
      results.push(m[0]);
    }
  }

  // Normalize
  const cleaned = results.map(s => {
    let x = (""+s).replace(/[^\d+]/g,"");
    if(x.startsWith("0")) x = x.replace(/^0/,"+972");
    if(/^972/.test(x)) x = "+"+x;
    if(!x.startsWith("+")) x = "+"+x;
    return x;
  }).filter(v => /^\+\d{8,15}$/.test(v));

  return unique(cleaned);
}

// Listen for popup request
chrome.runtime.onMessage.addListener((msg, sender, sendResponse)=>{
  if(msg?.type === "scanPhones"){
    try {
      const phones = grabPotentialPhones();
      sendResponse({phones: phones || []});
      return true; // Required for async response in Manifest V3
    } catch (e) {
      console.error("[CONTENT] Error scanning phones:", e);
      sendResponse({phones: []});
      return true;
    }
  }
  return false;
});


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

# fix_organization_invites.sql

```sql
-- Fix: Create organization_invites table if it doesn't exist
-- This table is needed for organization invitation functionality

-- Create a table for Organization Invites
create table if not exists public.organization_invites (
  id uuid default uuid_generate_v4() primary key,
  organization_id uuid references public.organizations(id) on delete cascade not null,
  email text not null,
  role text check (role in ('admin', 'member')) default 'member',
  invited_by uuid references public.profiles(id) not null,
  status text check (status in ('pending', 'accepted', 'declined', 'expired')) default 'pending',
  expires_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  accepted_at timestamp with time zone,
  unique(organization_id, email, status) -- One pending invite per email per org
);

-- Enable RLS for Organization Invites
alter table public.organization_invites enable row level security;

-- Policies for Organization Invites
drop policy if exists "Users can view invites for their orgs" on public.organization_invites;
create policy "Users can view invites for their orgs" on public.organization_invites
  for select using (
    public.is_organization_member(organization_id, auth.uid())
    OR
    exists (
      select 1 from public.organizations as o
      where o.id = organization_invites.organization_id
      and o.owner_id = auth.uid()
    )
  );

drop policy if exists "Admins can manage invites" on public.organization_invites;
create policy "Admins can manage invites" on public.organization_invites
  for all using (
    public.is_organization_admin(organization_id, auth.uid())
    OR
    exists (
      select 1 from public.organizations as o
      where o.id = organization_invites.organization_id
      and o.owner_id = auth.uid()
    )
  );


```

# gitadd.sh

```sh
git add .
git commit -m "auto update"
git push origin main
```

# icons\icon_base.svg

This is a file of the type: SVG Image

# icons\icon16.png

This is a binary file of the type: Image

# icons\icon32.png

This is a binary file of the type: Image

# icons\icon48.png

This is a binary file of the type: Image

# icons\icon128.png

This is a binary file of the type: Image

# INSTALLATION.txt

```txt
התקנת תוסף Builders

שלבי התקנה:
================

1. פתח את Google Chrome
2. עבור לכתובת: chrome://extensions/
3. הפעל "מצב מפתח" (Developer mode) - מתג בפינה הימנית העליונה
4. לחץ על "טען תוסף לא ארוז" (Load unpacked)
5. בחר את התיקייה builders_production
6. התוסף יופיע בסרגל הכלים שלך

שימוש ראשוני:
==============

1. לחץ על אייקון התוסף
2. הזן שם משתמש וסיסמה (תקבל מהמנהל)
3. החשבונות שלך ייטענו אוטומטית
4. התחל להשתמש בתוסף!

פתרון בעיות:
=============

אם התוסף לא נטען:
- ודא ש"מצב מפתח" מופעל
- ודא שכל הקבצים בתיקייה קיימים
- נסה לרענן את הדף chrome://extensions/

לתמיכה, פנה למנהל המערכת.



```

# logo_header.png

This is a binary file of the type: Image

# logo_header.svg

This is a file of the type: SVG Image

# manifest.json

```json
{
  "manifest_version": 3,
  "name": "Builders • Green API CRM Helper",
  "version": "3.0.0",
  "description": "Builders extension: Direct Green API calls (no webhook). WhatsApp history, send messages, and manage accounts (ID+TOKEN).",
  "action": {
    "default_popup": "popup.html",
    "default_title": "Builders"
  },
  "icons": {
    "16": "icons/icon16.png",
    "32": "icons/icon32.png",
    "48": "icons/icon48.png",
    "128": "icons/icon128.png"
  },
  "permissions": [
    "storage",
    "activeTab",
    "scripting",
    "contextMenus"
  ],
  "host_permissions": [
    "<all_urls>",
    "https://api.greenapi.com/*",
    "https://media.greenapi.com/*",
    "https://*.supabase.co/*",
    "https://cdn.jsdelivr.net/*"
  ],
  "content_scripts": [
    {
      "matches": [
        "<all_urls>"
      ],
      "js": [
        "content.js"
      ],
      "run_at": "document_idle"
    }
  ],
  "background": {
    "service_worker": "background.js"
  }
}


```

# popup.css

```css
:root{
  --emerald:#10a186;
  --emerald-600:#0c7f69;
  --emerald-light:#14c4a3;
  --ink:#0b1110;
  --bg:#0b1110;
  --muted:#ecf7f4;
  --ring: rgba(16,161,134,.35);
  --radius:16px;
  font-family: 'Heebo', system-ui, -apple-system, Segoe UI, Roboto, Helvetica, Arial, "Noto Sans", "Apple Color Emoji", "Segoe UI Emoji", "Segoe UI Symbol";
}
*{box-sizing:border-box}
body{margin:0; width: 750px; height: 600px; background: linear-gradient(180deg,#0d1d1a 0%, #0f2b25 35%, #0d6b59 100%); color:#081310; overflow:hidden; display:flex; flex-direction:column; position:relative}
.app-container{display:flex; flex:1; min-height:0; max-height:calc(100% - 56px); overflow:hidden}

/* Header - Premium Design */
.app-header{display:flex; align-items:center; justify-content:space-between; padding:10px 14px; background:linear-gradient(135deg, #0a0f0e 0%, #0d1413 100%); color:#fff; position:sticky; top:0; z-index:10; box-shadow:0 2px 12px rgba(0,0,0,.3); border-bottom:1px solid rgba(255,255,255,.08); flex-shrink:0; height:56px; box-sizing:border-box}
.brand{display:flex; align-items:center; gap:12px; font-weight:800; letter-spacing:.3px; font-size:18px}
.brand-logo{height:32px; width:auto; object-fit:contain; display:block; filter:drop-shadow(0 2px 4px rgba(0,0,0,.2))}
.brand-text{display:none}
.brand-dot{width:16px;height:16px;border-radius:50%;background:var(--emerald); box-shadow:0 0 8px rgba(16,161,134,.5)}
.header-actions{display:flex; align-items:center; gap:8px}
.header-actions .btn.icon{background:rgba(255,255,255,.08); color:#fff; border:1px solid rgba(255,255,255,.12); padding:10px 12px; border-radius:10px; transition:all 0.2s}
.header-actions .btn.icon:hover{background:rgba(255,255,255,.15); border-color:rgba(16,161,134,.3); transform:translateY(-1px)}
.account-selector{background:rgba(255,255,255,.08); color:#fff; border:1px solid rgba(255,255,255,.12); padding:8px 12px; border-radius:10px; font-size:13px; font-weight:500; cursor:pointer; transition:all 0.2s; min-width:120px; outline:none}
.account-selector:hover{background:rgba(255,255,255,.12); border-color:rgba(16,161,134,.3)}
.account-selector:focus{border-color:var(--emerald); box-shadow:0 0 0 2px rgba(16,161,134,.2)}
.account-selector option{background:#0a0f0e; color:#fff}

/* Sidebar - Premium Design */
.sidebar{width:220px; background:linear-gradient(180deg, rgba(10,15,14,0.98) 0%, rgba(8,12,11,0.98) 100%); border-left:1px solid rgba(255,255,255,0.12); display:flex; flex-direction:column; flex-shrink:0; overflow:hidden; backdrop-filter:blur(10px)}
.sidebar-header{display:flex; align-items:center; justify-content:space-between; padding:14px 16px; border-bottom:1px solid rgba(255,255,255,0.12); background:rgba(0,0,0,.2)}
.sidebar-header h3{margin:0; font-size:14px; color:#fff; font-weight:700; letter-spacing:0.3px}
.sidebar-header .btn.icon{background:rgba(255,255,255,.08); border:1px solid rgba(255,255,255,.12); padding:6px 8px; border-radius:8px; transition:all 0.2s}
.sidebar-header .btn.icon:hover{background:rgba(16,161,134,.2); border-color:var(--emerald); transform:scale(1.05)}
.chats-list{flex:1; overflow-y:auto; overflow-x:hidden; padding:10px 8px; min-height:0}
.chats-list::-webkit-scrollbar{width:6px}
.chats-list::-webkit-scrollbar-track{background:transparent}
.chats-list::-webkit-scrollbar-thumb{background:rgba(255,255,255,.15); border-radius:3px}
.chats-list::-webkit-scrollbar-thumb:hover{background:rgba(255,255,255,.25)}
.chat-item{padding:12px 14px; margin-bottom:6px; border-radius:12px; cursor:pointer; transition:all 0.2s; background:rgba(255,255,255,0.06); border:1px solid rgba(255,255,255,0.08); backdrop-filter:blur(5px)}
.chat-item:hover{background:rgba(255,255,255,0.12); border-color:rgba(16,161,134,0.4); transform:translateX(-2px); box-shadow:0 4px 12px rgba(0,0,0,.2)}
.chat-item.active{background:linear-gradient(135deg, rgba(16,161,134,0.25) 0%, rgba(12,127,105,0.2) 100%); border-color:var(--emerald); box-shadow:0 4px 16px rgba(16,161,134,0.3)}
.chat-item-header{display:flex; align-items:flex-start; gap:12px}
.chat-item-avatar{width:44px; height:44px; border-radius:50%; object-fit:cover; flex-shrink:0; border:2px solid rgba(255,255,255,0.2); box-shadow:0 2px 8px rgba(0,0,0,.2)}
.chat-item-avatar-placeholder{width:44px; height:44px; border-radius:50%; background:linear-gradient(135deg, var(--emerald) 0%, var(--emerald-600) 100%); color:#fff; display:flex; align-items:center; justify-content:center; font-size:18px; font-weight:700; flex-shrink:0; border:2px solid rgba(255,255,255,0.2); box-shadow:0 2px 8px rgba(0,0,0,.2)}
.chat-item-content{flex:1; min-width:0}
.chat-item-name{font-size:14px; font-weight:700; color:#fff; margin-bottom:5px; word-break:break-word; letter-spacing:0.1px; flex:1; min-width:0; overflow:hidden; text-overflow:ellipsis; white-space:nowrap}
.chat-item-name-wrapper{display:flex; align-items:center; gap:12px; margin-bottom:5px; width:100%}
.chat-item-preview{font-size:12px; color:rgba(255,255,255,0.65); overflow:hidden; text-overflow:ellipsis; white-space:nowrap; margin-bottom:3px}
.chat-item-time-wrapper{display:flex; align-items:center; justify-content:space-between; gap:8px; margin-top:2px}
.chat-item-time{font-size:11px; color:rgba(255,255,255,0.45); font-weight:500}
.btn-add-tags{flex-shrink:0; margin-left:auto}
.chats-loading{text-align:center; padding:24px; color:rgba(255,255,255,0.6); font-size:13px}
.chats-empty{text-align:center; padding:24px; color:rgba(255,255,255,0.5); font-size:13px}

/* Main Content Area */
.app-main{padding:6px 6px 0 6px; display:flex; flex-direction:column; flex:1; min-height:0; overflow:hidden; width:0; gap:2px}
.controls{background: rgba(255,255,255,.08); border:1px solid rgba(255,255,255,.15); border-radius: 12px; padding:6px 8px; flex-shrink:0; backdrop-filter:blur(10px); box-shadow:0 4px 16px rgba(0,0,0,.15)}
.input-row{display:flex; gap:10px; align-items:center}
#btnGoToPanel{display:inline-flex; align-items:center; justify-content:center; padding:8px 12px; font-size:16px; background:rgba(16,161,134,.2); border:1px solid var(--emerald); color:#fff; transition:all 0.2s}
#btnGoToPanel:hover{background:rgba(16,161,134,.3); border-color:var(--emerald-light); transform:scale(1.05); box-shadow:0 4px 12px rgba(16,161,134,.3)}
.input{flex:1; padding:8px 10px; border-radius:8px; border:2px solid rgba(255,255,255,.2); outline:none; background:rgba(255,255,255,.95); font-size:12px; transition:all 0.2s; box-shadow:0 2px 8px rgba(0,0,0,.1)}
.input:focus{border-color:var(--emerald); background:#fff; box-shadow:0 0 0 4px rgba(16,161,134,0.15), 0 4px 12px rgba(0,0,0,.15); transform:translateY(-1px)}
.input::placeholder{color:#9ca3af}
.btn{border:none; border-radius:8px; padding:8px 12px; cursor:pointer; font-weight:700; font-size:12px; transition:all 0.2s; box-shadow:0 2px 8px rgba(0,0,0,.15)}
.btn.subtle{background:#fff; color:#0a0f0e; border:2px solid rgba(255,255,255,.3)}
.btn.subtle:hover{background:rgba(255,255,255,.95); transform:translateY(-1px); box-shadow:0 4px 12px rgba(0,0,0,.2)}
.btn.primary{background:linear-gradient(135deg, var(--emerald) 0%, var(--emerald-600) 100%); color:#fff; box-shadow:0 4px 12px rgba(16,161,134,0.3)}
.btn.primary:hover{transform:translateY(-2px); box-shadow:0 6px 16px rgba(16,161,134,0.4); background:linear-gradient(135deg, var(--emerald-light) 0%, var(--emerald) 100%)}
.btn.primary:active{transform:translateY(0)}
.btn.icon{padding:10px 12px; background:rgba(255,255,255,.1); border:1px solid rgba(255,255,255,.2)}
.btn.icon:hover{background:rgba(255,255,255,.2); transform:scale(1.05)}
.tip{font-size:9px; color:rgba(255,255,255,.7); margin-top:2px; padding:3px 5px; background:rgba(255,255,255,.05); border-radius:5px; border-left:2px solid var(--emerald); line-height:1.1}

/* History/Messages Area */
.history{display:flex; flex-direction:column; gap:4px; padding:4px; min-height:0; flex:1; max-height:100%; overflow:hidden; background: rgba(255,255,255,.5); border-radius: 12px; position:relative; backdrop-filter:blur(10px); box-shadow:0 8px 24px rgba(0,0,0,.15), inset 0 1px 0 rgba(255,255,255,.5); margin-bottom:0}
#history{position:relative; display:flex; flex-direction:column; overflow:hidden; min-height:0; height:100%}
#messages{position:relative; display:flex; flex-direction:column; gap:4px; overflow-y:auto; overflow-x:hidden; flex:1; min-height:0; z-index:5; padding:0; width:100%}
#messages::-webkit-scrollbar{width:8px}
#messages::-webkit-scrollbar-track{background:transparent}
#messages::-webkit-scrollbar-thumb{background:rgba(0,0,0,.15); border-radius:4px}
#messages::-webkit-scrollbar-thumb:hover{background:rgba(0,0,0,.25)}
.msg{max-width:75%; padding:12px 16px; border-radius:16px; word-wrap:break-word; white-space:pre-wrap; box-shadow:0 2px 8px rgba(0,0,0,.1); position:relative; line-height:1.5}
.msg.out{align-self:flex-start; background:linear-gradient(135deg, #dff6ef 0%, #c8ede0 100%); border:1px solid rgba(16,161,134,.2); color:#0a0f0e}
.msg.in{align-self:flex-end; background:linear-gradient(135deg, #f1fff9 0%, #e8f9f2 100%); border:1px solid rgba(16,161,134,.15); color:#0a0f0e}
.msg.me{align-self:flex-end; background:linear-gradient(135deg, #f1fff9 0%, #e8f9f2 100%); border:1px solid rgba(16,161,134,.15); color:#0a0f0e}
.meta{font-size:11px; opacity:.65; margin-top:6px; text-align:left; font-weight:500}

/* Audio Message Styles */
.audio-message{display:flex; align-items:center; gap:10px; padding:8px 0}
.audio-icon{font-size:24px; flex-shrink:0}
.audio-player-wrapper{display:flex; align-items:center; gap:8px; flex:1; min-width:0}
.audio-player-wrapper audio{flex:1; min-width:150px; max-width:250px; height:32px; border-radius:6px; background:rgba(255,255,255,.9)}
.audio-download{font-size:18px; text-decoration:none; padding:4px 6px; border-radius:6px; transition:all 0.2s; flex-shrink:0; display:inline-block; line-height:1}
.audio-download:hover{background:rgba(16,161,134,.1); transform:scale(1.1)}
.audio-duration{font-size:11px; color:rgba(0,0,0,.6); font-weight:500; white-space:nowrap; flex-shrink:0}

/* Send Box */
.send-box{display:flex; gap:6px; flex-shrink:0; align-items:flex-end; margin-top:0; margin-bottom:0; padding-bottom:6px}
.send-box .btn.icon{background:rgba(255,255,255,.15); border:1px solid rgba(255,255,255,.2); padding:8px 12px; border-radius:8px; transition:all 0.2s; flex-shrink:0; font-size:11px; cursor:pointer; color:#0a0f0e; font-weight:600; white-space:nowrap}
.send-box .btn.icon:hover{background:rgba(255,255,255,.25); border-color:var(--emerald); transform:scale(1.05)}
.ta{height:40px; resize:none; padding:6px 8px; border-radius:8px; border:2px solid rgba(255,255,255,.2); background:rgba(255,255,255,.95); font-size:12px; font-family:inherit; transition:all 0.2s; box-shadow:0 2px 8px rgba(0,0,0,.1); line-height:1.4; flex:1}
.ta:focus{border-color:var(--emerald); background:#fff; box-shadow:0 0 0 4px rgba(16,161,134,0.15), 0 4px 12px rgba(0,0,0,.15); outline:none}
.file-preview{display:flex; align-items:center; gap:8px; padding:8px 12px; margin-top:4px; background:rgba(255,255,255,.1); border:1px solid rgba(255,255,255,.2); border-radius:8px; font-size:12px; color:#fff}
.file-preview #fileName{flex:1; overflow:hidden; text-overflow:ellipsis; white-space:nowrap}
.file-preview .btn.icon.small{padding:4px 6px; font-size:12px; background:rgba(255,255,255,.1); border:1px solid rgba(255,255,255,.2)}
.file-preview .btn.icon.small:hover{background:rgba(255,255,255,.2); transform:scale(1.1)}

/* Modals - Premium Design */
.backdrop{position:fixed; inset:0; background:rgba(0,0,0,.65); display:flex; align-items:center; justify-content:center; z-index:9999; backdrop-filter:blur(4px)}
.hidden{display:none}
.modal-card{background:#fff; color:#0a0f0e; width: 92%; max-width: 480px; border-radius: 20px; padding: 32px 28px; box-shadow:0 20px 60px rgba(0,0,0,.25), 0 0 0 1px rgba(255,255,255,.1); max-height: 90vh; overflow-y:auto; position:relative}
.modal-card::before{content:''; position:absolute; top:0; left:0; right:0; height:4px; background:linear-gradient(90deg, var(--emerald) 0%, #0c7f69 100%); border-radius:20px 20px 0 0}
.modal-card.wide{max-width: 680px; max-height: 85vh}
.modal-head{display:flex; align-items:center; justify-content:space-between; margin-bottom:0; padding-bottom:0; border-bottom:none}
.modal-head h3{margin:0; font-size:20px; color:#0a0f0e; font-weight:800; letter-spacing:-0.2px}
.modal-head .btn.icon{background:rgba(0,0,0,.05); border:none; padding:8px; border-radius:8px; transition:all 0.2s}
.modal-head .btn.icon:hover{background:rgba(0,0,0,.1); transform:scale(1.1)}
.modal-card .logo{height:56px; margin:0 auto 16px; display:block; width:auto; filter:drop-shadow(0 2px 4px rgba(0,0,0,.1))}
.modal-card h2{margin:0 0 8px 0; text-align:center; font-size:24px; font-weight:800; color:#0a0f0e; letter-spacing:-0.3px}
.modal-card .sub{margin:0 0 28px 0; text-align:center; color:#6b7a90; font-size:14px; line-height:1.5}
.modal-card .form{display:flex; flex-direction:column; gap:20px; margin-top:0}
.modal-card .form label{font-size:13px; font-weight:700; color:#26433d; margin-bottom:6px; display:block; letter-spacing:0.2px}
.modal-card .form .input{width:100%; padding:14px 16px; border-radius:12px; border:2px solid #e1f0ec; outline:none; background:#fafbfc; font-size:15px; transition:all 0.2s; box-sizing:border-box}
.modal-card .form .input:focus{border-color:var(--emerald); background:#fff; box-shadow:0 0 0 4px rgba(16,161,134,0.1)}
.modal-card .form .input::placeholder{color:#9ca3af}
.modal-card .btn.cta{width:100%; margin-top:8px; font-weight:800; background:linear-gradient(135deg, var(--emerald) 0%, #0c7f69 100%); color:#fff; padding:16px; font-size:16px; border-radius:12px; box-shadow:0 4px 12px rgba(16,161,134,0.3); transition:all 0.2s; border:none}
.modal-card .btn.cta:hover{transform:translateY(-1px); box-shadow:0 6px 16px rgba(16,161,134,0.4)}
.modal-card .btn.cta:active{transform:translateY(0)}
.modal-card .btn.cta:disabled{opacity:0.6; cursor:not-allowed; transform:none}
.error-message{color:#dc2626; margin-top:12px; padding:12px 16px; background:#fef2f2; border-radius:10px; border:1px solid #fecaca; font-size:13px; line-height:1.5}
.success-message{color:#059669; margin-top:12px; padding:12px 16px; background:#ecfdf5; border-radius:10px; border:1px solid #a7f3d0; font-size:13px; line-height:1.5}

/* Account Management - Minimalist Design */
.acc-list{background:transparent; border:none; padding:12px 0; margin:0; display:flex; flex-direction:column; gap:6px; flex:1; min-height:60px; overflow-y:auto}
.acc-list::-webkit-scrollbar{width:6px}
.acc-list::-webkit-scrollbar-track{background:transparent}
.acc-list::-webkit-scrollbar-thumb{background:rgba(0,0,0,.1); border-radius:3px}
.acc-list.empty{color:#6b7a90; text-align:center; padding:40px 20px; background:transparent}
.acc-row-minimal{display:flex; align-items:center; padding:12px 16px; border-radius:10px; background:#fff; cursor:pointer; transition:all 0.2s; border:1px solid #e1f0ec; position:relative}
.acc-row-minimal:hover{background:#f8f9fa; border-color:var(--emerald); transform:translateX(-2px)}
.acc-row-minimal.selected{background:linear-gradient(135deg, #f0fdf9 0%, #e8faf6 100%); border-color:var(--emerald); border-width:2px; box-shadow:0 2px 8px rgba(16,161,134,0.15)}
.acc-row-content{display:flex; align-items:center; gap:12px; width:100%}
.acc-checkbox{width:20px; height:20px; border:2px solid #d1d5db; border-radius:6px; display:flex; align-items:center; justify-content:center; flex-shrink:0; transition:all 0.2s}
.acc-row-minimal.selected .acc-checkbox{border-color:var(--emerald); background:var(--emerald)}
.acc-checkbox-inner{width:10px; height:10px; border-radius:3px; background:transparent; transition:all 0.2s}
.acc-checkbox-inner.checked{background:#fff}
.acc-name-minimal{flex:1; font-weight:600; font-size:15px; color:#0a0f0e; word-break:break-word; min-width:0; letter-spacing:-0.1px}
.acc-row-minimal.selected .acc-name-minimal{color:#0a0f0e; font-weight:700}
.btn-del-minimal{background:transparent; border:none; color:#9ca3af; padding:4px 8px; font-size:16px; cursor:pointer; transition:all 0.2s; border-radius:6px; flex-shrink:0; opacity:0; line-height:1}
.acc-row-minimal:hover .btn-del-minimal{opacity:1}
.btn-del-minimal:hover{background:#fee2e2; color:#dc2626; transform:scale(1.1)}
.add-account-form{display:flex; flex-direction:column; gap:18px; margin-top:24px; padding-top:24px; border-top:2px solid #e1f0ec}
.form-row{display:flex; flex-direction:column; gap:10px; width:100%}
.form-row label{font-size:13px; font-weight:700; color:#26433d; margin-bottom:4px; letter-spacing:0.2px}
.form-row .input{width:100%; box-sizing:border-box; padding:12px 14px; border-radius:12px; border:2px solid #e1f0ec; background:#fafbfc; transition:all 0.2s}
.form-row .input:focus{border-color:var(--emerald); background:#fff; box-shadow:0 0 0 4px rgba(16,161,134,0.1)}
.modal-card.wide{max-width:480px; padding:20px; display:flex; flex-direction:column; gap:0}
.modal-head h3{font-size:18px; margin-bottom:12px}
.modal-actions{display:flex; justify-content:flex-start; margin-top:0; padding-top:0; padding-bottom:0; border-top:none; flex-shrink:0}

.empty-pad{height:8px}
.webhook-settings{margin-top:24px; padding-top:24px; border-top:2px solid #e1f0ec}
.webhook-settings h4{margin:0 0 14px 0; font-size:16px; color:#0a0f0e; font-weight:800; letter-spacing:-0.2px}
.test-hint{font-size:12px; color:#6b7a90; margin-top:10px; padding:12px 14px; background:#f8f9fa; border-radius:8px; border:1px solid #e1f0ec; line-height:1.6}

/* Tags System */
.tags-list{display:flex; flex-direction:column; gap:8px; padding:12px 0; margin:0; flex:1; min-height:60px; overflow-y:auto; max-height:300px}
.tag-item{display:flex; align-items:center; gap:12px; padding:10px 14px; background:#fff; border:1px solid #e1f0ec; border-radius:8px; transition:all 0.2s}
.tag-item:hover{background:#f8f9fa; border-color:var(--emerald)}
.tag-color-preview{width:24px; height:24px; border-radius:6px; border:2px solid #e1f0ec; flex-shrink:0}
.tag-name{flex:1; font-weight:600; font-size:14px; color:#0a0f0e}
.tag-color-value{font-size:12px; color:#6b7a90; font-family:monospace}
.btn-tag-del{background:transparent; border:none; color:#9ca3af; padding:4px 8px; font-size:16px; cursor:pointer; transition:all 0.2s; border-radius:6px; flex-shrink:0; opacity:0; line-height:1}
.tag-item:hover .btn-tag-del{opacity:1}
.btn-tag-del:hover{background:#fee2e2; color:#dc2626; transform:scale(1.1)}
.tags-add-section{display:flex; gap:10px; align-items:center; padding:12px 0; border-top:1px solid #e1f0ec; margin-top:12px}
.tags-add-section .input{flex:1}
.tags-add-section input[type="color"]{width:50px; height:40px; border:2px solid #e1f0ec; border-radius:8px; cursor:pointer; padding:2px}
.chat-tags-list{display:flex; flex-direction:column; gap:8px; padding:12px 0; margin:0; max-height:400px; overflow-y:auto}
.chat-tag-option{display:flex; align-items:center; gap:12px; padding:12px 16px; background:#fff; border:2px solid #e1f0ec; border-radius:10px; cursor:pointer; transition:all 0.2s}
.chat-tag-option:hover{background:#f8f9fa; border-color:var(--emerald)}
.chat-tag-option.selected{background:linear-gradient(135deg, #f0fdf9 0%, #e8faf6 100%); border-color:var(--emerald); border-width:2px}
.chat-tag-checkbox{width:20px; height:20px; border:2px solid #d1d5db; border-radius:6px; display:flex; align-items:center; justify-content:center; flex-shrink:0; transition:all 0.2s}
.chat-tag-option.selected .chat-tag-checkbox{border-color:var(--emerald); background:var(--emerald)}
.chat-tag-checkbox-inner{width:10px; height:10px; border-radius:3px; background:transparent; transition:all 0.2s}
.chat-tag-option.selected .chat-tag-checkbox-inner{background:#fff}
.chat-tag-display{display:inline-flex; align-items:center; gap:6px; padding:4px 10px; border-radius:6px; font-size:11px; font-weight:600; color:#fff; margin-left:8px}
.chat-item-tags{display:flex; gap:4px; flex-wrap:wrap; margin-top:4px}

/* Main Menu Styles */
.modal-card.wide{max-width:600px; width:90%}
.modal-head{display:flex; justify-content:space-between; align-items:center; margin-bottom:24px}
.modal-head h2{margin:0; font-size:24px; color:#0a0f0e}
.user-info-section{padding:16px; background:rgba(255,255,255,0.05); border-radius:12px; margin-bottom:20px}
.numbers-section h3{margin:0 0 16px 0; color:#0a0f0e; font-size:18px}
.numbers-list{max-height:400px; overflow-y:auto}
.number-item{padding:16px; margin-bottom:12px; background:rgba(255,255,255,0.08); border:1px solid rgba(255,255,255,0.12); border-radius:12px; cursor:pointer; transition:all 0.2s}
.number-item:hover{background:rgba(255,255,255,0.12); border-color:var(--emerald); transform:translateY(-2px)}
.modal-actions{margin-top:20px; display:flex; gap:12px; justify-content:flex-end}
.loading{text-align:center; padding:40px; color:rgba(0,0,0,0.6)}
.btn.secondary{background:#fff; color:#0a0f0e; border:2px solid #e1f0ec}
.btn.secondary:hover{background:#f8f9fa; border-color:var(--emerald); transform:translateY(-1px)}

```

# popup.html

```html
<!doctype html>
<html lang="he" dir="rtl">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>Builders</title>
  <link rel="stylesheet" href="popup.css" />
</head>
<body>
  <header class="app-header">
    <div class="brand">
      <img src="logo_header.svg" alt="Builders" class="brand-logo" />
    </div>
    <div class="header-actions">
      <select id="accountSelector" class="account-selector" title="בחר חשבון" style="display:none;">
        <!-- Accounts will be populated dynamically -->
      </select>
      <button id="btnAddAccount" class="btn icon" title="הוסף חשבון" style="display:none;">➕</button>
      <button id="btnManage" class="btn icon" title="ניהול חשבונות">⚙️</button>
    </div>
  </header>

  <div class="app-container">
    <!-- Sidebar -->
    <aside id="sidebar" class="sidebar">
      <div class="sidebar-header">
        <h3>צ'אטים אחרונים</h3>
        <button id="btnRefreshChats" class="btn icon" title="רענן">🔄</button>
      </div>
      <div id="chatsList" class="chats-list">
        <div class="chats-loading">טוען צ'אטים...</div>
      </div>
    </aside>

    <!-- Main Content -->
    <main class="app-main">
      <div class="controls">
        <div class="input-row">
          <input id="phoneInput" class="input" placeholder="050-1234567 או 972501234567+" />
          <button id="btnFetch" class="btn primary">טען צ'אט</button>
          <button id="btnGoToPanel" class="btn icon" title="עבור לפאנל" style="display:none;">🌐</button>
        </div>
        <div class="tip">טיפ: אפשר לסמן מספר בדף → קליק ימני → "פתח ב‑Builders".</div>
      </div>

      <section id="history" class="history">
        <div id="messages"></div>
      </section>

      <div class="send-box">
        <input type="file" id="fileInput" accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.xls,.xlsx,.txt" style="display:none;" />
        <textarea id="msg" class="input ta" placeholder="כתבו הודעה לשליחה…"></textarea>
        <button id="btnAttach" class="btn icon" title="צרף קובץ">צירוף קובץ</button>
        <button id="btnSend" class="btn primary">שלח</button>
      </div>
      <div id="filePreview" class="file-preview" style="display:none;">
        <span id="fileName"></span>
        <button id="btnRemoveFile" class="btn icon small">✖</button>
      </div>
    </main>
  </div>

  <!-- Login modal -->
  <div id="loginBackdrop" class="backdrop hidden">
    <div class="modal-card">
      <img src="logo_header.svg" alt="Builders" class="logo" />
      <h2>ברוכים הבאים לתוסף מבית Builders</h2>
      <p class="sub">השילוב המושלם בין מערכת CRM ל‑Green API</p>

      <div id="loginForm" class="form">
        <label>שם משתמש</label>
        <input id="loginUsername" class="input" type="text" placeholder="הכנס שם משתמש" autocomplete="username" />

        <label>סיסמה</label>
        <input id="loginPassword" class="input" type="password" placeholder="הכנס סיסמה" autocomplete="current-password" />
      </div>
      
      <div id="loginError" class="error-message" style="display:none; color:#c00; margin-top:10px; padding:8px; background:#ffe6e6; border-radius:8px;"></div>

      <button id="loginBtn" class="btn cta">התחבר</button>
    </div>
  </div>

  <!-- Main Menu Screen (shown after login) -->
  <div id="mainMenuBackdrop" class="backdrop hidden">
    <div class="modal-card wide">
      <div class="modal-head">
        <h2>תפריט ראשי</h2>
        <button id="mainMenuClose" class="btn icon">✖</button>
      </div>
      
      <!-- User Info & Subscription -->
      <div id="userInfoSection" class="user-info-section" style="padding:16px; background:rgba(255,255,255,0.05); border-radius:12px; margin-bottom:20px;">
        <div id="userInfoContent"></div>
      </div>
      
      <!-- Numbers List -->
      <div class="numbers-section">
        <div style="display:flex; justify-content:space-between; align-items:center; margin-bottom:16px;">
          <h3>מספרים זמינים</h3>
          <button id="btnAddNumber" class="btn primary">➕ הוסף מספר</button>
        </div>
        <div id="numbersList" class="numbers-list">
          <div class="loading">טוען מספרים...</div>
        </div>
      </div>
      
      <!-- Actions -->
      <div class="modal-actions" style="margin-top:20px; display:flex; gap:12px; justify-content:flex-end;">
        <button id="btnGoToPanel" class="btn secondary">🌐 לך לפאנל</button>
        <button id="btnRefreshNumbers" class="btn secondary">🔄 רענן</button>
      </div>
    </div>
  </div>

  <!-- Add Number Modal (reuse onboarding step 2) -->
  <div id="addNumberBackdrop" class="backdrop hidden">
    <div class="modal-card">
      <div class="modal-head">
        <h2>הוסף מספר חדש</h2>
        <button id="addNumberClose" class="btn icon">✖</button>
      </div>
      
      <div class="form">
        <label>שם חשבון</label>
        <input id="addNumberName" class="input" placeholder="Builders Main" />

        <label>ID</label>
        <input id="addNumberId" class="input" placeholder="לדוגמה: 1100123456" />

        <label>TOKEN</label>
        <input id="addNumberToken" class="input" placeholder="api token" />
      </div>
      
      <div id="addNumberError" class="error-message" style="display:none; color:#c00; margin-top:10px; padding:8px; background:#ffe6e6; border-radius:8px;"></div>

      <button id="addNumberSave" class="btn cta">שמור</button>
    </div>
  </div>

  <!-- Accounts modal -->
  <div id="accountsBackdrop" class="backdrop hidden">
    <div class="modal-card wide">
      <div class="modal-head">
        <h3>חשבונות מחוברים</h3>
        <button id="accClose" class="btn icon">✖</button>
      </div>

      <div id="accList" class="acc-list empty">אין חשבונות שמורים</div>

      <div class="modal-actions">
        <button id="accRefresh" class="btn secondary" title="רענן מהדאטאבייס">🔄 רענן</button>
        <button id="accAdd" class="btn secondary">➕ הוסף חשבון</button>
        <button id="accSave" class="btn primary">שמור</button>
      </div>
    </div>
  </div>

  <!-- Tags Management Modal -->
  <div id="tagsBackdrop" class="backdrop hidden">
    <div class="modal-card wide">
      <div class="modal-head">
        <h3>ניהול תגיות</h3>
        <button id="tagsClose" class="btn icon">✖</button>
      </div>

      <div id="tagsList" class="tags-list"></div>
      
      <div class="tags-add-section">
        <input type="text" id="tagNameInput" class="input" placeholder="שם תגית" />
        <input type="color" id="tagColorInput" value="#10a186" />
        <button id="tagAddBtn" class="btn primary">הוסף תגית</button>
      </div>

      <div class="modal-actions">
        <button id="tagsSave" class="btn primary">שמור</button>
      </div>
    </div>
  </div>

  <!-- Chat Tags Modal -->
  <div id="chatTagsBackdrop" class="backdrop hidden">
    <div class="modal-card">
      <div class="modal-head">
        <h3>תגיות לצ'אט</h3>
        <button id="chatTagsClose" class="btn icon">✖</button>
      </div>

      <div id="chatTagsList" class="chat-tags-list"></div>

      <div class="modal-actions">
        <button id="chatTagsSave" class="btn primary">שמור</button>
      </div>
    </div>
  </div>

  <!-- Supabase JS Library (local file for Manifest V3 compatibility) -->
  <script src="supabase.js"></script>
  
  <!-- Extension Scripts -->
  <script src="alias.js"></script>
  <script src="shim.js"></script>
  <script src="supabaseConfig.js"></script>
  <script src="supabaseClient.js"></script>
  <script src="auth.js"></script>
  <script src="popup.js"></script>
</body>
</html>


```

# popup.js

```js
// Builders Direct Version - Direct Green API calls (no webhook)

// Green API base URL
const GREEN_API_BASE = "https://api.greenapi.com";

// Using Supabase authentication directly (no backend API needed)

// Store verified credentials during onboarding
let verifiedUsername = null;
let verifiedPassword = null;

// Performance optimizations - Caching
const avatarCache = new Map(); // Cache for avatars
const chatsCache = { data: null, timestamp: 0, ttl: 30000 }; // Cache chats for 30 seconds
const historyCache = new Map(); // Cache history by chatId

// Debounce helper
function debounce(func, wait) {
  let timeout;
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout);
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
}

// Throttle helper
function throttle(func, limit) {
  let inThrottle;
  return function(...args) {
    if (!inThrottle) {
      func.apply(this, args);
      inThrottle = true;
      setTimeout(() => inThrottle = false, limit);
    }
  };
}

// Verify user credentials with Supabase (direct authentication)
async function verifyUserCredentials(username, password) {
  try {
    console.log("[AUTH] Attempting Supabase login for:", username);
    
    // Use the auth helper to login
    const { session, user } = await loginWithEmailPassword(username, password);
    
    if (!session || !user) {
      return { success: false, error: "פרטים לא תקינים" };
    }
    
    console.log("[AUTH] Login successful, fetching user numbers...");
    
    // Fetch user's active numbers from Supabase
    const accounts = await fetchUserNumbers(session, user.id);
    
    console.log("[AUTH] Fetched accounts:", accounts);
    
    // Check if user is active (this is already checked in fetchUserNumbers, but we return the format the extension expects)
    return {
      success: true,
      exists: true,
      active: true,
      accounts: accounts,
      session: session,
      user: user
    };
    
  } catch (e) {
    console.error("[AUTH] Verification error:", e);
    
    // Map common Supabase errors to Hebrew messages
    const errorMessage = e.message || 'Unknown error';
    
    if (errorMessage.includes('Invalid login credentials') || 
        errorMessage.includes('Invalid email or password') ||
        errorMessage.includes('Email not confirmed')) {
      return { success: false, error: "משתמש לא נמצא במערכת" };
    }
    
    if (errorMessage.includes('not active') || errorMessage.includes('User is not active')) {
      return { success: false, error: "המשתמש לא פעיל" };
    }
    
    return { success: false, error: `שגיאה בבדיקה: ${errorMessage}` };
  }
}

// Rate limit handling with exponential backoff
async function fetchWithRetry(url, options = {}, maxRetries = 3) {
  let lastError;
  
  // If body is FormData, don't set Content-Type header (browser will set it with boundary)
  const isFormData = options.body instanceof FormData;
  if (isFormData && options.headers) {
    const headers = { ...options.headers };
    delete headers['Content-Type'];
    options = { ...options, headers };
  }
  
  for (let attempt = 0; attempt <= maxRetries; attempt++) {
    try {
      const res = await fetch(url, options);
      
      // Check for rate limit (HTTP 429)
      if (res.status === 429) {
        // Get rate limit headers
        const retryAfter = res.headers.get("Retry-After");
        const rateLimitReset = res.headers.get("X-RateLimit-Reset");
        const rateLimitRemaining = res.headers.get("X-RateLimit-Remaining");
        
        console.warn(`[RATE LIMIT] Attempt ${attempt + 1}/${maxRetries + 1}:`, {
          retryAfter,
          rateLimitReset,
          rateLimitRemaining,
          url
        });
        
        // Calculate wait time: exponential backoff (1s, 2s, 4s) or use Retry-After header
        let waitTime = 1000 * Math.pow(2, attempt); // 1s, 2s, 4s
        if (retryAfter) {
          waitTime = parseInt(retryAfter) * 1000;
        } else if (rateLimitReset) {
          const resetTime = parseInt(rateLimitReset) * 1000;
          const now = Date.now();
          waitTime = Math.max(resetTime - now, 1000);
        }
        
        // Don't retry if we've exceeded max retries
        if (attempt >= maxRetries) {
          throw new Error(`Rate limit exceeded. Please try again later. (HTTP 429)`);
        }
        
        console.log(`[RATE LIMIT] Waiting ${waitTime}ms before retry...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        continue; // Retry the request
      }
      
      // For other errors, throw immediately
      if (!res.ok) {
        const errorText = await res.text().catch(() => '');
        throw new Error(`HTTP ${res.status}: ${res.statusText}${errorText ? ' - ' + errorText.substring(0, 100) : ''}`);
      }
      
      // Success - return response
      return res;
      
    } catch (e) {
      lastError = e;
      
      // If it's not a rate limit error and not the last attempt, wait a bit before retry
      if (attempt < maxRetries && !e.message.includes('429')) {
        const waitTime = 500 * (attempt + 1); // 500ms, 1000ms, 1500ms
        console.log(`[RETRY] Waiting ${waitTime}ms before retry (attempt ${attempt + 1})...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        continue;
      }
      
      // Last attempt or non-retryable error
      if (attempt >= maxRetries) {
        throw lastError;
      }
    }
  }
  
  throw lastError;
}

// Phone normalization function from N8N code
function normalizePhoneForAPI(raw) {
  if (!raw) return "";
  
  let input = String(raw);
  
  // ניקוי תווים לא רלוונטיים
  input = input.replace(/[^0-9+]/g, "");
  
  // אם מתחיל עם +
  if (input.startsWith("+")) {
    input = input.substring(1);
  }
  
  // אם מתחיל עם 0 → ישראל (ממיר ל-972)
  if (input.startsWith("0")) {
    input = "972" + input.substring(1);
  }
  
  // אם מתחיל עם 972 → השאר
  if (!input.startsWith("972")) {
    // מניח שישראל ברירת מחדל
    input = "972" + input;
  }
  
  return input;
}

// Fetch avatar for a chat
async function fetchChatAvatar(chatId, forceRefresh = false) {
  const { accounts, selectedIndex } = await getState();
  const acc = accounts[selectedIndex];
  if (!acc || !acc.id || !acc.token || !chatId) {
    console.log("[AVATAR] Missing account or chatId:", { hasAcc: !!acc, hasId: !!acc?.id, hasToken: !!acc?.token, chatId });
    return '';
  }

  // Green API endpoint: https://api.greenapi.com/waInstance{{idInstance}}/getAvatar/{{apiTokenInstance}}
  // Add cache busting parameter if force refresh
  const cacheBuster = forceRefresh ? `?t=${Date.now()}` : '';
  const apiUrl = `${GREEN_API_BASE}/waInstance${acc.id}/getAvatar/${acc.token}${cacheBuster}`;
  
  try {
    const res = await fetchWithRetry(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ chatId: chatId })
    });

    // Check if response is OK
    if (!res.ok) {
      console.log(`[AVATAR] HTTP error for ${chatId}:`, res.status, res.statusText);
      return '';
    }

    // Check content type
    const contentType = res.headers.get("content-type");
    if (!contentType || !contentType.includes("application/json")) {
      console.log(`[AVATAR] Non-JSON response for ${chatId}:`, contentType);
      return '';
    }

    const data = await res.json();
    console.log(`[AVATAR] Response for ${chatId}:`, data);
    
    // Parse avatar URL from response: { "urlAvatar": "...", "available": true }
    if (data && data.urlAvatar) {
      if (data.available === true) {
        // Cache the result
        avatarCache.set(chatId, { url: data.urlAvatar, timestamp: Date.now() });
        return data.urlAvatar;
      } else if (data.available === false) {
        console.log(`[AVATAR] Avatar not available for ${chatId}`);
        // Cache empty result too (for 1 minute)
        avatarCache.set(chatId, { url: '', timestamp: Date.now() });
        return '';
      } else {
        // available field missing, but urlAvatar exists - return it
        avatarCache.set(chatId, { url: data.urlAvatar, timestamp: Date.now() });
        return data.urlAvatar;
      }
    }
    
    console.log(`[AVATAR] No avatar URL in response for ${chatId}`);
    // Cache empty result
    avatarCache.set(chatId, { url: '', timestamp: Date.now() });
    return '';
  } catch (e) {
    console.error(`[AVATAR] Error fetching avatar for ${chatId}:`, e);
    return '';
  }
}

// Get chats list from Green API (lastIncoming + lastOutgoing) - with caching
async function fetchChatsList(forceRefresh = false) {
  const { accounts, selectedIndex } = await getState();
  const acc = accounts[selectedIndex];
  if (!acc) return [];

  // Check cache first
  if (!forceRefresh && chatsCache.data && (Date.now() - chatsCache.timestamp < chatsCache.ttl)) {
    console.log("[CHATS] Using cached chats list");
    return chatsCache.data;
  }

  try {
    // Fetch last incoming messages (last 24 hours = 1440 minutes)
    const incomingUrl = `${GREEN_API_BASE}/waInstance${acc.id}/lastIncomingMessages/${acc.token}?minutes=1440`;
    const outgoingUrl = `${GREEN_API_BASE}/waInstance${acc.id}/lastOutgoingMessages/${acc.token}`;
    
    console.log("[CHATS] Fetching incoming messages...");
    const incomingRes = await fetchWithRetry(incomingUrl).catch(e => {
      console.error("[CHATS] Failed to fetch incoming messages:", e);
      return null;
    });
    if (!incomingRes || !incomingRes.ok) {
      console.error("[CHATS] Failed to fetch incoming messages");
      return [];
    }
    
    console.log("[CHATS] Fetching outgoing messages...");
    const outgoingRes = await fetchWithRetry(outgoingUrl).catch(e => {
      console.error("[CHATS] Failed to fetch outgoing messages:", e);
      return null;
    });
    if (!outgoingRes || !outgoingRes.ok) {
      console.error("[CHATS] Failed to fetch outgoing messages");
      return [];
    }
    
    const incomingData = await incomingRes.json();
    const outgoingData = await outgoingRes.json();
    
    console.log("[CHATS] Incoming messages:", incomingData);
    console.log("[CHATS] Outgoing messages:", outgoingData);
    
    // Parse responses - Green API returns { data: [...] } or direct array
    let incomingMessages = [];
    let outgoingMessages = [];
    
    if (Array.isArray(incomingData)) {
      incomingMessages = incomingData;
    } else if (incomingData.data && Array.isArray(incomingData.data)) {
      incomingMessages = incomingData.data;
    } else if (incomingData.messages && Array.isArray(incomingData.messages)) {
      incomingMessages = incomingData.messages;
    }
    
    if (Array.isArray(outgoingData)) {
      outgoingMessages = outgoingData;
    } else if (outgoingData.data && Array.isArray(outgoingData.data)) {
      outgoingMessages = outgoingData.data;
    } else if (outgoingData.messages && Array.isArray(outgoingData.messages)) {
      outgoingMessages = outgoingData.messages;
    }
    
    // Combine both arrays
    const allMessages = [...incomingMessages, ...outgoingMessages];
    console.log("[CHATS] Total messages:", allMessages.length);
    
    if (allMessages.length === 0) {
      return [];
    }
    
    // Group messages by chatId and get last message for each chat
    const chatsMap = new Map();
    let messagesWithoutChatId = 0;
    
    allMessages.forEach((msg, idx) => {
      const chatId = msg.chatId;
      if (!chatId) {
        messagesWithoutChatId++;
        if (idx < 3) console.log("[CHATS] Message without chatId:", { type: msg.type, typeMessage: msg.typeMessage, id: msg.idMessage });
        return;
      }
      
      // Extract phone number from chatId (remove @c.us)
      const phone = chatId.replace('@c.us', '').replace('+', '');
      
      // Get message text
      let text = '';
      if (msg.textMessage) {
        text = msg.textMessage;
      } else if (msg.extendedTextMessage && msg.extendedTextMessage.text) {
        text = msg.extendedTextMessage.text;
      } else if (msg.typeMessage === 'audioMessage') {
        text = '🎵 הודעת קול';
      } else if (msg.typeMessage === 'imageMessage') {
        text = '📷 תמונה';
      } else if (msg.typeMessage === 'videoMessage') {
        text = '🎥 וידאו';
      } else if (msg.typeMessage === 'documentMessage') {
        text = '📄 מסמך';
      } else if (msg.typeMessage === 'quotedMessage') {
        text = msg.extendedTextMessage?.text || '💬 הודעה מצוטטת';
      } else if (msg.typeMessage === 'deletedMessage') {
        text = '🗑️ הודעה נמחקה';
      } else {
        text = '📎 הודעה';
      }
      
      // Get sender name if available (for incoming messages)
      const senderName = msg.senderName || msg.senderContactName || '';
      
      // Get avatar URL if available
      const avatarUrl = msg.avatar || msg.senderAvatar || msg.avatarUrl || '';
      
      // Check if this chat already exists or if this message is newer
      const existingChat = chatsMap.get(chatId);
      if (!existingChat || (msg.timestamp > (existingChat.timestamp || 0))) {
        chatsMap.set(chatId, {
          chatId: chatId,
          phone: phone,
          name: senderName || existingChat?.name || phone,
          avatar: avatarUrl || existingChat?.avatar || '',
          lastMessage: text,
          lastMessageTime: msg.timestamp,
          timestamp: msg.timestamp
        });
      } else if (existingChat) {
        // Update name/avatar if we got better info
        if (senderName && (existingChat.name === existingChat.phone || !existingChat.name)) {
          existingChat.name = senderName;
        }
        if (avatarUrl && !existingChat.avatar) {
          existingChat.avatar = avatarUrl;
        }
      }
    });
    
    if (messagesWithoutChatId > 0) {
      console.log(`[CHATS] Warning: ${messagesWithoutChatId} messages without chatId`);
    }
    
    // Convert map to array and sort by timestamp (newest first)
    const chats = Array.from(chatsMap.values());
    chats.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
    
    console.log("[CHATS] Grouped into", chats.length, "chats");
    console.log("[CHATS] Sample chats:", chats.slice(0, 3));
    
    // Update cache
    chatsCache.data = chats;
    chatsCache.timestamp = Date.now();
    
    return chats;
  } catch (e) {
    console.error("Fetch chats error:", e);
    return [];
  }
}

// Render chats list in sidebar
async function renderChatsList() {
  const chatsList = qs("#chatsList");
  if (!chatsList) {
    console.error("[CHATS] chatsList element not found!");
    return;
  }
  
  chatsList.innerHTML = '<div class="chats-loading" style="text-align:center; padding:24px; color:rgba(255,255,255,0.6); font-size:13px;">טוען צ\'אטים...</div>';
  
  console.log("[CHATS] Starting to fetch chats list...");
  const chats = await fetchChatsList();
  console.log("[CHATS] Received chats:", chats.length, chats);
  
  if (chats.length === 0) {
    chatsList.innerHTML = '<div class="chats-empty" style="text-align:center; padding:24px; color:rgba(255,255,255,0.5); font-size:13px;">אין צ\'אטים זמינים</div>';
    return;
  }
  
  const frag = document.createDocumentFragment();
  
  // Render chats (fetch avatars in parallel if needed)
  for (const chat of chats) {
    const chatItem = document.createElement("div");
    chatItem.className = "chat-item";
    
    // Use phone from chatId or phone field
    const phone = chat.phone || chat.chatId?.replace('@c.us', '').replace('+', '') || '';
    chatItem.dataset.phone = phone;
    chatItem.dataset.chatId = chat.chatId || '';
    
    // Format phone number for display
    const displayPhone = formatPhoneForDisplay(phone);
    const name = chat.name || displayPhone || 'ללא שם';
    const preview = chat.lastMessage || chat.preview || '';
    const time = chat.lastMessageTime || chat.timestamp || '';
    let avatar = chat.avatar || '';
    
    // Always try to fetch avatar (force refresh to get latest)
    if (chat.chatId) {
      fetchChatAvatar(chat.chatId, true).then(avatarUrl => {
        if (avatarUrl) {
          const img = chatItem.querySelector('.chat-item-avatar');
          const placeholder = chatItem.querySelector('.chat-item-avatar-placeholder');
          if (img) {
            img.src = avatarUrl;
            img.style.display = 'block';
            if (placeholder) placeholder.style.display = 'none';
          } else if (placeholder) {
            // Create img element
            const newImg = document.createElement('img');
            newImg.src = avatarUrl;
            newImg.alt = name;
            newImg.className = 'chat-item-avatar';
            newImg.onerror = function() {
              this.style.display = 'none';
              if (placeholder) placeholder.style.display = 'flex';
            };
            placeholder.parentNode.insertBefore(newImg, placeholder);
            placeholder.style.display = 'none';
          }
          chat.avatar = avatarUrl; // Cache it
        }
      }).catch(e => console.warn("Avatar fetch failed:", e));
    }
    
    const chatId = chat.chatId || '';
    
    chatItem.innerHTML = `
      <div class="chat-item-header">
        ${avatar ? `<img src="${escapeHtml(avatar)}" alt="${escapeHtml(name)}" class="chat-item-avatar" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />` : ''}
        <div class="chat-item-avatar-placeholder" style="${avatar ? 'display:none;' : ''}">${name.charAt(0).toUpperCase()}</div>
        <div class="chat-item-content">
          <div class="chat-item-name-wrapper">
            <div class="chat-item-name">${escapeHtml(name)}</div>
          </div>
          ${preview ? `<div class="chat-item-preview">${escapeHtml(preview)}</div>` : ''}
          <div class="chat-item-time-wrapper">
            ${time ? `<div class="chat-item-time">${formatTime(time)}</div>` : ''}
            <button class="btn icon btn-add-tags" style="padding:4px 6px; font-size:12px; opacity:0.6;" title="הוסף תגיות" data-chat-id="${chatId}">🏷️</button>
          </div>
          <div class="chat-item-tags"></div>
        </div>
      </div>
    `;
    
    // Render tags immediately (async, non-blocking)
    const tagsContainer = chatItem.querySelector('.chat-item-tags');
    if (tagsContainer) {
      renderChatTags(chatId, tagsContainer).catch(e => console.error("[TAGS] Error:", e));
    }
    
    // Add tags button handler
    const tagsBtn = chatItem.querySelector('.btn-add-tags');
    if (tagsBtn && chatId) {
      tagsBtn.addEventListener("click", async (e) => {
        e.stopPropagation();
        await showChatTagsModal(chatId);
      });
    }
    
    chatItem.addEventListener("click", async () => {
      // Remove active class from all items
      qsa(".chat-item").forEach(item => item.classList.remove("active"));
      // Add active class to clicked item
      chatItem.classList.add("active");
      // Load chat history (use cache if available)
      if (phone) {
        qs("#phoneInput").value = phone;
        updateGoToPanelButton(); // Update button visibility
        await fetchHistory(false); // Use cache if available
      }
      // Save state after a short delay to ensure everything is updated
      setTimeout(() => saveState(), 200);
    });
    
    frag.appendChild(chatItem);
  }
  
  chatsList.innerHTML = '';
  chatsList.appendChild(frag);
  console.log("[CHATS] Rendered", chats.length, "chats in sidebar");
}

function escapeHtml(text) {
  const div = document.createElement('div');
  div.textContent = text;
  return div.innerHTML;
}

function formatTime(timestamp) {
  if (!timestamp) return '';
  const date = new Date(timestamp * 1000);
  const now = new Date();
  const diff = now - date;
  const days = Math.floor(diff / (1000 * 60 * 60 * 24));
  
  if (days === 0) {
    return date.toLocaleTimeString('he-IL', { hour: '2-digit', minute: '2-digit' });
  } else if (days === 1) {
    return 'אתמול';
  } else if (days < 7) {
    return `${days} ימים`;
  } else {
    return date.toLocaleDateString('he-IL', { day: '2-digit', month: '2-digit' });
  }
}

function formatPhoneForDisplay(phone) {
  if (!phone) return '';
  // Remove + and format: 972501234567 -> 050-123-4567
  let cleaned = phone.replace(/[^\d]/g, '');
  if (cleaned.startsWith('972')) {
    cleaned = '0' + cleaned.substring(3);
  }
  if (cleaned.length === 10 && cleaned.startsWith('0')) {
    return cleaned.substring(0, 3) + '-' + cleaned.substring(3, 6) + '-' + cleaned.substring(6);
  }
  return phone;
}

const qs = sel => document.querySelector(sel);
const qsa = sel => Array.from(document.querySelectorAll(sel));

// Storage helpers
async function getState() {
  return await chrome.storage.local.get({
    accounts: [],
    selectedIndex: -1,
    tags: [], // Array of {id, name, color}
    chatTags: {}, // {chatId: [tagId, ...]}
    supabaseSession: null, // Store Supabase session
    supabaseUser: null, // Store Supabase user
    lastState: { // Save last state
      selectedChat: null,
      selectedIndex: null, // Save last selected account index
      chats: []
    }
  });
}
async function setState(patch) { await chrome.storage.local.set(patch); }

function showLogin() {
  // Clear all fields
  qs("#loginUsername").value = "";
  qs("#loginPassword").value = "";
  
  // Clear messages
  qs("#loginError").style.display = "none";
  qs("#loginError").textContent = "";
  
  qs("#loginBackdrop").classList.remove("hidden");
  // Focus on username field
  setTimeout(() => qs("#loginUsername").focus(), 100);
}
function hideLogin() {
  qs("#loginBackdrop").classList.add("hidden");
}

// Show main menu screen
async function showMainMenu() {
  qs("#mainMenuBackdrop").classList.remove("hidden");
  await renderMainMenu();
}

function hideMainMenu() {
  qs("#mainMenuBackdrop").classList.add("hidden");
}

// Render main menu with numbers and subscription info
async function renderMainMenu() {
  const { supabaseSession, supabaseUser } = await getState();
  
  if (!supabaseSession || !supabaseUser) {
    console.error("[MAIN MENU] No session found");
    return;
  }
  
  try {
    // Fetch subscription info
    const subscription = await fetchUserSubscription(supabaseSession, supabaseUser.id);
    
    // Render user info and subscription
    const userInfoContent = qs("#userInfoContent");
    userInfoContent.innerHTML = `
      <div style="display:flex; justify-content:space-between; align-items:center;">
        <div>
          <div style="font-weight:700; color:#0a0f0e; margin-bottom:4px;">${escapeHtml(supabaseUser.email || 'משתמש')}</div>
          <div style="font-size:13px; color:rgba(0,0,0,0.7);">
            מנוי: <span style="color:var(--emerald); font-weight:600;">${escapeHtml(subscription.plan)}</span>
            ${subscription.planDetails?.numbers_limit ? ` | עד ${subscription.planDetails.numbers_limit} מספרים` : ''}
          </div>
        </div>
        ${subscription.planDetails?.price_monthly > 0 ? 
          `<div style="font-size:12px; color:rgba(0,0,0,0.6);">$${subscription.planDetails.price_monthly}/חודש</div>` : 
          '<div style="font-size:12px; color:rgba(0,0,0,0.6);">חינם</div>'
        }
      </div>
    `;
    
    // Fetch and render numbers
    await renderNumbersList();
  } catch (e) {
    console.error("[MAIN MENU] Error rendering:", e);
  }
}

// Render numbers list in main menu
async function renderNumbersList() {
  const numbersList = qs("#numbersList");
  if (!numbersList) return;
  
  numbersList.innerHTML = '<div class="loading">טוען מספרים...</div>';
  
  const { supabaseSession, supabaseUser } = await getState();
  
  if (!supabaseSession || !supabaseUser) {
    numbersList.innerHTML = '<div style="text-align:center; padding:40px; color:rgba(0,0,0,0.6);">לא מחובר</div>';
    return;
  }
  
  try {
    const accounts = await fetchUserNumbers(supabaseSession, supabaseUser.id);
    
    if (!accounts || accounts.length === 0) {
      numbersList.innerHTML = `
        <div style="text-align:center; padding:40px; color:rgba(0,0,0,0.6);">
          <div style="margin-bottom:16px;">אין מספרים זמינים</div>
          <button id="btnAddNumberEmpty" class="btn primary">➕ הוסף מספר ראשון</button>
        </div>
      `;
      
      // Add click handler for empty state button
      const addBtn = qs("#btnAddNumberEmpty");
      if (addBtn) {
        addBtn.addEventListener("click", () => {
          hideMainMenu();
          showAddNumberForm();
        });
      }
      return;
    }
    
    // Render numbers list
    const frag = document.createDocumentFragment();
    accounts.forEach((acc, index) => {
      const numberItem = document.createElement("div");
      numberItem.className = "number-item";
      numberItem.style.cssText = "padding:16px; margin-bottom:12px; background:rgba(0,0,0,0.03); border:1px solid rgba(0,0,0,0.1); border-radius:12px; cursor:pointer; transition:all 0.2s;";
      numberItem.innerHTML = `
        <div style="display:flex; justify-content:space-between; align-items:center;">
          <div>
            <div style="font-weight:700; color:#0a0f0e; margin-bottom:4px;">${escapeHtml(acc.name || `מספר ${index + 1}`)}</div>
            <div style="font-size:12px; color:rgba(0,0,0,0.6);">ID: ${escapeHtml(acc.id)}</div>
          </div>
          <div style="color:var(--emerald); font-size:20px;">→</div>
        </div>
      `;
      
      numberItem.addEventListener("click", async () => {
        // Save selected account and show chat screen
        await setState({ 
          accounts: accounts, 
          selectedIndex: index 
        });
        hideMainMenu();
        // Show chat interface
        qs(".app-container").style.display = "flex";
        await renderAccountSelector();
        // Clear cache to force fresh fetch
        chatsCache.data = null;
        historyCache.clear();
        await renderChatsList();
        
        // Check if we have a saved chat for this account, if so restore it
        const { lastState } = await getState();
        if (lastState && lastState.selectedChat && lastState.selectedIndex === index) {
          // Restore the saved chat
          qs("#phoneInput").value = lastState.selectedChat;
          updateGoToPanelButton(); // Update button visibility
          setTimeout(async () => {
            await fetchHistory();
            // Mark the chat as active
            const phone = normalizePhoneForAPI(lastState.selectedChat);
            qsa(".chat-item").forEach(item => {
              const itemPhone = item.dataset.phone;
              if (itemPhone && (itemPhone === phone || itemPhone.replace(/[^\d]/g, '') === phone.replace(/[^\d]/g, ''))) {
                item.classList.add("active");
              }
            });
          }, 200);
        } else {
          updateGoToPanelButton(); // Update button visibility
        }
        
        // Save state after a short delay
        setTimeout(() => saveState(), 300);
        console.log("[MAIN MENU] Selected account:", accounts[index], "Index:", index);
      });
      
      frag.appendChild(numberItem);
    });
    
    numbersList.innerHTML = "";
    numbersList.appendChild(frag);
    
  } catch (e) {
    console.error("[MAIN MENU] Error fetching numbers:", e);
    numbersList.innerHTML = `<div style="text-align:center; padding:40px; color:#c00;">שגיאה בטעינת מספרים: ${e.message}</div>`;
  }
}

// Show add number form
function showAddNumberForm() {
  qs("#addNumberBackdrop").classList.remove("hidden");
  qs("#addNumberName").value = "";
  qs("#addNumberId").value = "";
  qs("#addNumberToken").value = "";
  qs("#addNumberError").style.display = "none";
  setTimeout(() => qs("#addNumberName").focus(), 100);
}

function hideAddNumberForm() {
  qs("#addNumberBackdrop").classList.add("hidden");
}

// Render account selector in header
async function renderAccountSelector() {
  const { accounts, selectedIndex } = await getState();
  const selector = qs("#accountSelector");
  const addBtn = qs("#btnAddAccount");
  
  if (!accounts || accounts.length === 0) {
    selector.style.display = "none";
    addBtn.style.display = "none";
    return;
  }
  
  selector.style.display = "block";
  addBtn.style.display = "block";
  
  selector.innerHTML = accounts.map((acc, i) => 
    `<option value="${i}" ${i === selectedIndex ? 'selected' : ''}>${escapeHtml(acc.name || `חשבון ${i + 1}`)}</option>`
  ).join('');
}

// Render accounts table inside settings modal (minimalist design)
async function renderAccounts() {
  const { accounts, selectedIndex } = await getState();
  const box = qs("#accList");
  box.innerHTML = "";
  if (!accounts || accounts.length === 0) {
    box.classList.add("empty");
    box.textContent = "אין חשבונות שמורים";
    return;
  }
  box.classList.remove("empty");
  accounts.forEach((acc, i) => {
    const isSelected = i === selectedIndex;
    const row = document.createElement("div");
    row.className = "acc-row-minimal" + (isSelected ? " selected" : "");
    row.innerHTML = `
      <div class="acc-row-content">
        <div class="acc-checkbox">
          <div class="acc-checkbox-inner ${isSelected ? 'checked' : ''}"></div>
        </div>
        <div class="acc-name-minimal">${escapeHtml(acc.name || "חשבון ללא שם")}</div>
        <button data-i="${i}" class="btn-del-minimal" title="מחק חשבון" onclick="event.stopPropagation()">✖</button>
      </div>
    `;
    row.addEventListener("click", async (ev) => {
      if (ev.target.matches(".btn-del-minimal") || ev.target.closest(".btn-del-minimal")) {
        ev.stopPropagation();
        ev.preventDefault();
        if (confirm(`האם אתה בטוח שברצונך למחוק את החשבון "${acc.name || 'ללא שם'}"?`)) {
          const idx = parseInt(ev.target.closest(".btn-del-minimal").dataset.i, 10);
          const { accounts: arr } = await getState();
          arr.splice(idx, 1);
          await setState({ accounts: arr, selectedIndex: Math.min(arr.length - 1, Math.max(0, selectedIndex - 1)) });
          renderAccounts();
          // Reload chats list after account deletion
          try {
            await renderChatsList();
          } catch (e) {
            console.error("[ACCOUNTS] Error reloading chats after deletion:", e);
          }
        }
      } else {
        // Switch account
        await setState({ selectedIndex: i });
        renderAccounts();
        await renderAccountSelector();
        // Clear cache when switching accounts
        chatsCache.data = null;
        historyCache.clear();
        // Reload chats list after account switch
        try {
          await renderChatsList();
          // Save state after switching account
          setTimeout(() => saveState(), 300);
        } catch (e) {
          console.error("[ACCOUNTS] Error reloading chats after switch:", e);
        }
      }
    });
    box.appendChild(row);
  });
}

// Show add account form (legacy - redirects to new form)
function showAddAccountForm() {
  showAddNumberForm();
}

// Phone scanning (content script sends matches)
function requestScan() {
  return new Promise(async (resolve) => {
    try {
      const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
      if (!tab?.id) { 
        console.warn("[SCAN] No active tab found");
        resolve([]); 
        return; 
      }
      
      // Check if content script can be injected (for pages like chrome://, about:, etc.)
      if (tab.url?.startsWith('chrome://') || tab.url?.startsWith('chrome-extension://') || tab.url?.startsWith('about:')) {
        console.warn("[SCAN] Cannot scan on system pages:", tab.url);
        resolve([]);
        return;
      }
      
      // Try to send message with timeout
      const timeout = setTimeout(() => {
        console.warn("[SCAN] Timeout waiting for content script response");
        resolve([]);
      }, 3000);
      
      chrome.tabs.sendMessage(tab.id, { type: "scanPhones" }, (resp) => {
        clearTimeout(timeout);
        if (chrome.runtime.lastError) {
          console.error("[SCAN] Error sending message:", chrome.runtime.lastError.message);
          // Try to inject content script if it's not loaded
          if (chrome.runtime.lastError.message.includes("Could not establish connection")) {
            chrome.scripting.executeScript({
              target: { tabId: tab.id },
              files: ['content.js']
            }).then(() => {
              // Retry after injection
              setTimeout(() => {
                chrome.tabs.sendMessage(tab.id, { type: "scanPhones" }, (retryResp) => {
                  resolve(retryResp?.phones || []);
                });
              }, 100);
            }).catch((e) => {
              console.error("[SCAN] Error injecting content script:", e);
              resolve([]);
            });
            return;
          }
          resolve([]);
          return;
        }
        resolve(resp?.phones || []);
      });
    } catch (e) {
      console.error("[SCAN] Error in requestScan:", e);
      resolve([]);
    }
  });
}

function normalizePhone(raw) {
  if (!raw) return "";
  let s = ("" + raw).replace(/[^\d+]/g, "");
  if (s.startsWith("0")) s = s.replace(/^0/, "+972");
  if (/^972/.test(s)) s = "+" + s;
  if (!s.startsWith("+")) s = "+" + s;
  return s;
}

// Enhanced bubble creation from 3.7
function makeBubble(item) {
  const box = document.createElement("div");
  const fromMe = item.type === "outgoing" || item.fromMe === true;
  box.className = "msg " + (fromMe ? "out" : "in");
  
  const timestamp = item.timestamp || item.messageTimestamp || 0;
  const meta = timestamp ? fmtTime(timestamp) : "";
  
  // Extract text from multiple possible locations (from 3.7 logic)
  let text = item.textMessage || 
             (item.extendedTextMessage && item.extendedTextMessage.text) || 
             (item.extendedTextMessageData && item.extendedTextMessageData.text) || 
             (item.conversation) || 
             "";
  
  // Handle image messages
  if (item.typeMessage === "imageMessage") {
    let inner = '';
    const imageUrl = item.urlFile || item.downloadUrl || item.mediaUrl || '';
    if (item.jpegThumbnail) {
      inner += `<img class="thumb" src="data:image/jpeg;base64,${item.jpegThumbnail}" alt="image" style="max-width:220px;max-height:220px;border-radius:8px;display:block;margin-bottom:4px;" />`;
    } else if (imageUrl) {
      inner += `<img class="thumb" src="${imageUrl}" alt="image" style="max-width:220px;max-height:220px;border-radius:8px;display:block;margin-bottom:4px;" onerror="this.style.display='none';" />`;
    }
    if (item.caption || text) {
      inner += `<div>${escapeHtml(item.caption || text)}</div>`;
    }
    if (imageUrl && !item.jpegThumbnail) {
      inner += `<a href="${imageUrl}" target="_blank" rel="noopener" style="display:block;margin-top:6px;text-decoration:none;color:var(--emerald);">📷 פתח תמונה</a>`;
    } else if (item.downloadUrl) {
      inner += `<a href="${item.downloadUrl}" target="_blank" rel="noopener" style="display:block;margin-top:6px;text-decoration:none;color:var(--emerald);">📷 פתח תמונה</a>`;
    }
    inner += `<div class="meta">${meta}</div>`;
    box.innerHTML = inner;
  } 
  // Handle audio/voice messages
  else if (item.typeMessage === "audioMessage" || item.typeMessage === "ptt") {
    const audioUrl = item.downloadUrl || item.url || item.mediaUrl || 
                     (item.audioMessage && (item.audioMessage.downloadUrl || item.audioMessage.url));
    const duration = item.seconds || item.duration || item.length || 
                    (item.audioMessage && (item.audioMessage.seconds || item.audioMessage.duration)) || 0;
    const mimeType = item.mimeType || item.audioMessage?.mimeType || 'audio/ogg; codecs=opus';
    
    let inner = '<div class="audio-message">';
    inner += '<div class="audio-icon">🎵</div>';
    inner += '<div class="audio-player-wrapper">';
    
    if (audioUrl) {
      // Create audio player
      const audioId = `audio_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;
      inner += `<audio id="${audioId}" controls preload="metadata" style="width:100%; max-width:250px; height:32px; outline:none;">`;
      inner += `<source src="${audioUrl}" type="${mimeType}">`;
      inner += '</audio>';
      
      // Add download link if available
      inner += `<a href="${audioUrl}" download class="audio-download" title="הורד הודעה קולית">⬇️</a>`;
    } else {
      inner += '<div style="padding:8px; color:#666; font-size:12px;">🎵 הודעת קול (לא זמינה להורדה)</div>';
    }
    
    if (duration > 0) {
      const minutes = Math.floor(duration / 60);
      const seconds = Math.floor(duration % 60);
      inner += `<div class="audio-duration">${minutes}:${seconds.toString().padStart(2, '0')}</div>`;
    }
    
    inner += '</div>'; // audio-player-wrapper
    inner += '</div>'; // audio-message
    
    if (text) {
      inner += `<div style="margin-top:8px;">${escapeHtml(text)}</div>`;
    }
    
    inner += `<div class="meta">${meta}</div>`;
    box.innerHTML = inner;
  } 
  // Handle video messages
  else if (item.typeMessage === "videoMessage") {
    let inner = '';
    if (item.jpegThumbnail) {
      inner += `<img class="thumb" src="data:image/jpeg;base64,${item.jpegThumbnail}" alt="video" style="max-width:220px;max-height:220px;border-radius:8px;display:block;margin-bottom:4px;" />`;
    }
    inner += '<div>🎥 הודעת וידאו</div>';
    if (item.downloadUrl || item.url) {
      inner += `<a href="${item.downloadUrl || item.url}" target="_blank" rel="noopener" style="display:block;margin-top:6px;text-decoration:none;color:var(--emerald);">🎥 פתח וידאו</a>`;
    }
    if (text) {
      inner += `<div style="margin-top:8px;">${escapeHtml(text)}</div>`;
    }
    inner += `<div class="meta">${meta}</div>`;
    box.innerHTML = inner;
  }
  // Handle document messages
  else if (item.typeMessage === "documentMessage") {
    let inner = '';
    inner += '<div>📄 הודעת מסמך</div>';
    if (item.fileName) {
      inner += `<div style="font-weight:600; margin-top:4px;">${escapeHtml(item.fileName)}</div>`;
    }
    if (item.downloadUrl || item.url) {
      inner += `<a href="${item.downloadUrl || item.url}" target="_blank" rel="noopener" style="display:block;margin-top:6px;text-decoration:none;color:var(--emerald);">📄 הורד מסמך</a>`;
    }
    if (text) {
      inner += `<div style="margin-top:8px;">${escapeHtml(text)}</div>`;
    }
    inner += `<div class="meta">${meta}</div>`;
    box.innerHTML = inner;
  }
  else {
    // Regular text message
    box.innerHTML = `<div>${escapeHtml(text)}</div><div class="meta">${meta}</div>`;
  }
  
  return box;
}

function fmtTime(ts) {
  const d = new Date(typeof ts === 'number' ? (ts < 2e12 ? ts * 1000 : ts) : ts);
  return d.toLocaleString('he-IL', { hour: '2-digit', minute: '2-digit', day: '2-digit', month: '2-digit' });
}

// Fetch chat history directly from Green API (with caching)
async function fetchHistory(forceRefresh = false) {
  const { accounts, selectedIndex } = await getState();
  const acc = accounts[selectedIndex];
  if (!acc) { showLogin(); return; }

  const phoneInputEl = qs("#phoneInput");
  const phoneInput = phoneInputEl ? phoneInputEl.value : null;
  if (!phoneInput) { 
    if (phoneInputEl) phoneInputEl.focus(); 
    updateGoToPanelButton(); // Update button visibility
    return; 
  }

  // Normalize phone number using the N8N logic
  const normalizedPhone = normalizePhoneForAPI(phoneInput);
  // chatId format: 972526059554@c.us (without + prefix)
  const chatId = `${normalizedPhone}@c.us`;
  
  console.log("[HISTORY] Normalized phone:", normalizedPhone);
  console.log("[HISTORY] ChatId:", chatId);
  
  // Update button visibility
  updateGoToPanelButton();
  
  // Check cache first
  if (!forceRefresh && historyCache.has(chatId)) {
    const cached = historyCache.get(chatId);
    // Cache valid for 10 seconds
    if (Date.now() - cached.timestamp < 10000) {
      console.log("[HISTORY] Using cached history");
      const messagesContainer = qs("#messages") || qs("#history");
      if (messagesContainer) {
        messagesContainer.innerHTML = '';
        const frag = document.createDocumentFragment();
        cached.messages.forEach(msg => {
          try {
            const bubble = makeBubble(msg);
            frag.appendChild(bubble);
          } catch (e) {
            console.error("Error creating bubble:", e, msg);
          }
        });
        messagesContainer.appendChild(frag);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      }
      return;
    }
  }

  // Get messages container
  const messagesContainer = qs("#messages") || qs("#history");
  if (!messagesContainer) {
    console.error("Messages container not found");
    return;
  }

  // Only show loading if container is empty
  if (messagesContainer.children.length === 0) {
    messagesContainer.innerHTML = '<div style="padding:20px;text-align:center;color:rgba(0,0,0,0.6); font-size:14px;">טוען הודעות...</div>';
  }

  try {
    // Green API endpoint: https://api.greenapi.com/waInstance{id}/getChatHistory/{token}
    const apiUrl = `${GREEN_API_BASE}/waInstance${acc.id}/getChatHistory/${acc.token}`;
    
    console.log("[HISTORY] Fetching from:", apiUrl);
    console.log("[HISTORY] ChatId:", chatId);
    console.log("[HISTORY] Account ID:", acc.id);
    console.log("[HISTORY] Token (first 10 chars):", acc.token?.substring(0, 10));
    
    // Request body according to Green API documentation
    const requestBody = {
      chatId: chatId,
      count: 100
    };
    
    console.log("[HISTORY] Request body:", requestBody);
    
    const res = await fetchWithRetry(apiUrl, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(requestBody)
    }).catch(e => {
      console.error("[HISTORY] Fetch error:", e);
      const errorMsg = e.message || "שגיאה לא ידועה";
      messagesContainer.innerHTML = `<div style="padding:20px;text-align:center;color:#c00;">שגיאה בטעינת הודעות: ${errorMsg}</div>`;
      return null;
    });

    if (!res || !res.ok) {
      if (res) {
        const errorText = await res.text().catch(() => '');
        console.error("[HISTORY] HTTP error:", res.status, res.statusText);
        console.error("[HISTORY] Error response:", errorText);
        
        // Try to parse error JSON
        let errorDetails = errorText;
        try {
          const errorJson = JSON.parse(errorText);
          errorDetails = JSON.stringify(errorJson, null, 2);
        } catch (e) {
          // Not JSON, use as is
        }
        
        messagesContainer.innerHTML = `<div style="padding:20px;text-align:center;color:#c00;">שגיאה בטעינת הודעות: ${res.status} ${res.statusText}<br><small style="font-size:10px;margin-top:8px;display:block;">${errorDetails.substring(0, 200)}</small></div>`;
      } else {
        messagesContainer.innerHTML = `<div style="padding:20px;text-align:center;color:#c00;">שגיאה בטעינת הודעות: אין תגובה מהשרת</div>`;
      }
      return;
    }

    const data = await res.json();
    console.log("[HISTORY] Response:", data);

    // Parse response - Green API returns { data: [...] } or direct array
    let arr = [];
    if (Array.isArray(data)) {
      arr = data;
    } else if (data.data && Array.isArray(data.data)) {
      arr = data.data;
    } else if (data.messages && Array.isArray(data.messages)) {
      arr = data.messages;
    } else if (data.results && Array.isArray(data.results)) {
      arr = data.results;
    }

    if (!Array.isArray(arr) || arr.length === 0) {
      console.log("[HISTORY] No messages found");
      messagesContainer.innerHTML = '<div style="padding:20px;text-align:center;color:rgba(0,0,0,0.6); font-size:14px;">אין הודעות</div>';
      return;
    }

    // Sort by timestamp
    arr.sort((a, b) => (a.timestamp || 0) - (b.timestamp || 0));

    // Create and append bubbles
    messagesContainer.innerHTML = "";
    const frag = document.createDocumentFragment();
    arr.forEach(item => {
      try {
        const bubble = makeBubble(item);
        frag.appendChild(bubble);
      } catch (e) {
        console.error("Error creating bubble:", e, item);
      }
    });

    messagesContainer.appendChild(frag);
    
    // Cache the history
    historyCache.set(chatId, { messages: arr, timestamp: Date.now() });
    
    // Scroll to bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
    
    // Update active chat in sidebar
    const currentPhone = normalizePhone(phoneInput);
    if (currentPhone) {
      qsa(".chat-item").forEach(item => {
        const itemPhone = item.dataset.phone;
        if (itemPhone && (itemPhone === currentPhone || itemPhone.replace(/[^\d]/g, '') === currentPhone.replace(/[^\d]/g, ''))) {
          item.classList.add("active");
        } else {
          item.classList.remove("active");
        }
      });
    }
  } catch (e) {
    console.error("[HISTORY] Fetch error:", e);
    messagesContainer.innerHTML = `<div style="padding:20px;text-align:center;color:#c00;">שגיאה: ${e.message}</div>`;
  }
}

// Send message directly to Green API (with optional file attachment)
async function sendMessage() {
  const { accounts, selectedIndex } = await getState();
  const acc = accounts[selectedIndex];
  if (!acc) { showLogin(); return; }

  const phoneInput = qs("#phoneInput").value;
  const text = qs("#msg").value.trim();
  const fileInput = qs("#fileInput");
  const file = fileInput.files[0];
  
  if (!phoneInput) return;
  if (!text && !file) return;

  // Normalize phone number using the N8N logic
  const normalizedPhone = normalizePhoneForAPI(phoneInput);
  const chatId = `${normalizedPhone}@c.us`;
  
  console.log("[SEND] Normalized phone:", normalizedPhone);
  console.log("[SEND] ChatId:", chatId);

  let data = null;
  try {
    // If file is attached, use SendFileByUpload endpoint
    if (file) {
      data = await sendFileWithMessage(acc, chatId, file, text);
      if (!data) return; // Error already shown
    } else {
      // Send text message only
      const apiUrl = `${GREEN_API_BASE}/waInstance${acc.id}/sendMessage/${acc.token}`;
      
      console.log("[SEND] Sending to:", apiUrl);
      console.log("[SEND] ChatId:", chatId);
      console.log("[SEND] Message:", text);
      
      const res = await fetchWithRetry(apiUrl, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          chatId: chatId,
          message: text
        })
      }).catch(e => {
        console.error("[SEND] Send error:", e);
        alert(`שגיאה בשליחת ההודעה: ${e.message}`);
        return null;
      });

      if (!res || !res.ok) {
        if (res) {
          const errorText = await res.text().catch(() => '');
          console.error("[SEND] HTTP error:", res.status, res.statusText, errorText);
          alert(`שגיאה בשליחת ההודעה: ${res.status} ${res.statusText}`);
        }
        return;
      }

      data = await res.json();
      console.log("[SEND] Response:", data);
    }

    // Clear inputs
    qs("#msg").value = "";
    fileInput.value = "";
    hideFilePreview();
    
    // Add the sent message to the chat immediately (without reloading)
    const messagesContainer = qs("#messages");
    if (messagesContainer && data) {
      // Create a message object for the sent message
      const sentMessage = {
        type: "outgoing", // Mark as outgoing so it appears on the right
        fromMe: true,
        typeMessage: file ? (file.type.startsWith('image/') ? 'imageMessage' : file.type.startsWith('video/') ? 'videoMessage' : file.type.startsWith('audio/') ? 'audioMessage' : 'documentMessage') : 'textMessage',
        textMessage: text || (file ? file.name : ''),
        timestamp: Math.floor(Date.now() / 1000),
        chatId: chatId,
        idMessage: data.idMessage || `temp_${Date.now()}`,
        // For file messages, add file info
        ...(file ? {
          fileName: file.name,
          fileType: file.type,
          urlFile: data.urlFile || '',
          downloadUrl: data.urlFile || '',
          caption: text || ''
        } : {})
      };
      
      // Create and append bubble
      try {
        const bubble = makeBubble(sentMessage);
        messagesContainer.appendChild(bubble);
        // Scroll to bottom
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
      } catch (e) {
        console.error("[SEND] Error creating bubble:", e);
        // If bubble creation fails, silently refresh (but without showing "טוען הודעות")
        setTimeout(async () => {
          const currentContent = messagesContainer.innerHTML;
          await fetchHistory();
          // If fetchHistory cleared the content, restore it
          if (messagesContainer.innerHTML.includes('טוען הודעות')) {
            messagesContainer.innerHTML = currentContent;
          }
        }, 500);
      }
    }
  } catch (e) {
    console.error("[SEND] Send error:", e);
    alert("שגיאה בשליחת ההודעה: " + e.message);
  }
}

// Send file using Green API SendFileByUpload endpoint
async function sendFileWithMessage(acc, chatId, file, caption = "") {
  // Green API media endpoint: https://media.greenapi.com/waInstance{id}/sendFileByUpload/{token}
  const mediaUrl = "https://media.greenapi.com";
  const apiUrl = `${mediaUrl}/waInstance${acc.id}/sendFileByUpload/${acc.token}`;
  
  console.log("[SEND FILE] Sending to:", apiUrl);
  console.log("[SEND FILE] ChatId:", chatId);
  console.log("[SEND FILE] File:", file.name, file.type, file.size);
  
  // Ensure chatId is in correct format (without + prefix)
  // chatId should be in format: 972526059554@c.us (no + prefix)
  const cleanChatId = chatId.startsWith('+') ? chatId.substring(1) : chatId;
  
  // Use fetch directly for FormData (don't use fetchWithRetry to avoid header issues)
  // Note: FormData can only be sent once, so we need to recreate it for retries
  let lastError;
  let res = null;
  
  for (let attempt = 0; attempt <= 3; attempt++) {
    try {
      // Recreate FormData for each attempt (FormData can only be sent once)
      const retryFormData = new FormData();
      retryFormData.append("chatId", cleanChatId);
      retryFormData.append("file", file);
      retryFormData.append("fileName", file.name);
      // Always include caption, even if empty
      retryFormData.append("caption", caption || "");
      
      console.log(`[SEND FILE] Attempt ${attempt + 1}:`);
      console.log(`  - chatId: "${cleanChatId}"`);
      console.log(`  - fileName: "${file.name}"`);
      console.log(`  - file.type: "${file.type}"`);
      console.log(`  - file.size: ${file.size} bytes`);
      console.log(`  - caption: "${caption || '(empty)'}"`);
      
      res = await fetch(apiUrl, {
        method: "POST",
        body: retryFormData
        // Don't set Content-Type header - browser will set it with boundary for FormData
      });
      
      console.log(`[SEND FILE] Response status: ${res.status} ${res.statusText}`);
      
      // Check for rate limit (HTTP 429)
      if (res.status === 429) {
        const retryAfter = res.headers.get("Retry-After");
        let waitTime = 1000 * Math.pow(2, attempt);
        if (retryAfter) {
          waitTime = parseInt(retryAfter) * 1000;
        }
        if (attempt < 3) {
          console.log(`[SEND FILE] Rate limit, waiting ${waitTime}ms...`);
          await new Promise(resolve => setTimeout(resolve, waitTime));
          continue;
        }
      }
      
      // For other errors, break and handle below
      if (!res.ok) {
        // Clone response to read text without consuming the body
        const errorClone = res.clone();
        const errorText = await errorClone.text().catch(() => '');
        console.error(`[SEND FILE] HTTP error ${res.status}:`, errorText);
        break;
      }
      
      // Success - parse JSON
      const data = await res.json();
      console.log("[SEND FILE] Success response:", JSON.stringify(data, null, 2));
      
      if (data.idMessage) {
        console.log("[SEND FILE] Message ID received:", data.idMessage);
        console.log("[SEND FILE] File URL:", data.urlFile);
        console.log("[SEND FILE] ChatId used:", cleanChatId);
        
        // Check message status after a short delay to see if it was delivered
        setTimeout(async () => {
          try {
            const statusUrl = `${GREEN_API_BASE}/waInstance${acc.id}/getMessageStatus/${acc.token}`;
            const statusRes = await fetch(statusUrl, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ idMessage: data.idMessage })
            });
            if (statusRes.ok) {
              const statusData = await statusRes.json();
              console.log("[SEND FILE] Message status:", JSON.stringify(statusData, null, 2));
              if (statusData.status) {
                console.log("[SEND FILE] Delivery status:", statusData.status);
              }
            } else {
              const errorText = await statusRes.text().catch(() => '');
              console.warn("[SEND FILE] Status check failed:", statusRes.status, errorText);
            }
          } catch (e) {
            console.warn("[SEND FILE] Failed to check status:", e);
          }
        }, 3000);
        
        return data;
      } else {
        console.warn("[SEND FILE] Response missing idMessage:", data);
        console.warn("[SEND FILE] Full response:", JSON.stringify(data, null, 2));
        console.warn("[SEND FILE] ChatId used:", cleanChatId);
        console.warn("[SEND FILE] File name:", file.name);
        console.warn("[SEND FILE] File size:", file.size);
        console.warn("[SEND FILE] File type:", file.type);
        return data; // Return anyway, might still be valid
      }
      
    } catch (e) {
      lastError = e;
      if (attempt < 3) {
        const waitTime = 500 * (attempt + 1);
        console.log(`[SEND FILE] Error, retrying in ${waitTime}ms...`);
        await new Promise(resolve => setTimeout(resolve, waitTime));
        continue;
      }
    }
  }
  
  // Handle errors
  if (res && !res.ok) {
    // Response was already read in the loop, try to get error text if possible
    let errorText = '';
    try {
      const errorClone = res.clone();
      errorText = await errorClone.text().catch(() => '');
    } catch (e) {
      // Response already consumed, can't read again
    }
    console.error("[SEND FILE] HTTP error:", res.status, res.statusText, errorText);
    const errorMsg = errorText ? `${res.status} ${res.statusText}: ${errorText.substring(0, 100)}` : `${res.status} ${res.statusText}`;
    alert(`שגיאה בשליחת הקובץ: ${errorMsg}`);
  } else if (lastError) {
    console.error("[SEND FILE] Send error:", lastError);
    alert(`שגיאה בשליחת הקובץ: ${lastError.message}`);
  } else {
    console.error("[SEND FILE] Unknown error - no response and no error object");
    alert("שגיאה בשליחת הקובץ: שגיאה לא ידועה");
  }
  
  return null;
}

// File preview functions
function showFilePreview(fileName) {
  const preview = qs("#filePreview");
  const nameSpan = qs("#fileName");
  nameSpan.textContent = fileName;
  preview.style.display = "flex";
}

function hideFilePreview() {
  const preview = qs("#filePreview");
  preview.style.display = "none";
}

// Tags Management Functions
let currentChatForTags = null;

async function renderTagsList() {
  const { tags } = await getState();
  const container = qs("#tagsList");
  if (!container) return;
  
  if (tags.length === 0) {
    container.innerHTML = '<div style="text-align:center; padding:40px; color:#6b7a90;">אין תגיות. הוסף תגית חדשה למעלה.</div>';
    return;
  }
  
  container.innerHTML = tags.map(tag => `
    <div class="tag-item" data-tag-id="${tag.id}">
      <div class="tag-color-preview" style="background-color:${tag.color}"></div>
      <div class="tag-name">${escapeHtml(tag.name)}</div>
      <div class="tag-color-value">${tag.color}</div>
      <button class="btn-tag-del" data-tag-id="${tag.id}">✖</button>
    </div>
  `).join('');
  
  // Add delete handlers
  qsa(".btn-tag-del").forEach(btn => {
    btn.addEventListener("click", async (e) => {
      const tagId = e.target.dataset.tagId;
      const { tags, chatTags } = await getState();
      const newTags = tags.filter(t => t.id !== tagId);
      const newChatTags = {};
      // Remove tag from all chats
      for (const [chatId, tagIds] of Object.entries(chatTags)) {
        newChatTags[chatId] = tagIds.filter(id => id !== tagId);
      }
      await setState({ tags: newTags, chatTags: newChatTags });
      await renderTagsList();
      await renderChatsList(); // Refresh chats to update tags
    });
  });
}

async function showTagsModal() {
  qs("#tagsBackdrop").classList.remove("hidden");
  await renderTagsList();
}

function hideTagsModal() {
  qs("#tagsBackdrop").classList.add("hidden");
}

async function showChatTagsModal(chatId) {
  currentChatForTags = chatId;
  const { tags, chatTags } = await getState();
  const selectedTags = chatTags[chatId] || [];
  const container = qs("#chatTagsList");
  
  container.innerHTML = tags.map(tag => {
    const isSelected = selectedTags.includes(tag.id);
    return `
      <div class="chat-tag-option ${isSelected ? 'selected' : ''}" data-tag-id="${tag.id}">
        <div class="chat-tag-checkbox">
          <div class="chat-tag-checkbox-inner ${isSelected ? 'checked' : ''}"></div>
        </div>
        <div class="tag-color-preview" style="background-color:${tag.color}"></div>
        <div class="tag-name">${escapeHtml(tag.name)}</div>
      </div>
    `;
  }).join('');
  
  if (tags.length === 0) {
    container.innerHTML = '<div style="text-align:center; padding:40px; color:#6b7a90;">אין תגיות. הוסף תגיות במסך ניהול תגיות.</div>';
  }
  
  // Add click handlers
  qsa(".chat-tag-option").forEach(option => {
    option.addEventListener("click", () => {
      option.classList.toggle("selected");
      const checkbox = option.querySelector(".chat-tag-checkbox-inner");
      checkbox.classList.toggle("checked");
    });
  });
  
  qs("#chatTagsBackdrop").classList.remove("hidden");
}

function hideChatTagsModal() {
  qs("#chatTagsBackdrop").classList.add("hidden");
  currentChatForTags = null;
}

async function saveChatTags() {
  if (!currentChatForTags) return;
  
  const { tags, chatTags } = await getState();
  const selected = qsa(".chat-tag-option.selected").map(el => el.dataset.tagId);
  const newChatTags = { ...chatTags, [currentChatForTags]: selected };
  
  // Update UI immediately (optimistic update)
  const chatItem = qsa(".chat-item").find(item => item.dataset.chatId === currentChatForTags);
  if (chatItem) {
    let tagsContainer = chatItem.querySelector('.chat-item-tags');
    if (!tagsContainer) {
      // Create tags container if it doesn't exist
      tagsContainer = document.createElement('div');
      tagsContainer.className = 'chat-item-tags';
      const contentDiv = chatItem.querySelector('.chat-item-content');
      if (contentDiv) {
        contentDiv.appendChild(tagsContainer);
      }
    }
    
    // Update tags immediately
    const selectedTags = tags.filter(t => selected.includes(t.id));
    if (selectedTags.length === 0) {
      tagsContainer.innerHTML = '';
    } else {
      tagsContainer.innerHTML = selectedTags.map(tag => 
        `<span class="chat-tag-display" style="background-color:${tag.color}">${escapeHtml(tag.name)}</span>`
      ).join('');
    }
  }
  
  // Save to storage in background (non-blocking)
  setState({ chatTags: newChatTags }).catch(e => {
    console.error("[TAGS] Error saving tags:", e);
  });
  
  hideChatTagsModal();
}

function getChatTags(chatId) {
  return chrome.storage.local.get(['tags', 'chatTags']).then(({ tags = [], chatTags = {} }) => {
    const tagIds = chatTags[chatId] || [];
    return tags.filter(t => tagIds.includes(t.id));
  });
}

async function renderChatTags(chatId, container) {
  // Use async/await for better performance and immediate rendering
  try {
    const { tags = [], chatTags = {} } = await getState();
    const tagIds = chatTags[chatId] || [];
    const chatTagsList = tags.filter(t => tagIds.includes(t.id));
    
    if (chatTagsList.length === 0) {
      container.innerHTML = '';
      return;
    }
    container.innerHTML = chatTagsList.map(tag => 
      `<span class="chat-tag-display" style="background-color:${tag.color}">${escapeHtml(tag.name)}</span>`
    ).join('');
  } catch (e) {
    console.error("[TAGS] Error rendering tags:", e);
    container.innerHTML = '';
  }
}

// Save log to chrome.storage for debugging (accessible from popup.js)
async function saveLog(level, message, data = null) {
  try {
    const timestamp = new Date().toISOString();
    const logEntry = {
      level,
      message,
      data,
      timestamp
    };
    
    // Get existing logs
    const { debugLogs = [] } = await chrome.storage.local.get(['debugLogs']);
    
    // Add new log (keep last 50 entries)
    const newLogs = [...debugLogs, logEntry].slice(-50);
    
    await chrome.storage.local.set({ debugLogs: newLogs });
  } catch (e) {
    // Silently fail - logging shouldn't break the app
    console.warn('[LOG] Failed to save log:', e);
  }
}

// State Management - Save and Restore (with debouncing)
const debouncedSaveState = debounce(async function saveState() {
  try {
    const phoneInput = qs("#phoneInput");
    const selectedChat = phoneInput ? phoneInput.value : null;
    const { selectedIndex } = await getState();
    
    // Get current chats from DOM instead of fetching again
    const currentChats = [];
    qsa(".chat-item").forEach(item => {
      const chatId = item.dataset.chatId;
      const phone = item.dataset.phone;
      const nameEl = item.querySelector('.chat-item-name');
      const previewEl = item.querySelector('.chat-item-preview');
      const timeEl = item.querySelector('.chat-item-time');
      const avatarEl = item.querySelector('.chat-item-avatar');
      
      if (chatId || phone) {
        currentChats.push({
          chatId: chatId || '',
          phone: phone || '',
          name: nameEl ? nameEl.textContent : '',
          lastMessage: previewEl ? previewEl.textContent : '',
          lastMessageTime: timeEl ? timeEl.textContent : '',
          avatar: avatarEl ? avatarEl.src : ''
        });
      }
    });
    
    // If no chats in DOM, fetch them
    const chats = currentChats.length > 0 ? currentChats : await fetchChatsList();
    
    await setState({ 
      lastState: { 
        selectedChat, 
        selectedIndex: selectedIndex >= 0 ? selectedIndex : null,
        chats 
      } 
    });
    console.log("[SAVE STATE] Saved state:", { selectedChat, selectedIndex, chatsCount: chats.length });
  } catch (e) {
    console.error("[SAVE STATE] Error saving state:", e);
  }
}, 300); // Debounce by 300ms

// Alias for backward compatibility
const saveState = debouncedSaveState;

async function restoreState() {
  const { lastState, accounts } = await getState();
  console.log("[RESTORE] Last state:", lastState);
  
  // Restore selected account if available
  if (lastState && lastState.selectedIndex !== null && lastState.selectedIndex !== undefined) {
    const savedIndex = lastState.selectedIndex;
    if (accounts && accounts.length > 0 && savedIndex >= 0 && savedIndex < accounts.length) {
      await setState({ selectedIndex: savedIndex });
      console.log("[RESTORE] Restored account index:", savedIndex);
    }
  }
  
  // Restore chats first (so we can restore selected chat after)
  if (lastState && lastState.chats && lastState.chats.length > 0) {
    // Merge with fresh chats
    try {
      const freshChats = await fetchChatsList();
      const mergedChats = mergeChats(freshChats, lastState.chats);
      await renderChatsListFromData(mergedChats);
      // Update saved state with merged chats
      await setState({ lastState: { ...lastState, chats: mergedChats } });
    } catch (e) {
      console.error("[RESTORE] Error merging chats, using saved:", e);
      await renderChatsListFromData(lastState.chats);
    }
  } else {
    await renderChatsList();
  }
  
  // Restore selected chat after chats are loaded
  if (lastState && lastState.selectedChat) {
    qs("#phoneInput").value = lastState.selectedChat;
    // Wait a bit for chats to render, then load history
    setTimeout(async () => {
      await fetchHistory();
      // Mark the chat as active
      const phone = normalizePhoneForAPI(lastState.selectedChat);
      qsa(".chat-item").forEach(item => {
        const itemPhone = item.dataset.phone;
        if (itemPhone && (itemPhone === phone || itemPhone.replace(/[^\d]/g, '') === phone.replace(/[^\d]/g, ''))) {
          item.classList.add("active");
        }
      });
    }, 100);
  }
}

function mergeChats(freshChats, savedChats) {
  const chatMap = new Map();
  // Add fresh chats first (they have priority)
  freshChats.forEach(chat => {
    const key = chat.chatId || chat.phone;
    if (key) chatMap.set(key, chat);
  });
  // Add saved chats that don't exist in fresh
  savedChats.forEach(chat => {
    const key = chat.chatId || chat.phone;
    if (key && !chatMap.has(key)) {
      chatMap.set(key, chat);
    }
  });
  return Array.from(chatMap.values());
}

async function renderChatsListFromData(chats) {
  const chatsList = qs("#chatsList");
  if (!chatsList) return;
  
  if (chats.length === 0) {
    chatsList.innerHTML = '<div class="chats-empty">אין צ\'אטים</div>';
    return;
  }
  
  const frag = document.createDocumentFragment();
  
  for (const chat of chats) {
    const chatItem = document.createElement("div");
    chatItem.className = "chat-item";
    
    const phone = chat.phone || chat.chatId?.replace('@c.us', '').replace('+', '') || '';
    chatItem.dataset.phone = phone;
    chatItem.dataset.chatId = chat.chatId || '';
    
    const displayPhone = formatPhoneForDisplay(phone);
    const name = chat.name || displayPhone || 'ללא שם';
    const preview = chat.lastMessage || chat.preview || '';
    const time = chat.lastMessageTime || chat.timestamp || '';
    const avatar = chat.avatar || '';
    
    const chatId = chat.chatId || '';
    
    chatItem.innerHTML = `
      <div class="chat-item-header">
        ${avatar ? `<img src="${escapeHtml(avatar)}" alt="${escapeHtml(name)}" class="chat-item-avatar" onerror="this.style.display='none'; this.nextElementSibling.style.display='flex';" />` : ''}
        <div class="chat-item-avatar-placeholder" style="${avatar ? 'display:none;' : ''}">${name.charAt(0).toUpperCase()}</div>
        <div class="chat-item-content">
          <div class="chat-item-name-wrapper">
            <div class="chat-item-name">${escapeHtml(name)}</div>
          </div>
          ${preview ? `<div class="chat-item-preview">${escapeHtml(preview)}</div>` : ''}
          <div class="chat-item-time-wrapper">
            ${time ? `<div class="chat-item-time">${formatTime(time)}</div>` : ''}
            <button class="btn icon btn-add-tags" style="padding:4px 6px; font-size:12px; opacity:0.6;" title="הוסף תגיות" data-chat-id="${chatId}">🏷️</button>
          </div>
          <div class="chat-item-tags"></div>
        </div>
      </div>
    `;
    
    // Render tags immediately (async, non-blocking)
    const tagsContainer = chatItem.querySelector('.chat-item-tags');
    if (tagsContainer) {
      renderChatTags(chatId, tagsContainer).catch(e => console.error("[TAGS] Error:", e));
    }
    
    // Add tags button handler
    const tagsBtn = chatItem.querySelector('.btn-add-tags');
    if (tagsBtn && chatId) {
      tagsBtn.addEventListener("click", async (e) => {
        e.stopPropagation();
        await showChatTagsModal(chatId);
      });
    }
    
    chatItem.addEventListener("click", async () => {
      qsa(".chat-item").forEach(item => item.classList.remove("active"));
      chatItem.classList.add("active");
      if (phone) {
        qs("#phoneInput").value = phone;
        await fetchHistory();
      }
      // Save state after a short delay to ensure everything is updated
      setTimeout(() => saveState(), 200);
    });
    
    frag.appendChild(chatItem);
  }
  
  chatsList.innerHTML = '';
  chatsList.appendChild(frag);
}

// Auto-refresh chats every 30 seconds
let autoRefreshInterval = null;
function startAutoRefresh() {
  if (autoRefreshInterval) clearInterval(autoRefreshInterval);
  // Throttle auto-refresh - use cache if available, only fetch if cache expired
  autoRefreshInterval = setInterval(async () => {
    try {
      // Only fetch if cache is expired (more than 30 seconds old)
      const freshChats = await fetchChatsList(false); // Use cache if available
      const { lastState } = await getState();
      const savedChats = lastState?.chats || [];
      const mergedChats = mergeChats(freshChats, savedChats);
      await renderChatsListFromData(mergedChats);
      await setState({ lastState: { ...lastState, chats: mergedChats } });
    } catch (e) {
      console.error("[AUTO-REFRESH] Error:", e);
    }
  }, 30000); // 30 seconds
}

// Init
// Function to open chat in admin panel
async function openChatInPanel() {
  try {
    const btnGoToPanel = qs("#btnGoToPanel");
    
    // First, check if we have a cached URL in the button's data attribute
    if (btnGoToPanel && btnGoToPanel.dataset.url) {
      const cachedUrl = btnGoToPanel.dataset.url;
      console.log("[PANEL] Using cached URL from button:", cachedUrl);
      chrome.tabs.create({ url: cachedUrl });
      return;
    }
    
    // If no cached URL, build it fresh
    const { accounts, selectedIndex, supabaseSession } = await getState();
    const acc = accounts[selectedIndex];
    
    if (!acc || !acc.id) {
      alert("לא נמצא חשבון נבחר");
      return;
    }
    
    const phoneInput = qs("#phoneInput");
    if (!phoneInput || !phoneInput.value) {
      alert("אנא בחר צ'אט תחילה");
      return;
    }
    
    // Get phone number (normalize it)
    const normalizedPhone = normalizePhoneForAPI(phoneInput.value);
    
    console.log("[PANEL] Opening chat in panel:", { 
      instanceId: acc.id, 
      phoneNumber: normalizedPhone,
      accountName: acc.name,
      hasSession: !!supabaseSession
    });
    
    await saveLog('info', `[PANEL] Starting - instanceId: ${acc.id}, phone: ${normalizedPhone}`);
    
    // Get URL from Supabase (pass session for authentication)
    // The function will find numberId and build URL with phone number
    const url = await getChatUrlFromJid(acc.id, normalizedPhone, supabaseSession);
    
    if (!url) {
      // Get last error from logs
      const { debugLogs = [] } = await chrome.storage.local.get(['debugLogs']);
      const lastError = debugLogs.filter(log => log.level === 'error').pop();
      const lastInfo = debugLogs.filter(log => log.level === 'info' || log.level === 'success').slice(-3);
      
      console.error("[PANEL] Failed to get URL");
      console.error("[PANEL] Last error:", lastError);
      console.error("[PANEL] Recent logs:", lastInfo);
      
      const errorMsg = lastError ? lastError.message : 'לא נמצא המספר במערכת';
      alert(`לא ניתן לפתוח את הצ'אט בפאנל.\n\n${errorMsg}\n\nפתח את ה-Console (F12) או בדוק את הלוגים ב-chrome.storage.local['debugLogs']`);
      return;
    }
    
    console.log("[PANEL] Success! Opening URL:", url);
    await saveLog('success', `[PANEL] Opening URL: ${url}`);
    
    // Store the URL in the button for next time
    if (btnGoToPanel) {
      btnGoToPanel.dataset.url = url;
    }
    
    // Open in new tab
    chrome.tabs.create({ url: url });
    
  } catch (error) {
    console.error("[PANEL] Error opening chat in panel:", error);
    await saveLog('error', `[PANEL] Exception: ${error.message}`, error);
    alert("שגיאה בפתיחת הצ'אט בפאנל: " + error.message);
  }
}

// Show/hide "Go to Panel" button based on whether a chat is selected
async function updateGoToPanelButton() {
  const phoneInput = qs("#phoneInput");
  const btnGoToPanel = qs("#btnGoToPanel");
  
  if (!btnGoToPanel) return;
  
  if (phoneInput && phoneInput.value && phoneInput.value.trim()) {
    btnGoToPanel.style.display = "inline-flex";
    
    // Try to build the URL and show it in the title
    try {
      const { accounts, selectedIndex, supabaseSession } = await getState();
      const acc = accounts[selectedIndex];
      
      if (acc && acc.id) {
        const normalizedPhone = normalizePhoneForAPI(phoneInput.value);
        
        // Build URL asynchronously (don't wait for Supabase query, just show what we're trying)
        getChatUrlFromJid(acc.id, normalizedPhone, supabaseSession).then(url => {
          if (url) {
            btnGoToPanel.title = `עבור לפאנל\n${url}`;
            btnGoToPanel.setAttribute('data-url', url);
            // Store the URL so the click handler can use it
            btnGoToPanel.dataset.url = url;
            console.log("[PANEL] Updated button URL:", url);
          } else {
            btnGoToPanel.title = `עבור לפאנל\nמספר: ${normalizedPhone}\nInstance: ${acc.id}\nלא נמצא`;
            btnGoToPanel.removeAttribute('data-url');
            delete btnGoToPanel.dataset.url;
          }
        }).catch(e => {
          btnGoToPanel.title = `עבור לפאנל\nמספר: ${normalizedPhone}\nInstance: ${acc.id}\nשגיאה: ${e.message}`;
          btnGoToPanel.removeAttribute('data-url');
          delete btnGoToPanel.dataset.url;
        });
        
        // Show temporary title while loading
        btnGoToPanel.title = `עבור לפאנל\nמספר: ${normalizedPhone}\nInstance: ${acc.id}\nטוען...`;
      } else {
        btnGoToPanel.title = "עבור לפאנל";
      }
    } catch (e) {
      console.warn("[PANEL] Error updating button title:", e);
      btnGoToPanel.title = "עבור לפאנל";
    }
  } else {
    btnGoToPanel.style.display = "none";
    btnGoToPanel.title = "עבור לפאנל";
  }
}

(async function init() {
  // Wire up buttons
  qs("#btnFetch").addEventListener("click", fetchHistory);
  // Removed btnScan - scan button removed from UI
  qs("#btnSend").addEventListener("click", sendMessage);
  
  // Go to Panel button
  const btnGoToPanel = qs("#btnGoToPanel");
  if (btnGoToPanel) {
    btnGoToPanel.addEventListener("click", openChatInPanel);
  }
  
  // Update button visibility when phone input changes
  const phoneInput = qs("#phoneInput");
  if (phoneInput) {
    phoneInput.addEventListener("input", () => updateGoToPanelButton());
    phoneInput.addEventListener("change", () => updateGoToPanelButton());
    // Also update on paste
    phoneInput.addEventListener("paste", () => setTimeout(() => updateGoToPanelButton(), 100));
  }
  
  // Initial update
  setTimeout(() => updateGoToPanelButton(), 500);
  
  // File attachment handlers
  qs("#btnAttach").addEventListener("click", () => {
    qs("#fileInput").click();
  });
  
  qs("#fileInput").addEventListener("change", (e) => {
    const file = e.target.files[0];
    if (file) {
      showFilePreview(file.name);
    } else {
      hideFilePreview();
    }
  });
  
  qs("#btnRemoveFile").addEventListener("click", () => {
    qs("#fileInput").value = "";
    hideFilePreview();
  });

  // Auto scan is now handled in the main init flow (after onboarding check)

  // Refresh chats list (with force refresh to bypass cache)
  qs("#btnRefreshChats").addEventListener("click", async () => {
    chatsCache.data = null; // Clear cache
    historyCache.clear(); // Clear history cache
    await renderChatsList();
  });

  // Account selector in header
  qs("#accountSelector").addEventListener("change", async (e) => {
    const selectedIndex = parseInt(e.target.value, 10);
    await setState({ selectedIndex });
    await renderAccountSelector();
    await renderAccounts();
    try {
      await renderChatsList();
    } catch (err) {
      console.error("[ACCOUNTS] Error reloading chats after switch:", err);
    }
  });
  
  // Add account button in header
  qs("#btnAddAccount").addEventListener("click", () => {
    showAddAccountForm();
  });
  
  // Function to refresh accounts from Supabase
  async function refreshAccountsFromSupabase() {
    const { supabaseSession, supabaseUser } = await getState();
    
    if (!supabaseSession || !supabaseUser) {
      console.warn("[ACCOUNTS] No session found, cannot refresh from Supabase");
      return false;
    }
    
    try {
      console.log("[ACCOUNTS] Refreshing accounts from Supabase...");
      const accounts = await fetchUserNumbers(supabaseSession, supabaseUser.id);
      
      if (accounts && accounts.length > 0) {
        // Merge with existing accounts (keep manually added ones that aren't in Supabase)
        const { accounts: existingAccounts, selectedIndex } = await getState();
        const existingIds = new Set(existingAccounts.map(acc => acc.id));
        const supabaseIds = new Set(accounts.map(acc => acc.id));
        
        // Keep manually added accounts that aren't in Supabase
        const manualAccounts = existingAccounts.filter(acc => !supabaseIds.has(acc.id));
        
        // Combine: Supabase accounts first, then manual ones
        const mergedAccounts = [...accounts, ...manualAccounts];
        
        // Preserve selected index if still valid, otherwise use first Supabase account
        let newSelectedIndex = selectedIndex;
        if (selectedIndex >= mergedAccounts.length || !supabaseIds.has(existingAccounts[selectedIndex]?.id)) {
          newSelectedIndex = 0;
        }
        
        await setState({ 
          accounts: mergedAccounts, 
          selectedIndex: newSelectedIndex
        });
        
        await renderAccountSelector();
        await renderAccounts();
        
        console.log("[ACCOUNTS] Refreshed", accounts.length, "accounts from Supabase,", manualAccounts.length, "manual accounts kept");
        return true;
      } else {
        console.log("[ACCOUNTS] No accounts found in Supabase");
        return false;
      }
    } catch (e) {
      console.error("[ACCOUNTS] Error refreshing from Supabase:", e);
      return false;
    }
  }
  
  // Accounts management
  qs("#btnManage").addEventListener("click", async () => {
    qs("#accountsBackdrop").classList.remove("hidden");
    await renderAccounts();
  });
  qs("#accClose").addEventListener("click", () => qs("#accountsBackdrop").classList.add("hidden"));
  qs("#accRefresh").addEventListener("click", async () => {
    const refreshBtn = qs("#accRefresh");
    const originalText = refreshBtn.textContent;
    refreshBtn.textContent = "מרענן...";
    refreshBtn.disabled = true;
    
    try {
      const success = await refreshAccountsFromSupabase();
      if (success) {
        // Show success message briefly
        const successMsg = document.createElement("div");
        successMsg.textContent = "✅ החשבונות עודכנו מהדאטאבייס";
        successMsg.style.cssText = "position:fixed; top:20px; right:20px; background:#10a186; color:#fff; padding:12px 20px; border-radius:8px; z-index:10000; box-shadow:0 4px 12px rgba(0,0,0,.3);";
        document.body.appendChild(successMsg);
        setTimeout(() => successMsg.remove(), 3000);
      } else {
        alert("לא נמצאו חשבונות חדשים בדאטאבייס או שגיאה בטעינה");
      }
    } catch (e) {
      console.error("[ACCOUNTS] Refresh error:", e);
      alert("שגיאה ברענון החשבונות: " + e.message);
    } finally {
      refreshBtn.textContent = originalText;
      refreshBtn.disabled = false;
    }
  });
  qs("#accAdd").addEventListener("click", () => {
    qs("#accountsBackdrop").classList.add("hidden");
    showAddAccountForm();
  });
  qs("#accSave").addEventListener("click", async () => {
    // Refresh accounts from Supabase before closing
    await refreshAccountsFromSupabase();
    // Close modal and reload chats
    qs("#accountsBackdrop").classList.add("hidden");
    await renderAccountSelector();
    try {
      await renderChatsList();
    } catch (e) {
      console.error("[ACCOUNTS] Error reloading chats:", e);
    }
  });

  // Tags management
  qs("#tagAddBtn").addEventListener("click", async () => {
    const name = qs("#tagNameInput").value.trim();
    const color = qs("#tagColorInput").value;
    if (!name) {
      alert("נא להזין שם תגית");
      return;
    }
    const { tags } = await getState();
    const newTag = { id: Date.now().toString(), name, color };
    await setState({ tags: [...tags, newTag] });
    qs("#tagNameInput").value = "";
    await renderTagsList();
  });
  qs("#tagsClose").addEventListener("click", hideTagsModal);
  qs("#tagsSave").addEventListener("click", hideTagsModal);
  qs("#chatTagsClose").addEventListener("click", hideChatTagsModal);
  qs("#chatTagsSave").addEventListener("click", saveChatTags);
  
  // Add tags button to header (after manage accounts button)
  const headerActions = qs(".header-actions");
  if (headerActions && !qs("#btnTags")) {
    const tagsBtn = document.createElement("button");
    tagsBtn.id = "btnTags";
    tagsBtn.className = "btn icon";
    tagsBtn.title = "ניהול תגיות";
    tagsBtn.textContent = "🏷️";
    tagsBtn.addEventListener("click", showTagsModal);
    // Insert after the manage button (not before)
    const manageBtn = qs("#btnManage");
    if (manageBtn && manageBtn.parentNode) {
      manageBtn.parentNode.insertBefore(tagsBtn, manageBtn.nextSibling);
    } else {
      headerActions.appendChild(tagsBtn);
    }
  }

  // Login handler
  qs("#loginBtn").addEventListener("click", async () => {
    const username = qs("#loginUsername").value.trim();
    const password = qs("#loginPassword").value.trim();
    
    const errorDiv = qs("#loginError");
    errorDiv.style.display = "none";
    errorDiv.textContent = "";
    
    // Validate required fields
    if (!username || !password) {
      errorDiv.textContent = "נא להזין שם משתמש וסיסמה";
      errorDiv.style.display = "block";
      return;
    }
    
    // Show loading state
    const loginBtn = qs("#loginBtn");
    const originalText = loginBtn.textContent;
    loginBtn.textContent = "מתחבר...";
    loginBtn.disabled = true;
    
    try {
      // Verify user credentials
      const verification = await verifyUserCredentials(username, password);
      
      if (!verification.success) {
        errorDiv.textContent = verification.error || "שגיאה בבדיקת פרטים";
        errorDiv.style.display = "block";
        loginBtn.textContent = originalText;
        loginBtn.disabled = false;
        return;
      }
      
      // Save session and user
      if (verification.session && verification.user) {
        await setState({
          supabaseSession: verification.session,
          supabaseUser: verification.user
        });
      }
      
      // Close login and show main menu
      hideLogin();
      await showMainMenu();
      
    } catch (e) {
      console.error("[LOGIN] Error:", e);
      errorDiv.textContent = `שגיאה: ${e.message}`;
      errorDiv.style.display = "block";
    } finally {
      loginBtn.textContent = originalText;
      loginBtn.disabled = false;
    }
  });
  
  // Main menu handlers
  qs("#mainMenuClose").addEventListener("click", () => {
    hideMainMenu();
  });
  
  qs("#btnAddNumber").addEventListener("click", () => {
    hideMainMenu();
    showAddNumberForm();
  });
  
  qs("#btnRefreshNumbers").addEventListener("click", async () => {
    await renderNumbersList();
  });
  
  // btnGoToPanel event listener is already set up in init() function above
  // This was a duplicate - removed
  
  // Add number form handlers
  qs("#addNumberClose").addEventListener("click", () => {
    hideAddNumberForm();
  });
  
  qs("#addNumberSave").addEventListener("click", async () => {
    const name = qs("#addNumberName").value.trim() || "Builders Main";
    const id = qs("#addNumberId").value.trim();
    const token = qs("#addNumberToken").value.trim();
    
    const errorDiv = qs("#addNumberError");
    errorDiv.style.display = "none";
    errorDiv.textContent = "";
    
    // Validate required fields
    if (!id || !token) {
      errorDiv.textContent = "נא להזין ID ו-TOKEN";
      errorDiv.style.display = "block";
      return;
    }
    
    // Show loading state
    const saveBtn = qs("#addNumberSave");
    const originalText = saveBtn.textContent;
    saveBtn.textContent = "שומר...";
    saveBtn.disabled = true;
    
    try {
      const { supabaseUser } = await getState();
      const username = supabaseUser?.email || '';
      
      // Add new account
      const newAccount = { name, id, token, username };
      const { accounts: existingAccounts } = await getState();
      const updatedAccounts = [...(existingAccounts || []), newAccount];
      
      await setState({ 
        accounts: updatedAccounts
      });
      
      hideAddNumberForm();
      // Show main menu again with updated list
      await showMainMenu();
      
    } catch (e) {
      console.error("[ADD NUMBER] Save error:", e);
      errorDiv.textContent = `שגיאה בשמירה: ${e.message}`;
      errorDiv.style.display = "block";
    } finally {
      saveBtn.textContent = originalText;
      saveBtn.disabled = false;
    }
  });

  // Check if user is logged in
  const st = await getState();
  
  // If we have a session, check if we should restore last state or show main menu
  if (st.supabaseSession && st.supabaseUser) {
    console.log("[INIT] Found session");
    
    // Check if we have a saved state with account and chat
    const hasSavedState = st.lastState && 
                         st.lastState.selectedIndex !== null && 
                         st.lastState.selectedIndex !== undefined &&
                         st.accounts && 
                         st.accounts.length > 0 &&
                         st.lastState.selectedIndex >= 0 && 
                         st.lastState.selectedIndex < st.accounts.length;
    
    if (hasSavedState) {
      console.log("[INIT] Found saved state, restoring account and chat...");
      // Restore the saved account
      await setState({ selectedIndex: st.lastState.selectedIndex });
      
      // Show chat interface
      qs(".app-container").style.display = "flex";
      
      // Render account selector
      await renderAccountSelector();
      
      // Restore state (chats and selected chat)
      await restoreState();
      
      // Start auto refresh
      startAutoRefresh();
      
      console.log("[INIT] Restored to account index:", st.lastState.selectedIndex, "and chat:", st.lastState.selectedChat);
      return;
    } else {
      console.log("[INIT] No saved state, showing main menu...");
      // Hide chat interface initially
      qs(".app-container").style.display = "none";
      await showMainMenu();
      return;
    }
  }
  
  // No session - show login
  if (!st.supabaseSession || !st.supabaseUser) {
    qs(".app-container").style.display = "none";
    showLogin();
    return;
  }
  
  // If we have accounts but no session (legacy), show chat interface
  if (st.accounts && st.accounts.length > 0) {
    // Load chats list on startup
    console.log("[INIT] Loading chats list on startup...");
    
    // Try auto scan first
    let scannedPhone = null;
    try {
      const autoFound = await requestScan();
      if (autoFound && autoFound.length > 0) {
        scannedPhone = autoFound[0];
        console.log("[INIT] Auto scan found phone:", scannedPhone);
      }
    } catch (e) {
      console.warn("[INIT] Auto scan error:", e);
    }
    
    try {
      if (scannedPhone) {
        // If scan found a phone, load that chat
        console.log("[INIT] Loading scanned phone:", scannedPhone);
        await renderChatsList();
        qs("#phoneInput").value = scannedPhone;
        await fetchHistory();
        // Mark the chat as active
        const phone = normalizePhoneForAPI(scannedPhone);
        setTimeout(() => {
          qsa(".chat-item").forEach(item => {
            const itemPhone = item.dataset.phone;
            if (itemPhone && (itemPhone === phone || itemPhone.replace(/[^\d]/g, '') === phone.replace(/[^\d]/g, ''))) {
              item.classList.add("active");
            }
          });
        }, 200);
        startAutoRefresh();
      } else {
        // No scan result - restore last state
        await restoreState();
        startAutoRefresh();
      }
      
      // Render account selector
      await renderAccountSelector();
    } catch (e) {
      console.error("[INIT] Error loading chats list:", e);
      // Fallback to regular load
      try {
        await renderChatsList();
        await renderAccountSelector();
        startAutoRefresh();
      } catch (e2) {
        console.error("[INIT] Fallback error:", e2);
      }
    }
  }
  
  // Save state when extension is about to close
  window.addEventListener("beforeunload", () => {
    saveState();
  });
  
  // Also save state periodically
  setInterval(() => {
    saveState();
  }, 5000); // Save every 5 seconds
})();

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
# Builders - Green API CRM Helper

Chrome Extension for managing WhatsApp conversations via Green API.

## Installation

1. Open Chrome and navigate to `chrome://extensions/`
2. Enable "Developer mode" (toggle in top right)
3. Click "Load unpacked"
4. Select this folder (`builders_production`)
5. The extension icon will appear in your toolbar

## Features

- View WhatsApp chat history by phone number
- Send messages directly from the extension
- Manage multiple Green API accounts
- Auto-scan phone numbers from web pages
- Recent chats sidebar
- Voice message support
- Image, video, and document message support

## First Time Setup

1. Click the extension icon
2. Enter your username and password (provided by your administrator)
3. Your Green API accounts will be loaded automatically
4. Start using the extension!

## Usage

- **Load Chat**: Enter a phone number and click "טען" (Load)
- **Scan Phone**: Click "סרוק" (Scan) to automatically find phone numbers on the current page
- **Send Message**: Type your message and click "שלח" (Send)
- **Manage Accounts**: Click the ⚙️ icon to manage your accounts

## Support

For support, contact your administrator.



```

# shim.js

```js
// Shim stub - forwards clicks, mirrors fields for compatibility
(function() {
  'use strict';
  
  // This file provides shim functions for compatibility
  // No-op in unified version as we use consistent event handlers
  console.log('[Builders] Shim loaded');
})();


```

# supabase_drop_all.sql

```sql
-- ============================================
-- DROP ALL TABLES AND OBJECTS
-- Run this script to completely reset the database
-- ============================================

-- Drop triggers first
drop trigger if exists on_auth_user_created on auth.users;

-- Drop functions
drop function if exists public.handle_new_user();
drop function if exists public.is_organization_member(uuid, uuid);
drop function if exists public.is_organization_admin(uuid, uuid);

-- Drop policies (in reverse dependency order)
-- Automation Jobs
drop policy if exists "Users can update jobs for their orgs" on public.automation_jobs;
drop policy if exists "Users can insert jobs for their orgs" on public.automation_jobs;
drop policy if exists "Users can view jobs" on public.automation_jobs;

-- Logs
drop policy if exists "Users can view logs for their scope" on public.logs;

-- Webhooks
drop policy if exists "Admins can manage webhooks" on public.webhooks;
drop policy if exists "Users can view webhooks for their orgs" on public.webhooks;

-- Messages
drop policy if exists "Users can insert messages for accessible chats" on public.messages;
drop policy if exists "Users can view messages for accessible chats" on public.messages;

-- Chats
drop policy if exists "Users can update chats for their numbers" on public.chats;
drop policy if exists "Users can insert chats for their numbers" on public.chats;
drop policy if exists "Users can view chats for their numbers" on public.chats;

-- Numbers
drop policy if exists "Users can delete own numbers" on public.numbers;
drop policy if exists "Users can update own numbers" on public.numbers;
drop policy if exists "Users can insert numbers" on public.numbers;
drop policy if exists "Users can check own or org numbers" on public.numbers;

-- Subscriptions
drop policy if exists "Users can update own subscription" on public.subscriptions;
drop policy if exists "Users can insert own subscription" on public.subscriptions;
drop policy if exists "Users can view own subscription" on public.subscriptions;

-- Organization Members
drop policy if exists "Admins can delete members" on public.organization_members;
drop policy if exists "Members can add members" on public.organization_members;
drop policy if exists "Members can view other members" on public.organization_members;

-- Organizations
drop policy if exists "Users can create organizations" on public.organizations;
drop policy if exists "Users can view own organizations" on public.organizations;

-- Profiles
drop policy if exists "Users can update own profile." on public.profiles;
drop policy if exists "Users can insert their own profile." on public.profiles;
drop policy if exists "Public profiles are viewable by everyone." on public.profiles;

-- Drop tables (in reverse dependency order - children first)
drop table if exists public.automation_jobs cascade;
drop table if exists public.logs cascade;
drop table if exists public.webhooks cascade;
drop table if exists public.messages cascade;
drop table if exists public.chats cascade;
drop table if exists public.numbers cascade;
drop table if exists public.subscriptions cascade;
drop table if exists public.plans cascade;
drop table if exists public.organization_members cascade;
drop table if exists public.organizations cascade;
drop table if exists public.profiles cascade;

-- Drop indexes
drop index if exists public.numbers_instance_id_idx;

-- Note: auth.users is managed by Supabase Auth and should not be dropped
-- Note: Extensions are kept (uuid-ossp)


```

# SUPABASE_EXTENSION_AUTH_SPEC.md

```md
## Builders Extension → Supabase DB Integration (Preparation)

**Goal:** Move the extension from the old n8n webhook (`BACKEND_AUTH_URL`) to Supabase-based auth + data, **without breaking existing behavior** in `builders_production_v1.1`.

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

> **Important:** the extension needs a **flat list of accounts** (`id` + `token` + `name`) that it is allowed to use for the logged-in user.

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
     - Load `profile` for that user (via `profiles` using `auth.users.id`).
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
    - RLS policies let **backend/service-role** see all, but normal `anon` cannot.

> Any missing columns should be added in `supabase_schema.sql` as idempotent `alter table ... add column if not exists ...` statements.

---

## 5. Changes Needed in the Extension (after backend is ready)

When the Supabase endpoint is up, we will update `builders_production_v1.1`:

- **In `popup.js`**
  - Replace the old n8n URL:

\`\`\`js
const BACKEND_AUTH_URL = "https://n8n-railway-custom-production-1086.up.railway.app/webhook/73539861-4649-4b44-ac5b-62a60677a9b8";
\`\`\`

  - With the new Supabase-backed endpoint (final URL TBD):

\`\`\`js
const BACKEND_AUTH_URL = "https://<your-admin-panel-domain>/api/extension/auth";
\`\`\`

  - Keep the **request body** and **response parsing** identical, so no other code changes are required.

- **Optional future step**
  - Add another endpoint for logging sent messages to a Supabase `logs` table, but this is **not required** for the first migration.

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

## 7. Next Implementation Steps (outside this repo)

1. Update `supabase_schema.sql` where needed (in the backend/admin panel repo).
2. Implement the `/api/extension/auth` handler (in the backend/admin panel repo).
3. Then update the extension’s `BACKEND_AUTH_URL` in `popup.js` to point to the new endpoint.



```

# supabase_reset.sql

```sql
-- ============================================
-- COMPLETE DATABASE RESET
-- This script drops all tables and recreates them
-- WARNING: This will delete all data!
-- ============================================

-- ============================================
-- STEP 1: DROP ALL EXISTING OBJECTS
-- ============================================

-- Drop triggers first
drop trigger if exists on_auth_user_created on auth.users;

-- Drop functions
drop function if exists public.handle_new_user();
drop function if exists public.is_organization_member(uuid, uuid);
drop function if exists public.is_organization_admin(uuid, uuid);

-- Drop policies (in reverse dependency order)
-- Automation Jobs
drop policy if exists "Users can update jobs for their orgs" on public.automation_jobs;
drop policy if exists "Users can insert jobs for their orgs" on public.automation_jobs;
drop policy if exists "Users can view jobs" on public.automation_jobs;

-- Logs
drop policy if exists "Users can view logs for their scope" on public.logs;

-- Webhooks
drop policy if exists "Admins can manage webhooks" on public.webhooks;
drop policy if exists "Users can view webhooks for their orgs" on public.webhooks;

-- Messages
drop policy if exists "Users can insert messages for accessible chats" on public.messages;
drop policy if exists "Users can view messages for accessible chats" on public.messages;

-- Chats
drop policy if exists "Users can update chats for their numbers" on public.chats;
drop policy if exists "Users can insert chats for their numbers" on public.chats;
drop policy if exists "Users can view chats for their numbers" on public.chats;

-- Numbers
drop policy if exists "Users can delete own numbers" on public.numbers;
drop policy if exists "Users can update own numbers" on public.numbers;
drop policy if exists "Users can insert numbers" on public.numbers;
drop policy if exists "Users can check own or org numbers" on public.numbers;

-- Subscriptions
drop policy if exists "Users can update own subscription" on public.subscriptions;
drop policy if exists "Users can insert own subscription" on public.subscriptions;
drop policy if exists "Users can view own subscription" on public.subscriptions;

-- Organization Members
drop policy if exists "Admins can delete members" on public.organization_members;
drop policy if exists "Members can add members" on public.organization_members;
drop policy if exists "Members can view other members" on public.organization_members;

-- Organizations
drop policy if exists "Users can create organizations" on public.organizations;
drop policy if exists "Users can view own organizations" on public.organizations;

-- Profiles
drop policy if exists "Users can update own profile." on public.profiles;
drop policy if exists "Users can insert their own profile." on public.profiles;
drop policy if exists "Public profiles are viewable by everyone." on public.profiles;

-- Drop tables (in reverse dependency order - children first)
drop table if exists public.automation_jobs cascade;
drop table if exists public.logs cascade;
drop table if exists public.webhooks cascade;
drop table if exists public.messages cascade;
drop table if exists public.chats cascade;
drop table if exists public.numbers cascade;
drop table if exists public.subscriptions cascade;
drop table if exists public.plans cascade;
drop table if exists public.organization_members cascade;
drop table if exists public.organizations cascade;
drop table if exists public.profiles cascade;

-- Drop indexes
drop index if exists public.numbers_instance_id_idx;

-- ============================================
-- STEP 2: RECREATE ALL TABLES AND POLICIES
-- ============================================

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

-- Helper function to check if user is member of organization (bypasses RLS to avoid recursion)
-- Must be created before policies that use it
create or replace function public.is_organization_member(org_id uuid, user_uuid uuid)
returns boolean as $$
begin
  return exists (
    select 1 from public.organization_members
    where organization_id = org_id
    and user_id = user_uuid
  );
end;
$$ language plpgsql security definer;

-- Helper function to check if user is admin of organization (bypasses RLS to avoid recursion)
-- Must be created before policies that use it
create or replace function public.is_organization_admin(org_id uuid, user_uuid uuid)
returns boolean as $$
begin
  return exists (
    select 1 from public.organization_members
    where organization_id = org_id
    and user_id = user_uuid
    and role = 'admin'
  );
end;
$$ language plpgsql security definer;

-- Policies for Organizations
drop policy if exists "Users can view own organizations" on public.organizations;
create policy "Users can view own organizations" on public.organizations
  for select using (
    -- Use helper function to avoid recursion
    public.is_organization_member(id, auth.uid())
    OR
    -- Users can always see organizations they own
    owner_id = auth.uid()
  );

drop policy if exists "Users can create organizations" on public.organizations;
create policy "Users can create organizations" on public.organizations
  for insert with check (auth.uid() = owner_id);

-- Policies for Organization Members
drop policy if exists "Members can view other members" on public.organization_members;
create policy "Members can view other members" on public.organization_members
  for select using (
    public.is_organization_member(organization_id, auth.uid())
    OR
    user_id = auth.uid()  -- Users can always see their own membership
  );

drop policy if exists "Members can add members" on public.organization_members;
create policy "Members can add members" on public.organization_members
  for insert with check (
      -- Check if user is admin in the organization (using helper function to avoid recursion)
      public.is_organization_admin(organization_id, auth.uid())
      OR
      -- Allow if you are the owner of the organization
      exists (
          select 1 from public.organizations as o
          where o.id = organization_id
          and o.owner_id = auth.uid()
       )
  );

drop policy if exists "Admins can delete members" on public.organization_members;
create policy "Admins can delete members" on public.organization_members
  for delete using (
      -- Check if user is admin in the organization (using helper function to avoid recursion)
      public.is_organization_admin(organization_id, auth.uid())
      OR
      -- Or if user is the owner of the organization
      exists (
          select 1 from public.organizations as o
          where o.id = organization_id
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
    (organization_id is not null AND public.is_organization_member(organization_id, auth.uid()))
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
        (n.organization_id is not null AND public.is_organization_member(n.organization_id, auth.uid()))
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
    timestamp timestamp with time zone default timezone('utc'::text, now()) not null
);

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
                  (n.organization_id is not null AND public.is_organization_member(n.organization_id, auth.uid()))
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
    public.is_organization_member(organization_id, auth.uid())
  );

drop policy if exists "Admins can manage webhooks" on public.webhooks;
create policy "Admins can manage webhooks" on public.webhooks
  for all using (
    public.is_organization_admin(organization_id, auth.uid())
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
    (organization_id is not null AND public.is_organization_member(organization_id, auth.uid()))
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
    organization_id is not null AND public.is_organization_member(organization_id, auth.uid())
  );

drop policy if exists "Users can insert jobs for their orgs" on public.automation_jobs;
create policy "Users can insert jobs for their orgs" on public.automation_jobs
  for insert with check (
    organization_id is not null AND public.is_organization_member(organization_id, auth.uid())
  );

drop policy if exists "Users can update jobs for their orgs" on public.automation_jobs;
create policy "Users can update jobs for their orgs" on public.automation_jobs
  for update using (
    organization_id is not null AND public.is_organization_member(organization_id, auth.uid())
  );

-- ============================================
-- RESET COMPLETE!
-- ============================================

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

-- Create a table for Organization Invites
create table if not exists public.organization_invites (
  id uuid default uuid_generate_v4() primary key,
  organization_id uuid references public.organizations(id) on delete cascade not null,
  email text not null,
  role text check (role in ('admin', 'member')) default 'member',
  invited_by uuid references public.profiles(id) not null,
  status text check (status in ('pending', 'accepted', 'declined', 'expired')) default 'pending',
  expires_at timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  accepted_at timestamp with time zone,
  unique(organization_id, email, status) -- One pending invite per email per org
);

-- Enable RLS for Organization Invites
alter table public.organization_invites enable row level security;

-- Policies for Organization Invites
drop policy if exists "Users can view invites for their orgs" on public.organization_invites;
create policy "Users can view invites for their orgs" on public.organization_invites
  for select using (
    public.is_organization_member(organization_id, auth.uid())
    OR
    exists (
      select 1 from public.organizations as o
      where o.id = organization_invites.organization_id
      and o.owner_id = auth.uid()
    )
  );

drop policy if exists "Admins can manage invites" on public.organization_invites;
create policy "Admins can manage invites" on public.organization_invites
  for all using (
    public.is_organization_admin(organization_id, auth.uid())
    OR
    exists (
      select 1 from public.organizations as o
      where o.id = organization_invites.organization_id
      and o.owner_id = auth.uid()
    )
  );

-- Helper function to check if user is member of organization (bypasses RLS to avoid recursion)
-- Must be created before policies that use it
create or replace function public.is_organization_member(org_id uuid, user_uuid uuid)
returns boolean as $$
begin
  return exists (
    select 1 from public.organization_members
    where organization_id = org_id
    and user_id = user_uuid
  );
end;
$$ language plpgsql security definer;

-- Helper function to check if user is admin of organization (bypasses RLS to avoid recursion)
-- Must be created before policies that use it
create or replace function public.is_organization_admin(org_id uuid, user_uuid uuid)
returns boolean as $$
begin
  return exists (
    select 1 from public.organization_members
    where organization_id = org_id
    and user_id = user_uuid
    and role = 'admin'
  );
end;
$$ language plpgsql security definer;

-- Policies for Organizations
drop policy if exists "Users can view own organizations" on public.organizations;
create policy "Users can view own organizations" on public.organizations
  for select using (
    -- Use helper function to avoid recursion
    public.is_organization_member(id, auth.uid())
    OR
    -- Users can always see organizations they own
    owner_id = auth.uid()
  );

drop policy if exists "Users can create organizations" on public.organizations;
create policy "Users can create organizations" on public.organizations
  for insert with check (auth.uid() = owner_id);

-- Policies for Organization Members
drop policy if exists "Members can view other members" on public.organization_members;
create policy "Members can view other members" on public.organization_members
  for select using (
    public.is_organization_member(organization_id, auth.uid())
    OR
    user_id = auth.uid()  -- Users can always see their own membership
  );

drop policy if exists "Members can add members" on public.organization_members;
create policy "Members can add members" on public.organization_members
  for insert with check (
      -- Check if user is admin in the organization (using helper function to avoid recursion)
      public.is_organization_admin(organization_id, auth.uid())
      OR
      -- Allow if you are the owner of the organization
      exists (
          select 1 from public.organizations as o
          where o.id = organization_id
          and o.owner_id = auth.uid()
       )
  );

drop policy if exists "Admins can delete members" on public.organization_members;
create policy "Admins can delete members" on public.organization_members
  for delete using (
      -- Check if user is admin in the organization (using helper function to avoid recursion)
      public.is_organization_admin(organization_id, auth.uid())
      OR
      -- Or if user is the owner of the organization
      exists (
          select 1 from public.organizations as o
          where o.id = organization_id
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
    (organization_id is not null AND public.is_organization_member(organization_id, auth.uid()))
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
        (n.organization_id is not null AND public.is_organization_member(n.organization_id, auth.uid()))
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
    timestamp timestamp with time zone default timezone('utc'::text, now()) not null
);

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
                  (n.organization_id is not null AND public.is_organization_member(n.organization_id, auth.uid()))
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
    public.is_organization_member(organization_id, auth.uid())
  );

drop policy if exists "Admins can manage webhooks" on public.webhooks;
create policy "Admins can manage webhooks" on public.webhooks
  for all using (
    public.is_organization_admin(organization_id, auth.uid())
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
    (organization_id is not null AND public.is_organization_member(organization_id, auth.uid()))
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
    organization_id is not null AND public.is_organization_member(organization_id, auth.uid())
  );

drop policy if exists "Users can insert jobs for their orgs" on public.automation_jobs;
create policy "Users can insert jobs for their orgs" on public.automation_jobs
  for insert with check (
    organization_id is not null AND public.is_organization_member(organization_id, auth.uid())
  );

drop policy if exists "Users can update jobs for their orgs" on public.automation_jobs;
create policy "Users can update jobs for their orgs" on public.automation_jobs
  for update using (
    organization_id is not null AND public.is_organization_member(organization_id, auth.uid())
  );

```

# supabase.js

```js
/**
 * Skipped minification because the original files appears to be already minified.
 * Original file: /npm/@supabase/supabase-js@2.87.3/dist/umd/supabase.js
 *
 * Do NOT use SRI with dynamically generated files! More information: https://www.jsdelivr.com/using-sri-with-dynamic-files
 */
!function(e,t){"object"==typeof exports&&"object"==typeof module?module.exports=t():"function"==typeof define&&define.amd?define([],t):"object"==typeof exports?exports.supabase=t():e.supabase=t()}(self,()=>(()=>{"use strict";var e={13:(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0});const s=r(231),n=r(739),i=r(698),o=r(158),a=r(251),l=r(442),c=r(819),u=r(795);t.default=class{constructor(e,t,r){var s,i,u;this.supabaseUrl=e,this.supabaseKey=t;const h=(0,c.validateSupabaseUrl)(e);if(!t)throw new Error("supabaseKey is required.");this.realtimeUrl=new URL("realtime/v1",h),this.realtimeUrl.protocol=this.realtimeUrl.protocol.replace("http","ws"),this.authUrl=new URL("auth/v1",h),this.storageUrl=new URL("storage/v1",h),this.functionsUrl=new URL("functions/v1",h);const d=`sb-${h.hostname.split(".")[0]}-auth-token`,f={db:a.DEFAULT_DB_OPTIONS,realtime:a.DEFAULT_REALTIME_OPTIONS,auth:Object.assign(Object.assign({},a.DEFAULT_AUTH_OPTIONS),{storageKey:d}),global:a.DEFAULT_GLOBAL_OPTIONS},p=(0,c.applySettingDefaults)(null!=r?r:{},f);this.storageKey=null!==(s=p.auth.storageKey)&&void 0!==s?s:"",this.headers=null!==(i=p.global.headers)&&void 0!==i?i:{},p.accessToken?(this.accessToken=p.accessToken,this.auth=new Proxy({},{get:(e,t)=>{throw new Error(`@supabase/supabase-js: Supabase Client is configured with the accessToken option, accessing supabase.auth.${String(t)} is not possible`)}})):this.auth=this._initSupabaseAuthClient(null!==(u=p.auth)&&void 0!==u?u:{},this.headers,p.global.fetch),this.fetch=(0,l.fetchWithAuth)(t,this._getAccessToken.bind(this),p.global.fetch),this.realtime=this._initRealtimeClient(Object.assign({headers:this.headers,accessToken:this._getAccessToken.bind(this)},p.realtime)),this.accessToken&&this.accessToken().then(e=>this.realtime.setAuth(e)).catch(e=>console.warn("Failed to set initial Realtime auth token:",e)),this.rest=new n.PostgrestClient(new URL("rest/v1",h).href,{headers:this.headers,schema:p.db.schema,fetch:this.fetch}),this.storage=new o.StorageClient(this.storageUrl.href,this.headers,this.fetch,null==r?void 0:r.storage),p.accessToken||this._listenForAuthEvents()}get functions(){return new s.FunctionsClient(this.functionsUrl.href,{headers:this.headers,customFetch:this.fetch})}from(e){return this.rest.from(e)}schema(e){return this.rest.schema(e)}rpc(e,t={},r={head:!1,get:!1,count:void 0}){return this.rest.rpc(e,t,r)}channel(e,t={config:{}}){return this.realtime.channel(e,t)}getChannels(){return this.realtime.getChannels()}removeChannel(e){return this.realtime.removeChannel(e)}removeAllChannels(){return this.realtime.removeAllChannels()}async _getAccessToken(){var e,t;if(this.accessToken)return await this.accessToken();const{data:r}=await this.auth.getSession();return null!==(t=null===(e=r.session)||void 0===e?void 0:e.access_token)&&void 0!==t?t:this.supabaseKey}_initSupabaseAuthClient({autoRefreshToken:e,persistSession:t,detectSessionInUrl:r,storage:s,userStorage:n,storageKey:i,flowType:o,lock:a,debug:l,throwOnError:c},h,d){const f={Authorization:`Bearer ${this.supabaseKey}`,apikey:`${this.supabaseKey}`};return new u.SupabaseAuthClient({url:this.authUrl.href,headers:Object.assign(Object.assign({},f),h),storageKey:i,autoRefreshToken:e,persistSession:t,detectSessionInUrl:r,storage:s,userStorage:n,flowType:o,lock:a,debug:l,throwOnError:c,fetch:d,hasCustomAuthorizationHeader:Object.keys(this.headers).some(e=>"authorization"===e.toLowerCase())})}_initRealtimeClient(e){return new i.RealtimeClient(this.realtimeUrl.href,Object.assign(Object.assign({},e),{params:Object.assign({apikey:this.supabaseKey},null==e?void 0:e.params)}))}_listenForAuthEvents(){return this.auth.onAuthStateChange((e,t)=>{this._handleTokenChanged(e,"CLIENT",null==t?void 0:t.access_token)})}_handleTokenChanged(e,t,r){"TOKEN_REFRESHED"!==e&&"SIGNED_IN"!==e||this.changedAccessToken===r?"SIGNED_OUT"===e&&(this.realtime.setAuth(),"STORAGE"==t&&this.auth.signOut(),this.changedAccessToken=void 0):(this.changedAccessToken=r,this.realtime.setAuth(r))}}},158:(e,t,r)=>{r.r(t),r.d(t,{StorageAnalyticsClient:()=>I,StorageApiError:()=>o,StorageClient:()=>Q,StorageError:()=>n,StorageUnknownError:()=>a,StorageVectorsApiError:()=>N,StorageVectorsClient:()=>J,StorageVectorsError:()=>$,StorageVectorsErrorCode:()=>D,StorageVectorsUnknownError:()=>U,VectorBucketApi:()=>H,VectorBucketScope:()=>z,VectorDataApi:()=>G,VectorIndexApi:()=>W,VectorIndexScope:()=>Y,isPlainObject:()=>q,isStorageError:()=>i,isStorageVectorsError:()=>x,normalizeToFloat32:()=>F,resolveFetch:()=>L,resolveResponse:()=>B,validateVectorDimension:()=>M});var s=r(823);class n extends Error{constructor(e){super(e),this.__isStorageError=!0,this.name="StorageError"}}function i(e){return"object"==typeof e&&null!==e&&"__isStorageError"in e}class o extends n{constructor(e,t,r){super(e),this.name="StorageApiError",this.status=t,this.statusCode=r}toJSON(){return{name:this.name,message:this.message,status:this.status,statusCode:this.statusCode}}}class a extends n{constructor(e,t){super(e),this.name="StorageUnknownError",this.originalError=t}}const l=e=>e?(...t)=>e(...t):(...e)=>fetch(...e),c=e=>{if(Array.isArray(e))return e.map(e=>c(e));if("function"==typeof e||e!==Object(e))return e;const t={};return Object.entries(e).forEach(([e,r])=>{const s=e.replace(/([-_][a-z])/gi,e=>e.toUpperCase().replace(/[-_]/g,""));t[s]=c(r)}),t},u=e=>{var t;return e.msg||e.message||e.error_description||("string"==typeof e.error?e.error:null===(t=e.error)||void 0===t?void 0:t.message)||JSON.stringify(e)};function h(e,t,r,n,i,l){return(0,s.__awaiter)(this,void 0,void 0,function*(){return new Promise((c,h)=>{e(r,((e,t,r,s)=>{const n={method:e,headers:(null==t?void 0:t.headers)||{}};return"GET"!==e&&s?((e=>{if("object"!=typeof e||null===e)return!1;const t=Object.getPrototypeOf(e);return!(null!==t&&t!==Object.prototype&&null!==Object.getPrototypeOf(t)||Symbol.toStringTag in e||Symbol.iterator in e)})(s)?(n.headers=Object.assign({"Content-Type":"application/json"},null==t?void 0:t.headers),n.body=JSON.stringify(s)):n.body=s,(null==t?void 0:t.duplex)&&(n.duplex=t.duplex),Object.assign(Object.assign({},n),r)):n})(t,n,i,l)).then(e=>{if(!e.ok)throw e;return(null==n?void 0:n.noResolveJson)?e:e.json()}).then(e=>c(e)).catch(e=>((e,t,r)=>(0,s.__awaiter)(void 0,void 0,void 0,function*(){const s=yield Response;e instanceof s&&!(null==r?void 0:r.noResolveJson)?e.json().then(r=>{const s=e.status||500,n=(null==r?void 0:r.statusCode)||s+"";t(new o(u(r),s,n))}).catch(e=>{t(new a(u(e),e))}):t(new a(u(e),e))}))(e,h,n))})})}function d(e,t,r,n){return(0,s.__awaiter)(this,void 0,void 0,function*(){return h(e,"GET",t,r,n)})}function f(e,t,r,n,i){return(0,s.__awaiter)(this,void 0,void 0,function*(){return h(e,"POST",t,n,i,r)})}function p(e,t,r,n,i){return(0,s.__awaiter)(this,void 0,void 0,function*(){return h(e,"PUT",t,n,i,r)})}function g(e,t,r,n,i){return(0,s.__awaiter)(this,void 0,void 0,function*(){return h(e,"DELETE",t,n,i,r)})}class w{constructor(e,t){this.downloadFn=e,this.shouldThrowOnError=t}then(e,t){return this.execute().then(e,t)}execute(){return(0,s.__awaiter)(this,void 0,void 0,function*(){try{return{data:(yield this.downloadFn()).body,error:null}}catch(e){if(this.shouldThrowOnError)throw e;if(i(e))return{data:null,error:e};throw e}})}}var y;y=Symbol.toStringTag;const _=class{constructor(e,t){this.downloadFn=e,this.shouldThrowOnError=t,this[y]="BlobDownloadBuilder",this.promise=null}asStream(){return new w(this.downloadFn,this.shouldThrowOnError)}then(e,t){return this.getPromise().then(e,t)}catch(e){return this.getPromise().catch(e)}finally(e){return this.getPromise().finally(e)}getPromise(){return this.promise||(this.promise=this.execute()),this.promise}execute(){return(0,s.__awaiter)(this,void 0,void 0,function*(){try{const e=yield this.downloadFn();return{data:yield e.blob(),error:null}}catch(e){if(this.shouldThrowOnError)throw e;if(i(e))return{data:null,error:e};throw e}})}},v={limit:100,offset:0,sortBy:{column:"name",order:"asc"}},m={cacheControl:"3600",contentType:"text/plain;charset=UTF-8",upsert:!1};class b{constructor(e,t={},r,s){this.shouldThrowOnError=!1,this.url=e,this.headers=t,this.bucketId=r,this.fetch=l(s)}throwOnError(){return this.shouldThrowOnError=!0,this}uploadOrUpdate(e,t,r,n){return(0,s.__awaiter)(this,void 0,void 0,function*(){try{let s;const i=Object.assign(Object.assign({},m),n);let o=Object.assign(Object.assign({},this.headers),"POST"===e&&{"x-upsert":String(i.upsert)});const a=i.metadata;"undefined"!=typeof Blob&&r instanceof Blob?(s=new FormData,s.append("cacheControl",i.cacheControl),a&&s.append("metadata",this.encodeMetadata(a)),s.append("",r)):"undefined"!=typeof FormData&&r instanceof FormData?(s=r,s.has("cacheControl")||s.append("cacheControl",i.cacheControl),a&&!s.has("metadata")&&s.append("metadata",this.encodeMetadata(a))):(s=r,o["cache-control"]=`max-age=${i.cacheControl}`,o["content-type"]=i.contentType,a&&(o["x-metadata"]=this.toBase64(this.encodeMetadata(a))),("undefined"!=typeof ReadableStream&&s instanceof ReadableStream||s&&"object"==typeof s&&"pipe"in s&&"function"==typeof s.pipe)&&!i.duplex&&(i.duplex="half")),(null==n?void 0:n.headers)&&(o=Object.assign(Object.assign({},o),n.headers));const l=this._removeEmptyFolders(t),c=this._getFinalPath(l),u=yield("PUT"==e?p:f)(this.fetch,`${this.url}/object/${c}`,s,Object.assign({headers:o},(null==i?void 0:i.duplex)?{duplex:i.duplex}:{}));return{data:{path:l,id:u.Id,fullPath:u.Key},error:null}}catch(e){if(this.shouldThrowOnError)throw e;if(i(e))return{data:null,error:e};throw e}})}upload(e,t,r){return(0,s.__awaiter)(this,void 0,void 0,function*(){return this.uploadOrUpdate("POST",e,t,r)})}uploadToSignedUrl(e,t,r,n){return(0,s.__awaiter)(this,void 0,void 0,function*(){const s=this._removeEmptyFolders(e),o=this._getFinalPath(s),a=new URL(this.url+`/object/upload/sign/${o}`);a.searchParams.set("token",t);try{let e;const t=Object.assign({upsert:m.upsert},n),i=Object.assign(Object.assign({},this.headers),{"x-upsert":String(t.upsert)});return"undefined"!=typeof Blob&&r instanceof Blob?(e=new FormData,e.append("cacheControl",t.cacheControl),e.append("",r)):"undefined"!=typeof FormData&&r instanceof FormData?(e=r,e.append("cacheControl",t.cacheControl)):(e=r,i["cache-control"]=`max-age=${t.cacheControl}`,i["content-type"]=t.contentType),{data:{path:s,fullPath:(yield p(this.fetch,a.toString(),e,{headers:i})).Key},error:null}}catch(e){if(this.shouldThrowOnError)throw e;if(i(e))return{data:null,error:e};throw e}})}createSignedUploadUrl(e,t){return(0,s.__awaiter)(this,void 0,void 0,function*(){try{let r=this._getFinalPath(e);const s=Object.assign({},this.headers);(null==t?void 0:t.upsert)&&(s["x-upsert"]="true");const i=yield f(this.fetch,`${this.url}/object/upload/sign/${r}`,{},{headers:s}),o=new URL(this.url+i.url),a=o.searchParams.get("token");if(!a)throw new n("No token returned by API");return{data:{signedUrl:o.toString(),path:e,token:a},error:null}}catch(e){if(this.shouldThrowOnError)throw e;if(i(e))return{data:null,error:e};throw e}})}update(e,t,r){return(0,s.__awaiter)(this,void 0,void 0,function*(){return this.uploadOrUpdate("PUT",e,t,r)})}move(e,t,r){return(0,s.__awaiter)(this,void 0,void 0,function*(){try{return{data:yield f(this.fetch,`${this.url}/object/move`,{bucketId:this.bucketId,sourceKey:e,destinationKey:t,destinationBucket:null==r?void 0:r.destinationBucket},{headers:this.headers}),error:null}}catch(e){if(this.shouldThrowOnError)throw e;if(i(e))return{data:null,error:e};throw e}})}copy(e,t,r){return(0,s.__awaiter)(this,void 0,void 0,function*(){try{return{data:{path:(yield f(this.fetch,`${this.url}/object/copy`,{bucketId:this.bucketId,sourceKey:e,destinationKey:t,destinationBucket:null==r?void 0:r.destinationBucket},{headers:this.headers})).Key},error:null}}catch(e){if(this.shouldThrowOnError)throw e;if(i(e))return{data:null,error:e};throw e}})}createSignedUrl(e,t,r){return(0,s.__awaiter)(this,void 0,void 0,function*(){try{let s=this._getFinalPath(e),n=yield f(this.fetch,`${this.url}/object/sign/${s}`,Object.assign({expiresIn:t},(null==r?void 0:r.transform)?{transform:r.transform}:{}),{headers:this.headers});const i=(null==r?void 0:r.download)?`&download=${!0===r.download?"":r.download}`:"";return n={signedUrl:encodeURI(`${this.url}${n.signedURL}${i}`)},{data:n,error:null}}catch(e){if(this.shouldThrowOnError)throw e;if(i(e))return{data:null,error:e};throw e}})}createSignedUrls(e,t,r){return(0,s.__awaiter)(this,void 0,void 0,function*(){try{const s=yield f(this.fetch,`${this.url}/object/sign/${this.bucketId}`,{expiresIn:t,paths:e},{headers:this.headers}),n=(null==r?void 0:r.download)?`&download=${!0===r.download?"":r.download}`:"";return{data:s.map(e=>Object.assign(Object.assign({},e),{signedUrl:e.signedURL?encodeURI(`${this.url}${e.signedURL}${n}`):null})),error:null}}catch(e){if(this.shouldThrowOnError)throw e;if(i(e))return{data:null,error:e};throw e}})}download(e,t){const r=void 0!==(null==t?void 0:t.transform)?"render/image/authenticated":"object",s=this.transformOptsToQueryString((null==t?void 0:t.transform)||{}),n=s?`?${s}`:"",i=this._getFinalPath(e);return new _(()=>d(this.fetch,`${this.url}/${r}/${i}${n}`,{headers:this.headers,noResolveJson:!0}),this.shouldThrowOnError)}info(e){return(0,s.__awaiter)(this,void 0,void 0,function*(){const t=this._getFinalPath(e);try{const e=yield d(this.fetch,`${this.url}/object/info/${t}`,{headers:this.headers});return{data:c(e),error:null}}catch(e){if(this.shouldThrowOnError)throw e;if(i(e))return{data:null,error:e};throw e}})}exists(e){return(0,s.__awaiter)(this,void 0,void 0,function*(){const t=this._getFinalPath(e);try{return yield function(e,t,r){return(0,s.__awaiter)(this,void 0,void 0,function*(){return h(e,"HEAD",t,Object.assign(Object.assign({},r),{noResolveJson:!0}),undefined)})}(this.fetch,`${this.url}/object/${t}`,{headers:this.headers}),{data:!0,error:null}}catch(e){if(this.shouldThrowOnError)throw e;if(i(e)&&e instanceof a){const t=e.originalError;if([400,404].includes(null==t?void 0:t.status))return{data:!1,error:e}}throw e}})}getPublicUrl(e,t){const r=this._getFinalPath(e),s=[],n=(null==t?void 0:t.download)?`download=${!0===t.download?"":t.download}`:"";""!==n&&s.push(n);const i=void 0!==(null==t?void 0:t.transform)?"render/image":"object",o=this.transformOptsToQueryString((null==t?void 0:t.transform)||{});""!==o&&s.push(o);let a=s.join("&");return""!==a&&(a=`?${a}`),{data:{publicUrl:encodeURI(`${this.url}/${i}/public/${r}${a}`)}}}remove(e){return(0,s.__awaiter)(this,void 0,void 0,function*(){try{return{data:yield g(this.fetch,`${this.url}/object/${this.bucketId}`,{prefixes:e},{headers:this.headers}),error:null}}catch(e){if(this.shouldThrowOnError)throw e;if(i(e))return{data:null,error:e};throw e}})}list(e,t,r){return(0,s.__awaiter)(this,void 0,void 0,function*(){try{const s=Object.assign(Object.assign(Object.assign({},v),t),{prefix:e||""});return{data:yield f(this.fetch,`${this.url}/object/list/${this.bucketId}`,s,{headers:this.headers},r),error:null}}catch(e){if(this.shouldThrowOnError)throw e;if(i(e))return{data:null,error:e};throw e}})}listV2(e,t){return(0,s.__awaiter)(this,void 0,void 0,function*(){try{const r=Object.assign({},e);return{data:yield f(this.fetch,`${this.url}/object/list-v2/${this.bucketId}`,r,{headers:this.headers},t),error:null}}catch(e){if(this.shouldThrowOnError)throw e;if(i(e))return{data:null,error:e};throw e}})}encodeMetadata(e){return JSON.stringify(e)}toBase64(e){return"undefined"!=typeof Buffer?Buffer.from(e).toString("base64"):btoa(e)}_getFinalPath(e){return`${this.bucketId}/${e.replace(/^\/+/,"")}`}_removeEmptyFolders(e){return e.replace(/^\/|\/$/g,"").replace(/\/+/g,"/")}transformOptsToQueryString(e){const t=[];return e.width&&t.push(`width=${e.width}`),e.height&&t.push(`height=${e.height}`),e.resize&&t.push(`resize=${e.resize}`),e.format&&t.push(`format=${e.format}`),e.quality&&t.push(`quality=${e.quality}`),t.join("&")}}const E="2.87.3",k={"X-Client-Info":`storage-js/${E}`};class S{constructor(e,t={},r,s){this.shouldThrowOnError=!1;const n=new URL(e);(null==s?void 0:s.useNewHostname)&&/supabase\.(co|in|red)$/.test(n.hostname)&&!n.hostname.includes("storage.supabase.")&&(n.hostname=n.hostname.replace("supabase.","storage.supabase.")),this.url=n.href.replace(/\/$/,""),this.headers=Object.assign(Object.assign({},k),t),this.fetch=l(r)}throwOnError(){return this.shouldThrowOnError=!0,this}listBuckets(e){return(0,s.__awaiter)(this,void 0,void 0,function*(){try{const t=this.listBucketOptionsToQueryString(e);return{data:yield d(this.fetch,`${this.url}/bucket${t}`,{headers:this.headers}),error:null}}catch(e){if(this.shouldThrowOnError)throw e;if(i(e))return{data:null,error:e};throw e}})}getBucket(e){return(0,s.__awaiter)(this,void 0,void 0,function*(){try{return{data:yield d(this.fetch,`${this.url}/bucket/${e}`,{headers:this.headers}),error:null}}catch(e){if(this.shouldThrowOnError)throw e;if(i(e))return{data:null,error:e};throw e}})}createBucket(e){return(0,s.__awaiter)(this,arguments,void 0,function*(e,t={public:!1}){try{return{data:yield f(this.fetch,`${this.url}/bucket`,{id:e,name:e,type:t.type,public:t.public,file_size_limit:t.fileSizeLimit,allowed_mime_types:t.allowedMimeTypes},{headers:this.headers}),error:null}}catch(e){if(this.shouldThrowOnError)throw e;if(i(e))return{data:null,error:e};throw e}})}updateBucket(e,t){return(0,s.__awaiter)(this,void 0,void 0,function*(){try{return{data:yield p(this.fetch,`${this.url}/bucket/${e}`,{id:e,name:e,public:t.public,file_size_limit:t.fileSizeLimit,allowed_mime_types:t.allowedMimeTypes},{headers:this.headers}),error:null}}catch(e){if(this.shouldThrowOnError)throw e;if(i(e))return{data:null,error:e};throw e}})}emptyBucket(e){return(0,s.__awaiter)(this,void 0,void 0,function*(){try{return{data:yield f(this.fetch,`${this.url}/bucket/${e}/empty`,{},{headers:this.headers}),error:null}}catch(e){if(this.shouldThrowOnError)throw e;if(i(e))return{data:null,error:e};throw e}})}deleteBucket(e){return(0,s.__awaiter)(this,void 0,void 0,function*(){try{return{data:yield g(this.fetch,`${this.url}/bucket/${e}`,{},{headers:this.headers}),error:null}}catch(e){if(this.shouldThrowOnError)throw e;if(i(e))return{data:null,error:e};throw e}})}listBucketOptionsToQueryString(e){const t={};return e&&("limit"in e&&(t.limit=String(e.limit)),"offset"in e&&(t.offset=String(e.offset)),e.search&&(t.search=e.search),e.sortColumn&&(t.sortColumn=e.sortColumn),e.sortOrder&&(t.sortOrder=e.sortOrder)),Object.keys(t).length>0?"?"+new URLSearchParams(t).toString():""}}var T=class extends Error{constructor(e,t){super(e),this.name="IcebergError",this.status=t.status,this.icebergType=t.icebergType,this.icebergCode=t.icebergCode,this.details=t.details,this.isCommitStateUnknown="CommitStateUnknownException"===t.icebergType||[500,502,504].includes(t.status)&&!0===t.icebergType?.includes("CommitState")}isNotFound(){return 404===this.status}isConflict(){return 409===this.status}isAuthenticationTimeout(){return 419===this.status}};function O(e){return e.join("")}var j=class{constructor(e,t=""){this.client=e,this.prefix=t}async listNamespaces(e){const t=e?{parent:O(e.namespace)}:void 0;return(await this.client.request({method:"GET",path:`${this.prefix}/namespaces`,query:t})).data.namespaces.map(e=>({namespace:e}))}async createNamespace(e,t){const r={namespace:e.namespace,properties:t?.properties};return(await this.client.request({method:"POST",path:`${this.prefix}/namespaces`,body:r})).data}async dropNamespace(e){await this.client.request({method:"DELETE",path:`${this.prefix}/namespaces/${O(e.namespace)}`})}async loadNamespaceMetadata(e){return{properties:(await this.client.request({method:"GET",path:`${this.prefix}/namespaces/${O(e.namespace)}`})).data.properties}}async namespaceExists(e){try{return await this.client.request({method:"HEAD",path:`${this.prefix}/namespaces/${O(e.namespace)}`}),!0}catch(e){if(e instanceof T&&404===e.status)return!1;throw e}}async createNamespaceIfNotExists(e,t){try{return await this.createNamespace(e,t)}catch(e){if(e instanceof T&&409===e.status)return;throw e}}};function R(e){return e.join("")}var A=class{constructor(e,t="",r){this.client=e,this.prefix=t,this.accessDelegation=r}async listTables(e){return(await this.client.request({method:"GET",path:`${this.prefix}/namespaces/${R(e.namespace)}/tables`})).data.identifiers}async createTable(e,t){const r={};return this.accessDelegation&&(r["X-Iceberg-Access-Delegation"]=this.accessDelegation),(await this.client.request({method:"POST",path:`${this.prefix}/namespaces/${R(e.namespace)}/tables`,body:t,headers:r})).data.metadata}async updateTable(e,t){const r=await this.client.request({method:"POST",path:`${this.prefix}/namespaces/${R(e.namespace)}/tables/${e.name}`,body:t});return{"metadata-location":r.data["metadata-location"],metadata:r.data.metadata}}async dropTable(e,t){await this.client.request({method:"DELETE",path:`${this.prefix}/namespaces/${R(e.namespace)}/tables/${e.name}`,query:{purgeRequested:String(t?.purge??!1)}})}async loadTable(e){const t={};return this.accessDelegation&&(t["X-Iceberg-Access-Delegation"]=this.accessDelegation),(await this.client.request({method:"GET",path:`${this.prefix}/namespaces/${R(e.namespace)}/tables/${e.name}`,headers:t})).data.metadata}async tableExists(e){const t={};this.accessDelegation&&(t["X-Iceberg-Access-Delegation"]=this.accessDelegation);try{return await this.client.request({method:"HEAD",path:`${this.prefix}/namespaces/${R(e.namespace)}/tables/${e.name}`,headers:t}),!0}catch(e){if(e instanceof T&&404===e.status)return!1;throw e}}async createTableIfNotExists(e,t){try{return await this.createTable(e,t)}catch(r){if(r instanceof T&&409===r.status)return await this.loadTable({namespace:e.namespace,name:t.name});throw r}}},P=class{constructor(e){let t="v1";e.catalogName&&(t+=`/${e.catalogName}`);const r=e.baseUrl.endsWith("/")?e.baseUrl:`${e.baseUrl}/`;this.client=function(e){const t=e.fetchImpl??globalThis.fetch;return{async request({method:r,path:s,query:n,body:i,headers:o}){const a=function(e,t,r){const s=new URL(t,e);if(r)for(const[e,t]of Object.entries(r))void 0!==t&&s.searchParams.set(e,t);return s.toString()}(e.baseUrl,s,n),l=await async function(e){return e&&"none"!==e.type?"bearer"===e.type?{Authorization:`Bearer ${e.token}`}:"header"===e.type?{[e.name]:e.value}:"custom"===e.type?await e.getHeaders():{}:{}}(e.auth),c=await t(a,{method:r,headers:{...i?{"Content-Type":"application/json"}:{},...l,...o},body:i?JSON.stringify(i):void 0}),u=await c.text(),h=(c.headers.get("content-type")||"").includes("application/json"),d=h&&u?JSON.parse(u):u;if(!c.ok){const e=h?d:void 0,t=e?.error;throw new T(t?.message??`Request failed with status ${c.status}`,{status:c.status,icebergType:t?.type,icebergCode:t?.code,details:e})}return{status:c.status,headers:c.headers,data:d}}}}({baseUrl:r,auth:e.auth,fetchImpl:e.fetch}),this.accessDelegation=e.accessDelegation?.join(","),this.namespaceOps=new j(this.client,t),this.tableOps=new A(this.client,t,this.accessDelegation)}async listNamespaces(e){return this.namespaceOps.listNamespaces(e)}async createNamespace(e,t){return this.namespaceOps.createNamespace(e,t)}async dropNamespace(e){await this.namespaceOps.dropNamespace(e)}async loadNamespaceMetadata(e){return this.namespaceOps.loadNamespaceMetadata(e)}async listTables(e){return this.tableOps.listTables(e)}async createTable(e,t){return this.tableOps.createTable(e,t)}async updateTable(e,t){return this.tableOps.updateTable(e,t)}async dropTable(e,t){await this.tableOps.dropTable(e,t)}async loadTable(e){return this.tableOps.loadTable(e)}async namespaceExists(e){return this.namespaceOps.namespaceExists(e)}async tableExists(e){return this.tableOps.tableExists(e)}async createNamespaceIfNotExists(e,t){return this.namespaceOps.createNamespaceIfNotExists(e,t)}async createTableIfNotExists(e,t){return this.tableOps.createTableIfNotExists(e,t)}};class I{constructor(e,t={},r){this.shouldThrowOnError=!1,this.url=e.replace(/\/$/,""),this.headers=Object.assign(Object.assign({},k),t),this.fetch=l(r)}throwOnError(){return this.shouldThrowOnError=!0,this}createBucket(e){return(0,s.__awaiter)(this,void 0,void 0,function*(){try{return{data:yield f(this.fetch,`${this.url}/bucket`,{name:e},{headers:this.headers}),error:null}}catch(e){if(this.shouldThrowOnError)throw e;if(i(e))return{data:null,error:e};throw e}})}listBuckets(e){return(0,s.__awaiter)(this,void 0,void 0,function*(){try{const t=new URLSearchParams;void 0!==(null==e?void 0:e.limit)&&t.set("limit",e.limit.toString()),void 0!==(null==e?void 0:e.offset)&&t.set("offset",e.offset.toString()),(null==e?void 0:e.sortColumn)&&t.set("sortColumn",e.sortColumn),(null==e?void 0:e.sortOrder)&&t.set("sortOrder",e.sortOrder),(null==e?void 0:e.search)&&t.set("search",e.search);const r=t.toString(),s=r?`${this.url}/bucket?${r}`:`${this.url}/bucket`;return{data:yield d(this.fetch,s,{headers:this.headers}),error:null}}catch(e){if(this.shouldThrowOnError)throw e;if(i(e))return{data:null,error:e};throw e}})}deleteBucket(e){return(0,s.__awaiter)(this,void 0,void 0,function*(){try{return{data:yield g(this.fetch,`${this.url}/bucket/${e}`,{},{headers:this.headers}),error:null}}catch(e){if(this.shouldThrowOnError)throw e;if(i(e))return{data:null,error:e};throw e}})}from(e){if(!(e=>!(!e||"string"!=typeof e)&&!(0===e.length||e.length>100)&&e.trim()===e&&!e.includes("/")&&!e.includes("\\")&&/^[\w!.\*'() &$@=;:+,?-]+$/.test(e))(e))throw new n("Invalid bucket name: File, folder, and bucket names must follow AWS object key naming guidelines and should avoid the use of any other characters.");const t=new P({baseUrl:this.url,catalogName:e,auth:{type:"custom",getHeaders:()=>(0,s.__awaiter)(this,void 0,void 0,function*(){return this.headers})},fetch:this.fetch}),r=this.shouldThrowOnError;return new Proxy(t,{get(e,t){const n=e[t];return"function"!=typeof n?n:(...t)=>(0,s.__awaiter)(this,void 0,void 0,function*(){try{return{data:yield n.apply(e,t),error:null}}catch(e){if(r)throw e;return{data:null,error:e}}})}})}}const C={"X-Client-Info":`storage-js/${E}`,"Content-Type":"application/json"};class $ extends Error{constructor(e){super(e),this.__isStorageVectorsError=!0,this.name="StorageVectorsError"}}function x(e){return"object"==typeof e&&null!==e&&"__isStorageVectorsError"in e}class N extends ${constructor(e,t,r){super(e),this.name="StorageVectorsApiError",this.status=t,this.statusCode=r}toJSON(){return{name:this.name,message:this.message,status:this.status,statusCode:this.statusCode}}}class U extends ${constructor(e,t){super(e),this.name="StorageVectorsUnknownError",this.originalError=t}}var D;!function(e){e.InternalError="InternalError",e.S3VectorConflictException="S3VectorConflictException",e.S3VectorNotFoundException="S3VectorNotFoundException",e.S3VectorBucketNotEmpty="S3VectorBucketNotEmpty",e.S3VectorMaxBucketsExceeded="S3VectorMaxBucketsExceeded",e.S3VectorMaxIndexesExceeded="S3VectorMaxIndexesExceeded"}(D||(D={}));const L=e=>e?(...t)=>e(...t):(...e)=>fetch(...e),B=()=>Response,q=e=>{if("object"!=typeof e||null===e)return!1;const t=Object.getPrototypeOf(e);return!(null!==t&&t!==Object.prototype&&null!==Object.getPrototypeOf(t)||Symbol.toStringTag in e||Symbol.iterator in e)},F=e=>Array.from(new Float32Array(e)),M=(e,t)=>{if(void 0!==t&&e.float32.length!==t)throw new Error(`Vector dimension mismatch: expected ${t}, got ${e.float32.length}`)},K=e=>e.msg||e.message||e.error_description||e.error||JSON.stringify(e);function V(e,t,r,n,i){return(0,s.__awaiter)(this,void 0,void 0,function*(){return function(e,t,r,n,i,o){return(0,s.__awaiter)(this,void 0,void 0,function*(){return new Promise((a,l)=>{e(r,((e,t,r,s)=>{const n={method:e,headers:(null==t?void 0:t.headers)||{}};return"GET"!==e&&s?(q(s)?(n.headers=Object.assign({"Content-Type":"application/json"},null==t?void 0:t.headers),n.body=JSON.stringify(s)):n.body=s,Object.assign(Object.assign({},n),r)):n})(t,n,i,o)).then(e=>{if(!e.ok)throw e;if(null==n?void 0:n.noResolveJson)return e;const t=e.headers.get("content-type");return t&&t.includes("application/json")?e.json():{}}).then(e=>a(e)).catch(e=>((e,t,r)=>(0,s.__awaiter)(void 0,void 0,void 0,function*(){if(e&&"object"==typeof e&&"status"in e&&"ok"in e&&"number"==typeof e.status&&!(null==r?void 0:r.noResolveJson)){const r=e.status||500,s=e;if("function"==typeof s.json)s.json().then(e=>{const s=(null==e?void 0:e.statusCode)||(null==e?void 0:e.code)||r+"";t(new N(K(e),r,s))}).catch(()=>{const e=r+"",n=s.statusText||`HTTP ${r} error`;t(new N(n,r,e))});else{const e=r+"",n=s.statusText||`HTTP ${r} error`;t(new N(n,r,e))}}else t(new U(K(e),e))}))(e,l,n))})})}(e,"POST",t,n,i,r)})}class W{constructor(e,t={},r){this.shouldThrowOnError=!1,this.url=e.replace(/\/$/,""),this.headers=Object.assign(Object.assign({},C),t),this.fetch=L(r)}throwOnError(){return this.shouldThrowOnError=!0,this}createIndex(e){return(0,s.__awaiter)(this,void 0,void 0,function*(){try{return{data:(yield V(this.fetch,`${this.url}/CreateIndex`,e,{headers:this.headers}))||{},error:null}}catch(e){if(this.shouldThrowOnError)throw e;if(x(e))return{data:null,error:e};throw e}})}getIndex(e,t){return(0,s.__awaiter)(this,void 0,void 0,function*(){try{return{data:yield V(this.fetch,`${this.url}/GetIndex`,{vectorBucketName:e,indexName:t},{headers:this.headers}),error:null}}catch(e){if(this.shouldThrowOnError)throw e;if(x(e))return{data:null,error:e};throw e}})}listIndexes(e){return(0,s.__awaiter)(this,void 0,void 0,function*(){try{return{data:yield V(this.fetch,`${this.url}/ListIndexes`,e,{headers:this.headers}),error:null}}catch(e){if(this.shouldThrowOnError)throw e;if(x(e))return{data:null,error:e};throw e}})}deleteIndex(e,t){return(0,s.__awaiter)(this,void 0,void 0,function*(){try{return{data:(yield V(this.fetch,`${this.url}/DeleteIndex`,{vectorBucketName:e,indexName:t},{headers:this.headers}))||{},error:null}}catch(e){if(this.shouldThrowOnError)throw e;if(x(e))return{data:null,error:e};throw e}})}}class G{constructor(e,t={},r){this.shouldThrowOnError=!1,this.url=e.replace(/\/$/,""),this.headers=Object.assign(Object.assign({},C),t),this.fetch=L(r)}throwOnError(){return this.shouldThrowOnError=!0,this}putVectors(e){return(0,s.__awaiter)(this,void 0,void 0,function*(){try{if(e.vectors.length<1||e.vectors.length>500)throw new Error("Vector batch size must be between 1 and 500 items");return{data:(yield V(this.fetch,`${this.url}/PutVectors`,e,{headers:this.headers}))||{},error:null}}catch(e){if(this.shouldThrowOnError)throw e;if(x(e))return{data:null,error:e};throw e}})}getVectors(e){return(0,s.__awaiter)(this,void 0,void 0,function*(){try{return{data:yield V(this.fetch,`${this.url}/GetVectors`,e,{headers:this.headers}),error:null}}catch(e){if(this.shouldThrowOnError)throw e;if(x(e))return{data:null,error:e};throw e}})}listVectors(e){return(0,s.__awaiter)(this,void 0,void 0,function*(){try{if(void 0!==e.segmentCount){if(e.segmentCount<1||e.segmentCount>16)throw new Error("segmentCount must be between 1 and 16");if(void 0!==e.segmentIndex&&(e.segmentIndex<0||e.segmentIndex>=e.segmentCount))throw new Error("segmentIndex must be between 0 and "+(e.segmentCount-1))}return{data:yield V(this.fetch,`${this.url}/ListVectors`,e,{headers:this.headers}),error:null}}catch(e){if(this.shouldThrowOnError)throw e;if(x(e))return{data:null,error:e};throw e}})}queryVectors(e){return(0,s.__awaiter)(this,void 0,void 0,function*(){try{return{data:yield V(this.fetch,`${this.url}/QueryVectors`,e,{headers:this.headers}),error:null}}catch(e){if(this.shouldThrowOnError)throw e;if(x(e))return{data:null,error:e};throw e}})}deleteVectors(e){return(0,s.__awaiter)(this,void 0,void 0,function*(){try{if(e.keys.length<1||e.keys.length>500)throw new Error("Keys batch size must be between 1 and 500 items");return{data:(yield V(this.fetch,`${this.url}/DeleteVectors`,e,{headers:this.headers}))||{},error:null}}catch(e){if(this.shouldThrowOnError)throw e;if(x(e))return{data:null,error:e};throw e}})}}class H{constructor(e,t={},r){this.shouldThrowOnError=!1,this.url=e.replace(/\/$/,""),this.headers=Object.assign(Object.assign({},C),t),this.fetch=L(r)}throwOnError(){return this.shouldThrowOnError=!0,this}createBucket(e){return(0,s.__awaiter)(this,void 0,void 0,function*(){try{return{data:(yield V(this.fetch,`${this.url}/CreateVectorBucket`,{vectorBucketName:e},{headers:this.headers}))||{},error:null}}catch(e){if(this.shouldThrowOnError)throw e;if(x(e))return{data:null,error:e};throw e}})}getBucket(e){return(0,s.__awaiter)(this,void 0,void 0,function*(){try{return{data:yield V(this.fetch,`${this.url}/GetVectorBucket`,{vectorBucketName:e},{headers:this.headers}),error:null}}catch(e){if(this.shouldThrowOnError)throw e;if(x(e))return{data:null,error:e};throw e}})}listBuckets(){return(0,s.__awaiter)(this,arguments,void 0,function*(e={}){try{return{data:yield V(this.fetch,`${this.url}/ListVectorBuckets`,e,{headers:this.headers}),error:null}}catch(e){if(this.shouldThrowOnError)throw e;if(x(e))return{data:null,error:e};throw e}})}deleteBucket(e){return(0,s.__awaiter)(this,void 0,void 0,function*(){try{return{data:(yield V(this.fetch,`${this.url}/DeleteVectorBucket`,{vectorBucketName:e},{headers:this.headers}))||{},error:null}}catch(e){if(this.shouldThrowOnError)throw e;if(x(e))return{data:null,error:e};throw e}})}}class J extends H{constructor(e,t={}){super(e,t.headers||{},t.fetch)}from(e){return new z(this.url,this.headers,e,this.fetch)}createBucket(e){const t=Object.create(null,{createBucket:{get:()=>super.createBucket}});return(0,s.__awaiter)(this,void 0,void 0,function*(){return t.createBucket.call(this,e)})}getBucket(e){const t=Object.create(null,{getBucket:{get:()=>super.getBucket}});return(0,s.__awaiter)(this,void 0,void 0,function*(){return t.getBucket.call(this,e)})}listBuckets(){const e=Object.create(null,{listBuckets:{get:()=>super.listBuckets}});return(0,s.__awaiter)(this,arguments,void 0,function*(t={}){return e.listBuckets.call(this,t)})}deleteBucket(e){const t=Object.create(null,{deleteBucket:{get:()=>super.deleteBucket}});return(0,s.__awaiter)(this,void 0,void 0,function*(){return t.deleteBucket.call(this,e)})}}class z extends W{constructor(e,t,r,s){super(e,t,s),this.vectorBucketName=r}createIndex(e){const t=Object.create(null,{createIndex:{get:()=>super.createIndex}});return(0,s.__awaiter)(this,void 0,void 0,function*(){return t.createIndex.call(this,Object.assign(Object.assign({},e),{vectorBucketName:this.vectorBucketName}))})}listIndexes(){const e=Object.create(null,{listIndexes:{get:()=>super.listIndexes}});return(0,s.__awaiter)(this,arguments,void 0,function*(t={}){return e.listIndexes.call(this,Object.assign(Object.assign({},t),{vectorBucketName:this.vectorBucketName}))})}getIndex(e){const t=Object.create(null,{getIndex:{get:()=>super.getIndex}});return(0,s.__awaiter)(this,void 0,void 0,function*(){return t.getIndex.call(this,this.vectorBucketName,e)})}deleteIndex(e){const t=Object.create(null,{deleteIndex:{get:()=>super.deleteIndex}});return(0,s.__awaiter)(this,void 0,void 0,function*(){return t.deleteIndex.call(this,this.vectorBucketName,e)})}index(e){return new Y(this.url,this.headers,this.vectorBucketName,e,this.fetch)}}class Y extends G{constructor(e,t,r,s,n){super(e,t,n),this.vectorBucketName=r,this.indexName=s}putVectors(e){const t=Object.create(null,{putVectors:{get:()=>super.putVectors}});return(0,s.__awaiter)(this,void 0,void 0,function*(){return t.putVectors.call(this,Object.assign(Object.assign({},e),{vectorBucketName:this.vectorBucketName,indexName:this.indexName}))})}getVectors(e){const t=Object.create(null,{getVectors:{get:()=>super.getVectors}});return(0,s.__awaiter)(this,void 0,void 0,function*(){return t.getVectors.call(this,Object.assign(Object.assign({},e),{vectorBucketName:this.vectorBucketName,indexName:this.indexName}))})}listVectors(){const e=Object.create(null,{listVectors:{get:()=>super.listVectors}});return(0,s.__awaiter)(this,arguments,void 0,function*(t={}){return e.listVectors.call(this,Object.assign(Object.assign({},t),{vectorBucketName:this.vectorBucketName,indexName:this.indexName}))})}queryVectors(e){const t=Object.create(null,{queryVectors:{get:()=>super.queryVectors}});return(0,s.__awaiter)(this,void 0,void 0,function*(){return t.queryVectors.call(this,Object.assign(Object.assign({},e),{vectorBucketName:this.vectorBucketName,indexName:this.indexName}))})}deleteVectors(e){const t=Object.create(null,{deleteVectors:{get:()=>super.deleteVectors}});return(0,s.__awaiter)(this,void 0,void 0,function*(){return t.deleteVectors.call(this,Object.assign(Object.assign({},e),{vectorBucketName:this.vectorBucketName,indexName:this.indexName}))})}}class Q extends S{constructor(e,t={},r,s){super(e,t,r,s)}from(e){return new b(this.url,this.headers,e,this.fetch)}get vectors(){return new J(this.url+"/vector",{headers:this.headers,fetch:this.fetch})}get analytics(){return new I(this.url+"/iceberg",this.headers,this.fetch)}}},166:(e,t,r)=>{r.r(t),r.d(t,{AuthAdminApi:()=>Ve,AuthApiError:()=>f,AuthClient:()=>We,AuthError:()=>h,AuthImplicitGrantRedirectError:()=>b,AuthInvalidCredentialsError:()=>m,AuthInvalidJwtError:()=>P,AuthInvalidTokenResponseError:()=>v,AuthPKCECodeVerifierMissingError:()=>S,AuthPKCEGrantCodeExchangeError:()=>k,AuthRetryableFetchError:()=>O,AuthSessionMissingError:()=>y,AuthUnknownError:()=>g,AuthWeakPasswordError:()=>R,CustomAuthError:()=>w,GoTrueAdminApi:()=>fe,GoTrueClient:()=>Ke,NavigatorLockAcquireTimeoutError:()=>ye,SIGN_OUT_SCOPES:()=>de,isAuthApiError:()=>p,isAuthError:()=>d,isAuthImplicitGrantRedirectError:()=>E,isAuthPKCECodeVerifierMissingError:()=>T,isAuthRetryableFetchError:()=>j,isAuthSessionMissingError:()=>_,isAuthWeakPasswordError:()=>A,lockInternals:()=>ge,navigatorLock:()=>ve,processLock:()=>be});var s=r(823);const n="2.87.3",i=3e4,o={"X-Client-Info":`gotrue-js/${n}`},a="X-Supabase-Api-Version",l=Date.parse("2024-01-01T00:00:00.0Z"),c="2024-01-01",u=/^([a-z0-9_-]{4})*($|[a-z0-9_-]{3}$|[a-z0-9_-]{2}$)$/i;class h extends Error{constructor(e,t,r){super(e),this.__isAuthError=!0,this.name="AuthError",this.status=t,this.code=r}}function d(e){return"object"==typeof e&&null!==e&&"__isAuthError"in e}class f extends h{constructor(e,t,r){super(e,t,r),this.name="AuthApiError",this.status=t,this.code=r}}function p(e){return d(e)&&"AuthApiError"===e.name}class g extends h{constructor(e,t){super(e),this.name="AuthUnknownError",this.originalError=t}}class w extends h{constructor(e,t,r,s){super(e,r,s),this.name=t,this.status=r}}class y extends w{constructor(){super("Auth session missing!","AuthSessionMissingError",400,void 0)}}function _(e){return d(e)&&"AuthSessionMissingError"===e.name}class v extends w{constructor(){super("Auth session or user missing","AuthInvalidTokenResponseError",500,void 0)}}class m extends w{constructor(e){super(e,"AuthInvalidCredentialsError",400,void 0)}}class b extends w{constructor(e,t=null){super(e,"AuthImplicitGrantRedirectError",500,void 0),this.details=null,this.details=t}toJSON(){return{name:this.name,message:this.message,status:this.status,details:this.details}}}function E(e){return d(e)&&"AuthImplicitGrantRedirectError"===e.name}class k extends w{constructor(e,t=null){super(e,"AuthPKCEGrantCodeExchangeError",500,void 0),this.details=null,this.details=t}toJSON(){return{name:this.name,message:this.message,status:this.status,details:this.details}}}class S extends w{constructor(){super("PKCE code verifier not found in storage. This can happen if the auth flow was initiated in a different browser or device, or if the storage was cleared. For SSR frameworks (Next.js, SvelteKit, etc.), use @supabase/ssr on both the server and client to store the code verifier in cookies.","AuthPKCECodeVerifierMissingError",400,"pkce_code_verifier_not_found")}}function T(e){return d(e)&&"AuthPKCECodeVerifierMissingError"===e.name}class O extends w{constructor(e,t){super(e,"AuthRetryableFetchError",t,void 0)}}function j(e){return d(e)&&"AuthRetryableFetchError"===e.name}class R extends w{constructor(e,t,r){super(e,"AuthWeakPasswordError",t,"weak_password"),this.reasons=r}}function A(e){return d(e)&&"AuthWeakPasswordError"===e.name}class P extends w{constructor(e){super(e,"AuthInvalidJwtError",400,"invalid_jwt")}}const I="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-_".split(""),C=" \t\n\r=".split(""),$=(()=>{const e=new Array(128);for(let t=0;t<e.length;t+=1)e[t]=-1;for(let t=0;t<C.length;t+=1)e[C[t].charCodeAt(0)]=-2;for(let t=0;t<I.length;t+=1)e[I[t].charCodeAt(0)]=t;return e})();function x(e,t,r){if(null!==e)for(t.queue=t.queue<<8|e,t.queuedBits+=8;t.queuedBits>=6;){const e=t.queue>>t.queuedBits-6&63;r(I[e]),t.queuedBits-=6}else if(t.queuedBits>0)for(t.queue=t.queue<<6-t.queuedBits,t.queuedBits=6;t.queuedBits>=6;){const e=t.queue>>t.queuedBits-6&63;r(I[e]),t.queuedBits-=6}}function N(e,t,r){const s=$[e];if(!(s>-1)){if(-2===s)return;throw new Error(`Invalid Base64-URL character "${String.fromCharCode(e)}"`)}for(t.queue=t.queue<<6|s,t.queuedBits+=6;t.queuedBits>=8;)r(t.queue>>t.queuedBits-8&255),t.queuedBits-=8}function U(e){const t=[],r=e=>{t.push(String.fromCodePoint(e))},s={utf8seq:0,codepoint:0},n={queue:0,queuedBits:0},i=e=>{!function(e,t,r){if(0===t.utf8seq){if(e<=127)return void r(e);for(let r=1;r<6;r+=1)if(!(e>>7-r&1)){t.utf8seq=r;break}if(2===t.utf8seq)t.codepoint=31&e;else if(3===t.utf8seq)t.codepoint=15&e;else{if(4!==t.utf8seq)throw new Error("Invalid UTF-8 sequence");t.codepoint=7&e}t.utf8seq-=1}else if(t.utf8seq>0){if(e<=127)throw new Error("Invalid UTF-8 sequence");t.codepoint=t.codepoint<<6|63&e,t.utf8seq-=1,0===t.utf8seq&&r(t.codepoint)}}(e,s,r)};for(let t=0;t<e.length;t+=1)N(e.charCodeAt(t),n,i);return t.join("")}function D(e,t){if(!(e<=127)){if(e<=2047)return t(192|e>>6),void t(128|63&e);if(e<=65535)return t(224|e>>12),t(128|e>>6&63),void t(128|63&e);if(e<=1114111)return t(240|e>>18),t(128|e>>12&63),t(128|e>>6&63),void t(128|63&e);throw new Error(`Unrecognized Unicode codepoint: ${e.toString(16)}`)}t(e)}function L(e){const t=[],r={queue:0,queuedBits:0},s=e=>{t.push(e)};for(let t=0;t<e.length;t+=1)N(e.charCodeAt(t),r,s);return new Uint8Array(t)}function B(e){const t=[],r={queue:0,queuedBits:0},s=e=>{t.push(e)};return e.forEach(e=>x(e,r,s)),x(null,r,s),t.join("")}const q=()=>"undefined"!=typeof window&&"undefined"!=typeof document,F={tested:!1,writable:!1},M=()=>{if(!q())return!1;try{if("object"!=typeof globalThis.localStorage)return!1}catch(e){return!1}if(F.tested)return F.writable;const e=`lswt-${Math.random()}${Math.random()}`;try{globalThis.localStorage.setItem(e,e),globalThis.localStorage.removeItem(e),F.tested=!0,F.writable=!0}catch(e){F.tested=!0,F.writable=!1}return F.writable},K=e=>e?(...t)=>e(...t):(...e)=>fetch(...e),V=async(e,t,r)=>{await e.setItem(t,JSON.stringify(r))},W=async(e,t)=>{const r=await e.getItem(t);if(!r)return null;try{return JSON.parse(r)}catch(e){return r}},G=async(e,t)=>{await e.removeItem(t)};class H{constructor(){this.promise=new H.promiseConstructor((e,t)=>{this.resolve=e,this.reject=t})}}function J(e){const t=e.split(".");if(3!==t.length)throw new P("Invalid JWT structure");for(let e=0;e<t.length;e++)if(!u.test(t[e]))throw new P("JWT not in base64url format");return{header:JSON.parse(U(t[0])),payload:JSON.parse(U(t[1])),signature:L(t[2]),raw:{header:t[0],payload:t[1]}}}function z(e){return("0"+e.toString(16)).substr(-2)}async function Y(e,t,r=!1){const s=function(){const e=new Uint32Array(56);if("undefined"==typeof crypto){const e="ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789-._~",t=e.length;let r="";for(let s=0;s<56;s++)r+=e.charAt(Math.floor(Math.random()*t));return r}return crypto.getRandomValues(e),Array.from(e,z).join("")}();let n=s;r&&(n+="/PASSWORD_RECOVERY"),await V(e,`${t}-code-verifier`,n);const i=await async function(e){if("undefined"==typeof crypto||void 0===crypto.subtle||"undefined"==typeof TextEncoder)return console.warn("WebCrypto API is not supported. Code challenge method will default to use plain instead of sha256."),e;const t=await async function(e){const t=(new TextEncoder).encode(e),r=await crypto.subtle.digest("SHA-256",t),s=new Uint8Array(r);return Array.from(s).map(e=>String.fromCharCode(e)).join("")}(e);return btoa(t).replace(/\+/g,"-").replace(/\//g,"_").replace(/=+$/,"")}(s);return[i,s===i?"plain":"s256"]}H.promiseConstructor=Promise;const Q=/^2[0-9]{3}-(0[1-9]|1[0-2])-(0[1-9]|1[0-9]|2[0-9]|3[0-1])$/i,X=/^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/;function Z(e){if(!X.test(e))throw new Error("@supabase/auth-js: Expected parameter to be UUID but is not")}function ee(){return new Proxy({},{get:(e,t)=>{if("__isUserNotAvailableProxy"===t)return!0;if("symbol"==typeof t){const e=t.toString();if("Symbol(Symbol.toPrimitive)"===e||"Symbol(Symbol.toStringTag)"===e||"Symbol(util.inspect.custom)"===e)return}throw new Error(`@supabase/auth-js: client was created with userStorage option and there was no user stored in the user storage. Accessing the "${t}" property of the session object is not supported. Please use getUser() instead.`)},set:(e,t)=>{throw new Error(`@supabase/auth-js: client was created with userStorage option and there was no user stored in the user storage. Setting the "${t}" property of the session object is not supported. Please use getUser() to fetch a user object you can manipulate.`)},deleteProperty:(e,t)=>{throw new Error(`@supabase/auth-js: client was created with userStorage option and there was no user stored in the user storage. Deleting the "${t}" property of the session object is not supported. Please use getUser() to fetch a user object you can manipulate.`)}})}function te(e){return JSON.parse(JSON.stringify(e))}const re=e=>e.msg||e.message||e.error_description||e.error||JSON.stringify(e),se=[502,503,504];async function ne(e){var t,r;if(!("object"==typeof(r=e)&&null!==r&&"status"in r&&"ok"in r&&"json"in r&&"function"==typeof r.json))throw new O(re(e),0);if(se.includes(e.status))throw new O(re(e),e.status);let s,n;try{s=await e.json()}catch(e){throw new g(re(e),e)}const i=function(e){const t=e.headers.get(a);if(!t)return null;if(!t.match(Q))return null;try{return new Date(`${t}T00:00:00.0Z`)}catch(e){return null}}(e);if(i&&i.getTime()>=l&&"object"==typeof s&&s&&"string"==typeof s.code?n=s.code:"object"==typeof s&&s&&"string"==typeof s.error_code&&(n=s.error_code),n){if("weak_password"===n)throw new R(re(s),e.status,(null===(t=s.weak_password)||void 0===t?void 0:t.reasons)||[]);if("session_not_found"===n)throw new y}else if("object"==typeof s&&s&&"object"==typeof s.weak_password&&s.weak_password&&Array.isArray(s.weak_password.reasons)&&s.weak_password.reasons.length&&s.weak_password.reasons.reduce((e,t)=>e&&"string"==typeof t,!0))throw new R(re(s),e.status,s.weak_password.reasons);throw new f(re(s),e.status||500,n)}async function ie(e,t,r,s){var n;const i=Object.assign({},null==s?void 0:s.headers);i[a]||(i[a]=c),(null==s?void 0:s.jwt)&&(i.Authorization=`Bearer ${s.jwt}`);const o=null!==(n=null==s?void 0:s.query)&&void 0!==n?n:{};(null==s?void 0:s.redirectTo)&&(o.redirect_to=s.redirectTo);const l=Object.keys(o).length?"?"+new URLSearchParams(o).toString():"",u=await async function(e,t,r,s,n,i){const o=((e,t,r,s)=>{const n={method:e,headers:(null==t?void 0:t.headers)||{}};return"GET"===e?n:(n.headers=Object.assign({"Content-Type":"application/json;charset=UTF-8"},null==t?void 0:t.headers),n.body=JSON.stringify(s),Object.assign(Object.assign({},n),r))})(t,s,{},i);let a;try{a=await e(r,Object.assign({},o))}catch(e){throw console.error(e),new O(re(e),0)}if(a.ok||await ne(a),null==s?void 0:s.noResolveJson)return a;try{return await a.json()}catch(e){await ne(e)}}(e,t,r+l,{headers:i,noResolveJson:null==s?void 0:s.noResolveJson},0,null==s?void 0:s.body);return(null==s?void 0:s.xform)?null==s?void 0:s.xform(u):{data:Object.assign({},u),error:null}}function oe(e){var t;let r=null;var s;return function(e){return e.access_token&&e.refresh_token&&e.expires_in}(e)&&(r=Object.assign({},e),e.expires_at||(r.expires_at=(s=e.expires_in,Math.round(Date.now()/1e3)+s))),{data:{session:r,user:null!==(t=e.user)&&void 0!==t?t:e},error:null}}function ae(e){const t=oe(e);return!t.error&&e.weak_password&&"object"==typeof e.weak_password&&Array.isArray(e.weak_password.reasons)&&e.weak_password.reasons.length&&e.weak_password.message&&"string"==typeof e.weak_password.message&&e.weak_password.reasons.reduce((e,t)=>e&&"string"==typeof t,!0)&&(t.data.weak_password=e.weak_password),t}function le(e){var t;return{data:{user:null!==(t=e.user)&&void 0!==t?t:e},error:null}}function ce(e){return{data:e,error:null}}function ue(e){const{action_link:t,email_otp:r,hashed_token:n,redirect_to:i,verification_type:o}=e,a=(0,s.__rest)(e,["action_link","email_otp","hashed_token","redirect_to","verification_type"]);return{data:{properties:{action_link:t,email_otp:r,hashed_token:n,redirect_to:i,verification_type:o},user:Object.assign({},a)},error:null}}function he(e){return e}const de=["global","local","others"];class fe{constructor({url:e="",headers:t={},fetch:r}){this.url=e,this.headers=t,this.fetch=K(r),this.mfa={listFactors:this._listFactors.bind(this),deleteFactor:this._deleteFactor.bind(this)},this.oauth={listClients:this._listOAuthClients.bind(this),createClient:this._createOAuthClient.bind(this),getClient:this._getOAuthClient.bind(this),updateClient:this._updateOAuthClient.bind(this),deleteClient:this._deleteOAuthClient.bind(this),regenerateClientSecret:this._regenerateOAuthClientSecret.bind(this)}}async signOut(e,t=de[0]){if(de.indexOf(t)<0)throw new Error(`@supabase/auth-js: Parameter scope must be one of ${de.join(", ")}`);try{return await ie(this.fetch,"POST",`${this.url}/logout?scope=${t}`,{headers:this.headers,jwt:e,noResolveJson:!0}),{data:null,error:null}}catch(e){if(d(e))return{data:null,error:e};throw e}}async inviteUserByEmail(e,t={}){try{return await ie(this.fetch,"POST",`${this.url}/invite`,{body:{email:e,data:t.data},headers:this.headers,redirectTo:t.redirectTo,xform:le})}catch(e){if(d(e))return{data:{user:null},error:e};throw e}}async generateLink(e){try{const{options:t}=e,r=(0,s.__rest)(e,["options"]),n=Object.assign(Object.assign({},r),t);return"newEmail"in r&&(n.new_email=null==r?void 0:r.newEmail,delete n.newEmail),await ie(this.fetch,"POST",`${this.url}/admin/generate_link`,{body:n,headers:this.headers,xform:ue,redirectTo:null==t?void 0:t.redirectTo})}catch(e){if(d(e))return{data:{properties:null,user:null},error:e};throw e}}async createUser(e){try{return await ie(this.fetch,"POST",`${this.url}/admin/users`,{body:e,headers:this.headers,xform:le})}catch(e){if(d(e))return{data:{user:null},error:e};throw e}}async listUsers(e){var t,r,s,n,i,o,a;try{const l={nextPage:null,lastPage:0,total:0},c=await ie(this.fetch,"GET",`${this.url}/admin/users`,{headers:this.headers,noResolveJson:!0,query:{page:null!==(r=null===(t=null==e?void 0:e.page)||void 0===t?void 0:t.toString())&&void 0!==r?r:"",per_page:null!==(n=null===(s=null==e?void 0:e.perPage)||void 0===s?void 0:s.toString())&&void 0!==n?n:""},xform:he});if(c.error)throw c.error;const u=await c.json(),h=null!==(i=c.headers.get("x-total-count"))&&void 0!==i?i:0,d=null!==(a=null===(o=c.headers.get("link"))||void 0===o?void 0:o.split(","))&&void 0!==a?a:[];return d.length>0&&(d.forEach(e=>{const t=parseInt(e.split(";")[0].split("=")[1].substring(0,1)),r=JSON.parse(e.split(";")[1].split("=")[1]);l[`${r}Page`]=t}),l.total=parseInt(h)),{data:Object.assign(Object.assign({},u),l),error:null}}catch(e){if(d(e))return{data:{users:[]},error:e};throw e}}async getUserById(e){Z(e);try{return await ie(this.fetch,"GET",`${this.url}/admin/users/${e}`,{headers:this.headers,xform:le})}catch(e){if(d(e))return{data:{user:null},error:e};throw e}}async updateUserById(e,t){Z(e);try{return await ie(this.fetch,"PUT",`${this.url}/admin/users/${e}`,{body:t,headers:this.headers,xform:le})}catch(e){if(d(e))return{data:{user:null},error:e};throw e}}async deleteUser(e,t=!1){Z(e);try{return await ie(this.fetch,"DELETE",`${this.url}/admin/users/${e}`,{headers:this.headers,body:{should_soft_delete:t},xform:le})}catch(e){if(d(e))return{data:{user:null},error:e};throw e}}async _listFactors(e){Z(e.userId);try{const{data:t,error:r}=await ie(this.fetch,"GET",`${this.url}/admin/users/${e.userId}/factors`,{headers:this.headers,xform:e=>({data:{factors:e},error:null})});return{data:t,error:r}}catch(e){if(d(e))return{data:null,error:e};throw e}}async _deleteFactor(e){Z(e.userId),Z(e.id);try{return{data:await ie(this.fetch,"DELETE",`${this.url}/admin/users/${e.userId}/factors/${e.id}`,{headers:this.headers}),error:null}}catch(e){if(d(e))return{data:null,error:e};throw e}}async _listOAuthClients(e){var t,r,s,n,i,o,a;try{const l={nextPage:null,lastPage:0,total:0},c=await ie(this.fetch,"GET",`${this.url}/admin/oauth/clients`,{headers:this.headers,noResolveJson:!0,query:{page:null!==(r=null===(t=null==e?void 0:e.page)||void 0===t?void 0:t.toString())&&void 0!==r?r:"",per_page:null!==(n=null===(s=null==e?void 0:e.perPage)||void 0===s?void 0:s.toString())&&void 0!==n?n:""},xform:he});if(c.error)throw c.error;const u=await c.json(),h=null!==(i=c.headers.get("x-total-count"))&&void 0!==i?i:0,d=null!==(a=null===(o=c.headers.get("link"))||void 0===o?void 0:o.split(","))&&void 0!==a?a:[];return d.length>0&&(d.forEach(e=>{const t=parseInt(e.split(";")[0].split("=")[1].substring(0,1)),r=JSON.parse(e.split(";")[1].split("=")[1]);l[`${r}Page`]=t}),l.total=parseInt(h)),{data:Object.assign(Object.assign({},u),l),error:null}}catch(e){if(d(e))return{data:{clients:[]},error:e};throw e}}async _createOAuthClient(e){try{return await ie(this.fetch,"POST",`${this.url}/admin/oauth/clients`,{body:e,headers:this.headers,xform:e=>({data:e,error:null})})}catch(e){if(d(e))return{data:null,error:e};throw e}}async _getOAuthClient(e){try{return await ie(this.fetch,"GET",`${this.url}/admin/oauth/clients/${e}`,{headers:this.headers,xform:e=>({data:e,error:null})})}catch(e){if(d(e))return{data:null,error:e};throw e}}async _updateOAuthClient(e,t){try{return await ie(this.fetch,"PUT",`${this.url}/admin/oauth/clients/${e}`,{body:t,headers:this.headers,xform:e=>({data:e,error:null})})}catch(e){if(d(e))return{data:null,error:e};throw e}}async _deleteOAuthClient(e){try{return await ie(this.fetch,"DELETE",`${this.url}/admin/oauth/clients/${e}`,{headers:this.headers,noResolveJson:!0}),{data:null,error:null}}catch(e){if(d(e))return{data:null,error:e};throw e}}async _regenerateOAuthClientSecret(e){try{return await ie(this.fetch,"POST",`${this.url}/admin/oauth/clients/${e}/regenerate_secret`,{headers:this.headers,xform:e=>({data:e,error:null})})}catch(e){if(d(e))return{data:null,error:e};throw e}}}function pe(e={}){return{getItem:t=>e[t]||null,setItem:(t,r)=>{e[t]=r},removeItem:t=>{delete e[t]}}}const ge={debug:!!(globalThis&&M()&&globalThis.localStorage&&"true"===globalThis.localStorage.getItem("supabase.gotrue-js.locks.debug"))};class we extends Error{constructor(e){super(e),this.isAcquireTimeout=!0}}class ye extends we{}class _e extends we{}async function ve(e,t,r){ge.debug&&console.log("@supabase/gotrue-js: navigatorLock: acquire lock",e,t);const s=new globalThis.AbortController;return t>0&&setTimeout(()=>{s.abort(),ge.debug&&console.log("@supabase/gotrue-js: navigatorLock acquire timed out",e)},t),await Promise.resolve().then(()=>globalThis.navigator.locks.request(e,0===t?{mode:"exclusive",ifAvailable:!0}:{mode:"exclusive",signal:s.signal},async s=>{if(!s){if(0===t)throw ge.debug&&console.log("@supabase/gotrue-js: navigatorLock: not immediately available",e),new ye(`Acquiring an exclusive Navigator LockManager lock "${e}" immediately failed`);if(ge.debug)try{const e=await globalThis.navigator.locks.query();console.log("@supabase/gotrue-js: Navigator LockManager state",JSON.stringify(e,null,"  "))}catch(e){console.warn("@supabase/gotrue-js: Error when querying Navigator LockManager state",e)}return console.warn("@supabase/gotrue-js: Navigator LockManager returned a null lock when using #request without ifAvailable set to true, it appears this browser is not following the LockManager spec https://developer.mozilla.org/en-US/docs/Web/API/LockManager/request"),await r()}ge.debug&&console.log("@supabase/gotrue-js: navigatorLock: acquired",e,s.name);try{return await r()}finally{ge.debug&&console.log("@supabase/gotrue-js: navigatorLock: released",e,s.name)}}))}const me={};async function be(e,t,r){var s;const n=null!==(s=me[e])&&void 0!==s?s:Promise.resolve(),i=Promise.race([n.catch(()=>null),t>=0?new Promise((r,s)=>{setTimeout(()=>{s(new _e(`Acquiring process lock with name "${e}" timed out`))},t)}):null].filter(e=>e)).catch(e=>{if(e&&e.isAcquireTimeout)throw e;return null}).then(async()=>await r());return me[e]=i.catch(async e=>{if(e&&e.isAcquireTimeout)return await n,null;throw e}),await i}function Ee(e){if(!/^0x[a-fA-F0-9]{40}$/.test(e))throw new Error(`@supabase/auth-js: Address "${e}" is invalid.`);return e.toLowerCase()}function ke(e){const t=(new TextEncoder).encode(e);return"0x"+Array.from(t,e=>e.toString(16).padStart(2,"0")).join("")}class Se extends Error{constructor({message:e,code:t,cause:r,name:s}){var n;super(e,{cause:r}),this.__isWebAuthnError=!0,this.name=null!==(n=null!=s?s:r instanceof Error?r.name:void 0)&&void 0!==n?n:"Unknown Error",this.code=t}}class Te extends Se{constructor(e,t){super({code:"ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY",cause:t,message:e}),this.name="WebAuthnUnknownError",this.originalError=t}}function Oe({error:e,options:t}){var r,s,n;const{publicKey:i}=t;if(!i)throw Error("options was missing required publicKey property");if("AbortError"===e.name){if(t.signal instanceof AbortSignal)return new Se({message:"Registration ceremony was sent an abort signal",code:"ERROR_CEREMONY_ABORTED",cause:e})}else if("ConstraintError"===e.name){if(!0===(null===(r=i.authenticatorSelection)||void 0===r?void 0:r.requireResidentKey))return new Se({message:"Discoverable credentials were required but no available authenticator supported it",code:"ERROR_AUTHENTICATOR_MISSING_DISCOVERABLE_CREDENTIAL_SUPPORT",cause:e});if("conditional"===t.mediation&&"required"===(null===(s=i.authenticatorSelection)||void 0===s?void 0:s.userVerification))return new Se({message:"User verification was required during automatic registration but it could not be performed",code:"ERROR_AUTO_REGISTER_USER_VERIFICATION_FAILURE",cause:e});if("required"===(null===(n=i.authenticatorSelection)||void 0===n?void 0:n.userVerification))return new Se({message:"User verification was required but no available authenticator supported it",code:"ERROR_AUTHENTICATOR_MISSING_USER_VERIFICATION_SUPPORT",cause:e})}else{if("InvalidStateError"===e.name)return new Se({message:"The authenticator was previously registered",code:"ERROR_AUTHENTICATOR_PREVIOUSLY_REGISTERED",cause:e});if("NotAllowedError"===e.name)return new Se({message:e.message,code:"ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY",cause:e});if("NotSupportedError"===e.name)return 0===i.pubKeyCredParams.filter(e=>"public-key"===e.type).length?new Se({message:'No entry in pubKeyCredParams was of type "public-key"',code:"ERROR_MALFORMED_PUBKEYCREDPARAMS",cause:e}):new Se({message:"No available authenticator supported any of the specified pubKeyCredParams algorithms",code:"ERROR_AUTHENTICATOR_NO_SUPPORTED_PUBKEYCREDPARAMS_ALG",cause:e});if("SecurityError"===e.name){const t=window.location.hostname;if(!$e(t))return new Se({message:`${window.location.hostname} is an invalid domain`,code:"ERROR_INVALID_DOMAIN",cause:e});if(i.rp.id!==t)return new Se({message:`The RP ID "${i.rp.id}" is invalid for this domain`,code:"ERROR_INVALID_RP_ID",cause:e})}else if("TypeError"===e.name){if(i.user.id.byteLength<1||i.user.id.byteLength>64)return new Se({message:"User ID was not between 1 and 64 characters",code:"ERROR_INVALID_USER_ID_LENGTH",cause:e})}else if("UnknownError"===e.name)return new Se({message:"The authenticator was unable to process the specified options, or could not create a new credential",code:"ERROR_AUTHENTICATOR_GENERAL_ERROR",cause:e})}return new Se({message:"a Non-Webauthn related error has occurred",code:"ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY",cause:e})}function je({error:e,options:t}){const{publicKey:r}=t;if(!r)throw Error("options was missing required publicKey property");if("AbortError"===e.name){if(t.signal instanceof AbortSignal)return new Se({message:"Authentication ceremony was sent an abort signal",code:"ERROR_CEREMONY_ABORTED",cause:e})}else{if("NotAllowedError"===e.name)return new Se({message:e.message,code:"ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY",cause:e});if("SecurityError"===e.name){const t=window.location.hostname;if(!$e(t))return new Se({message:`${window.location.hostname} is an invalid domain`,code:"ERROR_INVALID_DOMAIN",cause:e});if(r.rpId!==t)return new Se({message:`The RP ID "${r.rpId}" is invalid for this domain`,code:"ERROR_INVALID_RP_ID",cause:e})}else if("UnknownError"===e.name)return new Se({message:"The authenticator was unable to process the specified options, or could not create a new assertion signature",code:"ERROR_AUTHENTICATOR_GENERAL_ERROR",cause:e})}return new Se({message:"a Non-Webauthn related error has occurred",code:"ERROR_PASSTHROUGH_SEE_CAUSE_PROPERTY",cause:e})}const Re=new class{createNewAbortSignal(){if(this.controller){const e=new Error("Cancelling existing WebAuthn API call for new one");e.name="AbortError",this.controller.abort(e)}const e=new AbortController;return this.controller=e,e.signal}cancelCeremony(){if(this.controller){const e=new Error("Manually cancelling existing WebAuthn API call");e.name="AbortError",this.controller.abort(e),this.controller=void 0}}};function Ae(e){if(!e)throw new Error("Credential creation options are required");if("undefined"!=typeof PublicKeyCredential&&"parseCreationOptionsFromJSON"in PublicKeyCredential&&"function"==typeof PublicKeyCredential.parseCreationOptionsFromJSON)return PublicKeyCredential.parseCreationOptionsFromJSON(e);const{challenge:t,user:r,excludeCredentials:n}=e,i=(0,s.__rest)(e,["challenge","user","excludeCredentials"]),o=L(t).buffer,a=Object.assign(Object.assign({},r),{id:L(r.id).buffer}),l=Object.assign(Object.assign({},i),{challenge:o,user:a});if(n&&n.length>0){l.excludeCredentials=new Array(n.length);for(let e=0;e<n.length;e++){const t=n[e];l.excludeCredentials[e]=Object.assign(Object.assign({},t),{id:L(t.id).buffer,type:t.type||"public-key",transports:t.transports})}}return l}function Pe(e){if(!e)throw new Error("Credential request options are required");if("undefined"!=typeof PublicKeyCredential&&"parseRequestOptionsFromJSON"in PublicKeyCredential&&"function"==typeof PublicKeyCredential.parseRequestOptionsFromJSON)return PublicKeyCredential.parseRequestOptionsFromJSON(e);const{challenge:t,allowCredentials:r}=e,n=(0,s.__rest)(e,["challenge","allowCredentials"]),i=L(t).buffer,o=Object.assign(Object.assign({},n),{challenge:i});if(r&&r.length>0){o.allowCredentials=new Array(r.length);for(let e=0;e<r.length;e++){const t=r[e];o.allowCredentials[e]=Object.assign(Object.assign({},t),{id:L(t.id).buffer,type:t.type||"public-key",transports:t.transports})}}return o}function Ie(e){var t;if("toJSON"in e&&"function"==typeof e.toJSON)return e.toJSON();const r=e;return{id:e.id,rawId:e.id,response:{attestationObject:B(new Uint8Array(e.response.attestationObject)),clientDataJSON:B(new Uint8Array(e.response.clientDataJSON))},type:"public-key",clientExtensionResults:e.getClientExtensionResults(),authenticatorAttachment:null!==(t=r.authenticatorAttachment)&&void 0!==t?t:void 0}}function Ce(e){var t;if("toJSON"in e&&"function"==typeof e.toJSON)return e.toJSON();const r=e,s=e.getClientExtensionResults(),n=e.response;return{id:e.id,rawId:e.id,response:{authenticatorData:B(new Uint8Array(n.authenticatorData)),clientDataJSON:B(new Uint8Array(n.clientDataJSON)),signature:B(new Uint8Array(n.signature)),userHandle:n.userHandle?B(new Uint8Array(n.userHandle)):void 0},type:"public-key",clientExtensionResults:s,authenticatorAttachment:null!==(t=r.authenticatorAttachment)&&void 0!==t?t:void 0}}function $e(e){return"localhost"===e||/^([a-z0-9]+(-[a-z0-9]+)*\.)+[a-z]{2,}$/i.test(e)}function xe(){var e,t;return!!(q()&&"PublicKeyCredential"in window&&window.PublicKeyCredential&&"credentials"in navigator&&"function"==typeof(null===(e=null===navigator||void 0===navigator?void 0:navigator.credentials)||void 0===e?void 0:e.create)&&"function"==typeof(null===(t=null===navigator||void 0===navigator?void 0:navigator.credentials)||void 0===t?void 0:t.get))}const Ne={hints:["security-key"],authenticatorSelection:{authenticatorAttachment:"cross-platform",requireResidentKey:!1,userVerification:"preferred",residentKey:"discouraged"},attestation:"direct"},Ue={userVerification:"preferred",hints:["security-key"],attestation:"direct"};function De(...e){const t=e=>null!==e&&"object"==typeof e&&!Array.isArray(e),r=e=>e instanceof ArrayBuffer||ArrayBuffer.isView(e),s={};for(const n of e)if(n)for(const e in n){const i=n[e];if(void 0!==i)if(Array.isArray(i))s[e]=i;else if(r(i))s[e]=i;else if(t(i)){const r=s[e];t(r)?s[e]=De(r,i):s[e]=De(i)}else s[e]=i}return s}class Le{constructor(e){this.client=e,this.enroll=this._enroll.bind(this),this.challenge=this._challenge.bind(this),this.verify=this._verify.bind(this),this.authenticate=this._authenticate.bind(this),this.register=this._register.bind(this)}async _enroll(e){return this.client.mfa.enroll(Object.assign(Object.assign({},e),{factorType:"webauthn"}))}async _challenge({factorId:e,webauthn:t,friendlyName:r,signal:s},n){try{const{data:i,error:o}=await this.client.mfa.challenge({factorId:e,webauthn:t});if(!i)return{data:null,error:o};const a=null!=s?s:Re.createNewAbortSignal();if("create"===i.webauthn.type){const{user:e}=i.webauthn.credential_options.publicKey;e.name||(e.name=`${e.id}:${r}`),e.displayName||(e.displayName=e.name)}switch(i.webauthn.type){case"create":{const t=function(e,t){return De(Ne,e,t||{})}(i.webauthn.credential_options.publicKey,null==n?void 0:n.create),{data:r,error:s}=await async function(e){try{const t=await navigator.credentials.create(e);return t?t instanceof PublicKeyCredential?{data:t,error:null}:{data:null,error:new Te("Browser returned unexpected credential type",t)}:{data:null,error:new Te("Empty credential response",t)}}catch(t){return{data:null,error:Oe({error:t,options:e})}}}({publicKey:t,signal:a});return r?{data:{factorId:e,challengeId:i.id,webauthn:{type:i.webauthn.type,credential_response:r}},error:null}:{data:null,error:s}}case"request":{const t=function(e,t){return De(Ue,e,t||{})}(i.webauthn.credential_options.publicKey,null==n?void 0:n.request),{data:r,error:s}=await async function(e){try{const t=await navigator.credentials.get(e);return t?t instanceof PublicKeyCredential?{data:t,error:null}:{data:null,error:new Te("Browser returned unexpected credential type",t)}:{data:null,error:new Te("Empty credential response",t)}}catch(t){return{data:null,error:je({error:t,options:e})}}}(Object.assign(Object.assign({},i.webauthn.credential_options),{publicKey:t,signal:a}));return r?{data:{factorId:e,challengeId:i.id,webauthn:{type:i.webauthn.type,credential_response:r}},error:null}:{data:null,error:s}}}}catch(e){return d(e)?{data:null,error:e}:{data:null,error:new g("Unexpected error in challenge",e)}}}async _verify({challengeId:e,factorId:t,webauthn:r}){return this.client.mfa.verify({factorId:t,challengeId:e,webauthn:r})}async _authenticate({factorId:e,webauthn:{rpId:t=("undefined"!=typeof window?window.location.hostname:void 0),rpOrigins:r=("undefined"!=typeof window?[window.location.origin]:void 0),signal:s}={}},n){if(!t)return{data:null,error:new h("rpId is required for WebAuthn authentication")};try{if(!xe())return{data:null,error:new g("Browser does not support WebAuthn",null)};const{data:i,error:o}=await this.challenge({factorId:e,webauthn:{rpId:t,rpOrigins:r},signal:s},{request:n});if(!i)return{data:null,error:o};const{webauthn:a}=i;return this._verify({factorId:e,challengeId:i.challengeId,webauthn:{type:a.type,rpId:t,rpOrigins:r,credential_response:a.credential_response}})}catch(e){return d(e)?{data:null,error:e}:{data:null,error:new g("Unexpected error in authenticate",e)}}}async _register({friendlyName:e,webauthn:{rpId:t=("undefined"!=typeof window?window.location.hostname:void 0),rpOrigins:r=("undefined"!=typeof window?[window.location.origin]:void 0),signal:s}={}},n){if(!t)return{data:null,error:new h("rpId is required for WebAuthn registration")};try{if(!xe())return{data:null,error:new g("Browser does not support WebAuthn",null)};const{data:i,error:o}=await this._enroll({friendlyName:e});if(!i)return await this.client.mfa.listFactors().then(t=>{var r;return null===(r=t.data)||void 0===r?void 0:r.all.find(t=>"webauthn"===t.factor_type&&t.friendly_name===e&&"unverified"!==t.status)}).then(e=>e?this.client.mfa.unenroll({factorId:null==e?void 0:e.id}):void 0),{data:null,error:o};const{data:a,error:l}=await this._challenge({factorId:i.id,friendlyName:i.friendly_name,webauthn:{rpId:t,rpOrigins:r},signal:s},{create:n});return a?this._verify({factorId:i.id,challengeId:a.challengeId,webauthn:{rpId:t,rpOrigins:r,type:a.webauthn.type,credential_response:a.webauthn.credential_response}}):{data:null,error:l}}catch(e){return d(e)?{data:null,error:e}:{data:null,error:new g("Unexpected error in register",e)}}}}!function(){if("object"!=typeof globalThis)try{Object.defineProperty(Object.prototype,"__magic__",{get:function(){return this},configurable:!0}),__magic__.globalThis=__magic__,delete Object.prototype.__magic__}catch(e){"undefined"!=typeof self&&(self.globalThis=self)}}();const Be={url:"http://localhost:9999",storageKey:"supabase.auth.token",autoRefreshToken:!0,persistSession:!0,detectSessionInUrl:!0,headers:o,flowType:"implicit",debug:!1,hasCustomAuthorizationHeader:!1,throwOnError:!1};async function qe(e,t,r){return await r()}const Fe={};class Me{get jwks(){var e,t;return null!==(t=null===(e=Fe[this.storageKey])||void 0===e?void 0:e.jwks)&&void 0!==t?t:{keys:[]}}set jwks(e){Fe[this.storageKey]=Object.assign(Object.assign({},Fe[this.storageKey]),{jwks:e})}get jwks_cached_at(){var e,t;return null!==(t=null===(e=Fe[this.storageKey])||void 0===e?void 0:e.cachedAt)&&void 0!==t?t:Number.MIN_SAFE_INTEGER}set jwks_cached_at(e){Fe[this.storageKey]=Object.assign(Object.assign({},Fe[this.storageKey]),{cachedAt:e})}constructor(e){var t,r,s;this.userStorage=null,this.memoryStorage=null,this.stateChangeEmitters=new Map,this.autoRefreshTicker=null,this.visibilityChangedCallback=null,this.refreshingDeferred=null,this.initializePromise=null,this.detectSessionInUrl=!0,this.hasCustomAuthorizationHeader=!1,this.suppressGetSessionWarning=!1,this.lockAcquired=!1,this.pendingInLock=[],this.broadcastChannel=null,this.logger=console.log;const n=Object.assign(Object.assign({},Be),e);if(this.storageKey=n.storageKey,this.instanceID=null!==(t=Me.nextInstanceID[this.storageKey])&&void 0!==t?t:0,Me.nextInstanceID[this.storageKey]=this.instanceID+1,this.logDebugMessages=!!n.debug,"function"==typeof n.debug&&(this.logger=n.debug),this.instanceID>0&&q()){const e=`${this._logPrefix()} Multiple GoTrueClient instances detected in the same browser context. It is not an error, but this should be avoided as it may produce undefined behavior when used concurrently under the same storage key.`;console.warn(e),this.logDebugMessages&&console.trace(e)}if(this.persistSession=n.persistSession,this.autoRefreshToken=n.autoRefreshToken,this.admin=new fe({url:n.url,headers:n.headers,fetch:n.fetch}),this.url=n.url,this.headers=n.headers,this.fetch=K(n.fetch),this.lock=n.lock||qe,this.detectSessionInUrl=n.detectSessionInUrl,this.flowType=n.flowType,this.hasCustomAuthorizationHeader=n.hasCustomAuthorizationHeader,this.throwOnError=n.throwOnError,n.lock?this.lock=n.lock:this.persistSession&&q()&&(null===(r=null===globalThis||void 0===globalThis?void 0:globalThis.navigator)||void 0===r?void 0:r.locks)?this.lock=ve:this.lock=qe,this.jwks||(this.jwks={keys:[]},this.jwks_cached_at=Number.MIN_SAFE_INTEGER),this.mfa={verify:this._verify.bind(this),enroll:this._enroll.bind(this),unenroll:this._unenroll.bind(this),challenge:this._challenge.bind(this),listFactors:this._listFactors.bind(this),challengeAndVerify:this._challengeAndVerify.bind(this),getAuthenticatorAssuranceLevel:this._getAuthenticatorAssuranceLevel.bind(this),webauthn:new Le(this)},this.oauth={getAuthorizationDetails:this._getAuthorizationDetails.bind(this),approveAuthorization:this._approveAuthorization.bind(this),denyAuthorization:this._denyAuthorization.bind(this),listGrants:this._listOAuthGrants.bind(this),revokeGrant:this._revokeOAuthGrant.bind(this)},this.persistSession?(n.storage?this.storage=n.storage:M()?this.storage=globalThis.localStorage:(this.memoryStorage={},this.storage=pe(this.memoryStorage)),n.userStorage&&(this.userStorage=n.userStorage)):(this.memoryStorage={},this.storage=pe(this.memoryStorage)),q()&&globalThis.BroadcastChannel&&this.persistSession&&this.storageKey){try{this.broadcastChannel=new globalThis.BroadcastChannel(this.storageKey)}catch(e){console.error("Failed to create a new BroadcastChannel, multi-tab state changes will not be available",e)}null===(s=this.broadcastChannel)||void 0===s||s.addEventListener("message",async e=>{this._debug("received broadcast notification from other tab or client",e),await this._notifyAllSubscribers(e.data.event,e.data.session,!1)})}this.initialize()}isThrowOnErrorEnabled(){return this.throwOnError}_returnResult(e){if(this.throwOnError&&e&&e.error)throw e.error;return e}_logPrefix(){return`GoTrueClient@${this.storageKey}:${this.instanceID} (${n}) ${(new Date).toISOString()}`}_debug(...e){return this.logDebugMessages&&this.logger(this._logPrefix(),...e),this}async initialize(){return this.initializePromise||(this.initializePromise=(async()=>await this._acquireLock(-1,async()=>await this._initialize()))()),await this.initializePromise}async _initialize(){var e;try{let t={},r="none";if(q()&&(t=function(e){const t={},r=new URL(e);if(r.hash&&"#"===r.hash[0])try{new URLSearchParams(r.hash.substring(1)).forEach((e,r)=>{t[r]=e})}catch(e){}return r.searchParams.forEach((e,r)=>{t[r]=e}),t}(window.location.href),this._isImplicitGrantCallback(t)?r="implicit":await this._isPKCECallback(t)&&(r="pkce")),q()&&this.detectSessionInUrl&&"none"!==r){const{data:s,error:n}=await this._getSessionFromURL(t,r);if(n){if(this._debug("#_initialize()","error detecting session from URL",n),E(n)){const t=null===(e=n.details)||void 0===e?void 0:e.code;if("identity_already_exists"===t||"identity_not_found"===t||"single_identity_not_deletable"===t)return{error:n}}return await this._removeSession(),{error:n}}const{session:i,redirectType:o}=s;return this._debug("#_initialize()","detected session in URL",i,"redirect type",o),await this._saveSession(i),setTimeout(async()=>{"recovery"===o?await this._notifyAllSubscribers("PASSWORD_RECOVERY",i):await this._notifyAllSubscribers("SIGNED_IN",i)},0),{error:null}}return await this._recoverAndRefresh(),{error:null}}catch(e){return d(e)?this._returnResult({error:e}):this._returnResult({error:new g("Unexpected error during initialization",e)})}finally{await this._handleVisibilityChange(),this._debug("#_initialize()","end")}}async signInAnonymously(e){var t,r,s;try{const n=await ie(this.fetch,"POST",`${this.url}/signup`,{headers:this.headers,body:{data:null!==(r=null===(t=null==e?void 0:e.options)||void 0===t?void 0:t.data)&&void 0!==r?r:{},gotrue_meta_security:{captcha_token:null===(s=null==e?void 0:e.options)||void 0===s?void 0:s.captchaToken}},xform:oe}),{data:i,error:o}=n;if(o||!i)return this._returnResult({data:{user:null,session:null},error:o});const a=i.session,l=i.user;return i.session&&(await this._saveSession(i.session),await this._notifyAllSubscribers("SIGNED_IN",a)),this._returnResult({data:{user:l,session:a},error:null})}catch(e){if(d(e))return this._returnResult({data:{user:null,session:null},error:e});throw e}}async signUp(e){var t,r,s;try{let n;if("email"in e){const{email:r,password:s,options:i}=e;let o=null,a=null;"pkce"===this.flowType&&([o,a]=await Y(this.storage,this.storageKey)),n=await ie(this.fetch,"POST",`${this.url}/signup`,{headers:this.headers,redirectTo:null==i?void 0:i.emailRedirectTo,body:{email:r,password:s,data:null!==(t=null==i?void 0:i.data)&&void 0!==t?t:{},gotrue_meta_security:{captcha_token:null==i?void 0:i.captchaToken},code_challenge:o,code_challenge_method:a},xform:oe})}else{if(!("phone"in e))throw new m("You must provide either an email or phone number and a password");{const{phone:t,password:i,options:o}=e;n=await ie(this.fetch,"POST",`${this.url}/signup`,{headers:this.headers,body:{phone:t,password:i,data:null!==(r=null==o?void 0:o.data)&&void 0!==r?r:{},channel:null!==(s=null==o?void 0:o.channel)&&void 0!==s?s:"sms",gotrue_meta_security:{captcha_token:null==o?void 0:o.captchaToken}},xform:oe})}}const{data:i,error:o}=n;if(o||!i)return await G(this.storage,`${this.storageKey}-code-verifier`),this._returnResult({data:{user:null,session:null},error:o});const a=i.session,l=i.user;return i.session&&(await this._saveSession(i.session),await this._notifyAllSubscribers("SIGNED_IN",a)),this._returnResult({data:{user:l,session:a},error:null})}catch(e){if(await G(this.storage,`${this.storageKey}-code-verifier`),d(e))return this._returnResult({data:{user:null,session:null},error:e});throw e}}async signInWithPassword(e){try{let t;if("email"in e){const{email:r,password:s,options:n}=e;t=await ie(this.fetch,"POST",`${this.url}/token?grant_type=password`,{headers:this.headers,body:{email:r,password:s,gotrue_meta_security:{captcha_token:null==n?void 0:n.captchaToken}},xform:ae})}else{if(!("phone"in e))throw new m("You must provide either an email or phone number and a password");{const{phone:r,password:s,options:n}=e;t=await ie(this.fetch,"POST",`${this.url}/token?grant_type=password`,{headers:this.headers,body:{phone:r,password:s,gotrue_meta_security:{captcha_token:null==n?void 0:n.captchaToken}},xform:ae})}}const{data:r,error:s}=t;if(s)return this._returnResult({data:{user:null,session:null},error:s});if(!r||!r.session||!r.user){const e=new v;return this._returnResult({data:{user:null,session:null},error:e})}return r.session&&(await this._saveSession(r.session),await this._notifyAllSubscribers("SIGNED_IN",r.session)),this._returnResult({data:Object.assign({user:r.user,session:r.session},r.weak_password?{weakPassword:r.weak_password}:null),error:s})}catch(e){if(d(e))return this._returnResult({data:{user:null,session:null},error:e});throw e}}async signInWithOAuth(e){var t,r,s,n;return await this._handleProviderSignIn(e.provider,{redirectTo:null===(t=e.options)||void 0===t?void 0:t.redirectTo,scopes:null===(r=e.options)||void 0===r?void 0:r.scopes,queryParams:null===(s=e.options)||void 0===s?void 0:s.queryParams,skipBrowserRedirect:null===(n=e.options)||void 0===n?void 0:n.skipBrowserRedirect})}async exchangeCodeForSession(e){return await this.initializePromise,this._acquireLock(-1,async()=>this._exchangeCodeForSession(e))}async signInWithWeb3(e){const{chain:t}=e;switch(t){case"ethereum":return await this.signInWithEthereum(e);case"solana":return await this.signInWithSolana(e);default:throw new Error(`@supabase/auth-js: Unsupported chain "${t}"`)}}async signInWithEthereum(e){var t,r,s,n,i,o,a,l,c,u,h;let f,p;if("message"in e)f=e.message,p=e.signature;else{const{chain:u,wallet:h,statement:d,options:g}=e;let w;if(q())if("object"==typeof h)w=h;else{const e=window;if(!("ethereum"in e)||"object"!=typeof e.ethereum||!("request"in e.ethereum)||"function"!=typeof e.ethereum.request)throw new Error("@supabase/auth-js: No compatible Ethereum wallet interface on the window object (window.ethereum) detected. Make sure the user already has a wallet installed and connected for this app. Prefer passing the wallet interface object directly to signInWithWeb3({ chain: 'ethereum', wallet: resolvedUserWallet }) instead.");w=e.ethereum}else{if("object"!=typeof h||!(null==g?void 0:g.url))throw new Error("@supabase/auth-js: Both wallet and url must be specified in non-browser environments.");w=h}const y=new URL(null!==(t=null==g?void 0:g.url)&&void 0!==t?t:window.location.href),_=await w.request({method:"eth_requestAccounts"}).then(e=>e).catch(()=>{throw new Error("@supabase/auth-js: Wallet method eth_requestAccounts is missing or invalid")});if(!_||0===_.length)throw new Error("@supabase/auth-js: No accounts available. Please ensure the wallet is connected.");const v=Ee(_[0]);let m=null===(r=null==g?void 0:g.signInWithEthereum)||void 0===r?void 0:r.chainId;if(!m){const e=await w.request({method:"eth_chainId"});m=parseInt(e,16)}f=function(e){var t;const{chainId:r,domain:s,expirationTime:n,issuedAt:i=new Date,nonce:o,notBefore:a,requestId:l,resources:c,scheme:u,uri:h,version:d}=e;if(!Number.isInteger(r))throw new Error(`@supabase/auth-js: Invalid SIWE message field "chainId". Chain ID must be a EIP-155 chain ID. Provided value: ${r}`);if(!s)throw new Error('@supabase/auth-js: Invalid SIWE message field "domain". Domain must be provided.');if(o&&o.length<8)throw new Error(`@supabase/auth-js: Invalid SIWE message field "nonce". Nonce must be at least 8 characters. Provided value: ${o}`);if(!h)throw new Error('@supabase/auth-js: Invalid SIWE message field "uri". URI must be provided.');if("1"!==d)throw new Error(`@supabase/auth-js: Invalid SIWE message field "version". Version must be '1'. Provided value: ${d}`);if(null===(t=e.statement)||void 0===t?void 0:t.includes("\n"))throw new Error(`@supabase/auth-js: Invalid SIWE message field "statement". Statement must not include '\\n'. Provided value: ${e.statement}`);const f=`${u?`${u}://${s}`:s} wants you to sign in with your Ethereum account:\n${Ee(e.address)}\n\n${e.statement?`${e.statement}\n`:""}`;let p=`URI: ${h}\nVersion: ${d}\nChain ID: ${r}${o?`\nNonce: ${o}`:""}\nIssued At: ${i.toISOString()}`;if(n&&(p+=`\nExpiration Time: ${n.toISOString()}`),a&&(p+=`\nNot Before: ${a.toISOString()}`),l&&(p+=`\nRequest ID: ${l}`),c){let e="\nResources:";for(const t of c){if(!t||"string"!=typeof t)throw new Error(`@supabase/auth-js: Invalid SIWE message field "resources". Every resource must be a valid string. Provided value: ${t}`);e+=`\n- ${t}`}p+=e}return`${f}\n${p}`}({domain:y.host,address:v,statement:d,uri:y.href,version:"1",chainId:m,nonce:null===(s=null==g?void 0:g.signInWithEthereum)||void 0===s?void 0:s.nonce,issuedAt:null!==(i=null===(n=null==g?void 0:g.signInWithEthereum)||void 0===n?void 0:n.issuedAt)&&void 0!==i?i:new Date,expirationTime:null===(o=null==g?void 0:g.signInWithEthereum)||void 0===o?void 0:o.expirationTime,notBefore:null===(a=null==g?void 0:g.signInWithEthereum)||void 0===a?void 0:a.notBefore,requestId:null===(l=null==g?void 0:g.signInWithEthereum)||void 0===l?void 0:l.requestId,resources:null===(c=null==g?void 0:g.signInWithEthereum)||void 0===c?void 0:c.resources}),p=await w.request({method:"personal_sign",params:[ke(f),v]})}try{const{data:t,error:r}=await ie(this.fetch,"POST",`${this.url}/token?grant_type=web3`,{headers:this.headers,body:Object.assign({chain:"ethereum",message:f,signature:p},(null===(u=e.options)||void 0===u?void 0:u.captchaToken)?{gotrue_meta_security:{captcha_token:null===(h=e.options)||void 0===h?void 0:h.captchaToken}}:null),xform:oe});if(r)throw r;if(!t||!t.session||!t.user){const e=new v;return this._returnResult({data:{user:null,session:null},error:e})}return t.session&&(await this._saveSession(t.session),await this._notifyAllSubscribers("SIGNED_IN",t.session)),this._returnResult({data:Object.assign({},t),error:r})}catch(e){if(d(e))return this._returnResult({data:{user:null,session:null},error:e});throw e}}async signInWithSolana(e){var t,r,s,n,i,o,a,l,c,u,h,f;let p,g;if("message"in e)p=e.message,g=e.signature;else{const{chain:h,wallet:d,statement:f,options:w}=e;let y;if(q())if("object"==typeof d)y=d;else{const e=window;if(!("solana"in e)||"object"!=typeof e.solana||!("signIn"in e.solana&&"function"==typeof e.solana.signIn||"signMessage"in e.solana&&"function"==typeof e.solana.signMessage))throw new Error("@supabase/auth-js: No compatible Solana wallet interface on the window object (window.solana) detected. Make sure the user already has a wallet installed and connected for this app. Prefer passing the wallet interface object directly to signInWithWeb3({ chain: 'solana', wallet: resolvedUserWallet }) instead.");y=e.solana}else{if("object"!=typeof d||!(null==w?void 0:w.url))throw new Error("@supabase/auth-js: Both wallet and url must be specified in non-browser environments.");y=d}const _=new URL(null!==(t=null==w?void 0:w.url)&&void 0!==t?t:window.location.href);if("signIn"in y&&y.signIn){const e=await y.signIn(Object.assign(Object.assign(Object.assign({issuedAt:(new Date).toISOString()},null==w?void 0:w.signInWithSolana),{version:"1",domain:_.host,uri:_.href}),f?{statement:f}:null));let t;if(Array.isArray(e)&&e[0]&&"object"==typeof e[0])t=e[0];else{if(!(e&&"object"==typeof e&&"signedMessage"in e&&"signature"in e))throw new Error("@supabase/auth-js: Wallet method signIn() returned unrecognized value");t=e}if(!("signedMessage"in t&&"signature"in t&&("string"==typeof t.signedMessage||t.signedMessage instanceof Uint8Array)&&t.signature instanceof Uint8Array))throw new Error("@supabase/auth-js: Wallet method signIn() API returned object without signedMessage and signature fields");p="string"==typeof t.signedMessage?t.signedMessage:(new TextDecoder).decode(t.signedMessage),g=t.signature}else{if(!("signMessage"in y&&"function"==typeof y.signMessage&&"publicKey"in y&&"object"==typeof y&&y.publicKey&&"toBase58"in y.publicKey&&"function"==typeof y.publicKey.toBase58))throw new Error("@supabase/auth-js: Wallet does not have a compatible signMessage() and publicKey.toBase58() API");p=[`${_.host} wants you to sign in with your Solana account:`,y.publicKey.toBase58(),...f?["",f,""]:[""],"Version: 1",`URI: ${_.href}`,`Issued At: ${null!==(s=null===(r=null==w?void 0:w.signInWithSolana)||void 0===r?void 0:r.issuedAt)&&void 0!==s?s:(new Date).toISOString()}`,...(null===(n=null==w?void 0:w.signInWithSolana)||void 0===n?void 0:n.notBefore)?[`Not Before: ${w.signInWithSolana.notBefore}`]:[],...(null===(i=null==w?void 0:w.signInWithSolana)||void 0===i?void 0:i.expirationTime)?[`Expiration Time: ${w.signInWithSolana.expirationTime}`]:[],...(null===(o=null==w?void 0:w.signInWithSolana)||void 0===o?void 0:o.chainId)?[`Chain ID: ${w.signInWithSolana.chainId}`]:[],...(null===(a=null==w?void 0:w.signInWithSolana)||void 0===a?void 0:a.nonce)?[`Nonce: ${w.signInWithSolana.nonce}`]:[],...(null===(l=null==w?void 0:w.signInWithSolana)||void 0===l?void 0:l.requestId)?[`Request ID: ${w.signInWithSolana.requestId}`]:[],...(null===(u=null===(c=null==w?void 0:w.signInWithSolana)||void 0===c?void 0:c.resources)||void 0===u?void 0:u.length)?["Resources",...w.signInWithSolana.resources.map(e=>`- ${e}`)]:[]].join("\n");const e=await y.signMessage((new TextEncoder).encode(p),"utf8");if(!(e&&e instanceof Uint8Array))throw new Error("@supabase/auth-js: Wallet signMessage() API returned an recognized value");g=e}}try{const{data:t,error:r}=await ie(this.fetch,"POST",`${this.url}/token?grant_type=web3`,{headers:this.headers,body:Object.assign({chain:"solana",message:p,signature:B(g)},(null===(h=e.options)||void 0===h?void 0:h.captchaToken)?{gotrue_meta_security:{captcha_token:null===(f=e.options)||void 0===f?void 0:f.captchaToken}}:null),xform:oe});if(r)throw r;if(!t||!t.session||!t.user){const e=new v;return this._returnResult({data:{user:null,session:null},error:e})}return t.session&&(await this._saveSession(t.session),await this._notifyAllSubscribers("SIGNED_IN",t.session)),this._returnResult({data:Object.assign({},t),error:r})}catch(e){if(d(e))return this._returnResult({data:{user:null,session:null},error:e});throw e}}async _exchangeCodeForSession(e){const t=await W(this.storage,`${this.storageKey}-code-verifier`),[r,s]=(null!=t?t:"").split("/");try{if(!r&&"pkce"===this.flowType)throw new S;const{data:t,error:n}=await ie(this.fetch,"POST",`${this.url}/token?grant_type=pkce`,{headers:this.headers,body:{auth_code:e,code_verifier:r},xform:oe});if(await G(this.storage,`${this.storageKey}-code-verifier`),n)throw n;if(!t||!t.session||!t.user){const e=new v;return this._returnResult({data:{user:null,session:null,redirectType:null},error:e})}return t.session&&(await this._saveSession(t.session),await this._notifyAllSubscribers("SIGNED_IN",t.session)),this._returnResult({data:Object.assign(Object.assign({},t),{redirectType:null!=s?s:null}),error:n})}catch(e){if(await G(this.storage,`${this.storageKey}-code-verifier`),d(e))return this._returnResult({data:{user:null,session:null,redirectType:null},error:e});throw e}}async signInWithIdToken(e){try{const{options:t,provider:r,token:s,access_token:n,nonce:i}=e,o=await ie(this.fetch,"POST",`${this.url}/token?grant_type=id_token`,{headers:this.headers,body:{provider:r,id_token:s,access_token:n,nonce:i,gotrue_meta_security:{captcha_token:null==t?void 0:t.captchaToken}},xform:oe}),{data:a,error:l}=o;if(l)return this._returnResult({data:{user:null,session:null},error:l});if(!a||!a.session||!a.user){const e=new v;return this._returnResult({data:{user:null,session:null},error:e})}return a.session&&(await this._saveSession(a.session),await this._notifyAllSubscribers("SIGNED_IN",a.session)),this._returnResult({data:a,error:l})}catch(e){if(d(e))return this._returnResult({data:{user:null,session:null},error:e});throw e}}async signInWithOtp(e){var t,r,s,n,i;try{if("email"in e){const{email:s,options:n}=e;let i=null,o=null;"pkce"===this.flowType&&([i,o]=await Y(this.storage,this.storageKey));const{error:a}=await ie(this.fetch,"POST",`${this.url}/otp`,{headers:this.headers,body:{email:s,data:null!==(t=null==n?void 0:n.data)&&void 0!==t?t:{},create_user:null===(r=null==n?void 0:n.shouldCreateUser)||void 0===r||r,gotrue_meta_security:{captcha_token:null==n?void 0:n.captchaToken},code_challenge:i,code_challenge_method:o},redirectTo:null==n?void 0:n.emailRedirectTo});return this._returnResult({data:{user:null,session:null},error:a})}if("phone"in e){const{phone:t,options:r}=e,{data:o,error:a}=await ie(this.fetch,"POST",`${this.url}/otp`,{headers:this.headers,body:{phone:t,data:null!==(s=null==r?void 0:r.data)&&void 0!==s?s:{},create_user:null===(n=null==r?void 0:r.shouldCreateUser)||void 0===n||n,gotrue_meta_security:{captcha_token:null==r?void 0:r.captchaToken},channel:null!==(i=null==r?void 0:r.channel)&&void 0!==i?i:"sms"}});return this._returnResult({data:{user:null,session:null,messageId:null==o?void 0:o.message_id},error:a})}throw new m("You must provide either an email or phone number.")}catch(e){if(await G(this.storage,`${this.storageKey}-code-verifier`),d(e))return this._returnResult({data:{user:null,session:null},error:e});throw e}}async verifyOtp(e){var t,r;try{let s,n;"options"in e&&(s=null===(t=e.options)||void 0===t?void 0:t.redirectTo,n=null===(r=e.options)||void 0===r?void 0:r.captchaToken);const{data:i,error:o}=await ie(this.fetch,"POST",`${this.url}/verify`,{headers:this.headers,body:Object.assign(Object.assign({},e),{gotrue_meta_security:{captcha_token:n}}),redirectTo:s,xform:oe});if(o)throw o;if(!i)throw new Error("An error occurred on token verification.");const a=i.session,l=i.user;return(null==a?void 0:a.access_token)&&(await this._saveSession(a),await this._notifyAllSubscribers("recovery"==e.type?"PASSWORD_RECOVERY":"SIGNED_IN",a)),this._returnResult({data:{user:l,session:a},error:null})}catch(e){if(d(e))return this._returnResult({data:{user:null,session:null},error:e});throw e}}async signInWithSSO(e){var t,r,s,n,i;try{let o=null,a=null;"pkce"===this.flowType&&([o,a]=await Y(this.storage,this.storageKey));const l=await ie(this.fetch,"POST",`${this.url}/sso`,{body:Object.assign(Object.assign(Object.assign(Object.assign(Object.assign({},"providerId"in e?{provider_id:e.providerId}:null),"domain"in e?{domain:e.domain}:null),{redirect_to:null!==(r=null===(t=e.options)||void 0===t?void 0:t.redirectTo)&&void 0!==r?r:void 0}),(null===(s=null==e?void 0:e.options)||void 0===s?void 0:s.captchaToken)?{gotrue_meta_security:{captcha_token:e.options.captchaToken}}:null),{skip_http_redirect:!0,code_challenge:o,code_challenge_method:a}),headers:this.headers,xform:ce});return(null===(n=l.data)||void 0===n?void 0:n.url)&&q()&&!(null===(i=e.options)||void 0===i?void 0:i.skipBrowserRedirect)&&window.location.assign(l.data.url),this._returnResult(l)}catch(e){if(await G(this.storage,`${this.storageKey}-code-verifier`),d(e))return this._returnResult({data:null,error:e});throw e}}async reauthenticate(){return await this.initializePromise,await this._acquireLock(-1,async()=>await this._reauthenticate())}async _reauthenticate(){try{return await this._useSession(async e=>{const{data:{session:t},error:r}=e;if(r)throw r;if(!t)throw new y;const{error:s}=await ie(this.fetch,"GET",`${this.url}/reauthenticate`,{headers:this.headers,jwt:t.access_token});return this._returnResult({data:{user:null,session:null},error:s})})}catch(e){if(d(e))return this._returnResult({data:{user:null,session:null},error:e});throw e}}async resend(e){try{const t=`${this.url}/resend`;if("email"in e){const{email:r,type:s,options:n}=e,{error:i}=await ie(this.fetch,"POST",t,{headers:this.headers,body:{email:r,type:s,gotrue_meta_security:{captcha_token:null==n?void 0:n.captchaToken}},redirectTo:null==n?void 0:n.emailRedirectTo});return this._returnResult({data:{user:null,session:null},error:i})}if("phone"in e){const{phone:r,type:s,options:n}=e,{data:i,error:o}=await ie(this.fetch,"POST",t,{headers:this.headers,body:{phone:r,type:s,gotrue_meta_security:{captcha_token:null==n?void 0:n.captchaToken}}});return this._returnResult({data:{user:null,session:null,messageId:null==i?void 0:i.message_id},error:o})}throw new m("You must provide either an email or phone number and a type")}catch(e){if(d(e))return this._returnResult({data:{user:null,session:null},error:e});throw e}}async getSession(){return await this.initializePromise,await this._acquireLock(-1,async()=>this._useSession(async e=>e))}async _acquireLock(e,t){this._debug("#_acquireLock","begin",e);try{if(this.lockAcquired){const e=this.pendingInLock.length?this.pendingInLock[this.pendingInLock.length-1]:Promise.resolve(),r=(async()=>(await e,await t()))();return this.pendingInLock.push((async()=>{try{await r}catch(e){}})()),r}return await this.lock(`lock:${this.storageKey}`,e,async()=>{this._debug("#_acquireLock","lock acquired for storage key",this.storageKey);try{this.lockAcquired=!0;const e=t();for(this.pendingInLock.push((async()=>{try{await e}catch(e){}})()),await e;this.pendingInLock.length;){const e=[...this.pendingInLock];await Promise.all(e),this.pendingInLock.splice(0,e.length)}return await e}finally{this._debug("#_acquireLock","lock released for storage key",this.storageKey),this.lockAcquired=!1}})}finally{this._debug("#_acquireLock","end")}}async _useSession(e){this._debug("#_useSession","begin");try{const t=await this.__loadSession();return await e(t)}finally{this._debug("#_useSession","end")}}async __loadSession(){this._debug("#__loadSession()","begin"),this.lockAcquired||this._debug("#__loadSession()","used outside of an acquired lock!",(new Error).stack);try{let e=null;const t=await W(this.storage,this.storageKey);if(this._debug("#getSession()","session from storage",t),null!==t&&(this._isValidSession(t)?e=t:(this._debug("#getSession()","session from storage is not valid"),await this._removeSession())),!e)return{data:{session:null},error:null};const r=!!e.expires_at&&1e3*e.expires_at-Date.now()<9e4;if(this._debug("#__loadSession()",`session has${r?"":" not"} expired`,"expires_at",e.expires_at),!r){if(this.userStorage){const t=await W(this.userStorage,this.storageKey+"-user");(null==t?void 0:t.user)?e.user=t.user:e.user=ee()}if(this.storage.isServer&&e.user&&!e.user.__isUserNotAvailableProxy){const t={value:this.suppressGetSessionWarning};e.user=function(e,t){return new Proxy(e,{get:(e,r,s)=>{if("__isInsecureUserWarningProxy"===r)return!0;if("symbol"==typeof r){const t=r.toString();if("Symbol(Symbol.toPrimitive)"===t||"Symbol(Symbol.toStringTag)"===t||"Symbol(util.inspect.custom)"===t||"Symbol(nodejs.util.inspect.custom)"===t)return Reflect.get(e,r,s)}return t.value||"string"!=typeof r||(console.warn("Using the user object as returned from supabase.auth.getSession() or from some supabase.auth.onAuthStateChange() events could be insecure! This value comes directly from the storage medium (usually cookies on the server) and may not be authentic. Use supabase.auth.getUser() instead which authenticates the data by contacting the Supabase Auth server."),t.value=!0),Reflect.get(e,r,s)}})}(e.user,t),t.value&&(this.suppressGetSessionWarning=!0)}return{data:{session:e},error:null}}const{data:s,error:n}=await this._callRefreshToken(e.refresh_token);return n?this._returnResult({data:{session:null},error:n}):this._returnResult({data:{session:s},error:null})}finally{this._debug("#__loadSession()","end")}}async getUser(e){if(e)return await this._getUser(e);await this.initializePromise;const t=await this._acquireLock(-1,async()=>await this._getUser());return t.data.user&&(this.suppressGetSessionWarning=!0),t}async _getUser(e){try{return e?await ie(this.fetch,"GET",`${this.url}/user`,{headers:this.headers,jwt:e,xform:le}):await this._useSession(async e=>{var t,r,s;const{data:n,error:i}=e;if(i)throw i;return(null===(t=n.session)||void 0===t?void 0:t.access_token)||this.hasCustomAuthorizationHeader?await ie(this.fetch,"GET",`${this.url}/user`,{headers:this.headers,jwt:null!==(s=null===(r=n.session)||void 0===r?void 0:r.access_token)&&void 0!==s?s:void 0,xform:le}):{data:{user:null},error:new y}})}catch(e){if(d(e))return _(e)&&(await this._removeSession(),await G(this.storage,`${this.storageKey}-code-verifier`)),this._returnResult({data:{user:null},error:e});throw e}}async updateUser(e,t={}){return await this.initializePromise,await this._acquireLock(-1,async()=>await this._updateUser(e,t))}async _updateUser(e,t={}){try{return await this._useSession(async r=>{const{data:s,error:n}=r;if(n)throw n;if(!s.session)throw new y;const i=s.session;let o=null,a=null;"pkce"===this.flowType&&null!=e.email&&([o,a]=await Y(this.storage,this.storageKey));const{data:l,error:c}=await ie(this.fetch,"PUT",`${this.url}/user`,{headers:this.headers,redirectTo:null==t?void 0:t.emailRedirectTo,body:Object.assign(Object.assign({},e),{code_challenge:o,code_challenge_method:a}),jwt:i.access_token,xform:le});if(c)throw c;return i.user=l.user,await this._saveSession(i),await this._notifyAllSubscribers("USER_UPDATED",i),this._returnResult({data:{user:i.user},error:null})})}catch(e){if(await G(this.storage,`${this.storageKey}-code-verifier`),d(e))return this._returnResult({data:{user:null},error:e});throw e}}async setSession(e){return await this.initializePromise,await this._acquireLock(-1,async()=>await this._setSession(e))}async _setSession(e){try{if(!e.access_token||!e.refresh_token)throw new y;const t=Date.now()/1e3;let r=t,s=!0,n=null;const{payload:i}=J(e.access_token);if(i.exp&&(r=i.exp,s=r<=t),s){const{data:t,error:r}=await this._callRefreshToken(e.refresh_token);if(r)return this._returnResult({data:{user:null,session:null},error:r});if(!t)return{data:{user:null,session:null},error:null};n=t}else{const{data:s,error:i}=await this._getUser(e.access_token);if(i)throw i;n={access_token:e.access_token,refresh_token:e.refresh_token,user:s.user,token_type:"bearer",expires_in:r-t,expires_at:r},await this._saveSession(n),await this._notifyAllSubscribers("SIGNED_IN",n)}return this._returnResult({data:{user:n.user,session:n},error:null})}catch(e){if(d(e))return this._returnResult({data:{session:null,user:null},error:e});throw e}}async refreshSession(e){return await this.initializePromise,await this._acquireLock(-1,async()=>await this._refreshSession(e))}async _refreshSession(e){try{return await this._useSession(async t=>{var r;if(!e){const{data:s,error:n}=t;if(n)throw n;e=null!==(r=s.session)&&void 0!==r?r:void 0}if(!(null==e?void 0:e.refresh_token))throw new y;const{data:s,error:n}=await this._callRefreshToken(e.refresh_token);return n?this._returnResult({data:{user:null,session:null},error:n}):s?this._returnResult({data:{user:s.user,session:s},error:null}):this._returnResult({data:{user:null,session:null},error:null})})}catch(e){if(d(e))return this._returnResult({data:{user:null,session:null},error:e});throw e}}async _getSessionFromURL(e,t){try{if(!q())throw new b("No browser detected.");if(e.error||e.error_description||e.error_code)throw new b(e.error_description||"Error in URL with unspecified error_description",{error:e.error||"unspecified_error",code:e.error_code||"unspecified_code"});switch(t){case"implicit":if("pkce"===this.flowType)throw new k("Not a valid PKCE flow url.");break;case"pkce":if("implicit"===this.flowType)throw new b("Not a valid implicit grant flow url.")}if("pkce"===t){if(this._debug("#_initialize()","begin","is PKCE flow",!0),!e.code)throw new k("No code detected.");const{data:t,error:r}=await this._exchangeCodeForSession(e.code);if(r)throw r;const s=new URL(window.location.href);return s.searchParams.delete("code"),window.history.replaceState(window.history.state,"",s.toString()),{data:{session:t.session,redirectType:null},error:null}}const{provider_token:r,provider_refresh_token:s,access_token:n,refresh_token:o,expires_in:a,expires_at:l,token_type:c}=e;if(!(n&&a&&o&&c))throw new b("No session defined in URL");const u=Math.round(Date.now()/1e3),h=parseInt(a);let d=u+h;l&&(d=parseInt(l));const f=d-u;1e3*f<=i&&console.warn(`@supabase/gotrue-js: Session as retrieved from URL expires in ${f}s, should have been closer to ${h}s`);const p=d-h;u-p>=120?console.warn("@supabase/gotrue-js: Session as retrieved from URL was issued over 120s ago, URL could be stale",p,d,u):u-p<0&&console.warn("@supabase/gotrue-js: Session as retrieved from URL was issued in the future? Check the device clock for skew",p,d,u);const{data:g,error:w}=await this._getUser(n);if(w)throw w;const y={provider_token:r,provider_refresh_token:s,access_token:n,expires_in:h,expires_at:d,refresh_token:o,token_type:c,user:g.user};return window.location.hash="",this._debug("#_getSessionFromURL()","clearing window.location.hash"),this._returnResult({data:{session:y,redirectType:e.type},error:null})}catch(e){if(d(e))return this._returnResult({data:{session:null,redirectType:null},error:e});throw e}}_isImplicitGrantCallback(e){return Boolean(e.access_token||e.error_description)}async _isPKCECallback(e){const t=await W(this.storage,`${this.storageKey}-code-verifier`);return!(!e.code||!t)}async signOut(e={scope:"global"}){return await this.initializePromise,await this._acquireLock(-1,async()=>await this._signOut(e))}async _signOut({scope:e}={scope:"global"}){return await this._useSession(async t=>{var r;const{data:s,error:n}=t;if(n)return this._returnResult({error:n});const i=null===(r=s.session)||void 0===r?void 0:r.access_token;if(i){const{error:t}=await this.admin.signOut(i,e);if(t&&(!p(t)||404!==t.status&&401!==t.status&&403!==t.status))return this._returnResult({error:t})}return"others"!==e&&(await this._removeSession(),await G(this.storage,`${this.storageKey}-code-verifier`)),this._returnResult({error:null})})}onAuthStateChange(e){const t=Symbol("auth-callback"),r={id:t,callback:e,unsubscribe:()=>{this._debug("#unsubscribe()","state change callback with id removed",t),this.stateChangeEmitters.delete(t)}};return this._debug("#onAuthStateChange()","registered callback with id",t),this.stateChangeEmitters.set(t,r),(async()=>{await this.initializePromise,await this._acquireLock(-1,async()=>{this._emitInitialSession(t)})})(),{data:{subscription:r}}}async _emitInitialSession(e){return await this._useSession(async t=>{var r,s;try{const{data:{session:s},error:n}=t;if(n)throw n;await(null===(r=this.stateChangeEmitters.get(e))||void 0===r?void 0:r.callback("INITIAL_SESSION",s)),this._debug("INITIAL_SESSION","callback id",e,"session",s)}catch(t){await(null===(s=this.stateChangeEmitters.get(e))||void 0===s?void 0:s.callback("INITIAL_SESSION",null)),this._debug("INITIAL_SESSION","callback id",e,"error",t),console.error(t)}})}async resetPasswordForEmail(e,t={}){let r=null,s=null;"pkce"===this.flowType&&([r,s]=await Y(this.storage,this.storageKey,!0));try{return await ie(this.fetch,"POST",`${this.url}/recover`,{body:{email:e,code_challenge:r,code_challenge_method:s,gotrue_meta_security:{captcha_token:t.captchaToken}},headers:this.headers,redirectTo:t.redirectTo})}catch(e){if(await G(this.storage,`${this.storageKey}-code-verifier`),d(e))return this._returnResult({data:null,error:e});throw e}}async getUserIdentities(){var e;try{const{data:t,error:r}=await this.getUser();if(r)throw r;return this._returnResult({data:{identities:null!==(e=t.user.identities)&&void 0!==e?e:[]},error:null})}catch(e){if(d(e))return this._returnResult({data:null,error:e});throw e}}async linkIdentity(e){return"token"in e?this.linkIdentityIdToken(e):this.linkIdentityOAuth(e)}async linkIdentityOAuth(e){var t;try{const{data:r,error:s}=await this._useSession(async t=>{var r,s,n,i,o;const{data:a,error:l}=t;if(l)throw l;const c=await this._getUrlForProvider(`${this.url}/user/identities/authorize`,e.provider,{redirectTo:null===(r=e.options)||void 0===r?void 0:r.redirectTo,scopes:null===(s=e.options)||void 0===s?void 0:s.scopes,queryParams:null===(n=e.options)||void 0===n?void 0:n.queryParams,skipBrowserRedirect:!0});return await ie(this.fetch,"GET",c,{headers:this.headers,jwt:null!==(o=null===(i=a.session)||void 0===i?void 0:i.access_token)&&void 0!==o?o:void 0})});if(s)throw s;return q()&&!(null===(t=e.options)||void 0===t?void 0:t.skipBrowserRedirect)&&window.location.assign(null==r?void 0:r.url),this._returnResult({data:{provider:e.provider,url:null==r?void 0:r.url},error:null})}catch(t){if(d(t))return this._returnResult({data:{provider:e.provider,url:null},error:t});throw t}}async linkIdentityIdToken(e){return await this._useSession(async t=>{var r;try{const{error:s,data:{session:n}}=t;if(s)throw s;const{options:i,provider:o,token:a,access_token:l,nonce:c}=e,u=await ie(this.fetch,"POST",`${this.url}/token?grant_type=id_token`,{headers:this.headers,jwt:null!==(r=null==n?void 0:n.access_token)&&void 0!==r?r:void 0,body:{provider:o,id_token:a,access_token:l,nonce:c,link_identity:!0,gotrue_meta_security:{captcha_token:null==i?void 0:i.captchaToken}},xform:oe}),{data:h,error:d}=u;return d?this._returnResult({data:{user:null,session:null},error:d}):h&&h.session&&h.user?(h.session&&(await this._saveSession(h.session),await this._notifyAllSubscribers("USER_UPDATED",h.session)),this._returnResult({data:h,error:d})):this._returnResult({data:{user:null,session:null},error:new v})}catch(e){if(await G(this.storage,`${this.storageKey}-code-verifier`),d(e))return this._returnResult({data:{user:null,session:null},error:e});throw e}})}async unlinkIdentity(e){try{return await this._useSession(async t=>{var r,s;const{data:n,error:i}=t;if(i)throw i;return await ie(this.fetch,"DELETE",`${this.url}/user/identities/${e.identity_id}`,{headers:this.headers,jwt:null!==(s=null===(r=n.session)||void 0===r?void 0:r.access_token)&&void 0!==s?s:void 0})})}catch(e){if(d(e))return this._returnResult({data:null,error:e});throw e}}async _refreshAccessToken(e){const t=`#_refreshAccessToken(${e.substring(0,5)}...)`;this._debug(t,"begin");try{const n=Date.now();return await(r=async r=>(r>0&&await async function(e){return await new Promise(t=>{setTimeout(()=>t(null),e)})}(200*Math.pow(2,r-1)),this._debug(t,"refreshing attempt",r),await ie(this.fetch,"POST",`${this.url}/token?grant_type=refresh_token`,{body:{refresh_token:e},headers:this.headers,xform:oe})),s=(e,t)=>{const r=200*Math.pow(2,e);return t&&j(t)&&Date.now()+r-n<i},new Promise((e,t)=>{(async()=>{for(let n=0;n<1/0;n++)try{const t=await r(n);if(!s(n,null))return void e(t)}catch(e){if(!s(n,e))return void t(e)}})()}))}catch(e){if(this._debug(t,"error",e),d(e))return this._returnResult({data:{session:null,user:null},error:e});throw e}finally{this._debug(t,"end")}var r,s}_isValidSession(e){return"object"==typeof e&&null!==e&&"access_token"in e&&"refresh_token"in e&&"expires_at"in e}async _handleProviderSignIn(e,t){const r=await this._getUrlForProvider(`${this.url}/authorize`,e,{redirectTo:t.redirectTo,scopes:t.scopes,queryParams:t.queryParams});return this._debug("#_handleProviderSignIn()","provider",e,"options",t,"url",r),q()&&!t.skipBrowserRedirect&&window.location.assign(r),{data:{provider:e,url:r},error:null}}async _recoverAndRefresh(){var e,t;const r="#_recoverAndRefresh()";this._debug(r,"begin");try{const s=await W(this.storage,this.storageKey);if(s&&this.userStorage){let t=await W(this.userStorage,this.storageKey+"-user");this.storage.isServer||!Object.is(this.storage,this.userStorage)||t||(t={user:s.user},await V(this.userStorage,this.storageKey+"-user",t)),s.user=null!==(e=null==t?void 0:t.user)&&void 0!==e?e:ee()}else if(s&&!s.user&&!s.user){const e=await W(this.storage,this.storageKey+"-user");e&&(null==e?void 0:e.user)?(s.user=e.user,await G(this.storage,this.storageKey+"-user"),await V(this.storage,this.storageKey,s)):s.user=ee()}if(this._debug(r,"session from storage",s),!this._isValidSession(s))return this._debug(r,"session is not valid"),void(null!==s&&await this._removeSession());const n=1e3*(null!==(t=s.expires_at)&&void 0!==t?t:1/0)-Date.now()<9e4;if(this._debug(r,`session has${n?"":" not"} expired with margin of 90000s`),n){if(this.autoRefreshToken&&s.refresh_token){const{error:e}=await this._callRefreshToken(s.refresh_token);e&&(console.error(e),j(e)||(this._debug(r,"refresh failed with a non-retryable error, removing the session",e),await this._removeSession()))}}else if(s.user&&!0===s.user.__isUserNotAvailableProxy)try{const{data:e,error:t}=await this._getUser(s.access_token);!t&&(null==e?void 0:e.user)?(s.user=e.user,await this._saveSession(s),await this._notifyAllSubscribers("SIGNED_IN",s)):this._debug(r,"could not get user data, skipping SIGNED_IN notification")}catch(e){console.error("Error getting user data:",e),this._debug(r,"error getting user data, skipping SIGNED_IN notification",e)}else await this._notifyAllSubscribers("SIGNED_IN",s)}catch(e){return this._debug(r,"error",e),void console.error(e)}finally{this._debug(r,"end")}}async _callRefreshToken(e){var t,r;if(!e)throw new y;if(this.refreshingDeferred)return this.refreshingDeferred.promise;const s=`#_callRefreshToken(${e.substring(0,5)}...)`;this._debug(s,"begin");try{this.refreshingDeferred=new H;const{data:t,error:r}=await this._refreshAccessToken(e);if(r)throw r;if(!t.session)throw new y;await this._saveSession(t.session),await this._notifyAllSubscribers("TOKEN_REFRESHED",t.session);const s={data:t.session,error:null};return this.refreshingDeferred.resolve(s),s}catch(e){if(this._debug(s,"error",e),d(e)){const r={data:null,error:e};return j(e)||await this._removeSession(),null===(t=this.refreshingDeferred)||void 0===t||t.resolve(r),r}throw null===(r=this.refreshingDeferred)||void 0===r||r.reject(e),e}finally{this.refreshingDeferred=null,this._debug(s,"end")}}async _notifyAllSubscribers(e,t,r=!0){const s=`#_notifyAllSubscribers(${e})`;this._debug(s,"begin",t,`broadcast = ${r}`);try{this.broadcastChannel&&r&&this.broadcastChannel.postMessage({event:e,session:t});const s=[],n=Array.from(this.stateChangeEmitters.values()).map(async r=>{try{await r.callback(e,t)}catch(e){s.push(e)}});if(await Promise.all(n),s.length>0){for(let e=0;e<s.length;e+=1)console.error(s[e]);throw s[0]}}finally{this._debug(s,"end")}}async _saveSession(e){this._debug("#_saveSession()",e),this.suppressGetSessionWarning=!0,await G(this.storage,`${this.storageKey}-code-verifier`);const t=Object.assign({},e),r=t.user&&!0===t.user.__isUserNotAvailableProxy;if(this.userStorage){!r&&t.user&&await V(this.userStorage,this.storageKey+"-user",{user:t.user});const e=Object.assign({},t);delete e.user;const s=te(e);await V(this.storage,this.storageKey,s)}else{const e=te(t);await V(this.storage,this.storageKey,e)}}async _removeSession(){this._debug("#_removeSession()"),this.suppressGetSessionWarning=!1,await G(this.storage,this.storageKey),await G(this.storage,this.storageKey+"-code-verifier"),await G(this.storage,this.storageKey+"-user"),this.userStorage&&await G(this.userStorage,this.storageKey+"-user"),await this._notifyAllSubscribers("SIGNED_OUT",null)}_removeVisibilityChangedCallback(){this._debug("#_removeVisibilityChangedCallback()");const e=this.visibilityChangedCallback;this.visibilityChangedCallback=null;try{e&&q()&&(null===window||void 0===window?void 0:window.removeEventListener)&&window.removeEventListener("visibilitychange",e)}catch(e){console.error("removing visibilitychange callback failed",e)}}async _startAutoRefresh(){await this._stopAutoRefresh(),this._debug("#_startAutoRefresh()");const e=setInterval(()=>this._autoRefreshTokenTick(),i);this.autoRefreshTicker=e,e&&"object"==typeof e&&"function"==typeof e.unref?e.unref():"undefined"!=typeof Deno&&"function"==typeof Deno.unrefTimer&&Deno.unrefTimer(e),setTimeout(async()=>{await this.initializePromise,await this._autoRefreshTokenTick()},0)}async _stopAutoRefresh(){this._debug("#_stopAutoRefresh()");const e=this.autoRefreshTicker;this.autoRefreshTicker=null,e&&clearInterval(e)}async startAutoRefresh(){this._removeVisibilityChangedCallback(),await this._startAutoRefresh()}async stopAutoRefresh(){this._removeVisibilityChangedCallback(),await this._stopAutoRefresh()}async _autoRefreshTokenTick(){this._debug("#_autoRefreshTokenTick()","begin");try{await this._acquireLock(0,async()=>{try{const e=Date.now();try{return await this._useSession(async t=>{const{data:{session:r}}=t;if(!r||!r.refresh_token||!r.expires_at)return void this._debug("#_autoRefreshTokenTick()","no session");const s=Math.floor((1e3*r.expires_at-e)/i);this._debug("#_autoRefreshTokenTick()",`access token expires in ${s} ticks, a tick lasts 30000ms, refresh threshold is 3 ticks`),s<=3&&await this._callRefreshToken(r.refresh_token)})}catch(e){console.error("Auto refresh tick failed with error. This is likely a transient error.",e)}}finally{this._debug("#_autoRefreshTokenTick()","end")}})}catch(e){if(!(e.isAcquireTimeout||e instanceof we))throw e;this._debug("auto refresh token tick lock not available")}}async _handleVisibilityChange(){if(this._debug("#_handleVisibilityChange()"),!q()||!(null===window||void 0===window?void 0:window.addEventListener))return this.autoRefreshToken&&this.startAutoRefresh(),!1;try{this.visibilityChangedCallback=async()=>await this._onVisibilityChanged(!1),null===window||void 0===window||window.addEventListener("visibilitychange",this.visibilityChangedCallback),await this._onVisibilityChanged(!0)}catch(e){console.error("_handleVisibilityChange",e)}}async _onVisibilityChanged(e){const t=`#_onVisibilityChanged(${e})`;this._debug(t,"visibilityState",document.visibilityState),"visible"===document.visibilityState?(this.autoRefreshToken&&this._startAutoRefresh(),e||(await this.initializePromise,await this._acquireLock(-1,async()=>{"visible"===document.visibilityState?await this._recoverAndRefresh():this._debug(t,"acquired the lock to recover the session, but the browser visibilityState is no longer visible, aborting")}))):"hidden"===document.visibilityState&&this.autoRefreshToken&&this._stopAutoRefresh()}async _getUrlForProvider(e,t,r){const s=[`provider=${encodeURIComponent(t)}`];if((null==r?void 0:r.redirectTo)&&s.push(`redirect_to=${encodeURIComponent(r.redirectTo)}`),(null==r?void 0:r.scopes)&&s.push(`scopes=${encodeURIComponent(r.scopes)}`),"pkce"===this.flowType){const[e,t]=await Y(this.storage,this.storageKey),r=new URLSearchParams({code_challenge:`${encodeURIComponent(e)}`,code_challenge_method:`${encodeURIComponent(t)}`});s.push(r.toString())}if(null==r?void 0:r.queryParams){const e=new URLSearchParams(r.queryParams);s.push(e.toString())}return(null==r?void 0:r.skipBrowserRedirect)&&s.push(`skip_http_redirect=${r.skipBrowserRedirect}`),`${e}?${s.join("&")}`}async _unenroll(e){try{return await this._useSession(async t=>{var r;const{data:s,error:n}=t;return n?this._returnResult({data:null,error:n}):await ie(this.fetch,"DELETE",`${this.url}/factors/${e.factorId}`,{headers:this.headers,jwt:null===(r=null==s?void 0:s.session)||void 0===r?void 0:r.access_token})})}catch(e){if(d(e))return this._returnResult({data:null,error:e});throw e}}async _enroll(e){try{return await this._useSession(async t=>{var r,s;const{data:n,error:i}=t;if(i)return this._returnResult({data:null,error:i});const o=Object.assign({friendly_name:e.friendlyName,factor_type:e.factorType},"phone"===e.factorType?{phone:e.phone}:"totp"===e.factorType?{issuer:e.issuer}:{}),{data:a,error:l}=await ie(this.fetch,"POST",`${this.url}/factors`,{body:o,headers:this.headers,jwt:null===(r=null==n?void 0:n.session)||void 0===r?void 0:r.access_token});return l?this._returnResult({data:null,error:l}):("totp"===e.factorType&&"totp"===a.type&&(null===(s=null==a?void 0:a.totp)||void 0===s?void 0:s.qr_code)&&(a.totp.qr_code=`data:image/svg+xml;utf-8,${a.totp.qr_code}`),this._returnResult({data:a,error:null}))})}catch(e){if(d(e))return this._returnResult({data:null,error:e});throw e}}async _verify(e){return this._acquireLock(-1,async()=>{try{return await this._useSession(async t=>{var r;const{data:s,error:n}=t;if(n)return this._returnResult({data:null,error:n});const i=Object.assign({challenge_id:e.challengeId},"webauthn"in e?{webauthn:Object.assign(Object.assign({},e.webauthn),{credential_response:"create"===e.webauthn.type?Ie(e.webauthn.credential_response):Ce(e.webauthn.credential_response)})}:{code:e.code}),{data:o,error:a}=await ie(this.fetch,"POST",`${this.url}/factors/${e.factorId}/verify`,{body:i,headers:this.headers,jwt:null===(r=null==s?void 0:s.session)||void 0===r?void 0:r.access_token});return a?this._returnResult({data:null,error:a}):(await this._saveSession(Object.assign({expires_at:Math.round(Date.now()/1e3)+o.expires_in},o)),await this._notifyAllSubscribers("MFA_CHALLENGE_VERIFIED",o),this._returnResult({data:o,error:a}))})}catch(e){if(d(e))return this._returnResult({data:null,error:e});throw e}})}async _challenge(e){return this._acquireLock(-1,async()=>{try{return await this._useSession(async t=>{var r;const{data:s,error:n}=t;if(n)return this._returnResult({data:null,error:n});const i=await ie(this.fetch,"POST",`${this.url}/factors/${e.factorId}/challenge`,{body:e,headers:this.headers,jwt:null===(r=null==s?void 0:s.session)||void 0===r?void 0:r.access_token});if(i.error)return i;const{data:o}=i;if("webauthn"!==o.type)return{data:o,error:null};switch(o.webauthn.type){case"create":return{data:Object.assign(Object.assign({},o),{webauthn:Object.assign(Object.assign({},o.webauthn),{credential_options:Object.assign(Object.assign({},o.webauthn.credential_options),{publicKey:Ae(o.webauthn.credential_options.publicKey)})})}),error:null};case"request":return{data:Object.assign(Object.assign({},o),{webauthn:Object.assign(Object.assign({},o.webauthn),{credential_options:Object.assign(Object.assign({},o.webauthn.credential_options),{publicKey:Pe(o.webauthn.credential_options.publicKey)})})}),error:null}}})}catch(e){if(d(e))return this._returnResult({data:null,error:e});throw e}})}async _challengeAndVerify(e){const{data:t,error:r}=await this._challenge({factorId:e.factorId});return r?this._returnResult({data:null,error:r}):await this._verify({factorId:e.factorId,challengeId:t.id,code:e.code})}async _listFactors(){var e;const{data:{user:t},error:r}=await this.getUser();if(r)return{data:null,error:r};const s={all:[],phone:[],totp:[],webauthn:[]};for(const r of null!==(e=null==t?void 0:t.factors)&&void 0!==e?e:[])s.all.push(r),"verified"===r.status&&s[r.factor_type].push(r);return{data:s,error:null}}async _getAuthenticatorAssuranceLevel(){var e,t;const{data:{session:r},error:s}=await this.getSession();if(s)return this._returnResult({data:null,error:s});if(!r)return{data:{currentLevel:null,nextLevel:null,currentAuthenticationMethods:[]},error:null};const{payload:n}=J(r.access_token);let i=null;n.aal&&(i=n.aal);let o=i;return(null!==(t=null===(e=r.user.factors)||void 0===e?void 0:e.filter(e=>"verified"===e.status))&&void 0!==t?t:[]).length>0&&(o="aal2"),{data:{currentLevel:i,nextLevel:o,currentAuthenticationMethods:n.amr||[]},error:null}}async _getAuthorizationDetails(e){try{return await this._useSession(async t=>{const{data:{session:r},error:s}=t;return s?this._returnResult({data:null,error:s}):r?await ie(this.fetch,"GET",`${this.url}/oauth/authorizations/${e}`,{headers:this.headers,jwt:r.access_token,xform:e=>({data:e,error:null})}):this._returnResult({data:null,error:new y})})}catch(e){if(d(e))return this._returnResult({data:null,error:e});throw e}}async _approveAuthorization(e,t){try{return await this._useSession(async r=>{const{data:{session:s},error:n}=r;if(n)return this._returnResult({data:null,error:n});if(!s)return this._returnResult({data:null,error:new y});const i=await ie(this.fetch,"POST",`${this.url}/oauth/authorizations/${e}/consent`,{headers:this.headers,jwt:s.access_token,body:{action:"approve"},xform:e=>({data:e,error:null})});return i.data&&i.data.redirect_url&&q()&&!(null==t?void 0:t.skipBrowserRedirect)&&window.location.assign(i.data.redirect_url),i})}catch(e){if(d(e))return this._returnResult({data:null,error:e});throw e}}async _denyAuthorization(e,t){try{return await this._useSession(async r=>{const{data:{session:s},error:n}=r;if(n)return this._returnResult({data:null,error:n});if(!s)return this._returnResult({data:null,error:new y});const i=await ie(this.fetch,"POST",`${this.url}/oauth/authorizations/${e}/consent`,{headers:this.headers,jwt:s.access_token,body:{action:"deny"},xform:e=>({data:e,error:null})});return i.data&&i.data.redirect_url&&q()&&!(null==t?void 0:t.skipBrowserRedirect)&&window.location.assign(i.data.redirect_url),i})}catch(e){if(d(e))return this._returnResult({data:null,error:e});throw e}}async _listOAuthGrants(){try{return await this._useSession(async e=>{const{data:{session:t},error:r}=e;return r?this._returnResult({data:null,error:r}):t?await ie(this.fetch,"GET",`${this.url}/user/oauth/grants`,{headers:this.headers,jwt:t.access_token,xform:e=>({data:e,error:null})}):this._returnResult({data:null,error:new y})})}catch(e){if(d(e))return this._returnResult({data:null,error:e});throw e}}async _revokeOAuthGrant(e){try{return await this._useSession(async t=>{const{data:{session:r},error:s}=t;return s?this._returnResult({data:null,error:s}):r?(await ie(this.fetch,"DELETE",`${this.url}/user/oauth/grants`,{headers:this.headers,jwt:r.access_token,query:{client_id:e.clientId},noResolveJson:!0}),{data:{},error:null}):this._returnResult({data:null,error:new y})})}catch(e){if(d(e))return this._returnResult({data:null,error:e});throw e}}async fetchJwk(e,t={keys:[]}){let r=t.keys.find(t=>t.kid===e);if(r)return r;const s=Date.now();if(r=this.jwks.keys.find(t=>t.kid===e),r&&this.jwks_cached_at+6e5>s)return r;const{data:n,error:i}=await ie(this.fetch,"GET",`${this.url}/.well-known/jwks.json`,{headers:this.headers});if(i)throw i;return n.keys&&0!==n.keys.length?(this.jwks=n,this.jwks_cached_at=s,r=n.keys.find(t=>t.kid===e),r||null):null}async getClaims(e,t={}){try{let r=e;if(!r){const{data:e,error:t}=await this.getSession();if(t||!e.session)return this._returnResult({data:null,error:t});r=e.session.access_token}const{header:s,payload:n,signature:i,raw:{header:o,payload:a}}=J(r);(null==t?void 0:t.allowExpired)||function(e){if(!e)throw new Error("Missing exp claim");if(e<=Math.floor(Date.now()/1e3))throw new Error("JWT has expired")}(n.exp);const l=s.alg&&!s.alg.startsWith("HS")&&s.kid&&"crypto"in globalThis&&"subtle"in globalThis.crypto?await this.fetchJwk(s.kid,(null==t?void 0:t.keys)?{keys:t.keys}:null==t?void 0:t.jwks):null;if(!l){const{error:e}=await this.getUser(r);if(e)throw e;return{data:{claims:n,header:s,signature:i},error:null}}const c=function(e){switch(e){case"RS256":return{name:"RSASSA-PKCS1-v1_5",hash:{name:"SHA-256"}};case"ES256":return{name:"ECDSA",namedCurve:"P-256",hash:{name:"SHA-256"}};default:throw new Error("Invalid alg claim")}}(s.alg),u=await crypto.subtle.importKey("jwk",l,c,!0,["verify"]);if(!await crypto.subtle.verify(c,u,i,function(e){const t=[];return function(e,t){for(let r=0;r<e.length;r+=1){let s=e.charCodeAt(r);if(s>55295&&s<=56319){const t=1024*(s-55296)&65535;s=65536+(e.charCodeAt(r+1)-56320&65535|t),r+=1}D(s,t)}}(e,e=>t.push(e)),new Uint8Array(t)}(`${o}.${a}`)))throw new P("Invalid JWT signature");return{data:{claims:n,header:s,signature:i},error:null}}catch(e){if(d(e))return this._returnResult({data:null,error:e});throw e}}}Me.nextInstanceID={};const Ke=Me,Ve=fe,We=Me},231:(e,t,r)=>{r.r(t),r.d(t,{FunctionRegion:()=>s,FunctionsClient:()=>c,FunctionsError:()=>i,FunctionsFetchError:()=>o,FunctionsHttpError:()=>l,FunctionsRelayError:()=>a});var s,n=r(823);class i extends Error{constructor(e,t="FunctionsError",r){super(e),this.name=t,this.context=r}}class o extends i{constructor(e){super("Failed to send a request to the Edge Function","FunctionsFetchError",e)}}class a extends i{constructor(e){super("Relay Error invoking the Edge Function","FunctionsRelayError",e)}}class l extends i{constructor(e){super("Edge Function returned a non-2xx status code","FunctionsHttpError",e)}}!function(e){e.Any="any",e.ApNortheast1="ap-northeast-1",e.ApNortheast2="ap-northeast-2",e.ApSouth1="ap-south-1",e.ApSoutheast1="ap-southeast-1",e.ApSoutheast2="ap-southeast-2",e.CaCentral1="ca-central-1",e.EuCentral1="eu-central-1",e.EuWest1="eu-west-1",e.EuWest2="eu-west-2",e.EuWest3="eu-west-3",e.SaEast1="sa-east-1",e.UsEast1="us-east-1",e.UsWest1="us-west-1",e.UsWest2="us-west-2"}(s||(s={}));class c{constructor(e,{headers:t={},customFetch:r,region:n=s.Any}={}){this.url=e,this.headers=t,this.region=n,this.fetch=(e=>e?(...t)=>e(...t):(...e)=>fetch(...e))(r)}setAuth(e){this.headers.Authorization=`Bearer ${e}`}invoke(e){return(0,n.__awaiter)(this,arguments,void 0,function*(e,t={}){var r;let s,n;try{const{headers:i,method:c,body:u,signal:h,timeout:d}=t;let f={},{region:p}=t;p||(p=this.region);const g=new URL(`${this.url}/${e}`);let w;p&&"any"!==p&&(f["x-region"]=p,g.searchParams.set("forceFunctionRegion",p)),u&&(i&&!Object.prototype.hasOwnProperty.call(i,"Content-Type")||!i)?"undefined"!=typeof Blob&&u instanceof Blob||u instanceof ArrayBuffer?(f["Content-Type"]="application/octet-stream",w=u):"string"==typeof u?(f["Content-Type"]="text/plain",w=u):"undefined"!=typeof FormData&&u instanceof FormData?w=u:(f["Content-Type"]="application/json",w=JSON.stringify(u)):w=u;let y=h;d&&(n=new AbortController,s=setTimeout(()=>n.abort(),d),h?(y=n.signal,h.addEventListener("abort",()=>n.abort())):y=n.signal);const _=yield this.fetch(g.toString(),{method:c||"POST",headers:Object.assign(Object.assign(Object.assign({},f),this.headers),i),body:w,signal:y}).catch(e=>{throw new o(e)}),v=_.headers.get("x-relay-error");if(v&&"true"===v)throw new a(_);if(!_.ok)throw new l(_);let m,b=(null!==(r=_.headers.get("Content-Type"))&&void 0!==r?r:"text/plain").split(";")[0].trim();return m="application/json"===b?yield _.json():"application/octet-stream"===b||"application/pdf"===b?yield _.blob():"text/event-stream"===b?_:"multipart/form-data"===b?yield _.formData():yield _.text(),{data:m,error:null,response:_}}catch(e){return{data:null,error:e,response:e instanceof l||e instanceof a?e.context:void 0}}finally{s&&clearTimeout(s)}})}}},251:(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.DEFAULT_REALTIME_OPTIONS=t.DEFAULT_AUTH_OPTIONS=t.DEFAULT_DB_OPTIONS=t.DEFAULT_GLOBAL_OPTIONS=t.DEFAULT_HEADERS=void 0;const s=r(822);let n="";n="undefined"!=typeof Deno?"deno":"undefined"!=typeof document?"web":"undefined"!=typeof navigator&&"ReactNative"===navigator.product?"react-native":"node",t.DEFAULT_HEADERS={"X-Client-Info":`supabase-js-${n}/${s.version}`},t.DEFAULT_GLOBAL_OPTIONS={headers:t.DEFAULT_HEADERS},t.DEFAULT_DB_OPTIONS={schema:"public"},t.DEFAULT_AUTH_OPTIONS={autoRefreshToken:!0,persistSession:!0,detectSessionInUrl:!0,flowType:"implicit"},t.DEFAULT_REALTIME_OPTIONS={}},442:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.fetchWithAuth=t.resolveHeadersConstructor=t.resolveFetch=void 0,t.resolveFetch=e=>e?(...t)=>e(...t):(...e)=>fetch(...e),t.resolveHeadersConstructor=()=>Headers,t.fetchWithAuth=(e,r,s)=>{const n=(0,t.resolveFetch)(s),i=(0,t.resolveHeadersConstructor)();return async(t,s)=>{var o;const a=null!==(o=await r())&&void 0!==o?o:e;let l=new i(null==s?void 0:s.headers);return l.has("apikey")||l.set("apikey",e),l.has("Authorization")||l.set("Authorization",`Bearer ${a}`),n(t,Object.assign(Object.assign({},s),{headers:l}))}}},595:(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0});const s=r(823).__importDefault(r(886));t.default=class{constructor(e){var t,r;this.shouldThrowOnError=!1,this.method=e.method,this.url=e.url,this.headers=new Headers(e.headers),this.schema=e.schema,this.body=e.body,this.shouldThrowOnError=null!==(t=e.shouldThrowOnError)&&void 0!==t&&t,this.signal=e.signal,this.isMaybeSingle=null!==(r=e.isMaybeSingle)&&void 0!==r&&r,e.fetch?this.fetch=e.fetch:this.fetch=fetch}throwOnError(){return this.shouldThrowOnError=!0,this}setHeader(e,t){return this.headers=new Headers(this.headers),this.headers.set(e,t),this}then(e,t){void 0===this.schema||(["GET","HEAD"].includes(this.method)?this.headers.set("Accept-Profile",this.schema):this.headers.set("Content-Profile",this.schema)),"GET"!==this.method&&"HEAD"!==this.method&&this.headers.set("Content-Type","application/json");let r=(0,this.fetch)(this.url.toString(),{method:this.method,headers:this.headers,body:JSON.stringify(this.body),signal:this.signal}).then(async e=>{var t,r,n,i;let o=null,a=null,l=null,c=e.status,u=e.statusText;if(e.ok){if("HEAD"!==this.method){const r=await e.text();""===r||(a="text/csv"===this.headers.get("Accept")||this.headers.get("Accept")&&(null===(t=this.headers.get("Accept"))||void 0===t?void 0:t.includes("application/vnd.pgrst.plan+text"))?r:JSON.parse(r))}const s=null===(r=this.headers.get("Prefer"))||void 0===r?void 0:r.match(/count=(exact|planned|estimated)/),i=null===(n=e.headers.get("content-range"))||void 0===n?void 0:n.split("/");s&&i&&i.length>1&&(l=parseInt(i[1])),this.isMaybeSingle&&"GET"===this.method&&Array.isArray(a)&&(a.length>1?(o={code:"PGRST116",details:`Results contain ${a.length} rows, application/vnd.pgrst.object+json requires 1 row`,hint:null,message:"JSON object requested, multiple (or no) rows returned"},a=null,l=null,c=406,u="Not Acceptable"):a=1===a.length?a[0]:null)}else{const t=await e.text();try{o=JSON.parse(t),Array.isArray(o)&&404===e.status&&(a=[],o=null,c=200,u="OK")}catch(r){404===e.status&&""===t?(c=204,u="No Content"):o={message:t}}if(o&&this.isMaybeSingle&&(null===(i=null==o?void 0:o.details)||void 0===i?void 0:i.includes("0 rows"))&&(o=null,c=200,u="OK"),o&&this.shouldThrowOnError)throw new s.default(o)}return{error:o,data:a,count:l,status:c,statusText:u}});return this.shouldThrowOnError||(r=r.catch(e=>{var t,r,s,n,i,o;let a="";const l=null==e?void 0:e.cause;if(l){const i=null!==(t=null==l?void 0:l.message)&&void 0!==t?t:"",o=null!==(r=null==l?void 0:l.code)&&void 0!==r?r:"";a=`${null!==(s=null==e?void 0:e.name)&&void 0!==s?s:"FetchError"}: ${null==e?void 0:e.message}`,a+=`\n\nCaused by: ${null!==(n=null==l?void 0:l.name)&&void 0!==n?n:"Error"}: ${i}`,o&&(a+=` (${o})`),(null==l?void 0:l.stack)&&(a+=`\n${l.stack}`)}else a=null!==(i=null==e?void 0:e.stack)&&void 0!==i?i:"";return{error:{message:`${null!==(o=null==e?void 0:e.name)&&void 0!==o?o:"FetchError"}: ${null==e?void 0:e.message}`,details:a,hint:"",code:""},data:null,count:null,status:0,statusText:""}})),r.then(e,t)}returns(){return this}overrideTypes(){return this}}},597:(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0});const s=r(823),n=s.__importDefault(r(705)),i=s.__importDefault(r(973));class o{constructor(e,{headers:t={},schema:r,fetch:s}={}){this.url=e,this.headers=new Headers(t),this.schemaName=r,this.fetch=s}from(e){if(!e||"string"!=typeof e||""===e.trim())throw new Error("Invalid relation name: relation must be a non-empty string.");const t=new URL(`${this.url}/${e}`);return new n.default(t,{headers:new Headers(this.headers),schema:this.schemaName,fetch:this.fetch})}schema(e){return new o(this.url,{headers:this.headers,schema:e,fetch:this.fetch})}rpc(e,t={},{head:r=!1,get:s=!1,count:n}={}){var o;let a;const l=new URL(`${this.url}/rpc/${e}`);let c;r||s?(a=r?"HEAD":"GET",Object.entries(t).filter(([e,t])=>void 0!==t).map(([e,t])=>[e,Array.isArray(t)?`{${t.join(",")}}`:`${t}`]).forEach(([e,t])=>{l.searchParams.append(e,t)})):(a="POST",c=t);const u=new Headers(this.headers);return n&&u.set("Prefer",`count=${n}`),new i.default({method:a,url:l,headers:u,schema:this.schemaName,body:c,fetch:null!==(o=this.fetch)&&void 0!==o?o:fetch})}}t.default=o},646:function(e,t,r){var s=this&&this.__createBinding||(Object.create?function(e,t,r,s){void 0===s&&(s=r);var n=Object.getOwnPropertyDescriptor(t,r);n&&!("get"in n?!t.__esModule:n.writable||n.configurable)||(n={enumerable:!0,get:function(){return t[r]}}),Object.defineProperty(e,s,n)}:function(e,t,r,s){void 0===s&&(s=r),e[s]=t[r]}),n=this&&this.__exportStar||function(e,t){for(var r in e)"default"===r||Object.prototype.hasOwnProperty.call(t,r)||s(t,e,r)},i=this&&this.__importDefault||function(e){return e&&e.__esModule?e:{default:e}};Object.defineProperty(t,"__esModule",{value:!0}),t.createClient=t.SupabaseClient=t.FunctionRegion=t.FunctionsError=t.FunctionsRelayError=t.FunctionsFetchError=t.FunctionsHttpError=t.PostgrestError=void 0;const o=i(r(13));n(r(166),t);var a=r(739);Object.defineProperty(t,"PostgrestError",{enumerable:!0,get:function(){return a.PostgrestError}});var l=r(231);Object.defineProperty(t,"FunctionsHttpError",{enumerable:!0,get:function(){return l.FunctionsHttpError}}),Object.defineProperty(t,"FunctionsFetchError",{enumerable:!0,get:function(){return l.FunctionsFetchError}}),Object.defineProperty(t,"FunctionsRelayError",{enumerable:!0,get:function(){return l.FunctionsRelayError}}),Object.defineProperty(t,"FunctionsError",{enumerable:!0,get:function(){return l.FunctionsError}}),Object.defineProperty(t,"FunctionRegion",{enumerable:!0,get:function(){return l.FunctionRegion}}),n(r(698),t);var c=r(13);Object.defineProperty(t,"SupabaseClient",{enumerable:!0,get:function(){return i(c).default}}),t.createClient=(e,t,r)=>new o.default(e,t,r),function(){if("undefined"!=typeof window)return!1;if("undefined"==typeof process)return!1;const e=process.version;if(null==e)return!1;const t=e.match(/^v(\d+)\./);return!!t&&parseInt(t[1],10)<=18}()&&console.warn("⚠️  Node.js 18 and below are deprecated and will no longer be supported in future versions of @supabase/supabase-js. Please upgrade to Node.js 20 or later. For more information, visit: https://github.com/orgs/supabase/discussions/37217")},698:(e,t,r)=>{r.r(t),r.d(t,{REALTIME_CHANNEL_STATES:()=>P,REALTIME_LISTEN_TYPES:()=>j,REALTIME_POSTGRES_CHANGES_LISTEN_EVENT:()=>O,REALTIME_PRESENCE_LISTEN_EVENTS:()=>T,REALTIME_SUBSCRIBE_STATES:()=>R,RealtimeChannel:()=>I,RealtimeClient:()=>x,RealtimePresence:()=>A,WebSocketFactory:()=>s});const s=class{constructor(){}static detectEnvironment(){var e;if("undefined"!=typeof WebSocket)return{type:"native",constructor:WebSocket};if("undefined"!=typeof globalThis&&void 0!==globalThis.WebSocket)return{type:"native",constructor:globalThis.WebSocket};if(void 0!==r.g&&void 0!==r.g.WebSocket)return{type:"native",constructor:r.g.WebSocket};if("undefined"!=typeof globalThis&&void 0!==globalThis.WebSocketPair&&void 0===globalThis.WebSocket)return{type:"cloudflare",error:"Cloudflare Workers detected. WebSocket clients are not supported in Cloudflare Workers.",workaround:"Use Cloudflare Workers WebSocket API for server-side WebSocket handling, or deploy to a different runtime."};if("undefined"!=typeof globalThis&&globalThis.EdgeRuntime||"undefined"!=typeof navigator&&(null===(e=navigator.userAgent)||void 0===e?void 0:e.includes("Vercel-Edge")))return{type:"unsupported",error:"Edge runtime detected (Vercel Edge/Netlify Edge). WebSockets are not supported in edge functions.",workaround:"Use serverless functions or a different deployment target for WebSocket functionality."};if("undefined"!=typeof process){const e=process.versions;if(e&&e.node){const t=e.node,r=parseInt(t.replace(/^v/,"").split(".")[0]);return r>=22?void 0!==globalThis.WebSocket?{type:"native",constructor:globalThis.WebSocket}:{type:"unsupported",error:`Node.js ${r} detected but native WebSocket not found.`,workaround:"Provide a WebSocket implementation via the transport option."}:{type:"unsupported",error:`Node.js ${r} detected without native WebSocket support.`,workaround:'For Node.js < 22, install "ws" package and provide it via the transport option:\nimport ws from "ws"\nnew RealtimeClient(url, { transport: ws })'}}}return{type:"unsupported",error:"Unknown JavaScript runtime without WebSocket support.",workaround:"Ensure you're running in a supported environment (browser, Node.js, Deno) or provide a custom WebSocket implementation."}}static getWebSocketConstructor(){const e=this.detectEnvironment();if(e.constructor)return e.constructor;let t=e.error||"WebSocket not supported in this environment.";throw e.workaround&&(t+=`\n\nSuggested solution: ${e.workaround}`),new Error(t)}static createWebSocket(e,t){return new(this.getWebSocketConstructor())(e,t)}static isWebSocketSupported(){try{const e=this.detectEnvironment();return"native"===e.type||"ws"===e.type}catch(e){return!1}}},n="1.0.0",i=n;var o,a,l,c,u,h;!function(e){e[e.connecting=0]="connecting",e[e.open=1]="open",e[e.closing=2]="closing",e[e.closed=3]="closed"}(o||(o={})),function(e){e.closed="closed",e.errored="errored",e.joined="joined",e.joining="joining",e.leaving="leaving"}(a||(a={})),function(e){e.close="phx_close",e.error="phx_error",e.join="phx_join",e.reply="phx_reply",e.leave="phx_leave",e.access_token="access_token"}(l||(l={})),function(e){e.websocket="websocket"}(c||(c={})),function(e){e.Connecting="connecting",e.Open="open",e.Closing="closing",e.Closed="closed"}(u||(u={}));class d{constructor(e){this.HEADER_LENGTH=1,this.USER_BROADCAST_PUSH_META_LENGTH=6,this.KINDS={userBroadcastPush:3,userBroadcast:4},this.BINARY_ENCODING=0,this.JSON_ENCODING=1,this.BROADCAST_EVENT="broadcast",this.allowedMetadataKeys=[],this.allowedMetadataKeys=null!=e?e:[]}encode(e,t){if(e.event===this.BROADCAST_EVENT&&!(e.payload instanceof ArrayBuffer)&&"string"==typeof e.payload.event)return t(this._binaryEncodeUserBroadcastPush(e));let r=[e.join_ref,e.ref,e.topic,e.event,e.payload];return t(JSON.stringify(r))}_binaryEncodeUserBroadcastPush(e){var t;return this._isArrayBuffer(null===(t=e.payload)||void 0===t?void 0:t.payload)?this._encodeBinaryUserBroadcastPush(e):this._encodeJsonUserBroadcastPush(e)}_encodeBinaryUserBroadcastPush(e){var t,r;const s=null!==(r=null===(t=e.payload)||void 0===t?void 0:t.payload)&&void 0!==r?r:new ArrayBuffer(0);return this._encodeUserBroadcastPush(e,this.BINARY_ENCODING,s)}_encodeJsonUserBroadcastPush(e){var t,r;const s=null!==(r=null===(t=e.payload)||void 0===t?void 0:t.payload)&&void 0!==r?r:{},n=(new TextEncoder).encode(JSON.stringify(s)).buffer;return this._encodeUserBroadcastPush(e,this.JSON_ENCODING,n)}_encodeUserBroadcastPush(e,t,r){var s,n;const i=e.topic,o=null!==(s=e.ref)&&void 0!==s?s:"",a=null!==(n=e.join_ref)&&void 0!==n?n:"",l=e.payload.event,c=this.allowedMetadataKeys?this._pick(e.payload,this.allowedMetadataKeys):{},u=0===Object.keys(c).length?"":JSON.stringify(c);if(a.length>255)throw new Error(`joinRef length ${a.length} exceeds maximum of 255`);if(o.length>255)throw new Error(`ref length ${o.length} exceeds maximum of 255`);if(i.length>255)throw new Error(`topic length ${i.length} exceeds maximum of 255`);if(l.length>255)throw new Error(`userEvent length ${l.length} exceeds maximum of 255`);if(u.length>255)throw new Error(`metadata length ${u.length} exceeds maximum of 255`);const h=this.USER_BROADCAST_PUSH_META_LENGTH+a.length+o.length+i.length+l.length+u.length,d=new ArrayBuffer(this.HEADER_LENGTH+h);let f=new DataView(d),p=0;f.setUint8(p++,this.KINDS.userBroadcastPush),f.setUint8(p++,a.length),f.setUint8(p++,o.length),f.setUint8(p++,i.length),f.setUint8(p++,l.length),f.setUint8(p++,u.length),f.setUint8(p++,t),Array.from(a,e=>f.setUint8(p++,e.charCodeAt(0))),Array.from(o,e=>f.setUint8(p++,e.charCodeAt(0))),Array.from(i,e=>f.setUint8(p++,e.charCodeAt(0))),Array.from(l,e=>f.setUint8(p++,e.charCodeAt(0))),Array.from(u,e=>f.setUint8(p++,e.charCodeAt(0)));var g=new Uint8Array(d.byteLength+r.byteLength);return g.set(new Uint8Array(d),0),g.set(new Uint8Array(r),d.byteLength),g.buffer}decode(e,t){if(this._isArrayBuffer(e))return t(this._binaryDecode(e));if("string"==typeof e){const r=JSON.parse(e),[s,n,i,o,a]=r;return t({join_ref:s,ref:n,topic:i,event:o,payload:a})}return t({})}_binaryDecode(e){const t=new DataView(e),r=t.getUint8(0),s=new TextDecoder;if(r===this.KINDS.userBroadcast)return this._decodeUserBroadcast(e,t,s)}_decodeUserBroadcast(e,t,r){const s=t.getUint8(1),n=t.getUint8(2),i=t.getUint8(3),o=t.getUint8(4);let a=this.HEADER_LENGTH+4;const l=r.decode(e.slice(a,a+s));a+=s;const c=r.decode(e.slice(a,a+n));a+=n;const u=r.decode(e.slice(a,a+i));a+=i;const h=e.slice(a,e.byteLength),d=o===this.JSON_ENCODING?JSON.parse(r.decode(h)):h,f={type:this.BROADCAST_EVENT,event:c,payload:d};return i>0&&(f.meta=JSON.parse(u)),{join_ref:null,ref:null,topic:l,event:this.BROADCAST_EVENT,payload:f}}_isArrayBuffer(e){var t;return e instanceof ArrayBuffer||"ArrayBuffer"===(null===(t=null==e?void 0:e.constructor)||void 0===t?void 0:t.name)}_pick(e,t){return e&&"object"==typeof e?Object.fromEntries(Object.entries(e).filter(([e])=>t.includes(e))):{}}}class f{constructor(e,t){this.callback=e,this.timerCalc=t,this.timer=void 0,this.tries=0,this.callback=e,this.timerCalc=t}reset(){this.tries=0,clearTimeout(this.timer),this.timer=void 0}scheduleTimeout(){clearTimeout(this.timer),this.timer=setTimeout(()=>{this.tries=this.tries+1,this.callback()},this.timerCalc(this.tries+1))}}!function(e){e.abstime="abstime",e.bool="bool",e.date="date",e.daterange="daterange",e.float4="float4",e.float8="float8",e.int2="int2",e.int4="int4",e.int4range="int4range",e.int8="int8",e.int8range="int8range",e.json="json",e.jsonb="jsonb",e.money="money",e.numeric="numeric",e.oid="oid",e.reltime="reltime",e.text="text",e.time="time",e.timestamp="timestamp",e.timestamptz="timestamptz",e.timetz="timetz",e.tsrange="tsrange",e.tstzrange="tstzrange"}(h||(h={}));const p=(e,t,r={})=>{var s;const n=null!==(s=r.skipTypes)&&void 0!==s?s:[];return t?Object.keys(t).reduce((r,s)=>(r[s]=g(s,e,t,n),r),{}):{}},g=(e,t,r,s)=>{const n=t.find(t=>t.name===e),i=null==n?void 0:n.type,o=r[e];return i&&!s.includes(i)?w(i,o):y(o)},w=(e,t)=>{if("_"===e.charAt(0)){const r=e.slice(1,e.length);return b(t,r)}switch(e){case h.bool:return _(t);case h.float4:case h.float8:case h.int2:case h.int4:case h.int8:case h.numeric:case h.oid:return v(t);case h.json:case h.jsonb:return m(t);case h.timestamp:return E(t);case h.abstime:case h.date:case h.daterange:case h.int4range:case h.int8range:case h.money:case h.reltime:case h.text:case h.time:case h.timestamptz:case h.timetz:case h.tsrange:case h.tstzrange:default:return y(t)}},y=e=>e,_=e=>{switch(e){case"t":return!0;case"f":return!1;default:return e}},v=e=>{if("string"==typeof e){const t=parseFloat(e);if(!Number.isNaN(t))return t}return e},m=e=>{if("string"==typeof e)try{return JSON.parse(e)}catch(t){return console.log(`JSON parse error: ${t}`),e}return e},b=(e,t)=>{if("string"!=typeof e)return e;const r=e.length-1,s=e[r];if("{"===e[0]&&"}"===s){let s;const n=e.slice(1,r);try{s=JSON.parse("["+n+"]")}catch(e){s=n?n.split(","):[]}return s.map(e=>w(t,e))}return e},E=e=>"string"==typeof e?e.replace(" ","T"):e,k=e=>{const t=new URL(e);return t.protocol=t.protocol.replace(/^ws/i,"http"),t.pathname=t.pathname.replace(/\/+$/,"").replace(/\/socket\/websocket$/i,"").replace(/\/socket$/i,"").replace(/\/websocket$/i,""),""===t.pathname||"/"===t.pathname?t.pathname="/api/broadcast":t.pathname=t.pathname+"/api/broadcast",t.href};class S{constructor(e,t,r={},s=1e4){this.channel=e,this.event=t,this.payload=r,this.timeout=s,this.sent=!1,this.timeoutTimer=void 0,this.ref="",this.receivedResp=null,this.recHooks=[],this.refEvent=null}resend(e){this.timeout=e,this._cancelRefEvent(),this.ref="",this.refEvent=null,this.receivedResp=null,this.sent=!1,this.send()}send(){this._hasReceived("timeout")||(this.startTimeout(),this.sent=!0,this.channel.socket.push({topic:this.channel.topic,event:this.event,payload:this.payload,ref:this.ref,join_ref:this.channel._joinRef()}))}updatePayload(e){this.payload=Object.assign(Object.assign({},this.payload),e)}receive(e,t){var r;return this._hasReceived(e)&&t(null===(r=this.receivedResp)||void 0===r?void 0:r.response),this.recHooks.push({status:e,callback:t}),this}startTimeout(){this.timeoutTimer||(this.ref=this.channel.socket._makeRef(),this.refEvent=this.channel._replyEventName(this.ref),this.channel._on(this.refEvent,{},e=>{this._cancelRefEvent(),this._cancelTimeout(),this.receivedResp=e,this._matchReceive(e)}),this.timeoutTimer=setTimeout(()=>{this.trigger("timeout",{})},this.timeout))}trigger(e,t){this.refEvent&&this.channel._trigger(this.refEvent,{status:e,response:t})}destroy(){this._cancelRefEvent(),this._cancelTimeout()}_cancelRefEvent(){this.refEvent&&this.channel._off(this.refEvent,{})}_cancelTimeout(){clearTimeout(this.timeoutTimer),this.timeoutTimer=void 0}_matchReceive({status:e,response:t}){this.recHooks.filter(t=>t.status===e).forEach(e=>e.callback(t))}_hasReceived(e){return this.receivedResp&&this.receivedResp.status===e}}var T,O,j,R;!function(e){e.SYNC="sync",e.JOIN="join",e.LEAVE="leave"}(T||(T={}));class A{constructor(e,t){this.channel=e,this.state={},this.pendingDiffs=[],this.joinRef=null,this.enabled=!1,this.caller={onJoin:()=>{},onLeave:()=>{},onSync:()=>{}};const r=(null==t?void 0:t.events)||{state:"presence_state",diff:"presence_diff"};this.channel._on(r.state,{},e=>{const{onJoin:t,onLeave:r,onSync:s}=this.caller;this.joinRef=this.channel._joinRef(),this.state=A.syncState(this.state,e,t,r),this.pendingDiffs.forEach(e=>{this.state=A.syncDiff(this.state,e,t,r)}),this.pendingDiffs=[],s()}),this.channel._on(r.diff,{},e=>{const{onJoin:t,onLeave:r,onSync:s}=this.caller;this.inPendingSyncState()?this.pendingDiffs.push(e):(this.state=A.syncDiff(this.state,e,t,r),s())}),this.onJoin((e,t,r)=>{this.channel._trigger("presence",{event:"join",key:e,currentPresences:t,newPresences:r})}),this.onLeave((e,t,r)=>{this.channel._trigger("presence",{event:"leave",key:e,currentPresences:t,leftPresences:r})}),this.onSync(()=>{this.channel._trigger("presence",{event:"sync"})})}static syncState(e,t,r,s){const n=this.cloneDeep(e),i=this.transformState(t),o={},a={};return this.map(n,(e,t)=>{i[e]||(a[e]=t)}),this.map(i,(e,t)=>{const r=n[e];if(r){const s=t.map(e=>e.presence_ref),n=r.map(e=>e.presence_ref),i=t.filter(e=>n.indexOf(e.presence_ref)<0),l=r.filter(e=>s.indexOf(e.presence_ref)<0);i.length>0&&(o[e]=i),l.length>0&&(a[e]=l)}else o[e]=t}),this.syncDiff(n,{joins:o,leaves:a},r,s)}static syncDiff(e,t,r,s){const{joins:n,leaves:i}={joins:this.transformState(t.joins),leaves:this.transformState(t.leaves)};return r||(r=()=>{}),s||(s=()=>{}),this.map(n,(t,s)=>{var n;const i=null!==(n=e[t])&&void 0!==n?n:[];if(e[t]=this.cloneDeep(s),i.length>0){const r=e[t].map(e=>e.presence_ref),s=i.filter(e=>r.indexOf(e.presence_ref)<0);e[t].unshift(...s)}r(t,i,s)}),this.map(i,(t,r)=>{let n=e[t];if(!n)return;const i=r.map(e=>e.presence_ref);n=n.filter(e=>i.indexOf(e.presence_ref)<0),e[t]=n,s(t,n,r),0===n.length&&delete e[t]}),e}static map(e,t){return Object.getOwnPropertyNames(e).map(r=>t(r,e[r]))}static transformState(e){return e=this.cloneDeep(e),Object.getOwnPropertyNames(e).reduce((t,r)=>{const s=e[r];return t[r]="metas"in s?s.metas.map(e=>(e.presence_ref=e.phx_ref,delete e.phx_ref,delete e.phx_ref_prev,e)):s,t},{})}static cloneDeep(e){return JSON.parse(JSON.stringify(e))}onJoin(e){this.caller.onJoin=e}onLeave(e){this.caller.onLeave=e}onSync(e){this.caller.onSync=e}inPendingSyncState(){return!this.joinRef||this.joinRef!==this.channel._joinRef()}}!function(e){e.ALL="*",e.INSERT="INSERT",e.UPDATE="UPDATE",e.DELETE="DELETE"}(O||(O={})),function(e){e.BROADCAST="broadcast",e.PRESENCE="presence",e.POSTGRES_CHANGES="postgres_changes",e.SYSTEM="system"}(j||(j={})),function(e){e.SUBSCRIBED="SUBSCRIBED",e.TIMED_OUT="TIMED_OUT",e.CLOSED="CLOSED",e.CHANNEL_ERROR="CHANNEL_ERROR"}(R||(R={}));const P=a;class I{constructor(e,t={config:{}},r){var s,n;if(this.topic=e,this.params=t,this.socket=r,this.bindings={},this.state=a.closed,this.joinedOnce=!1,this.pushBuffer=[],this.subTopic=e.replace(/^realtime:/i,""),this.params.config=Object.assign({broadcast:{ack:!1,self:!1},presence:{key:"",enabled:!1},private:!1},t.config),this.timeout=this.socket.timeout,this.joinPush=new S(this,l.join,this.params,this.timeout),this.rejoinTimer=new f(()=>this._rejoinUntilConnected(),this.socket.reconnectAfterMs),this.joinPush.receive("ok",()=>{this.state=a.joined,this.rejoinTimer.reset(),this.pushBuffer.forEach(e=>e.send()),this.pushBuffer=[]}),this._onClose(()=>{this.rejoinTimer.reset(),this.socket.log("channel",`close ${this.topic} ${this._joinRef()}`),this.state=a.closed,this.socket._remove(this)}),this._onError(e=>{this._isLeaving()||this._isClosed()||(this.socket.log("channel",`error ${this.topic}`,e),this.state=a.errored,this.rejoinTimer.scheduleTimeout())}),this.joinPush.receive("timeout",()=>{this._isJoining()&&(this.socket.log("channel",`timeout ${this.topic}`,this.joinPush.timeout),this.state=a.errored,this.rejoinTimer.scheduleTimeout())}),this.joinPush.receive("error",e=>{this._isLeaving()||this._isClosed()||(this.socket.log("channel",`error ${this.topic}`,e),this.state=a.errored,this.rejoinTimer.scheduleTimeout())}),this._on(l.reply,{},(e,t)=>{this._trigger(this._replyEventName(t),e)}),this.presence=new A(this),this.broadcastEndpointURL=k(this.socket.endPoint),this.private=this.params.config.private||!1,!this.private&&(null===(n=null===(s=this.params.config)||void 0===s?void 0:s.broadcast)||void 0===n?void 0:n.replay))throw`tried to use replay on public channel '${this.topic}'. It must be a private channel.`}subscribe(e,t=this.timeout){var r,s,n;if(this.socket.isConnected()||this.socket.connect(),this.state==a.closed){const{config:{broadcast:i,presence:o,private:l}}=this.params,c=null!==(s=null===(r=this.bindings.postgres_changes)||void 0===r?void 0:r.map(e=>e.filter))&&void 0!==s?s:[],u=!!this.bindings[j.PRESENCE]&&this.bindings[j.PRESENCE].length>0||!0===(null===(n=this.params.config.presence)||void 0===n?void 0:n.enabled),h={},d={broadcast:i,presence:Object.assign(Object.assign({},o),{enabled:u}),postgres_changes:c,private:l};this.socket.accessTokenValue&&(h.access_token=this.socket.accessTokenValue),this._onError(t=>null==e?void 0:e(R.CHANNEL_ERROR,t)),this._onClose(()=>null==e?void 0:e(R.CLOSED)),this.updateJoinPayload(Object.assign({config:d},h)),this.joinedOnce=!0,this._rejoin(t),this.joinPush.receive("ok",async({postgres_changes:t})=>{var r;if(this.socket._isManualToken()||this.socket.setAuth(),void 0!==t){const s=this.bindings.postgres_changes,n=null!==(r=null==s?void 0:s.length)&&void 0!==r?r:0,i=[];for(let r=0;r<n;r++){const n=s[r],{filter:{event:o,schema:l,table:c,filter:u}}=n,h=t&&t[r];if(!(h&&h.event===o&&I.isFilterValueEqual(h.schema,l)&&I.isFilterValueEqual(h.table,c)&&I.isFilterValueEqual(h.filter,u)))return this.unsubscribe(),this.state=a.errored,void(null==e||e(R.CHANNEL_ERROR,new Error("mismatch between server and client bindings for postgres changes")));i.push(Object.assign(Object.assign({},n),{id:h.id}))}return this.bindings.postgres_changes=i,void(e&&e(R.SUBSCRIBED))}null==e||e(R.SUBSCRIBED)}).receive("error",t=>{this.state=a.errored,null==e||e(R.CHANNEL_ERROR,new Error(JSON.stringify(Object.values(t).join(", ")||"error")))}).receive("timeout",()=>{null==e||e(R.TIMED_OUT)})}return this}presenceState(){return this.presence.state}async track(e,t={}){return await this.send({type:"presence",event:"track",payload:e},t.timeout||this.timeout)}async untrack(e={}){return await this.send({type:"presence",event:"untrack"},e)}on(e,t,r){return this.state===a.joined&&e===j.PRESENCE&&(this.socket.log("channel",`resubscribe to ${this.topic} due to change in presence callbacks on joined channel`),this.unsubscribe().then(async()=>await this.subscribe())),this._on(e,t,r)}async httpSend(e,t,r={}){var s;const n=this.socket.accessTokenValue?`Bearer ${this.socket.accessTokenValue}`:"";if(null==t)return Promise.reject("Payload is required for httpSend()");const i={method:"POST",headers:{Authorization:n,apikey:this.socket.apiKey?this.socket.apiKey:"","Content-Type":"application/json"},body:JSON.stringify({messages:[{topic:this.subTopic,event:e,payload:t,private:this.private}]})},o=await this._fetchWithTimeout(this.broadcastEndpointURL,i,null!==(s=r.timeout)&&void 0!==s?s:this.timeout);if(202===o.status)return{success:!0};let a=o.statusText;try{const e=await o.json();a=e.error||e.message||a}catch(e){}return Promise.reject(new Error(a))}async send(e,t={}){var r,s;if(this._canPush()||"broadcast"!==e.type)return new Promise(r=>{var s,n,i;const o=this._push(e.type,e,t.timeout||this.timeout);"broadcast"!==e.type||(null===(i=null===(n=null===(s=this.params)||void 0===s?void 0:s.config)||void 0===n?void 0:n.broadcast)||void 0===i?void 0:i.ack)||r("ok"),o.receive("ok",()=>r("ok")),o.receive("error",()=>r("error")),o.receive("timeout",()=>r("timed out"))});{console.warn("Realtime send() is automatically falling back to REST API. This behavior will be deprecated in the future. Please use httpSend() explicitly for REST delivery.");const{event:n,payload:i}=e,o={method:"POST",headers:{Authorization:this.socket.accessTokenValue?`Bearer ${this.socket.accessTokenValue}`:"",apikey:this.socket.apiKey?this.socket.apiKey:"","Content-Type":"application/json"},body:JSON.stringify({messages:[{topic:this.subTopic,event:n,payload:i,private:this.private}]})};try{const e=await this._fetchWithTimeout(this.broadcastEndpointURL,o,null!==(r=t.timeout)&&void 0!==r?r:this.timeout);return await(null===(s=e.body)||void 0===s?void 0:s.cancel()),e.ok?"ok":"error"}catch(e){return"AbortError"===e.name?"timed out":"error"}}}updateJoinPayload(e){this.joinPush.updatePayload(e)}unsubscribe(e=this.timeout){this.state=a.leaving;const t=()=>{this.socket.log("channel",`leave ${this.topic}`),this._trigger(l.close,"leave",this._joinRef())};this.joinPush.destroy();let r=null;return new Promise(s=>{r=new S(this,l.leave,{},e),r.receive("ok",()=>{t(),s("ok")}).receive("timeout",()=>{t(),s("timed out")}).receive("error",()=>{s("error")}),r.send(),this._canPush()||r.trigger("ok",{})}).finally(()=>{null==r||r.destroy()})}teardown(){this.pushBuffer.forEach(e=>e.destroy()),this.pushBuffer=[],this.rejoinTimer.reset(),this.joinPush.destroy(),this.state=a.closed,this.bindings={}}async _fetchWithTimeout(e,t,r){const s=new AbortController,n=setTimeout(()=>s.abort(),r),i=await this.socket.fetch(e,Object.assign(Object.assign({},t),{signal:s.signal}));return clearTimeout(n),i}_push(e,t,r=this.timeout){if(!this.joinedOnce)throw`tried to push '${e}' to '${this.topic}' before joining. Use channel.subscribe() before pushing events`;let s=new S(this,e,t,r);return this._canPush()?s.send():this._addToPushBuffer(s),s}_addToPushBuffer(e){if(e.startTimeout(),this.pushBuffer.push(e),this.pushBuffer.length>100){const e=this.pushBuffer.shift();e&&(e.destroy(),this.socket.log("channel",`discarded push due to buffer overflow: ${e.event}`,e.payload))}}_onMessage(e,t,r){return t}_isMember(e){return this.topic===e}_joinRef(){return this.joinPush.ref}_trigger(e,t,r){var s,n;const i=e.toLocaleLowerCase(),{close:o,error:a,leave:c,join:u}=l;if(r&&[o,a,c,u].indexOf(i)>=0&&r!==this._joinRef())return;let h=this._onMessage(i,t,r);if(t&&!h)throw"channel onMessage callbacks must return the payload, modified or unmodified";["insert","update","delete"].includes(i)?null===(s=this.bindings.postgres_changes)||void 0===s||s.filter(e=>{var t,r,s;return"*"===(null===(t=e.filter)||void 0===t?void 0:t.event)||(null===(s=null===(r=e.filter)||void 0===r?void 0:r.event)||void 0===s?void 0:s.toLocaleLowerCase())===i}).map(e=>e.callback(h,r)):null===(n=this.bindings[i])||void 0===n||n.filter(e=>{var r,s,n,o,a,l;if(["broadcast","presence","postgres_changes"].includes(i)){if("id"in e){const i=e.id,o=null===(r=e.filter)||void 0===r?void 0:r.event;return i&&(null===(s=t.ids)||void 0===s?void 0:s.includes(i))&&("*"===o||(null==o?void 0:o.toLocaleLowerCase())===(null===(n=t.data)||void 0===n?void 0:n.type.toLocaleLowerCase()))}{const r=null===(a=null===(o=null==e?void 0:e.filter)||void 0===o?void 0:o.event)||void 0===a?void 0:a.toLocaleLowerCase();return"*"===r||r===(null===(l=null==t?void 0:t.event)||void 0===l?void 0:l.toLocaleLowerCase())}}return e.type.toLocaleLowerCase()===i}).map(e=>{if("object"==typeof h&&"ids"in h){const e=h.data,{schema:t,table:r,commit_timestamp:s,type:n,errors:i}=e,o={schema:t,table:r,commit_timestamp:s,eventType:n,new:{},old:{},errors:i};h=Object.assign(Object.assign({},o),this._getPayloadRecords(e))}e.callback(h,r)})}_isClosed(){return this.state===a.closed}_isJoined(){return this.state===a.joined}_isJoining(){return this.state===a.joining}_isLeaving(){return this.state===a.leaving}_replyEventName(e){return`chan_reply_${e}`}_on(e,t,r){const s=e.toLocaleLowerCase(),n={type:s,filter:t,callback:r};return this.bindings[s]?this.bindings[s].push(n):this.bindings[s]=[n],this}_off(e,t){const r=e.toLocaleLowerCase();return this.bindings[r]&&(this.bindings[r]=this.bindings[r].filter(e=>{var s;return!((null===(s=e.type)||void 0===s?void 0:s.toLocaleLowerCase())===r&&I.isEqual(e.filter,t))})),this}static isEqual(e,t){if(Object.keys(e).length!==Object.keys(t).length)return!1;for(const r in e)if(e[r]!==t[r])return!1;return!0}static isFilterValueEqual(e,t){return(null!=e?e:void 0)===(null!=t?t:void 0)}_rejoinUntilConnected(){this.rejoinTimer.scheduleTimeout(),this.socket.isConnected()&&this._rejoin()}_onClose(e){this._on(l.close,{},e)}_onError(e){this._on(l.error,{},t=>e(t))}_canPush(){return this.socket.isConnected()&&this._isJoined()}_rejoin(e=this.timeout){this._isLeaving()||(this.socket._leaveOpenTopic(this.topic),this.state=a.joining,this.joinPush.resend(e))}_getPayloadRecords(e){const t={new:{},old:{}};return"INSERT"!==e.type&&"UPDATE"!==e.type||(t.new=p(e.columns,e.record)),"UPDATE"!==e.type&&"DELETE"!==e.type||(t.old=p(e.columns,e.old_record)),t}}const C=()=>{},$=[1e3,2e3,5e3,1e4];class x{constructor(e,t){var r;if(this.accessTokenValue=null,this.apiKey=null,this._manuallySetToken=!1,this.channels=new Array,this.endPoint="",this.httpEndpoint="",this.headers={},this.params={},this.timeout=1e4,this.transport=null,this.heartbeatIntervalMs=25e3,this.heartbeatTimer=void 0,this.pendingHeartbeatRef=null,this.heartbeatCallback=C,this.ref=0,this.reconnectTimer=null,this.vsn=i,this.logger=C,this.conn=null,this.sendBuffer=[],this.serializer=new d,this.stateChangeCallbacks={open:[],close:[],error:[],message:[]},this.accessToken=null,this._connectionState="disconnected",this._wasManualDisconnect=!1,this._authPromise=null,this._resolveFetch=e=>e?(...t)=>e(...t):(...e)=>fetch(...e),!(null===(r=null==t?void 0:t.params)||void 0===r?void 0:r.apikey))throw new Error("API key is required to connect to Realtime");this.apiKey=t.params.apikey,this.endPoint=`${e}/${c.websocket}`,this.httpEndpoint=k(e),this._initializeOptions(t),this._setupReconnectionTimer(),this.fetch=this._resolveFetch(null==t?void 0:t.fetch)}connect(){if(!(this.isConnecting()||this.isDisconnecting()||null!==this.conn&&this.isConnected())){if(this._setConnectionState("connecting"),this.accessToken&&!this._authPromise&&this._setAuthSafely("connect"),this.transport)this.conn=new this.transport(this.endpointURL());else try{this.conn=s.createWebSocket(this.endpointURL())}catch(e){this._setConnectionState("disconnected");const t=e.message;if(t.includes("Node.js"))throw new Error(`${t}\n\nTo use Realtime in Node.js, you need to provide a WebSocket implementation:\n\nOption 1: Use Node.js 22+ which has native WebSocket support\nOption 2: Install and provide the "ws" package:\n\n  npm install ws\n\n  import ws from "ws"\n  const client = new RealtimeClient(url, {\n    ...options,\n    transport: ws\n  })`);throw new Error(`WebSocket not available: ${t}`)}this._setupConnectionHandlers()}}endpointURL(){return this._appendParams(this.endPoint,Object.assign({},this.params,{vsn:this.vsn}))}disconnect(e,t){if(!this.isDisconnecting())if(this._setConnectionState("disconnecting",!0),this.conn){const r=setTimeout(()=>{this._setConnectionState("disconnected")},100);this.conn.onclose=()=>{clearTimeout(r),this._setConnectionState("disconnected")},"function"==typeof this.conn.close&&(e?this.conn.close(e,null!=t?t:""):this.conn.close()),this._teardownConnection()}else this._setConnectionState("disconnected")}getChannels(){return this.channels}async removeChannel(e){const t=await e.unsubscribe();return 0===this.channels.length&&this.disconnect(),t}async removeAllChannels(){const e=await Promise.all(this.channels.map(e=>e.unsubscribe()));return this.channels=[],this.disconnect(),e}log(e,t,r){this.logger(e,t,r)}connectionState(){switch(this.conn&&this.conn.readyState){case o.connecting:return u.Connecting;case o.open:return u.Open;case o.closing:return u.Closing;default:return u.Closed}}isConnected(){return this.connectionState()===u.Open}isConnecting(){return"connecting"===this._connectionState}isDisconnecting(){return"disconnecting"===this._connectionState}channel(e,t={config:{}}){const r=`realtime:${e}`,s=this.getChannels().find(e=>e.topic===r);if(s)return s;{const r=new I(`realtime:${e}`,t,this);return this.channels.push(r),r}}push(e){const{topic:t,event:r,payload:s,ref:n}=e,i=()=>{this.encode(e,e=>{var t;null===(t=this.conn)||void 0===t||t.send(e)})};this.log("push",`${t} ${r} (${n})`,s),this.isConnected()?i():this.sendBuffer.push(i)}async setAuth(e=null){this._authPromise=this._performAuth(e);try{await this._authPromise}finally{this._authPromise=null}}_isManualToken(){return this._manuallySetToken}async sendHeartbeat(){var e;if(this.isConnected()){if(this.pendingHeartbeatRef){this.pendingHeartbeatRef=null,this.log("transport","heartbeat timeout. Attempting to re-establish connection");try{this.heartbeatCallback("timeout")}catch(e){this.log("error","error in heartbeat callback",e)}return this._wasManualDisconnect=!1,null===(e=this.conn)||void 0===e||e.close(1e3,"heartbeat timeout"),void setTimeout(()=>{var e;this.isConnected()||null===(e=this.reconnectTimer)||void 0===e||e.scheduleTimeout()},100)}this.pendingHeartbeatRef=this._makeRef(),this.push({topic:"phoenix",event:"heartbeat",payload:{},ref:this.pendingHeartbeatRef});try{this.heartbeatCallback("sent")}catch(e){this.log("error","error in heartbeat callback",e)}this._setAuthSafely("heartbeat")}else try{this.heartbeatCallback("disconnected")}catch(e){this.log("error","error in heartbeat callback",e)}}onHeartbeat(e){this.heartbeatCallback=e}flushSendBuffer(){this.isConnected()&&this.sendBuffer.length>0&&(this.sendBuffer.forEach(e=>e()),this.sendBuffer=[])}_makeRef(){let e=this.ref+1;return e===this.ref?this.ref=0:this.ref=e,this.ref.toString()}_leaveOpenTopic(e){let t=this.channels.find(t=>t.topic===e&&(t._isJoined()||t._isJoining()));t&&(this.log("transport",`leaving duplicate topic "${e}"`),t.unsubscribe())}_remove(e){this.channels=this.channels.filter(t=>t.topic!==e.topic)}_onConnMessage(e){this.decode(e.data,e=>{if("phoenix"===e.topic&&"phx_reply"===e.event)try{this.heartbeatCallback("ok"===e.payload.status?"ok":"error")}catch(e){this.log("error","error in heartbeat callback",e)}e.ref&&e.ref===this.pendingHeartbeatRef&&(this.pendingHeartbeatRef=null);const{topic:t,event:r,payload:s,ref:n}=e,i=n?`(${n})`:"",o=s.status||"";this.log("receive",`${o} ${t} ${r} ${i}`.trim(),s),this.channels.filter(e=>e._isMember(t)).forEach(e=>e._trigger(r,s,n)),this._triggerStateCallbacks("message",e)})}_clearTimer(e){var t;"heartbeat"===e&&this.heartbeatTimer?(clearInterval(this.heartbeatTimer),this.heartbeatTimer=void 0):"reconnect"===e&&(null===(t=this.reconnectTimer)||void 0===t||t.reset())}_clearAllTimers(){this._clearTimer("heartbeat"),this._clearTimer("reconnect")}_setupConnectionHandlers(){this.conn&&("binaryType"in this.conn&&(this.conn.binaryType="arraybuffer"),this.conn.onopen=()=>this._onConnOpen(),this.conn.onerror=e=>this._onConnError(e),this.conn.onmessage=e=>this._onConnMessage(e),this.conn.onclose=e=>this._onConnClose(e))}_teardownConnection(){if(this.conn){if(this.conn.readyState===o.open||this.conn.readyState===o.connecting)try{this.conn.close()}catch(e){this.log("error","Error closing connection",e)}this.conn.onopen=null,this.conn.onerror=null,this.conn.onmessage=null,this.conn.onclose=null,this.conn=null}this._clearAllTimers(),this._terminateWorker(),this.channels.forEach(e=>e.teardown())}_onConnOpen(){this._setConnectionState("connected"),this.log("transport",`connected to ${this.endpointURL()}`),(this._authPromise||(this.accessToken&&!this.accessTokenValue?this.setAuth():Promise.resolve())).then(()=>{this.flushSendBuffer()}).catch(e=>{this.log("error","error waiting for auth on connect",e),this.flushSendBuffer()}),this._clearTimer("reconnect"),this.worker?this.workerRef||this._startWorkerHeartbeat():this._startHeartbeat(),this._triggerStateCallbacks("open")}_startHeartbeat(){this.heartbeatTimer&&clearInterval(this.heartbeatTimer),this.heartbeatTimer=setInterval(()=>this.sendHeartbeat(),this.heartbeatIntervalMs)}_startWorkerHeartbeat(){this.workerUrl?this.log("worker",`starting worker for from ${this.workerUrl}`):this.log("worker","starting default worker");const e=this._workerObjectUrl(this.workerUrl);this.workerRef=new Worker(e),this.workerRef.onerror=e=>{this.log("worker","worker error",e.message),this._terminateWorker()},this.workerRef.onmessage=e=>{"keepAlive"===e.data.event&&this.sendHeartbeat()},this.workerRef.postMessage({event:"start",interval:this.heartbeatIntervalMs})}_terminateWorker(){this.workerRef&&(this.log("worker","terminating worker"),this.workerRef.terminate(),this.workerRef=void 0)}_onConnClose(e){var t;this._setConnectionState("disconnected"),this.log("transport","close",e),this._triggerChanError(),this._clearTimer("heartbeat"),this._wasManualDisconnect||null===(t=this.reconnectTimer)||void 0===t||t.scheduleTimeout(),this._triggerStateCallbacks("close",e)}_onConnError(e){this._setConnectionState("disconnected"),this.log("transport",`${e}`),this._triggerChanError(),this._triggerStateCallbacks("error",e)}_triggerChanError(){this.channels.forEach(e=>e._trigger(l.error))}_appendParams(e,t){if(0===Object.keys(t).length)return e;const r=e.match(/\?/)?"&":"?";return`${e}${r}${new URLSearchParams(t)}`}_workerObjectUrl(e){let t;if(e)t=e;else{const e=new Blob(['\n  addEventListener("message", (e) => {\n    if (e.data.event === "start") {\n      setInterval(() => postMessage({ event: "keepAlive" }), e.data.interval);\n    }\n  });'],{type:"application/javascript"});t=URL.createObjectURL(e)}return t}_setConnectionState(e,t=!1){this._connectionState=e,"connecting"===e?this._wasManualDisconnect=!1:"disconnecting"===e&&(this._wasManualDisconnect=t)}async _performAuth(e=null){let t,r=!1;if(e)t=e,r=!0;else if(this.accessToken)try{t=await this.accessToken()}catch(e){this.log("error","Error fetching access token from callback",e),t=this.accessTokenValue}else t=this.accessTokenValue;r?this._manuallySetToken=!0:this.accessToken&&(this._manuallySetToken=!1),this.accessTokenValue!=t&&(this.accessTokenValue=t,this.channels.forEach(e=>{const r={access_token:t,version:"realtime-js/2.87.3"};t&&e.updateJoinPayload(r),e.joinedOnce&&e._isJoined()&&e._push(l.access_token,{access_token:t})}))}async _waitForAuthIfNeeded(){this._authPromise&&await this._authPromise}_setAuthSafely(e="general"){this._isManualToken()||this.setAuth().catch(t=>{this.log("error",`Error setting auth in ${e}`,t)})}_triggerStateCallbacks(e,t){try{this.stateChangeCallbacks[e].forEach(r=>{try{r(t)}catch(t){this.log("error",`error in ${e} callback`,t)}})}catch(t){this.log("error",`error triggering ${e} callbacks`,t)}}_setupReconnectionTimer(){this.reconnectTimer=new f(async()=>{setTimeout(async()=>{await this._waitForAuthIfNeeded(),this.isConnected()||this.connect()},10)},this.reconnectAfterMs)}_initializeOptions(e){var t,r,s,o,a,l,c,u,h,d,f,p;switch(this.transport=null!==(t=null==e?void 0:e.transport)&&void 0!==t?t:null,this.timeout=null!==(r=null==e?void 0:e.timeout)&&void 0!==r?r:1e4,this.heartbeatIntervalMs=null!==(s=null==e?void 0:e.heartbeatIntervalMs)&&void 0!==s?s:25e3,this.worker=null!==(o=null==e?void 0:e.worker)&&void 0!==o&&o,this.accessToken=null!==(a=null==e?void 0:e.accessToken)&&void 0!==a?a:null,this.heartbeatCallback=null!==(l=null==e?void 0:e.heartbeatCallback)&&void 0!==l?l:C,this.vsn=null!==(c=null==e?void 0:e.vsn)&&void 0!==c?c:i,(null==e?void 0:e.params)&&(this.params=e.params),(null==e?void 0:e.logger)&&(this.logger=e.logger),((null==e?void 0:e.logLevel)||(null==e?void 0:e.log_level))&&(this.logLevel=e.logLevel||e.log_level,this.params=Object.assign(Object.assign({},this.params),{log_level:this.logLevel})),this.reconnectAfterMs=null!==(u=null==e?void 0:e.reconnectAfterMs)&&void 0!==u?u:e=>$[e-1]||1e4,this.vsn){case n:this.encode=null!==(h=null==e?void 0:e.encode)&&void 0!==h?h:(e,t)=>t(JSON.stringify(e)),this.decode=null!==(d=null==e?void 0:e.decode)&&void 0!==d?d:(e,t)=>t(JSON.parse(e));break;case"2.0.0":this.encode=null!==(f=null==e?void 0:e.encode)&&void 0!==f?f:this.serializer.encode.bind(this.serializer),this.decode=null!==(p=null==e?void 0:e.decode)&&void 0!==p?p:this.serializer.decode.bind(this.serializer);break;default:throw new Error(`Unsupported serializer version: ${this.vsn}`)}if(this.worker){if("undefined"!=typeof window&&!window.Worker)throw new Error("Web Worker is not supported");this.workerUrl=null==e?void 0:e.workerUrl}}}},705:(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0});const s=r(823).__importDefault(r(973));t.default=class{constructor(e,{headers:t={},schema:r,fetch:s}){this.url=e,this.headers=new Headers(t),this.schema=r,this.fetch=s}select(e,t){const{head:r=!1,count:n}=null!=t?t:{},i=r?"HEAD":"GET";let o=!1;const a=(null!=e?e:"*").split("").map(e=>/\s/.test(e)&&!o?"":('"'===e&&(o=!o),e)).join("");return this.url.searchParams.set("select",a),n&&this.headers.append("Prefer",`count=${n}`),new s.default({method:i,url:this.url,headers:this.headers,schema:this.schema,fetch:this.fetch})}insert(e,{count:t,defaultToNull:r=!0}={}){var n;if(t&&this.headers.append("Prefer",`count=${t}`),r||this.headers.append("Prefer","missing=default"),Array.isArray(e)){const t=e.reduce((e,t)=>e.concat(Object.keys(t)),[]);if(t.length>0){const e=[...new Set(t)].map(e=>`"${e}"`);this.url.searchParams.set("columns",e.join(","))}}return new s.default({method:"POST",url:this.url,headers:this.headers,schema:this.schema,body:e,fetch:null!==(n=this.fetch)&&void 0!==n?n:fetch})}upsert(e,{onConflict:t,ignoreDuplicates:r=!1,count:n,defaultToNull:i=!0}={}){var o;if(this.headers.append("Prefer",`resolution=${r?"ignore":"merge"}-duplicates`),void 0!==t&&this.url.searchParams.set("on_conflict",t),n&&this.headers.append("Prefer",`count=${n}`),i||this.headers.append("Prefer","missing=default"),Array.isArray(e)){const t=e.reduce((e,t)=>e.concat(Object.keys(t)),[]);if(t.length>0){const e=[...new Set(t)].map(e=>`"${e}"`);this.url.searchParams.set("columns",e.join(","))}}return new s.default({method:"POST",url:this.url,headers:this.headers,schema:this.schema,body:e,fetch:null!==(o=this.fetch)&&void 0!==o?o:fetch})}update(e,{count:t}={}){var r;return t&&this.headers.append("Prefer",`count=${t}`),new s.default({method:"PATCH",url:this.url,headers:this.headers,schema:this.schema,body:e,fetch:null!==(r=this.fetch)&&void 0!==r?r:fetch})}delete({count:e}={}){var t;return e&&this.headers.append("Prefer",`count=${e}`),new s.default({method:"DELETE",url:this.url,headers:this.headers,schema:this.schema,fetch:null!==(t=this.fetch)&&void 0!==t?t:fetch})}}},739:(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.PostgrestError=t.PostgrestBuilder=t.PostgrestTransformBuilder=t.PostgrestFilterBuilder=t.PostgrestQueryBuilder=t.PostgrestClient=void 0;const s=r(823),n=s.__importDefault(r(597));t.PostgrestClient=n.default;const i=s.__importDefault(r(705));t.PostgrestQueryBuilder=i.default;const o=s.__importDefault(r(973));t.PostgrestFilterBuilder=o.default;const a=s.__importDefault(r(817));t.PostgrestTransformBuilder=a.default;const l=s.__importDefault(r(595));t.PostgrestBuilder=l.default;const c=s.__importDefault(r(886));t.PostgrestError=c.default,t.default={PostgrestClient:n.default,PostgrestQueryBuilder:i.default,PostgrestFilterBuilder:o.default,PostgrestTransformBuilder:a.default,PostgrestBuilder:l.default,PostgrestError:c.default}},795:(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.SupabaseAuthClient=void 0;const s=r(166);class n extends s.AuthClient{constructor(e){super(e)}}t.SupabaseAuthClient=n},817:(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0});const s=r(823).__importDefault(r(595));class n extends s.default{select(e){let t=!1;const r=(null!=e?e:"*").split("").map(e=>/\s/.test(e)&&!t?"":('"'===e&&(t=!t),e)).join("");return this.url.searchParams.set("select",r),this.headers.append("Prefer","return=representation"),this}order(e,{ascending:t=!0,nullsFirst:r,foreignTable:s,referencedTable:n=s}={}){const i=n?`${n}.order`:"order",o=this.url.searchParams.get(i);return this.url.searchParams.set(i,`${o?`${o},`:""}${e}.${t?"asc":"desc"}${void 0===r?"":r?".nullsfirst":".nullslast"}`),this}limit(e,{foreignTable:t,referencedTable:r=t}={}){const s=void 0===r?"limit":`${r}.limit`;return this.url.searchParams.set(s,`${e}`),this}range(e,t,{foreignTable:r,referencedTable:s=r}={}){const n=void 0===s?"offset":`${s}.offset`,i=void 0===s?"limit":`${s}.limit`;return this.url.searchParams.set(n,`${e}`),this.url.searchParams.set(i,""+(t-e+1)),this}abortSignal(e){return this.signal=e,this}single(){return this.headers.set("Accept","application/vnd.pgrst.object+json"),this}maybeSingle(){return"GET"===this.method?this.headers.set("Accept","application/json"):this.headers.set("Accept","application/vnd.pgrst.object+json"),this.isMaybeSingle=!0,this}csv(){return this.headers.set("Accept","text/csv"),this}geojson(){return this.headers.set("Accept","application/geo+json"),this}explain({analyze:e=!1,verbose:t=!1,settings:r=!1,buffers:s=!1,wal:n=!1,format:i="text"}={}){var o;const a=[e?"analyze":null,t?"verbose":null,r?"settings":null,s?"buffers":null,n?"wal":null].filter(Boolean).join("|"),l=null!==(o=this.headers.get("Accept"))&&void 0!==o?o:"application/json";return this.headers.set("Accept",`application/vnd.pgrst.plan+${i}; for="${l}"; options=${a};`),this}rollback(){return this.headers.append("Prefer","tx=rollback"),this}returns(){return this}maxAffected(e){return this.headers.append("Prefer","handling=strict"),this.headers.append("Prefer",`max-affected=${e}`),this}}t.default=n},819:(e,t)=>{function r(e){return e.endsWith("/")?e:e+"/"}Object.defineProperty(t,"__esModule",{value:!0}),t.isBrowser=void 0,t.uuid=function(){return"xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx".replace(/[xy]/g,function(e){var t=16*Math.random()|0;return("x"==e?t:3&t|8).toString(16)})},t.ensureTrailingSlash=r,t.applySettingDefaults=function(e,t){var r,s;const{db:n,auth:i,realtime:o,global:a}=e,{db:l,auth:c,realtime:u,global:h}=t,d={db:Object.assign(Object.assign({},l),n),auth:Object.assign(Object.assign({},c),i),realtime:Object.assign(Object.assign({},u),o),storage:{},global:Object.assign(Object.assign(Object.assign({},h),a),{headers:Object.assign(Object.assign({},null!==(r=null==h?void 0:h.headers)&&void 0!==r?r:{}),null!==(s=null==a?void 0:a.headers)&&void 0!==s?s:{})}),accessToken:async()=>""};return e.accessToken?d.accessToken=e.accessToken:delete d.accessToken,d},t.validateSupabaseUrl=function(e){const t=null==e?void 0:e.trim();if(!t)throw new Error("supabaseUrl is required.");if(!t.match(/^https?:\/\//i))throw new Error("Invalid supabaseUrl: Must be a valid HTTP or HTTPS URL.");try{return new URL(r(t))}catch(e){throw Error("Invalid supabaseUrl: Provided URL is malformed.")}},t.isBrowser=()=>"undefined"!=typeof window},822:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0}),t.version=void 0,t.version="2.87.3"},823:(e,t,r)=>{r.r(t),r.d(t,{__addDisposableResource:()=>N,__assign:()=>i,__asyncDelegator:()=>T,__asyncGenerator:()=>S,__asyncValues:()=>O,__await:()=>k,__awaiter:()=>p,__classPrivateFieldGet:()=>C,__classPrivateFieldIn:()=>x,__classPrivateFieldSet:()=>$,__createBinding:()=>w,__decorate:()=>a,__disposeResources:()=>D,__esDecorate:()=>c,__exportStar:()=>y,__extends:()=>n,__generator:()=>g,__importDefault:()=>I,__importStar:()=>P,__makeTemplateObject:()=>j,__metadata:()=>f,__param:()=>l,__propKey:()=>h,__read:()=>v,__rest:()=>o,__rewriteRelativeImportExtension:()=>L,__runInitializers:()=>u,__setFunctionName:()=>d,__spread:()=>m,__spreadArray:()=>E,__spreadArrays:()=>b,__values:()=>_,default:()=>B});var s=function(e,t){return s=Object.setPrototypeOf||{__proto__:[]}instanceof Array&&function(e,t){e.__proto__=t}||function(e,t){for(var r in t)Object.prototype.hasOwnProperty.call(t,r)&&(e[r]=t[r])},s(e,t)};function n(e,t){if("function"!=typeof t&&null!==t)throw new TypeError("Class extends value "+String(t)+" is not a constructor or null");function r(){this.constructor=e}s(e,t),e.prototype=null===t?Object.create(t):(r.prototype=t.prototype,new r)}var i=function(){return i=Object.assign||function(e){for(var t,r=1,s=arguments.length;r<s;r++)for(var n in t=arguments[r])Object.prototype.hasOwnProperty.call(t,n)&&(e[n]=t[n]);return e},i.apply(this,arguments)};function o(e,t){var r={};for(var s in e)Object.prototype.hasOwnProperty.call(e,s)&&t.indexOf(s)<0&&(r[s]=e[s]);if(null!=e&&"function"==typeof Object.getOwnPropertySymbols){var n=0;for(s=Object.getOwnPropertySymbols(e);n<s.length;n++)t.indexOf(s[n])<0&&Object.prototype.propertyIsEnumerable.call(e,s[n])&&(r[s[n]]=e[s[n]])}return r}function a(e,t,r,s){var n,i=arguments.length,o=i<3?t:null===s?s=Object.getOwnPropertyDescriptor(t,r):s;if("object"==typeof Reflect&&"function"==typeof Reflect.decorate)o=Reflect.decorate(e,t,r,s);else for(var a=e.length-1;a>=0;a--)(n=e[a])&&(o=(i<3?n(o):i>3?n(t,r,o):n(t,r))||o);return i>3&&o&&Object.defineProperty(t,r,o),o}function l(e,t){return function(r,s){t(r,s,e)}}function c(e,t,r,s,n,i){function o(e){if(void 0!==e&&"function"!=typeof e)throw new TypeError("Function expected");return e}for(var a,l=s.kind,c="getter"===l?"get":"setter"===l?"set":"value",u=!t&&e?s.static?e:e.prototype:null,h=t||(u?Object.getOwnPropertyDescriptor(u,s.name):{}),d=!1,f=r.length-1;f>=0;f--){var p={};for(var g in s)p[g]="access"===g?{}:s[g];for(var g in s.access)p.access[g]=s.access[g];p.addInitializer=function(e){if(d)throw new TypeError("Cannot add initializers after decoration has completed");i.push(o(e||null))};var w=(0,r[f])("accessor"===l?{get:h.get,set:h.set}:h[c],p);if("accessor"===l){if(void 0===w)continue;if(null===w||"object"!=typeof w)throw new TypeError("Object expected");(a=o(w.get))&&(h.get=a),(a=o(w.set))&&(h.set=a),(a=o(w.init))&&n.unshift(a)}else(a=o(w))&&("field"===l?n.unshift(a):h[c]=a)}u&&Object.defineProperty(u,s.name,h),d=!0}function u(e,t,r){for(var s=arguments.length>2,n=0;n<t.length;n++)r=s?t[n].call(e,r):t[n].call(e);return s?r:void 0}function h(e){return"symbol"==typeof e?e:"".concat(e)}function d(e,t,r){return"symbol"==typeof t&&(t=t.description?"[".concat(t.description,"]"):""),Object.defineProperty(e,"name",{configurable:!0,value:r?"".concat(r," ",t):t})}function f(e,t){if("object"==typeof Reflect&&"function"==typeof Reflect.metadata)return Reflect.metadata(e,t)}function p(e,t,r,s){return new(r||(r=Promise))(function(n,i){function o(e){try{l(s.next(e))}catch(e){i(e)}}function a(e){try{l(s.throw(e))}catch(e){i(e)}}function l(e){var t;e.done?n(e.value):(t=e.value,t instanceof r?t:new r(function(e){e(t)})).then(o,a)}l((s=s.apply(e,t||[])).next())})}function g(e,t){var r,s,n,i={label:0,sent:function(){if(1&n[0])throw n[1];return n[1]},trys:[],ops:[]},o=Object.create(("function"==typeof Iterator?Iterator:Object).prototype);return o.next=a(0),o.throw=a(1),o.return=a(2),"function"==typeof Symbol&&(o[Symbol.iterator]=function(){return this}),o;function a(a){return function(l){return function(a){if(r)throw new TypeError("Generator is already executing.");for(;o&&(o=0,a[0]&&(i=0)),i;)try{if(r=1,s&&(n=2&a[0]?s.return:a[0]?s.throw||((n=s.return)&&n.call(s),0):s.next)&&!(n=n.call(s,a[1])).done)return n;switch(s=0,n&&(a=[2&a[0],n.value]),a[0]){case 0:case 1:n=a;break;case 4:return i.label++,{value:a[1],done:!1};case 5:i.label++,s=a[1],a=[0];continue;case 7:a=i.ops.pop(),i.trys.pop();continue;default:if(!((n=(n=i.trys).length>0&&n[n.length-1])||6!==a[0]&&2!==a[0])){i=0;continue}if(3===a[0]&&(!n||a[1]>n[0]&&a[1]<n[3])){i.label=a[1];break}if(6===a[0]&&i.label<n[1]){i.label=n[1],n=a;break}if(n&&i.label<n[2]){i.label=n[2],i.ops.push(a);break}n[2]&&i.ops.pop(),i.trys.pop();continue}a=t.call(e,i)}catch(e){a=[6,e],s=0}finally{r=n=0}if(5&a[0])throw a[1];return{value:a[0]?a[1]:void 0,done:!0}}([a,l])}}}var w=Object.create?function(e,t,r,s){void 0===s&&(s=r);var n=Object.getOwnPropertyDescriptor(t,r);n&&!("get"in n?!t.__esModule:n.writable||n.configurable)||(n={enumerable:!0,get:function(){return t[r]}}),Object.defineProperty(e,s,n)}:function(e,t,r,s){void 0===s&&(s=r),e[s]=t[r]};function y(e,t){for(var r in e)"default"===r||Object.prototype.hasOwnProperty.call(t,r)||w(t,e,r)}function _(e){var t="function"==typeof Symbol&&Symbol.iterator,r=t&&e[t],s=0;if(r)return r.call(e);if(e&&"number"==typeof e.length)return{next:function(){return e&&s>=e.length&&(e=void 0),{value:e&&e[s++],done:!e}}};throw new TypeError(t?"Object is not iterable.":"Symbol.iterator is not defined.")}function v(e,t){var r="function"==typeof Symbol&&e[Symbol.iterator];if(!r)return e;var s,n,i=r.call(e),o=[];try{for(;(void 0===t||t-- >0)&&!(s=i.next()).done;)o.push(s.value)}catch(e){n={error:e}}finally{try{s&&!s.done&&(r=i.return)&&r.call(i)}finally{if(n)throw n.error}}return o}function m(){for(var e=[],t=0;t<arguments.length;t++)e=e.concat(v(arguments[t]));return e}function b(){for(var e=0,t=0,r=arguments.length;t<r;t++)e+=arguments[t].length;var s=Array(e),n=0;for(t=0;t<r;t++)for(var i=arguments[t],o=0,a=i.length;o<a;o++,n++)s[n]=i[o];return s}function E(e,t,r){if(r||2===arguments.length)for(var s,n=0,i=t.length;n<i;n++)!s&&n in t||(s||(s=Array.prototype.slice.call(t,0,n)),s[n]=t[n]);return e.concat(s||Array.prototype.slice.call(t))}function k(e){return this instanceof k?(this.v=e,this):new k(e)}function S(e,t,r){if(!Symbol.asyncIterator)throw new TypeError("Symbol.asyncIterator is not defined.");var s,n=r.apply(e,t||[]),i=[];return s=Object.create(("function"==typeof AsyncIterator?AsyncIterator:Object).prototype),o("next"),o("throw"),o("return",function(e){return function(t){return Promise.resolve(t).then(e,c)}}),s[Symbol.asyncIterator]=function(){return this},s;function o(e,t){n[e]&&(s[e]=function(t){return new Promise(function(r,s){i.push([e,t,r,s])>1||a(e,t)})},t&&(s[e]=t(s[e])))}function a(e,t){try{(r=n[e](t)).value instanceof k?Promise.resolve(r.value.v).then(l,c):u(i[0][2],r)}catch(e){u(i[0][3],e)}var r}function l(e){a("next",e)}function c(e){a("throw",e)}function u(e,t){e(t),i.shift(),i.length&&a(i[0][0],i[0][1])}}function T(e){var t,r;return t={},s("next"),s("throw",function(e){throw e}),s("return"),t[Symbol.iterator]=function(){return this},t;function s(s,n){t[s]=e[s]?function(t){return(r=!r)?{value:k(e[s](t)),done:!1}:n?n(t):t}:n}}function O(e){if(!Symbol.asyncIterator)throw new TypeError("Symbol.asyncIterator is not defined.");var t,r=e[Symbol.asyncIterator];return r?r.call(e):(e=_(e),t={},s("next"),s("throw"),s("return"),t[Symbol.asyncIterator]=function(){return this},t);function s(r){t[r]=e[r]&&function(t){return new Promise(function(s,n){!function(e,t,r,s){Promise.resolve(s).then(function(t){e({value:t,done:r})},t)}(s,n,(t=e[r](t)).done,t.value)})}}}function j(e,t){return Object.defineProperty?Object.defineProperty(e,"raw",{value:t}):e.raw=t,e}var R=Object.create?function(e,t){Object.defineProperty(e,"default",{enumerable:!0,value:t})}:function(e,t){e.default=t},A=function(e){return A=Object.getOwnPropertyNames||function(e){var t=[];for(var r in e)Object.prototype.hasOwnProperty.call(e,r)&&(t[t.length]=r);return t},A(e)};function P(e){if(e&&e.__esModule)return e;var t={};if(null!=e)for(var r=A(e),s=0;s<r.length;s++)"default"!==r[s]&&w(t,e,r[s]);return R(t,e),t}function I(e){return e&&e.__esModule?e:{default:e}}function C(e,t,r,s){if("a"===r&&!s)throw new TypeError("Private accessor was defined without a getter");if("function"==typeof t?e!==t||!s:!t.has(e))throw new TypeError("Cannot read private member from an object whose class did not declare it");return"m"===r?s:"a"===r?s.call(e):s?s.value:t.get(e)}function $(e,t,r,s,n){if("m"===s)throw new TypeError("Private method is not writable");if("a"===s&&!n)throw new TypeError("Private accessor was defined without a setter");if("function"==typeof t?e!==t||!n:!t.has(e))throw new TypeError("Cannot write private member to an object whose class did not declare it");return"a"===s?n.call(e,r):n?n.value=r:t.set(e,r),r}function x(e,t){if(null===t||"object"!=typeof t&&"function"!=typeof t)throw new TypeError("Cannot use 'in' operator on non-object");return"function"==typeof e?t===e:e.has(t)}function N(e,t,r){if(null!=t){if("object"!=typeof t&&"function"!=typeof t)throw new TypeError("Object expected.");var s,n;if(r){if(!Symbol.asyncDispose)throw new TypeError("Symbol.asyncDispose is not defined.");s=t[Symbol.asyncDispose]}if(void 0===s){if(!Symbol.dispose)throw new TypeError("Symbol.dispose is not defined.");s=t[Symbol.dispose],r&&(n=s)}if("function"!=typeof s)throw new TypeError("Object not disposable.");n&&(s=function(){try{n.call(this)}catch(e){return Promise.reject(e)}}),e.stack.push({value:t,dispose:s,async:r})}else r&&e.stack.push({async:!0});return t}var U="function"==typeof SuppressedError?SuppressedError:function(e,t,r){var s=new Error(r);return s.name="SuppressedError",s.error=e,s.suppressed=t,s};function D(e){function t(t){e.error=e.hasError?new U(t,e.error,"An error was suppressed during disposal."):t,e.hasError=!0}var r,s=0;return function n(){for(;r=e.stack.pop();)try{if(!r.async&&1===s)return s=0,e.stack.push(r),Promise.resolve().then(n);if(r.dispose){var i=r.dispose.call(r.value);if(r.async)return s|=2,Promise.resolve(i).then(n,function(e){return t(e),n()})}else s|=1}catch(e){t(e)}if(1===s)return e.hasError?Promise.reject(e.error):Promise.resolve();if(e.hasError)throw e.error}()}function L(e,t){return"string"==typeof e&&/^\.\.?\//.test(e)?e.replace(/\.(tsx)$|((?:\.d)?)((?:\.[^./]+?)?)\.([cm]?)ts$/i,function(e,r,s,n,i){return r?t?".jsx":".js":!s||n&&i?s+n+"."+i.toLowerCase()+"js":e}):e}const B={__extends:n,__assign:i,__rest:o,__decorate:a,__param:l,__esDecorate:c,__runInitializers:u,__propKey:h,__setFunctionName:d,__metadata:f,__awaiter:p,__generator:g,__createBinding:w,__exportStar:y,__values:_,__read:v,__spread:m,__spreadArrays:b,__spreadArray:E,__await:k,__asyncGenerator:S,__asyncDelegator:T,__asyncValues:O,__makeTemplateObject:j,__importStar:P,__importDefault:I,__classPrivateFieldGet:C,__classPrivateFieldSet:$,__classPrivateFieldIn:x,__addDisposableResource:N,__disposeResources:D,__rewriteRelativeImportExtension:L}},886:(e,t)=>{Object.defineProperty(t,"__esModule",{value:!0});class r extends Error{constructor(e){super(e.message),this.name="PostgrestError",this.details=e.details,this.hint=e.hint,this.code=e.code}}t.default=r},973:(e,t,r)=>{Object.defineProperty(t,"__esModule",{value:!0});const s=r(823).__importDefault(r(817)),n=new RegExp("[,()]");class i extends s.default{eq(e,t){return this.url.searchParams.append(e,`eq.${t}`),this}neq(e,t){return this.url.searchParams.append(e,`neq.${t}`),this}gt(e,t){return this.url.searchParams.append(e,`gt.${t}`),this}gte(e,t){return this.url.searchParams.append(e,`gte.${t}`),this}lt(e,t){return this.url.searchParams.append(e,`lt.${t}`),this}lte(e,t){return this.url.searchParams.append(e,`lte.${t}`),this}like(e,t){return this.url.searchParams.append(e,`like.${t}`),this}likeAllOf(e,t){return this.url.searchParams.append(e,`like(all).{${t.join(",")}}`),this}likeAnyOf(e,t){return this.url.searchParams.append(e,`like(any).{${t.join(",")}}`),this}ilike(e,t){return this.url.searchParams.append(e,`ilike.${t}`),this}ilikeAllOf(e,t){return this.url.searchParams.append(e,`ilike(all).{${t.join(",")}}`),this}ilikeAnyOf(e,t){return this.url.searchParams.append(e,`ilike(any).{${t.join(",")}}`),this}regexMatch(e,t){return this.url.searchParams.append(e,`match.${t}`),this}regexIMatch(e,t){return this.url.searchParams.append(e,`imatch.${t}`),this}is(e,t){return this.url.searchParams.append(e,`is.${t}`),this}isDistinct(e,t){return this.url.searchParams.append(e,`isdistinct.${t}`),this}in(e,t){const r=Array.from(new Set(t)).map(e=>"string"==typeof e&&n.test(e)?`"${e}"`:`${e}`).join(",");return this.url.searchParams.append(e,`in.(${r})`),this}contains(e,t){return"string"==typeof t?this.url.searchParams.append(e,`cs.${t}`):Array.isArray(t)?this.url.searchParams.append(e,`cs.{${t.join(",")}}`):this.url.searchParams.append(e,`cs.${JSON.stringify(t)}`),this}containedBy(e,t){return"string"==typeof t?this.url.searchParams.append(e,`cd.${t}`):Array.isArray(t)?this.url.searchParams.append(e,`cd.{${t.join(",")}}`):this.url.searchParams.append(e,`cd.${JSON.stringify(t)}`),this}rangeGt(e,t){return this.url.searchParams.append(e,`sr.${t}`),this}rangeGte(e,t){return this.url.searchParams.append(e,`nxl.${t}`),this}rangeLt(e,t){return this.url.searchParams.append(e,`sl.${t}`),this}rangeLte(e,t){return this.url.searchParams.append(e,`nxr.${t}`),this}rangeAdjacent(e,t){return this.url.searchParams.append(e,`adj.${t}`),this}overlaps(e,t){return"string"==typeof t?this.url.searchParams.append(e,`ov.${t}`):this.url.searchParams.append(e,`ov.{${t.join(",")}}`),this}textSearch(e,t,{config:r,type:s}={}){let n="";"plain"===s?n="pl":"phrase"===s?n="ph":"websearch"===s&&(n="w");const i=void 0===r?"":`(${r})`;return this.url.searchParams.append(e,`${n}fts${i}.${t}`),this}match(e){return Object.entries(e).forEach(([e,t])=>{this.url.searchParams.append(e,`eq.${t}`)}),this}not(e,t,r){return this.url.searchParams.append(e,`not.${t}.${r}`),this}or(e,{foreignTable:t,referencedTable:r=t}={}){const s=r?`${r}.or`:"or";return this.url.searchParams.append(s,`(${e})`),this}filter(e,t,r){return this.url.searchParams.append(e,`${t}.${r}`),this}}t.default=i}},t={};function r(s){var n=t[s];if(void 0!==n)return n.exports;var i=t[s]={exports:{}};return e[s].call(i.exports,i,i.exports,r),i.exports}return r.d=(e,t)=>{for(var s in t)r.o(t,s)&&!r.o(e,s)&&Object.defineProperty(e,s,{enumerable:!0,get:t[s]})},r.g=function(){if("object"==typeof globalThis)return globalThis;try{return this||new Function("return this")()}catch(e){if("object"==typeof window)return window}}(),r.o=(e,t)=>Object.prototype.hasOwnProperty.call(e,t),r.r=e=>{"undefined"!=typeof Symbol&&Symbol.toStringTag&&Object.defineProperty(e,Symbol.toStringTag,{value:"Module"}),Object.defineProperty(e,"__esModule",{value:!0})},r(646)})());
```

# supabaseClient.js

```js
// Supabase Client Initialization
// This file initializes the Supabase client for use in the extension

// Import Supabase JS library (loaded via CDN in popup.html)
// The library will be available as a global: supabase

let supabaseClient = null;

// Wait for Supabase library to load
function waitForSupabase(maxAttempts = 50, interval = 100) {
  return new Promise((resolve, reject) => {
    let attempts = 0;
    const checkSupabase = () => {
      attempts++;
      if (typeof supabase !== 'undefined' && supabase.createClient) {
        console.log('[Supabase] Library loaded successfully');
        resolve();
      } else if (attempts >= maxAttempts) {
        const errorMsg = 'Supabase JS library not loaded after ' + (maxAttempts * interval / 1000) + ' seconds. ' +
          'Make sure popup.html includes the Supabase CDN script and that the extension has permission to load from cdn.jsdelivr.net.';
        console.error('[Supabase]', errorMsg);
        reject(new Error(errorMsg));
      } else {
        setTimeout(checkSupabase, interval);
      }
    };
    checkSupabase();
  });
}

async function initSupabaseClient() {
  // Wait for Supabase library to be available
  await waitForSupabase();
  
  if (typeof supabase === 'undefined' || !supabase.createClient) {
    throw new Error('Supabase JS library not loaded. Make sure popup.html includes the Supabase CDN script.');
  }
  
  if (!supabaseClient) {
    supabaseClient = supabase.createClient(
      SUPABASE_CONFIG.url,
      SUPABASE_CONFIG.anonKey,
      {
        auth: {
          persistSession: false, // Extensions should manage their own session storage
          autoRefreshToken: false,
          detectSessionInUrl: false
        }
      }
    );
  }
  
  return supabaseClient;
}

// Get or initialize the Supabase client
async function getSupabaseClient() {
  if (!supabaseClient) {
    return await initSupabaseClient();
  }
  return supabaseClient;
}


```

# supabaseConfig.js

```js
// Supabase Configuration
// Replace these values with your actual Supabase project credentials
// You can get these from your .env file or Supabase dashboard

const SUPABASE_CONFIG = {
  url: 'https://tevicnjzxcbswsffcgoy.supabase.co',  // Replace with your Supabase URL
  anonKey: 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InRldmljbmp6eGNic3dzZmZjZ295Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjU2Nzk2ODIsImV4cCI6MjA4MTI1NTY4Mn0.uBr-Hv9fWZCOdqvtxbx-rkzQbCievgwquJC30VGAGL0'              // Replace with your Supabase anon key
};

// If you want to load from environment variables (for build systems), you can do:
// const SUPABASE_CONFIG = {
//   url: process.env.VITE_SUPABASE_URL || 'https://YOUR-PROJECT-ID.supabase.co',
//   anonKey: process.env.VITE_SUPABASE_ANON_KEY || 'YOUR_PUBLIC_ANON_KEY'
// };


```

