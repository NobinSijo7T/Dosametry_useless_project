import type { Metadata } from "next";
import "./globals.css";
import { ThemeProvider } from "@/components/theme-provider";

export const metadata: Metadata = {
  title: "Dosa Circularity Analyzer™ | National Metrology Directorate",
  description: "The official computational metrology laboratory measuring dosa circularity via polar coordinate interferometry, batter spiral dynamics, and matriarchal approval modeling.",
  keywords: ["dosa", "circularity", "metrology", "kolam geometry", "south indian culinary", "satire", "nobel prize"],
  authors: [{ name: "National Metrology Directorate for Dosa Circularity" }],
  openGraph: {
    title: "Dosa Circularity Analyzer™ | National Metrology Directorate",
    description: "Sub-millimeter polar coordinate interferometry and matriarchal approval modeling for the modern South Indian tawa.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link
          href="https://fonts.googleapis.com/css2?family=Gayathri:wght@100;400;700&display=swap"
          rel="stylesheet"
        />
      </head>
      <body className="min-h-screen bg-[#0c0e12] text-[#fdfbf7] antialiased">
        <ThemeProvider>
          {children}
        </ThemeProvider>
      </body>
    </html>
  );
}
