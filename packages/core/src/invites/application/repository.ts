export type InviteEventRepositoryEntry = {
  id: string;
  to: {
    name: string;
    walletAddress: string;
  };
  from: {
    name: string;
    walletAddress: string;
  };
  toJoinGroup: string;
  status: "pending" | "accepted" | "rejected";
};

export type InvitesRepository = Repository<InviteEventRepositoryEntry>;
