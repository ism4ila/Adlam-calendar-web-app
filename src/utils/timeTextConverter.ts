
const units = [
  "", "une", "deux", "trois", "quatre", "cinq", "six", "sept", "huit", "neuf", "dix",
  "onze", "douze", "treize", "quatorze", "quinze", "seize"
];
const tens = [
  "", "dix", "vingt", "trente", "quarante", "cinquante", "soixante"
];

const convertNumberToFrench = (number: number): string => {
  if (number < 17) {
    return units[number];
  }
  if (number < 60) {
    const unit = number % 10;
    const ten = Math.floor(number / 10);
    return unit === 0 ? tens[ten] : `${tens[ten]}-${units[unit]}`;
  }
  return number.toString();
};

export const convertTimeInFrench = (date: Date, hourFormat: 12 | 24 = 12): string => {
  const hour = date.getHours();
  const minute = date.getMinutes();

  let hourText = "";
  if (hour === 0) hourText = "minuit";
  else if (hour === 12) hourText = "midi";
  else if (hourFormat === 24) hourText = convertNumberToFrench(hour);
  else hourText = convertNumberToFrench(hour > 12 ? hour - 12 : hour);

  if (minute === 0) {
    return `${hourText} heures`;
  } else if (minute === 15) {
    return `${hourText} et quart`;
  } else if (minute === 30) {
    return `${hourText} et demie`;
  } else if (minute === 45) {
    const nextHour = hour === 23 ? 0 : hour + 1;
    let nextHourText = "";
    if (nextHour === 0) nextHourText = "minuit";
    else if (nextHour === 12) nextHourText = "midi";
    else nextHourText = convertNumberToFrench(nextHour > 12 ? nextHour - 12 : nextHour);
    return `${nextHourText} moins le quart`;
  } else {
    return `${hourText} heures ${convertNumberToFrench(minute)}`;
  }
};
