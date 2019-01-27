export class SetProfile {
    static readonly type = '[viewprofile] set profile';
    constructor(public fcode: string, public vcode: string, public fname: string, public vin: string) {}
}

export class ExtractProfile {
    static readonly type = '[viewprofile] extract profile';
    constructor(public fcode: string, public vcode: string, public fname: string, public vin: string) {}
}

export class ClearProfile {
    static readonly type = '[viewprofile] clear profile';
}
