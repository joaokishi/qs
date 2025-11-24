import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getItems, deleteItem } from '../api/items';
import type { Item } from '../types';
import { Plus, Edit, Trash2 } from 'lucide-react';

const AdminItems: React.FC = () => {
    const [items, setItems] = useState<Item[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchItems();
    }, []);

    const fetchItems = async () => {
        try {
            const data = await getItems();
            setItems(data);
        } catch (error) {
            console.error('Failed to fetch items', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this item?')) {
            try {
                await deleteItem(id);
                setItems(items.filter(i => i.id !== id));
            } catch (error) {
                console.error('Failed to delete item', error);
                alert('Failed to delete item');
            }
        }
    };

    if (isLoading) {
        return <div>Loading items...</div>;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl">Items</h1>
                <Link to="/admin/items/new" className="btn btn-primary">
                    <Plus size={18} />
                    New Item
                </Link>
            </div>

            <div className="card">
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--color-border)', textAlign: 'left' }}>
                            <th style={{ padding: '1rem' }}>Image</th>
                            <th style={{ padding: '1rem' }}>Title</th>
                            <th style={{ padding: '1rem' }}>Price</th>
                            <th style={{ padding: '1rem' }}>State</th>
                            <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {items.map((item) => (
                            <tr key={item.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                <td style={{ padding: '1rem' }}>
                                    {item.imageUrl ? (
                                        <img src={item.imageUrl} alt={item.title} style={{ width: '50px', height: '50px', objectFit: 'cover', borderRadius: 'var(--radius-sm)' }} />
                                    ) : (
                                        <div style={{ width: '50px', height: '50px', backgroundColor: 'var(--color-border)', borderRadius: 'var(--radius-sm)' }} />
                                    )}
                                </td>
                                <td style={{ padding: '1rem' }}>{item.title}</td>
                                <td style={{ padding: '1rem' }}>${item.startingPrice.toLocaleString()}</td>
                                <td style={{ padding: '1rem' }}>{item.state}</td>
                                <td style={{ padding: '1rem', textAlign: 'right' }}>
                                    <div className="flex justify-end gap-2">
                                        <Link to={`/admin/items/${item.id}/edit`} className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem' }}>
                                            <Edit size={16} />
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(item.id)}
                                            className="btn btn-danger"
                                            style={{ padding: '0.25rem 0.5rem' }}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {items.length === 0 && (
                            <tr>
                                <td colSpan={5} className="text-center" style={{ padding: '2rem' }}>No items found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminItems;
