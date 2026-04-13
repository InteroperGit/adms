# Infrastructure Build Rules

## Project Structure

Each cloud function in `src/` is an independent package managed by pnpm:

```
src/
├── shared/                  # Shared types and utilities
│   ├── logger.ts            # Structured JSON logger (logInfo, logWarn, logError)
│   ├── response.ts          # API Gateway response helpers (badRequest, serverError, jsonResponse)
│   ├── types/
│   │   ├── message.ts       # Base Message interface
│   │   ├── orderMessage.ts  # OrderMessage type + buildOrderMessage()
│   │   └── apiGateway.ts    # API Gateway event/result types (no jsonResponse)
│   └── index.ts             # Barrel re-export
├── orders-intake/           # Order submission handler (SQS producer)
└── dispatch-queue-messages/ # Queue polling/dispatch handler (SQS consumer)
```

## Per-Project Conventions

Every function project under `src/` must have:

| File | Purpose |
|---|---|
| `package.json` | Name, scripts, dependencies. Node 20 engine required. |
| `tsconfig.json` | ES2022 target, ESNext module, bundler resolution, strict mode. |
| `eslint.config.mjs` | Flat config with `@eslint/js` + `typescript-eslint` recommended rules. |
| `.prettierrc` | Prettier config (copy from an existing function). |
| `.env` | Runtime env vars (AWS endpoint, credentials, queue URL). Never commit secrets. |
| `src/` | Source files (`.ts`). Tests co-located as `*.test.ts`. |

### Required Scripts

Every `package.json` must expose these five scripts:

```json
{
  "scripts": {
    "build": "tsc",
    "typecheck": "tsc --noEmit",
    "lint": "eslint src",
    "test": "vitest run",
    "format": "prettier --write src"
  }
}
```

### tsconfig.json Baseline

```json
{
  "compilerOptions": {
    "target": "ES2022",
    "module": "ESNext",
    "moduleResolution": "bundler",
    "strict": true,
    "esModuleInterop": true,
    "skipLibCheck": true,
    "outDir": "dist"
  },
  "include": ["src", "../shared"]
}
```

The `include` array must reference `../shared` so the function can import shared types and the logger.

### eslint.config.mjs Baseline

```mjs
import eslint from '@eslint/js';
import tseslint from 'typescript-eslint';

export default tseslint.config(
  eslint.configs.recommended,
  ...tseslint.configs.recommended,
  { ignores: ['dist', 'node_modules'] }
);
```

## Shared Module Rules

- The `src/shared/` directory contains code used across all functions.
- Functions import from `../../shared` (relative path).
- `tsconfig.json` `include` must list `../shared`.
- Adding a new export to `shared/`:
  1. Add the implementation file in `src/shared/`
  2. Re-export from `src/shared/index.ts`
  3. If adding types, place in `src/shared/types/` and re-export from `src/shared/types/index.ts`

### Current Shared Exports

| Module | Exports |
|---|---|
| `shared/logger.ts` | `logInfo`, `logWarn`, `logError`, `log` |
| `shared/response.ts` | `badRequest`, `serverError`, `jsonResponse` |
| `shared/types/message.ts` | `Message` interface |
| `shared/types/orderMessage.ts` | `OrderMessageType`, `MESSAGE_VERSION`, `MESSAGE_SOURCE`, `buildOrderMessage` |
| `shared/types/apiGateway.ts` | `APIGatewayProxyEvent`, `APIGatewayProxyResult`, `Handler` |

## Adding a New Function

1. Create `src/<function-name>/` directory
2. Copy `package.json`, `tsconfig.json`, `eslint.config.mjs`, `.prettierrc`, `.env` from an existing function
3. Update `name` in `package.json`
4. Create `src/index.ts` with the Lambda handler export
5. Run `pnpm install` in the function directory
6. Verify all five scripts pass: `pnpm typecheck && pnpm lint && pnpm build && pnpm test && pnpm format`

## Build Output

- `tsc` compiles `src/` → `dist/` (JavaScript)
- `dist/` is gitignored and produced by `pnpm build`
- Yandex Cloud Function deployment packages the `dist/` directory as a zip

## Testing Conventions

- Tests are co-located: `src/foo.test.ts` tests `src/foo.ts`
- Use Vitest (`vitest run` in `pnpm test`)
- Mock external dependencies (SQS client, https, shared logger) via `vi.mock` / `vi.doMock`
- Test handler responses by constructing fake `APIGatewayProxyEvent` objects
- Assert on `statusCode` and parsed `body` JSON
