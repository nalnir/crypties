export function normalizeWalletAddress(walletAddress: string) {
    // Convert to lowercase
    const normalizedAddress = walletAddress.toLowerCase();
  
    // Remove special characters and spaces
    const regex = /[^\w]/g;
    const cleanedAddress = normalizedAddress.replace(regex, '');
  
    return cleanedAddress;
}