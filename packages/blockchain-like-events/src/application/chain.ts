type Node = {
  walletAddress: string;
};

export interface Events<Event = any> {
  addEvent(event: Event): Promise<Event>;
  addNode(node: Node): Promise<Node>;
  getNodes(): Promise<Array<Node>>;
}

//TODO: rename the package
// I think that a block chain actually has a different purpose. Here, we don't care about checking if the blocks are valid or not.
//
// The purpose here is to:
// - Maintain a list of events
// - Maintain a list of nodes
// - When a node joins, he should receive a list of all events until that point
// - After a node joins, every message should be sent to him as well, which guarantees sync
// - An invite should be sent to every node and the invitee. The invite should contain the list of all members until that point

type BaseData = {
  type: string;
};

type OutgoingIOEvent<Data extends BaseData = BaseData, Metadata = any> = {
  ulid: string;
  data: Data;
  metadata: Metadata;
};

type IncomingIOEvent<
  Data extends BaseData = BaseData,
  Metadata = any
> = OutgoingIOEvent<Data, Metadata> & {
  sentFrom: string;
  // acknowledged: boolean
};

type IncomingIOEventCallback<Data extends BaseData> = (
  event: IncomingIOEvent<Data>
) => void;

interface IOClient<Data extends BaseData, Metadata = any> {
  /** Sends the event to the server */
  emit(ioEvent: OutgoingIOEvent<Data, Metadata>, nodes: Array<Node>): void;

  /** Adds incoming events from the server  */
  on(callback: IncomingIOEventCallback<Data>): void;
}

/** A topic could be, on an app like SWW, a Group. The Topic id could be the Group id  */
type Topic = {
  id: string;
};

interface IdGenerator {
  uuid(): string;
  ulid(): string;
}

interface NodeRepository {
  getAll(): Promise<Array<Node>>;
  add(node: Node): Promise<void>;
}

class EmitterSocketIO {
  constructor(
    private topic: Topic,
    private io: IOClient<AcceptInvitation | Invite>,
    private idGenerator: IdGenerator,
    private nodeRepository: NodeRepository
  ) {}
  async inviteNode(node: Node): Promise<void> {
    const nodes = await this.nodeRepository.getAll();

    this.io.emit(
      {
        ulid: this.idGenerator.ulid(),
        metadata: {},
        data: {
          inviteeWalletAddress: node.walletAddress,
          OTP: this.idGenerator.uuid(),
          topic: this.topic,
          type: "topic:invite",
          existingNodes: nodes,
        },
      },
      [...nodes, { walletAddress: node.walletAddress }]
    );
  }

  join({
    topic,
    OTP,
    nodes,
  }: {
    topic: Topic;
    OTP: string;
    nodes: Array<Node>;
  }) {
    this.io.emit(
      {
        ulid: this.idGenerator.ulid(),
        metadata: {},
        data: { OTP, type: "topic:accept-invitation", topic },
      },
      nodes
    );
  }
}

// TODO: Detect when a event has a ULID older than the current ULID and tell whoever cares to re-do the calc

type Invite = {
  type: "topic:invite";
  OTP: string;
  inviteeWalletAddress: string;
  topic: Topic;
  existingNodes: Array<Node>;
};

type AcceptInvitation = {
  type: "topic:accept-invitation";
  OTP: string;
  topic: Topic;
};

type InviteRepositoryEntry = {
  uuid: string;
  OTP: string;
  inviteeWalletAddress: string;
  status: "pending" | "accepted" | "rejected";
};

interface InviteRepository {
  add(entry: Invite): Promise<void>;
  getByWalletAddress(
    walletAddress: string
  ): Promise<InviteRepositoryEntry | undefined>;
  update(uuid: string, status: InviteRepositoryEntry["status"]): Promise<void>;
}

class IncomingEventsHandler {
  constructor(
    private inviteRepository: InviteRepository,
    private nodeRepository: NodeRepository,
    private io: IOClient<AcceptInvitation | Invite>
  ) {}

  handler = (event: IncomingIOEvent) => {
    console.log(event);
  };

  private onInviteNode = async (
    inviteEvent: IncomingIOEvent<Invite>
  ): Promise<void> => {
    this.inviteRepository.add(inviteEvent.data);
  };

  private onJoin = async (
    acceptInvite: IncomingIOEvent<AcceptInvitation>
  ): Promise<void> => {
    const invite = await this.inviteRepository.getByWalletAddress(
      acceptInvite.sentFrom
    );
    if (!invite) {
      console.log("Invite not found", {
        sentFrom: acceptInvite.sentFrom,
      });
      return;
    }

    this.inviteRepository.update(invite?.inviteeWalletAddress, "accepted");
    this.nodeRepository.add({ walletAddress: acceptInvite.sentFrom });

    //TODO: We need a callback that will know to check which events exists (not just the one that it created),
    //but was not marked as sent to this address and then begin to send all of them
  };
}

/** This class handles events and nodes for a single Topic. */
export class EventsSocketIO implements Events {
  topic: Topic;
  constructor(
    private topic: Topic,
    private eventHandler: IncomingEventsHandler,
    private emitter: EmitterSocketIO
  ) {
    this.topic = topic;
  }

  sendInvite = this.emitter.inviteNode;
  acceptInvite = this.emitter.join;
}
