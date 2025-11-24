import React, { useState } from 'react';
import { placeBid } from '../api/bids';

interface BidControlsProps {
    itemId: string;
    currentPrice: number;
    minimumIncrement: number;
    onBidSuccess?: () => void;
}

const BidControls: React.FC<BidControlsProps> = ({ itemId, currentPrice, minimumIncrement, onBidSuccess }) => {
    const [customAmount, setCustomAmount] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    const minBid = currentPrice + minimumIncrement;

    const handleBid = async (amount: number) => {
        setIsLoading(true);
        setError('');
        try {
            await placeBid(itemId, amount);
            setCustomAmount('');
            if (onBidSuccess) onBidSuccess();
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to place bid');
        } finally {
            setIsLoading(false);
        }
    };

    const handleQuickBid = () => {
        handleBid(minBid);
    };

    const handleCustomBid = (e: React.FormEvent) => {
        e.preventDefault();
        const amount = parseFloat(customAmount);
        if (amount < minBid) {
            setError(`Bid must be at least $${minBid.toLocaleString()}`);
            return;
        }
        handleBid(amount);
    };

    return (
        <div className="card mt-4">
            <h3 className="text-xl mb-4">Place a Bid</h3>
            {error && <div className="mb-4" style={{ color: 'var(--color-danger)' }}>{error}</div>}

            <div className="flex flex-col gap-4">
                <button
                    onClick={handleQuickBid}
                    className="btn btn-primary btn-full"
                    disabled={isLoading}
                >
                    Quick Bid ${minBid.toLocaleString()}
                </button>

                <div className="flex items-center gap-2 my-2 text-muted">
                    <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--color-border)' }}></div>
                    <span>OR</span>
                    <div style={{ flex: 1, height: '1px', backgroundColor: 'var(--color-border)' }}></div>
                </div>

                <form onSubmit={handleCustomBid} className="flex gap-2">
                    <div className="input-group flex-1" style={{ marginBottom: 0 }}>
                        <input
                            type="number"
                            className="input"
                            placeholder={`Min $${minBid}`}
                            value={customAmount}
                            onChange={(e) => setCustomAmount(e.target.value)}
                            min={minBid}
                            step="0.01"
                            required
                        />
                    </div>
                    <button
                        type="submit"
                        className="btn btn-secondary"
                        disabled={isLoading}
                    >
                        Bid
                    </button>
                </form>
            </div>
        </div>
    );
};

export default BidControls;
