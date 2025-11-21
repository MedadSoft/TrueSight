import React from 'react';
import './StatsCard.css';

const StatsCard = ({ title, value, icon: Icon, trend, trendValue, color }) => {
    return (
        <div className="stats-card">
            <div className="stats-header">
                <span className="stats-title">{title}</span>
                <div className={`stats-icon-wrapper ${color}`}>
                    <Icon size={20} />
                </div>
            </div>

            <div className="stats-body">
                <h3 className="stats-value">{value}</h3>
                {trend && (
                    <div className={`stats-trend ${trend === 'up' ? 'trend-up' : 'trend-down'}`}>
                        <span>{trend === 'up' ? '↑' : '↓'}</span>
                        <span>{trendValue}</span>
                    </div>
                )}
            </div>
        </div>
    );
};

export default StatsCard;
