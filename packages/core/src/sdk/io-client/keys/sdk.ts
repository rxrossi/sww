import { Ids } from "src/ids";
import { BaseIoClientEmitEvent } from "../base-io-client";
import { Encryption } from "../encryption";
import { ExchangeKeysEventPayload } from "./events";
import { KeysRepository } from "./repository";

export class KeysExchangerSdk {
  constructor(
    private deps: {
      repository: KeysRepository;
      encryption: Encryption;
      emitEvent: BaseIoClientEmitEvent;
      whoAmI: () => string;
      ids: Ids;
    }
  ) {}

  setupPairForMyselfIfThereIsNotOne = () => {
    if (this.deps.repository.getFor(this.deps.whoAmI())) {
      return;
    }

    const keys = this.deps.encryption.generatePair();

    this.deps.repository.upsert(this.deps.whoAmI(), {
      mySecretKey: keys.secretKey,
      //TODO: the name here is pretty weird
      theirPublicKey: keys.publicKey,
    });
  };

  exchangeKeysWith = (address: string) => {
    const keys = this.deps.encryption.generatePair();

    this.deps.repository.upsert(address, { mySecretKey: keys.secretKey });

    const payload: ExchangeKeysEventPayload = {
      publicKey: keys.publicKey,
      type: "exchange-keys",
    };
    this.deps.emitEvent({
      payload,
      eventULID: this.deps.ids.ulid(),
      to: address,
    });
  };
}
