import { defineConfig } from "cypress";

export default defineConfig({
  component: {
    specPattern: "src/**/*.spec.{ts,tsx}",
    devServer: {
      framework: "react",
      bundler: "vite",
    },
  },
});
