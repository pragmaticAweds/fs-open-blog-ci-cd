import { Document } from "mongoose";
import { CustomIdAttributes } from "../../types";

interface UserAccessAttribute
  extends Omit<Document, "_id">,
    CustomIdAttributes {
  User: string;
  password: string;
  comparePassword(password: string): boolean;
  updatePassword(password: string): void;
}

export default UserAccessAttribute;
