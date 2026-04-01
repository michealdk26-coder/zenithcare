# 🏥 ZenithCare Hospital - Quick Start Guide

## 🚀 Get Running in 3 Minutes

### Prerequisites
- ✅ Node.js installed
- ✅ MongoDB installed/running OR MongoDB Atlas URI
- ✅ Terminal access

### Step 1: Configure Backend Environment
Create `backend/.env`:

```env
PORT=5000
NODE_ENV=development
MONGO_URI=mongodb://127.0.0.1:27017/zenithcare_hospital
JWT_SECRET=your_jwt_secret_here
GMAIL_USER=your_email@gmail.com
GMAIL_PASS=your_app_password
FALLBACK_ADMIN_EMAIL=admin@example.com
FALLBACK_ADMIN_PASSWORD=your_strong_password_here
ADMIN_EMAIL=admin@example.com
ADMIN_PASSWORD=your_strong_password_here
```

### Step 2: Start Backend
```bash
cd backend
npm install
npm start
```
Backend runs at: **http://localhost:5000**

### Step 3: Start Frontend

**Option A - Using http-server:**
```bash
cd frontend/public
npx http-server -p 3000 -o
```

**Option B - Using Python:**
```bash
cd frontend/public
python3 -m http.server 3000
```

**Option C - VS Code Live Server:**
Right-click `index.html` → Open with Live Server

Frontend opens at: **http://localhost:3000**

### Step 4: Create Admin & Sample Data
```bash
cd scripts
ADMIN_EMAIL="admin@example.com" ADMIN_PASSWORD="your_strong_password_here" node setup-sample-data.js
```

## 🔧 Key Endpoints
- `GET /api/doctors`
- `GET /api/departments`
- `POST /api/appointments`
- `GET /api/admin/appointments`
- `PUT /api/admin/appointments/:id`
- `DELETE /api/admin/appointments/:id`

## 🐛 Troubleshooting
- Backend health check: `curl http://localhost:5000/health`
- Verify `MONGO_URI` in `backend/.env`
- If using Atlas, whitelist your IP in Atlas Network Access

## 🎓 Stack
- Backend: Node.js + Express + Mongoose
- Database: MongoDB
- Frontend: HTML/CSS/Vanilla JS
- Auth: JWT + bcrypt
