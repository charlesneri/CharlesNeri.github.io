import { createClient } from '@supabase/supabase-js'

const rawUrl = import.meta.env.VITE_SUPABASE_URL?.trim()
const key = import.meta.env.VITE_SUPABASE_PUBLISHABLE_KEY?.trim()

// A Supabase project reference (for example, "abc123") is convenient to copy,
// but createClient requires the full HTTPS project URL.
function getSupabaseUrl(value) {
  if (!value) return ''
  if (/^[a-z0-9-]+$/i.test(value)) return `https://${value}.supabase.co`

  try {
    const url = new URL(value)
    if (!['http:', 'https:'].includes(url.protocol)) return ''
    // Supabase client URLs must be the project root, not /rest/v1 or /auth/v1.
    return `${url.origin}/`
  } catch {
    return ''
  }
}

const url = getSupabaseUrl(rawUrl)

export const supabaseConfigurationError = rawUrl && !url
  ? 'VITE_SUPABASE_URL must be a full http(s) URL or a Supabase project reference.'
  : !rawUrl && !key
    ? 'Both VITE_SUPABASE_URL and VITE_SUPABASE_PUBLISHABLE_KEY are missing. Add them in Vercel Environment Variables and redeploy.'
    : !rawUrl
      ? 'VITE_SUPABASE_URL is missing. Add it in Vercel Environment Variables and redeploy.'
      : !key
        ? 'VITE_SUPABASE_PUBLISHABLE_KEY is missing. Add it in Vercel Environment Variables and redeploy.'
        : ''
export const isSupabaseConfigured = Boolean(url && key)
export const supabase = isSupabaseConfigured ? createClient(url, key) : null
