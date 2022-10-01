import { IncomingEvent } from "src/shared/event";
import { Invite } from "../domain/invite";

export type NewInviteIncoming = IncomingEvent<Invite>;

export type EventType = "groups-invites:invite";
