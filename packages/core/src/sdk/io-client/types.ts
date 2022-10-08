import { Evt, NewEventInput } from "src/shared/event";
import { Address } from "src/shared/shared-types";

export type EmitEvent<Payload = any, Type = string> = (
  event: NewEventInput<Payload, Type>,
  addresses: Array<Address>
) => void;

export type EventHandler = (event: Evt) => void;
