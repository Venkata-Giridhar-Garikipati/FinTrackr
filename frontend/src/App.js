import React from 'react';
import { BrowserRouter as Router, Routes, Route, useLocation } from 'react-router-dom';
import Navbar from './components/Navbar';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import HomePage from './pages/HomePage';
import LoanForm from './components/LoanForm';
import LoanList from './components/LoanList';
import Dashboards from './components/Dashboards';
import LoanEdit from './components/LoanEdit';
import LoanPay from './components/LoanPay';
import Report from './pages/Report';
import Notifications from './components/Notifications';
import LandingPage from './pages/LandingPage';

const App = () => {
    return (
        <Router>
            <ConditionalNavbar />
            <Routes>
                <Route path="/home" element={<HomePage />} />
                <Route path="/login" element={<LoginPage />} />
                <Route path="/signup" element={<SignupPage />} />
                <Route path="/loan-form" element={<LoanForm />} />
                <Route path="/loan-list" element={<LoanList />} />
                <Route path="/dashboards" element={<Dashboards />} />
                <Route path="/loan-edit" element={<LoanEdit />} />
                <Route path="/pay" element={<LoanPay />} />
                <Route path="/report" element={<Report />} />
                <Route path="/notifications" element={<Notifications />} />
                <Route path="/" element={<LandingPage />} />
            </Routes>
        </Router>
    );
};

// Component to conditionally render Navbar
const ConditionalNavbar = () => {
    const location = useLocation();
    const hideNavbarRoutes = ['/', '/login', '/signup']; // Routes where Navbar should be hidden
    const showNavbar = !hideNavbarRoutes.includes(location.pathname);
    return showNavbar && <Navbar />;
};

export default App;
