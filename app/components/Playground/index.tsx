import React, { useEffect } from "react"
import ReactDOM from "react-dom"
import { getExampleSourceCode, setupPlayground } from "playground"
// import * as main from "monaco-editor"

// import { RenderExamples } from "../components/ShowExamples"

// This gets set by the playground
declare const playground: ReturnType<typeof setupPlayground>

const withPrefix = (str: string) => str
const i = (str: string) => str

let hasLocalStorage = false
try {
  hasLocalStorage = typeof localStorage !== "undefined"
} catch (error) {}

// TODO
const getPlaygroundUrls = () => {
  // This will get switched out in CI by:
  // scripts/cacheBustPlayground.mjs

  // This should always be a single slash string in the codebase: "/"
  const commitPrefix = "/"

  return {
    sandboxRoot: `https://www.typescriptlang.org/js/sandbox`,
    playgroundRoot: `/js${commitPrefix}playground`,
    playgroundWorker: `/js${commitPrefix}playground-worker/index.js`,
  }
}

const Playground: React.FC<{}> = () => {
  useEffect(() => {
    if (!document.getElementById("monaco-editor-embed")) return
    if (document.getElementById("monaco-editor-embed")!.childElementCount > 0) {
      return console.log("Playground already loaded")
    }

    // Detect if you've left the playground and come back via the back button, which will force
    // a page reload to ensure the playground is full set up
    let leftPlayground = false
    window.addEventListener("popstate", (event) => {
      const onPlayground =
        document.location.pathname.endsWith("/sdk-playground/") ||
        document.location.pathname.endsWith("/sdk-playground")
      if (leftPlayground && onPlayground) {
        document.location.reload()
      } else if (!leftPlayground && !onPlayground) {
        leftPlayground = true
      }
    })

    if (!hasLocalStorage) {
      document.getElementById("loading-message")!.innerText =
        "Cannot load the Playground with storage disabled in your browser"
      return
    }

    // @ts-ignore - so the playground handbook can grab this data
    window.playgroundHandbookTOC = { docs: [] }
    // @ts-ignore - so the config options can use localized descriptions
    window.optionsSummary = []
    // @ts-ignore - for React-based plugins
    window.react = React
    // @ts-ignore - for React-based plugins
    window.reactDOM = ReactDOM
    // @ts-ignore - so that plugins etc can use i18n
    // window.i = i

    const getLoaderScript = document.createElement("script")
    getLoaderScript.src = withPrefix(
      "https://www.typescriptlang.org/js/vs.loader.js"
    )
    getLoaderScript.async = true
    getLoaderScript.onload = async () => {
      const params = new URLSearchParams(location.search)

      let tsVersionParam = params.get("ts")
      // handle the nightly lookup
      if (
        (tsVersionParam && tsVersionParam === "Nightly") ||
        tsVersionParam === "next"
      ) {
        // Avoids the CDN to doubly skip caching
        const nightlyLookup = await fetch(
          "https://tswebinfra.blob.core.windows.net/indexes/next.json",
          { cache: "no-cache" }
        )
        const nightlyJSON = await nightlyLookup.json()
        tsVersionParam = nightlyJSON.version
      }

      // Somehow people keep trying -insiders urls instead of -dev - maybe some tooling I don't know?
      if (tsVersionParam && tsVersionParam.includes("-insiders.")) {
        tsVersionParam = tsVersionParam.replace("-insiders.", "-dev.")
      }

      const latestRelease = "5.0.4"
      const tsVersion = tsVersionParam || latestRelease

      // Because we can reach to localhost ports from the site, it's possible for the locally built compiler to
      // be hosted and to power the editor with a bit of elbow grease.
      const useLocalCompiler = tsVersion === "dev"
      const devIsh = ["pr", "dev"]
      const version = devIsh.find((d) => tsVersion.includes(d)) ? "dev" : "min"
      const urlForMonaco = useLocalCompiler
        ? "http://localhost:5615/dev/vs"
        : `https://typescript.azureedge.net/cdn/${tsVersion}/monaco/${version}/vs`

      // Make a quick HEAD call for the main monaco editor for this version of TS, if it
      // bails then give a useful error message and bail.
      const nightlyLookup = await fetch(
        urlForMonaco + "/editor/editor.main.js",
        { method: "HEAD" }
      )
      if (!nightlyLookup.ok) {
        document
          .querySelectorAll<HTMLDivElement>(".lds-grid div")
          .forEach((div) => {
            div.style.backgroundColor = "red"
            div.style.animation = ""
            div.style.webkitAnimation = ""
          })

        document.getElementById(
          "loading-message"
        )!.innerHTML = `This version of TypeScript <em>(${tsVersion?.replace(
          /</g,
          "-"
        )})</em><br/>has not been prepared for the Playground<br/><br/>Try <a href='/sdk-playground?ts=${latestRelease}${
          document.location.hash
        }'>${latestRelease}</a> or <a href="/sdk-playground?ts=next${
          document.location.hash
        }">Nightly</a>`
        return
      }

      // Allow prod/staging builds to set a custom commit prefix to bust caches
      const { sandboxRoot, playgroundRoot, playgroundWorker } =
        getPlaygroundUrls()

      // @ts-ignore
      const re: any = global.require
      re.config({
        paths: {
          vs: urlForMonaco,
          "typescript-sandbox": sandboxRoot,
          //   "typescript-playground": playgroundRoot,
          //   unpkg: "https://unpkg.com",
          //   local: "http://localhost:5000",
        },
        ignoreDuplicateModules: ["vs/editor/editor.main"],
        catchError: true,
        onError: function (err: unknown) {
          if (document.getElementById("loading-message")) {
            document.getElementById("loading-message")!.innerText =
              "Cannot load the Playground in this browser"
            console.error(
              "Error setting up monaco/sandbox/playground from the JS, this is likely that you're using a browser which monaco doesn't support."
            )
          } else {
            console.error(
              "Caught an error which is likely happening during initializing a playground plugin:"
            )
          }
          console.error(err)
        },
      })

      re(
        [
          "vs/editor/editor.main",
          "vs/language/typescript/tsWorker",
          "typescript-sandbox/index",
          //   "typescript-playground/index",
        ],
        async (
          main: typeof import("monaco-editor"),
          tsWorker: any,
          sandbox: typeof import("@typescript/sandbox")
          //   playground: typeof import("playground")
        ) => {
          // Importing "vs/language/typescript/tsWorker" will set ts as a global
          const ts = (global as any).ts || tsWorker.typescript
          const isOK = main && ts
          if (isOK) {
            document
              .getElementById("loader")!
              .parentNode?.removeChild(document.getElementById("loader")!)
          } else {
            console.error("Error setting up all the 4 key dependencies")
            console.error("main", !!main, "ts", !!ts, "sandbox", !!sandbox)
            document.getElementById("loading-message")!.innerText =
              "Cannot load the Playground in this browser, see logs in console."
            return
          }

          // Set the height of monaco to be either your window height or 600px - whichever is smallest
          const container = document.getElementById("playground-container")!
          container.style.display = "flex"
          const height = Math.max(window.innerHeight, 600)
          // container.style.height = `${
          //   height - Math.round(container.getClientRects()[0].top) - 18
          // }px`

          const extension = (
            !!params.get("useJavaScript")
              ? "js"
              : params.get("filetype") || "ts"
          ) as any
          const workerPath = params.get("multiFile")
            ? `${
                document.location.origin + playgroundWorker
              }?filetype=${extension}`
            : undefined

          // Create the sandbox
          const sandboxEnv = await sandbox.createTypeScriptSandbox(
            {
              text:
                localStorage.getItem("sandbox-history") ||
                getExampleSourceCode("default"),
              domID: "monaco-editor-embed",
              filetype: extension,
              acquireTypes: !localStorage.getItem("disable-ata"),
              supportTwoslashCompilerOptions: true,
              customTypeScriptWorkerPath: workerPath,
              monacoSettings: {
                fontFamily: "var(--font-mono)",
                fontLigatures: true,
              },
              compilerOptions: {
                module: main.languages.typescript.ModuleKind.System,
                target: main.languages.typescript.ScriptTarget.ES2017,
              },
            },
            main,
            ts
          )

          const playgroundConfig = {
            lang: "en",
            prefix: withPrefix("/"),
            supportCustomPlugins: true,
          }

          setupPlayground(sandboxEnv, main, playgroundConfig, i as any, React)

          // Dark mode faff
          const darkModeEnabled =
            document.documentElement.classList.contains("dark-theme")
          if (darkModeEnabled) {
            sandboxEnv.monaco.editor.setTheme("sandbox-dark")
          }

          sandboxEnv.editor.focus()
          sandboxEnv.editor.layout()
        }
      )
    }

    document.body.appendChild(getLoaderScript)

    return () => {
      window.location.reload()
    }
  }, [])

  return (
    <div>
      {/** This is the top nav, which is outside of the editor  */}

      <div id="loader">
        <div className="lds-grid">
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
          <div></div>
        </div>
        <p id="loading-message" role="status">
          Initialing playground
        </p>
      </div>
      <div id="playground-container" style={{ display: "none" }}>
        <div id="editor-container">
          <div id="story-container" style={{ display: "none" }}></div>
          <div id="editor-toolbar" className="navbar-sub">
            <ul>
              <li id="versions" className="dropdown">
                <a
                  href="#"
                  data-toggle="dropdown"
                  role="button"
                  aria-haspopup="menu"
                  aria-expanded="false"
                  aria-controls="versions-dropdown"
                  id="versions-button"
                >
                  Downloading version... <span className="caret" />
                </a>
                <ul
                  className="dropdown-menu versions"
                  id="versions-dropdown"
                  aria-labelledby="versions-button"
                ></ul>
              </li>
              <li>
                <a id="run-button" href="#" role="button">
                  Run
                </a>
              </li>

              <li className="dropdown">
                <a
                  href="#"
                  id="exports-dropdown"
                  className="dropdown-toggle"
                  data-toggle="dropdown"
                  role="button"
                  aria-haspopup="true"
                  aria-expanded="false"
                  aria-controls="export-dropdown-menu"
                >
                  Export <span className="caret"></span>
                </a>
                <ul className="dropdown-menu" id="export-dropdown-menu">
                  <li>
                    <a
                      href="#"
                      onClick={() => playground.exporter.openInVSCodeDev()}
                      aria-label="Open in VSCode TS Playground"
                    >
                      Open in VSCode TS Playground
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      onClick={() =>
                        playground.exporter.openProjectInCodeSandbox()
                      }
                      aria-label="Open in CodeSandbox"
                    >
                      Open in CodeSandbox
                    </a>
                  </li>
                  <li>
                    <a
                      href="#"
                      onClick={() =>
                        playground.exporter.openProjectInStackBlitz()
                      }
                      aria-label="Open in StackBlitz"
                    >
                      Open in StackBlitz
                    </a>
                  </li>
                </ul>
              </li>

              <li className="dropdown">
                <a
                  href="#"
                  id="exports-dropdown"
                  className="dropdown-toggle"
                  data-toggle="dropdown"
                  role="button"
                  aria-haspopup="true"
                  aria-expanded="false"
                  aria-controls="export-dropdown-menu"
                >
                  Examples <span className="caret"></span>
                </a>
                <ul className="dropdown-menu">
                  <li>
                    <a
                      href="#example/default"
                      onClick={(ev) => {
                        ev.preventDefault()
                        ;(window as any).disableSaveOnType = true
                        window.location.hash = "#example/default"
                        location.reload()
                      }}
                    >
                      Compose permissions and update role
                    </a>
                  </li>
                  <li>
                    <a
                      href="#example/apply"
                      onClick={(ev) => {
                        ev.preventDefault()
                        ;(window as any).disableSaveOnType = true
                        window.location.hash = "#example/apply"
                        location.reload()
                      }}
                    >
                      Apply permissions to a role
                    </a>
                  </li>
                </ul>
              </li>

              <li>
                <a id="share-button" href="#" role="button">
                  Share
                </a>
              </li>
            </ul>

            <ul className="right">
              <li>
                <a id="sidebar-toggle" aria-label="Hide Sidebar" href="#">
                  &#x21E5;
                </a>
              </li>
            </ul>
          </div>
          {/** This is the div which monaco is added into - careful, lots of changes happen here at runtime **/}
          <div id="monaco-editor-embed" />
        </div>
      </div>
    </div>
  )
}

export default Playground
