import React from 'react';
import { getSubjectsForClass } from '../data/constants';

const FlashcardsTab = ({
  currentUser, decks, cards, activeDeck, setActiveDeck,
  isReviewMode, setIsReviewMode, reviewCardsList, currentReviewIndex,
  showCardAnswer, setShowCardAnswer, showDeckModal, setShowDeckModal,
  newDeckTitle, setNewDeckTitle, newDeckDesc, setNewDeckDesc,
  showCardModal, setShowCardModal, newCardQ, setNewCardQ, newCardA, setNewCardA,
  handleCreateDeck, handleDeleteDeck, handleCreateCard, handleDeleteCard,
  startReviewSession, submitReviewScore,
}) => {
  return (
    <>
      {/* Deck List View */}
      {!activeDeck && (
        <div className="tab-panel">
          <div className="page-header">
            <div className="page-title">
              <h1>Flashcard Decks</h1>
              <p>{currentUser?.classLevel ? `Study tools for ${currentUser.classLevel}${currentUser.stream ? ' ' + currentUser.stream : ''}${currentUser.course ? ' — ' + currentUser.course : ''}` : 'Study using our advanced active recall spaced repetition trainer.'}</p>
            </div>
            <button className="btn btn-primary" onClick={() => setShowDeckModal(true)}>
              ➕ Create New Deck
            </button>
          </div>

          {decks.length === 0 ? (
            <div className="card" style={{ textAlign: 'center', padding: '40px' }}>
              <h3 style={{ marginBottom: '10px' }}>No decks available</h3>
              <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>Create your first flashcard deck to begin studying.</p>
              {currentUser?.classLevel && (() => {
                const subjects = getSubjectsForClass(currentUser.classLevel, currentUser.stream, currentUser.department);
                if (subjects.length === 0) return null;
                return (
                  <div style={{ marginBottom: '20px', textAlign: 'left' }}>
                    <p style={{ fontSize: '0.82rem', fontWeight: 600, color: 'var(--text-muted)', marginBottom: '10px', textTransform: 'uppercase', letterSpacing: '0.03em' }}>Suggested decks for {currentUser.classLevel}:</p>
                    <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                      {subjects.slice(0, 6).map(s => (
                        <span key={s} className="badge badge-purple" style={{ cursor: 'pointer' }} onClick={() => { setNewDeckTitle(s); setShowDeckModal(true); }}>{s}</span>
                      ))}
                    </div>
                  </div>
                );
              })()}
              <button className="btn btn-primary" onClick={() => setShowDeckModal(true)}>Add Deck</button>
            </div>
          ) : (
            <div className="grid-3">
              {decks.map(deck => {
                const deckCardsCount = cards.filter(c => c.deckId === deck.id).length;
                return (
                  <div key={deck.id} className="card deck-card card-hover" onClick={() => setActiveDeck(deck)}>
                    <div>
                      <h3 style={{ marginBottom: '8px' }}>{deck.title}</h3>
                      <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', display: '-webkit-box', WebkitLineClamp: 3, WebkitBoxOrient: 'vertical', overflow: 'hidden' }}>
                        {deck.description || 'No description provided.'}
                      </p>
                    </div>
                    <div className="deck-meta">
                      <span>🗂️ {deckCardsCount} flashcards</span>
                      <span style={{ color: 'var(--accent-primary)', fontWeight: 600 }}>Review Deck →</span>
                    </div>
                  </div>
                );
              })}
            </div>
          )}
        </div>
      )}

      {/* Deck Detail View */}
      {activeDeck && !isReviewMode && (
        <div className="tab-panel">
          <div className="page-header">
            <div className="page-title">
              <button onClick={() => setActiveDeck(null)} style={{ background: 'none', border: 'none', color: 'var(--accent-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.9rem', fontWeight: 600, marginBottom: '12px' }}>
                ← Back to Decks
              </button>
              <h1>{activeDeck.title}</h1>
              <p>{activeDeck.description}</p>
            </div>
            <div style={{ display: 'flex', gap: '12px' }}>
              <button className="btn btn-danger" onClick={() => handleDeleteDeck(activeDeck.id)}>
                Delete Deck
              </button>
              <button className="btn btn-secondary" onClick={() => setShowCardModal(true)}>
                ➕ Add Card
              </button>
              <button className="btn btn-primary" onClick={() => startReviewSession(activeDeck.id)}>
                ⚡ Smart Study Mode
              </button>
            </div>
          </div>

          <div className="card">
            <h3 style={{ marginBottom: '20px' }}>Cards List ({cards.filter(c => c.deckId === activeDeck.id).length})</h3>
            {cards.filter(c => c.deckId === activeDeck.id).length === 0 ? (
              <p style={{ color: 'var(--text-muted)', textAlign: 'center', padding: '30px' }}>No flashcards inside this deck. Click "Add Card" to create one.</p>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                {cards.filter(c => c.deckId === activeDeck.id).map(card => (
                  <div key={card.id} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', padding: '16px', background: 'var(--surface-card)', border: '1px solid var(--border-light)', borderRadius: '12px' }}>
                    <div style={{ flexGrow: 1, marginRight: '20px' }}>
                      <div style={{ display: 'flex', gap: '8px', marginBottom: '8px' }}>
                        <span className="badge badge-purple">Q</span>
                        <span style={{ fontWeight: 600 }}>{card.question}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '8px' }}>
                        <span className="badge badge-cyan">A</span>
                        <span style={{ color: 'var(--text-muted)' }}>{card.answer}</span>
                      </div>
                      <div style={{ display: 'flex', gap: '12px', marginTop: '12px', fontSize: '0.75rem', color: 'var(--text-dark)' }}>
                        <span>Interval: {card.interval} days</span>
                        <span>Repetitions: {card.repetitions}</span>
                        <span>Next Review: {new Date(card.nextReview).toLocaleDateString()}</span>
                      </div>
                    </div>
                    <button className="btn btn-danger" style={{ padding: '6px 12px', fontSize: '0.8rem' }} onClick={() => handleDeleteCard(card.id)}>
                      Delete
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}

      {/* Study Mode */}
      {isReviewMode && (
        <div className="study-area tab-panel">
          <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', alignItems: 'center', marginBottom: '16px' }}>
            <span style={{ fontWeight: 600 }}>Reviewing: {decks.find(d => d.id === activeDeck?.id)?.title}</span>
            <button className="btn btn-secondary" style={{ padding: '6px 12px', fontSize: '0.8rem' }} onClick={() => setIsReviewMode(false)}>Exit Study</button>
          </div>

          <div className="study-progress-bar">
            <div className="study-progress-fill" style={{ width: `${((currentReviewIndex + 1) / reviewCardsList.length) * 100}%` }}></div>
          </div>

          <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem', marginBottom: '12px' }}>Card {currentReviewIndex + 1} of {reviewCardsList.length}</p>

          <div className={`flashcard-wrapper ${showCardAnswer ? 'flipped' : ''}`} onClick={() => setShowCardAnswer(!showCardAnswer)}>
            <div className="flashcard-inner">
              <div className="flashcard-front">
                <span className="badge badge-purple" style={{ marginBottom: '20px' }}>Question</span>
                <div className="flashcard-content-text">
                  {reviewCardsList[currentReviewIndex]?.question}
                </div>
                <div className="card-hint">Click card to reveal answer</div>
              </div>
              <div className="flashcard-back">
                <span className="badge badge-cyan" style={{ marginBottom: '20px' }}>Answer</span>
                <div className="flashcard-content-text">
                  {reviewCardsList[currentReviewIndex]?.answer}
                </div>
                <div className="card-hint">Click card to view question</div>
              </div>
            </div>
          </div>

          {showCardAnswer && (
            <div className="review-actions">
              <p style={{ fontWeight: 600, fontSize: '0.9rem' }}>Rate your recall difficulty to schedule next review:</p>
              <div className="score-buttons">
                <button className="btn-score score-0" onClick={() => submitReviewScore(0)}>Forgot (0)</button>
                <button className="btn-score score-1" onClick={() => submitReviewScore(1)}>Hard (1)</button>
                <button className="btn-score score-2" onClick={() => submitReviewScore(2)}>Vague (2)</button>
                <button className="btn-score score-3" onClick={() => submitReviewScore(3)}>Good (3)</button>
                <button className="btn-score score-4" onClick={() => submitReviewScore(4)}>Easy (4)</button>
                <button className="btn-score score-5" onClick={() => submitReviewScore(5)}>Perfect (5)</button>
              </div>
              <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '10px', textAlign: 'center' }}>
                Keyboard: Space = flip · 1-6 = rate difficulty
              </p>
            </div>
          )}
        </div>
      )}

      {/* Deck Creation Modal */}
      {showDeckModal && (
        <div className="modal-overlay" onClick={() => setShowDeckModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>Create New Deck</h2>
            <div className="input-group">
              <label>Deck Title</label>
              <input className="input-field" value={newDeckTitle} onChange={e => setNewDeckTitle(e.target.value)} placeholder="e.g. JavaScript Closures" />
            </div>
            <div className="input-group">
              <label>Description (optional)</label>
              <input className="input-field" value={newDeckDesc} onChange={e => setNewDeckDesc(e.target.value)} placeholder="What's this deck about?" />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
              <button className="btn btn-secondary" onClick={() => setShowDeckModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={() => { handleCreateDeck(); setShowDeckModal(false); }}>Create Deck</button>
            </div>
          </div>
        </div>
      )}

      {/* Card Creation Modal */}
      {showCardModal && (
        <div className="modal-overlay" onClick={() => setShowCardModal(false)}>
          <div className="modal" onClick={e => e.stopPropagation()}>
            <h2>Add New Card</h2>
            <div className="input-group">
              <label>Question</label>
              <input className="input-field" value={newCardQ} onChange={e => setNewCardQ(e.target.value)} placeholder="Enter the question" />
            </div>
            <div className="input-group">
              <label>Answer</label>
              <input className="input-field" value={newCardA} onChange={e => setNewCardA(e.target.value)} placeholder="Enter the answer" />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '20px' }}>
              <button className="btn btn-secondary" onClick={() => setShowCardModal(false)}>Cancel</button>
              <button className="btn btn-primary" onClick={() => { handleCreateCard(); setShowCardModal(false); }}>Add Card</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default FlashcardsTab;
