---
description: frontend React component and UI development
---

# Frontend Development Guidelines

## Component Location
- All components go in `/src/components/`
- Page components go in `/src/pages/`
- Reusable UI primitives go in `/src/components/ui/`

## Design System
1. Use the existing CSS variables and design tokens in `index.css`
2. Support both dark and light themes
3. **Always** support RTL (Hebrew) and LTR (English) layouts

## Code Style
- Use functional React components with hooks
- Use ES6+ JavaScript syntax
- Keep components focused and reusable
- Use meaningful component and variable names

## Internationalization
- All user-facing text must be translatable
- Use the existing i18n system for translations
- Test in both English and Hebrew

## Before Completing
1. Verify the component renders correctly
2. Test responsive behavior
3. Verify RTL/LTR layouts work properly
4. Run `npm run build` to ensure no build errors
