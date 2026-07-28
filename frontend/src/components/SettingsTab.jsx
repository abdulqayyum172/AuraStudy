import React, { useState, useEffect } from 'react';

export default function SettingsTab({
  currentUser,
  theme,
  setTheme,
  isSimulatedAI,
  handleLogout,
  addToast,
  API_BASE,
  setCurrentUser,
}) {
  const [displayName, setDisplayName] = useState('');
  const [classLevel, setClassLevel] = useState('');
  const [stream, setStream] = useState('');
  const [department, setDepartment] = useState('');
  const [course, setCourse] = useState('');
  const [saving, setSaving] = useState(false);

  // Populate fields from currentUser on mount or when currentUser changes
  useEffect(() => {
    if (currentUser) {
      setDisplayName(currentUser.displayName || currentUser.username || '');
      setClassLevel(currentUser.classLevel || '');
      setStream(currentUser.stream || '');
      setDepartment(currentUser.department || '');
      setCourse(currentUser.course || '');
    }
  }, [currentUser]);

  const isSSS = (level) => ['SSS 1', 'SSS 2', 'SSS 3'].includes(level);
  const isHigher = (level) =>
    ['100 Level', '200 Level', '300 Level', '400 Level', '500 Level', 'Higher Institution (Other)'].includes(level);

  const CLASS_LEVEL_GROUPS = [
    { label: 'Basic', options: ['Basic 1', 'Basic 2', 'Basic 3', 'Basic 4', 'Basic 5', 'Basic 6'] },
    { label: 'JSS (Junior Secondary School)', options: ['JSS 1', 'JSS 2', 'JSS 3'] },
    { label: 'SSS (Senior Secondary School)', options: ['SSS 1', 'SSS 2', 'SSS 3'] },
    { label: 'Higher Institution', options: ['100 Level', '200 Level', '300 Level', '400 Level', '500 Level', 'Higher Institution (Other)'] },
  ];

  const SSS_STREAMS = ['Science', 'Art', 'Commercial'];

  const DEPARTMENTS_WITH_COURSES = [
    { department: 'Sciences', courses: ['Computer Science', 'Information Technology', 'Physics', 'Chemistry', 'Mathematics', 'Statistics', 'Biochemistry', 'Microbiology', 'Agricultural Science'] },
    { department: 'Engineering', courses: ['Engineering (Electrical/Electronic)', 'Engineering (Mechanical)', 'Engineering (Civil)', 'Engineering (Chemical)'] },
    { department: 'Health Sciences', courses: ['Medicine & Surgery', 'Nursing Science', 'Pharmacy'] },
    { department: 'Management & Social Sciences', courses: ['Accounting', 'Business Administration', 'Economics', 'Banking & Finance', 'Mass Communication', 'Political Science', 'Sociology', 'Psychology'] },
    { department: 'Environmental Sciences', courses: ['Architecture'] },
    { department: 'Law', courses: ['Law'] },
    { department: 'Education', courses: ['Education'] },
    { department: 'Other', courses: ['Other'] },
  ];

  const DEPARTMENTS = DEPARTMENTS_WITH_COURSES.map(d => d.department);
  const getCoursesForDept = (dept) =>
    DEPARTMENTS_WITH_COURSES.find(d => d.department === dept)?.courses || [];

  // When class level changes, clear conditional fields
  const handleClassLevelChange = (value) => {
    setClassLevel(value);
    if (!isSSS(value)) setStream('');
    if (!isHigher(value)) {
      setDepartment('');
      setCourse('');
    }
  };

  const handleDepartmentChange = (value) => {
    setDepartment(value);
    setCourse('');
  };

  const hasChanges = () => {
    if (!currentUser) return false;
    return (
      displayName !== (currentUser.displayName || currentUser.username || '') ||
      classLevel !== (currentUser.classLevel || '') ||
      stream !== (currentUser.stream || '') ||
      department !== (currentUser.department || '') ||
      course !== (currentUser.course || '')
    );
  };

  const handleSave = async () => {
    if (!currentUser?.uid || !hasChanges()) return;
    setSaving(true);
    try {
      const response = await fetch(`${API_BASE}/users/${currentUser.uid}/profile`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          displayName: displayName.trim(),
          classLevel,
          stream: isSSS(classLevel) ? stream : '',
          department: isHigher(classLevel) ? department : '',
          course: isHigher(classLevel) ? course : '',
        }),
      });
      if (response.ok) {
        const updated = await response.json();
        setCurrentUser(prev => ({ ...prev, ...updated }));
        addToast('Profile updated successfully', 'success');
      } else {
        const err = await response.json().catch(() => ({}));
        addToast(err.error || 'Failed to update profile', 'error');
      }
    } catch (err) {
      addToast('Network error — could not save profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="tab-panel">
      <div className="page-header">
        <div className="page-title">
          <h1>Settings</h1>
          <p>Customize your AuraStudy experience</p>
        </div>
      </div>

      <div style={{ maxWidth: '640px', display: 'flex', flexDirection: 'column', gap: '24px' }}>

        {/* ── Appearance ── */}
        <div className="settings-card">
          <div className="settings-card-header">
            <h3>Appearance</h3>
          </div>
          <div className="settings-card-body">
            <div className="settings-theme-row">
              <button
                className={`settings-theme-btn ${theme === 'light' ? 'active' : ''}`}
                onClick={() => setTheme('light')}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
                Light
              </button>
              <button
                className={`settings-theme-btn ${theme === 'dark' ? 'active' : ''}`}
                onClick={() => setTheme('dark')}
              >
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
                Dark
              </button>
            </div>
          </div>
        </div>

        {/* ── Profile ── */}
        <div className="settings-card">
          <div className="settings-card-header">
            <h3>Profile</h3>
            {currentUser && hasChanges() && (
              <span className="settings-unsaved-badge">Unsaved changes</span>
            )}
          </div>
          <div className="settings-card-body">
            {currentUser ? (
              <>
                <div className="settings-profile-avatar">
                  <div className="settings-avatar-circle">
                    {(displayName || currentUser.username || '?')[0].toUpperCase()}
                  </div>
                  <div>
                    <div className="settings-avatar-name">{displayName || currentUser.username}</div>
                    <div className="settings-avatar-email">{currentUser.email}</div>
                  </div>
                </div>

                <div className="settings-fields">
                  <div className="input-group">
                    <label>Display Name</label>
                    <input
                      className="input-field"
                      value={displayName}
                      onChange={(e) => setDisplayName(e.target.value)}
                      placeholder="Your display name"
                    />
                  </div>

                  <div className="input-group">
                    <label>Email</label>
                    <input
                      className="input-field"
                      value={currentUser.email || ''}
                      readOnly
                      style={{ opacity: 0.6, cursor: 'not-allowed' }}
                    />
                    <span className="settings-field-hint">Email is managed by your account provider</span>
                  </div>

                  <div className="input-group">
                    <label>Class Level</label>
                    <select
                      className="input-field"
                      value={classLevel}
                      onChange={(e) => handleClassLevelChange(e.target.value)}
                    >
                      <option value="">Select class level</option>
                      {CLASS_LEVEL_GROUPS.map(group => (
                        <optgroup key={group.label} label={group.label}>
                          {group.options.map(level => (
                            <option key={level} value={level}>{level}</option>
                          ))}
                        </optgroup>
                      ))}
                    </select>
                  </div>

                  {isSSS(classLevel) && (
                    <div className="input-group">
                      <label>Stream</label>
                      <select
                        className="input-field"
                        value={stream}
                        onChange={(e) => setStream(e.target.value)}
                      >
                        <option value="">Select stream</option>
                        {SSS_STREAMS.map(s => (
                          <option key={s} value={s}>{s}</option>
                        ))}
                      </select>
                      <span className="settings-field-hint">Required for SSS students</span>
                    </div>
                  )}

                  {isHigher(classLevel) && (
                    <div className="input-group">
                      <label>Department / Faculty</label>
                      <select
                        className="input-field"
                        value={department}
                        onChange={(e) => handleDepartmentChange(e.target.value)}
                      >
                        <option value="">Select department</option>
                        {DEPARTMENTS.map(d => (
                          <option key={d} value={d}>{d}</option>
                        ))}
                      </select>
                    </div>
                  )}

                  {isHigher(classLevel) && department && (
                    <div className="input-group">
                      <label>Course</label>
                      <select
                        className="input-field"
                        value={course}
                        onChange={(e) => setCourse(e.target.value)}
                      >
                        <option value="">Select course</option>
                        {getCoursesForDept(department).map(c => (
                          <option key={c} value={c}>{c}</option>
                        ))}
                      </select>
                    </div>
                  )}
                </div>

                <div className="settings-save-row">
                  <button
                    className="btn btn-primary"
                    onClick={handleSave}
                    disabled={saving || !hasChanges()}
                    style={{ minWidth: '120px' }}
                  >
                    {saving ? (
                      <span className="settings-saving-spinner" />
                    ) : 'Save Changes'}
                  </button>
                </div>
              </>
            ) : (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Sign in to manage your profile.</p>
            )}
          </div>
        </div>

        {/* ── AI Assistant ── */}
        <div className="settings-card">
          <div className="settings-card-header">
            <h3>AI Assistant</h3>
          </div>
          <div className="settings-card-body">
            <div className="settings-ai-row">
              <div>
                <div className="settings-ai-label">AI Engine</div>
                <div className="settings-ai-value">
                  {isSimulatedAI ? 'Built-in Knowledge Engine' : 'Gemini 2.0 Flash'}
                </div>
              </div>
              <span className={`indicator-dot ${isSimulatedAI ? 'simulated' : ''}`} style={{ width: '10px', height: '10px' }} />
            </div>
            <p className="settings-ai-desc">
              {isSimulatedAI
                ? 'The AI is using the built-in knowledge engine. Responses are based on pre-loaded educational content for common topics.'
                : 'The AI is powered by Google Gemini 2.0 Flash, providing intelligent, personalized responses across all subjects.'}
            </p>
          </div>
        </div>

        {/* ── About ── */}
        <div className="settings-card">
          <div className="settings-card-header">
            <h3>About AuraStudy</h3>
          </div>
          <div className="settings-card-body">
            <div className="settings-about-grid">
              <div className="settings-about-row">
                <span>Version</span>
                <span>1.0.0</span>
              </div>
              <div className="settings-about-row">
                <span>Platform</span>
                <span>Web Application</span>
              </div>
              <div className="settings-about-row">
                <span>AI Model</span>
                <span>Gemini 2.0 Flash</span>
              </div>
            </div>
          </div>
        </div>

        {/* ── Account ── */}
        <div className="settings-card">
          <div className="settings-card-body" style={{ padding: 0 }}>
            <button className="settings-logout-btn" onClick={handleLogout}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              Log Out
            </button>
          </div>
        </div>

      </div>
    </div>
  );
}
