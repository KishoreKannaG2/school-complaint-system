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




