// @ts-nocheck
/* eslint-disable */
import pad from "./pad.mjs";
function createNativeLocaleFormatter(locale, options) {
  let substrOptions = arguments.length > 2 && arguments[2] !== undefined ? arguments[2] : {
    start: 0,
    length: 0
  };
  const makeIsoString = dateString => {
    const [year, month, date] = dateString.trim().split(' ')[0].split('-');
    return [pad(year, 4), pad(month || 1), pad(date || 1)].join('-');
  };
  try {
    const intlFormatter = new Intl.DateTimeFormat(locale || undefined, options);
    return dateString => intlFormatter.format(new Date(`${makeIsoString(dateString)}T00:00:00+00:00`));
  } catch (e) {
    return substrOptions.start || substrOptions.length ? dateString => makeIsoString(dateString).substr(substrOptions.start || 0, substrOptions.length) : undefined;
  }
}
export default createNativeLocaleFormatter;
//# sourceMappingURL=createNativeLocaleFormatter.mjs.map