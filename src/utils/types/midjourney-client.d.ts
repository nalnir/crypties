declare module 'midjourney-client' 
{
    type MidjourneyResponse = string[];
  
    interface MidjourneyOptions {
      width?: number;
      heigth?: number;
      num_outputs?: number;
      num_inference_steps?: number;
      guidance_scale?: number;
      seed?: number;
    }
  
    interface MidjourneyClient {
      (input: string, options?: MidjourneyOptions): Promise<MidjourneyResponse>;
    }
  
    const midjourney: MidjourneyClient;
  
    export default midjourney;
  }