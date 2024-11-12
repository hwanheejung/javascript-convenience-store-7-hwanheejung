import calculateMembership from '../../src/utils/calculateMembership.js';

describe('utils/calculateMembership', () => {
  it.each([
    [10000, 3000], // 10000 * 0.3 = 3000
    [25000, 7500], // 25000 * 0.3 = 7500
    [30000, 8000], // 30000 * 0.3 = 9000, max is 8000
    [50000, 8000], // 50000 * 0.3 = 15000, max is 8000
    [0, 0],
    [10050, 3015], // 10050 * 0.3 = 3015
  ])('should return ', (input, expected) => {
    expect(calculateMembership(input)).toBe(expected);
  });
});
