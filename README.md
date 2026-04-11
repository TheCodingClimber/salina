# Salina Landing Page

Clean Clinical Flow preview for a mobile phlebotomy landing page built with React, Vite, and a tasteful three.js hero animation.

## Commands

- `npm run dev` starts the local preview server.
- `npm run build` creates the production build.
- `npm run lint` checks the React code with ESLint.

## Key Files

- `src/App.jsx` contains the page structure, content blocks, and CTA wiring.
- `src/App.css` contains the main layout and visual system for the preview.
- `src/components/CleanClinicalHeroScene.jsx` contains the lazy-loaded three.js hero animation.
- `src/index.css` contains the global reset, palette, and typography tokens.

## Content Notes

- The current phone number is still a placeholder and should be replaced before launch.
- `CONFIG.blsCertified` in `src/App.jsx` should only be switched on if that credential is current.
- The current version is a direction preview, so copy and service details can still be tuned before final sign-off.
