import { GroupEntry, GroupsRepository } from "../application/groups-repository";

export class GroupsRepositoryInMemory implements GroupsRepository {
  private groups: Array<GroupEntry> = [];

  async getAll(): Promise<Array<GroupEntry>> {
    return this.groups;
  }

  async create(input: GroupEntry): Promise<void> {
    this.groups.push(input);
  }
}
