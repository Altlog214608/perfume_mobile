import React, { useEffect, useMemo, useState } from "react";
import "../styles/frSmart.css";
import { parseQuery, buildSampleUrl } from "../lib/query";

// import lemonula from "../assets/img/lemonula.png";
// import flolarin from "../assets/img/flolarin.png";
// import essentria from "../assets/img/essentria.png";
// import lumina from "../assets/img/lumina.png";
// import coolwater from "../assets/img/coolwater.png";
// import maruit from "../assets/img/maruit.png";
// import nectarua from "../assets/img/nectarua.png";
// import croloys from "../assets/img/croloys.png";


import img1 from "../assets/img/1.png";
import img2 from "../assets/img/2.png";
import img3 from "../assets/img/3.png";
import img4 from "../assets/img/4.png";
import img5 from "../assets/img/5.png";
import img6 from "../assets/img/6.png";
import img7 from "../assets/img/7.png";
import img8 from "../assets/img/8.png";
import img9 from "../assets/img/9.png";
import img10 from "../assets/img/10.png";
import img11 from "../assets/img/11.png";
import img12 from "../assets/img/12.png";


import html2canvas from "html2canvas";


// 가족(family)별 대표 이미지 (파일명은 그대로 1~12)
const IMAGE_BY_FAMILY = {
  woody: img1,
  citrus: img2,
  musk: img3,
  aqua: img4,
  green: img5,
  casual: img6,
  "light-floral": img7,
  floral: img8,
  fruity: img9,
  aromatic: img10,
  spicy: img11,
  fougere: img12, // Fougère → slug는 fougere
};


// hex 색상 → rgba 변환
const hexToRgba = (hex, alpha = 1) => {
  const c = hex.replace('#', '');
  const x = c.length === 3 ? c.split('').map(ch => ch + ch).join('') : c;
  const r = parseInt(x.slice(0, 2), 16);
  const g = parseInt(x.slice(2, 4), 16);
  const b = parseInt(x.slice(4, 6), 16);
  return `rgba(${r}, ${g}, ${b}, ${alpha})`;
};

// "Fougère" → "fougere", "플로럴" → "floral" 같은 정규화
const toFamilySlug = (val) => {
  if (!val) return "";
  const base = String(val).trim().toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // 악센트 제거
  const alias = {
    woody: "woody", "우디": "woody",
    citrus: "citrus", "시트러스": "citrus",
    musk: "musk", "머스크": "musk",
    aqua: "aqua", "아쿠아": "aqua",
    green: "green", "그린": "green",
    casual: "casual", "캐주얼": "casual",
    "light floral": "light-floral", "light-floral": "light-floral", "라이트 플로럴": "light-floral",
    floral: "floral", "플로럴": "floral",
    fruity: "fruity", "프루티": "fruity",
    aromatic: "aromatic", "아로마틱": "aromatic",
    spicy: "spicy", "스파이시": "spicy",
    fougere: "fougere", "푸제르": "fougere",
  };
  const key = base.replace(/\s+/g, " ");
  return alias[key] ?? key.replace(/\s+/g, "-");
};

// 언어별 패밀리 표시(슬러그 → 라벨)
const FAMILY_DISPLAY = {
  en: {
    woody: "Woody",
    citrus: "Citrus",
    musk: "Musk",
    aqua: "Aqua",
    green: "Green",
    casual: "Casual",
    "light-floral": "Light Floral",
    floral: "Floral",
    fruity: "Fruity",
    aromatic: "Aromatic",
    spicy: "Spicy",
    fougere: "Fougère",
  },
  ko: {
    woody: "우디",
    citrus: "시트러스",
    musk: "머스크",
    aqua: "아쿠아",
    green: "그린",
    casual: "캐주얼",
    "light-floral": "라이트 플로럴",
    floral: "플로럴",
    fruity: "프루티",
    aromatic: "아로마틱",
    spicy: "스파이시",
    fougere: "푸제르",
  },
};

// PerfumeResult.jsx 의 룩업 상수들 근처(예: FAMILY_DISPLAY 아래)에 추가
const HASH_BY_ID = {
  1: { ko: ["따뜻함", "안정감"], en: ["Warm", "Grounding"] },
  2: { ko: ["상큼함", "활력"], en: ["Zesty", "Energizing"] },
  3: { ko: ["포근함", "비누향"], en: ["Cozy", "Clean"] },
  4: { ko: ["청량함", "시원함"], en: ["Refreshing", "Cool"] },
  5: { ko: ["풀내음", "산뜻함"], en: ["Leafy", "Fresh"] },
  6: { ko: ["깔끔함", "데일리"], en: ["Clean", "Everyday"] },
  7: { ko: ["청초함", "은은함"], en: ["Delicate", "Airy"] },
  8: { ko: ["로맨틱", "우아함"], en: ["Romantic", "Elegant"] },
  9: { ko: ["달콤함", "발랄함"], en: ["Sweet", "Playful"] },
  10: { ko: ["상쾌함", "편안함"], en: ["Refreshing", "Calming"] },
  11: { ko: ["관능적", "대담함"], en: ["Sensual", "Bold"] },
  12: { ko: ["세련됨", "남성적"], en: ["Refined", "Masculine"] },
};

// 번호별 해시태그(캐주얼 톤) — 값에는 # 미포함!
const HASH_BY_ID_casur = {
  1: { ko: ["포근무드", "우디감성"], en: ["CozyVibes", "WoodyVibes"] },
  2: { ko: ["상큼무드", "비타민향"], en: ["ZestyVibes", "CitrusPop"] },
  3: { ko: ["스킨센트", "비누향무드"], en: ["SkinScent", "CleanVibes"] },
  4: { ko: ["청량무드", "바다향"], en: ["SeaBreeze", "CoolVibes"] },
  5: { ko: ["초록무드", "허브감성"], en: ["GreenVibes", "HerbalFresh"] },
  6: { ko: ["데일리향", "클린코튼"], en: ["EverydayScent", "CleanCotton"] },
  7: { ko: ["청초무드", "은은플로럴"], en: ["SoftFloral", "AiryVibes"] },
  8: { ko: ["로맨틱무드", "우아한플로럴"], en: ["RomanticVibes", "ElegantFloral"] },
  9: { ko: ["달달무드", "상큼달콤"], en: ["SweetVibes", "FruityFun"] },
  10: { ko: ["상쾌무드", "허브테라피"], en: ["FreshHerbal", "CalmVibes"] },
  11: { ko: ["관능무드", "스파이시무드"], en: ["SensualVibes", "SpicyEdge"] },
  12: { ko: ["바버샵무드", "클래식무드"], en: ["BarbershopVibes", "ClassicVibes"] },
};

// 1) i18n 사전 (컴포넌트 위)
const DICT = {
  en: {
    labels: {
      scent: "Scent Family",
      gender: "Gender",
      mbti: "MBTI",
      age: "Age",
      fashion: "Fashion Style",
      preferColor: "Preferred Color",
      purpose: "Purpose",
      category: "Category",
      top: "Top Note",
      middle: "Middle Note",
      base: "Base Note"
    },
    title: "Best match for you",
    shareHashtags: (name) => `#perfume #${name}`,
    // 값 변환
    valueMaps: {
      gender: { female: "Female", male: "Male", unspecified: "Unspecified" },
      age: { "10s": "10s", "20s": "20s", "30s": "30s", "40s": "40s", "50s": "50s", "60s": "60s" },
      // color: { red: "Red", orange: "Orange", yellow: "Yellow", green: "Green", blue: "Blue", navy: "Navy", purple: "Purple" },
      // style: { fresh: "Fresh", sweet: "Sweet", romantic: "Romantic", sensual: "Sensual", urban: "Urban", cool: "Cool" },
    }
  },
  ko: {
    labels: {
      scent: "향 계열",
      gender: "성별",
      mbti: "MBTI",
      age: "나이",
      fashion: "패션 스타일",
      preferColor: "선호 색상",
      purpose: "사용 목적",
      category: "향수 카테고리",
      top: "탑노트",
      middle: "미들노트",
      base: "베이스노트"
    },
    title: "당신에게 어울리는",
    shareHashtags: (name) => `#향수추천 #${name}`,
    valueMaps: {
      gender: { female: "여자", male: "남자", unspecified: "미지정" },
      age: { "10s": "10대", "20s": "20대", "30s": "30대", "40s": "40대", "50s": "50대", "60s": "60대" },
      // color: { red: "빨간색", orange: "주황색", yellow: "노란색", green: "초록색", blue: "파란색", navy: "남색", purple: "보라색" },
      // style: { fresh: "시원함", sweet: "달콤함", romantic: "로맨틱", sensual: "관능적", urban: "도시적", cool: "시원함" },
    }
  }
};

// === Lookup tables (URL 코드 → 표시 텍스트) ===
const AGE_GROUP_FROM_ID = { 0: "NONE", 1: "10s", 2: "20s", 3: "30s", 4: "40s", 5: "50s", 6: "50s" };
const GENDER_TEXT_EN = { 0: "None", 1: "Man", 2: "Woman" };
const GENDER_TEXT_KO = { 0: "None", 1: "남자", 2: "여자" };
const PERSONALITY_MBTI = {
  0: "NONE",
  1: "ENFP", 2: "INFP", 3: "ISFP", 4: "ISTJ", 5: "ISFJ",
  6: "INTJ", 7: "ENTP", 8: "ENFJ", 9: "INFJ", 10: "INTP",
  11: "ISTP", 12: "ESFP", 13: "ESTP", 14: "ESFJ", 15: "ESTJ"
};

const PURPOSE_TEXT = {
  en: { 0: "None", 1: "Mood Boost", 2: "Good Impression", 3: "Unique Style", 4: "Self Satisfaction", 5: "Date or Social", 6: "Formal Occasion", 7: "Special Event" },
  ko: { 0: "없음", 1: "기분 전환", 2: "좋은 인상", 3: "유니크 스타일", 4: "자기 만족", 5: "데이트/사교", 6: "포멀한 자리", 7: "특별한 날" }
};
const PREF_SCENT_TO_PURPOSE_KEY = {
  0: "good_impression", 1: "mood_boost", 2: "good_impression", 3: "self_satisfaction", 4: "date_or_social",
  5: "formal_occasion", 6: "special_event", 7: "unique_style", 8: "mood_boost", 9: "self_satisfaction",
  10: "formal_occasion", 11: "special_event", 12: "unique_style"
};
const PURPOSE_KEY_TO_TEXT = {
  en: { good_impression: "Good Impression", mood_boost: "Mood Boost", unique_style: "Unique Style", self_satisfaction: "Self Satisfaction", date_or_social: "Date or Social", formal_occasion: "Formal Occasion", special_event: "Special Event" },
  ko: { good_impression: "좋은 인상", mood_boost: "기분 전환", unique_style: "유니크 스타일", self_satisfaction: "자기 만족", date_or_social: "데이트/사교", formal_occasion: "포멀한 자리", special_event: "특별한 날" }
};

const FASHION_TEXT = {
  en: { 0: "None", 1: "Casual", 2: "Chic", 3: "Classic", 4: "Free Style", 5: "Lovely", 6: "Minimal", 7: "Modern", 8: "Romantic", 9: "Simple", 10: "Sports" },
  ko: { 0: "없음", 1: "캐주얼", 2: "시크", 3: "클래식", 4: "프리스타일", 5: "러블리", 6: "미니멀", 7: "모던", 8: "로맨틱", 9: "심플", 10: "스포츠" }
};

const PREFER_COLOR_TEXT = {
  en: {
    0: "None",
    1: "Beige",
    2: "Black",
    3: "Blue",
    4: "Brown",
    5: "Coral",
    6: "Gray",
    7: "Green",
    8: "Mint",
    9: "Orange",
    10: "Pink"
  },
  ko: {
    0: "없음",
    1: "베이지",
    2: "블랙",
    3: "블루",
    4: "브라운",
    5: "코랄",
    6: "그레이",
    7: "그린",
    8: "민트",
    9: "오렌지",
    10: "핑크"
  }
};

// 번호별 노트 매핑 (Top/Middle/Base 텍스트)
// "-" 는 해당 노트 미사용을 의미 — 그대로 출력됩니다.
const NOTES_BY_ID = {
  1: {
    code: "#WD-001-SND",
    top: "Fresh hay, Clove buds",
    middle: "Cedar wood, Patchouli",
    base: "Sandalwood, Light vanilla",
  },
  2: {
    code: "#CT-002-BRG",
    top: "Italian Lemon, Sweet Mandarin",
    middle: "Bergamot, Star anise",
    base: "White Musk",
  },
  3: {
    code: "#MS-003-MSK",
    top: "-",
    middle: "-",
    base: "Animal, Musky",
  },
  4: {
    code: "#AQ-004-DRF",
    top: "Italian Bergamot, Orange Sicilian Lemon",
    middle: "Black pepper, Sea breeze, Clary sage",
    base: "Patchouli, Sandalwood, Sensual Musk",
  },
  5: {
    code: "#GR-005-HRN",
    top: "Orange, Bergamot, Wild Flower",
    middle: "Pine, Rosemary, Lavender",
    base: "Sandalwood, Guaiac Wood, Patchouli",
  },
  6: {
    code: "#CS-006-LSM",
    top: "Aldehydes, Green, Pear",
    middle: "Rose, Iris, Orange Blossom",
    base: "White Musk, Ambrette, Patchouli",
  },
  7: {
    code: "#LF-007-NRC",
    top: "California Lemon, Green Tea",
    middle: "Narcissus, Water Lily, Pink Peony, Muguet",
    base: "Iris Petals, Baby Musk",
  },
  8: {
    code: "#FL-008-TLP",
    top: "Cyclamen, Freesia, Rhubarb",
    middle: "Tulip",
    base: "Blonde Woods, Vetiver",
  },
  9: {
    code: "#FR-009-BRV",
    top: "Black Berries, Black Currant, Orange",
    middle: "Orris, Osmanthus Flower, Jasmine",
    base: "Sandalwood, Vanilla Orchid, Musk",
  },
  10: {
    code: "#AR-010-HRB",
    top: "Herbal, Aromatic, Fresh",
    middle: "-",
    base: "-",
  },
  11: {
    code: "#SO-011-SKT",
    top: "Blackberry, Rum, Saffron",
    middle: "Clary sage, Leather accord",
    base: "Patchouli, Powdery musk",
  },
  12: {
    code: "#FJ-012-AVT",
    top: "Bergamot, Black currant leaves",
    middle: "Pink berries, Jasmine, Birch",
    base: "Musk, Oakmoss, Vanilla",
  },
};


const CATEGORY_TEXT = {
  en: { 0: "None", 1: "Aquatic", 2: "Aromatic", 3: "Casual", 4: "Citrus", 5: "Floral", 6: "Fougère", 7: "Fruity", 8: "Green", 9: "Light Floral", 10: "Musk", 11: "Spicy", 12: "Woody" },
  ko: { 0: "없음", 1: "아쿠아틱", 2: "아로마틱", 3: "캐주얼", 4: "시트러스", 5: "플로럴", 6: "푸제르", 7: "프루티", 8: "그린", 9: "라이트 플로럴", 10: "머스크", 11: "스파이시", 12: "우디" }
};

// 번호 → 카드 정보
const SCENT_CARD_BY_ID = {
  1: { title: "Sandalwood", family: "Woody" },
  2: { title: "Bergamot Citrus", family: "Citrus" },
  3: { title: "Musk Base", family: "Musk" },
  4: { title: "Wind, Waves, Driftwood Surf!", family: "Aqua" },
  5: { title: "Halla Mountain", family: "Green" },
  6: { title: "Lazy Sunday Morning", family: "Casual" },
  7: { title: "Narcissus", family: "Light Floral" },
  8: { title: "La Tulipe", family: "Floral" },
  9: { title: "Black Raspberry & Vanilla", family: "Fruity" },
  10: { title: "Herb Base", family: "Aromatic" },
  11: { title: "Accord Oud", family: "Spicy" },
  12: { title: "Aventus", family: "Fougère" }, // 표시는 악센트 유지
};

// 번호 → 표시용 슬러그(ASCII 권장)
const SCENT_SLUG_BY_ID = {
  1: "sandalwood-woody",
  2: "bergamot-citrus",
  3: "musk-base",
  4: "driftwood-surf-aqua",
  5: "halla-mountain-green",
  6: "lazy-sunday-morning-casual",
  7: "narcissus-light-floral",
  8: "la-tulipe-floral",
  9: "black-raspberry-vanilla-fruity",
  10: "herb-base-aromatic",
  11: "accord-oud-spicy",
  12: "aventus-fougere", // 슬러그는 ASCII로
};

const COLORS_BY_ID = {
  // 1 Sandalwood — 따뜻한 우디/앰버
  1: { overlapGroup: "#5a3b15", overlap: "#e0a458" },

  // 2 Bergamot Citrus — 선명한 오렌지/시트러스
  2: { overlapGroup: "#b45309", overlap: "#f59e0b" },

  // 3 Musk Base — 소프트 그레이(비누/스킨센트)
  3: { overlapGroup: "#9ca3af", overlap: "#e5e7eb" },

  // 4 Wind, Waves, Driftwood Surf! — 딥 블루/아쿠아
  4: { overlapGroup: "#075985", overlap: "#22d3ee" },

  // 5 Halla Mountain — 포레스트 그린 + 안개 낀 연그린
  5: { overlapGroup: "#166534", overlap: "#a7f3d0" },

  // 6 Lazy Sunday Morning — 라이트 스톤/린넨
  6: { overlapGroup: "#a8a29e", overlap: "#f5f5f4" },

  // 7 Narcissus — 라이트 플로럴(소프트 엠버)
  7: { overlapGroup: "#a16207", overlap: "#fde68a" },

  // 8 La Tulipe — 뮤트 로즈 + 핑크
  8: { overlapGroup: "#9d174d", overlap: "#f9a8d4" },

  // 9 Black Raspberry & Vanilla — 다크 베리 + 바이올렛 악센트
  9: { overlapGroup: "#1f2937", overlap: "#a855f7" },

  // 10 Herb Base — 허브 그린
  10: { overlapGroup: "#065f46", overlap: "#34d399" },

  // 11 Accord Oud — 스모키 다크 + 앰버(잿불)  ← 직전에 맞춘 값 유지
  11: { overlapGroup: "#1c1917", overlap: "#d97706" },

  // 12 Aventus — 차콜 그레이 + 소프트 실버  ← 직전에 맞춘 값 유지
  12: { overlapGroup: "#374151", overlap: "#d1d5db" },
};




const getLangFromURL = () => {
  try {
    const u = new URL(window.location.href);
    const l = u.searchParams.get('lang');
    return (l === 'en' || l === 'ko') ? l : null;
  } catch { return null; }
};



export default function PerfumeResult() {

  const data = useMemo(() => {
    const N = 12; // 카드 개수
    return Array.from({ length: N }, (_, i) => {
      const id = i + 1;
      const card = SCENT_CARD_BY_ID[id] || {};
      const family = card.family || "";
      const familySlug = toFamilySlug(family);
      const image = IMAGE_BY_FAMILY[familySlug] || img1;

      // ★ 추가: 번호별 노트 텍스트 주입
      const notes = NOTES_BY_ID[id] || {};
      const topNoteText = notes.top ?? "-";
      const middleNoteText = notes.middle ?? "-";
      const baseNoteText = notes.base ?? "-";

      return {
        subTitle: card.title || `Scent ${id}`,
        code: notes.code || "",               // ★ 코드 주입
        hash: HASH_BY_ID_casur[id] || { ko: ["포근무드", "데일리향"], en: ["CozyVibes", "EverydayScent"] },
        // 기존: 빈 문자열이었음 → 실제 텍스트 주입
        topNote: topNoteText,
        middleNote: middleNoteText,
        baseNote: baseNoteText,
        image,
        colors: COLORS_BY_ID?.[id] || { overlapGroup: "#333", overlap: "#bbb" },
      };
    });
  }, []);


  // ...기존 state들...
  const cardRef = React.useRef(null);

  // PerfumeResult.jsx 상단의 state들 근처에 추가
  const [urlTick, setUrlTick] = useState(0);

  // URL 뒤로가기/앞으로가기(popstate)도 잡아서 갱신
  useEffect(() => {
    const onPop = () => setUrlTick(t => t + 1);
    window.addEventListener('popstate', onPop);
    return () => window.removeEventListener('popstate', onPop);
  }, []);

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
    [data.length, urlTick]
  );
  const item = data[perfume - 1];

  const vScent = useMemo(() => {
    const famRaw = SCENT_CARD_BY_ID[perfume]?.family ?? ""; // 예: "Fougère" / "Floral"
    const slug = toFamilySlug(famRaw);                      // → "fougere" / "floral"
    const map = FAMILY_DISPLAY[lang] ?? FAMILY_DISPLAY.en;
    return map[slug] ?? famRaw; // 언어 맵에 없으면 원문 그대로
  }, [perfume, lang]);

  const [showTitle, setShowTitle] = useState(false);
  const [showImage, setShowImage] = useState(false);
  const [visibleRows, setVisibleRows] = useState([]);
  const [shareOpen, setShareOpen] = useState(false);
  const openShare = () => setShareOpen(true);
  const closeShare = () => setShareOpen(false);

  const rowOrder = ["scent", "gender", "mbti", "age", "fashion", "preferColor", "purpose", "category", "top", "middle", "base"];

  // 렌더 규칙 설정화: 여기에 항목을 추가/제거하면 화면이 바뀜
  const ROWS = [
    { type: "text", key: "scent", valueFrom: () => vScent },
    { type: "text", key: "gender", valueFrom: () => vGender },
    { type: "text", key: "mbti", valueFrom: () => vMbti },
    { type: "text", key: "age", valueFrom: () => vAge },
    { type: "text", key: "fashion", valueFrom: () => vFashion },
    { type: "text", key: "preferColor", valueFrom: () => vPreferColor },
    { type: "text", key: "purpose", valueFrom: () => vPurpose },
    // { type: "text", key: "category", valueFrom: () => vCategory },

    // ★ 추가: 노트 "텍스트" 행(바 위에 텍스트 먼저 노출)
    { type: "text", key: "top", valueFrom: () => item.topNote || "-" },
    { type: "text", key: "middle", valueFrom: () => item.middleNote || "-" },
    { type: "text", key: "base", valueFrom: () => item.baseNote || "-" },

    { type: "note", key: "top", valueFrom: () => Number(params.top) || 0 },
    { type: "note", key: "middle", valueFrom: () => Number(params.middle) || 0 },
    { type: "note", key: "base", valueFrom: () => Number(params.base) || 0 },
  ];

  // 랜덤 정수 [min, max]
  const rint = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;


  const copyBlendCode = async () => {
    if (!item?.code) return;
    try {
      await navigator.clipboard.writeText(item.code);
      alert(lang === 'ko' ? '향수 코드를 복사했어요.' : 'Blend code copied.');
    } catch (e) {
      console.warn(e);
    }
  };

  // 합이 100이 되는 탑/미들/베이스 (각각 최소 10 보장)
  const randomNotes100 = () => {
    let top, middle, base;
    do {
      top = rint(10, 70);
      middle = rint(10, 80 - top);
      base = 100 - top - middle;
    } while (base < 10 || base > 80);
    return { top, middle, base };
  };

  // MBTI 샘플(원하는대로 더/덜 넣어도 됨)
  const MBTIS = ["ENFP", "INFP", "ISFP", "ISTJ", "ISFJ", "INTJ", "ENTP", "ENFJ", "INFJ", "INTP", "ISTP", "ESFP", "ESTP", "ESFJ", "ESTJ"];

  // 다음 perfume (1..12 순환)
  const nextPerfumeId = (cur) => (cur % 12) + 1;


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
  }, [perfume, params.top, params.middle, params.base, lang]);

  // 값 매핑 (언어별)
  // const vGender = valueMaps.gender[params.gender] ?? params.gender;
  // const vAge = valueMaps.age[params.age] ?? params.age;
  // const vColor = valueMaps.color[params.color] ?? params.color;
  // const vStyle = valueMaps.style[params.style] ?? params.style;

  // --- Gender: 문자열(female/male/unspecified) 또는 코드(gender_id=1/2) 모두 지원
  const vGender = (() => {
    const gid = Number(params.gender_id);
    if (!Number.isNaN(gid) && gid !== 0) {
      return (lang === 'ko' ? GENDER_TEXT_KO : GENDER_TEXT_EN)[gid] ?? '';
    }
    if (params.gender) return valueMaps.gender[params.gender] ?? params.gender;
    return '';
  })();

  // --- Age: 문자열(20s 등) 또는 코드(age_id) 지원 → 언어별 표기로 변환
  const vAge = (() => {
    const aid = Number(params.age_id);
    if (!Number.isNaN(aid) && aid !== 0) {
      const grp = AGE_GROUP_FROM_ID[aid];
      return valueMaps.age[grp] ?? grp ?? '';
    }
    const grp = params.age;
    return valueMaps.age[grp] ?? grp ?? '';
  })();

  // --- MBTI: 문자열(mbti) 또는 코드(personality) 지원
  const vMbti = (() => {
    const raw = params.mbti ?? PERSONALITY_MBTI[Number(params.personality)];
    return (raw ? String(raw).toUpperCase() : '');
  })();

  // --- Fashion Style: 문자열(fashion) 또는 코드(fashion_id)
  const vFashion = (() => {
    const table = FASHION_TEXT[lang === 'ko' ? 'ko' : 'en'];
    if (params.fashion != null) {
      const s = String(params.fashion).toLowerCase();
      // 문자열이 오면 첫 글자만 대문자(or ko 그대로)
      const rev = Object.entries(table).find(([, v]) => v.toLowerCase?.() === s);
      return rev ? rev[1] : params.fashion;
    }
    const fid = Number(params.fashion_id);
    if (!Number.isNaN(fid)) return table[fid] ?? '';
    return '';
  })();

  // --- Preferred Color: 문자열(pref_color) 또는 코드(pref_color_id)
  const vPreferColor = (() => {
    const table = PREFER_COLOR_TEXT[lang === 'ko' ? 'ko' : 'en'];
    if (params.pref_color != null) {
      const key = String(params.pref_color).toLowerCase();
      const rev = Object.entries(table).find(([, v]) => v.toLowerCase?.() === key);
      return rev ? rev[1] : params.pref_color;
    }
    const cid = Number(params.pref_color_id);
    if (!Number.isNaN(cid)) return table[cid] ?? '';
    return '';
  })();

  // --- Purpose: 코드(purpose_id) 또는 키(purpose) 또는 선호향코드(pref_scent)
  const vPurpose = (() => {
    const t = PURPOSE_TEXT[lang === 'ko' ? 'ko' : 'en'];
    if (params.purpose_id != null) return t[Number(params.purpose_id)] ?? '';
    if (params.purpose != null) return PURPOSE_KEY_TO_TEXT[lang === 'ko' ? 'ko' : 'en'][String(params.purpose)] ?? String(params.purpose);
    if (params.pref_scent != null) {
      const key = PREF_SCENT_TO_PURPOSE_KEY[Number(params.pref_scent)];
      return PURPOSE_KEY_TO_TEXT[lang === 'ko' ? 'ko' : 'en'][key] ?? '';
    }
    return '';
  })();

  // --- Category: 문자열(category) 또는 코드(category_id)
  const vCategory = (() => {
    const table = CATEGORY_TEXT[lang === 'ko' ? 'ko' : 'en'];
    if (params.category != null) {
      const key = String(params.category).toLowerCase();
      const rev = Object.entries(table).find(([, v]) => v.toLowerCase?.() === key);
      return rev ? rev[1] : params.category;
    }
    const cid = Number(params.category_id);
    if (!Number.isNaN(cid)) return table[cid] ?? '';
    return '';
  })();


  const sampleUrl = useMemo(() => buildSampleUrl(), []);

  const handleSampleClick = (e) => {
    e.preventDefault();
    const nextId = nextPerfumeId(perfume);
    const { top, middle, base } = randomNotes100();

    const url = buildSampleUrl({
      path: "/result",
      lang,               // 현재 언어 유지
      perfume: nextId,    // ★ 1→12 순환
      gender_id: rint(1, 2),
      age_id: rint(1, 6),
      mbti: MBTIS[rint(0, MBTIS.length - 1)],
      fashion_id: rint(1, 10),
      pref_color_id: rint(1, 14),
      purpose_id: rint(1, 7),
      category_id: rint(1, 12),
      top, middle, base,  // 합 100
    });

    window.history.pushState({}, "", url); // 새로고침 없이 URL만 변경
    setUrlTick(t => t + 1);                // parseQuery 재실행 유도
  };


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
        text: `${item.subTitle} - ${dict.title}`,
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
                {/* 기존 sub-title → 제품명 유지 */}
                <div className="sub-title">{item.subTitle}</div>
                {/* ✨ 메인 타이틀: 나만의 블렌드 */}
                <div className="title fancy-title">
                  {lang === 'ko' ? '나만의 블렌드' : 'Your Signature Blend'}
                </div>
                {/* 🔖 코드 칩 (클릭 → 복사) */}
                {item.code && (
                  <button className="code-chip" onClick={copyBlendCode} title={lang === 'ko' ? '코드 복사' : 'Copy code'}>
                    {item.code}
                    <span className="sparkle">✦</span>
                  </button>
                )}

                {/* 🪄 서브/태그라인: 선택 기반 + 곧 직접 조절 */}
                <div className="tagline">
                  {lang === 'ko'
                    ? `당신의 선택으로 빚은 블렌드 코드 ${item.code || '-'}`
                    : `Blend code ${item.code || '-'} crafted from your choices`}
                </div>



                <div className="title">{dict.title}</div>
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
                <button className="icon-chip" aria-label="예시 값 입력" onClick={handleSampleClick}>
                  <span role="img" aria-label="sparkles">✨</span>
                </button>

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
                <div className="image-dim" style={{ "--dim": 0.30 }} />  {/* 투명도 0~1 */}

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
