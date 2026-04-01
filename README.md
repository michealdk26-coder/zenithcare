# ZenithCare Hospital Management System

A comprehensive, production-ready hospital management system featuring **24 medical departments** and **115+ specialist doctors**. Built with Node.js, Express, MongoDB (Mongoose), and vanilla JavaScript frontend.

## 🏥 Hospital Overview

**ZenithCare Hospital** - A world-class medical facility offering:

- 🏢 **24 Specialized Departments** (Cardiology, Neurology, Oncology, Surgery, and more)
- 👨‍⚕️ **115+ Expert Physicians** across all medical specialties
- 🚑 **24/7 Emergency Services**
- 🔬 **Advanced Medical Technology**
- 📱 **Modern Digital Patient Management**

> See [HOSPITAL_OVERVIEW.md](HOSPITAL_OVERVIEW.md) for complete department and doctor listings.

## ✨ System Features

### Patient Portal
- View all 24 departments and 115+ doctor profiles
- Browse doctors by specialization
- Book appointments with preferred doctors
- View available time slots
- Contact hospital directly

### Admin Dashboard
- Comprehensive appointment management
- Complete CRUD operations for doctors and departments
- Real-time statistics and analytics
- JWT-based secure authentication
- Approve/reject patient appointments

### Technical Features
- **RESTful API** with clean architecture
- **MongoDB Database** with Mongoose ODM
- **JWT Authentication** for secure access
- **Responsive Design** - works on all devices
- **Real-time Updates** with dynamic data loading

## 📋 Prerequisites

- Node.js (v14+)
- MongoDB (local or Atlas)
- npm or yarn

## 🚀 Getting Started

### 1. Database Setup

Use either local MongoDB or MongoDB Atlas.

- Local example: `mongodb://127.0.0.1:27017/zenithcare_hospital`
- Atlas example: `mongodb+srv://<username>:<password>@<cluster-url>/zenithcare_hospital`

### 2. Backend Setup

```bash
# Navigate to backend directory
cd backend

# Install dependencies
npm install

# Create .env file
cat > .env << EOL
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/zenithcare_hospital
GMAIL_USER=your_email@gmail.com
GMAIL_PASS=your_app_password
JWT_SECRET=zenithcare_secret_key_2024
FALLBACK_ADMIN_EMAIL=admin@example.com
FALLBACK_ADMIN_PASSWORD=your_strong_password_here
EOL

# Start backend server
npm start
```

The backend will start on http://localhost:5000

### 3. Frontend Setup

```bash
# Navigate to frontend directory
cd ../frontend

# Install a simple HTTP server (if not already installed)
npm install -g http-server

# Serve the frontend
cd public
http-server -p 3000 -o
```

The frontend will open automatically at http://localhost:3000

**Alternative**: You can also use Python's built-in server:
```bash
cd frontend/public
python3 -m http.server 3000
```

## 📁 Project Structure

```
ZenithCare Hospital/
├── backend/
│   ├── src/
│   │   ├── config/
│   │   │   └── database.js
│   │   ├── controllers/
│   │   │   ├── appointment.controller.js
│   │   │   ├── auth.controller.js
│   │   │   ├── doctor.controller.js
│   │   │   └── department.controller.js
│   │   ├── models/
│   │   │   ├── Admin.js
│   │   │   ├── Appointment.js
│   │   │   ├── Department.js
│   │   │   └── Doctor.js
│   │   ├── middleware/
│   │   │   └── auth.middleware.js
│   │   ├── routes/
│   │   │   ├── auth.routes.js
│   │   │   ├── appointment.routes.js
│   │   │   ├── doctor.routes.js
│   │   │   ├── department.routes.js
│   │   │   ├── admin.appointments.routes.js
│   │   │   ├── admin.doctors.routes.js
│   │   │   └── admin.departments.routes.js
│   │   └── app.js
│   ├── server.js
│   └── package.json
├── frontend/
│   └── public/
│       ├── index.html
│       ├── doctors.html
│       ├── appointment.html
│       ├── contact.html
│       ├── admin-login.html
│       ├── admin-dashboard.html
│       ├── admin-appointments.html
│       ├── admin-doctors.html
│       └── admin-departments.html
└── README.md
```

## 🔌 API Endpoints

### Public Endpoints

- `GET /` - API information
- `GET /health` - Health check
- `GET /api/departments` - Get all departments
- `GET /api/doctors` - Get all doctors
- `POST /api/appointments` - Create appointment

### Authentication

- `POST /api/auth/register` - Register admin
- `POST /api/auth/login` - Login admin

### Protected Admin Endpoints (Require JWT Token)

**Appointments:**
- `GET /api/admin/appointments` - Get all appointments
- `PUT /api/admin/appointments/:id` - Update appointment status
- `DELETE /api/admin/appointments/:id` - Delete appointment

**Doctors:**
- `GET /api/admin/doctors` - Get all doctors
- `POST /api/admin/doctors` - Create doctor
- `PUT /api/admin/doctors/:id` - Update doctor
- `DELETE /api/admin/doctors/:id` - Delete doctor

**Departments:**
- `GET /api/admin/departments` - Get all departments
- `POST /api/admin/departments` - Create department
- `PUT /api/admin/departments/:id` - Update department
- `DELETE /api/admin/departments/:id` - Delete department

## 🔐 Admin Access

### Create First Admin

```bash
# Using curl
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "admin@example.com",
    "password": "your_strong_password_here",
    "role": "admin"
  }'
```

### Login
Navigate to http://localhost:3000/admin-login.html and use:
- **Email:** admin@example.com
- **Password:** your_strong_password_here

## 📱 Frontend Pages

### Public Pages
- **Home** (`index.html`) - Hero, stats, services
- **Doctors** (`doctors.html`) - All doctors with specializations
- **Book Appointment** (`appointment.html`) - Appointment booking form
- **Contact** (`contact.html`) - Hospital contact information

### Admin Pages
- **Admin Login** (`admin-login.html`) - Authentication
- **Dashboard** (`admin-dashboard.html`) - Overview with stats
- **Appointments** (`admin-appointments.html`) - Manage appointments
- **Doctors** (`admin-doctors.html`) - CRUD operations for doctors
- **Departments** (`admin-departments.html`) - CRUD operations for departments

## 🎨 Design Features

- **Responsive Navigation**: Hamburger menu for mobile devices
- **Medical Color Palette**: Professional blue (#007BFF) and green (#28A745)
- **Card Layouts**: Clean and modern card-based design
- **Loading States**: Spinners for async operations
- **Status Badges**: Color-coded status indicators
- **Modal Forms**: User-friendly forms for data entry

## 🧪 Testing the Application

### 1. Test Public Pages
1. Visit http://localhost:3000
2. Navigate through Home, Doctors, Book Appointment, Contact
3. Try booking an appointment

### 2. Setup Sample Data
```bash
# Add a department
curl -X POST http://localhost:5000/api/admin/departments \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "name": "Cardiology",
    "description": "Heart and cardiovascular care"
  }'

# Add a doctor
curl -X POST http://localhost:5000/api/admin/doctors \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer YOUR_JWT_TOKEN" \
  -d '{
    "full_name": "Dr. John Smith",
    "specialization": "Cardiologist",
    "department_id": 1,
    "availability": "Monday - Friday, 9:00 AM - 5:00 PM",
    "is_active": true
  }'
```

### 3. Test Admin Panel
1. Login at http://localhost:3000/admin-login.html
2. View dashboard statistics
3. Manage appointments (approve/reject)
4. Add/edit/delete doctors
5. Add/edit/delete departments

## 🛠️ Technologies Used

**Backend:**
- Node.js & Express.js - Server framework
- MongoDB - Database
- Mongoose - ODM for database operations
- JWT - Authentication tokens
- bcrypt - Password hashing

**Frontend:**
- HTML5 - Structure
- CSS3 - Styling (inline for simplicity)
- Vanilla JavaScript - Interactivity
- Fetch API - HTTP requests

## 📝 Environment Variables

```env
PORT=5000
MONGO_URI=mongodb://127.0.0.1:27017/zenithcare_hospital
GMAIL_USER=your_email@gmail.com
GMAIL_PASS=your_app_password
JWT_SECRET=zenithcare_secret_key_2024
FALLBACK_ADMIN_EMAIL=admin@example.com
FALLBACK_ADMIN_PASSWORD=your_strong_password_here
```

## 🔒 Security Features

- JWT-based authentication
- Password hashing with bcrypt
- Protected admin routes
- Input validation with Mongoose schemas
- CORS enabled for development

## 🐛 Troubleshooting

### Port Already in Use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Or use a different port in .env
PORT=5001
```

### Database Connection Error
- Verify MongoDB is reachable
- Check `MONGO_URI` in `backend/.env`
- If using Atlas, ensure your IP is whitelisted

### Frontend Not Loading Data
- Check backend is running on http://localhost:5000
- Open browser console for errors
- Verify API URLs in HTML files match backend port

## 📞 Support

For issues or questions, please check:
1. Backend logs in terminal
2. Browser console (F12)
3. Database connection
4. CORS settings

## 📄 License

This project is for educational purposes.

## 👨‍💻 Author

Built with ❤️ for ZenithCare Hospital
