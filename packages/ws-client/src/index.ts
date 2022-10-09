import { io, Socket } from "socket.io-client";
import { ClientToServerEvents, ServerToClientEvents } from "@sww/ws-server";
import { Auth } from "@sww/ws-server/src/types";

export type OnEventCallback<Payload> = (
  event: { payload: Payload; eventULID: string; from: string },
  ack?: (ack: boolean) => void
) => void;

export class Client<EventPayload> {
  io: Socket<
    ServerToClientEvents<EventPayload>,
    ClientToServerEvents<EventPayload>
  >;
  constructor({ socketIoOptions }: { socketIoOptions: Parameters<typeof io> }) {
    this.io = io(...socketIoOptions);

    this.io.on("disconnect", () => {
      // TODO: should we do something here? I think that the default options will always try to reconnect
      // this.io.connect();
    });
  }

  addOnEvent(onEventCallback: OnEventCallback<EventPayload>) {
    this.io.on("event", onEventCallback);
  }

  connect(auth: Auth) {
    // TODO:
    // The client will request the auth server for a nonce, sending his address
    // The auth server will store something like { address: nonce } and return a nonce
    // The client will sign a message with this nonce, it will be used to on the auth header { address: string, signedMessage }
    // The ws server will use auth info to request the auth server

    this.io.auth = auth;

    this.io.connect();
  }

  disconnect() {
    this.io.disconnect();
  }

  getAuth = (): Auth => {
    //TODO: error if this is undefined?
    return this.io.auth as Auth;
  };

  asksForPersistedMessages() {
    this.io.emit("allMessagesSince", { timestamp: 42 });
  }

  sendEvent({
    payload,
    to,
    eventULID,
  }: {
    payload: EventPayload;
    to: string;
    eventULID: string;
  }) {
    this.io.emit("event", { eventULID, to, payload, acknowledged: "false" });
  }
}
