import { ProprietarySpnStateModel } from '../models/proprietary-spn.model';
import { State, Selector, createSelector } from '@ngxs/store';

const defaults: ProprietarySpnStateModel = {
   SPNItems: null
};

@State<ProprietarySpnStateModel>({
    name: 'propspn',
    defaults: defaults
})
export class ProprietarySpnState {
    @Selector()
    static spnList(state: ProprietarySpnStateModel) {
        return state.SPNItems.map(item => {
            return {
                SPNNo: item.SPNNo,
                SPNName: item.SPNName,
                PGNNo: item.PGNNo
            };
        });
    }

    @Selector()
    static spn(spnNo: string) {
        return createSelector([ProprietarySpnState], (state: ProprietarySpnStateModel) => {
            return state.SPNItems.find(s => s.SPNNo.indexOf(spnNo) > -1);
        });
    }
}
