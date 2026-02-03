import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { QuantumProvider } from "@/context/QuantumContext";
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
      <body>
        <QuantumProvider>
          {children}
          <Analytics />
          <SpeedInsights />
        </QuantumProvider>
      </body>
    </html>
  );
}
