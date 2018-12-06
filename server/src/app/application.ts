import net from 'net';
import assert from 'assert';
import { ObjectID } from 'bson';
import { Readable } from 'stream';
import { MongoClient } from 'mongodb';
const Splitter = require('split-frames');

import { DataLayer } from './datalayer';
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
        const url = utility.getConnectionString();

        MongoClient.connect(url, { useNewUrlParser: true }, (error, client) => {
            assert.equal(error, null);
            const dbo = new DataLayer(client);

            tcpServer.on('connection', (socket) => {
                console.log('start connection');

                try {
                    const remotePort = socket.remotePort!;
                    const localPort = socket.localPort!;
                    let rawID: ObjectID;

                    stream.pipe(new Splitter({
                        startWith: STX,
                    })).on('data', (chunk: Buffer) => {
                        const doc = docService.buildCan(chunk, rawID, localPort, remotePort);
                        docs.push(doc);
                        if (docs.length >= MAX_BUFFERS) {
                            dbo.insertCans(docs);
                            docs.length = 0;
                        }
                    });

                    setInterval(() => {
                        if (docs.length > 0) {
                            dbo.insertCans(docs);
                            docs.length = 0;
                        }
                    }, 500);

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
                console.info('SIGINT signal received.');
                console.log('docs in stream remains before exit: ' + docs.length);
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
