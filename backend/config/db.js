import mongoose from 'mongoose';

let memoryServer = null;

export const connectDB = async () => {
  const primaryUri = process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/mini_ecommerce';

  try {
    // Attempt connecting to the configured MongoDB URI (Local or Atlas)
    const conn = await mongoose.connect(primaryUri, {
      serverSelectionTimeoutMS: 2500, // Quick fail if local MongoDB is not running
    });
    console.log(`[Database] MongoDB Connected: ${conn.connection.host}`);
    return conn;
  } catch (error) {
    console.warn(`[Database] Could not connect to primary MongoDB at ${primaryUri}. Reason: ${error.message}`);

    if (process.env.NODE_ENV !== 'production') {
      try {
        console.log('[Database] Starting in-memory MongoDB server for development...');
        const { MongoMemoryServer } = await import('mongodb-memory-server');
        memoryServer = await MongoMemoryServer.create();
        const memUri = memoryServer.getUri();
        
        const conn = await mongoose.connect(memUri);
        console.log(`[Database] In-Memory MongoDB connected successfully at ${memUri}`);
        
        // Auto-seed in-memory database so the developer has immediate sample data
        const { seedDataIfEmpty } = await import('../seed/seedProducts.js');
        await seedDataIfEmpty();

        return conn;
      } catch (memError) {
        console.error(`[Database] In-memory MongoDB initialization failed:`, memError);
        process.exit(1);
      }
    } else {
      console.error(`[Database] Fatal: Unable to connect to MongoDB in production.`);
      process.exit(1);
    }
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
