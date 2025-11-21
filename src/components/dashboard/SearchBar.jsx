import React from 'react';
import { Search } from 'lucide-react';
import './SearchBar.css';

const SearchBar = ({ value, onChange }) => {
    return (
        <div className="dashboard-search-container">
            <div className="search-input-wrapper">
                <Search className="search-icon" size={20} />
                <input
                    type="text"
                    placeholder="Search tickets, customers, status..."
                    value={value}
                    onChange={(e) => onChange(e.target.value)}
                    className="search-input"
                />
            </div>
        </div>
    );
};

export default SearchBar;
