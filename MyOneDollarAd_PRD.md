# Product Requirements Document
## My One Dollar Ad

**Website:** MyOneDollarAd.com

| Field | Value |
|-------|-------|
| **Document Version** | 1.0 |
| **Date** | April 6, 2026 |
| **Author** | [Your Name] |
| **Status** | Draft |
| **Product Name** | My One Dollar Ad |
| **Tagline** | Own a piece of the internet for just $1 per pixel |

---

## 1. Executive Summary

**My One Dollar Ad** is a modern recreation of Alex Tew's viral 2005 Million Dollar Homepage concept, where advertisers purchase pixels on a 1000×1000 grid (1 million pixels) at $1 per pixel. Each pixel block links to the advertiser's website, creating a unique digital billboard and collectible internet real estate.

This product aims to capture viral attention through scarcity marketing, community building, and modern payment infrastructure via **Dodo Payments**.

**Why "My One Dollar Ad"?**
- **SEO-Optimized:** Contains high-value keywords ("one dollar", "ad")
- **Self-Explanatory:** Instantly communicates the value proposition
- **Personal:** "My" creates a sense of ownership for buyers
- **Memorable:** Easy to say, spell, and share

---

## 2. Problem Statement

### 2.1 Market Opportunity

- Digital advertising is increasingly expensive and impersonal
- Businesses seek unique, memorable advertising opportunities
- Nostalgia for early internet culture creates engagement opportunities
- Limited-supply digital assets create urgency and FOMO

### 2.2 Target Users

- Small businesses and startups seeking affordable, viral exposure
- Content creators and indie developers
- Crypto/Web3 projects looking for community-driven marketing
- Internet culture enthusiasts and collectors

---

## 3. Product Vision

### 3.1 Vision Statement

> *My One Dollar Ad: The internet's most iconic digital billboard where every pixel tells a story and every purchase becomes part of web history.*

### 3.2 Success Metrics

| Metric | Target (6 months) | Stretch Goal |
|--------|-------------------|--------------|
| Pixels Sold | 500,000 | 1,000,000 |
| Revenue | $500,000 | $1,000,000 |
| Unique Advertisers | 1,000 | 5,000 |
| Monthly Page Views | 1,000,000 | 10,000,000 |

---

## 4. Functional Requirements

### 4.1 Core Features

#### 4.1.1 Pixel Grid Display

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| FR-001 | Display 1000×1000 pixel grid (1 million pixels total) | P0 | Planned |
| FR-002 | Real-time rendering of sold pixel blocks with images/colors | P0 | Planned |
| FR-003 | Zoom and pan functionality for grid navigation | P1 | Planned |
| FR-004 | Hover tooltip showing advertiser name and details | P1 | Planned |
| FR-005 | Click-through to advertiser's website in new tab | P0 | Planned |
| FR-006 | Mobile-responsive grid with touch gestures | P1 | Planned |

#### 4.1.2 Pixel Selection & Purchase

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| FR-010 | Click-and-drag pixel block selection | P0 | Planned |
| FR-011 | Minimum purchase of 100 pixels (10×10 block) | P0 | Planned |
| FR-012 | Real-time price calculation ($1 per pixel) | P0 | Planned |
| FR-013 | Prevent selection of already-sold pixels | P0 | Planned |
| FR-014 | Visual feedback during selection process | P1 | Planned |
| FR-015 | Selection preview with coordinates and dimensions | P2 | Planned |

#### 4.1.3 Advertiser Customization

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| FR-020 | Image upload (PNG, JPG, GIF) with auto-resize | P0 | Planned |
| FR-021 | Solid color selection as alternative to image | P1 | Planned |
| FR-022 | Destination URL input with validation | P0 | Planned |
| FR-023 | Display name/brand name field | P0 | Planned |
| FR-024 | Alt text for accessibility | P2 | Planned |
| FR-025 | Preview before purchase confirmation | P1 | Planned |

---

### 4.2 Payment Integration (Dodo Payments)

All payment processing will be handled through **Dodo Payments**, providing a secure, global payment solution with minimal integration complexity.

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| FR-030 | Integrate Dodo Payments Checkout Sessions for secure payment | P0 | Planned |
| FR-031 | Dynamic payment link generation based on pixel selection | P0 | Planned |
| FR-032 | Webhook handler for payment confirmation events | P0 | Planned |
| FR-033 | Support for major credit cards and local payment methods | P0 | Planned |
| FR-034 | Payment receipt and confirmation emails | P1 | Planned |
| FR-035 | Refund capability within 24-hour window (admin only) | P2 | Planned |
| FR-036 | Test mode for development and QA | P0 | Planned |

#### Dodo Payments Integration Architecture

1. **User selects pixels** → Frontend calculates total and displays purchase modal
2. **Create Checkout Session** → Backend calls Dodo API with pixel details and amount
3. **Redirect to Checkout** → User completes payment on Dodo's hosted checkout page
4. **Webhook Confirmation** → Dodo sends `payment.succeeded` event to our webhook endpoint
5. **Pixel Activation** → Backend marks pixels as sold and displays advertiser's content

---

### 4.3 User Accounts & Management

| ID | Requirement | Priority | Status |
|----|-------------|----------|--------|
| FR-040 | Email-based user registration and login | P1 | Planned |
| FR-041 | OAuth login (Google, GitHub) | P2 | Planned |
| FR-042 | User dashboard showing owned pixels | P1 | Planned |
| FR-043 | Ability to update pixel image/URL after purchase | P1 | Planned |
| FR-044 | Purchase history and receipts | P2 | Planned |
| FR-045 | Guest checkout option (no account required) | P0 | Planned |

---

## 5. Non-Functional Requirements

### 5.1 Performance

- Grid render time: < 2 seconds on 4G connection
- API response time: < 200ms for pixel status queries
- Support 10,000 concurrent users
- Image optimization: Auto-compress uploads to < 50KB per block

### 5.2 Security

- HTTPS everywhere with TLS 1.3
- Dodo Payments webhook signature verification
- Rate limiting on all API endpoints
- Content moderation for uploaded images
- GDPR and CCPA compliance

### 5.3 Reliability

- 99.9% uptime SLA
- Automated database backups every 6 hours
- CDN caching for grid images
- Graceful degradation if payment provider is unavailable

---

## 6. Technical Architecture

### 6.1 Tech Stack

| Layer | Technology | Rationale |
|-------|------------|-----------|
| Frontend | Next.js 14 + React | SSR, optimized performance, great DX |
| Styling | Tailwind CSS | Rapid development, consistent design |
| Grid Rendering | HTML Canvas or WebGL | Performance for 1M pixels |
| Backend | Next.js API Routes / Node.js | Unified codebase, serverless ready |
| Database | Supabase (PostgreSQL) | Real-time, auth built-in, generous free tier |
| Payments | Dodo Payments | Simple integration, global coverage, MoR support |
| File Storage | Supabase Storage / Cloudflare R2 | CDN-backed, cost-effective |
| Hosting | Vercel | Zero-config deployment, edge functions |

### 6.2 Database Schema

#### `pixels` table

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `x` | INT | Grid X coordinate |
| `y` | INT | Grid Y coordinate |
| `width` | INT | Block width in pixels |
| `height` | INT | Block height in pixels |
| `owner_id` | UUID | FK → users table |
| `image_url` | TEXT | URL to uploaded image |
| `destination_url` | TEXT | Advertiser's website URL |
| `display_name` | TEXT | Brand/company name |
| `color` | TEXT | HEX color (if no image) |
| `payment_id` | TEXT | Dodo payment reference |
| `status` | ENUM | pending, active, expired |
| `created_at` | TIMESTAMP | Purchase timestamp |

#### `users` table

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `email` | TEXT | User email |
| `name` | TEXT | Display name |
| `dodo_customer_id` | TEXT | Dodo Payments customer ID |
| `created_at` | TIMESTAMP | Registration timestamp |

#### `transactions` table

| Column | Type | Description |
|--------|------|-------------|
| `id` | UUID | Primary key |
| `user_id` | UUID | FK → users table |
| `pixel_id` | UUID | FK → pixels table |
| `amount` | INT | Amount in cents |
| `dodo_payment_id` | TEXT | Dodo payment ID |
| `status` | ENUM | pending, succeeded, failed, refunded |
| `created_at` | TIMESTAMP | Transaction timestamp |

---

## 7. Dodo Payments Implementation Details

### 7.1 Environment Setup

Required environment variables:

```env
DODO_PAYMENTS_API_KEY=your_api_key_here
DODO_PAYMENTS_WEBHOOK_KEY=your_webhook_secret_here
DODO_PAYMENTS_ENVIRONMENT=test_mode  # or live_mode
DODO_PAYMENTS_RETURN_URL=https://yoursite.com/purchase/success
```

### 7.2 Creating a Checkout Session

```typescript
import DodoPayments from 'dodopayments';

const client = new DodoPayments({
  bearerToken: process.env.DODO_PAYMENTS_API_KEY,
  environment: process.env.DODO_PAYMENTS_ENVIRONMENT,
});

async function createPixelCheckout(pixels: PixelSelection, customer: Customer) {
  const payment = await client.payments.create({
    payment_link: true,
    billing: {
      city: customer.city,
      country: customer.country,
      state: customer.state,
      street: customer.street,
      zipcode: customer.zipcode,
    },
    customer: {
      email: customer.email,
      name: customer.name,
    },
    product_cart: [{
      product_id: 'pixel_block',
      quantity: pixels.count,  // Number of pixels
    }],
    metadata: {
      pixel_x: pixels.x,
      pixel_y: pixels.y,
      pixel_width: pixels.width,
      pixel_height: pixels.height,
    },
  });

  return payment.payment_link;  // Redirect user to this URL
}
```

### 7.3 Webhook Handler

```typescript
import { Webhook } from 'standardwebhooks';

const webhook = new Webhook(process.env.DODO_PAYMENTS_WEBHOOK_KEY);

export async function POST(request: Request) {
  const headers = {
    'webhook-id': request.headers.get('webhook-id') || '',
    'webhook-signature': request.headers.get('webhook-signature') || '',
    'webhook-timestamp': request.headers.get('webhook-timestamp') || '',
  };

  const rawBody = await request.text();
  
  // Verify signature
  await webhook.verify(rawBody, headers);
  
  const payload = JSON.parse(rawBody);

  switch (payload.type) {
    case 'payment.succeeded':
      await activatePixels(payload.data);
      break;
    case 'payment.failed':
      await releaseReservedPixels(payload.data);
      break;
    case 'refund.created':
      await deactivatePixels(payload.data);
      break;
  }

  return new Response('OK', { status: 200 });
}
```

### 7.4 Webhook Events to Handle

| Event | Action |
|-------|--------|
| `payment.succeeded` | Activate pixels, send confirmation email |
| `payment.failed` | Release reserved pixels, notify user |
| `refund.created` | Deactivate pixels, mark as available |

---

## 8. Go-to-Market Strategy

### 8.1 The Alex Tew Playbook (Proven Strategy)

The original Million Dollar Homepage succeeded through a specific sequence that we will replicate:

| Step | Action | Result |
|------|--------|--------|
| 1 | Friends & Family purchases | First $4,700 in sales |
| 2 | Hired PR agency with initial revenue | Professional press release |
| 3 | BBC & Guardian picked up the story | $3,000 in single day |
| 4 | Viral snowball effect | 20-30 interviews per day at peak |
| 5 | Scarcity auction for final pixels | Last 1,000 pixels sold for $38,100 on eBay |

**Key Insight:** The site was initially marketed only through word of mouth. After making $1,000, a press release was sent out that was picked up by the BBC. The crucial thing was that the idea itself was unique and quirky enough to stand out.

---

### 8.2 Launch Phases

#### Phase 1: Seed the Grid (Week 1-2)
**Goal: Get to 10,000 pixels sold before going public**

| Action | How | Cost |
|--------|-----|------|
| Friends & Family | Personal outreach, WhatsApp groups | Free |
| Your own businesses/projects | Buy pixels for your own stuff | $100-500 |
| Barter with creators | "Free pixels for a tweet" | Free |
| Micro-influencers | DM 50 small creators, offer free blocks | Free |
| Indie hackers you know | Personal network | Free |

**Why this matters:** No one wants to buy advertising space on a site that no one has heard about. Initial sales create social proof.

#### Phase 2: PR Blitz (Week 3-4)
**Goal: Get mainstream media coverage**

**Press Release Framing:**
- ❌ "New pixel advertising platform launches"
- ✅ "26-year-old tries to make $1M selling pixels, one dollar at a time"

**Target Outlets (Priority Order):**

| Tier | Outlets | Approach |
|------|---------|----------|
| **Tech blogs** | TechCrunch, The Verge, Ars Technica, Wired | Email tips@ addresses |
| **Startup media** | The Hustle, Morning Brew, Indie Hackers | DM editors on Twitter |
| **Regional news** | Local newspaper, TV station | "Local founder" angle |
| **Podcasts** | My First Million, Indie Hackers, How I Built This | Pitch as guest |
| **YouTube** | Tech/business YouTubers | Offer exclusive early access |

**PR Pitch Template:**
```
Subject: I'm selling pixels for $1 each at MyOneDollarAd.com — sound familiar?

Hi [Name],

In 2005, Alex Tew made $1M in 4 months selling pixels. 
I'm trying to do it again in 2026 with My One Dollar Ad.

Currently at [X] pixels sold, [Y] to go.

Would you be interested in covering the journey?

[Your name]
MyOneDollarAd.com
```

#### Phase 3: Community Launch (Week 3-4)
**Goal: Viral spread through communities**

**Reddit Strategy:**

| Subreddit | Angle | Post Type |
|-----------|-------|-----------|
| r/Entrepreneur | "I launched MyOneDollarAd.com to recreate the Million Dollar Homepage" | Journey post |
| r/InternetIsBeautiful | "I built My One Dollar Ad — a modern pixel grid" | Showcase |
| r/SideProject | "My One Dollar Ad: My $1/pixel experiment" | Feedback request |
| r/startups | Business angle | Discussion |
| r/smallbusiness | "Cheap advertising alternative at MyOneDollarAd.com" | Value prop |

**Pro tip:** Post as a journey, not an ad. Ask for feedback. Be vulnerable.

**Hacker News Strategy:**
- Post as "Show HN: My One Dollar Ad — I'm recreating the Million Dollar Homepage"
- Best time: Tuesday-Thursday, 9am EST
- Engage with EVERY comment

**Product Hunt Strategy:**
- Prep: Get 50+ upvotes from your network in first hour
- Have a GIF/video ready showing the grid
- Respond to every comment within minutes

#### Phase 4: Scale & Optimize (Week 5+)
**Goal: Maintain momentum to 1M pixels**

| Phase | Duration | Goal | Key Activities |
|-------|----------|------|----------------|
| **Alpha** | 2 weeks | 10,000 pixels sold | Friends & family, Twitter launch |
| **Beta** | 4 weeks | 100,000 pixels sold | Product Hunt, Hacker News, Reddit |
| **Public** | Ongoing | 1,000,000 pixels sold | PR outreach, influencer partnerships |

---

### 8.3 Viral Mechanics (Built Into Product)

#### 8.3.1 Live Scarcity Counter
```
🔥 847,293 pixels remaining
⏰ 2 pixels sold in the last minute
```

#### 8.3.2 Leaderboard
"Top Pixel Owners" — people LOVE being on lists

| Rank | Owner | Pixels |
|------|-------|--------|
| 1 | @company1 | 10,000 |
| 2 | IndieHacker Co | 5,000 |
| 3 | StartupXYZ | 2,500 |

#### 8.3.3 Referral Program
- Give 10 free pixels for every referral who buys
- Unique referral links for tracking
- Referral leaderboard for top promoters

#### 8.3.4 "Just Sold" Feed
Real-time notifications on homepage:
```
✅ @startup_joe just bought 100 pixels
✅ CoolCompany.com claimed their spot
✅ Anonymous bought 500 pixels
```

#### 8.3.5 Shareable Certificates
Auto-generate "I Own My One Dollar Ad" images for buyers to share on social media

#### 8.3.6 Social Proof Counters
- "Join 1,523 businesses already on the grid"
- "Trusted by companies from 47 countries"

---

### 8.4 Marketing Channels

| Channel | Strategy | Frequency |
|---------|----------|-----------|
| **Twitter/X** | Build in public, share milestones, engage with tech community | Daily |
| **Product Hunt** | Launch day campaign with prepared assets | One-time + updates |
| **Hacker News** | "Show HN" post with technical details | One-time + milestone posts |
| **Reddit** | r/entrepreneur, r/SideProject, r/InternetIsBeautiful | Weekly updates |
| **TikTok** | "I'm trying to make $1M selling pixels" content series | 3x/week |
| **YouTube** | Behind-the-scenes development vlogs | Weekly |
| **Email** | Notify buyers when neighbors purchase pixels | Automated |
| **LinkedIn** | B2B angle for small business advertising | 2x/week |

---

### 8.5 PR Stunts & Newsworthy Moments

| Stunt | Timing | PR Angle |
|-------|--------|----------|
| **Milestone celebrations** | Every 100K pixels | "We just hit 500K pixels sold!" |
| **Celebrity outreach** | Ongoing | DM celebrities offering free blocks |
| **Charity donation announcement** | At 500K | "We're donating 10% to [cause]" |
| **Price increase warning** | At 500K | "Price doubles when we hit 1M sold" |
| **eBay auction for last 1,000** | Near end | Creates urgency and news coverage |
| **Time capsule angle** | Launch | "Own a piece of 2026 internet history" |
| **"Pixel War" event** | Monthly | Community competition for prime spots |
| **Anniversary of original** | August 26 | Tie-in to Million Dollar Homepage history |

---

### 8.6 Content Calendar (First Month)

| Day | Platform | Content |
|-----|----------|---------|
| 1 | Twitter | "Launching MyOneDollarAd.com today" thread |
| 1 | Reddit | r/SideProject post about My One Dollar Ad |
| 3 | YouTube | "I'm building My One Dollar Ad" video |
| 5 | Hacker News | Show HN: My One Dollar Ad |
| 7 | Twitter | Week 1 update thread |
| 10 | Product Hunt | Official My One Dollar Ad launch |
| 12 | TikTok | Behind-the-scenes video |
| 14 | Twitter | Week 2 update + milestone celebration |
| 14 | Blog | "Why I built My One Dollar Ad" |
| 17 | LinkedIn | B2B angle post |
| 21 | Podcast pitches | Email 20 relevant podcasts |
| 24 | Reddit | Progress update on r/Entrepreneur |
| 28 | Twitter | Month 1 recap thread with stats |
| 28 | YouTube | My One Dollar Ad: Month 1 journey video |

---

### 8.7 Build in Public Strategy

**Twitter Thread Template (Weekly Updates):**
```
I'm building MyOneDollarAd.com — selling pixels at $1 each.

Week [X] Update:

📊 Pixels sold: [number]
💰 Revenue: $[amount]
👥 Unique buyers: [number]
🌍 Countries: [number]
📈 Best day: [day] with [number] pixels

Biggest wins this week:
• [Win 1]
• [Win 2]
• [Win 3]

Biggest challenges:
• [Challenge 1]
• [Challenge 2]

Follow along as I build My One Dollar Ad 🧵

myonedollarad.com
```

---

### 8.8 Influencer & Partnership Strategy

#### Target Influencer Tiers

| Tier | Follower Count | Approach | Offer |
|------|----------------|----------|-------|
| **Nano** | 1K-10K | DM directly | Free 100 pixels |
| **Micro** | 10K-50K | DM or email | Free 500 pixels + affiliate |
| **Mid** | 50K-500K | Email with media kit | Free 1,000 pixels + revenue share |
| **Macro** | 500K+ | PR agency or warm intro | Custom partnership |

#### Target Niches
- Indie hackers / solopreneurs
- Small business coaches
- Startup founders
- Tech YouTubers
- Marketing educators
- Web developers

#### Partnership Types
1. **Pixel-for-Post**: Free pixels in exchange for social media post
2. **Affiliate Program**: 20% commission on referred sales
3. **Co-Marketing**: Joint giveaways with complementary brands
4. **Podcast Sponsorship**: Buy pixels for podcasts you sponsor

---

### 8.9 Paid Acquisition (Phase 2 Only)

**Only spend on ads AFTER organic traction is established**

| Channel | Budget | Targeting | Expected CPA |
|---------|--------|-----------|--------------|
| Twitter/X Ads | $500/mo | Startup founders, indie hackers | $5-10 |
| Reddit Ads | $300/mo | r/entrepreneur, r/smallbusiness | $3-8 |
| Google Ads | $500/mo | "cheap advertising", "startup marketing" | $10-20 |
| Facebook/IG | $300/mo | Small business owners, 25-45 | $5-15 |

**Retargeting Strategy:**
- Pixel all site visitors
- Retarget cart abandoners with urgency messaging
- Retarget past buyers for referral program

---

### 8.10 Differentiation Strategy

Since many copycat sites failed after the original, we need a unique angle:

| Angle | Implementation | PR Hook |
|-------|----------------|---------|
| **Charity** | 100% to cause | "Founder tries to raise $1M for [cause] selling pixels" |
| **Time Capsule** | Grid archived forever on blockchain | "Own a piece of 2026 internet history" |
| **Community Owned** | Token holders vote on features | "The internet's first community-owned billboard" |
| **Specific Niche** | Only indie hackers or AI startups | "The Indie Hacker Homepage" |
| **Expiring Pixels** | Pixels expire yearly, must renew | Creates recurring revenue + ongoing urgency |
| **Gamified** | Badges, achievements, pixel wars | Makes it fun, not just ads |

**Recommended Primary Angle:** [To be decided based on founder's passion and market research]

---

### 8.11 Success Metrics

| Metric | Week 1 | Month 1 | Month 3 | Month 6 |
|--------|--------|---------|---------|---------|
| Pixels sold | 5,000 | 50,000 | 200,000 | 500,000 |
| Revenue | $5,000 | $50,000 | $200,000 | $500,000 |
| Unique visitors | 10,000 | 100,000 | 500,000 | 1,000,000 |
| Press mentions | 1 | 10 | 30 | 50 |
| Twitter followers | 500 | 5,000 | 15,000 | 30,000 |
| Email subscribers | 200 | 2,000 | 8,000 | 20,000 |
| Conversion rate | 2% | 3% | 4% | 5% |

---

### 8.12 Quick Wins Checklist (Pre-Launch)

- [ ] Buy your own pixels — Be your first customer
- [ ] Tweet about it — Even with 0 followers, start the journey
- [ ] DM 10 friends — Ask them to buy $100 worth
- [ ] Set up a "Build in Public" thread — Document everything
- [ ] Create a waitlist landing page — Capture emails before launch
- [ ] Prepare Product Hunt assets — Screenshots, GIF, description
- [ ] Write press release draft — Have it ready for PR push
- [ ] Set up Google Alerts — Monitor mentions of your brand
- [ ] Create social media accounts — Secure handles on all platforms
- [ ] Prepare launch day email — For your personal network

---

## 9. Development Timeline

| Week | Milestone | Deliverables |
|------|-----------|--------------|
| **1-2** | Foundation | Database schema, basic grid UI, authentication |
| **3-4** | Core Features | Pixel selection, image upload, preview functionality |
| **5-6** | Payments | Dodo Payments integration, webhooks, receipts |
| **7-8** | Polish | Performance optimization, mobile support, error handling |
| **9-10** | Launch Prep | Testing, content moderation, analytics, soft launch |

### Detailed Sprint Breakdown

#### Weeks 1-2: Foundation
- [ ] Set up Next.js project with TypeScript
- [ ] Configure Supabase database and authentication
- [ ] Create database schema and migrations
- [ ] Build basic 1000×1000 grid component
- [ ] Implement zoom/pan functionality

#### Weeks 3-4: Core Features
- [ ] Click-and-drag pixel selection
- [ ] Image upload with compression
- [ ] Color picker alternative
- [ ] Purchase modal UI
- [ ] Pixel preview before purchase

#### Weeks 5-6: Payments
- [ ] Dodo Payments account setup
- [ ] Checkout session creation API
- [ ] Webhook endpoint implementation
- [ ] Payment success/failure handling
- [ ] Email notifications

#### Weeks 7-8: Polish
- [ ] Canvas/WebGL optimization for performance
- [ ] Mobile responsive design
- [ ] Error boundaries and fallbacks
- [ ] Loading states and skeletons
- [ ] Accessibility audit

#### Weeks 9-10: Launch Prep
- [ ] Image moderation pipeline
- [ ] Analytics integration
- [ ] SEO optimization
- [ ] Load testing
- [ ] Documentation and support pages

---

## 10. Risks & Mitigations

| Risk | Impact | Likelihood | Mitigation |
|------|--------|------------|------------|
| Low initial traction | High | Medium | Seed grid with 50+ demo advertisers before launch |
| Inappropriate content uploads | High | High | AI moderation (AWS Rekognition) + manual review queue |
| Payment fraud | Medium | Low | Dodo's built-in fraud detection + velocity checks |
| Performance issues at scale | Medium | Medium | Canvas/WebGL rendering, aggressive CDN caching |
| Dead links from sold pixels | Low | High | Periodic link health checks, notify owners |
| Copycat competitors | Medium | Medium | First-mover advantage, build community moat |
| Server costs exceed revenue | Medium | Low | Serverless architecture, optimize image storage |

---

## 11. Open Questions

1. **Pixel expiration**: Should pixels be permanent or expire after 1 year (requiring renewal)?
2. **Minimum block size**: Is 10×10 (100 pixels / $100) too high a barrier to entry?
3. **Content restrictions**: What categories should be prohibited (gambling, adult, etc.)?
4. **Secondary market**: Should we allow pixel resales between users?
5. **Premium placement**: Should certain grid areas (center, edges) cost more?

---

## 12. Appendix

### A. Brand Assets

| Asset | Details |
|-------|---------|
| **Product Name** | My One Dollar Ad |
| **Domain** | MyOneDollarAd.com |
| **Tagline Options** | "Own a piece of the internet for $1" / "Your ad. One dollar. Forever." / "The internet's cheapest billboard" |
| **Twitter Handle** | @MyOneDollarAd |
| **Email** | hello@myonedollarad.com |

### B. Competitive Analysis

| Product | Model | Status | Learnings |
|---------|-------|--------|-----------|
| Million Dollar Homepage (2005) | $1/pixel, permanent | Sold out | Proved the concept, massive PR |
| Reddit Place | Free, temporary | Recurring event | Community engagement is key |
| NFT pixel projects | Blockchain-based | Various | Ownership verification, but complexity barrier |

### C. Dodo Payments Resources

- [Documentation](https://docs.dodopayments.com)
- [API Reference](https://docs.dodopayments.com/api-reference)
- [Next.js Boilerplate](https://github.com/dodopayments/dodo-nextjs-minimal-boilerplate)
- [Webhook Guide](https://docs.dodopayments.com/developer-resources/integration-guide)

### D. Reference Links

- [Original Million Dollar Homepage](http://www.milliondollarhomepage.com/)
- [Alex Tew Interview](https://www.youtube.com/watch?v=example)
- [The Hustle: How the Million Dollar Homepage kid became the $250m app man](https://thehustle.co/how-the-million-dollar-homepage-kid-became-the-250m-app-man)

---

*Document last updated: April 6, 2026*
*Product: My One Dollar Ad (MyOneDollarAd.com)*
