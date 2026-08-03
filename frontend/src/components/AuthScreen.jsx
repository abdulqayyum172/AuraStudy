import { GoogleIcon, AppleIcon } from '../data/icons.jsx';
import { getSubjectsForClass } from '../data/constants';

export default function AuthScreen({
  authMode,
  setAuthMode,
  authEmail,
  setAuthEmail,
  authDisplayName,
  setAuthDisplayName,
  authClassLevel,
  setAuthClassLevel,
  authStream,
  setAuthStream,
  authDepartment,
  setAuthDepartment,
  authCourse,
  setAuthCourse,
  authPassword,
  setAuthPassword,
  authError,
  setAuthError,
  authLoading,
  authPendingVerification,
  setAuthPendingVerification,
  authVerificationCode,
  setAuthVerificationCode,
  authResendLoading,
  handleAuthSubmit,
  handleVerifyCode,
  handleResendCode,
  handleSocialLogin,
  CLASS_LEVEL_GROUPS,
  SSS_STREAMS,
  DEPARTMENTS_WITH_COURSES,
  getCoursesForDepartment,
  isHigherInstitutionLevel,
  isSSSLevel,
  setShowAuth,
}) {
  const DEPARTMENTS = DEPARTMENTS_WITH_COURSES.map(d => d.department);

  return (
    <div className="auth-container">
      <div className="auth-card">
        <button className="auth-back-btn" type="button" onClick={() => setShowAuth(false)}>
          Back to landing
        </button>
        <div className="auth-header">
          <div className="auth-logo">✨</div>
          <h1 className="auth-title">AuraStudy</h1>
          <p className="auth-subtitle">Elevate your study intelligence</p>
        </div>

        <div className="auth-tabs">
          <button 
            className={`auth-tab ${authMode === 'login' ? 'active' : ''}`}
            onClick={() => { setAuthMode('login'); setAuthError(''); }}
          >
            Sign In
          </button>
          <button 
            className={`auth-tab ${authMode === 'signup' ? 'active' : ''}`}
            onClick={() => { setAuthMode('signup'); setAuthError(''); }}
          >
            Register
          </button>
        </div>

        <form onSubmit={handleAuthSubmit} className="auth-form">
          {authMode === 'signup' && (
            <div className="auth-input-group">
              <label htmlFor="displayName">Display Name</label>
              <input
                id="displayName"
                type="text"
                value={authDisplayName}
                onChange={(e) => setAuthDisplayName(e.target.value)}
                placeholder="e.g. Alex Study"
              />
            </div>
          )}

          {authMode === 'signup' && (
            <div className="auth-input-group">
              <label htmlFor="classLevel">Class / Level</label>
              <select
                id="classLevel"
                className="input-field"
                value={authClassLevel}
                onChange={(e) => {
                  const value = e.target.value;
                  setAuthClassLevel(value);
                  if (!isSSSLevel(value)) {
                    setAuthStream('');
                  }
                  if (!isHigherInstitutionLevel(value)) {
                    setAuthDepartment('');
                    setAuthCourse('');
                  }
                }}
                required
              >
                <option value="" disabled>Select your class...</option>
                {CLASS_LEVEL_GROUPS.map((group) => (
                  <optgroup key={group.label} label={group.label}>
                    {group.options.map((option) => (
                      <option key={option} value={option}>{option}</option>
                    ))}
                  </optgroup>
                ))}
              </select>
            </div>
          )}

          {authMode === 'signup' && isSSSLevel(authClassLevel) && (
            <div className="auth-input-group">
              <label htmlFor="stream">Stream</label>
              <select
                id="stream"
                className="input-field"
                value={authStream}
                onChange={(e) => setAuthStream(e.target.value)}
                required
              >
                <option value="" disabled>Select Science, Art, or Commercial...</option>
                {SSS_STREAMS.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          )}

          {authMode === 'signup' && isHigherInstitutionLevel(authClassLevel) && (
            <div className="auth-input-group">
              <label htmlFor="department">Department</label>
              <select
                id="department"
                className="input-field"
                value={authDepartment}
                onChange={(e) => {
                  setAuthDepartment(e.target.value);
                  setAuthCourse('');
                }}
                required
              >
                <option value="" disabled>Select your department...</option>
                {DEPARTMENTS.map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          )}

          {authMode === 'signup' && isHigherInstitutionLevel(authClassLevel) && authDepartment && (
            <div className="auth-input-group">
              <label htmlFor="course">Course of Study</label>
              <select
                id="course"
                className="input-field"
                value={authCourse}
                onChange={(e) => setAuthCourse(e.target.value)}
                required
              >
                <option value="" disabled>Select your course...</option>
                {getCoursesForDepartment(authDepartment).map((option) => (
                  <option key={option} value={option}>{option}</option>
                ))}
              </select>
            </div>
          )}

          {authMode === 'signup' && authClassLevel && (() => {
            const subjects = getSubjectsForClass(authClassLevel, authStream, authDepartment);
            if (subjects.length === 0) return null;
            return (
              <div className="auth-input-group">
                <label>Your Subjects</label>
                <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                  {subjects.map((subject) => (
                    <span key={subject} className="badge badge-purple" style={{ fontWeight: 500 }}>{subject}</span>
                  ))}
                </div>
              </div>
            );
          })()}

          <div className="auth-input-group">
            <label htmlFor="email">Email Address</label>
            <input
              id="email"
              type="email"
              value={authEmail}
              onChange={(e) => setAuthEmail(e.target.value)}
              placeholder="you@example.com"
              required
            />
          </div>

          <div className="auth-input-group">
            <label htmlFor="password">Password</label>
            <input
              id="password"
              type="password"
              value={authPassword}
              onChange={(e) => setAuthPassword(e.target.value)}
              placeholder="••••••••"
              required
              minLength={6}
            />
          </div>

          {authError && <div className="auth-error">{authError}</div>}

          <button type="submit" className="auth-submit-btn" disabled={authLoading}>
            {authLoading ? (
              <>
                <span className="auth-spinner"></span>
                Please wait...
              </>
            ) : (
              authMode === 'login' ? 'Access Workspace' : 'Create Account'
            )}
          </button>

          <div className="auth-separator">
            <span className="auth-separator-text">or continue with</span>
          </div>

          <div className="auth-social-buttons">
            <button type="button" className="auth-social-btn google-btn" onClick={() => handleSocialLogin('Google')} disabled={authLoading}>
              <GoogleIcon /> Google
            </button>
            <button type="button" className="auth-social-btn apple-btn" onClick={() => handleSocialLogin('Apple')} disabled={authLoading}>
              <AppleIcon /> Apple
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
