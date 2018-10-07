export interface ProprietarySpnStateModel {
    spnItems: SPNItem[];
}

export interface SPNItem {
    fleet_code: string;
    PGNNo: string;
    PGNName: string;
    UnitType: string;
    SPNNo: string;
    SPNName: string;
    SPNDescription: string;
    Status: SPNStatus;
    Unit: string;
    Resolution: string;
    Offset: string;
    StartByte: string;
    StartBit: string;
    Length: string;
    UpperDataRange: string;
    LowerDataRange: string;
}

export interface SPNStatus {
    Name: string;
    Description: string[];
}
