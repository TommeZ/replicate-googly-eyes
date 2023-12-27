// https://nextjs.org/docs/app/building-your-application/routing/route-handlers
// https://www.youtube.com/watch?v=vrR4MlB7nBI&list=WL&index=14&t=494s
import { NextRequest } from "next/server"
import Replicate from "replicate";

// https://replicate.com/timothybrooks/instruct-pix2pix/examples?input=nodejs
const replicate = new Replicate({
    auth: process.env.REPLICATE_API_TOKEN,
});

// for debugging
export async function GET(request: Request) {
    return new Response('hi')
}

export async function POST(req: Request) {
    const body = await req.json()
    const ogImage = body.image

    const res = await replicate.run(
        "timothybrooks/instruct-pix2pix:30c1d0b916a6f8efce20493f5d61ee27491ab2a60437c13c588468b9810ec23f",
        {
            input: {
                image: ogImage,
                prompt: "Replace all eyes with googly eyes",
                scheduler: "K_EULER_ANCESTRAL",
                num_outputs: 1,
                guidance_scale: 7.5,
                num_inference_steps: 100,
                image_guidance_scale: 1.5
            }
        }
    );

    // for debugging
    // console.log(res);

    return Response.json(res)
}