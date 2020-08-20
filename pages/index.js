import Head from "next/head";
import Editor from "../components/editor";
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
        <h1 className={styles.title}>
          Welcome to <a href="https://nextjs.org">Next.js!</a>
        </h1>

        <p className={styles.description}>
          Get started by editing{" "}
          <code className={styles.code}>pages/index.js</code>
        </p>

        <Editor setWordCount={setWordCount} onSave={saveDoc} />
      </main>

      <footer className={styles.footer}>
        <p>{wordCount} words so far..</p>
      </footer>
    </div>
  );
}
