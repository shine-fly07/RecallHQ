import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "RecallHQ | The Headquarters for Your Event Memory",
  description: "Enterprise event-intelligence agent powered by Vectorize Hindsight persistent memory. Never repeat past venue pitfalls or logistical errors.",
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="dark">
      <body className="bg-slate-950 text-slate-100 antialiased selection:bg-indigo-500 selection:text-white">
        {children}
      </body>
    </html>
  );
}

