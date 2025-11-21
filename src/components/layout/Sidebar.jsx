import React from 'react';
import { LayoutDashboard, Ticket, Users, Settings, LogOut, Hexagon } from 'lucide-react';
import { Link, useLocation } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
    const location = useLocation();
    const isActive = (path) => location.pathname === path;

    return (
        <aside className="sidebar">
            <div className="sidebar-header">
                <div className="logo-container">
                    <div className="logo-icon">TF</div>
                    <span className="logo-text">TicketFlow</span>
                </div>
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
                        <Link to="/customers" className={`nav-item ${isActive('/customers') ? 'active' : ''}`}>
                            <Users size={20} />
                            <span>Customers</span>
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
                <button className="logout-btn">
                    <LogOut size={20} />
                    <span>Logout</span>
                </button>
            </div>
        </aside>
    );
};

export default Sidebar;
