import { beforeAll, describe, it } from "vitest";
import supertest from "supertest";

import { connectDb } from "../../../../config/persistence";

beforeAll(async () => {
  await connectDb();
  console.log("test db connected");
});
describe("Validate Auth Actions", () => {
  it("User signed up successfully", ({ expect }) => {});
});
