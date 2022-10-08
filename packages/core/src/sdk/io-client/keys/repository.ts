type SharedKeys = {
  mySecretKey?: Uint8Array;
  theirPublicKey?: Uint8Array;
};

type SharedKeysByAddress = {
  [recipientWalletAddress: string]: SharedKeys | undefined;
};

export interface KeysRepository {
  upsert(address: string, input: SharedKeys): void;
  getAll(): SharedKeysByAddress;
  getFor(address: string): SharedKeys | undefined;
}

export class KeysRepositoryInMemory implements KeysRepository {
  private sharedKeys: SharedKeysByAddress = {};

  getAll() {
    return this.sharedKeys;
  }

  getFor(address: string) {
    return this.sharedKeys[address];
  }

  upsert(address: string, input: SharedKeys) {
    this.sharedKeys[address] = {
      ...(this.sharedKeys[address] || {}),
      ...input,
    };
  }
}
