import { GroupsRepository } from "../../repository";

export type InviteToGroup = {
  toJoin: {
    groupId: string;
    name: string;
  };
  to: {
    walletAddress: string;
  };
  from: {
    walletAddress: string;
  };
};

type InvitesDeps = {
  groupsRepository: GroupsRepository;
};

export class Invites {
  constructor(private deps: InvitesDeps) {}

  private entries: Array<InviteToGroup> = [];
  invite = ({ groupId, address }: { groupId: string; address: string }) => {
    const groupName = this.deps.groupsRepository.getById(groupId)?.name;

    if (!groupName) {
      console.error("Could not find group to invite", {
        invitee: address,
        groupId,
      });
      throw new Error("Could not find group to invite");
    }

    this.entries.push({
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
    });
  };

  list = () => {
    return this.entries;
  };
}
