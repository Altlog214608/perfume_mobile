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

// 상단 import 아래 유틸 추가
const hexToRgba = (hex, alpha = 1) => {
  // #RGB or #RRGGBB
  const c = hex.replace('#','');
  const x = c.length === 3
    ? c.split('').map(ch => ch+ch).join('')
    : c;
  const r = parseInt(x.slice(0,2),16);
  const g = parseInt(x.slice(2,4),16);
  const b = parseInt(x.slice(4,6),16);
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
      { subTitle: "Lemonula",  title: "당신에게 어울리는", hash: "에너지",  hash1: "상큼함", topNote: "Lemon",    middleNote: "Rose",     baseNote: "Amber",     image: lemonula,  colors: { overlapGroup: "#b28a00", overlap: "#e6c74c" } },
      { subTitle: "Flolarin",  title: "당신에게 어울리는", hash: "달콤함",  hash1: "상큼함", topNote: "Cucumber", middleNote: "Lavender", baseNote: "Cedarwood", image: flolarin, colors: { overlapGroup: "#b8721d", overlap: "#f7d08a" } },
      { subTitle: "Essentria", title: "당신에게 어울리는", hash: "플로럴",  hash1: "로맨틱", topNote: "Raspberry", middleNote: "Rose",     baseNote: "Musk",      image: essentria, colors: { overlapGroup: "#7c3fa6", overlap: "#d6b3f7" } },
      { subTitle: "Lumina",    title: "당신에게 어울리는", hash: "신비적",  hash1: "세련된", topNote: "Bergamot",  middleNote: "Jasmine",  baseNote: "Amber",     image: lumina,    colors: { overlapGroup: "#145c69", overlap: "#b97a2b" } },
      { subTitle: "Cool Water",title: "당신에게 어울리는", hash: "시원함",  hash1: "남성적", topNote: "Bergamot",  middleNote: "Geranium", baseNote: "Vetiver",   image: coolwater, colors: { overlapGroup: "#1a3a6b", overlap: "#4a7dc7" } },
      { subTitle: "Maruit",    title: "당신에게 어울리는", hash: "도시적",  hash1: "청량감", topNote: "Mint",      middleNote: "Lavender", baseNote: "Sandalwood",image: maruit,    colors: { overlapGroup: "#23446d", overlap: "#6bb0d6" } },
      { subTitle: "Nectarua",  title: "당신에게 어울리는", hash: "관능적",  hash1: "시원함", topNote: "Mandarin",  middleNote: "Rose",     baseNote: "Amber",     image: nectarua,  colors: { overlapGroup: "#a86e1a", overlap: "#ffd07b" } },
      { subTitle: "Croloys",   title: "당신에게 어울리는", hash: "관능적",  hash1: "시원함", topNote: "Marine",    middleNote: "Sage",     baseNote: "Musk",      image: croloys,   colors: { overlapGroup: "#132f5a", overlap: "#3559A6" } },
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

  // ✅ 타입 제거 (순수 JS)
  const [visibleRows, setVisibleRows] = useState([]);
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

  const korGender = KOR.gender[params.gender] ?? params.gender;
  const korAge    = KOR.age[params.age] ?? params.age;
  const korColor  = KOR.color[params.color] ?? params.color;
  const korStyle  = KOR.style[params.style] ?? params.style;

  const sampleUrl = useMemo(() => buildSampleUrl(), []);

  const panelBg   = useMemo(() => hexToRgba(item.colors.overlapGroup, 0.78), [item]);
  const panelLine = useMemo(() => hexToRgba(item.colors.overlap,      0.22), [item]);
  const chipBg    = useMemo(() => hexToRgba("#ffffff", 0.96), []);
  const chipText  = "#0f1c2f";

  return (
    <div className="element result-root">
      <div className="overlap-group-wrapper">
        <div className="overlap-group" style={{ backgroundColor: item.colors.overlapGroup }}>
          <div className="overlap" style={{ backgroundColor: item.colors.overlap }}>
            {/* 타이틀/이미지 */}
            <div className={`div appear ${showTitle ? "in" : ""}`}>
              <div className="overlap-2">
                <div className="background-image" />
                <div className="sub-title">{item.subTitle}</div>
                <div className="title">{item.title}</div>

                <img className="start-icon-small" src="https://c.animaapp.com/AUxvzaXH/img/start-icon-small.svg" alt="" />
                <img className="start-icon-large" src="https://c.animaapp.com/AUxvzaXH/img/start-icon-large.svg" alt="" />
                <img className="img" src="https://c.animaapp.com/AUxvzaXH/img/share.svg" alt="" />

                <img className={`image pop-in ${showImage ? "in" : ""}`} src={item.image} alt={item.subTitle} />

                <p className="hash"><span className="text-wrapper">#</span><span className="span"> {item.hash}</span></p>
                <p className="p"><span className="text-wrapper">#</span><span className="span"> {item.hash1}</span></p>
              </div>
            </div>

            {/* 상세 패널 */}
            {/* ✅ 상세 패널: overlapGroup/overlap로 테마 적용 */}
            <div
              className="details-panel"
              style={{
                background: panelBg,              // 카드 바탕색과 같은 계열(투명도)
                borderTopLeftRadius: 18,
                borderTopRightRadius: 18,
                border: `1px solid ${panelLine}`, // 같은 계열 라인
                boxShadow: "0 -8px 24px rgba(0,0,0,.25)"
              }}
            >
              <DetailRow
                label="성별" value={korGender}
                visible={visibleRows.includes("gender")}
                chipBg={chipBg} chipText={chipText}
              />
              <DetailRow
                label="나이" value={korAge}
                visible={visibleRows.includes("age")}
                chipBg={chipBg} chipText={chipText}
              />
              <DetailRow
                label="선호하는 색상" value={korColor}
                visible={visibleRows.includes("color")}
                chipBg={chipBg} chipText={chipText}
              />
              <DetailRow
                label="선호하는 스타일" value={korStyle}
                visible={visibleRows.includes("style")}
                chipBg={chipBg} chipText={chipText}
              />

              {/* 노트바도 테마 색상으로 살짝 톤 맞춤 (fill=overlap, 트랙=overlapGroup) */}
              <NoteRow
                label="탑노트" targetValue={params.top}
                visible={visibleRows.includes("top")} delayMs={720}
                trackColor={hexToRgba(item.colors.overlapGroup, 0.22)}
                fillColor={hexToRgba(item.colors.overlap, 0.92)}
                textOnFillCutoff={55}
              />
              <NoteRow
                label="미들노트" targetValue={params.middle}
                visible={visibleRows.includes("middle")} delayMs={900}
                trackColor={hexToRgba(item.colors.overlapGroup, 0.22)}
                fillColor={hexToRgba(item.colors.overlap, 0.92)}
                textOnFillCutoff={55}
              />
              <NoteRow
                label="베이스노트" targetValue={params.base}
                visible={visibleRows.includes("base")} delayMs={1080}
                trackColor={hexToRgba(item.colors.overlapGroup, 0.22)}
                fillColor={hexToRgba(item.colors.overlap, 0.92)}
                textOnFillCutoff={55}
              />
            </div>
          </div>
        </div>
      </div>

      <a className="floating-cta" href={sampleUrl}>예시 값으로 채우기(이동)</a>
    </div>
  );
}

function DetailRow({ label, value, visible, delayMs = 0, chipBg = "rgba(255,255,255,.96)", chipText = "#0f1c2f" }) {
  return (
    <div
      className={`detail-row appear ${visible ? "in" : ""}`}
      style={{ transitionDelay: visible ? `${delayMs}ms` : "0ms" }}
    >
      <div
        className="detail-label"
        style={{ background: chipBg, color: chipText, borderColor: "rgba(255,255,255,.75)" }}
      >
        {label}
      </div>
      <div className="detail-value">{value}</div>
    </div>
  );
}

function NoteRow({
  label, targetValue, visible, delayMs = 0,
  trackColor = "rgba(255,255,255,.18)",
  fillColor = "rgba(255,255,255,.92)",
  textOnFillCutoff = 55
}) {
  const [width, setWidth] = useState(0);
  const [num, setNum] = useState(0);
  const fillRef = React.useRef(null);
  const DURATION = 900;
  const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);

  useEffect(() => {
    if (!visible) return;
    setWidth(0);
    const el = fillRef.current;
    if (el) void el.offsetWidth;       // reflow 강제
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

  const onfill = width >= textOnFillCutoff;

  return (
    <div
      className={`detail-row appear ${visible ? "in" : ""}`}
      style={{ transitionDelay: visible ? `${delayMs}ms` : "0ms" }}
    >
      <div className="detail-label">{label}</div>
      <div className="detail-value">
        <div className="note-bar" style={{ background: trackColor }}>
          <div
            ref={fillRef}
            className="note-fill"
            style={{ width: `${width}%`, background: fillColor }}
          />
          <div className={`note-value ${onfill ? "onfill" : ""}`}>{num}%</div>
        </div>
      </div>
    </div>
  );
}
