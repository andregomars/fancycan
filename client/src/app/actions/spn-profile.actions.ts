export class SetSpnProfiles {
    static readonly type = '[spnprofile] set profiles';
    constructor(public fcode: string) {}
}

export class ExtractSpnProfiles {
    static readonly type = '[spnprofile] extract profiles';
    constructor(public fcode: string) {}
}

export class ClearSpnProfiles {
    static readonly type = '[spnprofile] clear profiles';
}
