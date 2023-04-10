import React, { FC } from 'react';
import { Navigate, Route, Routes as CRoutes } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

// Components
import Loading from 'components/Loading';

// Layouts
import AdminLayout from 'layouts/AdminLayout';

// Routes
import Login from 'routes/Login';
import Home from 'routes/Home';
import Moderator from 'routes/Moderator';

// Stores
import authStore from 'stores/authStore';
import sessionStore from 'stores/sessionStore';

const Routes: FC = () => {
  const { isLogin, isChecking } = authStore;
  const { sessionId, isLoading } = sessionStore;

  if (isChecking || isLoading) {
    return <Loading />;
  }

  return (
    <CRoutes>
      {/* eslint-disable-next-line no-nested-ternary */}
      {isLogin ? (
        !sessionId ? (
          <Route path="/" element={<AdminLayout />}>
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        ) : (
          <Route path="/">
            <Route index element={<Moderator />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Route>
        )
      ) : (
        <>
          <Route path="/">
            <Route index element={<Home />} />
            <Route path="login" element={<Login />} />
          </Route>
        </>
      )}
    </CRoutes>
  );
};

export default observer(Routes);
