import { IVehicleState } from "./vehicle-state";

export interface IVehicleMalfuction extends IVehicleState {
    malfuncID: number;
    malfuncName: string;
    malfuncLevel: string;
    malfuncNotification: string[];
}