import { AuthCredentialsValidator } from "../lib/validators/account-credentials-validators";
import { publicProcedure, router } from "./trpc";
import { getPayloadClient } from "../get-payload";
import { TRPCError } from "@trpc/server";
import { z } from 'zod';

export const authRouter = router({
    createPayloadUser: publicProcedure
    .input(AuthCredentialsValidator)
    .mutation(async ({input})=>{
        const {email, password}=input
        const payload = await getPayloadClient()

        //check if the user exist or not
        const {docs:users}=await payload.find({
            collection:'users',
            where:{
                email:{
                    equals: email,
                },
            },

        })
        if(users.length!==0)throw new TRPCError({code:'CONFLICT'})

        await payload.create({
            collection:'users',
            data:{
                email,
                password,
                role:'user'
            },
        })

        return {success:true, sentToEmail:email}
    }),

    VerifyEmail: publicProcedure
    .input(z.object({token: z.string()}))
    //not using mutation since it is not changing the data, can use query as passing the data
    .query(async({input})=>{
        const {token} = input

        const payload= await getPayloadClient()
        
        const isVerified = await payload.verifyEmail({
            collection:"users",
            token
        })

        if(!isVerified) throw new TRPCError({code:'UNAUTHORIZED'})

        return {success:true}
    }),
    signIn: publicProcedure
        .input(AuthCredentialsValidator)
        .mutation(
            // mutation can get access to the data input
            async ({input,ctx})=>{
                //ctx is the respone for the token of the server(server.ts)
            const {email, password}=input
            const {res}=ctx
            const payload= await getPayloadClient()
            //payload is the cms and access payload here
                try{
                    //login function
                    await payload.login({
                        collection:"users",
                        data:{
                            email,
                            password
                        },
                        //passing in data from fontend
                        res
                    })

                    return{success:true}
                }catch(err){
                    throw new TRPCError({code:'UNAUTHORIZED'})
                }
        })
})