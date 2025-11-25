import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getMetrics, getTopItems } from '../api/dashboard';
import { getItems } from '../api/items';
import { getCategories } from '../api/categories';
import type { DashboardMetrics, TopItem } from '../api/dashboard';
import {
    DollarSign,
    Gavel,
    Users,
    Package,
    FolderOpen,
    Plus,
    ArrowRight,
    TrendingUp
} from 'lucide-react';

const Dashboard: React.FC = () => {
    const [metrics, setMetrics] = useState<DashboardMetrics | null>(null);
    const [topItems, setTopItems] = useState<TopItem[]>([]);
    const [itemsCount, setItemsCount] = useState(0);
    const [categoriesCount, setCategoriesCount] = useState(0);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const [metricsData, topItemsData, itemsData, categoriesData] = await Promise.all([
                    getMetrics(),
                    getTopItems(),
                    getItems(),
                    getCategories()
                ]);
                setMetrics(metricsData);
                setTopItems(topItemsData);
                setItemsCount(itemsData.length);
                setCategoriesCount(categoriesData.length);
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

    const managementCards = [
        {
            title: 'Auctions',
            description: 'Create and manage auctions',
            icon: Gavel,
            color: '#22c55e',
            bgColor: 'rgba(34, 197, 94, 0.1)',
            link: '/admin/auctions',
            createLink: '/admin/auctions/new',
            count: metrics?.activeAuctions || 0,
            label: 'Active'
        },
        {
            title: 'Items',
            description: 'Manage auction items',
            icon: Package,
            color: '#f59e0b',
            bgColor: 'rgba(245, 158, 11, 0.1)',
            link: '/admin/items',
            createLink: '/admin/items/new',
            count: itemsCount,
            label: 'Total'
        },
        {
            title: 'Users',
            description: 'View and manage users',
            icon: Users,
            color: '#3b82f6',
            bgColor: 'rgba(59, 130, 246, 0.1)',
            link: '/admin/users',
            count: metrics?.totalUsers || 0,
            label: 'Total'
        },
        {
            title: 'Categories',
            description: 'Organize items by category',
            icon: FolderOpen,
            color: '#8b5cf6',
            bgColor: 'rgba(139, 92, 246, 0.1)',
            link: '/admin/categories',
            createLink: '/admin/categories/new',
            count: categoriesCount,
            label: 'Total'
        }
    ];

    return (
        <div>
            <div style={{ marginBottom: '2rem' }}>
                <h1 className="text-2xl" style={{ marginBottom: '0.5rem' }}>Admin Dashboard</h1>
                <p style={{ color: 'var(--color-text-muted)' }}>Manage your auction system</p>
            </div>

            {/* Quick Stats */}
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

            {/* Management Cards */}
            <div style={{ marginBottom: '2rem' }}>
                <h2 className="text-xl" style={{ marginBottom: '1rem' }}>Management</h2>
                <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.5rem' }}>
                    {managementCards.map((card) => (
                        <div key={card.title} className="card" style={{
                            padding: '1.5rem',
                            transition: 'transform 0.2s, box-shadow 0.2s',
                            cursor: 'pointer',
                            borderLeft: `4px solid ${card.color}`
                        }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-4px)';
                                e.currentTarget.style.boxShadow = '0 8px 16px rgba(0,0,0,0.1)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = 'none';
                            }}>
                            <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', marginBottom: '1rem' }}>
                                <div style={{
                                    padding: '0.75rem',
                                    backgroundColor: card.bgColor,
                                    borderRadius: 'var(--radius-md)',
                                    color: card.color
                                }}>
                                    <card.icon size={24} />
                                </div>
                                {card.count !== undefined && (
                                    <div style={{ textAlign: 'right' }}>
                                        <div style={{ fontSize: '1.5rem', fontWeight: 'bold', color: card.color }}>{card.count}</div>
                                        <div style={{ fontSize: '0.75rem', color: 'var(--color-text-muted)' }}>{card.label}</div>
                                    </div>
                                )}
                            </div>

                            <h3 style={{ fontSize: '1.125rem', fontWeight: '600', marginBottom: '0.5rem' }}>{card.title}</h3>
                            <p style={{ color: 'var(--color-text-muted)', fontSize: '0.875rem', marginBottom: '1rem' }}>{card.description}</p>

                            <div style={{ display: 'flex', gap: '0.5rem' }}>
                                <Link
                                    to={card.link}
                                    className="btn btn-secondary"
                                    style={{ flex: 1, display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '0.5rem', fontSize: '0.875rem' }}
                                >
                                    View All
                                    <ArrowRight size={14} />
                                </Link>
                                {card.createLink && (
                                    <Link
                                        to={card.createLink}
                                        className="btn btn-primary"
                                        style={{ display: 'flex', alignItems: 'center', justifyContent: 'center', padding: '0.5rem 0.75rem' }}
                                        title={`Create New ${card.title}`}
                                    >
                                        <Plus size={16} />
                                    </Link>
                                )}
                            </div>
                        </div>
                    ))}
                </div>
            </div>

            {/* Top Items Table */}
            <div className="card">
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '1rem' }}>
                    <TrendingUp size={20} color="var(--color-accent)" />
                    <h2 className="text-xl">Top Items by Bids</h2>
                </div>
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
                            {topItems.map((data) => (
                                <tr key={data.item.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                    <td style={{ padding: '1rem' }}>{data.item.name}</td>
                                    <td style={{ padding: '1rem', fontWeight: '600', color: 'var(--color-success)' }}>${data.highestBid.toLocaleString()}</td>
                                    <td style={{ padding: '1rem' }}>
                                        <span style={{
                                            padding: '0.25rem 0.5rem',
                                            backgroundColor: 'var(--color-accent)',
                                            color: 'white',
                                            borderRadius: 'var(--radius-sm)',
                                            fontSize: '0.875rem',
                                            fontWeight: '600'
                                        }}>
                                            {data.bidCount}
                                        </span>
                                    </td>
                                </tr>
                            ))}
                            {topItems.length === 0 && (
                                <tr>
                                    <td colSpan={3} className="text-center" style={{ padding: '2rem', color: 'var(--color-text-muted)' }}>
                                        No active items with bids yet
                                    </td>
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
