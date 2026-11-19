// Konfigurasi Supabase
const SUPABASE_URL = "https://kjkadsfuvoomfxytccqm.supabase.co";

const SUPABASE_PUBLISHABLE_KEY = "sb_publishable_kQKnpRyOePaNmDkHGA3-lw_OfoDoYL_";

// Membuat koneksi Supabase
const supabaseClient = window.supabase.createClient(
  SUPABASE_URL,
  SUPABASE_PUBLISHABLE_KEY
);
