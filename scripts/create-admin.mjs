// One-time admin account creator.
// Run with Node 20+ (loads .env natively):
//
//   node --env-file=.env scripts/create-admin.mjs
//
// Creates (or updates) the admin user in Supabase Auth with email confirmed,
// so you can log in at /login immediately. Change the password afterwards.
import { createClient } from '@supabase/supabase-js'

const url = process.env.NEXT_PUBLIC_SUPABASE_URL
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY
const email = process.env.ADMIN_EMAIL || 'admin@didifairy.com'
const password = process.env.ADMIN_PASSWORD || 'DidiAdmin@123'

if (!url || !serviceKey) {
  console.error('Missing NEXT_PUBLIC_SUPABASE_URL or SUPABASE_SERVICE_ROLE_KEY in .env')
  process.exit(1)
}

const supabase = createClient(url, serviceKey, {
  auth: { persistSession: false, autoRefreshToken: false },
})

const { data, error } = await supabase.auth.admin.createUser({
  email,
  password,
  email_confirm: true,
})

if (error) {
  if (/already registered|already exists/i.test(error.message)) {
    console.log(`Admin ${email} already exists — nothing to do.`)
    process.exit(0)
  }
  console.error('Failed to create admin:', error.message)
  process.exit(1)
}

console.log(`Admin created: ${email} (id: ${data.user.id})`)
