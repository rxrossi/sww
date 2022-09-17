type Entry = {
  to: string;
  from: string;
  eventULID: string;
  payload: string;
  timestamp: number;
  acknowledged: boolean;
};

type EntryInput = {
  to: Entry["to"];
  from: Entry["from"];
  payload: Entry["payload"];
  eventULID: Entry["eventULID"];
  acknowledged: Entry["acknowledged"];
};

type ReadArg = {
  to: string;
  sinceTimestamp?: number;
};

export interface MessageStore {
  save({}: EntryInput): Promise<void>;
  read({}: ReadArg): Promise<Array<Entry>>;
  getById(id: string): Promise<Entry | undefined>;
  updateById(id: string, entry: Omit<Entry, "id">): Promise<void>;
}

export class MessageStoreInMemory implements MessageStore {
  private entries: Array<Entry> = [];

  save({ ...input }: EntryInput) {
    this.entries.push({ ...input, timestamp: Date.now(), acknowledged: false });
    return Promise.resolve();
  }

  read({ to }: ReadArg) {
    return Promise.resolve(this.entries.filter((entry) => entry.to === to));
  }

  getById(id: string) {
    return Promise.resolve(
      this.entries.find((entry) => entry.eventULID === id)
    );
  }

  async updateById(id: string, entry: Omit<Entry, "id">): Promise<void> {
    const toUpdateIndex = this.entries.findIndex(
      (entry) => entry.eventULID === id
    );

    if (toUpdateIndex >= 0) {
      this.entries[toUpdateIndex] = {
        ...entry,
        eventULID: id,
      };
    }

    return Promise.resolve(undefined);
  }

  clear() {
    this.entries = [];
  }
}
