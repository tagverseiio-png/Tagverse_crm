# Marketing Calendar Module Analysis - UI Elements and Data Flow

Based on the structure of your provided marketing-calendar module code (e:\work\Automation\CRM\Tagverse_crm\Tagverse_crm\src\app\(crm)\marketing-calendar\page.tsx), here is a breakdown of the elements and data flows present in the page:

## UI Elements Analysis

### 1. Top Section (Header)
- **Title Area**: "Scheduling Calendar" with an icon and descriptive subtitle.
- **Primary Action**: '+ Schedule Post' button, which opens the creation modal.

### 2. Split Calendar View (Grid + Side List)
- **Left Side - Calendar Grid**:
  - **Month Navigation**: Left/Right chevrons to navigate months. The month title is clickable to toggle a 'Month View' in the side list.
  - **Day Cells**: A 7-column grid displaying the days of the month. Cells show colored bar indicators representing scheduled events. The currently selected day is highlighted.
- **Right Side - Event List**:
  - **Context Header**: Displays either the specific selected date or the entire month, alongside an event count and a quick '+' add button.
  - **Event Cards**: Lists events corresponding to the selection. Cards display channel badge, status (Scheduled/Published), title, time, and author. On hover, Edit and Delete actions appear.

### 3. Upcoming Scheduled Table
- **Bottom Section**: A comprehensive data table for "All Upcoming Scheduled" events.
- **Table Columns**: Company/Client, Content Title, Channel (badge), Scheduled For (Date & Time), Author, Status, and an Actions menu (ellipsis dropdown containing View, Edit, Delete).
- **Interactivity**: Clicking a row opens the 'Event Details' modal.

### 4. Modals & Notifications
- **Schedule / Edit Post Modal**: A form to add or modify an event. Fields include Post Title, Company, Client, Channel, Color Label picker, Date, Time, and an advanced Author dropdown (allowing addition of new authors).
- **Event Details Modal (View)**: A detailed read-only popup showing metadata (Date, Time, Channel, Status, Assignee profile). Includes footer actions to 'Delete Post', 'Mark as Published', or 'Reschedule' (Edit).
- **Toast Notification**: A floating popup in the bottom right for success/error feedback (e.g., "Post scheduled successfully!").

## Data Flow Diagrams (Mermaid)

### 1. Calendar Initialization & Fetching
```mermaid
graph LR
    A[Page Load] --> B[fetchEvents called]
    B --> C[GET /api/calendar]
    C --> D[Update State 'events' array]
    D --> E[Render UI]
```

### 2. Calendar Navigation & Filtering
```mermaid
graph LR
    A[User clicks Day Cell in Grid] --> B[Update 'selectedDate' & set isMonthView=false]
    B --> C[Filter 'events' for that specific date]
    C --> D[Update Right Side List Data]
    D --> E[Render Event Cards]

    F[User clicks Month Title] --> G[Update 'viewDate' & set isMonthView=true]
    G --> H[Filter 'events' for the entire month]
    H --> D
```

### 3. Schedule / Edit Event
```mermaid
graph LR
    A[User Submits Modal Form] --> B[Construct Payload & Optimistic UI update]
    B --> C[POST or PUT request to /api/calendar]
    C --> D[Show Toast Success & Close Modal]
    D --> E[Trigger fetchEvents]
```

### 4. Event Deletion
```mermaid
graph LR
    A[User clicks Delete action] --> B[Filter 'events' state Optimistic removal]
    B --> C[DELETE request to /api/calendar/:id]
    C --> D[Show Toast Message]
    D --> E[Re-render Calendar Grid]
```

### 5. Author Management (Local State)
```mermaid
graph LR
    A[Component Mounts] --> B[Read 'authorList' from localStorage]
    B --> C[If User adds new author via Dropdown]
    C --> D[Update 'authorList' State Array]
    D --> E[Save to localStorage]
```
