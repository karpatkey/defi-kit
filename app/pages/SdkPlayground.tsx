import { EditorProps } from "@monaco-editor/react"
import type { NextPage } from "next"
import dynamic from "next/dynamic"
import SlitScreen from "../components/SplitScreen"

const MonacoEditor = dynamic<EditorProps>(
  () => import("@monaco-editor/react") as any,
  {
    ssr: false,
  }
)

const SdkPlayground: NextPage = () => {
  return (
    <>
      <div className="playground-wrapper">
        <SlitScreen
          left={
            <MonacoEditor
              value="default"
              width="100%"
              height="100%"
              language="typescript"
              options={{ minimap: { enabled: false } }}
              onChange={(newValue) => {
                console.log({ newValue })
              }}
            />
          }
          right={
            <MonacoEditor
              value="default"
              width="100%"
              height="100%"
              language="typescript"
              options={{ minimap: { enabled: false } }}
              onChange={(newValue) => {
                console.log({ newValue })
              }}
            />
          }
        />
      </div>
      <style jsx global>{`
        .nextra-content {
          min-height: 0 !important;
          height: calc(100vh - 64px - 140px) !important;
        }
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
