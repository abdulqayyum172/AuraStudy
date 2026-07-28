import React, { useState, useEffect } from 'react';

const DEFAULT_FOCUS_PREFS = {
  focusDuration: 25,
  shortBreakDuration: 5,
  longBreakDuration: 15,
  longBreakInterval: 4,
  autoStartBreaks: false,
  autoStartFocus: false,
  timerSound: true,
};

export default function SettingsTab({
  currentUser,
  theme,
  setTheme,
  isSimulatedAI,
  handleLogout,
  addToast,
  API_BASE,
  setCurrentUser,
  focusPrefs,
  setFocusPrefs,
}) {
  // Profile state
  const [displayName, setDisplayName] = useState('');
  const [classLevel, setClassLevel] = useState('');
  const [stream, setStream] = useState('');
  const [department, setDepartment] = useState('');
  const [course, setCourse] = useState('');
  const [saving, setSaving] = useState(false);

  // Account state
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showPasswordModal, setShowPasswordModal] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [accountAction, setAccountAction] = useState(null);

  useEffect(() => {
    if (currentUser) {
      setDisplayName(currentUser.displayName || currentUser.username || '');
      setClassLevel(currentUser.classLevel || '');
      setStream(currentUser.stream || '');
      setDepartment(currentUser.department || '');
      setCourse(currentUser.course || '');
    }
  }, [currentUser]);

  // Helpers
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

  const handleClassLevelChange = (value) => {
    setClassLevel(value);
    if (!isSSS(value)) setStream('');
    if (!isHigher(value)) { setDepartment(''); setCourse(''); }
  };
  const handleDepartmentChange = (value) => { setDepartment(value); setCourse(''); };

  const hasProfileChanges = () => {
    if (!currentUser) return false;
    return (
      displayName !== (currentUser.displayName || currentUser.username || '') ||
      classLevel !== (currentUser.classLevel || '') ||
      stream !== (currentUser.stream || '') ||
      department !== (currentUser.department || '') ||
      course !== (currentUser.course || '')
    );
  };

  // Profile save
  const handleSaveProfile = async () => {
    if (!currentUser?.uid || !hasProfileChanges()) return;
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
    } catch {
      addToast('Network error — could not save profile', 'error');
    } finally {
      setSaving(false);
    }
  };

  // Focus prefs
  const updatePref = (key, value) => {
    setFocusPrefs(prev => {
      const next = { ...prev, [key]: value };
      localStorage.setItem('aura-focus-prefs', JSON.stringify(next));
      return next;
    });
  };

  // Account: delete
  const handleDeleteAccount = async () => {
    if (!currentUser?.uid) return;
    setAccountAction('deleting');
    try {
      const response = await fetch(`${API_BASE}/users/${currentUser.uid}/profile`, { method: 'DELETE' });
      if (response.ok) {
        addToast('Account data deleted. Signing out...', 'success');
        setShowDeleteConfirm(false);
        setTimeout(() => handleLogout(), 1500);
      } else {
        addToast('Failed to delete account data', 'error');
      }
    } catch {
      addToast('Network error', 'error');
    } finally {
      setAccountAction(null);
    }
  };

  // Account: password change via Firebase reauthentication
  const handleChangePassword = async () => {
    if (!newPassword || !confirmPassword) return;
    if (newPassword.length < 6) { addToast('Password must be at least 6 characters', 'error'); return; }
    if (newPassword !== confirmPassword) { addToast('Passwords do not match', 'error'); return; }
    setAccountAction('password');
    try {
      const { getAuth, reauthenticateWithCredential, EmailAuthProvider, updatePassword } = await import('firebase/auth');
      const auth = getAuth();
      const user = auth.currentUser;
      if (!user || !user.email) { addToast('No authenticated user found', 'error'); setAccountAction(null); return; }
      const password = window.prompt('Enter your current password to confirm:');
      if (!password) { setAccountAction(null); return; }
      const credential = EmailAuthProvider.credential(user.email, password);
      await reauthenticateWithCredential(user, credential);
      await updatePassword(user, newPassword);
      addToast('Password updated successfully', 'success');
      setShowPasswordModal(false);
      setNewPassword('');
      setConfirmPassword('');
    } catch (err) {
      if (err.code === 'auth/wrong-password') addToast('Current password is incorrect', 'error');
      else if (err.code === 'auth/weak-password') addToast('New password is too weak', 'error');
      else addToast('Failed to change password: ' + (err.message || 'Unknown error'), 'error');
    } finally {
      setAccountAction(null);
    }
  };

  const SectionIcon = ({ d }) => (
    <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" style={{ opacity: 0.5 }}>
      <path d={d} />
    </svg>
  );

  return (
    <div className="tab-panel">
      <div className="page-header">
        <div className="page-title">
          <h1>Settings</h1>
          <p>Customize your AuraStudy experience</p>
        </div>
      </div>

      <div style={{ maxWidth: '640px', display: 'flex', flexDirection: 'column', gap: '20px' }}>

        {/* ── Appearance ── */}
        <div className="settings-card settings-card-animate">
          <div className="settings-card-header">
            <div className="settings-card-title">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
              <h3>Appearance</h3>
            </div>
          </div>
          <div className="settings-card-body">
            <div className="settings-theme-row">
              <button className={`settings-theme-btn ${theme === 'light' ? 'active' : ''}`} onClick={() => setTheme('light')}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="5"/><line x1="12" y1="1" x2="12" y2="3"/><line x1="12" y1="21" x2="12" y2="23"/><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"/><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"/><line x1="1" y1="12" x2="3" y2="12"/><line x1="21" y1="12" x2="23" y2="12"/><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"/><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"/></svg>
                Light
              </button>
              <button className={`settings-theme-btn ${theme === 'dark' ? 'active' : ''}`} onClick={() => setTheme('dark')}>
                <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"/></svg>
                Dark
              </button>
            </div>
          </div>
        </div>

        {/* ── Profile ── */}
        <div className="settings-card settings-card-animate">
          <div className="settings-card-header">
            <div className="settings-card-title">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/><circle cx="12" cy="7" r="4"/></svg>
              <h3>Profile</h3>
            </div>
            {currentUser && hasProfileChanges() && (
              <span className="settings-unsaved-badge">Unsaved</span>
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
                    <input className="input-field" value={displayName} onChange={(e) => setDisplayName(e.target.value)} placeholder="Your display name" />
                  </div>
                  <div className="input-group">
                    <label>Email</label>
                    <input className="input-field" value={currentUser.email || ''} readOnly style={{ opacity: 0.6, cursor: 'not-allowed' }} />
                    <span className="settings-field-hint">Managed by your account provider</span>
                  </div>
                  <div className="input-group">
                    <label>Class Level</label>
                    <select className="input-field" value={classLevel} onChange={(e) => handleClassLevelChange(e.target.value)}>
                      <option value="">Select class level</option>
                      {CLASS_LEVEL_GROUPS.map(group => (
                        <optgroup key={group.label} label={group.label}>
                          {group.options.map(level => <option key={level} value={level}>{level}</option>)}
                        </optgroup>
                      ))}
                    </select>
                  </div>
                  {isSSS(classLevel) && (
                    <div className="input-group">
                      <label>Stream</label>
                      <select className="input-field" value={stream} onChange={(e) => setStream(e.target.value)}>
                        <option value="">Select stream</option>
                        {SSS_STREAMS.map(s => <option key={s} value={s}>{s}</option>)}
                      </select>
                    </div>
                  )}
                  {isHigher(classLevel) && (
                    <div className="input-group">
                      <label>Department / Faculty</label>
                      <select className="input-field" value={department} onChange={(e) => handleDepartmentChange(e.target.value)}>
                        <option value="">Select department</option>
                        {DEPARTMENTS.map(d => <option key={d} value={d}>{d}</option>)}
                      </select>
                    </div>
                  )}
                  {isHigher(classLevel) && department && (
                    <div className="input-group">
                      <label>Course</label>
                      <select className="input-field" value={course} onChange={(e) => setCourse(e.target.value)}>
                        <option value="">Select course</option>
                        {getCoursesForDept(department).map(c => <option key={c} value={c}>{c}</option>)}
                      </select>
                    </div>
                  )}
                </div>
                <div className="settings-save-row">
                  <button className="btn btn-primary" onClick={handleSaveProfile} disabled={saving || !hasProfileChanges()} style={{ minWidth: '120px' }}>
                    {saving ? <span className="settings-saving-spinner" /> : 'Save Changes'}
                  </button>
                </div>
              </>
            ) : (
              <p style={{ color: 'var(--text-muted)', fontSize: '0.85rem' }}>Sign in to manage your profile.</p>
            )}
          </div>
        </div>

        {/* ── Focus Preferences ── */}
        <div className="settings-card settings-card-animate">
          <div className="settings-card-header">
            <div className="settings-card-title">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/></svg>
              <h3>Focus Preferences</h3>
            </div>
          </div>
          <div className="settings-card-body">
            <div className="settings-fields">
              <div className="settings-duration-grid">
                <div className="input-group">
                  <label>Focus (min)</label>
                  <input type="number" min="1" max="120" className="input-field" value={focusPrefs.focusDuration} onChange={(e) => updatePref('focusDuration', Math.max(1, parseInt(e.target.value) || 25))} />
                </div>
                <div className="input-group">
                  <label>Short Break (min)</label>
                  <input type="number" min="1" max="60" className="input-field" value={focusPrefs.shortBreakDuration} onChange={(e) => updatePref('shortBreakDuration', Math.max(1, parseInt(e.target.value) || 5))} />
                </div>
                <div className="input-group">
                  <label>Long Break (min)</label>
                  <input type="number" min="1" max="60" className="input-field" value={focusPrefs.longBreakDuration} onChange={(e) => updatePref('longBreakDuration', Math.max(1, parseInt(e.target.value) || 15))} />
                </div>
                <div className="input-group">
                  <label>Long Break After</label>
                  <input type="number" min="1" max="12" className="input-field" value={focusPrefs.longBreakInterval} onChange={(e) => updatePref('longBreakInterval', Math.max(1, parseInt(e.target.value) || 4))} />
                </div>
              </div>
              <span className="settings-field-hint">Long break triggers after this many focus sessions</span>

              <div className="settings-toggle-row">
                <div className="settings-toggle-info">
                  <span className="settings-toggle-label">Auto-start breaks</span>
                  <span className="settings-toggle-desc">Automatically begin break timer after focus</span>
                </div>
                <button className={`settings-toggle ${focusPrefs.autoStartBreaks ? 'on' : ''}`} onClick={() => updatePref('autoStartBreaks', !focusPrefs.autoStartBreaks)}>
                  <span className="settings-toggle-knob" />
                </button>
              </div>

              <div className="settings-toggle-row">
                <div className="settings-toggle-info">
                  <span className="settings-toggle-label">Auto-start focus</span>
                  <span className="settings-toggle-desc">Automatically begin focus after break ends</span>
                </div>
                <button className={`settings-toggle ${focusPrefs.autoStartFocus ? 'on' : ''}`} onClick={() => updatePref('autoStartFocus', !focusPrefs.autoStartFocus)}>
                  <span className="settings-toggle-knob" />
                </button>
              </div>

              <div className="settings-toggle-row">
                <div className="settings-toggle-info">
                  <span className="settings-toggle-label">Timer sound</span>
                  <span className="settings-toggle-desc">Play a sound when a session completes</span>
                </div>
                <button className={`settings-toggle ${focusPrefs.timerSound ? 'on' : ''}`} onClick={() => updatePref('timerSound', !focusPrefs.timerSound)}>
                  <span className="settings-toggle-knob" />
                </button>
              </div>
            </div>
          </div>
        </div>

        {/* ── AI Assistant ── */}
        <div className="settings-card settings-card-animate">
          <div className="settings-card-header">
            <div className="settings-card-title">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
              <h3>AI Assistant</h3>
            </div>
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

        {/* ── Account ── */}
        <div className="settings-card settings-card-animate">
          <div className="settings-card-header">
            <div className="settings-card-title">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><rect x="3" y="11" width="18" height="11" rx="2" ry="2"/><path d="M7 11V7a5 5 0 0 1 10 0v4"/></svg>
              <h3>Account</h3>
            </div>
          </div>
          <div className="settings-card-body">
            <div className="settings-account-actions">
              <button className="settings-account-btn" onClick={() => setShowPasswordModal(true)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M17 3a2.85 2.83 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z"/></svg>
                Change Password
              </button>
              <button className="settings-account-btn danger" onClick={() => setShowDeleteConfirm(true)}>
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><polyline points="3 6 5 6 21 6"/><path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/></svg>
                Delete All My Data
              </button>
            </div>
          </div>
        </div>

        {/* ── About ── */}
        <div className="settings-card settings-card-animate">
          <div className="settings-card-header">
            <div className="settings-card-title">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" y1="16" x2="12" y2="12"/><line x1="12" y1="8" x2="12.01" y2="8"/></svg>
              <h3>About AuraStudy</h3>
            </div>
          </div>
          <div className="settings-card-body">
            <div className="settings-about-grid">
              <div className="settings-about-row"><span>Version</span><span>1.0.0</span></div>
              <div className="settings-about-row"><span>Platform</span><span>Web Application</span></div>
              <div className="settings-about-row"><span>AI Model</span><span>Gemini 2.0 Flash</span></div>
            </div>
          </div>
        </div>

        {/* ── Logout ── */}
        <div className="settings-card settings-card-animate">
          <div className="settings-card-body" style={{ padding: 0 }}>
            <button className="settings-logout-btn" onClick={handleLogout}>
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4"/><polyline points="16 17 21 12 16 7"/><line x1="21" y1="12" x2="9" y2="12"/></svg>
              Log Out
            </button>
          </div>
        </div>
      </div>

      {/* ── Delete Confirmation Modal ── */}
      {showDeleteConfirm && (
        <div className="modal-overlay" onClick={() => setShowDeleteConfirm(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '420px' }}>
            <h3 style={{ marginBottom: '12px', color: 'var(--danger)' }}>Delete All Data</h3>
            <p style={{ fontSize: '0.88rem', color: 'var(--text-muted)', lineHeight: 1.6, marginBottom: '20px' }}>
              This will permanently remove your profile, study history, quiz results, conversations, and all saved data. This action cannot be undone.
            </p>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px' }}>
              <button className="btn btn-secondary" onClick={() => setShowDeleteConfirm(false)}>Cancel</button>
              <button className="btn btn-danger" onClick={handleDeleteAccount} disabled={accountAction === 'deleting'}>
                {accountAction === 'deleting' ? <span className="settings-saving-spinner" style={{ borderTopColor: '#fff' }} /> : 'Yes, Delete Everything'}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Password Change Modal ── */}
      {showPasswordModal && (
        <div className="modal-overlay" onClick={() => setShowPasswordModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()} style={{ maxWidth: '420px' }}>
            <h3 style={{ marginBottom: '16px' }}>Change Password</h3>
            <div className="input-group">
              <label>New Password</label>
              <input type="password" className="input-field" value={newPassword} onChange={(e) => setNewPassword(e.target.value)} placeholder="At least 6 characters" />
            </div>
            <div className="input-group">
              <label>Confirm Password</label>
              <input type="password" className="input-field" value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)} placeholder="Re-enter password" />
            </div>
            <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '10px', marginTop: '8px' }}>
              <button className="btn btn-secondary" onClick={() => { setShowPasswordModal(false); setNewPassword(''); setConfirmPassword(''); }}>Cancel</button>
              <button className="btn btn-primary" onClick={handleChangePassword} disabled={accountAction === 'password' || !newPassword || !confirmPassword}>
                {accountAction === 'password' ? <span className="settings-saving-spinner" /> : 'Update Password'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
