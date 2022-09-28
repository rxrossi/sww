import { Address } from "../shared-types";

export type EmitEvent<NewEventInput> = (
  event: NewEventInput,
  to: Address
) => void;

export type EventHandler<Event> = (event: { payload: Event }) => void;

export interface BaseIoClient<OutgoingEvent = any, IncomingEvent = any> {
  send: EmitEvent<OutgoingEvent>;
  addOnEvent: EventHandler<IncomingEvent>;
  connect(input: { address: string; signedMessage: string }): void;
  disconnect(): void;
  asksForPersistedMessages(): void;
}
