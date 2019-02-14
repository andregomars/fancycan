import { IRuleCondition } from 'fancycan-model';
const Rule = require('json-rules-engine').Rule;
const Engine = require('json-rules-engine').Engine;

export class RuleEngine {
    public createEngine(): any {
        return this.createEngineWithRules([]);
    }

    public createEngineWithRules(rules: any[]): any {
        return new Engine(rules, { allowUndefinedFacts: true });
    }

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

    /**
     * @example
     * // returned groups for example:
     * //  1: [
     * //      { fact: spn9004, operator: 'lessThan', value: 2},
     * //      { fact: spn90, operator: 'notEqual', value: 1},
     * //      { fact: 'fcode', operator: 'equal', value: 'OMNIT'}
     * //  ]
     * //  2: [
     * //      { fact: spn9004, operator: 'greaterThan', value: 11},
     * //      { fact: 'fcode', operator: 'equal', value: 'BYD'}
     * //  ]
     */
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
