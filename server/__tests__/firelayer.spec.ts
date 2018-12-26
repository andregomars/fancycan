import { FireLayer } from './../src/app/firelayer';

// it('should return ok', () => {
//     expect(true).toBeTruthy();
// });

it('should get definition from remote source', () => {
    const fireLayer = new FireLayer();
    fireLayer.getDefinitions().subscribe((defs: any[]) => {
        expect(defs).toBeDefined();
    });
});
