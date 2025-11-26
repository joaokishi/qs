import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createAuction, getAuction, updateAuction } from '../api/auctions';
import { getItems } from '../api/items';
import type { Item } from '../types';

const AdminAuctionForm: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [startTime, setStartTime] = useState('');
    const [selectedItemIds, setSelectedItemIds] = useState<string[]>([]);

    const [items, setItems] = useState<Item[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchItems();
        if (id) {
            fetchAuction(id);
        }
    }, [id]);

    const fetchItems = async () => {
        try {
            const data = await getItems();
            setItems(data);
        } catch (err) {
            console.error('Failed to fetch items');
        }
    };

    const fetchAuction = async (auctionId: string) => {
        setIsLoading(true);
        try {
            const data = await getAuction(auctionId);
            setTitle(data.title);
            // Format dates for datetime-local input (YYYY-MM-DDThh:mm)
            setStartTime(new Date(data.startDate).toISOString().slice(0, 16));
            setSelectedItemIds(data.items.map(i => i.id));
        } catch (err) {
            setError('Failed to fetch auction details');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            const start = new Date(startTime);
            const now = new Date();
            const thirtyMinutesFromNow = new Date(now.getTime() + 30 * 60000);

            if (start < thirtyMinutesFromNow) {
                setError('Start time must be at least 30 minutes from now');
                setIsLoading(false);
                return;
            }

            const auctionData = {
                title,
                startDate: start.toISOString(),
                itemIds: selectedItemIds,
            };

            if (id) {
                await updateAuction(id, auctionData);
            } else {
                await createAuction(auctionData);
            }
            navigate('/admin/auctions');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to save auction');
            setIsLoading(false);
        }
    };

    const toggleItemSelection = (itemId: string) => {
        if (selectedItemIds.includes(itemId)) {
            setSelectedItemIds(selectedItemIds.filter(id => id !== itemId));
        } else {
            setSelectedItemIds([...selectedItemIds, itemId]);
        }
    };

    if (isLoading && id && !title) {
        return <div>Loading...</div>;
    }

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h1 className="text-2xl mb-6">{id ? 'Edit Auction' : 'New Auction'}</h1>

            <div className="card">
                {error && <div className="mb-4" style={{ color: 'var(--color-danger)' }}>{error}</div>}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="input-group">
                        <label className="label">Title</label>
                        <input
                            type="text"
                            className="input"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
                            required
                        />
                    </div>

                    <div className="flex gap-4">
                        <div className="input-group flex-1">
                            <label className="label">
                                Start Date & Time
                                <span style={{ fontSize: '0.875rem', color: 'var(--color-text-muted)', fontWeight: 'normal', marginLeft: '0.5rem' }}>
                                    (Click to open calendar)
                                </span>
                            </label>
                            <input
                                type="datetime-local"
                                className="input"
                                value={startTime}
                                onChange={(e) => setStartTime(e.target.value)}
                                min={(() => {
                                    const now = new Date();
                                    const thirtyMinutesFromNow = new Date(now.getTime() + 30 * 60000);
                                    const offset = thirtyMinutesFromNow.getTimezoneOffset();
                                    const localThirtyMinutesFromNow = new Date(thirtyMinutesFromNow.getTime() - (offset * 60000));
                                    return localThirtyMinutesFromNow.toISOString().slice(0, 16);
                                })()}
                                required
                                style={{ cursor: 'pointer' }}
                            />
                        </div>
                    </div>

                    <div className="input-group">
                        <label className="label">Select Items</label>
                        <div style={{
                            border: '1px solid var(--color-border)',
                            borderRadius: 'var(--radius-md)',
                            padding: '1rem',
                            maxHeight: '300px',
                            overflowY: 'auto',
                            display: 'grid',
                            gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))',
                            gap: '1rem'
                        }}>
                            {items.map(item => (
                                <div
                                    key={item.id}
                                    onClick={() => toggleItemSelection(item.id)}
                                    style={{
                                        padding: '0.5rem',
                                        border: `1px solid ${selectedItemIds.includes(item.id) ? 'var(--color-accent)' : 'var(--color-border)'}`,
                                        borderRadius: 'var(--radius-sm)',
                                        cursor: 'pointer',
                                        backgroundColor: selectedItemIds.includes(item.id) ? 'rgba(251, 191, 36, 0.1)' : 'transparent',
                                        display: 'flex',
                                        alignItems: 'center',
                                        gap: '0.5rem'
                                    }}
                                >
                                    <input
                                        type="checkbox"
                                        checked={selectedItemIds.includes(item.id)}
                                        readOnly
                                        style={{ pointerEvents: 'none' }}
                                    />
                                    <div style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
                                        {item.name}
                                    </div>
                                </div>
                            ))}
                            {items.length === 0 && <div className="text-muted">No items available</div>}
                        </div>
                    </div>

                    <div className="flex gap-4 mt-4">
                        <button
                            type="button"
                            className="btn btn-secondary flex-1"
                            onClick={() => navigate('/admin/auctions')}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary flex-1"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Saving...' : 'Save Auction'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminAuctionForm;
