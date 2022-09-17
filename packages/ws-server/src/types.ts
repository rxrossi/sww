import { Server as SocketIoServer, Socket } from "socket.io";

export interface ServerToClientEvents<EventPayload = any> {
  event: (
    event: {
      payload: EventPayload;
      eventULID: string;
      from: string;
      acknowledged: boolean;
    },
    ack: (res: boolean) => void
  ) => void;
}

export interface ClientToServerEvents<EventPayload = any> {
  event: ({}: { to: string; payload: EventPayload; eventULID: string }) => void;
  allMessagesSince: (options: { timestamp?: number }) => void;
}

interface InterServerEvents {
  ping: () => void;
}

interface SocketData {
  walletAddress: string;
}

export type Auth = {
  address: string;
  signature: string;
  [key: string]: any;
};

export type SocketIoServerType = InstanceType<
  typeof SocketIoServer<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >
>;

export type SocketType = InstanceType<
  typeof Socket<
    ClientToServerEvents,
    ServerToClientEvents,
    InterServerEvents,
    SocketData
  >
>;
