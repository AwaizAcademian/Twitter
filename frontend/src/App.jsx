// import React from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import { AuthProvider } from './auth/AuthContext';
import Home from './pages/Home';
import Login from './pages/Login';
import Register from './pages/SignUp';
// import PostDetail from './pages/PostDetail';
import ProtectedRoute from './auth/ProtectedRoute';

const CenteredWrapper = ({ children }) => (
  <div className="d-flex vh-100 justify-content-center align-items-center">
    {children}
  </div>
);

const App = () => (
  <AuthProvider>
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<ProtectedRoute><Home /></ProtectedRoute>} />
        {/* <Route path="/posts/:id" element={<ProtectedRoute><PostDetail /></ProtectedRoute>} /> */}
        <Route path="/login" element={
            <CenteredWrapper>
              <Login />
            </CenteredWrapper>
          } />
        <Route path="/register" element={<Register />} />
      </Routes>
    </BrowserRouter>
  </AuthProvider>
);

export default App;