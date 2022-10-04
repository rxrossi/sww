import { Evt } from "src/shared/event";
import { Invite } from "../domain/invite";

export type NewInviteIncoming = Evt<Invite, "groups-invites:invite">;

export type AcceptInviteIncoming = Evt<{ id: string }, "groups-invites:accept">;

export type EventType = "groups-invites:invite" | "groups-invites:accept";
