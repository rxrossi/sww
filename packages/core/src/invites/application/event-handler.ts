import { EventType } from "./events";
import { InvitesRepository } from "./repository";
import { SyncGroupWith } from "src/event-sync";
import { EventHandler } from "src/sdk/io-client/types";

export class InvitesEventHandler {
  constructor(
    private deps: {
      invitesRepository: InvitesRepository;
      whoAmI: () => String;
      syncGroupWith: SyncGroupWith;
    }
  ) {}

  eventHandler: EventHandler = (event) => {
    const newInviteType: EventType = "groups-invites:invite";
    const acceptInviteType: EventType = "groups-invites:accept";

    switch (event.data.type) {
      case newInviteType: {
        this.deps.invitesRepository.create(event.data.payload);
        break;
      }

      case acceptInviteType: {
        const inviteId = event.data.payload.id;
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
