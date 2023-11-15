// import { PrismaClient } from '@prisma/client';
// // import { env } from '../../env.mjs';

// const globalForPrisma = global as unknown as {
//     prisma: PrismaClient | undefined;
// };

// console.log('globalForPrisma: ', globalForPrisma.prisma)

// export const prisma =
//     globalForPrisma.prisma ??
//     new PrismaClient({
//         log: ['error'],
//     });

// if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = prisma;

import { PrismaClient } from '@prisma/client';

declare global {
    var prisma: PrismaClient | undefined;
}

const globalForPrisma = global as typeof global & { prisma?: PrismaClient };
console.log('globalForPrisma: ', globalForPrisma.prisma)
export const prisma =
    globalForPrisma.prisma ||
    new PrismaClient({
        log: ['error'],
    });

if (process.env.NODE_ENV !== 'production') {
    globalForPrisma.prisma = prisma;
}

export default prisma;