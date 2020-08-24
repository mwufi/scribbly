// @refresh reset
import Head from "next/head";
import styles from "../styles/Slate.module.css";
import Editor from "../components/slate/editor";
import classNames from "classnames";
import { useState } from "react";

export default function Home() {
  const [mode, setMode] = useState("dark");
  const [wordCount, setWordCount] = useState({
    words: 0,
    characters: 0,
    _visited: 0,
  });

  let f = mode === "dark" ? styles.editor_dark : null;

  return (
    <div
      style={{
        width: "100%",
        backgroundColor: mode === "dark" ? "#111" : "white",
        transition: "all 0.3s ease-in",
      }}
    >
      <div className={styles.container}>
        <div
          className={styles.wordCount}
        >{`${wordCount.words} words, ${wordCount._visited}`}</div>

        <button
          className={styles.darkmodeButton}
          onClick={() => setMode(mode === "dark" ? "light" : "dark")}
        >
          {mode === "dark" ? "light" : "dark"}
        </button>
        <Editor
          className={classNames(styles.editor, f)}
          setWordCount={setWordCount}
        />
      </div>
    </div>
  );
}
