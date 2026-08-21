# Step 7 Notification Delivery Gate

**Status:** Local notification failure handling implemented; Resend delivery/domain verification remains pending.

## Implemented

- Notification persistence no longer falls back to writing `src/data` after a database failure.
- Database failure is surfaced as a degraded notification store rather than silently creating process-local records.
- Order confirmation email checks provider configuration before attempting delivery.
- Missing provider, missing recipient, and delivery failure create an Admin notification exception when the database is available.
- `GET /api/admin/notifications/health` exposes safe store/email status.
- Admin Notification Center displays notification store and email delivery health.

## Status semantics

- `database`: notification writes/read use PostgreSQL.
- `degraded`: database unavailable; notification writes fail closed.
- `blocked`: email provider missing or placeholder.
- `configured_unverified`: email credentials are present but domain/delivery has not been verified.

No test email is sent automatically. Resend acceptance requires a controlled staging mailbox and verified sender domain.
