import type { Metadata } from "next";
import { Analytics } from "@vercel/analytics/next";

export const metadata: Metadata = {
  title: "Espejo Cuántico",
  description: "A quantum mirror - exploring the intersection of technology and consciousness",
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
