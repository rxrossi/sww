export type Group = {
  id: string;
  name: string;
};

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

export class Groups {
  private entries: Array<Group> = [];
  private invites: Array<InviteToGroup> = [];

  create = ({ name }: { name: string }): void => {
    this.entries.push({
      id: "id",
      name,
    });
  };

  list = (): Array<Group> => {
    return this.entries;
  };

  invite = ({ groupId, address }: { groupId: string; address: string }) => {
    const groupName = this.entries.find((entry) => entry.id === groupId)?.name;
    if (!groupName) {
      console.error("Could not find group to invite", {
        invitee: address,
        groupId,
      });
      throw new Error("Could not find group to invite");
    }

    this.invites.push({
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

  listInvites = () => {
    return this.invites;
  };
}
