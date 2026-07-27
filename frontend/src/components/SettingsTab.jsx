import React from 'react';

export default function SettingsTab({
  currentUser,
  settingsName,
  setSettingsName,
  settingsEmail,
  setSettingsEmail,
  settingsClassLevel,
  setSettingsClassLevel,
  settingsStream,
  setSettingsStream,
  settingsDepartment,
  setSettingsDepartment,
  settingsCourse,
  setSettingsCourse,
  settingsSaving,
  setSettingsSaving,
  theme,
  setTheme,
  handleLogout,
  addToast,
  CLASS_LEVEL_GROUPS,
  SSS_STREAMS,
  DEPARTMENTS_WITH_COURSES,
  getCoursesForDepartment,
  isHigherInstitutionLevel,
  isSSSLevel,
  isSimulatedAI,
}) {
  return (
    <div className="tab-panel">
      <div className="page-header">
        <div className="page-title">
          <h1>Settings</h1>
          <p>Customize your AuraStudy experience</p>
        </div>
      </div>

      <div style={{ maxWidth: '640px', display: 'flex', flexDirection: 'column', gap: '24px' }}>
        {/* Appearance */}
        <div className="card" style={{ padding: '22px' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '16px' }}>Appearance</h3>
          <div style={{ display: 'flex', gap: '12px' }}>
            <button
              className={`btn ${theme === 'light' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setTheme('light')}
              style={{ flex: 1, padding: '14px', flexDirection: 'column', gap: '6px' }}
            >
              <span style={{ fontSize: '1.4rem' }}>☀️</span>
              <span>Light</span>
            </button>
            <button
              className={`btn ${theme === 'dark' ? 'btn-primary' : 'btn-secondary'}`}
              onClick={() => setTheme('dark')}
              style={{ flex: 1, padding: '14px', flexDirection: 'column', gap: '6px' }}
            >
              <span style={{ fontSize: '1.4rem' }}>🌙</span>
              <span>Dark</span>
            </button>
          </div>
        </div>

        {/* Profile */}
        <div className="card" style={{ padding: '22px' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '16px' }}>Profile</h3>
          {currentUser ? (
            <div style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
              <div className="input-group">
                <label>Name</label>
                <input
                  className="input-field"
                  value={currentUser.displayName || currentUser.username || ''}
                  readOnly
                  style={{ opacity: 0.7 }}
                />
              </div>
              <div className="input-group">
                <label>Email</label>
                <input
                  className="input-field"
                  value={currentUser.email || ''}
                  readOnly
                  style={{ opacity: 0.7 }}
                />
              </div>
              <div className="input-group">
                <label>Class Level</label>
                <input
                  className="input-field"
                  value={currentUser.classLevel || 'Not set'}
                  readOnly
                  style={{ opacity: 0.7 }}
                />
              </div>
              {currentUser.stream && (
                <div className="input-group">
                  <label>Stream</label>
                  <input className="input-field" value={currentUser.stream} readOnly style={{ opacity: 0.7 }} />
                </div>
              )}
              {currentUser.course && (
                <div className="input-group">
                  <label>Course</label>
                  <input className="input-field" value={currentUser.course} readOnly style={{ opacity: 0.7 }} />
                </div>
              )}
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>
                Profile details are managed during signup. Contact support to make changes.
              </p>
            </div>
          ) : (
            <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Sign in to view your profile.</p>
          )}
        </div>

        {/* AI Configuration */}
        <div className="card" style={{ padding: '22px' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '16px' }}>AI Assistant</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px', background: 'var(--surface-ghost)', borderRadius: '8px', border: '1px solid var(--border-light)' }}>
              <div>
                <div style={{ fontWeight: 600, fontSize: '0.88rem' }}>AI Engine</div>
                <div style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
                  {isSimulatedAI ? 'Built-in Knowledge Engine' : 'Gemini 2.0 Flash'}
                </div>
              </div>
              <span className={`indicator-dot ${isSimulatedAI ? 'simulated' : ''}`} style={{ width: '10px', height: '10px' }}></span>
            </div>
            <div style={{ fontSize: '0.82rem', color: 'var(--text-muted)', lineHeight: 1.6 }}>
              {isSimulatedAI
                ? 'The AI is using the built-in knowledge engine. Responses are based on pre-loaded educational content for common topics.'
                : 'The AI is powered by Google Gemini 2.0 Flash, providing intelligent, personalized responses across all subjects.'}
            </div>
          </div>
        </div>

        {/* About */}
        <div className="card" style={{ padding: '22px' }}>
          <h3 style={{ fontSize: '1rem', marginBottom: '16px' }}>About AuraStudy</h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', fontSize: '0.85rem', color: 'var(--text-muted)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Version</span>
              <span style={{ color: 'var(--text-main)' }}>1.0.0</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>Platform</span>
              <span style={{ color: 'var(--text-main)' }}>Web Application</span>
            </div>
            <div style={{ display: 'flex', justifyContent: 'space-between' }}>
              <span>AI Model</span>
              <span style={{ color: 'var(--text-main)' }}>Gemini 2.0 Flash</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
