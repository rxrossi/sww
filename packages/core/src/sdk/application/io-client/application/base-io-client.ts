import { NewEventInput } from "src/shared/event";
import { Address } from "src/shared/shared-types";

export type EmitEvent<Payload = any, Type = string> = (
  event: NewEventInput<Payload, Type>,
  to: Address
) => void;

export type EventHandler<Event> = (event: { payload: Event }) => void;

export interface BaseIoClient<OutgoingEvent = any, IncomingEvent = any> {
  send: EmitEvent<OutgoingEvent>;
  addOnEvent: (eventHandler: EventHandler<IncomingEvent>) => void;
  connect(input: { address: string; signedMessage: string }): void;
  disconnect(): void;
  asksForPersistedMessages(): void;
}
