import UserAccessModel from "../../../../components/auth/auth.model";
import UserModel from "../../../../components/user/user.model";
import { newCreatorDetails } from "../../../testDatas";

const createNewUsers = async (start?: number, end?: number) => {
  for (const { is_creator, password, ...userData } of newCreatorDetails.slice(
    start || 0,
    end
  )) {
    const newUser = await new UserModel({
      ...userData,
      isCreator: is_creator,
    }).save();

    await new UserAccessModel({
      User: newUser._id,
      password,
    }).save();
  }
};

export { createNewUsers };
