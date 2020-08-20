import Head from "next/head";
import Editor from "../components/drafteditor";
import styles from "../styles/Home.module.css";
import { useState } from "react";

function saveDoc(doc) {
  console.log(doc);
  alert("saved!!!");
}

export default function Home() {
  let [wordCount, setWordCount] = useState(0);

  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className={styles.editor}>
          <Editor />
        </div>
      </main>

      <footer className={styles.footer}>
        <p>{wordCount} words so far..</p>
      </footer>
    </div>
  );
}
