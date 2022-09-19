type ParticipantRepositoryEntry = {
  walletAddress: string;
};

export interface ParticipantsRepository {
  add(entry: ParticipantRepositoryEntry): Promise<void>;
  getAll(): Promise<Array<ParticipantRepositoryEntry>>;
}
