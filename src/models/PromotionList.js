import getDataFromFile from '../utils/getDataFromFile.js';
import Promotion from './Promotion.js';

class PromotionList {
  constructor() {
    this.promotions = new Map();
  }

  loadPromotions() {
    const promotionLines = getDataFromFile('../../public/promotions.md');

    promotionLines.forEach((line) => {
      const promotion = this.#parsePromotionLine(line);
      this.promotions.set(promotion.name, promotion);
    });
  }

  getPromotionByName(name) {
    return this.promotions.get(name);
  }

  #parsePromotionLine(line) {
    const [name, buy, get, startDate, endDate] = line.split(',');
    return new Promotion(
      name,
      parseInt(buy, 10),
      parseInt(get, 10),
      startDate,
      endDate,
    );
  }
}

export default PromotionList;
