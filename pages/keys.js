import Head from "next/head";
import styles from "../styles/Home.module.css";
import { useEffect, useState } from "react";

export default function Home() {
  const [key, setKey] = useState("");
  useEffect(() => {
    window.addEventListener("keydown", (e) => {
      if (e.metaKey && e.key != "Meta") {
        e.preventDefault();
        setKey("Meta-" + e.key);
        return false;
      }
      setKey(e.key);
    });
  }, []);
  return (
    <div className={styles.container}>
      <Head>
        <title>Create Next App</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>{key || "No key pressed"}</h1>

        <p className={styles.description}>
          Get started by editing{" "}
          <code className={styles.code}>pages/keys.js</code>
        </p>
      </main>
    </div>
  );
}
