import { buildSdk } from "./groups";
import { SocketIoClient } from "./io-client/infra/base-io-client-socket-io";

export const buildSdks = () => {
  const ioClient = new SocketIoClient("http://localhost:9978");

  return {
    groups: buildSdk({
      emitEvent: (evt, address) =>
        ioClient.send({ payload: evt, to: address, eventULID: evt.ulid }),
      addOnEvent: ioClient.addOnEvent,
    }),
    ioClient,
  };
};
