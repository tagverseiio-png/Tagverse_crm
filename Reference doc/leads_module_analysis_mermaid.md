# Leads Module Analysis - UI Elements and Data Flow

Based on the structure of your provided leads module code (e:\work\Automation\CRM\Tagverse_crm\Tagverse_crm\src\app\(crm)\leads\page.tsx), here is a breakdown of the elements and data flows present in the page:

## UI Elements Analysis

### 1. Top Section: KPI Cards (Key Performance Indicators)
- **Overview KPI Cards**: Gives a quick aggregation of lead data.
  - **Total Leads**: Count of all fetched leads.
  - **New This Week**: Count of leads with the stage marked as 'new'.
  - **Hot Leads**: Count of leads with a lead score ≥ 80.
  - **Avg. Lead Score**: Calculated average of all lead scores.

### 2. Middle Section: Filters & Actions
- **Global Search**: Text input for searching leads by Name or Company.
- **Primary Stage Tabs**: Segmented control for quick filtering by primary stages ('All', 'New', 'Engaged', 'Qualified', etc.).
- **'+ New Lead' Button**: Opens the Add Lead Modal.
- **Advanced Filters Bar**: 
  - Filter Company (Text input)
  - Filter Sources (Dropdown)
  - Filter Stages (Dropdown)
  - Filter Tags (Text input)
  - Filter WA (Dropdown for WhatsApp active/inactive)
  - Clear Button (Resets all filters/search states)

### 3. Bottom Section: Data Table
- **Leads Table**: Tabular display of filtered leads. Columns include Name, Company, Email, Phone, Source, Tags (intent pills), Stage (status badge), Score (visual progress bar & number), WA (status dot), Added (Date), and an Actions menu (⋯).

### 4. Modals / Overlays
- **Lead Modal (Shared)**: A shared form component for both Adding and Editing leads. Contains fields for Name, Company, Phone, Email, Source, Stage, Tags, Lead Score (range slider), and WhatsApp Active (checkbox).
- **View Modal**: A read-only overlay showing detailed information about a selected lead.
- **Delete Confirm Modal**: A confirmation prompt to prevent accidental deletions.

## Data Flow Diagrams (Mermaid)

### 1. Leads Initialization & Fetching
```mermaid
graph LR
    A[Page Load] --> B[fetchLeads called]
    B --> C[GET /api/contacts type=lead]
    C --> D[Update State 'leads']
    D --> E[Render UI]
```

### 2. KPI Cards Calculation
```mermaid
graph LR
    A['leads' State Array] --> B[Aggregate Data Arrays]
    B --> C[Filter by Conditions stage=new, score>80]
    C --> D[Calculate Averages & Totals]
    D --> E[Render KPI Cards UI Widgets]
```

### 3. Dynamic Filtering & Table Rendering
```mermaid
graph LR
    A['leads' State Array] --> B[Apply Global Search]
    B --> C[Apply Stage Tab Filter]
    C --> D[Apply Advanced Filters]
    D --> E[Render Filtered Leads Table UI]
```

### 4. Add New Lead
```mermaid
graph LR
    A[User Clicks '+ New Lead'] --> B[Fill Form & Validate inputs]
    B --> C[POST request to /api/contacts]
    C --> D[Close Modal State]
    D --> E[Trigger fetchLeads]
```

### 5. Edit Existing Lead
```mermaid
graph LR
    A[User Clicks '⋯' Action icon] --> B[Modify Data & Validate inputs]
    B --> C[PUT request to /api/contacts/:id]
    C --> D[Close Edit Modal State]
    D --> E[Trigger fetchLeads]
```

### 6. View Lead Details
```mermaid
graph LR
    A[From Edit Modal] --> B[Click '👁 View' action button]
    B --> C[Open View Modal State]
    C --> D[Display Formatted Lead Details]
    D --> E[Close Modal on Cancel/Esc]
```

### 7. Delete Lead
```mermaid
graph LR
    A[From Edit Modal] --> B[Open Delete Confirm Modal]
    B --> C[DELETE request to /api/contacts/:id]
    C --> D[Close Modals & Clear Delete State]
    D --> E[Trigger fetchLeads]
```
