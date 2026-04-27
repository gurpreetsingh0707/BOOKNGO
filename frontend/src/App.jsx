import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, useLocation } from 'react-router-dom';
import { AnimatePresence } from 'framer-motion';
import PageTransition from './components/PageTransition';
import { AuthContext } from './context/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/Register';
import Shows from './pages/Shows';
import Travel from './pages/Travel';
import Hotels from './pages/Hotels';
import BookingHistory from './pages/BookingHistory';
import AdminDashboard from './pages/AdminDashboard';
import AdminBookings from './pages/AdminBookings';
import AdminUsers from './pages/AdminUsers';
import AdminServices from './pages/AdminServices';
import { ToastContainer } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

const AnimatedRoutes = ({ auth }) => {
  const location = useLocation();
  return (
    <AnimatePresence mode="wait">
      <Routes location={location} key={location.pathname}>
        {/* Public Routes */}
        <Route path="/login" element={!auth ? <PageTransition><Login /></PageTransition> : <Navigate to="/" />} />
        <Route path="/register" element={!auth ? <PageTransition><Register /></PageTransition> : <Navigate to="/" />} />

        {/* Protected Routes */}
        <Route path="/" element={auth ? <PageTransition><Home /></PageTransition> : <Navigate to="/login" />} />
        <Route path="/shows" element={auth ? <PageTransition><Shows /></PageTransition> : <Navigate to="/login" />} />
        <Route path="/movies" element={<Navigate to="/shows" />} />
        <Route path="/travel" element={auth ? <PageTransition><Travel /></PageTransition> : <Navigate to="/login" />} />
        <Route path="/hotels" element={auth ? <PageTransition><Hotels /></PageTransition> : <Navigate to="/login" />} />
        <Route path="/bookings" element={auth ? <PageTransition><BookingHistory /></PageTransition> : <Navigate to="/login" />} />

        {/* Admin Routes */}
        <Route path="/admin" element={auth?.user?.role === 'admin' ? <PageTransition><AdminDashboard /></PageTransition> : <Navigate to="/" />} />
        <Route path="/admin/bookings" element={auth?.user?.role === 'admin' ? <PageTransition><AdminBookings /></PageTransition> : <Navigate to="/" />} />
        <Route path="/admin/users" element={auth?.user?.role === 'admin' ? <PageTransition><AdminUsers /></PageTransition> : <Navigate to="/" />} />
        <Route path="/admin/services" element={auth?.user?.role === 'admin' ? <PageTransition><AdminServices /></PageTransition> : <Navigate to="/" />} />
      </Routes>
    </AnimatePresence>
  );
};

const App = () => {
  const [auth, setAuth] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    const user = localStorage.getItem('user');
    if (token && user) {
      setAuth({ token, user: JSON.parse(user) });
    }
    setLoading(false);
  }, []);

  if (loading) return <div className="flex items-center justify-center h-screen bg-slate-900"><p className="text-white">Loading...</p></div>;

  return (
    <AuthContext.Provider value={{ auth, setAuth }}>
      <Router>
        <AnimatedRoutes auth={auth} />
      </Router>
      <ToastContainer 
        position="bottom-right"
        autoClose={3000}
        hideProgressBar={false}
        newestOnTop={false}
        closeOnClick
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
      />
    </AuthContext.Provider>
  );
};

export default App;