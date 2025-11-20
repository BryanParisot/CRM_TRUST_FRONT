import { Toaster } from "react-hot-toast";
import { Route, BrowserRouter as Router, Routes } from 'react-router-dom';
import Layout from './components/Layout';
import { ThemeProvider } from './contexts/ThemeContext';
import ClientDetail from './pages/ClientDetail';
import ClientPaymentPage from "./pages/ClientPaymentPage";
import ClientPublicPage from "./pages/ClientPublicPage";
import ClientPublicRouter from "./pages/ClientRouterPublic";
import ClientSelectionConfirmation from "./pages/ClientSelectionConfirmation";
import Dashboard from './pages/Dashboard';
import Login from "./pages/login"; // 👈
import Metrics from './pages/Metrics';
import ClientChecklistPage from "./pages/ClientChecklistPage";
import ClientSuccessPage from "./pages/ClientSuccessPage";
import ClientPaymentThankYouPage from "./pages/ClientPaymentThankYouPage";


export function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/client-link/:token" element={<ClientPublicRouter />} />
          <Route path="/client-link/:token/payment" element={<ClientPaymentPage />} />
          <Route path="/client-link/:token/confirmation" element={<ClientSelectionConfirmation />} />
          <Route path="/client-link/:token/select" element={<ClientPublicPage />} />
          <Route path="/client-link/:token/checklist" element={<ClientChecklistPage />} />
          <Route path="/client-link/:token/success" element={<ClientSuccessPage />} />
          <Route path="/client-link/:token/payment-thank-you" element={<ClientPaymentThankYouPage />} />
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
