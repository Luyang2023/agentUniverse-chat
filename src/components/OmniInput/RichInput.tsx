import React, { useEffect } from 'react';
import { Select } from 'antd';
import { Node as SlateNode } from 'slate';
import { replaceNodeChildren } from '@udecode/slate-utils';
import {
  usePlateEditor, Plate, PlateContent, createPlatePlugin, PlateElement,
  type PlateElementProps, findNodePath,
} from '@udecode/plate-common/react';
import { SoftBreakPlugin } from '@udecode/plate-break/react';
import useChatStore from '@/store/useChatStore';
import styles from './index.module.less';

const serialize = (nodes: SlateNode[]) => {
  return nodes.map((n: SlateNode) => SlateNode.string(n)).join('\n')
};

const InlinePlugin = createPlatePlugin({
  key: 'inline',
  node: { isElement: true, isInline: true },
});

const InlineElement = ({ children, ...props }: PlateElementProps) => {
  const text = props.element.children[0].text as string;
  const placeholder = props.element.placeholder as string || '';
  const isShowPlaceholder = !text?.length;
  return (
    <PlateElement
      {...props}
      as="span"
      className={styles.slateSpan}
    >
      <div className={styles.startPoint} style={{ minWidth: isShowPlaceholder ?  placeholder.length * 14 : 0 }}>
        { isShowPlaceholder && <div className={styles.placeholder}>{ placeholder }</div> }
      </div>
      { children }
    </PlateElement>
  );
};


const SelectPlugin = createPlatePlugin({
  key: 'select',
  node: {
    isElement: true,
    isInline: true,
    props: {
      contentEditable: false,
      style: {
        cursor: 'pointer',
      },
    },
  },
});

const SelectElement = ({ children, ...props }: PlateElementProps) => {
  const options = props.element.options as { label: string; value: string }[];
  const value = props.element.children[0].text as string;
  const path = findNodePath(props.editor, props.element);

  const handleChange = (value: string) => {
    replaceNodeChildren(props.editor, {
      at: path!,
      nodes: [{ text: value }],
    });
  };

  return (
    <PlateElement
      {...props}
      as="span"
      className={styles.slateSpan}
      style={{
        padding: '4px 0px 4px 4px',
      }}
      onClick={(...args) => {
        console.log('click', args);
      }}
    >
      <Select
        defaultValue={value}
        size="small"
        labelRender={({value}) => {
          return <span style={{ color: 'rgba(0, 87, 255, 100%)', fontWeight: 'bold' }}>{value}</span>;
        }}
        variant="borderless"
        onChange={handleChange}
        options={options.map((option) => ({ label: option.label, value: option.value }))}
      />
    </PlateElement>
  );
};


const editorConfig = {
  // TODO, value从外部推进来：设置prompt的raw跟content
  value: [],
  plugins: [
    InlinePlugin.withComponent(InlineElement),
    SelectPlugin.withComponent(SelectElement),
    // 配置软换行插件,只允许 shift+enter 换行
    SoftBreakPlugin.configure({
      options: {
        rules: [
          { hotkey: 'shift+enter' },
          { hotkey: 'cmd+enter' },
          { hotkey: 'alt+enter' },
        ],
      },
    }),
  ],
  override: {
    components: {
      [InlinePlugin.key]: InlineElement,
      [SelectPlugin.key]: SelectElement,
    },
  },
};

interface RichInputProps {
  placeholder?: string;
  onChange: (value: { content: string; raw: any }) => void;
  onEnter?: () => void;
}

const RichInput: React.FC<RichInputProps> = ({ placeholder, onChange, onEnter }) => {
  const editor = usePlateEditor(editorConfig);
  const chat = useChatStore(state => state.chat);

  useEffect(() => {
    chat.richInput = editor;
  }, [editor]);

  const handleChange = (raw: any) => {
    if (editor) {
      // @ts-expect-error: TypeScript does not recognize the editor's children type correctly
      onChange({content: serialize(editor.children!), raw});
    }
  };

  return (
    <Plate
      editor={editor}
      onChange={handleChange}
    >
      <PlateContent
        className={styles.textArea}
        placeholder={placeholder}
        onKeyDown={(event) => {
          if (event.key === 'Enter') {
            event.preventDefault();
            event.stopPropagation();
            onEnter?.();
          }
        }}
      />
    </Plate>
  );
};

export default RichInput;
