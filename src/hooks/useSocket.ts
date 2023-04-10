import { useCallback, useMemo, useRef, useState } from 'react';
import io, { Socket } from 'socket.io-client';

// Types
import { SocketCtx, SocketEmitEvent, SocketQueryField } from 'types/socket';

const initSocketConnection = (
  setIsConnected: (value: boolean) => void,
  query: { [key in SocketQueryField]?: string }
) => {
  const socket = io(process.env.REACT_APP_API_HOST as string, {
    query,
    autoConnect: false,
    reconnection: true,
    transports: ['websocket'],
  });

  socket.on('connect', () => {
    console.log('Socket connected');
    setIsConnected(true);
  });

  socket.on('disconnect', () => {
    console.log('Socket disconnected');
    setIsConnected(false);
  });

  return socket;
};

export const useSocket = (): SocketCtx => {
  const socketRef = useRef<Socket | null>(null);
  const [isConnected, setIsConnected] = useState(false);
  const [isInit, setIsInit] = useState(false);

  const subscribe = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (eventName: string, cb: (...data: any[]) => void) => {
      socketRef.current?.on(eventName, cb);
    },
    []
  );

  const unsubscribe = useCallback(
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    (eventName: string, cb?: (...data: any[]) => void) => {
      socketRef.current?.off(eventName, cb);
    },
    []
  );

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const emit = useCallback((eventName: SocketEmitEvent, ...data: any[]) => {
    console.log('emit:', eventName, data);

    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    socketRef.current?.emit(eventName, ...data);
  }, []);

  const connect = useCallback(
    (query: { [key in SocketQueryField]?: string }) => {
      if (!socketRef.current) {
        socketRef.current = initSocketConnection(setIsConnected, query);
        setIsInit(true);
        socketRef.current.connect();
      } else {
        socketRef.current.disconnect();
        socketRef.current.connect();
      }
    },
    []
  );

  const disconnect = useCallback(() => {
    socketRef.current?.disconnect();
  }, []);

  return useMemo(
    () => ({
      subscribe,
      unsubscribe,
      connect,
      disconnect,
      emit,
      isInit,
      isConnected,
    }),
    [isInit, isConnected]
  );
};
