## Application flow and Events

Every module has a SDK and Event Handler

### SDK

Clients interact with the SDK. It can execute queries, like list expenses, and emit events, like create a group.

```
  ┌────────┐   ┌────────┐     ┌─────────────┐       ┌──────┐      ┌──────────────────────────────────────────────────────┐
  │ SDK    │──►│IOClient│────►│Emit an Event│──────►│Server│─────►│Persists the Event and sends it to the target client *│
  └─┬─class┘   └───class┘     └┬────────────┘       └──────┘      └──────────────────────────────────────────────────────┘
    │                          │
    │                          │        ┌──────────────────────┐
    │                          └───────►│It's own Event Handler│
    │                                   └──────────────────────┘
    │
    │          ┌───────────────┐        ┌────────────────────────────────┐        ┌──────────────────┐
    └─────────►│Execute a Query│───────►│Reads from the application state│───────►│Returns a response│
               └───────────────┘        └────────────────────────────────┘        └──────────────────┘


* Clients can also emit events to themselves, this way, they can recover the application state on device switch/reset.
  The server does not emit the Event to the target client in this case (when the sender and receiver are the same),
  it only persists it for a possible later retrieval.

```

### Event Handlers

Event handlers are are to be called directly by the client. They are attached to the IOClient, listening for events and are the only way to mutate the application state.

```
   ┌─────────────┐      ┌────────┐      ┌───────────┐      ┌─────────────┐        ┌───────────────────────────┐
   │Emitted Event│ ───► │IOClient│ ───► │Event Store│ ───► │Event Handler│ ─────► │Logic that amends the state│
   └─────────────┘      └───class┘      └──────class┘      └────────class┘        └───────────────────────────┘
```

### Rules about Events

- Given a list of events, it should be possible to rebuild the application state.
- Events are the same for every client. The event handler must be able to inform which role the Client is playing on it by using the Wallet Address

## IOClient and E2EE

_Every event, before leaving the client to the network should be encrypted._

IOClient can perform the _Exchange Keys_ and are responsible for encrypting outgoing events and decrypting incoming events.

TODO: Explain why we need to exchange keys and what happens if one of the emitter didn't exchange keys yet with the receiver
TODO: Merge with the other README at the root of the workspace

The rest of the application does not deal with encryption.

Usual flow:

```
 ┌──────────┐        ┌──────────────┐        ┌──────────┐        ┌──────────────────┐        ┌──────────────────────┐
 │IOClient A│ ─────► │Encrypts Event│ ─────► │IOClient B│ ─────► │Decrypts the Event│ ─────► │Client B Event Handler│
 └────┬─────┘        └──────────────┘        └──────────┘        └──────────────────┘        └──────────────────────┘
      │
      │              ┌──────────────────────┐
      └────────────► │Client A Event Handler│
                     └──────────────────────┘
```
