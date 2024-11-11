import Promotion from '../../src/models/Promotion';
import PromotionList from '../../src/models/PromotionList';

describe('models/PromotionList', () => {
  let promotionList;

  beforeEach(() => {
    promotionList = new PromotionList();
    promotionList.loadPromotions();
  });

  describe('getPromotionByName()', () => {
    it('should return the promotion info', () => {
      const promotion = promotionList.getPromotionByName('탄산2+1');

      expect(promotion).toBeInstanceOf(Promotion);
      expect(promotion.name).toBe('탄산2+1');
      expect(promotion.buy).toBe(2);
      expect(promotion.get).toBe(1);
      expect(promotion.startDate).toEqual(new Date('2024-01-01'));
      expect(promotion.endDate).toEqual(new Date('2024-12-31'));
    });

    it('should return null for a non-existent promotion', () => {
      const promotion = promotionList.getPromotionByName('없는프로모션');
      expect(promotion).toBeNull();
    });
  });
});
