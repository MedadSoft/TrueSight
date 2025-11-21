import React from 'react';
import TicketTable from '../components/dashboard/TicketTable';
import SearchBar from '../components/dashboard/SearchBar';
import { Plus } from 'lucide-react';

const Tickets = ({
    tickets,
    onRowDoubleClick,
    searchQuery,
    onSearchChange,
    onSort,
    sortConfig,
    onViewAll,
    onCreateClick
}) => {
    return (
        <div className="dashboard-content tickets-page">
            <div className="dashboard-header">
                <div>
                    <h1>Tickets</h1>
                    <p>Manage and track all support tickets.</p>
                </div>
                <button className="create-task-btn" onClick={onCreateClick}>
                    <Plus size={20} />
                    <span>Create Task</span>
                </button>
            </div>

            <div className="tickets-controls">
                <SearchBar value={searchQuery} onChange={onSearchChange} />
            </div>

            <TicketTable
                tickets={tickets}
                onRowDoubleClick={onRowDoubleClick}
                onSort={onSort}
                sortConfig={sortConfig}
                onViewAll={onViewAll}
            />
        </div>
    );
};

export default Tickets;
