import { TestBed, inject } from '@angular/core/testing';
import { Buffer } from 'buffer/';

import { CanService } from './can.service';
import { Dm1EntryType, Dm1Data, Dm1Collection } from '../../models';

describe('CanService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CanService = TestBed.get(CanService);
    expect(service).toBeTruthy();
  });

  it('should get J1939 value from CAN data', inject([CanService], (can: CanService) => {
    const buffer = Buffer.from('BAQAAFQCACA=', 'base64');
    const startBit = 33;
    const length = 16;
    const actual = can.decodeJ1939(buffer, startBit, length);

    const expected = 596;
    expect(actual).toEqual(expected);
  }));

  it('should get J1939 value from CAN data', inject([CanService], (can: CanService) => {
    const buffer = Buffer.from('7F5FFFFFFFFFFFFF', 'hex');
    const startBit = 33;
    const length = 8;
    const actual = can.decodeJ1939(buffer, startBit, length);

    const expected = 255;
    expect(actual).toEqual(expected);
  }));

  it('should get single DM1 value from CAN data', inject([CanService], (can: CanService) => {
    const canData = '10FF6F020101FFFF';
    const dm1Collection: Dm1Collection = {
      lamp: 0,
      packetsCount: 0,
      entriesCount: 0,
      entriesBuffer: Buffer.alloc(0),
      data: []
    };
    const actual = can.decodeDm1(canData, Dm1EntryType.Single, dm1Collection);

    expect(actual).toBeDefined();
    expect(actual.lamp).toEqual(16);
    expect(actual.packetsCount).toEqual(1);
    expect(actual.entriesCount).toEqual(1);
    expect(actual.data.length).toEqual(1);
    expect(actual.data[0].spn).toEqual(623);
    expect(actual.data[0].fmi).toEqual(1);
    expect(actual.data[0].count).toEqual(1);
  }));

  it('should get multiple DM1 values from CAN data', inject([CanService], (can: CanService) => {
    let dm1Collection: Dm1Collection = {
      lamp: 0,
      packetsCount: 0,
      entriesCount: 0,
      entriesBuffer: Buffer.alloc(0),
      data: []
    };
    dm1Collection = can.decodeDm1('200AFFFFFFCAFE00', Dm1EntryType.MultiHeader, dm1Collection);
    dm1Collection = can.decodeDm1('0110FF640001013D', Dm1EntryType.MultiData, dm1Collection);
    const actual = can.decodeDm1('020B0101FFFFFFFF', Dm1EntryType.MultiData, dm1Collection);

    expect(actual).toBeDefined();
    expect(actual.packetsCount).toEqual(2);
    expect(actual.entriesCount).toEqual(2);
    expect(actual.lamp).toEqual(16);
    expect(actual.entriesBuffer.toString('hex').toUpperCase()).toEqual('10FF640001013D0B0101FFFFFFFF');
    expect(actual.data.length).toEqual(2);
    expect(actual.data[0].spn).toEqual(100);
    expect(actual.data[0].fmi).toEqual(1);
    expect(actual.data[0].count).toEqual(1);
    expect(actual.data[1].spn).toEqual(2877);
    expect(actual.data[1].fmi).toEqual(1);
    expect(actual.data[1].count).toEqual(1);
  }));
});
