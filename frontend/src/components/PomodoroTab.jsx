import React from 'react';

const PomodoroTab = ({
  currentUser, timerMode, timeLeft, timerActive, timerTotalDuration,
  pomoTaskLink, setPomoTaskLink, pomoSessionNotes, setPomoSessionNotes,
  tasks, changeTimerMode, toggleTimer, handleTimerComplete, resetTimer, formatTime,
}) => {
  return (
    <div className="pomodoro-container tab-panel">
      <div className="page-header" style={{ width: '100%' }}>
        <div className="page-title">
          <h1>Focus Pomodoro</h1>
          <p>{currentUser?.classLevel ? `${currentUser.classLevel} study timer` : 'Train your concentration. We log your statistics automatically.'}</p>
        </div>
      </div>

      <div className="timer-modes">
        <button className={`timer-mode-btn ${timerMode === 'focus' ? 'active' : ''}`} onClick={() => changeTimerMode('focus')}>Focus Session</button>
        <button className={`timer-mode-btn ${timerMode === 'shortBreak' ? 'active' : ''}`} onClick={() => changeTimerMode('shortBreak')}>Short Break</button>
        <button className={`timer-mode-btn ${timerMode === 'longBreak' ? 'active' : ''}`} onClick={() => changeTimerMode('longBreak')}>Long Break</button>
      </div>

      <div className={`timer-circle-container${timerActive ? ' is-running' : ''}`}>
        <svg className="timer-ring-svg">
          <defs>
            <linearGradient id="timerGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#8b5cf6" />
              <stop offset="100%" stopColor="#06b6d4" />
            </linearGradient>
          </defs>
          <circle className="timer-ring-bg" cx="140" cy="140" r="125" />
          <circle
            className="timer-ring-fill"
            cx="140"
            cy="140"
            r="125"
            strokeDasharray={`${2 * Math.PI * 125}`}
            strokeDashoffset={`${2 * Math.PI * 125 * (1 - timeLeft / timerTotalDuration)}`}
          />
        </svg>
        <div className="timer-display">
          <div className="timer-time">{formatTime(timeLeft)}</div>
          <div className="timer-label">{timerMode === 'focus' ? 'Focus time' : 'Break time'}</div>
        </div>
      </div>

      <div className="timer-controls">
        <button className="btn btn-secondary" onClick={resetTimer}>Reset</button>
        <button className="btn-play-pause" onClick={toggleTimer}>
          {timerActive ? '⏸' : '▶'}
        </button>
        <button className="btn btn-secondary" onClick={handleTimerComplete}>Skip</button>
      </div>

      {timerMode === 'focus' && (
        <div className="card" style={{ width: '100%', marginTop: '20px' }}>
          <h3 style={{ marginBottom: '16px' }}>Focus Logger</h3>
          <div className="input-group">
            <label htmlFor="pomoTask">Link to Active Task</label>
            <select id="pomoTask" className="input-field" value={pomoTaskLink} onChange={(e) => setPomoTaskLink(e.target.value)}>
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
              placeholder="e.g. Reading about closures, CSS layout styling..."
              className="input-field"
              value={pomoSessionNotes}
              onChange={(e) => setPomoSessionNotes(e.target.value)}
            />
          </div>
        </div>
      )}
    </div>
  );
};

export default PomodoroTab;
