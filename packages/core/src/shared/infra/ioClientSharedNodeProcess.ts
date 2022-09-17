import {
  IOClient,
  IOEvent,
  IOEventRecipient,
  OnEventHandler,
} from "src/shared/application/ioClient";

let clients: Array<IOClientSharedNodeProcess> = [];

/**
 * Probably only useful for testing.
 * All clients need to be on the same Node.js process
 */
export class IOClientSharedNodeProcess implements IOClient {
  onEventHandlers: Array<OnEventHandler> = [];
  walletAddress: string;

  constructor(walletAddress: string) {
    this.walletAddress = walletAddress;
    clients.push(this);
  }

  addOnEventHandler(eventHandler: OnEventHandler) {
    this.onEventHandlers.push(eventHandler);
  }

  send(event: IOEvent, recipients: Array<IOEventRecipient>) {
    clients
      .filter(({ walletAddress }) =>
        recipients
          .map(({ walletAddress }) => walletAddress)
          .includes(walletAddress)
      )
      .forEach((client) => {
        client.onEventHandlers.forEach((eventHandler) => {
          eventHandler({
            ...event,
            sentFrom: this.walletAddress,
          });
        });
      });
  }

  disconnect() {
    clients = clients.filter((client) => client === this);
  }
}
