/**
 * Function takes multiline string and drops unnecessary indentation.
 * For example:
 * `
 *      dawdawd
 *      dawdawd
 *         dawd
 * ` becomes
 * `
 * dawdawd
 * dawdawd
 *    dawd
 * `
 * 
 * @param text Multiline text to be processed
 * @returns Multiline text with dropped indent
 */
export const removeIndent = (text: string): string => {
    const splitted = text.split('\n');
    const minIndent = Math.min(...splitted.filter(e => e.trim().length > 0).map(e => e.search(/\S/)));
    const deindented = splitted.map(e => e.substring(minIndent)).join('\n');
    return deindented;
}

interface Enum {
    [id: number]: string;
}

export const getEnumKey = (e: Enum, value: number): string => {
    return e[value];
}