// app.js - Tarayıcı uyumlu versiyon (export kaldırıldı)

function escapeHtml(s) {
    return String(s).replace(/[&<>\"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": "&#39;" })[c]);
}

function currentPermission() {
    return Number(sessionStorage.getItem('atommod_permission') || 0);
}

const baseUrl = 'http://localhost:5001';

// ========================
// KENDİ SUPABASE BİLGİLERİNİ BURAYA YAZ
// ========================
const defaultSupabaseUrl = 'https://kdvvvldbetjthldhodab.supabase.co';   // ← Değiştir

const defaultSupabaseAnon = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtkdnZ2bGRiZXRqdGhsZGhvZGFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUwNjA3NDIsImV4cCI6MjA5MDYzNjc0Mn0.o0WFi9ZYYGkInwFccMruvGYShAO_tQUpMKh_FqLgqBA';  // ← Değiştir

function setSupabaseConfig(url, anonKey) {
    if (url) sessionStorage.setItem('atommod_supabase_url', url);
    if (anonKey) sessionStorage.setItem('atommod_supabase_anon', anonKey);
}

// Global olarak erişilebilir yapıyoruz
window.atommodApp = {
    escapeHtml: escapeHtml,
    currentPermission: currentPermission,
    baseUrl: baseUrl,
    setSupabaseConfig: setSupabaseConfig,
    defaultSupabaseUrl: defaultSupabaseUrl,
    defaultSupabaseAnon: defaultSupabaseAnon
};

console.log('✅ AtomMod app.js yüklendi. Supabase ayarları hazır.');