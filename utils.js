export const setDays = (days, initialDate) => {
  initialDate.setDate(initialDate.getDate() + days);
  let month = initialDate.getMonth() + 1;
  month = month < 10 ? `0${month}` : month;
  let date = initialDate.getDate();
  date = date < 10 ? `0${date}` : date;
  return `${initialDate.getFullYear()}-${month}-${date}`;
};

export const receiveMinDate = () => {
  const now = new Date();
  const hours = now.getHours();
  return setDays(hours < 14 ? 1 : 2, now);
};

export const calculateSum = (carValue, daysCount, chosenOptions, valueKey) => {
  const sumOfCar = Number(daysCount) * carValue[valueKey];
  const sumOfAdditionalOptions = chosenOptions.reduce((total, option) => {
    const optionsPrice =
      option.paymentType === 0
        ? option[valueKey]
        : option[valueKey] * Number(daysCount);
    return total + optionsPrice;
  }, 0);
  return sumOfCar + sumOfAdditionalOptions;
};
