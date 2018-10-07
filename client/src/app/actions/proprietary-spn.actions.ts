import { ProprietarySpnStateModel } from '../models/proprietary-spn.model';

export class AddProprietarySpn {
    static readonly type = '[Prop page] add prop';
    constructor(public propSpn: ProprietarySpnStateModel) {}
}

export class UpdateProprietarySpn {
    static readonly type = '[Prop page] update prop';
    constructor(public propSpn: ProprietarySpnStateModel) {}
}

export class RemoveProprietarySpn {
    static readonly type = '[Prop page] remove prop';
    constructor(public propSpnNo: string) {}
}
