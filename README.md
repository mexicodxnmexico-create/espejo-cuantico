# Espejo Cuántico

A Next.js application with Vercel Web Analytics integration.

## Getting Started

### Prerequisites

- Node.js 18+ or later
- pnpm, yarn, npm, or bun

### Installation

```bash
# Using pnpm
pnpm install

# Using yarn
yarn install

# Using npm
npm install

# Using bun
bun install
```

### Development

```bash
# Using pnpm
pnpm dev

# Using yarn
yarn dev

# Using npm
npm run dev

# Using bun
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

### Building

```bash
# Using pnpm
pnpm build
pnpm start

# Using yarn
yarn build
yarn start

# Using npm
npm run build
npm start

# Using bun
bun run build
bun start
```

## Vercel Web Analytics

This project is configured with [Vercel Web Analytics](https://vercel.com/docs/analytics). The analytics component is integrated into the root layout and will automatically track page views and user interactions when deployed to Vercel.

### Setup Instructions

1. **Enable Web Analytics in Vercel Dashboard**
   - Go to your project on [Vercel Dashboard](https://vercel.com/dashboard)
   - Click the **Analytics** tab
   - Click **Enable**

2. **Deploy to Vercel**
   ```bash
   vercel deploy
   ```

3. **View Your Data**
   - After deployment, visit [Analytics tab in Vercel Dashboard](https://vercel.com/dashboard)
   - Data will start appearing after users visit your site

For detailed setup instructions, see [VERCEL_ANALYTICS_SETUP.md](docs/VERCEL_ANALYTICS_SETUP.md).

## Learn More

- [Vercel Documentation](https://vercel.com/docs)
- [Next.js Documentation](https://nextjs.org/docs)
- [Vercel Analytics Documentation](https://vercel.com/docs/analytics)

## License

This project is open source and available under the MIT License.
