# Activity Module Analysis - UI Elements and Data Flow

Based on the structure of your provided PDF document, here is a breakdown of the elements and data flows present in your `activity` page (e:\work\Automation\CRM\Tagverse_crm\Tagverse_crm\src\app\(crm)\activity\page.tsx):

## UI Elements Analysis

### 1. Top Section: Day Header Banner & Badges
- **Date Header**: Shows selected date with an integrated calendar date picker ("TODAY'S SCHEDULE").
- **Overview Count Badges (KPIs)**: Gives a quick count of pending items for the selected date.
  - **Meetings**: Number of pending meeting activities (Blue Video icon).
  - **Tasks**: Number of pending task activities (Amber CheckSquare icon).
  - **Deadlines**: Number of pending deadline activities (Rose AlertTriangle icon).

### 2. Left Section: Main Timeline & Filters
- **Filters Card**: Tabs to quickly filter the timeline feed ('All', 'Meetings', 'Tasks', 'Deadlines', 'Followups').
- **Chronological Feed (Active Timeline)**: 
  - **Activity Item**: Displays time, specific icon (based on type), Activity Title, Company Tag, Duration, Priority Badge, and inline action buttons (Delete, View).
- **Add Activity Button**: Opens a modal to schedule a new activity.
- **Completed Section**: An expandable accordion ("Completed Today") showing closed workflows for the day.

### 3. Right Section: Insights & Upcoming
- **Coming Up Widget**: A list of upcoming events beyond the selected date, grouped by day (e.g., "Tomorrow"). Shows colored event dots, title, time, and owner.
- **Productivity Tracker**: A progress widget showing how many activities were completed vs total for the day. Includes a visual progress bar and dynamic motivation labels (e.g., "On Track", "Perfect Day").

## Data Flow Diagrams (Mermaid)

### 1. Activity Initialization & Fetching
```mermaid
graph LR
    A[Page Load] --> B[GET /api/activities]
    B --> C[UI Data Mapping]
    C --> D[Update State 'activities']
    D --> E[Render UI]
```

### 2. Filter & Timeline Rendering
```mermaid
graph LR
    A['activities' State] --> B[Filter by Date selectedDate]
    B --> C[Filter pending items]
    C --> D[Filter by Active Tab]
    D --> E[Chronological Feed Render]
```

### 3. Overview Badges (Meetings, Tasks, Deadlines)
```mermaid
graph LR
    A['activities' State] --> B[Filter by Date selectedDate]
    B --> C[Filter pending items]
    C --> D[Aggregate Count By Activity Type]
    D --> E[Update Badges UI Widget]
```

### 4. Productivity Tracker (Completion Progress)
```mermaid
graph LR
    A[Day's Activities List] --> B[Count Total Items & Count Completed Items]
    B --> C[Calculate Completion Percentage pct]
    C --> D[Assign Productivity Label]
    D --> E[Render Progress Bar Widget]
```

### 5. Coming Up (Future Events)
```mermaid
graph LR
    A['activities' State] --> B[Filter items where date > Today]
    B --> C[Group remaining items by Date]
    C --> D[Sort by Date]
    D --> E[Render Coming Up Widget]
```

### 6. Add New Activity
```mermaid
graph LR
    A[User Clicks 'Add Activity'] --> B[Complete Form & Submit]
    B --> C[POST request to /api/activities]
    C --> D[Close Modal State]
    D --> E[Trigger fetchActivities]
```

### 7. Complete / Reschedule Activity
```mermaid
graph LR
    A[User Clicks 'View' Action] --> B[Click 'Complete' or 'Reschedule' btn]
    B --> C[PUT request to /api/activities/:id]
    C --> D[Close Modal State]
    D --> E[Trigger fetchActivities]
```

### 8. Delete Activity
```mermaid
graph LR
    A[User Clicks 'Trash' Icon] --> B[Accept Browser Dialog Confirmation Prompt]
    B --> C[DELETE request to /api/activities/:id]
    C --> D[Notification / Silent Success]
    D --> E[Trigger fetchActivities]
```
