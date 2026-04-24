import { useState } from "react";

const MBTI_LIST = [
  'INFP', 'INFJ', 'ISFP', 'ISFJ',
  'INTP', 'INTJ', 'ISTP', 'ISTJ',
  'ENFP', 'ENFJ', 'ENTP', 'ENTJ',
  'ESFP', 'ESFJ', 'ESTP', 'ESTJ',
];

type BalanceResult = {
  score: number;
  comment: string;
};

export default function BalanceGame() {
  const [mbtiA, setMbtiA] = useState<string>(MBTI_LIST[0]);
  const [mbtiB, setMbtiB] = useState<string>(MBTI_LIST[1]);
  const [result, setResult] = useState<BalanceResult | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleCheck = async () => {
    if (mbtiA === mbtiB) {
      setError('서로 다른 MBTI를 선택해주세요!');
      return;
    }
    setLoading(true);
    setError(null);
    setResult(null);
    try {
      const res = await fetch(
        `http://127.0.0.1:8000/api/mbti/?a=${mbtiA}&b=${mbtiB}`
      );
      if (!res.ok) throw new Error('API 오류: ' + res.status);
      const data: BalanceResult = await res.json();
      setResult(data);
    } catch (e) {
      setError('API 연결에 실패했어요. 백엔드가 실행 중인지 확인해주세요.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="content">
      <h2 className="section-title">MBTI 궁합 체크 🔮</h2>

      <div className="balance-form">
        <div className="balance-selects">
          <div className="balance-select-group">
            <label className="balance-label">첫 번째 MBTI</label>
            <select
              className="balance-select"
              value={mbtiA}
              onChange={(e) => setMbtiA(e.target.value)}
            >
              {MBTI_LIST.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>

          <span className="balance-vs">VS</span>

          <div className="balance-select-group">
            <label className="balance-label">두 번째 MBTI</label>
            <select
              className="balance-select"
              value={mbtiB}
              onChange={(e) => setMbtiB(e.target.value)}
            >
              {MBTI_LIST.map((m) => (
                <option key={m} value={m}>{m}</option>
              ))}
            </select>
          </div>
        </div>

        <button
          className="balance-btn"
          onClick={handleCheck}
          disabled={loading}
        >
          {loading ? '확인 중...' : '궁합 확인하기 ✨'}
        </button>
      </div>

      {error && <p className="balance-error">{error}</p>}

      {result && (
        <div className="balance-result">
          <div className="balance-score">
            <span className="balance-score-number">{result.score}</span>
            <span className="balance-score-label">점</span>
          </div>
          <p className="balance-comment">{result.comment}</p>
        </div>
      )}
    </main>
  );
}