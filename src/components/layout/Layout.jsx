import React from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import './Layout.css';

const Layout = ({ children }) => {
    return (
        <div className="layout">
            <Sidebar />
            <div className="main-wrapper">
                <Header />
                <main className="main-content">
                    {children}
                </main>
            </div>
        </div>
    );
};

export default Layout;
