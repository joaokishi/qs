import React, { useEffect, useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { getMyBids } from '../api/bids';
import type { Bid } from '../types';
import { User, Clock, DollarSign } from 'lucide-react';

const Profile: React.FC = () => {
    const { user } = useAuth();
    const [bids, setBids] = useState<Bid[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchBids();
    }, []);

    const fetchBids = async () => {
        try {
            const data = await getMyBids();
            setBids(data);
        } catch (error) {
            console.error('Failed to fetch bids', error);
        } finally {
            setIsLoading(false);
        }
    };

    if (!user) return null;

    return (
        <div className="max-w-4xl mx-auto">
            <h1 className="text-2xl mb-6">My Account</h1>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {/* User Info Card */}
                <div className="card h-fit">
                    <div className="flex flex-col items-center text-center">
                        <div className="w-24 h-24 rounded-full bg-gray-700 flex items-center justify-center mb-4">
                            <User size={48} />
                        </div>
                        <h2 className="text-xl font-bold">{user.name}</h2>
                        <p className="text-muted">{user.email}</p>
                        <div className="mt-4 badge badge-primary">{user.role}</div>
                    </div>
                </div>

                {/* Bid History */}
                <div className="md:col-span-2 space-y-6">
                    <h2 className="text-xl font-bold flex items-center gap-2">
                        <Clock size={20} />
                        Bid History
                    </h2>

                    {isLoading ? (
                        <div>Loading history...</div>
                    ) : (
                        <div className="space-y-4">
                            {bids.map((bid) => (
                                <div key={bid.id} className="card flex justify-between items-center">
                                    <div>
                                        <h3 className="font-bold">{bid.item?.title || 'Unknown Item'}</h3>
                                        <p className="text-sm text-muted">{new Date(bid.createdAt).toLocaleString()}</p>
                                    </div>
                                    <div className="text-right">
                                        <div className="text-xl font-bold text-accent flex items-center justify-end gap-1">
                                            <DollarSign size={16} />
                                            {bid.amount.toLocaleString()}
                                        </div>
                                    </div>
                                </div>
                            ))}
                            {bids.length === 0 && (
                                <div className="text-center text-muted py-8 card">
                                    No bids placed yet.
                                </div>
                            )}
                        </div>
                    )}
                </div>
            </div>
        </div>
    );
};

export default Profile;
