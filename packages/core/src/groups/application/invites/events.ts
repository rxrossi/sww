import { Invite } from "src/groups/domain/invite";
import { IncomingEvent } from "src/sdk/application/events";

export type NewInviteIncoming = IncomingEvent<Invite>;

export type EventType = "groups-invites:invite";
