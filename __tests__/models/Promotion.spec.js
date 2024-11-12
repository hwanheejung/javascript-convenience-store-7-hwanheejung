import Promotion from '../../src/models/Promotion';
import { MissionUtils } from '@woowacourse/mission-utils';

const mockNowDate = (date = null) => {
  const mockDateTimes = jest.spyOn(MissionUtils.DateTimes, 'now');
  mockDateTimes.mockReturnValue(new Date(date));
  return mockDateTimes;
};

describe('models/Promotion', () => {
  const testCases = [
    {
      promotionData: {
        name: '탄산2+1',
        buy: 2,
        get: 1,
        startDate: '2024-01-01',
        endDate: '2024-12-31',
      },
      date: '2024-06-15',
      expectedIsActive: true,
    },
    {
      promotionData: {
        name: '탄산2+1',
        buy: 2,
        get: 1,
        startDate: '2024-01-01',
        endDate: '2024-12-31',
      },
      date: '2023-12-31',
      expectedIsActive: false,
    },
    {
      promotionData: {
        name: '탄산2+1',
        buy: 2,
        get: 1,
        startDate: '2024-01-01',
        endDate: '2024-12-31',
      },
      date: '2025-01-01',
      expectedIsActive: false,
    },
    {
      promotionData: {
        name: 'MD추천상품',
        buy: 1,
        get: 1,
        startDate: '2024-01-01',
        endDate: '2024-12-31',
      },
      date: '2024-06-15',
      expectedIsActive: true,
    },
    {
      promotionData: {
        name: '반짝할인',
        buy: 1,
        get: 1,
        startDate: '2024-11-01',
        endDate: '2024-11-30',
      },
      date: '2024-11-15',
      expectedIsActive: true,
    },
    {
      promotionData: {
        name: '반짝할인',
        buy: 1,
        get: 1,
        startDate: '2024-11-01',
        endDate: '2024-11-30',
      },
      date: '2024-10-31',
      expectedIsActive: false,
    },
    {
      promotionData: {
        name: '반짝할인',
        buy: 1,
        get: 1,
        startDate: '2024-11-01',
        endDate: '2024-11-30',
      },
      date: '2024-11-30',
      expectedIsActive: true,
    },
  ];

  it.each(testCases)(
    'should return correct isActive and promotion details',
    ({ promotionData, date, expectedIsActive }) => {
      const { name, buy, get, startDate, endDate } = promotionData;
      const promotion = new Promotion(name, buy, get, startDate, endDate);

      mockNowDate(date);

      const isActiveResult = promotion.isActive();
      expect(isActiveResult).toBe(expectedIsActive);

      const details = promotion.getDetails();
      expect(details).toEqual({
        buy,
        get,
        isActive: expectedIsActive,
      });
    },
  );
});
