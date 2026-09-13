export const ACCIDENT_YEARS = Array.from(
  { length: 9 },
  (_, index) => {
    const year = 2016 + index;

    return {
      value: year,
      label: year,
    };
  }
);

export function getMonths() {
  return [
    { value: 1, label: "January" },
    { value: 2, label: "February" },
    { value: 3, label: "March" },
    { value: 4, label: "April" },
    { value: 5, label: "May" },
    { value: 6, label: "June" },
    { value: 7, label: "July" },
    { value: 8, label: "August" },
    { value: 9, label: "September" },
    { value: 10, label: "October" },
    { value: 11, label: "November" },
    { value: 12, label: "December" },
  ];
}

export function getWeekdays() {
  return [
    { value: 1, label: "Saturday" },
    { value: 2, label: "Sunday" },
    { value: 3, label: "Monday" },
    { value: 4, label: "Tuesday" },
    { value: 5, label: "Wednesday" },
    { value: 6, label: "Thursday" },
    { value: 7, label: "Friday" },
  ];
}

export const STATES = [
  { value: "01", label: "Schleswig-Holstein" },
  { value: "02", label: "Hamburg" },
  { value: "03", label: "Lower Saxony" },
  { value: "04", label: "Bremen" },
  { value: "05", label: "North Rhine-Westphalia" },
  { value: "06", label: "Hesse" },
  { value: "07", label: "Rhineland-Palatinate" },
  { value: "08", label: "Baden-Württemberg" },
  { value: "09", label: "Bavaria" },
  { value: "10", label: "Saarland" },
  { value: "11", label: "Berlin" },
  { value: "12", label: "Brandenburg" },
  { value: "13", label: "Mecklenburg-Western Pomerania" },
  { value: "14", label: "Saxony" },
  { value: "15", label: "Saxony-Anhalt" },
  { value: "16", label: "Thuringia" },
];