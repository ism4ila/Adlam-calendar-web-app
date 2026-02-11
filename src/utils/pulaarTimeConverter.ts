export const units = [
  "", "Go'o", "Ɗiɗi", "Tati", "Nay", "Joy", "Jeegom", "Ɗeeɗɗi", "Jeetati", "Jeenay", "Sappo"
];

export const unitsAdlam = [
  "",           // 0
  "𞤘𞤮𞥅𞤮",     // 1 - Go'o
  "𞤍𞤭𞤯𞤭",     // 2 - Ɗiɗi
  "𞤚𞤢𞤼𞤭",     // 3 - Tati
  "𞤐𞤢𞤴",      // 4 - Nay
  "𞤔𞤮𞤴",      // 5 - Joy
  "𞤔𞤫𞥅𞤺𞤮𞤥",  // 6 - Jeegom
  "𞤍𞤫𞥅𞤯𞥆𞤭",    // 7 - Ɗeeɗɗi
  "𞤔𞤫𞥅𞤼𞤢𞤼𞤭", // 8 - Jeetati
  "𞤔𞤫𞥅𞤲𞤢𞤴",  // 9 - Jeenay
  "𞤅𞤢𞤨𞥆𞤮"    // 10 - Sappo
];

export const convertNumberToPulaar = (number: number): string => {
  if (number === 0) return "hoore";
  if (number <= 10) return units[number].toLowerCase();

  if (number < 20) {
    return `sappo e ${units[number - 10].toLowerCase()}`;
  }

  if (number === 20) return "noogas";

  if (number < 30) {
    const unit = number - 20;
    return `noogas e ${units[unit].toLowerCase()}`;
  }

  const tens = Math.floor(number / 10);
  const unit = number % 10;

  let tensText = "";
  switch (tens) {
    case 3: tensText = "cappandee tati"; break;
    case 4: tensText = "cappandee nay"; break;
    case 5: tensText = "cappandee joy"; break;
    case 6: tensText = "cappandee jeegom"; break;
    default: tensText = "sappo";
  }

  return unit === 0 ? tensText : `${tensText} e ${units[unit].toLowerCase()}`;
};

export const convertNumberToAdlam = (number: number): string => {
  if (number === 0) return "𞤸𞤮𞥅𞤪𞤫";
  if (number <= 10) return unitsAdlam[number];

  const sappo = "𞤅𞤢𞤨𞥆𞤮"; // Sappo (10)
  const e = "𞤫"; // e (and)

  if (number < 20) {
    return `${sappo} ${e} ${unitsAdlam[number - 10]}`;
  }

  const noogas = "𞤐𞤮𞥅𞤺𞤢𞤧"; // Noogas (20)
  if (number === 20) return noogas;

  if (number < 30) {
    const unit = number - 20;
    return `${noogas} ${e} ${unitsAdlam[unit]}`;
  }

  const tens = Math.floor(number / 10);
  const unit = number % 10;

  const cappande = "𞤕𞤢𞤨𞥆𞤢𞤲𞤯𞤫"; // Cappanɗe (tens)
  let tensText = "";
  switch (tens) {
    case 3: tensText = `${cappande} 𞤚𞤢𞤼𞤭`; break;
    case 4: tensText = `${cappande} 𞤐𞤢𞤴`; break;
    case 5: tensText = `${cappande} 𞤔𞤮𞤴`; break;
    case 6: tensText = `${cappande} 𞤔𞤫𞥅𞤺𞤮𞤥`; break;
    default: tensText = sappo;
  }

  return unit === 0 ? tensText : `${tensText} ${e} ${unitsAdlam[unit]}`;
};

export const convertTimeToPulaar = (
  date: Date,
  useAdlamScript: boolean = false,
  hourFormat: 12 | 24 = 12
): string => {
  const hour = date.getHours();
  const minute = date.getMinutes();

  const hourValue =
    hourFormat === 24 ? (hour === 0 ? 0 : hour) : (hour === 0 || hour === 12 ? 12 : hour % 12);

  const hourText = useAdlamScript ? convertNumberToAdlam(hourValue) : convertNumberToPulaar(hourValue);
  const minuteText = useAdlamScript ? convertNumberToAdlam(minute) : convertNumberToPulaar(minute);

  const waktu = useAdlamScript ? "𞤏𞤢𞤳𞤼𞤵" : "Waktu";
  const e = useAdlamScript ? "𞤫" : "e";

  const base = `${waktu} ${hourText}`;

  return minute === 0 ? base : `${base} ${e} ${minuteText}`;
};