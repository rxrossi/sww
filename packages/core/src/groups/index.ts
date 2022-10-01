import { NewEventInput } from "src/sdk/application/events";
import {
  EmitEvent,
  EventHandler,
} from "src/sdk/application/io-client/application/base-io-client";
import { Invites, InvitesEventHandler } from "./application/invites";
import { Groups } from "./application/sdk";
import { InvitesRepositoryInMemory } from "./infra/invites/repository-in-memory";
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
