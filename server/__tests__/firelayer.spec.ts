import { FireLayer } from './../src/app/firelayer';
import { IJ1939 } from '../src/app/models';

const fireUrl = 'https://fancycandemo.firebaseio.com';

it('should get definition from remote source', () => {
    const fireLayer = new FireLayer(fireUrl);
    fireLayer.getDefinitions().subscribe((defs: any[]) => {
        expect(defs).toBeDefined();
    });
});

it('should get definition with specification details', () => {
    const fireLayer = new FireLayer(fireUrl);
    fireLayer.getDefinitionWithSpecs().subscribe((spn: IJ1939[]) => {
        expect(spn).toBeDefined();
        expect(spn.length).toEqual(13);
    });
});
