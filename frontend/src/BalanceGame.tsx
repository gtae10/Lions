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
      <p className="balance-subtitle">선택을 통해 가장 잘 맞는 팀원을 찾아보세요!</p>

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