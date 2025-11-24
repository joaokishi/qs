import React, { useEffect, useState } from 'react';
import { getUsers, blockUser, unblockUser } from '../api/users';
import type { User } from '../types';
import { Shield, ShieldOff, User as UserIcon } from 'lucide-react';

const AdminUsers: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        fetchUsers();
    }, []);

    const fetchUsers = async () => {
        try {
            const data = await getUsers();
            setUsers(data);
        } catch (error) {
            console.error('Failed to fetch users', error);
        } finally {
            setIsLoading(false);
        }
    };

    const handleBlock = async (id: string) => {
        if (window.confirm('Are you sure you want to block this user?')) {
            try {
                await blockUser(id);
                setUsers(users.map(u => u.id === id ? { ...u, isBlocked: true } : u));
            } catch (error) {
                console.error('Failed to block user', error);
                alert('Failed to block user');
            }
        }
    };

    const handleUnblock = async (id: string) => {
        if (window.confirm('Are you sure you want to unblock this user?')) {
            try {
                await unblockUser(id);
                setUsers(users.map(u => u.id === id ? { ...u, isBlocked: false } : u));
            } catch (error) {
                console.error('Failed to unblock user', error);
                alert('Failed to unblock user');
            }
        }
    };

    if (isLoading) {
        return <div>Loading users...</div>;
    }

    return (
        <div>
            <h1 className="text-2xl mb-6">Users</h1>

            <div className="card">
                <table style={{ width: '100%', borderCollapse: 'collapse' }}>
                    <thead>
                        <tr style={{ borderBottom: '1px solid var(--color-border)', textAlign: 'left' }}>
                            <th style={{ padding: '1rem' }}>Name</th>
                            <th style={{ padding: '1rem' }}>Email</th>
                            <th style={{ padding: '1rem' }}>Role</th>
                            <th style={{ padding: '1rem' }}>Status</th>
                            <th style={{ padding: '1rem', textAlign: 'right' }}>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {users.map((user) => (
                            <tr key={user.id} style={{ borderBottom: '1px solid var(--color-border)' }}>
                                <td style={{ padding: '1rem' }}>
                                    <div className="flex items-center gap-2">
                                        <div className="w-8 h-8 rounded-full bg-gray-700 flex items-center justify-center">
                                            <UserIcon size={16} />
                                        </div>
                                        {user.name}
                                    </div>
                                </td>
                                <td style={{ padding: '1rem' }}>{user.email}</td>
                                <td style={{ padding: '1rem' }}>{user.role}</td>
                                <td style={{ padding: '1rem' }}>
                                    <span style={{
                                        padding: '0.25rem 0.5rem',
                                        borderRadius: 'var(--radius-sm)',
                                        backgroundColor: user.isBlocked ? 'var(--color-danger)' : 'var(--color-success)',
                                        color: 'white'
                                    }}>
                                        {user.isBlocked ? 'Blocked' : 'Active'}
                                    </span>
                                </td>
                                <td style={{ padding: '1rem', textAlign: 'right' }}>
                                    {user.role !== 'admin' && (
                                        <div className="flex justify-end gap-2">
                                            {user.isBlocked ? (
                                                <button
                                                    onClick={() => handleUnblock(user.id)}
                                                    className="btn btn-success"
                                                    style={{ padding: '0.25rem 0.5rem', backgroundColor: 'var(--color-success)', color: 'white' }}
                                                    title="Unblock User"
                                                >
                                                    <Shield size={16} />
                                                </button>
                                            ) : (
                                                <button
                                                    onClick={() => handleBlock(user.id)}
                                                    className="btn btn-danger"
                                                    style={{ padding: '0.25rem 0.5rem' }}
                                                    title="Block User"
                                                >
                                                    <ShieldOff size={16} />
                                                </button>
                                            )}
                                        </div>
                                    )}
                                </td>
                            </tr>
                        ))}
                        {users.length === 0 && (
                            <tr>
                                <td colSpan={5} className="text-center" style={{ padding: '2rem' }}>No users found</td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default AdminUsers;
