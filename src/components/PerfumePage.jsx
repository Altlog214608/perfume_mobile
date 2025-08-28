import React, { useMemo } from "react";
import "../styles/PerfumeResult.css";

// 이미지 import
import lemonula from "../assets/img/lemonula.png";
import flolarin from "../assets/img/flolarin.png";
import essentria from "../assets/img/essentria.png";
import lumina from "../assets/img/lumina.png";
import coolwater from "../assets/img/coolwater.png";
import maruit from "../assets/img/maruit.png";
import nectarua from "../assets/img/nectarua.png";
import croloys from "../assets/img/croloys.png";

export default function PerfumeCard() {
  const data = useMemo(
    () => [
      {
        subTitle: "Lemonula",
        title: "당신에게 어울리는",
        hash: "에너지",
        hash1: "상큼함",
        topNote: "Lemon",
        middleNote: "Rose",
        baseNote: "Amber",
        image: lemonula,
        colors: { overlapGroup: "#b28a00", overlap: "#e6c74c" },
      },
      {
        subTitle: "Flolarin",
        title: "당신에게 어울리는",
        hash: "달콤함",
        hash1: "상큼함",
        topNote: "Cucumber",
        middleNote: "Lavender",
        baseNote: "Cedarwood",
        image: flolarin,
        colors: { overlapGroup: "#b8721d", overlap: "#f7d08a" },
      },
      {
        subTitle: "Essentria",
        title: "당신에게 어울리는",
        hash: "플로럴",
        hash1: "로맨틱",
        topNote: "Raspberry",
        middleNote: "Rose",
        baseNote: "Musk",
        image: essentria,
        colors: { overlapGroup: "#7c3fa6", overlap: "#d6b3f7" },
      },
      {
        subTitle: "Lumina",
        title: "당신에게 어울리는",
        hash: "신비적",
        hash1: "세련된",
        topNote: "Bergamot",
        middleNote: "Jasmine",
        baseNote: "Amber",
        image: lumina,
        colors: { overlapGroup: "#145c69", overlap: "#b97a2b" },
      },
      {
        subTitle: "Cool Water",
        title: "당신에게 어울리는",
        hash: "시원함",
        hash1: "남성적",
        topNote: "Bergamot",
        middleNote: "Geranium",
        baseNote: "Vetiver",
        image: coolwater,
        colors: { overlapGroup: "#1a3a6b", overlap: "#4a7dc7" },
      },
      {
        subTitle: "Maruit",
        title: "당신에게 어울리는",
        hash: "도시적",
        hash1: "청량감",
        topNote: "Mint",
        middleNote: "Lavender",
        baseNote: "Sandalwood",
        image: maruit,
        colors: { overlapGroup: "#23446d", overlap: "#6bb0d6" },
      },
      {
        subTitle: "Nectarua",
        title: "당신에게 어울리는",
        hash: "관능적",
        hash1: "시원함",
        topNote: "Mandarin",
        middleNote: "Rose",
        baseNote: "Amber",
        image: nectarua,
        colors: { overlapGroup: "#a86e1a", overlap: "#ffd07b" },
      },
      {
        subTitle: "Croloys",
        title: "당신에게 어울리는",
        hash: "관능적",
        hash1: "시원함",
        topNote: "Marine",
        middleNote: "Sage",
        baseNote: "Musk",
        image: croloys,
        colors: { overlapGroup: "#132f5a", overlap: "#3559A6" },
      },
    ],
    []
  );

  const params = new URLSearchParams(window.location.search);
  const idxFromQuery = parseInt(params.get("idx") || "1", 10);
  const clampedIdx =
    Number.isFinite(idxFromQuery) && idxFromQuery >= 1 && idxFromQuery <= data.length
      ? idxFromQuery
      : 1;
  const item = data[clampedIdx - 1];

  return (
    <div className="element">
      <div className="overlap-group-wrapper">
        <div
          className="overlap-group"
          style={{ backgroundColor: item.colors.overlapGroup }}
        >
          <div
            className="overlap"
            style={{ backgroundColor: item.colors.overlap }}
          >
            <div className="div">
              <div className="overlap-2">
                <div className="background-image" />
                <div className="sub-title">{item.subTitle}</div>
                <div className="title">{item.title}</div>

                <img
                  className="start-icon-small"
                  src="https://c.animaapp.com/AUxvzaXH/img/start-icon-small.svg"
                  alt=""
                />
                <img
                  className="start-icon-large"
                  src="https://c.animaapp.com/AUxvzaXH/img/start-icon-large.svg"
                  alt=""
                />

                <img className="image" src={item.image} alt={item.subTitle} />

                <p className="hash">
                  <span className="text-wrapper">#</span>{" "}
                  <span className="span"> {item.hash}</span>
                </p>
                <p className="p">
                  <span className="text-wrapper">#</span>{" "}
                  <span className="span"> {item.hash1}</span>
                </p>
              </div>

              <img
                className="img"
                src="https://c.animaapp.com/AUxvzaXH/img/share.svg"
                alt=""
              />
            </div>
          </div>

          <div className="notes-container">
            <div className="note-group top-note-group">
              <div className="note-title">Top</div>
              <div className="note-text">{item.topNote}</div>
            </div>
            <div className="note-group middle-note-group">
              <div className="note-title">Middle</div>
              <div className="note-text">{item.middleNote}</div>
            </div>
            <div className="note-group base-note-group">
              <div className="note-title">Base</div>
              <div className="note-text">{item.baseNote}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
