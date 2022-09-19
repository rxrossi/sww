type InviteRepositoryEntry = {
  uuid: string;
  inviteeWalletAddress: string;
  topicId: string;
  status: "pending" | "accepted" | "rejected";
};

export interface InvitesRepository {
  add(entry: InviteRepositoryEntry): Promise<void>;
  update(uuid: string, status: InviteRepositoryEntry["status"]): Promise<void>;
  getById(uuid: string): Promise<InviteRepositoryEntry | undefined>;
  getAll(): Promise<Array<InviteRepositoryEntry>>;
}
