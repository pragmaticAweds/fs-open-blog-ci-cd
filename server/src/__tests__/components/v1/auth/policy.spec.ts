import { validateSchema } from "../../../testHelpers";
import { doSignupSchema } from "../../../../components/auth/auth.policy";
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

  it("Validate Schema Fields", () => {
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

  it("Validate Password function", () => {
    expect(validatePassword("1234")).toBe(false);
    expect(validatePassword("Abcd")).toBe(false);
    expect(validatePassword("abcd.123")).toBe(false);
    expect(validatePassword("Abcd.1234")).toBe(true);
  });
});
function expect(
  arg0:
    | { name: string; username: string; password: string; is_creator: boolean }
    | { message: string; path: string | number }
    | undefined
) {
  throw new Error("Function not implemented.");
}
