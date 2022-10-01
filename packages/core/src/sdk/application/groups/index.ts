import { NewEventInput } from "../events";
import {
  EmitEvent,
  EventHandler,
} from "../io-client/application/base-io-client";
import {
  Invites,
  InvitesEventHandler,
} from "./application/invites/application";
import { InvitesRepositoryInMemory } from "./application/invites/infra/repository-in-memory";
import { Groups } from "./application/sdk";
import { GroupsRepositoryInMemory } from "./infra/repository-in-memory";

export const buildSdk = ({
  emitEvent,
  addOnEvent,
}: {
  emitEvent: EmitEvent<NewEventInput<any, any>>;
  addOnEvent: (eventHandler: EventHandler<any>) => void;
}): Groups => {
  const repository = new GroupsRepositoryInMemory();
  const invitesRepository = new InvitesRepositoryInMemory();

  const invitesEventHandler = new InvitesEventHandler({ invitesRepository });
  addOnEvent(invitesEventHandler.eventHandler);

  const sdk = new Groups({
    repository,
    invites: new Invites({
      groupsRepository: repository,
      invitesRepository,
      emitEvent,
    }),
  });

  return sdk;
};
