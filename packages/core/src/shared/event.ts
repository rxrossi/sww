import { Address } from "./shared-types";

type IoData = {
  timestamp: number;
  meantToBeSentTo: Array<Address>;
  sentTo: Array<Address>;
};

export type NewEventInput<payload, type> = {
  ulid: string;
  data: {
    timestamp: number;
    type: type;
    groupId: string;
    payload: payload;
  };
  ioData?: IoData;
  sendFrom?: Address;
};

export type OutgoingEvent<payload = any, type = string> = NewEventInput<
  payload,
  type
> & {
  ioData: IoData;
};

export type Evt<payload = any, type = string> = OutgoingEvent<payload, type> & {
  sentFrom: Address;
};
