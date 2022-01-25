import React, { useState } from 'react';
import { Spin } from 'antd';
import { Editor } from '@tinymce/tinymce-react';
import { getLocale } from 'umi';

export type TinyMCEType = {
  value: string;
  onChange: (...params: any) => void;
  layout: string;
  branding: boolean;
  editorConfig: Record<string, any>;
  initConfig: Record<string, any>;
};

const TinyMCEEditor = ({
  value,
  onChange,
  layout = 'normal',
  branding = true,
  editorConfig = {},
  initConfig = {},
}: TinyMCEType) => {
  const [loading, setLoading] = useState(true);
  const currentLang = (getLocale() as string).replace('-', '_');
  const needI18n = !(currentLang === 'en_US');
  const onEditorChange = (editorContent: string) => {
    onChange(editorContent);
  };
  const layoutType = {
    full: {
      menubar: 'file edit view insert format tools table help',
      plugins:
        'print preview paste importcss searchreplace autolink autosave save directionality code visualblocks visualchars fullscreen image link media template codesample table charmap hr pagebreak nonbreaking anchor toc insertdatetime advlist lists wordcount imagetools textpattern noneditable help charmap quickbars emoticons',
      toolbar:
        'undo redo | bold italic underline strikethrough | fontselect fontsizeselect formatselect | alignleft aligncenter alignright alignjustify | outdent indent |  numlist bullist | forecolor backcolor removeformat | pagebreak | charmap emoticons | fullscreen  preview save print | insertfile image media template link anchor codesample | ltr rtl',
      image_advtab: true,
    },
    normal: {
      menubar: false,
      plugins: 'link image code',
      toolbar:
        'undo redo | styleselect | forecolor | bold italic | alignleft aligncenter alignright alignjustify | outdent indent | link image | code',
    },
  };

  return (
    <>
      <Spin tip="Loading..." spinning={loading}>
        <Editor
          value={value}
          tinymceScriptSrc="https://cdn.jsdelivr.net/npm/tinymce@5.9.2/tinymce.min.js"
          onEditorChange={onEditorChange}
          init={{
            height: 250,
            branding: false,
            language: needI18n ? currentLang : undefined,
            language_url: needI18n
              ? `https://cdn.jsdelivr.net/npm/tinymce-i18n@20.12.25/langs5/${currentLang}.js`
              : undefined,
            ...layoutType[layout],
            ...initConfig,
          }}
          onInit={() => {
            setLoading(false);
          }}
          {...editorConfig}
        />
        {branding && (
          <div style={{ color: 'rgba(0, 0, 0, 0.45)', textAlign: 'right', fontSize: '12px' }}>
            {currentLang === 'zh_CN'
              ? '使用优秀的开源编辑器:'
              : 'Powered by the excellent open source editor:'}{' '}
            <a
              href="https://www.tiny.cloud/"
              rel="noopener noreferrer"
              target="_blank"
              style={{ color: 'rgba(0, 0, 0, 0.45)' }}
            >
              TinyMCE
            </a>
          </div>
        )}
      </Spin>
    </>
  );
};

export default TinyMCEEditor;
