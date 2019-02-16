import { IRuleCondition, IRuleEvent } from 'fancycan-model';
const Rule = require('json-rules-engine').Rule;
const Engine = require('json-rules-engine').Engine;

export class RuleEngine {
    public createEngine(): any {
        return this.createEngineWithRules([]);
    }

    public createEngineWithRules(rules: any[]): any {
        return new Engine(rules, { allowUndefinedFacts: true });
    }

    public buildMalfunctionRules(ruleSettings: any[]): any[] {
        const rules: any[] = [];
        for (const setting of ruleSettings) {
            const conditions: IRuleCondition[] = setting.conditions.map((condition: any) => {
                return {
                    fact: `spn${condition.spn}`,
                    operator: this.getOperatorTerm(condition.expression),
                    value: condition.value,
                } as IRuleCondition;
            });
            if (conditions.length > 0) {
                const conditionFleetCode: IRuleCondition = {
                    fact: 'fcode',
                    operator: 'equal',
                    value: setting.fleet_code,
                };
                conditions.push(conditionFleetCode);
            }

            const event: IRuleEvent = {
                type: 'Malfunction',
                params: {
                    id: setting.id,
                    name: setting.name,
                    level: setting.level,
                }
            }

            const rule = {
                conditions: {
                    all: conditions
                },
                event: event
            };

            rules.push(rule);
        }

        return rules;
    }

    /*
    public buildRules(malfuncRules: any[]): any[] {
        const groups = this.buildRuleConditionGroups(malfuncRules);

        const rules: any[] = [];
        groups.forEach((value, key) => {
            rules.push({
                conditions: {
                    all: value
                },
                event: {
                    type: 'Malfunction',
                    params: {
                        id: key,
                        level: 'General',
                    }
                }
            });
        });

        return rules;
    }

    public buildRuleConditionGroups(malfuncRules: any[]): Map<number, IRuleCondition[]> {
        const conditionGroups = new Map<number, IRuleCondition[]>();
        for (const rule of malfuncRules) {
            const conditions: IRuleCondition[] = rule.conditions.map((condition: any) => {
                return {
                    fact: `spn${condition.spn}`,
                    operator: this.getOperatorTerm(condition.expression),
                    value: condition.value,
                } as IRuleCondition;
            });
            if (conditions.length > 0) {
                const conditionFleetCode: IRuleCondition = {
                    fact: 'fcode',
                    operator: 'equal',
                    value: rule.fleet_code,
                };
                conditions.push(conditionFleetCode);
            }
            conditionGroups.set(rule.id, conditions);
        }

        return conditionGroups;
    }
    */

    public buildSampleRule(): any {
        const event = {
            type: 'fouledOut',
            params: {
                message: 'Player has fouled out!'
            }
        };
        const conditions = {
            any: [{
                all: [{
                    fact: 'gameDuration',
                    operator: 'equal',
                    value: 40
                }, {
                    fact: 'personalFoulCount',
                    operator: 'greaterThanInclusive',
                    value: 5
                }]
            }, {
                all: [{
                    fact: 'gameDuration',
                    operator: 'equal',
                    value: 48
                }, {
                    fact: 'personalFoulCount',
                    operator: 'greaterThanInclusive',
                    value: 6
                }]
            }]
        };
        const rule = new Rule({ conditions, event });
        return rule;
    }

    private getOperatorTerm(sign: string) {
        let term = '';
        switch (sign) {
            case '>':
                term = 'greaterThan';
                break;
            case '<':
                term = 'lessThan';
                break;
            case '=':
                term = 'equal';
                break;
            case '!=':
                term = 'notEqual';
                break;
            default:
                break;
        }
        return term;
    }
}
