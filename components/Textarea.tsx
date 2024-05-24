import { useEffect } from "react";
import React from 'react';

export default function Textarea(
  {
    value,
    onChange,
    header,
    semibold
  }:
  {
    value: string;
    onChange: any;
    header?: boolean;
    semibold?: boolean;
  }
) {
  const headerText = header ? 'text-2xl font-bold ' : '';
  const semiboldText = semibold ? 'font-semibold ' : '';

  return (
    <textarea 
      className={`${headerText} px-1 border-bottom-2 border-border rounded-none w-full ${semiboldText}`}
      name='title'
      rows={1}
      onChange={onChange}
      value={value}
    />
  )
}