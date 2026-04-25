import { useState, useEffect } from "react";
import MemberCard from "./MemberCard";
import type { Member } from "./MemberCard";
import "./App.css";
import BalanceGame from "./BalanceGame";

const members: Member[] = [
  {
    name: "박소호",
    mbti: "ESTP",
    bio: "미래를 준비중인 대학생",
    image: "https://picsum.photos/seed/lion1/300",
    hobby: "영화 시청, 사진 촬영",
    language: "Java, Python",
    github: "https://github.com/thinghon",
  },
  {
    name: "안수진",
    mbti: "INTP",
    bio: "차차 배워가는 개발 입문자입니다",
    image: "https://picsum.photos/seed/lion2/300",
    hobby: "음악 감상, 책 구경, 영화 감상",
    language: "C(공부중)",
    github: "https://github.com/sznii161",
  },
  {
    name: "권태열",
    mbti: "ENTP",
    bio: "다양한걸 경험해보고 싶은 개발자가 되고싶습니다.",
    image: "https://picsum.photos/seed/lion3/300",
    hobby: "운동, 영화 감상, 음악 감상",
    language: "Spring(공부중), Python",
    github: "https://github.com/gtae10",
  },
];

export default function App() {
  const [page, setPage] = useState<"members" | "balance">("members");
  const [selected, setSelected] = useState<Member | null>(null);

  // ESC 키로 모달 닫기
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setSelected(null);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  return (
    <div className="app">
      {/* 상단 네비게이션 */}
      <nav className="navbar">
        <h1 className="logo">Lions</h1>
        <ul className="nav-menu">
          <li
            className={page === "members" ? "active" : ""}
            onClick={() => setPage("members")}
          >
            팀원 소개
          </li>
          <li
            className={page === "balance" ? "active" : ""}
            onClick={() => setPage("balance")}
          >
            밸런스게임
          </li>
        </ul>
      </nav>

      {/* 팀원 소개 */}
      {page === "members" && (
        <main className="content">
          <h2 className="section-title">우리 팀을 소개합니다 🦁</h2>
          <div className="card-list">
            {members.map((m) => (
              <MemberCard
                key={m.name}
                member={m}
                onClick={() => setSelected(m)}
              />
            ))}
          </div>
          {/* 공통점 · 차이점 비교 섹션 */}
          <section className="compare-section">
            <div className="compare-card common">
              <h3 className="compare-title">🤝 우리의 공통점</h3>
              <ul className="compare-list">
                <li>멋쟁이사자처럼 14기예요🦁</li>
                <li>영화 감상을 즐겨요</li>
                <li>MBTI가 TP(사고형, 인식형)이에요</li>
              </ul>
            </div>

            <div className="compare-card diff">
              <h3 className="compare-title">✨ 우리의 차이점</h3>
              <table className="compare-table">
                <thead>
                  <tr>
                    <th>항목</th>
                    <th>박소호</th>
                    <th>안수진</th>
                    <th>권태열</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>MBTI</td>
                    <td>ESTP</td>
                    <td>INTP</td>
                    <td>ENTP</td>
                  </tr>
                  <tr>
                    <td>선호 언어</td>
                    <td>Java, Python</td>
                    <td>C</td>
                    <td>Spring, Python</td>
                  </tr>
                  <tr>
                    <td>취미</td>
                    <td>영화, 사진</td>
                    <td>음악, 독서</td>
                    <td>운동, 영화, 음악</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </main>
      )}

      {/* 밸런스게임 */}
      {page === "balance" && <BalanceGame />}

      {/* 모달 팝업 — 카드 클릭 시 */}
      {selected && (
        <div className="modal-backdrop" onClick={() => setSelected(null)}>
          <div className="modal" onClick={(e) => e.stopPropagation()}>
            <button className="close-btn" onClick={() => setSelected(null)}>
              ✕
            </button>
            <img
              src={selected.image}
              alt={selected.name}
              className="modal-img"
            />
            <h2 className="modal-name">{selected.name}</h2>
            <span className="modal-mbti">{selected.mbti}</span>
            <div className="modal-info">
              <p>
                <b>한마디</b>
                <span>{selected.bio}</span>
              </p>
              <p>
                <b>취미</b>
                <span>{selected.hobby}</span>
              </p>
              <p>
                <b>선호 언어</b>
                <span>{selected.language}</span>
              </p>
              <p>
                <b>GitHub</b>
                <a
                  href={selected.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="github-link"
                >
                  {selected.github.replace("https://github.com/", "@")}
                </a>
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
