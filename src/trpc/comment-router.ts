import { z } from 'zod';
import { PrivateProcedure, router } from './trpc';
import { TRPCError } from '@trpc/server';
import { getPayloadClient } from '../get-payload';
import { stripe } from '../lib/stripe';
import type Stripe from 'stripe';
import { Product } from '@/payload-types';

export const commentRouter = router({
  createSession: PrivateProcedure.input(
    z.object({
      productId: z.string(),
      text: z.string(),
    })
  ).mutation(async ({ ctx, input }) => {
    const { user } = ctx;
    const { productId, text } = input;

    if (productId.length === 0) {
      throw new TRPCError({ code: 'BAD_REQUEST' });
      // If no id, then no user, then calling API unsuccessful
    }

    const payload = await getPayloadClient();

    const product = await payload.find({
      collection: 'products',
      where: {
        id: { in: [productId]}, // Wrap productId in an array
      },
    });
    
    if (!product) {
      throw new TRPCError({ code: 'NOT_FOUND', message: 'Product not found' });
    }

    const updatedProduct = await payload.update({
      collection: 'products',
      where: { id: { in: [productId] } }, // Wrap productId in an array
      data: {
        comments: [text],
      },
    });

    console.log(updatedProduct);
    return updatedProduct;
  }),
});