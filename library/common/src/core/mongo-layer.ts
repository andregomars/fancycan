import { MongoClient } from 'mongodb';
import { ConfigUtility } from '../utility';

export class MongoLayer {
  private static instance: MongoLayer;
  private client: MongoClient;

  public static getInstance() {
    if (!MongoLayer.instance) {
      MongoLayer.instance = new MongoLayer();
    }
    return MongoLayer.instance;
  }

  public get Client(): MongoClient {
    return this.client;
  }

  private constructor() {
    const config = new ConfigUtility();
    this.client = new MongoClient(config.getDbConnectionString(), { useNewUrlParser: true });
  }

  public async connect() {
    await this.client.connect();
  }

}