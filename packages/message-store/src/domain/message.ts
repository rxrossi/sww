type SentTo = {
  address: string;
};

export type Message = {
  ulid: string;
  sentFrom: string;
  data: any;
  topicId: string;
  metadata: {
    sentTo: Array<SentTo>;
    /** When the Message.data was generated */
    timestamp: number;
  };
};
