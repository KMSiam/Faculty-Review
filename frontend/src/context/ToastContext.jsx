import React, { createContext, useContext, useState, useCallback } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

const ToastContext = createContext();

export const useToast = () => useContext(ToastContext);

export const ToastProvider = ({ children }) => {
    const [toasts, setToasts] = useState([]);

    const addToast = useCallback((message, type = 'success') => {
        const id = Math.random().toString(36).substr(2, 9);
        setToasts((prev) => [...prev, { id, message, type }]);
        setTimeout(() => {
            setToasts((prev) => prev.filter((t) => t.id !== id));
        }, 3000);
    }, []);

    const removeToast = (id) => {
        setToasts((prev) => prev.filter((t) => t.id !== id));
    };

    return (
        <ToastContext.Provider value={{ addToast }}>
            {children}
            <div className="fixed bottom-4 right-4 z-[9999] flex flex-col gap-2">
                {toasts.map((toast) => (
                    <div
                        key={toast.id}
                        className={`
                            flex items-center gap-3 px-4 py-3 rounded-xl shadow-2xl border
                            animate-slide-up transition-all duration-300
                            ${toast.type === 'success' ? 'bg-green-900/40 border-green-500/50 text-green-100' : ''}
                            ${toast.type === 'error' ? 'bg-red-900/40 border-red-500/50 text-red-100' : ''}
                            ${toast.type === 'info' ? 'bg-primary-900/40 border-primary-500/50 text-primary-100' : ''}
                            backdrop-blur-md
                        `}
                    >
                        {toast.type === 'success' && <CheckCircle className="w-5 h-5 text-green-400" />}
                        {toast.type === 'error' && <AlertCircle className="w-5 h-5 text-red-400" />}
                        {toast.type === 'info' && <Info className="w-5 h-5 text-primary-400" />}

                        <p className="text-sm font-medium">{toast.message}</p>

                        <button
                            onClick={() => removeToast(toast.id)}
                            className="ml-2 p-1 hover:bg-white/10 rounded-full transition-colors"
                        >
                            <X className="w-4 h-4" />
                        </button>
                    </div>
                ))}
            </div>
        </ToastContext.Provider>
    );
};
