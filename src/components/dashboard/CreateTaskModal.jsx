import React, { useState, useEffect } from 'react';
import { X, Calendar } from 'lucide-react';
import './CreateTaskModal.css';

const TaskModal = ({ isOpen, onClose, onSave, taskToEdit = null, dropdownOptions, currentUser, users }) => {
    const initialFormState = {
        id: '',
        status: 'Open',
        priority: 'Medium',
        subject: '',
        category: '',
        dueDate: '',
        assignedTo: '',
        details: ''
    };

    const [formData, setFormData] = useState(initialFormState);

    // Determine potential assignees based on role
    const getPotentialAssignees = () => {
        if (!currentUser || !users) return [];

        if (currentUser.role === 'Admin') {
            return users.filter(u => u.role === 'Finance Officer');
        } else if (currentUser.role === 'Finance Manager') {
            return users.filter(u => u.role === 'Finance Officer' && u.managerId === currentUser.id);
        }
        return [];
    };

    const potentialAssignees = getPotentialAssignees();

    useEffect(() => {
        if (taskToEdit) {
            setFormData({
                id: taskToEdit.id,
                status: taskToEdit.status,
                priority: taskToEdit.priority || 'Medium',
                subject: taskToEdit.subject,
                category: taskToEdit.category || '',
                dueDate: taskToEdit.dueDate || '',
                assignedTo: taskToEdit.customer || '', // Mapping customer to assignedTo for now
                details: taskToEdit.details || ''
            });
        } else {
            // Default assignment logic for new tasks
            let defaultAssignee = '';
            if (currentUser?.role === 'Finance Officer') {
                defaultAssignee = currentUser.id;
            }

            setFormData({
                ...initialFormState,
                assignedTo: defaultAssignee
            });
        }
    }, [taskToEdit, isOpen, currentUser]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();

        // Find the name of the assigned user for display purposes (customer field)
        const assignedUser = users?.find(u => u.id === formData.assignedTo);
        const assignedName = assignedUser ? assignedUser.name : (currentUser?.role === 'Finance Officer' ? currentUser.name : 'Unassigned');

        onSave({
            ...taskToEdit,
            id: formData.id,
            subject: formData.subject,
            customer: assignedName, // Display name
            assignedToId: formData.assignedTo, // ID for logic
            status: formData.status,
            priority: formData.priority,
            date: taskToEdit?.date || 'Just now',
            category: formData.category,
            dueDate: formData.dueDate,
            details: formData.details
        });
        onClose();
        setFormData(initialFormState);
    };

    return (
        <div className="modal-overlay">
            <div className="modal-container">
                <div className="modal-header">
                    <div>
                        <h2>{taskToEdit ? 'Edit Task' : 'Create New Task'}</h2>
                        <p>{taskToEdit ? 'Update task details' : 'Add a new task to the approval system'}</p>
                    </div>
                    <button className="close-btn" onClick={onClose}>
                        <X size={20} />
                    </button>
                </div>

                <form onSubmit={handleSubmit} className="modal-form">
                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="id">Task ID</label>
                            <input
                                type="text"
                                id="id"
                                name="id"
                                placeholder="Auto-generated"
                                value={formData.id}
                                onChange={handleChange}
                                className="form-input"
                                disabled={true}
                            />
                        </div>
                        <div className="form-group">
                            <label htmlFor="status">Status</label>
                            <div className="select-wrapper">
                                <select
                                    id="status"
                                    name="status"
                                    value={formData.status}
                                    onChange={handleChange}
                                    className="form-select"
                                >
                                    {dropdownOptions?.status.map(opt => (
                                        <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                    </div>
                    <div className="form-group">
                        <label htmlFor="priority">Priority</label>
                        <div className="select-wrapper">
                            <select
                                id="priority"
                                name="priority"
                                value={formData.priority}
                                onChange={handleChange}
                                className="form-select"
                            >
                                {dropdownOptions?.priority.map(opt => (
                                    <option key={opt} value={opt}>{opt}</option>
                                ))}
                            </select>
                        </div>
                    </div>


                    <div className="form-group">
                        <label htmlFor="subject">Title</label>
                        <input
                            type="text"
                            id="subject"
                            name="subject"
                            placeholder="e.g., Approve Invoice"
                            value={formData.subject}
                            onChange={handleChange}
                            className="form-input"
                            required
                        />
                    </div>

                    <div className="form-row">
                        <div className="form-group">
                            <label htmlFor="category">Category</label>
                            <div className="select-wrapper">
                                <select
                                    id="category"
                                    name="category"
                                    value={formData.category}
                                    onChange={handleChange}
                                    className="form-select"
                                >
                                    <option value="" disabled>Select category</option>
                                    {dropdownOptions?.category.map(opt => (
                                        <option key={opt} value={opt}>{opt}</option>
                                    ))}
                                </select>
                            </div>
                        </div>
                        <div className="form-group">
                            <label htmlFor="dueDate">Due Date</label>
                            <div className="date-input-wrapper">
                                <input
                                    type="date"
                                    id="dueDate"
                                    name="dueDate"
                                    value={formData.dueDate}
                                    onChange={handleChange}
                                    className="form-input"
                                />
                                <Calendar className="calendar-icon" size={18} />
                            </div>
                        </div>
                    </div>

                    <div className="form-group">
                        <label htmlFor="assignedTo">Assign to</label>
                        {currentUser?.role === 'Finance Officer' ? (
                            <input
                                type="text"
                                value={currentUser.name}
                                className="form-input"
                                disabled
                            />
                        ) : (
                            <div className="select-wrapper">
                                <select
                                    id="assignedTo"
                                    name="assignedTo"
                                    value={formData.assignedTo}
                                    onChange={handleChange}
                                    className="form-select"
                                    required
                                >
                                    <option value="">Select Officer</option>
                                    {potentialAssignees.map(user => (
                                        <option key={user.id} value={user.id}>{user.name}</option>
                                    ))}
                                </select>
                            </div>
                        )}
                    </div>

                    <div className="form-group">
                        <label htmlFor="details">Details</label>
                        <textarea
                            id="details"
                            name="details"
                            placeholder="Enter ticket details..."
                            value={formData.details}
                            onChange={handleChange}
                            className="form-textarea"
                            rows="4"
                            style={{ width: '100%', padding: '10px', borderRadius: '8px', border: '1px solid #e2e8f0', resize: 'vertical' }}
                        />
                    </div>

                    <div className="modal-footer">
                        <button type="button" className="cancel-btn" onClick={onClose}>Cancel</button>
                        <button type="submit" className="create-btn">
                            {taskToEdit ? 'Save Changes' : 'Create Task'}
                        </button>
                    </div>
                </form>
            </div >
        </div >
    );
};

export default TaskModal;
