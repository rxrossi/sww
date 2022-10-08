import nacl from "tweetnacl";
import naclUtils from "tweetnacl-util";

export type EncryptedMessage = {
  cipherText: string;
  oneTimeCode: string;
};

export const isEncryptedMessage = (input: any): input is EncryptedMessage => {
  return "cipherText" in input && "oneTimeCode" in input;
};

export interface KeyPair {
  publicKey: Uint8Array;
  secretKey: Uint8Array;
}

type SharedKeys = {
  mySecretKey: Uint8Array;
  theirPublicKey: Uint8Array;
};

export class Encryption {
  encrypt = (data: any, sharedKeys: SharedKeys): EncryptedMessage => {
    const oneTimeCode = nacl.randomBytes(24);

    const cipherText = nacl.box.after(
      naclUtils.decodeUTF8(JSON.stringify(data)),
      oneTimeCode,
      this.getSharedKey(sharedKeys)
    );

    return {
      cipherText: naclUtils.encodeBase64(cipherText),
      oneTimeCode: naclUtils.encodeBase64(oneTimeCode),
    };
  };

  decrypt = <DecryptedMessage>(
    data: EncryptedMessage,
    sharedKeys: SharedKeys,
    any: any
  ): DecryptedMessage => {
    const decrypted = nacl.box.open.after(
      naclUtils.decodeBase64(data.cipherText),
      naclUtils.decodeBase64(data.oneTimeCode),
      this.getSharedKey(sharedKeys)
    );

    if (!decrypted) {
      console.error("Error when decrypting the payload", {
        data,
        sharedKeys,
        shared: this.getSharedKey(sharedKeys),
        any,
      });
      throw new Error("Error when decrypting the payload");
    }

    return JSON.parse(naclUtils.encodeUTF8(decrypted));
  };

  generatePair = (): KeyPair => {
    return nacl.box.keyPair();
  };

  private getSharedKey = ({
    theirPublicKey,
    mySecretKey,
  }: SharedKeys): Uint8Array => {
    return nacl.box.before(theirPublicKey, mySecretKey);
  };
}
