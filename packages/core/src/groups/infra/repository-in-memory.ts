import {
  GroupsRepository,
  GroupsRepositoryEntry,
} from "../application/repository";

export class GroupsRepositoryInMemory implements GroupsRepository {
  private entries: Array<GroupsRepositoryEntry> = [];

  create = ({ name, id }: { id: string; name: string }): void => {
    this.entries.push({
      id,
      name,
    });
  };

  list = (): Array<GroupsRepositoryEntry> => {
    return this.entries;
  };

  getById = (id: string): GroupsRepositoryEntry | undefined => {
    return this.entries.find((entry) => entry.id === id);
  };
}
