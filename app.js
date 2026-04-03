// Shared functions (not used by all pages in this simple example)
function escapeHtml(s) { return String(s).replace(/[&<>\"']/g, (c) => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;" })[c]); }

// Example: read permission from sessionStorage
function currentPermission(){ return Number(sessionStorage.getItem('atommod_permission')||0); }

// Base URL config
const baseUrl = 'http://localhost:5001';

// Default Supabase settings for static site (anon key only, safe for read-only)
// NOTE: These values are public for the site; do NOT put service_role keys here.
const defaultSupabaseUrl = 'https://kdvvvldbetjthldhodab.supabase.co';
const defaultSupabaseAnon = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtkdnZ2bGRiZXRqdGhsZGhvZGFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUwNjA3NDIsImV4cCI6MjA5MDYzNjc0Mn0.o0WFi9ZYYGkInwFccMruvGYShAO_tQUpMKh_FqLgqBA';

function setSupabaseConfig(url, anonKey) {
  if (url) sessionStorage.setItem('atommod_supabase_url', url);
  if (anonKey) sessionStorage.setItem('atommod_supabase_anon', anonKey);
}

window.atommodApp = {
  escapeHtml: escapeHtml,
  currentPermission: currentPermission,
  baseUrl: baseUrl,
  setSupabaseConfig: setSupabaseConfig,
  defaultSupabaseUrl: defaultSupabaseUrl,
  defaultSupabaseAnon: defaultSupabaseAnon
};
export { escapeHtml, currentPermission, baseUrl };