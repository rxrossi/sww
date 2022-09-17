import { IOClient } from "src/shared/application/ioClient";
import { AcceptInviteUseCase } from "./application/use-cases/accept-invite";
import { ListInvitesUseCase } from "./application/use-cases/list-invites";
import { NewInviteUseCase } from "./application/use-cases/new-invite";
import { InvitesIOEventHandler } from "./infra/ioEventHandler";
import { InviteSDK } from "./infra/sdk";

export const buildInvitesModule = ({
  ioClient,
  newInviteUseCase,
  acceptInviteUseCase,
  listInvitesUseCase,
}: {
  ioClient: IOClient;
  newInviteUseCase: NewInviteUseCase;
  acceptInviteUseCase: AcceptInviteUseCase;
  listInvitesUseCase: ListInvitesUseCase;
}) => {
  new InvitesIOEventHandler(ioClient, newInviteUseCase, acceptInviteUseCase);

  return {
    sdk: new InviteSDK(ioClient, listInvitesUseCase),
  };
};
