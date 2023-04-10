import React, { FC, useContext, useEffect } from 'react';
import { observer } from 'mobx-react-lite';

import { Grid } from '@mui/material';

// Contexts
import SocketContext from 'contexts/SocketContext';

// Hooks
import { useSocket } from 'hooks/useSocket';

// Styles
import classes from './Home.module.scss';

const Home: FC = () => {
  const { setSocket } = useContext(SocketContext);

  const socket = useSocket();

  useEffect(() => {
    setSocket(socket);
  }, [socket]);


  return (
    <div className={classes.Wrapper}>
      <Grid
        className={classes.Container}
        container
        direction="column"
        justifyContent="center"
        textAlign="center"
        gap="20px"
        height="100%"
      >
        <h2>Template</h2>
      </Grid>
    </div>
  );
};

export default observer(Home);
