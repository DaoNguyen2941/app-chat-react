import React from 'react';
import { useEffect } from 'react';
import { BrowserRouter as Router, Route, Routes, useNavigate } from 'react-router-dom';
import { routerPublic, routerPrivate } from './router';
import { useAppSelector } from './hooks/reduxHook';
import { isAuth } from './store/authSlice';
import { useAppDispatch } from './hooks/reduxHook';
import { connectSocket,disconnectSocket } from './store/socketSlice';
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
  return null;
};

function App() {
  const isLogin = useAppSelector(isAuth);
  const dispatch = useAppDispatch();

  useEffect(()=> {
    if (isLogin) {
      dispatch(connectSocket());
    }else {
      dispatch(disconnectSocket());
    }
  }, [isLogin, dispatch])

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
