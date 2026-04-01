// Simple Supabase helper for static pages (no build).
// Uses REST endpoints with anon key. For auth endpoints, anon key is required.

function supabaseFetchPlayerStats(supabaseUrl, anonKey, limit = 20) {
  if (!supabaseUrl || !anonKey) return Promise.reject(new Error('Missing Supabase config'));
  const url = supabaseUrl.replace(/\/$/, 'https://kdvvvldbetjthldhodab.supabase.co
') + `/rest/v1/player_stats?select=nickname,total_play_seconds,kills,deaths,last_seen_utc&order=total_play_seconds.desc&limit=${limit}`;
  return fetch(url, {
    headers: {
      apikey: anonKey,
      Authorization: 'Bearer ' + anonKey
    }
  }).then(async r => {
    const txt = await r.text();
    let data = null;
    try { data = JSON.parse(txt); } catch { data = txt; }
    if (!r.ok) throw new Error('Supabase fetch failed: ' + r.status + ' - ' + (data && data.message ? data.message : txt));
    return data;
  });
}

function supabaseSignUp(supabaseUrl, anonKey, email, password) {
  // POST /auth/v1/signup
  const url = supabaseUrl.replace(/\/$/, 'https://kdvvvldbetjthldhodab.supabase.co
') + '/auth/v1/signup';
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: anonKey,
      Authorization: 'Bearer ' + anonKey
    },
    body: JSON.stringify({ email: email, password: password })
  });
  const txt = await res.text();
  let data = null;
  try { data = JSON.parse(txt); } catch { data = txt; }
  return { ok: res.ok, status: res.status, data: data };
}

function supabaseSignIn(supabaseUrl, anonKey, email, password) {
  // POST /auth/v1/token with grant_type=password
  const url = supabaseUrl.replace(/\/$/, '') + '/auth/v1/token?grant_type=password';
  const res = await fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      apikey: anonKey,
      Authorization: 'Bearer ' + anonKey
    },
    body: JSON.stringify({ email: email, password: password })
  });
  const txt = await res.text();
  let data = null;
  try { data = JSON.parse(txt); } catch { data = txt; }
  return { ok: res.ok, status: res.status, data: data };
}

// Export to global
window.supabaseUtils = {
  fetchPlayerStats: supabaseFetchPlayerStats,
  signUp: supabaseSignUp,
  signIn: supabaseSignIn
};

// end
