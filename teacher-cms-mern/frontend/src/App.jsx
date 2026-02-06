import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, useAuth } from './context/AuthContext';
import Navbar from './components/Layout/Navbar';
import Sidebar from './components/Layout/Sidebar';
import Login from './pages/Login';
import Register from './pages/Register';
import Dashboard from './pages/Dashboard';
import ClassList from './pages/Classes/ClassList';
import ClassCreate from './pages/Classes/ClassCreate';
import ClassDetail from './pages/Classes/ClassDetail';
import StudentList from './pages/Students/StudentList';
import StudentDetail from './pages/Students/StudentDetail';
import CreateInstitute from './pages/Institute/CreateInstitute';
import QuestionBank from './pages/Quizzes/QuestionBank';

const PrivateRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div className="loading">Loading...</div>;
  }
  
  return isAuthenticated ? children : <Navigate to="/login" />;
};

const PublicRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <div className="loading">Loading...</div>;
  }
  
  return !isAuthenticated ? children : <Navigate to="/dashboard" />;
};

const AppLayout = ({ children }) => {
  return (
    <>
      <Navbar />
      <div style={{ display: 'flex' }}>
        <Sidebar />
        <div className="main-content">
          {children}
        </div>
      </div>
    </>
  );
};

function App() {
  return (
    <AuthProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<PublicRoute><Login /></PublicRoute>} />
          <Route path="/register" element={<PublicRoute><Register /></PublicRoute>} />
          
          <Route path="/dashboard" element={<PrivateRoute><AppLayout><Dashboard /></AppLayout></PrivateRoute>} />
          
          <Route path="/classes" element={<PrivateRoute><AppLayout><ClassList /></AppLayout></PrivateRoute>} />
          <Route path="/classes/create" element={<PrivateRoute><AppLayout><ClassCreate /></AppLayout></PrivateRoute>} />
          <Route path="/classes/:id" element={<PrivateRoute><AppLayout><ClassDetail /></AppLayout></PrivateRoute>} />
          
          <Route path="/students" element={<PrivateRoute><AppLayout><StudentList /></AppLayout></PrivateRoute>} />
          <Route path="/students/:id" element={<PrivateRoute><AppLayout><StudentDetail /></AppLayout></PrivateRoute>} />
          
          <Route path="/institute/create" element={<PrivateRoute><AppLayout><CreateInstitute /></AppLayout></PrivateRoute>} />
          
          <Route path="/question-banks" element={<PrivateRoute><AppLayout><QuestionBank /></AppLayout></PrivateRoute>} />
          
          <Route path="/" element={<Navigate to="/dashboard" />} />
        </Routes>
      </Router>
    </AuthProvider>
  );
}

export default App;
