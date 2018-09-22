import { TestBed, inject } from '@angular/core/testing';
import { UtilityService } from './utility.service';

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
});
