import { getServerSiderUser } from "@/lib/payload.utils"
import Image from "next/image"
import {cookies} from "next/headers"
import payload from "payload"
import { getPayloadClient } from "@/get-payload"
import { notFound, redirect } from "next/navigation"
import { Product, ProductFile } from "@/payload-types"
import { PRODUCT_CATEGORIES } from "@/config"
import { formatPrice } from "@/lib/utils"
import Link from "next/link"
interface PageProps{
    searchParams:{
        [key: string]: string | string[] | undefined
    }
}

const ThankYouPage= async({ searchParams }: PageProps )=>{

    const orderId=searchParams.orderId
    const nextCookies = cookies()
    //get the cookies as return value
    const {user}=await getServerSiderUser(nextCookies)

    const payload= await getPayloadClient()
    const {docs:orders}=await payload.find({
        collection:"orders",
        depth: 2,
        //give actual user instead of id
        where:{
            id:{
                equals:orderId
            }
        }
    })
    const [order]=orders
    if(!order)return notFound()

    const orderUserId=typeof order.user==="string"
        ? order.user 
        : order.user.id
    //check whether it is login or not
    if(orderUserId!==user?.id){
        return redirect(`/sign-in?origin=thank-you?orderId=${order.id}`)
        //if not login in nav to login page and after loggin in nav back to thank you page
    }

    const products=order.products as Product[]

    const orderTotal = products.reduce((total,product)=>{
        return total+product.price    
    },0)
    //calculating the total price
    return (
        <>
    <main className="relative lg:main-h-full">
        <div className='hidden md:block h-80 overflow-hidden lg:absolute lg:h-full lg:w-1/2 lg:pr-4 xl:pr-12'>
                <Image
                fill
                src='/thank-you-template-design-3a33061c40e083afd98bf66e93ab5043_screen.jpeg'
                className="h-full w-full object-cover object-center"
                alt="thank you for your order"
                />
        </div>

        <div className='mx-auto max-w-2xl px-4 py-16 sm:px-6 sm:py-24 lg:grid lg:max-w-7xl lg:grid-cols-2 lg:gap-x-8 lg:px-8 lg:py-32 xl:gap-x-24'>
            <div className='lg:col-start-2'>
                <p className='text-sm font-medium text-blue-600'>Order successful</p>
                <h1 className='mt-2 text-4xl font-bold tracking-tight text-gray-900 sm:text-5xl'>Thanks for ordering</h1>
                {order.isPaid ?(
                    <p className='mt-2 text-base text-muted-foreground'>
                        Your order was processed and your assets are available to download below. We have sent your receipt and order details to{" "} 
                        {typeof order.user !== 'string'?
                            <span className="font-medium text-gray-900">{order.user.email}</span>
                            :null}
                    </p>):(
                    <p>
                        Thank you for your order and we are currectly processing it. Please be hang tight and we will send you comfirmation very soon!
                    </p>)
                } 
                <div className='mt-16 text-sm font-medium'>
                    <div className='text-muted-foreground'>Order no.</div>
                    <div className="mt-2 text-gray-900">{order.id}</div>
                </div>

                <ul className='mt-6 dividle-y divide-gray-200 border-t border-gray-200 text-sm font-mdeium text-muted-foreground'>
                    {(order.products as Product[]).map((product)=>{
                            const label=PRODUCT_CATEGORIES.find(({value})=>value===product.category)?.label

                            const downloadUrl=(product.product_files as ProductFile).url as string

                            const {image}=product.images[0]

                            return <li key={product.id} className="flex s[ace-x-6 py-6">
                                <div className="relative h-24 w-24">
                                    {typeof image!=="string" && image.url ?(
                                        <Image 
                                            src={image.url}
                                            alt={`${product.name} image`}
                                            className="flex-none rounded-md bg-gray-100 object-cover object-center"
                                            fill/>
                                    ):null}
                                </div>
                                <div className='flex-auto flex flex-col justify-between'>
                                    <div className='space-y-1'>
                                        <h3 className='text-gray-900'>
                                            {product.name}
                                        </h3>

                                        <p className='my-1'>
                                            Category:{label}
                                        </p>
                                    </div>

                                    {order.isPaid ?(
                                        <a
                                            href={downloadUrl}
                                            download={product.name}
                                            className='text-blue-600 hover:underline underline-offset-2'
                                        >
                                        Download asset    
                                        </a>
                                    ):null}
                                </div>

                                <p className='flex-none font-medium text-gray-900'>
                                    {formatPrice(product.price)}
                                </p>
                            </li>
                        }
                    )}
                </ul>

                <div className='space-y-6 border-t border-gray-200 pt-6 text-sm font-medium text-muted-foreground'>
                        <div className='flex justify-between'>
                            <p>Subtotal</p>
                            <p>{formatPrice(orderTotal)}</p>
                        </div>
                        <div className='flex justify-between'>
                            <p>Transaction Fee</p>
                            <p>{formatPrice(1)}</p>
                        </div>

                        <div className='flex items-center justify-between border-t border-gray-200 pt-6 text-gray-900'>
                            <p className='text-base'>Total</p>
                            <p className='text-base'>{formatPrice(orderTotal+1)}</p>
                        </div>
                </div>
                <div className='mt-16 border-t border-gray-200 py-6 text-right'>
                        <Link href='/products' className='text-sm font-medium text-blue-600 hover:text-blue-400'>
                            Continue shopping!
                        </Link>
                </div>
            </div>
        </div>  
    </main>
    </>
    )
}

export default ThankYouPage