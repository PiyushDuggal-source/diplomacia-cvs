import { User } from "../models";

export const checkPassword = async (email: string, password: string) => {
  console.log("\nEntering checkPassword");
  const user = await User.findOne({ email, password });

  if (user?.password === password) {
    return true;
  } else return false;
};
