import { uvPath } from "@titaniumnetwork-dev/ultraviolet";
import { createBareServer } from "@tomphttp/bare-server-node";
import express from "express";
import { createServer } from "node:http";
import { hostname } from "node:os";
import { join } from "node:path";
import { fileURLToPath } from "url";

const publicPath = fileURLToPath(new URL("./public/", import.meta.url));

const bare = createBareServer("/bare/");
const app = express();

app.use(express.static(publicPath));
app.use("/uv/", express.static(uvPath));

// Error for everything else
app.use((req, res) => {
  res.status(404);
  res.sendFile(join(publicPath, "404.html"));
});

const server = createServer();

server.on("request", (req, res) => {
  if (bare.shouldRoute(req)) {
    bare.routeRequest(req, res);
  } else {
    app(req, res);
  }
});

server.on("upgrade", (req, socket, head) => {
  if (bare.shouldRoute(req)) {
    bare.routeUpgrade(req, socket, head);
  } else {
    socket.end();
  }
});

let port = parseInt(process.env.PORT || "");

if (isNaN(port)) port = 3000;

server.on("listening", () => {
  const address = server.address();

  // by default we are listening on 0.0.0.0 (every interface)
  // we just need to list a few
  console.log("Listening on:");
  console.log(`\thttp://localhost:${address.port}`);
  console.log(`\thttp://${hostname()}:${address.port}`);
  console.log(
    `\thttp://${
      address.family === "IPv6" ? `[${address.address}]` : address.address
    }:${address.port}`,
  );
});

// https://expressjs.com/en/advanced/healthcheck-graceful-shutdown.html
process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
// SIGTERM server
function shutdown() {
  console.log("SIGTERM signal received: closing HTTP server");

  // Use Promises to handle asynchronous operations
  Promise.all([
    new Promise((resolve, reject) => {
      server.close((err) => {
        if (err) {
          console.error("Error closing server:", err);
          reject(err);
        } else {
          console.log("Server closed successfully.");
          resolve();
        }
      });
    }),
    new Promise((resolve, reject) => {
      bare.close((err) => {
        if (err) {
          console.error("Error closing bare connection:", err);
          reject(err);
        } else {
          console.log("Bare connection closed successfully.");
          resolve();
        }
      });
    })
  ])
  .then(() => {
    console.log("All resources closed, exiting process.");
    process.exit(0);
  })
  .catch((err) => {
    console.error("Error during shutdown:", err);
    process.exit(1); // Exit with error code if something went wrong
  });
}
server.listen({
  port,
});
