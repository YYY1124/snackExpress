import { z } from 'zod'
import {PrivateProcedure, router} from './trpc'
import { TRPCError } from '@trpc/server'
import { getPayloadClient } from '../get-payload'
import { stripe } from '../lib/stripe'
import type Stripe from 'stripe'

export const paymentRouter = router({
    createSession: PrivateProcedure.input(z.object({productIds: z.array(z.string())}))
    .mutation(async({ctx,input})=>{
        const {user}=ctx
        let {productIds}=input
        if(productIds.length===0){
            throw new TRPCError({code:"BAD_REQUEST"})
            //if no id, then no user, then calling API unsccuessful
        }
        const payload=await getPayloadClient()

        const { docs:products }= await payload.find({
            //finding from product.ts
            collection:'products',
            where:{
                id:{
                    in:productIds,
                }
            }
        })

        const filteredProducts = products.filter((prod)=>Boolean(prod.priceId))

        const order = await payload.create({
            collection: 'orders',
            data:{
                isPaid:false,
                products:filteredProducts.map((prod)=>prod.id),
                user:user.id,
            }
        })
        
        const line_items:Stripe.Checkout.SessionCreateParams.LineItem[]=[]

        filteredProducts.forEach((product)=>{
            line_items.push({
                price: product.priceId!, //it must exist
                quantity:1,
            })
        })

        line_items.push({
            price:"price_1OwBqeBb1WilmgIJqSYMBMtw",
            //transaction fee (HKD:8)
            quantity:1,
            //one-time transaction fee
            adjustable_quantity:{
                enabled:false
            }
        })

        try {
            const stripeSession =
              await stripe.checkout.sessions.create({
                success_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/thank-you?orderId=${order.id}`,
                cancel_url: `${process.env.NEXT_PUBLIC_SERVER_URL}/cart`,
                payment_method_types: ['card','alipay'],
                mode: 'payment',
                metadata: {
                  userId: user.id,
                  orderId: order.id,
                },
                line_items,
              })
    
            return { url: stripeSession.url }
          }catch(err){
            console.log("err "+err)
            return {url:null}
        }
    })
})