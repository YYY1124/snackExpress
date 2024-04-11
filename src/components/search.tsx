"use client"
import { useState } from "react";
import { buttonVariants } from "./ui/button";

const Search = () => {
  const [text, setText] = useState<string>("");

  const handleChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setText(event.target.value);
    
  };

  return (
    <div className="flex flex-col items-start">
      <p className='mt-6 text-lg max-w-prose text-muted-foreground'>Search for id: </p>
      <input
        className="mt-2 w-full max-w-prose rounded-md border-2 border-gray-300 px-4 py-2 text-lg focus:border-blue-500 focus:outline-none"
        type="text"
        value={text}
        onChange={handleChange}
      />
      <button 
        onClick={
            ()=>{
                if(text=="popcorn"){
                    setText("6617a45b4012ada2eb71934e")
                }
                if(text=="photo chips"){
                    setText("6617a52c4012ada2eb719401")
                }
                if(text=="m&m"){
                    setText("6617a5db4012ada2eb7194c3")
                }
                if(text=="chocolate"){
                    setText("6617a5a44012ada2eb719473")
                }
            }
        }
    >
        <a 
            href={`/product/${text}`}
            className={buttonVariants()}
        >Search</a>

      </button>

    </div>
  );
};

export default Search;