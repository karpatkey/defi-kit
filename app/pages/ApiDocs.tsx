import type { NextPage } from "next"
import dynamic from "next/dynamic"
import "swagger-ui-react/swagger-ui.css"

const SwaggerUI = dynamic(() => import("swagger-ui-react"), { ssr: false })

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
