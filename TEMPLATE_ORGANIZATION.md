# Template Organization System

## Overview
The dashboard has been reorganized with a template-based structure for better maintainability and organization. While the main dashboard.html still contains all the content for functionality, the templates serve as organized reference files for future development.

## Directory Structure

```
templates/
├── shared/
│   ├── header.html          # Dashboard header component
│   ├── navigation.html      # Main navigation tabs
│   ├── overview.html        # Dashboard overview/stats
│   └── profile.html         # User profile management
├── admin/
│   ├── users.html           # User management table
│   ├── assignments.html     # Coach-archer assignments
│   └── create-user-modal.html # New user creation modal
└── coach/
    └── archers.html         # Coach's archer management
```

## Template Organization by Role

### Shared Templates (`templates/shared/`)
These templates contain functionality available to all user roles:
- **header.html**: Application header with title, role badge, and logout
- **navigation.html**: Tab navigation (visibility controlled by role)
- **overview.html**: Dashboard statistics and overview
- **profile.html**: Complete profile management (view/edit/create)

### Admin Templates (`templates/admin/`)
These templates are only accessible to users with ADMIN role:
- **users.html**: User management with create, edit, delete functionality
- **assignments.html**: Coach-archer assignment management
- **create-user-modal.html**: Modal for creating new users with profiles

### Coach Templates (`templates/coach/`)
These templates are only accessible to users with COACH role:
- **archers.html**: View and manage assigned archers, assign new archers

## Benefits of This Organization

1. **Role Separation**: Clear separation of functionality by user role
2. **Maintainability**: Easier to maintain role-specific features
3. **Scalability**: Easy to add new role-specific features
4. **Code Organization**: Logical grouping of related functionality
5. **Future Development**: Foundation for component-based architecture

## Current Implementation

The current dashboard.html maintains all functionality in a single file for:
- **Performance**: No additional HTTP requests for templates
- **Simplicity**: No complex template loading system
- **Reliability**: All code in one place, easier to debug

The template files serve as:
- **Documentation**: Clear structure of each section
- **Development Reference**: Easy to understand component boundaries
- **Future Migration Path**: Ready for Vue.js component conversion

## Future Enhancement Options

### Option 1: Vue.js Components
Convert templates to true Vue.js components:
```javascript
// AdminUsers.vue
// CoachArchers.vue
// SharedProfile.vue
```

### Option 2: Dynamic Loading
Implement template loading system:
```javascript
// Load templates dynamically based on user role
const templates = await loadRoleTemplates(userRole);
```

### Option 3: Micro-frontends
Split into separate applications by role:
```
- admin-dashboard/
- coach-dashboard/  
- archer-dashboard/
```

## Template Content Overview

### Shared Components
- **Header**: Role badge, user greeting, logout
- **Navigation**: Role-based tab visibility
- **Overview**: Statistics cards for admins
- **Profile**: Complete CRUD operations for user profiles

### Admin Components
- **Users**: Full user management with profile integration
- **Assignments**: Coach-archer relationship management
- **Create User Modal**: User creation with optional profile data

### Coach Components
- **Archers**: View assigned archers, manage assignments, view available archers

## Integration Points

All templates integrate with the main Vue.js application through:
- **Shared Data**: Access to all reactive data properties
- **Shared Methods**: Access to all application methods
- **Event Handling**: Standard Vue.js event handling
- **API Integration**: Consistent backend API calls
- **State Management**: Unified application state

## Usage Guidelines

### Adding New Role-Specific Features
1. Create template in appropriate role directory
2. Add content to main dashboard.html with role checks
3. Update navigation if needed
4. Add required data properties and methods

### Modifying Existing Features
1. Update template file for reference
2. Update corresponding section in dashboard.html
3. Test across all affected user roles
4. Update documentation if needed

### Role-Based Development
- **Admin Features**: Focus on management and oversight
- **Coach Features**: Focus on archer interaction and training
- **Archer Features**: Focus on personal progress and communication
- **Shared Features**: Profile management, basic dashboard functions

This organization provides a solid foundation for maintaining and scaling the archery club management system while keeping the current implementation simple and reliable.