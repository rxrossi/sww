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

  update(id: string, data: Omit<InvitesRepositoryEntry, "id">): void {
    const index = this.entries.findIndex((it) => it.id === id);

    if (index < 0) {
      console.log("Could not update entry that does not exist", {
        id,
      });
      throw new Error("Could not update entry that does not exist");
    }

    this.entries[index].status = "accepted";
  }
}
