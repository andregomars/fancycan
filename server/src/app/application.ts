import shortid from 'shortid';
import net from 'net';
import fs from 'fs';
import { DataLayer } from './datalayer';

export class Application {
    public static start() {
        const dir = './output';
        if (!fs.existsSync(dir)) {
            fs.mkdirSync(dir);
        }

        const tcpServer = net.createServer();
        const db = new DataLayer();
        tcpServer.on('connection', (socket) => {
            console.log('start connection');
            console.log(socket.remoteAddress!);

            try {
                const ipAddr = socket.remoteAddress!;
                socket.on('data', (data) => {
                    // write file
                    fs.writeFile(`${dir}/data-${shortid.generate()}.bin`, data, (error) => {
                        if (error) {
                            throw error;
                        }

                        console.log('data written');
                    });

                    // write db
                    db.insertDocs(data, ipAddr);
                });
            } catch (error) {
                console.log(error);
            }
        });

        const port = 5888;
        tcpServer.listen(port);
        console.log('start listening on port ' + port);
    }

}
