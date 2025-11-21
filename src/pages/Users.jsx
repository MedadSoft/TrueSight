import React, { useState } from 'react';
import { Plus, Search, Edit2, Trash2, User, Shield, Briefcase } from 'lucide-react';
import UserModal from '../components/users/UserModal';
import '../components/dashboard/TicketTable.css'; // Reusing table styles
import '../pages/Settings.css'; // Reusing some layout styles

const Users = ({ users, setUsers }) => {
    const [isModalOpen, setIsModalOpen] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [searchQuery, setSearchQuery] = useState('');

    const handleAddUser = (userData) => {
        if (editingUser) {
            setUsers(users.map(u => u.id === editingUser.id ? { ...userData, id: u.id } : u));
        } else {
            const newUser = {
                ...userData,
                id: `U-${Date.now()}` // Simple ID generation
            };
            setUsers([...users, newUser]);
        }
        setEditingUser(null);
    };

    const handleEditClick = (user) => {
        setEditingUser(user);
        setIsModalOpen(true);
    };

    const handleDeleteClick = (userId) => {
        if (window.confirm('Are you sure you want to delete this user?')) {
            setUsers(users.filter(u => u.id !== userId));
        }
    };

    const getManagerName = (managerId) => {
        const manager = users.find(u => u.id === managerId);
        return manager ? manager.name : '-';
    };

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.email.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.role.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const getRoleIcon = (role) => {
        switch (role) {
            case 'Admin': return <Shield size={16} className="text-purple-500" />;
            case 'Finance Manager': return <Briefcase size={16} className="text-blue-500" />;
            default: return <User size={16} className="text-gray-500" />;
        }
    };

    return (
        <div className="dashboard-container">
            <div className="header-actions" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '24px' }}>
                <div>
                    <h1 style={{ fontSize: '24px', fontWeight: '600', color: '#1e293b' }}>User Management</h1>
                    <p style={{ color: '#64748b', marginTop: '4px' }}>Manage system access and roles</p>
                </div>
                <button className="create-btn" onClick={() => { setEditingUser(null); setIsModalOpen(true); }}>
                    <Plus size={20} />
                    Add User
                </button>
            </div>

            <div className="table-container">
                <div className="table-header">
                    <div className="search-bar">
                        <Search size={20} />
                        <input
                            type="text"
                            placeholder="Search users..."
                            value={searchQuery}
                            onChange={(e) => setSearchQuery(e.target.value)}
                        />
                    </div>
                </div>

                <table className="ticket-table">
                    <thead>
                        <tr>
                            <th>Name</th>
                            <th>Email</th>
                            <th>Role</th>
                            <th>Reports To</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredUsers.length > 0 ? (
                            filteredUsers.map(user => (
                                <tr key={user.id}>
                                    <td style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
                                        <div style={{ width: '32px', height: '32px', borderRadius: '50%', background: '#e2e8f0', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#64748b', fontWeight: '600' }}>
                                            {user.name.charAt(0)}
                                        </div>
                                        {user.name}
                                    </td>
                                    <td>{user.email}</td>
                                    <td>
                                        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                            {getRoleIcon(user.role)}
                                            {user.role}
                                        </div>
                                    </td>
                                    <td>{user.role === 'Finance Officer' ? getManagerName(user.managerId) : '-'}</td>
                                    <td>
                                        <div className="actions-cell">
                                            <button className="icon-btn" onClick={() => handleEditClick(user)} title="Edit">
                                                <Edit2 size={16} />
                                            </button>
                                            <button className="icon-btn delete-btn" onClick={() => handleDeleteClick(user.id)} title="Delete">
                                                <Trash2 size={16} />
                                            </button>
                                        </div>
                                    </td>
                                </tr>
                            ))
                        ) : (
                            <tr>
                                <td colSpan="5" style={{ textAlign: 'center', padding: '40px', color: '#64748b' }}>
                                    No users found.
                                </td>
                            </tr>
                        )}
                    </tbody>
                </table>
            </div>

            <UserModal
                isOpen={isModalOpen}
                onClose={() => setIsModalOpen(false)}
                onSave={handleAddUser}
                userToEdit={editingUser}
                users={users}
            />
        </div>
    );
};

export default Users;
