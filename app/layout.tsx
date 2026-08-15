import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Adult — Better 18+ Connections",
  description: "A safety-first 18+ dating and matchmaking experience.",
};

export default function RootLayout({ children }: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
