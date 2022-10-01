import { Event } from "src/shared/event";
import { Invite } from "../domain/invite";

export type NewInviteIncoming = Event<Invite>;

export type EventType = "groups-invites:invite";
