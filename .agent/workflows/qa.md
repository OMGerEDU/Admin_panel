---
description: QA testing workflow using Vitest framework
---

# QA Testing Protocol

## Recommended Framework: Vitest
Vitest is the recommended testing framework for this project:
- Fast, native ESM support
- Compatible with Vite-based projects
- Jest-compatible API
- Built-in coverage reporting

## Setup (One-Time)
```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom jsdom
```

Add to `package.json`:
```json
{
  "scripts": {
    "test": "vitest",
    "test:run": "vitest run",
    "test:coverage": "vitest run --coverage"
  }
}
```

## Test File Structure
```
📁 src/
├── components/
│   └── Button.jsx
│   └── __tests__/
│       └── Button.test.jsx
├── services/
│   └── api.js
│   └── __tests__/
│       └── api.test.js
📁 api/
└── __tests__/
    └── webhooks.test.js
```

## Test Categories

### 1. Unit Tests
Test individual functions and components in isolation.

```javascript
// Example: Service function test
import { describe, it, expect, vi } from 'vitest';
import { sendMessage } from '../services/messageService';

describe('sendMessage', () => {
  it('should send message successfully', async () => {
    // Arrange
    const mockData = { to: '123', text: 'Hello' };
    
    // Act
    const result = await sendMessage(mockData);
    
    // Assert
    expect(result.success).toBe(true);
  });
});
```

### 2. Component Tests
Test React components using Testing Library.

```javascript
import { describe, it, expect } from 'vitest';
import { render, screen } from '@testing-library/react';
import Button from '../Button';

describe('Button', () => {
  it('renders with correct text', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByText('Click me')).toBeInTheDocument();
  });
});
```

### 3. Integration Tests
Test API routes and database interactions.

```javascript
describe('Evolution Webhook', () => {
  it('handles connection.update event', async () => {
    const payload = {
      event: 'connection.update',
      instance: 'test_instance',
      data: { state: 'open' }
    };
    
    const response = await handleWebhook(payload);
    expect(response.status).toBe(200);
  });
});
```

### 4. E2E Tests (Browser)
Use the browser_subagent tool for end-to-end UI testing.

## Test Commands
// turbo
1. Run all tests: `npm test`
// turbo
2. Run tests once (CI mode): `npm run test:run`
// turbo
// turbo
3. Run with coverage: `npm run test:coverage`
// turbo
4. Run with detailed logging (Standard for AI debugging): `npm run test:log`
   - Always use this when debugging or stepping through issues.
   - Outputs to `tests.log` in the root.

## Coverage Requirements
| Type | Minimum Coverage |
|------|------------------|
| Statements | 70% |
| Branches | 60% |
| Functions | 70% |
| Lines | 70% |

## Testing Checklist

### Before PR/Deployment
- [ ] All existing tests pass
- [ ] New features have tests
- [ ] Edge cases are covered
- [ ] Error scenarios are tested
- [ ] Coverage thresholds met

### Evolution API Testing
- [ ] Mock Evolution API responses
- [ ] Test webhook signature validation
- [ ] Test connection state changes
- [ ] Test message sending/receiving
- [ ] Test error handling

## Mocking External APIs

```javascript
import { vi } from 'vitest';

// Mock Evolution API client
vi.mock('../services/evolution', () => ({
  createInstance: vi.fn().mockResolvedValue({ instanceName: 'test' }),
  sendMessage: vi.fn().mockResolvedValue({ success: true }),
}));
```

## Debugging Failed Tests
1. Run single test file: `npx vitest path/to/test.js`
2. Run in watch mode: `npx vitest --watch`
3. Run with verbose output: `npx vitest --reporter=verbose`
