export function removeSingleWhiteSpace(str: string) {
    const finalString = str.replace(/\s+/g, "");
    return finalString
}