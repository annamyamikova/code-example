import React, { FC, useCallback, useContext, useState } from 'react';
import { Outlet } from 'react-router';
import { useNavigate } from 'react-router-dom';
import { observer } from 'mobx-react-lite';

import { Box, Button, Modal } from '@mui/material';

import LogoutIcon from '@mui/icons-material/Logout';

// Contexts
import SocketContext from 'contexts/SocketContext';

// Stores
import authStore from 'stores/authStore';

// Styles
import classes from './AdminLayout.module.scss';

const AdminLayout: FC = () => {
  const [isModalOpen, setModalOpen] = useState(false);
  const { socket } = useContext(SocketContext);
  const navigate = useNavigate();

  const handleOpen = useCallback(() => setModalOpen(true), []);
  const handleClose = useCallback(() => setModalOpen(false), []);

  const handleLogout = useCallback(() => {
    authStore.logout();

    navigate('/login', {
      replace: true,
    });

    socket.disconnect();
    handleClose();
  }, [socket]);

  return (
    <span className={classes.Wrapper}>
      <div className={classes.Container}>
        <div className={classes.LogoutGame} onClick={handleOpen}>
          <LogoutIcon />
        </div>
        <Outlet />
        <Modal
          open={isModalOpen}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box className={classes.Modal}>
            <div className={classes.Buttons}>
              <Button onClick={handleLogout}>Выйти из профиля</Button>
            </div>
          </Box>
        </Modal>
      </div>
      <Box className={classes.Landscape}>
        <p>Приложение не поддерживает альбомную ориентацию</p>
      </Box>
    </span>
  );
};

export default observer(AdminLayout);
