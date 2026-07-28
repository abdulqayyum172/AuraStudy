import React, { useState } from 'react';

const MODE_LABELS = {
  focus: 'Focus',
  shortBreak: 'Short Break',
  longBreak: 'Long Break',
};

const MODE_GRADIENTS = {
  focus: ['#7c5cfc', '#a78bfa'],
  shortBreak: ['#38bdf8', '#22d3ee'],
  longBreak: ['#34d399', '#6ee7b7'],
};

const DEFAULT_DURATIONS = { focus: 25, shortBreak: 5, longBreak: 15 };

export default function PomodoroTab({
  currentUser,
  timerMode,
  timeLeft,
  timerActive,
  timerTotalDuration,
  pomoTaskLink,
  setPomoTaskLink,
  pomoSessionNotes,
  setPomoSessionNotes,
  tasks,
  changeTimerMode,
  toggleTimer,
  handleTimerComplete,
  resetTimer,
  formatTime,
  completedPomosToday,
  customDurations,
  setNewDuration,
}) {
  const [editingDuration, setEditingDuration] = useState(null);
  const [durationInput, setDurationInput] = useState('');

  const progress = timerTotalDuration > 0 ? timeLeft / timerTotalDuration : 1;
  const radius = 125;
  const circumference = 2 * Math.PI * radius;
  const offset = circumference * (1 - progress);
  const gradientColors = MODE_GRADIENTS[timerMode];
  const maxDots = 8;

  const todaySessions = completedPomosToday || 0;
  const todayMinutes = Math.round((completedPomosToday || 0) * (customDurations?.focus || 25));

  const handleDurationEdit = (mode) => {
    setEditingDuration(mode);
    setDurationInput(String(customDurations?.[mode] || DEFAULT_DURATIONS[mode]));
  };

  const handleDurationSave = () => {
    const val = parseInt(durationInput, 10);
    if (val >= 1 && val <= 120 && editingDuration) {
      setNewDuration(editingDuration, val);
    }
    setEditingDuration(null);
  };

  const handleDurationKeyDown = (e) => {
    if (e.key === 'Enter') handleDurationSave();
    if (e.key === 'Escape') setEditingDuration(null);
  };

  return (
    <div className="pomo-glass-container tab-panel">
      {/* Ambient glow orb */}
      <div className={`pomo-glow-orb ${timerActive ? 'is-active' : ''} pomo-glow-${timerMode}`} />

      {/* Header */}
      <div className="page-header" style={{ width: '100%', position: 'relative', zIndex: 1 }}>
        <div className="page-title">
          <h1>Focus Timer</h1>
          <p>{currentUser?.classLevel ? `${currentUser.classLevel} study session` : 'Deep focus sessions with smart break intervals.'}</p>
        </div>
      </div>

      {/* Mode Pills */}
      <div className="pomo-mode-pills" style={{ position: 'relative', zIndex: 1 }}>
        {Object.entries(MODE_LABELS).map(([mode, label]) => (
          <button
            key={mode}
            className={`pomo-mode-pill ${timerMode === mode ? 'active' : ''} pomo-pill-${mode}`}
            onClick={() => changeTimerMode(mode)}
          >
            <span className="pomo-pill-dot" />
            {label}
          </button>
        ))}
      </div>

      {/* Timer Ring */}
      <div className={`pomo-ring-wrapper ${timerActive ? 'is-running' : ''}`} style={{ position: 'relative', zIndex: 1 }}>
        <svg className="pomo-ring-svg" viewBox="0 0 300 300">
          <defs>
            <linearGradient id="pomoGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor={gradientColors[0]} />
              <stop offset="100%" stopColor={gradientColors[1]} />
            </linearGradient>
            <filter id="pomoGlow">
              <feGaussianBlur stdDeviation="3" result="blur" />
              <feMerge>
                <feMergeNode in="blur" />
                <feMergeNode in="SourceGraphic" />
              </feMerge>
            </filter>
          </defs>
          <circle className="pomo-ring-bg" cx="150" cy="150" r={radius} />
          <circle
            className="pomo-ring-fill"
            cx="150"
            cy="150"
            r={radius}
            strokeDasharray={circumference}
            strokeDashoffset={offset}
            filter={timerActive ? 'url(#pomoGlow)' : undefined}
          />
          {/* Tick marks */}
          {Array.from({ length: 60 }, (_, i) => {
            const angle = (i / 60) * 360 - 90;
            const rad = (angle * Math.PI) / 180;
            const isMajor = i % 5 === 0;
            const innerR = isMajor ? 112 : 116;
            const outerR = 120;
            return (
              <line
                key={i}
                x1={150 + innerR * Math.cos(rad)}
                y1={150 + innerR * Math.sin(rad)}
                x2={150 + outerR * Math.cos(rad)}
                y2={150 + outerR * Math.sin(rad)}
                stroke={isMajor ? 'var(--text-muted)' : 'var(--border-light)'}
                strokeWidth={isMajor ? 1.5 : 0.5}
                opacity={isMajor ? 0.4 : 0.3}
              />
            );
          })}
        </svg>

        <div className="pomo-time-display">
          <div className="pomo-time-text">{formatTime(timeLeft)}</div>
          <div className={`pomo-mode-label pomo-label-${timerMode}`}>
            {MODE_LABELS[timerMode]}
          </div>
          {/* Duration editor */}
          <div className="pomo-duration-editor">
            {editingDuration === timerMode ? (
              <div className="pomo-duration-input-wrap">
                <input
                  type="number"
                  min="1"
                  max="120"
                  className="pomo-duration-input"
                  value={durationInput}
                  onChange={(e) => setDurationInput(e.target.value)}
                  onBlur={handleDurationSave}
                  onKeyDown={handleDurationKeyDown}
                  autoFocus
                />
                <span className="pomo-duration-unit">min</span>
              </div>
            ) : (
              <button
                className="pomo-duration-btn"
                onClick={() => handleDurationEdit(timerMode)}
                title="Click to edit duration"
              >
                {customDurations?.[timerMode] || DEFAULT_DURATIONS[timerMode]} min ✎
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Session Dots */}
      <div className="pomo-session-dots" style={{ position: 'relative', zIndex: 1 }}>
        {Array.from({ length: maxDots }, (_, i) => (
          <div
            key={i}
            className={`pomo-session-dot ${i < todaySessions ? 'filled' : ''} pomo-dot-${timerMode}`}
          />
        ))}
        {todaySessions > 0 && (
          <span className="pomo-session-count">{todaySessions} today</span>
        )}
      </div>

      {/* Controls */}
      <div className="pomo-controls" style={{ position: 'relative', zIndex: 1 }}>
        <button className="pomo-ctrl-btn" onClick={resetTimer} title="Reset">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="1 4 1 10 7 10" /><path d="M3.51 15a9 9 0 1 0 2.13-9.36L1 10" />
          </svg>
        </button>
        <button className={`pomo-play-btn ${timerMode}`} onClick={toggleTimer}>
          {timerActive ? (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><rect x="6" y="4" width="4" height="16" rx="1" /><rect x="14" y="4" width="4" height="16" rx="1" /></svg>
          ) : (
            <svg width="24" height="24" viewBox="0 0 24 24" fill="currentColor"><polygon points="6,3 20,12 6,21" /></svg>
          )}
        </button>
        <button className="pomo-ctrl-btn" onClick={handleTimerComplete} title="Skip">
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <polygon points="5 4 15 12 5 20 5 4" /><line x1="19" y1="5" x2="19" y2="19" />
          </svg>
        </button>
      </div>

      {/* Today's Stats Bar */}
      <div className="pomo-stats-bar" style={{ position: 'relative', zIndex: 1 }}>
        <div className="pomo-stat">
          <span className="pomo-stat-icon">🍅</span>
          <span className="pomo-stat-value">{todaySessions}</span>
          <span className="pomo-stat-label">sessions</span>
        </div>
        <div className="pomo-stat-divider" />
        <div className="pomo-stat">
          <span className="pomo-stat-icon">⏱</span>
          <span className="pomo-stat-value">{todayMinutes}</span>
          <span className="pomo-stat-label">min focused</span>
        </div>
      </div>

      {/* Focus Logger */}
      {timerMode === 'focus' && (
        <div className="pomo-glass-card" style={{ position: 'relative', zIndex: 1 }}>
          <h3 className="pomo-card-title">Focus Logger</h3>
          <div className="input-group">
            <label htmlFor="pomoTask">Link to Active Task</label>
            <select
              id="pomoTask"
              className="input-field"
              value={pomoTaskLink}
              onChange={(e) => setPomoTaskLink(e.target.value)}
            >
              <option value="">No task linked</option>
              {tasks.filter(t => t.status !== 'completed').map(task => (
                <option key={task.id} value={task.id}>{task.title}</option>
              ))}
            </select>
          </div>
          <div className="input-group" style={{ marginBottom: 0 }}>
            <label htmlFor="pomoNotes">What are you concentrating on?</label>
            <input
              id="pomoNotes"
              type="text"
              placeholder="e.g. Reading about closures, CSS layout..."
              className="input-field"
              value={pomoSessionNotes}
              onChange={(e) => setPomoSessionNotes(e.target.value)}
            />
          </div>
        </div>
      )}
    </div>
  );
}
