# Spring Quiz

스프링 프레임워크 개념 학습용 싱글페이지 퀴즈 앱.

## 기술 스택

- **React 19** + **Vite 7** (ESM, JSX)
- **react-markdown** + **remark-gfm** + **rehype-highlight** — 마크다운 렌더링 및 코드 하이라이팅
- **highlight.js** (darcula 테마) — 코드 블록 구문 강조
- 별도 라우터/상태관리 라이브러리 없음 (useState로 관리)

## 프로젝트 구조

```
src/
├── main.jsx              # 엔트리포인트 (ReactDOM.createRoot)
├── App.jsx               # 전체 앱 컴포넌트 (퀴즈 모드 + 정답 모드)
├── styles.css            # 전역 스타일 (CSS 변수 기반)
└── data/
    └── quiz-set.json     # 퀴즈 데이터 (30문항)

scripts/
└── inline-dist.mjs       # 빌드 후처리: CSS/JS를 HTML에 인라인화

index.html                # HTML 템플릿 (lang="ko")
vite.config.js            # Vite 설정 (단일 번들 출력)
```

## 명령어

```bash
npm run dev      # 개발 서버 (HMR)
npm run build    # 프로덕션 빌드 → dist/index.html (단일 파일)
npm run preview  # 빌드 결과 미리보기
```

## 빌드 특이사항

`npm run build` = `vite build` + `node scripts/inline-dist.mjs`

빌드 결과물은 **단일 `dist/index.html` 파일**로 출력됨. `inline-dist.mjs`가 CSS와 JS를 HTML에 인라인하고 `assets/` 디렉토리를 삭제함. 별도 정적 파일 없이 HTML 하나로 배포 가능.

Vite 설정에서 `cssCodeSplit: false`, `inlineDynamicImports: true`, `modulePreload: false`로 단일 번들 보장.

## 퀴즈 데이터 형식 (`quiz-set.json`)

```json
{
  "appTitle": "스프링 개념 퀴즈",
  "quizzes": [
    {
      "id": "unique-id",
      "title": "문제 텍스트 (마크다운 지원)",
      "options": ["선택지A", "선택지B", "선택지C", "선택지D"],
      "answerIndex": 0,
      "explanation": "해설 텍스트 (마크다운/코드블록 지원)"
    }
  ]
}
```

- 선택지는 반드시 4개 (`options.length === 4`)
- `answerIndex`는 0~3 정수
- `title`, `options`, `explanation` 모두 마크다운 문법 사용 가능 (코드 블록 포함)
- 현재 30문항: 중하(1~10), 중상(11~20), 상(21~30)
- 정답 분포: A=8, B=8, C=7, D=7

## 앱 모드

### 퀴즈 모드 (기본)

일반 접속 시 한 문제씩 풀기. 오답 시 재시도 가능, 정답 시 해설 표시 후 다음 문제로 이동.

### 정답 모드

`?answers=1` 또는 `?showAnswers=true` 쿼리 파라미터로 접속 시 모든 문제의 정답과 해설을 한 번에 표시.

## CSS 컨벤션

- **CSS 변수** 기반 테마 (`--surface`, `--text`, `--muted`, `--accent`, `--correct`, `--wrong`, `--border`)
- 플랫 디자인: 그라데이션/글로우 없음, 좌측 보더로 상태 표현
- 옵션 상태 클래스: `.option-button-active` (선택), `.option-button-correct` (정답), `.option-button-wrong` (오답)
- `.option-static` — 정답 모드에서 클릭 불가능한 옵션에 사용
- `.markdown-content` — 마크다운 렌더링 컨테이너
- 반응형: 640px 단일 브레이크포인트

## 주의사항

- 퀴즈/정답 모드의 디자인은 CSS 클래스를 공유하도록 일원화되어 있음. 새 스타일 추가 시 양쪽 모드에서 확인 필요.
- `quiz-set.json` 수정 시 한글 인코딩(UTF-8) 주의. bash heredoc(`<< 'EOF'`)으로 작성 권장.
- 빌드 결과가 단일 HTML이므로, 외부 에셋(이미지 등) 추가 시 인라인 또는 data URI 사용.
