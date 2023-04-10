import { createContext } from 'react';

// Types
import { SocketCtx } from 'types/socket';

const SocketContext = createContext<{
  socket: SocketCtx;
  setSocket: (socket: SocketCtx) => void;
}>({
  // eslint-disable-next-line @typescript-eslint/ban-ts-comment
  // @ts-ignore
  socket: null,
  setSocket: () => {},
});

export default SocketContext;
