# Deploying ZenithCare Hospital to Vercel

## Prerequisites

1. A Vercel account
2. MongoDB Atlas connection string
3. Project pushed to GitHub (optional but recommended)

---

## Required Environment Variables

Set these in Vercel Dashboard → Project → Settings → Environment Variables:

- `MONGO_URI` (required)
- `JWT_SECRET` (required)
- `NODE_ENV=production` (required)
- `GMAIL_USER` (optional)
- `GMAIL_PASS` (optional)
- `FALLBACK_ADMIN_EMAIL` (optional)
- `FALLBACK_ADMIN_PASSWORD` (optional)

---

## Method 1: Vercel CLI

```bash
npm i -g vercel
vercel login
cd "/home/chukwuka7/ZenithCare Hospital"
vercel
vercel --prod
```

Use project root (not `./backend`) because `vercel.json` routes both backend and frontend.

---

## Method 2: GitHub + Vercel Dashboard

1. Push repository to GitHub
2. Import project on Vercel
3. Keep root directory as repository root
4. Add environment variables
5. Deploy

---

## Routing Summary

Configured in `vercel.json`:
- `/api/*` and `/health` → `backend/server.js`
- Static assets/HTML/CSS/JS → `frontend/public/*`
- Fallback route → `frontend/public/index.html`

---

## Post-Deployment Checks

1. Open home page
2. Check health endpoint: `/health`
3. Load doctors/departments pages
4. Test appointment booking
5. Test admin login + appointment management

---

## Troubleshooting

- **MongoDB error**: Verify `MONGO_URI` and Atlas Network Access
- **500/Server errors**: `vercel logs --follow`
- **Auth issues**: Verify `JWT_SECRET` exists in Vercel env
- **Email not sent**: verify `GMAIL_USER` and `GMAIL_PASS`

---

## Useful Commands

```bash
vercel ls
vercel logs
vercel logs --follow
vercel env ls
```
