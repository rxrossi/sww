import { Evt } from "src/shared/event";
import { EventHandler } from "src/sdk/application/io-client/application/base-io-client";
import { EventType } from "./events";
import { InvitesRepository } from "./repository";
import { SyncGroupWith } from "src/event-sync";

export class InvitesEventHandler {
  constructor(
    private deps: {
      invitesRepository: InvitesRepository;
      syncGroupWith: SyncGroupWith;
    }
  ) {}

  eventHandler: EventHandler<Evt> = (event) => {
    const newInviteType: EventType = "groups-invites:invite";
    const acceptInviteType: EventType = "groups-invites:accept";

    switch (event.payload.data.type) {
      case newInviteType: {
        this.deps.invitesRepository.create(event.payload.data.payload);
        break;
      }

      case acceptInviteType: {
        const inviteId = event.payload.data.payload.id;
        const invite = this.deps.invitesRepository.getById(inviteId);

        if (!invite) {
          console.error("Invite not found", {
            inviteId,
          });

          throw new Error("Invite not found");
        }

        this.deps.invitesRepository.update(invite.id, {
          ...invite,
          status: "accepted",
        });

        //TODO: check if I'm not the person who accepted it
        this.deps.syncGroupWith(invite.toJoin.groupId, invite.to.walletAddress);
      }
    }
  };
}
