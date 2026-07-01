# ADR-0001: Phase 0 Foundation Decisions

**Status:** Locked
**Date:** 2026-06-30
**Scope:** Cross-cutting decisions that the Phase 1 (Foundation) schema and infrastructure depend on. Nothing here builds CRM features — it fixes the choices so Phase 1+ migrations aren't re-litigated.

---

## 1. Auth: NextAuth.js (Auth.js)

**Decision:** NextAuth.js with the Prisma adapter, credentials provider (email + password) to start.

**Why:** The existing `User` model (`prisma/schema.prisma`) already has `passwordHash` and `role: 'admin' | 'manager' | 'agent'`, which is exactly the shape NextAuth's credentials provider expects. The Team page's planned RBAC (`Role`/`RolePermission` joined to `User`) requires `User` to be a first-class table we own — a managed provider (Clerk) would put identity behind an external ID we'd have to sync in.

**Packages:** `next-auth`, `@auth/prisma-adapter`

**Rejected:** Clerk (cost + indirection for RBAC), custom JWT (re-implements security-sensitive flows for no benefit over NextAuth).

---

## 2. Lead modeling: `Contact.type` enum

**Decision:** Extend `Contact` with `type: 'lead' | 'contact'` and `convertedAt: DateTime?`, rather than a separate `Lead` model.

**Why:** Leads and contacts share the same relations (`Deal`, `Task`, `EmailLog`). A separate `Lead` table would require rewiring every FK (`dealId`, `taskId`, etc.) at conversion time. A single table makes "conversion" an `UPDATE`, not a migration.

**Schema impact (Phase 1):** Add `type` enum (default `'lead'`) and `convertedAt` to `Contact`. Lead-only fields (`source`, `leadScore`, intent/whatsapp flags) already exist or are nullable.

**Rejected:** Separate `Lead` model (conversion-time FK rewiring risk).

---

## 3. Task unification

**Decision:** Single `Task` model with `contextType: 'deal' | 'project' | 'contact' | 'general'` and nullable `dealId` / `projectId` / `contactId`.

**Why:** Three task surfaces exist today (Prisma `Task`, Workspace localStorage tasks, deal task manager) representing the same entity. Unifying now — before any task API exists — is the cheapest point to do it.

**Schema impact (Phase 1):** Existing `Task` model gains `contextType` enum + `projectId` (new FK, `Project` model arrives in Phase 4 — column added now as nullable, constrained later).

**Rejected:** Keeping three separate systems (duplicated CRUD, no cross-context task queries).

---

## 4. Multi-tenancy: Single-org

**Decision:** No `tenant_id` column anywhere. Tagverse CRM is being built for internal company use only, not resold to multiple client organizations.

**Why:** Confirmed directly by stakeholder — this is an internal tool, not multi-tenant SaaS. The Lentone "dual-portal" concept (Super Admin / Field Sales Exec / Delivery Agent) is **roles within one org**, handled by `Role`/`RolePermission` in Phase 10, not data isolation.

**RBAC posture:** Default to **permissive** — all employee roles get broad view/edit access across modules by default. Restrictions are scoped narrowly (Settings, financial data, delete actions) rather than locking every module down per role from the start.

**Rejected:** `tenant_id` on every table (unnecessary complexity for a single-org internal tool).

---

## 5. File storage: S3-compatible client, MinIO (dev), R2 (prod)

**Decision:** Write storage code against the S3 API (`@aws-sdk/client-s3`, `@aws-sdk/s3-request-presigner`). Run MinIO locally via `docker-compose.yml`. Use Cloudflare R2 in production.

**Why:** S3-compatible client code works unmodified across MinIO and R2 — only the endpoint/credentials env vars change. R2's zero egress fees matter here given heavy file usage planned (quote/invoice/contract PDFs, content assets, proof-of-delivery photos).

**Infra impact (Phase 1):** Add a `minio` service block to `docker-compose.yml` (done as part of this ADR — see below).

---

## 6. Real-time: SSE default, Socket.io for war room only

**Decision:** Server-Sent Events for activity feed, deal notifications, and field-monitoring KPI updates (all one-directional, server→client). Socket.io + Redis adapter reserved exclusively for Team war-room chat (Phase 4), which is genuinely bidirectional.

**Why:** Most "real-time" features here are one-way pushes — SSE needs no extra library and fits Next.js route handlers directly. Standing up a persistent WebSocket server for the whole app when only one feature needs bidirectional push is unnecessary infrastructure.

**Packages (deferred to Phase 4):** `socket.io`, `socket.io-redis-adapter`.

---

## 7. Currency: per-record column, integer minor units

**Decision:** `currency` column (ISO 3-letter code, e.g. `INR`) on `Deal`, `Quote`, `Invoice`, `Payment`, `Contract`, defaulting from `OrganizationSettings.currency`. All monetary amounts stored as `Int` in minor units (paise/cents), not float/decimal.

**Why:** Mock data already mixes INR/USD across deals. Integer minor units avoid floating-point rounding errors in financial calculations — cheap to do now, painful to retrofit once invoices/payments have real data.

**Schema impact (Phase 1/3):** `OrganizationSettings` model (new, Phase 1) carries the org default; monetary fields across `Deal`/`Quote`/`Invoice`/`Payment`/`Contract` get `currency` + `Int`-typed amount columns when those models are extended (Phase 2/3).

---

## Phase 1 schema checklist (derived from this ADR)

- [x] `User`, `Account`, `Session`, `VerificationToken` — NextAuth Prisma adapter tables
- [x] `Contact.type` enum + `convertedAt`
- [x] `Task.contextType` enum + `projectId` (nullable)
- [x] No `tenant_id` anywhere
- [x] `OrganizationSettings` model with `currency` field
- [x] No multi-tenant Prisma middleware

## Dependencies (installed)

| Concern | Package(s) |
|---|---|
| Auth | `next-auth` (v4.24), `@auth/prisma-adapter` |
| Validation | `zod` |
| File storage | `@aws-sdk/client-s3`, `@aws-sdk/s3-request-presigner` |
| Password hashing | `bcryptjs` |
| Seed script runner | `tsx` (dev dependency) |
| Real-time (war room, Phase 4) | `socket.io`, `socket.io-redis-adapter` — not yet installed, deferred |

`bullmq` and `ioredis` were already present in `package.json`.

## Phase 1 implementation notes

- Route protection uses **`src/proxy.ts`**, not `middleware.ts` — this Next.js version (16.2.9) renamed the middleware file convention to "Proxy" (confirmed via `node_modules/next/dist/docs/01-app/03-api-reference/03-file-conventions/proxy.md`). Anyone extending route protection later should keep using `proxy.ts`.
- Prisma 7 uses `prisma.config.ts` (`defineConfig`) instead of a `package.json#prisma` key for schema path and seed command.
- Seed script (`prisma/seed.ts`) is intentionally minimal for Phase 1 — one admin user (`admin@tagverse.com` / `password123`) and one `OrganizationSettings` row. Full `mockData.ts` → DB seeding is Phase 2+ work, once the CRM-core models (Company, Pipeline, etc.) exist.

## Known environment limitation (not a code defect)

`npx prisma generate` (and therefore `prisma migrate dev` / `db push`) cannot complete in this sandboxed session: the schema-engine binary download from `binaries.prisma.sh` is reset by the sandbox's egress proxy every attempt (confirmed via `DEBUG=prisma:* npx prisma generate` — the proxy is correctly detected and used, but the connection is reset mid-download, not a clean 403). This blocks generating `@prisma/client` types locally in this environment, so full `tsc` verification against real Prisma types wasn't possible here.
**Action needed:** run `npm install && npx prisma generate` in an environment with unrestricted access to `binaries.prisma.sh` (or a local dev machine) before running migrations or the dev server.
