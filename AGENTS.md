# Agent Coding Guidelines

This document provides guidelines for agents working on the ai-social-agent codebase.

## Project Structure

```
apps/
  web/     - React/TypeScript frontend (Vite + Tailwind CSS)
  api/     - Python FastAPI backend
```

## Build Commands

### Frontend (apps/web)

| Command | Description |
|---------|-------------|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Build for production (tsc + vite) |
| `npm run lint` | Run ESLint on all files |
| `npm run preview` | Preview production build |

### Running a Single Test

No test framework is currently configured. To add tests, use Vitest:

```bash
npm install -D vitest @testing-library/react @testing-library/jest-dom
```

Then run a single test:
```bash
npx vitest run --test-name-pattern "test name"
```

### Backend (apps/api)

The API uses Python with FastAPI. Activate the virtual environment first:

```bash
cd apps/api
. venv/Scripts/activate  # Windows
# or: source venv/bin/activate  # Unix
```

Run the API:
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## Code Style Guidelines

### TypeScript/React (apps/web)

**Imports**
- Use relative imports for internal modules: `import ChatStream from "./components/ChatStream/ChatStream"`
- Group imports: external libs, then internal modules
- Use path aliases if configured in tsconfig.json

**Formatting**
- 2-space indentation
- Single quotes for strings
- Trailing commas
- No semicolons

**Types**
- Use explicit return types for functions
- Prefer interfaces over types for object shapes
- Use `zod` for runtime validation (already installed)
- Enable strict TypeScript mode

**Naming Conventions**
- Components: PascalCase (e.g., `ChatStream.tsx`)
- Hooks: camelCase starting with `use` (e.g., `useAgentStream.ts`)
- Utility functions: camelCase
- Files: kebab-case

**Components**
- Use functional components with arrow functions or `function` keyword
- Prefer composition over inheritance
- Extract custom hooks for reusable logic
- Keep components small and focused

**Error Handling**
- Use try/catch for async operations
- Display user-friendly error messages in UI
- Log errors appropriately

### Python (apps/api)

**Formatting**
- Follow PEP 8
- Use Black for formatting (if added)
- 4-space indentation

**Imports**
- Standard library first, then third-party, then local
- Use absolute imports

**Types**
- Use type hints for all function parameters and return values
- Use Pydantic BaseModel for request/response schemas

**Naming**
- Functions: snake_case
- Classes: PascalCase
- Constants: UPPER_SNAKE_CASE

**FastAPI Best Practices**
- Use async/await for I/O operations
- Define response models for endpoints
- Use dependency injection for shared logic

## Configuration Files

- `apps/web/eslint.config.js` - ESLint flat config
- `apps/web/tsconfig.json` - TypeScript config (extends app/node configs)
- `apps/web/vite.config.ts` - Vite configuration
- `apps/api/.env` - Environment variables (do not commit)

## Common Patterns

### Creating a New Component
1. Create folder in `apps/web/src/components/`
2. Create `ComponentName.tsx` file
3. Export as default or named export
4. Add to parent component

### Creating a New Hook
1. Create in `apps/web/src/hooks/`
2. Name file with `use` prefix
3. Export as named export

### Adding a New API Endpoint
1. Add endpoint to `apps/api/main.py`
2. Use Pydantic models for request/response
3. Document with docstrings

## Environment Variables

Frontend uses `.env.development` for local development.

Backend uses `.env` file with keys:
- `CORS_ORIGINS` - Comma-separated list
- `LLM_MODEL` - Model name
- `LLM_URL` - Model API URL
- `LLM_API_KEY` - API key

## Additional Notes

- No tests currently exist - consider adding Vitest for frontend
- Currently no pre-commit hooks configured
- Tailwind CSS v4 is used (note: different from v3)
