import { State, Selector, Action, StateContext } from '@ngxs/store';
import { ViewProfileStateModel } from '../models/view-profile.model';
import { SetProfile, ClearProfile } from '../actions';
import { DataService, UtilityService } from '../services';
import { tap } from 'rxjs/operators';

const defaults: ViewProfileStateModel = {
    fcode: null,
    vcode: null
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
        private utilityService: UtilityService
    ) { }

    @Action(SetProfile)
    setProfile(ctx: StateContext<ViewProfileStateModel>, action: SetProfile) {
        if (action.vcode && !action.fcode) {
            const fleets$ = this.dataService.getFleets();
            return this.utilityService.getViewProfileByVehicleCode(action.vcode, fleets$).pipe(
                tap(profile => ctx.patchState(profile))
            );
        } else {
            ctx.patchState({
                fcode: action.fcode,
                vcode: action.vcode
            });
        }
    }

    @Action(ClearProfile)
    clearProfile(ctx: StateContext<ViewProfileStateModel>) {
        ctx.patchState(defaults);
    }
}
