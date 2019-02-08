import { IJ1939 } from 'fancycan-model';
import { FireLayer } from '../src/core';

it('should get definition from remote source', () => {
    const fireLayer = new FireLayer();
    fireLayer.getDefinitions().subscribe((defs: any[]) => {
        expect(defs).toBeDefined();
    });
});

it('should get definition with specification details', () => {
    const fireLayer = new FireLayer();
    fireLayer.getDefinitionWithSpecs().subscribe((spn: IJ1939[]) => {
        expect(spn).toBeDefined();
        expect(spn.length).toEqual(13);
    });
});
