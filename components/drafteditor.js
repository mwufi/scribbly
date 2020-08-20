import { Editor, EditorState, convertFromRaw } from "draft-js";

function MyEditor() {
  const [editorState, setEditorState] = React.useState(
    EditorState.createWithContent(emptyContentState)
  );

  const editor = React.useRef(null);

  function focusEditor() {
    editor.current.focus();
  }

  React.useEffect(() => {
    focusEditor();
  }, []);

  return (
    <div onClick={focusEditor} style={{padding: 10}}>
      <Editor
        editorKey="foobaz"
        placeholder="Write something!"
        ref={editor}
        editorState={editorState}
        onChange={(editorState) => setEditorState(editorState)}
      />
    </div>
  );
}

const emptyContentState = convertFromRaw({
  entityMap: {},
  blocks: [
    {
      text: "",
      key: "foo",
      type: "unstyled",
      entityRanges: [],
    },
  ],
});

export default MyEditor;
