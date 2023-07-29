export interface OriginalCard {
    name: string,
    description: string,
    image_url: string,
    metadata: {
        health: number,
        attackPower: number,
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
    token_id?: string,
    token_address?: string
}