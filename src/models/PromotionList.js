import getDataFromFile from '../utils/getDataFromFile.js';
import Promotion from './Promotion.js';

class PromotionList {
  /**
   * 프로모션 데이터를 저장하는 Map 객체
   * @type {Map<string, Promotion>}
   */
  promotions;

  constructor() {
    this.promotions = new Map();
  }

  /**
   * 파일에서 프로모션 정보를 불러와 promotions 맵을 초기화한다.
   * @returns {void}
   */
  loadPromotions() {
    const promotionLines = getDataFromFile('../../public/promotions.md');

    promotionLines.forEach((line) => {
      const promotion = this.#parsePromotionLine(line);
      this.promotions.set(promotion.name, promotion);
    });
  }

  /**
   * 특정 프로모션의 이름을 기반으로 프로모션 객체를 반환한다.
   * @param {string} name - 프로모션 이름
   * @returns {Promotion} 지정된 이름의 Promotion 객체
   */
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
