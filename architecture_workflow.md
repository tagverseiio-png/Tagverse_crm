# Tagverse CRM - Automation Architecture Workflows

Here are the detailed visual workflows for the core automation systems in the CRM, showing how data flows between different components.

## 1. Core Architecture Overview

```mermaid
graph TD
    Client[Web Browser / Client] --> |REST/GraphQL| API[Backend API Server]
    API --> DB[(PostgreSQL Database)]
    API --> Queue[Job Queue / Redis]
    
    Queue --> Worker[Background Worker]
    Worker --> Email[Email Service]
    Worker --> SMS[WhatsApp / SMS Service]
    
    Webhook[3rd Party Webhooks e.g. Stripe, Website Forms] --> API
```

## 2. Sales & Pipeline Flow (Lead Capture & Scoring)

```mermaid
sequenceDiagram
    participant Web as Website Form
    participant API as CRM Backend
    participant DB as Database
    participant Worker as Background Worker
    participant Team as Sales Team

    Web->>API: Submit Lead Data
    API->>DB: Save New Lead
    API->>Worker: Trigger Lead Scoring Job
    Worker->>Worker: Calculate Score (Activity, Source)
    Worker->>DB: Update Lead Score & Stage to "New Lead"
    Worker->>Team: Send Notification (Hot Lead!)
    Worker->>API: Trigger Nurture Sequence
```

## 3. Quotation to Payment Auto-Conversion Flow

```mermaid
stateDiagram-v2
    [*] --> DraftQuote: Sales Rep creates Quote
    DraftQuote --> SentQuote: Quote Emailed to Client
    
    SentQuote --> AcceptedQuote: Client Clicks "Accept"
    SentQuote --> FollowUp: 3 days no response
    FollowUp --> SentQuote: Auto-reminder sent
    
    AcceptedQuote --> InvoiceGenerated: Auto-convert
    InvoiceGenerated --> PaymentPending: Sent via Email/Stripe
    
    PaymentPending --> Paid: Client Pays
    Paid --> PipelineWon: Auto-move deal to Won
    Paid --> [*]
```

## 4. Invoicing & Recurring Billing Flow

```mermaid
sequenceDiagram
    participant Cron as Scheduler (Cron)
    participant Worker as Background Worker
    participant DB as Database
    participant Client as Client Email
    
    Cron->>Worker: Daily "Check Recurring Invoices" Job
    Worker->>DB: Find subscriptions due today
    Worker->>DB: Generate New Invoices
    Worker->>Client: Send Invoice Emails
    
    Cron->>Worker: Daily "Check Overdue Invoices" Job
    Worker->>DB: Find unpaid past-due invoices
    Worker->>Client: Send Payment Reminder Email
```

## 5. Task Management Automation

```mermaid
flowchart LR
    Event[Pipeline Stage Change] --> API[Backend API]
    API --> RuleEngine{Check Automation Rules}
    
    RuleEngine -->|If Lead = Qualified| Task1[Create Task: 'Initial Discovery Call']
    RuleEngine -->|If Quote = Sent| Task2[Create Task: 'Follow up in 2 days']
    
    Task1 --> Assign[Assign to Lead Owner]
    Task2 --> Assign
    
    Assign --> Notify[Notify Team Member]
```
