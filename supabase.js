// supabase.js - AtomMod Supabase + Web API (Güncel)

window.supabaseUtils = {

    // ========================
    // KAYIT OL (Supabase)
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
                    permission: 1,
                    email: null
                })
            });

            const text = await response.text();
            let data;
            try { data = JSON.parse(text); } catch (e) { data = text; }

            if (!response.ok) {
                const errorMsg = data?.message || data?.error || data?.details || 'Kayıt başarısız';
                console.error('Supabase SignUp Error:', errorMsg);
                return { ok: false, error: { message: errorMsg } };
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
    // SUNUCU DURUMU
    // ========================
    async fetchServerStatus(supabaseUrl, anonKey) {
        if (!supabaseUrl || !anonKey) {
            throw new Error('Supabase URL ve Anon Key gereklidir.');
        }

        const url = supabaseUrl.replace(/\/$/, '') +
            `/rest/v1/player_stats?select=nickname,steam_id,total_play_seconds,kills,deaths,last_seen_utc,server_ip,server_number&order=last_seen_utc.desc`;

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
            console.error('fetchServerStatus Error:', err);
            throw err;
        }
    }
};

// ========================
// SUNUCU KOMUT GÖNDERME (kontrol.html için)
// ========================
async function sendServerCommand(command, args = '') {
    const baseUrl = window.atommodApp?.baseUrl || 'https://atommod.mcsunucun.com:29075';
    
    try {
        const res = await fetch(`${baseUrl}/api/command`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ 
                command: command, 
                args: args || '' 
            })
        });

        if (!res.ok) {
            const errorText = await res.text().catch(() => 'Sunucu hatası');
            throw new Error(errorText);
        }

        const text = await res.text();
        return { ok: true, message: text || 'Komut başarıyla gönderildi.' };
    } catch (err) {
        console.error('sendServerCommand Error:', err);
        return { 
            ok: false, 
            message: 'Sunucuya bağlanılamadı.<br>Hata: ' + err.message 
        };
    }
}

// Global erişim
window.sendServerCommand = sendServerCommand;

console.log('✅ supabase.js yüklendi - signUp + sendServerCommand hazır.');
