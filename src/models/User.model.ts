import { prisma } from "../Database/bd.js";

import type { SignupInput } from "../schemas/user.schema.js";

// Find user by email

export const findUserByEmail = async (email: string) => {
  return await prisma.user.findUnique({
    where: {
      email,
    },
  });
};

// create a new user
export const createUser = async (data: SignupInput & { password: string }) => {
  return await prisma.user.create({
    data: {
      fname: data.fname,
      lname: data.lname,
      email: data.email,
      password: data.password,
      phone: data.phone,
    },
  });
};
