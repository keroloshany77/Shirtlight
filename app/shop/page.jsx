import Footer from "@/components/Footer";
import Navbar from "@/components/Navbar";
import { assetPath } from "@/lib/assetPath";
import { fetchServerProducts } from "@/lib/supabase/catalogServer";
import ShopClient from "./ShopClient";

export const metadata = {
  title: "Shop All | Shirt Night"
};

export const dynamic = "force-dynamic";

export default async function ShopPage() {
  const products = await fetchServerProducts();

  return (
    <>
      <Navbar />
      <main className="shop-page">
        <section className="split-hero" aria-label="Shirt Night campaign images">
          <div>
            <img src={assetPath("/Images/Shop/Imgs/WhatsApp Image 2026-03-01 at 8.27.03 PM.jpeg")} alt="Shirt Night model in striped shirt" />
          </div>
          <div>
            <img src={assetPath("/Images/Shop/Imgs/WhatsApp Image 2026-03-01 at 8.27.35 PM.jpeg")} alt="Shirt Night campaign look" />
          </div>
        </section>

        <section className="collections">
          <h1 className="animated-heading">ShirtNight-Collections</h1>
          <div className="underline" />
        </section>

        <ShopClient initialProducts={products} />
      </main>
      <Footer />
    </>
  );
}
