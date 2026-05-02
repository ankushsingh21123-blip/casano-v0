<p align="center">
  <img src="https://img.shields.io/badge/Status-Pre--Seed-brightgreen?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Platform-Web%20%7C%20Mobile--First-blue?style=for-the-badge" />
  <img src="https://img.shields.io/badge/Stack-Next.js%2015%20%7C%20React%2019-black?style=for-the-badge" />
</p>

<h1 align="center">🏪 Casano — HyperlocalOS</h1>

<p align="center">
  <strong>India's first zero-warehouse hyperlocal delivery platform.</strong><br/>
  We replace ₹2.5 Lakh/month dark stores with the idle inventory of 15 million Kirana shops.<br/>
  The result: <em>12% higher Contribution Margin</em> than industry leaders — from Day 1.
</p>

---

## 📌 Comprehensive Codebase Documentation

This README serves as the ultimate, detailed technical reference for the entire Casano HyperlocalOS codebase. It documents every language, framework, library, file, and algorithmic condition used across the frontend, backend, and database layers.

---

## 🛠️ Global Technology Stack

### Frontend App (`apps/frontend`)
*   **Core Framework:** Next.js 15 (App Router), React 19 (Hooks, Concurrent features).
*   **Language:** TypeScript (Strict mode) & JSX/TSX.
*   **Styling:** Tailwind CSS 4 (Utility-first), CSS Modules (`.module.css`), `clsx` & `tailwind-merge` for dynamic classes.
*   **Animations:** Framer Motion (page transitions, micro-interactions), GSAP (complex timelines), `tw-animate-css`.
*   **UI Components:** Radix UI (accessible primitives), Shadcn UI (customizable components), Lucide React (icons).
*   **Mapping:** MapLibre GL (`maplibre-gl`) for interactive order tracking maps.
*   **Data Visualization:** Chart.js & `react-chartjs-2` (Admin/Investor dashboards).
*   **State Management:** React Context API (`AuthContext`, `CartContext`), Custom Hooks (`useLocalStorage`).

### Backend Services (`backend/` & `packages/backend/`)
*   **Core Framework:** Node.js, Express.js 5.
*   **Language:** JavaScript (ES Modules / CommonJS mixed depending on the package).
*   **Real-time Communication:** Socket.io (Bi-directional events for order tracking and merchant alerts).
*   **Database Interaction:** `@supabase/supabase-js` (Primary BaaS), `pg` (PostgreSQL client for custom queries), Prisma ORM (`@prisma/client`).
*   **Caching & Rate Limiting:** Redis (`redis` client), `express-rate-limit`.
*   **Security:** Helmet.js (HTTP headers), `jsonwebtoken` (JWT for auth), `bcrypt` (password hashing), CORS.
*   **External APIs:** 
    *   Firebase Admin (`firebase-admin`) for secure backend auth verification.
    *   Razorpay / Stripe for payment processing.
    *   Twilio for SMS/OTP verification.
    *   Elasticsearch for advanced product search.

### Database & Infrastructure
*   **Primary Database:** PostgreSQL (with PostGIS extension for geospatial queries like distance calculation).
*   **Schema Management:** Prisma (`schema.prisma`) and raw SQL (`schema.sql`).
*   **Containerization:** Docker & Docker Compose (`docker-compose.yml` for local Postgres, Redis, Elasticsearch).
*   **Deployment Providers:** Vercel/Netlify (Frontend), Railway/Render (Backend).

---

## 📂 Detailed Project Structure & File-by-File Breakdown

### 1. Root Configurations
*   **`package.json`**: Root monorepo configuration using npm workspaces (`apps/*`, `packages/*`).
*   **`docker-compose.yml`**: Defines local services: `postgres` (with PostGIS), `redis` (Alpine), and `elasticsearch` (Single-node).
*   **`netlify.toml`**: Netlify deployment config pointing to `apps/frontend` using the `@netlify/plugin-nextjs`.
*   **`railway.json`**: Railway deployment config building and starting the `backend/` directory using Nixpacks.
*   **`render.yaml`**: Render deployment config targeting `packages/backend/`.
*   **`utils/algorithms.js`**: Core business logic functions (detailed in the Conditions section below).

---

### 2. Frontend Application (`apps/frontend/`)

#### Configuration Files
*   **`next.config.ts`**: Next.js configuration ignoring build errors and externalizing `@prisma/client`.
*   **`tailwind.config.ts` / `postcss.config.mjs`**: Tailwind CSS 4 and PostCSS setup.
*   **`tsconfig.json`**: Strict TypeScript configuration tailored for Next.js.
*   **`public/manifest.json` & `public/sw.js`**: PWA (Progressive Web App) configuration and Service Worker for offline caching, static asset management, and push notifications.

#### Contexts & Global State (`src/context/`)
*   **`AuthContext.tsx`**: Manages global user state (`user`, `isLoggedIn`, `deliveryLocation`). Provides `login`, `logout`, and `setProfile` functions.
*   **`CartContext.tsx`**: Manages shopping cart state. Features Redis-simulated instant caching using `localStorage`. Calculates `cartTotal` and `cartCount` using `useMemo`.
*   **`Providers.tsx`**: Wrapper component composing all contexts and showing a one-time `SplashLoader` per session.

#### Custom Hooks (`src/hooks/`)
*   **`useLocalStorage.ts`**: A reactive interface mimicking `useState` but persisting data to the browser's `localStorage` safely.

#### Services & Lib (`src/services/` & `src/lib/`)
*   **`firebase.ts`**: Initializes Firebase client app, Auth, and sets up invisible Recaptcha for Phone OTP.
*   **`firebase.service.ts`**: Abstraction layer for Firebase Auth (Google popup, Email/Password, Phone SMS sending and verifying).
*   **`utils.ts`**: Contains `cn` utility (merging Tailwind classes securely with `clsx` and `twMerge`).

#### Core UI Components (`src/components/`)
*   **`Header.tsx` & `Footer.tsx`**: Global navigation and footer elements.
*   **`HeroBanner.tsx` & `LiquidHero.tsx`**: High-impact visual headers for the homepage, utilizing dynamic animations.
*   **`CategoryGrid.tsx` & `CategorySlider.tsx`**: Interactive components for browsing product categories.
*   **`CartPanel.tsx`**: A sliding drawer displaying current cart items, total calculations, and a checkout CTA.
*   **`ProductCard.tsx` & `ProductDetailsModal.tsx`**: Displays individual product details, pricing, and "Add to Cart" functionality.
*   **`LoginModal.tsx`**: A multi-step modal handling Firebase Authentication (Phone, Google, Email).
*   **`SearchBar.tsx`**: Integrated search input utilizing Elasticsearch backend endpoints.
*   **`LocationModal.tsx`**: Captures and validates user delivery coordinates.
*   **`PWAInstallPrompt.tsx`**: Detects iOS/Android and prompts the user to "Add to Home Screen".
*   **`ThemeToggle.tsx`**: Switches between the custom light and dark "Rajputana" themes.
*   **`AuthGuard.tsx`**: A Higher-Order Component (HOC) to protect private routes, redirecting unauthenticated users.

#### Next.js App Router Pages (`src/app/`)
*   **`layout.tsx`**: The Root Layout. Configures global fonts (Geist), metadata, PWA meta tags, and wraps the app in `<Providers>`.
*   **`page.jsx`**: The main landing page. Implements responsive switching (renders `OldMobileHome` on small screens, desktop layout otherwise).
*   **`globals.css`**: Defines the extensive "Rajputana" design system CSS variables, Shadcn UI tokens, dark mode overrides, and custom scrollbars.
*   **`checkout/page.tsx`**: The checkout flow integrating Razorpay/Stripe, addressing, and order creation.
*   **`order-tracking/page.tsx`**: A real-time tracking interface showing delivery progress, driver location via MapLibre GL, and WebSockets.
*   **`merchant/`**: Contains the Vendor Dashboard for accepting orders, and `scanner/` for barcode-based inventory addition.
*   **`rider/`**: Contains the Delivery Partner Dashboard for accepting trips and updating statuses.
*   **`admin/`**: Contains `ops/` (Operations dashboard), `investor/` (Data room & metrics), and `wizard/` (City setup).
*   **`category/[id]/page.tsx`**: Dynamic category browsing pages (e.g., Groceries, Pharmacy).
*   **`product/[id]/page.tsx`**: SEO-friendly individual product pages.
*   **`account/`**: User profile, saved addresses, and order history pages.

---

### 3. Backend Implementation #1: Supabase-driven API (`backend/server.js`)
*   **Core Role:** Serves as the primary CRUD API connecting the frontend directly to Supabase via `@supabase/supabase-js` (using Service Role Key).
*   **WebSocket Setup:** Initializes `Socket.io` with CORS configured for the frontend URL.
*   **Authentication:** Middleware `authenticateUser` verifies Supabase JWT tokens via `supabase.auth.getUser()`.
*   **Key Endpoints:**
    *   `GET /api/vendors`, `GET /api/products`: Public data fetching.
    *   `POST /api/vendors`: Vendor onboarding (updates `profiles` role).
    *   `POST /api/products`, `PATCH /api/products/:id`: Inventory management.
    *   `POST /api/orders`: Order creation. Emits `orderCreated` via Socket.io to specific `vendor_${id}` rooms.
    *   `PATCH /api/orders/:orderId/status`: Status updates, broadcasting to both user and vendor rooms.
    *   `GET /api/products/search`: Implements full-text search using Supabase `.ilike()`.
    *   `Wholesale APIs`: Complete CRUD for bulk ordering (`wholesale_products`, `wholesale_inquiries`).

---

### 4. Backend Implementation #2: Advanced Node/Express Services (`packages/backend/`)
*   **Core Role:** Advanced backend handling raw PostgreSQL (PostGIS), Redis caching, rate-limiting, and complex algorithmic dispatching.
*   **`server.js`**: Initializes Express, Socket.io, Postgres `Pool`, and Redis client. Applies `helmet` security and custom IP blocking middleware.
*   **Middleware (`middleware/security.js`)**: Implements strict `express-rate-limit` for OTPs (10/15min), Search (60/min), and Orders (10/min).
*   **Routes (`routes/orders.js`)**: 
    *   Handles order creation and sets a 60-second auto-reject timeout if the shop doesn't accept.
    *   Implements the **Triple-Layer Verification Endpoint** (Merchant Handoff OTP, Customer Dropoff OTP, Geofencing).
*   **Routes (`routes/search.js`)**: 
    *   Queries PostGIS (`ST_Distance`, `ST_DWithin`) to find shops within a specific radius.
    *   Passes results through the custom `calculateShopScore` algorithm.
*   **Services (`services/payments.js`)**: Integrates Razorpay order creation and HMAC SHA256 signature verification.
*   **Services (`services/loyalty.js`)**: Calculates order streaks and awards loyalty points via SQL queries.

---

### 5. Database Schemas

#### Prisma Schema (`apps/frontend/prisma/schema.prisma`)
Used for type-safe ORM access on the frontend/Next.js API side.
*   **Models:** `Merchant`, `Product`, `SalesLog`, `Profit`, `Order`, `ReturnRequest`, `Customer`.
*   **Relations:** Customers to Orders, Merchants to Products/Orders.

#### Raw SQL Schema (`packages/database/schema.sql`)
Used for advanced backend operations requiring PostGIS and JSONB.
*   **`users`**: Central auth table (roles: customer, shopkeeper, delivery, admin). Tracks streaks and loyalty points.
*   **`shops`**: Uses `GEOMETRY(POINT, 4326)` for PostGIS location tracking.
*   **`products` & `inventory`**: Junction tables mapping products to shops with specific quantities and prices.
*   **`orders`**: Stores items as `JSONB`, tracks multi-party verification booleans (`shop_verified`, `delivery_verified`), and financial breakdowns.
*   **`loyalty_ledger`, `referrals`, `refunds`, `offers`**: Supporting business logic tables.

---

## 🧠 Algorithmic Conditions & Core Logic Details

All primary business logic algorithms reside in `utils/algorithms.js` and `packages/backend/services/`. Here is exactly how they work:

### 1. Distance Calculation (`haversineDistance`)
*   **Formula:** Standard Haversine formula calculating the great-circle distance between two points on a sphere given their longitudes and latitudes.
*   **Usage:** Determines real-time distance between Customer ↔ Shop, and Rider ↔ Shop.

### 2. Dynamic Shop Ranking (`calculateShopScore`)
When a user searches for a product, shops are ranked based on a composite score:
*   **Distance (35%):** `Math.max(0, 10 - dist * 2)`. Closer is better.
*   **Price (20%):** `Math.max(0, 10 - (price / 20))`. Cheaper is better.
*   **Stock (20%):** >10 items = 10 pts, >0 items = 5 pts, 0 items = 0 pts.
*   **Rating (15%):** `shop.rating * 2`.
*   **Extra Stock Bonus (5%):** +3 points if marked as high volume.
*   **Open Status (5%):** +5 points if open, **-99 points penalty** if closed (determined by `isShopOpen` comparing current time to `hours_open`/`hours_close`).

### 3. Dynamic Delivery Fee Engine (`calculateDelivery`)
Calculates the cost breakdown before checkout:
*   **Base Variables:** Base Fee = ₹15, Per KM = ₹8, Platform Fee = 5% of order value.
*   **Peak Hours Condition:** If time is 08:00-10:00 OR 18:00-21:00, a multiplier of `1.3x` is applied.
*   **Warning Condition:** If distance > 3km, it flags `is_far_warning = true` and generates a warning message showing how much the user could save by choosing a closer shop.

### 4. Surge Pricing Engine (`getSurgeMultiplier`)
Used to adjust rider payouts and customer fees dynamically:
*   **Time Conditions:** 
    *   Morning/Evening Rush: `1.3x`
    *   Late Night (23:00 - 06:00): `1.5x`
    *   Weekends (Sat/Sun): Applies an additional `1.1x` multiplier.
*   **Demand/Supply Ratio Condition:** Queries Redis for active orders vs. active drivers in an area.
    *   Ratio > 3.0 (High Demand): Applies `1.4x` multiplier.`
    *   Ratio > 1.5 (Busy): Applies `1.1x` multiplier.
*   **Cap:** Hard cap at `2.5x` maximum surge.

### 5. Hyperlocal Dispatch Engine (`dispatcher.js`)
Instead of pinging the single closest rider, it uses a **Weighted Cost Function** to find the optimal driver:
1.  **Query:** Finds all 'IDLE' riders within 3km of the shop via PostGIS.
2.  **Evaluate:** For each rider, calculates:
    *   `Distance Score` (Weight 1.5)
    *   `ETA Score` (Weight 2.0 - Prioritizes direction of travel)
    *   `Idle Time` (Weight 0.5 - Subtracts minutes idle to prioritize drivers waiting longer).
3.  **Condition:** `matchScore = (Distance * 1.5) + (ETA * 2.0) - (IdleTime * 0.5)`.
4.  **Action:** The rider with the *lowest* `matchScore` is assigned. Updates DB to `EN_ROUTE_SHOP` and emits WebSocket event to that specific driver.

### 6. Triple-Layer Anti-Scam Protocol (`routes/orders.js`)
Ensures inventory is not stolen and customers receive their items:
1.  **Merchant Handoff:** Driver scans Merchant's app QR/OTP. Changes status to `picked_up`, sets `delivery_verified = true`.
2.  **Geofencing (Commented/Mocked):** Validates driver GPS is within 50 meters of Customer GPS.
3.  **Customer Dropoff:** Driver inputs OTP provided by Customer. Changes status to `delivered`, sets `customer_verified = true`.

### 7. Security & IP Blocking (`server.js`)
*   **Condition:** If an IP hits endpoints > 200 times within 60 seconds (tracked via Redis `ip_req:{ip}`), the IP is added to `blocked_ip:{ip}` with a 1-hour expiration. All subsequent requests return `429 Rate limit exceeded` or `403 Access denied`.

---

<p align="center">
  <em>"Shop Local. Support Local. Delivered in 15 minutes."</em>
</p>

<p align="center">
  <sub>© 2026 Casano (HyperlocalOS). All rights reserved.</sub>
</p>
