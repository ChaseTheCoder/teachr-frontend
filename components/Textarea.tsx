import { useEffect } from "react";
import React from 'react';

export default function Textarea({children}) {
  // Updates the height of a <textarea> when the value changes.
  const useAutosizeTextArea = (
    textAreaRef: HTMLTextAreaElement | null,
    value: string
  ) => {
    useEffect(() => {
      if (textAreaRef) {
        // We need to reset the height momentarily to get the correct scrollHeight for the textarea
        textAreaRef.style.height = "0px";
        const scrollHeight = textAreaRef.scrollHeight;
  
        // We then set the height directly, outside of the render loop
        // Trying to set this with state or a ref will product an incorrect value.
        textAreaRef.style.height = scrollHeight + "px";
      }
    }, [textAreaRef, value]);
  };
  
  return (
    <textarea
    className='h-fit bg-surface text-2xl font-bold text-primary placeholder-primary resize-none w-full' 
    onChange={handleChange}
    ref={textAreaRef}
    rows={1}
    wrap="soft"
    value={value}
  />
  )
}