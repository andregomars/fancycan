import net from 'net';
import exitHook from 'exit-hook';
import { Buffer } from 'buffer/';
import { ObjectID } from 'bson';
import { Readable } from 'stream';
import { MongoClient } from 'mongodb';
import { IJ1939, ICan } from 'fancycan-model';
import { Transform } from 'fancycan-common';
const chunker = require('stream-chunker');

import { QueueLayer } from './queuelayer';
import { DataLayer } from './datalayer';
import { DocService } from './services/doc.service';
import { Utility } from './services/utility';

export class Application {
    public async start() {
        const utility = new Utility();
        await utility.initCacheStorage();

        const stream = this.createReadStream();
        const tcpServer = net.createServer();
        const docService = new DocService();
        // const MAX_BUFFERS = +utility.getCommonConfig('rawParsingBuffer');
        const port = +utility.getCommonConfig('listeningPort');
        const portRemoteTest = +utility.getCommonConfig('remotePortForTest');
        const urlDbConn = utility.getDbConnectionString();
        const urlMqConn = utility.getMqConnectionString();
        const mqTopic = utility.getTopicName();
        const mqo = new QueueLayer(urlMqConn);

        const dbClient = await MongoClient.connect(urlDbConn, { useNewUrlParser: true });
        const dbo = new DataLayer(dbClient);
        const transform = new Transform();

        tcpServer.on('connection', (socket) => {
            try {
                const remotePort =
                    portRemoteTest > 0 ? portRemoteTest : socket.remotePort!;
                const localPort = socket.localPort!;
                let rawID: ObjectID;

                stream.pipe(chunker(13))
                    .on('data', (chunk: Buffer) => {
                        const doc = docService.buildCan(chunk, rawID, localPort, remotePort);
                        (async () => {
                            await utility.saveCanDoc(doc, dbo, transform);
                        })();
                        mqo.publish<ICan>(doc, mqTopic);
                    });

                // push into splitter stream while fetching data from TCP socket
                socket.on('data', (data: Buffer) => {
                    const doc = docService.buildCanRaw(data);
                    (async () => {
                        rawID = await dbo.insertCanRaw(doc);
                        stream.push(data);
                    })();
                    // dbo.insertCanRaw(doc, (id: ObjectID) => {
                    //     rawID = id;
                    //     stream.push(data);
                    // });
                });
            } catch (error) {
                console.log(error);
            }
        });

        tcpServer.listen(port);
        console.log('start listening on port ' + port);

        exitHook(() => {
            tcpServer.close();
            dbClient.close();
        });
    }

    private createReadStream() {
        return new Readable({
            read() {
                return;
            },
        });
    }
}
