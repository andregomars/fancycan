import { Geolocation } from "./geolocation";

export interface IVehicleState {
    vcode: string;
    vin: string;
    fcode: string;
    fname: string;
    geolocations: Geolocation[];
    [key: string]: any;
}