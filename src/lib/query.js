// src/lib/query.js

// ──────────────────────────────────────────────────────────────
// URL → 화면 파라미터 파싱
// ──────────────────────────────────────────────────────────────
export function parseQuery(search, maxPerfumeId) {
  const raw = search ?? window.location.search;
  const s = typeof raw === "string" ? raw.replace(/^\?/, "") : "";
  const sp = new URLSearchParams(s);

  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));
  const toIntOrNull = (v) => {
    if (v === null || v === undefined || v === "") return null;
    const n = parseInt(v, 10);
    return Number.isFinite(n) ? n : null;
  };

  // perfume: 1 ~ maxPerfumeId (기본 1)
  let perfume = parseInt(sp.get("perfume") ?? "1", 10);
  perfume = Number.isFinite(perfume) ? clamp(perfume, 1, maxPerfumeId) : 1;

  // 노트 값: 0~100 (기본 30/40/30)
  const toPct = (k, d) => {
    const n = parseInt(sp.get(k) ?? String(d), 10);
    return Number.isFinite(n) ? clamp(n, 0, 100) : d;
  };
  const top = toPct("top", 30);
  const middle = toPct("middle", 40);
  const base = toPct("base", 30);

  // 새 파라미터까지 모두 전달 (문자/코드 동시 지원)
  const params = {
    // 기존 문자열 파라미터(호환)
    gender: sp.get("gender") ?? "unspecified",
    age: sp.get("age") ?? "20s",

    // 새 필드들 (문자/코드 동시 지원)
    mbti: (sp.get("mbti") || "").toUpperCase() || null,      // 예: INFP
    personality: toIntOrNull(sp.get("personality")),         // 예: 4 (→ MBTI 매핑에 사용)

    gender_id: toIntOrNull(sp.get("gender_id")),             // 1=M, 2=F
    age_id: toIntOrNull(sp.get("age_id")),                   // 1=10s, 2=20s ...

    fashion: sp.get("fashion"),                              // 예: "Casual" / "캐주얼"
    fashion_id: toIntOrNull(sp.get("fashion_id")),           // 예: 1

    pref_color: sp.get("pref_color"),                        // 예: "Pink"
    pref_color_id: toIntOrNull(sp.get("pref_color_id")),     // 예: 2

    purpose: sp.get("purpose"),                               // 예: "good_impression"
    purpose_id: toIntOrNull(sp.get("purpose_id")),           // 예: 5
    pref_scent: toIntOrNull(sp.get("pref_scent")),           // 선호향 코드(→ purpose 유추용)

    category: sp.get("category"),                            // 예: "Floral"
    category_id: toIntOrNull(sp.get("category_id")),         // 예: 5

    // 노트 3종
    top, middle, base,
  };

  return { perfume, params };
}

// ──────────────────────────────────────────────────────────────
// 예시 URL 생성(옵션형, “대안 2” 구현)
// ──────────────────────────────────────────────────────────────
export function buildSampleUrl(opts = {}) {
  const cur = new URL(window.location.href);
  const defaults = {
    path: "/result",
    perfume: Number(cur.searchParams.get("perfume")) || 1,
    lang: cur.searchParams.get("lang") || "en",         // 1~N
    gender_id: 2,        // 1=M, 2=F
    age_id: 3,           // 1=10s, 2=20s, 3=30s...
    mbti: "INFP",
    // personality: 4,   // (원하면 사용)
    fashion_id: 1,       // Casual
    pref_color_id: 2,    // Pink
    purpose_id: 5,       // Date or Social
    category_id: 5,      // Floral
    top: 70, middle: 40, base: 20,
    params: {},          // 추가 커스텀 쿼리 병합용
    relative: false,     // true면 origin 제외하고 경로만 반환
  };
  const o = { ...defaults, ...opts };

  const u = new URL(window.location.href);
  if (o.path) u.pathname = o.path;
  u.search = ""; // 기존 쿼리 초기화

  const entries = {
    perfume: o.perfume,
    gender_id: o.gender_id,
    age_id: o.age_id,
    mbti: o.mbti,
    // personality: o.personality,
    fashion_id: o.fashion_id,
    pref_color_id: o.pref_color_id,
    purpose_id: o.purpose_id,
    category_id: o.category_id,
    top: o.top, middle: o.middle, base: o.base,
    lang: o.lang,
    ...o.params, // 커스텀 쿼리 병합
  };

  Object.entries(entries).forEach(([k, v]) => {
    if (v !== undefined && v !== null && `${v}` !== "") {
      u.searchParams.set(k, `${v}`);
    }
  });

  return o.relative
    ? `${u.pathname}?${u.searchParams.toString()}`
    : u.toString();
}
