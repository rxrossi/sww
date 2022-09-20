export type IOEventRecipient = {
  walletAddress: string;
};

type BaseIOEvent<Data, Metadata> = {
  ulid: string;
  data: Data;
  metadata: Metadata;
};

export type OutgoingIOEvent<Data, Metadata> = BaseIOEvent<Data, Metadata>;

type IncomingIOEvent<Data, Metadata> = BaseIOEvent<Data, Metadata> & {
  sentFrom: string;
  // acknowledged: boolean
};

export type IncomingEventHandler<Data, Metadata> = (
  event: IncomingIOEvent<Data, Metadata>
) => void;

export interface IOClient<Data, Metadata> {
  addOnEventHandler(eventHandler: IncomingEventHandler<Data, Metadata>): void;
  sendEvent(
    event: OutgoingIOEvent<Data, Metadata>,
    recipients: Array<IOEventRecipient>
  ): void;
  disconnect(): void;
  getAddress(): string;
}
