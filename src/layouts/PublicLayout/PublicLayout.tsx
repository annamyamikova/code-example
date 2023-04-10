import React, { FC } from 'react';
import { Outlet } from 'react-router';
import { observer } from 'mobx-react-lite';

import { Box, Grid } from '@mui/material';

import PersonIcon from '@mui/icons-material/Person';
import LogoutIcon from '@mui/icons-material/Logout';

// Styles
import classes from './PublicLayout.module.scss';

const PublicLayout: FC = () => {
  return (
    <span className={classes.Wrapper}>
      <div className={classes.Container}>
        <div className={classes.LogoutGame}>
          <LogoutIcon />
        </div>
        <div className={classes.ParticipantsCount}>
          <PersonIcon />
          <p>0</p>
        </div>
        <div className={classes.PublicContainer}>
          <Grid
            container
            flexDirection="column"
            height="100%"
            justifyContent="flex-start"
            alignItems="center"
            textAlign="center"
            flexWrap="nowrap"
          >
            <Outlet />
          </Grid>
        </div>
      </div>
      <Box className={classes.Landscape}>
        <p>Приложение не поддерживает альбомную ориентацию</p>
      </Box>
    </span>
  );
};

export default observer(PublicLayout);
