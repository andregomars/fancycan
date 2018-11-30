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
        // const dir = './output';
        // if (!fs.existsSync(dir)) {
        //     fs.mkdirSync(dir);
        // }

        const STX = 0x88;
        const MAX_BUFFERS = 100;
        const stream = Application.createReadStream();
        // const buffers: Buffer[] = [];
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

                socket.on('data', (data) => {
                    // write raw data into local db
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
    }

    public static createReadStream() {
        return new Readable({
            read() {
                return;
            },
        });
    }
}
