// title="https://app.fancycan.com/vehicle/panel/6001?ports=60011,60012"
export interface Vehicle {
  vcode: string;
  vin: string;
  identifier: string;
  picture: string;
}

export const defaultVehicle: Vehicle = {
    vcode: '',
    vin: '',
    identifier: '',
    picture: ''
}
