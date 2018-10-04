import { State, Selector, Action, StateContext } from '@ngxs/store';
import { ViewProfileStateModel } from '../models/view-profile.model';
import { SetProfile, ClearProfile } from '../actions';

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
    ) {}

    @Action(SetProfile)
    setProfile(ctx: StateContext<ViewProfileStateModel>, action: SetProfile) {
        ctx.patchState({
            fcode: action.fcode,
            vcode: action.vcode
        });
    }

    @Action(ClearProfile)
    clearProfile(ctx: StateContext<ViewProfileStateModel>) {
        ctx.patchState(defaults);
    }
}
