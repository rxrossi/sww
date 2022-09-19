type TopicRepositoryEntry = {
  id: string;
  name: string;
};

export interface TopicsRepository {
  add(entry: TopicRepositoryEntry): Promise<void>;
  getAll(): Promise<Array<TopicRepositoryEntry>>;
}
