import { ChangeEvent } from "react";

export const allowOnlyNumbersDecimals = (input: string) => {
    // Regular expression to allow only numbers and decimals
    const regex = /^[0-9]*(\.[0-9]*)?$/;

    // Check if the input value matches the regex pattern
    if (regex.test(input)) {
        // If the input value is valid, update the state
        return input
    }
    return undefined
    // If the input value is invalid (contains non-numeric characters), do nothing
};