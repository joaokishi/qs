import React, { createContext, useContext, useState, useCallback, useEffect } from 'react';
import Toast from '../components/Toast';
import type { ToastMessage, ToastType } from '../components/Toast';
import { useSocket } from './SocketContext';

interface NotificationContextType {
    showToast: (message: string, type?: ToastType) => void;
}

const NotificationContext = createContext<NotificationContextType | undefined>(undefined);

export const NotificationProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
    const [toasts, setToasts] = useState<ToastMessage[]>([]);
    const { socket } = useSocket();

    const showToast = useCallback((message: string, type: ToastType = 'info') => {
        const id = Math.random().toString(36).substring(2, 9);
        setToasts(prev => [...prev, { id, message, type }]);
    }, []);

    const removeToast = useCallback((id: string) => {
        setToasts(prev => prev.filter(t => t.id !== id));
    }, []);

    useEffect(() => {
        if (socket) {
            socket.on('notification', (data: { message: string }) => {
                showToast(data.message, 'info');
            });

            socket.on('auction:ended', () => {
                showToast('An auction has ended!', 'info');
            });

            socket.on('bid:outbid', () => {
                showToast('You have been outbid!', 'error');
            });

            socket.on('auction:won', (data: { amount: number }) => {
                showToast(`Congratulations! You won an item for $${data.amount}`, 'success');
            });

            return () => {
                socket.off('notification');
                socket.off('auction:ended');
                socket.off('bid:outbid');
                socket.off('auction:won');
            };
        }
    }, [socket, showToast]);

    return (
        <NotificationContext.Provider value={{ showToast }}>
            {children}
            <div style={{
                position: 'fixed',
                bottom: '20px',
                right: '20px',
                zIndex: 9999,
                display: 'flex',
                flexDirection: 'column-reverse'
            }}>
                {toasts.map(toast => (
                    <Toast key={toast.id} toast={toast} onClose={removeToast} />
                ))}
            </div>
        </NotificationContext.Provider>
    );
};

export const useNotification = () => {
    const context = useContext(NotificationContext);
    if (context === undefined) {
        throw new Error('useNotification must be used within a NotificationProvider');
    }
    return context;
};
