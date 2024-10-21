import dayjs from 'dayjs';

const customParseFormat = require('dayjs/plugin/customParseFormat');

dayjs.extend(customParseFormat);

export function getDateByMMYYYY(val) {
  return dayjs(val, 'MM/YYYY');
}
