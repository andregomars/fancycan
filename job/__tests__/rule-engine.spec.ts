import { SpnCache, FireLayer } from 'fancycan-common';
import { IJ1939 } from 'fancycan-model';
import { RuleEngine } from '../src/app/rule-engine';

describe('When test rule engine', () => {
    const spnCache = new SpnCache();
    const ruleEngine = new RuleEngine();

    beforeAll(() => {
        spnCache.storeSpnsIntoCacheGroupedByPgn([def9004, def2911]);
    });

    const def9004: IJ1939 = {
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

    const def2911 = {
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

    const alertSetting = [{
        id: 3,
        fleet_code: 'BYD',
        name: 'Engine Speed & Battery Current Alert',
        level: 'General',
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

    it('should get spn list', () => {
        const actual = spnCache.retrieveSpnsByPgnFromCache(64534);
        expect(actual).toBeDefined();
        expect(actual!.length).toBe(1);
    });

    /*
    it('should build rule conditions', () => {
        const actual = ruleEngine.buildRuleConditionGroups(alertSetting);
        expect(actual).toBeDefined();
        expect(actual.size).toBe(1);
        expect(actual.has(3)).toBeTruthy();
        expect(actual.get(3)!.length).toBe(3);

        const fcodeCondition = actual.get(3)!.find((c: IRuleCondition) => c.fact === 'fcode');
        expect(fcodeCondition).toBeDefined();
        expect(fcodeCondition!.value).toBe('BYD');
        expect(fcodeCondition!.operator).toBe('equal');
    });

    it('should build rule conditions from firebase malfunction settings', async () => {
        const fire = new FireLayer();
        const settings = await fire.getMalfunctionSetting().toPromise();
        expect(settings).toBeDefined();
        const actual = ruleEngine.buildRuleConditionGroups(settings);
        expect(actual).toBeDefined();
        expect(actual.size).toEqual(3);
        expect(actual.has(3)).toBeTruthy();
        expect(actual.get(3)!.length).toEqual(3);

        const fcodeCondition = actual.get(3)!.find((c: IRuleCondition) => c.fact === 'fcode');
        expect(fcodeCondition).toBeDefined();
        expect(fcodeCondition!.value).toBe('BYD');
        expect(fcodeCondition!.operator).toBe('equal');
    });
*/

    it('should test with palyer fouled out', async () => {
        const rule = ruleEngine.buildSampleRule();
        const engine = ruleEngine.createEngineWithRules([rule]);
        const facts = {
            personalFoulCount: 6,
            gameDuration: 40
        };
        const events = await engine.run(facts);

        expect(events).toBeDefined();
        expect(events.length).toEqual(1);
        expect(events[0].params.message).toEqual('Player has fouled out!');
    });

    it('should test with player stay in court', async () => {
        const rule = ruleEngine.buildSampleRule();
        const engine = ruleEngine.createEngineWithRules([rule]);
        const facts = {
            personalFoulCount: 4,
            gameDuration: 40
        };
        const events = await engine.run(facts);

        expect(events).toBeDefined();
        expect(events.length).toEqual(0);
    });

    it('should build rule', () => {
        const rules = ruleEngine.buildMalfunctionRules(alertSetting);
        expect(rules).toBeDefined();
        expect(rules.length).toEqual(1);
        expect(rules[0].conditions.all.length).toEqual(3);
        expect(rules[0].conditions.all[0].fact).toEqual('spn190');
        expect(rules[0].event.params.id).toEqual(3);
        expect(rules[0].event.params.level).toEqual('General');

    });

    it('should build rule from firebase malfunction settings', async () => {
        const fire = new FireLayer();
        const settings = await fire.getMalfunctionSetting().toPromise();
        expect(settings).toBeDefined();
        const rules = ruleEngine.buildMalfunctionRules(settings);
        expect(rules).toBeDefined();
        expect(rules.length).toBeGreaterThan(1);
        expect(rules.every((rule: any) =>
            rule.conditions.all.some((c: any) =>
                c.fact === 'fcode' && c.operator === 'equal'))).toBeTruthy();
    });

    it('should have alert of OMNIT with spn# 1432 & 1489', async () => {
        const fire = new FireLayer();
        const settings = await fire.getMalfunctionSetting().toPromise();
        const rules = ruleEngine.buildMalfunctionRules(settings);
        const engine = ruleEngine.createEngineWithRules(rules);
        const facts = {
            fcode: 'OMNIT',
            spn1432: 33,
            spn1489: 0,
        };
        const events = await engine.run(facts);

        expect(events).toBeDefined();
        expect(events.length).toEqual(1);
        expect(events[0].type).toEqual('Malfunction');
        expect(events[0].params.id).toEqual(1);
        expect(events[0].params.name).toEqual('Temperature');
        expect(events[0].params.level).toEqual('General');
    });

    it('should NOT have alert of OMNIT with spn# 1432, 1489, 1530 & 1624', async () => {
        const fire = new FireLayer();
        const settings = await fire.getMalfunctionSetting().toPromise();
        const rules = ruleEngine.buildMalfunctionRules(settings);
        const engine = ruleEngine.createEngineWithRules(rules);
        const facts = {
            fcode: 'OMNIT',
            spn1432: 39,
            spn1489: 44,
            spn1530: 99,
            spn1624: 88
        };
        const events = await engine.run(facts);

        expect(events).toBeDefined();
        expect(events.length).toEqual(0);
    });
});
