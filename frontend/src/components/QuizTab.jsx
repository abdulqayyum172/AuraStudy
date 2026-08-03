import { getSubjectsForClass } from '../data/constants';
import { QuizIcon } from '../data/icons.jsx';

export default function QuizTab({
  currentUser,
  quizInput,
  setQuizInput,
  quizCount,
  setQuizCount,
  quizDifficulty,
  setQuizDifficulty,
  quizMode,
  setQuizMode,
  quizQuestions,
  quizAnswers,
  quizSubmitted,
  quizLoading,
  quizScore,
  quizTimeLeft,
  quizTimerActive,
  quizCurrentQuestionIndex,
  setQuizCurrentQuestionIndex,
  quizBookmarked,
  quizReviewFilter,
  setQuizReviewFilter,
  quizHistory,
  quizStats,
  selectedHistoryRecord,
  setSelectedHistoryRecord,
  handleGenerateQuiz,
  handleQuizAnswer,
  handleToggleBookmark,
  handleSubmitQuiz,
  handleConvertWrongAnswersToFlashcards,
  handleRetakeQuiz,
  handleResetQuiz,
}) {
  return (
    <div className="tab-panel">
      <div className="page-header">
        <div className="page-title">
          <h1>AI Quiz Generator</h1>
          <p>Generate topic quizzes, test your recall, or review past performance.</p>
        </div>
        {quizQuestions.length > 0 && (
          <button className="btn btn-secondary" onClick={handleResetQuiz}>
            ✨ New Quiz
          </button>
        )}
      </div>

      {!quizQuestions.length ? (
        <div className="quiz-setup">
          <div className="card" style={{ padding: '28px', maxWidth: '750px', width: '100%' }}>
            {currentUser?.classLevel && (
              <div style={{ marginBottom: '16px', padding: '10px 14px', background: 'var(--accent-primary-light)', border: '1px solid var(--border-glow)', borderRadius: '8px', fontSize: '0.85rem', color: 'var(--text-main)', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <span>🎓</span>
                <span>Quiz tailored for: <strong style={{ color: 'var(--accent-primary)' }}>{currentUser.classLevel}{currentUser.stream ? ` (${currentUser.stream})` : ''}{currentUser.course ? ` — ${currentUser.course}` : ''}</strong></span>
              </div>
            )}

            {/* Mode Selection */}
            <div style={{ marginBottom: '20px' }}>
              <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.88rem' }}>
                Select Quiz Mode:
              </label>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px' }}>
                <button
                  type="button"
                  className={`quiz-mode-card ${quizMode === 'timed' ? 'active' : ''}`}
                  onClick={() => setQuizMode('timed')}
                  style={{
                    padding: '14px', borderRadius: '10px', border: quizMode === 'timed' ? '2px solid var(--accent-primary)' : '1px solid var(--border-light)',
                    background: quizMode === 'timed' ? 'var(--accent-primary-medium)' : 'var(--surface-card)',
                    color: 'var(--text-main)', cursor: 'pointer', textAlign: 'left'
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: '0.92rem', marginBottom: '4px' }}>⏱️ Timed Exam Mode</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Countdown timer with overall score submission.</div>
                </button>
                <button
                  type="button"
                  className={`quiz-mode-card ${quizMode === 'practice' ? 'active' : ''}`}
                  onClick={() => setQuizMode('practice')}
                  style={{
                    padding: '14px', borderRadius: '10px', border: quizMode === 'practice' ? '2px solid var(--accent-secondary)' : '1px solid var(--border-light)',
                    background: quizMode === 'practice' ? 'var(--info-bg)' : 'var(--surface-card)',
                    color: 'var(--text-main)', cursor: 'pointer', textAlign: 'left'
                  }}
                >
                  <div style={{ fontWeight: 700, fontSize: '0.92rem', marginBottom: '4px' }}>🎯 Practice Mode</div>
                  <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>Self-paced learning with instant answer explanations.</div>
                </button>
              </div>
            </div>

            {/* Subject quick picks */}
            {currentUser?.classLevel && (() => {
              const subjects = getSubjectsForClass(currentUser.classLevel, currentUser.stream, currentUser.department);
              if (!subjects.length) return null;
              return (
                <div style={{ marginBottom: '18px' }}>
                  <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.85rem' }}>
                    Quick pick a subject:
                  </label>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {subjects.slice(0, 10).map(s => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setQuizInput(s)}
                        style={{
                          padding: '6px 14px', borderRadius: '18px', border: '1px solid var(--border-light)',
                          background: quizInput === s ? 'var(--accent-primary)' : 'var(--surface-subtle)',
                          color: quizInput === s ? '#fff' : 'var(--text-main)',
                          cursor: 'pointer', fontSize: '0.8rem', fontWeight: 500, transition: 'all 0.15s'
                        }}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              );
            })()}

            <label style={{ display: 'block', marginBottom: '8px', fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.88rem' }}>
              Or enter notes / study topic:
            </label>
            <textarea
              className="input-field"
              rows={4}
              placeholder="Paste your notes here, or type a topic like 'Photosynthesis light reactions', 'JavaScript closures', 'Quadratic formula', 'Newton laws'..."
              value={quizInput}
              onChange={(e) => setQuizInput(e.target.value)}
              style={{ width: '100%', resize: 'vertical', marginBottom: '18px', fontFamily: 'inherit' }}
            />

            {/* Difficulty & Count row */}
            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '16px', marginBottom: '22px' }}>
              <div>
                <label style={{ display: 'block', fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.85rem', marginBottom: '6px' }}>
                  Difficulty:
                </label>
                <div className="quiz-count-options">
                  {['Easy', 'Medium', 'Hard'].map(d => (
                    <button
                      key={d}
                      className={`quiz-count-btn ${quizDifficulty === d ? 'active' : ''}`}
                      onClick={() => setQuizDifficulty(d)}
                      type="button"
                    >
                      {d}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label style={{ display: 'block', fontWeight: 600, color: 'var(--text-primary)', fontSize: '0.85rem', marginBottom: '6px' }}>
                  Questions:
                </label>
                <div className="quiz-count-options">
                  {[3, 5, 10, 15, 20].map(n => (
                    <button
                      key={n}
                      className={`quiz-count-btn ${quizCount === n ? 'active' : ''}`}
                      onClick={() => setQuizCount(n)}
                      type="button"
                    >
                      {n}
                    </button>
                  ))}
                </div>
              </div>
            </div>

            <button
              className="btn btn-primary"
              onClick={handleGenerateQuiz}
              disabled={quizLoading || !quizInput.trim()}
              style={{ width: '100%', padding: '12px', fontSize: '1rem', fontWeight: 700 }}
            >
              {quizLoading ? (
                <><span className="btn-spinner"></span> Generating {quizCount} Questions...</>
              ) : (
                <><QuizIcon /> Generate Quiz ({quizCount} Questions)</>
              )}
            </button>
          </div>

          {/* Quiz History Dashboard */}
          {quizHistory.length > 0 && (
            <div className="card" style={{ padding: '24px', maxWidth: '750px', width: '100%', marginTop: '20px' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                <h3 style={{ fontSize: '1.05rem', fontWeight: 700, color: 'var(--text-main)', margin: 0 }}>📜 Performance History</h3>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Last {quizHistory.length} Quizzes</span>
              </div>

              {quizStats && quizStats.total > 0 && (
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '12px', marginBottom: '16px' }}>
                  <div style={{ padding: '12px', background: 'var(--surface-card)', borderRadius: '8px', border: '1px solid var(--border-light)', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Quizzes Taken</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--text-main)' }}>{quizStats.total}</div>
                  </div>
                  <div style={{ padding: '12px', background: 'var(--surface-card)', borderRadius: '8px', border: '1px solid var(--border-light)', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Average Score</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: quizStats.avgScore >= 70 ? 'var(--success)' : quizStats.avgScore >= 50 ? '#f59e0b' : 'var(--danger)' }}>
                      {quizStats.avgScore}%
                    </div>
                  </div>
                  <div style={{ padding: '12px', background: 'var(--surface-card)', borderRadius: '8px', border: '1px solid var(--border-light)', textAlign: 'center' }}>
                    <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>Highest Score</div>
                    <div style={{ fontSize: '1.25rem', fontWeight: 800, color: 'var(--accent-primary)' }}>
                      {Math.max(...quizHistory.map(h => h.percentage || 0), 0)}%
                    </div>
                  </div>
                </div>
              )}

              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '240px', overflowY: 'auto' }}>
                {quizHistory.map((record, i) => (
                  <div key={record.id || i} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', padding: '10px 14px', background: 'var(--surface-card)', borderRadius: '8px', border: '1px solid var(--border-light)', fontSize: '0.85rem' }}>
                    <div style={{ flex: 1, minWidth: 0, paddingRight: '12px' }}>
                      <div style={{ fontWeight: 600, color: 'var(--text-main)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{record.topic || 'General Quiz'}</div>
                      <div style={{ color: 'var(--text-muted)', fontSize: '0.75rem', marginTop: '2px' }}>
                        {record.difficulty} · {record.score}/{record.total} correct · {new Date(record.completedAt).toLocaleDateString()}
                      </div>
                    </div>
                    <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
                      <span style={{
                        padding: '3px 10px', borderRadius: '12px', fontWeight: 700, fontSize: '0.78rem',
                        background: record.percentage >= 70 ? 'rgba(52,211,153,0.12)' : record.percentage >= 50 ? 'rgba(245,158,11,0.12)' : 'rgba(248,113,113,0.12)',
                        color: record.percentage >= 70 ? 'var(--success)' : record.percentage >= 50 ? '#f59e0b' : 'var(--danger)'
                      }}>
                        {record.percentage}%
                      </span>
                      <button
                        type="button"
                        className="btn btn-secondary"
                        style={{ padding: '4px 10px', fontSize: '0.75rem' }}
                        onClick={() => setSelectedHistoryRecord(record)}
                      >
                        Review
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      ) : (
        <div className="quiz-active" style={{ maxWidth: '750px', margin: '0 auto' }}>
          {!quizSubmitted ? (
            <>
              {/* Top Progress & Navigation Controls */}
              <div className="quiz-progress" style={{ marginBottom: '20px' }}>
                <div className="quiz-progress-top" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                  <span style={{ fontWeight: 600, color: 'var(--text-main)' }}>
                    Question {quizCurrentQuestionIndex + 1} of {quizQuestions.length} ({Object.keys(quizAnswers).length} answered)
                  </span>
                  {quizMode === 'timed' && quizTimerActive && (
                    <span className={`quiz-timer ${quizTimeLeft < 30 ? 'quiz-timer-warning' : ''}`} style={{ fontSize: '0.95rem', fontWeight: 700 }}>
                      ⏱ {Math.floor(quizTimeLeft / 60)}:{String(quizTimeLeft % 60).padStart(2, '0')}
                    </span>
                  )}
                  {quizMode === 'practice' && (
                    <span className="badge badge-purple" style={{ fontSize: '0.75rem' }}>🎯 Self-Paced Practice</span>
                  )}
                </div>
                <div className="quiz-progress-bar" style={{ height: '6px', borderRadius: '3px' }}>
                  <div className="quiz-progress-fill" style={{ width: `${((quizCurrentQuestionIndex + 1) / quizQuestions.length) * 100}%` }}></div>
                </div>

                {/* Question Navigation Numbers Bar */}
                <div style={{ display: 'flex', gap: '6px', marginTop: '12px', flexWrap: 'wrap' }}>
                  {quizQuestions.map((_, idx) => {
                    const isCurrent = idx === quizCurrentQuestionIndex;
                    const isAnswered = quizAnswers[idx] !== undefined;
                    const isBookmarked = quizBookmarked[idx];
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setQuizCurrentQuestionIndex(idx)}
                        style={{
                          width: '32px', height: '32px', borderRadius: '6px', border: isCurrent ? '2px solid var(--accent-primary)' : '1px solid var(--border-light)',
                          background: isCurrent ? 'var(--accent-primary)' : isAnswered ? 'var(--accent-primary-medium)' : 'var(--surface-subtle)',
                          color: isCurrent ? '#fff' : isAnswered ? 'var(--accent-primary)' : 'var(--text-muted)',
                          fontWeight: 700, fontSize: '0.8rem', cursor: 'pointer', position: 'relative'
                        }}
                      >
                        {idx + 1}
                        {isBookmarked && <span style={{ position: 'absolute', top: -3, right: -2, fontSize: '0.65rem' }}>⭐</span>}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Single Focused Question Card */}
              {(() => {
                const q = quizQuestions[quizCurrentQuestionIndex];
                if (!q) return null;
                const qIdx = quizCurrentQuestionIndex;
                const isBookmarked = quizBookmarked[qIdx];
                const selectedOpt = quizAnswers[qIdx];

                return (
                  <div className="card quiz-question-card" style={{ padding: '24px', marginBottom: '20px' }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '14px' }}>
                      <span className="quiz-question-number" style={{ fontSize: '0.8rem' }}>Question {qIdx + 1} of {quizQuestions.length}</span>
                      <button
                        type="button"
                        onClick={() => handleToggleBookmark(qIdx)}
                        style={{ background: 'none', border: 'none', color: isBookmarked ? '#f59e0b' : 'var(--text-muted)', cursor: 'pointer', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '4px' }}
                      >
                        {isBookmarked ? '⭐ Bookmarked' : '☆ Bookmark'}
                      </button>
                    </div>

                    <h3 className="quiz-question-text" style={{ fontSize: '1.05rem', lineHeight: 1.5, marginBottom: '18px' }}>{q.question}</h3>

                    <div className="quiz-options" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                      {['A', 'B', 'C', 'D'].map(opt => (
                        <button
                          key={opt}
                          className={`quiz-option ${selectedOpt === opt ? 'selected' : ''}`}
                          onClick={() => handleQuizAnswer(qIdx, opt)}
                          style={{ padding: '12px 16px', fontSize: '0.9rem' }}
                        >
                          <span className="quiz-option-letter">{opt}</span>
                          <span>{q.options[opt]}</span>
                        </button>
                      ))}
                    </div>

                    {/* Instant Explanation in Practice Mode */}
                    {quizMode === 'practice' && selectedOpt && q.explanation && (
                      <div className="quiz-explanation" style={{ marginTop: '16px' }}>
                        <strong>{selectedOpt === q.correct ? '✓ Correct!' : `✗ Incorrect (Correct answer: ${q.correct})`}</strong>
                        <p style={{ marginTop: '4px', margin: 0 }}>{q.explanation}</p>
                      </div>
                    )}
                  </div>
                );
              })()}

              {/* Navigation Actions */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', gap: '12px' }}>
                <button
                  className="btn btn-secondary"
                  disabled={quizCurrentQuestionIndex === 0}
                  onClick={() => setQuizCurrentQuestionIndex(prev => Math.max(0, prev - 1))}
                >
                  ← Previous
                </button>

                {quizCurrentQuestionIndex < quizQuestions.length - 1 ? (
                  <button
                    className="btn btn-primary"
                    onClick={() => setQuizCurrentQuestionIndex(prev => Math.min(quizQuestions.length - 1, prev + 1))}
                  >
                    Next Question →
                  </button>
                ) : (
                  <button
                    className="btn btn-primary"
                    onClick={() => handleSubmitQuiz(false)}
                    disabled={Object.keys(quizAnswers).length === 0}
                    style={{ background: 'var(--success)' }}
                  >
                    Submit Quiz ({Object.keys(quizAnswers).length}/{quizQuestions.length})
                  </button>
                )}
              </div>
            </>
          ) : (
            /* ==================== QUIZ RESULTS & REVIEW ==================== */
            <div className="quiz-results">
              <div className="card quiz-score-card" style={{ padding: '32px 20px' }}>
                <div className="quiz-score-circle">
                  <span className="quiz-score-number">{quizScore}</span>
                  <span className="quiz-score-divider">/</span>
                  <span className="quiz-score-total">{quizQuestions.length}</span>
                </div>
                <h2 style={{ fontSize: '1.4rem', marginTop: '8px' }}>Quiz Complete!</h2>
                <p className="quiz-score-percent" style={{ fontSize: '1.25rem', fontWeight: 800 }}>
                  {Math.round((quizScore / quizQuestions.length) * 100)}% Correct
                </p>
                <p className="quiz-score-msg" style={{ marginTop: '6px' }}>
                  {quizScore === quizQuestions.length ? '🎉 Outstanding perfection! You have thoroughly mastered this topic!' :
                   quizScore >= quizQuestions.length * 0.7 ? '👏 Great performance! You have a solid grasp of key concepts.' :
                   '📚 Keep studying! Review the detailed explanations below to build your recall.'}
                </p>

                {/* Action Bar */}
                <div style={{ display: 'flex', gap: '10px', justifyContent: 'center', marginTop: '20px', flexWrap: 'wrap' }}>
                  {quizQuestions.some((q, idx) => quizAnswers[idx] !== q.correct) && (
                    <button className="btn btn-primary" style={{ fontSize: '0.85rem', padding: '8px 14px' }} onClick={handleConvertWrongAnswersToFlashcards}>
                      🗂️ Save Incorrect to Flashcards
                    </button>
                  )}
                  <button className="btn btn-secondary" style={{ fontSize: '0.85rem', padding: '8px 14px' }} onClick={handleRetakeQuiz}>
                    🔄 Retake Quiz
                  </button>
                  <button className="btn btn-secondary" style={{ fontSize: '0.85rem', padding: '8px 14px' }} onClick={handleResetQuiz}>
                    ✨ New Quiz
                  </button>
                </div>
              </div>

              {/* Filter Tabs for Review */}
              <div style={{ display: 'flex', gap: '8px', marginBottom: '12px' }}>
                <button
                  className={`quiz-count-btn ${quizReviewFilter === 'all' ? 'active' : ''}`}
                  onClick={() => setQuizReviewFilter('all')}
                >
                  All ({quizQuestions.length})
                </button>
                <button
                  className={`quiz-count-btn ${quizReviewFilter === 'incorrect' ? 'active' : ''}`}
                  onClick={() => setQuizReviewFilter('incorrect')}
                >
                  Incorrect Only ({quizQuestions.filter((q, i) => quizAnswers[i] !== q.correct).length})
                </button>
                {Object.keys(quizBookmarked).some(k => quizBookmarked[k]) && (
                  <button
                    className={`quiz-count-btn ${quizReviewFilter === 'bookmarked' ? 'active' : ''}`}
                    onClick={() => setQuizReviewFilter('bookmarked')}
                  >
                    Bookmarked ⭐ ({Object.keys(quizBookmarked).filter(k => quizBookmarked[k]).length})
                  </button>
                )}
              </div>

              {/* Detailed Review Cards */}
              {quizQuestions.map((q, qIdx) => {
                const isCorrect = quizAnswers[qIdx] === q.correct;
                const isBookmarked = quizBookmarked[qIdx];

                if (quizReviewFilter === 'incorrect' && isCorrect) return null;
                if (quizReviewFilter === 'bookmarked' && !isBookmarked) return null;

                return (
                  <div key={qIdx} className={`card quiz-review-card ${isCorrect ? 'correct' : 'incorrect'}`} style={{ padding: '20px' }}>
                    <div className="quiz-review-header">
                      <span className={`quiz-review-badge ${isCorrect ? 'correct' : 'incorrect'}`}>
                        {isCorrect ? '✓ Correct' : '✗ Incorrect'}
                      </span>
                      <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                        {isBookmarked && <span style={{ fontSize: '0.8rem' }}>⭐ Bookmarked</span>}
                        <span className="quiz-review-qnum">Question {qIdx + 1}</span>
                      </div>
                    </div>

                    <p className="quiz-question-text" style={{ fontSize: '1rem', marginTop: '6px' }}>{q.question}</p>

                    <div className="quiz-options review" style={{ marginTop: '12px' }}>
                      {['A', 'B', 'C', 'D'].map(opt => {
                        const isAnswer = opt === q.correct;
                        const wasSelected = quizAnswers[qIdx] === opt;
                        return (
                          <div
                            key={opt}
                            className={`quiz-option review ${isAnswer ? 'correct-answer' : ''} ${wasSelected && !isAnswer ? 'wrong-answer' : ''}`}
                          >
                            <span className="quiz-option-letter">{opt}</span>
                            <span>{q.options[opt]}</span>
                            {isAnswer && <span className="quiz-option-check">✓</span>}
                            {wasSelected && !isAnswer && <span className="quiz-option-x">✗</span>}
                          </div>
                        );
                      })}
                    </div>

                    {q.explanation && (
                      <div className="quiz-explanation" style={{ marginTop: '14px' }}>
                        <strong>Explanation:</strong> {q.explanation}
                      </div>
                    )}
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}
    </div>
  );
}
