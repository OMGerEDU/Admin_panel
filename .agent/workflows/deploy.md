---
description: deployment workflow using Vercel and Git
---

# Deployment Workflow

## Pre-Deployment Checklist
Before pushing to production, ALWAYS verify locally:

// turbo
1. Run `npm run build` to ensure the production build succeeds
2. Test critical functionality in the browser

## Deployment Process
1. Stage changes: `git add .`
2. Commit with a descriptive message: `git commit -m "feat: description"`
3. Push to trigger Vercel deployment: `git push`
4. Wait for Vercel to show deployment is running/complete

## Vercel Configuration
- Deployments are automatic on push to main branch
- Preview deployments are created for pull requests
- Check Vercel dashboard for deployment status and logs

## Rollback
If deployment fails or introduces bugs:
1. Check Vercel deployment logs for errors
2. Revert the problematic commit if needed
3. Push the fix to trigger a new deployment

## IMPORTANT
- NEVER deploy without running `npm run build` locally first
- NEVER deploy untested changes directly to production
