export type Invite = {
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
