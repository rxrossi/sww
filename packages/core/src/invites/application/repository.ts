export type InvitesRepositoryEntry = {
  id: string;
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

export interface InvitesRepository {
  create(input: InvitesRepositoryEntry): void;
  getById(id: string): InvitesRepositoryEntry | undefined;
  list(): Array<InvitesRepositoryEntry>;
}
