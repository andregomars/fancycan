"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var firelayer_1 = require("./../src/app/firelayer");
it('should get definition from remote source', function () {
    var fireLayer = new firelayer_1.FireLayer();
    fireLayer.getDefinitions().subscribe(function (defs) {
        expect(defs).toBeDefined();
    });
});
it('should get definition with specification details', function () {
    var fireLayer = new firelayer_1.FireLayer();
    fireLayer.getDefinitionWithSpecs().subscribe(function (spn) {
        expect(spn).toBeDefined();
        expect(spn.length).toEqual(13);
    });
});
