import {
  MessagesRepository,
  MessagesRepositoryEntry as Entry,
} from "../application/messages-repository";

export class MessagesRepositoryInMemory implements MessagesRepository {
  private messages: Array<Entry> = [];

  async add(message: Entry): Promise<void> {
    this.messages.push(message);
  }

  async getAll(): Promise<Entry[]> {
    return this.messages;
  }

  async getByTopic(topicId: string): Promise<Entry[]> {
    return this.messages.filter((message) => message.topicId === topicId);
  }

  async updateMetadata(
    ulid: string,
    metadata: Entry["metadata"]
  ): Promise<void> {
    const arrayIndexToUpdate = this.messages.findIndex(
      (message) => message.ulid === ulid
    );

    this.messages[arrayIndexToUpdate] = {
      ...this.messages[arrayIndexToUpdate],
      metadata: {
        ...metadata,
        timestamp: Date.now(),
      },
    };
  }
}
