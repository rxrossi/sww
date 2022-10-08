import { EventHandler } from "src/sdk/io-client/types";
import { Evt } from "src/shared/event";

interface EventsRepository {
  upsert(event: Evt): void;
  getByUlid(ulid: string): Evt | undefined;
  getAllByGroupId(groupId: string): Array<Evt>;
  getAllByAddress(address: string): Array<Evt>;
}

export class EventsRepositoryInMemory implements EventsRepository {
  entries: Array<Evt> = [];

  upsert = (event: Evt) => {
    const index = this.entries.findIndex((it) => it.ulid === event.ulid);
    if (index < 0) {
      this.entries.push(event);
    } else {
      this.entries[index] = event;
    }
  };

  getByUlid = (ulid: string) => {
    return this.entries.find((it) => it.ulid === ulid);
  };

  getAllByGroupId = (groupId: string) => {
    return this.entries.filter((it) => it.data.groupId === groupId);
  };

  getAllByAddress = (address: string) => {
    return this.entries.filter((it) =>
      // TODO: we are storing other types of events (exchange keys, but should we?)
      // We either fix the type or stop doing it
      it.ioData?.meantToBeSentTo?.includes(address)
    );
  };
}

export class Events {
  private eventHandlers: Array<EventHandler> = [];

  constructor(
    private deps: {
      repository: EventsRepository;
    }
  ) {}

  private upsertEvent = (event: Evt) => {
    this.deps.repository.upsert(event);
  };

  getAllByGroupId = (groupId: string) => {
    return this.deps.repository.getAllByGroupId(groupId);
  };

  getAllByAddress = (address: string) => {
    return this.deps.repository.getAllByAddress(address);
  };

  addEventHandler = (eventHandler: EventHandler) => {
    this.eventHandlers.push(eventHandler);
  };

  eventHandler: EventHandler = (event) => {
    //TODO: handle duplicated event based on ulid

    this.upsertEvent(event);

    this.eventHandlers.forEach((eventHandler) => {
      eventHandler(event);
    });
  };
}
