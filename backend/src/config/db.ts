import { prisma } from "../prisma/client";
export  const dbconnect = async () => {
    try {
    await prisma.$connect();
    console.log("Database connected successfully");
    }
    catch (error) {
        console.error("Database connection error:", error);
        throw error;
    }
}