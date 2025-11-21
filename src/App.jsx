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

import Users from './pages/Users';

import Login from './pages/Login';

function App() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingTask, setEditingTask] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const [sortConfig, setSortConfig] = useState({ key: null, direction: 'ascending' });
  const [notification, setNotification] = useState({ show: false, message: '' });

  // Auth State
  const [currentUser, setCurrentUser] = useState(() => {
    try {
      const savedUser = localStorage.getItem('ticketflow_current_user');
      return savedUser ? JSON.parse(savedUser) : null;
    } catch (error) {
      return null;
    }
  });

  // Users with LocalStorage
  const [users, setUsers] = useState(() => {
    try {
      const savedUsers = localStorage.getItem('ticketflow_users');
      return savedUsers ? JSON.parse(savedUsers) : [
        { id: 'U-1', name: 'Admin User', email: 'admin@ticketflow.com', role: 'Admin', managerId: '' },
        { id: 'U-FM1', name: 'Sarah Manager', email: 'sarah@ticketflow.com', role: 'Finance Manager', managerId: '' },
        { id: 'U-FO1', name: 'Mike Officer', email: 'mike@ticketflow.com', role: 'Finance Officer', managerId: 'U-FM1' },
        { id: 'U-FM2', name: 'John Manager', email: 'john@ticketflow.com', role: 'Finance Manager', managerId: '' },
        { id: 'U-FO3', name: 'Jane Officer', email: 'jane@ticketflow.com', role: 'Finance Officer', managerId: 'U-FM2' },
      ];
    } catch (error) {
      console.error('Error parsing users from localStorage:', error);
      return [];
    }
  });

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
        { id: 'T-1', subject: 'FO1 Ticket (Team A)', customer: 'Acme Corp', status: 'Open', priority: 'High', date: '2 hours ago', createdById: 'U-FO1', assignedToId: 'U-FO1' },
        { id: 'T-2', subject: 'FM1 Ticket (Team A)', customer: 'Globex Inc', status: 'In Progress', priority: 'Critical', date: '5 hours ago', createdById: 'U-FM1', assignedToId: 'U-FO1' },
        { id: 'T-3', subject: 'Team B Ticket', customer: 'Soylent Corp', status: 'Open', priority: 'Low', date: '1 day ago', createdById: 'U-FO3', assignedToId: 'U-FO3' },
      ];
    } catch (error) {
      console.error('Error parsing tickets from localStorage:', error);
      return [
        { id: 'T-1', subject: 'FO1 Ticket (Team A)', customer: 'Acme Corp', status: 'Open', priority: 'High', date: '2 hours ago', createdById: 'U-FO1', assignedToId: 'U-FO1' },
        { id: 'T-2', subject: 'FM1 Ticket (Team A)', customer: 'Globex Inc', status: 'In Progress', priority: 'Critical', date: '5 hours ago', createdById: 'U-FM1', assignedToId: 'U-FO1' },
        { id: 'T-3', subject: 'Team B Ticket', customer: 'Soylent Corp', status: 'Open', priority: 'Low', date: '1 day ago', createdById: 'U-FO3', assignedToId: 'U-FO3' },
      ];
    }
  });

  // Persist Current User
  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('ticketflow_current_user', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('ticketflow_current_user');
    }
  }, [currentUser]);

  // Persist Users
  useEffect(() => {
    localStorage.setItem('ticketflow_users', JSON.stringify(users));
  }, [users]);

  // Persist Dropdown Options
  useEffect(() => {
    localStorage.setItem('ticketflow_options', JSON.stringify(dropdownOptions));
  }, [dropdownOptions]);

  // Persist Tickets
  useEffect(() => {
    localStorage.setItem('ticketflow_tickets', JSON.stringify(tickets));
  }, [tickets]);

  const handleLogin = (username, password, setError) => {
    if (password !== '123') {
      setError('Invalid password');
      return;
    }

    const email = `${username}@ticketflow.com`;
    const user = users.find(u => u.email.toLowerCase() === email.toLowerCase());

    if (user) {
      setCurrentUser(user);
    } else {
      setError('User not found');
    }
  };

  const handleLogout = () => {
    setCurrentUser(null);
  };

  // Helper to get team members
  const getTeamMembers = (user) => {
    if (!user) return [];
    if (user.role === 'Admin') return users.map(u => u.id); // Admin sees all

    let teamIds = [user.id];

    if (user.role === 'Finance Manager') {
      // Add direct reports
      const reports = users.filter(u => u.managerId === user.id).map(u => u.id);
      teamIds = [...teamIds, ...reports];
    } else if (user.role === 'Finance Officer') {
      // Add manager
      if (user.managerId) {
        teamIds.push(user.managerId);
        // Add peers (same manager)
        const peers = users.filter(u => u.managerId === user.managerId && u.id !== user.id).map(u => u.id);
        teamIds = [...teamIds, ...peers];
      }
    }
    return teamIds;
  };

  // Filter tickets based on RBAC
  const visibleTickets = React.useMemo(() => {
    if (!currentUser) return [];
    if (currentUser.role === 'Admin') return tickets;

    const teamIds = getTeamMembers(currentUser);
    return tickets.filter(ticket => {
      const createdByTeam = teamIds.includes(ticket.createdById);
      const assignedToTeam = teamIds.includes(ticket.assignedToId);
      return createdByTeam || assignedToTeam;
    });
  }, [currentUser, tickets, users]);

  const stats = React.useMemo(() => {
    const total = visibleTickets.length;
    const pending = visibleTickets.filter(t => t.status !== 'Closed' && t.status !== 'Resolved').length;
    const resolved = visibleTickets.filter(t => t.status === 'Closed' || t.status === 'Resolved').length;
    const critical = visibleTickets.filter(t => t.priority === 'Critical').length;

    const getPercentage = (count) => total > 0 ? Math.round((count / total) * 100) : 0;

    return [
      { title: 'Total Tickets', value: total, icon: Ticket, color: 'blue', trend: 'neutral', trendValue: '100%' },
      { title: 'Pending', value: pending, icon: Clock, color: 'orange', trend: 'neutral', trendValue: `${getPercentage(pending)}%` },
      { title: 'Resolved', value: resolved, icon: CheckCircle, color: 'green', trend: 'neutral', trendValue: `${getPercentage(resolved)}%` },
      { title: 'Critical', value: critical, icon: AlertCircle, color: 'purple', trend: 'neutral', trendValue: `${getPercentage(critical)}%` },
    ];
  }, [visibleTickets]);

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
      // Create new task with auto-generated ID and creator
      const newTask = {
        ...task,
        id: generateNextId(),
        createdById: currentUser.id
      };
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

  const filteredTickets = visibleTickets.filter(ticket => {
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

  if (!currentUser) {
    return <Login onLogin={handleLogin} />;
  }

  return (
    <Router>
      <Layout onLogout={handleLogout} user={currentUser}>
        <Routes>
          <Route path="/" element={
            <Dashboard
              stats={stats}
              tickets={visibleTickets} // Pass visible tickets to dashboard (e.g. for recent activity if added later)
              onCreateClick={() => setIsModalOpen(true)}
              user={currentUser}
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
          <Route path="/users" element={
            <Users
              users={users}
              setUsers={setUsers}
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
          currentUser={currentUser}
          users={users}
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

