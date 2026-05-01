# 🏨 Gontobbo Booking App

![Version 1](https://img.shields.io/badge/Version-1-blue?style=for-the-badge)

Version 1 release of the Gontobbo booking app.

Gontobbo is a modern hotel and restaurant booking frontend built with Next.js 14 and the App Router. It connects to the API for search, booking, payments, notifications, and admin workflows.

---

## 🚀 Features

- 🔍 Hotel and restaurant search
- 📅 Booking management
- 💳 Payment integration
- 🛠️ Admin panel
- 🔔 Notifications
- 👥 Role-based access control
- 📸 Image upload and gallery views
- 🌙 Dark mode support

---

## 🛠️ Tech Stack

### Frontend
- **Next.js 14** with **App Router**
- **React 18**
- **TypeScript**
- **Tailwind CSS**
- **Radix UI**
- **React Query**
- **NextAuth**
- **Formik** + **Yup**
- **Zustand**
- **Axios**
- **Firebase**
- **Stripe JS**

### UI / Forms
- **Lucide React**
- **React Hook Form**
- **React Day Picker**
- **Tailwind Merge**
- **Class Variance Authority**

---

## 📦 Installation

The client lives in the `client/` directory, so install it separately from the API.

```bash
cd client
npm install
cp .env.example .env.local
npm run dev
```

PowerShell:

```powershell
Copy-Item .env.example .env.local
```

Make sure the API is running and `NEXT_PUBLIC_BASE_URL` points to it before logging in or testing booking flows.

---

## 🔐 Environment Variables

Documented in [`.env.example`](./.env.example):

| Variable | Purpose |
| --- | --- |
| `NEXT_PUBLIC_BASE_URL` | Base API URL used by the client |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase API key |
| `NEXT_PUBLIC_FIREBASE_AUTH_DOMAIN` | Firebase auth domain |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase project id |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Firebase storage bucket |
| `NEXT_PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Firebase messaging sender id |
| `NEXT_PUBLIC_FIREBASE_APP_ID` | Firebase app id |
| `NEXT_PUBLIC_FIREBASE_MEASUREMENT_ID` | Firebase measurement id |
| `NEXT_PUBLIC_FIREBASE_VAPID_KEY` | Firebase web push VAPID key |
| `NEXTAUTH_URL` | Canonical NextAuth URL |
| `AUTH_SECRET` | NextAuth secret |
| `NEXT_PUBLIC_AUTH_SERVICE_SECRET` | Optional auth service secret used by the backend flow |
| `NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY` | Stripe publishable key used by the client |

---

## 📚 NPM Scripts

| Command | Description |
| --- | --- |
| `npm run dev` | Starts the Next.js development server |
| `npm run build` | Builds the production client |
| `npm run start` | Starts the production Next.js server |
| `npm run lint` | Runs Next.js linting |

---

## 📸 Screenshots

_You can add screenshots here later like:_

```md
![Home Page](./screenshots/home.png)
![Booking Modal](./screenshots/booking.png)
```

---

## 📄 License

MIT © [Your Name or Organization]
