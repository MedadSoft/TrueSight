
import React from 'react';
import { MoreHorizontal, ArrowUpDown } from 'lucide-react';
import './TicketTable.css';

const TicketTable = ({ tickets, onRowDoubleClick, onSort, sortConfig, onViewAll }) => {
    // Hardcoded tickets removed, now receiving from props

    const getStatusColor = (status) => {
        switch (status) {
            case 'Open': return 'status-open';
            case 'In Progress': return 'status-progress';
            case 'Closed': return 'status-closed';
            default: return '';
        }
    };

    const getPriorityColor = (priority) => {
        switch (priority) {
            case 'Critical': return 'priority-critical';
            case 'High': return 'priority-high';
            case 'Medium': return 'priority-medium';
            case 'Low': return 'priority-low';
            default: return '';
        }
    };

    const getClassNamesFor = (name) => {
        if (!sortConfig) return;
        return sortConfig.key === name ? sortConfig.direction : undefined;
    };

    const renderSortIcon = (name) => {
        if (sortConfig && sortConfig.key === name) {
            return <ArrowUpDown size={14} className={`sort-icon ${sortConfig.direction}`} />;
        }
        return <ArrowUpDown size={14} className="sort-icon" />;
    };

    return (
        <div className="ticket-table-container">
            <div className="table-header">
                <h3>Recent Tickets</h3>
                <button className="view-all-btn" onClick={onViewAll}>View All</button>
            </div>

            <div className="table-wrapper">
                <table className="ticket-table">
                    <thead>
                        <tr>
                            <th onClick={() => onSort('id')}>
                                Ticket ID {renderSortIcon('id')}
                            </th>
                            <th onClick={() => onSort('subject')}>
                                Subject {renderSortIcon('subject')}
                            </th>
                            <th onClick={() => onSort('customer')}>
                                Customer {renderSortIcon('customer')}
                            </th>
                            <th onClick={() => onSort('status')}>
                                Status {renderSortIcon('status')}
                            </th>
                            <th onClick={() => onSort('priority')}>
                                Priority {renderSortIcon('priority')}
                            </th>
                            <th onClick={() => onSort('date')}>
                                Date {renderSortIcon('date')}
                            </th>
                            <th></th>
                        </tr>
                    </thead>
                    <tbody>
                        {tickets.map((ticket) => (
                            <tr
                                key={ticket.id}
                                onDoubleClick={() => onRowDoubleClick && onRowDoubleClick(ticket)}
                                className="ticket-row"
                            >
                                <td className="ticket-id">{ticket.id}</td>
                                <td className="ticket-subject">{ticket.subject}</td>
                                <td>{ticket.customer}</td>
                                <td>
                                    <span className={`status - badge ${getStatusColor(ticket.status)} `}>
                                        {ticket.status}
                                    </span>
                                </td>
                                <td>
                                    <div className="priority-wrapper">
                                        <span className={`priority - dot ${getPriorityColor(ticket.priority)} `}></span>
                                        {ticket.priority}
                                    </div>
                                </td>
                                <td className="ticket-date">{ticket.date}</td>
                                <td>
                                    <button className="action-btn">
                                        <MoreHorizontal size={18} />
                                    </button>
                                </td>
                            </tr>
                        ))}
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default TicketTable;
