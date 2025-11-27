import React from 'react';
import { NavLink, Outlet } from 'react-router-dom';
import { LayoutDashboard, Search, FileText, Settings, ShieldAlert } from 'lucide-react';
import './Layout.css';

const Layout = () => {
    return (
        <div className="app-container">
            <aside className="sidebar">
                <div className="logo-container">
                    <ShieldAlert className="logo-icon" size={28} />
                    <span className="logo-text">TrueSight</span>
                </div>

                <nav className="nav-menu">
                    <NavLink to="/" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                        <LayoutDashboard size={20} />
                        <span>Dashboard</span>
                    </NavLink>
                    <NavLink to="/analysis" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                        <Search size={20} />
                        <span>Analysis Studio</span>
                    </NavLink>
                    <NavLink to="/investigation" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                        <FileText size={20} />
                        <span>Investigation</span>
                    </NavLink>
                    <NavLink to="/settings" className={({ isActive }) => `nav-item ${isActive ? 'active' : ''}`}>
                        <Settings size={20} />
                        <span>Settings</span>
                    </NavLink>
                </nav>
            </aside>

            <main className="main-content">
                <header className="top-header">
                    <div className="header-search">
                        <Search size={16} className="search-icon" />
                        <input type="text" placeholder="Search cases, transactions..." />
                    </div>
                    <div className="user-profile">
                        <div className="avatar">JD</div>
                        <span>John Doe</span>
                    </div>
                </header>

                <div className="content-area">
                    <Outlet />
                </div>
            </main>
        </div>
    );
};

export default Layout;
