import mongoose from 'mongoose';

let memoryServer = null;

export const connectDB = async () => {
  const primaryUri = process.env.MONGO_URI;

  if (primaryUri && !primaryUri.includes('127.0.0.1')) {
    try {
      console.log(`[Database] Connecting to MongoDB: ${primaryUri.replace(/:([^:@]{4})[^:@]*@/, ':****@')}`);
      const conn = await mongoose.connect(primaryUri, {
        serverSelectionTimeoutMS: 5000,
      });
      console.log(`[Database] Connected successfully to MongoDB: ${conn.connection.host}`);
      return conn;
    } catch (error) {
      console.warn(`[Database] Could not connect to remote MongoDB. Reason: ${error.message}`);
    }
  } else if (primaryUri) {
    // Local MongoDB attempt
    try {
      const conn = await mongoose.connect(primaryUri, {
        serverSelectionTimeoutMS: 2000,
      });
      console.log(`[Database] Connected to local MongoDB: ${conn.connection.host}`);
      return conn;
    } catch (error) {
      console.warn(`[Database] Local MongoDB not reachable at ${primaryUri}.`);
    }
  }

  // Graceful fallback to in-memory MongoDB for local dev or cloud demo deployments
  try {
    console.log('[Database] Starting in-memory MongoDB instance for demo / development...');
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    memoryServer = await MongoMemoryServer.create();
    const memUri = memoryServer.getUri();

    const conn = await mongoose.connect(memUri);
    console.log(`[Database] In-Memory MongoDB connected successfully at ${memUri}`);
    console.log('[Database] Notice: To persist data permanently, add your MONGO_URI in Render environment variables.');

    // Auto-seed initial products and demo accounts
    const { seedDataIfEmpty } = await import('../seed/seedProducts.js');
    await seedDataIfEmpty();

    return conn;
  } catch (memError) {
    console.error('[Database] Failed to initialize in-memory database:', memError);
    process.exit(1);
  }
};

export const disconnectDB = async () => {
  try {
    await mongoose.disconnect();
    if (memoryServer) {
      await memoryServer.stop();
    }
  } catch (err) {
    console.error('Error disconnecting database:', err);
  }
};
