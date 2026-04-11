---
description: How to set up and run the CASANO app locally
---
// turbo-all

## Prerequisites
- Node.js v18+
- A Supabase project with the schema applied

## Setup

1. Navigate to the CASANO app directory:
```bash
cd apps/casano
```

2. Install dependencies:
```bash
npm install
```

3. Create the `.env.local` file with your Supabase credentials:
```bash
echo "VITE_SUPABASE_URL=https://YOUR_PROJECT.supabase.co" > .env.local
echo "VITE_SUPABASE_ANON_KEY=YOUR_ANON_KEY" >> .env.local
```

4. Apply the database schema (if not already done). Go to your Supabase dashboard → SQL Editor, and paste the contents of `supabase-schema.sql`.

5. Start the dev server:
```bash
npm run dev
```

6. Open the app at `http://localhost:5173`

## Build for Production
```bash
npm run build
```

## Deploy to Netlify
1. Set build command: `npm run build`
2. Set publish directory: `dist`
3. Set environment variables: `VITE_SUPABASE_URL` and `VITE_SUPABASE_ANON_KEY`

## Project Structure
```
apps/casano/
├── src/
│   ├── components/     # Reusable UI components
│   ├── context/        # AuthContext, CartContext
│   ├── lib/            # Supabase client
│   ├── pages/
│   │   ├── user/       # User portal (home, search, cart, orders, profile)
│   │   ├── vendor/     # Vendor portal (dashboard, products, orders, settings)
│   │   └── wholesale/  # Wholesaler portal (dashboard, products, inquiries, profile)
│   ├── App.jsx         # Routes
│   ├── main.jsx        # Entry point
│   └── index.css       # Design system
├── supabase-schema.sql # Database schema + RLS policies
└── index.html          # HTML with SEO meta tags
```
