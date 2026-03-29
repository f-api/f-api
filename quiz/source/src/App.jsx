import { useEffect, useState } from "react";
import quizSet from "./data/quiz-set.json";

const LETTERS = ["A", "B", "C", "D"];
const FALLBACK_TITLE = "퀴즈";

const quizzes = Array.isArray(quizSet.quizzes)
  ? quizSet.quizzes.filter(
      (quiz) =>
        typeof quiz?.title === "string" &&
        typeof quiz?.prompt === "string" &&
        Array.isArray(quiz?.options) &&
        quiz.options.length === 4 &&
        Number.isInteger(quiz?.answerIndex) &&
        quiz.answerIndex >= 0 &&
        quiz.answerIndex < 4 &&
        typeof quiz?.explanation === "string"
    )
  : [];

function App() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedIndex, setSelectedIndex] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [wrongAttempts, setWrongAttempts] = useState([]);

  const appTitle = quizSet.appTitle || FALLBACK_TITLE;
  const hasQuizzes = quizzes.length > 0;
  const currentQuiz = quizzes[currentIndex];
  const isLastQuestion = hasQuizzes ? currentIndex === quizzes.length - 1 : true;

  useEffect(() => {
    document.title = appTitle;
  }, [appTitle]);

  useEffect(() => {
    setSelectedIndex(null);
    setRevealed(false);
    setWrongAttempts([]);
  }, [currentIndex]);

  const handleOptionClick = (index) => {
    if (!currentQuiz || revealed) {
      return;
    }

    setSelectedIndex(index);

    if (index === currentQuiz.answerIndex) {
      setRevealed(true);
      return;
    }

    setWrongAttempts((prev) => (prev.includes(index) ? prev : [...prev, index]));
  };

  const handleNext = () => {
    if (!isLastQuestion) {
      setCurrentIndex((prev) => prev + 1);
    }
  };

  const handlePrevious = () => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
    }
  };

  const handleRestart = () => {
    setCurrentIndex(0);
  };

  return (
    <main className="page-shell">
      <section className="quiz-panel">
        {hasQuizzes ? (
          <>
            <div className="panel-status">
              <div
                className="progress-shell"
                aria-label={`진행 ${currentIndex + 1} / ${quizzes.length}`}
              >
                <div className="progress-track" aria-hidden="true">
                  <div
                    className="progress-bar"
                    style={{
                      width: `${((currentIndex + (revealed ? 1 : 0)) / quizzes.length) * 100}%`
                    }}
                  />
                </div>
                <strong className="panel-count">
                  {currentIndex + 1} / {quizzes.length}
                </strong>
              </div>
            </div>

            <div className="question-header">
              <h2>{currentQuiz.title}</h2>
            </div>

            <div className="option-grid">
              {currentQuiz.options.map((option, index) => {
                const isCorrect = index === currentQuiz.answerIndex;
                const isWrong = wrongAttempts.includes(index);
                const isActive = index === selectedIndex;

                let className = "option-button";

                if (revealed && isCorrect) {
                  className += " option-button-correct";
                } else if (isWrong) {
                  className += " option-button-wrong";
                } else if (isActive) {
                  className += " option-button-active";
                }

                return (
                  <button
                    key={`${currentQuiz.id}-${option}`}
                    type="button"
                    className={className}
                    onClick={() => handleOptionClick(index)}
                    aria-pressed={isActive}
                  >
                    <span className="option-letter">{LETTERS[index]}</span>
                    <span className="option-text">{option}</span>
                  </button>
                );
              })}
            </div>

            <div className="response-row">
              {revealed ? (
                <p className="response-message response-message-correct">
                  정답입니다.
                </p>
              ) : selectedIndex !== null ? (
                <p className="response-message response-message-wrong">
                  오답입니다. 다시 선택하세요.
                </p>
              ) : null}
            </div>

            {revealed ? (
              <section className="explanation-block" aria-live="polite">
                <div className="explanation-heading">
                  <span>해설</span>
                  <strong>{LETTERS[currentQuiz.answerIndex]}</strong>
                </div>
                <p>{currentQuiz.explanation}</p>
              </section>
            ) : null}
          </>
        ) : (
          <div className="empty-state">
            <p className="question-prompt">표시할 문항이 없습니다.</p>
          </div>
        )}

        <footer className="footer-row">
          <button
            type="button"
            className="ghost-button"
            onClick={handlePrevious}
            disabled={!hasQuizzes || currentIndex === 0}
          >
            이전
          </button>

          <button
            type="button"
            className="ghost-button"
            onClick={handleRestart}
            disabled={!hasQuizzes || currentIndex === 0}
          >
            처음
          </button>

          <button
            type="button"
            className="primary-button"
            onClick={handleNext}
            disabled={!hasQuizzes || !revealed || isLastQuestion}
          >
            다음
          </button>
        </footer>
      </section>
    </main>
  );
}

export default App;
