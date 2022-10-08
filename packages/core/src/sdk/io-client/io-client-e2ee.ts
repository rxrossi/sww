import { OutgoingEvent } from "src/shared/event";
import { BaseIoClient } from "./base-io-client";
import { Evt } from "src/shared/event";
import { E2eeHelper } from "./e2ee-helper";
import { isEncryptedMessage } from "./encryption";
import { EmitEvent, EventHandler } from "./types";
import { KeysExchangerSdk } from "./keys/sdk";
import { KeysRepository } from "./keys/repository";
import { Events } from "src/events";

type Dependencies = {
  baseClient: BaseIoClient;
  e2eeHelpers: E2eeHelper;
  keysExchanger: KeysExchangerSdk;
  keysRepository: KeysRepository;
  eventStore: Events;
  whoAmI: () => string;
};

export class IoClient {
  constructor(private deps: Dependencies) {
    this.deps.baseClient.addOnEvent((event) => {
      const x = {
        whoAmI: this.deps.whoAmI(),
        from: event.from,
        payload: event.payload,
      };

      const payload: Evt = isEncryptedMessage(event.payload)
        ? this.deps.e2eeHelpers.decryptEvent(event.payload, event.from, x)
        : event.payload;

      this.deps.eventStore.eventHandler({
        ...payload,
        sentFrom: event.from,
      });
    });
  }

  emitEvent: EmitEvent = (event, addresses) => {
    const addressesWithKeys = addresses.map((address) => ({
      address,
      keys: this.deps.keysRepository.getFor(address),
    }));

    const addressesWithoutKeys = addressesWithKeys
      .filter((it) => !it.keys)
      .map((it) => it.address);

    addressesWithoutKeys.forEach((address) => {
      this.deps.keysExchanger.exchangeKeysWith(address);
    });

    const canSendTo = addressesWithKeys
      .filter((it) => it.keys)
      .map((it) => it.address)
      .concat(this.deps.whoAmI());

    const outgoingEvent: OutgoingEvent = {
      ...event,
      ioData: {
        meantToBeSentTo: [...new Set([...addresses, this.deps.whoAmI()])],
        sentTo: [...new Set(canSendTo)],
        timestamp: Date.now(),
      },
    };

    outgoingEvent.ioData.sentTo.forEach((address) => {
      const encryptedPayload = this.deps.e2eeHelpers.encryptEvent(
        outgoingEvent,
        address
      );

      this.deps.baseClient.send({
        eventULID: event.ulid,
        payload: encryptedPayload,
        to: address,
      });
    });
  };

  addEventHandler = (eventHandler: EventHandler) => {
    this.deps.eventStore.addEventHandler(eventHandler);
  };

  connect = (input: { address: string; signedMessage: string }) => {
    this.deps.baseClient.connect(input);
    this.deps.keysExchanger.setupPairForMyselfIfThereIsNotOne();
  };
  disconnect = this.deps.baseClient.disconnect;
  asksForPersistedMessages = this.deps.baseClient.asksForPersistedMessages;
}
