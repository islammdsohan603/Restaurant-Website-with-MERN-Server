import "dotenv/config";
import { PrismaPg } from "@prisma/adapter-pg";
import { PrismaClient } from "../generated/prisma/client.js";
const adapter = new PrismaPg({
    connectionString: process.env.DATABASE_URL,
});
export const prisma = new PrismaClient({
    adapter,
});
export const connectDB = async () => {
    try {
        await prisma.$connect();
        console.log("PostgreSQL Connected Successfully!");
    }
    catch (error) {
        console.error("Database Connection Failed:", error);
        process.exit(1);
    }
};
