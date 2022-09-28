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

class Invites {
  private entries: Array<InviteToGroup> = [];
  invite = ({ groupId, address }: { groupId: string; address: string }) => {
    //TODO
    const groupName = "Algarve expenses";
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

export class Groups {
  private entries: Array<Group> = [];
  invites: Invites;

  constructor() {
    this.invites = new Invites();
  }

  create = ({ name }: { name: string }): void => {
    this.entries.push({
      id: "id",
      name,
    });
  };

  list = (): Array<Group> => {
    return this.entries;
  };
}
