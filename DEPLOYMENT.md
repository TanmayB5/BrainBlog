# BrainBlog Deployment Guide

## Render Deployment Configuration

### Backend (Server) Environment Variables
Set these in your Render backend service dashboard:

```
NODE_ENV=production
PORT=10000
DATABASE_URL=your_mysql_database_url
SESSION_SECRET=your_session_secret_key
JWT_SECRET=your_jwt_secret_key
OPENAI_API_KEY=your_openai_api_key
CLIENT_URL=https://brainblog-1.onrender.com
```

### Frontend (Client) Environment Variables
Set these in your Render frontend service dashboard:

```
VITE_API_URL=https://brainblog.onrender.com/api
```

## CORS Configuration
The backend is now configured to allow requests from:
- `https://brainblog-1.onrender.com` (your frontend)
- `http://localhost:5173` (local development)
- `http://localhost:3000` (alternative local port)

## Deployment Steps

1. **Backend Deployment:**
   - Connect your GitHub repository to Render
   - Set the root directory to `server`
   - Set the build command: `npm install && npx prisma generate`
   - Set the start command: `npm start`
   - Add the environment variables listed above

2. **Frontend Deployment:**
   - Create a new static site service in Render
   - Connect your GitHub repository
   - Set the root directory to `client`
   - Set the build command: `npm install && npm run build`
   - Set the publish directory: `dist`
   - Add the environment variables listed above

## URLs
- **Frontend:** https://brainblog-1.onrender.com
- **Backend:** https://brainblog.onrender.com

## Troubleshooting 404 Errors

### 1. Verify Backend Deployment
Test these URLs in your browser to verify the backend is working:

- `https://brainblog.onrender.com/` - Should show server status
- `https://brainblog.onrender.com/api` - Should show available routes
- `https://brainblog.onrender.com/api/test` - Should show test message
- `https://brainblog.onrender.com/api/auth/test` - Should show auth test
- `https://brainblog.onrender.com/api/blogs` - Should show blogs (or empty array)

### 2. Check Render Logs
- Go to your Render dashboard
- Click on your backend service
- Check the "Logs" tab for any deployment errors
- Look for database connection issues

### 3. Database Connection
Make sure your `DATABASE_URL` is correct and the database is accessible from Render.

### 4. Environment Variables
Verify all environment variables are set correctly in Render dashboard.

### 5. Local Testing
Test locally first:
```bash
cd server
npm install
npm run dev
```

Then test the endpoints:
```bash
node test-server.js
```

## Common Issues

### 404 "Route not found" Errors
- Backend not deployed properly
- Wrong port configuration
- Missing environment variables
- Database connection issues

### CORS Errors
- Frontend URL not in CORS allowlist
- Missing CORS headers
- Wrong API URL in frontend

### Database Errors
- Invalid DATABASE_URL
- Database not accessible from Render
- Missing Prisma migrations

## Verification Checklist

- [ ] Backend deploys successfully on Render
- [ ] All environment variables are set
- [ ] Database is connected and accessible
- [ ] API endpoints respond correctly
- [ ] Frontend can connect to backend
- [ ] CORS is working properly
- [ ] Authentication works
- [ ] Blog CRUD operations work 