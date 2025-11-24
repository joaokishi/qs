import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { createItem, getItem, updateItem, uploadItemImage } from '../api/items';
import { getCategories } from '../api/categories';
import type { Category } from '../types';

const AdminItemForm: React.FC = () => {
    const { id } = useParams<{ id: string }>();
    const navigate = useNavigate();

    const [title, setTitle] = useState('');
    const [description, setDescription] = useState('');
    const [startingPrice, setStartingPrice] = useState('');
    const [minimumIncrement, setMinimumIncrement] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [state, setState] = useState<'NEW' | 'USED' | 'REFURBISHED'>('NEW');
    const [image, setImage] = useState<File | null>(null);

    const [categories, setCategories] = useState<Category[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState('');

    useEffect(() => {
        fetchCategories();
        if (id) {
            fetchItem(id);
        }
    }, [id]);

    const fetchCategories = async () => {
        try {
            const data = await getCategories();
            setCategories(data);
            if (data.length > 0 && !categoryId) {
                setCategoryId(data[0].id);
            }
        } catch (err) {
            console.error('Failed to fetch categories');
        }
    };

    const fetchItem = async (itemId: string) => {
        setIsLoading(true);
        try {
            const data = await getItem(itemId);
            setTitle(data.title);
            setDescription(data.description);
            setStartingPrice(data.startingPrice.toString());
            setMinimumIncrement(data.minimumIncrement.toString());
            setCategoryId(data.categoryId);
            setState(data.state);
        } catch (err) {
            setError('Failed to fetch item details');
        } finally {
            setIsLoading(false);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        setIsLoading(true);
        setError('');

        try {
            let itemId = id;
            const itemData = {
                title,
                description,
                startingPrice: parseFloat(startingPrice),
                minimumIncrement: parseFloat(minimumIncrement),
                categoryId,
                state,
            };

            if (id) {
                await updateItem(id, itemData);
            } else {
                const newItem = await createItem(itemData);
                itemId = newItem.id;
            }

            if (image && itemId) {
                await uploadItemImage(itemId, image);
            }

            navigate('/admin/items');
        } catch (err: any) {
            setError(err.response?.data?.message || 'Failed to save item');
            setIsLoading(false);
        }
    };

    if (isLoading && id && !title) {
        return <div>Loading...</div>;
    }

    return (
        <div style={{ maxWidth: '800px', margin: '0 auto' }}>
            <h1 className="text-2xl mb-6">{id ? 'Edit Item' : 'New Item'}</h1>

            <div className="card">
                {error && <div className="mb-4" style={{ color: 'var(--color-danger)' }}>{error}</div>}

                <form onSubmit={handleSubmit} className="flex flex-col gap-4">
                    <div className="input-group">
                        <label className="label">Title</label>
                        <input
                            type="text"
                            className="input"
                            value={title}
                            onChange={(e) => setTitle(e.target.value)}
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

                    <div className="flex gap-4">
                        <div className="input-group flex-1">
                            <label className="label">Starting Price</label>
                            <input
                                type="number"
                                className="input"
                                value={startingPrice}
                                onChange={(e) => setStartingPrice(e.target.value)}
                                min="0"
                                step="0.01"
                                required
                            />
                        </div>
                        <div className="input-group flex-1">
                            <label className="label">Min. Increment</label>
                            <input
                                type="number"
                                className="input"
                                value={minimumIncrement}
                                onChange={(e) => setMinimumIncrement(e.target.value)}
                                min="0"
                                step="0.01"
                                required
                            />
                        </div>
                    </div>

                    <div className="flex gap-4">
                        <div className="input-group flex-1">
                            <label className="label">Category</label>
                            <select
                                className="input"
                                value={categoryId}
                                onChange={(e) => setCategoryId(e.target.value)}
                                required
                            >
                                <option value="">Select Category</option>
                                {categories.map(c => (
                                    <option key={c.id} value={c.id}>{c.name}</option>
                                ))}
                            </select>
                        </div>
                        <div className="input-group flex-1">
                            <label className="label">Condition</label>
                            <select
                                className="input"
                                value={state}
                                onChange={(e) => setState(e.target.value as any)}
                                required
                            >
                                <option value="NEW">New</option>
                                <option value="USED">Used</option>
                                <option value="REFURBISHED">Refurbished</option>
                            </select>
                        </div>
                    </div>

                    <div className="input-group">
                        <label className="label">Image</label>
                        <input
                            type="file"
                            className="input"
                            onChange={(e) => setImage(e.target.files ? e.target.files[0] : null)}
                            accept="image/*"
                        />
                    </div>

                    <div className="flex gap-4 mt-4">
                        <button
                            type="button"
                            className="btn btn-secondary flex-1"
                            onClick={() => navigate('/admin/items')}
                        >
                            Cancel
                        </button>
                        <button
                            type="submit"
                            className="btn btn-primary flex-1"
                            disabled={isLoading}
                        >
                            {isLoading ? 'Saving...' : 'Save Item'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AdminItemForm;
