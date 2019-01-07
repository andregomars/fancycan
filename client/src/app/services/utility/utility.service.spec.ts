import { TestBed, inject } from '@angular/core/testing';
import { UtilityService } from './utility.service';
import { Buffer } from 'buffer/';

describe('UtilityService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UtilityService]
    });
  });

  it('should be created', inject([UtilityService], (utility: UtilityService) => {
    expect(utility).toBeTruthy();
  }));

  it('should devide raw can values', inject([UtilityService], (utility: UtilityService) => {
    const input = 'A1B2C3';
    const output = utility.formatRawCAN(input);

    const expected = 'A1 B2 C3';
    expect(output).toEqual(expected);
  }));

  it('should devide raw can values', inject([UtilityService], (utility: UtilityService) => {
    const input = 'A1B2C';
    const output = utility.formatRawCAN(input);

    const expected = 'A1 B2 C';
    expect(output).toEqual(expected);
  }));

  it('should devide raw can values', inject([UtilityService], (utility: UtilityService) => {
    const input = 'A';
    const output = utility.formatRawCAN(input);

    const expected = 'A';
    expect(output).toEqual(expected);
  }));

  it('should devide raw can values', inject([UtilityService], (utility: UtilityService) => {
    const input = '';
    const output = utility.formatRawCAN(input);

    const expected = '';
    expect(output).toEqual(expected);
  }));

  it('should devide raw can values', inject([UtilityService], (utility: UtilityService) => {
    const input = 'A1';
    const output = utility.formatRawCAN(input);

    const expected = 'A1';
    expect(output).toEqual(expected);
  }));

  it('should get value from CAN data', inject([UtilityService], (utility: UtilityService) => {
    const buffer = Buffer.from('BAQAAFQCACA=', 'base64');
    const startBit = 33;
    const length = 16;
    const actual = utility.decodeJ1939(buffer, startBit, length);

    const expected = 596;
    expect(actual).toEqual(expected);
  }));

  it('should get value from CAN data', inject([UtilityService], (utility: UtilityService) => {
    const buffer = Buffer.from('7F5FFFFFFFFFFFFF', 'hex');
    const startBit = 33;
    const length = 8;
    const actual = utility.decodeJ1939(buffer, startBit, length);

    const expected = 255;
    expect(actual).toEqual(expected);
  }));
});
