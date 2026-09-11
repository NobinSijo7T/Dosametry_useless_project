import type { Metadata } from "next";
import "./globals.css";

export const metadata: Metadata = {
  title: "Dosa Circularity Analyzer™",
  description: "The world's most important scientific tool for analyzing dosa circularity. Powered by AI, ML, DL, Blockchain, and disappointed grandmothers.",
  keywords: ["dosa", "circularity", "analyzer", "south indian", "food", "AI", "machine learning"],
  authors: [{ name: "NobinSijo7T" }],
  openGraph: {
    title: "Dosa Circularity Analyzer™",
    description: "Analyze the circularity of your dosa with cutting-edge AI and machine learning.",
    type: "website",
  },
};

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html lang="en" className="scroll-smooth">
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
      </head>
      <body className="min-h-screen">{children}</body>
    </html>
  );
}
