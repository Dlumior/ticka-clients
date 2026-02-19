import { defineConfig } from "@hey-api/openapi-ts";

export default defineConfig({
  input: "http://localhost:8000/api/schema/",
  output: {
    format: "prettier",
    lint: "eslint",
    path: "./src/generated",
  },
  plugins: [
    {
      name: "zod",
    },
  ],
});
