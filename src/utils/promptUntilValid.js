import { Console } from '@woowacourse/mission-utils';

const promptUntilValid = async (validator, promptMessage) => {
  const input = await Console.readLineAsync(promptMessage);
  const validInput = validator(input);

  if (validInput) return validInput;
  return promptUntilValid(validator, promptMessage);
};

export default promptUntilValid;
