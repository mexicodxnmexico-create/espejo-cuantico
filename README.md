# Espejo Cuántico (Quantum Mirror)

A Next.js project with Vercel Speed Insights integrated for performance monitoring.

## Quick Start

### Prerequisites

- Node.js 18+ installed
- A Vercel account (optional, for deployment and Speed Insights dashboard)

### Installation

1. Install dependencies:

```bash
npm install
# or
pnpm install
# or
yarn install
# or
bun install
```

2. Run the development server:

```bash
npm run dev
# or
pnpm dev
# or
yarn dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser to see the result.

## Speed Insights Integration

This project has Vercel Speed Insights enabled. The `@vercel/speed-insights` package is integrated in the root layout and will automatically track performance metrics.

### Features

- ✅ Web Vitals tracking (LCP, FID, CLS, etc.)
- ✅ Real User Monitoring (RUM)
- ✅ Automatic performance data collection
- ✅ Privacy-compliant data tracking

### Configuration

Speed Insights is configured in `app/layout.tsx` using the `<SpeedInsights />` component from `@vercel/speed-insights/next`.

To view your performance data:

1. Deploy to Vercel: `vercel deploy`
2. Go to your [Vercel dashboard](https://vercel.com/dashboard)
3. Select your project
4. Click on the **Speed Insights** tab

## Project Structure

```
├── app/
│   ├── layout.tsx          # Root layout with Speed Insights
│   └── page.tsx            # Home page
├── public/                 # Static files
├── next.config.ts          # Next.js configuration
├── tsconfig.json           # TypeScript configuration
└── package.json            # Dependencies
```

## Building for Production

```bash
npm run build
npm run start
```

## Learn More

- [Vercel Speed Insights Documentation](https://vercel.com/docs/speed-insights)
- [Next.js Documentation](https://nextjs.org/docs)
- [Web Vitals](https://web.dev/vitals/)

## Deployment

The easiest way to deploy is with [Vercel](https://vercel.com):

```bash
vercel deploy
```

Or connect your Git repository and Vercel will automatically deploy on every push to the main branch.
