import React, { useEffect } from 'react';
import { CheckCircle, X } from 'lucide-react';
import './Notification.css';

const Notification = ({ show, message, onClose }) => {
    if (!show) return null;

    return (
        <div className="notification-overlay">
            <div className="notification-content">
                <div className="notification-icon">
                    <CheckCircle size={48} color="#22c55e" />
                </div>
                <h3>Success!</h3>
                <p>{message}</p>
                <button className="notification-close" onClick={onClose}>
                    <X size={20} />
                </button>
            </div>
        </div>
    );
};

export default Notification;
