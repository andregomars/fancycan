import { Geolocation } from "./geolocation";

export interface VehicleState {
    vcode: string,
    fcode: string,
    geolocations: Geolocation[],
    soc: number,
}