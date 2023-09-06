export function coinflip(playerWallet: string, opponentWallet: string) {
    return Math.random() < 0.5 ? playerWallet : opponentWallet;
}