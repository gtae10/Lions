import { useState, useEffect } from "react";

type Question = {
  id: number;
  a: string;
  b: string;
};

type Answer = "a" | "b";

type Step = "ready" | "selectPlayer" | "playing" | "saved" | "result";

type MemberAnswers = Record<string, Answer[]>;

type PersonMatch = {
  name: string;
  matchCount: number;
};

type CompatibilityResult = {
  member: string;
  similarPeople: PersonMatch[];
  differentPeople: PersonMatch[];
  neutralPeople: PersonMatch[];
};

type ResultResponse = {
  results: CompatibilityResult[];
  totalCount: number;
};

const PLAYERS = ["박소호", "안수진", "권태열"];

export default function BalanceGame() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);

  const [memberAnswers, setMemberAnswers] = useState<MemberAnswers>(() => {
    const saved = localStorage.getItem("memberAnswers");

    if (!saved) {
      return {};
    }

    try {
      return JSON.parse(saved);
    } catch {
      localStorage.removeItem("memberAnswers");
      return {};
    }
  });

  const [selectedPlayer, setSelectedPlayer] = useState<string>("");
  const [result, setResult] = useState<ResultResponse | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<Step>("ready");

  useEffect(() => {
    fetch("http://127.0.0.1:8000/api/questions/")
      .then((res) => {
        if (!res.ok) {
          throw new Error("질문 API 요청 실패");
        }

        return res.json();
      })
      .then((data: Question[]) => {
        setQuestions(data);
      })
      .catch(() => {
        setError("질문을 불러오지 못했습니다. 백엔드 서버를 확인해주세요.");
      });
  }, []);

  const handleStart = () => {
    setStep("selectPlayer");
    setSelectedPlayer("");
    setAnswers([]);
    setResult(null);
    setError(null);
  };

  const handleSelectPlayer = (player: string) => {
    setSelectedPlayer(player);
    setCurrent(0);
    setAnswers([]);
    setResult(null);
    setError(null);
    setStep("playing");
  };

  const handleSelect = (choice: Answer) => {
    const newAnswers = [...answers, choice];
    setAnswers(newAnswers);

    if (current + 1 >= questions.length) {
      if (!selectedPlayer) {
        setError("플레이어를 먼저 선택해주세요.");
        return;
      }

      const updatedMemberAnswers: MemberAnswers = {
        ...memberAnswers,
        [selectedPlayer]: newAnswers,
      };

      setMemberAnswers(updatedMemberAnswers);
      localStorage.setItem(
        "memberAnswers",
        JSON.stringify(updatedMemberAnswers)
      );

      setStep("saved");
      return;
    }

    setCurrent((prev) => prev + 1);
  };

  const handleRunResult = async () => {
    setError(null);
    setResult(null);

    if (Object.keys(memberAnswers).length < 2) {
      setError("결과를 확인하려면 최소 2명 이상의 답변이 필요합니다.");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("http://127.0.0.1:8000/api/result/", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          memberAnswers: memberAnswers,
        }),
      });

      if (!res.ok) {
        throw new Error("결과 API 요청 실패");
      }

      const data: ResultResponse = await res.json();
      setResult(data);
      setStep("result");
    } catch {
      setError("결과를 불러오지 못했습니다. 백엔드 API를 확인해주세요.");
    } finally {
      setLoading(false);
    }
  };

  const handleReset = () => {
    setStep("ready");
    setCurrent(0);
    setAnswers([]);
    setSelectedPlayer("");
    setResult(null);
    setError(null);
  };

  const handlePlayAgain = () => {
    setStep("selectPlayer");
    setCurrent(0);
    setAnswers([]);
    setSelectedPlayer("");
    setResult(null);
    setError(null);
  };

  const handleClearAll = () => {
    setMemberAnswers({});
    localStorage.removeItem("memberAnswers");
    setStep("ready");
    setCurrent(0);
    setAnswers([]);
    setSelectedPlayer("");
    setResult(null);
    setError(null);
  };

  if (questions.length === 0) {
    return (
      <main className="content">
        <h2 className="section-title">밸런스 게임 🎮</h2>

        <div className="balance-result">
          <div className="balance-result-emoji">🛠️</div>
          <p className="balance-result-label">선택지를 준비 중이에요</p>
          <p className="balance-result-sub">
            Django 백엔드에서 질문을 불러오고 있습니다.
          </p>
        </div>

        {error && (
          <p style={{ textAlign: "center", color: "#e05", marginTop: "32px" }}>
            {error}
          </p>
        )}
      </main>
    );
  }

  const progress = Math.round(((current + 1) / questions.length) * 100);

  return (
    <main className="content">
      <h2 className="section-title">밸런스 게임 🎮</h2>

      {step === "ready" && (
        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginTop: "40px",
          }}
        >
          <div
            style={{
              width: "100%",
              maxWidth: "540px",
              minHeight: "320px",
              background: "#ffffff",
              borderRadius: "28px",
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              justifyContent: "center",
              boxShadow: "0 12px 32px rgba(0, 0, 0, 0.08)",
              padding: "40px 24px",
            }}
          >
            <div
              style={{
                fontSize: "54px",
                marginBottom: "4px",
                transform: "translateY(-25px)",
              }}
            >
              🎮
            </div>

            <p
              style={{
                fontSize: "24px",
                fontWeight: 700,
                color: "#333",
                marginBottom: "18px",
              }}
            >
              밸런스 게임을 시작해보세요!
            </p>

            <p
              style={{
                fontSize: "18px",
                color: "#666",
                marginBottom: "36px",
                textAlign: "center",
                lineHeight: "1.6",
              }}
            >
              시작 버튼을 누르면 플레이어를 선택할 수 있습니다.
            </p>

            <button
              className="balance-retry-btn"
              onClick={handleStart}
              style={{
                background: "#111",
                color: "#fff",
                border: "none",
                borderRadius: "999px",
                padding: "16px 36px",
                fontSize: "18px",
                fontWeight: 700,
                cursor: "pointer",
              }}
            >
              시작하기
            </button>
          </div>
        </div>
      )}

      {step === "selectPlayer" && (
        <div className="balance-result">
          <div className="balance-result-emoji">🧑‍💻</div>
          <p className="balance-result-label">누가 플레이하나요?</p>
          <p className="balance-result-sub">
            답변을 저장할 팀원을 선택해주세요.
          </p>

          <div
            style={{
              display: "flex",
              gap: "12px",
              justifyContent: "center",
              flexWrap: "wrap",
              marginTop: "24px",
            }}
          >
            {PLAYERS.map((player) => (
              <button
                key={player}
                className="balance-retry-btn"
                onClick={() => handleSelectPlayer(player)}
              >
                {player}
              </button>
            ))}
          </div>

          <SavedPlayerList memberAnswers={memberAnswers} />
        </div>
      )}

      {step === "playing" && (
        <>
          <p className="balance-subtitle">
            {selectedPlayer}님의 취향을 선택해주세요!
          </p>

          <div className="balance-game">
            <div className="balance-progress-wrap">
              <span className="balance-progress-label">
                {current + 1} / {questions.length}
              </span>

              <div className="balance-progress-bar">
                <div
                  className="balance-progress-fill"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            <div className="balance-cards">
              <button
                className="balance-card balance-card-a"
                onClick={() => handleSelect("a")}
                disabled={loading}
              >
                <span className="balance-card-label">A</span>
                <span className="balance-card-text">
                  {questions[current].a}
                </span>
              </button>

              <span className="balance-card-vs">VS</span>

              <button
                className="balance-card balance-card-b"
                onClick={() => handleSelect("b")}
                disabled={loading}
              >
                <span className="balance-card-label">B</span>
                <span className="balance-card-text">
                  {questions[current].b}
                </span>
              </button>
            </div>
          </div>
        </>
      )}

      {step === "saved" && (
        <div className="balance-result">
          <div className="balance-result-emoji">✅</div>

          <p className="balance-result-label">
            {selectedPlayer}님의 답변이 저장되었습니다!
          </p>

          <p className="balance-result-sub">
            현재 저장된 플레이어 수: {Object.keys(memberAnswers).length}명
          </p>

          <div
            style={{
              display: "flex",
              gap: "12px",
              justifyContent: "center",
              flexWrap: "wrap",
              marginTop: "24px",
            }}
          >
            <button className="balance-retry-btn" onClick={handlePlayAgain}>
              다른 사람도 하기
            </button>

            <button className="balance-retry-btn" onClick={handleReset}>
              처음으로
            </button>

            <button className="balance-retry-btn" onClick={handleClearAll}>
              저장 초기화
            </button>

            <button className="balance-retry-btn" onClick={handleRunResult}>
              밸런스게임 결과 보기
            </button>
          </div>

          <SavedPlayerList memberAnswers={memberAnswers} />
        </div>
      )}

      {step === "result" && result && (
        <div
          style={{
            width: "100%",
            maxWidth: "980px",
            margin: "0 auto",
            padding: "20px 0",
            textAlign: "center",
          }}
        >
          <div
            style={{
              background: "#fff",
              borderRadius: "28px",
              padding: "40px 36px",
              boxShadow: "0 12px 32px rgba(0, 0, 0, 0.08)",
            }}
          >
            <div style={{ fontSize: "44px", marginBottom: "10px" }}>✨</div>

            <h3
              style={{
                fontSize: "28px",
                marginBottom: "10px",
                color: "#111",
              }}
            >
              취향 케미 결과
            </h3>

            <p
              style={{
                color: "#777",
                marginBottom: "34px",
                fontSize: "16px",
                lineHeight: "1.6",
              }}
            >
              서로의 선택을 기준으로 우리 팀의 취향 케미를 확인해봤어요.
            </p>

            <div
              style={{
                display: "grid",
                gridTemplateColumns: "repeat(3, minmax(0, 1fr))",
                gap: "20px",
                width: "100%",
                alignItems: "stretch",
              }}
            >
              {result.results.map((item) => (
                <div
                  key={item.member}
                  style={{
                    background: "#fff",
                    borderRadius: "22px",
                    padding: "24px",
                    boxShadow: "0 8px 22px rgba(0, 0, 0, 0.08)",
                    border: "1px solid #eee",
                    textAlign: "left",
                    minWidth: 0,
                  }}
                >
                  <div
                    style={{
                      textAlign: "center",
                      marginBottom: "20px",
                    }}
                  >
                    <div
                      style={{
                        width: "58px",
                        height: "58px",
                        borderRadius: "50%",
                        background: "#cef249",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        margin: "0 auto 12px",
                        fontSize: "28px",
                      }}
                    >
                      🦁
                    </div>

                    <h3
                      style={{
                        fontSize: "22px",
                        marginBottom: "6px",
                        color: "#111",
                        textAlign: "center",
                      }}
                    >
                      {item.member}
                    </h3>

                    <p
                      style={{
                        fontSize: "13px",
                        color: "#888",
                        textAlign: "center",
                      }}
                    >
                      {item.member}님의 취향 매칭 결과
                    </p>
                  </div>

                  <ResultLine
                    icon="💛"
                    title="취향 케미가 좋은 사람"
                    people={item.similarPeople}
                    totalCount={result.totalCount}
                    emptyText="아직 뚜렷하게 가까운 취향은 없어요"
                  />

                  <ResultLine
                    icon="🌈"
                    title="색다른 취향을 가진 사람"
                    people={item.differentPeople}
                    totalCount={result.totalCount}
                    emptyText="크게 다른 취향은 없어요"
                  />

                  {item.neutralPeople.length > 0 && (
                    <ResultLine
                      icon="🤝"
                      title="적당히 다른 매력의 사람"
                      people={item.neutralPeople}
                      totalCount={result.totalCount}
                      emptyText="없음"
                    />
                  )}
                </div>
              ))}
            </div>

            <div
              style={{
                display: "flex",
                gap: "12px",
                justifyContent: "center",
                flexWrap: "wrap",
                marginTop: "36px",
              }}
            >
              <button className="balance-retry-btn" onClick={handlePlayAgain}>
                다른 사람도 하기
              </button>

              <button
                className="balance-retry-btn"
                onClick={() => setStep("saved")}
              >
                저장 화면으로
              </button>

              <button className="balance-retry-btn" onClick={handleReset}>
                처음으로
              </button>
            </div>
          </div>
        </div>
      )}

      {loading && (
        <p style={{ textAlign: "center", color: "#aaa", marginTop: "32px" }}>
          처리 중...
        </p>
      )}

      {error && (
        <p style={{ textAlign: "center", color: "#e05", marginTop: "32px" }}>
          {error}
        </p>
      )}
    </main>
  );
}

function ResultLine({
  icon,
  title,
  people,
  totalCount,
  emptyText,
}: {
  icon: string;
  title: string;
  people: PersonMatch[];
  totalCount: number;
  emptyText: string;
}) {
  return (
    <div
      style={{
        marginTop: "14px",
        padding: "15px",
        borderRadius: "15px",
        background: "#fafafa",
        border: "1px solid #f1f1f1",
        width: "100%",
        boxSizing: "border-box",
      }}
    >
      <p
        style={{
          fontWeight: 700,
          marginBottom: "8px",
          color: "#222",
          fontSize: "14px",
          lineHeight: "1.5",
        }}
      >
        {icon} {title}
      </p>

      {people.length === 0 ? (
        <p
          style={{
            color: "#888",
            fontSize: "13px",
            lineHeight: "1.6",
          }}
        >
          {emptyText}
        </p>
      ) : (
        people.map((person) => (
          <p
            key={person.name}
            style={{
              color: "#444",
              fontSize: "13px",
              marginTop: "5px",
              lineHeight: "1.6",
              wordBreak: "keep-all",
            }}
          >
            <b>{person.name}</b>
            <span style={{ color: "#888" }}>
              {" "}
              · {person.matchCount}/{totalCount}개 선택 일치
            </span>
          </p>
        ))
      )}
    </div>
  );
}

function SavedPlayerList({
  memberAnswers,
}: {
  memberAnswers: MemberAnswers;
}) {
  return (
    <div
      style={{
        marginTop: "28px",
        padding: "20px",
        borderRadius: "14px",
        background: "#fff",
        textAlign: "left",
        maxWidth: "420px",
        marginLeft: "auto",
        marginRight: "auto",
        lineHeight: "1.8",
      }}
    >
      <h3 style={{ textAlign: "center", marginBottom: "12px" }}>
        저장된 플레이어
      </h3>

      {Object.keys(memberAnswers).length === 0 ? (
        <p style={{ textAlign: "center", color: "#888" }}>
          아직 저장된 사람이 없습니다.
        </p>
      ) : (
        Object.keys(memberAnswers).map((name) => (
          <p key={name}>
            <b>{name}</b>
          </p>
        ))
      )}
    </div>
  );
}

/*
import { useState, useEffect } from "react";

type Question = {
  id: number;
  a: string;
  b: string;
};

type Result = {
  member: string;
};

type Answer = "a" | "b";

export default function BalanceGame() {
  const [questions, setQuestions] = useState<Question[]>([]);
  const [current, setCurrent] = useState(0);
  const [answers, setAnswers] = useState<Answer[]>([]);
  const [result, setResult] = useState<Result | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [step, setStep] = useState<"playing" | "result">("playing");

  // TODO: GET API 주소 넣어주세요
  useEffect(() => {
    fetch("여기에 GET API 주소")
      .then((res) => res.json())
      .then((data) => setQuestions(data));
  }, []);

  const handleSelect = async (choice: Answer) => {
    const newAnswers = [...answers, choice];
    setAnswers(newAnswers);

    if (current + 1 >= questions.length) {
      setLoading(true);
      // POST API 주소 넣어주세요
      const res = await fetch("여기에 POST API 주소", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ answers: newAnswers }),
      });
      const data: Result = await res.json();
      setResult(data);
      setStep("result");
      setLoading(false);
    } else {
      setCurrent((prev) => prev + 1);
    }
  };

  const handleReset = () => {
    setStep("playing");
    setCurrent(0);
    setAnswers([]);
    setResult(null);
    setError(null);
  };

  if (questions.length === 0) {
    return (
      <main className="content">
        <h2 className="section-title">밸런스 게임 🎮</h2>
        <p style={{ textAlign: "center", color: "#aaa", marginTop: "40px" }}>
          선택지를 준비 중이에요 🛠️
        </p>
      </main>
    );
  }

  const progress = Math.round((current / questions.length) * 100);

  return (
    <main className="content">
      <h2 className="section-title">밸런스 게임 🎮</h2>
      <p className="balance-subtitle">
        선택을 통해 가장 잘 맞는 팀원을 찾아보세요!
      </p>

      {step === "playing" && (
        <div className="balance-game">
          <div className="balance-progress-wrap">
            <span className="balance-progress-label">
              {current + 1} / {questions.length}
            </span>
            <div className="balance-progress-bar">
              <div
                className="balance-progress-fill"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>

          <div className="balance-cards">
            <button
              className="balance-card balance-card-a"
              onClick={() => handleSelect("a")}
            >
              <span className="balance-card-label">A</span>
              <span className="balance-card-text">{questions[current].a}</span>
            </button>

            <span className="balance-card-vs">VS</span>

            <button
              className="balance-card balance-card-b"
              onClick={() => handleSelect("b")}
            >
              <span className="balance-card-label">B</span>
              <span className="balance-card-text">{questions[current].b}</span>
            </button>
          </div>
        </div>
      )}

      {loading && (
        <p style={{ textAlign: "center", color: "#aaa", marginTop: "32px" }}>
          결과 불러오는 중...
        </p>
      )}

      {error && (
        <p style={{ textAlign: "center", color: "#e05", marginTop: "32px" }}>
          {error}
        </p>
      )}

      {step === "result" && result && (
        <div className="balance-result">
          <div className="balance-result-emoji">🎉</div>
          <p className="balance-result-label">당신과 가장 잘 맞는 팀원은</p>
          <p className="balance-result-name">{result.member}</p>
          <p className="balance-result-sub">입니다!</p>
          <button className="balance-retry-btn" onClick={handleReset}>
            다시 하기 🔄
          </button>
        </div>
      )}
    </main>
  );
}
 */