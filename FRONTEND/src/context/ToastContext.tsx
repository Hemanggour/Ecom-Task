import React, { createContext, useContext, useState, useCallback, type ReactNode } from 'react';
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from 'lucide-react';

type ToastType = 'success' | 'error' | 'info' | 'warning';

interface Toast {
  id: string;
  message: string;
  type: ToastType;
}

interface ToastContextType {
  showToast: (message: string, type?: ToastType) => void;
}

const ToastContext = createContext<ToastContextType | undefined>(undefined);

export const ToastProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [toasts, setToasts] = useState<Toast[]>([]);

  const showToast = useCallback((message: string, type: ToastType = 'info') => {
    const id = Math.random().toString(36).substr(2, 9);
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => {
      setToasts((prev) => prev.filter((t) => t.id !== id));
    }, 5000);
  }, []);

  const removeToast = (id: string) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <ToastContext.Provider value={{ showToast }}>
      {children}
      <div className="fixed bottom-8 right-8 z-[100] flex flex-col gap-4 max-w-md w-full pointer-events-none">
        {toasts.map((toast) => (
          <div 
            key={toast.id} 
            className={`pointer-events-auto flex items-center gap-4 p-4 rounded-2xl shadow-2xl border-l-4 animate-slide-in-right ${
              toast.type === 'success' ? 'bg-card border-success text-success' :
              toast.type === 'error' ? 'bg-card border-danger text-danger' :
              toast.type === 'warning' ? 'bg-card border-warning text-warning' :
              'bg-card border-primary text-primary'
            }`}
          >
            <div className="flex-shrink-0">
              {toast.type === 'success' && <CheckCircle size={24} />}
              {toast.type === 'error' && <AlertCircle size={24} />}
              {toast.type === 'warning' && <AlertTriangle size={24} />}
              {toast.type === 'info' && <Info size={24} />}
            </div>
            <p className="flex-grow font-bold text-sm text-main">{toast.message}</p>
            <button 
              onClick={() => removeToast(toast.id)}
              className="p-1 hover:bg-main/10 rounded-full transition text-muted"
            >
              <X size={18} />
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};
