export type GroupEntry = {
  id: string;
  name: string;
};

export interface GroupsRepository {
  getAll(): Promise<Array<GroupEntry>>;
  create(input: GroupEntry): Promise<void>;
}
