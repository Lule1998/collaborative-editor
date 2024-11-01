import { CRDT } from './crdt';

describe('Crdt', () => {
  it('should create an instance', () => {
    expect(new CRDT()).toBeTruthy();
  });
});
