// @refresh reset
import Head from "next/head";
import styles from "../styles/Slate.module.css";

import { createEditor, Editor, Transforms, Text } from "slate";

// Import slate components and react plugin
import { Slate, Editable, withReact } from "slate-react";

import { useState, useMemo, useCallback, useEffect } from "react";

export default function Home() {
  // Create a slate editor that won't change across renders.
  const editor = useMemo(() => withReact(createEditor()), []);
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
  const renderElement = useCallback((props) => {
    switch (props.element.type) {
      case "code":
        return <CodeElement {...props} />;
      default:
        return <DefaultElement {...props} />;
    }
  }, []);

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
      <Editable
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        onKeyDown={(event) => {
          console.log(event.key);

          if (event.key === "&") {
            event.preventDefault();
            editor.insertText("and ");
          }

          if (!event.ctrlKey) return;

          switch (event.key) {
            // When ` is pressed, code blocks!
            case "`": {
              event.preventDefault();

              // Determine whether any of the currently selected blocks are code blocks
              const [match] = Editor.nodes(editor, {
                match: (n) => n.type === "code",
              });

              Transforms.setNodes(
                editor,
                { type: match ? "paragraph" : "code" },
                { match: (n) => Editor.isBlock(editor, n) }
              );
              break;
            }

            // Ctrl-B bolds the text
            case "b": {
              event.preventDefault();

              // Determine if the currently selected node is bold
              const [match] = Editor.nodes(editor, {
                match: (n) => n.bold,
              });

              Transforms.setNodes(
                editor,
                { bold: !match },
                { match: (n) => Text.isText(n), split: true }
              );
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
