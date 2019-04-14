import { TestBed, inject } from '@angular/core/testing';
import { DataService } from './data.service';
import { HttpClientModule } from '@angular/common/http';
import { ObjectID } from 'bson';

describe('DataService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientModule],
      providers: [DataService]
    });
  });

  it('should be created', inject([DataService], (data: DataService) => {
    expect(data).toBeTruthy();
  }));

  it('should convert date to iso standard', () => {
    const utcStr = '2019-03-08T08:07:22.000Z';
    const localStr = '2019-03-08T00:07:22.000';
    const date = new Date(localStr);

    const output = date.toISOString();
    expect(output).toEqual(utcStr);

  });

  it('should get proper date from bson', () => {
    const id = new ObjectID('5c8222ba0000000000000000');
    const dateStr = '2019-03-08T08:07:22.000Z';
    const output = id.getTimestamp();
    const expected = new Date(dateStr);

    expect(output).toEqual(expected);

  });

  xit('should get CAN states by speicied date range', inject([DataService], async (dataService: DataService) => {
    const vcode = '6005';
    const beginDate = new Date('2019-03-08T08:07:22.000Z');
    const endDate = new Date('2019-03-08T08:07:23.000Z');
    const output = await dataService.getCansByDateRange(vcode, beginDate, endDate).toPromise();

    const expected = 85;
    expect(output).toBeTruthy();
    expect(output.length).toEqual(expected);
  }));

  xit('should get CAN states by speicied _id date range', inject([DataService], async (dataService: DataService) => {
    const vcode = '6005';
    const beginDate = new Date('2019-03-08T08:07:22.000Z');
    const endDate = new Date('2019-03-08T08:07:23.000Z');
    const output = await dataService.getCansByDateRange(vcode, beginDate, endDate).toPromise();

    const expected = 85;
    expect(output).toBeTruthy();
    expect(output.length).toEqual(expected);
  }));

});
