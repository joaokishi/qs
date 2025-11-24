import React, { useEffect, useState } from 'react';
import { Clock } from 'lucide-react';

interface TimerProps {
    endTime: string;
    onEnd?: () => void;
}

const Timer: React.FC<TimerProps> = ({ endTime, onEnd }) => {
    const [timeLeft, setTimeLeft] = useState(0);
    const [isUrgent, setIsUrgent] = useState(false);

    useEffect(() => {
        const calculateTimeLeft = () => {
            const end = new Date(endTime).getTime();
            const now = new Date().getTime();
            const diff = end - now;

            if (diff <= 0) {
                setTimeLeft(0);
                if (onEnd) onEnd();
                return 0;
            }

            // Check for urgency (less than 15 seconds)
            if (diff <= 15000) {
                setIsUrgent(true);
            } else {
                setIsUrgent(false);
            }

            return diff;
        };

        calculateTimeLeft(); // Initial calculation

        const timer = setInterval(() => {
            const diff = calculateTimeLeft();
            setTimeLeft(diff);
            if (diff <= 0) {
                clearInterval(timer);
            }
        }, 1000);

        return () => clearInterval(timer);
    }, [endTime, onEnd]);

    const formatTime = (ms: number) => {
        const seconds = Math.floor((ms / 1000) % 60);
        const minutes = Math.floor((ms / 1000 / 60) % 60);
        const hours = Math.floor((ms / 1000 / 60 / 60) % 24);
        const days = Math.floor(ms / 1000 / 60 / 60 / 24);

        if (days > 0) return `${days}d ${hours}h ${minutes}m ${seconds}s`;
        if (hours > 0) return `${hours}h ${minutes}m ${seconds}s`;
        return `${minutes}m ${seconds}s`;
    };

    return (
        <div className={`flex items-center gap-2 font-mono text-xl ${isUrgent ? 'text-danger' : 'text-accent'}`} style={{ color: isUrgent ? 'var(--color-danger)' : 'var(--color-accent)', fontWeight: 'bold' }}>
            <Clock size={20} />
            <span>{formatTime(timeLeft)}</span>
        </div>
    );
};

export default Timer;
