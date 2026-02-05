import { Analytics } from "@vercel/analytics/next";
import { SpeedInsights } from "@vercel/speed-insights/next";
import { QuantumProvider } from "@/context/QuantumContext";
import type { Metadata, Viewport } from "next";

export const metadata: Metadata = {
  title: "Espejo Cuántico",
  description: "Explora tu reflejo cuántico y gestiona la coherencia del sistema.",
  manifest: "/manifest.json",
};

export const viewport: Viewport = {
  themeColor: "#000000",
  width: "device-width",
  initialScale: 1,
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
