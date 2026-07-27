import React from 'react';
import { CURRICULUM_DATA } from '../data/constants';

export default function CurriculumTab({
  curriculumLevel,
  setCurriculumLevel,
  curriculumSubject,
  setCurriculumSubject,
  curriculumSearch,
  setCurriculumSearch,
  handleCurriculumTopicClick,
  CLASS_LEVEL_GROUPS,
  DEPARTMENTS_WITH_COURSES,
  DEPARTMENTS,
  getCoursesForDepartment,
  isHigherInstitutionLevel,
  isSSSLevel,
  SSS_STREAMS,
  currentUser,
}) {
  return (
    <div className="tab-panel">
      <div className="page-header">
        <div className="page-title">
          <h1>Nigerian Curriculum</h1>
          <p>Explore the complete WAEC/Nigerian school curriculum organised by level, subject, and topic.</p>
        </div>
      </div>

      {/* Search */}
      <div style={{ maxWidth: '500px', marginBottom: '28px' }}>
        <input
          className="input-field"
          placeholder="Search curriculum... e.g. 'algebra', 'photosynthesis', 'accounting'"
          value={curriculumSearch}
          onChange={(e) => setCurriculumSearch(e.target.value)}
          style={{ width: '100%' }}
        />
      </div>

      {/* Level Selection */}
      {!curriculumLevel && (
        <>
          {currentUser?.classLevel && (
            <div className="curriculum-recommended">
              <div className="curriculum-recommended-badge">
                <span>🎓</span>
                <span>Your Level: <strong>{currentUser.classLevel}{currentUser.stream ? ` (${currentUser.stream})` : ''}{currentUser.course ? ` — ${currentUser.course}` : ''}</strong></span>
              </div>
              <p>Showing curriculum matched to your profile.</p>
            </div>
          )}
          <div className="curriculum-level-grid">
            {Object.entries(CURRICULUM_DATA).map(([key, level], i) => (
              <button
                key={key}
                className="curriculum-level-card stagger-in"
                style={{ animationDelay: `${i * 80}ms`, '--level-color': level.color }}
                onClick={() => { setCurriculumLevel(key); setCurriculumSubject(null); }}
              >
                <div className="curriculum-level-accent" style={{ background: level.color }}></div>
                <div className="curriculum-level-icon">{level.icon}</div>
                <h3>{level.label}</h3>
                <p>{level.subtitle}</p>
                {level.description && <p className="curriculum-level-desc">{level.description}</p>}
                <div className="curriculum-level-meta">
                  {key === 'basic' && <span>{Object.keys(level.levels).length} grades</span>}
                  {key === 'jss' && <span>{Object.keys(level.levels).length} classes</span>}
                  {key === 'sss' && <span>{Object.keys(level.levels).length} classes · {level.streams?.length} streams</span>}
                  {key === 'university' && <span>{level.departments?.length} departments</span>}
                  {level.examBoards && <span className="curriculum-level-boards">{level.examBoards.join(' · ')}</span>}
                </div>
              </button>
            ))}
          </div>
        </>
      )}

      {/* Subject View for Basic/JSS */}
      {curriculumLevel && curriculumLevel !== 'sss' && curriculumLevel !== 'university' && !curriculumSubject && (
        <>
          <button className="learn-back-btn" onClick={() => { setCurriculumLevel(null); setCurriculumSubject(null); }}>
            ← All Levels
          </button>
          <div className="curriculum-subject-header">
            <h2 style={{ color: CURRICULUM_DATA[curriculumLevel]?.color }}>{CURRICULUM_DATA[curriculumLevel]?.icon} {CURRICULUM_DATA[curriculumLevel]?.label}</h2>
            <p>Select a class to view its curriculum:</p>
          </div>
          <div className="curriculum-level-tabs">
            {Object.entries(CURRICULUM_DATA[curriculumLevel]?.levels || {}).map(([levelKey, levelData]) => (
              <button
                key={levelKey}
                className="curriculum-level-tab"
                style={{ '--level-color': CURRICULUM_DATA[curriculumLevel]?.color }}
                onClick={() => setCurriculumSubject({ type: 'standard', level: levelKey, data: levelData })}
              >
                <span className="curriculum-level-tab-name">{levelKey}</span>
                <span className="curriculum-level-tab-count">{levelData.subjects.length} subjects</span>
              </button>
            ))}
          </div>
        </>
      )}

      {/* SSS Stream Selection */}
      {curriculumLevel === 'sss' && !curriculumSubject && (
        <>
          <button className="learn-back-btn" onClick={() => { setCurriculumLevel(null); setCurriculumSubject(null); }}>
            ← All Levels
          </button>
          <div className="curriculum-subject-header">
            <h2 style={{ color: CURRICULUM_DATA.sss.color }}>{CURRICULUM_DATA.sss.icon} {CURRICULUM_DATA.sss.label}</h2>
            {CURRICULUM_DATA.sss.description && <p className="curriculum-section-desc">{CURRICULUM_DATA.sss.description}</p>}
            {CURRICULUM_DATA.sss.examBoards && (
              <div className="curriculum-exam-boards">
                {CURRICULUM_DATA.sss.examBoards.map(b => (
                  <span key={b} className="curriculum-exam-badge">{b}</span>
                ))}
              </div>
            )}
            <p>Select a stream and class to view the curriculum:</p>
          </div>
          {Object.entries(CURRICULUM_DATA.sss.levels).map(([levelKey, levelData]) => (
            <div key={levelKey} className="curriculum-sss-level-section">
              <h3 className="curriculum-sss-level-title">{levelKey}</h3>
              <div className="curriculum-sss-stream-grid">
                {CURRICULUM_DATA.sss.streams.map(stream => (
                  <button
                    key={stream}
                    className="curriculum-sss-stream-card"
                    style={{ '--level-color': CURRICULUM_DATA.sss.color }}
                    onClick={() => setCurriculumSubject({ type: 'sss', level: levelKey, stream, data: levelData })}
                  >
                    <span className="curriculum-stream-icon">
                      {stream === 'Science' ? '🔬' : stream === 'Art' ? '🎨' : '💼'}
                    </span>
                    <span className="curriculum-stream-name">{stream}</span>
                    <span className="curriculum-stream-count">
                      {levelData[stream]?.length || 0} subjects
                    </span>
                  </button>
                ))}
              </div>
            </div>
          ))}
        </>
      )}

      {/* University Department/Course Selection */}
      {curriculumLevel === 'university' && !curriculumSubject && (
        <>
          <button className="learn-back-btn" onClick={() => { setCurriculumLevel(null); setCurriculumSubject(null); }}>
            ← All Levels
          </button>
          <div className="curriculum-subject-header">
            <h2 style={{ color: CURRICULUM_DATA.university.color }}>{CURRICULUM_DATA.university.icon} {CURRICULUM_DATA.university.label}</h2>
            <p>Select a department and course to view the curriculum:</p>
          </div>
          {CURRICULUM_DATA.university.departments.map(dept => (
            <div key={dept.name} className="curriculum-dept-section">
              <h3 className="curriculum-dept-title">
                {dept.icon && <span>{dept.icon} </span>}
                {dept.name}
              </h3>
              <div className="curriculum-dept-courses">
                {dept.courses.map(course => {
                  const topicList = course.topics || course.courses || [];
                  return (
                    <button
                      key={course.name}
                      className="curriculum-course-card"
                      style={{ '--level-color': CURRICULUM_DATA.university.color }}
                      onClick={() => setCurriculumSubject({ type: 'university', department: dept.name, course: course.name, data: course })}
                    >
                      <span className="curriculum-course-icon">{course.icon}</span>
                      <span className="curriculum-course-name">{course.name}</span>
                      {course.desc && <span className="curriculum-course-desc">{course.desc}</span>}
                      <span className="curriculum-course-count">{topicList.length} topics{course.duration ? ` · ${course.duration}` : ''}</span>
                    </button>
                  );
                })}
              </div>
            </div>
          ))}
        </>
      )}

      {/* Subject Detail View */}
      {curriculumSubject && (
        <>
          <button className="learn-back-btn" onClick={() => setCurriculumSubject(null)}>
            ← Back to {curriculumLevel === 'sss' ? 'Streams' : curriculumLevel === 'university' ? 'Departments' : 'Levels'}
          </button>

          <div className="curriculum-detail-header" style={{ borderColor: CURRICULUM_DATA[curriculumLevel]?.color }}>
            <div className="curriculum-detail-level-badge" style={{ background: CURRICULUM_DATA[curriculumLevel]?.color + '20', color: CURRICULUM_DATA[curriculumLevel]?.color }}>
              {CURRICULUM_DATA[curriculumLevel]?.icon} {curriculumSubject.level}
              {curriculumSubject.stream ? ` — ${curriculumSubject.stream}` : ''}
              {curriculumSubject.course ? ` — ${curriculumSubject.course}` : ''}
            </div>
          </div>

          {/* Core subjects (SSS) */}
          {curriculumSubject.type === 'sss' && curriculumSubject.data.core && (
            <div className="curriculum-core-section">
              <h3>📋 Core Subjects (All Streams)</h3>
              <div className="curriculum-subject-grid">
                {curriculumSubject.data.core.map(subjectName => {
                  const subject = curriculumSubject.data[curriculumSubject.stream]?.find(s => s.name === subjectName) ||
                    { name: subjectName, icon: '📖', topics: [] };
                  return (
                    <div key={subjectName} className="curriculum-subject-card" style={{ '--level-color': CURRICULUM_DATA[curriculumLevel]?.color }}>
                      <div className="curriculum-subject-card-header">
                        <span className="curriculum-subject-icon">{subject.icon}</span>
                        <h4>{subject.name}</h4>
                      </div>
                      {subject.topics.length > 0 && (
                        <ul className="curriculum-topic-list">
                          {subject.topics.filter(t => !curriculumSearch || t.toLowerCase().includes(curriculumSearch.toLowerCase())).map((topic, i) => (
                            <li key={i} className="curriculum-topic-item" onClick={() => handleCurriculumTopicClick(topic)}>
                              <span className="curriculum-topic-number">{i + 1}</span>
                              <span>{topic}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {/* Stream subjects (SSS) */}
          {curriculumSubject.type === 'sss' && curriculumSubject.stream && (
            <div className="curriculum-stream-section">
              {curriculumSubject.data.yearDesc && <p className="curriculum-year-desc">{curriculumSubject.data.yearDesc}</p>}
              <h3>{curriculumSubject.stream === 'Science' ? '🔬' : curriculumSubject.stream === 'Art' ? '🎨' : '💼'} {curriculumSubject.stream} Stream Subjects</h3>
              <div className="curriculum-subject-grid">
                {(curriculumSubject.data[curriculumSubject.stream] || []).filter(s => !curriculumSearch ||
                  s.name.toLowerCase().includes(curriculumSearch.toLowerCase()) ||
                  s.topics.some(t => t.toLowerCase().includes(curriculumSearch.toLowerCase()))
                ).map(subject => (
                  <div key={subject.name} className="curriculum-subject-card" style={{ '--level-color': CURRICULUM_DATA[curriculumLevel]?.color }}>
                    <div className="curriculum-subject-card-header">
                      <span className="curriculum-subject-icon">{subject.icon}</span>
                      <div>
                        <h4>{subject.name}</h4>
                        {subject.desc && <p className="curriculum-subject-desc">{subject.desc}</p>}
                      </div>
                      {subject.boards && (
                        <div className="curriculum-subject-boards">
                          {subject.boards.map(b => <span key={b} className="curriculum-board-tag">{b}</span>)}
                        </div>
                      )}
                    </div>
                    <div className="curriculum-topic-count">{subject.topics.length} topics</div>
                    <ul className="curriculum-topic-list">
                      {subject.topics.map((topic, i) => (
                        <li key={i} className="curriculum-topic-item" onClick={() => handleCurriculumTopicClick(topic)}>
                          <span className="curriculum-topic-number">{i + 1}</span>
                          <span>{topic}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Standard subjects (Basic, JSS, University course) */}
          {curriculumSubject.type === 'standard' && (
            <>
              {curriculumSubject.data.yearDesc && <p className="curriculum-year-desc">{curriculumSubject.data.yearDesc}</p>}
              <div className="curriculum-subject-grid">
              {curriculumSubject.data.subjects.filter(s => !curriculumSearch ||
                s.name.toLowerCase().includes(curriculumSearch.toLowerCase()) ||
                s.topics.some(t => t.toLowerCase().includes(curriculumSearch.toLowerCase()))
              ).map(subject => (
                <div key={subject.name} className="curriculum-subject-card" style={{ '--level-color': CURRICULUM_DATA[curriculumLevel]?.color }}>
                  <div className="curriculum-subject-card-header">
                    <span className="curriculum-subject-icon">{subject.icon}</span>
                    <div>
                      <h4>{subject.name}</h4>
                      {subject.desc && <p className="curriculum-subject-desc">{subject.desc}</p>}
                    </div>
                    {subject.boards && (
                      <div className="curriculum-subject-boards">
                        {subject.boards.map(b => <span key={b} className="curriculum-board-tag">{b}</span>)}
                      </div>
                    )}
                  </div>
                  <div className="curriculum-topic-count">{subject.topics.length} topics</div>
                  <ul className="curriculum-topic-list">
                    {subject.topics.map((topic, i) => (
                      <li key={i} className="curriculum-topic-item" onClick={() => handleCurriculumTopicClick(topic)}>
                        <span className="curriculum-topic-number">{i + 1}</span>
                        <span>{topic}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              ))}
            </div>
            </>
          )}

          {/* University course topics */}
          {curriculumSubject.type === 'university' && (
            <div className="curriculum-subject-grid">
              <div className="curriculum-subject-card curriculum-course-detail" style={{ '--level-color': CURRICULUM_DATA[curriculumLevel]?.color }}>
                <div className="curriculum-subject-card-header">
                  <span className="curriculum-subject-icon">{curriculumSubject.data.icon}</span>
                  <div>
                    <h4>{curriculumSubject.course}</h4>
                    {curriculumSubject.data.desc && <p className="curriculum-subject-desc">{curriculumSubject.data.desc}</p>}
                  </div>
                </div>
                <p className="curriculum-course-dept">Department of {curriculumSubject.department}{curriculumSubject.data.duration ? ` · ${curriculumSubject.data.duration}` : ''}</p>
                <div className="curriculum-topic-count">{(curriculumSubject.data.topics || curriculumSubject.data.courses || []).length} topics</div>
                <ul className="curriculum-topic-list">
                  {(curriculumSubject.data.topics || curriculumSubject.data.courses || []).filter(t => !curriculumSearch || t.toLowerCase().includes(curriculumSearch.toLowerCase())).map((topic, i) => (
                    <li key={i} className="curriculum-topic-item" onClick={() => handleCurriculumTopicClick(topic)}>
                      <span className="curriculum-topic-number">{i + 1}</span>
                      <span>{topic}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
          )}
        </>
      )}
    </div>
  );
}
