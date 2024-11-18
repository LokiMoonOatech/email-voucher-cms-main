import { parseDate } from 'chrono-node';

export const smartParseDate = (dateString: string): Date => {
  switch (true) {
    case /\d{4}(?:.{1,3}\d{2}){2}/.test(dateString): {
      // 쿠팡 등
      const [year, month, day] = /(\d{4}).{1,3}(\d{2}).{1,3}(\d{2})/
        .exec(dateString)!
        .slice(1);

      return new Date(Number(year), Number(month) - 1, Number(day));
    }
    default:
      return parseDate(dateString);
  }
};
