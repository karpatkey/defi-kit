import Playground from "@/components/Playground"
import type { NextPage } from "next"

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
