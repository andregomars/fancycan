import net from 'net';
import { ObjectID } from 'bson';
import { Readable } from 'stream';
// import fs from 'fs';
const Splitter = require('split-frames');
import { DataLayer } from './datalayer';
import { DocService } from './services/doc.service';
import { ICan } from './models/ICanData';

export class Application {
    public static start() {
        const STX = 0x88;
        const MAX_BUFFERS = 100;
        const stream = Application.createReadStream();
        const docs: ICan[] = [];

        const tcpServer = net.createServer();
        const dbo = new DataLayer();
        const docService = new DocService();

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

                // stream.pipe(new Splitter({
                //     startWith: STX,
                // })).on('end', (chunk: Buffer) => {
                //     const doc = docService.buildCan(chunk, rawID, localPort, remotePort);
                //     docs.push(doc);
                //     dbo.insertCans(docs);
                //     docs.length = 0;
                // });

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

            // Stops the server from accepting new connections and finishes existing connections.
            tcpServer.close(() => {
                console.log('close tcp server');
                stream.emit('end');
                process.exit(0);
                // stream.once('end', () => {
                //     console.log('stream end and exit process gracefully!');
                //     process.exit(0);
                // });
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
