# Sensora Technology — MERN Website with Admin CMS

A full MERN stack (MongoDB, Express, React, Node) website built from the
Sensora Technology homepage design brief. Every content section on the
public site — Technologies, Solutions, Products, Projects, R&D, Careers,
and the homepage/about text — is managed by a logged-in admin, no code
changes required.

## What's included

**Public site**
- Home (hero, technology & solution previews, "Build With Sensora" CTA)
- About / Company
- Technologies, Solutions, Products, R&D, Careers — all filterable listing
  pages, powered by the same admin-editable content model
- Contact page ("Build With Sensora" form) which saves leads to the database

**Admin panel** (`/admin`)
- Secure login (JWT)
- Dashboard with content counts and new-lead count
- Full CRUD for Technologies / Solutions / Products / Projects / R&D / Careers
  — create, edit, delete, reorder, publish/unpublish, images via Google Drive links
- Homepage & About text editor (no code required to change headlines/copy)
- Contact leads inbox (mark new/read/archived, delete)

## Tech stack

- **Backend:** Node.js, Express, MongoDB + Mongoose, JWT auth
- **Images:** no file uploads — admin pastes a public Google Drive share link, the backend normalizes it to a direct image URL and stores that in MongoDB; the frontend renders it straight from the database
- **Frontend:** React 18, Vite, React Router, Tailwind CSS, Axios

## Project structure

```
sensora-mern/
├── server/                 Express API
│   ├── models/              Admin, ContentItem, SiteSection, ContactSubmission
│   ├── controllers/
│   ├── routes/
│   ├── middleware/          auth.js (JWT)
│   ├── utils/               driveImage.js (Google Drive link → direct image URL)
│   ├── scripts/             seedAdmin.js, seedContent.js
│   ├── vercel.json          serverless deployment config
│   ├── .env.example         env vars template (copy to .env for local dev)
│   └── server.js
└── client/                 React app
    ├── src/pages/            public site pages
    ├── src/admin/            admin panel pages
    ├── src/components/       Navbar, Footer, ContentCard, etc.
    ├── src/context/          AuthContext
    ├── src/api/axios.js      pre-configured API client (reads VITE_API_URL)
    ├── src/utils/driveImage.js  Google Drive link → direct image URL (client-side preview)
    ├── vercel.json           SPA rewrite config
    └── .env.example          env vars template (VITE_API_URL)
```

## 1. Prerequisites

- Node.js 18+
- A MongoDB database — either:
  - Local MongoDB (`mongodb://127.0.0.1:27017/sensora`), or
  - A free [MongoDB Atlas](https://www.mongodb.com/atlas) cluster (recommended if you don't want to install MongoDB locally)

## 2. Backend setup

```bash
cd server
npm install
cp .env.example .env
```

Edit `.env`:
- `MONGO_URI` — your MongoDB connection string
- `JWT_SECRET` — replace with a long random string
- `ADMIN_USERNAME` / `ADMIN_EMAIL` / `ADMIN_PASSWORD` — the admin account to create (change the password!)

Create your admin account and load starter content pulled from the design brief:

```bash
npm run seed:admin
node scripts/seedContent.js
```

Start the API:

```bash
npm run dev      # nodemon, auto-restarts
# or
npm start
```

The API runs on `http://localhost:5000`. Check `http://localhost:5000/api/health`.

## 3. Frontend setup

In a second terminal:

```bash
cd client
npm install
npm run dev
```

The site runs on `http://localhost:5173` and proxies `/api` requests to the
backend (see `vite.config.js`) — no CORS setup needed in dev, and no `.env`
needed either (leave `VITE_API_URL` unset locally). You only need a
`client/.env` with `VITE_API_URL` set when pointing this frontend at a
deployed backend — see **Deploying to Vercel** below.

## 4. Log in to the admin panel

Go to `http://localhost:5173/admin/login` and sign in with the
`ADMIN_USERNAME`/`ADMIN_PASSWORD` you set in `server/.env`.

From there you can:
- Add/edit/delete/reorder items under Technologies, Solutions, Products,
  Projects, R&D, and Careers — each has a Google Drive image link, category,
  tags, short/long description, display order, and a publish toggle
- Edit the homepage hero and About page text under **Homepage / Text**
- Review contact form leads under **Contact Leads**

Unpublished items never appear on the public site, so you can draft
content before it goes live.

## 5. Deploying to Vercel

`server/` and `client/` are two separate Vercel projects. Deploy the backend
first so you have its URL to give the frontend.

**5a. Backend (`server/`)**
1. In Vercel: **Add New → Project**, import your repo, and set the
   **Root Directory** to `server`. Vercel auto-detects it via `server/vercel.json`
   (which runs `server.js` as a Node serverless function) — no build command needed.
2. Under **Settings → Environment Variables**, add everything from
   `server/.env.example` with real values (`MONGO_URI`, `JWT_SECRET`,
   `JWT_EXPIRES_IN`, `ADMIN_USERNAME`, `ADMIN_EMAIL`, `ADMIN_PASSWORD`).
   Leave `CLIENT_URL` for step 5c.
3. Deploy. Note the resulting URL, e.g. `https://sensora-api.vercel.app`.
4. Run the one-time admin seed **locally** (pointed at the same `MONGO_URI`
   as production) — Vercel serverless functions aren't meant for one-off
   scripts: `cd server && npm run seed:admin`.

**5b. Frontend (`client/`)**
1. **Add New → Project**, same repo, **Root Directory** set to `client`.
   Vercel auto-detects Vite (`npm run build`, output `dist`); `client/vercel.json`
   adds the SPA rewrite so React Router routes work on direct load/refresh.
2. Under **Settings → Environment Variables**, add:
   `VITE_API_URL = https://sensora-api.vercel.app/api` (your backend URL
   from 5a, with `/api` on the end).
3. Deploy. Note the resulting URL, e.g. `https://sensora.vercel.app`.

**5c. Connect the two**
- Go back to the **backend** project's environment variables and set
  `CLIENT_URL` to the frontend URL from 5b (e.g. `https://sensora.vercel.app`),
  then redeploy the backend so CORS allows requests from it.

No file storage is needed for images — they live in Google Drive and only
the link is stored in MongoDB, so there's nothing to configure for that.

Other hosts (Render, Railway, an EC2/VPS, Netlify) work the same way in
spirit: deploy `server/` and set its env vars, deploy `client/` with
`VITE_API_URL` pointing at the backend's `/api` URL, and set the backend's
`CLIENT_URL` to the frontend's origin.

## Notes on the design brief

- The doc proposed product family names (SensoraSense™, SensoraBot™, etc.)
  — the seed script adds them as draft Products with a note that trademark
  availability needs to be checked before commercial use, per the brief.
- The brief's "Defence, Security & Strategic Technologies" section is seeded
  as a Solution focused on the legitimate high-level capabilities it
  described (situational awareness, surveillance, ruggedized electronics)
  — keep any further copy in that section at that same level.
- Extend the `ContentItem` `type` enum (in `server/models/ContentItem.js`)
  if you want a dedicated Projects/Portfolio section distinct from R&D —
  it's already in the enum and wired into the admin sidebar and routes,
  just add items with `type: "project"` from the admin panel.
