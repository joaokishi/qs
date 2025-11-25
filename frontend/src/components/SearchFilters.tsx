import React, { useEffect, useState } from 'react';
import { getCategories } from '../api/categories';
import type { Category } from '../types';
import { Search, Filter, ChevronDown, ChevronUp } from 'lucide-react';

interface SearchFiltersProps {
    onSearch: (query: string, categoryId: string, minPrice: string, maxPrice: string, status: string) => void;
}

const SearchFilters: React.FC<SearchFiltersProps> = ({ onSearch }) => {
    const [query, setQuery] = useState('');
    const [categoryId, setCategoryId] = useState('');
    const [minPrice, setMinPrice] = useState('');
    const [maxPrice, setMaxPrice] = useState('');
    const [status, setStatus] = useState('');
    const [categories, setCategories] = useState<Category[]>([]);
    const [isExpanded, setIsExpanded] = useState(false);

    useEffect(() => {
        fetchCategories();
    }, []);

    const fetchCategories = async () => {
        try {
            const data = await getCategories();
            setCategories(data);
        } catch (error) {
            console.error('Failed to fetch categories');
        }
    };

    const handleSearch = (e: React.FormEvent) => {
        e.preventDefault();
        onSearch(query, categoryId, minPrice, maxPrice, status);
    };

    return (
        <div className="card mb-6">
            <div
                style={{
                    display: 'flex',
                    justifyContent: 'space-between',
                    alignItems: 'center',
                    marginBottom: isExpanded ? '1rem' : 0,
                    cursor: 'pointer'
                }}
                onClick={() => setIsExpanded(!isExpanded)}
            >
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                    <Filter size={20} color="var(--color-accent)" />
                    <h3 style={{ margin: 0, fontSize: '1.125rem', fontWeight: '600' }}>Search & Filters</h3>
                </div>
                <button
                    type="button"
                    className="btn btn-secondary"
                    style={{ padding: '0.5rem', display: 'flex', alignItems: 'center', gap: '0.5rem' }}
                >
                    {isExpanded ? (
                        <>
                            <ChevronUp size={18} />
                            <span>Hide</span>
                        </>
                    ) : (
                        <>
                            <ChevronDown size={18} />
                            <span>Show Filters</span>
                        </>
                    )}
                </button>
            </div>

            <div style={{
                maxHeight: isExpanded ? '500px' : '0',
                overflow: 'hidden',
                transition: 'max-height 0.3s ease-in-out'
            }}>
                <form onSubmit={handleSearch} className="flex flex-col md:flex-row gap-4 items-end flex-wrap">
                    <div className="input-group flex-1 min-w-[200px]" style={{ marginBottom: 0 }}>
                        <label className="label">Search</label>
                        <div className="relative">
                            <input
                                type="text"
                                className="input pl-10"
                                placeholder="Search items..."
                                value={query}
                                onChange={(e) => setQuery(e.target.value)}
                                style={{ paddingLeft: '2.5rem' }}
                            />
                            <Search className="absolute left-3 top-3 text-muted" size={18} />
                        </div>
                    </div>

                    <div className="input-group w-full md:w-40" style={{ marginBottom: 0 }}>
                        <label className="label">Status</label>
                        <select
                            className="input"
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                        >
                            <option value="">All Statuses</option>
                            <option value="ativo">Active</option>
                            <option value="agendado">Scheduled</option>
                            <option value="concluido">Completed</option>
                            <option value="cancelado">Cancelled</option>
                        </select>
                    </div>

                    <div className="input-group w-full md:w-48" style={{ marginBottom: 0 }}>
                        <label className="label">Category</label>
                        <select
                            className="input"
                            value={categoryId}
                            onChange={(e) => setCategoryId(e.target.value)}
                        >
                            <option value="">All Categories</option>
                            {categories.map(c => (
                                <option key={c.id} value={c.id}>{c.name}</option>
                            ))}
                        </select>
                    </div>

                    <div className="input-group w-full md:w-28" style={{ marginBottom: 0 }}>
                        <label className="label">Min Price</label>
                        <input
                            type="number"
                            className="input"
                            placeholder="Min"
                            value={minPrice}
                            onChange={(e) => setMinPrice(e.target.value)}
                        />
                    </div>

                    <div className="input-group w-full md:w-28" style={{ marginBottom: 0 }}>
                        <label className="label">Max Price</label>
                        <input
                            type="number"
                            className="input"
                            placeholder="Max"
                            value={maxPrice}
                            onChange={(e) => setMaxPrice(e.target.value)}
                        />
                    </div>

                    <button type="submit" className="btn btn-primary">
                        <Filter size={18} />
                        Apply Filters
                    </button>
                </form>
            </div>
        </div>
    );
};

export default SearchFilters;
