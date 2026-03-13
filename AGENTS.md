# Agent Coding Guidelines

_This document provides a concise, actionable guide for autonomous agents working in the **ai‑social‑agent** repository. It covers project layout, build/lint/test commands, and style conventions for both the TypeScript front‑end and the Python back‑end. All agents should read this file before making any changes._

## 📁 Project Structure
```
apps/
  web/   # React/TypeScript (Vite + Tailwind v4)
  api/   # FastAPI + LangChain (Python)
```
- `apps/web` – client‑side code under `src/`.
- `apps/api` – server implementation, virtual env, `requirements.txt`.

## 🛠️ Build, Lint & Test Commands
### Front‑end (`apps/web`)
| Command | Description |
|---|---|
| `npm run dev` | Start Vite dev server |
| `npm run build` | Production build |
| `npm run lint` | Run ESLint |
| `npm run preview` | Preview production build |
| `npx vitest` | Run all tests |
| `npx vitest run --test-name-pattern "<pattern>"` | Run a **single** test |
| `npx vitest run -t "my test"` | Shortcut for the above |

### Back‑end (`apps/api`)
```bash
cd apps/api
. venv/Scripts/activate   # Windows (or: source venv/bin/activate)
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```
**Testing (pytest)**
- `pytest` – run all tests.
- `pytest -k "<expr>"` – run tests matching `<expr>` (single test).
- `pytest --cov=apps/api` – run with coverage.
> **Note:** No tests exist yet; agents should add Vitest (frontend) and pytest (backend) scaffolding when new functionality is introduced.

## 📜 Code Style Guidelines
### TypeScript / React (frontend)
- **Imports:** React hooks → external libs → internal modules; alphabetical within groups; use relative paths.
- **Formatting:** 2‑space indent, single quotes, trailing commas, no semicolons. `prettier` should enforce this.
- **Types:** Declare return types; prefer `interface` for objects, `type` only for unions; use `zod` for runtime validation.
- **Naming:** Components `PascalCase`; hooks `useX`; files `kebab-case`; variables/props `camelCase`; constants `UPPER_SNAKE_CASE`.
- **Components:** Functional only, small, extract shared logic into hooks, consistent default or named export.
- **Hooks:** Prefix `use`, memoize callbacks with `useCallback`, return immutable state.
- **State Updates:** `setState(prev => [...prev, newItem])`.
- **Error Handling:** `try / catch` around async code, user‑friendly messages, `console.error` for dev logs.
- **Testing (Vitest):** Place tests alongside component (`MyComponent.test.tsx`), use `@testing-library/react`, one behavior per `it` block.

### Python (backend)
- **Formatting:** PEP‑8, 4‑space indent, `black` (line‑length 88) if present.
- **Imports:** stdlib → third‑party → local; alphabetical within groups.
```python
import os
import json

import fastapi
import httpx

from .schemas import Message
```
- **Types & Pydantic:** Full type hints, `BaseModel` for schemas, `from __future__ import annotations` for forward refs.
- **Naming:** Functions `snake_case`; classes `PascalCase`; constants `UPPER_SNAKE_CASE`.
- **FastAPI:** `@app.post("/path")` with `response_model`, async def for I/O, docstrings for endpoints.
- **LangChain:** Tools decorated with `@tool`, keep LLM calls in `agents.py`, SSE example:
```python
async def sse_generator(messages):
    async for ev in agent.astream_events(messages, output_version="v2"):
        if ev["event"] != "on_chat_model_stream":
            continue
        chunk = ev["data"]["chunk"]
        if isinstance(chunk.content, str):
            yield f"data: {json.dumps({'chunk': chunk.content})}\n\n"
    yield "data: [DONE]\n\n"
```
- **Testing (pytest):** Put tests in `tests/`, use `httpx.AsyncClient` for async routes.
```python
@pytest.mark.asyncio
async def test_hello():
    async with AsyncClient(app=app, base_url="http://test") as client:
        r = await client.get("/hello")
        assert r.status_code == 200
        assert r.json()["message"] == "Hello"
```
- **Security:** Never commit `.env`; validate input with Pydantic; use `python-dotenv` only locally.

## ⚙️ Configuration Files
- `apps/web/eslint.config.js` – ESLint flat config.
- `apps/web/tsconfig.json` – TypeScript compiler options.
- `apps/web/vite.config.ts` – Vite settings.
- `apps/api/.env` – Secrets (git‑ignored).
- Optional `pyproject.toml` for `black`/`ruff`.

## 📚 Common Patterns
- **Component:** `mkdir -p apps/web/src/components/MyComponent`; add `MyComponent.tsx`; optional CSS module; export.
- **Hook:** `apps/web/src/hooks/useFeature.ts`; memoized callbacks, JSDoc.
- **SSE (backend):** `return StreamingResponse(sse_generator(messages), media_type="text/event-stream")`.
- **Env vars:** Frontend `.env.development` (Vite), Backend `.env` (`CORS_ORIGINS`, `LLM_MODEL`, `LLM_URL`, `LLM_API_KEY`).

## 📑 Cursor & Copilot Rules
- No **Cursor** rule files (`.cursor/rules/` or `.cursorrules`) are present.
- No **GitHub Copilot** instruction file (`.github/copilot-instructions.md`) is present.
- Agents should follow the conventions above when generating code.

## 🌱 Agent Responsibilities
- Read `AGENTS.md` before any change.
- Use **Context7** for up‑to‑date library docs.
- Run lint and appropriate tests after each modification.
- Never commit `.env` or other secrets.
- Keep commit messages concise (why, not what).
- Update `package.json` or `requirements.txt` when adding dependencies, then install.

## 📦 Additional Notes
- Consider a CI workflow (GitHub Actions) that runs `npm run lint && npx vitest && pytest` on PRs.
- Add pre‑commit hooks (`black`, `ruff`, `eslint`) to enforce style.
- Use Tailwind v4 utilities consistently.
- Break long tasks into small, testable increments and commit frequently.

---

*End of file*