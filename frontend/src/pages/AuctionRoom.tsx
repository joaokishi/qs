import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import { useSocket } from '../context/SocketContext';
import Timer from '../components/Timer';
import BidControls from '../components/BidControls';
import type { Auction, Item, Bid } from '../types';
import { Gavel, User as UserIcon, History } from 'lucide-react';

const AuctionRoom: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const { socket, isConnected } = useSocket();

    const [auction, setAuction] = useState<Auction | null>(null);
    const [currentItem, setCurrentItem] = useState<Item | null>(null);
    const [bids, setBids] = useState<Bid[]>([]);
    const [endTime, setEndTime] = useState<string | null>(null);

    useEffect(() => {
        if (socket && id && isConnected) {
            console.log('Joining auction:', id);
            socket.emit('auction:join', id);

            socket.on('auction:state', (data: { auction: Auction, currentItem: Item, bids: Bid[], endTime: string }) => {
                console.log('Auction state received:', data);
                setAuction(data.auction);
                setCurrentItem(data.currentItem);
                setBids(data.bids);
                setEndTime(data.endTime);
            });

            socket.on('bid:new', (bid: Bid) => {
                console.log('New bid:', bid);
                setBids(prev => [bid, ...prev]);
                if (currentItem) {
                    setCurrentItem(prev => prev ? { ...prev, currentValue: bid.amount } : null);
                }
            });

            socket.on('timer:extended', (data: { newEndTime: string }) => {
                console.log('Timer extended:', data.newEndTime);
                setEndTime(data.newEndTime);
            });

            socket.on('item:changed', (item: Item) => {
                console.log('Item changed:', item);
                setCurrentItem(item);
                setBids([]);
                setEndTime(null); // Reset timer until new state or timer update
            });

            return () => {
                socket.emit('auction:leave', id);
                socket.off('auction:state');
                socket.off('bid:new');
                socket.off('timer:extended');
                socket.off('item:changed');
            };
        }
    }, [socket, id, isConnected]);

    if (!isConnected) {
        return <div className="text-center mt-8">Connecting to auction server...</div>;
    }

    if (!auction || !currentItem) {
        return <div className="text-center mt-8">Waiting for auction to start...</div>;
    }

    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {/* Main Stage: Item & Video (Placeholder) */}
            <div className="md:col-span-2 space-y-6">
                <div className="card">
                    <div className="aspect-video bg-gray-900 rounded-lg flex items-center justify-center mb-4 relative overflow-hidden">
                        {currentItem.images && currentItem.images.length > 0 ? (
                            <img src={currentItem.images[0]} alt={currentItem.name} className="w-full h-full object-contain" />
                        ) : (
                            <div className="text-gray-500 flex flex-col items-center">
                                <Gavel size={48} />
                                <span>Live Stream Placeholder</span>
                            </div>
                        )}

                        {/* Overlay Timer */}
                        <div className="absolute top-4 right-4 bg-black/50 backdrop-blur-md px-4 py-2 rounded-full">
                            {endTime && <Timer endTime={endTime} />}
                        </div>
                    </div>

                    <div className="flex justify-between items-start">
                        <div>
                            <h1 className="text-2xl font-bold">{currentItem.name}</h1>
                            <p className="text-muted mt-2">{currentItem.description}</p>
                        </div>
                        <div className="text-right">
                            <div className="label">Current Price</div>
                            <div className="text-3xl font-bold text-accent">${Number(currentItem.currentValue).toLocaleString()}</div>
                        </div>
                    </div>
                </div>

                {/* Bidding Controls */}
                <BidControls
                    itemId={currentItem.id}
                    currentPrice={Number(currentItem.currentValue)}
                    minimumIncrement={Number(currentItem.minimumIncrement)}
                />
            </div>

            {/* Sidebar: Bids & History */}
            <div className="space-y-6">
                <div className="card h-[600px] flex flex-col">
                    <h3 className="text-xl mb-4 flex items-center gap-2">
                        <History size={20} />
                        Live Bids
                    </h3>

                    <div className="flex-1 overflow-y-auto space-y-3 pr-2">
                        {bids.map((bid) => (
                            <div key={bid.id} className="flex justify-between items-center p-3 bg-gray-800/50 rounded-lg animate-in fade-in slide-in-from-top-2">
                                <div className="flex items-center gap-2">
                                    <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                                        <UserIcon size={14} />
                                    </div>
                                    <div>
                                        <div className="font-medium">{bid.user?.name || 'Anonymous'}</div>
                                        <div className="text-xs text-muted">{new Date(bid.createdAt).toLocaleTimeString()}</div>
                                    </div>
                                </div>
                                <div className="font-bold text-accent">
                                    ${bid.amount.toLocaleString()}
                                </div>
                            </div>
                        ))}
                        {bids.length === 0 && (
                            <div className="text-center text-muted py-8">
                                No bids yet. Be the first!
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default AuctionRoom;
