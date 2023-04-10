import React, {
  FC,
  useContext,
  useEffect,
} from 'react';
import { observer } from 'mobx-react-lite';

import { Box } from '@mui/material';

// Contexts
import SocketContext from 'contexts/SocketContext';

// Hooks
import { useRealtime } from 'hooks/useRealtime';
import { useSocket } from 'hooks/useSocket';

// Stores
import authStore from 'stores/authStore';
import sessionStore from 'stores/sessionStore';

// Styles
import classes from './Moderator.module.scss';

const Moderator: FC = () => {
  const { setSocket } = useContext(SocketContext);

  const socket = useSocket();
  useRealtime(socket);

  const { accessToken } = authStore;
  const { sessionId } = sessionStore;

  useEffect(() => {
    setSocket(socket);
  }, [socket]);

  useEffect(() => {
    const localSession = localStorage.getItem('sessionId');

    socket.connect({
      ...(sessionId ? { sessionId } : { localSession } || null),
      token: accessToken as string,
    });
  }, []);

  // const getTabContentByIndex = useCallback(
  //   (cTab: string | null): ReactElement => {
  //     switch (cTab) {
  //       case 'results':
  //         return <Results isModeratorTab />;
  //       case 'answers':
  //         return (
  //           <CheckAnswers
  //             themeIndex={answersThemeIndex}
  //             setThemeIndex={setAnswersThemeIndex}
  //           />
  //         );
  //       case 'questions':
  //         return (
  //           <Questions
  //             themeIndex={questionsThemeIndex}
  //             setThemeIndex={setQuestionsThemeIndex}
  //           />
  //         );
  //       default:
  //         return <Game />;
  //     }
  //   },
  //   [questionsThemeIndex, answersThemeIndex]
  // );

  return (
    <span className={classes.Wrapper}>
      <div className={classes.Container} />
      <Box className={classes.Landscape}>
        <p>Приложение не поддерживает альбомную ориентацию</p>
      </Box>
    </span>
  );
};

export default observer(Moderator);
