// @refresh reset
import { createEditor, Editor, Transforms, Text } from "slate";

// Import slate components and react plugin
import { Slate, Editable, withReact } from "slate-react";

import { useState, useMemo, useCallback, useEffect } from "react";
import { withHistory } from "slate-history";
import { withShortcuts, MarkdownElement } from "./markdown";

const CustomEditor = {
  isBoldMarkActive(editor) {
    const [match] = Editor.nodes(editor, {
      match: (n) => n.bold === true,
      universal: true,
    });
    return !!match;
  },

  isCodeBlockActive(editor) {
    const [match] = Editor.nodes(editor, {
      match: (n) => n.type === "code",
    });
    return !!match;
  },

  toggleBoldMark(editor) {
    const isActive = CustomEditor.isBoldMarkActive(editor);
    Transforms.setNodes(
      editor,
      {
        bold: isActive ? null : true,
      },
      { match: (n) => Text.isText(n), split: true }
    );
  },

  toggleCodeBlock(editor) {
    const isActive = CustomEditor.isCodeBlockActive(editor);
    Transforms.setNodes(
      editor,
      {
        type: isActive ? null : "code",
      },
      { match: (n) => Editor.isBlock(editor, n) }
    );
  },
};

export default function Home(props) {
  // Create a slate editor that won't change across renders.
  const editor = useMemo(
    () => withShortcuts(withReact(withHistory(createEditor()))),
    []
  );
  const [value, setValue] = useState([
    {
      type: "paragraph",
      children: [{ text: "A line of text in a pdaragraph!" }],
    },
  ]);

  useEffect(() => {
    setValue(
      JSON.parse(localStorage.getItem("content")) || [
        {
          type: "paragraph",
          children: [{ text: "A line of text in a paragraph!" }],
        },
      ]
    );
  }, []);

  // custom elements!
  const renderElement = useCallback(
    (props) => <MarkdownElement {...props} />,
    []
  );

  const renderLeaf = useCallback((props) => {
    return <Leaf {...props} />;
  }, []);

  const saveChanges = (value) => {
    setValue(value);

    // save value to Local Storage
    const content = JSON.stringify(value);
    localStorage.setItem("content", content);
  };

  return (
    <Slate editor={editor} value={value} onChange={saveChanges}>
      {/* <button onClick={(e) => Editor.deleteBackward(editor, { unit: "word" })}>
        click me!
      </button> */}
      <Editable
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        className={props.className}
        onKeyDown={(event) => {
          console.log(event.key);

          if (event.key == "Tab") {
            event.preventDefault();
            Editor.insertText(editor, "	");
          }
          
          // if (event.key === "x") {
          //   event.preventDefault();

          //   // Editor.insertBreak(editor);

          //   // // Insert new text to replace the text in a node at a specific path.
          //   Transforms.insertText(editor, "A new string of text.", {
          //     at: editor.selection,
          //   });
          // }

          if (event.key === "&") {
            event.preventDefault();
            editor.insertText("and ");
          }

          if (!event.metaKey) return;

          switch (event.key) {
            // When ` is pressed, code blocks!
            case "`": {
              event.preventDefault();
              CustomEditor.toggleCodeBlock(editor);
              break;
            }

            // Ctrl-B bolds the text
            case "b": {
              event.preventDefault();
              CustomEditor.toggleBoldMark(editor);
              break;
            }
          }
        }}
      />
    </Slate>
  );
}

const CodeElement = (props) => {
  return (
    <pre {...props.attributes}>
      <code>{props.children}</code>
    </pre>
  );
};

const DefaultElement = (props) => {
  return <p {...props.attributes}>{props.children}</p>;
};

const Leaf = (props) => {
  return (
    <span
      {...props.attributes}
      style={{ fontWeight: props.leaf.bold ? "bold" : "normal" }}
    >
      {props.children}
    </span>
  );
};
