import { Client as WsClient } from "@sww/ws-client";
import { Encryption } from "./encryption";
import { BaseIoClient } from "./base-io-client";
import { E2eeHelper } from "./e2ee-helper";
import { IoClient as IoClientE2ee } from "./io-client-e2ee";
import { KeysRepositoryInMemory } from "./keys/repository";
import { build as buildKeysExchanger } from "./keys";
import { Ids } from "src/ids";
import { EventsSync } from "src/event-sync";
import { Events, EventsRepositoryInMemory } from "src/events";

export const build = (wsClient: WsClient<any>) => {
  const keysRepository = new KeysRepositoryInMemory();
  const baseClient = new BaseIoClient(wsClient);
  const encryption = new Encryption();
  const eventStore = new Events({ repository: new EventsRepositoryInMemory() });

  const ioClientE2ee = new IoClientE2ee({
    whoAmI: baseClient.whoAmI,
    eventStore,
    baseClient,
    e2eeHelpers: new E2eeHelper({
      whoAmI: baseClient.whoAmI,
      keysRepository,
      encryption,
    }),
    keysExchanger: buildKeysExchanger({
      whoAmI: baseClient.whoAmI,
      syncWithAddress: (address: string) => {
        //TODO: this looks odd... maybe not?
        eventsSync.syncWithAddress(address);
      },
      addOnEvent: baseClient.addOnEvent,
      emitEvent: baseClient.send,
      repository: keysRepository,
      encryption,
      ids: new Ids(),
    }),
    keysRepository,
  });

  const eventsSync = new EventsSync({
    emitEvent: ioClientE2ee.emitEvent,
    events: eventStore,
  });

  return {
    ioClient: ioClientE2ee,
    eventsSync: eventsSync,
    whoAmI: baseClient.whoAmI,
  };
};
