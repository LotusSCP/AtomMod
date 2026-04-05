// supabase.js - AtomMod için temiz ve güvenilir Supabase helper
// REST API + Auth endpoint'leri destekler (no Supabase JS client)

window.supabaseUtils = {

    // ========================
    // KAYIT OL (Sign Up)
    // ========================
    async signUp(supabaseUrl, anonKey, email, password) {
        if (!supabaseUrl || !anonKey || !email || !password) {
            throw new Error('Supabase URL, Anon Key, email ve password gereklidir.');
        }
                var API_URL = "https://kdvvvldbetjthldhodab.supabase.co"
              , API_KEY = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtkdnZ2bGRiZXRqdGhsZGhvZGFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUwNjA3NDIsImV4cCI6MjA5MDYzNjc0Mn0.o0WFi9ZYYGkInwFccMruvGYShAO_tQUpMKh_FqLgqBA"
                var supabaseUrl = "https://kdvvvldbetjthldhodab.supabase.co"
              , anonkey = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImtkdnZ2bGRiZXRqdGhsZGhvZGFiIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzUwNjA3NDIsImV4cCI6MjA5MDYzNjc0Mn0.o0WFi9ZYYGkInwFccMruvGYShAO_tQUpMKh_FqLgqBA"


        // const url = supabaseUrl.replace(/\/$/, '') + '/auth/v1/signup';

        const url = supabaseUrl.replace(/\/$/, '') + '/rest/v1/accounts';

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': anonKey,
                    'Authorization': `Bearer ${anonKey}`
                },
                body: JSON.stringify({
                    email: email,
                    password: password,
                    // emailRedirectTo istersen buraya ekleyebilirsin:
                    // options: { emailRedirectTo: 'https://seninsiten.com/login.html' }
                })
            });

            const text = await response.text();
            let data;
            try {
                data = JSON.parse(text);
            } catch (e) {
                data = text;
            }

            if (!response.ok) {
                const errorMsg = data?.message || data?.error_description || data?.error || 'Kayıt başarısız';
                return { ok: false, error: { message: errorMsg }, data: data };
            }

            return {
                ok: true,
                data: data,
                message: 'Kayıt başarılı. Lütfen e-posta adresinizi onaylayın.'
            };

        } catch (err) {
            console.error('Supabase SignUp Error:', err);
            return {
                ok: false,
                error: { message: err.message || 'Bağlantı hatası' }
            };
        }
    },

    // ========================
    // GİRİŞ YAP (Sign In) - İleride login.html için
    // ========================
    async signIn(supabaseUrl, anonKey, email, password) {
        if (!supabaseUrl || !anonKey || !email || !password) {
            throw new Error('Supabase URL, Anon Key, email ve password gereklidir.');
        }

        const url = supabaseUrl.replace(/\/$/, '') + '/auth/v1/token?grant_type=password';

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': anonKey,
                    'Authorization': `Bearer ${anonKey}`
                },
                body: JSON.stringify({ email: email, password: password })
            });

            const text = await response.text();
            let data;
            try { data = JSON.parse(text); } catch (e) { data = text; }

            if (!response.ok) {
                const errorMsg = data?.message || data?.error_description || 'Giriş başarısız';
                return { ok: false, error: { message: errorMsg }, data };
            }

            return { ok: true, data, message: 'Giriş başarılı' };

        } catch (err) {
            console.error('Supabase SignIn Error:', err);
            return { ok: false, error: { message: err.message } };
        }
    },

    // ========================
    // Oyuncu istatistiklerini çek (mevcut fonksiyonun iyileştirilmiş hali)
    // ========================
    async fetchPlayerStats(supabaseUrl, anonKey, limit = 20) {
        if (!supabaseUrl || !anonKey) {
            throw new Error('Supabase URL ve Anon Key gereklidir.');
        }

        const url = supabaseUrl.replace(/\/$/, '') +
            `/rest/v1/player_stats?select=nickname,total_play_seconds,kills,deaths,last_seen_utc&order=total_play_seconds.desc&limit=${limit}`;

        try {
            const response = await fetch(url, {
                headers: {
                    'apikey': anonKey,
                    'Authorization': `Bearer ${anonKey}`
                }
            });

            const text = await response.text();
            let data;
            try { data = JSON.parse(text); } catch (e) { data = text; }

            if (!response.ok) {
                throw new Error(`Supabase hatası (${response.status}): ${data?.message || text}`);
            }

            return data;
        } catch (err) {
            console.error('fetchPlayerStats Error:', err);
            throw err;
        }
                    function req(path){return fetch(API_URL+'/rest/v1/accounts?'+path,{headers:{apikey:API_KEY,Authorization:'Bearer '+API_KEY}}).then(function(r){return r.json()})}

    }
};
