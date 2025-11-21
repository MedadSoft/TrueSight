import React from 'react';
import { Search, Bell, User } from 'lucide-react';
import './Header.css';

const Header = () => {
    return (
        <header className="header">


            <div className="header-actions">
                <button className="icon-btn">
                    <Bell size={20} />
                    <span className="notification-badge">3</span>
                </button>

                <div className="user-profile">
                    <div className="avatar">
                        <User size={20} />
                    </div>
                    <div className="user-info">
                        <span className="user-name">Alex Morgan</span>
                        <span className="user-role">Admin</span>
                    </div>
                </div>
            </div>
        </header>
    );
};

export default Header;
