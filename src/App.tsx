import { Navigate, Route, Routes } from 'react-router-dom';
import { Layout } from './components/Layout';
import { ProtectedRoute } from './components/ProtectedRoute';
import AddVisitorPage from './pages/AddVisitorPage';
import LoginPage from './pages/LoginPage';
import VisitorListPage from './pages/VisitorListPage';

export default function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route
        path="/visitors"
        element={
          <ProtectedRoute>
            <Layout>
              <VisitorListPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route
        path="/visitors/new"
        element={
          <ProtectedRoute>
            <Layout>
              <AddVisitorPage />
            </Layout>
          </ProtectedRoute>
        }
      />
      <Route path="/" element={<Navigate to="/visitors" replace />} />
      <Route path="*" element={<Navigate to="/visitors" replace />} />
    </Routes>
  );
}
