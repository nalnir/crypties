export interface LeonardoAPI {
  auth(apiKey: string): void;
  createGeneration(options: CreateGenerationOptions): Promise<any>
  getGenerationById(options: GetGenerationByIdOptions): Promise<any>
}

interface CreateGenerationOptions {
  prompt: string,
  negative_prompt?: string,
  modelId?: string,
  sd_version?: string,
  num_images?: number,
  width?: number,
  height?: number,
  num_inference_steps?: number,
  guidance_scale?: number,
  init_generation_image_id?: string,
  init_image_id?: string,
  init_strength?: number,
  scheduler?: string,
  presetStyle?: string,
  tiling?: boolean,
  public?: boolean,
  promptMagic?: boolean,
  controlNet?: boolean,
  controlNetType?: 'POSE' | 'CANNY' | 'DEPTH'
}

interface GetGenerationByIdOptions {
  id: string
}

export interface CreateGenerationResponseData {
  sdGenerationJob: {
    generationId: string
  }
}

export interface GeneratedImageVariationGenerics {
  "generated_image_variation_generics": [
    {
      "id": string | null,
      "status": "PENDING" | "COMPLETE" | "FAILED" | null,
      "transformType": "OUTPAINT" | "INPAINT" | "UPSCALE" | "UNZOOM" | "NOBG" | null,
      "url": string | null
    }
  ] | null,
  "id": string | null,
  "likeCount": number | null,
  "nsfw": boolean | null,
  "url": string | null
}
export interface GetGenerationByIdResponseData {
  "generations_by_pk": {
    "generated_images": GeneratedImageVariationGenerics[] | null,
    "guidanceScale": number | null,
    "id": string | null,
    "imageHeight": number | null,
    "imageWidth": number | null,
    "inferenceSteps": number | null,
    "initStrength": number | null,
    "modelId": string | null,
    "negativePrompt": string | null,
    "presetStyle": "LEONARDO" | "NONE" | null,
    "prompt": string | null,
    "public": boolean | null,
    "scheduler": "KLMS" | "EULER_ANCESTRAL_DISCRETE" | "EULER_DISCRETE" | "DDIM" | "DPM_SOLVER" | "PNDM" | null,
    "sdVersion": string | null,
    "seed": number | null,
    "status": "PENDING" | "COMPLETE" | "FAILED" | null,
    "createdAt": string | null
  } | null
}