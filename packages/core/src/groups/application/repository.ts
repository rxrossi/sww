export type GroupsRepositoryEntry = {
  id: string;
  name: string;
};

export interface GroupsRepository {
  create({ name }: { name: string }): void;
  getById(id: string): GroupsRepositoryEntry | undefined;
  list(): Array<GroupsRepositoryEntry>;
}
