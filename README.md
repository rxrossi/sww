## Events

A key part of the application is that it is based on events.
When a _Client_ wants to mutate data, he emits an _Event_ to himself and every participant to that topic/group.

Events tell a story, so to rebuild the application state, all that should be needed is the list of events in the correct order.

When a new person joins a group, one/all of the participants will emit all the events related to that topic/group, so the joiner will be able to have the same application state.

## End-to-End Encryption (E2EE)

Except for the exchange keys events, all the other events leaving the clients to the internet/other clients will be encrypted.

The encryption uses Diffie-Hellman, before clients starts talking to each other, they exchange their public keys.

This means that every event/message will emitted once per participant, because they need to be encrypted once per client.

## Architecture

Every _Module_, like _Groups_ and _Expenses_, need an _Event Handler_ and a _SDK_. These terms will be explained in the next section.

## Definitions:

### Event

A data structure that carries information needed by every _Client_ to reach the same application state.

### SDK

Exposes methods like create, list and others, that can be called by the user.

All the commands (methods that can mutate data), won't return any data. These commands should emit events that will be handled by the Event Handlers.

Because we don't return any data on commands, we might need a standard way to know when an item was processed. Maybe a subscription system to be used by the client.

### Event Handler

Receives *Event*s as defined on `src/application/types.ts:Evt`. The events are emitted by the client to himself and other participants.
