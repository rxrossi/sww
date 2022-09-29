import { BaseIoClient, EmitEvent, EventHandler } from "../base-io-client";
import { Client } from "@sww/ws-client";

export class SocketIoClient implements BaseIoClient {
  private client: Client<any>;
  private eventHandlers: Array<(event: any) => void> = [];

  constructor(uri: string) {
    this.client = new Client({
      socketIoOptions: [uri],
    });

    this.client.addOnEvent(this.eventHandler);
    this.client.connect;
  }

  send: EmitEvent = (event, address) => {
    this.client.sendEvent({
      eventULID: event.ulid,
      payload: event,
      to: address,
    });
    this.eventHandler({ payload: event, eventULID: event.ulid, from: "TODO" });
  };

  //TODO
  //@ts-ignore
  addOnEvent = (eventHandler: EventHandler<any>): void => {
    this.eventHandlers.push(eventHandler);
  };

  private eventHandler = (event: {
    payload: any;
    eventULID: string;
    from: string;
  }): void => {
    this.eventHandlers.forEach((handler) => {
      handler(event);
    });
  };

  connect = ({
    address,
    signedMessage,
  }: {
    address: string;
    signedMessage: string;
  }): void => {
    this.client.connect({
      address,
      signature: signedMessage,
    });
  };

  asksForPersistedMessages = (): void => {
    this.client.asksForPersistedMessages();
  };

  disconnect = (): void => {
    this.client.disconnect();
  };
}
