# Makanak — Production-Grade Monorepo Architecture

> **Goal:** Enterprise-ready, scalable folder structure for a full-stack real-estate SaaS.
> **Stack:** React + TypeScript + Bootstrap + Axios + React Router + Redux Toolkit, Node.js + Express + MongoDB/Mongoose + JWT + OTP, Docker + Docker Compose.

---

## 1) Visual Monorepo Tree (with comments)

```text
makanak/
├─ .github/
│  ├─ workflows/
│  │  ├─ ci.yml                           # Lint, type-check, test, build on PR
│  │  └─ cd.yml                           # Deploy pipeline (staging/production)
│  ├─ ISSUE_TEMPLATE/
│  └─ pull_request_template.md
│
├─ apps/
│  ├─ web/                                # React frontend app
│  │  ├─ public/
│  │  │  ├─ favicon.ico
│  │  │  └─ robots.txt
│  │  ├─ src/
│  │  │  ├─ app/
│  │  │  │  ├─ store.ts                   # Redux Toolkit store setup
│  │  │  │  ├─ rootReducer.ts
│  │  │  │  └─ hooks.ts                   # typed useDispatch/useSelector
│  │  │  ├─ assets/
│  │  │  │  ├─ images/
│  │  │  │  ├─ icons/
│  │  │  │  └─ styles/
│  │  │  │     ├─ bootstrap-overrides.scss
│  │  │  │     ├─ globals.scss
│  │  │  │     └─ variables.scss
│  │  │  ├─ components/                   # Reusable UI components
│  │  │  │  ├─ common/
│  │  │  │  │  ├─ Button/
│  │  │  │  │  │  ├─ Button.tsx
│  │  │  │  │  │  ├─ Button.types.ts
│  │  │  │  │  │  └─ index.ts
│  │  │  │  │  ├─ Input/
│  │  │  │  │  ├─ Modal/
│  │  │  │  │  ├─ Spinner/
│  │  │  │  │  └─ EmptyState/
│  │  │  │  ├─ property/
│  │  │  │  │  ├─ PropertyCard.tsx
│  │  │  │  │  ├─ PropertyGallery.tsx
│  │  │  │  │  ├─ PropertyFilters.tsx
│  │  │  │  │  └─ PropertyMapPins.tsx
│  │  │  │  ├─ map/
│  │  │  │  │  ├─ MapView.tsx
│  │  │  │  │  ├─ NearbyPropertiesMap.tsx
│  │  │  │  │  └─ UserLocationMarker.tsx
│  │  │  │  └─ auth/
│  │  │  │     ├─ LoginForm.tsx
│  │  │  │     ├─ RegisterForm.tsx
│  │  │  │     └─ OtpVerificationForm.tsx
│  │  │  ├─ contexts/                     # For light app-wide context (theme, locale)
│  │  │  │  ├─ ThemeContext.tsx
│  │  │  │  └─ LocaleContext.tsx
│  │  │  ├─ hooks/                        # Custom hooks for reusable client logic
│  │  │  │  ├─ useAuth.ts
│  │  │  │  ├─ useDebounce.ts
│  │  │  │  ├─ useGeolocation.ts
│  │  │  │  ├─ usePagination.ts
│  │  │  │  └─ useFavorites.ts
│  │  │  ├─ layouts/
│  │  │  │  ├─ MainLayout.tsx
│  │  │  │  ├─ AuthLayout.tsx
│  │  │  │  └─ AdminLayout.tsx
│  │  │  ├─ pages/
│  │  │  │  ├─ auth/
│  │  │  │  │  ├─ LoginPage.tsx
│  │  │  │  │  ├─ RegisterPage.tsx
│  │  │  │  │  └─ VerifyOtpPage.tsx
│  │  │  │  ├─ properties/
│  │  │  │  │  ├─ PropertyListPage.tsx
│  │  │  │  │  ├─ PropertyDetailsPage.tsx
│  │  │  │  │  ├─ CreatePropertyPage.tsx
│  │  │  │  │  └─ EditPropertyPage.tsx
│  │  │  │  ├─ favorites/
│  │  │  │  │  └─ FavoritesPage.tsx
│  │  │  │  ├─ admin/
│  │  │  │  │  ├─ AdminDashboardPage.tsx
│  │  │  │  │  ├─ ManageUsersPage.tsx
│  │  │  │  │  └─ ManagePropertiesPage.tsx
│  │  │  │  ├─ HomePage.tsx
│  │  │  │  ├─ NotFoundPage.tsx
│  │  │  │  └─ ForbiddenPage.tsx
│  │  │  ├─ routes/
│  │  │  │  ├─ AppRouter.tsx
│  │  │  │  ├─ ProtectedRoute.tsx          # Auth guard
│  │  │  │  └─ RoleRoute.tsx               # Role-based guard
│  │  │  ├─ services/                       # API clients + feature services
│  │  │  │  ├─ http/
│  │  │  │  │  ├─ axiosClient.ts            # Axios instance, interceptors, token refresh
│  │  │  │  │  └─ apiEndpoints.ts
│  │  │  │  ├─ auth.service.ts
│  │  │  │  ├─ property.service.ts
│  │  │  │  ├─ favorite.service.ts
│  │  │  │  ├─ map.service.ts
│  │  │  │  └─ upload.service.ts
│  │  │  ├─ state/
│  │  │  │  ├─ slices/
│  │  │  │  │  ├─ authSlice.ts
│  │  │  │  │  ├─ propertySlice.ts
│  │  │  │  │  ├─ favoriteSlice.ts
│  │  │  │  │  ├─ mapSlice.ts
│  │  │  │  │  └─ adminSlice.ts
│  │  │  │  └─ thunks/
│  │  │  │     ├─ authThunks.ts
│  │  │  │     ├─ propertyThunks.ts
│  │  │  │     └─ favoriteThunks.ts
│  │  │  ├─ types/
│  │  │  │  ├─ api.types.ts
│  │  │  │  ├─ auth.types.ts
│  │  │  │  ├─ property.types.ts
│  │  │  │  └─ user.types.ts
│  │  │  ├─ utils/
│  │  │  │  ├─ formatCurrency.ts
│  │  │  │  ├─ distance.ts
│  │  │  │  ├─ storage.ts
│  │  │  │  └─ validators.ts
│  │  │  ├─ constants/
│  │  │  │  ├─ roles.ts
│  │  │  │  └─ appConfig.ts
│  │  │  ├─ i18n/
│  │  │  ├─ main.tsx
│  │  │  └─ vite-env.d.ts
│  │  ├─ tests/
│  │  │  ├─ unit/
│  │  │  ├─ integration/
│  │  │  └─ e2e/
│  │  ├─ .env.example                      # Frontend env template
│  │  ├─ package.json
│  │  ├─ tsconfig.json
│  │  ├─ vite.config.ts
│  │  └─ Dockerfile
│  │
│  └─ api/                                 # Express backend app
│     ├─ src/
│     │  ├─ app.ts                         # Express app assembly
│     │  ├─ server.ts                      # HTTP server bootstrap
│     │  ├─ config/
│     │  │  ├─ env.ts                      # Environment variable parsing/validation
│     │  │  ├─ db.ts                       # MongoDB connection
│     │  │  ├─ jwt.ts
│     │  │  ├─ otp.ts
│     │  │  ├─ cors.ts
│     │  │  └─ upload.ts
│     │  ├─ modules/                       # Feature-based modular architecture
│     │  │  ├─ auth/
│     │  │  │  ├─ auth.controller.ts
│     │  │  │  ├─ auth.service.ts
│     │  │  │  ├─ auth.repository.ts
│     │  │  │  ├─ auth.routes.ts
│     │  │  │  ├─ auth.validator.ts
│     │  │  │  └─ auth.types.ts
│     │  │  ├─ users/
│     │  │  │  ├─ user.controller.ts
│     │  │  │  ├─ user.service.ts
│     │  │  │  ├─ user.repository.ts
│     │  │  │  ├─ user.routes.ts
│     │  │  │  ├─ user.validator.ts
│     │  │  │  └─ user.types.ts
│     │  │  ├─ properties/
│     │  │  │  ├─ property.controller.ts
│     │  │  │  ├─ property.service.ts
│     │  │  │  ├─ property.repository.ts
│     │  │  │  ├─ property.routes.ts
│     │  │  │  ├─ property.validator.ts
│     │  │  │  ├─ property.types.ts
│     │  │  │  └─ property.geo.ts          # Geospatial helpers
│     │  │  ├─ favorites/
│     │  │  │  ├─ favorite.controller.ts
│     │  │  │  ├─ favorite.service.ts
│     │  │  │  ├─ favorite.repository.ts
│     │  │  │  ├─ favorite.routes.ts
│     │  │  │  └─ favorite.validator.ts
│     │  │  ├─ admin/
│     │  │  │  ├─ admin.controller.ts
│     │  │  │  ├─ admin.service.ts
│     │  │  │  ├─ admin.repository.ts
│     │  │  │  ├─ admin.routes.ts
│     │  │  │  └─ admin.validator.ts
│     │  │  └─ uploads/
│     │  │     ├─ upload.controller.ts
│     │  │     ├─ upload.service.ts
│     │  │     └─ upload.routes.ts
│     │  ├─ models/                        # Mongoose models
│     │  │  ├─ User.model.ts
│     │  │  ├─ Property.model.ts
│     │  │  ├─ Favorite.model.ts
│     │  │  └─ OtpToken.model.ts
│     │  ├─ routes/
│     │  │  ├─ index.ts                    # Mount /api/v1 routes
│     │  │  ├─ v1/
│     │  │  │  ├─ auth.routes.ts
│     │  │  │  ├─ user.routes.ts
│     │  │  │  ├─ property.routes.ts
│     │  │  │  ├─ favorite.routes.ts
│     │  │  │  ├─ admin.routes.ts
│     │  │  │  └─ upload.routes.ts
│     │  │  └─ health.routes.ts
│     │  ├─ middleware/
│     │  │  ├─ auth.middleware.ts          # Verify JWT
│     │  │  ├─ role.middleware.ts          # RBAC guard
│     │  │  ├─ validate.middleware.ts      # Request schema validation
│     │  │  ├─ error.middleware.ts         # Global error handler
│     │  │  ├─ notFound.middleware.ts
│     │  │  ├─ rateLimit.middleware.ts
│     │  │  ├─ upload.middleware.ts        # Multer config/limits
│     │  │  └─ requestId.middleware.ts
│     │  ├─ validators/
│     │  │  ├─ common.validator.ts
│     │  │  └─ geo.validator.ts
│     │  ├─ services/
│     │  │  ├─ jwt.service.ts
│     │  │  ├─ otp.service.ts
│     │  │  ├─ email.service.ts
│     │  │  ├─ sms.service.ts
│     │  │  ├─ storage.service.ts          # Cloudinary/S3 abstraction
│     │  │  └─ geo.service.ts              # Distance calculations
│     │  ├─ repositories/
│     │  │  ├─ base.repository.ts
│     │  │  └─ index.ts
│     │  ├─ utils/
│     │  │  ├─ ApiError.ts
│     │  │  ├─ ApiResponse.ts
│     │  │  ├─ logger.ts
│     │  │  ├─ asyncHandler.ts
│     │  │  ├─ password.ts
│     │  │  └─ pagination.ts
│     │  ├─ types/
│     │  │  ├─ express.d.ts
│     │  │  ├─ role.types.ts
│     │  │  └─ api.types.ts
│     │  └─ docs/
│     │     ├─ openapi.yaml
│     │     └─ postman_collection.json
│     ├─ tests/
│     │  ├─ unit/
│     │  ├─ integration/
│     │  └─ contract/
│     ├─ uploads/                          # Local dev uploads (gitignored)
│     ├─ .env.example                      # Backend env template
│     ├─ package.json
│     ├─ tsconfig.json
│     ├─ nodemon.json
│     └─ Dockerfile
│
├─ packages/                               # Shared packages across apps
│  ├─ shared-types/
│  │  ├─ src/
│  │  │  ├─ auth.ts
│  │  │  ├─ property.ts
│  │  │  ├─ favorite.ts
│  │  │  └─ api.ts
│  │  ├─ package.json
│  │  └─ tsconfig.json
│  ├─ ui-kit/                              # Optional shared component library
│  │  ├─ src/
│  │  ├─ package.json
│  │  └─ tsconfig.json
│  └─ eslint-config-custom/
│
├─ infrastructure/
│  ├─ docker/
│  │  ├─ nginx/
│  │  │  └─ default.conf
│  │  ├─ mongo/
│  │  │  └─ init-mongo.js
│  │  └─ scripts/
│  │     ├─ wait-for-it.sh
│  │     └─ backup-mongo.sh
│  ├─ terraform/                           # Optional infra as code
│  └─ k8s/                                 # Optional future Kubernetes manifests
│
├─ scripts/
│  ├─ setup.sh
│  ├─ seed.ts
│  ├─ migrate.ts
│  └─ create-admin.ts
│
├─ docker-compose.yml                      # Local/dev multi-container setup
├─ docker-compose.prod.yml                 # Production-oriented compose
├─ .env.example                            # Root env template for shared values
├─ .gitignore
├─ package.json                            # Workspace root scripts
├─ pnpm-workspace.yaml                     # or npm/yarn workspaces
├─ turbo.json                              # Optional monorepo task runner
└─ README.md
```

---

## 2) Naming Conventions (Recommended)

- **Folders:** `kebab-case` (e.g., `property-details`, `shared-types`)
- **React components:** `PascalCase.tsx` (e.g., `PropertyCard.tsx`)
- **Hooks:** `camelCase` prefixed with `use` (e.g., `useGeolocation.ts`)
- **Redux slices:** `featureSlice.ts` (e.g., `authSlice.ts`)
- **Backend modules:** singular/plural by domain (`auth`, `users`, `properties`)
- **Files by layer:** `*.controller.ts`, `*.service.ts`, `*.repository.ts`, `*.routes.ts`, `*.validator.ts`
- **Constants/Enums:** `UPPER_SNAKE_CASE` for values, `PascalCase` for enum/type names
- **Environment variables:** `UPPER_SNAKE_CASE`

---

## 3) Environment Variables Placement

- `/.env.example` → shared environment keys (non-secret template)
- `/apps/web/.env.example` → frontend-only keys (`VITE_API_BASE_URL`, `VITE_MAPS_API_KEY`)
- `/apps/api/.env.example` → backend-only secrets/settings (`MONGO_URI`, `JWT_SECRET`, `SMTP_*`, `CLOUDINARY_*`)
- **Never commit real `.env` files**; use secret managers in production (e.g., AWS Secrets Manager, Doppler, Vault).

---

## 4) API Versioning Strategy

- Prefix all API routes with `/api/v1`.
- Put each version in `apps/api/src/routes/v1`.
- New breaking changes go to `/api/v2` with parallel route modules.
- Keep shared business logic in services/repositories; only version controllers/routes when possible.

---

## 5) Authentication & Authorization Architecture

- **Auth flow:** register → OTP verify → login → JWT access token (and optional refresh token).
- **Middleware chain:** `auth.middleware.ts` verifies token, `role.middleware.ts` enforces RBAC.
- **Roles:** `GUEST`, `USER`, `OWNER`, `ADMIN`.
- **Token storage:** secure HTTP-only cookies preferred (or memory + refresh strategy).
- **Password security:** hash with `bcrypt`/`argon2`, strong policy validation.

---

## 6) Image Upload Architecture

- Upload endpoint in `uploads` module with `multer` limits and MIME validation.
- Storage abstraction in `storage.service.ts` to switch local/S3/Cloudinary without changing controllers.
- Property images array stored in `Property.model.ts` (URLs + metadata).
- Use async background optimization/thumbnails (e.g., `sharp`) for performance.

---

## 7) Maps & Geolocation Integration Structure

- Frontend hooks: `useGeolocation.ts` for browser location.
- Map components under `components/map/` for isolation and reuse.
- Backend geospatial queries in `property.repository.ts` using MongoDB `2dsphere` index.
- Distance logic in `geo.service.ts` and `property.geo.ts`.
- API endpoint example: `GET /api/v1/properties/nearby?lat=..&lng=..&radius=..`.

---

## 8) Reusable UI Architecture

- **Atomic style layering:** `common` primitives + domain components.
- Keep domain-specific UI in feature folders (`property`, `auth`, `map`).
- Shared design tokens in `assets/styles/variables.scss`.
- Optional `packages/ui-kit` for cross-app component reuse.

---

## 9) Recommended Libraries

### Frontend
- `@reduxjs/toolkit`, `react-redux`
- `react-router-dom`
- `axios`
- `react-hook-form` + `zod` + `@hookform/resolvers`
- `@tanstack/react-query` (optional for server-state caching)
- `leaflet` + `react-leaflet` (or Google Maps SDK)
- `bootstrap` + `sass`
- `i18next` (optional internationalization)

### Backend
- `express`, `mongoose`
- `jsonwebtoken`, `bcrypt` or `argon2`
- `multer`, `sharp`
- `zod` or `joi` for validation
- `helmet`, `cors`, `express-rate-limit`, `hpp`
- `pino` (or `winston`) + `pino-http`
- `nodemailer` or SMS provider SDK for OTP

### Testing/Quality
- `vitest`/`jest`, `supertest`
- `eslint`, `prettier`, `lint-staged`, `husky`
- `cypress` or `playwright` for e2e

---

## 10) State Management Approach

- **Recommended:** Redux Toolkit for auth, properties, favorites, admin, map filters.
- **Use Context API only for lightweight global concerns** (theme/locale).
- Optionally combine RTK + React Query:
  - RTK for client/global state
  - React Query for API cache, background refetch, stale management

---

## 11) Error Handling Architecture

- Central `ApiError` class + global `error.middleware.ts`.
- Standardized response envelope:
  - `success`, `message`, `data`, `errorCode`, `traceId`.
- Validation errors normalized in one place.
- Frontend global error boundary + API interceptor handling (401/403/500).

---

## 12) Logging Architecture

- Structured JSON logs (`pino`) with request IDs.
- Log levels: `debug`, `info`, `warn`, `error`, `fatal`.
- Separate audit logs for admin operations (ban/delete/approve).
- Centralized log shipping in production (ELK/Datadog/CloudWatch).

---

## 13) Security Best Practices

- `helmet`, strict CORS, rate limiting, HPP, input sanitization.
- JWT expiration + refresh rotation.
- Password hashing with salt and strong params.
- OTP expiry, retry limits, and lockout windows.
- File upload validation (type, size, malware scanning if possible).
- Use HTTPS everywhere, secure cookies, CSRF protection if cookie auth.
- Principle of least privilege for DB users and cloud IAM roles.

---

## 14) Deployment-Ready Notes

- Multi-stage Dockerfiles for `web` and `api`.
- `docker-compose.yml` for local development.
- `docker-compose.prod.yml` for production-like environment.
- Health checks (`/health`) and readiness endpoints.
- CI/CD should run lint, tests, build, vulnerability scan, and deploy.
- Separate environments: `dev`, `staging`, `prod` with strict secret isolation.

---

## 15) Example Docker Compose Service Layout

```yaml
services:
  web:
    build: ./apps/web
    ports: ["3000:3000"]
    depends_on: [api]

  api:
    build: ./apps/api
    ports: ["5000:5000"]
    depends_on: [mongo]
    env_file:
      - ./apps/api/.env

  mongo:
    image: mongo:7
    ports: ["27017:27017"]
    volumes:
      - mongo_data:/data/db

  nginx:
    image: nginx:stable
    volumes:
      - ./infrastructure/docker/nginx/default.conf:/etc/nginx/conf.d/default.conf
    ports: ["80:80"]
    depends_on: [web, api]

volumes:
  mongo_data:
```

This architecture supports **feature growth**, **team scalability**, **production observability**, and **secure operations** while staying clean for long-term maintenance.
