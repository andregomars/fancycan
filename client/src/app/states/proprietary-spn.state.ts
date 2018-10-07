import { ProprietarySpnStateModel } from '../models/proprietary-spn.model';
import { State, Selector, createSelector, Action, StateContext } from '@ngxs/store';
import { InitProprietarySpnList } from '../actions';
import { DataService } from '../services';
import { map, tap } from 'rxjs/operators';

const defaults: ProprietarySpnStateModel = {
    spnItems: []
};

@State<ProprietarySpnStateModel>({
    name: 'propspn',
    defaults: defaults
})
export class ProprietarySpnState {
    @Selector()
    static spnList(state: ProprietarySpnStateModel): any {
        return state.spnItems.map(item => {
            return {
                SPNNo: item.SPNNo,
                SPNName: item.SPNName,
                PGNNo: item.PGNNo
            };
        });
    }

    constructor(
        private dataService: DataService
    ) {}

    @Action(InitProprietarySpnList)
    initPropList(ctx: StateContext<ProprietarySpnStateModel>, action: InitProprietarySpnList) {
        return this.dataService.getProprietarySpnList().pipe(
            map(list => list.filter(item => item.fleet_code === action.fcode)),
            tap(fleetSpnItems => {
                const state = ctx.getState();
                ctx.setState({
                    ...state,
                    spnItems: [...state.spnItems, fleetSpnItems]
                });
            })
        );
    }

}
