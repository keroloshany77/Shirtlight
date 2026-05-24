"use client";

import { useEffect, useState } from "react";
import ProductCard from "@/components/ProductCard";
import { fetchProducts } from "@/lib/supabase/catalog";
import { createClient } from "@/lib/supabase/browser";

export default function ShopClient({ initialProducts }) {
  const [products, setProducts] = useState(initialProducts || []);

  useEffect(() => {
    let mounted = true;
    const supabase = createClient();

    const refresh = async () => {
      const nextProducts = await fetchProducts({ force: true });
      if (mounted && nextProducts.length) {
        setProducts(nextProducts);
      }
    };

    const channel = supabase
      .channel("customer:products")
      .on("postgres_changes", { event: "*", schema: "public", table: "products" }, refresh)
      .on("postgres_changes", { event: "*", schema: "public", table: "product_images" }, refresh)
      .on("postgres_changes", { event: "*", schema: "public", table: "product_variants" }, refresh)
      .on("postgres_changes", { event: "*", schema: "public", table: "product_colors" }, refresh)
      .subscribe();

    refresh();

    return () => {
      mounted = false;
      supabase.removeChannel(channel);
    };
  }, []);

  return (
    <section className="product-grid" aria-label="Products">
      {products.map((product, index) => (
        <ProductCard key={product.id} product={product} index={index} />
      ))}
    </section>
  );
}
