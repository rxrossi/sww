interface Repository<EntryType> {
  add(entry: EntryType): Promise<void>;
  updateById(id: string, entry: Omit<EntryType, "id">): Promise<void>;
  getAll(): Promise<Array<EntryType>>;
}
