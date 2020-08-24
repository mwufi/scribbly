// @refresh reset
import { createEditor, Editor, Transforms, Text, Node } from "slate";

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

  const defaultWordCount = (wc) => console.log(`${wc} words`);
  const setWordCount = props.setWordCount || defaultWordCount;

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

  useEffect(() => {
    // ~4ms
    calculateWordCount(editor);
  }, [value]);

  // custom elements!
  const renderElement = useCallback(
    (props) => <MarkdownElement {...props} />,
    []
  );

  const renderLeaf = useCallback((props) => {
    return <Leaf {...props} />;
  }, []);

  const calculateWordCount = (editor) => {
    // console.log("calculating word count...");
    let wc = 0;
    let cc = 0;
    let nodesVisited = 0;
    for (const [node, path] of Node.texts(editor)) {
      let s = Node.string(node) || "";
      let words = s.match(/\w+/g) || [];
      wc += words.length;
      cc += s.length;
      nodesVisited += 1;
    }
    setWordCount({
      words: wc,
      characters: cc,
      _visited: nodesVisited,
    });
  };

  const saveChanges = (v) => {
    if (v === value) return;

    setValue(v);

    // save value to Local Storage - <1ms
    const content = JSON.stringify(v);
    localStorage.setItem("content", content);
  };

  return (
    <Slate editor={editor} value={value} onChange={saveChanges}>
      <Editable
        renderElement={renderElement}
        renderLeaf={renderLeaf}
        className={props.className}
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
