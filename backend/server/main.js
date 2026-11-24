import { allowedHostnames, loadConfig } from "./config.js";
import { createStaticServer } from "./static-server.js";

const { host, port } = loadConfig();
const server = createStaticServer({ allowedHosts: allowedHostnames(host) });

server.listen(port, host, () => {
  const { port: boundPort } = server.address();
  const displayHost = host.includes(":") ? `[${host}]` : host;
  console.log(`Playground available at http://${displayHost}:${boundPort}`);
});

for (const signal of ["SIGINT", "SIGTERM"]) {
  process.once(signal, () => server.close());
}
