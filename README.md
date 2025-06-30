# 🧠 BrainBlog - AI-Powered Blog Platform

A modern, intelligent blog platform that leverages AI to enhance content creation, optimization, and user experience.

## ✨ Features

### �� AI-Powered Content Enhancement
- **AI Summarization**: Generate intelligent summaries that capture the essence of your content
- **SEO Optimization**: Boost search rankings with AI-generated meta descriptions and keywords
- **Content Enhancement**: Improve readability, grammar, and style with intelligent suggestions
- **Smart Tag Generation**: Automatically generate relevant tags for better discoverability

### 📝 Blog Management
- **Rich Text Editor**: Create and edit blog posts with a modern interface
- **Category Management**: Organize content with customizable categories
- **Draft System**: Save work in progress and publish when ready
- **User Dashboard**: Manage your blogs, view analytics, and track performance

### 🎨 Modern UI/UX
- **Responsive Design**: Works perfectly on desktop, tablet, and mobile
- **Beautiful Interface**: Clean, modern design with intuitive navigation
- **Real-time Stats**: Track word count, reading time, and engagement metrics
- **Dark/Light Theme**: Comfortable reading experience

## 🛠️ Tech Stack

### Frontend
- **React 19** - Modern UI framework
- **Vite** - Fast build tool and dev server
- **Tailwind CSS** - Utility-first CSS framework
- **React Router** - Client-side routing

### Backend
- **Node.js** - JavaScript runtime
- **Express.js** - Web application framework
- **JWT** - Authentication and authorization
- **bcryptjs** - Password hashing

### AI & External Services
- **Hugging Face API** - AI-powered content generation
- **Supabase** - Database and authentication
- **Render** - Cloud deployment platform

## 🚀 Quick Start

### Prerequisites
- Node.js (v18 or higher)
- npm or yarn
- Hugging Face API key (free)
- Supabase account (free tier available)

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/your-username/brainblog.git
   cd brainblog
   ```

2. **Install dependencies**
   ```bash
   # Install backend dependencies
   cd server
   npm install
   
   # Install frontend dependencies
   cd ../client
   npm install
   ```

3. **Set up environment variables**

   **Backend (server/.env):**
   ```env
   PORT=5000
   NODE_ENV=development
   SESSION_SECRET=your-super-secret-session-key
   HUGGINGFACE_API_KEY=hf_your_api_key_here
   SUPABASE_URL=your-supabase-url
   SUPABASE_ANON_KEY=your-supabase-anon-key
   CLIENT_URL=http://localhost:5173
   ```

   **Frontend (client/.env):**
   ```env
   VITE_API_URL=http://localhost:5000/api
   ```

4. **Start development servers**
   ```bash
   # Start backend (from server directory)
   npm run dev
   
   # Start frontend (from client directory)
   npm run dev
   ```

5. **Open your browser**
   - Frontend: http://localhost:5173
   - Backend API: http://localhost:5000/api

## 🌐 Deployment

### Render Deployment

1. **Backend Service**
   - Build Command: `npm install`
   - Start Command: `npm start`
   - Root Directory: `server`

2. **Frontend Service**
   - Build Command: `cd client && npm install && npm run build`
   - Publish Directory: `client/dist`

3. **Environment Variables**
   Set all required environment variables in Render dashboard for both services.

## 📁 Project Structure
brainblog/
├── client/ # Frontend React application
│ ├── src/
│ │ ├── components/ # Reusable UI components
│ │ ├── pages/ # Page components
│ │ ├── services/ # API services
│ │ └── styles/ # CSS and styling
│ └── package.json
├── server/ # Backend Node.js application
│ ├── controllers/ # Route controllers
│ ├── middlewares/ # Express middlewares
│ ├── routes/ # API routes
│ └── package.json
└── README.md


## �� Configuration

### AI Features Setup
1. Get a free Hugging Face API key from [huggingface.co](https://huggingface.co/settings/tokens)
2. Add the key to your environment variables
3. Run the AI setup script: `cd server && npm run setup-ai`

### Database Setup
1. Create a Supabase project
2. Set up your database tables
3. Add Supabase credentials to environment variables

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## �� Acknowledgments

- [Hugging Face](https://huggingface.co/) for providing free AI APIs
- [Supabase](https://supabase.com/) for the database and authentication
- [Render](https://render.com/) for hosting services
- [Tailwind CSS](https://tailwindcss.com/) for the beautiful UI framework

If you have any questions or need help:
- Open an issue on GitHub
- Check the documentation in the `/docs` folder
- Review the setup guides in the project

---

**Made with ❤️ and AI intelligence**
