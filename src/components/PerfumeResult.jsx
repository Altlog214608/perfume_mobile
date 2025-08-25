import React, { useEffect, useMemo, useState } from "react";
import "../styles/frSmart.css";
import { parseQuery, buildSampleUrl } from "../lib/query";

import lemonula from "../assets/img/lemonula.png";
import flolarin from "../assets/img/flolarin.png";
import essentria from "../assets/img/essentria.png";
import lumina from "../assets/img/lumina.png";
import coolwater from "../assets/img/coolwater.png";
import maruit from "../assets/img/maruit.png";
import nectarua from "../assets/img/nectarua.png";
import croloys from "../assets/img/croloys.png";

import html2canvas from "html2canvas";


// hex 색상 → rgba 변환
const hexToRgba = (hex, alpha = 1) => {
  const c = hex.replace('#', '');
  const x = c.length === 3 ? c.split('').map(ch => ch + ch).join('') : c;
  const r = parseInt(x.slice(0, 2), 16);
  const g = parseInt(x.slice(2, 4), 16);
  const b = parseInt(x.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

// 1) i18n 사전 (컴포넌트 위)
const DICT = {
  en: {
    labels: {
      gender: "Gender", age: "Age", color: "Preferred Color", style: "Preferred Style",
      top: "Top Note", middle: "Middle Note", base: "Base Note"
    },
    title: "Best match for you",
    shareHashtags: (name) => `#perfume #${name}`,
    // 값 변환
    valueMaps: {
      gender: { female: "Female", male: "Male", unspecified: "Unspecified" },
      age: { "10s": "10s", "20s": "20s", "30s": "30s", "40s": "40s", "50s": "50s", "60s": "60s" },
      color: { red: "Red", orange: "Orange", yellow: "Yellow", green: "Green", blue: "Blue", navy: "Navy", purple: "Purple" },
      style: { fresh: "Fresh", sweet: "Sweet", romantic: "Romantic", sensual: "Sensual", urban: "Urban", cool: "Cool" },
    }
  },
  ko: {
    labels: {
      gender: "성별", age: "나이", color: "선호하는 색상", style: "선호하는 스타일",
      top: "탑노트", middle: "미들노트", base: "베이스노트"
    },
    title: "당신에게 어울리는",
    shareHashtags: (name) => `#향수추천 #${name}`,
    valueMaps: {
      gender: { female: "여자", male: "남자", unspecified: "미지정" },
      age: { "10s": "10대", "20s": "20대", "30s": "30대", "40s": "40대", "50s": "50대", "60s": "60대" },
      color: { red: "빨간색", orange: "주황색", yellow: "노란색", green: "초록색", blue: "파란색", navy: "남색", purple: "보라색" },
      style: { fresh: "시원함", sweet: "달콤함", romantic: "로맨틱", sensual: "관능적", urban: "도시적", cool: "시원함" },
    }
  }
};

const getLangFromURL = () => {
  try {
    const u = new URL(window.location.href);
    const l = u.searchParams.get('lang');
    return (l === 'en' || l === 'ko') ? l : null;
  } catch { return null; }
};

// const KOR = {
//   gender: { female: "여자", male: "남자", unspecified: "미지정" },
//   age: { "10s": "10대", "20s": "20대", "30s": "30대", "40s": "40대", "50s": "50대", "60s": "60대" },
//   color: { red: "빨간색", orange: "주황색", yellow: "노란색", green: "초록색", blue: "파란색", navy: "남색", purple: "보라색" },
//   style: { fresh: "시원함", sweet: "달콤함", romantic: "로맨틱", sensual: "관능적", urban: "도시적", cool: "시원함" },
// };

export default function PerfumeResult() {
  const data = useMemo(
    () => [
      {
        subTitle: "Lemonula",
        hash: { ko: ["에너지", "상큼함"], en: ["Energy", "Fresh"] },
        topNote: "Lemon", middleNote: "Rose", baseNote: "Amber",
        image: lemonula,
        colors: { overlapGroup: "#b28a00", overlap: "#e6c74c" }
      },
      {
        subTitle: "Flolarin",
        hash: { ko: ["달콤함", "상큼함"], en: ["Sweet", "Fresh"] },
        topNote: "Cucumber", middleNote: "Lavender", baseNote: "Cedarwood",
        image: flolarin,
        colors: { overlapGroup: "#b8721d", overlap: "#f7d08a" }
      },
      {
        subTitle: "Essentria",
        hash: { ko: ["플로럴", "로맨틱"], en: ["Floral", "Romantic"] },
        topNote: "Raspberry", middleNote: "Rose", baseNote: "Musk",
        image: essentria,
        colors: { overlapGroup: "#7c3fa6", overlap: "#d6b3f7" }
      },
      {
        subTitle: "Lumina",
        hash: { ko: ["신비적", "세련된"], en: ["Mystic", "Elegant"] },
        topNote: "Bergamot", middleNote: "Jasmine", baseNote: "Amber",
        image: lumina,
        colors: { overlapGroup: "#145c69", overlap: "#b97a2b" }
      },
      {
        subTitle: "Cool Water",
        hash: { ko: ["시원함", "남성적"], en: ["Cool", "Masculine"] },
        topNote: "Bergamot", middleNote: "Geranium", baseNote: "Vetiver",
        image: coolwater,
        colors: { overlapGroup: "#1a3a6b", overlap: "#4a7dc7" }
      },
      {
        subTitle: "Maruit",
        hash: { ko: ["도시적", "청량감"], en: ["Urban", "Refreshing"] },
        topNote: "Mint", middleNote: "Lavender", baseNote: "Sandalwood",
        image: maruit,
        colors: { overlapGroup: "#23446d", overlap: "#6bb0d6" }
      },
      {
        subTitle: "Nectarua",
        hash: { ko: ["관능적", "시원함"], en: ["Sensual", "Cool"] },
        topNote: "Mandarin", middleNote: "Rose", baseNote: "Amber",
        image: nectarua,
        colors: { overlapGroup: "#a86e1a", overlap: "#ffd07b" }
      },
      {
        subTitle: "Croloys",
        hash: { ko: ["관능적", "시원함"], en: ["Sensual", "Cool"] },
        topNote: "Marine", middleNote: "Sage", baseNote: "Musk",
        image: croloys,
        colors: { overlapGroup: "#132f5a", overlap: "#3559A6" }
      },
    ],
    []
  );


  // ...기존 state들...
  const cardRef = React.useRef(null);

  // 언어 상태
  const [lang, setLang] = useState(getLangFromURL() ?? 'en');
  const dict = DICT[lang];
  const valueMaps = dict.valueMaps;

  // 공유용: 스토리 이미지 퍼블릭 URL과 딥링크 시트 표시
  const [storyPublicUrl, setStoryPublicUrl] = useState(null);
  const [storySheetOpen, setStorySheetOpen] = useState(false);
  const closeStorySheet = () => setStorySheetOpen(false);

  // 전체 카드(향수~파라미터 끝) 이미지 저장
  const downloadCurrentImage = async () => {
    try {
      const root = cardRef.current;                 // 캡처할 대상
      if (!root || !html2canvas) {
        alert("화면 캡처 라이브러리가 아직 로드되지 않았어요. 잠시 후 다시 시도해주세요.");
        return;
      }
      // 스케일 2배로 선명하게, CORS 허용
      const canvas = await html2canvas(root, {
        backgroundColor: null,
        scale: window.devicePixelRatio > 1 ? 2 : 2,
        useCORS: true,
      });
      const dataUrl = canvas.toDataURL("image/png");
      const a = document.createElement("a");
      a.href = dataUrl;
      a.download = `${item.subTitle}.png`;
      document.body.appendChild(a);
      a.click();
      a.remove();
    } catch (e) {
      console.error(e);
      alert("이미지 저장 중 문제가 발생했습니다.");
    }
    // 바텀시트 열려 있었다면 닫기
    if (typeof closeShare === "function") closeShare();
  };

  const { perfume, params } = useMemo(
    () => parseQuery(window.location.search, data.length),
    [data.length]
  );
  const item = data[perfume - 1];

  const [showTitle, setShowTitle] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const [visibleRows, setVisibleRows] = useState([]);
  const [shareOpen, setShareOpen] = useState(false);
  const openShare = () => setShareOpen(true);
  const closeShare = () => setShareOpen(false);

  const rowOrder = ["gender", "age", "color", "style", "top", "middle", "base"];

  // 렌더 규칙 설정화: 여기에 항목을 추가/제거하면 화면이 바뀜
  const ROWS = [
    { type: "text", key: "gender", valueFrom: () => vGender },
    { type: "text", key: "age", valueFrom: () => vAge },
    { type: "text", key: "color", valueFrom: () => vColor },
    { type: "text", key: "style", valueFrom: () => vStyle },
    { type: "note", key: "top", valueFrom: () => Number(params.top) || 0 },
    { type: "note", key: "middle", valueFrom: () => Number(params.middle) || 0 },
    { type: "note", key: "base", valueFrom: () => Number(params.base) || 0 },
  ];

  useEffect(() => {
    setShowTitle(false);
    setShowImage(false);
    setVisibleRows([]);

    const t0 = setTimeout(() => setShowTitle(true), 50);
    const t1 = setTimeout(() => setShowImage(true), 350);

    rowOrder.forEach((key, i) => {
      const delay = 600 + i * 180;
      setTimeout(() => {
        setVisibleRows(prev => [...prev, key]);
      }, delay);
    });

    return () => { clearTimeout(t0); clearTimeout(t1); };
  }, [perfume, params.top, params.middle, params.base]);

  // 값 매핑 (언어별)
  const vGender = valueMaps.gender[params.gender] ?? params.gender;
  const vAge = valueMaps.age[params.age] ?? params.age;
  const vColor = valueMaps.color[params.color] ?? params.color;
  const vStyle = valueMaps.style[params.style] ?? params.style;


  const sampleUrl = useMemo(() => buildSampleUrl(), []);



  // Kakao SDK 초기화
  useEffect(() => {
    const key = process.env.REACT_APP_KAKAO_JS_KEY;
    if (window.Kakao && key && !window.Kakao.isInitialized()) {
      window.Kakao.init(key);
    }
  }, []);

  // (컴포넌트 내부)
  const captureCardAsJpeg = async () => {
    const root = cardRef.current;
    // window.html2canvas 대신 다이내믹 import로 안정화
    const html2canvas = window.html2canvas || (await import("html2canvas")).default;

    if (!root || !html2canvas) throw new Error("html2canvas 준비 안됨");

    const canvas = await html2canvas(root, {
      backgroundColor: "#ffffff",      // 스토리는 흰 배경 추천(투명 PNG보다 호환성↑)
      scale: Math.max(2, window.devicePixelRatio || 1),
      useCORS: true,                   // 외부 이미지가 있으면 필요
      scrollY: -window.scrollY,        // 화면 스크롤 보정(선택)
    });
    // 스토리용은 jpg 권장(용량↓)
    return canvas.toDataURL("image/jpeg", 0.92);
  };

  // 캡처 → File 만들기
  const captureCardAsFile = async () => {
    const dataUrl = await captureCardAsJpeg(); // 이미 있는 함수 재사용 (jpg dataURL)
    const res = await fetch(dataUrl);
    const blob = await res.blob();             // image/jpeg Blob
    const file = new File([blob], `${item.subTitle}.jpg`, { type: 'image/jpeg' });
    return file;
  };

  // Android 중심: 파일 공유 시도 → 실패 시 다운로드로 폴백
  const shareStoryViaWebShare = async () => {
    try {
      const file = await captureCardAsFile();
      const shareData = {
        files: [file],
        title: `${item.subTitle} 추천 향수`,
        text: `${item.subTitle} - ${item.title}`,
      };
      if (navigator.canShare && navigator.canShare(shareData)) {
        await navigator.share(shareData);   // ▶︎ 공유 시트 열림 (인스타 선택 가능)
      } else {
        throw new Error('Web Share with files not supported');
      }
    } catch (e) {
      console.warn('Web Share 실패, 다운로드로 폴백:', e);
      await downloadCurrentImage();         // 이미 구현한 다운로드 함수 재사용
      alert("이미지를 저장했습니다. 인스타 스토리에서 갤러리에서 선택하여 업로드하세요.");
    } finally {
      closeShare?.();
    }
  };




  const isiOS = /iPhone|iPad|iPod/i.test(navigator.userAgent);
  const isAndroid = /Android/i.test(navigator.userAgent);

  const buildIosStoryUrl = (img) =>
    `instagram-stories://share?source_application=perfume-mobile&background_image_url=${encodeURIComponent(img)}`;

  const buildAndroidIntentUrl = (img) =>
    `intent://share?source_application=perfume-mobile&background_image_url=${encodeURIComponent(img)}#Intent;scheme=instagram-stories;package=com.instagram.android;S.browser_fallback_url=${encodeURIComponent('https://www.instagram.com/')};end`;


  // 기존
  // const panelBg   = useMemo(() => hexToRgba(item.colors.overlapGroup, 0.78), [item]);
  // const panelLine = useMemo(() => hexToRgba(item.colors.overlap,      0.22), [item]);

  // 불투명 카드 + 적당한 라인
  const panelBg = useMemo(() => item.colors.overlapGroup, [item]);
  const panelLine = useMemo(() => hexToRgba(item.colors.overlap, 0.35), [item]);


  const chipBg = useMemo(() => hexToRgba("#ffffff", 0.96), []);
  const chipText = "#0f1c2f";

  return (
    <div className="element result-root">
      <div className="overlap-group-wrapper" ref={cardRef}>
        <div className="overlap-group">
          <div className="overlap" style={{ backgroundColor: item.colors.overlap }}>
            {/* 타이틀/이미지 */}
            <div className={`div appear ${showTitle ? "in" : ""}`}>
              <div className="overlap-2">
                <div className="sub-title">{item.subTitle}</div>
                <div className="title">{dict.title}</div>

                {/* 공유 버튼
                <img
                  className="img"
                  src="https://c.animaapp.com/AUxvzaXH/img/share.svg"
                  alt="공유하기"
                  onClick={() => {
                    if (navigator.share) {
                      shareNative();    // 모바일/지원 브라우저: 곧바로 네이티브 공유 시트
                    } else {
                      openShare();      // PC 등: 바텀시트 열기
                    }
                  }}
                />
                <button className="download-btn" onClick={downloadCurrentImage}>⬇︎ 저장</button> */}

                {/* 공유 아이콘 (기존) */}
                <button className="icon-chip" aria-label="공유하기" onClick={shareStoryViaWebShare}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {/* share (Share-2 스타일) */}
                    <circle cx="18" cy="5" r="3" />
                    <circle cx="6" cy="12" r="3" />
                    <circle cx="18" cy="19" r="3" />
                    <path d="M8.59 13.51l6.83 3.98M15.41 6.51L8.59 10.49" />
                  </svg>
                </button>

                {/* 다운로드 아이콘 (트레이 + 아래화살표) */}
                <button className="icon-chip" aria-label="이미지 저장" onClick={downloadCurrentImage}>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="none"
                    stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    {/* Download */}
                    <path d="M12 3v10" />
                    <path d="M8 9l4 4 4-4" />
                    <path d="M21 21H3a2 2 0 0 1-2-2v0a2 2 0 0 1 2-2h18a2 2 0 0 1 2 2v0a2 2 0 0 1-2 2z" />
                  </svg>
                </button>

                {/* 예시 값 버튼 (임시) */}
                <a className="icon-chip" aria-label="예시 값 입력" href={sampleUrl}>
                  <span role="img" aria-label="sparkles">✨</span>
                </a>

                {/* 언어 토글 (EN/KR) */}
                <button
                  className="icon-chip"
                  aria-label="Toggle language"
                  onClick={() => {
                    const next = lang === 'en' ? 'ko' : 'en';
                    setLang(next);
                    const u = new URL(window.location.href);
                    u.searchParams.set('lang', next);
                    window.history.replaceState({}, '', u.toString());
                  }}
                >
                  🌐
                </button>

                <img className={`image pop-in ${showImage ? "in" : ""}`} src={item.image} alt={item.subTitle} />
                <p className="hash">#{item.hash[lang][0]}</p>
                <p className="p">#{item.hash[lang][1]}</p>
              </div>
            </div>

            {/* 🔁 파라미터 카드: 1겹만 남기기 */}
            <div
              className="details-card"
              style={{
                background: panelBg,
                border: `1px solid ${panelLine}`,
                borderRadius: 18,
                boxShadow: "0 6px 14px rgba(0,0,0,.14)",
                padding: "16px",
                width: "calc(100% - 32px)",
                margin: "12px auto 0",                                    // 기본
                marginTop: "auto",                                         // ↓ 남는 공간을 위로 밀어 하단 정렬
                // marginBottom: "calc(16px + 44px + env(safe-area-inset-bottom))" // CTA와 겹침 방지
              }}
            >
              {ROWS.map((r) => {
                const visible = visibleRows.includes(r.key);
                const label = dict.labels[r.key];
                if (r.type === "text") {
                  return (
                    <DetailRow
                      key={r.key}
                      label={label}
                      value={r.valueFrom()}
                      visible={visible}
                      chipBg={chipBg}
                      chipText={chipText}
                    />
                  );
                } else {
                  const target = r.valueFrom();
                  return (
                    <NoteRow
                      key={r.key}
                      label={label}
                      targetValue={target}
                      visible={visible}
                      trackColor={hexToRgba(item.colors.overlapGroup, 0.25)}
                      fillColor={hexToRgba(item.colors.overlap, 0.9)}
                    />
                  );
                }
              })}

            </div>

          </div>
        </div>
      </div>

      {/* 스토리 딥링크 시트 */}
      {/* 인스타 스토리 열기 시트 */}
      <div className={`share-sheet ${storySheetOpen ? "open" : ""}`} role="dialog" aria-modal="true">
        <div className="handle" />
        <h4>Instagram 스토리로 공유</h4>
        {storyPublicUrl ? (
          <>
            {isiOS && (
              <a className="share-btn primary"
                href={buildIosStoryUrl(storyPublicUrl)}
                onClick={closeStorySheet}>
                iOS에서 인스타 스토리 열기
              </a>
            )}
            {isAndroid && (
              <a className="share-btn primary"
                href={buildAndroidIntentUrl(storyPublicUrl)}
                onClick={closeStorySheet}>
                Android에서 인스타 스토리 열기
              </a>
            )}

            <button
              className="share-btn"
              onClick={async () => {
                await navigator.clipboard.writeText(storyPublicUrl);
                alert("스토리 이미지 링크를 복사했어요. 인스타 앱에서 스토리 배경으로 붙여넣기 하세요.");
                closeStorySheet();
              }}
            >
              링크 복사
            </button>

            <p className="dev-hint" style={{ opacity: .8, fontSize: 12, marginTop: 8 }}>
              인앱 브라우저에서는 스킴이 막힐 수 있어요. Safari/Chrome에서 다시 시도해 주세요.
            </p>
          </>
        ) : (
          <p>이미지 준비 중…</p>
        )}
        <div className="share-footer">
          <button className="share-cancel" onClick={closeStorySheet}>닫기</button>
        </div>
      </div>

      {/* <a className="floating-cta" href={sampleUrl}>예시 값으로 채우기(이동)</a> */}
    </div>
  );
}

function DetailRow({ label, value, visible, delayMs = 0, chipBg, chipText }) {
  return (
    <div className={`detail-row appear ${visible ? "in" : ""}`} style={{ transitionDelay: visible ? `${delayMs}ms` : "0ms" }}>
      <div className="detail-label" style={{ background: chipBg, color: chipText }}>{label}</div>
      <div className="detail-value">{value}</div>
    </div>
  );
}

function NoteRow({ label, targetValue, visible, delayMs = 0, trackColor, fillColor }) {
  const [width, setWidth] = useState(0);
  const [num, setNum] = useState(0);
  const fillRef = React.useRef(null);
  const DURATION = 900;
  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

  useEffect(() => {
    if (!visible) return;
    setWidth(0);
    const el = fillRef.current;
    if (el) void el.offsetWidth; // reflow
    const id1 = requestAnimationFrame(() => {
      requestAnimationFrame(() => setWidth(targetValue));
    });

    let rafId, start;
    const tick = (ts) => {
      if (!start) start = ts;
      const t = Math.min(1, (ts - start) / DURATION);
      const eased = easeOutCubic(t);
      setNum(Math.round(targetValue * eased));
      if (t < 1) rafId = requestAnimationFrame(tick);
    };
    rafId = requestAnimationFrame(tick);

    return () => { cancelAnimationFrame(id1); cancelAnimationFrame(rafId); };
  }, [visible, targetValue]);

  return (
    <div className={`detail-row appear ${visible ? "in" : ""}`} style={{ transitionDelay: visible ? `${delayMs}ms` : "0ms" }}>
      <div className="detail-label">{label}</div>
      <div className="detail-value">
        <div className="note-bar" style={{ background: trackColor }}>
          <div ref={fillRef} className="note-fill" style={{ width: `${width}%`, background: fillColor }} />
          <div className="note-value">{num}%</div>
        </div>
      </div>
    </div>
  );
}
