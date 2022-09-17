import { IOEvent } from "src/shared/application/ioClient";

export enum InviteIOEventType {
  new = "invite:new",
  accept = "invite:accept",
}

export type NewInviteIOEvent = {
  ulid: string;
  sentFrom: string;
  payload: {
    id: string;
    type: InviteIOEventType.new;
    to: {
      name: string;
      walletAddress: string;
    };
    from: {
      name: string;
      walletAddress: string;
    };
    toJoinGroup: string;
    //TODO: it is always going to be pending, so remove it from here
    status: "pending" | "accepted" | "rejected";
  };
};

export type AcceptInviteIOEvent = {
  ulid: string;
  sentFrom: string;
  payload: {
    type: InviteIOEventType.accept;
    inviteId: string;
  };
};

export type InviteIOEvent = NewInviteIOEvent | AcceptInviteIOEvent;

export const isAcceptInviteIOEvent = (
  event: IOEvent
): event is AcceptInviteIOEvent => {
  return event?.payload.type === InviteIOEventType.accept;
};

export const isNewInviteIOEvent = (
  event: IOEvent
): event is NewInviteIOEvent => {
  return event?.payload.type === InviteIOEventType.new;
};
