# Supabase setup — Da3wetna

The production project uses the Supabase project named `da3wetna` in the Nobi-2 organization.

## Database
The `orders`, `invites`, and `rsvps` tables are created by the migration. Row Level Security is enabled and direct access for `anon` and `authenticated` is revoked. Only server API routes may use the privileged server-side key.

## Storage
The bucket `invitation-media` is public for reading because published invitation pages need to display uploaded photos and audio. Anonymous direct uploads are not allowed. The API route `POST /api/upload` issues a short-lived, single-object signed upload URL after checking MIME type, size, and request rate. The privileged key must never be exposed to browser code.

Bucket limits: 12 MiB maximum; JPEG, PNG, WebP, MP3, MP4/M4A, WAV, and AAC only.

## Vercel environment variables
Set these for Production, Preview, and Development:

- `SUPABASE_URL`: Supabase Project URL.
- `SUPABASE_SERVICE_ROLE_KEY`: server-only Supabase service-role key. Never prefix this with `VITE_`; never put it in client-side code.
- `VITE_SUPABASE_URL`: Project URL (public).
- `VITE_SUPABASE_ANON_KEY`: publishable/anon key (public; currently retained for compatibility with the client config).

For admin order review, set a separate high-entropy `ADMIN_KEY`. Do not reuse a Supabase key or share it in chat.

For Paymob, configure `PAYMOB_API_KEY`, `PAYMOB_INTEGRATION_ID`, `PAYMOB_IFRAME_ID`, and `PAYMOB_HMAC` only after the account owner has completed the provider's setup and a supervised sandbox test. The code currently reads `PAYMOB_HMAC`, not `PAYMOB_HMAC_SECRET`.

Redeploy after changing environment variables. Test the health endpoint, a test order, invitation publication, RSVP submission, and upload before enabling real payments.
