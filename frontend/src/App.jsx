import { Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider } from './context/AuthContext';
import ProtectedRoute from './components/ProtectedRoute';

import Landing from './pages/Landing';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import Recommend from './pages/Recommend';
import History from './pages/History';
import Weather from './pages/Weather';
import Profile from './pages/Profile';

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
          element={<ProtectedRoute><Dashboard /></ProtectedRoute>}
        />
        <Route
          path="/recommend"
          element={<ProtectedRoute><Recommend /></ProtectedRoute>}
        />
        <Route
          path="/history"
          element={<ProtectedRoute><History /></ProtectedRoute>}
        />
        <Route
          path="/weather"
          element={<ProtectedRoute><Weather /></ProtectedRoute>}
        />
        <Route
          path="/profile"
          element={<ProtectedRoute><Profile /></ProtectedRoute>}
        />

        <Route path="*" element={<Navigate to="/" replace />} />
      </Routes>
    </AuthProvider>
  );
}

export default App;
