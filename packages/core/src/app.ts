import { buildE2EEModule, E2EERepository } from "./e2ee/module";
import { ListInvitesUseCase } from "./invites/application/use-cases/list-invites";
import { InvitesRepositoryInMemory } from "./invites/infra/repositoryInMemory";
import { IOClientSharedNodeProcess } from "./shared/infra/ioClientSharedNodeProcess";
import { IOClientWithE2EE } from "./shared/infra/ioClientWithE2EE";
import { buildInvitesModule } from "src/invites/module";
import { AcceptInviteUseCase } from "./invites/application/use-cases/accept-invite";
import { NewInviteUseCase } from "./invites/application/use-cases/new-invite";
import { IOClient } from "./shared/application/ioClient";
import { InvitesRepository } from "./invites/application/repository";

type InfraDeps = {
  baseIOClient: IOClient;
  invitesRepository: InvitesRepository;
  e2eeRepository: E2EERepository;
};

const infraDepsByType = (
  walletAddress: string
): Record<"inMemory" | "regular", InfraDeps> => ({
  inMemory: {
    baseIOClient: new IOClientSharedNodeProcess(walletAddress),
    invitesRepository: new InvitesRepositoryInMemory(),
    e2eeRepository: new E2EERepository(),
  },
  regular: {
    baseIOClient: new IOClientSharedNodeProcess(walletAddress),
    invitesRepository: new InvitesRepositoryInMemory(),
    e2eeRepository: new E2EERepository(),
  },
});

export const buildApp = (
  walletAddress: string,
  depsType: keyof ReturnType<typeof infraDepsByType>
) => {
  const infraDeps = infraDepsByType(walletAddress)[depsType];

  const e2eeModule = buildE2EEModule({
    ioClient: infraDeps.baseIOClient,
    repository: infraDeps.e2eeRepository,
  });

  const ioClient = new IOClientWithE2EE(infraDeps.baseIOClient, e2eeModule.sdk);

  const invitesModules = buildInvitesModule({
    ioClient,
    newInviteUseCase: new NewInviteUseCase(infraDeps.invitesRepository),
    listInvitesUseCase: new ListInvitesUseCase(infraDeps.invitesRepository),
    acceptInviteUseCase: new AcceptInviteUseCase(infraDeps.invitesRepository),
  });

  return {
    invites: invitesModules.sdk,
    e2ee: e2eeModule.sdk,
  };
};
