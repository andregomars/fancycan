import { State, Selector, Action, StateContext } from '@ngxs/store';
import { ViewProfileStateModel } from '../models';
import { SetProfile, ClearProfile } from '../actions';
import { DataService, TransformService } from '../services';
import { tap } from 'rxjs/operators';

const defaults: ViewProfileStateModel = {
    fcode: null,
    fname: null,
    vcode: null,
    vin: null
};

@State<ViewProfileStateModel>({
    name: 'viewprofile',
    defaults: defaults
})
export class ViewProfileState {
    @Selector()
    static fcode(state: ViewProfileStateModel) {
        return state.fcode;
    }

    @Selector()
    static vcode(state: ViewProfileStateModel) {
        return state.vcode;
    }

    constructor(
        private dataService: DataService,
        private transformService: TransformService
    ) { }

    @Action(SetProfile)
    setProfile(ctx: StateContext<ViewProfileStateModel>, action: SetProfile) {
        if (action.vcode && !action.fcode) {
            const fleets$ = this.dataService.getFleets();
            return this.transformService.getViewProfileByVehicleCode(action.vcode, fleets$).pipe(
                tap(profile => ctx.patchState(profile))
            );
        } else {
            ctx.patchState({
                fcode: action.fcode,
                fname: action.fname,
                vcode: action.vcode,
                vin: action.vin
            });
        }
    }

    @Action(ClearProfile)
    clearProfile(ctx: StateContext<ViewProfileStateModel>) {
        ctx.patchState(defaults);
    }
}
