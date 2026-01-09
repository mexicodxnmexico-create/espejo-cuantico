import { Analytics } from "@vercel/analytics/next";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Espejo Cuántico",
  description: "A Next.js application with Vercel Web Analytics",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en">
      <head>
        <title>Espejo Cuántico</title>
      </head>
      <body>
        {children}
        <Analytics />
      </body>
    </html>
  );
}
