// 변경점만 반영된 전체 파일 예시
import React, { useEffect, useMemo, useRef, useState } from "react";
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

const KOR = {
    gender: { female: "여자", male: "남자", unspecified: "미지정" },
    age: { "10s": "10대", "20s": "20대", "30s": "30대", "40s": "40대", "50s": "50대", "60s": "60대" },
    color: {
        red: "빨간색", orange: "주황색", yellow: "노란색", green: "초록색",
        blue: "파란색", navy: "남색", purple: "보라색",
    },
    style: {
        fresh: "시원함", sweet: "달콤함", romantic: "로맨틱", sensual: "관능적",
        urban: "도시적", cool: "시원함",
    },
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

    // 순차 등장 제어
    const [showTitle, setShowTitle] = useState(false);
    const [showImage, setShowImage] = useState(false);
    const [showPanel, setShowPanel] = useState(false);
    const [bars, setBars] = useState({ top: 0, middle: 0, base: 0 });
    const [visibleRows, setVisibleRows] = useState([]);

    useEffect(() => {
        setShowTitle(true);
        const t1 = setTimeout(() => setShowImage(true), 350);

        // 행 순차 노출
        const labels = ["gender", "age", "color", "style", "top", "middle", "base"];
        labels.forEach((lab, i) => {
            setTimeout(() => {
                setVisibleRows(prev => [...prev, lab]);
                if (lab === "top") {
                    setBars(b => ({ ...b, top: params.top }));
                }
                if (lab === "middle") {
                    setBars(b => ({ ...b, middle: params.middle }));
                }
                if (lab === "base") {
                    setBars(b => ({ ...b, base: params.base }));
                }
            }, 700 + i * 300); // 0.3초 간격
        });

        return () => {
            clearTimeout(t1);
        };
    }, [perfume, params]);


    // 한글 변환
    const korGender = KOR.gender[params.gender] ?? params.gender;
    const korAge = KOR.age[params.age] ?? params.age;
    const korColor = KOR.color[params.color] ?? params.color;
    const korStyle = KOR.style[params.style] ?? params.style;

    const sampleUrl = useMemo(() => buildSampleUrl(), []);

    return (
    <div className="element result-root">
      {/* ✅ 상단 dev-toolbar 삭제 */}
      <div className="overlap-group-wrapper">
        <div className="overlap-group" style={{ backgroundColor: item.colors.overlapGroup }}>
          <div className="overlap" style={{ backgroundColor: item.colors.overlap }}>
            {/* 제목/이미지 영역 그대로 */}
            <div className={`div fade-in ${showTitle ? "in" : ""}`}>
              <div className="overlap-2">
                <div className="background-image" />
                <div className="sub-title">{item.subTitle}</div>
                <div className="title">{item.title}</div>
                <img className="start-icon-small" src="https://c.animaapp.com/AUxvzaXH/img/start-icon-small.svg" alt="" />
                <img className="start-icon-large" src="https://c.animaapp.com/AUxvzaXH/img/start-icon-large.svg" alt="" />
                <img className={`image pop-in ${showImage ? "in" : ""}`} src={item.image} alt={item.subTitle} />
                <p className="hash"><span className="text-wrapper">#</span><span className="span"> {item.hash}</span></p>
                <p className="p"><span className="text-wrapper">#</span><span className="span"> {item.hash1}</span></p>
              </div>
              <img className="img" src="https://c.animaapp.com/AUxvzaXH/img/share.svg" alt="" />
            </div>

            {/* 상세 패널 */}
            <div className="details-panel">
              <DetailRow label="성별" value={korGender} visible={visibleRows.includes("gender")} />
              <DetailRow label="나이" value={korAge} visible={visibleRows.includes("age")} />
              <DetailRow label="선호하는 색상" value={korColor} visible={visibleRows.includes("color")} />
              <DetailRow label="선호하는 스타일" value={korStyle} visible={visibleRows.includes("style")} />
              <NoteRow label="탑노트" value={bars.top} visible={visibleRows.includes("top")} />
              <NoteRow label="미들노트" value={bars.middle} visible={visibleRows.includes("middle")} />
              <NoteRow label="베이스노트" value={bars.base} visible={visibleRows.includes("base")} />
            </div>
          </div>
        </div>
      </div>

      {/* ✅ 하단 고정: 예시값으로 채우기 */}
      <a className="floating-cta" href={sampleUrl}>예시 값으로 채우기(이동)</a>
    </div>
  );

function DetailRow({ label, value, visible }) {
    return (
        <div className={`detail-row fade-in ${visible ? "in" : ""}`}>
            <div className="detail-label">{label}</div>
            <div className="detail-value">{value}</div>
        </div>
    );
}

function NoteRow({ label, value, visible }) {
    return (
        <div className={`detail-row fade-in ${visible ? "in" : ""}`}>
            <div className="detail-label">{label}</div>
            <div className="detail-value">
                <div className="note-bar">
                    <div
                        className="note-fill"
                        style={{ width: `${value}%` }}
                    />
                    <div className="note-value">{value}%</div>
                </div>
            </div>
        </div>
    );
}
}