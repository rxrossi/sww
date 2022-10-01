import { buildSdk as buildInvitesSdk } from "src/invites/application";
import { buildSdk as buildGroupsSdk } from "src/groups/application";
import { SocketIoClient } from "./io-client/infra/base-io-client-socket-io";

export const buildSdk = () => {
  const groups = buildGroupsSdk();

  const ioClient = new SocketIoClient("http://localhost:9978");

  const invites = buildInvitesSdk({
    emitEvent: ioClient.send,
    addOnEvent: ioClient.addOnEvent,
    groupsRepository: groups.repository,
  });

  return {
    ioClient,
    groups: groups.sdk,
    invites,
  };
};
