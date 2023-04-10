export enum SocketHandlerEvent {
  game_updatedData = 'game_updatedData',
}

export enum SocketEmitEvent {
  moderator_showResultsCalculating = 'moderator.showResultsCalculating',
  moderator_showResultTable = 'moderator.showResultTable',
  moderator_updateTeamResults = 'moderator.updateTeamResults',
}

export type SubscribeFn = (
  eventName: SocketHandlerEvent,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cb: (...data: any[]) => void
) => void;

export type UnsubscribeFn = (
  eventName: SocketHandlerEvent,
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  cb?: (...data: any[]) => void
) => void;

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export type EmitFn = (eventName: SocketEmitEvent, ...data: any[]) => void;

export enum SocketQueryField {
  teamName = 'teamName',
  token = 'token',
  sessionId = 'sessionId',
}

export interface SocketCtx {
  connect: (query: { [key in SocketQueryField]?: string }) => void;
  disconnect: () => void;
  subscribe: SubscribeFn;
  unsubscribe: UnsubscribeFn;
  emit: EmitFn;
  isInit: boolean;
  isConnected: boolean;
}
