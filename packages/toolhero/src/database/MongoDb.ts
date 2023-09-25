import mongoose, { Mongoose } from 'mongoose';

class MongoDb {
  private static instance: MongoDb;
  private _connection: Mongoose | null = null;

  private constructor() {}

  public static getInstance(): MongoDb {
    if (!MongoDb.instance) {
      MongoDb.instance = new MongoDb();
    }
    return MongoDb.instance;
  }

  public async connect(uri: string): Promise<void> {
    if (!this._connection || this._connection.connection.readyState === 0) {
      this._connection = await mongoose.connect(uri);
    }
  }

  public get connection(): Mongoose | null {
    return this._connection;
  }
}

export default MongoDb;
