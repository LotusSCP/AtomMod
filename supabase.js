// supabase.js - Güncel Versiyon

window.supabaseUtils = {

    // ========================
    // KAYIT OL
    // ========================
async signUp(supabaseUrl, anonKey, username, password) {
    if (!supabaseUrl || !anonKey || !username || !password) {
        throw new Error('Eksik bilgi');
    }

    const url = supabaseUrl.replace(/\/$/, '') + '/rest/v1/accounts';

    try {
        const response = await fetch(url, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'apikey': anonKey,
                'Authorization': `Bearer ${anonKey}`,   // ← Bu satır sorunlu
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
            console.error("Supabase Response:", response.status, data);
            return { ok: false, error: { message: data?.message || data?.error || 'Kayıt başarısız' } };
        }

        return { ok: true, message: 'Kayıt başarılı!' };
    } catch (err) {
        console.error('SignUp Error:', err);
        return { ok: false, error: { message: err.message } };
    }
}

    // ========================
    // GİRİŞ YAP (Şifre Kontrolü)
    // ========================
    async login(supabaseUrl, anonKey, username, password) {
        if (!supabaseUrl || !anonKey || !username || !password) {
            return { ok: false, error: { message: 'Eksik bilgi' } };
        }

        const url = supabaseUrl.replace(/\/$/, '') + '/rest/v1/accounts?select=permission,username&username=eq.' + encodeURIComponent(username);

        try {
            const response = await fetch(url, {
                headers: {
                    'apikey': anonKey,
                    'Authorization': `Bearer ${anonKey}`
                }
            });

            const data = await response.json();

            if (!response.ok || !data || data.length === 0) {
                return { ok: false, error: { message: 'Kullanıcı adı veya şifre yanlış!' } };
            }

            const user = data[0];

            // Basit şifre karşılaştırması (gerçek projede hash kullanılmalı)
            if (user.password !== password) {
                return { ok: false, error: { message: 'Kullanıcı adı veya şifre yanlış!' } };
            }

            return {
                ok: true,
                permission: user.permission || 0,
                username: user.username
            };
        } catch (err) {
            return { ok: false, error: { message: 'Bağlantı hatası' } };
        }
    },

    // ========================
    // PERMISSION KONTROLÜ (JWT ile)
    // ========================
    async getUserPermission(supabaseUrl, anonKey) {
        const token = sessionStorage.getItem('supabase_access_token');
        if (!token) return 0;

        const url = supabaseUrl.replace(/\/$/, '') + '/rest/v1/accounts?select=permission';

        try {
            const response = await fetch(url, {
                headers: {
                    'apikey': anonKey,
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) return 0;
            const data = await response.json();
            return data && data.length > 0 ? (data[0].permission || 0) : 0;
        } catch (err) {
            console.error('Permission hatası:', err);
            return 0;
        }
    }
};

// ========================
// SUNUCU KOMUT GÖNDERME
// ========================
async function sendServerCommand(command, args = '') {
    const baseUrl = window.atommodApp?.baseUrl || 'https://atommod.mcsunucun.com:29075';
    
    try {
        const res = await fetch(`${baseUrl}/api/command`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ command, args: args || '' })
        });

        if (!res.ok) {
            const errorText = await res.text().catch(() => 'Sunucu hatası');
            throw new Error(errorText);
        }

        const text = await res.text();
        return { ok: true, message: text || 'Komut gönderildi.' };
    } catch (err) {
        return { ok: false, message: 'Sunucuya bağlanılamadı.<br>Hata: ' + err.message };
    }
}

window.sendServerCommand = sendServerCommand;
console.log('✅ supabase.js yüklendi - Login + Permission + Command hazır');
