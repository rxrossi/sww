import { IdGenerator } from "src/shared/application/idGenerator";
import { EventsApi, Participant, Topic } from "../application/api";
import { InvitesRepository } from "../application/invitesRepository";
import { ParticipantsRepository } from "../application/participantsRepository";
import { TopicsRepository } from "../application/topicsRepository";

type MessageParticipant = (message: any, walletAddress: string) => void;

export class EventsApiImplementation implements EventsApi {
  constructor(
    private topicsRepository: TopicsRepository,
    private participantsRepository: ParticipantsRepository,
    private invitesRepository: InvitesRepository,
    private idGenerator: IdGenerator,
    private messageParticipant: MessageParticipant
  ) {}

  async createTopic(name: string): Promise<string> {
    const topic = {
      id: this.idGenerator.uuid(),
      name,
    };

    await this.topicsRepository.add({ name: topic.name, id: topic.id });

    return topic.id;
  }

  getParticipants(): Promise<Participant[]> {
    return this.participantsRepository.getAll();
  }

  getTopics(): Promise<Topic[]> {
    return this.topicsRepository.getAll();
  }

  addInvite = async (
    topicId: string,
    walletAddress: string,
    inviteUuid: string
  ): Promise<void> => {
    await this.invitesRepository.add({
      inviteeWalletAddress: walletAddress,
      topicId,
      uuid: inviteUuid,
      status: "pending",
    });
  };

  acceptInvite = async (
    inviteId: string,
    asWalletAddress: string
  ): Promise<void> => {
    const invite = await this.invitesRepository.getById(inviteId);
    if (!invite) {
      console.error("Invite not found", { inviteId });
      return;
    }

    if (invite.inviteeWalletAddress != asWalletAddress) {
      console.error("Invite accepted from a different walletAddress", {
        walletAddress: asWalletAddress,
      });
      return;
    }
    await this.invitesRepository.update(inviteId, "accepted");
    await this.participantsRepository.add({
      walletAddress: invite.inviteeWalletAddress,
    });
    // TODO: figure out how to message other participants
    // The SDK will call the api.acceptInvite passing the inviteId and the sentFrom
    // it will also emit the event to every Participant
    // ---
    // SDK can call the API methods
  };
}
