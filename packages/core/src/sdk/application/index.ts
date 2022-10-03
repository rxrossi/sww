import { buildSdk as buildInvitesSdk } from "src/invites/application";
import { buildSdk as buildGroupsSdk } from "src/groups/application";
import { SocketIoClient } from "./io-client/infra/base-io-client-socket-io";
import { Events, EventsRepositoryInMemory } from "src/events";
import { EventsSync } from "src/event-sync";
import { Ids } from "src/ids";

export const buildSdk = () => {
  const ioClient = new SocketIoClient("http://localhost:9977");

  const ids = new Ids();

  const eventStore = new Events({
    repository: new EventsRepositoryInMemory(),
  });

  const eventsSync = new EventsSync({
    emitEvent: ioClient.send,
    events: eventStore,
  });

  ioClient.addOnEvent(eventStore.eventHandler);

  const groups = buildGroupsSdk({
    addOnEvent: eventStore.addEventHandler,
    emitEvent: ioClient.send,
    ids,
  });

  const invites = buildInvitesSdk({
    emitEvent: ioClient.send,
    addOnEvent: eventStore.addEventHandler,
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
