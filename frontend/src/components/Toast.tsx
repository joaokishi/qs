import React, { useEffect } from 'react';
import { X, CheckCircle, AlertCircle, Info } from 'lucide-react';

export type ToastType = 'success' | 'error' | 'info';

export interface ToastMessage {
    id: string;
    type: ToastType;
    message: string;
}

interface ToastProps {
    toast: ToastMessage;
    onClose: (id: string) => void;
}

const Toast: React.FC<ToastProps> = ({ toast, onClose }) => {
    useEffect(() => {
        const timer = setTimeout(() => {
            onClose(toast.id);
        }, 5000);

        return () => clearTimeout(timer);
    }, [toast.id, onClose]);

    const getIcon = () => {
        switch (toast.type) {
            case 'success': return <CheckCircle size={20} />;
            case 'error': return <AlertCircle size={20} />;
            case 'info': return <Info size={20} />;
        }
    };

    const getStyles = () => {
        switch (toast.type) {
            case 'success': return { backgroundColor: 'var(--color-success)', color: 'white' };
            case 'error': return { backgroundColor: 'var(--color-danger)', color: 'white' };
            case 'info': return { backgroundColor: 'var(--color-accent)', color: 'var(--color-background)' };
        }
    };

    return (
        <div
            className="flex items-center gap-3 p-4 rounded shadow-lg animate-in slide-in-from-right fade-in duration-300"
            style={{
                ...getStyles(),
                minWidth: '300px',
                maxWidth: '400px',
                boxShadow: '0 4px 12px rgba(0,0,0,0.3)',
                marginBottom: '1rem'
            }}
        >
            {getIcon()}
            <p className="flex-1 text-sm font-medium">{toast.message}</p>
            <button onClick={() => onClose(toast.id)} className="hover:opacity-80">
                <X size={18} />
            </button>
        </div>
    );
};

export default Toast;
