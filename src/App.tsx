import React, { useState } from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { DndContext, DragEndEvent } from '@dnd-kit/core';
// Pages
import Dashboard from './pages/Dashboard';
import ClientDetail from './pages/ClientDetail';
import Metrics from './pages/Metrics';
import Layout from './components/Layout';
import { ThemeProvider } from './contexts/ThemeContext';
export function App() {
  return <ThemeProvider>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<Dashboard />} />
            <Route path="/client/:id" element={<ClientDetail />} />
            <Route path="/metrics" element={<Metrics />} />
          </Routes>
        </Layout>
      </Router>
    </ThemeProvider>;
}