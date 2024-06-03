import { Document } from "mongoose";
import { CustomIdAttributes } from "../../types";

interface UserAttributes extends Omit<Document, "_id">, CustomIdAttributes {
  username: { type: string; unique: true; minlength: 3 };
  name: string;
  avatar?: string;
  isCreator?: boolean;
}

export default UserAttributes;
