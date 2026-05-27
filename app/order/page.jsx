"use client";

import { useEffect, useMemo, useState } from "react";
import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { assetPath } from "@/lib/assetPath";
import { getVisitorId } from "@/lib/analytics/visitor";
import { formatPrice } from "@/lib/products";

const shippingZones = [
  "Beni Suef",
  "Fayoum",
  "Minya",
  "Cairo",
  "Giza",
  "Alexandria",
  "Lower Egypt",
  "Upper Egypt",
  "New Valley",
  "South Sinai",
  "Matrouh"
];

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{12}$/i;

function readCart() {
  try {
    return JSON.parse(window.localStorage.getItem("shirtNightCart") || "[]");
  } catch {
    return [];
  }
}

export default function OrderPage() {
  const [cart, setCart] = useState([]);
  const [city, setCity] = useState("");
  const [shipping, setShipping] = useState(0);
  const [promoCode, setPromoCode] = useState("");
  const [appliedPromo, setAppliedPromo] = useState(null);
  const [promoMessage, setPromoMessage] = useState("");
  const [message, setMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isApplyingPromo, setIsApplyingPromo] = useState(false);

  useEffect(() => {
    setCart(readCart());
  }, []);

  const subtotal = useMemo(
    () => cart.reduce((total, item) => total + Number(item.price || 0) * Number(item.quantity || 1), 0),
    [cart]
  );
  const discount = Number(appliedPromo?.discount_amount || 0);
  const total = Math.max(0, subtotal - discount + Number(shipping || 0));

  async function applyPromo() {
    const code = promoCode.trim().toUpperCase();
    setPromoMessage("");
    setAppliedPromo(null);

    if (!code) {
      setPromoMessage("Enter a promo code first.");
      return;
    }

    if (!subtotal) {
      setPromoMessage("Add products to your cart before applying a promo code.");
      return;
    }

    setIsApplyingPromo(true);

    try {
      const response = await fetch("/api/promo/validate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ code, subtotal }),
      });
      const payload = await response.json().catch(() => ({}));

      if (!response.ok || !payload.ok) {
        const reasons = {
          missing: "Enter a promo code first.",
          invalid: "Promo code is invalid.",
          inactive: "Promo code is inactive.",
          not_started: "Promo code has not started yet.",
          expired: "Promo code expired.",
          limit_reached: "Promo code usage limit reached.",
          min_not_met: `Minimum order amount is ${formatPrice(payload.minimum_order_amount || 0)}.`,
        };
        setPromoMessage(reasons[payload.reason] || payload.error || "Promo code could not be applied.");
        return;
      }

      setAppliedPromo(payload);
      setPromoCode(payload.code || code);
      setPromoMessage(`${payload.code || code} applied. You saved ${formatPrice(payload.discount_amount || 0)}.`);
    } catch (error) {
      setPromoMessage(error?.message || "Promo code could not be applied.");
    } finally {
      setIsApplyingPromo(false);
    }
  }

  function removePromo() {
    setAppliedPromo(null);
    setPromoCode("");
    setPromoMessage("");
  }

  async function confirmOrder(event) {
    event.preventDefault();
    setMessage("");

    if (!cart.length) {
      setMessage("Your cart is empty.");
      return;
    }

    if (!city || !shipping) {
      setMessage("Please select your shipping zone.");
      return;
    }

    setIsSubmitting(true);

    const form = event.currentTarget;
    const formData = new FormData(form);
    const items = cart.map((item) => ({
      product_id: UUID_PATTERN.test(item.productId || item.id) ? item.productId || item.id : "",
      variant_id: UUID_PATTERN.test(item.variantId || "") ? item.variantId : "",
      product_name: item.name,
      size: item.size || "M",
      quantity: Number(item.quantity || 1),
      unit_price: Number(item.price || 0),
      line_total: Number(item.price || 0) * Number(item.quantity || 1),
    }));

    formData.set("city", city);
    formData.set("paymentMethod", "COD");
    formData.set("shippingFee", String(shipping));
    formData.set("subtotal", String(subtotal));
    formData.set("total", String(total));
    formData.set("items", JSON.stringify(items));
    formData.set("visitorId", getVisitorId());
    formData.set("promoCode", appliedPromo?.code || "");

    try {
      const response = await fetch("/api/orders", {
        method: "POST",
        body: formData,
      });
      const payload = await response.json().catch(() => ({}));

      if (!response.ok) {
        throw new Error(payload.error || "Could not submit order.");
      }

      window.localStorage.removeItem("shirtNightCart");
      window.dispatchEvent(new Event("shirtNightCartChanged"));
      setCart([]);
      setShipping(0);
      setCity("");
      setPromoCode("");
      setAppliedPromo(null);
      setPromoMessage("");
      form.reset();
      setMessage("Order confirmed. We received it in the dashboard.");
    } catch (error) {
      setMessage(error?.message || "Could not submit order.");
    } finally {
      setIsSubmitting(false);
    }
  }

  function clearCart() {
    window.localStorage.removeItem("shirtNightCart");
    window.dispatchEvent(new Event("shirtNightCartChanged"));
    setCart([]);
    setShipping(0);
    setCity("");
    removePromo();
  }

  return (
    <>
      <Navbar />
      <main className="page-shell order-page">
        <section className="order-section">
          <h1 className="order-title">Complete Your Order</h1>

          <form className="order-form" onSubmit={confirmOrder}>
            <div className="form-grid">
              <label>
                Full Name
                <input name="fullName" type="text" placeholder="Name" required />
              </label>
              <label>
                Phone Number
                <input name="phone" type="tel" placeholder="Phone Number" required />
              </label>
            </div>
            <label>
              Email
              <input name="email" type="email" placeholder="you@example.com" required />
            </label>
            <label>
              Address
              <input name="address" type="text" placeholder="Detailed address" required />
            </label>
            <label>
              Shipping Zone
              <select
                value={city}
                onChange={(event) => {
                  setCity(event.target.value);
                  setShipping(event.target.value ? 90 : 0);
                }}
                required
              >
                <option value="">Select your shipping zone</option>
                {shippingZones.map((zone) => (
                  <option key={zone} value={zone}>
                    {zone} - 90 EGP
                  </option>
                ))}
              </select>
            </label>
            <label>
              Notes
              <textarea name="notes" rows="4" placeholder="Optional order notes" />
            </label>

            <div className="promo-box">
              <label>
                Promo Code
                <div className="promo-row">
                  <input
                    type="text"
                    value={promoCode}
                    onChange={(event) => {
                      setPromoCode(event.target.value.toUpperCase());
                      if (appliedPromo) setAppliedPromo(null);
                    }}
                    placeholder="ENTER CODE"
                  />
                  <button type="button" className="secondary-btn" onClick={applyPromo} disabled={isApplyingPromo}>
                    {isApplyingPromo ? "Checking..." : "Apply"}
                  </button>
                  {appliedPromo ? (
                    <button type="button" className="secondary-btn" onClick={removePromo}>
                      Remove
                    </button>
                  ) : null}
                </div>
              </label>
              {promoMessage ? <p className="promo-message">{promoMessage}</p> : null}
            </div>

            <div className="summary">
              <div className="order-items">
                {cart.length ? (
                  cart.map((item) => (
                    <div className="order-item" key={`${item.id}-${item.color}-${item.size}`}>
                      <img src={assetPath(item.image)} alt={item.name} />
                      <div>
                        <strong>{item.name}</strong>
                        <span>
                          {item.color} / {item.size} / Qty {item.quantity}
                        </span>
                      </div>
                    </div>
                  ))
                ) : (
                  <p>Your cart is empty.</p>
                )}
              </div>
              <p>
                Products Total: <span>{formatPrice(subtotal)}</span>
              </p>
              {appliedPromo ? (
                <p>
                  Promo Discount ({appliedPromo.code}): <span>-{formatPrice(discount)}</span>
                </p>
              ) : null}
              <p>
                Shipping Base Rate: <span>{Number(shipping || 0)} EGP</span>
              </p>
              <hr />
              <p className="total">
                Total: <span>{formatPrice(total)}</span>
              </p>
            </div>

            <div className="form-buttons">
              <button type="submit" className="primary-btn" disabled={!cart.length || isSubmitting}>
                {isSubmitting ? "Sending..." : "Confirm Order"}
              </button>
              <button type="button" className="secondary-btn" onClick={clearCart}>
                Clear Cart
              </button>
            </div>
            {message ? <p className="success-msg">{message}</p> : null}
          </form>
        </section>
      </main>
      <Footer />
    </>
  );
}
