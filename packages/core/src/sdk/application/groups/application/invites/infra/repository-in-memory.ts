import {
  InvitesRepository,
  InvitesRepositoryEntry,
} from "../application/repository";

export class InvitesRepositoryInMemory implements InvitesRepository {
  private entries: Array<InvitesRepositoryEntry> = [];

  getById(id: string): InvitesRepositoryEntry | undefined {
    return this.entries.find((entry) => entry.id === id);
  }

  list() {
    return this.entries;
  }

  create(input: InvitesRepositoryEntry): void {
    this.entries.push(input);
  }
}
