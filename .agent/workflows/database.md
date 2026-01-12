---
description: database operations with Supabase - strict and professional
---

# Database Management Protocol

> ⚠️ **STRICT MODE**: All database operations require careful planning and verification.

## Database Provider
- **Provider**: Supabase (hosted via Vercel configuration)
- **Type**: PostgreSQL

## Schema Change Protocol

### 1. Planning Phase (MANDATORY)
Before ANY schema change:
1. Document the exact change required
2. Identify ALL affected tables, views, and functions
3. List all dependencies (foreign keys, triggers, RLS policies)
4. Assess impact on existing data
5. Plan rollback strategy

### 2. Migration File Standards
- Location: `/migrations/` or designated SQL folder
- Naming: `YYYYMMDD_HHMMSS_descriptive_name.sql`
- Include both UP and DOWN migrations when possible
- Add clear comments explaining the change

### 3. SQL Standards
```sql
-- ✅ REQUIRED: Comment header for every migration
-- Migration: [descriptive name]
-- Author: [name]
-- Date: [date]
-- Description: [what this migration does]
-- Affected tables: [list]
-- Rollback: [how to revert]
```

### 4. Before Execution
- [ ] Review SQL syntax carefully
- [ ] Check for data loss risks
- [ ] Verify foreign key constraints
- [ ] Test on development/staging first if available
- [ ] Backup critical data if needed

### 5. RLS (Row Level Security)
- All tables MUST have appropriate RLS policies
- Never disable RLS without explicit approval
- Document all RLS policy changes

## Prohibited Actions (Without Explicit Approval)
- ❌ DROP TABLE
- ❌ TRUNCATE
- ❌ Removing columns with data
- ❌ Changing column types that may lose data
- ❌ Disabling RLS policies

## Query Standards
- Always use parameterized queries (prevent SQL injection)
- Use explicit column names (avoid SELECT *)
- Add appropriate indexes for frequently queried columns
- Use transactions for multi-step operations

## Verification After Changes
1. Confirm migration applied successfully
2. Verify data integrity
3. Test application functionality
4. Monitor for errors in logs
