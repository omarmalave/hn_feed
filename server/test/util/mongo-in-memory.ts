import { MongooseModule, MongooseModuleOptions } from '@nestjs/mongoose';
import { MongoMemoryServer } from 'mongodb-memory-server';
import mongoose from 'mongoose';

export const rootMongooseTestModule = (
  mongo: MongoMemoryServer,
  options: MongooseModuleOptions = {},
) =>
  MongooseModule.forRootAsync({
    useFactory: async () => {
      const mongoUri = await mongo.getUri();
      return {
        uri: mongoUri,
        ...options,
      };
    },
  });

export const closeInMongoConnection = async (mongo: MongoMemoryServer) => {
  for (const connection of mongoose.connections) {
    await connection.close();
  }
  await mongoose.disconnect();
  if (mongo) {
    await mongo.stop();
  }
};
