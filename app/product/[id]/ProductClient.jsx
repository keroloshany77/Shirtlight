"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import { assetPath } from "@/lib/assetPath";
import { formatPrice } from "@/lib/products";
import { createClient } from "@/lib/supabase/browser";
import { fetchProductById } from "@/lib/supabase/catalog";

function getCart() {
  try {
    return JSON.parse(window.localStorage.getItem("shirtNightCart") || "[]");
  } catch {
    return [];
  }
}

function saveCart(cart) {
  window.localStorage.setItem("shirtNightCart", JSON.stringify(cart));
  window.dispatchEvent(new Event("shirtNightCartChanged"));
}

export default function ProductClient({ product }) {
  const [liveProduct, setLiveProduct] = useState(product);
  const gallery = useMemo(() => liveProduct.gallery?.length ? liveProduct.gallery : [liveProduct.imageUrl], [liveProduct]);
  const [imageIndex, setImageIndex] = useState(0);
  const colors = liveProduct.colors?.length ? liveProduct.colors : ["Default"];
  const sizes = liveProduct.sizes?.length ? liveProduct.sizes : ["M"];
  const [selectedColor, setSelectedColor] = useState(colors[0]);
  const [selectedSize, setSelectedSize] = useState(sizes[0]);
  const [quantity, setQuantity] = useState(1);
  const [drawerOpen, setDrawerOpen] = useState(false);
  const [sizeChartOpen, setSizeChartOpen] = useState(false);
  const selectedVariant = liveProduct.variants?.find((entry) => entry.size === selectedSize);
  const selectedStock = Number(selectedVariant?.stock || 0);
  const showLowStock = selectedStock > 0 && selectedStock < 10;
  const touchStartX = useRef(null);
  const currentImage = gallery[imageIndex] || gallery[0] || liveProduct.imageUrl;

  useEffect(() => {
    setLiveProduct(product);
  }, [product]);

  useEffect(() => {
    setImageIndex(0);
    setSelectedColor(colors[0]);
    setSelectedSize(sizes[0]);
  }, [liveProduct.id]);

  useEffect(() => {
    if (!colors.includes(selectedColor)) {
      setSelectedColor(colors[0]);
    }
    if (!sizes.includes(selectedSize)) {
      setSelectedSize(sizes[0]);
    }
  }, [colors.join("|"), selectedColor, selectedSize, sizes.join("|")]);

  useEffect(() => {
    let mounted = true;
    const supabase = createClient();
    const lookupId = liveProduct.slug || liveProduct.id;

    const refresh = async () => {
      const nextProduct = await fetchProductById(lookupId);
      if (mounted && nextProduct) {
        setLiveProduct(nextProduct);
      }
    };

    const refreshIfRelated = (payload) => {
      const row = payload?.new || payload?.old || {};
      if (!row.product_id || row.product_id === liveProduct.id) {
        refresh();
      }
    };

    const channel = supabase
      .channel(`customer:product:${liveProduct.id}`)
      .on("postgres_changes", { event: "*", schema: "public", table: "products", filter: `id=eq.${liveProduct.id}` }, refresh)
      .on("postgres_changes", { event: "*", schema: "public", table: "product_images" }, refreshIfRelated)
      .on("postgres_changes", { event: "*", schema: "public", table: "product_variants" }, refreshIfRelated)
      .on("postgres_changes", { event: "*", schema: "public", table: "product_colors" }, refreshIfRelated)
      .on("postgres_changes", { event: "*", schema: "public", table: "product_reviews" }, refreshIfRelated)
      .subscribe();

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, [liveProduct.id, liveProduct.slug]);

  function buildCartItem() {
    const variant = liveProduct.variants?.find((entry) => entry.size === selectedSize);
    return {
      id: liveProduct.id,
      productId: liveProduct.id,
      variantId: variant?.id || "",
      name: liveProduct.name,
      price: liveProduct.price,
      image: liveProduct.imageUrl,
      color: selectedColor,
      size: selectedSize,
      quantity
    };
  }

  function addToCart() {
    const item = buildCartItem();
    const cart = getCart();
    const existingIndex = cart.findIndex(
      (entry) => entry.id === item.id && entry.color === item.color && entry.size === item.size
    );

    if (existingIndex >= 0) {
      cart[existingIndex].quantity += item.quantity;
    } else {
      cart.push(item);
    }

    saveCart(cart);
    setDrawerOpen(true);
  }

  function showGalleryImage(nextIndex) {
    if (gallery.length <= 1) return;
    setImageIndex((nextIndex + gallery.length) % gallery.length);
  }

  function showNextImage(direction) {
    if (gallery.length <= 1) return;
    setImageIndex((current) => (current + direction + gallery.length) % gallery.length);
  }

  function handleTouchStart(event) {
    touchStartX.current = event.touches[0]?.clientX ?? null;
  }

  function handleTouchEnd(event) {
    if (touchStartX.current === null) return;

    const touchEndX = event.changedTouches[0]?.clientX;
    if (typeof touchEndX !== "number") {
      touchStartX.current = null;
      return;
    }

    const distance = touchStartX.current - touchEndX;
    touchStartX.current = null;

    if (Math.abs(distance) < 40) return;
    showNextImage(distance > 0 ? 1 : -1);
  }

  function handleGalleryKeyDown(event) {
    if (event.key === "ArrowRight") {
      showNextImage(1);
    }
    if (event.key === "ArrowLeft") {
      showNextImage(-1);
    }
  }

  const cartItems = typeof window !== "undefined" && drawerOpen ? getCart() : [];

  return (
    <main className="product-page">
      <section className="product-section">
        <div className="image-box">
          <div
            className="slider-wrapper"
            role="region"
            aria-label="Product images"
            tabIndex={0}
            onKeyDown={handleGalleryKeyDown}
            onTouchStart={handleTouchStart}
            onTouchEnd={handleTouchEnd}
          >
            <img src={currentImage} alt={liveProduct.name} className="main-product-img" draggable="false" />
          </div>
          <div className="dots" aria-label="Product gallery">
            {gallery.map((image, index) => (
              <button
                key={image}
                type="button"
                aria-label={`Show image ${index + 1}`}
                className={index === imageIndex ? "active" : ""}
                onClick={() => showGalleryImage(index)}
              />
            ))}
          </div>
          {liveProduct.sizeChartUrl ? (
            <button type="button" className="size-chart-open-btn" onClick={() => setSizeChartOpen(true)}>
              View Size Chart
            </button>
          ) : null}
        </div>

        <div className="info-box">
          <h1 className="product-title">{liveProduct.name}</h1>
          <p className="price">{formatPrice(liveProduct.price)}</p>
          <p className="product-description">{liveProduct.description}</p>

          <div className="option">
            <p className="option-label">Color</p>
            <div className="option-row">
              {colors.map((color) => (
                <button
                  key={color}
                  type="button"
                  className={`option-pill ${selectedColor === color ? "selected" : ""}`}
                  onClick={() => setSelectedColor(color)}
                >
                  {color}
                </button>
              ))}
            </div>
          </div>

          <div className="option">
            <p className="option-label">Size</p>
            <div className="option-row">
              {sizes.map((size) => (
                <button
                  key={size}
                  type="button"
                  className={`option-pill ${selectedSize === size ? "selected" : ""}`}
                  onClick={() => setSelectedSize(size)}
                >
                  {size}
                </button>
              ))}
            </div>
            {showLowStock ? (
              <p className="low-stock-note">
                Only <span>{selectedStock}</span> left
              </p>
            ) : null}
          </div>

          <div className="quantity-container">
            <p className="option-label">Quantity</p>
            <div className="quantity-box">
              <button type="button" onClick={() => setQuantity((value) => Math.max(1, value - 1))}>
                -
              </button>
              <span>{quantity}</span>
              <button type="button" onClick={() => setQuantity((value) => value + 1)}>
                +
              </button>
            </div>
          </div>

          <div className="buttons-container">
            <button type="button" className="secondary-btn" onClick={addToCart}>
              Add To Cart
            </button>
            <Link href="/order" className="primary-btn" onClick={addToCart}>
              Buy It Now
            </Link>
          </div>
        </div>
      </section>

      <section className="reviews-section">
        <div className="reviews-header">
          <p className="option-label">Reviews</p>
          <span>{liveProduct.reviews?.length || 0}</span>
        </div>

        {liveProduct.reviews?.length ? (
          <div className="reviews-grid">
            {liveProduct.reviews.map((review) => (
              <article className="review-card" key={review.id}>
                <div className="review-topline">
                  <strong>{review.name}</strong>
                  <span aria-label={`${review.rating} out of 5 stars`}>
                    {"★".repeat(Math.max(1, Math.min(5, Number(review.rating || 5))))}
                  </span>
                </div>
                <p>{review.text}</p>
              </article>
            ))}
          </div>
        ) : (
          <p className="reviews-empty">No reviews yet.</p>
        )}
      </section>

      {sizeChartOpen ? (
        <div className="modal-overlay" onClick={() => setSizeChartOpen(false)}>
          <div className="size-chart-content" onClick={(event) => event.stopPropagation()}>
            <button type="button" className="close-modal" onClick={() => setSizeChartOpen(false)}>
              X
            </button>
            <img src={liveProduct.sizeChartUrl} alt={`${liveProduct.name} size chart`} />
          </div>
        </div>
      ) : null}

      {drawerOpen ? (
        <div className="drawer-wrap">
          <div className="cart-overlay active" onClick={() => setDrawerOpen(false)} />
          <aside className="cart-drawer active" aria-label="Cart">
            <div className="drawer-header">
              <span>Added to your cart</span>
              <button type="button" onClick={() => setDrawerOpen(false)}>
                X
              </button>
            </div>
            <div className="drawer-body">
              {cartItems.map((item) => (
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
              ))}
            </div>
            <Link href="/order" className="primary-btn drawer-action">
              Buy It Now
            </Link>
          </aside>
        </div>
      ) : null}
    </main>
  );
}
