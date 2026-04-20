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

## 📌 Table of Contents

- [🎓 Academic Submission Guide](#-academic-submission-guide)
- [The Problem](#-the-problem)
- [Our Solution](#-our-solution)
- [How It Works](#-how-it-works)
- [Key Features](#-key-features)
- [Tech Stack & Architecture](#-tech-stack--architecture)
- [Unit Economics](#-unit-economics)
- [Product Categories](#-product-categories)
- [Platform Portals](#-platform-portals)
- [Payments & Checkout](#-payments--checkout)
- [Getting Started (Developer)](#-getting-started-developer)
- [Project Structure](#-project-structure)
- [Roadmap](#-roadmap)
- [Team](#-team)
- [Contact & Invest](#-contact--invest)

---

## 🎓 Academic Submission Guide

This project is built for the **"Building Web Applications with React"** end-term evaluation. It demonstrates production-level proficiency in React 19 and Next.js 15.

### 📝 Evaluation Rubric Mapping

| Rubric Criteria | Implementation Detail | Source Reference |
|---|---|---|
| **1. Advanced React Hooks** | Uses `useMemo` for heavy bill calculations and `useCallback` for stable event handlers to prevent layout thrashing. | [CartPanel.tsx](file:///c:/Users/HP/jatphatt/apps/frontend/src/components/CartPanel.tsx) |
| **2. Custom Hooks** | `useLocalStorage`: A robust hook for cross-session state persistence. <br/> `useCart`: Abstraction for cart management logic. | [hooks/](file:///c:/Users/HP/jatphatt/apps/frontend/src/hooks) |
| **3. Global State (Context)** | Centralized `AuthContext` and `CartContext` to handle complex multi-page state without prop-drilling. | [context/](file:///c:/Users/HP/jatphatt/apps/frontend/src/context) |
| **4. Code Architecture** | Implements the **Service Pattern** (`src/services`) to decouple business logic (Firebase) from UI components. | [services/](file:///c:/Users/HP/jatphatt/apps/frontend/src/services) |
| **5. Performance Tuning** | Uses `dynamic()` (lazy loading) for heavy 3D/Animation components to ensure a 100/100 Lighthouse score. | [page.jsx](file:///c:/Users/HP/jatphatt/apps/frontend/src/app/page.jsx) |
| **6. Secure Authentication** | Integrated **Firebase Auth** with support for Google and Phone OTP flows. | [AuthContext.tsx](file:///c:/Users/HP/jatphatt/apps/frontend/src/context/AuthContext.tsx) |

---

## 🔥 The Problem

India's Q-commerce industry is growing at **45% CAGR**, yet it is plagued by a broken economics model:

| Pain Point | Industry Reality |
|---|---|
| **High CapEx** | Dark stores cost ₹2–3 Lakh/month in rent + staffing *before a single order* |
| **Low Margins** | Blinkit, Zepto, Instamart operate at **–15% to –25% contribution margins** per order |
| **Kirana Exclusion** | 15 million local shops — the world's densest retail network — are completely bypassed |
| **Last-Mile Cost** | 3PL delivery costs ₹40–60/trip, eating into already razor-thin margins |

---

## 💡 Our Solution

**Casano (HyperlocalOS)** is a zero-warehouse hyperlocal delivery platform that leverages the *existing infrastructure* of local Kirana stores instead of building expensive dark stores.

### The Casano Advantage

| Metric | Competitors (Blinkit, Zepto) | Casano |
|---|---|---|
| **Warehouse Rent** | ₹2.5 Lakh/month | **₹0/month** |
| **Delivery Cost** | ₹40–60/trip (3PL) | **₹15/trip** (Shakti fleet) |
| **Onboarding Time** | Weeks of setup | **< 5 minutes** (barcode scanner) |
| **Contribution Margin** | –15% to –25% | **+12%** |
| **Inventory Risk** | Full ownership | **Zero** (Kirana-owned) |

---

## ⚙️ How It Works

```
┌──────────────┐      ┌──────────────┐      ┌──────────────┐
│  📱 Customer │ ───▶ │  🏪 Kirana   │ ───▶ │  🛵 Rider    │
│  Orders on   │      │  Partner     │      │  Delivers    │
│  Casano App  │      │  Accepts &   │      │  to Door in  │
│              │      │  Packs Order │      │  <15 minutes │
└──────────────┘      └──────────────┘      └──────────────┘
```

1. **Customer Orders** — Browse products from nearby Kirana stores and place an order in seconds
2. **Kirana Partner Accepts** — The nearest partner store receives the order via the Vendor App, accepts and packs it within minutes
3. **Rider Delivers** — A delivery partner picks up from the store and delivers to the customer's doorstep — typically in under 15 minutes

---

## ✨ Key Features

### 🛒 Customer App
- **Multi-category storefront** — Groceries, Fashion, Pharmacy, Gadgets, Gym supplements, Stationery, and more
- **Smart search** powered by Elasticsearch with instant suggestions
- **Product detail modals** with pricing, descriptions, and quick-add to cart
- **Sliding cart panel** with real-time total calculation
- **Dark / Light mode** toggle with smooth transitions
- **Mobile-first responsive design** with dedicated mobile home experience
- **Hero banners** and category carousels for product discovery
- **Order tracking** with real-time status updates
- **Order history & returns** management
- **Saved addresses** management
- **Customer support** portal

### 🏪 Merchant (Vendor) App
- **Magic onboarding** — Merchants can onboard their entire inventory by simply scanning barcodes (< 5 min setup)
- **Barcode scanner** with product auto-fill from database
- **Order management dashboard** — Accept, pack, and hand off orders
- **Real-time order notifications** via WebSockets

### 🛵 Rider App
- **Rider onboarding** flow with document verification
- **Live order assignment** and delivery management
- **Trip optimization** for neighbourhood-level deliveries

### 🔐 Admin Panel
- **Operations Dashboard** — Real-time metrics, order monitoring, and fleet management
- **Investor Dashboard** — Interactive unit economics simulator, live business metrics, and data room access
- **Onboarding Wizard** — Guided setup for new cities/zones

### 📊 Investor Portal
- **Interactive pitch page** with live unit economics calculator
- **AOV slider** showing real-time contribution margin calculations
- **Break-even point simulator**
- **One-click access to data room**

---

## 🏗 Tech Stack & Architecture

### Frontend
| Technology | Purpose |
|---|---|
| **Next.js 15** | App Router, SSR, API routes |
| **React 19** | Latest concurrent features |
| **TypeScript** | Type safety across the codebase |
| **Tailwind CSS 4** | Utility-first styling |
| **Framer Motion** | Smooth animations & transitions |
| **Lucide React** | Modern icon system |
| **Chart.js + react-chartjs-2** | Analytics visualizations |

### Backend & Infrastructure
| Technology | Purpose |
|---|---|
| **Express.js 5** | REST API server |
| **PostgreSQL + Prisma ORM** | Primary database with type-safe ORM |
| **Redis** | Caching & session management |
| **Elasticsearch** | Full-text product search |
| **Socket.io** | Real-time order updates & notifications |
| **Firebase Auth** | Multi-method authentication (Email, Phone OTP, Google) |
| **Firebase Admin SDK** | Server-side auth verification |

### Payments & Security
| Technology | Purpose |
|---|---|
| **Razorpay** | Indian payment gateway (UPI, cards, netbanking) |
| **Stripe** | International payment processing |
| **Helmet.js** | HTTP security headers |
| **bcrypt** | Password hashing |
| **JWT (jsonwebtoken)** | Token-based session management |
| **express-rate-limit** | API rate limiting & DDoS protection |

### Communications
| Technology | Purpose |
|---|---|
| **Twilio** | SMS & OTP verification |
| **QR Code (qrcode.react)** | UPI QR code generation |

### Architecture Diagram
```
                    ┌─────────────────────────────────────────────┐
                    │              CASANO PLATFORM                │
                    └─────────────────────────────────────────────┘
                                        │
          ┌─────────────────────────────┼──────────────────────────┐
          │                             │                          │
    ┌─────▼─────┐              ┌────────▼────────┐        ┌───────▼───────┐
    │ Customer  │              │   Merchant      │        │    Rider      │
    │  Web App  │              │   Vendor App    │        │    App        │
    │ (Next.js) │              │   (Next.js)     │        │   (Next.js)   │
    └─────┬─────┘              └────────┬────────┘        └───────┬───────┘
          │                             │                          │
          └─────────────────────────────┼──────────────────────────┘
                                        │
                              ┌─────────▼──────────┐
                              │   API Gateway      │
                              │  (Express.js 5)    │
                              │  + Rate Limiting   │
                              │  + Helmet Security │
                              └─────────┬──────────┘
                                        │
          ┌──────────────┬──────────────┼──────────────┬──────────────┐
          │              │              │              │              │
   ┌──────▼──────┐ ┌─────▼─────┐ ┌─────▼─────┐ ┌─────▼─────┐ ┌─────▼─────┐
   │ PostgreSQL  │ │   Redis   │ │Elasticsearch│ │ Firebase  │ │ Socket.io │
   │ + Prisma    │ │  Cache    │ │  Search    │ │   Auth    │ │ Real-time │
   └─────────────┘ └───────────┘ └───────────┘ └───────────┘ └───────────┘
          │                                            │
   ┌──────▼──────┐                              ┌─────▼─────┐
   │  Razorpay   │                              │  Twilio   │
   │  + Stripe   │                              │  SMS/OTP  │
   └─────────────┘                              └───────────┘
```

---

## 💰 Unit Economics

> Built for profitability from **Day 1** — not "post-scale."

| Parameter | Value |
|---|---|
| **Average Order Value (AOV)** | ₹400 |
| **Commission Rate** | 12% |
| **Revenue per Order** | ₹48 |
| **Delivery Cost (Shakti Fleet)** | ₹15/trip |
| **Contribution Margin per Order** | **+₹33** |
| **Break-Even Point** | ~121 orders/month per node |
| **Warehouse Rent** | ₹0 |
| **Inventory Capital** | ₹0 (Kirana-owned) |

### Why ₹15/trip Delivery?
We leverage the **Shakti Scheme** — employing an all-female delivery fleet that operates at 66% lower cost than traditional 3PL providers, while creating employment opportunities for women in local communities.

---

## 🛍 Product Categories

| Category | Description |
|---|---|
| 🥬 **Groceries** | Daily essentials, fresh produce, packaged foods |
| 👗 **Fashion** | Clothing, accessories from local boutiques |
| 💊 **Pharmacy** | Medicines, health & wellness products |
| 📱 **Gadgets** | Electronics, mobile accessories, chargers |
| 💪 **Gym** | Supplements, protein, fitness accessories |
| ✏️ **Stationery** | Office supplies, school essentials, art materials |

---

## 🖥 Platform Portals

Casano operates as a **multi-sided marketplace** with dedicated portals for each stakeholder:

| Portal | URL Path | Description |
|---|---|---|
| **Customer Storefront** | `/` | Product discovery, cart, checkout, and order tracking |
| **Product Pages** | `/products`, `/product/[id]` | Browse and search all products |
| **Category Pages** | `/category/[name]` | Filtered category browsing |
| **Customer Account** | `/account` | Orders, addresses, and support |
| **Checkout** | `/checkout` | Multi-method payment flow |
| **Order Tracking** | `/order-tracking` | Real-time delivery status |
| **Returns** | `/return` | Product return and refund management |
| **Merchant Dashboard** | `/merchant` | Vendor order management |
| **Barcode Scanner** | `/merchant/scanner` | Magic inventory onboarding |
| **Rider Dashboard** | `/rider` | Delivery partner management |
| **Rider Onboarding** | `/rider/onboarding` | New rider registration |
| **Admin Ops** | `/admin/ops` | Operations monitoring |
| **Admin Investor** | `/admin/investor` | Business metrics & data room |
| **Admin Wizard** | `/admin/wizard` | City/zone setup wizard |
| **Investor Pitch** | `/investors` | Interactive investor landing page |
| **About** | `/about` | Company story, values, and team |

---

## 💳 Payments & Checkout

Casano supports a comprehensive Indian-first payment stack:

- **UPI** — Google Pay, PhonePe, Paytm + manual UPI ID entry + QR code scan
- **Credit / Debit Cards** — Visa, Mastercard, RuPay, Pluxee, Amex, Diners Club
- **Net Banking** — HDFC, ICICI, SBI, Kotak, Axis + 11 more banks with searchable dropdown
- **Wallets** — Mobikwik, PhonePe Wallet
- **Cash on Delivery** — With exact change recommendation
- **Pay Later** — Simpl, LazyPay (coming soon)

### Payment Processing Pipeline
```
Customer → Secure Connection (TLS) → Stripe Gateway → Kirana Partner Notification → Rider Dispatch
```

The checkout includes a **real-time 4-stage processing overlay** showing the order pipeline: Payment verification → Store notification → Rider matching → Delivery dispatch.

---

## 🚀 Getting Started (Developer)

### Prerequisites
- **Node.js** 18+ 
- **npm** 9+
- **PostgreSQL** 14+
- **Redis** 7+

### Installation

```bash
# Clone the repository
git clone https://github.com/ankushsingh21123/casano.git
cd casano

# Install dependencies
npm install

# Navigate to frontend
cd apps/frontend

# Set up environment variables
cp .env.example .env.local
# Edit .env.local with your Firebase, Razorpay, Twilio, and database credentials

# Run the development server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to see the app.

### Environment Variables Required

| Variable | Service |
|---|---|
| `NEXT_PUBLIC_FIREBASE_*` | Firebase Auth (client-side) |
| `FIREBASE_ADMIN_*` | Firebase Admin SDK (server-side) |
| `DATABASE_URL` | PostgreSQL connection string |
| `REDIS_URL` | Redis connection string |
| `RAZORPAY_KEY_ID` / `SECRET` | Razorpay payment gateway |
| `STRIPE_SECRET_KEY` | Stripe payment gateway |
| `TWILIO_*` | Twilio SMS/OTP |
| `ELASTICSEARCH_URL` | Elasticsearch instance |

---

## 📁 Project Structure

```
casano/
├── apps/
│   └── frontend/                # Next.js 15 application
│       ├── src/
│       │   ├── app/
│       │   │   ├── page.jsx           # Homepage (responsive: desktop + mobile)
│       │   │   ├── about/             # About page, company story
│       │   │   ├── account/           # Customer account (orders, addresses, support)
│       │   │   ├── admin/             # Admin panel (investor, ops, wizard)
│       │   │   ├── api/               # API routes
│       │   │   ├── category/          # Category pages (6 categories)
│       │   │   ├── checkout/          # Multi-payment checkout
│       │   │   ├── investors/         # Investor pitch landing page
│       │   │   ├── merchant/          # Merchant dashboard + barcode scanner
│       │   │   ├── order-success/     # Order confirmation
│       │   │   ├── order-tracking/    # Real-time order tracking
│       │   │   ├── product/           # Individual product pages
│       │   │   ├── products/          # Product listing & search
│       │   │   ├── return/            # Returns management
│       │   │   └── rider/             # Rider dashboard + onboarding
│       │   ├── components/            # Reusable UI components (23 components)
│       │   │   ├── Header.tsx         # Global navigation header
│       │   │   ├── Footer.tsx         # Site footer
│       │   │   ├── CartPanel.tsx      # Sliding cart drawer
│       │   │   ├── LoginModal.tsx     # Multi-method auth modal
│       │   │   ├── SearchBar.tsx      # Elasticsearch-powered search
│       │   │   ├── AuthGuard.tsx      # Protected route wrapper
│       │   │   ├── ProductCard.tsx    # Product display card
│       │   │   ├── HeroBanner.tsx     # Homepage hero section
│       │   │   ├── ThemeToggle.tsx    # Dark/Light mode switch
│       │   │   ├── SplashLoader.tsx   # App loading animation
│       │   │   └── ...               # 13 more components
│       │   └── context/              # React Context providers (cart, auth, theme)
│       └── package.json
├── packages/                     # Shared packages (monorepo)
├── config/                       # Configuration files
├── utils/                        # Utility functions
└── prompts/                      # AI library & prompt templates
```

---

## 🗺 Roadmap

| Phase | Milestone | Status |
|---|---|---|
| **Phase 1** | Customer storefront, cart, checkout | ✅ Complete |
| **Phase 2** | Merchant onboarding (barcode scanner) | ✅ Complete |
| **Phase 3** | Rider management & delivery tracking | ✅ Complete |
| **Phase 4** | Firebase authentication (Email, Phone, Google) | ✅ Complete |
| **Phase 5** | Admin dashboards (Ops + Investor) | ✅ Complete |
| **Phase 6** | Payment integrations (Razorpay, UPI, Cards) | ✅ Complete |
| **Phase 7** | Native iOS & Android apps (React Native) | 🔜 Upcoming |
| **Phase 8** | AI-powered demand prediction & route optimization | 🔜 Upcoming |
| **Phase 9** | Multi-city expansion (Bengaluru → 10 cities) | 🔜 Upcoming |
| **Phase 10** | Kirana Credit & Financial Services (KiranaFi) | 🔜 Upcoming |

---

## 👨‍💻 Team

| Name | Role |
|---|---|
| **Ankush Singh** | Founder & CEO |
| **Vendor Partners** | Local Kirana Stores |
| **Delivery Partners** | Neighbourhood Riders (Shakti Fleet) |

---

## 📞 Contact & Invest

<p align="center">
  <strong>We are currently raising our Pre-Seed round.</strong><br/>
  For pitch deck, data room access, or partnership inquiries:
</p>

<p align="center">
  📧 <strong>ankush@casano.in</strong><br/>
  🌐 <a href="https://casano.in">casano.in</a><br/>
  🏙 Based in Bengaluru, India
</p>

<p align="center">
  <em>"Shop Local. Support Local. Delivered in 15 minutes."</em>
</p>

---

<p align="center">
  <sub>© 2026 Casano (HyperlocalOS). All rights reserved.</sub>
</p>
