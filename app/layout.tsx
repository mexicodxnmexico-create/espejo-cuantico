import type { ReactNode } from "react";
import { SpeedInsights } from "@vercel/speed-insights/next";

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <head>
        <title>Espejo Cuántico</title>
        <meta name="description" content="Espejo Cuántico - Quantum Mirror" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
      </head>
      <body>
        {children}
        <SpeedInsights />
      </body>
    </html>
  );
}
