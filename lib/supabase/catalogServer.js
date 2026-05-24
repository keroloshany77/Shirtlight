import { products as fallbackProducts, getProductById as getFallbackProductById } from '@/lib/products';
import { mapSupabaseProduct } from './catalog';
import { createClient } from './server';

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{12}$/i;

export async function fetchServerProducts() {
  try {
    const supabase = await createClient();
    const { data, error } = await supabase
      .from('products')
      .select('*, product_images(*), product_variants(*), product_colors(*), product_reviews(*)')
      .eq('is_active', true)
      .order('created_at', { ascending: false });

    if (error || !data?.length) {
      return fallbackProducts;
    }

    return data.map(mapSupabaseProduct);
  } catch {
    return fallbackProducts;
  }
}

export async function fetchServerProductById(id) {
  try {
    const supabase = await createClient();
    const query = supabase
      .from('products')
      .select('*, product_images(*), product_variants(*), product_colors(*), product_reviews(*)')
      .eq('is_active', true);

    const { data, error } = await (UUID_PATTERN.test(id) ? query.eq('id', id) : query.eq('slug', id)).maybeSingle();

    if (!error && data) {
      return mapSupabaseProduct(data);
    }
  } catch {
    // Fall through to static fallback.
  }

  return getFallbackProductById(id);
}
