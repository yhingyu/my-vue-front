# My Vue Frontend

This is the frontend for the My Archery Club application.

## Files

- `login.html` - Login page with authentication
- `index.html` - Main application dashboard (requires authentication)
- `app.js` - Vue.js application logic for the main page

## Setup

1. Make sure the NestJS API is running on `http://localhost:3000`
2. Open `login.html` in your browser to start
3. Use the credentials from your API's database to log in

## Development Server (Optional)

If you encounter CORS issues when opening HTML files directly, you can serve the files using a simple HTTP server:

### Using Python (if installed):
```bash
# Python 3
python -m http.server 8080

# Python 2
python -m SimpleHTTPServer 8080
```

### Using Node.js (if installed):
```bash
# Install a simple server globally
npm install -g http-server

# Run the server
http-server -p 8080
```

### Using Live Server in VS Code:
1. Install the "Live Server" extension
2. Right-click on `login.html`
3. Select "Open with Live Server"

Then access the application at `http://localhost:8080/login.html`

## API Integration

The frontend connects to the NestJS API at `http://localhost:3000` and uses the following endpoints:

- `POST /auth/login` - User authentication
- `GET /auth/profile` - Get current user profile (requires JWT token)

## Authentication Flow

1. User opens `login.html`
2. User enters email and password
3. Frontend sends login request to API
4. API responds with JWT token and user info
5. Frontend stores token in localStorage
6. User is redirected to `index.html`
7. Main page verifies token with API and displays dashboard
8. User can logout to return to login page

## Default Admin User

If you've run the database migrations, you should have a default admin user:
- Email: admin@archeryclub.com
- Password: admin123