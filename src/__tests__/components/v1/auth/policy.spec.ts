import { describe, it } from "vitest";
import { validateSchema } from "../../../testHelpers";
import {
  doSignupSchema,
  doLoginSchema,
} from "../../../../components/auth/auth.policy";
import { validatePassword } from "../../../../utils/validators";

describe("Validate Auth Policies", () => {
  const signupData = {
    invalidName: { name: 9, username: "test", password: "1234" },
    invalidUsername: {
      name: "Test User",
      username: 1234,
      password: "1234",
    },
    missingField: {
      name: "Test User ",
      username: "Doe ",
      password: "Abcd.1234",
    },
    validField: {
      name: "Test User ",
      username: "Doe ",
      password: " Abcd.1234 ",
      is_creator: false,
    },
  };

  it("Validate Schema Fields", ({ expect }) => {
    expect(
      validateSchema(doSignupSchema, signupData.invalidName)
    ).toHaveProperty("message", "Expected string, received number");

    expect(
      validateSchema(doSignupSchema, signupData.invalidUsername)
    ).toHaveProperty("message", "Expected string, received number");

    expect(
      validateSchema(doSignupSchema, signupData.invalidName)
    ).toHaveProperty("message", "Expected string, received number");

    expect(
      validateSchema(doSignupSchema, signupData.missingField)
    ).toHaveProperty("message", "Required");

    expect(
      validateSchema(doSignupSchema, signupData.validField)
    ).toHaveProperty("name", "test user");
  });

  it("Validate Password function", ({ expect }) => {
    expect(validatePassword("1234")).toBe(false);
    expect(validatePassword("Abcd")).toBe(false);
    expect(validatePassword("Abcd.1234")).toBe(true);
  });
});