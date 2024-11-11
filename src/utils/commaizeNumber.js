const commaizeNumber = (number) => {
  const num = Number(number);

  if (Number.isNaN(num))
    throw new Error(
      `Invalid input: expected a number, but received '${number}'`,
    );

  return num.toLocaleString('en-US');
};

export default commaizeNumber;
