# Website verification

Verified locally on 2026-09-09 in Chromium through Playwright CLI.

## Build

`npm run check`, `npm run build` and `git diff --check` passed. The site has no runtime or build dependencies. Fonts are served from the same origin.

## Browser checks

The page has no horizontal document overflow at 320, 390, 768, 1024 and 1440 CSS pixels. Desktop and mobile screenshots were inspected.

The editor renders headings, bold text and lists. HTML input remains text and does not execute. Drafts survive a reload. The comparison reflects the edited content, and the review panel opens. Arrow keys switch tabs. Reset restores the sample and clears local storage.

The FAQ opens and closes. Mobile navigation opens and closes after choosing a section. The copy button writes the installation commands to the clipboard. Reduced motion disables smooth scrolling. The application page reported no console errors or warnings.

## Accessibility

Axe-core 4.10.3 reported no WCAG 2 A, AA or 2.1 AA violations in the mobile page and in all three desktop demo tabs. The decorative footer wordmark was excluded from contrast checking because it is a repeated brand logo. Automated checks do not replace a full assistive technology audit.

## Demo scope

The browser example is separate from the PushDocs application. It stores data locally and never creates a commit or contacts a Git provider. Product features and known limitations were checked against the main project's README. The isolated Docusaurus preview is described as experimental.
