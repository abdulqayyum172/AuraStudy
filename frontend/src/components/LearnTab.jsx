import React from 'react';
import { LEARNING_CATEGORIES } from '../data/constants';

const LearnTab = ({ activeLearnCategory, setActiveLearnCategory, learnSearch, setLearnSearch, handleLearnTopicClick, getCategoryForLevel, currentUser, pomodoros, cards, notes, tasks }) => {
  return (
    <div className="tab-panel">
      <div className="page-header">
        <div className="page-title">
          <h1>{activeLearnCategory ? LEARNING_CATEGORIES.find(c => c.id === activeLearnCategory)?.title || 'Learn' : 'What do you want to learn?'}</h1>
          <p>{activeLearnCategory ? LEARNING_CATEGORIES.find(c => c.id === activeLearnCategory)?.subtitle || '' : 'Pick a category, choose a topic, and your AI tutor will teach it to you.'}</p>
        </div>
      </div>

      {!activeLearnCategory ? (
        <>
          {/* Quick Stats Row */}
          <div className="stats-grid" style={{ marginBottom: '32px' }}>
            <div className="card stat-card card-hover stagger-in" style={{ animationDelay: '0ms' }}>
              <div className="stat-icon" style={{ color: 'var(--accent-primary)' }}>⏱️</div>
              <div className="stat-info">
                <h3>{pomodoros.filter(p => p.type === 'focus').reduce((acc, curr) => acc + curr.duration, 0)}m</h3>
                <p>Focused Study</p>
              </div>
            </div>
            <div className="card stat-card card-hover stagger-in" style={{ animationDelay: '70ms' }}>
              <div className="stat-icon" style={{ color: 'var(--accent-secondary)' }}>🗂️</div>
              <div className="stat-info">
                <h3>{cards.length}</h3>
                <p>Flashcards Built</p>
              </div>
            </div>
            <div className="card stat-card card-hover stagger-in" style={{ animationDelay: '140ms' }}>
              <div className="stat-icon" style={{ color: 'var(--accent-primary)' }}>📝</div>
              <div className="stat-info">
                <h3>{notes.length}</h3>
                <p>Created Notes</p>
              </div>
            </div>
            <div className="card stat-card card-hover stagger-in" style={{ animationDelay: '210ms' }}>
              <div className="stat-icon" style={{ color: 'var(--accent-secondary)' }}>📅</div>
              <div className="stat-info">
                <h3>{tasks.filter(t => t.status === 'completed').length} / {tasks.length}</h3>
                <p>Tasks Finished</p>
              </div>
            </div>
          </div>

          {/* Search */}
          <div style={{ maxWidth: '500px', marginBottom: '28px' }}>
            <input
              className="input-field"
              placeholder="Search topics... e.g. 'JavaScript', 'photosynthesis', 'algebra'"
              value={learnSearch}
              onChange={(e) => setLearnSearch(e.target.value)}
              style={{ width: '100%' }}
            />
          </div>

          {/* Category Grid */}
          <div className="learn-categories">
            {(() => {
              const levelInfo = getCategoryForLevel(currentUser?.classLevel, currentUser?.stream);
              let cats = LEARNING_CATEGORIES.filter(cat => {
                if (!learnSearch.trim()) return true;
                const q = learnSearch.toLowerCase();
                return cat.title.toLowerCase().includes(q) || cat.topics.some(t => t.name.toLowerCase().includes(q) || t.desc.toLowerCase().includes(q));
              });
              // When user has a class level, only show relevant categories
              if (levelInfo.primary && !learnSearch.trim()) {
                cats = cats.filter(cat => levelInfo.related.includes(cat.id));
              }
              // Sort: primary first, then rest in order
              if (levelInfo.primary) {
                cats.sort((a, b) => {
                  const aPrimary = a.id === levelInfo.primary ? 0 : 1;
                  const bPrimary = b.id === levelInfo.primary ? 0 : 1;
                  return aPrimary - bPrimary;
                });
              }
              return cats.map((cat) => {
                const filteredTopics = learnSearch.trim()
                  ? cat.topics.filter(t => t.name.toLowerCase().includes(learnSearch.toLowerCase()) || t.desc.toLowerCase().includes(learnSearch.toLowerCase()))
                  : cat.topics;
                const isRecommended = levelInfo.primary === cat.id;
                return (
                  <button
                    key={cat.id}
                    className="learn-category-card"
                    style={{ '--cat-color': cat.color }}
                    onClick={() => setActiveLearnCategory(cat.id)}
                  >
                    <div className="learn-category-accent" style={{ background: cat.color }}></div>
                    <h3>{cat.title} {isRecommended && <span style={{ fontSize: '0.7rem', color: 'var(--success)', fontWeight: 600, marginLeft: '6px' }}>Your Level</span>}</h3>
                    <p className="learn-category-subtitle">{cat.subtitle}</p>
                    <span className="learn-topic-count">{learnSearch.trim() ? filteredTopics.length + ' matching' : cat.topics.length + ' topics'}</span>
                  </button>
                );
              });
            })()}
          </div>
        </>
      ) : (
        <>
          <button className="learn-back-btn" onClick={() => setActiveLearnCategory(null)}>
            ← All Categories
          </button>
          <div className="learn-topic-grid">
            {LEARNING_CATEGORIES.find(c => c.id === activeLearnCategory)?.topics.map((topic, i) => (
              <button
                key={topic.id}
                className="learn-topic-card stagger-in"
                style={{ animationDelay: `${i * 60}ms` }}
                onClick={() => handleLearnTopicClick(topic)}
              >
                <h3>{topic.name}</h3>
                <p>{topic.desc}</p>
                <span className="learn-topic-cta">Start Learning →</span>
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
};

export default LearnTab;
