// app.js - Tarayıcı uyumlu versiyon (export kaldırıldı)

function escapeHtml(s) {
    return String(s).replace(/[&<>\"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": "&#39;" })[c]);
}
// Giriş kontrolü (basit client-side)
function checkLoginStatus() {
    const isLoggedIn = localStorage.getItem('atommod_logged_in') === 'true'; // veya token kontrolü

    const loginLink = document.getElementById('loginLink');
    const registerLink = document.getElementById('registerLink');

    if (isLoggedIn) {
        if (loginLink) loginLink.style.display = 'none';
        if (registerLink) registerLink.style.display = 'none';
        
        // İsteğe bağlı: "Çıkış Yap" butonu ekleyebilirsin
    }
}

// Sayfa yüklendiğinde çalıştır
window.addEventListener('load', checkLoginStatus);

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
