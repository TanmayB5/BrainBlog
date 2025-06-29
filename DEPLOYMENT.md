# BrainBlog Deployment Guide

## Render Deployment Configuration

### Backend (Server) Environment Variables
Set these in your Render backend service dashboard:

```
NODE_ENV=production
PORT=10000
DATABASE_URL=your_mysql_database_url
SESSION_SECRET=your_session_secret_key
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

## Troubleshooting
- Ensure all environment variables are set correctly
- Check Render logs for any deployment errors
- Verify CORS is working by testing API calls from the frontend
- Make sure the database is accessible from Render 