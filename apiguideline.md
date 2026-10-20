# Green Garden Schools API Guideline

This document covers every HTTP endpoint the website and admin dashboard use: what each one expects, what it returns, who may call it, and which screen depends on it.

All endpoints are Next.js route handlers under `app/api/`. Data lives in **PostgreSQL**, accessed through Prisma (`lib/server/db.ts`, schema in `prisma/schema.prisma`). Album images are hosted on **Cloudinary**. See [Backend architecture](#backend-architecture).

## Contents

- [Conventions](#conventions)
- [Endpoint summary](#endpoint-summary)
- [Auth](#auth)
- [Album events](#album-events)
- [Admissions inquiries](#admissions-inquiries)
- [Contact messages](#contact-messages)
- [FAQs](#faqs)
- [Site settings (contact details)](#site-settings-contact-details)
- [Data models](#data-models)
- [Admin dashboard → endpoint map](#admin-dashboard--endpoint-map)
- [Public website → endpoint map](#public-website--endpoint-map)
- [Backend architecture](#backend-architecture)

---

## Conventions

| Topic | Rule |
| --- | --- |
| Base URL | Same origin as the site, e.g. `http://localhost:3000/api/...` |
| Format | JSON request and response bodies (`Content-Type: application/json`) |
| Auth | Admin endpoints need the `ggs_session` cookie, set by `POST /api/auth/login`. It is `httpOnly`, `sameSite=lax` and lasts 8 hours. Browsers send it automatically. |
| Errors | Non-2xx responses always return `{ "message": string }` |
| IDs | Server-generated strings with a prefix: `alb-`, `pho-`, `inq-`, `msg-`, `faq-` |
| Dates | `createdAt` is an ISO 8601 timestamp. `eventDate` is a plain `YYYY-MM-DD` date. |
| Validation | Strings are trimmed and length-capped. Unknown fields are ignored. Invalid optional fields are dropped rather than rejected. |

**Status codes**

| Code | Meaning |
| --- | --- |
| `200` | OK |
| `201` | Created |
| `400` | Invalid or missing input (see `message`) |
| `401` | Not signed in as admin (or bad credentials on login) |
| `404` | Not found, or not visible to the caller (e.g. a draft album event requested by the public) |
| `409` | Username already taken (sign up only) |
| `429` | Too many sign-in or sign-up attempts |
| `500` | Unexpected server error |
| `502` / `503` | Image upload to Cloudinary failed / isn't configured (album create and update) |

On the client, all calls go through `lib/api/request.ts`, which throws an `Error` carrying the API's `message`. React Query hooks in `hooks/` wrap those functions.

---

## Endpoint summary

| Method | Path | Access | Purpose |
| --- | --- | --- | --- |
| `POST` | `/api/auth/login` | Public | Sign in, sets session cookie |
| `POST` | `/api/auth/signup` | Admin (public until the first admin exists) | Create an admin account |
| `POST` | `/api/auth/logout` | Public | Sign out, clears cookie |
| `GET` | `/api/auth/session` | Public | Current admin session or `null` |
| `GET` | `/api/album` | Public / Admin | List events (public sees Published only) |
| `POST` | `/api/album` | Admin | Create event (starts as draft) |
| `GET` | `/api/album/:id` | Public / Admin | One event (drafts admin-only) |
| `PATCH` | `/api/album/:id` | Admin | Update any event field, incl. status and photos |
| `DELETE` | `/api/album/:id` | Admin | Delete event |
| `GET` | `/api/inquiries` | Admin | List admissions inquiries |
| `POST` | `/api/inquiries` | Public | Submit admissions inquiry form |
| `PATCH` | `/api/inquiries/:id` | Admin | Set inbox status |
| `DELETE` | `/api/inquiries/:id` | Admin | Delete inquiry |
| `GET` | `/api/contact` | Admin | List contact messages |
| `POST` | `/api/contact` | Public | Submit contact form |
| `PATCH` | `/api/contact/:id` | Admin | Set inbox status |
| `DELETE` | `/api/contact/:id` | Admin | Delete message |
| `GET` | `/api/faqs` | Public | FAQs in display order |
| `POST` | `/api/faqs` | Admin | Add FAQ |
| `PUT` | `/api/faqs` | Admin | Reorder all FAQs |
| `PATCH` | `/api/faqs/:id` | Admin | Edit FAQ |
| `DELETE` | `/api/faqs/:id` | Admin | Delete FAQ |
| `GET` | `/api/settings` | Public | Contact details |
| `PATCH` | `/api/settings` | Admin | Update contact details |

---

## Auth

Admin accounts live in the `admins` table, and keyphrases are stored as scrypt hashes. `npm run db:seed` creates or updates the account from the `ADMIN_USERNAME` and `ADMIN_KEYPHRASE` env vars. There are no built-in default credentials.

The session cookie holds a **JWT** (HS256, signed with `JWT_SECRET`, 8-hour expiry, issuer and audience checked). Sessions are stateless, so checking one needs no database query. `proxy.ts` verifies the signature and expiry before serving any `/admin/*` page, and API routes verify it again. Signing out clears the cookie. To revoke every session at once (e.g. after a leak), rotate `JWT_SECRET`.

`proxy.ts` redirects any `/admin/*` page request without a valid session JWT to `/admin/login`.

### `POST /api/auth/login`

Request:

```json
{ "username": "admin_root", "keyphrase": "••••••" }
```

`200` sets the cookie and returns:

```json
{ "username": "admin_root" }
```

`401` returns `{ "message": "Invalid username or keyphrase." }`.

`429` is returned after 10 failed attempts per IP and username within 15 minutes.

### `POST /api/auth/signup`

Creates an admin account. Only a signed-in admin can call it, with one exception: while the `admins` table is empty, anyone can call it once to set up the first account.

```json
{ "username": "jane.doe", "keyphrase": "a long memorable passphrase" }
```

| Field | Rules |
| --- | --- |
| `username` | **Required**, 3–80 chars: letters, numbers, `.`, `-`, `_` |
| `keyphrase` | **Required**, 12–512 chars. Stored as a scrypt hash. |

`201` returns `{ "username": "jane.doe" }`. For first-time setup it also signs the new admin in (sets the cookie). When an existing admin creates the account, their own session is unchanged.

Errors: `400` invalid username or keyphrase, `401` not signed in (once an admin exists), `409` username taken, `429` more than 10 attempts per IP in 15 minutes.

### `POST /api/auth/logout`

No body. Clears the cookie and returns `{ "ok": true }`.

### `GET /api/auth/session`

```json
{ "session": { "username": "admin_root" } }
```

When signed out, returns `{ "session": null }`.

---

## Album events

An album entry is an **event**: a cover, a story, up to 4 key facts ("highlights") and a gallery of photos.

**Visibility:** only `status: "Published"` events appear to the public. `Review` (shown as "Draft" in the dashboard) and `Archived` events are visible only with an admin session.

**Images:** `coverSrc` and `photos[].src` accept an `http(s)://` URL, a site path (`/images/...`), or a `data:image/...` URL. The dashboard shrinks uploads in the browser (max 1600px, JPEG) and sends them as data URLs. The server uploads every data URL to Cloudinary and stores the hosted URL, served with `f_auto,q_auto`, so responses never contain data URLs. Images an event stops using, and every image of a deleted event, are removed from Cloudinary after the response is sent. Anything else is stored as `null`, which renders a placeholder.

### `GET /api/album`

Query parameters:

| Name | Required | Description |
| --- | --- | --- |
| `category` | No | `Faith`, `Campus`, `Academics`, `Sports`, `Arts` or `All` |

Returns items sorted by `createdAt`, newest first:

```json
{ "items": [AlbumItem, ...] }
```

### `GET /api/album/:id`

Returns `{ "item": AlbumItem }`. Returns `404` if the event doesn't exist, or if it isn't published and the caller isn't an admin.

### `POST /api/album` (admin)

The new event is always created with `status: "Review"` (draft).

```json
{
  "title": "Eid al-Adha Celebration",
  "category": "Faith",
  "eventDate": "2025-06-10",
  "location": "School Grounds",
  "description": "The whole school came together for Eid…",
  "coverSrc": "https://…/cover.jpg",
  "highlights": [{ "value": "1,500+", "label": "Guests" }],
  "photos": [{ "src": "https://…/1.jpg", "caption": "Morning takbeer" }]
}
```

| Field | Rules |
| --- | --- |
| `title` | **Required**, ≤ 160 chars |
| `category` | **Required**, one of the categories above |
| `eventDate` | `YYYY-MM-DD`; defaults to today |
| `location` | ≤ 160 chars |
| `description` | ≤ 5000 chars |
| `coverSrc` | Image source or `null` |
| `highlights` | ≤ 4 items; `value` ≤ 24 chars, `label` ≤ 40 chars; incomplete items are dropped |
| `photos` | ≤ 80 items; `caption` ≤ 200 chars; `id` is optional (generated if missing) |

Returns `201` with `{ "item": AlbumItem }`. Returns `400` if `title` or `category` is missing.

### `PATCH /api/album/:id` (admin)

Partial update. Send only the fields to change. It accepts everything `POST` does, plus:

| Field | Rules |
| --- | --- |
| `status` | `"Published"`, `"Review"` or `"Archived"` |

`photos`, when sent, **replaces** the whole gallery. Keep each existing photo's `id` to preserve it.

```json
{ "status": "Published" }
```

Returns `{ "item": AlbumItem }`, or `404`.

### `DELETE /api/album/:id` (admin)

Returns `{ "ok": true }`, or `404`.

---

## Admissions inquiries

Submitted from the Admissions page form. They appear in the dashboard **Inbox → Admissions inquiries** tab.

### `POST /api/inquiries` (public)

```json
{
  "firstName": "Aisha",
  "lastName": "Bello",
  "email": "aisha@example.com",
  "phone": "+234 801 234 5678",
  "gradeLevel": "Primary",
  "message": "We'd like to visit in September."
}
```

| Field | Rules |
| --- | --- |
| `firstName`, `lastName` | **Required**, ≤ 80 chars (parent / guardian) |
| `email` | **Required**, valid email, ≤ 160 chars |
| `phone` | Optional, ≤ 40 chars |
| `gradeLevel` | Optional, ≤ 80 chars. The form sends one of `Crèche`, `Nursery`, `Primary`, `Junior Secondary`, `Senior Secondary`, `Hifz Track`. |
| `message` | Optional, ≤ 2000 chars |

Returns `201` with `{ "inquiry": AdmissionsInquiry }` and `status: "new"`. Returns `400` on missing fields or an invalid email.

### `GET /api/inquiries` (admin)

Returns `{ "items": [AdmissionsInquiry, ...] }`, newest first.

### `PATCH /api/inquiries/:id` (admin)

```json
{ "status": "handled" }
```

`status` must be `new`, `read` or `handled`. Returns `{ "inquiry": AdmissionsInquiry }`, or `400` / `404`.

### `DELETE /api/inquiries/:id` (admin)

Returns `{ "ok": true }`, or `404`.

---

## Contact messages

Submitted from the Contact page form. They appear in **Inbox → Contact messages**.

### `POST /api/contact` (public)

```json
{
  "fullName": "Musa Ibrahim",
  "email": "musa@example.com",
  "phone": "",
  "subject": "Campus Tour",
  "message": "Can we visit next week?"
}
```

| Field | Rules |
| --- | --- |
| `fullName` | **Required**, ≤ 120 chars |
| `email` | **Required**, valid email |
| `message` | **Required**, ≤ 4000 chars |
| `phone` | Optional, ≤ 40 chars |
| `subject` | Optional, ≤ 120 chars. The form sends one of `Admissions`, `Campus Tour`, `Hifz Programme`, `Alumni`, `Careers`, `Something else`. |

Returns `201` with `{ "message": ContactMessage }`.

> The created entry comes back under the key `message`. Don't confuse it with the error shape, which is `{ message: string }` on non-2xx responses only.

### `GET /api/contact` (admin)

Returns `{ "items": [ContactMessage, ...] }`, newest first.

### `PATCH /api/contact/:id` (admin)

Body `{ "status": "new" | "read" | "handled" }`. Returns `{ "message": ContactMessage }`.

### `DELETE /api/contact/:id` (admin)

Returns `{ "ok": true }`, or `404`.

**Inbox status workflow** (inquiries and messages):

| Status | Meaning |
| --- | --- |
| `new` | Just arrived; counted in the sidebar badge |
| `read` | Set automatically when an admin opens the entry |
| `handled` | Set by the admin with **Mark as handled**. **Reopen** sets it back to `read`. |

---

## FAQs

Shown on the Contact page in array order. If the list is empty, the FAQ section is hidden.

### `GET /api/faqs` (public)

Returns `{ "items": [FaqItem, ...] }`.

### `POST /api/faqs` (admin)

Body `{ "question": string, "answer": string }`. Both are required (`question` ≤ 240 chars, `answer` ≤ 2000). The FAQ is appended to the end of the list. Returns `201` with `{ "faq": FaqItem }`.

### `PATCH /api/faqs/:id` (admin)

Body with `question` and/or `answer`. Empty strings are rejected with `400`. Returns `{ "faq": FaqItem }`.

### `DELETE /api/faqs/:id` (admin)

Returns `{ "ok": true }`.

### `PUT /api/faqs` (admin)

Reorders the whole list.

```json
{ "ids": ["faq-3", "faq-1", "faq-2", "faq-4", "faq-5"] }
```

`ids` must contain **every** FAQ id exactly once. Returns `{ "items": [FaqItem, ...] }` in the new order, or `400`.

---

## Site settings (contact details)

Used by the Contact page (contact rows, office hours, social icons, "Get directions") and the site footer.

### `GET /api/settings` (public)

Returns `{ "settings": SiteSettings }`.

### `PATCH /api/settings` (admin)

Partial update. Only the fields sent change.

```json
{
  "phonePrimary": "+234 800 GGS EDU",
  "emailAdmissions": "admissions@greengardenschools.edu",
  "officeHours": "Mon–Fri, 7:30–16:00",
  "socials": { "instagram": "https://instagram.com/…" }
}
```

| Field | Rules |
| --- | --- |
| `phonePrimary`, `phoneSecondary`, `addressLine1`, `addressLine2`, `officeHours` | ≤ 200 chars |
| `emailGeneral`, `emailAdmissions` | Valid email |
| `mapUrl` | `http(s)://` URL or `""` |
| `socials.instagram`, `socials.facebook`, `socials.x`, `socials.linkedin` | `http(s)://` URL, or `""` to hide the icon |

Returns `{ "settings": SiteSettings }`, or `400` naming the invalid field.

---

## Data models

The source of truth is `lib/types.ts`.

```ts
type AlbumCategory = "Faith" | "Campus" | "Academics" | "Sports" | "Arts";
type AlbumStatus = "Published" | "Review" | "Archived"; // "Review" = Draft
type InboxStatus = "new" | "read" | "handled";

interface AlbumPhoto { id: string; src: string | null; caption: string }
interface AlbumHighlight { value: string; label: string }

interface AlbumItem {
  id: string;
  title: string;
  category: AlbumCategory;
  status: AlbumStatus;
  createdAt: string;      // ISO timestamp
  eventDate: string;      // YYYY-MM-DD
  location: string;
  description: string;
  coverSrc: string | null;
  highlights: AlbumHighlight[];
  photos: AlbumPhoto[];
}

interface AdmissionsInquiry {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  gradeLevel: string;
  message: string;
  status: InboxStatus;
  createdAt: string;
}

interface ContactMessage {
  id: string;
  fullName: string;
  email: string;
  phone: string;
  subject: string;
  message: string;
  status: InboxStatus;
  createdAt: string;
}

interface FaqItem { id: string; question: string; answer: string }

interface SiteSettings {
  phonePrimary: string;
  phoneSecondary: string;
  emailGeneral: string;
  emailAdmissions: string;
  addressLine1: string;
  addressLine2: string;
  officeHours: string;
  mapUrl: string;
  socials: { instagram: string; facebook: string; x: string; linkedin: string };
}
```

---

## Admin dashboard → endpoint map

| Dashboard page | Route | What the admin can do | Endpoints |
| --- | --- | --- | --- |
| Sign in | `/admin/login` | Sign in | `POST /api/auth/login` |
| (every page) | — | Session check, sign out, "new" inbox badge | `GET /api/auth/session`, `POST /api/auth/logout`, `GET /api/inquiries`, `GET /api/contact` |
| Overview | `/admin` | New-inquiry, new-message, published and draft counts; latest inbox entries; quick actions | `GET /api/album`, `GET /api/inquiries`, `GET /api/contact` |
| Album | `/admin/album` | Create, edit, publish/unpublish, archive and delete events; manage story, date, location, key facts, photos, captions and cover | `GET /api/album`, `POST /api/album`, `PATCH /api/album/:id`, `DELETE /api/album/:id` |
| Inbox | `/admin/inbox?tab=inquiries\|messages` | Read, reply by email, mark handled, reopen or delete inquiries and messages | `GET`/`PATCH`/`DELETE` on `/api/inquiries[/:id]` and `/api/contact[/:id]` |
| FAQs | `/admin/faqs` | Add, edit, reorder and delete FAQs | `GET /api/faqs`, `POST /api/faqs`, `PUT /api/faqs`, `PATCH /api/faqs/:id`, `DELETE /api/faqs/:id` |
| Contact Details | `/admin/settings` | Edit phones, emails, address, office hours, map link and social links | `GET /api/settings`, `PATCH /api/settings` |

## Public website → endpoint map

| Page | Endpoints |
| --- | --- |
| Album list `/album` | `GET /api/album` |
| Album event `/album/:id` | Rendered on the server from the database via `lib/server/data/albums.ts` (same visibility rule as `GET /api/album/:id`), then kept fresh with `GET /api/album/:id` |
| Admissions `/admissions` | `POST /api/inquiries` |
| Contact `/contact` | `POST /api/contact`, `GET /api/faqs`, `GET /api/settings` |
| Footer (all pages) | `GET /api/settings` |

The FAQ and settings hooks render the seed data (`data/faqs.seed.json`, `data/settings.seed.json`) instantly as placeholder content, then swap in the live API response.

---

## Backend architecture

| Piece | Where |
| --- | --- |
| Schema & migrations | `prisma/schema.prisma`, `prisma/migrations/` |
| DB client (one pool per process) | `lib/server/db.ts` |
| Queries, caching, invalidation | `lib/server/data/{albums,inbox,faqs,settings}.ts` |
| Input validation | `lib/server/validate.ts`, `lib/server/album-input.ts` |
| Error → `{ message }` mapping | `lib/server/http.ts` (`handler()` wraps every route) |
| Sessions (JWT) & login | `lib/jwt.ts`, `lib/auth.ts`, `lib/server/password.ts`, `lib/server/rate-limit.ts` |
| Image hosting | `lib/server/cloudinary.ts` |

**Caching.** Public reads (published albums, a published album, the album page's summaries, FAQs, settings) are served from the Next.js data cache (`unstable_cache`), tagged `albums`, `faqs` and `settings`. Every write calls `revalidateTag(tag, { expire: 0 })`, so the next read is fresh. Admin reads (drafts, inbox) always go to the database.

**Setup**

```bash
cp .env.example .env        # fill in DATABASE_URL, JWT_SECRET, ADMIN_*, CLOUDINARY_*
npm run db:up               # local Postgres via docker compose
npm run db:migrate          # apply migrations (dev); use db:deploy in production
npm run db:seed             # sample content + admin account (safe to re-run)
npm run dev
```

The in-memory rate limiter assumes a single server process. Move it to Redis or Postgres before running several instances.
