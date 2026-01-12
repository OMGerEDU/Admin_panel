# Evolution Backend - Project Specification

> Self-hosted WhatsApp infrastructure for Ferns SaaS

## Project Overview

This project hosts Evolution API on a VPS to provide WhatsApp connectivity for the Ferns AdminPanel. It acts as a "WhatsApp Gateway" that the main SaaS communicates with.

```
┌─────────────────┐        ┌─────────────────┐        ┌─────────────┐
│  AdminPanel     │◄──────►│ Evolution       │◄──────►│  WhatsApp   │
│  (Vercel)       │  HTTPS │ Backend (VPS)   │        │  Servers    │
└─────────────────┘        └─────────────────┘        └─────────────┘
```

---

## Build Roadmap

### Phase 1: Infrastructure Setup ⏱️ Day 1
- [ ] Provision VPS (4GB+ RAM, Ubuntu 22.04)
- [ ] Install Docker & Docker Compose
- [ ] Configure firewall (UFW)
- [ ] Set up domain & DNS (e.g., `wa.ferns.app`)
- [ ] Install Caddy for SSL/HTTPS

### Phase 2: Evolution Deployment ⏱️ Day 1-2
- [ ] Create `docker-compose.yml`
- [ ] Configure environment variables
- [ ] Deploy Evolution + Postgres + Redis stack
- [ ] Verify health endpoint (`/health`)
- [ ] Test instance creation via curl

### Phase 3: Webhook Configuration ⏱️ Day 2
- [ ] Configure global webhook URL (→ AdminPanel)
- [ ] Set up webhook signing secret
- [ ] Test webhook delivery
- [ ] Implement retry mechanism

### Phase 4: Security Hardening ⏱️ Day 2-3
- [ ] Change default API key
- [ ] Enable HTTPS only
- [ ] Set up fail2ban
- [ ] Configure rate limiting (Caddy)
- [ ] Set up automatic security updates

### Phase 5: Monitoring & Backup ⏱️ Day 3
- [ ] Set up UptimeRobot/BetterStack monitoring
- [ ] Configure Postgres backups (daily)
- [ ] Set up log rotation
- [ ] Create health check cron

### Phase 6: Documentation ⏱️ Day 3
- [ ] Write deployment runbook
- [ ] Document API endpoints
- [ ] Create troubleshooting guide
- [ ] Write scaling guide

---

## Feature Checklist

### Core Features
- [x] Multi-instance support (multiple WhatsApp numbers)
- [x] QR Code authentication
- [x] Pairing code authentication (alternative)
- [x] Session persistence (Postgres)
- [x] Automatic reconnection
- [x] Webhook events

### Messaging Features
- [x] Send text messages
- [x] Send media (image/video/audio/document)
- [x] Send location
- [x] Send contacts
- [x] Send buttons (limited by WhatsApp)
- [x] Send lists (limited by WhatsApp)
- [x] Receive all message types
- [x] Message status updates (sent/delivered/read)

### Instance Management
- [x] Create instance
- [x] Delete instance
- [x] Logout instance
- [x] Restart instance
- [x] Fetch all instances
- [x] Check instance status

---

## Data Contracts (AdminPanel ↔ Evolution)

### Environment Variables (Evolution Side)
```bash
# Required
AUTHENTICATION_API_KEY=your-super-secret-global-key
DATABASE_PROVIDER=postgresql
DATABASE_CONNECTION_URI=postgresql://user:pass@postgres:5432/evolution
CACHE_REDIS_ENABLED=true
CACHE_REDIS_URI=redis://redis:6379

# Webhook Configuration
WEBHOOK_GLOBAL_URL=https://your-admin-panel.vercel.app/api/webhooks/evolution
WEBHOOK_GLOBAL_ENABLED=true
WEBHOOK_GLOBAL_WEBHOOK_BY_EVENTS=true
WEBHOOK_EVENTS=["CONNECTION_UPDATE","MESSAGES_UPSERT","MESSAGES_UPDATE","SEND_MESSAGE"]
```

### Environment Variables (AdminPanel Side)
```bash
EVOLUTION_API_URL=https://wa.ferns.app
EVOLUTION_GLOBAL_API_KEY=your-super-secret-global-key  # Same as above
EVOLUTION_WEBHOOK_SECRET=different-secret-for-hmac     # Optional, for signing
```

---

## API Endpoints Reference

### Authentication
All requests require header:
```
apikey: your-super-secret-global-key
```

### Instance Management

#### Create Instance
```http
POST /instance/create
Content-Type: application/json

{
  "instanceName": "saas_user123_abc",
  "qrcode": true,
  "integration": "WHATSAPP-BAILEYS"
}

Response:
{
  "instance": { "instanceName": "saas_user123_abc" },
  "hash": { "apikey": "instance-specific-token" },
  "qrcode": { "base64": "data:image/png;base64,..." }
}
```

#### Get QR Code / Connect
```http
GET /instance/connect/saas_user123_abc

Response:
{
  "base64": "data:image/png;base64,...",
  "code": "ABC1-DEF2-GHI3"  // Pairing code alternative
}
```

#### Delete Instance
```http
DELETE /instance/delete/saas_user123_abc

Response: { "status": "success" }
```

#### Fetch All Instances
```http
GET /instance/fetchInstances

Response:
{
  "instances": [
    {
      "instanceName": "saas_user123_abc",
      "status": "open"  // open, close, connecting
    }
  ]
}
```

### Messaging

#### Send Text
```http
POST /message/sendText/saas_user123_abc
Content-Type: application/json

{
  "number": "1234567890",
  "text": "Hello from Ferns!"
}

Response:
{
  "key": { "id": "BAE5..." },
  "message": { ... }
}
```

#### Send Media
```http
POST /message/sendMedia/saas_user123_abc
Content-Type: application/json

{
  "number": "1234567890",
  "mediatype": "image",
  "media": "https://example.com/image.jpg",
  "caption": "Check this out!"
}
```

---

## Webhook Events (Evolution → AdminPanel)

### CONNECTION_UPDATE
Triggered when WhatsApp connection status changes.
```json
{
  "event": "connection.update",
  "instance": "saas_user123_abc",
  "data": {
    "state": "open",  // open | close | connecting
    "statusReason": 200
  }
}
```

**AdminPanel Action**: Update `numbers.status` in Supabase

### MESSAGES_UPSERT
Triggered when a message is received.
```json
{
  "event": "messages.upsert",
  "instance": "saas_user123_abc",
  "data": {
    "key": {
      "remoteJid": "1234567890@s.whatsapp.net",
      "fromMe": false,
      "id": "BAE5ABC123"
    },
    "message": {
      "conversation": "Hello!"
    },
    "messageTimestamp": 1704999999
  }
}
```

**AdminPanel Action**: 
1. Upsert `chats` table
2. Insert into `messages` table

### SEND_MESSAGE
Triggered when a message is sent (confirmation).
```json
{
  "event": "send.message",
  "instance": "saas_user123_abc",
  "data": {
    "key": { "id": "BAE5DEF456" },
    "status": "DELIVERY_ACK"
  }
}
```

---

## Docker Compose Template

```yaml
version: '3.8'

services:
  evolution:
    image: atendai/evolution-api:v2.1.1
    container_name: evolution_api
    restart: always
    ports:
      - "8080:8080"
    environment:
      - SERVER_PORT=8080
      - AUTHENTICATION_API_KEY=${API_KEY}
      - DATABASE_PROVIDER=postgresql
      - DATABASE_CONNECTION_URI=postgresql://evolution:${DB_PASS}@postgres:5432/evolution
      - CACHE_REDIS_ENABLED=true
      - CACHE_REDIS_URI=redis://redis:6379/0
      - WEBHOOK_GLOBAL_URL=${WEBHOOK_URL}
      - WEBHOOK_GLOBAL_ENABLED=true
    depends_on:
      - postgres
      - redis

  postgres:
    image: postgres:15-alpine
    container_name: evolution_db
    restart: always
    environment:
      - POSTGRES_USER=evolution
      - POSTGRES_PASSWORD=${DB_PASS}
      - POSTGRES_DB=evolution
    volumes:
      - postgres_data:/var/lib/postgresql/data

  redis:
    image: redis:7-alpine
    container_name: evolution_redis
    restart: always
    command: ["redis-server", "--appendonly", "yes"]
    volumes:
      - redis_data:/data

volumes:
  postgres_data:
  redis_data:
```

---

## Caddy Configuration (SSL)

```
wa.ferns.app {
    reverse_proxy localhost:8080
    
    # Rate limiting
    rate_limit {
        zone evolution {
            key {remote_host}
            events 100
            window 10s
        }
    }
}
```

---

## Scaling Guidelines

| Users | Numbers | RAM | VPS Tier |
|:------|:--------|:----|:---------|
| 1-50 | 1-30 | 4GB | Hetzner CX22 ($5) |
| 50-200 | 30-100 | 8GB | Hetzner CX32 ($10) |
| 200+ | 100+ | 16GB+ | Hetzner CX42 ($20) or Multi-VPS |

---

## Troubleshooting Quick Reference

| Issue | Check | Solution |
|:------|:------|:---------|
| QR not generating | `docker logs evolution_api` | Restart container |
| Connection drops | Postgres data | Verify volume persistence |
| Webhook not received | Network/firewall | Check VPS firewall rules |
| 401 Unauthorized | API key | Verify `AUTHENTICATION_API_KEY` |
| Instance not found | Postgres sync | Call `/instance/fetchInstances` |

---

## Maintenance Checklist

### Daily (Automated)
- [ ] Postgres backup to S3/object storage
- [ ] Health check ping

### Weekly
- [ ] Review error logs
- [ ] Check disk usage
- [ ] Verify backup integrity

### Monthly
- [ ] Update Evolution API version
- [ ] Security patches (apt upgrade)
- [ ] Review instance count vs. RAM

---

## Cost Estimate

| Item | Monthly Cost |
|:-----|:-------------|
| VPS (4GB Hetzner) | $5 |
| Domain | $1 (amortized) |
| Backups (Hetzner) | $1 |
| Monitoring (free tier) | $0 |
| **Total** | **~$7/month** |

**vs. GreenAPI**: $20/number/month → Break-even at 1 number!
