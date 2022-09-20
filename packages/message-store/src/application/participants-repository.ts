export type ParticipantRepositoryEntry = {
  topicId: string;
  address: string;
  publicKey?: string;
};

export interface ParticipantsRepository {
  getByTopic(topicId: string): Promise<Array<ParticipantRepositoryEntry>>;
  upsert(
    address: string,
    input: Omit<ParticipantRepositoryEntry, "address">
  ): Promise<void>;
  getAll(): Promise<Array<ParticipantRepositoryEntry>>;
}
