"use client"

import { getPayloadClient } from "@/get-payload";
import { Product } from "@/payload-types";
import { trpc } from "@/trpc/client";
import { error } from "console";
import { useRouter } from "next/router";
import { useEffect, useState } from "react"
import { toast } from "sonner";
import { z } from "zod";

const CommentHandler=({product}:{product:Product})=>{
  const [text,setText]=useState<string>("")

  //use API to add comment to a product

  
  // const { mutate: createSession } = trpc.comment.createSession.useMutation(
  //   {
  //     onSuccess:()=>{
  //       toast.success(`Comment Successfully`)
  //     },
  //     onError:(err)=>{
  //       if(err.data?.code==='UNAUTHORIZED'){
  //           toast.error('please login before comment')
  //       }
  //      }
  //   }
  // );

  const [comments,setComments]=useState(product.comments)
  
  const SubmitCommentHandler = () => {
    // try {
    //   createSession({
    //     productId: product.id,
    //     text: text,
    //     }
    //   )
    //   event?.preventDefault()
    // } catch (error) {
    //   // Handle error
    //   console.log(error);
    // }
    comments?.push(text)
    event?.preventDefault()
    setText("")
  }
  
  const ChangeHandler = (event:any) => {
    setText(event.target.value)
  };
  
  return (
    <section className="w-full rounded-lg border-2 border-blue-600 p-4 my-8 mx-auto">
      <h3 className="font-os text-lg font-bold">Comments of this product</h3>
      <div className="ml-3">
        {comments?.map((comment,id)=>
        <>
          <div className="mt-2 font-medium text-blue-800">Hiddened Name</div>
          {/* <div className="text-gray-600">Posted on 2023-10-02 14:30</div> */}
          <p className="text-gray-900">
            {comment}
          </p>
          </>)
        ||
          <p className="mt-2 font-medium text-black-800"> be the first one to comment!</p>
        }
      </div>
      {/* leaving comment */}
      <form 
    className="mt-4"
    onSubmit={SubmitCommentHandler}  
  >
    <div className="mb-4">
        <label className="block text-blue-800 font-medium">leave a comment below</label>
        <textarea 
          className="border-2 border-blue-600 p-2 w-full rounded"
          onChange={ChangeHandler}
          value={text}  
        >
        </textarea>
    </div>
    <button 
      className="bg-blue-700 text-white font-medium py-2 px-4 rounded hover:bg-blue-600"
      onClick={SubmitCommentHandler}
    >
      Post Comment
    </button>
    </form> 
  </section>
  )
}

export default CommentHandler