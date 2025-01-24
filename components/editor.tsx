import dynamic from 'next/dynamic';
import 'react-quill/dist/quill.snow.css';
import { EditorProps } from '../types/types';
const ReactQuill = dynamic(() => import('react-quill'), { ssr: false });

export default function Editor({
  onChange,
  value,
  placeholder,
  setIsTextFieldFocused
}: EditorProps) {
  return (
    <div>
      <ReactQuill
        theme='snow'
        value={value}
        onChange={onChange}
        placeholder={ placeholder ?? 'Body' }
        onFocus={() => setIsTextFieldFocused && setIsTextFieldFocused(true)}
        onBlur={() => setIsTextFieldFocused && setIsTextFieldFocused(false)}
      />
    </div>
  );
}