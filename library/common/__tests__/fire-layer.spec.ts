import { TransformUtility } from 'fancycan-utility';
import { FireLayer } from '../src/core';

it('should get definition from remote source', () => {
    const fireLayer = new FireLayer();
    fireLayer.getDefinitions().subscribe((defs: any[]) => {
        expect(defs).toBeDefined();
    });
});

it('should get definition with specification details', async () => {
    const fireLayer = new FireLayer();
    const transform = new TransformUtility();
    const defs = await fireLayer.getDefinitions().toPromise();
    const spnsProp = await fireLayer.getProprietarySpnList().toPromise();
    const spnsJ1939 = await fireLayer.getJ1939SpnList().toPromise();
    const spns = transform.getDefinitionWithSpecs(defs, spnsProp, spnsJ1939);
    expect(spns).toBeDefined();
    expect(spns.length).toEqual(17);
});
