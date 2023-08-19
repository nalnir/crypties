export const allowOnlyNumbersDecimals = (input: string, allowDecimals?: boolean) => {
    if (input === "") {
        return "0";
    }

    if (allowDecimals) {
        const regex = /^[0-9]*\.?[0-9]*$/;
        if (regex.test(input)) {
            return input;
        }
    } else {
        const regex = /^[0-9]+$/;

        if (regex.test(input)) {
            return input;
        }
    }

    return "";
};





