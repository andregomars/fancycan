export interface IJ1939 {
    Code: string;
    SPNNo: number;
    SPNName: string;
    PGNNo: number;
    PGNName: string;
    StartByte: number;
    StartBit: number;
    Length: number;
    Resolution: number;
    Offset: number;
    Unit: string;
    LowerDataRange: number;
    UpperDataRange: number;
    Status: IJ1939Status;
}

export interface IJ1939Status {
    Name: string;
    Description: string[];
}
