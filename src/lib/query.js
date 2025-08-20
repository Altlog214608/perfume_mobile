// src/lib/query.js
export function parseQuery(search, maxPerfumeId) {
  const sp = new URLSearchParams(search);

  const clamp = (n, min, max) => Math.max(min, Math.min(max, n));

  // perfume: 1~N (기본 1)
  let perfume = parseInt(sp.get("perfume") ?? "1", 10);
  perfume = Number.isFinite(perfume) ? clamp(perfume, 1, maxPerfumeId) : 1;

  // 노트 값: 0~100 (기본 30/40/30)
  const toPct = (k, d) => {
    let v = parseInt(sp.get(k) ?? String(d), 10);
    return Number.isFinite(v) ? clamp(v, 0, 100) : d;
  };
  const top = toPct("top", 30);
  const middle = toPct("middle", 40);
  const base = toPct("base", 30);

  return {
    perfume,
    params: {
      gender: sp.get("gender") ?? "unspecified",
      age: sp.get("age") ?? "20s",
      color: sp.get("color") ?? "blue",
      style: sp.get("style") ?? "fresh",
      top, middle, base,
    },
  };
}

// 예시 URL 생성(로컬 테스트용)
export function buildSampleUrl(origin = window.location.origin, path = "/") {
  const qs = new URLSearchParams({
    perfume: "7",
    gender: "female",
    age: "30s",
    color: "blue",
    style: "fresh",
    top: "30",
    middle: "40",
    base: "30",
  }).toString();
  return `${origin}${path}?${qs}`;
}
