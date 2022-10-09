import { EncryptedMessage, Encryption } from "./encryption";
import { KeysRepository } from "./keys/repository";

type Dependencies = {
  encryption: Encryption;
  keysRepository: KeysRepository;
  whoAmI: () => string;
};

export class E2eeHelper {
  constructor(private deps: Dependencies) {}

  encryptEvent(message: any, toAddress: string): EncryptedMessage {
    return this.deps.encryption.encrypt(
      message,
      this.getBothKeysOrThrow(toAddress)
    );
  }

  decryptEvent(message: EncryptedMessage, fromAddress: string) {
    return this.deps.encryption.decrypt(
      message,
      this.getBothKeysOrThrow(fromAddress)
    );
  }

  private getBothKeysOrThrow = (
    theirAddress: string
  ): { theirPublicKey: Uint8Array; mySecretKey: Uint8Array } => {
    const keys = this.deps.keysRepository.getFor(theirAddress);
    if (!keys?.mySecretKey || !keys?.theirPublicKey) {
      console.error("Cant't find keys", {
        theirAddress,
      });
      throw new Error("Can't find keys");
    }

    return {
      theirPublicKey: keys.theirPublicKey,
      mySecretKey: keys.mySecretKey,
    };
  };
}
