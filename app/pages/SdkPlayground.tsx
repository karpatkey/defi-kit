import Playground from "@/components/Playground"
import type { NextPage } from "next"
import dynamic from "next/dynamic"

const SdkPlayground: NextPage = () => {
  return (
    <>
      <div className="playground-wrapper">
        <Playground />
      </div>
      <style jsx global>{`
        .playground-wrapper {
          position: fixed;
          left: 0;
          height: calc(100vh - 64px - 140px);
          width: 100vw;
        }
      `}</style>
    </>
  )
}

export default SdkPlayground
