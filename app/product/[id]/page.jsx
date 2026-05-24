import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { notFound } from "next/navigation";
import { fetchServerProductById } from "@/lib/supabase/catalogServer";
import ProductClient from "./ProductClient";

export const dynamic = "force-dynamic";

export async function generateMetadata({ params }) {
  const { id } = await params;
  const product = await fetchServerProductById(id);
  if (!product) {
    return {
      title: "Product Not Found | Shirt Night"
    };
  }
  return {
    title: `${product.name} | Shirt Night`
  };
}

export default async function ProductPage({ params }) {
  const { id } = await params;
  const product = await fetchServerProductById(id);
  if (!product) notFound();

  return (
    <>
      <Navbar />
      <ProductClient product={product} />
      <Footer />
    </>
  );
}
