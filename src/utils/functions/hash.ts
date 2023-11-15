import { PBKDF2 } from 'crypto-js';
// import { env } from '../../../env.mjs';

export function compareHash(data: {
    text: string;
    salt: string;
    hash: string;
}): boolean {
    if (!data.hash || !data.salt) {
        throw new Error('hash and salt to compare must be defined');
    }
    const newHash = hash(data.text, data.salt);
    return newHash === data.hash;
}

export function hash(text: string, salt: string): string {
    return PBKDF2(text, salt + process.env.APP_PEPPER).toString();
}