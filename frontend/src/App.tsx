import { useState, useEffect } from "react";
import MemberCard from "./MemberCard";
import type { Member } from "./MemberCard";
import "./App.css";

const members: Member[] = [
  {
    name: "김멋사",
    mbti: "INFP",
    bio: "조용히 코딩하는 백엔드 지망생",
    image: "https://picsum.photos/seed/lion1/300",
    hobby: "음악 감상, 독서",
    language: "Python, Django",
    github: "https://github.com/kimmeotsa",
  },
  {
    name: "이사자",
    mbti: "ENFJ",
    bio: "같이 하면 더 재밌어요!",
    image: "https://picsum.photos/seed/lion2/300",
    hobby: "러닝, 보드게임",
    language: "JavaScript, React",
    github: "https://github.com/leesaja",
  },
  {
    name: "박처럼",
    mbti: "ISTP",
    bio: "일단 만들고 봅니다",
    image: "https://picsum.photos/seed/lion3/300",
    hobby: "사진, 등산",
    language: "TypeScript, Node.js",
    github: "https://github.com/parkcheoreom",
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
                <li>공통점 1 — 여기에 내용 작성</li>
                <li>공통점 2 — 여기에 내용 작성</li>
                <li>공통점 3 — 여기에 내용 작성</li>
              </ul>
            </div>

            <div className="compare-card diff">
              <h3 className="compare-title">✨ 우리의 차이점</h3>
              <table className="compare-table">
                <thead>
                  <tr>
                    <th>항목</th>
                    <th>김멋사</th>
                    <th>이사자</th>
                    <th>박처럼</th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td>MBTI</td>
                    <td>INFP</td>
                    <td>ENFJ</td>
                    <td>ISTP</td>
                  </tr>
                  <tr>
                    <td>스타일</td>
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                  </tr>
                  <tr>
                    <td>선호 언어</td>
                    <td>-</td>
                    <td>-</td>
                    <td>-</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </section>
        </main>
      )}

      {/* 밸런스게임 */}
      {page === "balance" && (
        <main className="content">
          <h2 className="section-title">MBTI 궁합 체크 🔮</h2>
          <p style={{ color: "#666" }}>
            여긴 팀원 B가 fetch 연동, 팀원 C가 Django API를 붙일 자리예요!
          </p>
        </main>
      )}

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
