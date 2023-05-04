/* eslint jsdoc/no-missing-syntax: 0 */
import { withSwagger } from "next-swagger-doc"

const swaggerHandler = withSwagger({
  definition: {
    openapi: "3.0.0",
    info: {
      title: "DeFi Presets API",
      version: "1.0.0",
    },
  },
  apiFolder: "pages/api",
})

export default swaggerHandler()
