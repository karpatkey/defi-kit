import type { NextPage } from "next"
import dynamic from "next/dynamic"
import "swagger-ui-react/swagger-ui.css"
import type { SwaggerUIProps } from "swagger-ui-react"

const SwaggerUI = dynamic<SwaggerUIProps>(
  () => import("swagger-ui-react") as any,
  {
    ssr: false,
  }
)

const ApiDocs: NextPage = () => {
  // Serve Swagger UI with our OpenAPI schema
  return (
    <SwaggerUI url="/api/v1/openapi.json" plugins={[DisableAuthorizePlugin]} />
  )
}

export default ApiDocs

const DisableAuthorizePlugin = function () {
  return {
    wrapComponents: {
      authorizeBtn: () => () => null,
    },
  }
}
