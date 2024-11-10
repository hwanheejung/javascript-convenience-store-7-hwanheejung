const calculateMembership = (amount) => {
  const discountRate = 0.3;
  const maxDiscount = 8000;

  const discount = amount * discountRate;

  if (discount > maxDiscount) {
    return maxDiscount;
  }

  return Math.floor(discount);
};

export default calculateMembership;
