# Deploying to Vercel - Steps

## ✅ Project readiness

The project is configured with:
- `vercel.json` for API/static routing
- `.vercelignore` to reduce upload size
- Frontend static files under `frontend/public`
- Backend API entry at `backend/server.js`

---

## 🚀 Quick Deploy (3 Steps)

### Step 1: Prepare MongoDB (REQUIRED)
Use MongoDB Atlas (recommended for cloud deploy):
1. Create Atlas cluster
2. Create DB user
3. Whitelist deploy IP access (or allow from anywhere for testing)
4. Copy connection string

Example format:

`mongodb+srv://<username>:<password>@<cluster-url>/zenithcare_hospital?retryWrites=true&w=majority`

### Step 2: Deploy to Vercel

```bash
npm i -g vercel
cd "/home/chukwuka7/ZenithCare Hospital"
vercel
```

### Step 3: Add Environment Variables in Vercel
Project Settings → Environment Variables:

- `MONGO_URI`
- `JWT_SECRET`
- `NODE_ENV=production`
- `GMAIL_USER` (optional)
- `GMAIL_PASS` (optional)
- `FALLBACK_ADMIN_EMAIL` (optional)
- `FALLBACK_ADMIN_PASSWORD` (optional)

Then redeploy:

```bash
vercel --prod
```

---

## 🌐 After Deployment

- Frontend: `https://your-project.vercel.app`
- API: `https://your-project.vercel.app/api/*`
- Health: `https://your-project.vercel.app/health`

---

## ⚠️ Common Issues

- Database connection failure → check `MONGO_URI` and Atlas network access
- 500 errors → inspect runtime logs with `vercel logs`
- Admin login fallback not working → ensure fallback env vars are set

---

## 🔍 Monitoring

```bash
vercel logs
vercel logs --follow
vercel ls
```
