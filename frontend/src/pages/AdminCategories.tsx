import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { getCategories, deleteCategory } from '../api/categories';
import type { Category } from '../types';
import { Plus, Edit, Trash2 } from 'lucide-react';

const AdminCategories: React.FC = () => {
    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const data = await getCategories();
            setCategories(data);
        } catch (error) {
            console.error('Failed to fetch categories', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleDelete = async (id: string) => {
        if (window.confirm('Are you sure you want to delete this category?')) {
            try {
                await deleteCategory(id);
                setCategories(categories.filter(c => c.id !== id));
            } catch (error) {
                console.error('Failed to delete category', error);
                alert('Failed to delete category');
            }
        }
    };

    if (isLoading) {
        return <div>Loading categories...</div>;
    }

    return (
        <div>
            <div className="flex justify-between items-center mb-6">
                <h1 className="text-2xl">Categories</h1>
                <Link to="/admin/categories/new" className="btn btn-primary">
                    <Plus size={18} />
                    New Category
                </Link>
            </div>

            <div className="card">
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--color-border)', textAlign: 'left' }}>
                            <th style={{ padding: '1rem' }}>Name</th>
                            <th style={{ padding: '1rem' }}>Description</th>
                            <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {categories.map((category) => (
                            <tr key={category.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                <td style={{ padding: '1rem' }}>{category.name}</td>
                                <td style={{ padding: '1rem', color: 'var(--color-text-muted)' }}>{category.description}</td>
                                <td style={{ padding: '1rem', textAlign: 'right' }}>
                                    <div className="flex justify-end gap-2">
                                        <Link to={`/admin/categories/${category.id}/edit`} className="btn btn-secondary" style={{ padding: '0.25rem 0.5rem' }}>
                                            <Edit size={16} />
                                        </Link>
                                        <button
                                            onClick={() => handleDelete(category.id)}
                                            className="btn btn-danger"
                                            style={{ padding: '0.25rem 0.5rem' }}
                                        >
                                            <Trash2 size={16} />
                                        </button>
                                    </div>
                                </td>
                            </tr>
                        ))}
                        {categories.length === 0 && (
                            <tr>
                                <td colSpan={3} className="text-center" style={{ padding: '2rem' }}>No categories found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminCategories;
