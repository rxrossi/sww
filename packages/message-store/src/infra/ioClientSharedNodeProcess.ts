import {
  IOClient,
  IOEventRecipient,
  IncomingEventHandler,
  OutgoingIOEvent,
} from "src/shared/application/ioClient";

let clients: Array<IOClientSharedNodeProcess<any, any>> = [];

/**
 * Probably only useful for testing.
 * All clients need to be on the same Node.js process
 */
export class IOClientSharedNodeProcess<Data, Metadata>
  implements IOClient<Data, Metadata>
{
  onEventHandlers: Array<IncomingEventHandler<Data, Metadata>> = [];
  walletAddress: string;

  constructor(walletAddress: string) {
    this.walletAddress = walletAddress;
    clients.push(this);
  }

  addOnEventHandler(eventHandler: IncomingEventHandler<Data, Metadata>) {
    this.onEventHandlers.push(eventHandler);
  }

  getAddress(): string {
    return this.walletAddress;
  }

  sendEvent(
    event: OutgoingIOEvent<Data, Metadata>,
    recipients: Array<IOEventRecipient>
  ) {
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
