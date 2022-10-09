import { Client as WsClient } from "@sww/ws-client";
import { buildSdk as buildInvitesSdk } from "src/invites/application";
import { buildSdk as buildGroupsSdk } from "src/groups/application";
import { build } from "../io-client";

import { Ids } from "src/ids";

export const buildSdk = (url: string) => {
  const ids = new Ids();

  const { ioClient, eventsSync, whoAmI } = build(
    new WsClient({
      socketIoOptions: [
        url,
        {
          autoConnect: false,
          //TODO: enable again and put a call to get all messages
          reconnection: false,
        },
      ],
    })
  );

  const groups = buildGroupsSdk({
    addOnEvent: ioClient.addEventHandler,
    emitEvent: ioClient.emitEvent,
    ids,
  });

  const invites = buildInvitesSdk({
    whoAmI,
    addOnEvent: ioClient.addEventHandler,
    emitEvent: ioClient.emitEvent,
    groupsRepository: groups.repository,
    syncGroupWith: eventsSync.syncGroupWith,
    ids,
  });

  return {
    ioClient,
    groups: groups.sdk,
    invites,
  };
};
