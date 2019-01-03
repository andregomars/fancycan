import { ObjectID } from 'bson';

export interface ICanState {
    canObjID: ObjectID;
    vid: number;
    spnNo: number;
    spnName: string;
    pgnNo: number;
    pgnName: string;
    value: number;
    unit: string;
    min: number;
    max: number;

}
