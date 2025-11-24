import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createCategory, getCategory, updateCategory } from '../api/categories';

const AdminCategoryForm: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        if (id) {
            fetchCategory(id);
        }
    }, [id]);

    const fetchCategory = async (categoryId: string) => {
        setIsLoading(true);
        try {
            const data = await getCategory(categoryId);
            setName(data.name);
            setDescription(data.description);
        } catch (err) {
            setError('Failed to fetch category details');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            if (id) {
                await updateCategory(id, name, description);
            } else {
                await createCategory(name, description);
            }
            navigate('/admin/categories');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to save category');
            setIsLoading(false);
        }
    };

    if (isLoading && id && !name) {
        return <div>Loading...</div>;
    }

    return (
        <div style={{ maxWidth: '600px', margin: '0 auto' }}>
            <h1 className="text-2xl mb-6">{id ? 'Edit Category' : 'New Category'}</h1>

            <div className="card">
                {error && <div className="mb-4" style={{ color: 'var(--color-danger)' }}>{error}</div>}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="input-group">
                        <label className="label">Name</label>
                        <input
                            type="text"
                            className="input"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                            required
                        />
                    </div>

                    <div className="input-group">
                        <label className="label">Description</label>
                        <textarea
                            className="input"
                            value={description}
                            onChange={(e) => setDescription(e.target.value)}
                            rows={4}
                            required
                        />
                    </div>

                    <div className="flex gap-4 mt-4">
                        <button
                            type="button"
                            className="btn btn-secondary flex-1"
                            onClick={() => navigate('/admin/categories')}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary flex-1"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Saving...' : 'Save Category'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminCategoryForm;
