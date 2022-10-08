import { SyncWithAddress } from "src/event-sync";
import { BaseIoClientEventHandler } from "../base-io-client";
import { isExchangeKeysEventPayload } from "./events";
import { KeysRepository } from "./repository";
import { KeysExchangerSdk } from "./sdk";

export class KeysExchangerEventHandler {
  constructor(
    private deps: {
      repository: KeysRepository;
      whoAmI: () => string;
      syncWithAddress: SyncWithAddress;
      exchangedKeysWith: KeysExchangerSdk["exchangeKeysWith"];
    }
  ) {}

  eventHandler: BaseIoClientEventHandler = (event) => {
    if (event.from === this.deps.whoAmI()) {
      return;
    }

    if (isExchangeKeysEventPayload(event.payload)) {
      this.deps.repository.upsert(event.from, {
        theirPublicKey: event.payload.publicKey,
      });

      const exchangedKeys = this.deps.repository.getFor(event.from);

      if (!exchangedKeys?.mySecretKey) {
        this.deps.exchangedKeysWith(event.from);
      } else {
        this.deps.syncWithAddress(event.from);
      }
    }
  };
}
