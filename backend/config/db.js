import mongoose from 'mongoose';

let memoryServer = null;

export const connectDB = async () => {
  const primaryUri = process.env.MONGO_URI;

  // 1. If a remote MongoDB URI is provided (e.g. MongoDB Atlas)
  if (primaryUri && !primaryUri.includes('127.0.0.1')) {
    try {
      const sanitized = primaryUri.replace(/:([^:@]{4})[^:@]*@/, ':****@');
      console.log(`[Database] Connecting to remote MongoDB: ${sanitized}`);
      const conn = await mongoose.connect(primaryUri, {
        serverSelectionTimeoutMS: 5000,
      });
      console.log(`[Database] Connected successfully to remote MongoDB: ${conn.connection.host}`);
      
      // Auto-seed if database is empty
      const { seedDataIfEmpty } = await import('../seed/seedProducts.js');
      await seedDataIfEmpty();

      return conn;
    } catch (error) {
      console.warn(`[Database] Could not connect to remote MongoDB (${error.message}). Attempting fallback...`);
    }
  } else if (primaryUri) {
    // 2. Local MongoDB attempt
    try {
      const conn = await mongoose.connect(primaryUri, {
        serverSelectionTimeoutMS: 2000,
      });
      console.log(`[Database] Connected to local MongoDB: ${conn.connection.host}`);
      const { seedDataIfEmpty } = await import('../seed/seedProducts.js');
      await seedDataIfEmpty();
      return conn;
    } catch (error) {
      console.warn(`[Database] Local MongoDB not reachable at ${primaryUri}. Attempting in-memory fallback...`);
    }
  }

  // 3. Fallback: In-memory MongoDB
  try {
    console.log('[Database] Starting in-memory MongoDB instance for demo...');
    const { MongoMemoryServer } = await import('mongodb-memory-server');
    memoryServer = await MongoMemoryServer.create();
    const memUri = memoryServer.getUri();

    const conn = await mongoose.connect(memUri);
    console.log(`[Database] In-Memory MongoDB connected at ${memUri}`);
    console.log('[Database] Tip: To persist data permanently, add your MONGO_URI in Render environment variables.');

    // Auto-seed sample products and demo accounts
    const { seedDataIfEmpty } = await import('../seed/seedProducts.js');
    await seedDataIfEmpty();

    return conn;
  } catch (memError) {
    console.error('[Database] Warning: In-memory MongoDB could not be initialized:', memError.message);
    console.error('[Database] Note: Please configure MONGO_URI in Render to connect to MongoDB Atlas.');
    // IMPORTANT: Do NOT exit process so Express web server continues serving frontend and health checks!
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
