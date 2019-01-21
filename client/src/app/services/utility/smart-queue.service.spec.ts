import { TestBed } from '@angular/core/testing';

import { SmartQueueService } from './smart-queue.service';

describe('SmartQueueService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: SmartQueueService = TestBed.get(SmartQueueService);
    expect(service).toBeTruthy();
  });

  it('should update existing entry in the queue', () => {
    const service: SmartQueueService = TestBed.get(SmartQueueService);
    service.push({key: 'id001', value: 'andre', time: new Date()});
    service.push({key: 'id002', value: 'blake', time: new Date()});
    service.push({key: 'id001', value: 'carol', time: new Date()});

    const queue = service.queue;
    const entry001 = queue.find(x => x.key === 'id001').value;
    const entry002 = queue.find(x => x.key === 'id002').value;

    expect(queue.length).toEqual(2);
    expect(entry001).toEqual('carol');
    expect(entry002).toEqual('blake');
  });

  it('should not get any filtered values after filter is removed', () => {
    const service: SmartQueueService = TestBed.get(SmartQueueService);

    service.setFilter('18fc1621', 33, 16);
    service.push({ key: '18A74221', value: '040400000C020020', time: new Date() });
    service.push({ key: '18fc1621', value: '0404000054020020', time: new Date() });
    service.push({ key: '18fc1621', value: '040400006A020020', time: new Date() });
    service.push({ key: '18A74221', value: '040400000C020020', time: new Date() });
    service.push({ key: '18fc1621', value: '040400000C020020', time: new Date() });
    service.push({ key: '10FDA300', value: '040400000C020020', time: new Date() });
    service.clearFilter();

    expect(service.queue.length).toEqual(3);
    expect(service.times).toBeNull();
    expect(service.timer).toBeNull();
    expect(service.min).toBeNull();
    expect(service.max).toBeNull();

  });

  it('should get filtered values from SPN# 9004', () => {
    const service: SmartQueueService = TestBed.get(SmartQueueService);

    service.setFilter('18fc1621', 33, 16);
    service.push({ key: '18A74221', value: '040400000C020020', time: new Date() });
    service.push({ key: '18fc1621', value: '0404000054020020', time: new Date() });
    service.push({ key: '18fc1621', value: '040400006A020020', time: new Date() });
    service.push({ key: '18A74221', value: '040400000C020020', time: new Date() });
    service.push({ key: '18fc1621', value: '040400000C020020', time: new Date() });
    service.push({ key: '10FDA300', value: '040400000C020020', time: new Date() });

    expect(service.queue.length).toEqual(3);
    expect(service.times).toEqual(3);
    expect(service.min).toEqual(524);
    expect(service.max).toEqual(618);

  });
});
