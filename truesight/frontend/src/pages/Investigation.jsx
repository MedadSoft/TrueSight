import React, { useState, useEffect } from 'react';
import { Search, Filter, Download, Eye, AlertTriangle, CheckCircle, MoreHorizontal } from 'lucide-react';
import './Investigation.css';

const Investigation = () => {
    const [filter, setFilter] = useState('all');
    const [transactions, setTransactions] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetchTransactions();
    }, []);

    const fetchTransactions = async () => {
        try {
            const response = await fetch('/api/investigation/data');
            const data = await response.json();
            setTransactions(data);
        } catch (error) {
            console.error('Error fetching transactions:', error);
        } finally {
            setLoading(false);
        }
    };

    const filteredTransactions = filter === 'all'
        ? transactions
        : transactions.filter(t => t.risk === filter.toUpperCase());

    return (
        <div className="investigation-page">
            <div className="page-header">
                <h1 className="page-title">Investigation Workspace</h1>
                <p className="page-subtitle">Review and adjudicate flagged transactions.</p>
            </div>

            <div className="toolbar">
                <div className="search-bar">
                    <Search size={18} />
                    <input type="text" placeholder="Search transactions..." />
                </div>

                <div className="filter-group">
                    <button
                        className={`filter - btn ${filter === 'all' ? 'active' : ''} `}
                        onClick={() => setFilter('all')}
                    >
                        All
                    </button>
                    <button
                        className={`filter - btn ${filter === 'high' ? 'active' : ''} `}
                        onClick={() => setFilter('high')}
                    >
                        High Risk
                    </button>
                    <button
                        className={`filter - btn ${filter === 'medium' ? 'active' : ''} `}
                        onClick={() => setFilter('medium')}
                    >
                        Medium Risk
                    </button>
                </div>

                <div className="actions">
                    <button className="btn btn-outline btn-sm">
                        <Filter size={16} /> Filter
                    </button>
                    <button className="btn btn-outline btn-sm">
                        <Download size={16} /> Export
                    </button>
                </div>
            </div>

            <div className="card no-padding">
                <table className="investigation-table">
                    <thead>
                        <tr>
                            <th>Transaction ID</th>
                            <th>Risk Level</th>
                            <th>Score</th>
                            <th>Amount</th>
                            <th>Type</th>
                            <th>AI Explanation</th>
                            <th>Status</th>
                            <th>Actions</th>
                        </tr>
                    </thead>
                    <tbody>
                        {filteredTransactions.map((txn) => (
                            <tr key={txn.id}>
                                <td className="font-medium">{txn.id}</td>
                                <td>
                                    <span className={`badge badge - ${txn.risk.toLowerCase()} `}>
                                        {txn.risk}
                                    </span>
                                </td>
                                <td>
                                    <div className="score-indicator">
                                        <div
                                            className="score-bar"
                                            style={{
                                                width: `${txn.score}% `,
                                                backgroundColor: txn.score > 80 ? '#dc2626' : txn.score > 50 ? '#eab308' : '#22c55e'
                                            }}
                                        ></div>
                                        <span>{txn.score}</span>
                                    </div>
                                </td>
                                <td>${txn.amount.toLocaleString()}</td>
                                <td>{txn.type}</td>
                                <td className="explanation-cell">{txn.explanation}</td>
                                <td>
                                    <span className={`status - dot status - ${txn.status.toLowerCase().replace(' ', '-')} `}></span>
                                    {txn.status}
                                </td>
                                <td>
                                    <button className="action-btn">
                                        <Eye size={18} />
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

export default Investigation;
