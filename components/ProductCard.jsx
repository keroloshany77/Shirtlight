import Link from "next/link";
import { formatPrice } from "@/lib/products";

export default function ProductCard({ product, index = 0 }) {
  return (
    <article className="product-card" style={{ animationDelay: `${(index + 1) * 0.08}s` }}>
      <img src={product.imageUrl} alt={product.name} />
      <div className="product-overlay" />
      <div className="product-details">
        <div className="product-meta">
          <span className="product-icon" aria-hidden="true">
            Shirt
          </span>
          <span className="product-price">{formatPrice(product.price)}</span>
        </div>
        <h3 className="product-name">{product.name}</h3>
        <p className="product-copy">{product.description}</p>
      </div>
      <Link href={`/product/${product.slug || product.id}`} className="shop-btn">
        {product.ctaLabel || "Shop Now"}
      </Link>
    </article>
  );
}
