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

        const url = supabaseUrl.replace(/\/$/, '') + '/auth/v1/signup';

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
    }
};