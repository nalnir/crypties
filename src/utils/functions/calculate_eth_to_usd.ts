export function calculateEthToDollar(ethAmount: number, ethPriceInDollars: number) {
    const dollarValue = (ethAmount * ethPriceInDollars).toFixed(2);
    return dollarValue;
}