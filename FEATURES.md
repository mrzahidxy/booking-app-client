# Client Feature Notes

This file describes client-specific feature behavior for the booking frontend.
Use it with `client/AGENT.md`.

## Scope

- Next.js app routes and layouts
- Feature components, API wrappers, stores, and shared UI
- Auth, search, bookings, payments, notifications, and admin flows

## Main App Areas

- `app/(auth)` for login and signup
- `app/(user)` for home, hotel, restaurant, booking, profile, notifications, cancel, and success pages
- `app/(admin)` for dashboard, tenants, users, hotels, restaurants, role-permission, and admin booking pages
- `app/api/auth` for NextAuth handling
- `components/features/*` for feature-specific UI
- `features/*/api.ts` for backend calls

## Feature Rules

- Keep page and component behavior aligned with the API contract.
- Preserve existing layouts and route groups unless the change is specifically about navigation or UX.
- Treat tenant-aware visibility and admin access as shared behavior across pages and guards.
- Keep payment status labels, booking states, and notification state handling consistent.
- Avoid changing request payloads unless the backend change is done in the same update.

## What To Record For Each Change

- Page or component touched
- Related API endpoint or payload
- Session or auth requirement
- Admin or tenant visibility rule
- Loading, empty, or error state behavior
- Manual test steps

## Good Update Examples

- New page or route group
- Booking/payment UI state change
- Admin guard or redirect change
- Search, profile, or notification behavior change
- Shared component or API wrapper contract change

## Notes To Keep In Sync

- Update the API doc if the frontend depends on a new field or endpoint.
- Keep route guards and direct route behavior consistent.
- Document any manual browser flow that is easy to forget later.
