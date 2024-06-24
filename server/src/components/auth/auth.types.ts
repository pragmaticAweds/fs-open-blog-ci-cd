import { Document } from "mongoose";
import { CustomIdAttributes } from "../../types";

interface UserAccessAttribute
  extends Omit<Document, "_id">,
    CustomIdAttributes {
  User: string;
  password: string;
  comparePassword(_password: string): boolean;
  updatePassword(_password: string): void;
}

export default UserAccessAttribute;
