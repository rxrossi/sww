import { Invite } from "../domain/invite";

export type InvitesRepositoryEntry = {
  id: string;
  status: Invite["status"];
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
  update(id: string, data: Omit<InvitesRepositoryEntry, "id">): void;
}
