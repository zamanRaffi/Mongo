````markdown
DDMS (Inventory Management)  Next.js + MongoDB

## Getting Started

1. Copy `.env.local.example` to `.env.local` and set the following values:

   - `MONGO_URI`  MongoDB connection string
   - `JWT_SECRET`  secret used to sign JWTs

2. Install dependencies and run the dev server:

```powershell
npm install; npm run dev
```

3. Open `http://localhost:3000` (or the port shown by Next) in your browser.

## Project Notes

- This project uses Next.js App Router and Mongoose for database models.
- Server-side auth uses JWT stored in an HttpOnly cookie named `token`.
- Use strong `JWT_SECRET` in production and run the app over HTTPS.

## Auth changes applied

- Login and signup now set an HttpOnly `token` cookie. The client no longer stores JWTs in `localStorage`.
- API routes that mutate data check this cookie and return `401` when unauthenticated.

## Final checklist

- [x] Convert TypeScript to JavaScript
- [x] Implement Mongoose models
- [x] Implement API routes
- [x] Implement CRUD pages
- [x] Replace localStorage JWT with HttpOnly cookie
- [x] Add JWT auth checks for API mutate endpoints

## Environment

- `MONGO_URI`  MongoDB connection string
- `JWT_SECRET`  JWT signing secret

## Troubleshooting

- If Next reports an experimental option warning, ensure `next.config.js` matches your Next version.
- If `npm` scripts are blocked in PowerShell, run `Set-ExecutionPolicy RemoteSigned -Scope CurrentUser` as admin or use Git Bash.

````
