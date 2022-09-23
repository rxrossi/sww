type SentTo = {
  address: string;
};

export type MessagesRepositoryEntry = {
  ulid: string;
  sentFrom: string;
  data: any;
  topicId: string;
  metadata: {
    sentTo: Array<SentTo>;
    timestamp: number;
  };
};

export interface MessagesRepository {
  add(message: MessagesRepositoryEntry): Promise<void>;
  getAll(): Promise<Array<MessagesRepositoryEntry>>;
  getByTopic(topicId: string): Promise<Array<MessagesRepositoryEntry>>;
  updateMetadata(
    ulid: string,
    metadata: MessagesRepositoryEntry["metadata"]
  ): Promise<void>;
}
