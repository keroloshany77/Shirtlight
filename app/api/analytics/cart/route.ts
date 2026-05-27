import { NextResponse } from 'next/server';
import { createClient } from '@/lib/supabase/server';

const UUID_PATTERN = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{12}$/i;

function cleanText(value: unknown, fallback = '', maxLen = 500) {
  return typeof value === 'string' && value.trim() ? value.trim().slice(0, maxLen) : fallback;
}

function cleanUuid(value: unknown) {
  const text = cleanText(value, '', 64);
  return UUID_PATTERN.test(text) ? text : null;
}

export async function POST(request: Request) {
  const supabase = await createClient();
  const body = await request.json().catch(() => ({}));

  const visitorId = cleanText(body.visitor_id ?? body.visitorId, '', 128);
  const quantity = Math.max(1, Number(body.quantity || 1));

  if (!visitorId) {
    return NextResponse.json({ tracked: false, error: 'Missing visitor id.' }, { status: 400 });
  }

  const { error } = await supabase.from('cart_events').insert({
    visitor_id: visitorId,
    product_id: cleanUuid(body.product_id ?? body.productId),
    variant_id: cleanUuid(body.variant_id ?? body.variantId),
    quantity,
    user_id: null,
  });

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 400 });
  }

  return NextResponse.json({ tracked: true });
}
