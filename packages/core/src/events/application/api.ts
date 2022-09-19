export interface EventsApi {
  createTopic(name: string): Promise<Topic["id"]>;
  getTopics(): Promise<Array<Topic>>;
  addInvite(
    topicId: string,
    walletAddress: string,
    inviteUuid: string
  ): Promise<void>;
  acceptInvite(inviteId: string, asWalletAddress: string): Promise<void>;
  getParticipants(): Promise<Array<Participant>>;
  addEvent(): Promise<void>;
  getEvents(): Promise<Array<Participant>>;
}

export type Event = {
  ulid: string;
  data: any;
  metadata: { sentTo: Array<Participant> };
};

export type Topic = { id: string; name: string };

export type Participant = { walletAddress: string };
