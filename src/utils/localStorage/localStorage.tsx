export const LOCAL_CRYPTIES_STORAGE_KEY = {
    AUTH: 'crypties:auth',
    WALLET_ADDRESS: 'crypties:wallet'
};

export const LocalStorage = {
    get: (key: string) => {
        if (typeof window !== 'undefined') {
            try {
                const saved = localStorage.getItem(key);

                if (saved != 'undefined' || saved != null) {
                    return JSON.parse(saved!);
                }
                return null;
            } catch (e) {
                console.error(e);
                return null;
            }
            // const initial = saved !== null ? JSON.parse(saved) : null;
            // return initial;
        }
    },
    set: (key: string, value: any) => {
        if (typeof window !== 'undefined') {
            const json = JSON.stringify(value);

            if (!json) {
                console.info(`Storage value is undefined, cancelled`, json);
                return;
            }

            console.info(`Saving to local storage`, json);
            window.localStorage.setItem(key, json);
        }
    },
    remove: (key: string) => {
        if (typeof window !== 'undefined') {
            window.localStorage.removeItem(key);
        }
    },
};