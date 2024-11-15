import { DateTimes } from '@woowacourse/mission-utils';

class Promotion {
  /** @type {string} */ name;
  /** @type {number} */ buy;
  /** @type {number} */ get;
  /** @type {Date} */ startDate;
  /** @type {Date} */ endDate;

  constructor(name, buy, get, startDate, endDate) {
    this.name = name;
    this.buy = buy;
    this.get = get;
    this.startDate = new Date(startDate);
    this.endDate = new Date(endDate);
  }

  /**
   * 현재 날짜가 프로모션 기간 내에 있는지 확인한다.
   * @param {Date} [currentDate=DateTimes.now()] - 확인할 날짜
   * @returns {boolean} 프로모션이 활성 상태인지 여부
   */
  isActive(currentDate = DateTimes.now()) {
    return currentDate >= this.startDate && currentDate <= this.endDate;
  }

  /**
   * 프로모션 조건 및 현재 활성 상태를 반환한다.
   * @returns {{ buy: number, get: number, isActive: boolean }} 프로모션 조건 및 활성 상태
   */
  getDetails() {
    return {
      buy: this.buy,
      get: this.get,
      isActive: this.isActive(),
    };
  }
}

export default Promotion;
