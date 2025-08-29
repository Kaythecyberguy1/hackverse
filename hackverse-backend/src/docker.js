// src/docker.js
import Docker from "dockerode";
import getPort from "get-port";
import { nanoid } from "nanoid";
import { config } from "./config.js";

const docker = new Docker(
  config.dockerHost
    ? { host: config.dockerHost }
    : { socketPath: config.dockerSocket }
);

const running = new Map();

export async function startLab(lab) {
  const hostPort = await getPort({
    port: config.hostPortRange,
  });

  const id = nanoid(8);
  const container = await docker.createContainer({
    Image: lab.image,
    name: `lab_${lab.slug}_${id}`,
    ExposedPorts: {
      [`${lab.internalPort}/tcp`]: {},
    },
    HostConfig: {
      PortBindings: {
        [`${lab.internalPort}/tcp`]: [{ HostPort: hostPort.toString() }],
      },
      AutoRemove: true,
    },
    Labels: {
      "hackverse.lab": lab.slug,
      "hackverse.id": id,
    },
  });

  await container.start();

  const url = `${config.publicHost}:${hostPort}`;

  const instance = {
    id,
    slug: lab.slug,
    url,
    status: "running",
    startedAt: new Date(),
  };

  running.set(id, { container, ...instance });

  return instance;
}

export async function stopLab(id) {
  const entry = running.get(id);
  if (!entry) throw new Error("Instance not found");

  await entry.container.stop();
  running.delete(id);
}

export async function listInstances() {
  return Array.from(running.values()).map((i) => ({
    id: i.id,
    slug: i.slug,
    url: i.url,
    status: i.status,
    startedAt: i.startedAt,
  }));
}
