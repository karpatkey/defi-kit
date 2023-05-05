import { Html, Head, Main, NextScript } from "next/document"

export default function Document() {
  return (
    <Html lang="en">
      <Head>
        <meta
          content="Permission presets for safe interactions with DeFi protocols"
          name="description"
        />
        <link href="/favicon.png" rel="icon" type="image/png"></link>
        <link href="/avatar.png" rel="apple-touch-icon"></link>
      </Head>
      <body>
        <Main />
        <NextScript />
      </body>
    </Html>
  )
}
