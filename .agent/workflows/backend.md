---
description: backend API development for Evolution API integration
---

# Backend Development Guidelines

## Architecture Overview
```
AdminPanel (Vercel) ←→ Evolution API (VPS) ←→ WhatsApp
```

## Reference Documents
Before making backend changes, review:
- `evolutionPrepare/evolution_backend_spec.md` - Full API specifications
- `evolutionPrepare/docker-compose.evolution.yml` - Docker configuration
- `api/_utils/providers/evolution.js` - Evolution API client

## API Structure
```
📁 api/
├── _utils/              # Shared utilities
│   ├── auth.js          # Authentication helpers
│   └── providers/       # External API clients
│       └── evolution.js # Evolution API integration
├── v1/                  # Versioned API routes
└── webhooks/            # Incoming webhook handlers
    └── evolution.js     # Evolution webhook receiver
```

## Evolution API Integration

### Authentication
- All requests require `apikey` header
- Use environment variable: `EVOLUTION_GLOBAL_API_KEY`
- Base URL: `EVOLUTION_API_URL`

### Key Endpoints to Implement
| Route | Purpose |
|-------|---------|
| `POST /api/v1/instances/create` | Create WhatsApp instance |
| `GET /api/v1/instances/:id/qr` | Get QR code for connection |
| `POST /api/v1/messages/send` | Send WhatsApp message |
| `POST /api/webhooks/evolution` | Receive Evolution webhooks |

### Webhook Events to Handle
1. `connection.update` → Update `numbers.status`
2. `messages.upsert` → Store incoming messages
3. `send.message` → Update message delivery status

## Code Standards

### Error Handling
```javascript
try {
  // Evolution API call
} catch (error) {
  console.error('[Evolution]', error);
  return res.status(error.status || 500).json({
    error: error.message,
    code: 'EVOLUTION_ERROR'
  });
}
```

### Response Format
```javascript
// Success
{ success: true, data: {...} }

// Error
{ success: false, error: "message", code: "ERROR_CODE" }
```

## Security Checklist
- [ ] Validate webhook signatures (HMAC)
- [ ] Sanitize all input data
- [ ] Use parameterized queries (no SQL injection)
- [ ] Rate limit sensitive endpoints
- [ ] Log all Evolution API errors

## Testing Locally
1. Use ngrok or similar for webhook testing
2. Mock Evolution responses for unit tests
3. Test all error scenarios
