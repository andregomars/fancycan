import { ICan } from '../models/ICanData';

export class DocService {
    public buildDoc(buffer: Buffer, localPort: number, remotePort: number): ICan {
        return {
            raw: buffer,
            canID: Buffer.from('00', 'hex'),
            canData: Buffer.from('00', 'hex'),
            localPort: localPort,
            remotePort: remotePort,
            time: new Date(),
        };
    }
}
