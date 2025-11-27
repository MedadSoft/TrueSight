import React, { useState } from 'react';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { AlertTriangle, CheckCircle, Clock, Activity } from 'lucide-react';
import './Dashboard.css';

const Dashboard = () => {
    const [stats, setStats] = useState({
        total_analyzed: 0,
        high_risk: 0,
        medium_risk: 0,
        low_risk: 0,
        avg_processing: 0
    });

    React.useEffect(() => {
        fetchStats();
    }, []);

    const fetchStats = async () => {
        try {
            const response = await fetch('/api/stats');
            const data = await response.json();
            setStats(data);
        } catch (error) {
            console.error('Error fetching stats:', error);
        }
    };

    // Mock data - will be replaced with API data later
    const riskData = [
        { name: 'Low Risk', value: stats.low_risk, color: '#22c55e' },
        { name: 'Medium Risk', value: stats.medium_risk, color: '#eab308' },
        { name: 'High Risk', value: stats.high_risk, color: '#ef4444' },
    ];

    const activityData = [
        { name: 'Mon', transactions: 400, alerts: 24 },
        { name: 'Tue', transactions: 300, alerts: 18 },
        { name: 'Wed', transactions: 550, alerts: 35 },
        { name: 'Thu', transactions: 450, alerts: 28 },
        { name: 'Fri', transactions: 600, alerts: 42 },
    ];

    return (
        <div className="dashboard-page">
            <div className="page-header">
                <h1 className="page-title">Dashboard</h1>
                <p className="page-subtitle">Overview of financial crime analysis and system status.</p>
            </div>

            <div className="stats-grid">
                <div className="stats-card">
                    <div className="stats-icon bg-blue-100 text-blue-600">
                        <Activity size={24} />
                    </div>
                    <div className="stats-info">
                        <span className="stats-label">Total Analyzed</span>
                        <span className="stats-value">{stats.total_analyzed.toLocaleString()}</span>
                    </div>
                </div>

                <div className="stats-card">
                    <div className="stats-icon bg-red-100 text-red-600">
                        <AlertTriangle size={24} />
                    </div>
                    <div className="stats-info">
                        <span className="stats-label">High Risk Detected</span>
                        <span className="stats-value">{stats.high_risk.toLocaleString()}</span>
                    </div>
                </div>

                <div className="stats-card">
                    <div className="stats-icon bg-green-100 text-green-600">
                        <CheckCircle size={24} />
                    </div>
                    <div className="stats-info">
                        <span className="stats-label">Medium Risk</span>
                        <span className="stats-value">{stats.medium_risk.toLocaleString()}</span>
                    </div>
                </div>

                <div className="stats-card">
                    <div className="stats-icon bg-purple-100 text-purple-600">
                        <Clock size={24} />
                    </div>
                    <div className="stats-info">
                        <span className="stats-label">Avg Processing</span>
                        <span className="stats-value">{stats.avg_processing}s</span>
                    </div>
                </div>
            </div>

            <div className="charts-grid">
                <div className="card chart-card">
                    <h3>Risk Distribution</h3>
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height={300}>
                            <PieChart>
                                <Pie
                                    data={riskData}
                                    cx="50%"
                                    cy="50%"
                                    innerRadius={60}
                                    outerRadius={80}
                                    paddingAngle={5}
                                    dataKey="value"
                                >
                                    {riskData.map((entry, index) => (
                                        <Cell key={`cell-${index}`} fill={entry.color} />
                                    ))}
                                </Pie>
                                <Tooltip />
                            </PieChart>
                        </ResponsiveContainer>
                        <div className="chart-legend">
                            {riskData.map((item, index) => (
                                <div key={index} className="legend-item">
                                    <span className="legend-dot" style={{ backgroundColor: item.color }}></span>
                                    <span>{item.name} ({item.value}%)</span>
                                </div>
                            ))}
                        </div>
                    </div>
                </div>

                <div className="card chart-card">
                    <h3>Weekly Activity</h3>
                    <div className="chart-container">
                        <ResponsiveContainer width="100%" height={300}>
                            <BarChart data={activityData}>
                                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                                <XAxis dataKey="name" />
                                <YAxis />
                                <Tooltip />
                                <Bar dataKey="transactions" fill="#3b82f6" radius={[4, 4, 0, 0]} />
                                <Bar dataKey="alerts" fill="#ef4444" radius={[4, 4, 0, 0]} />
                            </BarChart>
                        </ResponsiveContainer>
                    </div>
                </div>
            </div>

            <div className="card">
                <h3>Recent High Risk Alerts</h3>
                <table className="data-table">
                    <thead>
                        <tr>
                            <th>ID</th>
                            <th>Type</th>
                            <th>Amount</th>
                            <th>Risk Score</th>
                            <th>Status</th>
                            <th>Time</th>
                        </tr>
                    </thead>
                    <tbody>
                        <tr>
                            <td>TXN-8832</td>
                            <td>Suspicious Transfer</td>
                            <td>$12,450.00</td>
                            <td><span className="badge badge-high">92/100</span></td>
                            <td><span className="status status-new">New</span></td>
                            <td>10 mins ago</td>
                        </tr>
                        <tr>
                            <td>TXN-8831</td>
                            <td>Velocity Check</td>
                            <td>$450.00</td>
                            <td><span className="badge badge-high">88/100</span></td>
                            <td><span className="status status-review">In Review</span></td>
                            <td>25 mins ago</td>
                        </tr>
                        <tr>
                            <td>TXN-8829</td>
                            <td>New Beneficiary</td>
                            <td>$8,900.00</td>
                            <td><span className="badge badge-high">85/100</span></td>
                            <td><span className="status status-new">New</span></td>
                            <td>42 mins ago</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    );
};

export default Dashboard;
