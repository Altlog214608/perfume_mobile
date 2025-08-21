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

  const shareToInstagram = async () => {
    if (navigator.share) return shareNative();
    await navigator.clipboard.writeText(currentUrl);
    alert("Instagram은 웹 공유가 제한되어 링크를 복사했습니다.");
    closeShare();
  };



  const panelBg = useMemo(() => hexToRgba(item.colors.overlapGroup, 0.78), [item]);
  const panelLine = useMemo(() => hexToRgba(item.colors.overlap, 0.22), [item]);
  const chipBg = useMemo(() => hexToRgba("#ffffff", 0.96), []);
  const chipText = "#0f1c2f";

  return (
    <div className="element result-root">
      <div className="overlap-group-wrapper">
        <div className="overlap-group" style={{ backgroundColor: item.colors.overlapGroup }}>
          <div className="overlap" style={{ backgroundColor: item.colors.overlap }}>
            {/* 타이틀/이미지 */}
            <div className={`div appear ${showTitle ? "in" : ""}`}>
              <div className="overlap-2">
                <div className="sub-title">{item.subTitle}</div>
                <div className="title">{item.title}</div>

                {/* 공유 버튼 */}
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

                <img className={`image pop-in ${showImage ? "in" : ""}`} src={item.image} alt={item.subTitle} />
                <p className="hash">#{item.hash}</p>
                <p className="p">#{item.hash1}</p>
              </div>
            </div>

            {/* 상세 패널 */}
            <div className="details-panel" style={{
              background: panelBg, borderTopLeftRadius: 18, borderTopRightRadius: 18,
              border: `1px solid ${panelLine}`, boxShadow: "0 -8px 24px rgba(0,0,0,.25)"
            }}>
              <DetailRow label="성별" value={korGender} visible={visibleRows.includes("gender")} chipBg={chipBg} chipText={chipText} />
              <DetailRow label="나이" value={korAge} visible={visibleRows.includes("age")} chipBg={chipBg} chipText={chipText} />
              <DetailRow label="선호하는 색상" value={korColor} visible={visibleRows.includes("color")} chipBg={chipBg} chipText={chipText} />
              <DetailRow label="선호하는 스타일" value={korStyle} visible={visibleRows.includes("style")} chipBg={chipBg} chipText={chipText} />

              <NoteRow label="탑노트" targetValue={params.top} visible={visibleRows.includes("top")} />
              <NoteRow label="미들노트" targetValue={params.middle} visible={visibleRows.includes("middle")} />
              <NoteRow label="베이스노트" targetValue={params.base} visible={visibleRows.includes("base")} />
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

function NoteRow({ label, targetValue, visible, delayMs = 0 }) {
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
        <div className="note-bar">
          <div ref={fillRef} className="note-fill" style={{ width: `${width}%` }} />
          <div className="note-value">{num}%</div>
        </div>
      </div>
    </div>
  );
}
