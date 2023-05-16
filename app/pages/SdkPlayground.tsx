import { EditorProps } from "@monaco-editor/react"
import type { NextPage } from "next"
import dynamic from "next/dynamic"

const MonacoEditor = dynamic<EditorProps>(
  () => import("@monaco-editor/react") as any,
  {
    ssr: false,
  }
)

const SdkPlayground: NextPage = () => {
  return (
    <>
      <div className="monaco-wrapper">
        <MonacoEditor
          value="default"
          width="100vw"
          height="calc(100vh - 64px - 140px)"
          language="typescript"
          options={{ minimap: { enabled: false } }}
          onChange={(newValue) => {
            console.log({ newValue })
          }}
        />
      </div>
      <style jsx global>{`
        .nextra-content {
          min-height: 0 !important;
          height: calc(100vh - 64px - 140px) !important;
        }
        .monaco-wrapper {
          position: fixed;
          left: 0;
          height: calc(100vh - 64px - 140px);
        }
      `}</style>
    </>
  )
}

export default SdkPlayground
