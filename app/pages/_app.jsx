import { IBM_Plex_Sans, IBM_Plex_Mono } from "next/font/google"
import "../styles/globals.css"
import "../components/Playground/styles.scss"

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

// This default export is required in a new `pages/_app.js` file.
export default function MyApp({ Component, pageProps }) {
  return (
    <>
      <style jsx global>{`
        * {
          --font-sans: ${ibmPlexSans.style.fontFamily};
          --font-mono: ${ibmPlexMono.style.fontFamily};
        }
        html {
          font-family: var(--font-sans) !important;
        }
      `}</style>
      <Component {...pageProps} />
    </>
  )
}
