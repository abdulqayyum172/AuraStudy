import React from 'react';

const PRIORITY_COLORS = {
  high: 'var(--danger)',
  medium: 'var(--accent-primary)',
  low: 'var(--text-muted)',
};

function TaskCard({ task, updateTaskStatus, handleDeleteTask }) {
  const isOverdue = task.dueDate && new Date(task.dueDate) < new Date() && task.status !== 'completed';

  return (
    <div className="card" style={{ padding: '14px', borderLeft: `3px solid ${PRIORITY_COLORS[task.priority] || 'var(--border-light)'}` }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '6px' }}>
        <h4 style={{ fontSize: '0.9rem', fontWeight: 600, margin: 0, flex: 1 }}>{task.title}</h4>
        <button
          className="btn btn-danger"
          style={{ padding: '2px 8px', fontSize: '0.7rem' }}
          onClick={() => handleDeleteTask(task.id)}
        >
          ✕
        </button>
      </div>
      {task.description && (
        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)', margin: '0 0 8px', lineHeight: 1.5 }}>
          {task.description}
        </p>
      )}
      <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap', marginBottom: '8px' }}>
        <span className={`badge badge-${task.priority === 'high' ? 'red' : task.priority === 'low' ? 'gray' : 'purple'}`} style={{ fontSize: '0.7rem' }}>
          {task.priority}
        </span>
        {task.estimatedPomodoros > 0 && (
          <span style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
            🍅 {task.completedPomodoros || 0}/{task.estimatedPomodoros}
          </span>
        )}
        {task.dueDate && (
          <span style={{ fontSize: '0.7rem', color: isOverdue ? 'var(--danger)' : 'var(--text-muted)' }}>
            📅 {new Date(task.dueDate).toLocaleDateString()}
          </span>
        )}
      </div>
      <div style={{ display: 'flex', gap: '6px' }}>
        {task.status !== 'todo' && (
          <button
            className="btn btn-secondary"
            style={{ padding: '4px 10px', fontSize: '0.7rem' }}
            onClick={() => updateTaskStatus(task.id, task.status === 'completed' ? 'in_progress' : 'todo')}
          >
            ← Back
          </button>
        )}
        {task.status === 'todo' && (
          <button
            className="btn btn-primary"
            style={{ padding: '4px 10px', fontSize: '0.7rem' }}
            onClick={() => updateTaskStatus(task.id, 'in_progress')}
          >
            Start →
          </button>
        )}
        {task.status === 'in_progress' && (
          <button
            className="btn btn-primary"
            style={{ padding: '4px 10px', fontSize: '0.7rem' }}
            onClick={() => updateTaskStatus(task.id, 'completed')}
          >
            ✓ Done
          </button>
        )}
      </div>
    </div>
  );
}

export default function PlannerTab({
  currentUser,
  tasks,
  showTaskModal,
  setShowTaskModal,
  newTaskTitle,
  setNewTaskTitle,
  newTaskDesc,
  setNewTaskDesc,
  newTaskPriority,
  setNewTaskPriority,
  newTaskDueDate,
  setNewTaskDueDate,
  newTaskEstPomos,
  setNewTaskEstPomos,
  handleCreateTask,
  updateTaskStatus,
  handleDeleteTask,
}) {
  const todoTasks = tasks.filter(t => t.status === 'todo');
  const inProgressTasks = tasks.filter(t => t.status === 'in_progress');
  const completedTasks = tasks.filter(t => t.status === 'completed');

  const columns = [
    { key: 'todo', title: 'To Do', tasks: todoTasks, color: 'var(--text-muted)' },
    { key: 'in_progress', title: 'In Progress', tasks: inProgressTasks, color: 'var(--accent-primary)' },
    { key: 'completed', title: 'Completed', tasks: completedTasks, color: 'var(--success)' },
  ];

  return (
    <>
      <div className="tab-panel">
        <div className="page-header">
          <div className="page-title">
            <h1>Study Planner</h1>
            <p>{currentUser?.classLevel ? `${currentUser.classLevel} task board` : 'Organize your tasks and stay on track.'}</p>
          </div>
          <button className="btn btn-primary" onClick={() => setShowTaskModal(true)}>
            ➕ New Task
          </button>
        </div>

        {/* Stats */}
        <div className="stats-grid" style={{ marginBottom: '28px' }}>
          <div className="card stat-card" style={{ padding: '16px' }}>
            <div className="stat-icon" style={{ color: 'var(--text-muted)' }}>📋</div>
            <div className="stat-info">
              <h3>{todoTasks.length}</h3>
              <p>To Do</p>
            </div>
          </div>
          <div className="card stat-card" style={{ padding: '16px' }}>
            <div className="stat-icon" style={{ color: 'var(--accent-primary)' }}>⏳</div>
            <div className="stat-info">
              <h3>{inProgressTasks.length}</h3>
              <p>In Progress</p>
            </div>
          </div>
          <div className="card stat-card" style={{ padding: '16px' }}>
            <div className="stat-icon" style={{ color: 'var(--success)' }}>✅</div>
            <div className="stat-info">
              <h3>{completedTasks.length}</h3>
              <p>Completed</p>
            </div>
          </div>
        </div>

        {/* Kanban Board */}
        {tasks.length === 0 ? (
          <div className="card" style={{ textAlign: 'center', padding: '48px' }}>
            <h3 style={{ marginBottom: '10px' }}>No tasks yet</h3>
            <p style={{ color: 'var(--text-muted)', marginBottom: '20px' }}>Create your first study task to start planning.</p>
            <button className="btn btn-primary" onClick={() => setShowTaskModal(true)}>Create Task</button>
          </div>
        ) : (
          <div className="grid-3" style={{ alignItems: 'flex-start' }}>
            {columns.map(col => (
              <div key={col.key}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '14px' }}>
                  <div style={{ width: '10px', height: '10px', borderRadius: '50%', background: col.color }}></div>
                  <h3 style={{ fontSize: '0.9rem', fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
                    {col.title}
                  </h3>
                  <span className="badge badge-gray" style={{ fontSize: '0.7rem' }}>{col.tasks.length}</span>
                </div>
                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
                  {col.tasks.length === 0 ? (
                    <div style={{ padding: '24px', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.82rem', border: '1px dashed var(--border-light)', borderRadius: '12px' }}>
                      No tasks
                    </div>
                  ) : (
                    col.tasks.map(task => (
                      <TaskCard
                        key={task.id}
                        task={task}
                        updateTaskStatus={updateTaskStatus}
                        handleDeleteTask={handleDeleteTask}
                      />
                    ))
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Create Task Modal */}
      {showTaskModal && (
        <div className="modal-overlay" onClick={() => setShowTaskModal(false)}>
          <div className="modal-content" onClick={(e) => e.stopPropagation()}>
            <h2 style={{ marginBottom: '20px' }}>Create Study Task</h2>
            <form onSubmit={handleCreateTask}>
              <div className="input-group">
                <label htmlFor="taskTitle">Task Name</label>
                <input
                  id="taskTitle"
                  type="text"
                  className="input-field"
                  placeholder="e.g. Read Chapter 4 of Science Textbook"
                  value={newTaskTitle}
                  onChange={(e) => setNewTaskTitle(e.target.value)}
                  required
                />
              </div>
              <div className="input-group">
                <label htmlFor="taskDesc">Description</label>
                <textarea
                  id="taskDesc"
                  className="input-field"
                  placeholder="What details are involved in this task?"
                  value={newTaskDesc}
                  onChange={(e) => setNewTaskDesc(e.target.value)}
                />
              </div>
              <div className="grid-2" style={{ gap: '12px', marginBottom: '16px' }}>
                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label htmlFor="taskPriority">Priority</label>
                  <select id="taskPriority" className="input-field" value={newTaskPriority} onChange={(e) => setNewTaskPriority(e.target.value)}>
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                  </select>
                </div>
                <div className="input-group" style={{ marginBottom: 0 }}>
                  <label htmlFor="taskPomos">Est. Pomodoros</label>
                  <input
                    id="taskPomos"
                    type="number"
                    min="1"
                    max="10"
                    className="input-field"
                    value={newTaskEstPomos}
                    onChange={(e) => setNewTaskEstPomos(e.target.value)}
                  />
                </div>
              </div>
              <div className="input-group">
                <label htmlFor="taskDue">Due Date</label>
                <input
                  id="taskDue"
                  type="date"
                  className="input-field"
                  value={newTaskDueDate}
                  onChange={(e) => setNewTaskDueDate(e.target.value)}
                />
              </div>
              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '12px', marginTop: '24px' }}>
                <button type="button" className="btn btn-secondary" onClick={() => setShowTaskModal(false)}>Cancel</button>
                <button type="submit" className="btn btn-primary">Create Task</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </>
  );
}
