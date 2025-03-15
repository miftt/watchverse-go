import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { useAuth } from './context/AuthContext';
import Login from './pages/Login';
import Register from './pages/Register';
import Home from './pages/Home';
import MovieDetails from './pages/MovieDetails';
import NotFound from './pages/NotFound';
import Movies from './pages/Movies';

const App = () => {
  const { isAuthenticated } = useAuth();

  return (
    <Router>
      <Routes>
        {/* Public Routes */}
        <Route
          path="/login"
          element={!isAuthenticated ? <Login /> : <Navigate to="/" />}
        />
        <Route
          path="/register"
          element={!isAuthenticated ? <Register /> : <Navigate to="/" />}
        />

        {/* Protected Routes */}
        <Route
          path="/"
          element={isAuthenticated ? <Home /> : <Navigate to="/login" />}
        />
        <Route
          path="/movies"
          element={isAuthenticated ? <Movies /> : <Navigate to="/login" />}
        />
        <Route
          path="/movies/:genre"
          element={isAuthenticated ? <Movies /> : <Navigate to="/login" />}
        />
        <Route
          path="/movie/:id"
          element={isAuthenticated ? <MovieDetails /> : <Navigate to="/login" />}
        />
        <Route
          path="/series"
          element={isAuthenticated ? <MovieDetails /> : <Navigate to="/login" />}
        />

        {/* 404 Route - Harus berada di paling bawah */}
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Router>
  );
};

export default App;