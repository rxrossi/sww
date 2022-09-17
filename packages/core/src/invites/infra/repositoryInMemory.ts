import {
  InviteEventRepositoryEntry,
  InvitesRepository,
} from "../application/repository";

export class InvitesRepositoryInMemory implements InvitesRepository {
  private invites: Array<InviteEventRepositoryEntry> = [];

  async updateById(
    id: string,
    entry: Omit<InviteEventRepositoryEntry, "id">
  ): Promise<void> {
    const index = this.invites.findIndex((invite) => invite.id === id);
    this.invites[index] = { id, ...entry };
  }

  async add(invite: InviteEventRepositoryEntry) {
    this.invites.push(invite);
  }

  async getAll() {
    return this.invites;
  }
}
