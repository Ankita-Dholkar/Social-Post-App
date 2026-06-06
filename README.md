# SocialFeed 

A modern, responsive, full-stack social media application built with the MERN stack (MongoDB, Express, React, Node.js). SocialFeed allows users to create accounts, share posts with text and images, like content, and interact via comments in real-time.

![SocialFeed Web App](https://img.shields.io/badge/Status-Completed-success?style=for-the-badge)

## ✨ Features

- **User Authentication:** Secure JWT-based signup and login system.
- **Dynamic Feed:** A 3-column responsive layout featuring a live public feed.
- **Rich Media Posting:** Share text updates, or upload images powered by Cloudinary CDN.
- **Engagement:** Like posts, comment on threads, and see real-time community stats.
- **Smart Search:** Live filter the feed by `@username` or post text content.
- **Modern UI/UX:** Clean, intuitive, text-forward design with dynamic sidebar stats and top contributor rankings.

## 🛠️ Tech Stack

### Frontend
- **React.js (Vite):** Fast, modern frontend framework.
- **React Router:** For seamless page navigation.
- **CSS Grid/Flexbox:** Custom, responsive styling without heavy UI libraries.
- **Material UI Icons:** Clean iconography used sparingly for visual hierarchy.

### Backend
- **Node.js & Express.js:** Robust RESTful API architecture.
- **MongoDB & Mongoose:** NoSQL database for flexible data modeling (Users, Posts, Comments).
- **Cloudinary:** Cloud storage for seamless image uploads.
- **Multer:** Middleware for handling multipart/form-data (image uploads).
- **JWT & bcryptjs:** Secure authentication and password hashing.

---

## 🚀 Getting Started

### Prerequisites
- Node.js installed on your machine
- MongoDB Atlas account (or local MongoDB)
- Cloudinary account for image storage

### 1. Clone the repository
\`\`\`bash
git clone <your-repository-url>
cd Social-Post-App
\`\`\`

### 2. Backend Setup
Navigate to the backend directory, install dependencies, and start the server:
\`\`\`bash
cd backend
npm install
npm run dev
\`\`\`
*Note: Ensure your `.env` file is properly configured with your `MONGO_URI`, `JWT_SECRET`, and `CLOUDINARY` credentials before starting.*

### 3. Frontend Setup
Open a new terminal, navigate to the frontend directory, install dependencies, and start the Vite dev server:
\`\`\`bash
cd frontend
npm install
npm run dev
\`\`\`

The application will be running at `http://localhost:5173` (or `5174`).

---

## 📁 Project Structure

\`\`\`text
Social-Post-App/
├── backend/                  # Express API Server
│   ├── config/               # DB and environment configs
│   ├── controllers/          # Route handlers (auth, posts)
│   ├── middleware/           # Auth and Cloudinary upload middleware
│   ├── models/               # Mongoose schemas (User, Post)
│   └── routes/               # API endpoint definitions
│
└── frontend/                 # React Client Application
    ├── public/
    └── src/
        ├── components/       # Reusable UI (Navbar, PostCard, CreatePost)
        ├── context/          # React Context (Auth)
        ├── pages/            # Main views (Login, Signup, Feed)
        └── services/         # Axios API calls
\`\`\`

## 📝 License
This project is open-source and available under the MIT License.
