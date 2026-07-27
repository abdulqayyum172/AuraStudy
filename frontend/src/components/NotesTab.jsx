import React from 'react';
import { renderMarkdown } from '../utils/markdown';

const NotesTab = ({
  notes,
  activeNote,
  setActiveNote,
  noteTitle,
  setNoteTitle,
  noteContent,
  setNoteContent,
  isAiProcessing,
  aiNoteSuggestion,
  setAiNoteSuggestion,
  handleCreateNote,
  handleUpdateNote,
  handleDeleteNote,
  handleAiSummarize,
  handleAiGenerateCards,
  appendSummaryToNote,
}) => {
  return (
    <div className="tab-panel">
      <div className="page-header">
        <div className="page-title">
          <h1>Study Notes</h1>
          <p>{activeNote?.classLevel ? `Notes for ${activeNote.classLevel}${activeNote.stream ? ' ' + activeNote.stream : ''}` : 'Record notes and generate flashcards or summaries using AI.'}</p>
        </div>
        <button className="btn btn-primary" onClick={handleCreateNote}>
          ➕ Create Note
        </button>
      </div>

      <div className="notes-container">
        {/* Note Selection Sidebar */}
        <div className="notes-sidebar">
          <div className="notes-list">
            {notes.map(n => (
              <div key={n.id} className={`note-item ${activeNote?.id === n.id ? 'active' : ''}`} onClick={() => setActiveNote(n)}>
                <div className="note-item-title">{n.title}</div>
                <div className="note-item-preview">{n.content.replace(/[#*_-]/g, '').substring(0, 40)}...</div>
              </div>
            ))}
          </div>
        </div>

        {/* Note Editor */}
        {activeNote ? (
          <div className="note-editor">
            <div className="note-editor-header">
              <input
                type="text"
                className="input-field"
                style={{ fontSize: '1.2rem', fontWeight: 700, background: 'none', border: 'none', padding: 0 }}
                value={noteTitle}
                onChange={(e) => { setNoteTitle(e.target.value); }}
                onBlur={handleUpdateNote}
              />
              <button className="btn btn-danger" style={{ padding: '6px 12px', fontSize: '0.8rem' }} onClick={() => handleDeleteNote(activeNote.id)}>
                Delete Note
              </button>
            </div>

            <div className="note-editor-body">
              {/* Raw Markdown Input */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Markdown Content</span>
                <textarea
                  className="input-field"
                  style={{ flexGrow: 1, fontFamily: 'monospace', height: '100%', minHeight: '300px' }}
                  value={noteContent}
                  onChange={(e) => { setNoteContent(e.target.value); }}
                  onBlur={handleUpdateNote}
                />
              </div>

              {/* Preview panel */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
                <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontWeight: 600 }}>Structured Preview</span>
                <div className="note-preview-pane" dangerouslySetInnerHTML={{ __html: renderMarkdown(noteContent) }} />
              </div>
            </div>

            {/* AI Assistance Actions */}
            <div className="ai-notes-sidebar">
              <h4 style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>✨ AI Study Booster</h4>
              <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)' }}>Generate learning resources directly from your text.</p>
              <div style={{ display: 'flex', gap: '10px', marginTop: '6px' }}>
                <button className="btn btn-secondary" style={{ flex: 1, fontSize: '0.8rem', padding: '8px 12px' }} onClick={handleAiSummarize} disabled={isAiProcessing}>
                  {isAiProcessing ? 'Thinking...' : '📝 Summarize Note'}
                </button>
                <button className="btn btn-primary" style={{ flex: 1, fontSize: '0.8rem', padding: '8px 12px' }} onClick={handleAiGenerateCards} disabled={isAiProcessing}>
                  {isAiProcessing ? 'Thinking...' : '🗂️ Generate Flashcards'}
                </button>
              </div>

              {/* Display Summary output if present */}
              {aiNoteSuggestion && (
                <div style={{ marginTop: '14px', padding: '12px', background: 'var(--surface-card)', border: '1px dashed var(--border-glow)', borderRadius: '10px' }}>
                  <div dangerouslySetInnerHTML={{ __html: renderMarkdown(aiNoteSuggestion) }} style={{ fontSize: '0.85rem' }} />
                  <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '8px', marginTop: '10px' }}>
                    <button className="btn btn-secondary" style={{ fontSize: '0.75rem', padding: '4px 8px' }} onClick={() => setAiNoteSuggestion('')}>Dismiss</button>
                    <button className="btn btn-primary" style={{ fontSize: '0.75rem', padding: '4px 8px' }} onClick={appendSummaryToNote}>Append to Note</button>
                  </div>
                </div>
              )}
            </div>
          </div>
        ) : (
          <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexGrow: 1, color: 'var(--text-muted)' }}>
            Create or select a note to begin editing.
          </div>
        )}
      </div>
    </div>
  );
};

export default NotesTab;
