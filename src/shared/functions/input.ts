import { ChangeEvent } from "react";

export const allowOnlyNumbersDecimals = (input: string, allowDecimals?: boolean) => {

    if (input.length <= 0) {
        return '0'
    }
    // Regular expression to allow only numbers and decimals
    const regex = allowDecimals ? /^[0-9]*(\.[0-9]*)?$/ : /^[0-9]*$/;

    // Check if the input value matches the regex pattern
    if (regex.test(input)) {
        // If the input value is valid, return the input
        return input;
    }

    // If the input value is invalid (contains non-numeric characters), return an empty string
    return "";
};