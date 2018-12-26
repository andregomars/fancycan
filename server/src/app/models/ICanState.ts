import { ObjectID } from 'bson';

export interface ICanState {
    rawID: ObjectID;
    spnNo: number;
    spnName: string;
    pgnNo: number;
    pgnName: string;
    value: string;
    unit: string;
    min: string;
    max: string;

}
