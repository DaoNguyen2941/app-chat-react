import React from 'react';
import './App.css';
import { useEffect, useState } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import { routerPublic, routerPrivate } from './router';
import { useAppSelector } from './hooks/reduxHook';
import { isAuth } from './store/authSlice';
import NotFoundPage from './views/pages/notFoundPage/NotFoundPage';
import { useDemoRouter } from '@toolpad/core/internal';

interface DirectionalProps {
  islogin: boolean;
}
const Directional: React.FC<DirectionalProps> = ({ islogin }) => {
  const navigate = useNavigate();

  useEffect(() => {
    if (islogin) {
      navigate('/home');
    } else {
      navigate('/login');
    }
  }, [islogin, navigate]);
  // Đưa navigate vào dependencies để tránh cảnh báo
  return null;
};

function App() {
  const isLogin = useAppSelector(isAuth);

  return (
    <Router>
      <Routes>
        {isLogin ? (
          routerPrivate.map(({ path, component: Component, Layout }, index) => (
            <Route key={index} path={path} element={
              <Layout>
                <Component />
              </Layout>
            } />
          ))
        ) : (
          routerPublic.map(({ path, component: Component }, index) => (
            <Route key={index} path={path} element={<Component />} />
          ))
        )}
        <Route path="*" element={<Directional islogin={isLogin} />} />
      </Routes>
    </Router>
  );
}

export default App;
