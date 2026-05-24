import { createBrowserClient } from '@supabase/ssr';
import { supabaseAuthOptions, supabaseCookieOptions } from './options';
import type { SupabaseClient } from '@supabase/supabase-js';

let browserClient: SupabaseClient | null = null;

export function createClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
  const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_KEY;

  if (!supabaseUrl || !supabaseKey) {
    if (typeof window === 'undefined') {
      return createPrerenderClient();
    }
    throw new Error('Missing Supabase public environment variables.');
  }

  if (browserClient) return browserClient;

  browserClient = createBrowserClient(supabaseUrl, supabaseKey, {
    cookieOptions: supabaseCookieOptions,
    auth: supabaseAuthOptions,
  });

  if (typeof window !== 'undefined') {
    try {
      const cooldownUntil = Number(localStorage.getItem('extra_auth_cooldown_until') || 0);
      if (cooldownUntil && Date.now() < cooldownUntil) {
        browserClient.auth.stopAutoRefresh();
      }
    } catch {
      // ignore
    }
  }

  return browserClient;
}

function createPrerenderClient() {
  const emptyResult = Promise.resolve({ data: null, error: null, count: 0 });
  const query = {
    select: () => query,
    insert: () => emptyResult,
    update: () => query,
    delete: () => query,
    upsert: () => emptyResult,
    eq: () => query,
    in: () => query,
    gte: () => query,
    order: () => query,
    limit: () => query,
    maybeSingle: () => emptyResult,
    single: () => emptyResult,
    then: emptyResult.then.bind(emptyResult),
    catch: emptyResult.catch.bind(emptyResult),
    finally: emptyResult.finally.bind(emptyResult),
  };

  return {
    from: () => query,
    rpc: () => emptyResult,
    channel: () => ({
      on: () => ({
        on: () => ({
          subscribe: () => ({}),
        }),
        subscribe: () => ({}),
      }),
      subscribe: () => ({}),
    }),
    removeChannel: () => {},
    storage: {
      from: () => ({
        upload: () => emptyResult,
        remove: () => emptyResult,
        getPublicUrl: () => ({ data: { publicUrl: '' } }),
        createSignedUrl: () => emptyResult,
      }),
    },
    auth: {
      getSession: () => Promise.resolve({ data: { session: null }, error: null }),
      onAuthStateChange: () => ({ data: { subscription: { unsubscribe() {} } } }),
      signOut: () => Promise.resolve({ error: null }),
      startAutoRefresh() {},
      stopAutoRefresh() {},
    },
  } as unknown as SupabaseClient;
}
