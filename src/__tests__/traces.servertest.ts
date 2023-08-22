/** @jest-environment node */

import { makeAPICall } from "@/src/__tests__/test-utils";
import { prisma } from "@/src/server/db";

describe("/api/public/traces API Endpoint", () => {
  const pruneDatabase = async () => {
    await prisma.observation.deleteMany();
    await prisma.score.deleteMany();
    await prisma.trace.deleteMany();
  };

  beforeEach(async () => await pruneDatabase());
  afterEach(async () => await pruneDatabase());

  it("should create ", async () => {
    await pruneDatabase();

    await makeAPICall("POST", "/api/public/traces", {
      name: "trace-name",
      userId: "user-1",
      projectId: "7a88fb47-b4e2-43b8-a06c-a5ce950dc53a",
      metadata: { key: "value" },
      release: "1.0.0",
      version: "2.0.0",
    });

    const dbTrace = await prisma.trace.findMany({
      where: {
        name: "trace-name",
      },
    });

    expect(dbTrace.length).toBeGreaterThan(0);
    expect(dbTrace[0]?.name).toBe("trace-name");
    expect(dbTrace[0]?.release).toBe("1.0.0");
    expect(dbTrace[0]?.externalId).toBeNull();
    expect(dbTrace[0]?.version).toBe("2.0.0");
    expect(dbTrace[0]?.projectId).toBe("7a88fb47-b4e2-43b8-a06c-a5ce950dc53a");
  });

  it("should create trace with externalId", async () => {
    await pruneDatabase();

    await makeAPICall("POST", "/api/public/traces", {
      externalId: "some-externalId",
      name: "trace-name-externalId",
      userId: "user-1",
      projectId: "7a88fb47-b4e2-43b8-a06c-a5ce950dc53a",
      metadata: { key: "value" },
      release: "1.0.0",
      version: "2.0.0",
    });

    const dbTrace = await prisma.trace.findMany({
      where: {
        name: "trace-name-externalId",
      },
    });

    expect(dbTrace.length).toBeGreaterThan(0);
    expect(dbTrace[0]?.name).toBe("trace-name-externalId");
    expect(dbTrace[0]?.externalId).toBe("some-externalId");
    expect(dbTrace[0]?.release).toBe("1.0.0");
    expect(dbTrace[0]?.version).toBe("2.0.0");
    expect(dbTrace[0]?.projectId).toBe("7a88fb47-b4e2-43b8-a06c-a5ce950dc53a");
  });
});