This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.js`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deployment

### Environment variables

Copy `.env.example` to `.env.local` and set:

- **`NEXT_PUBLIC_SUPABASE_URL`** – Your Supabase project URL (optional; if unset, the app reads from local `src/data/*.json`).
- **`NEXT_PUBLIC_SUPABASE_ANON_KEY`** – Supabase anonymous key (optional; required if using Supabase).
- **`NEXT_PUBLIC_INSTA_IMAGE_BASE`** – Base URL for Instagram images (optional).

For production, configure Supabase (or another database) so signups, orders, and donations persist. Without it, writes fall back to local JSON files, which are not reliable on serverless (e.g. Vercel).

### Build and run

```bash
npm run build
npm run start
```

In your hosting dashboard (e.g. Vercel), add the same `NEXT_PUBLIC_*` variables. The app uses relative `/api/...` URLs, so no `localhost` or base-URL changes are needed for deployment.

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.
