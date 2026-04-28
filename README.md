# Lions 🦁

멋쟁이사자처럼 팀원 소개 및 밸런스 게임 웹 프로젝트입니다.

팀원들의 간단한 프로필을 확인하고, 밸런스 게임을 통해 서로의 취향과 성향을 비교할 수 있습니다.

<br>

## 프로젝트 소개

이 프로젝트는 팀원 소개 페이지와 밸런스 게임 기능을 포함한 웹 애플리케이션입니다.

주요 목적은 다음과 같습니다.

- 팀원 정보를 한눈에 확인
- 팀원 간 공통점과 차이점 비교
- 밸런스 게임을 통한 취향 분석
- 선택 결과를 기반으로 비슷한 팀원과 다른 팀원 구분

<br>

## 주요 기능

### 1. 팀원 소개

팀원 카드 형태로 각 팀원의 정보를 보여줍니다.

- 이름
- MBTI
- 한마디 소개
- 취미
- 사용 또는 학습 중인 언어
- GitHub 링크

카드를 클릭하면 모달 창을 통해 더 자세한 정보를 확인할 수 있습니다.

<br>

### 2. 공통점 및 차이점 비교

팀원들의 공통점과 차이점을 표 형태로 정리하여 보여줍니다.

예시 항목은 다음과 같습니다.

- MBTI
- 선호 언어
- 취미
- 공통 관심사

<br>

### 3. 밸런스 게임

A와 B 중 하나를 선택하는 방식의 간단한 밸런스 게임입니다.

예시 질문은 다음과 같습니다.

- 짜장면 vs 짬뽕
- C vs Python
- 부먹 vs 찍먹
- 아메리카노 vs 라떼
- 여름 vs 겨울

<br>

### 4. 답변 저장

팀원별 답변은 브라우저의 `localStorage`에 저장됩니다.

따라서 새로고침 후에도 기존 답변을 유지할 수 있으며, 여러 팀원이 순서대로 게임을 진행할 수 있습니다.

<br>

### 5. 유사도 분석

백엔드 API로 팀원별 답변 데이터를 전송하면, Django 서버에서 답변 일치 개수를 계산합니다.

분석 기준은 다음과 같습니다.

| 일치 개수 | 분류 |
|---|---|
| 5개 이상 | 비슷한 사람 |
| 4개 | 중간 |
| 3개 이하 | 다른 사람 |

<br>

## 기술 스택

### Frontend

- React
- TypeScript
- Vite
- CSS
- localStorage

### Backend

- Python
- Django
- Django REST 방식의 JSON 응답
- SQLite

<br>

## 프로젝트 구조

```bash
Lions/
├── backend/
│   ├── main/
│   │   ├── views.py
│   │   └── urls.py
│   ├── mysite/
│   │   └── urls.py
│   ├── manage.py
│   ├── db.sqlite3
│   └── requirements.txt
│
├── frontend/
│   ├── public/
│   ├── src/
│   │   ├── App.tsx
│   │   ├── App.css
│   │   ├── BalanceGame.tsx
│   │   ├── MemberCard.tsx
│   │   └── main.tsx
│   ├── package.json
│   └── vite.config.ts
│
└── README.md
```

<br>

## API 명세

### 질문 목록 조회

```http
GET /api/questions/
```

밸런스 게임 질문 목록을 반환합니다.

#### 응답 예시

```json
[
  {
    "id": 1,
    "a": "짜장면",
    "b": "짬뽕"
  },
  {
    "id": 2,
    "a": "C",
    "b": "Python"
  }
]
```

<br>

### 결과 분석

```http
POST /api/result/
```

팀원별 답변을 받아 서로의 답변 일치 개수를 계산합니다.

#### 요청 예시

```json
{
  "memberAnswers": {
    "박소호": ["a", "b", "a", "a", "b", "a", "b", "a", "a", "b"],
    "안수진": ["a", "b", "b", "a", "b", "b", "b", "a", "a", "a"]
  }
}
```

#### 응답 예시

```json
{
  "results": [
    {
      "member": "박소호",
      "similarPeople": [
        {
          "name": "안수진",
          "matchCount": 6
        }
      ],
      "differentPeople": [],
      "neutralPeople": []
    }
  ],
  "totalCount": 10
}
```

<br>

## 실행 방법

## 1. 프로젝트 클론

```bash
git clone https://github.com/gtae10/Lions.git
cd Lions
```

<br>

## 2. 백엔드 실행

```bash
cd backend
```

가상환경 생성 및 실행:

```bash
python -m venv venv
```

Windows 기준:

```bash
venv\Scripts\activate
```

Mac/Linux 기준:

```bash
source venv/bin/activate
```

패키지 설치:

```bash
pip install -r requirements.txt
```

서버 실행:

```bash
python manage.py runserver
```

백엔드 서버는 기본적으로 아래 주소에서 실행됩니다.

```bash
http://127.0.0.1:8000/
```

<br>

## 3. 프론트엔드 실행

새 터미널을 열고 프로젝트 루트에서 이동합니다.

```bash
cd frontend
```

패키지 설치:

```bash
npm install
```

개발 서버 실행:

```bash
npm run dev
```

프론트엔드 서버는 기본적으로 아래 주소에서 실행됩니다.

```bash
http://localhost:5173/
```

<br>

## 화면 구성

### 팀원 소개 화면

- 팀원 카드 표시
- 카드 클릭 시 상세 모달 표시
- 팀원별 MBTI, 취미, GitHub 정보 확인 가능

### 밸런스 게임 화면

- 플레이어 선택
- A/B 선택지 선택
- 진행도 표시
- 답변 저장
- 결과 분석

### 결과 화면

- 비슷한 팀원
- 다른 팀원
- 중간 성향의 팀원
- 답변 일치 개수

<br>

## 예외 처리

백엔드에서는 잘못된 요청을 방지하기 위해 다음과 같은 예외 처리를 수행합니다.

- GET이 아닌 방식으로 질문 API 요청 시 오류 반환
- POST가 아닌 방식으로 결과 API 요청 시 오류 반환
- JSON 형식이 잘못된 경우 오류 반환
- `memberAnswers`가 객체 형태가 아닌 경우 오류 반환
- 비교 대상이 2명 미만인 경우 오류 반환
- 답변 개수가 질문 개수와 일치하지 않는 경우 오류 반환

<br>

## 향후 개선 방향

- 사용자 로그인 기능 추가
- 답변 데이터를 DB에 저장
- 질문 추가 및 수정 기능 구현
- 결과를 퍼센트 또는 그래프로 시각화
- 배포 환경 구성
- 모바일 화면 최적화 강화

<br>

## 팀원

| 이름 | GitHub |
|---|---|
| 박소호 | [@thinghon](https://github.com/thinghon) |
| 안수진 | [@sznii161](https://github.com/sznii161) |
| 권태열 | [@gtae10](https://github.com/gtae10) |

<br>

## 프로젝트 목적

이 프로젝트는 단순한 팀원 소개 페이지에서 끝나는 것이 아니라, 밸런스 게임을 통해 팀원 간의 취향과 성향을 재미있게 비교할 수 있도록 만든 웹 프로젝트입니다.

React를 이용해 화면을 구성하고, Django API를 통해 질문 데이터와 결과 분석 기능을 처리하도록 구현했습니다.
