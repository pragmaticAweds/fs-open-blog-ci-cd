import UserAccessModel from "../../../../components/auth/auth.model";
import UserModel from "../../../../components/user/user.model";

const usersInDb = async () => {
  const data = await Promise.all([
    UserModel.find({}, "_id").lean(),
    UserAccessModel.find({}, "User").lean(),
  ]);

  return data;
};

export { usersInDb };
