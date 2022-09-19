interface EventsSDK {
  createTopic(name: string): Topic["id"];
  getTopics(): Promise<Array<Topic>>;
  invite(topicId: string, walletAddress: string): void;
  joinTopic(inviteId: string): void;
  getParticipants(): Promise<Array<Participant>>;
  addEvent(): void;
  getEvents(): Promise<Array<Participant>>;
}

type Event = {
  ulid: string;
  data: any;
  metadata: { sentTo: Array<Participant> };
};
type Topic = { id: string; name: string };
type Participant = { walletAddress: string };

export class EventsSDKSocketIO implements EventsSDK {
  createTopic(name: string, id: string): string {}
}
