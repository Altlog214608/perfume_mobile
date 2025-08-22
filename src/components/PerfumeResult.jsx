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

// hex 색상 → rgba 변환
const hexToRgba = (hex, alpha = 1) => {
  const c = hex.replace('#', '');
  const x = c.length === 3 ? c.split('').map(ch => ch + ch).join('') : c;
  const r = parseInt(x.slice(0, 2), 16);
  const g = parseInt(x.slice(2, 4), 16);
  const b = parseInt(x.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

const KOR = {
  gender: { female: "여자", male: "남자", unspecified: "미지정" },
  age: { "10s": "10대", "20s": "20대", "30s": "30대", "40s": "40대", "50s": "50대", "60s": "60대" },
  color: { red: "빨간색", orange: "주황색", yellow: "노란색", green: "초록색", blue: "파란색", navy: "남색", purple: "보라색" },
  style: { fresh: "시원함", sweet: "달콤함", romantic: "로맨틱", sensual: "관능적", urban: "도시적", cool: "시원함" },
};

export default function PerfumeResult() {
  const data = useMemo(
    () => [
      { subTitle: "Lemonula", title: "당신에게 어울리는", hash: "에너지", hash1: "상큼함", topNote: "Lemon", middleNote: "Rose", baseNote: "Amber", image: lemonula, colors: { overlapGroup: "#b28a00", overlap: "#e6c74c" } },
      { subTitle: "Flolarin", title: "당신에게 어울리는", hash: "달콤함", hash1: "상큼함", topNote: "Cucumber", middleNote: "Lavender", baseNote: "Cedarwood", image: flolarin, colors: { overlapGroup: "#b8721d", overlap: "#f7d08a" } },
      { subTitle: "Essentria", title: "당신에게 어울리는", hash: "플로럴", hash1: "로맨틱", topNote: "Raspberry", middleNote: "Rose", baseNote: "Musk", image: essentria, colors: { overlapGroup: "#7c3fa6", overlap: "#d6b3f7" } },
      { subTitle: "Lumina", title: "당신에게 어울리는", hash: "신비적", hash1: "세련된", topNote: "Bergamot", middleNote: "Jasmine", baseNote: "Amber", image: lumina, colors: { overlapGroup: "#145c69", overlap: "#b97a2b" } },
      { subTitle: "Cool Water", title: "당신에게 어울리는", hash: "시원함", hash1: "남성적", topNote: "Bergamot", middleNote: "Geranium", baseNote: "Vetiver", image: coolwater, colors: { overlapGroup: "#1a3a6b", overlap: "#4a7dc7" } },
      { subTitle: "Maruit", title: "당신에게 어울리는", hash: "도시적", hash1: "청량감", topNote: "Mint", middleNote: "Lavender", baseNote: "Sandalwood", image: maruit, colors: { overlapGroup: "#23446d", overlap: "#6bb0d6" } },
      { subTitle: "Nectarua", title: "당신에게 어울리는", hash: "관능적", hash1: "시원함", topNote: "Mandarin", middleNote: "Rose", baseNote: "Amber", image: nectarua, colors: { overlapGroup: "#a86e1a", overlap: "#ffd07b" } },
      { subTitle: "Croloys", title: "당신에게 어울리는", hash: "관능적", hash1: "시원함", topNote: "Marine", middleNote: "Sage", baseNote: "Musk", image: croloys, colors: { overlapGroup: "#132f5a", overlap: "#3559A6" } },
    ],
    []
  );

  // ...기존 state들...
  const cardRef = React.useRef(null);

  // 전체 카드(향수~파라미터 끝) 이미지 저장
  const downloadCurrentImage = async () => {
    try {
      const root = cardRef.current;                 // 캡처할 대상
      if (!root || !window.html2canvas) {
        alert("화면 캡처 라이브러리가 아직 로드되지 않았어요. 잠시 후 다시 시도해주세요.");
        return;
      }
      // 스케일 2배로 선명하게, CORS 허용
      const canvas = await window.html2canvas(root, {
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

  // 한국어 변환
  const korGender = KOR.gender[params.gender] ?? params.gender;
  const korAge = KOR.age[params.age] ?? params.age;
  const korColor = KOR.color[params.color] ?? params.color;
  const korStyle = KOR.style[params.style] ?? params.style;

  const sampleUrl = useMemo(() => buildSampleUrl(), []);
  const currentUrl = useMemo(() => window.location.href, []);
  const shareText = `${item.subTitle} - ${item.title}\n#향수추천 #${item.subTitle}`;

  // Kakao SDK 초기화
  useEffect(() => {
    const key = process.env.REACT_APP_KAKAO_JS_KEY;
    if (window.Kakao && key && !window.Kakao.isInitialized()) {
      window.Kakao.init(key);
    }
  }, []);

  // 공유 함수들
  const shareNative = async () => {
    if (navigator.share) {
      await navigator.share({ title: item.subTitle, text: shareText, url: currentUrl });
    } else {
      await navigator.clipboard.writeText(currentUrl);
      alert("링크가 복사되었습니다.");
    }
    closeShare();
  };


  const shareToX = () => {
    const url = `https://twitter.com/intent/tweet?text=${encodeURIComponent(shareText)}&url=${encodeURIComponent(currentUrl)}`;
    window.open(url, "_blank");
    closeShare();
  };

  const shareToKakao = () => {
    if (!window.Kakao || !window.Kakao.isInitialized()) {
      alert("카카오 SDK가 초기화되지 않았습니다.");
      return;
    }
    window.Kakao.Link.sendDefault({
      objectType: "feed",
      content: {
        title: item.subTitle,
        description: `${korStyle} · ${korColor} · ${korAge}`,
        imageUrl: item.image,
        link: { mobileWebUrl: currentUrl, webUrl: currentUrl },
      },
      buttons: [{ title: "자세히 보기", link: { mobileWebUrl: currentUrl, webUrl: currentUrl } }],
    });
    closeShare();
  };

  // 현재 향수 이미지의 "절대 URL" (인스타가 직접 가져가므로 절대경로 필요)
  const storyImageUrl = useMemo(() => {
    try {
      return new URL(item.image, window.location.origin).href;
    } catch {
      return window.location.origin + "/fallback-story.jpg"; // 없으면 임시
    }
  }, [item.image]);

  // 스킴 시도 헬퍼 (앱 미설치/PC 환경 대비)
  const tryOpenScheme = (urls, fallback) => {
    let opened = false;
    const open = (i) => {
      if (i >= urls.length) {
        fallback?.();
        return;
      }
      // 스킴 이동
      window.location.href = urls[i];
      // 900ms 후에도 페이지가 떠 있으면 실패로 보고 다음/폴백
      setTimeout(() => {
        if (!document.hidden) {
          open(i + 1);
        }
      }, 900);
    };
    open(0);
  };
  
  // 인스타 "스토리" 공유
  const shareToInstagramStory = () => {
    // 모바일만 앱 스킴 시도
    const isMobile = /Android|iPhone|iPad|iPod/i.test(navigator.userAgent);
    if (!isMobile) {
      navigator.clipboard.writeText(currentUrl);
      alert("PC에선 인스타 공유가 제한돼 링크를 복사했습니다.");
      closeShare();
      return;
    }

    // 인스타가 인식하는 대표 스킴 2종(단말마다 한쪽만 동작하는 경우가 있어 순차 시도)
    const schemes = [
      // iOS/일부 단말
      `instagram-stories://share?source_application=perfume-mobile&background_image_url=${encodeURIComponent(storyImageUrl)}`,
      // 일부 단말(구버전)
      `instagram://story-camera?background_image=${encodeURIComponent(storyImageUrl)}`
    ];

    tryOpenScheme(schemes, () => {
      // 폴백: 링크 복사
      navigator.clipboard.writeText(currentUrl);
      alert("인스타 앱을 열 수 없어 링크를 복사했습니다. 인스타 앱에서 스토리에 붙여넣어 주세요.");
    });

    closeShare();
  };


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
                <div className="title">{item.title}</div>

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
                <button className="icon-chip" aria-label="공유하기" onClick={openShare}>
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

                <img className={`image pop-in ${showImage ? "in" : ""}`} src={item.image} alt={item.subTitle} />
                <p className="hash">#{item.hash}</p>
                <p className="p">#{item.hash1}</p>
              </div>
            </div>

            {/* 🔁 파라미터 카드: 1겹만 남기기 */}
            <div
              className="details-card"
              style={{
                background: panelBg,                      // item.colors.overlapGroup (불투명)
                border: `1px solid ${panelLine}`,         // item.colors.overlap (살짝 진한 라인)
                borderRadius: 18,
                boxShadow: "0 6px 14px rgba(0,0,0,.14)",
                padding: "16px",
                width: "calc(100% - 32px)",
                margin: "12px auto 24px"
              }}
            >
              <DetailRow label="성별" value={korGender} visible={visibleRows.includes("gender")} chipBg={chipBg} chipText={chipText} />
              <DetailRow label="나이" value={korAge} visible={visibleRows.includes("age")} chipBg={chipBg} chipText={chipText} />
              <DetailRow label="선호하는 색상" value={korColor} visible={visibleRows.includes("color")} chipBg={chipBg} chipText={chipText} />
              <DetailRow label="선호하는 스타일" value={korStyle} visible={visibleRows.includes("style")} chipBg={chipBg} chipText={chipText} />

              <NoteRow label="탑노트" targetValue={params.top} visible={visibleRows.includes("top")} trackColor={hexToRgba(item.colors.overlapGroup, 0.25)}
                fillColor={hexToRgba(item.colors.overlap, 0.9)} />
              <NoteRow label="미들노트" targetValue={params.middle} visible={visibleRows.includes("middle")} trackColor={hexToRgba(item.colors.overlapGroup, 0.25)}
                fillColor={hexToRgba(item.colors.overlap, 0.9)} />
              <NoteRow label="베이스노트" targetValue={params.base} visible={visibleRows.includes("base")} trackColor={hexToRgba(item.colors.overlapGroup, 0.25)}
                fillColor={hexToRgba(item.colors.overlap, 0.9)} />
            </div>

          </div>
        </div>
      </div>

      {/* 공유 바텀시트 */}
      <div className={`share-backdrop ${shareOpen ? "open" : ""}`} onClick={closeShare} />
      <div className={`share-sheet ${shareOpen ? "open" : ""}`} role="dialog" aria-modal="true">
        <div className="handle" />
        <h4>공유하기</h4>
        <div className="share-grid">
          <button className="share-btn" onClick={shareToKakao}>
            <div className="share-icon icon-kakao">K</div>
            <span className="share-label">카카오톡</span>
          </button>
          <button className="share-btn" onClick={shareToX}>
            <div className="share-icon icon-x">𝕏</div>
            <span className="share-label">X(트위터)</span>
          </button>
          <button className="share-btn" onClick={shareNative}>
            <div className="share-icon icon-more">↗︎</div>
            <span className="share-label">기기공유</span>
          </button>
          <button className="share-btn" onClick={shareToInstagramStory}>
            <div className="share-icon" style={{ background: "linear-gradient(45deg,#f58529,#feda77,#dd2a7b,#8134af,#515bd4)" }}>📸</div>
            <span className="share-label">Instagram 스토리</span>
          </button>
          <button className="share-btn" onClick={async () => { await navigator.clipboard.writeText(currentUrl); alert("링크가 복사되었습니다."); closeShare(); }}>
            <div className="share-icon icon-copy">⎘</div>
            <span className="share-label">링크복사</span>
          </button>
        </div>
        <div className="share-footer">
          <button className="share-cancel" onClick={closeShare}>닫기</button>
        </div>
      </div>


      <a className="floating-cta" href={sampleUrl}>예시 값으로 채우기(이동)</a>
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
