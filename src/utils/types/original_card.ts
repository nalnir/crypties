export interface OriginalCard extends InGameData {
    name: string,
    description: string,
    image_url: string,
    metadata: {
        health: number,
        attackPower: number,
        manaCost?: number,
        special?: string,
        creatorPlayerName: string,
        creatorAddress: string,
        creatorLoreName: string,
        cardType: string,
        cardTypeId: string,
        collection?: string,
        generation: number,
        ipfsCID?: string,
        imageId: string
    },
    orders?: {
        sell_orders?: Array<{
            buy_decimals: number,
            buy_quantity: {
                hex: string,
                type: string
            },
            order_id: number,
            status: string,
            user: string
        }>
    },
    token_id?: string,
    token_address?: string,
}

interface InGameData {
    specialPowerUsedTimes?: number;
}