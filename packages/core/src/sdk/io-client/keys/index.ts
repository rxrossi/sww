import { SyncWithAddress } from "src/event-sync";
import { Ids } from "src/ids";
import {
  BaseIoClientEmitEvent,
  BaseIoClientEventHandler,
} from "../base-io-client";
import { Encryption } from "../encryption";
import { KeysExchangerEventHandler } from "./event-handler";
import { KeysRepository } from "./repository";
import { KeysExchangerSdk } from "./sdk";

export const build = ({
  repository,
  emitEvent,
  whoAmI,
  encryption,
  ids,
  syncWithAddress,
  addOnEvent,
}: {
  repository: KeysRepository;
  encryption: Encryption;
  syncWithAddress: SyncWithAddress;
  ids: Ids;
  emitEvent: BaseIoClientEmitEvent;
  whoAmI: () => string;
  addOnEvent: (eventHandler: BaseIoClientEventHandler) => void;
}) => {
  const sdk = new KeysExchangerSdk({
    whoAmI,
    encryption,
    emitEvent,
    repository,
    ids,
  });

  addOnEvent(
    new KeysExchangerEventHandler({
      whoAmI,
      exchangedKeysWith: sdk.exchangeKeysWith,
      repository,
      syncWithAddress,
    }).eventHandler
  );

  return sdk;
};
