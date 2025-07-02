import React, { useRef } from 'react';
import { Editor } from '@tinymce/tinymce-react';

interface TinyMCEEditorProps {
  content: string;
  onChange: (content: string) => void;
  placeholder?: string;
}

const TinyMCEEditor: React.FC<TinyMCEEditorProps> = ({ 
  content, 
  onChange, 
  placeholder = "Start writing your story..." 
}) => {
  const editorRef = useRef<any>(null);

  const handleEditorChange = (content: string) => {
    onChange(content);
  };

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden bg-white">
      <Editor
        apiKey="ppg3hux1sav0yd6e38fbu4jm1i3edtzutvjc6zus54s57xp1"
        onInit={(evt, editor) => editorRef.current = editor}
        value={content}
        onEditorChange={handleEditorChange}
        init={{
          height: 400,
          menubar: false,
          plugins: [
            'anchor', 'autolink', 'charmap', 'codesample', 'emoticons', 'image', 'link', 'lists', 'media', 'searchreplace', 'table', 'visualblocks', 'wordcount',
            'checklist', 'mediaembed', 'casechange', 'formatpainter', 'pageembed', 'a11ychecker', 'tinymcespellchecker', 'permanentpen', 'powerpaste', 'advtable', 'advcode', 'editimage', 'advtemplate', 'ai', 'mentions', 'tinycomments', 'tableofcontents', 'footnotes', 'mergetags', 'autocorrect', 'typography', 'inlinecss', 'markdown','importword', 'exportword', 'exportpdf'
          ],
          toolbar: 'undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | spellcheckdialog a11ycheck typography | align lineheight | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
          content_style: `
            body { 
              font-family: Georgia, serif; 
              font-size: 18px; 
              color: #000000; 
              line-height: 1.6; 
              font-weight: normal; 
              font-style: normal; 
            }
            p { 
              margin: 0 0 1.5em 0; 
              font-family: Georgia, serif; 
              font-size: 18px; 
              color: #000000; 
              line-height: 1.6; 
              font-weight: normal; 
              font-style: normal; 
            }
            h1, h2, h3, h4, h5, h6 { 
              font-family: Georgia, serif; 
              color: #000000; 
              line-height: 1.6; 
            }
          `,
          placeholder: placeholder,
          branding: false,
          skin: 'oxide',
          content_css: false,
          forced_root_block: 'p',
          force_br_newlines: false,
          force_p_newlines: true,
          remove_trailing_brs: true,
          convert_urls: false,
          cleanup: true,
          cleanup_on_startup: true,
          trim_span_elements: true,
          verify_html: true,
          tinycomments_mode: 'embedded',
          tinycomments_author: 'Grandpa John',
          mergetags_list: [
            { value: 'Story.Title', title: 'Story Title' },
            { value: 'Story.Author', title: 'Story Author' },
          ],
          ai_request: (request, respondWith) => respondWith.string(() => Promise.reject('AI Assistant not configured')),
          formats: {
            alignleft: { selector: 'p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,img', styles: { textAlign: 'left' } },
            aligncenter: { selector: 'p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,img', styles: { textAlign: 'center' } },
            alignright: { selector: 'p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,img', styles: { textAlign: 'right' } },
            alignjustify: { selector: 'p,h1,h2,h3,h4,h5,h6,td,th,div,ul,ol,li,table,img', styles: { textAlign: 'justify' } }
          },
          invalid_elements: 'font,span[style],div[style]',
          extended_valid_elements: 'p[style|align],strong,em,u,h1,h2,h3,ul,ol,li,br'
        }}
      />
    </div>
  );
};

export default TinyMCEEditor;