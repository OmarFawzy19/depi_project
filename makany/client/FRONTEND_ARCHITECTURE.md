# Frontend Architecture

## Tools Used
- React + Vite + TypeScript
- React Router for route boundaries and protected pages
- Axios for centralized HTTP communication
- TailwindCSS for responsive utility-first UI
- Context API for auth state and inversion of control
- Custom hooks (`useAuth`, `useFetch`) for reusable logic

## Layered Design
1. **UI Layer** (`components`, `pages`) renders visual state only.
2. **Domain/State Layer** (`context`, `hooks`) manages auth/session and async state.
3. **Data Access Layer** (`services`) encapsulates API contracts and fallback mocks.
4. **Infrastructure Layer** (`config`, `utils`) stores constants and shared helpers.

## Dependency Injection & IoC
- `AuthProvider` injects authentication state/actions into the component tree.
- UI components consume abstracted services/hooks rather than constructing API clients.
- `apiClient` is a single Axios dependency shared by all services.

## Routing Design
- Public routes: `/`, `/login`, `/properties`
- Protected route wrapper guards `/dashboard`.
- Wildcard route renders dedicated `NotFound` page.

## Scalability Notes
- Services can be switched from mock fallback to real backend without page rewrites.
- Reusable UI building blocks (`Button`, `Card`, `Loader`) reduce duplication.
- Folder-by-feature pages + shared app shell keeps architecture explainable during demos.
