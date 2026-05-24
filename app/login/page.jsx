"use client";

import { useEffect, useState } from "react";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { clearCurrentAdminCache } from "@/lib/supabase/admin";
import { clearAuthCooldown, handleAuthRateLimit } from "@/lib/supabase/authState";
import { createClient } from "@/lib/supabase/browser";

export default function LoginPage() {
  const [next, setNext] = useState("/admin");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const nextParam = params.get("next");
    if (nextParam?.startsWith("/")) {
      setNext(nextParam);
    }
  }, []);

  async function handleSubmit(event) {
    event.preventDefault();
    setIsSubmitting(true);
    setMessage("");

    try {
      clearAuthCooldown();
      const supabase = createClient();
      const { error } = await supabase.auth.signInWithPassword({
        email: email.trim(),
        password,
      });

      if (error) {
        handleAuthRateLimit(error);
        setMessage(error.message || "Unable to sign in.");
        setIsSubmitting(false);
        return;
      }

      clearCurrentAdminCache();
      window.location.href = next.startsWith("/") ? next : "/admin";
    } catch (error) {
      setMessage(error?.message || "Missing Supabase environment variables.");
      setIsSubmitting(false);
    }
  }

  return (
    <>
      <Navbar />
      <main className="page-shell login-page">
        <section className="order-section">
          <p className="eyebrow">Shirt Night Admin</p>
          <h1 className="order-title">Login</h1>
          <form className="order-form" onSubmit={handleSubmit}>
            <label>
              Email
              <input
                type="email"
                placeholder="admin@shirtnight.shop"
                value={email}
                onChange={(event) => setEmail(event.target.value)}
                required
              />
            </label>
            <label>
              Password
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(event) => setPassword(event.target.value)}
                required
              />
            </label>
            <button type="submit" className="primary-btn" disabled={isSubmitting}>
              {isSubmitting ? "Signing In..." : "Login"}
            </button>
            {message ? <p className="success-msg">{message}</p> : null}
          </form>
        </section>
      </main>
      <Footer />
    </>
  );
}
