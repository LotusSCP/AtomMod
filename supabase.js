// supabase.js - AtomMod için temiz ve güvenilir Supabase helper
// REST API + Auth endpoint'leri destekler (no Supabase JS client)

// supabase.js - AtomMod için temizlenmiş ve düzeltilmiş versiyon (Sadece accounts tablosuna kayıt)

window.supabaseUtils = {

    // ========================
    // KAYIT OL - accounts tablosuna username ile yazıyor
    // ========================
    async signUp(supabaseUrl, anonKey, username, password) {
        if (!supabaseUrl || !anonKey || !username || !password) {
            throw new Error('Supabase URL, Anon Key, username ve password gereklidir.');
        }

        const url = supabaseUrl.replace(/\/$/, '') + '/rest/v1/accounts';

        try {
            const response = await fetch(url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'apikey': anonKey,
                    'Authorization': `Bearer ${anonKey}`,
                    'Prefer': 'resolution=merge-duplicates'
                },
                body: JSON.stringify({
                    username: username,
                    password: password,
                    permission: 1
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
                const errorMsg = data?.message || data?.error || data?.details || 'Kayıt başarısız';
                console.error('Supabase SignUp Error:', errorMsg);
                return { ok: false, error: { message: errorMsg }, data: data };
            }

            return {
                ok: true,
                data: data,
                message: 'Kayıt başarılı!'
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
    // GİRİŞ YAP (Şimdilik backend üzerinden yapılacak)
    // ========================
    async signIn(supabaseUrl, anonKey, username, password) {
        throw new Error('Giriş için backend (/login) kullanılmalıdır.');
    },

    // ========================
    // Oyuncu İstatistikleri Çek
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

            return data || [];
        } catch (err) {
            console.error('fetchPlayerStats Error:', err);
            throw err;
        }
    }
};
