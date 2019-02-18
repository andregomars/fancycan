import net from 'net';
import exitHook from 'exit-hook';
import { Buffer } from 'buffer/';
import { ObjectID } from 'bson';
import { Readable } from 'stream';
import { ICan } from 'fancycan-model';
import { ConfigUtility, MongoLayer, CanOrch, CanRepository } from 'fancycan-common';
const chunker = require('stream-chunker');

import { QueueLayer } from './queuelayer';
import { Startup } from './startup';

export class Application {
    public async start() {
        const startup = new Startup();
        await startup.init();

        const canRepo = new CanRepository();
        const canOrch = new CanOrch();

        const stream = this.createReadStream();
        const tcpServer = net.createServer();

        // retrive configurations
        const port = +ConfigUtility.getCommonConfig('listeningPort');
        const portRemoteTest = +ConfigUtility.getCommonConfig('remotePortForTest');
        const urlMqConn = ConfigUtility.getMqConnectionString();
        const mqTopic = ConfigUtility.getTopicName();

        const mqo = new QueueLayer(urlMqConn);

        const dbo = MongoLayer.getInstance().Client;

        tcpServer.on('connection', (socket) => {
            try {
                const remotePort =
                    portRemoteTest > 0 ? portRemoteTest : socket.remotePort!;
                const localPort = socket.localPort!;
                let rawID: ObjectID;

                stream.pipe(chunker(13))
                    .on('data', (chunk: Buffer) => {
                        const doc = canRepo.buildCan(chunk, rawID, localPort, remotePort);
                        (async () => {
                            await canOrch.saveCanDoc(doc);
                        })();
                        mqo.publish<ICan>(doc, mqTopic);
                    });

                // push into splitter stream while fetching data from TCP socket
                socket.on('data', (data: Buffer) => {
                    const doc = canRepo.buildCanRaw(data);
                    (async () => {
                        rawID = await canRepo.insertCanRaw(doc);
                        stream.push(data);
                    })();
                });
            } catch (error) {
                console.log(error);
            }
        });

        tcpServer.listen(port);
        console.log('start listening on port ' + port);

        exitHook(() => {
            tcpServer.close();
            dbo.close();
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
