import Link from "next/link";
import Footer from "@/components/Footer";
import { assetPath } from "@/lib/assetPath";

export default function HomePage() {
  return (
    <main className="home-page">
      <section className="home-hero">
        <div
          className="home-hero-bg"
          style={{ "--home-hero-bg": `url("${assetPath("/Images/Home/IMG_2016.PNG")}")` }}
        />
        <div className="hero-overlay" />
        <div className="hero-content">
          <h1 className="home-title">You Are Here In Our World</h1>
          <Link href="/shop" className="hero-shop-btn">
            Shop All
          </Link>
          <div className="social-icons" aria-label="Social links">
            <a href="https://www.instagram.com/_shirtnight_?igsh=NmsxamRpY3ZuajAw" aria-label="Instagram">
              <svg className="social-svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round">
                <rect x="4" y="4" width="16" height="16" rx="5" />
                <circle cx="12" cy="12" r="3.5" />
                <circle cx="17" cy="7" r="1" />
              </svg>
            </a>
            <a href="https://www.tiktok.com/@shirtnight_?_r=1&_t=ZS-94KBRwbVboD" aria-label="TikTok">
              <svg className="social-svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 4v10.2a4.2 4.2 0 1 1-3.7-4.2" />
                <path d="M14 4c.5 3.2 2.3 5 5 5.4" />
              </svg>
            </a>
            <a href="https://www.facebook.com/share/1F6BHEZF7h/?mibextid=wwXIfr" aria-label="Facebook">
              <svg className="social-svg" viewBox="0 0 24 24" aria-hidden="true" focusable="false" xmlns="http://www.w3.org/2000/svg" fill="none" stroke="currentColor" strokeWidth="1.65" strokeLinecap="round" strokeLinejoin="round">
                <path d="M14 8h3V4h-3c-3 0-5 2-5 5v3H6v4h3v4h4v-4h3l1-4h-4V9c0-.6.4-1 1-1Z" />
              </svg>
            </a>
          </div>
        </div>
      </section>
      <Footer />
    </main>
  );
}
