# Project Guidelines

## Code Style

- **JavaScript only** (`.jsx` / `.js`) — no TypeScript
- **Functional components + Hooks** — no class components
- **Default exports** for components; **named exports** for services and context hooks
- Props destructured in function signatures
- Event handlers wrapped in `useCallback`; DOM refs via `useRef`
- PascalCase filenames for components, camelCase for services

## Architecture

React 19 SPA with React Router v7, Vite (rolldown-vite), and plain CSS.

- **Provider nesting**: `BrowserRouter → AuthProvider → App`
- **Auth**: Context API (`AuthContext`) with `sessionStorage` persistence — no tokens/cookies
- **Routing**: Conditional route rendering based on `isLoggedIn` from `useAuth()`
- **Styling**: Single `src/index.css` — no modules, Tailwind, or preprocessors. CSS class prefixes: `soge-*` (chatbot), `form-*` (forms), `col-d/t/m-*` (responsive grid)
- **Animations**: GSAP scoped with `gsap.context()` + cleanup in effect returns; Typed.js for typewriter effects
- **API layer**: Axios with bare `baseUrl` import from `apiConfig.js` — no shared instance or interceptors

See [README.md](../README.md) for full architecture details, routing table, chatbot state machine, and deployment instructions.

## Build and Test

```bash
npm install        # Install dependencies
npm run dev        # Vite dev server with HMR
npm run build      # Production build
npm run lint       # ESLint
```

No test framework is configured — there are no unit or integration tests.

## Conventions

- All styles in one file (`src/index.css`) — add new styles there, following existing CSS namespace prefixes
- Chatbot questions defined in `src/data/questions.json` — schema: `{ id, text, type: "options"|"text"|"finish", options? }`
- Client-side validation before every API call
- GSAP animation cleanup is mandatory — always return cleanup from `useEffect`
- `role="alert"` on error messages; `aria-*` attributes on interactive elements
- Error extraction pattern: `err?.response?.data?.message || err?.response?.data || err?.message`
