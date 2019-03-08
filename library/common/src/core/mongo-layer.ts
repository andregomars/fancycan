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
    this.client = new MongoClient(ConfigUtility.getDbConnectionString(), { useNewUrlParser: true });
  }

  public async connect() {
    await this.client.connect();
    await this.init();
  }

  private async init() {
    this.client.db('main').collection('vehicle_state').createIndex({vcode: 1}, {unique: true});

  }
}
