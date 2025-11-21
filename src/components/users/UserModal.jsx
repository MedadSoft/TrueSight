import React, { useState, useEffect } from 'react';
import { X } from 'lucide-react';
import '../dashboard/CreateTaskModal.css'; // Reusing the modal styles

const UserModal = ({ isOpen, onClose, onSave, userToEdit, users }) => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        role: 'Finance Officer',
        managerId: ''
    });

    useEffect(() => {
        if (userToEdit) {
            setFormData(userToEdit);
        } else {
            setFormData({
                name: '',
                email: '',
                role: 'Finance Officer',
                managerId: ''
            });
        }
    }, [userToEdit, isOpen]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave(formData);
        onClose();
    };

    // Filter potential managers: Must be 'Finance Manager'
    const potentialManagers = users.filter(u => u.role === 'Finance Manager');

    if (!isOpen) return null;

    return (
        <div className="modal-overlay">
            <div className="modal-content">
                <div className="modal-header">
                    <h2>{userToEdit ? 'Edit User' : 'Add New User'}</h2>
                    <button className="close-btn" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label>Full Name</label>
                        <input
                            type="text"
                            name="name"
                            value={formData.name}
                            onChange={handleChange}
                            placeholder="e.g. John Doe"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Email</label>
                        <input
                            type="email"
                            name="email"
                            value={formData.email}
                            onChange={handleChange}
                            placeholder="john@example.com"
                            required
                        />
                    </div>

                    <div className="form-group">
                        <label>Role</label>
                        <select
                            name="role"
                            value={formData.role}
                            onChange={handleChange}
                        >
                            <option value="Admin">Admin</option>
                            <option value="Finance Manager">Finance Manager</option>
                            <option value="Finance Officer">Finance Officer</option>
                        </select>
                    </div>

                    {formData.role === 'Finance Officer' && (
                        <div className="form-group">
                            <label>Reports To (Manager)</label>
                            <select
                                name="managerId"
                                value={formData.managerId}
                                onChange={handleChange}
                                required={formData.role === 'Finance Officer'}
                            >
                                <option value="">Select a Manager</option>
                                {potentialManagers.map(manager => (
                                    <option key={manager.id} value={manager.id}>
                                        {manager.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    )}

                    <div className="modal-footer">
                        <button type="button" className="cancel-btn" onClick={onClose}>
                            Cancel
                        </button>
                        <button type="submit" className="create-btn">
                            {userToEdit ? 'Save Changes' : 'Add User'}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default UserModal;
