import { Document } from "mongoose";
import { CustomIdAttributes } from "../../types";

interface UserAttributes extends Omit<Document, "_id">, CustomIdAttributes {
  username: { type: String; unique: true; minlength: 3 };
  name: String;
  avatar?: String;
  isCreator?: boolean;
}

export default UserAttributes;
