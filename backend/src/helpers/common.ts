export const uuidRegex = /[a-f0-9]{8}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{4}-[a-f0-9]{12}/i;

export function isValidUuid(value?: string) {
    return value && uuidRegex.test(value);
}
