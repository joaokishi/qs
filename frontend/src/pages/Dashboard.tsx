import React, { useEffect, useState } from 'react';
import { getMetrics, getTopItems } from '../api/dashboard';
import type { DashboardMetrics, TopItem } from '../api/dashboard';
import { DollarSign, Gavel, Users } from 'lucide-react';

const Dashboard: React.FC = () => {
    const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
    const [topItems, setTopItems] = useState<TopItem[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [metricsData, topItemsData] = await Promise.all([
                    getMetrics(),
                    getTopItems()
                ]);
                setMetrics(metricsData);
                setTopItems(topItemsData);
            } catch (error) {
                console.error('Failed to fetch dashboard data', error);
            } finally {
                setIsLoading(false);
            }
        };

        fetchData();
    }, []);

    if (isLoading) {
        return <div className="text-center mt-4">Loading dashboard...</div>;
    }

    return (
        <div>
            <h1 className="text-2xl mb-4">Admin Dashboard</h1>

            {/* Metrics Cards */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))', gap: '1.5rem', marginBottom: '2rem' }}>
                <div className="card flex items-center gap-4">
                    <div style={{ padding: '1rem', backgroundColor: 'rgba(34, 197, 94, 0.1)', borderRadius: '50%', color: 'var(--color-success)' }}>
                        <Gavel size={24} />
                    </div>
                    <div>
                        <div className="label">Active Auctions</div>
                        <div className="text-2xl">{metrics?.activeAuctions || 0}</div>
                    </div>
                </div>

                <div className="card flex items-center gap-4">
                    <div style={{ padding: '1rem', backgroundColor: 'rgba(251, 191, 36, 0.1)', borderRadius: '50%', color: 'var(--color-accent)' }}>
                        <DollarSign size={24} />
                    </div>
                    <div>
                        <div className="label">Total Revenue</div>
                        <div className="text-2xl">${metrics?.totalRevenue?.toLocaleString() || '0.00'}</div>
                    </div>
                </div>

                <div className="card flex items-center gap-4">
                    <div style={{ padding: '1rem', backgroundColor: 'rgba(59, 130, 246, 0.1)', borderRadius: '50%', color: '#3b82f6' }}>
                        <Users size={24} />
                    </div>
                    <div>
                        <div className="label">Total Users</div>
                        <div className="text-2xl">{metrics?.totalUsers || 0}</div>
                    </div>
                </div>
            </div>

            {/* Top Items Table */}
            <div className="card">
                <h2 className="text-xl mb-4">Top Items by Bids</h2>
                <div style={{ overflowX: 'auto' }}>
                    <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                        <thead>
                            <tr style={{ borderBottom: '1px solid var(--color-border)', textAlign: 'left' }}>
                                <th style={{ padding: '1rem' }}>Item</th>
                                <th style={{ padding: '1rem' }}>Current Price</th>
                                <th style={{ padding: '1rem' }}>Bids</th>
                            </tr>
                        </thead>
                        <tbody>
                            {topItems.map((item) => (
                                <tr key={item.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                    <td style={{ padding: '1rem' }}>{item.title}</td>
                                    <td style={{ padding: '1rem' }}>${item.currentPrice.toLocaleString()}</td>
                                    <td style={{ padding: '1rem' }}>{item.bidCount}</td>
                                </tr>
                            ))}
                            {topItems.length === 0 && (
                                <tr>
                                    <td colSpan={3} className="text-center" style={{ padding: '2rem' }}>No data available</td>
                                </tr>
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
};

export default Dashboard;
