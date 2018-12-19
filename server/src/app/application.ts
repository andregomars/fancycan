import net from 'net';
import assert from 'assert';
import { ObjectID } from 'bson';
import { Readable } from 'stream';
import { MongoClient } from 'mongodb';
import * as mqtt from 'mqtt';
import { MqttClient } from 'mqtt';
const Splitter = require('split-frames');

import { DataLayer } from './datalayer';
import { QueueLayer } from './queuelayer';
import { DocService } from './services/doc.service';
import { ICan } from './models/ICanData';
import { Utility } from './services/utility';

export class Application {
    public static start() {
        const STX = 0x88;
        const MAX_BUFFERS = 100;
        const stream = Application.createReadStream();
        const docs: ICan[] = [];

        const tcpServer = net.createServer();
        const docService = new DocService();
        const utility = new Utility();
        const urlDbConn = utility.getDbConnectionString();
        const urlMqConn = utility.getMqConnectionString();
        const mqClient: MqttClient = mqtt.connect(urlMqConn);

        MongoClient.connect(urlDbConn, { useNewUrlParser: true }, (error, dbClient) => {
            assert.equal(error, null);
            const dbo = new DataLayer(dbClient);
            const mqo = new QueueLayer(mqClient);

            tcpServer.on('connection', (socket) => {
                console.log('start db connection');

                try {
                    const remotePort = socket.remotePort!;
                    const localPort = socket.localPort!;
                    let rawID: ObjectID;

                    // put data into buffer cache while fetching data from splitter stream
                    stream.pipe(new Splitter({
                        startWith: STX,
                    })).on('data', (chunk: Buffer) => {
                        const doc = docService.buildCan(chunk, rawID, localPort, remotePort);
                        docs.push(doc);
                        mqo.publishCans(docs);
                        if (docs.length >= MAX_BUFFERS) {
                            dbo.insertCans(docs);
                            // mqo.publishCans(docs);
                            docs.length = 0;
                        }
                    });

                    // push into splitter stream while fetching data from TCP socket
                    socket.on('data', (data) => {
                        const doc = docService.buildCanRaw(data);
                        dbo.insertCanRaw(doc, (id) => {
                            rawID = id;
                            stream.push(data);
                        });
                    });
                } catch (error) {
                    console.log(error);
                }
            });

            const port = 5888;
            tcpServer.listen(port);
            console.log('start listening on port ' + port);

            process.on('SIGINT', () => {
                tcpServer.close();
                console.log('docs in stream remains before exit: ' + docs.length);
                if (docs.length > 0) {
                    dbo.insertCans(docs);
                    // mqo.publishCans(docs);
                }
                console.log('remained data stream are all stored.');
                dbClient.close();
                process.exit(0);
            });
        });
    }

    public static createReadStream() {
        return new Readable({
            read() {
                return;
            },
        });
    }
}
