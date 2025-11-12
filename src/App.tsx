import { Toaster } from "react-hot-toast";
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import { ThemeProvider } from './contexts/ThemeContext';
import ClientDetail from './pages/ClientDetail';
import Dashboard from './pages/Dashboard';
import Login from "./pages/login"; // 👈
import Metrics from './pages/Metrics';

export function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />

          {/* Protégé par layout */}
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/client/:id" element={<ClientDetail />} />
            <Route path="/metrics" element={<Metrics />} />
          </Route>
        </Routes>

        <Toaster position="top-right" reverseOrder={false} />
      </Router>
    </ThemeProvider>
  );
}
