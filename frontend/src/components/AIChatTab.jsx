import React from 'react';
import { renderMarkdown } from '../utils/markdown';

export default function AIChatTab({
  currentUser,
  chatMessage,
  setChatMessage,
  chatHistory,
  setChatHistory,
  chatLoading,
  editingMessageIndex,
  setEditingMessageIndex,
  editingMessageText,
  setEditingMessageText,
  chatCategoryFilter,
  setChatCategoryFilter,
  conversations,
  activeConversationId,
  setActiveConversationId,
  showSidebar,
  setShowSidebar,
  pendingImage,
  setPendingImage,
  executingCode,
  isSimulatedAI,
  handleSendChatMessage,
  handleFileSelect,
  removePendingImage,
  handleExecuteCode,
  handleCopyMessageText,
  handleSaveEditedMessage,
  handleReplyToMessage,
  handleGenerateQuizFromChat,
  loadConversations,
  loadConversation,
  startNewChat,
  deleteConversation,
  chatEndRef,
  fileInputRef,
  addToast,
  getSubjectsForClass,
  getWelcomeMessage,
}) {
  return (
    <>
      {/* ==================== AI ASSISTANT TAB ==================== */}
      <div className="tab-panel">
        <div className="page-header">
          <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
            {currentUser?.uid && (
              <button
                className="btn btn-secondary"
                style={{ padding: '6px 10px', fontSize: '0.85rem', minWidth: 'auto' }}
                onClick={() => setShowSidebar(!showSidebar)}
                title="Chat History"
              >
                ☰
              </button>
            )}
            <div className="page-title">
              <h1>AI Study Companion</h1>
              <p>{currentUser?.classLevel ? `Personalized ${currentUser.classLevel} AI tutor` : 'Ask anything — concept explanations, code, practice problems, or study plans.'}</p>
            </div>
          </div>
          <div style={{ display: 'flex', gap: '8px' }}>
            {currentUser?.uid && (
              <button className="btn btn-secondary" style={{ padding: '6px 14px', fontSize: '0.85rem' }} onClick={startNewChat}>
                + New Chat
              </button>
            )}
            {chatHistory.length > 1 && (
              <button className="btn btn-secondary" style={{ padding: '6px 14px', fontSize: '0.85rem' }} onClick={() => {
                if (confirm('Clear current chat history?')) {
                  setChatHistory([{ role: 'assistant', content: '' }]);
                  setActiveConversationId(null);
                  addToast('Chat cleared', 'info');
                }
              }}>
                Clear Chat
              </button>
            )}
          </div>
        </div>

        <div className="chat-container">
          {/* Session Sidebar */}
          {showSidebar && currentUser?.uid && (
            <div style={{
              position: 'absolute', left: 0, top: 0, bottom: 0, width: '260px',
              background: 'var(--surface-main)', borderRight: '1px solid var(--border-light)',
              zIndex: 10, display: 'flex', flexDirection: 'column', borderRadius: '12px 0 0 12px',
              overflow: 'hidden'
            }}>
              <div style={{ padding: '14px', borderBottom: '1px solid var(--border-light)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontWeight: 700, fontSize: '0.88rem' }}>Chat History</span>
                <button onClick={() => setShowSidebar(false)} style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '1.1rem' }}>✕</button>
              </div>
              <div style={{ flex: 1, overflowY: 'auto', padding: '8px' }}>
                {conversations.length === 0 ? (
                  <p style={{ fontSize: '0.8rem', color: 'var(--text-muted)', textAlign: 'center', padding: '20px 8px' }}>No conversations yet. Start chatting!</p>
                ) : conversations.map(conv => (
                  <div
                    key={conv.id}
                    onClick={() => loadConversation(currentUser.uid, conv.id)}
                    style={{
                      padding: '10px 12px', borderRadius: '8px', cursor: 'pointer', marginBottom: '4px',
                      background: activeConversationId === conv.id ? 'var(--accent-primary-light)' : 'transparent',
                      border: activeConversationId === conv.id ? '1px solid var(--accent-primary)' : '1px solid transparent',
                      transition: 'all 0.15s'
                    }}
                    onMouseEnter={(e) => { if (activeConversationId !== conv.id) e.currentTarget.style.background = 'var(--surface-hover)'; }}
                    onMouseLeave={(e) => { if (activeConversationId !== conv.id) e.currentTarget.style.background = 'transparent'; }}
                  >
                    <div style={{ fontSize: '0.82rem', fontWeight: 600, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{conv.title}</div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginTop: '4px' }}>
                      <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>{conv.messageCount || 0} messages</span>
                      <button
                        onClick={(e) => { e.stopPropagation(); deleteConversation(conv.id); }}
                        style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', fontSize: '0.7rem', padding: '2px 4px' }}
                        title="Delete"
                      >🗑</button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
          <div style={{ display: 'flex', gap: '6px', marginBottom: '12px', padding: '0 12px', flexWrap: 'wrap' }}>
            {[
              { id: 'all', label: 'All Prompts' },
              { id: 'stem', label: '📐 STEM & Math' },
              { id: 'coding', label: '💻 Coding & Tech' },
              { id: 'humanities', label: '📚 Humanities' },
              { id: 'study', label: '⚡ Study Strategy' }
            ].map(cat => (
              <button
                key={cat.id}
                type="button"
                onClick={() => setChatCategoryFilter(cat.id)}
                style={{
                  padding: '4px 10px', borderRadius: '14px', border: '1px solid var(--border-light)',
                  background: chatCategoryFilter === cat.id ? 'var(--accent-primary)' : 'var(--surface-card)',
                  color: chatCategoryFilter === cat.id ? '#fff' : 'var(--text-muted)',
                  fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer'
                }}
              >
                {cat.label}
              </button>
            ))}
          </div>

          {/* Chat history */}
          <div className="chat-history">
            {chatHistory.length === 1 && !chatLoading && (
              <div className="chat-suggestions">
                <p className="chat-suggestions-label">Try asking Aura:</p>
                <div className="chat-suggestions-grid">
                  {(() => {
                    const levelPrompts = currentUser?.classLevel ? [
                      { icon: '📚', text: `Teach me the fundamentals of ${getSubjectsForClass(currentUser.classLevel, currentUser.stream, currentUser.department)[0] || ' Mathematics'}` },
                      { icon: '📝', text: 'Quiz me on my current class level material' },
                      { icon: '📊', text: 'Create an optimal 7-day study plan for my exams' },
                      { icon: '💡', text: 'Give me 3 practice problems with step-by-step solutions' },
                      { icon: '🔍', text: 'Explain the core principles and formulas simply' },
                      { icon: '📋', text: 'How do I take effective study notes using active recall?' },
                    ] : [
                      { icon: '📐', text: 'Explain the quadratic formula with step-by-step examples' },
                      { icon: '💻', text: 'Explain JavaScript closures with a clear code example' },
                      { icon: '🧬', text: 'Explain photosynthesis chemical equation and light reactions' },
                      { icon: '📊', text: 'Create a 5-day study plan using the Pomodoro technique' },
                      { icon: '🔬', text: 'Explain Newton\'s three laws of motion with real-world examples' },
                      { icon: '📝', text: 'How do I write a high-scoring academic essay thesis statement?' },
                    ];
                    return levelPrompts.map((s, i) => (
                      <button key={i} className="chat-suggestion-chip" onClick={() => handleSendChatMessage(null, s.text)}>
                        <span className="chat-suggestion-icon">{s.icon}</span>
                        <span>{s.text}</span>
                      </button>
                    ));
                  })()}
                </div>
              </div>
            )}

            {chatHistory.map((msg, index) => {
              const content = (index === 0 && msg.role === 'assistant' && !msg.content) ? getWelcomeMessage() : msg.content;
              return (
                <div key={index} className={`chat-message ${msg.role}`}>
                  <div className="chat-avatar">
                    {msg.role === 'user' ? '👤' : '✨'}
                  </div>
                  <div className="chat-bubble" style={{ position: 'relative', width: '100%', maxWidth: msg.role === 'user' ? '70%' : '100%' }}>
                    {editingMessageIndex === index ? (
                      <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', width: '100%' }}>
                        <textarea
                          className="input-field"
                          style={{
                            width: '100%',
                            minHeight: '120px',
                            background: 'rgba(0, 0, 0, 0.2)',
                            color: 'var(--text-main)',
                            padding: '12px',
                            borderRadius: '8px',
                            border: '1px solid var(--accent-primary)',
                            fontSize: '0.88rem',
                            fontFamily: 'inherit',
                            resize: 'vertical'
                          }}
                          value={editingMessageText}
                          onChange={(e) => setEditingMessageText(e.target.value)}
                        />
                        <div style={{ display: 'flex', gap: '8px' }}>
                          <button
                            type="button"
                            className="btn btn-primary"
                            onClick={() => handleSaveEditedMessage(index, editingMessageText)}
                            style={{ padding: '6px 14px', fontSize: '0.78rem', height: 'auto' }}
                          >
                            {msg.role === 'user' ? 'Save & Resubmit' : 'Save'}
                          </button>
                          <button
                            type="button"
                            className="btn btn-secondary"
                            onClick={() => setEditingMessageIndex(null)}
                            style={{ padding: '6px 14px', fontSize: '0.78rem', height: 'auto' }}
                          >
                            Cancel
                          </button>
                        </div>
                      </div>
                    ) : (
                      <>
                        <div dangerouslySetInnerHTML={{ __html: renderMarkdown(content) }} />
                        
                        {/* Assistant Message Action Toolbar */}
                        {msg.role === 'assistant' && content && (
                          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '12px', marginTop: '12px', paddingTop: '8px', borderTop: '1px solid var(--border-light)', fontSize: '0.75rem' }}>
                            <button
                              type="button"
                              onClick={() => handleCopyMessageText(content)}
                              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', padding: 0 }}
                            >
                              📋 Copy
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingMessageIndex(index);
                                setEditingMessageText(content);
                              }}
                              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', padding: 0 }}
                            >
                              ✏️ Edit
                            </button>
                            <button
                              type="button"
                              onClick={() => handleReplyToMessage(content)}
                              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', padding: 0 }}
                            >
                              💬 Reply
                            </button>
                            <button
                              type="button"
                              onClick={() => handleGenerateQuizFromChat(content.split('\n')[0])}
                              style={{ background: 'none', border: 'none', color: 'var(--accent-primary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', padding: 0 }}
                            >
                              ❓ Quiz Me On This
                            </button>
                            {content.includes('```js') || content.includes('```javascript') || content.includes('```python') ? (
                              <button
                                type="button"
                                onClick={async () => {
                                  const codeMatch = content.match(/```(?:js|javascript|python)?\n([\s\S]*?)```/);
                                  if (codeMatch) {
                                    const result = await handleExecuteCode(codeMatch[1]);
                                    addToast(result.success ? `Output: ${result.output.substring(0, 200)}` : `Error: ${result.error}`, result.success ? 'success' : 'error');
                                  }
                                }}
                                disabled={executingCode}
                                style={{ background: 'none', border: 'none', color: 'var(--success)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', padding: 0 }}
                              >
                                {executingCode ? '⏳ Running...' : '▶️ Run Code'}
                              </button>
                            ) : null}
                          </div>
                        )}

                        {/* User Message Action Toolbar */}
                        {msg.role === 'user' && (
                          <div style={{ display: 'flex', gap: '12px', marginTop: '8px', paddingTop: '6px', borderTop: '1px solid var(--border-subtle)', fontSize: '0.72rem' }}>
                            <button
                              type="button"
                              onClick={() => handleCopyMessageText(content)}
                              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', padding: 0 }}
                            >
                              📋 Copy
                            </button>
                            <button
                              type="button"
                              onClick={() => {
                                setEditingMessageIndex(index);
                                setEditingMessageText(content);
                              }}
                              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '4px', padding: 0 }}
                            >
                              ✏️ Edit
                            </button>
                          </div>
                        )}
                      </>
                    )}
                  </div>
                </div>
              );
            })}
            {chatLoading && (
              <div className="chat-message assistant">
                <div className="chat-avatar">✨</div>
                <div className="chat-bubble">
                  <div className="typing-indicator">
                    <span className="typing-dot"></span>
                    <span className="typing-dot"></span>
                    <span className="typing-dot"></span>
                  </div>
                </div>
              </div>
            )}
            <div ref={chatEndRef} />
          </div>

          {/* Chat Input */}
          <form className="chat-input-area" onSubmit={handleSendChatMessage}>
            {/* Image Preview */}
            {pendingImage && (
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '6px 10px', background: 'var(--surface-ghost)', borderRadius: '8px', marginBottom: '6px', border: '1px solid var(--border-light)' }}>
                <img
                  src={URL.createObjectURL(pendingImage)}
                  alt="Upload preview"
                  style={{ width: '40px', height: '40px', objectFit: 'cover', borderRadius: '6px' }}
                />
                <span style={{ fontSize: '0.78rem', color: 'var(--text-muted)', flex: 1, overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{pendingImage.name}</span>
                <button type="button" onClick={removePendingImage} style={{ background: 'none', border: 'none', color: 'var(--danger)', cursor: 'pointer', fontSize: '0.85rem' }}>✕</button>
              </div>
            )}
            <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
              {/* File Upload Button */}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileSelect}
                style={{ display: 'none' }}
              />
              <button
                type="button"
                className="btn btn-secondary"
                style={{ padding: '8px 10px', minWidth: 'auto', fontSize: '0.9rem' }}
                onClick={() => fileInputRef.current?.click()}
                title="Attach image"
              >
                📎
              </button>
              <input
                type="text"
                placeholder={pendingImage ? "Ask about this image..." : "Ask Aura anything: e.g. 'Explain closure scope in JavaScript'"}
                className="input-field"
                value={chatMessage}
                onChange={(e) => setChatMessage(e.target.value)}
                disabled={chatLoading}
                style={{ flex: 1 }}
              />
              <button type="submit" className="btn btn-primary" disabled={chatLoading || (!chatMessage.trim() && !pendingImage)}>
                {chatLoading ? '...' : 'Send'}
              </button>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}
