# My Archery Club - Frontend Application

## Folder Structure

The application is now organized by user roles, with each role having its own dedicated directory:

```
my-vue-front/
├── admin/
│   ├── index.html          # Admin portal home page
│   ├── dashboard.html      # Admin dashboard with system overview
│   ├── profile.html        # Admin profile management
│   └── js/
│       ├── admin-index.js
│       ├── admin-dashboard.js
│       └── admin-profile.js
├── coach/
│   ├── index.html          # Coach portal home page
│   ├── dashboard.html      # Coach dashboard with member overview
│   ├── archer-list.html    # Archer management page
│   ├── profile.html        # Coach profile management
│   └── js/
│       ├── coach-index.js
│       ├── coach-dashboard.js
│       ├── archer-list.js
│       └── coach-profile.js
├── archer/
│   ├── index.html          # Archer portal home page
│   ├── dashboard.html      # Archer personal dashboard
│   ├── profile.html        # Archer profile management
│   └── js/
│       ├── archer-index.js
│       ├── archer-dashboard.js
│       └── archer-profile.js
├── css/
│   ├── main.css           # Global styles
│   ├── dashboard.css      # Dashboard-specific styles
│   └── login.css          # Login page styles
├── img/                   # Image assets
├── index.html             # Main entry point with role-based routing
├── login.html             # Login page
└── app.js                 # Main application logic
```

## Features by Role

### Admin Portal
- **System Overview**: View total users, system health, and activity logs
- **User Management**: Manage all users (coaches and archers)
- **Profile Management**: Admin profile settings
- **System Logs**: Monitor application activity

### Coach Portal
- **Dashboard**: Overview of coached archers and training statistics
- **Archer List**: Detailed view and management of all archers
- **Profile Management**: Coach profile with professional information
- **Training Management**: Schedule and track training sessions

### Archer Portal
- **Personal Dashboard**: Individual progress tracking and statistics
- **Profile Management**: Personal information and archery preferences
- **Progress Tracking**: View achievements and skill development
- **Schedule View**: Personal training schedule

## Authentication & Routing

The main `index.html` serves as the entry point and automatically redirects users to their appropriate role-based portal:
- **admin** → `admin/dashboard.html`
- **coach** → `coach/dashboard.html`  
- **archer** → `archer/dashboard.html`

Each role-based section includes:
1. **index.html**: Portal home page with navigation
2. **dashboard.html**: Main functional dashboard
3. **profile.html**: User profile management

## Navigation Structure

Each portal includes consistent navigation:
- **Home**: Portal overview and quick actions
- **Dashboard**: Main functional interface
- **Profile**: User profile management
- **Role-specific pages**: Additional features per role

## API Integration

All pages integrate with the backend API at `http://localhost:3000`:
- Authentication: `/auth/profile`, `/auth/login`
- Profile Management: `/profiles`, `/profiles/me`
- User Management: `/users` (admin only)

## Getting Started

1. Start the backend API server
2. Serve the frontend files (e.g., using a local server)
3. Navigate to `index.html`
4. Login with appropriate credentials
5. Get automatically redirected to your role-based dashboard