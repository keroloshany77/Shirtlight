import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";

export const metadata = {
  title: "Contact Us | Shirt Night"
};

export default function ContactPage() {
  return (
    <>
      <Navbar />
      <main className="page-shell contact-page">
        <section className="contact-layout">
          <div className="contact-copy">
            <p className="eyebrow">Shirt Night</p>
            <h1>Contact Us</h1>
            <p>
              Send us your order questions, sizing notes, or custom requests. The brand mood stays dark, clean,
              and direct here too.
            </p>
          </div>

          <form className="contact-form">
            <label>
              Full Name
              <input type="text" placeholder="Name" />
            </label>
            <label>
              Email
              <input type="email" placeholder="you@example.com" />
            </label>
            <label>
              Message
              <textarea rows="6" placeholder="Write your message" />
            </label>
            <button type="button" className="primary-btn">
              Send Message
            </button>
          </form>
        </section>
      </main>
      <Footer />
    </>
  );
}
