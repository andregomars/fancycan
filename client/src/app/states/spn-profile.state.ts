import { State, Selector, Action, StateContext } from '@ngxs/store';
import { forkJoin } from 'rxjs';
import { tap, map } from 'rxjs/operators';
// import { TransformUtility } from 'fancycan-utility';
import { IJ1939 } from 'fancycan-model';

// import { SpnProfileStateModel } from '../models';
import { SetSpnProfiles, ClearSpnProfiles } from '../actions';
import { DataService, TransformService } from '../services';

const defaults: IJ1939[] = [];

@State<IJ1939[]>({
    name: 'spnprofiles',
    defaults: defaults
})
export class SpnProfileState {
    @Selector()
    static spns(state: IJ1939[]) {
        return state;
    }

    constructor(
        private dataService: DataService,
        // private transormUtility: TransformUtility
        private transform: TransformService
    ) { }

    @Action(SetSpnProfiles)
    setSpnProfile(ctx: StateContext<IJ1939[]>, action: SetSpnProfiles) {
        const defs$ = this.dataService.getDefinitions().pipe(
            map((defs: any[]) => defs.filter(def => def.fleet_code === action.fcode))
        );
        const spnsProp$ = this.dataService.getProprietarySpnList();
        const spnsJ1939$ = this.dataService.getSpnSpecs();
        return forkJoin(defs$, spnsProp$, spnsJ1939$).pipe(
            map(([defs, spnsProp, spnsJ1939]) => this.transform.getDefinitionWithSpecs(defs, spnsProp, spnsJ1939)),
            tap(profiles => ctx.setState(profiles))
        );

    }

    @Action(ClearSpnProfiles)
    clearSpnProfile(ctx: StateContext<IJ1939[]>) {
        ctx.setState(defaults);
    }
}
