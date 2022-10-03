import { SyncGroupWith } from "src/event-sync";
import { GroupsRepository } from "src/groups/application/repository";
import { Ids } from "src/ids";
import {
  EmitEvent,
  EventHandler,
} from "src/sdk/application/io-client/application/base-io-client";
import { InvitesRepositoryInMemory } from "../infra/repository-in-memory";
import { InvitesEventHandler } from "./event-handler";
import { InvitesSdk } from "./sdk";

export { InvitesSdk } from "./sdk";
export { InvitesEventHandler } from "./event-handler";

export const buildSdk = ({
  emitEvent,
  groupsRepository,
  addOnEvent,
  syncGroupWith,
  ids,
}: {
  emitEvent: EmitEvent;
  addOnEvent: (eventHandler: EventHandler<any>) => void;
  groupsRepository: GroupsRepository;
  syncGroupWith: SyncGroupWith;
  ids: Ids;
}) => {
  const invitesRepository = new InvitesRepositoryInMemory();

  const sdk = new InvitesSdk({
    emitEvent,
    groupsRepository,
    invitesRepository,
    ids,
  });

  const { eventHandler } = new InvitesEventHandler({
    invitesRepository,
    syncGroupWith,
  });

  addOnEvent(eventHandler);

  return sdk;
};
