// @refresh reset
import Head from "next/head";
import styles from "../styles/Slate.module.css";
import Editor from "../components/slate/editor";
import { useState } from "react";

export default function Home() {
  const [wordCount, setWordCount] = useState({
    words: 0,
    characters: 0,
    _visited: 0,
  });

  return (
    <div className={styles.container}>
      <div
        className={styles.wordCount}
      >{`${wordCount.words} words, ${wordCount._visited}`}</div>
      <Editor className={styles.editor} setWordCount={setWordCount} />
    </div>
  );
}
