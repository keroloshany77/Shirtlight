import "./globals.css";

export const metadata = {
  title: "Shirt Night",
  description: "Shirt Night storefront redesigned in Next.js"
};

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>{children}</body>
    </html>
  );
}
