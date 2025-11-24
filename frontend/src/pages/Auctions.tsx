import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getAuctions } from '../api/auctions';
import type { Auction } from '../types';
import SearchFilters from '../components/SearchFilters';
import Timer from '../components/Timer';

const Auctions: React.FC = () => {
    const [auctions, setAuctions] = useState<Auction[]>([]);
    const [filteredAuctions, setFilteredAuctions] = useState<Auction[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchAuctions();
    }, []);

    const fetchAuctions = async () => {
        try {
            const data = await getAuctions();
            setAuctions(data);
            setFilteredAuctions(data);
        } catch (error) {
            console.error('Failed to fetch auctions', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleSearch = (query: string, categoryId: string, minPrice: string, maxPrice: string, status: string) => {
        let result = auctions;

        if (query) {
            const lowerQuery = query.toLowerCase();
            result = result.filter(a =>
                a.title.toLowerCase().includes(lowerQuery) ||
                a.items.some(i => i.name.toLowerCase().includes(lowerQuery))
            );
        }

        if (categoryId) {
            result = result.filter(a => a.items.some(i => i.categoryId === categoryId));
        }

        if (minPrice) {
            result = result.filter(a => a.items.some(i => Number(i.currentValue) >= parseFloat(minPrice)));
        }

        if (maxPrice) {
            result = result.filter(a => a.items.some(i => Number(i.currentValue) <= parseFloat(maxPrice)));
        }

        if (status) {
            result = result.filter(a => a.status === status);
        }

        setFilteredAuctions(result);
    };

    const getStatusBadge = (status: string) => {
        switch (status) {
            case 'ativo': return <span className="badge badge-success">Active</span>;
            case 'agendado': return <span className="badge badge-primary">Scheduled</span>;
            case 'concluido': return <span className="badge badge-secondary">Completed</span>;
            case 'cancelado': return <span className="badge badge-danger">Cancelled</span>;
            default: return null;
        }
    };

    return (
        <div>
            <div className="text-center mb-12">
                <h1 className="text-4xl font-bold mb-4">All Auctions</h1>
                <p className="text-xl text-muted">Browse our complete collection of auctions.</p>
            </div>

            <SearchFilters onSearch={handleSearch} />

            {isLoading ? (
                <div className="text-center">Loading auctions...</div>
            ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    {filteredAuctions.map((auction) => (
                        <Link to={`/auction/${auction.id}`} key={auction.id} className="card hover:border-accent transition-colors group" style={{ textDecoration: 'none', color: 'inherit' }}>
                            <div className="aspect-video bg-gray-800 rounded-md mb-4 overflow-hidden relative">
                                {auction.items[0]?.images?.[0] ? (
                                    <img src={auction.items[0].images[0]} alt={auction.title} className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                                ) : (
                                    <div className="w-full h-full flex items-center justify-center text-gray-600">No Image</div>
                                )}
                                <div className="absolute top-2 right-2 flex gap-2">
                                    {getStatusBadge(auction.status)}
                                </div>
                                {auction.status === 'ativo' && (
                                    <div className="absolute bottom-2 right-2 bg-black/70 backdrop-blur-sm px-2 py-1 rounded text-xs font-mono">
                                        <Timer endTime={auction.expectedEndDate} />
                                    </div>
                                )}
                            </div>
                            <h3 className="text-xl font-bold mb-3 group-hover:text-accent transition-colors">{auction.title}</h3>
                            <div className="flex justify-between items-end">
                                <div>
                                    <div className="text-xs text-muted mb-1">Current Bid</div>
                                    <div className="text-lg font-bold text-accent">
                                        ${auction.items[0]?.currentValue ? parseFloat(String(auction.items[0].currentValue)).toLocaleString('en-US', { minimumFractionDigits: 0, maximumFractionDigits: 0 }) : '0'}
                                    </div>
                                </div>
                                <div className="text-right">
                                    <div className="text-xs text-muted mb-1">Items</div>
                                    <div className="text-sm font-medium">
                                        {auction.items.length} Item{auction.items.length !== 1 ? 's' : ''}
                                    </div>
                                </div>
                            </div>
                        </Link>
                    ))}
                    {filteredAuctions.length === 0 && (
                        <div className="col-span-full text-center py-12 text-muted">
                            No auctions found matching your criteria.
                        </div>
                    )}
                </div>
            )}
        </div>
    );
};

export default Auctions;
