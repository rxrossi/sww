import { EventHandler } from "src/sdk/application/io-client/application/base-io-client";
import { Evt } from "src/shared/event";

interface EventsRepository {
  add(event: Evt): void;
  getByUlid(ulid: string): Evt | undefined;
  getAllByGroupId(groupId: string): Array<Evt>;
}

export class EventsRepositoryInMemory implements EventsRepository {
  entries: Array<Evt> = [];

  add = (event: Evt) => {
    this.entries.push(event);
  };

  getByUlid = (ulid: string) => {
    return this.entries.find((it) => it.ulid === ulid);
  };

  getAllByGroupId = (groupId: string) => {
    return this.entries.filter((it) => it.data.groupId === groupId);
  };
}

export class Events {
  private eventHandlers: Array<EventHandler<Evt>> = [];

  constructor(
    private deps: {
      repository: EventsRepository;
    }
  ) {}

  private addEvent = (event: Evt) => {
    this.deps.repository.add(event);
  };

  getAllByGroupId = (groupId: string) => {
    return this.deps.repository.getAllByGroupId(groupId);
  };

  addEventHandler = (eventHandler: EventHandler<Evt>) => {
    this.eventHandlers.push(eventHandler);
  };

  eventHandler: EventHandler<Evt> = (event) => {
    //TODO: handle duplicated event based on ulid
    const evt = this.deps.repository.getByUlid(event.eventULID);
    if (evt) {
      return;
    }

    this.addEvent({
      data: event.payload.data,
      ioData: event.payload.ioData,
      ulid: event.payload.ulid,
      sentFrom: event.from,
    });

    this.eventHandlers.forEach((eventHandler) => {
      // TODO
      eventHandler(event);
    });
  };
}
