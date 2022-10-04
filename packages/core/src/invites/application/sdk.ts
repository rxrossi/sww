import { GroupsRepository } from "src/groups/application/repository";
import { Ids } from "src/ids";
import { EmitEvent } from "src/sdk/application/io-client/application/base-io-client";
import { Invite } from "../domain/invite";
import { EventType } from "./events";
import { InvitesRepository } from "./repository";

type Dependencies = {
  groupsRepository: GroupsRepository;
  emitEvent: EmitEvent;
  invitesRepository: InvitesRepository;
  ids: Ids;
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

    const payload: Invite = {
      status: "pending",
      id: this.deps.ids.id(),
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
        ulid: this.deps.ids.ulid(),
        data: {
          groupId,
          payload,
          timestamp: Date.now(),
          type,
        },
      },
      [address]
    );
  };

  accept = ({ inviteId }: { inviteId: string }) => {
    const invite = this.deps.invitesRepository.getById(inviteId);

    if (!invite) {
      console.error("Invite not found", {
        inviteId,
      });

      throw Error("Invite not found");
    }

    const type: EventType = "groups-invites:accept";
    const payload = {
      id: inviteId,
      action: "accept",
    };

    this.deps.emitEvent(
      {
        ulid: this.deps.ids.ulid(),
        data: {
          groupId: invite.toJoin.groupId,
          payload,
          timestamp: Date.now(),
          type,
        },
      },
      [invite.from.walletAddress]
    );
  };

  list = () => {
    return this.deps.invitesRepository.list();
  };
}
