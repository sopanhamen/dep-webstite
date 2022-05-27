import moment, { Moment } from 'moment';

/**
 * Details
 * @param text, value to convert
 * @returns converted first letter/s to uppercase
 */
export function toTitleCase(text: string = ''): string {
  const strings = (text + '').split(' ');
  const formattedStrings = strings?.map(
    (t) => t?.charAt(0)?.toUpperCase() + t?.slice(1)?.toLowerCase(),
  );
  return formattedStrings?.join(' ');
}

/**
 * Details
 * @param isoString value to convert.
 * @param format format to convert to. Default is 'DD MMM, YYYY'.
 * @returns converted iso date string to a formatting date string.
 */
export function formatISODate(
  isoString: string = '',
  format: string = 'DD MMM, YYYY',
): string {
  return moment(isoString)?.format(format);
}

/**
 * Details
 * @param isoString value to convert.
 * @returns how many days have past since the day it is created till now.
 */
//SOURCE https://stackoverflow.com/questions/9129928/how-to-calculate-number-of-days-between-two-dates
export function dateFromNow(isoString: string): string {
  const a = moment();
  const b = moment(isoString);

  const difference = a.diff(b, 'days');

  switch (difference) {
    case 0:
      return `${hoursAndMinutesFromNow(a, isoString)}`;
    case 1:
      return '1 day ago';
    default:
      return `${difference} days ago`;
  }
}

/**
 * Details
 * @param now moment time.
 * @param then string of ISO
 * @returns how many hours have past since the day it is created till now.
 */
export function hoursAndMinutesFromNow(now: Moment, isoString: string) {
  const ms = moment(now, 'DD/MM/YYYY HH:mm:ss').diff(
    moment(new Date(isoString), 'DD/MM/YYYY HH:mm:ss'),
  );

  const d = moment.duration(ms);

  return `${d.hours()} hours and ${d.minutes()} minutes ago`;
}

/**
 * Details
 * @param data data to be checked.
 * @returns boolean, true if data is an Array, otherwise, false.
 */
export function isArray(data: any) {
  return Object.prototype.toString.call(data) === '[object Array]';
}

/**
 * Details
 * @param data data to be converted to string separated by a given sign.
 * @param separator sign or letter string used to separate data.
 * @returns a string separated by given sign.
 */
export function arrayToPipeString(data: any[] | any, separator: string = '|') {
  if (isArray(data)) {
    return data?.toString()?.split(',')?.join(separator);
  } else if (data) {
    return data + '';
  }
  return '';
}

export function covertToStringArray(data: any[] | any, key: string = 'code') {
  let arr: any[] = [];
  data?.length ? data.forEach((item: any) => arr.push(item[key])) : [];
  return arr;
}

export function selectCreatableToStringArray(data: any[] | any) {
  let arr: string[] = [];
  if (data?.length) {
    data.forEach((item: any) => {
      if (item?.__isNew__) {
        arr.push(item.value);
      } else {
        arr.push(item);
      }
    });
  }
  return arr;
}
