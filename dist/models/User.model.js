import { prisma } from "../Database/bd.js";
// Find user by email
export const findUserByEmail = async (email) => {
    return await prisma.user.findUnique({
        where: {
            email,
        },
    });
};
// create a new user
export const createUser = async (data) => {
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
// get all user data
export const getAllUsers = async () => {
    return await prisma.user.findMany({
        select: {
            id: true,
            fname: true,
            lname: true,
            email: true,
            phone: true,
            role: true,
            createdAt: true,
            updatedAt: true,
        },
        orderBy: {
            createdAt: "desc",
        },
    });
};
