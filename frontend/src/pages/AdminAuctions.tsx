import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAuctions, startAuction, endAuction } from '../api/auctions';
import type { Auction } from '../types';
import { Plus, Edit, Play, Square } from 'lucide-react';

const AdminAuctions: React.FC = () => {
    const [auctions, setAuctions] = useState<Auction[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchAuctions();
    }, []);

    const fetchAuctions = async () => {
        try {
            const data = await getAuctions();
            setAuctions(data);
        } catch (error) {
            console.error('Failed to fetch auctions', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleStart = async (id: string) => {
        if (window.confirm('Are you sure you want to start this auction?')) {
            try {
                await startAuction(id);
                fetchAuctions();
            } catch (error) {
                console.error('Failed to start auction', error);
                alert('Failed to start auction');
            }
        }
    };

    const handleEnd = async (id: string) => {
        if (window.confirm('Are you sure you want to end this auction?')) {
            try {
                await endAuction(id);
                fetchAuctions();
            } catch (error) {
                console.error('Failed to end auction', error);
                alert('Failed to end auction');
            }
        }
    };

    if (isLoading) {
        return <div>Loading auctions...</div>;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl">Auctions</h1>
                <Link to="/admin/auctions/new" className="btn btn-primary">
                    <Plus size={18} />
                    New Auction
                </Link>
            </div>

            <div className="card">
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--color-border)', textAlign: 'left' }}>
                            <th style={{ padding: '1rem' }}>Title</th>
                            <th style={{ padding: '1rem' }}>Status</th>
                            <th style={{ padding: '1rem' }}>Start Time</th>
                            <th style={{ padding: '1rem' }}>Items</th>
                            <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {auctions.map((auction) => (
                            <tr key={auction.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                <td style={{ padding: '1rem' }}>{auction.title}</td>
                                <td style={{ padding: '1rem' }}>
                                    <span style={{
                                        padding: '0.25rem 0.5rem',
                                        borderRadius: 'var(--radius-sm)',
                                        backgroundColor: auction.status === 'ativo' ? 'var(--color-success)' : 'var(--color-surface)',
                                        color: auction.status === 'ativo' ? 'white' : 'var(--color-text-muted)',
                                        border: auction.status === 'ativo' ? 'none' : '1px solid var(--color-border)'
                                    }}>
                                        {auction.status}
                                    </span>
                                </td>
                                <td style={{ padding: '1rem' }}>{new Date(auction.startDate).toLocaleString()}</td>
                                <td style={{ padding: '1rem' }}>{auction.items?.length || 0}</td>
                                <td style={{ padding: '1rem', textAlign: 'right' }}>
                                    <div className="flex justify-end gap-2">
                                        {auction.status === 'agendado' && (
                                            <button
                                                onClick={() => handleStart(auction.id)}
                                                className="btn btn-success"
                                                style={{ padding: '0.25rem 0.5rem', backgroundColor: 'var(--color-success)', color: 'white' }}
                                                title="Start Auction"
                                            >
                                                <Play size={16} />
                                            </button>
                                        )}
                                        {auction.status === 'ativo' && (
                                            <button
                                                onClick={() => handleEnd(auction.id)}
                                                className="btn btn-danger"
                                                style={{ padding: '0.25rem 0.5rem' }}
                                                title="End Auction"
                                            >
                                                <Square size={16} />
                                            </button>
                                        )}
                                        <Link to={`/admin/auctions/${auction.id}/edit`} className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem' }}>
                                            <Edit size={16} />
                                        </Link>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {auctions.length === 0 && (
                            <tr>
                                <td colSpan={5} className="text-center" style={{ padding: '2rem' }}>No auctions found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminAuctions;
