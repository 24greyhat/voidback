import type { Metadata, Viewport } from "next";
import "./globals.css";
import { SITE_DESCRIPTION, SITE_NAME, SITE_URL } from "./site";

const title = "Voidback — optimizing human quality of life, output and creativity";

export const metadata: Metadata = {
  metadataBase: new URL(SITE_URL),
  title: { default: title, template: `%s | ${SITE_NAME}` },
  description: SITE_DESCRIPTION,
  applicationName: SITE_NAME,
  alternates: { canonical: "/" },
  keywords: ["Voidback", "ANTP", "AI manager", "productivity", "human output", "creativity"],
  robots: { index: true, follow: true },
  openGraph: {
    type: "website",
    url: "/",
    siteName: SITE_NAME,
    title,
    description: SITE_DESCRIPTION,
    locale: "en_US",
  },
  twitter: { card: "summary_large_image", title, description: SITE_DESCRIPTION },
};

export const viewport: Viewport = {
  themeColor: "#0b0a09",
  colorScheme: "dark",
};

export default function RootLayout({ children }: LayoutProps<"/">) {
  return (
    <html lang="en" className="h-full antialiased">
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
