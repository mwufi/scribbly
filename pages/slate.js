// @refresh reset
import Head from "next/head";
import styles from "../styles/Slate.module.css";
import Editor from "../components/slate/editor";

export default function Home() {
  return (
    <div className={styles.container}>
      <Editor className={styles.editor} />
    </div>
  );
}
