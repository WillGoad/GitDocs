import React, { useCallback, useMemo, ReactNode } from 'react'
import isHotkey from 'is-hotkey'
import { Editable, withReact, useSlate, Slate } from 'slate-react'
import {
  Editor,
  Transforms,
  createEditor,
  Element as SlateElement,
  BaseEditor,
  Node,
  Descendant
} from 'slate'
import { withHistory } from 'slate-history'
import { Code, FormatAlignCenter, FormatAlignJustify, FormatAlignLeft, FormatAlignRight, FormatBold, FormatItalic, FormatListBulleted, FormatListNumbered, FormatQuote, FormatUnderlined, LooksOne, LooksTwo } from '@mui/icons-material';

import { Button, Icon, Toolbar } from './components';
import { MarginContainer } from './richtext.styled';
import { BaseText } from 'slate'

const HOTKEYS: { [index: string]: string } = {
  'mod+b': 'bold',
  'mod+i': 'italic',
  'mod+u': 'underline',
  'mod+`': 'code',
}

const LIST_TYPES = ['numbered-list', 'bulleted-list']
const TEXT_ALIGN_TYPES = ['left', 'center', 'right', 'justify']

const RichTextCanvas = () => {
  const renderElement = useCallback((props: any) => <Element {...props} />, [])
  const renderLeaf = useCallback((props: any) => <Leaf {...props} />, [])
  const editor = useMemo(() => withHistory(withReact(createEditor())), [])

  return (
    <Slate editor={editor} value={initialValue}>
      <Toolbar>
        <MarkButton format="bold" icon={<FormatBold />} />
        <MarkButton format="italic" icon={<FormatItalic />} />
        <MarkButton format="underline" icon={<FormatUnderlined />} />
        <MarkButton format="code" icon={<Code />} />
        <BlockButton format="heading-one" icon={<LooksOne />} />
        <BlockButton format="heading-two" icon={<LooksTwo />} />
        <BlockButton format="block-quote" icon={<FormatQuote />} />
        <BlockButton format="numbered-list" icon={<FormatListNumbered />} />
        <BlockButton format="bulleted-list" icon={<FormatListBulleted />} />
        <BlockButton format="left" icon={<FormatAlignLeft />} />
        <BlockButton format="center" icon={<FormatAlignCenter />} />
        <BlockButton format="right" icon={<FormatAlignRight />} />
        <BlockButton format="justify" icon={<FormatAlignJustify />} />
      </Toolbar>
      <MarginContainer>
        <Editable
          renderElement={renderElement}
          renderLeaf={renderLeaf}
          placeholder="Enter some rich text…"
          spellCheck
          autoFocus
          onKeyDown={event => {
            for (const hotkey in HOTKEYS) {
              if (isHotkey(hotkey, event)) {
                event.preventDefault()
                const mark: any = HOTKEYS[hotkey]
                toggleMark(editor, mark)
              }
            }
          }}
        />
      </MarginContainer>
    </Slate>
  )
}

const toggleBlock = (editor: BaseEditor, format: string) => {
  //Booleans
  const isList: boolean = LIST_TYPES.includes(format);
  const isAlignment: boolean = TEXT_ALIGN_TYPES.includes(format);


  const isActive = isBlockActive(
    editor,
    format,
    isAlignment ? 'align' : 'type'
  );

  Transforms.unwrapNodes(editor, {
    match: n =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      !isAlignment,
    split: true,
  });
  let newProperties: Partial<{ type: string | undefined; align: string | undefined }> = {};
  if (isAlignment) {
    newProperties = {
      align: isActive ? undefined : format,
    };
  } else {
    newProperties = {
      type: isActive ? 'paragraph' : isList ? 'list-item' : format,
    };
  }
  Transforms.setNodes(editor, newProperties as Partial<Node>);

  if (!isActive && isList) {
    const block = { type: format, children: [] };
    Transforms.wrapNodes(editor, block);
  }
}

const toggleMark = (editor: BaseEditor, format: string) => {
  const isActive = isMarkActive(editor, format);

  if (isActive) {
    Editor.removeMark(editor, format);
  } else {
    Editor.addMark(editor, format, true);
  }
}

const isBlockActive = (editor: BaseEditor, format: string, blockType: string = 'type') => {
  const { selection } = editor;
  if (!selection) return false;

  const [match] = Array.from(
    Editor.nodes(editor, {
      at: Editor.unhangRange(editor, selection),
      match: (n) =>
        !Editor.isEditor(n) &&
        SlateElement.isElement(n) &&
        n[blockType as keyof Descendant] === format,
    })
  )

  return !!match
}

const isMarkActive = (editor: BaseEditor, format: string) => {
  const formatKey = format as keyof Omit<BaseText, "text">
  const marks = Editor.marks(editor)
  return marks ? marks[formatKey] === true : false
}

const Element = ({ attributes, children, element }: { attributes: any, children: ReactNode, element: any }) => {
  const style = { textAlign: element.align }
  switch (element.type) {
    case 'block-quote':
      return (
        <blockquote style={style} {...attributes}>
          {children}
        </blockquote>
      )
    case 'bulleted-list':
      return (
        <ul style={style} {...attributes}>
          {children}
        </ul>
      )
    case 'heading-one':
      return (
        <h1 style={style} {...attributes}>
          {children}
        </h1>
      )
    case 'heading-two':
      return (
        <h2 style={style} {...attributes}>
          {children}
        </h2>
      )
    case 'list-item':
      return (
        <li style={style} {...attributes}>
          {children}
        </li>
      )
    case 'numbered-list':
      return (
        <ol style={style} {...attributes}>
          {children}
        </ol>
      )
    default:
      return (
        <p style={style} {...attributes}>
          {children}
        </p>
      )
  }
}

const Leaf = ({ attributes, children, leaf }: { attributes: any, children: ReactNode, leaf: any }) => {
  if (leaf.bold) {
    children = <strong>{children}</strong>
  }

  if (leaf.code) {
    children = <code>{children}</code>
  }

  if (leaf.italic) {
    children = <em>{children}</em>
  }

  if (leaf.underline) {
    children = <u>{children}</u>
  }

  return <span {...attributes}>{children}</span>
}

const BlockButton = ({ format, icon }: { format: any, icon: React.ReactNode }) => {
  const editor = useSlate()
  return (
    <Button
      active={isBlockActive(
        editor,
        format,
        TEXT_ALIGN_TYPES.includes(format) ? 'align' : 'type'
      )}
      onMouseDown={(event: any) => {
        console.log("Clicked");
        event.preventDefault();
        toggleBlock(editor, format);
      }}
    >
      <Icon>{icon}</Icon>
    </Button>
  )
}

const MarkButton = ({ format, icon }: { format: any, icon: React.ReactNode}) => {
  const editor = useSlate()
  return (
    <Button
      active={isMarkActive(editor, format)}
      onMouseDown={(event: any) => {
        console.log("Clicked")
        event.preventDefault()
        toggleMark(editor, format)
      }}
    >
      <Icon>{icon}</Icon>
    </Button>
  )
}

const initialValue = [
  {
    type: 'paragraph',
    children: [
      { text: 'This is editable ' },
      { text: 'rich', bold: true },
      { text: ' text, ' },
      { text: 'much', italic: true },
      { text: ' better than a ' },
      { text: '<textarea>', code: true },
      { text: '!' },
    ],
  },
  {
    type: 'paragraph',
    children: [
      {
        text:
          "Since it's rich text, you can do things like turn a selection of text ",
      },
      { text: 'bold', bold: true },
      {
        text:
          ', or add a semantically rendered block quote in the middle of the page, like this:',
      },
    ],
  },
  {
    type: 'block-quote',
    children: [{ text: 'A wise quote.' }],
  },
  {
    type: 'paragraph',
    align: 'center',
    children: [{ text: 'Try it out for yourself!' }],
  },
  {
    type: 'check-list-item',
    checked: false,
    children: [{ text: 'Host it - DONE!' }],
  },
  {
    type: 'check-list-item',
    checked: false,
    children: [{ text: 'Convert some files to Typescript - DONE!' }],
  },
  {
    type: 'check-list-item',
    checked: false,
    children: [{ text: 'More UX for accounts and saving' }],
  },
  {
    type: 'check-list-item',
    checked: false,
    children: [{ text: 'Add Github login' }],
  },
  {
    type: 'check-list-item',
    checked: false,
    children: [{ text: 'Workout how to store rich test' }],
  },
  {
    type: 'check-list-item',
    checked: false,
    children: [{ text: 'Commit to Github' }],
  },
  {
    type: 'check-list-item',
    checked: false,
    children: [{ text: 'Get autosave working' }],
  },
  {
    type: 'check-list-item',
    checked: false,
    children: [{ text: 'Export to other file types' }],
  },
]

export default RichTextCanvas