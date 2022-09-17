export type IOEvent<Payload extends { type: string } = { type: string }> = {
  ulid: string;
  sentFrom: string;
  payload: Payload;
};

export type OnEventHandler<
  Payload extends { type: string } = { type: string }
> = (event: IOEvent<Payload>, ack?: (ack: boolean) => void) => void;

export type IOEventRecipient = {
  walletAddress: string;
};

//TODO: handle/add acknowledged

export interface IOClient<Payload extends { type: string } = { type: string }> {
  addOnEventHandler(eventHandler: OnEventHandler): void;
  send(
    event: Omit<IOEvent<Payload>, "sentFrom">,
    recipients: Array<IOEventRecipient>
  ): void;
  disconnect(): void;
  getAddress(): string;
}
