# ZenithCare Hospital - Backend API

Production-ready hospital management system built with Node.js, Express, MongoDB, and Mongoose.

## Tech Stack

- **Runtime**: Node.js
- **Framework**: Express.js
- **Database**: MongoDB
- **ODM**: Mongoose
- **Authentication**: JWT (for future admin features)

## Project Structure

```
backend/
├── src/
│   ├── config/
│   │   └── database.js          # Database configuration
│   ├── models/
│   │   ├── Department.js        # Department model
│   │   ├── Doctor.js            # Doctor model
│   │   ├── Appointment.js       # Appointment model
│   │   └── index.js             # Models export
│   ├── controllers/
│   │   └── appointment.controller.js
│   ├── routes/
│   │   └── appointment.routes.js
│   └── app.js                   # Express app configuration
├── server.js                    # Server entry point
├── package.json
├── .env.example
└── README.md
```

## Database Schema

### Departments
- id (PK)
- name (unique, required)
- description
- timestamps

### Doctors
- id (PK)
- full_name (required)
- specialization (required)
- availability
- is_active (boolean, default: true)
- department_id (FK)
- timestamps

### Appointments
- id (PK)
- patient_name (required)
- phone (required)
- email
- appointment_date (required)
- status (ENUM: Pending, Approved, Rejected - default: Pending)
- department_id (FK)
- doctor_id (FK, nullable)
- timestamps

## Setup Instructions

### 1. Install Dependencies
```bash
cd backend
npm install
```

### 2. Configure Environment
```bash
cp .env.example .env
```

Edit `.env` with your MongoDB credentials:
```
PORT=5000
NODE_ENV=development

MONGO_URI=mongodb://127.0.0.1:27017/zenithcare_hospital
```

### 3. Ensure MongoDB Is Running
Start your local MongoDB service or provide a valid Atlas `MONGO_URI`.

### 4. Start Server
```bash
# Development mode with auto-reload
npm run dev

# Production mode
npm start
```

## API Endpoints

### Health Check
```
GET /health
```

### Appointments

#### Create Appointment
```
POST /api/appointments
Content-Type: application/json

{
  "patient_name": "John Doe",
  "phone": "+1234567890",
  "email": "john@example.com",
  "appointment_date": "2026-02-10T10:00:00",
  "department_id": 1,
  "doctor_id": 1
}
```

#### Get All Appointments
```
GET /api/appointments
```

## Features

✅ Clean MVC architecture
✅ MongoDB database with Mongoose ODM
✅ Proper validation and error handling
✅ CORS enabled
✅ Environment-based configuration
✅ Database relationship management
✅ Production-ready code structure
✅ Graceful shutdown handling

## Development Notes

- All models use snake_case fields for API compatibility
- Timestamps are automatically managed by Mongoose
- Comprehensive validation on all models
- Error responses follow consistent format

## Future Enhancements

- JWT authentication for admin panel
- Additional endpoints (update, delete, filter)
- Email notifications
- SMS reminders
- Admin dashboard APIs
- Payment integration
- Medical records management
