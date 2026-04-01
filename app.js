// Shared functions (not used by all pages in this simple example)
function escapeHtml(s) { return String(s).replace(/[&<>\"']/g, (c) => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;" })[c]); }

// Example: read permission from sessionStorage
function currentPermission(){ return Number(sessionStorage.getItem('atommod_permission')||0); }

// Base URL config
const baseUrl = 'http://localhost:5001';

function setSupabaseConfig(url, anonKey) {
  if (url) sessionStorage.setItem('atommod_supabase_url', url);
  if (anonKey) sessionStorage.setItem('atommod_supabase_anon', anonKey);
}

window.atommodApp = {
  escapeHtml: escapeHtml,
  currentPermission: currentPermission,
  baseUrl: baseUrl,
  setSupabaseConfig: setSupabaseConfig
};
export { escapeHtml, currentPermission, baseUrl };