<div align="center">
  <h1>🚀 Casano</h1>
  <p><strong>The Next-Generation Quick-Commerce & Premium Groceries Platform for India</strong></p>
</div>

---

## 1. PROJECT OVERVIEW

**Casano** is a decentralized, hyper-local quick-commerce web platform. It bridges the gap between premium daily essentials and local merchants. Unlike traditional quick-commerce apps that rely on expensive dark stores, Casano empowers local stores ("Dunkandars") to digitize their inventory and provide lightning-fast deliveries to nearby consumers. 

**App Name:** Casano  
**Purpose:** Provide a blazing-fast grocery/essentials delivery platform directly integrating local merchants under 15-minute delivery SLAs.  

**Target Users:**
- **Customers / Consumers:** People looking to buy premium groceries or everyday items quickly.
- **Merchants (Dunkandars):** Local store owners who manage their digital inventory and accept orders.
- **Delivery Partners (Riders):** The network of riders who pick up and deliver the items.
- **Admins:** Platform operators who oversee operations, support, and platform fees.

---

## 2. FULL PROJECT STRUCTURE

The project is structured as a monorepo containing both the frontend (Next.js) and the backend (Node.js/Express). 

```text
jatphatt/
├── apps/
│   └── frontend/              # The main Next.js App (Customer & Merchant portals)
│       ├── .next/             # Next.js build output (auto-generated)
│       ├── prisma/            # Database ORM schema and migrations
│       │   └── schema.prisma  # Database models definition
│       ├── public/            # Static assets (images, icons)
│       ├── src/
│       │   ├── app/           # Next.js App Router pages (routing)
│       │   ├── components/    # Reusable UI components (Hero, Cart, ProductCard)
│       │   ├── context/       # React Context providers (State management)
│       │   ├── hooks/         # Custom React hooks
│       │   ├── lib/           # Utility functions and library wrappers (e.g., Supabase client)
│       │   └── services/      # API communication layers
│       ├── next.config.ts     # Next.js configuration
│       ├── package.json       # Frontend dependencies and scripts
│       └── .env.local         # Frontend environment variables
├── backend/                   # Custom Node.js Express backend
│   ├── node_modules/          # Backend dependencies
│   ├── server.js              # Main Express server entry point (API logic)
│   ├── package.json           # Backend dependencies and scripts
│   └── .env.example           # Example environment variables for backend
├── dev.db                     # Local SQLite database file for development
├── package.json               # Root monorepo package.json
└── README.md                  # This documentation file
```

---

## 3. TECH STACK

**Frontend:**
- **Framework:** Next.js 16 (App Router) & React 19
- **Styling:** Tailwind CSS (v4), Framer Motion, GSAP (for micro-animations and smooth UI)
- **UI Components:** Shadcn UI, Radix UI, Lucide React

**Backend:**
- **Core:** Node.js, Express (hosted independently)
- **Realtime:** Socket.io (for live rider tracking and order updates)

**Database:**
- **ORM:** Prisma (v5)
- **Database Engine:** 
  - *Local Development:* SQLite (`dev.db`)
  - *Production:* PostgreSQL (Neon Serverless Postgres)
- **Authentication:** Supabase & Firebase Admin SDK (used for OTP, Auth, and Storage)

**Hosting / Deployment:**
- **Frontend Hosting:** Vercel (Auto-deploys via GitHub)
- **Backend Hosting:** Railway (`casano-backend.up.railway.app`)

**Third-Party APIs / Services:**
- **Razorpay:** Payment gateway integrations
- **Twilio:** SMS / OTP services
- **ElasticSearch & Redis:** High-speed caching and product search
- **Anthropic AI:** Used for predictive inventory analysis
- **MapLibre-GL:** Maps and location services

---

## 4. DATABASE STRUCTURE

The database is managed via **Prisma** (see `apps/frontend/prisma/schema.prisma`). 

### Tables (Models)

1. **Merchant (Dunkandars)**
   - `id` (String): Unique identifier
   - `name` (String): Store name
   - `latitude` / `longitude` (Float): Store coordinates
   - `platform_fee_percent` (Float): Commission rate
   - *Relationships:* Has many Products, SalesLogs, Profits, Orders.

2. **Product**
   - `id` (String): Unique identifier
   - `merchant_id` (String): Links to Merchant
   - `name` (String): Product name
   - `category` (String): Item category (e.g., Daily Essentials)
   - `selling_price` / `cost_price` (Float): Financials
   - `total_stock` / `app_reserved_stock` / `safety_buffer` (Int): Inventory counts
   - `is_live` (Boolean): Whether the product is visible on the app
   - *Relationships:* Belongs to Merchant, Has many SalesLogs.

3. **SalesLog**
   - `id` (String): Unique identifier
   - `product_id` (String): Links to Product
   - `merchant_id` (String): Links to Merchant
   - `sale_type` (String): "Walk-in" vs "App"
   - `quantity` (Int): Number of items sold
   - `created_at` (DateTime): Timestamp

4. **Profit**
   - `id` (String): Unique identifier
   - `merchant_id` (String): Links to Merchant
   - `date` (DateTime): Date of record
   - `net_margin` (Float): Calculated daily profit

5. **Customer**
   - `id` (String): Unique identifier
   - `name` (String): Customer name
   - `phone` (String): Phone number (Unique)
   - `trust_score` (Int): Behavior score (default 100)
   - `cod_blocked` (Boolean): Flag to prevent Cash on Delivery
   - *Relationships:* Has many Orders.

6. **Order**
   - `id` (String): Unique identifier
   - `merchant_id` (String): Links to Merchant
   - `customer_id` (String): Links to Customer
   - `status` (String): E.g., "Pending", "Picked Up", "Delivered", "Cancelled"
   - `pickup_otp` (String?): Verification code for riders
   - `rider_photo_url` (String?): Proof of delivery/pickup
   - `created_at` (DateTime): Timestamp
   - *Relationships:* Has many ReturnRequests.

7. **ReturnRequest**
   - `id` (String): Unique identifier
   - `order_id` (String): Links to Order
   - `reason` (String): Why it's being returned
   - `photo_url` (String?): Image proof
   - `status` (String): E.g., "Pending Verification", "Approved"
   - `created_at` (DateTime): Timestamp

---

## 5. ENVIRONMENT VARIABLES

The project relies on `.env.local` (in `apps/frontend`) and `.env` (in `backend`). 

### Frontend (`apps/frontend/.env.local`)
| Variable | Purpose | Where to get it |
|----------|---------|-----------------|
| `NEXT_PUBLIC_BACKEND_URL` | Connects frontend to Express backend | Use `http://localhost:8080` locally, or Railway URL in prod |
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase project URL | Supabase Dashboard > Settings > API |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Public Supabase Key | Supabase Dashboard > Settings > API |
| `NEXT_PUBLIC_FIREBASE_API_KEY` | Firebase Web API Key | Firebase Console > Project Settings |
| `NEXT_PUBLIC_FIREBASE_PROJECT_ID` | Firebase Project ID | Firebase Console > Project Settings |
| `NEXT_PUBLIC_FIREBASE_STORAGE_BUCKET` | Image storage bucket | Firebase Console > Storage |
| `NEXT_PUBLIC_RAZORPAY_KEY_ID` | Razorpay public key for payments | Razorpay Dashboard > Settings > API Keys |
| `SQLITE_DATABASE_URL` | Path to local database file | Typically `"file:../../dev.db"` |

### Backend (`backend/.env`)
| Variable | Purpose | Where to get it |
|----------|---------|-----------------|
| `PORT` | Server port (e.g. 8080) | Pick locally, provided by host in prod |
| `FRONTEND_URL` | Allowed CORS origin | `http://localhost:3005` or live URL |
| `SUPABASE_SERVICE_ROLE_KEY` | Admin bypass key for Supabase DB | Supabase Dashboard > Settings > API |
| `FIREBASE_ADMIN_SDK_JSON` | Firebase Admin credentials | Firebase Console > Service Accounts |
| `RAZORPAY_KEY_SECRET` | Secret key to verify payments | Razorpay Dashboard > API Keys |
| `JWT_SECRET` | Signing token for auth sessions | Generate a random 32+ char string |

---

## 6. HOW TO RUN LOCALLY

Follow these exact steps to run the project on a new machine:

1. **Clone the repository:**
   ```bash
   git clone <your-repo-url>
   cd jatphatt
   ```

2. **Install all dependencies:**
   ```bash
   # In the root folder, which will install for all workspaces
   npm install
   
   # Also ensure backend dependencies are installed
   cd backend
   npm install
   cd ..
   ```

3. **Set up Environment Variables:**
   - Go to `apps/frontend` and create `.env.local` by copying the structure from `.env.example`.
   - Go to `backend` and create `.env` by copying the structure from `.env.example`.
   - Fill in your Supabase and Firebase keys in both files.

4. **Initialize the Database:**
   ```bash
   cd apps/frontend
   npx prisma generate
   npx prisma db push
   ```

5. **Run the Application:**
   Open two terminals.
   
   *Terminal 1 (Backend):*
   ```bash
   cd backend
   npm start
   ```

   *Terminal 2 (Frontend):*
   ```bash
   # From the root folder
   npm run dev
   # The frontend will run on http://localhost:3005
   ```

---

## 7. HOW DEPLOYMENT WORKS

- **Frontend (Vercel):** The Next.js frontend is connected to GitHub via Vercel. Whenever you push code to the `main` branch, Vercel automatically detects the Next.js app in the `apps/frontend` directory and triggers a new build.
- **Backend (Railway):** The Node.js Express server is hosted on Railway. It is also connected to the GitHub repository and redeploys automatically upon new commits.
- **Database:** Prisma connects directly to the hosted Postgres database (Neon) via the environment variables configured in Vercel.

**To deploy new changes:** Simply run `git add .`, `git commit -m "update"`, and `git push`. Both Vercel and Railway will automatically pull the code and deploy.

---

## 8. HOW TO ADD NEW DATA (stores, users, products)

### Adding a New Store (Merchant/Dunkandar)
1. **Via UI:** Navigate to the `/merchant` or `/dunkandar` route in the frontend and use the onboarding flow.
2. **Via Database (Manual):**
   - Go to your **Supabase Dashboard** > **Table Editor**.
   - Select the `Merchant` table.
   - Click **Insert Row**, fill out the store name, latitude, longitude, and platform fee, then save.

### Adding Products & Linking Photos
1. **Via UI:** Log in as a merchant, go to the Merchant Dashboard, and click "Add Product".
2. **Uploading a Photo:** Photos are uploaded to **Firebase Storage**. 
   - Go to Firebase Console > Storage.
   - Upload the image and copy the "Download URL".
   - (Note: if `photo_url` is added to your Prisma `Product` schema in the future, paste it there. Otherwise, ensure frontend logic points to it).
3. **Linking in DB:** Go to the Supabase Table Editor > `Product` table > Insert Row. Provide the `merchant_id` (from the Merchant table) and fill out prices and stock.

---

## 9. ALL APP FLOWS

### A. Customer Flow
1. **Home/Discovery (`/`):** Users browse categories (LiquidHero, CategoryGrid) or search for products.
2. **Cart (`/checkout`):** Users add items to the cart. Stock is verified in real-time.
3. **Auth:** Users sign in via phone OTP (Firebase Auth).
4. **Payment & Order:** Customer pays via Razorpay/UPI. The `Order` is created in Prisma as "Pending".
5. **Tracking (`/order-tracking`):** User watches rider location via MapLibre & WebSockets.

### B. Merchant Flow (`/merchant` or `/dunkandar`)
1. **Dashboard:** Merchant logs in to see incoming pending orders.
2. **Fulfillment:** Merchant accepts the order and prepares the bag.
3. **Inventory Management:** Merchant updates stock, adds new products, and checks daily `Profit`.
4. **AI Prediction:** (If integrated) Merchant gets alerts to restock items based on Anthropic API analysis.

### C. Rider Flow (`/rider`)
1. **Dispatch:** Rider receives an alert for a nearby pending order.
2. **Pickup:** Rider goes to the merchant, provides the `pickup_otp`, and marks the order "Picked Up".
3. **Delivery:** Rider uses MapLibre routing to deliver to the customer and uploads a `rider_photo_url` as proof.

---

## 10. KNOWN ISSUES OR INCOMPLETE FEATURES

- **Product Photos:** The current Prisma schema for `Product` does not have an explicit `photo_url` column. This may need to be added via a Prisma migration.
- **Return Workflow:** The `ReturnRequest` model is defined, but the UI for verifying and processing refunds (Admin flow) might be partially incomplete.
- **Admin Flow:** There is an `/admin` route folder, but comprehensive super-admin features (platform-wide analytics, blocking merchants) are still in development.
- **Database Transition:** Local dev uses SQLite (`dev.db`), but Production requires PostgreSQL (Neon). Schema changes must consider compatibility between both.

---

## 11. IMPORTANT CREDENTIALS LOCATION

- **Database Credentials (Neon/Supabase):** Stored securely in Vercel's Environment Variables panel.
- **Firebase/Supabase Ownership:** Registered under the founder's Google/Email account (likely `ankushsingh21123`).
- **Payment Keys (Razorpay):** The Secret Key is **only** in the Railway Backend Environment Variables. The Public Key is in Vercel.
- **Vercel & Railway Access:** Owned by the GitHub account holder that created the repositories. Vercel tokens are cached locally in `.vercel/` for CLI usage.

*Do NOT commit your `.env.local` or backend `.env` files to GitHub.*
