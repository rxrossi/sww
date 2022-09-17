import { IOClientSharedNodeProcess } from "src/shared/infra/ioClientSharedNodeProcess";
import { buildE2EEModule, E2EERepository } from "./module";

const buildTestModule = (walletAddress: string) => {
  const repository = new E2EERepository();
  const ioClient = new IOClientSharedNodeProcess(walletAddress);

  const module = buildE2EEModule({
    ioClient,
    repository,
  });

  return {
    address: walletAddress,
    module,
    repository,
  };
};

describe("E2EE", () => {
  test("handshake works", async () => {
    const client1 = buildTestModule("address1");
    const client2 = buildTestModule("address2");

    expect(client1.module.sdk.areKeysExchangedWith(client2.address)).toEqual(
      false
    );
    expect(client2.module.sdk.areKeysExchangedWith(client1.address)).toEqual(
      false
    );

    client1.module.sdk.handshakeWith(client2.address);
    expect(client1.module.sdk.areKeysExchangedWith(client2.address)).toEqual(
      false
    );
    expect(client2.module.sdk.areKeysExchangedWith(client1.address)).toEqual(
      false
    );

    client2.module.sdk.handshakeWith(client1.address);
    expect(client1.module.sdk.areKeysExchangedWith(client2.address)).toEqual(
      true
    );
    expect(client2.module.sdk.areKeysExchangedWith(client1.address)).toEqual(
      true
    );
  });

  test("encrypt to another person", () => {
    const client1 = buildTestModule("address1");
    const client2 = buildTestModule("address2");
    client1.module.sdk.handshakeWith(client2.address);
    client2.module.sdk.handshakeWith(client1.address);

    const encrypted = client1.module.sdk.encrypt(client2.address, {
      payload: "message from client1",
    });

    expect(encrypted).toEqual({
      cipherText: expect.any(String),
      oneTimeCode: expect.any(String),
    });

    const decrypted = client2.module.sdk.decrypt(client1.address, encrypted);

    expect(decrypted).toEqual({
      payload: "message from client1",
    });
  });

  test("encrypt to himself", () => {
    const client1 = buildTestModule("address1");
    client1.module.sdk.handshakeWith(client1.address);

    const encrypted = client1.module.sdk.encrypt(client1.address, {
      payload: "message from client1",
    });

    expect(encrypted).toEqual({
      cipherText: expect.any(String),
      oneTimeCode: expect.any(String),
    });

    const decrypted = client1.module.sdk.decrypt(client1.address, encrypted);

    expect(decrypted).toEqual({
      payload: "message from client1",
    });
  });
});
