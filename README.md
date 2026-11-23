# Cygnaconsult (cygna.com.ng)
Vite + React + Tailwind + React Router + Supabase.

## Structure
```
index.html  vite.config.js  tailwind.config.js  postcss.config.js  vercel.json  .env.example
supabase/schema.sql
src/main.jsx  src/App.jsx  src/index.css
src/lib/{supabase.js,data.js,store.jsx}
supabase/functions/verify-payment/index.ts
src/components/{Navbar,Footer,ProductCard,CarCard,PropertyCard,ServiceCard,Img,ChatBox,AdminCrud}.jsx
src/pages/{Home,Shop,Wishlist,Cart,Cars,RealEstate,Services,AITraining,About,Contact,SignIn,Search,Dashboard}.jsx
```
Without Supabase configured the app still runs on built-in sample data.

## 1. Supabase
1. Supabase > SQL Editor > paste and run `supabase/schema.sql`.
2. Project Settings > API: copy the Project URL and the publishable key.
3. Your project URL and publishable key are already set in `src/lib/supabase.js`. Never use a service_role key.
4. Authentication > Providers: enable Email and Google (add Google OAuth client ID/secret).
5. Authentication > URL Configuration: Site URL `https://cygna.com.ng`; Redirect URLs `https://cygna.com.ng/**`, `https://www.cygna.com.ng/**`, `http://localhost:3000/**`.
6. Sign up on the site with olamgeorg9@gmail.com (Olamide George). That account becomes admin automatically and unlocks the Admin tab. Keep Auth > Email > Confirm email turned on.

## 2. Run locally
`npm install` then `npm run dev` (http://localhost:3000). Production build: `npm run build`.

## 3. Deploy to Vercel
1. Push the project to a GitHub repository.
2. vercel.com > Add New > Project > import the repo. Framework: Vite, Build: `npm run build`, Output: `dist`. Deploy. (`vercel.json` already handles page refreshes on routes.)
3. Project > Settings > Domains > add `cygna.com.ng` and `www.cygna.com.ng`.
4. At your domain registrar's DNS: A record `@` -> `76.76.21.21`; CNAME `www` -> `cname.vercel-dns.com`. Wait for propagation; Vercel issues HTTPS automatically.
5. Confirm the Supabase redirect URLs from step 1.5 include your live domain.

## Editing content later (Dashboard > admin account)
- **Manage listings:** add, edit, delete products, cars (seller, inspection report), properties (agent, amenities, map coordinates), services (package features), experts (photo, role) and AI services (use cases, pricing). Upload photos there too.
- **Site settings:** contact details, social links, bank transfer details and the Paystack public key.
- **Support chats:** reply to customer chats.

## Card payments (Paystack, charged in NGN)
1. Create a Paystack account. In Dashboard > Site settings paste your **public** key (pk_...). Card option then appears at checkout.
2. Deploy the verification function (keeps the secret key off the website):
   `npm i -g supabase`, `supabase login`, `supabase link --project-ref qoyyfjaxxhjrpkgzkuby`,
   `supabase secrets set PAYSTACK_SECRET_KEY=sk_live_xxx`, `supabase functions deploy verify-payment`.
3. Test with Paystack test keys (pk_test / sk_test) before going live. Never put the secret key in the code.
