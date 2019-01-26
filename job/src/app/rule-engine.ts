import { IRuleCondition } from 'fancycan-model';

export class RuleEngine {
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
