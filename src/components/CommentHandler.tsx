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

  // const result = trpc.comment.createSession.useMutation({
  //   productId:product.id,
  //   text:text
  //   }
  // )
  const { mutate: createSession } = trpc.comment.createSession.useMutation();


  
  const SubmitCommentHandler = () => {
    try {
      createSession({
        productId: product.id,
        text: text,
      })
      event?.preventDefault();
    } catch (error) {
      // Handle error
      console.log(error);
    }
  }
  
  const ChangeHandler = (event:any) => {
    setText(event.target.value)
  };
  
  
  return (
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
  </form> )
}

export default CommentHandler