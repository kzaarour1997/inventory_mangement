import React from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { ThemeProvider, CssBaseline, Box } from '@mui/material';
import { createTheme } from '@mui/material/styles';
import { AuthProvider, useAuth } from './contexts/AuthContext';
import Login from './components/Login';
import ProductTypes from './components/ProductTypes';
import ProductTypeItems from './components/ProductTypeItems';
import Navbar from './components/Navbar';

// Create a theme instance
const theme = createTheme({
  palette: {
    primary: {
      main: '#1976d2',
    },
    secondary: {
      main: '#dc004e',
    },
  },
});

// Protected Route component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated } = useAuth();
  
  if (!isAuthenticated) {
    return <Navigate to="/login" />;
  }
  
  return children;
};

const App = () => {
  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
      <AuthProvider>
        <Router>
          <Box sx={{ display: 'flex', flexDirection: 'column', minHeight: '100vh' }}>
            <Navbar />
            <Routes>
              <Route path="/login" element={<Login />} />
              <Route
                path="/product-types"
                element={
                  <ProtectedRoute>
                    <ProductTypes />
                  </ProtectedRoute>
                }
              />
              <Route
                path="/product-types/:productTypeId/items"
                element={
                  <ProtectedRoute>
                    <ProductTypeItems />
                  </ProtectedRoute>
                }
              />
              <Route path="/" element={<Navigate to="/product-types" replace />} />
            </Routes>
          </Box>
        </Router>
      </AuthProvider>
    </ThemeProvider>
  );
};

export default App; 