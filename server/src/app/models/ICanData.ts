export interface ICan {
    raw: Buffer;
    canID: Buffer;
    canData: Buffer;
    localPort: number;
    remotePort: number;
    time: Date;
}
