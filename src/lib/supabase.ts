import { createClient } from '@supabase/supabase-js'

// Shared Jarvis Supabase. The italy_* tables are public-read; writes are
// RLS-locked to Michael's email. The publishable key is safe in the client.
const url = 'https://fhfempisopwsdkmvywbt.supabase.co'
const anonKey = 'sb_publishable_MDxQPm0SzLHFTnDqg-eyyQ_0yposnES'

export const supabase = createClient(url, anonKey, {
  auth: { persistSession: true, autoRefreshToken: true },
})

export const TRIP_SLUG = 'albania-2026'
export const EDITOR_EMAIL = 'mihael.florian@gmail.com'
