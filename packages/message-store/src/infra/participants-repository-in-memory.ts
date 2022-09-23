import {
  ParticipantRepositoryEntry as Entry,
  ParticipantsRepository,
} from "../application/participants-repository";

export class ParticipantsRepositoryInMemory implements ParticipantsRepository {
  private entries: Array<Entry> = [];

  async getAll(): Promise<Entry[]> {
    return this.entries;
  }

  async getByTopic(topicId: string): Promise<Entry[]> {
    return this.entries.filter((entry) => entry.topicId === topicId);
  }

  async upsert(address: string, input: Omit<Entry, "address">): Promise<void> {
    const indexToUpdate = this.entries.findIndex(
      (entry) => entry.address === address
    );

    if (indexToUpdate >= 0) {
      this.entries[indexToUpdate] = {
        address,
        ...input,
      };
    } else {
      this.entries.push({
        address,
        ...input,
      });
    }
  }
}
