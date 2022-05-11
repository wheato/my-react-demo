import type { NextPage } from 'next'
import Head from 'next/head'
import styles from '../../styles/Home.module.css'

const Home: NextPage = () => {
  return (
    <div className={styles.container}>
      <Head>
        <title>React Demo - Table</title>
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <h1 className={styles.title}>
          There are some table examples.
        </h1>

        <p className={styles.description}>
          The Code has open source on{' '}
          <a href="https://github.com/wheato/my-react-demo/tree/main/pages">Github</a>.
        </p>

        <div className={styles.grid}>
          <a href="./tables/normal" className={styles.card}>
            <h2>Normal &rarr;</h2>
            <p>Basic usage with mui-table component.</p>
          </a>

          <a href="./tables/virtual" className={styles.card}>
            <h2>Virtualized &rarr;</h2>
            <p>Virtualize table with react-virtualized.</p>
          </a>

          <a
            href="./tables/worker"
            className={styles.card}
          >
            <h2>Web Worker &rarr;</h2>
            <p>Build a virtualize table with web worker.</p>
          </a>

          <a
            href="./tables/wasm"
            className={styles.card}
          >
            <h2>WebAssembly &rarr;</h2>
            <p>Build a high performace table with webassembly.</p>
          </a>
        </div>
      </main>

      <footer className={styles.footer}>
        <a
          href="https://wheato.github.io"
          target="_blank"
          rel="noopener noreferrer"
        >
          Powered by{' '}
          @wheatowu
        </a>
      </footer>
    </div>
  )
}

export default Home
