import { PrismaClient } from '@prisma/client';

const newDbClient = () => {
  return new PrismaClient();
};

export default newDbClient;
