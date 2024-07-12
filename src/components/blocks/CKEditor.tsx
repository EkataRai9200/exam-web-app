import {
  ClassicEditor,
  Context,
  Bold,
  Essentials,
  Italic,
  Paragraph,
  ContextWatchdog,
} from "ckeditor5";
import { CKEditor, CKEditorContext } from "@ckeditor/ckeditor5-react";

interface CKEditorBlockProps {
  html: string;
}

function CKEditorBlock({ html }: CKEditorBlockProps) {
  return (
    <CKEditorContext context={Context} contextWatchdog={ContextWatchdog}>
      <CKEditor
        editor={ClassicEditor}
        config={{
          plugins: [Essentials, Bold, Italic, Paragraph],
          toolbar: ["undo", "redo", "|", "bold", "italic"],
        }}
        data={html}
        onReady={(editor) => {
          // You can store the "editor" and use when it is needed.
          console.log("Editor 1 is ready to use!", editor);
        }}
      />

      {/* <CKEditor
        editor={ClassicEditor}
        config={{
          plugins: [Essentials, Bold, Italic, Paragraph],
          toolbar: ["undo", "redo", "|", "bold", "italic"],
        }}
        data="<p>Hello from the second editor working with the context!</p>"
        onReady={(editor) => {
          // You can store the "editor" and use when it is needed.
          console.log("Editor 2 is ready to use!", editor);
        }}
      /> */}
    </CKEditorContext>
  );
}

export default CKEditorBlock;
