import dynamic from "next/dynamic"
import type { NextPage } from "next"

const Playground = dynamic(() => import("@/components/Playground"), {
  ssr: false,
  loading: () => (
    <div>
      <div id="loader">
        <p id="loading-message" role="status">
          Loading playground...
        </p>
      </div>
    </div>
  ),
})

const SdkPlayground: NextPage = () => {
  return (
    <>
      <div className="playground-wrapper">
        <Playground />
      </div>
      <style jsx global>{`
        html,
        body {
          overflow: hidden;
        }

        .nextra-content {
          min-height: calc(100vh - 64px - 140px);
        }
      `}</style>
    </>
  )
}

export default SdkPlayground
