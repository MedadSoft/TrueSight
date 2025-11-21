import React from 'react';
import { Link, useLocation } from 'react-router-dom';
import { LayoutDashboard, Ticket, Settings, Users, LogOut } from 'lucide-react';
import './Sidebar.css';

const Sidebar = ({ onLogout, user }) => {
    const location = useLocation();
    const isActive = (path) => location.pathname === path;

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <div className="logo-container">
                    <span className="logo-text">TF</span>
                </div>
                <h1 className="app-title">TicketFlow</h1>
            </div>

            <nav className="sidebar-nav">
                <ul>
                    <li>
                        <Link to="/" className={`nav-item ${isActive('/') ? 'active' : ''}`}>
                            <LayoutDashboard size={20} />
                            <span>Dashboard</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/tickets" className={`nav-item ${isActive('/tickets') ? 'active' : ''}`}>
                            <Ticket size={20} />
                            <span>Tickets</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/users" className={`nav-item ${isActive('/users') ? 'active' : ''}`}>
                            <Users size={20} />
                            <span>Users</span>
                        </Link>
                    </li>
                    <li>
                        <Link to="/settings" className={`nav-item ${isActive('/settings') ? 'active' : ''}`}>
                            <Settings size={20} />
                            <span>Settings</span>
                        </Link>
                    </li>
                </ul>
            </nav>

            <div className="sidebar-footer">
                <div className="user-info">
                    <div className="user-avatar">
                        {user?.name?.charAt(0) || 'U'}
                    </div>
                    <div className="user-details">
                        <span className="user-name">{user?.name || 'User'}</span>
                        <span className="user-role">{user?.role || 'Member'}</span>
                    </div>
                </div>
                <button className="logout-btn" onClick={onLogout}>
                    <LogOut size={18} />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
