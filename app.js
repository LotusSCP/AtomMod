// Shared functions (not used by all pages in this simple example)
function escapeHtml(s) { return String(s).replace(/[&<>\"']/g, (c) => ({ '&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":"&#39;" })[c]); }

// Example: read permission from sessionStorage
function currentPermission(){ return Number(sessionStorage.getItem('atommod_permission')||0); }

// Base URL config
const baseUrl = 'http://localhost:5001';

export { escapeHtml, currentPermission, baseUrl };