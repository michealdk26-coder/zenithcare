# Deploy ZenithCare to Render

## 1) Push to GitHub
Your repo is already connected.

## 2) Create service on Render
- New + → Blueprint
- Select your GitHub repo
- Render will read `render.yaml`

## 3) Set required env vars in Render
- `MONGO_URI`
- `JWT_SECRET`

Optional:
- `GMAIL_USER`
- `GMAIL_PASS`
- `FALLBACK_ADMIN_EMAIL`
- `FALLBACK_ADMIN_PASSWORD`

## 4) Deploy
Render will build with:
- `npm install --prefix backend`

And start with:
- `npm --prefix backend start`

## 5) Verify
- `https://<your-render-url>/health`
- `https://<your-render-url>/` (frontend)
- `https://<your-render-url>/api/departments`

## Notes
- This setup serves frontend + backend from one Render web service.
- Do not add `.env` to GitHub.
