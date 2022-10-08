import { createServer, Server as HTTPServer } from "http";
import { Server as HTTPSServer } from "https";
import { Server as SocketIoServer } from "socket.io";
import { logger } from "./logger";
import { MessageStore, MessageStoreInMemory } from "./message-store";

import { Auth, SocketIoServerType, SocketType } from "./types";

export const msgStore = new MessageStoreInMemory();

export function buildIOServer(httpServer2: HTTPServer | HTTPSServer) {
  const io: SocketIoServerType = new SocketIoServer(httpServer2);

  io.use(sessionManager);
  io.on("connection", onConnection);

  return io;
}

export function buildWithHTTPServer() {
  const httpServer = createServer();
  const io = buildIOServer(httpServer);
  const port = 9977;
  httpServer.listen(port);
  logger.info("Server started", { port });

  return {
    teardown: () => {
      io.disconnectSockets();
      httpServer.close();
      msgStore.clear();
    },
  };
}

function sessionManager(socket: SocketType, next: () => void) {
  //TODO: in the future, we would use the wallet address to verify if the person is who he claims to be
  const auth = socket.handshake.auth as Auth;
  const address = auth.address;
  socket.data.walletAddress = address;
  next();
}

function onConnection(socket: SocketType) {
  logger.info("Client connected", { id: socket.data.walletAddress });

  if (!socket.data.walletAddress) {
    logger.warn("Client connected without wallet address");
    return;
  }

  socket.join(socket.data.walletAddress);

  socket.on("disconnect", () => {
    logger.info("Client disconnected", { id: socket.data.walletAddress });
  });

  onEvent(socket, msgStore);
  onAllMessagesSince(socket, msgStore);
}

function onEvent(socket: SocketType, messageStore: MessageStore) {
  socket.on("event", async ({ to, payload, eventULID }) => {
    logger.info("Received event from a client", {
      to,
      payload,
    });

    const from = socket.data.walletAddress!;

    socket
      .to(to)
      .timeout(5000)
      .emit(
        "event",
        { payload, eventULID, from, acknowledged: false },
        async (err: any, cbArgs: any) => {
          // TODO: if there are no clients on the other side, this gets called with []
          // if the client don't call the callback with the boolean true, return early

          if (err || typeof cbArgs[0] !== "boolean" || !cbArgs[0]) {
            if (err) {
              logger.error(err);
            }
            return;
          }
          const toUpdate = await messageStore.getById(eventULID);

          if (!toUpdate) {
            logger.error("Trying to update a non-existent entry");
          }

          await messageStore.updateById(eventULID, {
            eventULID,
            from,
            payload,
            timestamp: toUpdate!.timestamp,
            to,
            acknowledged: true,
          });
        }
      );

    await messageStore.save({
      to,
      payload,
      eventULID,
      from,
      acknowledged: false,
    });
  });
}

function onAllMessagesSince(socket: SocketType, messageStore: MessageStore) {
  socket.on("allMessagesSince", async ({ timestamp }) => {
    if (!socket.data.walletAddress) {
      logger.warn("client without data.walletAddress requesting messages");
      return;
    }

    await messageStore
      .read({ to: socket.data.walletAddress, sinceTimestamp: timestamp })
      .then((res) => {
        res.forEach(({ payload, eventULID, from, acknowledged }) => {
          socket.timeout(5000).emit(
            "event",
            { payload, eventULID, from, acknowledged },
            //@ts-ignore
            async (err: Error, acknowledged: boolean) => {
              if (!acknowledged || err) {
                return;
              }

              const toUpdate = await messageStore.getById(eventULID);

              if (!toUpdate) {
                logger.error("Trying to update a non-existent entry");
              }

              await messageStore.updateById(eventULID, {
                eventULID,
                from,
                payload,
                timestamp: toUpdate!.timestamp,
                to: socket.data.walletAddress!,
                acknowledged: true,
              });
            }
          );
        });
      });
  });
}
