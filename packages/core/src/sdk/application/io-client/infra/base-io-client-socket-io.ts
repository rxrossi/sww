import {
  BaseIoClient,
  EmitEvent,
  EventHandler,
} from "../application/base-io-client";
import { Client } from "@sww/ws-client";
import { OutgoingEvent } from "src/shared/event";

export class SocketIoClient implements BaseIoClient {
  private client: Client<any>;
  private eventHandlers: Array<EventHandler<any>> = [];

  constructor(uri: string) {
    this.client = new Client({
      socketIoOptions: [uri],
    });

    this.client.addOnEvent(this.eventHandler);
    this.client.connect;
  }

  send: EmitEvent = (event, address) => {
    const updatedEvent: OutgoingEvent = {
      ...event,
      ioData: {
        sentTo: event.ioData?.sentTo
          ? event.ioData.sentTo.concat(address)
          : [address],
        meantToBeSentTo: event.ioData?.meantToBeSentTo
          ? event.ioData.meantToBeSentTo.concat(address)
          : [address],
        timestamp: Date.now(),
      },
    };

    //TODO Add tests for this or extract it
    this.client.sendEvent({
      eventULID: event.ulid,
      payload: updatedEvent,
      to: address,
    });

    //TODO Add tests for this or extract it
    this.eventHandler({
      payload: updatedEvent,
      eventULID: event.ulid,
      from: "TODO",
    });
  };

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
