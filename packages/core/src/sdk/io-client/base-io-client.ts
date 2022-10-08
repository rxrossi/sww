import { Client as WsClient } from "@sww/ws-client";

type OutgoingEvent<Payload = any> = {
  eventULID: string;
  payload: Payload;
  to: string;
};

type IncomingEvent<Payload = any> = {
  eventULID: string;
  payload: Payload;
  from: string;
};

type EventHandler = (event: IncomingEvent) => void;

//NOTE: Maybe I can extract these BaseIo... to not need to "namespace"
export type BaseIoClientEventHandler = EventHandler;
export type BaseIoClientEmitEvent = (event: OutgoingEvent) => void;
export type BaseIoClientIncomingEvent = IncomingEvent;
export type BaseIoClientOutgoingEvent<Payload> = OutgoingEvent<Payload>;

export class BaseIoClient {
  private client: WsClient<any>;
  private eventHandlers: Array<EventHandler> = [];

  constructor(client: WsClient<any>) {
    this.client = client;

    this.client.addOnEvent(this.eventHandler);
  }

  send: BaseIoClientEmitEvent = (event: OutgoingEvent) => {
    this.client.sendEvent(event);

    if (event.to === this.whoAmI()) {
      this.eventHandler({
        eventULID: event.eventULID,
        payload: event.payload,
        from: this.client.getAuth().address,
      });
    }
  };

  addOnEvent = (eventHandler: EventHandler): void => {
    this.eventHandlers.push(eventHandler);
  };

  private eventHandler = (event: IncomingEvent): void => {
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

  whoAmI = () => {
    return this.client.getAuth().address;
  };
}
