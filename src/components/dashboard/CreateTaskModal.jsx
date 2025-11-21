import React, { useState, useEffect } from 'react';
import { X, Calendar } from 'lucide-react';
import './CreateTaskModal.css';

const TaskModal = ({ isOpen, onClose, onSave, taskToEdit = null, dropdownOptions }) => {
    const initialFormState = {
        id: '',
        status: 'Open',
        priority: 'Medium',
        subject: '',
        category: '',
        dueDate: '',
        assignedBy: ''
    };

    const [formData, setFormData] = useState(initialFormState);

    useEffect(() => {
        if (taskToEdit) {
            setFormData({
                id: taskToEdit.id,
                status: taskToEdit.status,
                priority: taskToEdit.priority || 'Medium',
                subject: taskToEdit.subject,
                category: taskToEdit.category || '', // Handle potential missing fields
                dueDate: taskToEdit.dueDate || '',
                assignedBy: taskToEdit.customer // Mapping customer to assignedBy for consistency
            });
        } else {
            setFormData(initialFormState);
        }
    }, [taskToEdit, isOpen]);

    if (!isOpen) return null;

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e) => {
        e.preventDefault();
        onSave({
            ...taskToEdit, // Keep existing fields like date if not updated
            // ID is now handled by App.jsx for new tasks
            id: formData.id,
            subject: formData.subject,
            customer: formData.assignedBy,
            status: formData.status,
            priority: formData.priority,
            date: taskToEdit?.date || 'Just now',
            category: formData.category,
            dueDate: formData.dueDate
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
                                disabled={true} // Always disabled
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
                        <label htmlFor="assignedBy">Assigned By</label>
                        <input
                            type="text"
                            id="assignedBy"
                            name="assignedBy"
                            placeholder="e.g., John Smith"
                            value={formData.assignedBy}
                            onChange={handleChange}
                            className="form-input"
                            required
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
