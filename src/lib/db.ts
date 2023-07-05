import { PrismaClient } from "@prisma/client";
import "server-only";

const globalForPrisma = global as unknown as {
    prisma: PrismaClient | undefined
}

export const db =
    globalForPrisma.prisma ??
    new PrismaClient({
        log: ["query"],
    })

if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = db