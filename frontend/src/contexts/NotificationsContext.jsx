import React, { createContext, useContext, useState, useCallback } from 'react';

const NotificationsContext = createContext(null);

export function NotificationsProvider({ children }) {
  const [notes, setNotes] = useState([]);

  const add = useCallback((message, opts = {}) => {
    const id = Date.now() + Math.random();
    const note = { id, message, type: opts.type || 'info', timeout: opts.timeout || 4000 };
    setNotes(n => [note, ...n]);
    if (note.timeout > 0) {
      setTimeout(() => {
        setNotes(n => n.filter(x => x.id !== id));
      }, note.timeout);
    }
    return id;
  }, []);

  const remove = useCallback((id) => setNotes(n => n.filter(x => x.id !== id)), []);

  return (
    <NotificationsContext.Provider value={{ notes, add, remove }}>
      {children}
      <div className="toast-container" aria-live="polite">
        {notes.map(n => (
          <div key={n.id} className={`toast toast-${n.type}`}>
            <div className="toast-message">{n.message}</div>
            <button className="toast-close" onClick={() => remove(n.id)}>×</button>
          </div>
        ))}
      </div>
    </NotificationsContext.Provider>
  );
}

export function useNotifications() {
  const ctx = useContext(NotificationsContext);
  if (!ctx) throw new Error('useNotifications must be used within NotificationsProvider');
  return ctx;
}

export default NotificationsContext;
