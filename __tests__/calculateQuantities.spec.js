import calculateQuantities from '../src/utils/calculateQuantities.js';
import InputView from '../src/views/InputView.js';

jest.mock('../src/views/InputView');

describe('utils/calculateQuantities()', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  const testCalculateQuantities = async ({
    quantity,
    promoStock,
    baseStock,
    buy,
    get,
    confirmExcessBaseStock,
    confirmPromo,
    confirmBase,
    expectedPromo,
    expectedBase,
  }) => {
    if (confirmExcessBaseStock)
      InputView.confirmExcessBaseStock.mockResolvedValue(
        confirmExcessBaseStock,
      );
    if (confirmPromo) InputView.confirmPromo.mockResolvedValue(confirmPromo);
    if (confirmBase) InputView.confirmBase.mockResolvedValue(confirmBase);

    const result = await calculateQuantities(
      '콜라',
      quantity,
      promoStock,
      baseStock,
      buy,
      get,
    );
    expect(result).toEqual({
      promoQuantity: expectedPromo,
      baseQuantity: expectedBase,
    });
  };

  describe('no promotion', () => {
    it.each`
      quantity | promoStock | baseStock | buy  | get  | confirmExcessBaseStock | confirmPromo | confirmBase | expectedPromo | expectedBase
      ${2}     | ${0}       | ${2}      | ${0} | ${0} | ${null}                | ${null}      | ${null}     | ${0}          | ${2}
    `(
      'should calculate quantities with quantity=$quantity, buy=$buy, get=$get',
      async (params) => await testCalculateQuantities(params),
    );
  });

  describe('2+1 promotion', () => {
    it.each`
      quantity | promoStock | baseStock | buy  | get  | confirmExcessBaseStock | confirmPromo | confirmBase | expectedPromo | expectedBase
      ${1}     | ${6}       | ${2}      | ${2} | ${1} | ${null}                | ${null}      | ${'Y'}      | ${0}          | ${1}
      ${1}     | ${6}       | ${2}      | ${2} | ${1} | ${null}                | ${null}      | ${'N'}      | ${0}          | ${0}
      ${2}     | ${6}       | ${2}      | ${2} | ${1} | ${null}                | ${'Y'}       | ${null}     | ${3}          | ${0}
      ${2}     | ${6}       | ${2}      | ${2} | ${1} | ${null}                | ${'N'}       | ${'Y'}      | ${0}          | ${2}
      ${3}     | ${6}       | ${2}      | ${2} | ${1} | ${null}                | ${null}      | ${null}     | ${3}          | ${0}
      ${4}     | ${6}       | ${2}      | ${2} | ${1} | ${null}                | ${null}      | ${'Y'}      | ${3}          | ${1}
      ${5}     | ${6}       | ${2}      | ${2} | ${1} | ${null}                | ${'Y'}       | ${null}     | ${6}          | ${0}
      ${5}     | ${6}       | ${2}      | ${2} | ${1} | ${null}                | ${'N'}       | ${'Y'}      | ${3}          | ${2}
      ${6}     | ${6}       | ${2}      | ${2} | ${1} | ${null}                | ${null}      | ${null}     | ${6}          | ${0}
      ${7}     | ${6}       | ${2}      | ${2} | ${1} | ${null}                | ${null}      | ${'Y'}      | ${6}          | ${1}
      ${8}     | ${6}       | ${2}      | ${2} | ${1} | ${null}                | ${null}      | ${'Y'}      | ${6}          | ${2}
      ${8}     | ${7}       | ${1}      | ${2} | ${1} | ${'Y'}                 | ${null}      | ${'Y'}      | ${6}          | ${1}
    `(
      'should calculate quantities with quantity=$quantity, buy=$buy, get=$get',
      async (params) => await testCalculateQuantities(params),
    );
  });

  describe('1+1 promotion', () => {
    it.each`
      quantity | promoStock | baseStock | buy  | get  | confirmExcessBaseStock | confirmPromo | confirmBase | expectedPromo | expectedBase
      ${2}     | ${3}       | ${2}      | ${1} | ${1} | ${null}                | ${null}      | ${null}     | ${2}          | ${0}
      ${1}     | ${3}       | ${2}      | ${1} | ${1} | ${null}                | ${'Y'}       | ${null}     | ${2}          | ${0}
      ${1}     | ${3}       | ${2}      | ${1} | ${1} | ${null}                | ${'N'}       | ${'Y'}      | ${0}          | ${1}
      ${3}     | ${3}       | ${2}      | ${1} | ${1} | ${null}                | ${null}      | ${'Y'}      | ${2}          | ${1}
    `(
      'should calculate quantities with quantity=$quantity, buy=$buy, get=$get',
      async (params) => await testCalculateQuantities(params),
    );
  });
});
