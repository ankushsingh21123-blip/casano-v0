# CASANO

India's first three-sided hyperlocal marketplace — connecting Users, Vendors, and Wholesalers in the same neighbourhood.

## Setup

```bash
cd apps/casano
npm install
cp .env.example .env.local
# Fill in your Supabase credentials in .env.local
npm run dev
```

## Environment Variables

```
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## Supabase Setup

1. Create a new Supabase project
2. Run `supabase-schema.sql` in the SQL Editor
3. Enable Phone auth in Authentication → Providers
4. Create a storage bucket named `product-images` (set to public)
5. Add the storage policies from the bottom of `supabase-schema.sql`

## Routes

| Path | Portal |
|------|--------|
| `/` | Landing page |
| `/user` | User / Consumer app |
| `/vendor` | Vendor / Shop owner dashboard |
| `/wholesale` | Wholesaler B2B dashboard |

## Deploy

Works out of the box on Vercel or Netlify. Set the two env vars in your deployment settings.
