import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "’t Bakhuus Duiven | Bestel online",
  description: "Bestel de lekkerste patat, snacks, burgers en broodjes van ’t Bakhuus Duiven eenvoudig online.",
  icons: { icon: "/favicon.svg" },
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return <html lang="nl"><body>{children}</body></html>;
}
