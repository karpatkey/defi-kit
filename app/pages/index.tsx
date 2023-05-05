import Image from "next/image"
import { IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google"
import { ArrowRight } from "@carbon/icons-react"
import Head from "next/head"

const ibmPlexSans = IBM_Plex_Sans({
  subsets: ["latin"],
  weight: ["400"],
  variable: "--font-sans",
  display: "swap",
})
const ibmPlexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "600"],
  variable: "--font-mono",
  display: "swap",
})

export default function Home() {
  return (
    <>
      <Head>
        <title>DeFi Presets API</title>
      </Head>
      <main
        className={`flex min-h-screen flex-col items-center justify-between p-24 ${ibmPlexSans.variable} ${ibmPlexMono.variable} font-sans`}
      >
        <div className="z-10 w-full max-w-5xl items-center justify-between font-mono text-sm lg:flex">
          <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
            GET&nbsp;
            <code className="font-mono font-bold">
              /eth:0x1234…cdef/allow/cowswap/swap?in=DAI&out=WETH
            </code>
          </p>
          <div className="fixed bottom-0 left-0 flex h-48 w-full items-end justify-center bg-gradient-to-t from-white via-white dark:from-black dark:via-black lg:static lg:h-auto lg:w-auto lg:bg-none">
            <a
              className="pointer-events-none flex place-items-center gap-2 p-8 lg:pointer-events-auto lg:p-0"
              href="https://www.karpatkey.com"
              target="_blank"
            >
              By{" "}
              <Image
                src="/karpatkey.png"
                alt="Karpatkey Logo"
                className="dark:invert"
                width={100}
                height={20}
                priority
              />
            </a>
          </div>
        </div>

        <div className="relative flex flex-col gap-5 place-items-center">
          <h1 className="text-6xl font-mono">DeFi Presets API</h1>
          <h3>
            <a
              href="https://github.com/gnosis/zodiac-modifier-roles"
              target="_blank"
              rel="noopener noreferrer"
              className="underline decoration-dashed underline-offset-2 decoration-1"
            >
              Zodiac Roles
            </a>{" "}
            permissions curated for safe interaction with DeFi protocols
          </h3>
        </div>

        <div className="mb-32 grid text-center lg:mb-0 lg:grid-cols-4 lg:text-left">
          <a
            href="/learn"
            className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          >
            <h2 className="mb-3 text-2xl font-mono">
              Learn{" "}
              <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                <ArrowRight />
              </span>
            </h2>
            <p className="m-0 max-w-[30ch]">
              Understand use cases and basic concepts of the API.
            </p>
          </a>

          <a
            href="/docs"
            className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
            target="_blank"
          >
            <h2 className="mb-3 text-2xl font-mono">
              Docs{" "}
              <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                <ArrowRight />
              </span>
            </h2>
            <p className="m-0 max-w-[30ch]">
              View all API endpoints and try them out right from your browser.
            </p>
          </a>

          <a
            href="https://www.karpatkey.com/contact"
            className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
            target="_blank"
          >
            <h2 className="mb-3 text-2xl font-mono">
              Support{" "}
              <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                <ArrowRight />
              </span>
            </h2>
            <p className="m-0 max-w-[30ch]">
              Contact us for support on adopting safe treasury management
              practices.
            </p>
          </a>

          <a
            href="https://github.com/gnosis/defi-presets"
            className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
            target="_blank"
            rel="noopener noreferrer"
          >
            <h2 className="mb-3 text-2xl font-mono">
              Contribute{" "}
              <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
                <ArrowRight />
              </span>
            </h2>
            <p className="m-0 max-w-[30ch]">
              Help us improve the API by adding adapters for more protocols.
            </p>
          </a>
        </div>
      </main>
    </>
  )
}
