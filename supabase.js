// supabase.js
window.supabaseUtils = {

    async signUp(supabaseUrl, anonKey, username, password) {
        const url = supabaseUrl.replace(/\/$/, '') + '/rest/v1/accounts';
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
                email: null   // nullable yaptık
            })
        });
        // ... (geri kalan kod aynı)
    },

    // ========================
    // SUNUCU DURUMU (Supabase'den)
    // ========================
    async fetchServerStatus(supabaseUrl, anonKey) {
        const url = supabaseUrl.replace(/\/$/, '') +
            `/rest/v1/player_stats?select=nickname,steam_id,total_play_seconds,kills,deaths,last_seen_utc,server_ip,server_number,server_name&order=last_seen_utc.desc`;

        const res = await fetch(url, {
            headers: { 'apikey': anonKey, 'Authorization': `Bearer ${anonKey}` }
        });
        const data = await res.json();
        return data || [];
    },

    // ========================
    // BAN - KICK - KOMUT (Plugin'e gidiyor)
    // ========================
    async banPlayer(baseUrl, username, reason = "Site üzerinden banlandı", adminUsername = "") {
        return await fetch(baseUrl + '/ban', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, reason, admin: adminUsername })
        });
    },

    async kickPlayer(baseUrl, username, reason = "Site üzerinden kicklendi", adminUsername = "") {
        return await fetch(baseUrl + '/kick', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ username, reason, admin: adminUsername })
        });
    },

    async sendCommand(baseUrl, command, adminUsername = "") {
        return await fetch(baseUrl + '/command', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ command, admin: adminUsername })
        });
    }
};
