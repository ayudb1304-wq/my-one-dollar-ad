# Implementation Plan
## My One Dollar Ad

Based on [MyOneDollarAd_PRD.md](./MyOneDollarAd_PRD.md)

**Current Stack:** Next.js 16.1.7, React 19, Tailwind CSS 4, shadcn (radix-luma), TypeScript, Turbopack

---

## Phase 1: Foundation (Week 1-2)

### 1.1 Database Setup — Supabase

- [x] Create Supabase project
- [x] Set up environment variables
- [x] Install `@supabase/supabase-js` and `@supabase/ssr`
- [x] Create Supabase client utilities in `lib/supabase/`
  - `lib/supabase/client.ts` — browser client
  - `lib/supabase/server.ts` — server client (for Server Components & API routes)

### 1.2 Database Schema — Migrations

Create migrations in order:

**Migration 1: `users` table**
```sql
CREATE TABLE users (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  email TEXT UNIQUE NOT NULL,
  name TEXT,
  dodo_customer_id TEXT,
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_users_email ON users(email);
CREATE INDEX idx_users_dodo_customer_id ON users(dodo_customer_id);
```

**Migration 2: `pixels` table**
```sql
CREATE TYPE pixel_status AS ENUM ('pending', 'active', 'expired');

CREATE TABLE pixels (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  x INT NOT NULL,
  y INT NOT NULL,
  width INT NOT NULL,
  height INT NOT NULL,
  owner_id UUID REFERENCES users(id),
  image_url TEXT,
  destination_url TEXT,
  display_name TEXT,
  color TEXT,
  payment_id TEXT,
  status pixel_status DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_pixels_status ON pixels(status);
CREATE INDEX idx_pixels_owner ON pixels(owner_id);
CREATE INDEX idx_pixels_coords ON pixels(x, y);
-- Prevent overlapping pixel blocks
ALTER TABLE pixels ADD CONSTRAINT no_negative_dims CHECK (width > 0 AND height > 0);
ALTER TABLE pixels ADD CONSTRAINT grid_bounds CHECK (x >= 0 AND y >= 0 AND x + width <= 1000 AND y + height <= 1000);
```

**Migration 3: `transactions` table**
```sql
CREATE TYPE transaction_status AS ENUM ('pending', 'succeeded', 'failed', 'refunded');

CREATE TABLE transactions (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID REFERENCES users(id),
  pixel_id UUID REFERENCES pixels(id),
  amount INT NOT NULL, -- cents
  dodo_payment_id TEXT,
  status transaction_status DEFAULT 'pending',
  created_at TIMESTAMPTZ DEFAULT now()
);

CREATE INDEX idx_transactions_user ON transactions(user_id);
CREATE INDEX idx_transactions_dodo ON transactions(dodo_payment_id);
```

**Migration 4: Row Level Security**
```sql
ALTER TABLE pixels ENABLE ROW LEVEL SECURITY;
ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE transactions ENABLE ROW LEVEL SECURITY;

-- Public can read active pixels (needed for grid display)
CREATE POLICY "Anyone can view active pixels"
  ON pixels FOR SELECT USING (status = 'active');

-- Authenticated users can insert (via purchase flow)
CREATE POLICY "Service role manages pixels"
  ON pixels FOR ALL USING (auth.role() = 'service_role');

-- Users can view own transactions
CREATE POLICY "Users view own transactions"
  ON transactions FOR SELECT USING (auth.uid() = user_id);
```

### 1.3 Authentication

- [x] Enable Supabase Auth (Email + Google OAuth + GitHub OAuth)
- [x] Create auth middleware in `middleware.ts` for session refresh
- [x] Build pages:
  - `app/(auth)/login/page.tsx` — Login form
  - `app/(auth)/signup/page.tsx` — Signup form
- [x] Guest checkout: no auth required to buy; optionally link purchase to account later

### 1.4 Project Layout & Routing

```
app/
├── layout.tsx                    # Root layout (theme, fonts, Supabase provider)
├── page.tsx                      # Homepage — grid + hero
├── (auth)/
│   ├── login/page.tsx
│   └── signup/page.tsx
├── purchase/
│   ├── page.tsx                  # Purchase flow (select → customize → pay)
│   └── success/page.tsx          # Post-payment success page
├── dashboard/
│   └── page.tsx                  # User dashboard — owned pixels, history
├── api/
│   ├── webhooks/
│   │   └── dodo/route.ts         # Dodo Payments webhook handler
│   ├── pixels/
│   │   ├── route.ts              # GET all active pixels, POST reserve pixels
│   │   └── [id]/route.ts         # PATCH update pixel image/url
│   └── checkout/
│       └── route.ts              # POST create Dodo checkout session
├── globals.css
└── favicon.ico

components/
├── ui/                           # shadcn components
├── pixel-grid/
│   ├── pixel-grid.tsx            # Main canvas grid component
│   ├── pixel-selector.tsx        # Click-drag selection overlay
│   ├── pixel-tooltip.tsx         # Hover info tooltip
│   └── grid-controls.tsx         # Zoom/pan controls
├── purchase/
│   ├── purchase-modal.tsx        # Purchase flow modal
│   ├── image-upload.tsx          # Image upload + preview
│   └── color-picker.tsx          # Solid color alternative
├── layout/
│   ├── header.tsx                # Site header + nav
│   ├── footer.tsx                # Site footer
│   └── stats-bar.tsx             # Live scarcity counter
└── theme-provider.tsx            # Already exists

lib/
├── supabase/
│   ├── client.ts
│   └── server.ts
├── dodo.ts                       # Dodo Payments client setup
├── utils.ts                      # Already exists (cn utility)
└── constants.ts                  # Grid dimensions, pricing, etc.
```

---

## Phase 2: Pixel Grid (Week 2-3)

### 2.1 Grid Rendering — HTML Canvas

The grid is 1000x1000 = 1M pixels. Use `<canvas>` for performance.

- [x] **`components/pixel-grid/pixel-grid.tsx`** — Client component
  - Render full 1000x1000 canvas
  - Load all active pixel blocks from API on mount
  - Draw sold blocks (images or solid colors) onto canvas
  - Unsold area shown as light grid pattern

- [x] **Zoom & Pan** (`grid-controls.tsx` + `use-grid-transform.ts`)
  - Mouse wheel zoom (scale 0.5x to 10x)
  - Click-and-drag pan (when not in selection mode)
  - Touch pinch-zoom and drag for mobile

- [x] **Hover Tooltip** (`pixel-tooltip.tsx`)
  - On mousemove, detect which pixel block is under cursor
  - Show tooltip with: display name, pixel count, "Click to visit"

- [x] **Click-through**
  - Click on sold block → open `destination_url` in new tab

### 2.2 Pixel Data API

- [x] **`GET /api/pixels`** — Return all active pixel blocks
  - Response: `{ pixels: [{ id, x, y, width, height, image_url, color, display_name, destination_url }] }`

- [ ] **Grid snapshot image** — Pre-render a PNG of the full grid
  - Store in Supabase Storage / Vercel Blob
  - Regenerate on each purchase (via webhook handler)
  - Use as initial canvas background, then overlay live data

---

## Phase 3: Selection & Purchase Flow (Week 3-4)

### 3.1 Pixel Selection

- [x] **Pixel selection** — Built into `pixel-grid.tsx`
  - Toggle "Buy Mode" button to enter selection state
  - Click-and-drag to select rectangular area
  - Snap to 10x10 grid (minimum 100 pixels = $100)
  - Highlight selected area with colored overlay
  - Prevent selection over already-sold blocks
  - Display live price: `{width} x {height} = {total} pixels = ${total}`

### 3.2 Purchase Modal

- [x] **`components/purchase/purchase-form.tsx`** — Multi-step purchase page
  - Step 1: Review selection (coordinates, dimensions, price)
  - Step 2: Customize — upload image OR pick color + enter URL + display name
  - Step 3: Customer info (email, name, country)
  - Step 4: Redirect to Dodo Payments checkout

- [x] **`components/purchase/image-upload.tsx`**
  - Accept PNG, JPG, GIF
  - Client-side resize/crop to match selected pixel dimensions
  - Preview on a mini canvas
  - Upload to Supabase Storage on purchase confirmation

- [x] **`components/purchase/color-picker.tsx`**
  - Preset colors + custom hex input

### 3.3 Checkout API

- [x] **`POST /api/checkout`** — Create Dodo Payments checkout session
  - Validates grid bounds + required fields
  - Checks overlap via `check_pixel_overlap` RPC (with fallback)
  - Uploads image to Supabase Storage
  - Reserves pixels as `pending` in DB
  - Creates Dodo checkout session with pixel metadata
  - Creates transaction record

- [x] **`app/purchase/success/page.tsx`** — Post-payment landing page
  - Show confirmation message
  - Display purchased pixel block preview
  - Link back to grid to see it live

---

## Phase 4: Payment Webhooks (Week 5)

### 4.1 Dodo Payments Integration

- [x] Install: `npm install dodopayments standardwebhooks`
- [x] Set up environment variables on Vercel
- [x] **`lib/dodo.ts`** — Lazy-initialized Dodo client
- [x] Created product on Dodo dashboard
- [x] Configured webhook endpoint on Dodo dashboard

### 4.2 Webhook Handler

- [x] **`app/api/webhooks/dodo/route.ts`**
  - Verify webhook signature using `standardwebhooks`
  - Handle events: `payment.succeeded`, `payment.failed`, `refund.created`
  - Return 200 OK

### 4.3 Pixel Reservation & Expiry

- [x] Reserve pixels on checkout creation (status: `pending`)
- [x] Migration for auto-expire pending reservations after 30 minutes

### 4.4 Deployment

- [x] Deploy to Vercel — live at https://my-one-dollar-ad.vercel.app
- [x] Environment variables configured on Vercel
  ```sql
  DELETE FROM pixels WHERE status = 'pending' AND created_at < now() - interval '30 minutes';
  ```

---

## Phase 5: User Dashboard (Week 5-6)

### 5.1 Dashboard Page

- [ ] **`app/dashboard/page.tsx`** — Protected route (redirect if not logged in)
  - Show owned pixel blocks as cards:
    - Preview thumbnail, coordinates, dimensions, status
    - Edit button (change image/URL)
  - Purchase history table from `transactions`

### 5.2 Pixel Management API

- [ ] **`PATCH /api/pixels/[id]`** — Update pixel image or URL
  - Auth required, must own the pixel
  - Accept new `image_url`, `destination_url`, `display_name`
  - Regenerate grid snapshot

---

## Phase 6: Viral Features & Polish (Week 6-8)

### 6.1 Live Stats Bar

- [ ] **`components/layout/stats-bar.tsx`**
  - Display: "X pixels remaining" with fire emoji styling
  - "Y pixels sold in last hour"
  - Use Supabase Realtime or polling (every 30s)

### 6.2 Leaderboard

- [ ] **`app/leaderboard/page.tsx`**
  - Top pixel owners by total pixels owned
  - Query: `SELECT display_name, SUM(width * height) as total FROM pixels WHERE status = 'active' GROUP BY owner_id ORDER BY total DESC LIMIT 20`

### 6.3 "Just Sold" Feed

- [ ] Real-time feed on homepage using Supabase Realtime subscriptions
  - Listen for new `active` pixels
  - Show toast/notification: "CompanyName just bought X pixels"

### 6.4 SEO & Meta

- [ ] Open Graph image (dynamic or static grid snapshot)
- [ ] Meta tags: title, description, keywords
- [ ] `app/sitemap.ts` — Dynamic sitemap
- [ ] `app/robots.ts` — Robots config
- [ ] JSON-LD structured data

### 6.5 Mobile Responsiveness

- [ ] Touch gesture support for grid (pinch zoom, drag pan)
- [ ] Responsive purchase modal (bottom sheet on mobile)
- [ ] Mobile-friendly navigation

### 6.6 Performance Optimization

- [ ] Grid initial load: serve pre-rendered PNG, then hydrate with canvas
- [ ] Lazy load pixel images (only visible viewport)
- [ ] API response caching with ISR / `Cache-Control` headers
- [ ] Image optimization: auto-compress uploads to < 50KB per block

---

## Phase 7: Admin & Moderation (Week 8-9)

### 7.1 Content Moderation

- [ ] Image upload moderation (basic NSFW detection or manual queue)
- [ ] URL validation (check for malware/phishing via Google Safe Browsing API)
- [ ] Admin review queue for flagged content

### 7.2 Admin Dashboard

- [ ] **`app/admin/page.tsx`** — Protected admin route
  - Grid overview with pixel status
  - Revenue stats
  - Moderation queue
  - Refund capability (calls Dodo refund API)

---

## Phase 8: Launch Prep (Week 9-10)

### 8.1 Infrastructure

- [ ] Deploy to Vercel (connect GitHub repo)
- [ ] Configure custom domain: `myonedollarad.com`
- [ ] Set environment variables in Vercel dashboard
- [ ] Set up Supabase production project (separate from dev)

### 8.2 Monitoring & Analytics

- [ ] Vercel Analytics (Web Vitals)
- [ ] Error tracking (Sentry or similar)
- [ ] Uptime monitoring
- [ ] Google Analytics / Plausible for traffic

### 8.3 Testing

- [ ] Load test: simulate 10K concurrent grid viewers
- [ ] Payment flow end-to-end test (Dodo test mode)
- [ ] Mobile testing across devices
- [ ] Accessibility audit (keyboard nav, screen readers)

### 8.4 Pre-Launch Checklist

- [ ] Seed grid with 10-20 demo pixel blocks
- [ ] Verify webhook reliability (retry handling)
- [ ] Set up database backups (Supabase handles this)
- [ ] Prepare error pages (404, 500)
- [ ] HTTPS + security headers configured via Vercel

---

## Dependencies to Install

```bash
# Core
npm install @supabase/supabase-js @supabase/ssr

# Payments
npm install dodopayments standardwebhooks

# Image processing (server-side resize/compress)
# sharp is already installed via Next.js

# Optional / Phase 6+
npm install sonner         # Toast notifications (shadcn compatible)
```

---

## Environment Variables

```env
# Supabase
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# Dodo Payments
DODO_PAYMENTS_API_KEY=
DODO_PAYMENTS_WEBHOOK_KEY=
DODO_PAYMENTS_ENVIRONMENT=test_mode
DODO_PAYMENTS_RETURN_URL=https://myonedollarad.com/purchase/success

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Key Technical Decisions

| Decision | Choice | Rationale |
|----------|--------|-----------|
| Grid rendering | HTML Canvas | 1M pixels needs canvas perf; DOM-based would be too slow |
| Min purchase | 10x10 (100px / $100) | Per PRD; keeps grid usable and prevents single-pixel spam |
| Image storage | Supabase Storage | Already using Supabase; free tier is generous |
| Auth | Supabase Auth | Built-in, supports OAuth, pairs with RLS |
| Guest checkout | Yes (P0) | Lower friction → more conversions |
| Grid snapshot | Pre-rendered PNG | Fast initial load; regenerate on each sale |
| Overlap prevention | DB constraint + server validation | Double-check: client warns, server enforces |
| Pending expiry | 30 min TTL | Prevents indefinite pixel squatting during checkout |

---

## Risk Mitigations (Technical)

| Risk | Mitigation |
|------|------------|
| Pixel overlap race condition | Use DB transaction with `SELECT ... FOR UPDATE` when reserving |
| Slow grid load | Pre-rendered PNG + progressive canvas hydration |
| Webhook missed | Dodo retries; also add manual "check payment" admin action |
| Image abuse | Moderation queue; start with manual review, add AI later |
| Large uploads | Client-side resize before upload; server rejects > 2MB |
