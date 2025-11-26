import React, { useEffect, useState } from 'react';
import { getMyBids } from '../api/bids';
import type { Bid } from '../types';
import { Link } from 'react-router-dom';
import { Gavel, Clock, ArrowRight } from 'lucide-react';

interface BidGroup {
    item: Bid['item'];
    myLatestBid: Bid;
    allMyBids: Bid[];
    status: 'winning' | 'outbid' | 'won' | 'lost' | 'cancelled';
}

const MyBids: React.FC = () => {
    const [bidGroups, setBidGroups] = useState<BidGroup[]>([]);
    const [isLoading, setIsLoading] = useState(true);
    const [filter, setFilter] = useState<'all' | 'active' | 'won' | 'lost'>('all');

    useEffect(() => {
        const fetchBids = async () => {
            try {
                const bids = await getMyBids();

                // Group bids by item
                const groups: { [key: string]: BidGroup } = {};

                bids.forEach(bid => {
                    if (!groups[bid.itemId]) {
                        groups[bid.itemId] = {
                            item: bid.item,
                            myLatestBid: bid,
                            allMyBids: [],
                            status: 'outbid' // Default
                        };
                    }
                    groups[bid.itemId].allMyBids.push(bid);

                    // Update latest bid if this one is newer
                    if (new Date(bid.createdAt) > new Date(groups[bid.itemId].myLatestBid.createdAt)) {
                        groups[bid.itemId].myLatestBid = bid;
                    }
                });

                // Determine status for each group
                Object.values(groups).forEach(group => {
                    const auction = group.item?.auction;
                    const latestBid = group.myLatestBid;

                    if (latestBid.status === 'cancelado') {
                        group.status = 'cancelled';
                    } else if (auction?.status === 'ativo') {
                        if (latestBid.status === 'vencedor') {
                            group.status = 'winning';
                        } else {
                            group.status = 'outbid';
                        }
                    } else if (auction?.status === 'concluido') {
                        if (latestBid.status === 'arrematado' || latestBid.status === 'vencedor') {
                            group.status = 'won';
                        } else {
                            group.status = 'lost';
                        }
                    } else {
                        // Fallback
                        if (latestBid.status === 'vencedor') {
                            group.status = 'winning';
                        } else {
                            group.status = 'outbid';
                        }
                    }
                });

                // Sort by date (newest activity first)
                const sortedGroups = Object.values(groups).sort((a, b) =>
                    new Date(b.myLatestBid.createdAt).getTime() - new Date(a.myLatestBid.createdAt).getTime()
                );

                setBidGroups(sortedGroups);
            } catch (error) {
                console.error('Failed to fetch bids', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchBids();
    }, []);

    const filteredGroups = bidGroups.filter(group => {
        if (filter === 'all') return true;
        if (filter === 'active') return group.status === 'winning' || group.status === 'outbid';
        if (filter === 'won') return group.status === 'won';
        if (filter === 'lost') return group.status === 'lost';
        return true;
    });

    if (isLoading) {
        return <div className="text-center mt-8">Loading your bids...</div>;
    }

    return (
        <div className="container mx-auto px-4 py-8">
            <div className="mb-8">
                <h1 className="text-2xl font-bold mb-2">My Bids</h1>
                <p className="text-muted">Track your active bids and auction history</p>
            </div>

            {/* Filters */}
            <div className="flex gap-4 mb-6 overflow-x-auto pb-2">
                <button
                    onClick={() => setFilter('all')}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filter === 'all'
                        ? 'bg-accent text-white'
                        : 'bg-surface border border-border hover:bg-surface-hover'
                        }`}
                >
                    All Bids
                </button>
                <button
                    onClick={() => setFilter('active')}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filter === 'active'
                        ? 'bg-accent text-white'
                        : 'bg-surface border border-border hover:bg-surface-hover'
                        }`}
                >
                    Active
                </button>
                <button
                    onClick={() => setFilter('won')}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filter === 'won'
                        ? 'bg-accent text-white'
                        : 'bg-surface border border-border hover:bg-surface-hover'
                        }`}
                >
                    Won
                </button>
                <button
                    onClick={() => setFilter('lost')}
                    className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${filter === 'lost'
                        ? 'bg-accent text-white'
                        : 'bg-surface border border-border hover:bg-surface-hover'
                        }`}
                >
                    Lost
                </button>
            </div>

            {/* Bids List */}
            <div className="space-y-4">
                {filteredGroups.length === 0 ? (
                    <div className="text-center py-12 bg-surface rounded-lg border border-border">
                        <Gavel className="mx-auto h-12 w-12 text-muted mb-4" />
                        <h3 className="text-lg font-medium mb-2">No bids found</h3>
                        <p className="text-muted mb-4">You haven't placed any bids in this category yet.</p>
                        <Link to="/auctions" className="btn btn-primary">
                            Browse Auctions
                        </Link>
                    </div>
                ) : (
                    filteredGroups.map((group) => (
                        <div key={group.item?.id} className="card p-6 transition-all hover:shadow-md">
                            <div className="flex flex-col md:flex-row gap-6 items-start md:items-center justify-between">
                                {/* Item Info */}
                                <div className="flex-1">
                                    <div className="flex items-center gap-2 mb-2">
                                        <span className={`px-2 py-1 rounded-full text-xs font-bold uppercase ${group.status === 'winning' ? 'bg-green-100 text-green-700' :
                                            group.status === 'outbid' ? 'bg-red-100 text-red-700' :
                                                group.status === 'won' ? 'bg-green-100 text-green-700' :
                                                    group.status === 'lost' ? 'bg-gray-100 text-gray-700' :
                                                        'bg-gray-100 text-gray-700'
                                            }`}>
                                            {group.status === 'winning' && 'Winning'}
                                            {group.status === 'outbid' && 'Outbid'}
                                            {group.status === 'won' && 'Won'}
                                            {group.status === 'lost' && 'Lost'}
                                            {group.status === 'cancelled' && 'Cancelled'}
                                        </span>
                                        <span className="text-sm text-muted flex items-center gap-1">
                                            <Clock size={14} />
                                            {new Date(group.myLatestBid.createdAt).toLocaleDateString()}
                                        </span>
                                    </div>
                                    <h3 className="text-xl font-bold mb-1">{group.item?.name}</h3>
                                    <p className="text-sm text-muted mb-2">{group.item?.description?.substring(0, 100)}...</p>
                                    <div className="flex items-center gap-4 text-sm">
                                        <div>
                                            <span className="text-muted">My Bid: </span>
                                            <span className="font-bold">${Number(group.myLatestBid.amount).toLocaleString()}</span>
                                        </div>
                                        <div>
                                            <span className="text-muted">Current Price: </span>
                                            <span className="font-bold">${Number(group.item?.currentValue).toLocaleString()}</span>
                                        </div>
                                    </div>
                                </div>

                                {/* Actions */}
                                <div className="flex flex-col gap-2 min-w-[150px]">
                                    {group.item?.auction?.status === 'ativo' && (
                                        <Link
                                            to={`/auction/${group.item.auction.id}`}
                                            className="btn btn-primary flex items-center justify-center gap-2"
                                        >
                                            {group.status === 'outbid' ? 'Bid Again' : 'View Auction'}
                                            <ArrowRight size={16} />
                                        </Link>
                                    )}
                                </div>
                            </div>
                        </div>
                    ))
                )}
            </div>
        </div>
    );
};

export default MyBids;
