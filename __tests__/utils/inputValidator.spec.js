import { Console } from '@woowacourse/mission-utils';
import {
  productsValidator,
  yesOrNoValidator,
} from '../../src/utils/inputValidator.js';
import { ERROR } from '../../src/constants/messages.js';

jest.mock('@woowacourse/mission-utils', () => ({
  Console: { print: jest.fn() },
}));

describe('utils/inputValidator', () => {
  describe('yesOrNoValidator()', () => {
    it.each([
      ['Y', 'Y'],
      ['N', 'N'],
      ['y', null],
      ['yes', null],
      ['', null],
      [' ', null],
    ])('should return %p for input %p', (input, expected) => {
      expect(yesOrNoValidator(input)).toBe(expected);
      if (expected === null) {
        expect(Console.print).toHaveBeenCalledWith(ERROR.INVALID_YN);
      }
    });
  });
  describe('productsValidator()', () => {
    const stockMock = {
      getProductQuantity: jest.fn((name) => ({
        all: { 콜라: 10, 사이다: 5 }[name],
      })),
    };

    afterEach(() => {
      jest.clearAllMocks();
    });

    describe('when format is invalid', () => {
      it.each([
        ['콜라-5', null],
        ['[콜라 5]', null],
        ['콜라-5]', null],
        ['[콜라-5', null],
        ['[콜라-ㄴ', null],
      ])('should print error for invalid format %p', (input, expected) => {
        expect(productsValidator(input, stockMock)).toBe(expected);
        expect(Console.print).toHaveBeenCalledWith(
          ERROR.INVALID_PRODUCT_FORMAT,
        );
      });
    });

    describe('when product does not exist in stock', () => {
      it.each([
        ['[맥주-5]', null],
        ['[사이다-3],[맥주-2]', null],
      ])('prints error for non-existent product %p', (input, expected) => {
        expect(productsValidator(input, stockMock)).toBe(expected);
        expect(Console.print).toHaveBeenCalledWith(
          ERROR.PRODUCT_NOT_FOUND('맥주'),
        );
      });
    });

    describe('when quantity exceeds available stock', () => {
      it.each([
        ['[콜라-11]', null],
        ['[사이다-6]', null],
        ['[콜라-5],[사이다-6]', null],
      ])('should print error for exceeding quantity %p', (input, expected) => {
        expect(productsValidator(input, stockMock)).toBe(expected);
        expect(Console.print).toHaveBeenCalledWith(
          ERROR.EXCEEDS_STOCK_QUANTITY,
        );
      });
    });
    describe('when quantity is insufficient', () => {
      it.each([
        ['[콜라-0]', null],
        ['[사이다--5]', null],
        ['[콜라-0],[사이다-6]', null],
      ])(
        'should print error for insufficient quantity in input %p',
        (input, expected) => {
          expect(productsValidator(input, stockMock)).toBe(expected);
          expect(Console.print).toHaveBeenCalledWith(
            ERROR.MINIMUM_QUANTITY_REQUIRED,
          );
        },
      );
    });

    describe('when input is valid', () => {
      it.each([
        ['[콜라-5]', ['[콜라-5]']],
        ['[콜라-3]', ['[콜라-3]']],
        ['[콜라-5],[사이다-2]', ['[콜라-5]', '[사이다-2]']],
      ])('should return products list %p', (input, expected) => {
        expect(productsValidator(input, stockMock)).toEqual(expected);
      });
    });
  });
});
