import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Header from './components/layout/Header';
import Footer from './components/layout/Footer';
import Home from './pages/Home';
import Login from './pages/Login';
import LoadingSpinner from './components/common/LoadingSpinner';

// Placeholder pages (criar depois)
import News from './pages/News';
import NewsDetail from './pages/NewsDetail';
import CategoryPage from './pages/CategoryPage';
import AdminDashboard from './pages/Admin/Dashboard';
import CreateNews from './pages/Admin/CreateNews';
import CreateVideo from './pages/Admin/CreateVideo';
import ManageSubjects from './pages/Admin/ManageSubjects';

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  if (loading) {
    return <LoadingSpinner fullScreen />;
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  return children;
};

// Layout Component
const Layout = ({ children }) => {
  return (
    <div className="flex flex-col min-h-screen">
      <Header />
      <main className="flex-1">{children}</main>
      <Footer />
    </div>
  );
};

function AppRoutes() {
  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/"
          element={
            <Layout>
              <Home />
            </Layout>
          }
        />
        <Route
          path="/news"
          element={
            <Layout>
              <News />
            </Layout>
          }
        />
        <Route
          path="/news/:id"
          element={
            <Layout>
              <NewsDetail />
            </Layout>
          }
        />
        <Route
          path="/category/:slug"
          element={
            <Layout>
              <CategoryPage />
            </Layout>
          }
        />
        
        {/* Login Route (no header/footer) */}
        <Route path="/login" element={<Login />} />

        {/* Protected Admin Routes */}
        <Route
          path="/admin"
          element={
            <ProtectedRoute>
              <Layout>
                <AdminDashboard />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/news/create"
          element={
            <ProtectedRoute>
              <Layout>
                <CreateNews />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/video/create"
          element={
            <ProtectedRoute>
              <Layout>
                <CreateVideo />
              </Layout>
            </ProtectedRoute>
          }
        />
        <Route
          path="/admin/subjects"
          element={
            <ProtectedRoute>
              <Layout>
                <ManageSubjects />
              </Layout>
            </ProtectedRoute>
          }
        />

        {/* 404 */}
        <Route
          path="*"
          element={
            <Layout>
              <div className="container-custom py-20 text-center">
                <h1 className="text-6xl font-bold text-gray-300 mb-4">404</h1>
                <p className="text-xl text-gray-600">Página não encontrada</p>
              </div>
            </Layout>
          }
        />
      </Routes>
    </Router>
  );
}

function App() {
  return (
    <AuthProvider>
      <AppRoutes />
    </AuthProvider>
  );
}

export default App;
