# UrJob - Job & Internship Listing Platform

A modern, full-stack MERN (MongoDB, Express, React, Node.js) application for job and internship listings. Built with industry best practices and production-ready code.

## 📋 Features

### Public Access
- 🏠 Homepage displaying all active jobs
- 🔍 Search by company name or role title
- 🗺️ Filter jobs by location
- 🆕 "NEW" badge for jobs posted within last 5 days
- 📊 Total active jobs counter
- 📱 Fully responsive design

### Authentication
- 📧 Email + Password login/registration
- 🔐 Password hashing with bcrypt
- 🔑 JWT authentication with HTTP-only cookies
- 👤 Role-based access control (Student/Admin)

### Admin Features
- ➕ Create new job listings
- ✏️ Edit existing jobs
- 🗑️ Delete job listings
- 📋 View all jobs dashboard
- Protected admin routes

### Student Features
- Browse jobs without login
- Login to apply for jobs
- Click "Apply Here" to go to external application URL
- View job details

### Security
- ✅ XSS protection
- 🛡️ CORS configuration
- ⏱️ Rate limiting
- 🔑 JWT verification
- 📝 Input validation
- 🌐 Environment variable protection

## 🏗️ Project Structure

```
UrJob/
├── client/                 # React Frontend (Vite)
│   ├── src/
│   │   ├── components/    # Reusable components
│   │   ├── pages/         # Page components
│   │   ├── context/       # Auth context
│   │   ├── hooks/         # Custom hooks
│   │   ├── utils/         # Helper functions & API client
│   │   ├── App.jsx        # Main app component
│   │   ├── main.jsx       # Entry point
│   │   └── index.css      # Tailwind styles
│   ├── package.json
│   ├── vite.config.js
│   └── tailwind.config.js
│
├── server/                 # Node.js + Express Backend
│   ├── models/            # Mongoose schemas
│   ├── controllers/       # Business logic
│   ├── routes/            # API routes
│   ├── middleware/        # Express middleware
│   ├── config/            # Database configuration
│   ├── server.js          # Entry point
│   ├── package.json
│   └── .env.example       # Environment variables template
│
└── README.md              # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v16 or higher)
- npm or yarn
- MongoDB Atlas account (free tier available)

### Backend Setup

1. **Navigate to server directory:**
   ```bash
   cd server
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Create `.env` file** (copy from `.env.example`):
   ```env
   PORT=5000
   NODE_ENV=development
   
   # MongoDB connection string
   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/urjob
   
   # JWT configuration
   JWT_SECRET=your_super_secret_jwt_key_here_change_this_in_production
   JWT_EXPIRE=7d
   
   # Admin email
   ADMIN_EMAIL=your-email@example.com
   
   # Client URL for CORS
   CLIENT_URL=http://localhost:5173
   ```

4. **Start the backend server:**
   ```bash
   npm run dev
   ```
   
   Server will run at `http://localhost:5000`

### Frontend Setup

1. **Navigate to client directory:**
   ```bash
   cd client
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Start the development server:**
   ```bash
   npm run dev
   ```
   
   Frontend will run at `http://localhost:5173`

### Access the Application

- **Homepage:** http://localhost:5173/
- **Login:** http://localhost:5173/login
- **Register:** http://localhost:5173/register
- **Admin Dashboard:** http://localhost:5173/admin (admin only)

## 🔐 Role-Based Access

### Admin (You)
- Email defined in `ADMIN_EMAIL` environment variable
- Can access `/admin` dashboard
- Can create, edit, and delete job listings

### Students
- Can view all job listings
- Can search and filter jobs
- Must login to apply for jobs
- Clicking "Apply Here" redirects to external application URL

## 🗄️ MongoDB Schema

### User Schema
```javascript
{
  email: String (unique, required),
  password: String (hashed, required),
  isAdmin: Boolean,
  createdAt: Date,
  updatedAt: Date
}
```

### Job Schema
```javascript
{
  companyName: String (required),
  roleTitle: String (required),
  location: String (required),
  requirements: String (required),
  whoCanApply: String (required),
  applicationUrl: String (required, valid URL),
  deadline: Date (required),
  datePosted: Date (auto-generated),
  createdBy: ObjectId (references User),
  isActive: Boolean (default: true),
  createdAt: Date,
  updatedAt: Date
}
```

## 📡 API Endpoints

### Authentication Routes

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| POST | `/api/auth/register` | Register new user | No |
| POST | `/api/auth/login` | Login user | No |
| GET | `/api/auth/me` | Get current user | Yes |
| POST | `/api/auth/logout` | Logout user | Yes |

### Job Routes

| Method | Endpoint | Description | Auth |
|--------|----------|-------------|------|
| GET | `/api/jobs` | Get all active jobs | No |
| GET | `/api/jobs/:id` | Get single job | No |
| POST | `/api/jobs` | Create job | Yes (Admin) |
| PUT | `/api/jobs/:id` | Update job | Yes (Admin) |
| DELETE | `/api/jobs/:id` | Delete job | Yes (Admin) |

### Query Parameters for Jobs

- `GET /api/jobs?search=tech` - Search by company/role
- `GET /api/jobs?location=Delhi` - Filter by location
- `GET /api/jobs?search=tech&location=Delhi` - Combined search/filter

## 🎨 UI/UX Features

- **Clean, Modern Design:** Professional and minimalist interface
- **Responsive Layout:** Works seamlessly on desktop, tablet, and mobile
- **Tailwind CSS:** Utility-first CSS framework for rapid development
- **Toast Notifications:** User feedback for all actions
- **Loading States:** Indicates ongoing operations
- **Form Validation:** Client-side and server-side validation
- **Gradient Hero Section:** Eye-catching landing page

## 🔒 Security Best Practices

1. **Password Security:** Bcrypt hashing with salt rounds
2. **JWT Tokens:** Secure token-based authentication
3. **HTTP-only Cookies:** Prevents XSS attacks
4. **CORS:** Configured to accept requests only from frontend
5. **Rate Limiting:** Prevents abuse (100 requests per 15 minutes)
6. **Input Validation:** Express-validator for all inputs
7. **Environment Variables:** Sensitive data never hardcoded
8. **Error Handling:** Comprehensive error handling middleware

## 🚀 Deployment Guide

### Deploy Backend to Render

1. **Create Render account:** https://render.com

2. **Push code to GitHub**

3. **Create New Web Service:**
   - Connect GitHub repository
   - Select `server` directory as root
   - Set environment variables (copy from `.env`)
   - Build command: `npm install`
   - Start command: `npm start`

4. **Get Backend URL** (e.g., `https://urjob-server.onrender.com`)

### Deploy Frontend to Vercel

1. **Create Vercel account:** https://vercel.com

2. **Add deployment environment variable:**
   - `VITE_API_URL=https://urjob-server.onrender.com/api`

3. **Deploy:**
   - Connect GitHub repository
   - Select `client` directory
   - Click Deploy

4. **Update CORS:** In backend `.env`, update `CLIENT_URL` to your Vercel URL

### MongoDB Atlas Setup

1. **Create cluster** at https://www.mongodb.com/cloud/atlas
2. **Create database user** with strong password
3. **Whitelist IP addresses**
4. **Copy connection string** to `.env` as `MONGODB_URI`

## 📦 Dependencies

### Backend
- **express:** Web framework
- **mongoose:** MongoDB ODM
- **bcryptjs:** Password hashing
- **jsonwebtoken:** JWT authentication
- **cors:** Cross-origin requests
- **express-validator:** Input validation
- **express-rate-limit:** Rate limiting
- **cookie-parser:** Cookie parsing
- **dotenv:** Environment variables

### Frontend
- **react:** UI library
- **react-router-dom:** Routing
- **react-toastify:** Toast notifications
- **axios:** HTTP client
- **tailwindcss:** Styling

## 🧪 Testing the Application

### Test Admin Account
1. Register with your `ADMIN_EMAIL`
2. You'll automatically become admin
3. Access `/admin` dashboard
4. Create, edit, delete jobs

### Test Student Account
1. Register with a different email
2. View jobs on homepage
3. Try to apply without login (redirects to login)
4. Login and try to apply again

## 📝 Notes

- Jobs are sorted by date posted (newest first)
- "NEW" badge appears for jobs < 5 days old
- Deadline date can be any future date
- Application URL must be valid HTTP(S) URL
- Admin can only manage jobs they created (extendable)

## 🐛 Troubleshooting

### "Cannot connect to MongoDB"
- Check `MONGODB_URI` in `.env`
- Verify IP whitelist on MongoDB Atlas
- Check internet connection

### "CORS error"
- Verify `CLIENT_URL` matches frontend origin
- Check browser console for full error message

### "Token expired"
- Token expires in 7 days (configurable with `JWT_EXPIRE`)
- User needs to re-login

### "Admin access required"
- Only `ADMIN_EMAIL` user can access admin routes
- Check email in `.env` matches registered email

## 📞 Support

For issues or questions, please check:
1. Console logs (browser and terminal)
2. Network tab in browser developer tools
3. MongoDB Atlas connection status
4. Environment variables configuration

## 📄 License

This project is open source and available under the MIT License.

---

**Built with ❤️ using MERN Stack**
