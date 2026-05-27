import "./globals.css";
import AnalyticsTracker from "@/components/AnalyticsTracker";

export const metadata = {
  title: "Shirt Night",
  description: "Shirt Night storefront redesigned in Next.js"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <AnalyticsTracker />
        {children}
      </body>
    </html>
  );
}
