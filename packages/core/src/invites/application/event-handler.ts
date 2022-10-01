import { Event } from "src/shared/event";
import { EventHandler } from "src/sdk/application/io-client/application/base-io-client";
import { EventType } from "./events";
import { InvitesRepository } from "./repository";

export class InvitesEventHandler {
  constructor(
    private deps: {
      invitesRepository: InvitesRepository;
    }
  ) {}

  eventHandler: EventHandler<Event> = (event) => {
    const newInviteType: EventType = "groups-invites:invite";

    switch (event.payload.data.type) {
      case newInviteType: {
        this.deps.invitesRepository.create(event.payload.data.payload);
        break;
      }
    }
  };
}
