// Simple Supabase helper for static pages (no build).
// Uses REST endpoints with anon key. For auth endpoints, anon key is required.

function supabaseFetchPlayerStats(supabaseUrl, anonKey, limit = 20) {
  if (!supabaseUrl || !anonKey) return Promise.reject(new Error('Missing Supabase config'));
  const url = supabaseUrl.replace(/\/$/, '') + `/rest/v1/player_stats?select=nickname,total_play_seconds,kills,deaths,last_seen_utc&order=total_play_seconds.desc&limit=${limit}`;
  return fetch(url, {
    headers: {
      apikey: anonKey,
      Authorization: 'Bearer ' + anonKey
    }
  }).then(r => { if (!r.ok) throw new Error('status ' + r.status); return r.json(); });
}

function supabaseSignUp(supabaseUrl, anonKey, email, password) {
  // POST /auth/v1/signup
  const url = supabaseUrl.replace(/\/$/, '') + '/auth/v1/signup';
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: anonKey,
      Authorization: 'Bearer ' + anonKey
    },
    body: JSON.stringify({ email: email, password: password })
  }).then(async r => {
    const txt = await r.text();
    try { return JSON.parse(txt); } catch { return { status: r.status, body: txt }; }
  });
}

function supabaseSignIn(supabaseUrl, anonKey, email, password) {
  // POST /auth/v1/token with grant_type=password
  const url = supabaseUrl.replace(/\/$/, '') + '/auth/v1/token?grant_type=password';
  return fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: anonKey,
      Authorization: 'Bearer ' + anonKey
    },
    body: JSON.stringify({ email: email, password: password })
  }).then(async r => {
    const txt = await r.text();
    try { return JSON.parse(txt); } catch { return { status: r.status, body: txt }; }
  });
}

// Export to global
window.supabaseUtils = {
  fetchPlayerStats: supabaseFetchPlayerStats,
  signUp: supabaseSignUp,
  signIn: supabaseSignIn
};

// end
