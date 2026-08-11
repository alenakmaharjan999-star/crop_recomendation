import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Recommend from './pages/Recommend';
import History from './pages/History';
import Weather from './pages/Weather';
import Profile from './pages/Profile';
import AdminDashboard from './admin/pages/AdminDashboard';
import AdminUsers from './admin/pages/AdminUsers';
import AdminPredictions from './admin/pages/AdminPredictions';
import AdminReports from './admin/pages/AdminReports';

function AdminRoute({ children }) {
  const { isAuthenticated, user } = useAuth();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  if (user?.role !== 'Admin') {
    return <Navigate to="/dashboard" replace />;
  }

  return children;
}

function App() {
  return (
    <AuthProvider>
      <Routes>
        <Route path="/" element={<Landing />} />
        <Route path="/login" element={<Login />} />
        <Route path="/signup" element={<Register />} />
        <Route path="/test-form" element={<Recommend />} />

        <Route
          path="/dashboard"
          element={<Dashboard/>}
          // element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
        />
        <Route
          path="/recommend"
          element={<Recommend/>}
          // element={<ProtectedRoute><Recommend /></ProtectedRoute>}
        />
        <Route
          path="/history"
          element={<History/>}
          // element={<ProtectedRoute><History /></ProtectedRoute>}
        />
        <Route
          path="/weather"
          element={<Weather/>}
          // element={<ProtectedRoute><Weather /></ProtectedRoute>}
        />
        <Route
          path="/profile"
          element={<Profile/>}
          // element={<ProtectedRoute><Profile /></ProtectedRoute>}
        />

        <Route path="/admin" element={<Navigate to="/admin/dashboard" replace />} />
        <Route
          path="/admin/dashboard"
          element={ <AdminDashboard />
            // <AdminRoute>
            //   <AdminDashboard />
            // </AdminRoute>
          }
        />
        <Route
          path="/admin/users"
          element={<AdminUsers />
            // <AdminRoute>
            //   <AdminUsers />
            // </AdminRoute>
          }
        />
        <Route
          path="/admin/predictions"
          element={<AdminPredictions />
            // <AdminRoute>
            //   <AdminPredictions />
            // </AdminRoute>
          }
        />
        <Route
          path="/admin/reports"
          element={<AdminReports />
            // <AdminRoute>
            //   <AdminSettings />
            // </AdminRoute>
          }
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
