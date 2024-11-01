export const getPreviousMonday = (date: Date): Date => {
  const day = date.getDay();
  const diff = day === 0 ? 6 : day - 1; // Adjust for Sunday being 0
  const previousMonday = new Date(date);
  previousMonday.setDate(date.getDate() - diff);
  return previousMonday;
};

export const formatDate = (date: Date): string => {
  return date.toISOString().split('T')[0];
};

export const getWeekDates = (offset: number = 0): { [key: string]: string } => {
  const today = new Date();
  today.setDate(today.getDate() + offset * 7);
  const monday = getPreviousMonday(today);
  const weekDates: { [key: string]: string } = {
    monday: formatDate(monday),
    tuesday: formatDate(new Date(monday.setDate(monday.getDate() + 1))),
    wednesday: formatDate(new Date(monday.setDate(monday.getDate() + 1))),
    thursday: formatDate(new Date(monday.setDate(monday.getDate() + 1))),
    friday: formatDate(new Date(monday.setDate(monday.getDate() + 1))),
  };
  return weekDates;
};

export const getMonthRange = (startDate: Date, endDate: Date): string => {
  const startMonth = startDate.toLocaleString('default', { month: 'long' });
  const endMonth = endDate.toLocaleString('default', { month: 'long' });

  if (startMonth === endMonth) {
    return startMonth;
  } else {
    return `${startMonth} - ${endMonth}`;
  }
};

export const calculateMonthsDifference = (startDate: string, endDate: string): number => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const yearsDifference = end.getFullYear() - start.getFullYear();
  const monthsDifference = end.getMonth() - start.getMonth();
  return yearsDifference * 12 + monthsDifference + 1;
};


export const getDatesBetween = (startDate: string, endDate: string): Date[] => {
  const start = new Date(startDate);
  const end = new Date(endDate);
  const dates: Date[] = [];
  for (let d = new Date(start); d <= end; d.setDate(d.getDate() + 1)) {
    if (d.getDay() !== 0 && d.getDay() !== 6) { // Exclude weekends
      dates.push(new Date(d));
    }
  }
  return dates;
};

function formatDateToISO(date: Date): string {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const day = String(date.getDate()).padStart(2, '0');
  return `${year}-${month}-${day}`;
}

export function convertSelectedDates(dates: Date[]): string[] {
  if (!dates) return [];
  return dates.map(date => formatDateToISO(date));
}