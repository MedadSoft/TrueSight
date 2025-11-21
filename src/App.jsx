import React, { useState, useEffect } from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/layout/Layout'
import CreateTaskModal from './components/dashboard/CreateTaskModal'
import Dashboard from './pages/Dashboard'
import Tickets from './pages/Tickets'
import { Ticket, Clock, CheckCircle, AlertCircle } from 'lucide-react'
import './App.css'


import Notification from './components/common/Notification'

import Settings from './pages/Settings';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [notification, setNotification] = useState({ show: false, message: '' });

  // Dynamic Dropdown Options with LocalStorage
  const [dropdownOptions, setDropdownOptions] = useState(() => {
    try {
      const savedOptions = localStorage.getItem('ticketflow_options');
      return savedOptions ? JSON.parse(savedOptions) : {
        status: ['Open', 'In Progress', 'Closed'],
        priority: ['Low', 'Medium', 'High', 'Critical'],
        category: ['Bug', 'Feature', 'Support']
      };
    } catch (error) {
      console.error('Error parsing dropdown options from localStorage:', error);
      return {
        status: ['Open', 'In Progress', 'Closed'],
        priority: ['Low', 'Medium', 'High', 'Critical'],
        category: ['Bug', 'Feature', 'Support']
      };
    }
  });

  // Tickets with LocalStorage
  const [tickets, setTickets] = useState(() => {
    try {
      const savedTickets = localStorage.getItem('ticketflow_tickets');
      return savedTickets ? JSON.parse(savedTickets) : [
        { id: 'T-1024', subject: 'Login page not loading', customer: 'Acme Corp', status: 'Open', priority: 'High', date: '2 hours ago' },
        { id: 'T-1023', subject: 'Payment gateway error', customer: 'Globex Inc', status: 'In Progress', priority: 'Critical', date: '5 hours ago' },
        { id: 'T-1022', subject: 'Update user profile', customer: 'Soylent Corp', status: 'Closed', priority: 'Low', date: '1 day ago' },
        { id: 'T-1021', subject: 'Feature request: Dark mode', customer: 'Umbrella Corp', status: 'Open', priority: 'Medium', date: '1 day ago' },
        { id: 'T-1020', subject: 'Mobile view broken', customer: 'Cyberdyne', status: 'In Progress', priority: 'High', date: '2 days ago' },
      ];
    } catch (error) {
      console.error('Error parsing tickets from localStorage:', error);
      return [
        { id: 'T-1024', subject: 'Login page not loading', customer: 'Acme Corp', status: 'Open', priority: 'High', date: '2 hours ago' },
        { id: 'T-1023', subject: 'Payment gateway error', customer: 'Globex Inc', status: 'In Progress', priority: 'Critical', date: '5 hours ago' },
        { id: 'T-1022', subject: 'Update user profile', customer: 'Soylent Corp', status: 'Closed', priority: 'Low', date: '1 day ago' },
        { id: 'T-1021', subject: 'Feature request: Dark mode', customer: 'Umbrella Corp', status: 'Open', priority: 'Medium', date: '1 day ago' },
        { id: 'T-1020', subject: 'Mobile view broken', customer: 'Cyberdyne', status: 'In Progress', priority: 'High', date: '2 days ago' },
      ];
    }
  });

  // Persist Dropdown Options
  useEffect(() => {
    localStorage.setItem('ticketflow_options', JSON.stringify(dropdownOptions));
  }, [dropdownOptions]);

  // Persist Tickets
  useEffect(() => {
    localStorage.setItem('ticketflow_tickets', JSON.stringify(tickets));
  }, [tickets]);

  const stats = React.useMemo(() => {
    const total = tickets.length;
    const pending = tickets.filter(t => t.status !== 'Closed' && t.status !== 'Resolved').length;
    const resolved = tickets.filter(t => t.status === 'Closed' || t.status === 'Resolved').length;
    const critical = tickets.filter(t => t.priority === 'Critical').length;

    const getPercentage = (count) => total > 0 ? Math.round((count / total) * 100) : 0;

    return [
      { title: 'Total Tickets', value: total, icon: Ticket, color: 'blue', trend: 'neutral', trendValue: '100%' },
      { title: 'Pending', value: pending, icon: Clock, color: 'orange', trend: 'neutral', trendValue: `${getPercentage(pending)}%` },
      { title: 'Resolved', value: resolved, icon: CheckCircle, color: 'green', trend: 'neutral', trendValue: `${getPercentage(resolved)}%` },
      { title: 'Critical', value: critical, icon: AlertCircle, color: 'purple', trend: 'neutral', trendValue: `${getPercentage(critical)}%` },
    ];
  }, [tickets]);

  const generateNextId = () => {
    const ids = tickets.map(t => parseInt(t.id.replace('T-', ''), 10));
    const maxId = Math.max(...ids, 0); // Default to 0 if no tickets
    const nextId = maxId + 1;
    return `T-${String(nextId).padStart(4, '0')}`;
  };

  const handleCreateTask = (task) => {
    if (editingTask) {
      // Update existing task
      setTickets(tickets.map(t => t.id === task.id ? task : t));
      setEditingTask(null);
    } else {
      // Create new task with auto-generated ID
      const newTask = { ...task, id: generateNextId() };
      setTickets([newTask, ...tickets]);

      // Show notification
      setNotification({ show: true, message: `Ticket ${newTask.id} created successfully` });
      setTimeout(() => {
        setNotification({ show: false, message: '' });
      }, 5000);
    }
  };

  const handleEditTask = (task) => {
    setEditingTask(task);
    setIsModalOpen(true);
  };

  const handleDeleteTask = (taskId) => {
    setTickets(tickets.filter(t => t.id !== taskId));
  };

  const handleCloseModal = () => {
    setIsModalOpen(false);
    setEditingTask(null);
  };

  const handleViewAll = () => {
    setSearchQuery('');
  };

  const filteredTickets = tickets.filter(ticket => {
    const isActive = ticket.status !== 'Closed' && ticket.status !== 'Resolved';
    const matchesSearch = Object.values(ticket).some(value =>
      String(value).toLowerCase().includes(searchQuery.toLowerCase())
    );
    return isActive && matchesSearch;
  });

  const sortedTickets = React.useMemo(() => {
    let sortableItems = [...filteredTickets];
    if (sortConfig.key !== null) {
      sortableItems.sort((a, b) => {
        if (a[sortConfig.key] < b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? -1 : 1;
        }
        if (a[sortConfig.key] > b[sortConfig.key]) {
          return sortConfig.direction === 'ascending' ? 1 : -1;
        }
        return 0;
      });
    }
    return sortableItems;
  }, [filteredTickets, sortConfig]);

  const handleSort = (key) => {
    let direction = 'ascending';
    if (sortConfig.key === key && sortConfig.direction === 'ascending') {
      direction = 'descending';
    }
    setSortConfig({ key, direction });
  };

  return (
    <Router>
      <Layout>
        <Routes>
          <Route path="/" element={
            <Dashboard
              stats={stats}
              tickets={tickets}
              onCreateClick={() => setIsModalOpen(true)}
            />
          } />
          <Route path="/tickets" element={
            <Tickets
              tickets={sortedTickets}
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              sortConfig={sortConfig}
              onSort={handleSort}
              onCreateClick={() => setIsModalOpen(true)}
              onViewAll={handleViewAll}
              onRowDoubleClick={handleEditTask}
            />
          } />
          <Route path="/settings" element={
            <Settings
              dropdownOptions={dropdownOptions}
              onUpdateOptions={setDropdownOptions}
            />
          } />
        </Routes>

        <CreateTaskModal
          isOpen={isModalOpen}
          onClose={handleCloseModal}
          onSave={handleCreateTask}
          taskToEdit={editingTask}
          dropdownOptions={dropdownOptions}
        />

        <Notification
          show={notification.show}
          message={notification.message}
          onClose={() => setNotification({ show: false, message: '' })}
        />
      </Layout>
    </Router>
  )
}

export default App

