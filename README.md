# AtomMod
# AtomMod - EXILED Plugin + Web Panel (Supabase supported)

---

## Türkçe / Turkish

### Kısa özet

AtomMod, SCP:SL için EXILED uyumlu bir plugin ve basit bir web panel (statik HTML / örnek Blazor uyumluluğu) sağlar. Plugin oyuncu listesini `/status` ile sunar, kayıt/giriş (`register`/`login`) uç noktaları içerir ve isteğe bağlı olarak Supabase ile hesap/istatistik senkronizasyonu yapar.

### Özellikler
- EXILED uyumlu plugin (hedef: .NET Framework 4.8)
- `/status`, `/register`, `/login` HTTP endpointleri
- `Accounts.yml` veya Supabase (`UseSupabase`) ile hesap yönetimi
- Oyuncu istatistiklerini Supabase `player_stats` tablosuna ekleyebilme (join/leave ile upsert)
- Basit statik web örnekleri (`AtomModWeb/static`)

### Gereksinimler
- SCP:SL sunucusu + EXILED (uygun sürüm)
- .NET Framework 4.8 (plugin için derleme hedefi)
- (Opsiyonel) Supabase hesabı (Proje URL ve `service_role` veya `anon` key)

### Dosya / proje yapısı (önemli)
- `AtomMod/Plugin.cs` — EXILED plugin ve HTTP listener
- `AtomMod/Config.cs` — plugin ayarları (`UseSupabase`, `SupabaseUrl`, `SupabaseKey`, `ApiSite`, vs.)
- `AtomMod/ExiledBridge.cs` — oyuncu liste köprüsü (EXILED event -> plugin)
- `AtomModPlugin/AtomModPlugin.csproj` — örnek `net48` csproj (kaynakları `AtomMod` içinden derler)
- `AtomModWeb/static` — statik web örnekleri (`index`, `login`, `register`, `status`, `supabase_example.html`)
- `AtomModRequest` — yardımcı HTTP client kodları

### Supabase yapılandırması

1) Supabase proje oluşturun
   - https://supabase.com
   - Project URL -> `SupabaseUrl`
   - Project API -> `anon public key` (sadece web read), `service_role` (sunucu yazma).

2) SQL Editor → aşağıdaki sorguları çalıştırın (SQL Editor -> New query -> Run):

accounts tablosu (kullanıcılar)

```sql
create table if not exists accounts (
  username text primary key,
  password text not null,
  permission integer not null default 1
);
```

player_stats tablosu (istatistikler)

```sql
create table if not exists player_stats (
  nickname text primary key,
  total_play_seconds integer not null default 0,
  kills integer not null default 0,
  deaths integer not null default 0,
  last_seen_utc timestamptz not null default now()
);
```

**(İsteğe bağlı)** RLS (Row Level Security) ve policy
- Hızlı test için RLS kapatabilirsiniz. Production için RLS + uygun policy'ler veya sadece `service_role` kullanın.

### Plugin konfigürasyonu
- `AtomMod/Config.cs` içindeki alanları ayarlayın:
  - `UseSupabase = true` (Supabase kullanmak için)
  - `SupabaseUrl` ve `SupabaseKey` (`service_role` key tavsiye edilir, sunucuda saklayın)
  - `DisableSendingRequestTokenKey`, `ApiSite`, `YourNormalSite` ve diğerleri.

### Derleme ve deploy

1) Plugin derleme (local):
   - Visual Studio ile `AtomModPlugin/AtomModPlugin.csproj` projesini açın veya `dotnet` ile derleyin.
   - Hedef: `net48`, `DefineConstants: EXILED` (projede örnek olarak ayarlı).
   - Çıktı: `AtomMod.dll` (veya belirtilen assembly name) oluşur.

2) Sunucuya yükleme:
   - Oluşan DLL'i SCP:SL sunucunuzdaki `EXILED/Plugins` klasörüne kopyalayın.
   - Gerekirse bağımlılıkları (Newtonsoft.Json vb.) `EXILED/Plugins/dependencies` içine koyun.
   - Sunucuyu yeniden başlatın.

3) Plugin çalıştığında loglarda plugin `OnEnabled`/başlangıç mesajlarını kontrol edin.

### HTTP endpointleri
- `GET /status` → `{ count, players[] }`
- `POST /register` → body: `{ username, password, [permission] }` → local `Accounts.yml` veya Supabase'e kaydeder
- `POST /login` → body: `{ username, password }` → doğrular, `{ result: "ok", permission: N }` döner veya 401

### Supabase REST örnekleri
- Read (anon):
  `GET https://<proj>.supabase.co/rest/v1/player_stats?select=nickname,total_play_seconds&order=total_play_seconds.desc&limit=10`
  Headers: `apikey: <ANON_KEY>`
           `Authorization: Bearer <ANON_KEY>`

- Upsert (sunucu / service_role):
  `POST https://<proj>.supabase.co/rest/v1/player_stats?on_conflict=nickname`
  Headers: `apikey: <SERVICE_ROLE_KEY>`
           `Authorization: Bearer <SERVICE_ROLE_KEY>`
  Body: `[{"nickname":"Player1","last_seen_utc":"2026-04-01T12:00:00Z"}]`

### Güvenlik önerileri (önemli)
- `service_role` key asla istemci (tarayıcı) tarafına konulmamalıdır.
- Şifreleri SHA256 yerine bcrypt/argon2 ile hashleyin. (Kodda SHA256 hızlı örnek olarak var; istersen bcrypt'e geçiririm.)
- Mümkünse Supabase Auth (GoTrue) kullanın — Supabase kendi Auth sistemini sunar ve user management sağlar.
- CORS ve HTTPS yapılandırmasını doğru yapın.

### Web (statik) örnekleri
- `AtomModWeb/static/index.html` — ana sayfa
- `AtomModWeb/static/login.html`, `register.html`, `status.html` — basit frontend
- `AtomModWeb/static/supabase_example.html` — anon key ile read-only Supabase örneği

### Blazor notu
- Reposunda Blazor projesi bulunduğu için istersen Blazor WASM bileşeniyle Supabase'den veri çekip görselleştiren bir sayfa hazırlayabilirim. (Blazor WASM için JS interop veya doğrudan `fetch` kullanılabilir — anon key ile read-only).

---

## English

### Summary

AtomMod is an EXILED-compatible plugin for SCP:SL with a simple web panel (static HTML and example Blazor support). The plugin exposes `/status`, supports account `register`/`login` endpoints and can optionally sync accounts and player statistics to Supabase.

### Features
- EXILED-compatible plugin (target: .NET Framework 4.8)
- `/status`, `/register`, `/login` HTTP endpoints
- Account management via local `Accounts.yml` or Supabase (`UseSupabase`)
- Optionally sync player statistics to Supabase `player_stats` table (upsert on join/leave)
- Simple static web examples under `AtomModWeb/static`

### Requirements
- SCP:SL server + EXILED (compatible version)
- .NET Framework 4.8 (plugin build target)
- (Optional) Supabase project (project URL and `service_role` or `anon` key)

### Project layout
- `AtomMod/Plugin.cs` — EXILED plugin and HTTP listener
- `AtomMod/Config.cs` — plugin settings (`UseSupabase`, `SupabaseUrl`, `SupabaseKey`, `ApiSite`, etc.)
- `AtomMod/ExiledBridge.cs` — bridge for player list updates from EXILED events
- `AtomModPlugin/AtomModPlugin.csproj` — example `net48` csproj
- `AtomModWeb/static` — static web examples
- `AtomModRequest` — helper HTTP client code

### Supabase setup

1) Create a Supabase project
   - https://supabase.com
   - Project URL -> `SupabaseUrl`
   - Project API -> `anon public key` (for web read), `service_role` (for server write)

2) In SQL Editor run the following queries:

Accounts table

```sql
create table if not exists accounts (
  username text primary key,
  password text not null,
  permission integer not null default 1
);
```

Player stats table

```sql
create table if not exists player_stats (
  nickname text primary key,
  total_play_seconds integer not null default 0,
  kills integer not null default 0,
  deaths integer not null default 0,
  last_seen_utc timestamptz not null default now()
);
```

**Optional**: RLS (Row Level Security) and policies
- For quick testing you can allow public reads; for production use RLS + policies or rely on `service_role` for server writes.

### Plugin configuration
- Edit `AtomMod/Config.cs`:
  - `UseSupabase = true` to enable Supabase
  - `SupabaseUrl` and `SupabaseKey` (`service_role` recommended; keep it secure on server)
  - `DisableSendingRequestTokenKey`, `ApiSite`, `YourNormalSite`, etc.

### Build & deploy

1) Build plugin locally:
   - Open `AtomModPlugin/AtomModPlugin.csproj` in Visual Studio or build with `dotnet`.
   - Target: `net48`, define `EXILED` compilation symbol.
   - Output: `AtomMod.dll`.

2) Deploy to server:
   - Copy DLL into server `EXILED/Plugins` folder.
   - Place dependencies (e.g. `Newtonsoft.Json.dll`) into `EXILED/Plugins/dependencies` if required.
   - Restart the server.

3) Check server logs for `OnEnabled` / startup messages from the plugin.

### HTTP endpoints
- `GET /status` → `{ count, players[] }`
- `POST /register` → body: `{ username, password, [permission] }` → stores to local `Accounts.yml` or Supabase
- `POST /login` → body: `{ username, password }` → validates and returns `{ result: "ok", permission: N }` or 401

### Supabase REST examples
- Read (anon):
  `GET https://<proj>.supabase.co/rest/v1/player_stats?select=nickname,total_play_seconds&order=total_play_seconds.desc&limit=10`
  Headers: `apikey: <ANON_KEY>`
           `Authorization: Bearer <ANON_KEY>`

- Upsert (server/service_role):
  `POST https://<proj>.supabase.co/rest/v1/player_stats?on_conflict=nickname`
  Headers: `apikey: <SERVICE_ROLE_KEY>`
           `Authorization: Bearer <SERVICE_ROLE_KEY>`
  Body: `[{"nickname":"Player1","last_seen_utc":"2026-04-01T12:00:00Z"}]`

### Security recommendations
- Never expose `service_role` key to clients.
- Use bcrypt/argon2 for password hashing instead of SHA256. (I can migrate code to bcrypt.)
- Consider using Supabase Auth (GoTrue) to manage users instead of manual password storage.
- Configure CORS and HTTPS correctly.

### Web examples
- `AtomModWeb/static/index.html` — main page
- `AtomModWeb/static/login.html`, `register.html`, `status.html` — simple frontend
- `AtomModWeb/static/supabase_example.html` — read-only example with anon key

### Blazor note
- Since the repo contains a Blazor project, I can add a Blazor WASM component to fetch and display Supabase data (using JS interop or `fetch` with anon key for read-only).

### Next steps (optional)
- Migrate SHA256 → bcrypt on server side (recommended).
- Use Supabase Auth for signup/login flow.
- Add Blazor components (player list / admin panel).
- Add a serverless API (Vercel/Azure) to mediate plugin → Supabase for extra security.

### Help / What next?
Which task should I do next?
- "bcrypt" — switch to secure password hashing.
- "Supabase Auth" — migrate auth flow to Supabase Auth.
- "Blazor example" — add Blazor component (WASM or Server).
- "Add SQL files" — add SQL files to the repo.

