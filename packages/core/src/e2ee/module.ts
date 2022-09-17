import { IOClient, IOEvent } from "src/shared/application/ioClient";
import { IOEventHandler } from "src/shared/application/ioEventHandler";
import nacl from "tweetnacl";
import naclUtils from "tweetnacl-util";

type HandshakeEvent = {
  ulid: string;
  sentFrom: string;
  payload: {
    type: "e2ee:handshake";
    myPublicKey: string;
  };
};

export type EncryptedMessage = {
  cipherText: string;
  oneTimeCode: string;
};

export const isHandshakeEvent = (event: IOEvent): event is HandshakeEvent => {
  return event?.payload.type === "e2ee:handshake";
};

export class E2EESdk {
  private ioClient: IOClient<HandshakeEvent["payload"]>;
  constructor(ioClient: IOClient, private e2eeRepository: E2EERepository) {
    this.ioClient = ioClient;
  }

  handshakeWith = (walletAddress: string) => {
    const keys = this.generatePair();

    this.e2eeRepository.upsert(walletAddress, { mySecretKey: keys.secretKey });

    this.ioClient.send(
      {
        ulid: "ulid",
        payload: {
          type: "e2ee:handshake",
          myPublicKey: naclUtils.encodeBase64(keys.publicKey),
        },
      },
      [{ walletAddress }]
    );
  };

  areKeysExchangedWith = (recipientWalletAddress: string): boolean => {
    const entry = this.e2eeRepository.get(recipientWalletAddress);
    if (!entry) {
      return false;
    }
    const { theirPublicKey, mySecretKey } = entry;

    return Boolean(theirPublicKey) && Boolean(mySecretKey);
  };

  encrypt = (
    recipientWalletAddress: string,
    payload: any
  ): EncryptedMessage => {
    const sharedKey = this.getSharedKeyWith(recipientWalletAddress);

    const oneTimeCode = nacl.randomBytes(24);

    const cipherText = nacl.box.after(
      naclUtils.decodeUTF8(JSON.stringify(payload)),
      oneTimeCode,
      sharedKey
    );

    return {
      cipherText: naclUtils.encodeBase64(cipherText),
      oneTimeCode: naclUtils.encodeBase64(oneTimeCode),
    };
  };

  decrypt = <DecryptedMessage>(
    senderWalletAddress: string,
    encrypted: EncryptedMessage
  ): DecryptedMessage => {
    const sharedKey = this.getSharedKeyWith(senderWalletAddress);

    const decrypted = nacl.box.open.after(
      naclUtils.decodeBase64(encrypted.cipherText),
      naclUtils.decodeBase64(encrypted.oneTimeCode),
      sharedKey
    );

    if (!decrypted) {
      console.error("Error when decrypting the payload", {
        from: senderWalletAddress,
        encrypted,
        sharedKey,
        repoEntries: this.e2eeRepository.getAll(),
      });
      throw new Error("Error when decrypting the payload");
    }

    return JSON.parse(naclUtils.encodeUTF8(decrypted));
  };

  private getSharedKeyWith = (recipientWalletAddress: string): Uint8Array => {
    const entry = this.e2eeRepository.get(recipientWalletAddress);
    if (!entry) {
      console.log("Can't get shared key", {
        recipientWalletAddress,
        me: this.ioClient.getAddress(),
      });
      throw new Error("Can't get shared key");
    }

    const { theirPublicKey, mySecretKey } = entry;

    if (!theirPublicKey || !mySecretKey) {
      throw new Error("Can't get shared key");
    }

    return nacl.box.before(theirPublicKey, mySecretKey);
  };

  private generatePair = () => {
    return nacl.box.keyPair();
  };
}

type SharedKeyEntry = {
  mySecretKey?: Uint8Array;
  theirPublicKey?: Uint8Array;
};

type SharedKeys = {
  [recipientWalletAddress: string]: SharedKeyEntry | undefined;
};

//TODO: This is an implementation, but is not named as such
export class E2EERepository {
  private sharedKeys: SharedKeys = {};

  getAll() {
    return this.sharedKeys;
  }

  get(recipientWalletAddress: string) {
    return this.sharedKeys[recipientWalletAddress];
  }

  upsert(recipientWalletAddress: string, input: SharedKeyEntry) {
    this.sharedKeys[recipientWalletAddress] = {
      ...(this.sharedKeys[recipientWalletAddress] || {}),
      ...input,
    };
  }
}

export class E2EEEventHandler implements IOEventHandler {
  constructor(
    private ioClient: IOClient<HandshakeEvent["payload"]>,
    private e2eeRepository: E2EERepository
  ) {
    this.ioClient.addOnEventHandler(this.onEvent);
  }

  onEvent = (event: IOEvent): void => {
    if (isHandshakeEvent(event)) {
      this.e2eeRepository.upsert(event.sentFrom, {
        theirPublicKey: naclUtils.decodeBase64(event.payload.myPublicKey),
      });
    }
  };
}

export const buildE2EEModule = ({
  ioClient,
  repository,
}: {
  ioClient: IOClient;
  repository: E2EERepository;
}) => {
  new E2EEEventHandler(ioClient, repository);
  return {
    sdk: new E2EESdk(ioClient, repository),
  };
};
