import {
  IOClient,
  IOEvent,
  IOEventRecipient,
  OnEventHandler,
} from "src/shared/application/ioClient";
import { Client as SocketIOClient, OnEventCallback } from "@sww/ws-client";

export class ioClientSocketIO<Payload extends { type: string }>
  implements IOClient
{
  onEventHandlers: Array<OnEventHandler> = [];
  walletAddress: string;
  socketIOClient: SocketIOClient<Payload>;

  constructor(walletAddress: string) {
    this.socketIOClient = new SocketIOClient({
      socketIoOptions: ["http://localhost:9978", { autoConnect: false }],
    });

    this.socketIOClient.connect({
      address: walletAddress,
      signature: "message",
    });

    this.socketIOClient.addOnEvent(this.eventAdaptor);

    this.walletAddress = walletAddress;
  }

  addOnEventHandler(eventHandler: OnEventHandler) {
    this.onEventHandlers.push(eventHandler);
  }

  send(
    event: Omit<IOEvent<{ type: string }>, "sentFrom">,
    recipients: IOEventRecipient[]
  ): void {
    recipients.forEach((recipient) => {
      const toSend = {
        payload: event.payload as any,
        eventULID: event.ulid,
        to: recipient.walletAddress,
      };
      this.socketIOClient.sendEvent(toSend);

      if (toSend.to === this.walletAddress) {
        this.onEventHandlers.forEach((eventHandler) => {
          eventHandler({
            ulid: toSend.eventULID,
            payload: toSend.payload,
            sentFrom: this.walletAddress,
          });
        });
      }
    });
  }

  private eventAdaptor = (...args: Parameters<OnEventCallback<Payload>>) => {
    const [event, ack] = args;

    this.onEventHandlers.forEach((eventHandler) => {
      eventHandler(
        {
          ulid: event.eventULID,
          payload: event.payload as any,
          sentFrom: event.from,
        },
        ack
      );
    });
  };

  disconnect(): void {
    this.socketIOClient.disconnect();
  }
}
