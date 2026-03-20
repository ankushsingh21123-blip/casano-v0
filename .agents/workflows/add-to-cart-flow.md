---
description: Add-to-cart flow, checkout, and account on Casano.in
---

# Add-to-Cart & Checkout Workflow

## Overview

This workflow documents how the add-to-cart, checkout, and account flows work on Casano.in — both desktop and mobile.

## Desktop Flow

1. User lands on home page (`/`)
2. User sees **CategoryGrid** (3 categories) and **CategorySlider** (5 categories)
3. User clicks a category card → navigates to `/category/[name]`
4. Category page shows `ProductCard` grid

### Adding to Cart (ProductCard)
5. User clicks **ADD** on a `ProductCard`
6. `ProductCard` calls `CartContext.addItem(item)` (global state)
7. Button transforms into **− qty +** stepper
8. Header cart button instantly updates: `N items · ₹XXX`

### Viewing Cart (CartPanel)
9. User clicks cart button → `CartPanel` slides in from right
10. Shows: delivery badge, item list, bill details, donation checkbox, tip options
11. If **not logged in**: "Login to Proceed" button → opens `LoginModal`
12. `LoginModal` has 3 steps:
    - Step 1: Enter 10-digit phone → Continue
    - Step 2: Enter 4-digit OTP → Verify & Continue
    - Step 3: Enter Name + Delivery Address → Save & Get Started
    - After step 3: `AuthContext.login()` + `setProfile()` called → modal closes
13. If **logged in**: "Proceed to Pay" → navigates to `/checkout`

## Mobile Flow (< 1024px)

Mobile uses `OldMobileHome.tsx` (a self-contained screen manager).

1. Bottom nav: **Home | Categories | Orders | Account**
2. Home screen shows:
   - Promo banner
   - Category grid (8 categories with real images)
   - Popular Items horizontal scroll (product cards)
3. Tap **ADD** on product → connects to global `CartContext`
4. When cart has items → **floating green cart strip** appears above nav bar
5. Tap strip → **cart sheet** slides up from bottom
6. Cart sheet shows items + bill, with "Proceed to Pay" button
7. If not logged in → opens `LoginModal` (same 3-step flow)
8. After login → `checkout` screen opens within app

### Account Screen (mobile)
1. Tap **Account** in bottom nav → Profile screen slides up
2. If not logged in → shows Sign In button
3. If logged in → shows:
   - User name + phone + address
   - My Orders → order history list
   - Help & Support → FAQ screen
   - Log Out button

## Desktop Account Page (`/account`)

- Left sidebar shows user name + phone (from `AuthContext`)
- Nav: My Orders / Saved Addresses / Help & Support / Account Privacy
- **My Orders** (`/account/orders`): past orders with Reorder button
- **Help & Support** (`/account/support`): Call/Email/Chat options + FAQ accordion
