import { TestBed, inject } from '@angular/core/testing';
import { UtilityService } from './utility.service';

describe('UtilityService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UtilityService]
    });
  });

  it('should be created', inject([UtilityService], (utility: UtilityService) => {
    expect(utility).toBeTruthy();
  }));

  it('should devide raw can values', inject([UtilityService], (utility: UtilityService) => {
    const input = 'A1B2C3';
    const output = utility.formatRawCAN(input);

    const expected = 'A1 B2 C3';
    expect(output).toEqual(expected);
  }));

  it('should devide raw can values', inject([UtilityService], (utility: UtilityService) => {
    const input = 'A1B2C';
    const output = utility.formatRawCAN(input);

    const expected = 'A1 B2 C';
    expect(output).toEqual(expected);
  }));

  it('should devide raw can values', inject([UtilityService], (utility: UtilityService) => {
    const input = 'A';
    const output = utility.formatRawCAN(input);

    const expected = 'A';
    expect(output).toEqual(expected);
  }));

  it('should devide raw can values', inject([UtilityService], (utility: UtilityService) => {
    const input = '';
    const output = utility.formatRawCAN(input);

    const expected = '';
    expect(output).toEqual(expected);
  }));

  it('should devide raw can values', inject([UtilityService], (utility: UtilityService) => {
    const input = 'A1';
    const output = utility.formatRawCAN(input);

    const expected = 'A1';
    expect(output).toEqual(expected);
  }));

  it('should return vechicle srtate spn list', inject([UtilityService], (utility: UtilityService) => {
    const input = 'A1';
    const spnProfileList = [
      {fleet_code: 'BYD', name: 'Wheel-Based Vehicle Speed', pgn: '65265', spn: '84', unit: 'mph', type: 'J1939'}
      , {fleet_code: 'BYD', name: 'Engine Speed', pgn: '61444', spn: '190', unit: 'rpm', type: 'J1939'}
      , {fleet_code: 'BYD', name: 'State Of Charge', pgn: '64519', spn: '9000', unit: '%', type: 'Proprietary'}
    ];

    const vehicleState = {
        '_id': {
          '$oid': '5c6a569b9cbc5c64ce9db11b'
        },
        'vcode': '6005',
        'createDate': {
          '$date': 1550472859453
        },
        'editDate': {
          '$date': 1551074480736
        },
        'fcode': 'BYD',
        'fname': 'BYD',
        'geolocations': [
          {
            'latitude': 34.057539,
            'longitude': -118.237494
          },
          {
            'latitude': 34.056544,
            'longitude': -118.238082
          },
          {
            'latitude': 34.055955,
            'longitude': -118.238996
          },
          {
            'latitude': 34.056325,
            'longitude': -118.239507
          }
        ],
        'spn9004': 608,
        'vin': 'XZW21312316005',
        'spn9001': 218.3,
        'spn9000': 58.3,
        'spn190': 0,
        'spn917': 31928085,
        'spn84': 19.281,
        'spn9002': 617,
        'spn9003': 25.1,
        'spn9010': 0,
        'spn9011': 0,
        'spn9005': 84.2,
        'spn9006': 105.8
      };
    const output = utility.buildVehicleStateSpnList(vehicleState, spnProfileList);

    expect(output).toBeDefined();
    expect(output.length).toEqual(3);
    expect(output[0].spn).toEqual('9000');
    expect(output[1].spn).toEqual('190');
    expect(output[2].spn).toEqual('84');
  }));

  // it('should get value from CAN data', inject([UtilityService], (utility: UtilityService) => {
  //   const buffer = Buffer.from('BAQAAFQCACA=', 'base64');
  //   const startBit = 33;
  //   const length = 16;
  //   const actual = utility.decodeJ1939(buffer, startBit, length);

  //   const expected = 596;
  //   expect(actual).toEqual(expected);
  // }));

  // it('should get value from CAN data', inject([UtilityService], (utility: UtilityService) => {
  //   const buffer = Buffer.from('7F5FFFFFFFFFFFFF', 'hex');
  //   const startBit = 33;
  //   const length = 8;
  //   const actual = utility.decodeJ1939(buffer, startBit, length);

  //   const expected = 255;
  //   expect(actual).toEqual(expected);
  // }));
});
