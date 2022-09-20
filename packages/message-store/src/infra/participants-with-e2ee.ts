import {
  ParticipantRepositoryEntry,
  ParticipantsRepository,
} from "../application/participants-repository";

type ParticipantInput = {
  address: string;
  topicId: string;
  publicKey?: string;
};

export class ParticipantsWithE2EE {
  constructor(private participantsRepository: ParticipantsRepository) {}

  getParticipants = async (where: { topicId: string; active: boolean }) => {
    const participants = await this.participantsRepository.getByTopic(
      where.topicId
    );

    return participants.filter((participant) => {
      if (where.active) {
        return isActiveParticipant(participant);
      } else {
        return !isActiveParticipant(participant);
      }
    });
  };

  upsertParticipant = async ({
    address,
    publicKey,
    topicId,
  }: ParticipantInput) => {
    await this.participantsRepository.upsert(address, {
      publicKey,
      topicId,
    });
  };
}

const isActiveParticipant = (participant: ParticipantRepositoryEntry) =>
  Boolean(participant.publicKey);
