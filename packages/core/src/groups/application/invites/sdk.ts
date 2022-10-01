import { EmitEvent } from "src/sdk/application/io-client/application/base-io-client";
import { GroupsRepository } from "../repository";
import { EventType } from "./events";
import { InvitesRepository } from "./repository";

type Dependencies = {
  groupsRepository: GroupsRepository;
  emitEvent: EmitEvent;
  invitesRepository: InvitesRepository;
};

export class InvitesSdk {
  constructor(private deps: Dependencies) {}

  invite = ({ groupId, address }: { groupId: string; address: string }) => {
    const groupName = this.deps.groupsRepository.getById(groupId)?.name;

    if (!groupName) {
      console.error("Could not find group to invite", {
        invitee: address,
        groupId,
      });
      throw new Error("Could not find group to invite");
    }

    const payload = {
      //TODO
      id: "invite-id",
      toJoin: {
        groupId,
        name: groupName,
      },
      from: {
        walletAddress: "address1",
      },
      to: {
        walletAddress: address,
      },
    };

    const type: EventType = "groups-invites:invite";
    this.deps.emitEvent(
      {
        ulid: "TODO",
        data: {
          payload,
          timestamp: Date.now(),
          type,
        },
      },
      address
    );
  };

  list = () => {
    return this.deps.invitesRepository.list();
  };
}
