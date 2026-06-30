# Tagverse CRM — Complete Backend Implementation Analysis

Permanent reference document mapping the Tagverse CRM frontend to required backend services, API contracts, schema gaps, infrastructure, and phased implementation plans.

**Status:** Planning only — no backend code has been implemented yet.

---

## 1. Current State Summary

### What exists today

| Layer | Status | Key files |
|-------|--------|-----------|
| **Frontend UI** | 28 implemented CRM pages, rich CRUD UI | [`src/app/(crm)/`](../src/app/(crm)/) |
| **Data layer** | 100% mock / localStorage / Zustand | [`src/lib/mockData.ts`](../src/lib/mockData.ts), [`src/context/WorkspaceContext.tsx`](../src/context/WorkspaceContext.tsx) |
| **API routes** | 1 stub only | [`src/app/api/webhooks/whatsapp/route.ts`](../src/app/api/webhooks/whatsapp/route.ts) |
| **Database schema** | Defined, unused | [`prisma/schema.prisma`](../prisma/schema.prisma) |
| **Infrastructure** | Docker only | [`docker-compose.yml`](../docker-compose.yml) — Postgres, Redis, n8n |
| **Auth** | None | No login, middleware, or session |
| **HTTP client** | None | Zero `fetch()`, axios, SWR, React Query in `src/` |

### Architecture today (frontend-only)

```mermaid
flowchart LR
  subgraph frontend [Next.js Frontend]
    Pages["28 CRM Pages"]
    MockData["mockData.ts"]
    LocalStorage["localStorage / Zustand"]
    Pages --> MockData
    Pages --> LocalStorage
  end
  subgraph infra [Docker - Unused by App]
    Postgres[(PostgreSQL)]
    Redis[(Redis)]
    N8n[n8n]
  end
  WhatsAppStub["/api/webhooks/whatsapp"] -->|"console.log only"| Postgres
  Pages -.->|"no connection"| Postgres
```

### Intended target architecture

```mermaid
flowchart TB
  subgraph external [External Services]
    Meta["Meta Ads / WhatsApp"]
    Stripe["Stripe"]
    SocialAPIs["Social Platform APIs"]
    OpenAI["AI Provider"]
  end
  subgraph app [Next.js App]
    UI["CRM UI Pages"]
    API["REST / Server Actions"]
    Jobs["BullMQ Workers"]
    UI --> API
    API --> Jobs
  end
  subgraph data [Data Layer]
    PG[(PostgreSQL via Prisma)]
    S3["Object Storage"]
    RedisQ[(Redis)]
  end
  subgraph automation [Automation]
    N8n[n8n Workflows]
  end
  Meta --> N8n
  N8n --> API
  Meta --> API
  API --> PG
  Jobs --> RedisQ
  Jobs --> PG
  API --> S3
  Stripe --> API
  SocialAPIs --> Jobs
  OpenAI --> API
```

---

## 2. Frontend Page Inventory → Backend Requirements

### 2.1 Dashboard & Overview (`/dashboard`, `/overview`, `/activity`)

**Frontend behavior:** KPI cards, pipeline snapshot, funnel charts, activity timeline, upcoming events, n8n workflow stats — all from inline mock or [`mockData.ts`](../src/lib/mockData.ts).

**Backend needed:**

| Capability | Endpoints / Services |
|------------|---------------------|
| Aggregated KPIs | `GET /api/dashboard/kpis?range=30d` — deals won, pipeline value, active leads, tasks overdue |
| Pipeline snapshot | `GET /api/dashboard/pipeline-summary` — count + value per stage |
| Activity feed | `GET /api/activities?limit=50&cursor=` + `POST /api/activities` |
| Upcoming events | `GET /api/calendar/upcoming?days=7` |
| Automation stats | `GET /api/automation/stats` — workflow run counts from `AutomationLog` |
| Real-time updates | WebSocket or SSE channel `/api/events/stream` for live feed |

**New Prisma models required:**

```prisma
model Activity {
  id, type, title, description, status, priority, duration
  companyId?, contactId?, dealId?, ownerId
  scheduledAt, completedAt, createdAt
}
model Company {
  id, name, industry, stage, dealValue, health, logo, color, ownerId
}
```

**Activity types from UI:** `meeting`, `task`, `deadline`, `followup` — map to unified `Activity` table with polymorphic links.

---

### 2.2 CRM Core

#### Leads (`/leads`) — [`src/app/(crm)/leads/page.tsx`](../src/app/(crm)/leads/page.tsx)

**Form fields:** `name`, `company`, `phone`, `email`, `source`, `stage`, `score`, `owner`, `intent`, `whatsapp`

| Method | Endpoint | Notes |
|--------|----------|-------|
| GET | `/api/leads?stage=&source=&owner=&search=` | Paginated list |
| GET | `/api/leads/:id` | Single lead |
| POST | `/api/leads` | Create |
| PATCH | `/api/leads/:id` | Update |
| DELETE | `/api/leads/:id` | Soft-delete preferred |
| POST | `/api/leads/:id/convert` | Convert lead → contact + optional deal |

**Schema decision:** UI treats Leads and Contacts separately; Prisma has only `Contact`. Options:
- **Option A (recommended):** Add `type: 'lead' | 'contact'` on `Contact` + `convertedAt`
- **Option B:** Separate `Lead` model with conversion workflow

**Validation rules from UI:** name, email (regex), phone required.

#### Contacts (`/contacts`) — [`src/app/(crm)/contacts/page.tsx`](../src/app/(crm)/contacts/page.tsx)

**Form fields:** `name`, `company`, `role`, `phone`, `email`, `owner`, `tags[]`, `lastContact`, `created`

| Method | Endpoint |
|--------|----------|
| GET | `/api/contacts?search=&owner=&tags=` |
| POST/PATCH/DELETE | `/api/contacts/:id` |
| GET | `/api/contacts/:id/timeline` | Activity + deal history |

**Schema gaps:** `role`, `tags[]`, `lastContact` not in Prisma `Contact`. Add:
- `role String?`
- `tags String[]` or `ContactTag` join table
- `lastContactAt DateTime?`

#### Pipeline (`/pipeline`) — [`src/app/(crm)/pipeline/page.tsx`](../src/app/(crm)/pipeline/page.tsx)

Simpler single-pipeline kanban + WhatsApp side panel.

| Method | Endpoint |
|--------|----------|
| GET | `/api/pipeline` | Default pipeline with deals by stage |
| PATCH | `/api/deals/:id/stage` | Drag-drop stage change |
| GET | `/api/deals/:id/whatsapp-thread` | Messages linked to deal contact |

#### Deals (`/deals`) — [`src/app/(crm)/deals/page.tsx`](../src/app/(crm)/deals/page.tsx)

**Multi-pipeline system** from [`dealsMockData.ts`](../src/app/(crm)/deals/dealsMockData.ts):
- Pipelines: `web_dev`, `marketing`, `saas`, `influencer`
- Per-pipeline custom stages with probability defaults

**Deal fields:** `name`, `client`, `value`, `pipelineId`, `stage`, `owner`, `tags[]`, `probability`, `daysInStage`, `source`, `serviceType`, `expectedClose`, `lastContact`, `nextFollowUp`, `notes`

| Method | Endpoint |
|--------|----------|
| GET | `/api/pipelines` | List pipelines + stage configs |
| POST | `/api/pipelines` | Admin: create pipeline |
| GET | `/api/deals?pipelineId=&stage=&owner=` |
| POST/PATCH/DELETE | `/api/deals/:id` |
| PATCH | `/api/deals/:id/stage` | Body: `{ stage, pipelineId }` |
| GET | `/api/deals/:id/notifications` | Deal-scoped notifications |

**New Prisma models:**

```prisma
model Pipeline {
  id, name, icon, sortOrder, isDefault
  stages PipelineStage[]
  deals  Deal[]
}
model PipelineStage {
  id, pipelineId, key, label, color, defaultProbability
  isClosing, isWon, sortOrder
}
```

Extend `Deal` with: `pipelineId`, `pipelineStageKey`, `probability`, `source`, `serviceType`, `tags`, `lastContactAt`, `nextFollowUpAt`, `daysInStage` (computed or stored).

#### Funnel (`/funnel`)

Analytics-only page. Backend:
- `GET /api/analytics/funnel?pipelineId=&dateRange=`
- Server-side aggregation: leads → qualified → proposal → won counts + conversion rates

#### Field Monitoring (`/field-monitoring`) — FMCG use case

**UI entities:** field agents (status, location, battery), activity feed, KPIs, broadcast message button.

**Not in Prisma.** New models:

```prisma
model FieldAgent {
  id, userId, status, lastCheckInAt, lastLocationLat, lastLocationLng
  batteryLevel, currentDeliveryId?
}
model FieldCheckIn {
  id, agentId, type, lat, lng, timestamp, notes
}
model FieldActivityLog {
  id, agentId, type, message, metadata Json, createdAt
}
```

| Method | Endpoint |
|--------|----------|
| GET | `/api/field/agents?status=` |
| POST | `/api/field/check-in` | Mobile agent app |
| POST | `/api/field/check-out` | |
| GET | `/api/field/feed` | Activity feed |
| POST | `/api/field/broadcast` | Push message to all active agents |
| GET | `/api/field/kpis` | Active agents, deliveries in progress |

Integrates with WhatsApp webhook (`agent_action` payload type already stubbed).

---

### 2.3 Revenue Hub

#### Quotes (`/quotes`) — [`QuoteBuilderModal.tsx`](../src/app/(crm)/quotes/QuoteBuilderModal.tsx)

**Fields:** `client`, `contact`, `email`, `phone`, `scope`, `lineItems[]` (desc, qty, price), `gstRate`, `discountRate`, `terms`, `delivery`, `notes`, `status`

| Method | Endpoint |
|--------|----------|
| GET/POST/PATCH/DELETE | `/api/quotes/:id` |
| POST | `/api/quotes/:id/send` | Email PDF to client |
| POST | `/api/quotes/:id/convert-invoice` | Creates invoice from quote |
| GET | `/api/quotes/:id/pdf` | Generate PDF |

**Schema extension:** Add `clientName`, `contactName`, `email`, `phone`, `scope`, `terms`, `deliveryNotes`, `gstRate`, `discountRate`, `currency` to `Quote`.

#### Invoices (`/invoices`)

Same builder with `docType: 'Invoice'`. Status flow: Draft → Sent → Paid → Overdue.

| Method | Endpoint |
|--------|----------|
| CRUD | `/api/invoices/:id` |
| POST | `/api/invoices/:id/send` |
| POST | `/api/invoices/:id/mark-paid` |
| GET | `/api/invoices/overdue` | For dashboard alerts |

#### Contracts (`/contracts`) — [`ContractWizard.tsx`](../src/app/(crm)/contracts/ContractWizard.tsx)

**7 template types:** Service Agreement, NDA, Employment, Vendor, Subscription, Partnership, Custom.

Template-specific fields vary (jurisdiction, employee details, plan/seats, etc.).

| Method | Endpoint |
|--------|----------|
| CRUD | `/api/contracts/:id` |
| GET | `/api/contracts/templates` | Template definitions |
| POST | `/api/contracts/:id/send` | E-sign request |
| POST | `/api/contracts/:id/sign` | Webhook from DocuSign/HelloSign |
| GET | `/api/contracts/:id/pdf` |

**Schema extension:** Add `templateType`, `metadata Json` (template-specific fields), `clientName`, `value`, `startDate`, `endDate`.

#### Payments (`/payments`)

**Fields:** `client`, `invoiceId`, `amount`, `method` (UPI/NEFT/Cheque/Pending), `status`

| Method | Endpoint |
|--------|----------|
| GET | `/api/payments?status=&invoiceId=` |
| POST | `/api/payments` | Manual record |
| POST | `/api/webhooks/stripe` | Stripe payment confirmation |
| GET | `/api/payments/summary` | Ledger totals |

**Schema extension:** Add `method`, `status`, `clientName` to `Payment`. Stripe integration for `stripePaymentId`.

---

### 2.4 Marketing

#### Content Hub (`/content`)

Kanban: Ideas → Draft → Review → Scheduled → Published → Archived.

**Fields:** `title`, `type`, `campaign`, `funnelStage`, `persona`, `priority`, `dueDate`, `description`, `status`, comments.

**Not in Prisma.** New model:

```prisma
model ContentItem {
  id, title, type, campaignId?, funnelStage, persona, priority
  dueDate, description, status, authorId, createdAt, updatedAt
  comments ContentComment[]
}
```

#### Assets (`/assets`)

File library with folders, upload UI (currently client-only).

| Method | Endpoint |
|--------|----------|
| GET | `/api/assets?folder=` |
| POST | `/api/assets/upload` | Presigned S3 URL or direct upload |
| DELETE | `/api/assets/:id` |
| GET | `/api/assets/folders` |
| GET | `/api/assets/storage-usage` |

**Infrastructure:** S3-compatible storage (AWS S3, Cloudflare R2, MinIO). New model `Asset { id, name, folder, mimeType, size, url, uploadedById }`.

#### Campaigns (`/campaigns`)

Marketing campaigns with channel, budget, dates, status.

**Partial overlap:** Prisma `EmailCampaign` exists but UI campaigns are broader (Meta, LinkedIn, etc.).

New model `MarketingCampaign { id, name, channel, budget, startDate, endDate, status }` or extend existing.

#### Marketing Calendar (`/marketing-calendar`)

Scheduled content events.

| Method | Endpoint |
|--------|----------|
| CRUD | `/api/marketing-calendar` |
| GET | `/api/marketing-calendar?month=2026-06` |

New model `ScheduledContent { id, title, channel, date, time, authorId, type, companyId?, clientId?, color, status }`.

#### Social Media Manager (`/social`)

Compose posts, schedule, pending queue, platform metrics.

Maps to existing Prisma `SocialPost` + platform API integrations:

| Method | Endpoint |
|--------|----------|
| CRUD | `/api/social/posts` |
| POST | `/api/social/posts/:id/publish` | Immediate publish |
| GET | `/api/social/metrics?platform=` | Platform analytics |
| POST | `/api/social/posts/:id/schedule` | BullMQ delayed job |

**External integrations:** Meta Graph API, LinkedIn API, Twitter/X API — each needs OAuth token storage:

```prisma
model IntegrationCredential {
  id, userId, platform, accessToken, refreshToken, expiresAt
}
```

---

### 2.5 Workspace

#### Projects (`/projects`) — [`WorkspaceContext.tsx`](../src/context/WorkspaceContext.tsx)

Currently persisted to `localStorage` key `ws-projects`.

**Project fields:** `name`, `emoji`, `status`, `members[]`, `linkedDeal`, `budget`, `color`, dates, `progress`

| Method | Endpoint |
|--------|----------|
| CRUD | `/api/projects/:id` |
| PATCH | `/api/projects/:id/members` |
| GET | `/api/projects/:id/tasks` |

New models: `Project`, `ProjectMember` (join).

#### Task Manager (`/tasks`) — **Separate from workspace tasks**

Deal-centric tasks with scoring, quick capture. Fields: linked `dealId`, priority, due, status, owner.

| Method | Endpoint |
|--------|----------|
| CRUD | `/api/tasks/:id` |
| GET | `/api/tasks?dealId=&owner=&status=` |
| PATCH | `/api/tasks/:id/toggle` |

**Critical gap:** Three task systems exist:
1. Prisma `Task` (deal/contact linked)
2. Workspace tasks (`WorkspaceContext`, project-linked)
3. Deal task manager (`tasks/page.tsx`)

**Recommendation:** Unified `Task` model with `contextType: 'deal' | 'project' | 'contact' | 'general'` and optional `projectId`.

#### Calendar (`/calendar`)

Workspace calendar events. Fields: `title`, `date`, `time`, `attendees[]`, `linkedRecord`.

| Method | Endpoint |
|--------|----------|
| CRUD | `/api/calendar/events` |
| GET | `/api/calendar/events?start=&end=` | iCal-style range query |

New model `CalendarEvent` or extend Activity with `type: 'event'`.

#### Team (`/team`) — War room, leaderboard, deal routing, RBAC

| Feature | Backend |
|---------|---------|
| War room chat | `GET/POST /api/team/war-room/messages` — real-time via WebSocket |
| Leaderboard | `GET /api/team/leaderboard?period=month` — aggregate deals closed by rep |
| Deal routing | `POST /api/team/route-deal` — assignment algorithm |
| Role permissions | `GET/PUT /api/roles/:id/permissions` |

**RBAC from UI** ([`RolePermissionBuilder.tsx`](../src/app/(crm)/team/components/RolePermissionBuilder.tsx)):
- Roles: Admin, Manager, Sales Rep, Viewer
- Modules: deals, contacts, reports, settings
- Permissions: view, edit, delete per module

New models:

```prisma
model Role {
  id, name, isSystem
  permissions RolePermission[]
}
model RolePermission {
  roleId, module, canView, canEdit, canDelete
}
```

#### Deliveries (`/deliveries`)

4-stage kanban: Pending → Picked Up → In Transit → Delivered. Currently read-only.

| Method | Endpoint |
|--------|----------|
| CRUD | `/api/deliveries/:id` |
| PATCH | `/api/deliveries/:id/status` |
| POST | `/api/deliveries/:id/pod` | Proof of delivery (photo/signature) |
| GET | `/api/deliveries?agentId=&status=` |

New model `Delivery { id, clientId, volume, product, status, agentId, orderDate, deliveredAt, podUrl? }`.

---

### 2.6 Analytics & Reports

#### Analytics Dashboard (`/analytics`) — Zustand persist

Customizable widget dashboard with filters (date range, pipeline, owner, tags).

| Method | Endpoint |
|--------|----------|
| GET | `/api/analytics/widgets/:type/data` | KPI, bar, donut, funnel, area per widget |
| GET/PUT | `/api/analytics/dashboard-layout` | Persist user widget config |
| GET | `/api/analytics/filters/options` | Pipeline/owner/tag options |

Widget types from UI: KPI, Bar, Line, Area, Donut, Pie, Funnel.

Data sources aggregate from: deals, contacts, campaigns, payments.

#### Reports (`/reports`)

Report builder, saved reports, scheduled reports, export.

| Method | Endpoint |
|--------|----------|
| GET | `/api/reports/templates` |
| POST | `/api/reports/run` | Execute report query |
| GET/POST | `/api/reports/saved` |
| POST | `/api/reports/schedule` | Cron via BullMQ |
| GET | `/api/reports/:id/export?format=csv|pdf` |

New models: `SavedReport`, `ReportSchedule`.

---

### 2.7 Integration Hub (pages not yet built)

Sidebar links to 4 unimplemented pages:

| Route | Planned Backend |
|-------|-----------------|
| `/automation` | n8n workflow registry, trigger config, `AutomationLog` viewer, `POST /api/automation/trigger/:workflowId` |
| `/webhooks` | Webhook registry CRUD, inbound/outbound config, retry logs, signature verification |
| `/api` | API key management, rate limiting, usage metrics, OpenAPI spec endpoint |
| `/mcp` | MCP server config, tool registry, connection status — for AI agent integrations |

**Webhook manager model:**

```prisma
model WebhookEndpoint {
  id, name, url, direction, events[], secret, isActive, lastTriggeredAt
}
model WebhookDeliveryLog {
  id, endpointId, payload, response, statusCode, createdAt
}
```

---

### 2.8 Settings (`/settings`)

Tabs: General, Team, Tasks, Contracts, Analytics, Notifications — **all UI-only, Save buttons do nothing**.

| Tab | Backend |
|-----|---------|
| General | `GET/PUT /api/settings/organization` — company name, industry, timezone, theme |
| Team | `GET/POST/PATCH/DELETE /api/users` — invite flow with email |
| Tasks | `GET/PUT /api/settings/tasks` — default priorities, SLA rules |
| Contracts | `GET/PUT /api/settings/contracts` — default templates, terms |
| Analytics | `GET/PUT /api/settings/analytics` — default date range, currency |
| Notifications | `GET/PUT /api/settings/notifications` — email/push preferences per event type |

New model `OrganizationSettings { id, companyName, industry, timezone, currency, theme }`.

---

### 2.9 AI Assistant — Rio (`Topbar.tsx`)

Chat with file upload. Currently `setTimeout` stub response.

| Method | Endpoint |
|--------|----------|
| POST | `/api/ai/chat` | `{ messages[], context?: { page, entityId } }` |
| POST | `/api/ai/chat/upload` | File → vector store or context injection |
| GET | `/api/ai/chat/history` | Persist chat sessions |
| DELETE | `/api/ai/chat/history/:id` |

**Backend services:**
- LLM provider (OpenAI, Anthropic, etc.)
- RAG over CRM data (deals, contacts, reports)
- Tool calling for CRM actions ("show me overdue deals")
- Chat history storage: `ChatSession`, `ChatMessage` models

**MCP integration:** The `/mcp` page suggests exposing CRM as MCP tools for external AI agents.

---

## 3. Prisma Schema Gap Analysis

### Models in Prisma but weak/missing UI wiring

| Model | Gap |
|-------|-----|
| `User` | No auth, no user management API |
| `Contact` | Missing role, tags, lastContact; leads not distinguished |
| `Deal` | Missing pipelineId, tags, probability, source, follow-up dates |
| `Task` | Missing projectId, contextType; conflicts with workspace tasks |
| `EmailTemplate/Campaign/Log` | No email marketing UI page (Topbar references `/email` but no page) |
| `SocialPost` | UI exists but not wired |
| `SEOKeyword`, `AEOEntry` | Topbar references `/seo` page but no page exists |
| `AutomationLog` | Dashboard shows mock n8n stats only |

### UI entities with NO Prisma model

| Entity | Pages |
|--------|-------|
| Company | overview, contacts, activity |
| Pipeline + PipelineStage | deals, pipeline |
| Lead (as distinct entity) | leads |
| Project | projects |
| CalendarEvent | calendar |
| ContentItem | content |
| Asset | assets |
| MarketingCampaign | campaigns |
| ScheduledContent | marketing-calendar |
| Delivery | deliveries |
| FieldAgent, FieldCheckIn | field-monitoring |
| Activity (timeline) | activity, dashboard |
| Notification | deals topbar |
| Role/RolePermission | team |
| ChatSession | Topbar Rio |
| WebhookEndpoint | future /webhooks |
| OrganizationSettings | settings |
| IntegrationCredential | social, stripe |

---

## 4. Cross-Cutting Backend Concerns

### 4.1 Authentication & Authorization

**Required (currently absent):**

- Login / register / logout / password reset
- Session management (JWT + httpOnly cookie, or NextAuth.js)
- `middleware.ts` protecting `(crm)` routes
- RBAC middleware checking `RolePermission` per route/action
- Multi-tenant consideration if Tagverse serves multiple orgs (Lentone pitch mentions dual-portal)

**Suggested endpoints:**

```
POST /api/auth/register
POST /api/auth/login
POST /api/auth/logout
GET  /api/auth/session
POST /api/auth/forgot-password
POST /api/auth/reset-password
POST /api/auth/invite          # Admin invites team member
```

**Roles from codebase:**
- Prisma: `admin`, `manager`, `agent`
- Team UI: Admin, Manager, Sales Rep, Viewer
- Workspace: Admin, Member, Guest
- Lentone pitch: Super Admin, Field Sales Exec, Delivery Agent

→ Normalize to a single role system with permission matrix.

### 4.2 Notifications

UI shows deal notifications, follow-up reminders. Backend:

- `Notification { id, userId, type, text, entityType, entityId, read, createdAt }`
- Push via WebSocket/SSE
- Email digests via BullMQ scheduled job
- Trigger on: deal stage change, assignment, overdue follow-up, payment received

### 4.3 Search

Topbar has "Search anything..." (⌘K) — not wired.

- `GET /api/search?q=&types=deals,contacts,tasks`
- PostgreSQL full-text search or Elasticsearch/Meilisearch for scale

### 4.4 File Storage

Needed for: assets, contract PDFs, quote PDFs, Rio chat uploads, proof-of-delivery photos.

- S3-compatible object storage
- Presigned upload URLs
- `Asset` model with metadata

### 4.5 Background Jobs (BullMQ + Redis)

Already in `package.json` but unused. Job types:

| Job | Trigger |
|-----|---------|
| `publish-social-post` | Scheduled social content |
| `send-email-campaign` | Email drip sequences |
| `generate-report` | Scheduled reports |
| `check-overdue-invoices` | Daily cron |
| `follow-up-reminder` | Deal nextFollowUp date |
| `sync-stripe-payments` | Periodic reconciliation |
| `process-whatsapp-webhook` | Async message processing |

### 4.6 Real-time

Pages needing live updates: activity feed, field monitoring, team war room, deal notifications.

- WebSocket server (Socket.io) or Server-Sent Events
- Redis pub/sub for multi-instance scaling

### 4.7 Audit Log

For compliance and activity feed accuracy:

```prisma
model AuditLog {
  id, userId, action, entityType, entityId, changes Json, ip, createdAt
}
```

---

## 5. External Integrations Map

| Service | UI Reference | Backend Work |
|---------|-------------|--------------|
| **WhatsApp Business API** | pipeline, field-monitoring, webhook route | Message ingestion, outbound templates, phone→contact linking |
| **Meta Ads** | lead source "Meta Ads" | Lead form webhook via n8n |
| **Stripe** | payments, invoices, mock tasks | Payment intents, invoice sync, webhooks |
| **n8n** | dashboard, automation nav, docker-compose | Workflow triggers, webhook relay, lead routing |
| **Social APIs** | social page | OAuth, post scheduling, metrics pull |
| **E-sign (DocuSign/HelloSign)** | contracts wizard | Send/sign webhooks |
| **Email (SendGrid/Resend)** | email campaigns in schema | Transactional + campaign emails |
| **AI (OpenAI/Anthropic)** | Rio chat | Chat completion, RAG, tool use |
| **Maps/GPS** | field-monitoring | Geolocation on check-in (Phase 2 per Lentone doc) |

---

## 6. Environment Variables Needed

Create `.env.example`:

```env
# Database
DATABASE_URL=postgresql://postgres:postgres@localhost:5432/tagverse_crm

# Redis
REDIS_URL=redis://localhost:6379

# Auth
JWT_SECRET=
NEXTAUTH_SECRET=
NEXTAUTH_URL=http://localhost:3000

# WhatsApp
WHATSAPP_VERIFY_TOKEN=
WHATSAPP_ACCESS_TOKEN=
WHATSAPP_PHONE_NUMBER_ID=

# Stripe
STRIPE_SECRET_KEY=
STRIPE_WEBHOOK_SECRET=

# Storage
S3_BUCKET=
S3_REGION=
S3_ACCESS_KEY=
S3_SECRET_KEY=

# Email
SMTP_HOST=
SMTP_USER=
SMTP_PASS=

# AI
OPENAI_API_KEY=

# n8n
N8N_WEBHOOK_URL=
N8N_API_KEY=

# Social OAuth
META_APP_ID=
META_APP_SECRET=
LINKEDIN_CLIENT_ID=
LINKEDIN_CLIENT_SECRET=
```

---

## 7. Recommended API Architecture

### Option A: Next.js API Routes + Prisma (recommended for this codebase)

- REST endpoints under `src/app/api/`
- Shared `src/lib/db.ts` Prisma singleton
- `src/lib/services/` for business logic
- Zod validation schemas
- Minimal migration path from current structure

### Option B: Server Actions

- Colocate mutations with pages
- Good for forms; harder for webhooks, mobile apps, n8n

### Option C: Separate backend service

- Express/Fastify microservice
- Overkill for current scope unless mobile apps need separate API

**Recommendation:** Option A with selective Server Actions for simple form mutations. Keep webhooks and background jobs as API routes.

### API conventions

```
/api/v1/{resource}
Pagination: ?page=1&limit=20
Sorting: ?sort=createdAt&order=desc
Filtering: query params per resource
Response: { data, meta: { total, page, limit }, error? }
Auth: Bearer token or session cookie
```

---

## 8. Data Model Reconciliation Plan

Before building APIs, resolve these inconsistencies:

| Issue | Resolution |
|-------|------------|
| Leads vs Contacts | Add `Contact.type` enum or separate Lead model |
| 3 task systems | Unified Task with `contextType` + optional `projectId` |
| Deals missing pipeline | Add Pipeline + PipelineStage models; migrate Deal |
| Companies in UI, not in DB | Add Company model; Contact.companyId FK |
| Currency mix (INR/USD) | OrganizationSettings.currency + per-deal override |
| Duplicate mock data | Single source of truth once API exists |
| Member IDs (m1, m2) vs User UUIDs | Map to User.id everywhere |

---

## 9. Phased Implementation Plans

### Plan 1: Foundation (Week 1-2) — BLOCKER for everything

**Goal:** Runnable backend skeleton

- [ ] Create `src/lib/db.ts` Prisma client singleton
- [ ] Run initial migration from extended schema
- [ ] Add `.env.example`, document local setup
- [ ] Implement auth (NextAuth or custom JWT)
- [ ] Add `middleware.ts` route protection
- [ ] Base API utilities: error handling, validation (Zod), pagination
- [ ] Seed script with mock data from `mockData.ts`
- [ ] Health check: `GET /api/health`

**Deliverable:** Login works, protected CRM routes, DB seeded.

---

### Plan 2: Core CRM (Week 3-4)

**Goal:** Replace mock data on CRM pages

- [ ] Extend schema: Company, Pipeline, PipelineStage, Contact fields, Activity
- [ ] APIs: contacts, leads, deals, pipelines
- [ ] Deal stage transition with audit log
- [ ] Activity feed CRUD
- [ ] Dashboard KPI aggregation endpoints
- [ ] Wire frontend: leads, contacts, deals, pipeline, overview, activity, dashboard

**Deliverable:** CRM core pages use real API.

---

### Plan 3: Revenue Hub (Week 5-6)

**Goal:** Quote-to-cash flow

- [ ] Extend Quote, Invoice, Contract, Payment models
- [ ] PDF generation service (quotes, invoices, contracts)
- [ ] Quote → Invoice conversion
- [ ] Stripe integration + webhook handler
- [ ] Manual payment recording
- [ ] Overdue invoice detection job
- [ ] Wire frontend: quotes, invoices, contracts, payments

**Deliverable:** Full revenue cycle with Stripe optional.

---

### Plan 4: Workspace (Week 7-8)

**Goal:** Replace localStorage workspace data

- [ ] Models: Project, CalendarEvent, unified Task
- [ ] APIs: projects, tasks, calendar
- [ ] Migrate WorkspaceContext from localStorage to API
- [ ] Team leaderboard aggregation
- [ ] Basic war room messaging
- [ ] Wire frontend: projects, tasks, calendar, team (partial)

**Deliverable:** Workspace persists to DB; team leaderboard live.

---

### Plan 5: Marketing Suite (Week 9-10)

**Goal:** Content and campaign management

- [ ] Models: ContentItem, MarketingCampaign, ScheduledContent, Asset
- [ ] S3 file upload for assets
- [ ] Content kanban status transitions
- [ ] Marketing calendar CRUD
- [ ] Social post scheduling + BullMQ publish jobs
- [ ] Wire frontend: content, assets, campaigns, marketing-calendar, social

**Deliverable:** Marketing pages backed by API; file uploads work.

---

### Plan 6: Analytics & Reports (Week 11-12)

**Goal:** Live analytics from real data

- [ ] Analytics aggregation queries (deals, leads, campaigns, revenue)
- [ ] Widget data endpoints per chart type
- [ ] Dashboard layout persistence (replace Zustand localStorage)
- [ ] Report builder + export (CSV/PDF)
- [ ] Scheduled report jobs
- [ ] Funnel conversion calculations
- [ ] Wire frontend: analytics, reports, funnel

**Deliverable:** Charts reflect DB data; reports exportable.

---

### Plan 7: Field Operations & Deliveries (Week 13-14)

**Goal:** FMCG/Lentone use case (per [`Lentone_CRM_Pitch.md`](Lentone_CRM_Pitch.md))

- [ ] Models: FieldAgent, FieldCheckIn, FieldActivityLog, Delivery
- [ ] Field agent mobile-friendly check-in API
- [ ] Delivery status workflow
- [ ] WhatsApp webhook → DB writes (agent actions, client messages)
- [ ] Phone number → contact/deal linking
- [ ] Field monitoring + deliveries pages wired
- [ ] Broadcast message to agents

**Deliverable:** Field tracking and delivery logistics operational.

---

### Plan 8: Integrations Hub (Week 15-16)

**Goal:** Build the 4 missing Integration Hub pages

- [ ] Automation page: n8n workflow list, trigger, AutomationLog viewer
- [ ] Webhook manager: CRUD endpoints, delivery logs, retry
- [ ] API gateway page: API key CRUD, rate limits, usage stats
- [ ] MCP server page: tool registry, connection config
- [ ] n8n webhook relay endpoints
- [ ] Outbound webhook dispatcher (BullMQ)

**Deliverable:** Integration Hub pages functional.

---

### Plan 9: AI Assistant — Rio (Week 17-18)

**Goal:** Replace chat stub with real AI

- [ ] Chat session/message persistence
- [ ] LLM integration with CRM context injection
- [ ] File upload → document parsing for chat context
- [ ] Tool calling: query deals, create tasks, summarize pipeline
- [ ] Chat history management (rename, delete)
- [ ] Optional: MCP server exposing CRM tools

**Deliverable:** Rio answers CRM questions and performs actions.

---

### Plan 10: RBAC, Settings & Polish (Week 19-20)

**Goal:** Production readiness

- [ ] Role/permission models + enforcement middleware
- [ ] Settings persistence (all 6 tabs)
- [ ] User invite flow
- [ ] Global search (⌘K)
- [ ] Notification system (in-app + email)
- [ ] Audit log across all mutations
- [ ] Email marketing UI (missing page for EmailTemplate/Campaign)
- [ ] SEO/AEO UI (schema exists, page missing)
- [ ] Remove all mock data imports from frontend
- [ ] API documentation (OpenAPI/Swagger)

**Deliverable:** Production-ready CRM with auth, RBAC, settings, search.

---

## 10. Priority Matrix

```mermaid
quadrantChart
  title Backend Priority Matrix
  x-axis Low Effort --> High Effort
  y-axis Low Impact --> High Impact
  quadrant-1 Do Later
  quadrant-2 Do First
  quadrant-3 Deprioritize
  quadrant-4 Plan Carefully
  Auth_and_DB: [0.25, 0.95]
  Core_CRM: [0.35, 0.90]
  Revenue_Hub: [0.55, 0.75]
  Workspace: [0.45, 0.60]
  Analytics: [0.50, 0.55]
  Marketing: [0.60, 0.50]
  Field_Ops: [0.70, 0.65]
  Integrations: [0.75, 0.45]
  AI_Rio: [0.80, 0.40]
  MCP_Server: [0.85, 0.30]
```

**Critical path:** Plan 1 → Plan 2 → Plan 3 → Plan 10 (RBAC subset)

**Parallelizable after Plan 2:** Plans 4, 5, 6 can run in parallel teams.

---

## 11. Frontend Wiring Checklist (per page)

When backend is ready, each page needs:

| Page | Mock source to replace | API hooks needed |
|------|------------------------|------------------|
| `/dashboard` | Inline mock | `useDashboardKpis`, `usePipelineSummary`, `useActivities` |
| `/overview` | `store` from mockData | `useCompanies`, `useDeals`, `useContacts` |
| `/activity` | `store.activities` | `useActivities`, `useCreateActivity` |
| `/leads` | `leadsInitial` | `useLeads` CRUD |
| `/contacts` | `contactsInitial` | `useContacts` CRUD |
| `/pipeline` | `pipelineInitial` | `usePipeline`, `useDealStageUpdate` |
| `/deals` | `dealsMockData` | `useDeals`, `usePipelines`, `useNotifications` |
| `/funnel` | `funnel*` mock | `useFunnelAnalytics` |
| `/field-monitoring` | `fieldMonitoring*` | `useFieldAgents`, `useFieldFeed` |
| `/quotes` | `quotesInitial` | `useQuotes` CRUD |
| `/invoices` | `invoicesData` | `useInvoices` CRUD |
| `/contracts` | `INITIAL_CONTRACTS` | `useContracts` CRUD |
| `/payments` | `paymentsData` | `usePayments` CRUD |
| `/content` | `contentInitialItems` | `useContentItems` CRUD |
| `/assets` | `store.assets` | `useAssets`, upload mutation |
| `/campaigns` | `campaignsInitial` | `useCampaigns` CRUD |
| `/marketing-calendar` | `marketingCalendarEvents` | `useCalendarEvents` CRUD |
| `/social` | `social*` mock | `useSocialPosts` CRUD |
| `/projects` | WorkspaceContext localStorage | `useProjects` CRUD |
| `/tasks` | `tasks/mockData` | `useTasks` CRUD |
| `/calendar` | WorkspaceContext | `useCalendarEvents` CRUD |
| `/team` | `team/mockData` | `useTeam`, `useLeaderboard`, `useRoles` |
| `/deliveries` | `deliveriesData` | `useDeliveries` CRUD |
| `/analytics` | Zustand + mockData | `useAnalyticsWidgets`, layout API |
| `/reports` | Inline mock | `useReports`, `useRunReport` |
| `/settings` | Hardcoded | `useSettings`, `useUsers` |
| Topbar Rio | `setTimeout` stub | `useAIChat` streaming |
| `/automation` | **404 — build page** | `useAutomationWorkflows` |
| `/webhooks` | **404 — build page** | `useWebhooks` CRUD |
| `/api` | **404 — build page** | `useApiKeys` CRUD |
| `/mcp` | **404 — build page** | `useMcpConfig` |

**Recommended frontend data layer:** TanStack Query (React Query) for caching, mutations, optimistic updates.

---

## 12. Risks & Decisions Needed

| Decision | Options | Impact |
|----------|---------|--------|
| Auth library | NextAuth vs custom JWT vs Clerk | Dev speed vs control |
| Multi-tenancy | Single org vs multi-org (Lentone dual-portal) | Schema complexity |
| Lead model | Contact.type vs separate Lead | API design |
| Task unification | Single model vs keep separate | Migration effort |
| File storage | S3 vs local vs Cloudflare R2 | Cost, CDN |
| Real-time | SSE vs WebSocket vs polling | Infrastructure |
| AI provider | OpenAI vs Anthropic vs local | Cost, capabilities |
| Currency | Single org currency vs multi | All monetary fields |

---

## 13. Estimated Scope

| Phase | New API routes (approx) | New DB models | External services |
|-------|-------------------------|---------------|-------------------|
| Plan 1 Foundation | 8 | 2-3 | — |
| Plan 2 Core CRM | 25 | 5 | — |
| Plan 3 Revenue | 20 | 0 (extend) | Stripe |
| Plan 4 Workspace | 15 | 3 | — |
| Plan 5 Marketing | 20 | 4 | S3, Social APIs |
| Plan 6 Analytics | 12 | 2 | — |
| Plan 7 Field Ops | 15 | 4 | WhatsApp |
| Plan 8 Integrations | 18 | 3 | n8n |
| Plan 9 AI | 8 | 2 | OpenAI |
| Plan 10 Polish | 15 | 3 | Email provider |
| **Total** | **~136 endpoints** | **~28 models** | **6+ services** |

---

## 14. How to Use This Document

1. **Review** sections 1–8 to understand current gaps and architectural decisions.
2. **Choose a starting phase** from section 9 (Plan 1 is the required blocker).
3. **Track progress** using the checklists in section 9 and the frontend wiring table in section 11.
4. **Resolve open decisions** in section 12 before committing to schema migrations.

When you are ready to build, execute plans in order: **Plan 1 → Plan 2 → Plan 3**, then parallelize Plans 4–6, and finish with Plans 7–10 based on product priority.
