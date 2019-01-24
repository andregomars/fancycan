"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var utility_1 = require("../src/app/services/utility");
describe('When test utility', function () {
    var utility = new utility_1.Utility();
    beforeAll(function () {
        utility.storeSpnsIntoCacheGroupedByPgn([def9004, def2911]);
    });
    var def9004 = {
        Code: 'voltage',
        SPNNo: 9004,
        SPNName: 'Motor Voltage',
        PGNNo: 64534,
        PGNName: '',
        StartByte: 5,
        StartBit: 1,
        Length: 16,
        Resolution: 1,
        Offset: 0,
        Unit: 'V',
        LowerDataRange: 0,
        UpperDataRange: 800,
        Status: {
            Name: '',
            Description: [],
        },
    };
    var def2911 = {
        Code: 'brakeswitch',
        SPNNo: 2911,
        SPNName: 'Halt brake switch',
        PGNNo: 61441,
        PGNName: 'Electronic Brake Controller 1',
        StartByte: 8,
        StartBit: 3,
        Length: 2,
        Resolution: 1,
        Offset: 0,
        Unit: 'bit',
        LowerDataRange: 0,
        UpperDataRange: 3,
        Status: {
            Name: 'Active/Error',
            Description: [
                'Not active',
                'Active',
                'Error',
                'Not available',
            ],
        },
    };
    var alertSetting = [{
            id: 3,
            fleet_code: 'BYD',
            name: 'Engine Speed & Battery Current Alert',
            conditions: [
                {
                    spn: '190',
                    expression: '>',
                    value: 3000
                },
                {
                    spn: '9003',
                    expression: '<',
                    value: 0
                }
            ],
            gpslat: 123.212112,
            gpslgt: 123.332432,
            gpsexpression: '>',
            gpsvalue: '3',
            notification: []
        }];
    it('should get spn list', function () {
        var actual = utility.retrieveSpnsByPgnFromCache(64534);
        expect(actual).toBeDefined();
        expect(actual.length).toBe(1);
    });
    it('should build rule conditions', function () {
        var actual = utility.buildRuleConditionGroups(alertSetting);
        expect(actual).toBeDefined();
        expect(actual.size).toBe(1);
        expect(actual.has(3)).toBeTruthy();
        expect(actual.get(3).length).toBe(3);
        var fcodeCondition = actual.get(3).find(function (c) { return c.fact === 'fcode'; });
        expect(fcodeCondition).toBeDefined();
        expect(fcodeCondition.value).toBe('BYD');
        expect(fcodeCondition.operator).toBe('equal');
    });
});
