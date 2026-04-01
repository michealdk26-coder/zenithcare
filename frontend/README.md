# ZenithCare Hospital - Frontend

Pure HTML/CSS/JavaScript frontend - No TypeScript, No React, No frameworks. Fully responsive on all screen sizes.

## 🎯 Features

- ✅ 100% vanilla HTML/CSS/JavaScript
- ✅ No TypeScript, no React, no build tools required
- ✅ Fully responsive (mobile, tablet, desktop)
- ✅ Inline CSS for simplicity
- ✅ Professional medical design
- ✅ JWT authentication for admin panel
- ✅ Zero dependencies - just open in browser!

## 📁 Structure

```
public/
├── index.html              # Homepage
├── doctors.html            # Doctors listing
├── appointment.html        # Appointment booking
├── contact.html            # Contact page
├── admin-login.html        # Admin authentication
├── admin-dashboard.html    # Admin dashboard
├── admin-appointments.html # Manage appointments
├── admin-doctors.html      # Manage doctors
└── admin-departments.html  # Manage departments
```

## 🚀 Running Frontend

### Option 1: Using http-server
```bash
cd public
npx http-server -p 3000 -o
```

### Option 2: Using Python
```bash
cd public
python3 -m http.server 3000
```

### Option 3: VS Code Live Server
Right-click on `index.html` → "Open with Live Server"

### Option 4: Open directly in browser
Simply open `public/index.html` in your browser (API calls require backend running)

## 🌐 Pages

### Public Pages
- **/** - Homepage with hero, stats, services
- **/doctors.html** - Browse all doctors
- **/appointment.html** - Book appointments
- **/contact.html** - Contact information

### Admin Pages (Requires Login)
- **/admin-login.html** - Admin authentication
- **/admin-dashboard.html** - Dashboard with statistics
- **/admin-appointments.html** - Approve/reject appointments
- **/admin-doctors.html** - CRUD operations for doctors
- **/admin-departments.html** - CRUD operations for departments

## 🔐 Admin Credentials

Default admin account (created via `scripts/setup-sample-data.js`):
- Email: `admin@example.com`
- Password: `your_strong_password_here`

## 🎨 Design Features

- **Colors:** Blue (#007BFF), Green (#28A745)
- **Responsive:** Mobile-first with hamburger menu
- **Layout:** CSS Grid and Flexbox
- **Typography:** Segoe UI / system fonts
- **No external CSS frameworks** - all custom styles

## 📡 API Integration

All pages use vanilla JavaScript `fetch()` to communicate with backend at `http://localhost:5000/api`

**Public endpoints:**
- GET /api/doctors
- GET /api/departments
- POST /api/appointments

**Admin endpoints (require JWT token):**
- GET /api/admin/appointments
- POST/PUT/DELETE /api/admin/doctors
- POST/PUT/DELETE /api/admin/departments

## ✨ No Dependencies

Zero external JavaScript libraries or CSS frameworks. Everything is:
- Pure HTML5
- Inline CSS3
- Vanilla JavaScript ES6+
- Native Fetch API

Perfect for learning, customization, and you have complete control over every line of code!

## 📱 Responsive Breakpoints

- Mobile: < 768px (hamburger menu)
- Tablet: 768px - 1024px
- Desktop: > 1024px

## Browser Support

Works on all modern browsers:
- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

© 2026 ZenithCare Hospital. All rights reserved.
