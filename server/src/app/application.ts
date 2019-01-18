import net from 'net';
import assert from 'assert';
import exitHook from 'exit-hook';
import { ObjectID } from 'bson';
import { Readable } from 'stream';
import { MongoClient } from 'mongodb';
import * as mqtt from 'mqtt';
import { MqttClient } from 'mqtt';
const chunker = require('stream-chunker');

import { DataLayer } from './datalayer';
import { QueueLayer } from './queuelayer';
import { DocService } from './services/doc.service';
import { TransformService } from './services/transform.services';
import { Utility } from './services/utility';
import { FireLayer } from './firelayer';
import { IJ1939 } from '../../../library/src/index';

export class Application {
    public start() {
        const fire = new FireLayer();
        const utility = new Utility();

        fire.getDefinitionWithSpecs().subscribe((spns: IJ1939[]) => {
            utility.storeSpnsIntoCacheGroupedByPgn(spns);

            const stream = this.createReadStream();

            const tcpServer = net.createServer();
            const docService = new DocService();
            const MAX_BUFFERS = +utility.getCommonConfig('rawParsingBuffer');
            const urlDbConn = utility.getDbConnectionString();
            const urlMqConn = utility.getMqConnectionString();
            const mqClient: MqttClient = mqtt.connect(urlMqConn);

            MongoClient.connect(urlDbConn, { useNewUrlParser: true }, (error, dbClient) => {
                assert.equal(error, null);
                const dbo = new DataLayer(dbClient);
                const mqo = new QueueLayer(mqClient);
                const transformService = new TransformService();

                tcpServer.on('connection', (socket) => {
                    console.log('start db connection');

                    try {
                        const remotePort = socket.remotePort!;
                        const localPort = socket.localPort!;
                        let rawID: ObjectID;

                        stream.pipe(chunker(13))
                            .on('data', (chunk: Buffer) => {
                                const doc = docService.buildCan(chunk, rawID, localPort, remotePort);
                                // docs.push(doc);
                                (async () => {
                                    await utility.saveCanDoc(doc, dbo, transformService);
                                })();
                                mqo.publishCan(doc);
                            });

                        // push into splitter stream while fetching data from TCP socket
                        socket.on('data', (data: Buffer) => {
                            const doc = docService.buildCanRaw(data);
                            dbo.insertCanRaw(doc, (id: ObjectID) => {
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

                // process.on('SIGINT', async () => {
                exitHook(() => {
                    tcpServer.close();
                    dbClient.close();
                });
            });
        });
    }

    public createReadStream() {
        return new Readable({
            read() {
                return;
            },
        });
    }
}
