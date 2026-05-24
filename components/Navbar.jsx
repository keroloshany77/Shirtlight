"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { assetPath } from "@/lib/assetPath";
import { formatPrice } from "@/lib/products";

function readCart() {
  if (typeof window === "undefined") {
    return [];
  }

  try {
    return JSON.parse(window.localStorage.getItem("shirtNightCart") || "[]");
  } catch {
    return [];
  }
}

export default function Navbar({ transparent = false }) {
  const [count, setCount] = useState(0);
  const [cartItems, setCartItems] = useState([]);
  const [cartOpen, setCartOpen] = useState(false);

  useEffect(() => {
    const updateCart = () => {
      const cart = readCart();
      setCartItems(cart);
      setCount(cart.reduce((total, item) => total + Number(item.quantity || 0), 0));
    };

    updateCart();
    window.addEventListener("storage", updateCart);
    window.addEventListener("shirtNightCartChanged", updateCart);
    return () => {
      window.removeEventListener("storage", updateCart);
      window.removeEventListener("shirtNightCartChanged", updateCart);
    };
  }, []);

  function openCart() {
    setCartItems(readCart());
    setCartOpen(true);
  }

  function clearCart() {
    window.localStorage.removeItem("shirtNightCart");
    window.dispatchEvent(new Event("shirtNightCartChanged"));
    setCartItems([]);
    setCount(0);
  }

  return (
    <>
      <nav className={`navbar ${transparent ? "navbar--transparent" : ""}`}>
        <Link className="logo" href="/">
          <span>Shirt Night</span>
          <span className="star" aria-hidden="true">
            &#9733;
          </span>
        </Link>

        <div className="nav-center">
          <Link href="/shop">SHOP ALL</Link>
          <Link href="/">Return Home</Link>
          <Link href="/contact">Contact Us</Link>
        </div>

        <div className="nav-icons" aria-label="Store actions">
          <Link className="nav-icon" href="/login" aria-label="Account">
            <svg className="icon-svg" viewBox="0 0 24 24" aria-hidden="true">
              <circle cx="12" cy="8" r="4" />
              <path d="M4.5 21c1.4-4.1 4-6.2 7.5-6.2s6.1 2.1 7.5 6.2" />
            </svg>
          </Link>
          <button className="nav-icon cart-icon" type="button" onClick={openCart} aria-label={`${count} cart items`}>
            <svg className="icon-svg" viewBox="0 0 24 24" aria-hidden="true">
              <path d="M6.5 8.5h11l.9 11.5H5.6L6.5 8.5Z" />
              <path d="M9 8.5V6a3 3 0 0 1 6 0v2.5" />
            </svg>
            <span className="cart-count">{count}</span>
          </button>
        </div>
      </nav>

      {cartOpen ? (
        <div className="drawer-wrap">
          <div className="cart-overlay active" onClick={() => setCartOpen(false)} />
          <aside className="cart-drawer active" aria-label="Cart">
            <div className="drawer-header">
              <span>Your cart</span>
              <button type="button" onClick={() => setCartOpen(false)}>
                X
              </button>
            </div>
            <div className="drawer-body">
              {cartItems.length ? (
                cartItems.map((item) => (
                  <div className="drawer-item" key={`${item.id}-${item.color}-${item.size}`}>
                    <img src={assetPath(item.image)} alt={item.name} />
                    <div>
                      <h3>{item.name}</h3>
                      <p>Color: {item.color}</p>
                      <p>Size: {item.size}</p>
                      <p>Quantity: {item.quantity}</p>
                      <p>{formatPrice(item.price)}</p>
                    </div>
                  </div>
                ))
              ) : (
                <p className="empty-cart">Your cart is empty.</p>
              )}
            </div>
            <div className="drawer-actions">
              <Link href="/order" className="primary-btn drawer-action" onClick={() => setCartOpen(false)}>
                Checkout
              </Link>
              <button type="button" className="secondary-btn drawer-action" onClick={clearCart}>
                Clear Cart
              </button>
            </div>
          </aside>
        </div>
      ) : null}
    </>
  );
}
