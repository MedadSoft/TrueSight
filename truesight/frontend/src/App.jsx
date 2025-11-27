import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import Layout from './components/Layout';
import Dashboard from './pages/Dashboard';
import AnalysisStudio from './pages/AnalysisStudio';
import Investigation from './pages/Investigation';

// Placeholder components for routes not yet implemented
const Settings = () => <div className="p-8"><h1>Settings</h1><p>Coming soon...</p></div>;

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Layout />}>
          <Route index element={<Dashboard />} />
          <Route path="analysis" element={<AnalysisStudio />} />
          <Route path="investigation" element={<Investigation />} />
          <Route path="settings" element={<Settings />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;
