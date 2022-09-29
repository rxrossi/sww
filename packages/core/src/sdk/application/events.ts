import { Address } from "./shared-types";

export type NewEventInput<payload, type> = {
  ulid: string;
  data: {
    createdBy: Address;
    timestamp: number;
    type: type;
    payload: payload;
  };
};

export type OutgoingEvent<payload = any, type = string> = NewEventInput<
  payload,
  type
> & {
  ioData: {
    timestamp: number;
    meantToBeSentTo: Array<Address>;
    sentTo: Array<Address>;
  };
};

export type IncomingEvent<payload = any> = OutgoingEvent<payload> & {
  createdBy: Address;
  sentFrom: Address;
};
