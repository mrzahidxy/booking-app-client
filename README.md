# Gontobbo Booking Client

Frontend for the Gontobbo booking app. It handles hotel and restaurant search, booking flows, payments, auth, and user/admin pages.

## Run

```bash
npm install
cp .env.example .env.local
npm run dev
```

PowerShell:

```powershell
Copy-Item .env.example .env.local
```

Make sure the API is running and `NEXT_PUBLIC_BASE_URL` points to it before testing login or booking flows.

## Env

Copy [`.env.example`](./.env.example) to `.env.local`.

- `NEXT_PUBLIC_BASE_URL` - API base URL
- Firebase keys - used for auth and push features
- `AUTH_SECRET` - Auth.js runtime secret (`NEXTAUTH_URL` is not required; Auth.js uses `trustHost: true`)
- `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` - Stripe client key

## Scripts

- `npm run dev` - start the Next.js dev server
- `npm run build` - build the app
- `npm run start` - start the production server
- `npm run lint` - run lint checks
