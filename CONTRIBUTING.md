# Contributing to ZyroMart Client

Thank you for your interest in contributing! All contributions — bug fixes, new features, documentation improvements — are welcome.

## Getting Started

1. **Fork** the repository on GitHub
2. **Clone** your fork locally
   ```bash
   git clone https://github.com/sakib-atreus/ZyroMart-client
   cd ZyroMart-client
   ```
3. **Install** dependencies
   ```bash
   npm install
   ```
4. **Create a branch** from `develop`
   ```bash
   git checkout develop
   git checkout -b feature/your-feature-name
   ```

## Branching Strategy

| Branch | Purpose |
|---|---|
| `main` | Production-ready code only |
| `develop` | Integration branch — target this for PRs |
| `feature/*` | New features |
| `fix/*` | Bug fixes |
| `hotfix/*` | Critical production fixes |

## Making Changes

- Place new pages under `src/pages/`
- Place reusable components under `src/components/` or `src/shared/`
- All API calls must go through `src/api/endpoints.js` — do not call Axios directly from pages
- Use Tailwind utility classes for styling; avoid inline `style` props unless animating with Framer Motion
- Use functional components and React hooks — no class components

## Before Opening a PR

```bash
# Run the linter and fix any warnings
npm run lint

# Test in the browser — verify the golden path, empty states, loading states, and error states
# Check both desktop and mobile screen sizes
npm run dev
```

## Commit Messages

Use short, imperative commit messages:

```
feat: add product comparison page
fix: cart count not resetting on logout
style: update checkout form spacing on mobile
docs: update environment variables section
```

## Opening a Pull Request

1. Push your branch to your fork
2. Open a PR targeting the **`develop`** branch of this repository
3. In the PR description, include:
   - What changed and why
   - Which pages or components are affected
   - Screenshots for any UI changes

At least one maintainer review is required before merging.

## What NOT to Commit

- `.env` files or API keys
- `dist/` build output
- `node_modules/`

## Contact

For questions before contributing, reach out at [sakibmia0718@gmail.com](mailto:sakibmia0718@gmail.com) or open an issue.
