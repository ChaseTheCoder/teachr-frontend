import React, { useEffect, useRef, useState } from "react";
import { CKEditor } from "@ckeditor/ckeditor5-react";
import ClassicEditor from "@ckeditor/ckeditor5-build-classic";
import { Box } from "@mui/material";

interface CKeditorProps {
  onChange: (data: string) => void;
  value: string;
  placeholder?: string;
  setIsTextFieldFocused?: (focused: boolean) => void;
}

export default function CKeditor({
  onChange,
  value,
  placeholder,
  setIsTextFieldFocused
}: CKeditorProps) {
  const [editorLoaded, setEditorLoaded] = useState(false);
  const editorRef = useRef<{ CKEditor: typeof CKEditor; ClassicEditor: typeof ClassicEditor }>();

  useEffect(() => {
    editorRef.current = {
      CKEditor: require("@ckeditor/ckeditor5-react").CKEditor,
      ClassicEditor: require("@ckeditor/ckeditor5-build-classic"),
    };
    setEditorLoaded(true);
  }, []);

  return (
    <>
      {editorLoaded ? (
        <Box
          sx={{
            '& a': {
              color: 'blue',
              textDecoration: 'underline',
            }
          }}
        >
          <CKEditor
            editor={ClassicEditor}
            data={value}
            onChange={(event: any, editor: any) => {
              const data = editor.getData();
              onChange(data);
            }}
            onFocus={() => setIsTextFieldFocused && setIsTextFieldFocused(true)}
            config={{
              placeholder: placeholder ?? 'Body',
              toolbar: [
                "heading",
                "|",
                "bold",
                "italic",
                "link",
                "bulletedList",
                "numberedList",
                "blockQuote",
              ],
              link: {
                decorators: {
                  addTargetToExternalLinks: {
                    mode: 'automatic',
                    callback: url => /^(https?:)?\/\//.test(url),
                    attributes: {
                      target: '_blank',
                      rel: 'noopener noreferrer'
                    }
                  }
                }
              }
            }}
          />
        </Box>
      ) : (
        <div>Loading...</div>
      )}
    </>
  );
}