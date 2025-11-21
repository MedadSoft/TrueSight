import React from 'react';
import StatsCard from '../components/dashboard/StatsCard';
import TicketTable from '../components/dashboard/TicketTable';
import { Plus } from 'lucide-react';

const Dashboard = ({ stats, tickets, onRowDoubleClick, onCreateClick, user }) => {
    // Filter for critical tickets only
    const criticalTickets = tickets.filter(t => t.priority === 'Critical');

    return (
        <div className="dashboard-content">
            <div className="dashboard-header">
                <div>
                    <h1>Dashboard</h1>
                    <p>Welcome back, {user ? user.name.split(' ')[0] : 'User'}! Here's what's happening today.</p>
                </div>
                <button className="create-task-btn" onClick={onCreateClick}>
                    <Plus size={20} />
                    <span>Create Task</span>
                </button>
            </div>

            <div className="stats-grid">
                {stats.map((stat, index) => (
                    <StatsCard key={index} {...stat} />
                ))}
            </div>

            <div className="section-header">
                <h2>Critical Attention Needed</h2>
            </div>

            <TicketTable
                tickets={criticalTickets}
                onRowDoubleClick={onRowDoubleClick}
            // No sorting or view all needed for this specific view as per requirements
            />
        </div>
    );
};

export default Dashboard;
