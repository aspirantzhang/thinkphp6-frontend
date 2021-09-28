import React from 'react';
import { Editor } from '@tinymce/tinymce-react';
import { getLocale } from 'umi';

const TinyMCE = ({ value, onChange }: { value: string; onChange: (...params: any) => void }) => {
  const currentLang = (getLocale() as string).replace('-', '_');
  const needI18n = !(currentLang === 'en_US');
  const onEditorChange = (editorContent: string) => {
    onChange(editorContent);
  };
  return (
    <>
      <Editor
        value={value}
        tinymceScriptSrc="https://cdn.jsdelivr.net/npm/tinymce@5.9.2/tinymce.min.js"
        onEditorChange={onEditorChange}
        init={{
          branding: false,
          language: needI18n ? currentLang : undefined,
          language_url: needI18n
            ? `https://cdn.jsdelivr.net/npm/tinymce-i18n@20.12.25/langs5/${currentLang}.js`
            : undefined,
        }}
      />
    </>
  );
};

export default TinyMCE;
