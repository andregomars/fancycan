import { Geolocation } from "./geolocation";

export interface IVehicleState {
    vcode: string,
    fcode: string,
    geolocations: Geolocation[],
    soc: number,
}