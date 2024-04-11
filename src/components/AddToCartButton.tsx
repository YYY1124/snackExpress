"use client"

import { useEffect, useState } from "react"
import { Button } from "./ui/button"
import { UseCart } from "@/hooks/use-cart"
import { Product } from "@/payload-types"
import { toast } from "sonner"

const AddToCartButton =({product}:{product:Product})=>{
    const { addItem } = UseCart()
    const [isSuccess, setIsSuccess]=useState<boolean>(false)

    useEffect(()=>{
        const timeout=setTimeout(()=>{
            setIsSuccess(false)
        },2000)
        return ()=>clearTimeout(timeout)
    },[])
    //record timeout of the button

    function onClickhandler(){
        if(product.stocks>0){
            if(!isSuccess){
                setIsSuccess(true)
                addItem(product)}
        }else{
            toast.error("It is out of stock!")
        }
    }

    return (
    <Button 
        size='lg' 
        className='w-full'
        onClick={onClickhandler
        }    
    >
    {isSuccess ? "Added!" : "Add to cart"}
    </Button>
)}
export default AddToCartButton 