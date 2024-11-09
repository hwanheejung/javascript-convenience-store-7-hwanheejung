import { DateTimes } from '@woowacourse/mission-utils';

class Promotion {
  constructor(name, buy, get, startDate, endDate) {
    this.name = name;
    this.buy = buy;
    this.get = get;
    this.startDate = new Date(startDate);
    this.endDate = new Date(endDate);
  }

  isActive(currentDate = DateTimes.now()) {
    return currentDate >= this.startDate && currentDate <= this.endDate;
  }

  getPromotionDetails() {
    return {
      buy: this.buy,
      get: this.get,
      isActive: this.isActive(),
    };
  }
}

export default Promotion;
