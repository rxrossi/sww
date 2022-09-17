import { InvitesRepository } from "../repository";

type Input = {
  to: {
    name: string;
    walletAddress: string;
  };
  from: {
    name: string;
    walletAddress: string;
  };
  toJoinGroup: string;
};

export class NewInviteUseCase {
  constructor(private invitesRepository: InvitesRepository) {}

  execute(input: Input) {
    this.invitesRepository.add({
      id: "something",
      to: input.to,
      from: input.from,
      toJoinGroup: input.toJoinGroup,
      status: "pending",
    });
  }
}
