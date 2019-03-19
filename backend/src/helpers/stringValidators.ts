const uuidRegex = /[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/i;
// tslint:disable-next-line: max-line-length
const isoDateRegex = /^(-?(?:[1-9][0-9]*)?[0-9]{4})-(1[0-2]|0[1-9])-(3[01]|0[1-9]|[12][0-9])T(2[0-3]|[01][0-9]):([0-5][0-9]):([0-5][0-9])(.[0-9]+)?(Z)?$/;

export function isValidUuid(value?: string) {
    return value && uuidRegex.test(value);
}

export function isValidIsoDate(value?: string) {
    return value && isoDateRegex.test(value);
}
