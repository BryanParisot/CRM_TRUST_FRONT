import { Toaster } from "react-hot-toast";
import { Route, BrowserRouter as Router, Routes, useLocation } from 'react-router-dom';
import Layout from './components/Layout';
import ClientPortalLayout from './components/ClientPortalLayout';
import ClientDeliveryPage from './pages/ClientDeliveryPage';
import ClientOverviewPage from './pages/ClientOverviewPage';
import { ThemeProvider } from './contexts/ThemeContext';
import ClientDetail from './pages/ClientDetail';
import ClientPaymentPage from "./pages/ClientPaymentPage";
import ClientPublicPage from "./pages/ClientPublicPage";
import ClientPublicRouter from "./pages/ClientRouterPublic";
import ClientSelectionConfirmation from "./pages/ClientSelectionConfirmation";
import Dashboard from './pages/Dashboard';
import Login from "./pages/Login";
import Metrics from './pages/Metrics';
import ClientChecklistPage from "./pages/ClientChecklistPage";
import ClientSuccessPage from "./pages/ClientSuccessPage";
import ClientPaymentThankYouPage from "./pages/ClientPaymentThankYouPage";
import ClientProfile from './pages/ClientProfile';
import ClientsList from './pages/ClientsList';


import ClientSettlementPage from './pages/ClientSettlementPage';
import ClientDocumentsPage from "./pages/ClientDocumentsPage";

function AppToaster(){
  const {pathname}=useLocation();
  return <Toaster position={pathname.startsWith('/client-link/')?'bottom-center':'top-right'} reverseOrder={false}/>;
}

export function App() {
  return (
    <ThemeProvider>
      <Router>
        <Routes>
          <Route path="/client-link/:token" element={<ClientPortalLayout />}>
            <Route path="delivery" element={<ClientDeliveryPage />} />
            <Route path="overview" element={<ClientOverviewPage />} />
            <Route index element={<ClientPublicRouter />} />
            <Route path="settlement" element={<ClientSettlementPage />} />
            <Route path="documents" element={<ClientDocumentsPage />} />
            <Route path="payment" element={<ClientPaymentPage />} />
            <Route path="confirmation" element={<ClientSelectionConfirmation />} />
            <Route path="select" element={<ClientPublicPage />} />
            <Route path="checklist" element={<ClientChecklistPage />} />
            <Route path="success" element={<ClientSuccessPage />} />
            <Route path="payment-thank-you" element={<ClientPaymentThankYouPage />} />
          </Route>
          <Route path="/login" element={<Login />} />
          {/* Protégé par layout */}
          <Route element={<Layout />}>
            <Route path="/" element={<Dashboard />} />
            <Route path="/clients" element={<ClientsList />} />
            <Route path="/client/:id" element={<ClientDetail />} />
            <Route path="/client/:id/profile" element={<ClientProfile />} />
            <Route path="/metrics" element={<Metrics />} />
          </Route>
        </Routes>

        <AppToaster />
      </Router>
    </ThemeProvider>
  );
}
