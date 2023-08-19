import { CardTypeDocument } from "@/pages/api/schemas/card_type_schema"
import { UserDocument } from "@/pages/api/schemas/user_schema"
import { useErrorSuccessActions } from "@/recoil-state/error_success/error_success.actions"
import { ErrorSuccessType } from "@/recoil-state/error_success/error_success.atom"
import { useGlobalModalActions } from "@/recoil-state/global_modal/global_modal.actions"
import { ButtonCustom, PText, allowOnlyNumbersDecimals } from "@/shared"
import { capitalizeFirstLetter } from "@/utils/functions/capitalize_first_letter"
import { trpc } from "@/utils/trpc"
import { useQuery } from "@tanstack/react-query"
import { Dropdown } from "flowbite-react"
import { useState } from "react"
import { Any } from "react-spring"
import DefaultCards from "./components/default_cards"

export default function DefautlCardGenerator() {
    const errorSuccessActions = useErrorSuccessActions();
    const globalModal = useGlobalModalActions();
    const generateImages = trpc.generateImages.useMutation();
    const generateDescription = trpc.generateDescription.useMutation();
    const getGeneration = trpc.getCurrentGeneration.useQuery();
    const getAllCardTypes = trpc.getAllCardTypes.useQuery();
    const createDefaultCard = trpc.createDefaultCard.useMutation();
    const getAllDefaultCards = trpc.getAllDefaultCards.useQuery();
    const [name, setName] = useState('')
    const [leonardoPropmt, setLeonardoPrompt] = useState('');
    const [attackPower, setAttackPower] = useState(0)
    const [health, setHealth] = useState(0)
    const [special, setSpecial] = useState('');
    const [cardType, setCardType] = useState<{
        id?: string,
        name: string
    }>({
        id: undefined,
        name: ''
    })

    const { data: user, isLoading, isError } = useQuery<UserDocument>(['user']);
    const allCardTypes = getAllCardTypes.data ?? [];

    const generateCardImages = async () => {
        if (attackPower < 1 || health < 1) {
            errorSuccessActions.openErrorSuccess('Attack or health are 0', ErrorSuccessType.ERROR)
            return
        }
        if (name.length < 3) {
            errorSuccessActions.openErrorSuccess('Name has to have 3 or more characters', ErrorSuccessType.ERROR)
            return
        }
        if (!cardType.id) {
            errorSuccessActions.openErrorSuccess('You have to choose the card type', ErrorSuccessType.ERROR)
            return
        }
        const description = await generateDescription.mutateAsync({
            prompt: `Describe ${cardType.name} ${name}. 20 words, for image generation prompt`
        })
        const images = await generateImages.mutateAsync({
            prompt: `${cardType.name} ${name} ${leonardoPropmt}, ${description ?? ''}, full body, centered shot`,
            negative_prompt: 'logo, watermark, signature, cropped, zoomed, abnormal, bizzare, double heads, minimalistic, lowpoly, distortion, blur, flat, matte, dead, loud, tension. Extra Arms, extra limbs, long neck,teeth, long head',
            modelId: 'd69c8273-6b17-4a30-a13e-d6637ae1c644',
            promptMagic: true,
            num_images: 2
        })
        if (!images) {
            errorSuccessActions.openErrorSuccess('Image generation faild', ErrorSuccessType.ERROR)
            return
        }
        globalModal.openGlobalModal(<div className="flex space-x-3 cursor-pointer">{images.map((image, index) => <img onClick={() => create(image)} className="w-60 h-60" key={index} src={image.url ?? ''} />)}</div>)
    }

    const create = async (image: any) => {
        globalModal.closeGlobalModal();
        const description = await generateDescription.mutateAsync({
            prompt: `Describe ${name} in 10 words. Epic fantasy style`
        })
        const defaultCard = {
            name: name,
            description: description ?? '',
            image_url: image.url,
            metadata: {
                health: health,
                attackPower: attackPower,
                special: special.length < 1 ? undefined : special,
                creatorPlayerName: user?.playerName ?? '',
                creatorAddress: user?.walletAddress ?? '',
                creatorLoreName: user?.generatedName ?? '',
                cardType: cardType.name,
                cardTypeId: cardType.id ?? '',
                collection: 'zero',
                generation: getGeneration.data?.generation ?? 0,
                imageId: image.id,
                default: true
            },
            isPublished: false
        }
        const res = await createDefaultCard.mutateAsync(defaultCard)
        if (!res) {
            errorSuccessActions.openErrorSuccess('Could not create the default card', ErrorSuccessType.ERROR)
        } else {
            resetLocalState()
            errorSuccessActions.openErrorSuccess('Default card created', ErrorSuccessType.SUCCESS)
            await getAllDefaultCards.refetch();
        }
    }

    const resetLocalState = () => {
        setName('')
        setLeonardoPrompt('')
        setHealth(0)
        setAttackPower(0),
            setCardType({
                id: undefined,
                name: ''
            }),
            setSpecial('')
    }

    return <div className="flex-col items-center justify-start w-full space-y-5">
        <div className="grid items-start grid-cols-4 gap-3">
            <div>
                <PText>Card name</PText>
                <input placeholder="Name" value={name} onChange={(e) => setName(e.target.value)} />
            </div>
            <div>
                <PText>Attack power</PText>
                <input placeholder="Attack power" value={attackPower} onChange={(e) => {
                    const formatedInput = allowOnlyNumbersDecimals(e.target.value)
                    if (formatedInput) {
                        setAttackPower(parseInt(formatedInput))
                    }
                }} />
            </div>
            <div>
                <PText>Health</PText>
                <input placeholder="Health" value={health} onChange={(e) => {
                    const formatedInput = allowOnlyNumbersDecimals(e.target.value)
                    if (formatedInput) {
                        setHealth(parseInt(formatedInput))
                    }
                }} />
            </div>
            <div>
                <PText>Special power</PText>
                <input placeholder="Special" value={special} onChange={(e) => {
                    setSpecial(e.target.value)
                }} />
            </div>
            <div className="p-1 border border-white rounded-lg" >
                <Dropdown label={cardType.id ? cardType.name.toUpperCase() : 'Card types'}>
                    {allCardTypes.map((type, index) => {
                        return <Dropdown.Item className="cursor-pointer" onClick={() => {
                            setCardType({
                                id: type._id,
                                name: type.name
                            })
                        }} key={index}>
                            <PText className="text-black">{capitalizeFirstLetter(type.name)}</PText>
                        </Dropdown.Item>
                    })}
                </Dropdown>
            </div>
            <div>
                <PText>Extra prompt (Optional)</PText>
                <input placeholder="Leonardo prompt" value={leonardoPropmt} onChange={(e) => setLeonardoPrompt(e.target.value)} />
            </div>
            <ButtonCustom
                disabled={generateImages.isLoading || generateDescription.isLoading || createDefaultCard.isLoading}
                isLoading={generateImages.isLoading || generateDescription.isLoading || createDefaultCard.isLoading}
                title="Create" onClick={generateCardImages}
            />
        </div>

        <div className="h-full overflow-y-auto">
            <DefaultCards />
        </div>
    </div>
}