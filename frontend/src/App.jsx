import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Navbar from './components/Navbar';
import ScrollToTop from './components/ScrollToTop';

// Pages
import HomePage from './pages/HomePage';
import LoginPage from './pages/LoginPage';
import SignupPage from './pages/SignupPage';
import SearchResultsPage from './pages/SearchResultsPage';
import ProfessorProfilePage from './pages/ProfessorProfilePage';
import WriteReviewPage from './pages/WriteReviewPage';
import DashboardPage from './pages/DashboardPage';
import AddProfessorPage from './pages/AddProfessorPage';
import AdminDashboardPage from './pages/AdminDashboardPage';

const ProtectedRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!user) return <Navigate to="/login" />;
  return children;
};

const AdminRoute = ({ children }) => {
  const { user, loading, isAdmin } = useAuth();

  if (loading) return (
    <div className="min-h-screen bg-dark-900 flex items-center justify-center">
      <div className="w-8 h-8 border-4 border-primary-500 border-t-transparent rounded-full animate-spin"></div>
    </div>
  );

  if (!user || !isAdmin) return <Navigate to="/" />;
  return children;
};

function App() {
  return (
    <Router>
      <ScrollToTop />
      <div className="min-h-screen bg-dark-900 text-slate-200">
        <Navbar />
        <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <Routes>
            <Route path="/" element={<HomePage />} />
            <Route path="/login" element={<LoginPage />} />
            <Route path="/signup" element={<SignupPage />} />
            <Route path="/search" element={<SearchResultsPage />} />
            <Route path="/professors/:id" element={<ProfessorProfilePage />} />

            <Route path="/professors/:id/review" element={
              <ProtectedRoute>
                <WriteReviewPage />
              </ProtectedRoute>
            } />

            <Route path="/dashboard" element={
              <ProtectedRoute>
                <DashboardPage />
              </ProtectedRoute>
            } />

            <Route path="/add-professor" element={
              <ProtectedRoute>
                <AddProfessorPage />
              </ProtectedRoute>
            } />

            <Route path="/admin" element={
              <AdminRoute>
                <AdminDashboardPage />
              </AdminRoute>
            } />
          </Routes>
        </main>
      </div>
    </Router>
  );
}

export default App;
