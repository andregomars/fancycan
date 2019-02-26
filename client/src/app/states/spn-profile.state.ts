import { State, Selector, Action, StateContext } from '@ngxs/store';
import { SpnProfileStateModel } from '../models';
import { SetSpnProfiles, ClearSpnProfiles } from '../actions';
import { DataService } from '../services';
import { tap, map } from 'rxjs/operators';

const defaults: SpnProfileStateModel[] = [];

@State<SpnProfileStateModel[]>({
    name: 'spnprofiles',
    defaults: defaults
})
export class SpnProfileState {
    @Selector()
    static spns(state: SpnProfileStateModel[]) {
        return state;
    }

    constructor(
        private dataService: DataService
    ) { }

    @Action(SetSpnProfiles)
    setSpnProfile(ctx: StateContext<SpnProfileStateModel[]>, action: SetSpnProfiles) {
        return this.dataService.getDefinitions().pipe(
            map((defs: any[]) => defs.filter(def => def.fleet_code === action.fcode)),
            tap(profiles => ctx.setState(profiles))
        );
    }

    @Action(ClearSpnProfiles)
    clearSpnProfile(ctx: StateContext<SpnProfileStateModel[]>) {
        ctx.setState(defaults);
    }
}
