import { DEFAULT_CLEARING_NUMBER } from '@utils/constants';
import { generateAccountNumber, getClearingNumber } from '@utils/misc';
import { createMockedConfig } from '@utils/test';
import { regexExternalNumber } from '@shared/utils/regexes';

const defaultValue = DEFAULT_CLEARING_NUMBER.toString();
const clearingNumberConfig = (input: any) => {
  return createMockedConfig({ accounts: { clearingNumber: input } });
};

describe('Helper: getClearingNumber', () => {
  test('should take clearing number from config', () => {
    const config = clearingNumberConfig('900');
    expect(getClearingNumber(config)).toBe('900');
  });

  test('should handle number', () => {
    const config = clearingNumberConfig(900);
    expect(getClearingNumber(config)).toBe('900');
  });

  test('should default to 920', () => {
    expect(getClearingNumber()).toBe(defaultValue);
  });

  describe('error handling:', () => {
    test('Too long', () => {
      const config = clearingNumberConfig(9000);
      expect(getClearingNumber(config)).toBe(defaultValue);
    });

    test('Too short', () => {
      const config = clearingNumberConfig(90);
      expect(getClearingNumber(config)).toBe(defaultValue);
    });

    test('object', () => {
      const config = clearingNumberConfig({});
      expect(getClearingNumber(config)).toBe(defaultValue);
    });

    test('array', () => {
      const config = clearingNumberConfig([]);
      expect(getClearingNumber(config)).toBe(defaultValue);
    });
  });
});

describe('Helper: generateAccountNumber', () => {
  test('should pass regex test', () => {
    for (let i = 0; i < 100; i++) {
      const accountNumber = generateAccountNumber();
      expect(regexExternalNumber.test(accountNumber)).toBe(true);
    }
  });
});
