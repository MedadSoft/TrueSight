import React, { useState } from 'react';
import { Plus, Trash2, Save } from 'lucide-react';
import './Settings.css';

const Settings = ({ dropdownOptions, onUpdateOptions }) => {
    const [newOption, setNewOption] = useState({ category: '', value: '' });

    const handleAddOption = (category) => {
        if (!newOption.value.trim()) return;

        const updatedOptions = {
            ...dropdownOptions,
            [category]: [...dropdownOptions[category], newOption.value.trim()]
        };

        onUpdateOptions(updatedOptions);
        setNewOption({ ...newOption, value: '' });
    };

    const handleDeleteOption = (category, valueToDelete) => {
        const updatedOptions = {
            ...dropdownOptions,
            [category]: dropdownOptions[category].filter(opt => opt !== valueToDelete)
        };
        onUpdateOptions(updatedOptions);
    };

    const renderSection = (title, categoryKey) => (
        <div className="settings-section">
            <h3>{title}</h3>
            <div className="options-list">
                {dropdownOptions[categoryKey].map((option, index) => (
                    <div key={index} className="option-item">
                        <span>{option}</span>
                        <button
                            className="delete-btn"
                            onClick={() => handleDeleteOption(categoryKey, option)}
                            title="Delete option"
                        >
                            <Trash2 size={16} />
                        </button>
                    </div>
                ))}
            </div>
            <div className="add-option-form">
                <input
                    type="text"
                    placeholder={`Add new ${title.toLowerCase()}...`}
                    value={newOption.category === categoryKey ? newOption.value : ''}
                    onChange={(e) => setNewOption({ category: categoryKey, value: e.target.value })}
                    onKeyDown={(e) => {
                        if (e.key === 'Enter') handleAddOption(categoryKey);
                    }}
                />
                <button
                    className="add-btn"
                    onClick={() => handleAddOption(categoryKey)}
                    disabled={newOption.category !== categoryKey || !newOption.value.trim()}
                >
                    <Plus size={18} />
                </button>
            </div>
        </div>
    );

    return (
        <div className="settings-page">
            <div className="settings-header">
                <h1>Settings</h1>
                <p>Manage dropdown options for task creation</p>
            </div>

            <div className="settings-grid">
                {renderSection('Status Options', 'status')}
                {renderSection('Priority Options', 'priority')}
                {renderSection('Category Options', 'category')}
            </div>
        </div>
    );
};

export default Settings;
