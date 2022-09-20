export type Message = {
  ulid: string;
  sentFrom: string;
  data: any;
  topicId: string;
  metadata: {
    sentTo: string[];
    timestamp: number;
  };
};
