import { useEffect, useRef } from "react";

const { EditorState, Plugin, PluginKey } = require("prosemirror-state");
const { EditorView } = require("prosemirror-view");
const { Schema, DOMParser } = require("prosemirror-model");
const { schema } = require("prosemirror-schema-basic");
const { addListNodes } = require("prosemirror-schema-list");
const { exampleSetup } = require("prosemirror-example-setup");
const { keymap } = require("prosemirror-keymap");

// Mix the nodes from prosemirror-schema-list into the basic schema to
// create a schema with list support.
const mySchema = new Schema({
  nodes: addListNodes(schema.spec.nodes, "paragraph block*", "block"),
  marks: schema.spec.marks,
});

const reactPropsKey = new PluginKey("reactProps");

function wordCount(str) {
  str = str.replace(/\s\s+/g, " ");
  return str.trim().split(" ").length;
}

function reactProps(initialProps, view, setWordCount) {
  return new Plugin({
    key: reactPropsKey,
    state: {
      init: () => initialProps,
      apply: (tr, prev) => {
        if (view.current) {
          const currentText = view.current.state.doc.textContent;
          setWordCount(wordCount(currentText));
        }
        return tr.getMeta(reactPropsKey) || prev;
      },
    },
  });
}

export default function Editor(props) {
  const viewHost = useRef();
  const view = useRef(null);
  const { setWordCount, onSave } = props;

  useEffect(() => {
    // initial render
    const state = EditorState.create({
      doc: DOMParser.fromSchema(mySchema).parse("hello world!"),
      plugins: exampleSetup({ schema: mySchema }).concat(
        reactProps(props, view, setWordCount)
      ),
    });
    view.current = new EditorView(viewHost.current, { state });

    // keymaps
    window.addEventListener("keydown", (e) => {
      // cmd-s to save
      if (e.metaKey && e.key == "s") {
        e.preventDefault();

        let state = view.current.state;
        const { onSave } = reactPropsKey.getState(state);
        onSave(state.doc.toJSON());

        return false;
      }

      // cmd-k to update word count
      if (e.metaKey && e.key == "k") {
        e.preventDefault();

        let state = view.current.state;
        const currentText = state.doc.textContent;
        setWordCount(wordCount(currentText));

        return false;
      }
    });

    return () => view.current.destroy();
  }, []);

  useEffect(() => {
    console.log("render");

    // every render
    const tr = view.current.state.tr.setMeta(reactPropsKey, props);
    view.current.dispatch(tr);

    console.log(tr.doc.content.size);
    console.log(view.current.state.doc.toString());
  });

  return (
    <div style={{ minWidth: "1000px" }}>
      <div id="editor" ref={viewHost} />
    </div>
  );
}
