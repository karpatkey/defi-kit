import Image from "next/image"
import { ArrowRight } from "@carbon/icons-react"

import styles from "@/styles/Home.module.css"

const Home = () => (
  <main className={styles.main}>
    <div className={styles.description}>
      <p>
        GET&nbsp;
        <code className={styles.code}>
          /eth:0x1234…cdef/manager/allow/cowswap/swap?sell=DAI&buy=WETH
        </code>
      </p>
      <div>
        <a
          href="https://www.karpatkey.com"
          target="_blank"
          rel="noopener noreferrer"
        >
          By{" "}
          <Image
            src="/karpatkey.png"
            alt="karpatkey Logo"
            className={styles.logo}
            width={100}
            height={20}
            priority
          />
        </a>
      </div>
    </div>

    <div className={styles.center}>
      <h1 className={styles.title}>DeFi Kit</h1>
      <h3 className={styles.subtitle}>
        <a
          href="https://github.com/gnosis/zodiac-modifier-roles"
          target="_blank"
          rel="noopener noreferrer"
        >
          Zodiac Roles
        </a>{" "}
        permissions curated for safe interaction with DeFi protocols
      </h3>
    </div>

    <div className={styles.grid}>
      <a href="/learn" className={styles.card}>
        <h2>
          Learn{" "}
          <span>
            <ArrowRight />
          </span>
        </h2>
        <p>Understand the ideas behind it and learn how to use DeFi Kit</p>
      </a>

      <a href="/sdk-playground" className={styles.card}>
        <h2>
          SDK{" "}
          <span>
            <ArrowRight />
          </span>
        </h2>
        <p>Mix and match permissions using the TypeScript SDK playground</p>
      </a>

      <a href="/api-docs" className={styles.card}>
        <h2>
          API{" "}
          <span>
            <ArrowRight />
          </span>
        </h2>
        <p>View all API endpoints and try them out right from your browser</p>
      </a>

      <a
        href="https://github.com/karpatkey/defi-kit"
        className={styles.card}
        target="_blank"
        rel="noopener noreferrer"
      >
        <h2>
          Contribute{" "}
          <span>
            <ArrowRight />
          </span>
        </h2>
        <p>Help us improve DeFi Kit by adding adapters for more protocols</p>
      </a>
    </div>
  </main>
)

export default Home
