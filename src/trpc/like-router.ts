import { z } from "zod";
import { PrivateProcedure, router } from "./trpc";
import { getPayloadClient } from "@/get-payload";
import { TRPCError } from "@trpc/server";

export const LikeRouter=router({
    createSession: PrivateProcedure.input(
        z.object({
            productId: z.string(),
            userId: z.string()
        })
    ).mutation(async({ctx,input})=>{
        const {user}=ctx;
        const {productId}=input

        const payload=await getPayloadClient()
        const product=await payload.find({
            collection:'products',
            where:{
                id:{in:productId}
            }
        })
        if (!product) {
            throw new TRPCError({ code: 'NOT_FOUND', message: 'Product not found' });
          }
    }
)})