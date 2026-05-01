# 🏫 Campus Complaint Management System

A full-stack web application where students can submit campus complaints and admins can manage them.

---

## 📁 Folder Structure

```
campus-complaint-system/
│
├── backend/                    ← Node.js + Express server
│   ├── controllers/
│   │   ├── authController.js   ← Login & signup logic
│   │   └── complaintController.js ← CRUD logic for complaints
│   ├── middleware/
│   │   ├── authMiddleware.js   ← JWT verify + role check
│   │   └── uploadMiddleware.js ← Multer image upload config
│   ├── models/
│   │   ├── User.js             ← User schema (name, email, password, role)
│   │   └── Complaint.js        ← Complaint schema
│   ├── routes/
│   │   ├── authRoutes.js       ← /api/auth/signup, /api/auth/login
│   │   └── complaintRoutes.js  ← /api/complaints/*
│   ├── uploads/                ← Uploaded images stored here
│   ├── seedAdmin.js            ← Script to create admin account
│   ├── server.js               ← Main entry point
│   ├── .env.example            ← Copy this to .env and fill in values
│   └── package.json
│
└── frontend/                   ← React.js app
    ├── public/
    │   └── index.html
    ├── src/
    │   ├── components/
    │   │   ├── Sidebar.js          ← Left navigation
    │   │   ├── ComplaintCard.js    ← Single complaint display
    │   │   ├── ComplaintForm.js    ← Submit complaint form
    │   │   ├── StatsCard.js        ← Dashboard stat box
    │   │   ├── StatusBadge.js      ← Color-coded status pill
    │   │   └── CategoryBadge.js    ← Category icon pill
    │   ├── context/
    │   │   └── AuthContext.js      ← Global auth state (user, token)
    │   ├── pages/
    │   │   ├── LoginPage.js
    │   │   ├── SignupPage.js
    │   │   ├── StudentDashboard.js
    │   │   └── AdminDashboard.js
    │   ├── utils/
    │   │   └── api.js              ← Axios instance with auth header
    │   ├── App.js                  ← Routes setup
    │   ├── index.js
    │   └── index.css               ← Tailwind + Google Fonts
    ├── .env                        ← REACT_APP_API_URL
    ├── tailwind.config.js
    └── package.json
```

---

## ⚙️ Prerequisites

Make sure you have these installed:

- **Node.js** (v16 or higher) — https://nodejs.org
- **npm** (comes with Node.js)
- **MongoDB Atlas account** (free) — https://cloud.mongodb.com

---

## 🚀 Step-by-Step Setup

### Step 1 — Get MongoDB Atlas URI

1. Go to https://cloud.mongodb.com and create a free account
2. Create a new **Project** and a free **M0 cluster**
3. Click **Connect** → **Drivers** → Copy the connection string
4. It looks like: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/`

---

### Step 2 — Setup Backend

```bash
# Navigate into backend folder
cd campus-complaint-system/backend

# Install all dependencies
npm install

# Copy the example env file
cp .env.example .env
```

Now open `.env` and fill in your values:

```env
MONGO_URI=mongodb+srv://youruser:yourpassword@cluster0.xxxxx.mongodb.net/campus_complaints?retryWrites=true&w=majority
JWT_SECRET=any_long_random_string_here
PORT=5000
ADMIN_EMAIL=admin@campus.edu
ADMIN_PASSWORD=admin123
```

---

### Step 3 — Create Admin Account

Run the seeder script **once** to create the admin user in the database:

```bash
node seedAdmin.js
```

You should see:
```
✅ Connected to MongoDB
🎉 Admin created successfully!
   Email:    admin@campus.edu
   Password: admin123
```

---

### Step 4 — Start Backend Server

```bash
# For development (auto-restarts on changes)
npm run dev

# OR for production
npm start
```

You should see:
```
✅ MongoDB connected successfully
🚀 Server running on http://localhost:5000
```

---

### Step 5 — Setup Frontend

Open a **new terminal window**:

```bash
# Navigate into frontend folder
cd campus-complaint-system/frontend

# Install all dependencies
npm install
```

The `.env` file already has:
```env
REACT_APP_API_URL=http://localhost:5000/api
```

> If your backend runs on a different port, update this.

---

### Step 6 — Start Frontend

```bash
npm start
```

React will open automatically at: **http://localhost:3000**

---

## 🔑 Default Login Credentials

| Role    | Email               | Password |
|---------|---------------------|----------|
| Admin   | admin@campus.edu    | admin123 |
| Student | (create via Signup) | (yours)  |

---

## 📡 API Endpoints Reference

| Method | Endpoint                  | Access  | Description                    |
|--------|---------------------------|---------|--------------------------------|
| POST   | /api/auth/signup          | Public  | Create student account         |
| POST   | /api/auth/login           | Public  | Login (any role)               |
| POST   | /api/complaints           | Student | Submit new complaint           |
| GET    | /api/complaints           | Student | Get own complaints             |
| GET    | /api/complaints/all       | Admin   | Get all complaints (+ filters) |
| GET    | /api/complaints/stats     | Admin   | Get dashboard stats            |
| PUT    | /api/complaints/:id       | Admin   | Update complaint status        |
| DELETE | /api/complaints/:id       | Admin   | Delete a complaint             |

---

## 🎨 Features

### Student
- ✅ Sign up and log in
- ✅ Submit complaints with title, description, category, location
- ✅ Attach an image (optional, max 5MB)
- ✅ View all their complaints
- ✅ Track status: Pending → In Progress → Resolved
- ✅ Dashboard stats (their complaints)

### Admin
- ✅ Login with hardcoded credentials
- ✅ View ALL complaints from all students
- ✅ Filter by category and status
- ✅ Update complaint status via dropdown
- ✅ Delete complaints
- ✅ Dashboard stats (all complaints)

---

## 🛠️ Tech Stack

| Layer        | Technology                  |
|--------------|-----------------------------|
| Frontend     | React.js, Tailwind CSS      |
| Backend      | Node.js, Express.js         |
| Database     | MongoDB, Mongoose           |
| Auth         | JWT (JSON Web Tokens)       |
| HTTP Client  | Axios                       |
| File Upload  | Multer                      |

---

## 🐛 Common Issues

**"Cannot connect to MongoDB"**
→ Check your `MONGO_URI` in `.env`. Make sure you replaced `<username>` and `<password>`.
→ In Atlas, go to Network Access and allow your IP (or allow all: `0.0.0.0/0`).

**"Port 5000 already in use"**
→ Change `PORT=5001` in `.env` and update `REACT_APP_API_URL=http://localhost:5001/api`.

**CORS error in browser**
→ Make sure backend is running on port 5000 and frontend `.env` points to it.

**Image not showing**
→ The backend serves images at `http://localhost:5000/uploads/filename.jpg`.
→ Make sure the `uploads/` folder exists in the backend directory.
