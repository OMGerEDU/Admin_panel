# Task: Integrate Evolution API as Supplier

## Phase 1: Research & Architecture ✅
- [x] Analyze current codebase and schema
- [x] Read Evolution API documentation
- [x] Research error handling patterns
- [x] Research Baileys session recovery
- [x] Create comprehensive architecture document
- [x] Define API contracts and data flows

## Phase 2: Infrastructure Setup
- [ ] VPS Provisioning
    - [ ] Provision VPS (4GB+ RAM, Ubuntu 22.04)
    - [ ] Install Docker & Docker Compose
    - [ ] Configure firewall (allow 80, 443, 8080)
- [ ] Evolution API Deployment
    - [ ] Create `docker-compose.yml` with Postgres/Redis
    - [ ] Deploy Evolution API container
    - [ ] Configure SSL with Caddy/Nginx
    - [ ] Test `/health` endpoint accessibility
- [ ] Environment Configuration
    - [ ] Set `EVOLUTION_API_URL` in Vercel
    - [ ] Set `EVOLUTION_GLOBAL_API_KEY` in Vercel
    - [ ] Set `EVOLUTION_WEBHOOK_SECRET` in Vercel
    - [ ] Configure webhook URL in Evolution (point to Vercel)

## Phase 3: Database Schema
- [ ] Schema Design
    - [ ] Write migration: Add `provider` TEXT column (default 'green-api')
    - [ ] Write migration: Add `instance_data` JSONB column
    - [ ] Create index on `numbers(provider)`
    - [ ] Create index on `numbers(status, provider)`
- [ ] Testing
    - [ ] Test migration on local Supabase
    - [ ] Verify backward compatibility (existing GreenAPI numbers)
    - [ ] Deploy to staging
    - [ ] Deploy to production

## Phase 4: Backend - Provider Abstraction Layer
- [ ] Base Architecture
    - [ ] Create `api/_utils/providers/base.js` (abstract interface)
    - [ ] Define interface: `createInstance`, `connect`, `disconnect`, `sendMessage`, `normalizeWebhook`
- [ ] Evolution Provider
    - [ ] Implement `api/_utils/providers/evolution.js`
    - [ ] `createInstance()` - POST /instance/create
    - [ ] `connect()` - GET /instance/connect/{name}
    - [ ] `disconnect()` - DELETE /instance/delete/{name}
    - [ ] `sendTextMessage()` - POST /message/sendText
    - [ ] `sendMediaMessage()` - POST /message/sendMedia
    - [ ] `normalizeWebhook()` - Convert Baileys → Internal format
    - [ ] Implement circuit breaker pattern
    - [ ] Implement retry with exponential backoff
- [ ] GreenAPI Provider (Refactor)
    - [ ] Create `api/_utils/providers/greenapi.js`
    - [ ] Extract existing GreenAPI logic
    - [ ] Implement same interface as Evolution
    - [ ] Add normalization for GreenAPI webhooks
- [ ] Provider Factory
    - [ ] Create `api/_utils/providers/index.js`
    - [ ] `getProvider(numberRow)` → returns correct provider instance

## Phase 5: Backend - Webhook Handling
- [ ] Webhook Endpoint
    - [ ] Create `api/v1/webhooks/evolution.js`
    - [ ] Implement HMAC-SHA256 signature verification
    - [ ] Implement timestamp validation (5 min window)
    - [ ] Implement webhook deduplication (Redis/KV)
- [ ] Event Handlers
    - [ ] Handle `CONNECTION_UPDATE` event
        - [ ] Update `numbers.status` (open → active, close → disconnected)
        - [ ] Handle Baileys disconnect reasons (loggedOut, restartRequired, etc.)
    - [ ] Handle `MESSAGES_UPSERT` event
        - [ ] Normalize message payload
        - [ ] Upsert into `chats` table
        - [ ] Insert into `messages` table
        - [ ] Handle media messages (store URLs)
- [ ] Error Handling
    - [ ] Log all webhook errors with context
    - [ ] Return 200 OK even on processing errors (prevent retries)
    - [ ] Alert on signature verification failures

## Phase 6: Backend - API Integration
- [ ] Update Existing Endpoints
    - [ ] Modify `api/v1/numbers.js` (GET)
        - [ ] Add `provider` field to response
    - [ ] Modify `api/v1/numbers.js` (POST - Create)
        - [ ] Add `provider` parameter (default: 'green-api')
        - [ ] Use provider factory to create instance
        - [ ] Store instance data in DB
    - [ ] Modify `api/v1/chats/[id]/send.js`
        - [ ] Fetch number with provider info
        - [ ] Use provider factory to send message
        - [ ] Handle provider-specific errors
- [ ] New Endpoints
    - [ ] Create `api/v1/numbers/[id]/reconnect.js` (for Evolution)
        - [ ] Generate new QR code
        - [ ] Return base64 QR
    - [ ] Create `api/health/evolution.js`
        - [ ] Check VPS reachability
        - [ ] Return instance health stats

## Phase 7: Frontend Implementation
- [ ] Components
    - [ ] Create `ProviderSelector.jsx` (Radio: GreenAPI / Evolution)
    - [ ] Create `QRCodeDisplay.jsx` (Base64 image renderer)
    - [ ] Create `ProviderBadge.jsx` (Show provider icon in number list)
- [ ] Add Number Flow
    - [ ] Update "Add Number" modal
    - [ ] Add provider selection step
    - [ ] Show QR code for Evolution (poll for status)
    - [ ] Show success message on connection
- [ ] Number Management
    - [ ] Add "Reconnect" button for disconnected Evolution numbers
    - [ ] Show provider type in number list
    - [ ] Handle delete (call provider-specific delete)
- [ ] Error Handling
    - [ ] Show user-friendly errors ("VPS unreachable", "Invalid QR", etc.)
    - [ ] Add retry button for failed operations

## Phase 8: Monitoring & Observability
- [ ] Logging
    - [ ] Implement structured logging (JSON format)
    - [ ] Set up Vercel Log Drains (→ Datadog/Logtail)
    - [ ] Log all provider API calls with latency
- [ ] Metrics
    - [ ] Track instance health (active/disconnected count)
    - [ ] Track message throughput (sent/received per min)
    - [ ] Track error rates by provider
    - [ ] Track webhook processing latency
- [ ] Alerting
    - [ ] Email alert on VPS down (>5 min)
    - [ ] Email alert on high error rate (>10% in 5 min)
    - [ ] Slack notification on instance disconnections
- [ ] Cron Jobs
    - [ ] Create health check cron (every 5 min)
    - [ ] Create instance sync cron (daily - detect orphans)
    - [ ] Create keepalive cron (weekly - prevent session expiry)

## Phase 9: Testing
- [ ] Unit Tests
    - [ ] Test `EvolutionProvider` methods
    - [ ] Test `GreenAPIProvider` methods
    - [ ] Test provider factory
    - [ ] Test webhook normalization
    - [ ] Test HMAC verification
- [ ] Integration Tests
    - [ ] Test full provisioning flow (create → QR → connect)
    - [ ] Test message send flow (both providers)
    - [ ] Test webhook ingestion
    - [ ] Test error recovery (retry logic)
- [ ] Load Tests
    - [ ] 100 concurrent message sends
    - [ ] 50 simultaneous QR scans
    - [ ] Webhook flood (1000 events/sec)
- [ ] Chaos Tests
    - [ ] Kill VPS mid-operation → verify graceful degradation
    - [ ] Corrupt webhook signature → verify rejection
    - [ ] Database timeout → verify retry

## Phase 10: Documentation & Deployment
- [ ] Documentation
    - [ ] Write VPS setup guide (step-by-step)
    - [ ] Write troubleshooting runbook
    - [ ] Update API documentation
    - [ ] Create cost analysis document
- [ ] Deployment
    - [ ] Deploy to staging environment
    - [ ] Run full test suite
    - [ ] Deploy to production (feature flag: off)
    - [ ] Enable for beta users
    - [ ] Monitor for 1 week
    - [ ] Enable for all users

## Phase 11: Post-Launch
- [ ] Optimization
    - [ ] Analyze performance bottlenecks
    - [ ] Optimize database queries
    - [ ] Implement caching where applicable
- [ ] User Feedback
    - [ ] Collect user feedback on Evolution vs. GreenAPI
    - [ ] Iterate on UX improvements
- [ ] Cost Analysis
    - [ ] Track actual VPS costs vs. GreenAPI costs
    - [ ] Calculate ROI
    - [ ] Decide on default provider for new users
