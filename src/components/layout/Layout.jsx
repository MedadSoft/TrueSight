import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import './Layout.css';

const Layout = ({ children, onLogout, user }) => {
    return (
        <div className="layout">
            <Sidebar onLogout={onLogout} user={user} />
            <div className="main-content">
                <Header />
                <main className="page-content">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;
