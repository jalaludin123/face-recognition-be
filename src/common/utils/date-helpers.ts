import { randomInt } from 'crypto';

export const countAge = (birthdate: string) => {
  const todayDate = new Date().getTime();
  const birthDate = new Date(birthdate).getTime();
  const age = (todayDate - birthDate) / (1000 * 60 * 60 * 24 * 365);

  return Math.floor(age);
};

export const ageCalculate = (birthdate: string) => {
  const todayDate = new Date();
  const birthDate = new Date(birthdate);
  let age = todayDate.getFullYear() - birthDate.getFullYear();

  const hasHadBirthday =
    todayDate.getMonth() > birthDate.getMonth() ||
    (todayDate.getMonth() === birthDate.getMonth() &&
      todayDate.getDate() >= birthDate.getDate());

  if (!hasHadBirthday) {
    age -= 1; // Reduce age if the birthday hasn't occurred yet this year
  }
  console.log('age', age);
  return Math.floor(age);
};

export const timeRandom = () => {
  let resp: string = '';

  [...Array(3).keys()].forEach((i) => {
    resp += randomInt(1, i == 0 ? 24 : 60)
      .toString()
      .padStart(2, '0');

    if (i < 2) resp += ':';
  });

  return resp;
};

export const dateRandom = () => {
  let resp: string = '';

  [...Array(3).keys()].forEach((i) => {
    resp += randomInt(i == 0 ? 2020 : 1, i == 0 ? 2022 : 12)
      .toString()
      .padStart(i == 0 ? 4 : 2, '0');

    if (i < 2) resp += '-';
  });

  return resp;
};

export const dateWithoutSeparator = ({ date = null, isShort = false }) => {
  const d = date ? new Date(date) : new Date();

  const res = d.toISOString().split('T')[0].split('-').join('');

  return isShort ? res.slice(2) : res;
};

export const dateDashed = (resp: { date?: Date | string }): string => {
  const { date } = resp;
  const d = date ? new Date(date) : new Date();

  const res = d.toISOString().split('T')[0];

  return res;
};

export const formatDate = ({ date = null, lang = 'en-GB' }) => {
  const d = date ? new Date(date) : new Date();

  return new Intl.DateTimeFormat(lang, {
    dateStyle: 'long',
    timeZone: 'Asia/Jakarta',
  }).format(d);
};

export const getDates = (
  endDate: string | Date,
  startDate?: string | Date
): Date[] => {
  let dateArray = new Array();
  let currentDate = !startDate
    ? new Date()
    : typeof startDate == 'string'
      ? new Date(startDate)
      : (startDate as Date);
  const targetDate = typeof endDate == 'string' ? new Date(endDate) : endDate;

  while (currentDate <= targetDate) {
    dateArray.push(new Date(currentDate.getTime()));
    currentDate = addDays(currentDate);
  }
  return dateArray;
};

const addDays = (dateValue?: string | Date, days = 1): Date => {
  const date = !dateValue
    ? new Date()
    : dateValue == 'string'
      ? new Date(dateValue)
      : (dateValue as Date);
  date.setDate(date.getDate() + days);
  return date;
};

export const sortDateArray = (props: {
  dates: any[];
  sort?: 'ASC' | 'DESC';
  column?: string;
}): any[] => {
  const { dates, column, sort = 'ASC' } = props;

  const funcOpts = {
    ASC: (a: any, b: any) => {
      return !column
        ? a.getTime() - b.getTime()
        : a[column].getTime() - b[column].getTime();
    },
    DESC: (a: any, b: any) => {
      return !column
        ? b.getTime() - a.getTime()
        : b[column].getTime() - a[column].getTime();
    },
  };

  return dates
    .map((e) =>
      typeof e == 'object'
        ? { ...e, [column]: new Date(e[column]) }
        : new Date(e)
    )
    .sort(funcOpts[sort]);
};

export const getWeekendDays = (
  endDate: string | Date,
  startDate?: string | Date
): { date: Date; desc: string }[] => {
  let dateArray = new Array();
  let currentDate = !startDate
    ? new Date()
    : typeof startDate == 'string'
      ? new Date(startDate)
      : (startDate as Date);
  const targetDate =
    typeof endDate == 'string' ? new Date(endDate) : (endDate as Date);

  while (currentDate <= targetDate) {
    const day = currentDate.getDay();
    if (day === 6 || day === 0)
      dateArray.push({
        date: currentDate,
        desc: day === 6 ? 'Sabtu' : 'Minggu',
      });
    currentDate = addDays(new Date(currentDate.getTime()));
  }

  return dateArray;
};

export const getTimePassedInSecond = (startTime: Date): number => {
  const endTime = new Date();
  let timeDiff = endTime.getTime() - startTime.getTime(); //in ms
  // strip the ms
  timeDiff /= 1000;

  // get seconds
  return Math.round(timeDiff);
};

export const formatDDMMMYYY = ({ date = null, lang = 'en-GB' }) => {
  const d = date ? new Date(date) : new Date();
  const day = d.toLocaleString('default', { day: '2-digit' });
  const month = d.toLocaleString('default', { month: 'long' });
  const year = d.toLocaleString('default', { year: 'numeric' });

  return day + ' ' + month + ' ' + year;
};
