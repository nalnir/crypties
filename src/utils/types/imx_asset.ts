import { OriginalCard } from "./original_card"

export interface IMXAssetCrypties {
    collection: {
        icon_url: string,
        name: string
    },
    created_at: string,
    description: string,
    fees: [
        {
            address: string,
            percentage: 100,
            type: string
        }
    ],
    id: string,
    image_url: string,
    metadata: {},
    name: string,
    orders: {
        buy_orders: [
            {}
        ],
        sell_orders: [
            {}
        ]
    },
    status: string,
    token_address: string,
    token_id: string,
    updated_at: string,
    uri?: string,
    user: string
}